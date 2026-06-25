/**
 * Reality Mechanics Atlas — read-only remote MCP server (Cloudflare Worker).
 *
 * Stateless. Reads the published machine-readable export from the Atlas site;
 * it never stores a second copy of the Atlas and never needs redeployment when
 * Atlas content changes. Streamable-HTTP MCP transport at POST /mcp.
 *
 *   manifest : {ATLAS_BASE}/ai/manifest.json        (fetched fresh, short TTL)
 *   index    : {ATLAS_BASE}/ai/current/index.json    (cached by atlasVersion)
 *   search   : {ATLAS_BASE}/ai/current/search.json    (cached by atlasVersion)
 *   entry    : {ATLAS_BASE}/ai/current/entries/<id>.json (immutable per version)
 */

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "reality-mechanics-atlas", version: "1.0.0" };
const MAX_QUERY = 200;
const SEARCH_MAX = 25, SEARCH_DEFAULT = 8;
const LIST_MAX = 200, LIST_DEFAULT = 50;
const MANIFEST_TTL = 30; // seconds
const ID_RE = /^[A-Za-z0-9._-]+$/;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id, Mcp-Protocol-Version",
};

class UpstreamError extends Error {}

const base = (env) => (env.ATLAS_BASE || "https://atlas.realitymechanics.nz").replace(/\/$/, "");

// ---- cached retrieval ----------------------------------------------------
async function fetchJson(url, ttl) {
  const res = await fetch(url, { cf: ttl ? { cacheTtl: ttl, cacheEverything: true } : { cacheTtl: 0 } });
  if (res.status === 404) { const e = new UpstreamError("not_found"); e.status = 404; throw e; }
  if (!res.ok) throw new UpstreamError(`upstream ${res.status}`);
  return res.json();
}

const versionedUrl = (url, version) => {
  const u = new URL(url);
  u.searchParams.set("atlasVersion", version);
  return u.toString();
};

async function cachedByVersion(url, version) {
  const cache = caches.default;
  const fetchUrl = versionedUrl(url, version);
  const key = new Request(`https://rm-mcp.cache/${encodeURIComponent(version)}/${encodeURIComponent(fetchUrl)}`);
  const hit = await cache.match(key);
  if (hit) return hit.json();
  const data = await fetchJson(fetchUrl, 86400);
  await cache.put(key, new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=86400" },
  }));
  return data;
}

const loadManifest = (env) => fetchJson(`${base(env)}/ai/manifest.json`, MANIFEST_TTL);
const loadIndex = (env, v) => cachedByVersion(`${base(env)}/ai/current/index.json`, v);
const loadSearch = (env, v) => cachedByVersion(`${base(env)}/ai/current/search.json`, v);
async function loadEntry(env, v, fileId) {
  return cachedByVersion(`${base(env)}/ai/current/entries/${fileId}.json`, v);
}

// ---- deterministic search ------------------------------------------------
const norm = (s) => (s || "").toLowerCase();
const tokens = (s) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

function asSet(v) {
  if (v == null) return null;
  return new Set((Array.isArray(v) ? v : [v]).map((x) => norm(String(x))));
}

function passesFilters(e, f) {
  if (f.status && !f.status.has(norm(e.status))) return false;
  if (f.type && !f.type.has(norm(e.type))) return false;
  if (f.order && !f.order.has(norm(e.order))) return false;
  if (f.branch && !f.branch.has(norm(e.branch))) return false;
  if (f.tag && !(e.tags || []).some((t) => f.tag.has(norm(t)))) return false;
  if (f.updatedAfter) { if (!e.updated || e.updated < f.updatedAfter) return false; }
  return true;
}

function scoreEntry(e, qTokens, qRaw) {
  let score = 0;
  const matched = new Set();
  const title = norm(e.title);
  if (title === qRaw) { score += 100; matched.add("title"); }
  else if (title.startsWith(qRaw)) { score += 50; matched.add("title"); }
  else if (qRaw && title.includes(qRaw)) { score += 30; matched.add("title"); }
  const titleToks = new Set(tokens(e.title));
  const aliasToks = new Set((e.aliases || []).flatMap(tokens));
  const headToks = new Set((e.headings || []).flatMap(tokens));
  const tagToks = new Set((e.tags || []).flatMap(tokens));
  const metaToks = new Set([e.status, e.type, e.order, e.branch].flatMap(tokens));
  const bodyToks = tokens(e.text);
  const bodySet = new Set(bodyToks);
  let bodyHits = 0;
  for (const t of qTokens) {
    if (titleToks.has(t)) { score += 12; matched.add("title"); }
    if (aliasToks.has(t)) { score += 10; matched.add("aliases"); }
    if (headToks.has(t)) { score += 8; matched.add("headings"); }
    if (tagToks.has(t)) { score += 8; matched.add("tags"); }
    if (metaToks.has(t)) { score += 6; matched.add("metadata"); }
    if (bodySet.has(t)) { score += 5; matched.add("content"); bodyHits++; }
    else if (bodyToks.some((b) => b.startsWith(t) && b !== t)) { score += 2; matched.add("content"); }
  }
  return { score, matched: [...matched], bodyHits };
}

function searchEntries(entries, query, filters, limit) {
  const qRaw = norm(query).trim();
  const qTokens = tokens(query);
  const out = [];
  for (const e of entries) {
    if (!passesFilters(e, filters)) continue;
    const { score, matched } = scoreEntry(e, qTokens, qRaw);
    if (score > 0) out.push({ e, score, matched });
  }
  out.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title));
  return out.slice(0, limit);
}

// ---- structure parsing (relation-first) ----------------------------------
// Body-section parser: fallback only — used when entry has no pre-built structure.
const sectionLinks = (content, name) => {
  const m = (content || "").match(new RegExp(`\\n##\\s+${name}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i"));
  if (!m) return [];
  return [...new Set([...m[1].matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)].map((x) => x[1].trim()))];
};
const parseStructure = (content) => ({
  holds: sectionLinks(content, "Holds"), pairs: sectionLinks(content, "Pairs"),
  traces: sectionLinks(content, "Traces"), nests: sectionLinks(content, "Nests"),
  reads: sectionLinks(content, "Reads"), carries: sectionLinks(content, "Carries"),
});

// Resolve pre-built structure IDs (from build) to {id, title, publicUrl} objects.
// Falls back to title-based resolution for entries that pre-date build-time structure.
const resolveStructure = (full, byId, byTitle) => {
  if (full.structure) {
    // Canonical path: structure was resolved at build time from frontmatter conditions.
    const fromId = (ids) => (ids || [])
      .filter((id) => id !== full.id)
      .map((id) => { const e = byId.get(id); return e ? { id: e.id, title: e.title, publicUrl: e.publicUrl } : { id, unresolved: true }; });
    return {
      holds: fromId(full.structure.holds),
      traces: fromId(full.structure.traces),
      carries: fromId(full.structure.carries),
      pairs: fromId(full.structure.pairs),
      nests: fromId(full.structure.nests),
      reads: fromId(full.structure.reads),
      _source: "frontmatter",
    };
  }
  // Fallback: parse body sections (legacy builds or notes without conditions blocks).
  const s = parseStructure(full.content);
  const fromTitle = (titles) => titles.filter((t) => t !== full.title)
    .map((t) => { const e = byTitle.get(t); return e ? { id: e.id, title: t, publicUrl: e.publicUrl } : { title: t, unresolved: true }; });
  return {
    holds: fromTitle(s.holds),
    traces: fromTitle(s.traces),
    carries: fromTitle(s.carries),
    pairs: fromTitle(s.pairs),
    nests: fromTitle(s.nests),
    reads: fromTitle(s.reads),
    _source: "body_fallback",
  };
};
const READ_AS = "The Atlas is a dependency-ordered reasoning system carried by structure, not a dictionary. `structure` is primary: holds/traces are what this depends on (trace them back); carries is what it opens; pairs is its contrast; nests is membership. Follow the relations — do not read the term as a standalone definition.";
const AI_ENTRY_PROTOCOL = {
  title: "AI Entry Protocol",
  purpose: "Orient an AI participant before search so the Atlas is entered as a dependency-ordered reasoning system rather than queried as a glossary.",
  principle: "Enter by practice before retrieval. Search finds entry points; structure carries meaning.",
  entryPath: [
    { step: 1, tool: "get_entry", arguments: { id: "practice.reasoning" }, reason: "Read what a reason is in Atlas terms: traceable support." },
    { step: 2, tool: "get_entry", arguments: { id: "practice.atlas" }, reason: "Read what the Atlas is: the dependency-ordered reasoning system." },
    { step: 3, tool: "get_entry", arguments: { id: "practice.ai-participation" }, reason: "Read the AI-facing participation constraints before contributing." },
    { step: 4, tool: "get_entry", arguments: { id: "practice.atlas-note-standard" }, reason: "Read the note grammar: places, holds, pairs, traces, nests, reads, carries." },
    { step: 5, tool: "search_atlas", arguments: { query: "<user term or question>" }, reason: "Use search only after orientation, and treat results as entry points." },
    { step: 6, tool: "get_entry", arguments: { id: "<selected result id>" }, reason: "For the target term, read `structure` before prose." },
    { step: 7, tool: "get_related", arguments: { id: "<selected result id>" }, reason: "Traverse holds/traces upstream and carries downstream before answering." },
  ],
  rules: [
    "Do not answer from search results alone.",
    "For every Atlas term, read `structure` first: holds/traces before prose, carries before implications.",
    "Treat holds/traces as what the term depends on; treat carries as what it opens.",
    "Use get_related for structural terms, practice terms, and any claim about dependency.",
    "Present uncertainty as unresolved trace, not as confident definition.",
    "Never invent primitives, carries, or merges. If a relation is not in structure, name it as a possible read rather than an Atlas dependency.",
    "When trace reaches a primitive, follow the return through pairs/practice; do not treat it as a dead end.",
  ],
  startingIds: ["practice.reasoning", "practice.atlas", "practice.ai-participation", "practice.atlas-note-standard"],
};

// ---- tool definitions ----------------------------------------------------
const strOrArr = { anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] };
const TOOLS = [
  { name: "get_manifest", description: "Return the identity and current state of the published Atlas (version, build time, entry count, content hash).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },
  { name: "get_ai_entry_protocol", description: "Return the required entry ritual for AI participants: enter through Reasoning, Atlas, AI Participation, and Atlas Note Standard before search.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },
  { name: "search_atlas", description: "Find entry points into the dependency-ordered Atlas by text and metadata. Each result is a place to begin tracing, not a final answer — follow its relations with get_entry/get_related.",
    inputSchema: { type: "object", additionalProperties: false, required: ["query"], properties: {
      query: { type: "string" }, status: strOrArr, type: strOrArr, order: strOrArr, branch: strOrArr, tag: strOrArr,
      updatedAfter: { type: "string", description: "ISO date" }, limit: { type: "integer", minimum: 1, maximum: SEARCH_MAX } } } },
  { name: "get_entry", description: "Return one Atlas entry with its dependency `structure` (holds/traces/carries/pairs/nests) as the primary field. Relation-first: trace the structure rather than reading the term as a definition.",
    inputSchema: { type: "object", additionalProperties: false, properties: { id: { type: "string" }, sourcePath: { type: "string" } } } },
  { name: "get_related", description: "Traverse an entry's typed, directional dependency relations: upstream (holds/traces — what it depends on), downstream (carries — what it opens), lateral (pairs), nesting. The core navigation tool. Optionally adds clearly-separated inferred search matches.",
    inputSchema: { type: "object", additionalProperties: false, required: ["id"], properties: {
      id: { type: "string" }, includeInferred: { type: "boolean" }, limit: { type: "integer", minimum: 1, maximum: SEARCH_MAX } } } },
  { name: "list_entries", description: "List entries by metadata filters without a text query. Supports pagination via cursor.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      status: strOrArr, type: strOrArr, order: strOrArr, branch: strOrArr, tag: strOrArr,
      limit: { type: "integer", minimum: 1, maximum: LIST_MAX }, cursor: { type: "string" } } } },
  { name: "get_recent_changes", description: "Return entries with a front-matter update date later than `since` (metadata-based, not a repository diff).",
    inputSchema: { type: "object", additionalProperties: false, required: ["since"], properties: {
      since: { type: "string", description: "ISO date or Atlas version" }, limit: { type: "integer", minimum: 1, maximum: LIST_MAX } } } },
  { name: "get_entry_by_title", description: "Look up one or more Atlas entries by exact title. Returns all matches — use this when you know the human-readable name but not the canonical ID. If multiple entries share a title (collision), all are returned so you can select the correct one by order or sourcePath.",
    inputSchema: { type: "object", additionalProperties: false, required: ["title"], properties: {
      title: { type: "string", description: "Exact note title to look up (case-insensitive)" } } } },
];

const trace = (m, e) => ({
  atlasVersion: m.atlasVersion, sourcePath: e.sourcePath, publicUrl: e.publicUrl,
  status: e.status ?? null, contentHash: e.contentHash, sourceCommit: m.sourceCommit ?? null,
});

const fileIdFor = (id) => id.replace(/\//g, "__");

// ---- tool dispatch -------------------------------------------------------
async function callTool(name, args, env) {
  const m = await loadManifest(env);
  const v = m.atlasVersion;

  if (name === "get_manifest") {
    return { schemaVersion: m.schemaVersion, atlasVersion: m.atlasVersion, builtAt: m.builtAt,
      sourceCommit: m.sourceCommit ?? null, entryCount: m.entryCount, contentHash: m.contentHash };
  }

  if (name === "get_ai_entry_protocol") {
    return { atlasVersion: v, ...AI_ENTRY_PROTOCOL };
  }

  if (name === "search_atlas") {
    const query = String(args.query ?? "");
    if (!query.trim()) return { error: "query is required" };
    if (query.length > MAX_QUERY) return { error: `query too long (max ${MAX_QUERY})` };
    const limit = Math.min(Math.max(parseInt(args.limit) || SEARCH_DEFAULT, 1), SEARCH_MAX);
    const filters = { status: asSet(args.status), type: asSet(args.type), order: asSet(args.order),
      branch: asSet(args.branch), tag: asSet(args.tag), updatedAfter: args.updatedAfter ? String(args.updatedAfter) : null };
    const search = await loadSearch(env, v);
    const results = searchEntries(search.entries, query, filters, limit).map(({ e, score, matched }) => ({
      id: e.id, title: e.title, excerpt: e.excerpt, score, matchedFields: matched,
      status: e.status ?? null, type: e.type ?? null, order: e.order ?? null, branch: e.branch ?? null,
      sourcePath: e.sourcePath, publicUrl: e.publicUrl, updated: e.updated ?? null,
      atlasVersion: v, contentHash: e.contentHash,
    }));
    return { atlasVersion: v, query, count: results.length, results };
  }

  if (name === "get_entry") {
    const idx = await loadIndex(env, v);
    let entry;
    if (args.id != null) {
      const id = String(args.id);
      if (!ID_RE.test(id)) return { error: "invalid id" };
      entry = idx.entries.find((e) => e.id === id);
    } else if (args.sourcePath != null) {
      const sp = String(args.sourcePath);
      const cands = idx.entries.filter((e) => e.sourcePath === sp);
      if (cands.length > 1) return { ambiguous: true, candidates: cands.map((e) => ({ id: e.id, title: e.title, sourcePath: e.sourcePath })) };
      entry = cands[0];
    } else return { error: "provide id or sourcePath" };
    if (!entry) return { notFound: true, atlasVersion: v };
    try {
      const full = await loadEntry(env, v, fileIdFor(entry.id));
      const byId = new Map(idx.entries.map((e) => [e.id, e]));
      const byTitle = new Map(idx.entries.map((e) => [e.title, e]));
      const structure = resolveStructure(full, byId, byTitle);
      return { id: full.id, title: full.title, publicUrl: full.publicUrl,
        status: full.status ?? null, type: full.type ?? null, order: full.order ?? null,
        structure, content: full.content, headings: full.headings, wordCount: full.wordCount,
        atlasVersion: v, _trace: trace(m, full), _read_as: READ_AS };
    } catch (e) {
      if (e.status === 404) return { transient: true, message: "entry not yet available for current version; retry shortly", atlasVersion: v };
      throw e;
    }
  }

  if (name === "get_related") {
    const id = String(args.id ?? "");
    if (!ID_RE.test(id)) return { error: "invalid id" };
    const idx = await loadIndex(env, v);
    const self = idx.entries.find((e) => e.id === id);
    if (!self) return { notFound: true, atlasVersion: v };
    const byId = new Map(idx.entries.map((e) => [e.id, e]));
    const byTitle = new Map(idx.entries.map((e) => [e.title, e]));
    let structure;
    try { const full = await loadEntry(env, v, fileIdFor(self.id)); structure = resolveStructure(full, byId, byTitle); }
    catch (e) { if (e.status === 404) return { transient: true, atlasVersion: v }; throw e; }
    const result = { atlasVersion: v, id, title: self.title,
      upstream: { holds: structure.holds, traces: structure.traces },
      lateral: { pairs: structure.pairs },
      downstream: { carries: structure.carries },
      nesting: { nests: structure.nests },
      note: "Traverse the Atlas by following these typed relations. Upstream (holds/traces) is what this depends on — trace it back; downstream (carries) is what it opens. This is the dependency structure, not a list of similar terms." };
    if (result.upstream.holds.length === 0 && result.upstream.traces.length === 0) {
      result.atPrimitive = true;
      result.return = "Trace has reached a primitive — this is NOT a dead end. The Atlas returns: follow lateral.pairs (e.g. Ground / Seed, the return-side) and the Practice crossing back to Ground. The order is a loop, and the return is not a repeat.";
    }
    if (args.includeInferred) {
      const limit = Math.min(Math.max(parseInt(args.limit) || 10, 1), SEARCH_MAX);
      const search = await loadSearch(env, v);
      const allRelated = [...structure.holds, ...structure.traces, ...structure.carries, ...structure.pairs, ...structure.nests];
      const exclude = new Set([id, ...allRelated.filter((r) => r.id).map((r) => r.id)]);
      const inferred = searchEntries(search.entries, self.title, {}, limit + exclude.size)
        .filter(({ e }) => !exclude.has(e.id)).slice(0, limit)
        .map(({ e, score }) => ({ id: e.id, title: e.title, publicUrl: e.publicUrl, score, relation: "inferred" }));
      result.inferred = inferred;
      result.inferredNote = "search matches, NOT authored Atlas structure — never present these as dependency relations";
    }
    return result;
  }

  if (name === "list_entries") {
    const idx = await loadIndex(env, v);
    const filters = { status: asSet(args.status), type: asSet(args.type), order: asSet(args.order),
      branch: asSet(args.branch), tag: asSet(args.tag), updatedAfter: null };
    const all = idx.entries.filter((e) => passesFilters(e, filters));
    const limit = Math.min(Math.max(parseInt(args.limit) || LIST_DEFAULT, 1), LIST_MAX);
    const start = args.cursor ? Math.max(parseInt(atob(String(args.cursor))) || 0, 0) : 0;
    const page = all.slice(start, start + limit);
    const nextCursor = start + limit < all.length ? btoa(String(start + limit)) : null;
    return { atlasVersion: v, total: all.length, count: page.length, nextCursor,
      entries: page.map((e) => ({ id: e.id, title: e.title, status: e.status ?? null, type: e.type ?? null,
        order: e.order ?? null, branch: e.branch ?? null, publicUrl: e.publicUrl, sourcePath: e.sourcePath, updated: e.updated ?? null })) };
  }

  if (name === "get_recent_changes") {
    const since = String(args.since ?? "");
    const limit = Math.min(Math.max(parseInt(args.limit) || LIST_DEFAULT, 1), LIST_MAX);
    const idx = await loadIndex(env, v);
    const dated = idx.entries.filter((e) => e.updated);
    const changed = dated.filter((e) => e.updated > since).sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, limit);
    return { atlasVersion: v, basis: "metadata", note: "based on front-matter update dates, not a repository diff",
      sinceComparable: dated.length > 0, count: changed.length,
      entries: changed.map((e) => ({ id: e.id, title: e.title, updated: e.updated, publicUrl: e.publicUrl })) };
  }

  if (name === "get_entry_by_title") {
    const query = String(args.title ?? "").trim();
    if (!query) return { error: "title is required" };
    const idx = await loadIndex(env, v);
    const lower = query.toLowerCase();
    const matches = idx.entries.filter((e) => e.title.toLowerCase() === lower);
    if (matches.length === 0) {
      // Suggest near-matches via prefix
      const suggestions = idx.entries
        .filter((e) => e.title.toLowerCase().startsWith(lower) || e.title.toLowerCase().includes(lower))
        .slice(0, 5)
        .map((e) => ({ id: e.id, title: e.title, order: e.order ?? null }));
      return { notFound: true, atlasVersion: v, query, suggestions };
    }
    const results = matches.map((e) => ({
      id: e.id, title: e.title, order: e.order ?? null, type: e.type ?? null,
      status: e.status ?? null, sourcePath: e.sourcePath, publicUrl: e.publicUrl,
      contentHash: e.contentHash,
    }));
    return {
      atlasVersion: v, query, count: results.length,
      collision: results.length > 1,
      collisionNote: results.length > 1
        ? "Multiple entries share this title. Wikilinks [[" + query + "]] resolved to the first-registered entry. Use the canonical `id` to target a specific entry."
        : undefined,
      entries: results,
    };
  }

  const err = new Error(`unknown tool: ${name}`); err.code = -32601; throw err;
}

// ---- resources -----------------------------------------------------------
async function readResource(uri, env) {
  const m = await loadManifest(env);
  const v = m.atlasVersion;
  if (uri === "atlas://manifest") return jsonResource(uri, m);
  if (uri === "atlas://index") return jsonResource(uri, await loadIndex(env, v));
  if (uri === "atlas://ai-entry-protocol") return jsonResource(uri, { atlasVersion: v, ...AI_ENTRY_PROTOCOL });
  const em = uri.match(/^atlas:\/\/entry\/(.+)$/);
  if (em) {
    const id = decodeURIComponent(em[1]);
    if (!ID_RE.test(id)) throw rpcError(-32602, "invalid id");
    return jsonResource(uri, await loadEntry(env, v, fileIdFor(id)));
  }
  throw rpcError(-32602, `unknown resource: ${uri}`);
}
const jsonResource = (uri, data) => ({ contents: [{ uri, mimeType: "application/json", text: JSON.stringify(data) }] });

// ---- JSON-RPC ------------------------------------------------------------
const rpcError = (code, message) => Object.assign(new Error(message), { code });
const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const fail = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });

async function handleRpc(msg, env, ctx) {
  const { id = null, method, params = {} } = msg || {};
  try {
    switch (method) {
      case "initialize":
        return ok(id, { protocolVersion: params.protocolVersion || PROTOCOL_VERSION,
          capabilities: { tools: {}, resources: {} }, serverInfo: SERVER_INFO,
          instructions: "The Reality Mechanics Atlas is a dependency-ordered reasoning system carried by structure, NOT a dictionary or glossary. Its working postulate is ordinary: relation holds, order carries, trace places. A term is located by its relations, not by a definition. Always trace before defining: for any term, call get_entry and read its `structure` FIRST — follow `holds`/`traces` back to what it depends on and `carries` forward to what it opens; use get_related to traverse further. Present where a term sits in the order and what it carries and traces, never as a standalone glossary entry. search_atlas only finds entry points; the meaning is in the traversal. The order is a loop, not a ladder: when a trace reaches a primitive (empty upstream, e.g. Relation) it does NOT dead-end — the Atlas returns. Relation pairs with Ground and Seed (Seed is the return-side), and the highest order crosses through Practice back to Ground. Follow the return, not a wall; the return is not a repeat." });
      case "ping": return ok(id, {});
      case "tools/list": return ok(id, { tools: TOOLS });
      case "resources/list":
        return ok(id, { resources: [
          { uri: "atlas://ai-entry-protocol", name: "AI Entry Protocol", mimeType: "application/json" },
          { uri: "atlas://manifest", name: "Atlas manifest", mimeType: "application/json" },
          { uri: "atlas://index", name: "Atlas index", mimeType: "application/json" } ] });
      case "resources/templates/list":
        return ok(id, { resourceTemplates: [{ uriTemplate: "atlas://entry/{id}", name: "Atlas entry", mimeType: "application/json" }] });
      case "resources/read": return ok(id, await readResource(String(params.uri), env));
      case "tools/call": {
        const name = params.name;
        if (!TOOLS.some((t) => t.name === name)) return fail(id, -32601, `unknown tool: ${name}`);
        const result = await callTool(name, params.arguments || {}, env);
        return ok(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result, isError: !!result.error });
      }
      default:
        if (typeof method === "string" && method.startsWith("notifications/")) return null; // no response to notifications
        return fail(id, -32601, `method not found: ${method}`);
    }
  } catch (e) {
    if (e instanceof UpstreamError) { console.log("upstream_error", e.message); return fail(id, -32000, "atlas source temporarily unavailable"); }
    console.log("internal_error", method, e && e.message);
    return fail(id, e.code || -32603, "internal error");
  }
}

// ---- HTTP ----------------------------------------------------------------
export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname !== "/mcp") {
      return json({ name: SERVER_INFO.name, version: SERVER_INFO.version, transport: "streamable-http",
        endpoint: "/mcp", tools: TOOLS.map((t) => t.name) }, 200);
    }
    if (url.pathname !== "/mcp") return json({ error: "not found" }, 404);
    if (request.method === "GET") return new Response(null, { status: 405, headers: { ...cors, Allow: "POST" } });
    if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

    let body;
    try { body = await request.json(); } catch { return json(fail(null, -32700, "parse error"), 200); }

    const batch = Array.isArray(body);
    const msgs = batch ? body : [body];
    if (msgs.length > 25) return json(fail(null, -32600, "too many messages"), 200);
    const responses = [];
    for (const msg of msgs) {
      const r = await handleRpc(msg, env, ctx);
      if (r !== null) responses.push(r);
    }
    if (responses.length === 0) return new Response(null, { status: 202, headers: cors });
    return json(batch ? responses : responses[0], 200);
  },
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", ...cors } });
}
