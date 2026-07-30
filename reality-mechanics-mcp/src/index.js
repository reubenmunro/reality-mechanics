/**
 * Reality Mechanics Atlas — MCP server backed by Cloudflare D1.
 *
 * Reads generated Atlas data from D1.
 * Atlas edits happen in GitHub first; D1 is rebuilt from the repository.
 * Streamable-HTTP MCP transport at POST /mcp.
 */

import {
  AI_ENTRY_PROTOCOL,
  ATLAS_SCHEMA,
  CANONICAL_ENTRY_COUNT,
  CANONICAL_SOURCE_HASH,
  DETERMINATION_RECORDS,
  PROTOCOLS,
  RELATION_KEYS,
} from "../generated/canonical-participation.mjs";
import {
  RELEASE_IDENTIFIER,
  TRANSLATION_HASH,
} from "../generated/release-identity.mjs";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "reality-mechanics-atlas", version: "4.0.0" };
const MAX_QUERY = 200;
const FIND_MAX = 100, FIND_DEFAULT = 25;
const TRACE_MAX_DEPTH = 5, TRACE_MAX_NODES = 200;
const GITHUB_REPO_URL = "https://github.com/reubenmunro/reality-mechanics";
const GITHUB_BRANCH = "main";
const SEARCH_STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "for", "from",
  "has", "in", "is", "it", "of", "on", "or", "that", "the", "this", "to",
  "was", "were", "with",
]);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, CF-Access-Client-Id, CF-Access-Client-Secret",
};

const identityHeaders = {
  "X-RM-Canonical-Source-Hash": CANONICAL_SOURCE_HASH,
  "X-RM-Translation-Hash": TRANSLATION_HASH,
  "X-RM-Release-Identifier": RELEASE_IDENTIFIER,
};

// ── D1 helpers ─────────────────────────────────────────────────────────────────

function parseEntry(row) {
  if (!row) return null;
  return {
    ...row,
    aliases:  JSON.parse(row.aliases  || "[]"),
    tags:     JSON.parse(row.tags     || "[]"),
    related:  JSON.parse(row.related  || "[]"),
    structure: row.structure ? JSON.parse(row.structure) : null,
    conditions: row.conditions ? JSON.parse(row.conditions) : null,
    headings: JSON.parse(row.headings || "[]"),
  };
}

async function dbAll(env, sql, params = []) {
  const result = await env.ATLAS_DB.prepare(sql).bind(...params).all();
  return result.results || [];
}

async function dbFirst(env, sql, params = []) {
  return env.ATLAS_DB.prepare(sql).bind(...params).first();
}

// Resolve a structure's ID arrays to {id, title, publicUrl} objects
function resolveIds(ids, byId) {
  return (ids || [])
    .filter(id => id)
    .map(id => {
      const e = byId.get(id);
      return e ? { id: e.id, title: e.title, publicUrl: e.public_url } : { id, unresolved: true };
    });
}

// Build byId lookup from a list of rows
function makeById(rows) {
  const m = new Map();
  rows.forEach(r => m.set(r.id, r));
  return m;
}

function clip(text, max = 2400) {
  const value = String(text || "");
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n\n[clipped for session start; call get_entry for the full entry]`;
}

function githubSourceLinks(sourcePath) {
  const path = String(sourcePath || "").trim();
  if (!path) return null;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return {
    sourcePath: path,
    githubViewUrl: `${GITHUB_REPO_URL}/blob/${GITHUB_BRANCH}/${encodedPath}`,
    githubEditUrl: `${GITHUB_REPO_URL}/edit/${GITHUB_BRANCH}/${encodedPath}`,
    githubRawUrl: `${GITHUB_REPO_URL}/raw/${GITHUB_BRANCH}/${encodedPath}`,
  };
}

function asList(value) {
  if (value === undefined || value === null || value === "") return [];
  return (Array.isArray(value) ? value : [value]).map(String).map((item) => item.trim()).filter(Boolean);
}

function normalise(value) {
  return String(value || "").trim().toLocaleLowerCase("en");
}

function sourceScope(sourcePath) {
  const match = String(sourcePath || "").match(/\/(?:Fields|Domains)\/([^/]+)\//);
  return match?.[1] || null;
}

function searchTokens(query) {
  const tokens = String(query || "").toLocaleLowerCase("en").match(/[\p{L}\p{N}]+/gu) || [];
  const meaningful = tokens.filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token));
  return [...new Set(meaningful.length ? meaningful : tokens.filter((token) => token.length > 1))];
}

function searchStem(token) {
  if (token.endsWith("ied") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (token.endsWith("ing") && token.length > 5) return token.slice(0, -3);
  if (token.endsWith("ed") && token.length > 4) return token.slice(0, -2);
  return token;
}

function ftsExpression(query) {
  return searchTokens(query).map((token) => `"${token.replaceAll('"', '""')}"*`).join(" OR ");
}

function entrySummary(row) {
  return {
    id: row.id,
    title: row.title,
    aliases: JSON.parse(row.aliases || "[]"),
    publicUrl: row.public_url,
    sourcePath: row.source_path,
    scope: sourceScope(row.source_path),
    status: row.status,
    order: row.entry_order,
    register: row.entry_register,
    determination: row.determination,
    kind: row.entry_type,
    excerpt: row.excerpt,
  };
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ""))]
    .sort((left, right) => String(left).localeCompare(String(right)));
}

async function manifest(env) {
  const total = await dbFirst(env, "SELECT COUNT(*) as n FROM entries");
  const metadata = await dbAll(env, "SELECT key, value FROM atlas_metadata");
  const values = Object.fromEntries(metadata.map((row) => [row.key, row.value]));
  const sourceHash = values.source_hash || null;
  const entryCount = total?.n || 0;
  return {
    sourceHash,
    entryCount,
    canonicalSourceHash: CANONICAL_SOURCE_HASH,
    canonicalEntryCount: CANONICAL_ENTRY_COUNT,
    translationHash: TRANSLATION_HASH,
    releaseIdentifier: RELEASE_IDENTIFIER,
    parity: sourceHash === CANONICAL_SOURCE_HASH && entryCount === CANONICAL_ENTRY_COUNT,
    note: "This is a generated read model. The Atlas is the sole maintained structural authority.",
  };
}

async function requireCurrentTranslation(env) {
  const readModel = await manifest(env);
  if (!readModel.parity) {
    const error = new Error(`translation_identity_mismatch: expected ${CANONICAL_SOURCE_HASH}/${CANONICAL_ENTRY_COUNT}, received ${readModel.sourceHash}/${readModel.entryCount}`);
    error.code = -32010;
    console.error(JSON.stringify({
      event: "translation_identity_mismatch",
      expectedCanonicalSourceHash: CANONICAL_SOURCE_HASH,
      actualD1SourceHash: readModel.sourceHash,
      expectedEntryCount: CANONICAL_ENTRY_COUNT,
      actualEntryCount: readModel.entryCount,
      translationHash: TRANSLATION_HASH,
      releaseIdentifier: RELEASE_IDENTIFIER,
    }));
    throw error;
  }
  return readModel;
}

function sessionEntry(row) {
  if (!row) return null;
  const entry = parseEntry(row);
  return {
    id: entry.id,
    title: entry.title,
    publicUrl: entry.public_url,
    status: entry.status,
    order: entry.entry_order,
    register: entry.entry_register,
    determination: entry.determination,
    kind: entry.entry_type,
    structure: entry.structure,
    conditions: entry.conditions,
    excerpt: entry.excerpt,
    content: clip(entry.content),
  };
}

const MCP_INSTRUCTIONS = "Begin with begin_atlas_session. The returned protocol and entries are generated from the canonical Atlas. find_entries locates entry points; get_entry reads one determination; trace_relations follows only declared relations. This MCP is read-only.";

// ── Tool definitions ───────────────────────────────────────────────────────────

const stringOrArray = (values = null) => {
  const item = values ? { type: "string", enum: values } : { type: "string" };
  return { anyOf: [item, { type: "array", items: item }] };
};

const orderValues = [...ATLAS_SCHEMA.placement.orderValues];
const registerValues = [...ATLAS_SCHEMA.placement.registerValues];
const statusValues = Object.keys(ATLAS_SCHEMA.statuses);
const determinationValues = Object.keys(DETERMINATION_RECORDS);

const TOOLS = [
  { name: "begin_atlas_session",
    description: "Start any Reality Mechanics Atlas session. Returns the generated protocol, required practice entries, manifest identity, and the neutral read path before discovery or traversal.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_manifest",
    description: "Return the identity and current state of the Atlas read model.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_structure_contract",
    description: "Return the generated Atlas schema, determinations, protocols, and source identity.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} } },

  { name: "find_entries",
    description: "Find or browse canonical Atlas entries through one neutral discovery surface. Text results are relevance-ordered entry points, never determinations. Filters mirror generated metadata and repository-carried field/domain scopes.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      query: { type: "string", maxLength: MAX_QUERY },
      exact_title: { type: "string" },
      ids: { type: "array", items: { type: "string" }, maxItems: 100 },
      order: stringOrArray(orderValues),
      register: stringOrArray(registerValues),
      kind: stringOrArray(),
      status: stringOrArray(statusValues),
      determination: stringOrArray(determinationValues),
      scope: stringOrArray(),
      limit: { type: "integer", minimum: 1, maximum: FIND_MAX },
      offset: { type: "integer", minimum: 0 },
    } } },

  { name: "get_entry",
    description: "Return one canonical Atlas entry with all seven declared relation reads: needs, holds, pairs, traces, nests, reads, and carries. It reports authored structure without inferring dependency direction, primitive status, groundedness, or equivalence.",
    inputSchema: { type: "object", additionalProperties: false, required: ["id"], properties: {
      id: { type: "string" },
      include_provenance: { type: "boolean", default: false },
    } } },

  { name: "trace_relations",
    description: "Traverse only explicitly declared Atlas relations from one entry. Select any of the seven relation types, outgoing declarations, incoming declarations, or both, and a bounded depth. Returns nodes, declared edges, and paths without evaluating what the traversal means.",
    inputSchema: { type: "object", additionalProperties: false, required: ["id"], properties: {
      id: { type: "string" },
      relations: stringOrArray([...RELATION_KEYS]),
      direction: { type: "string", enum: ["outgoing", "incoming", "both"], default: "outgoing" },
      depth: { type: "integer", minimum: 1, maximum: TRACE_MAX_DEPTH, default: 1 },
      max_nodes: { type: "integer", minimum: 2, maximum: TRACE_MAX_NODES, default: 100 },
    } } },

  { name: "open_source_for_entry",
    description: "Return optional maintained-source provenance for an entry after it has been read through MCP. The local public Atlas remains the primary reader; GitHub links are supplied only for proof or an explicitly authorised source-editing workflow.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      id: { type: "string", description: "Atlas entry id, e.g. first.ratio" },
      title: { type: "string", description: "Exact Atlas title when id is not known, e.g. Ratio" } } } },
];

// ── Tool dispatch ─────────────────────────────────────────────────────────────

function advertisedTools() {
  return TOOLS;
}

async function callTool(name, args, env) {
  if (!env.ATLAS_DB) throw new Error("ATLAS_DB binding not configured");
  const currentReadModel = await requireCurrentTranslation(env);

  // ── begin_atlas_session ──
  if (name === "begin_atlas_session") {
    const protocolIds = [...AI_ENTRY_PROTOCOL];
    const placeholders = protocolIds.map(() => "?").join(",");
    const rows = await dbAll(env,
      `SELECT * FROM entries WHERE id IN (${placeholders})`, protocolIds);
    const byId = makeById(rows);
    const requiredEntries = protocolIds.map((id) => sessionEntry(byId.get(id)));
    if (requiredEntries.some((entry) => !entry)) {
      throw new Error("Generated AI protocol does not resolve completely in D1");
    }
    return {
      purpose: "Begin a Reality Mechanics Atlas session before search or traversal.",
      manifest: currentReadModel,
      protocol: { name: "ai-entry", sourceHash: CANONICAL_SOURCE_HASH, translationHash: TRANSLATION_HASH, members: protocolIds },
      requiredEntries,
      next: {
        discover: ["find_entries"],
        read: ["get_entry"],
        traverse: ["trace_relations"],
        provenance: ["open_source_for_entry"],
      },
    };
  }

  // ── get_structure_contract ──
  if (name === "get_structure_contract") {
    return {
      sourceHash: CANONICAL_SOURCE_HASH,
      translationHash: TRANSLATION_HASH,
      atlasSchema: ATLAS_SCHEMA,
      determinationRecords: DETERMINATION_RECORDS,
      protocols: PROTOCOLS,
    };
  }

  // ── get_manifest ──
  if (name === "get_manifest") {
    return currentReadModel;
  }

  // ── find_entries ──
  if (name === "find_entries") {
    const query = String(args.query || "").trim();
    if (query.length > MAX_QUERY) return { error: `query too long (max ${MAX_QUERY})` };
    const exactTitle = String(args.exact_title || "").trim();
    const ids = new Set(asList(args.ids));
    const orders = new Set(asList(args.order));
    const registers = new Set(asList(args.register));
    const kinds = new Set(asList(args.kind));
    const statuses = new Set(asList(args.status));
    const determinations = new Set(asList(args.determination));
    const scopes = new Set(asList(args.scope).map(normalise));
    const limit = Math.min(Math.max(parseInt(args.limit) || FIND_DEFAULT, 1), FIND_MAX);
    const offset = Math.max(parseInt(args.offset) || 0, 0);

    for (const [label, selected, allowed] of [
      ["order", orders, orderValues],
      ["register", registers, registerValues],
      ["status", statuses, statusValues],
      ["determination", determinations, determinationValues],
    ]) {
      const invalid = [...selected].filter((value) => !allowed.includes(value));
      if (invalid.length) return { error: `invalid ${label}`, invalid, allowed };
    }

    const rows = await dbAll(env,
      `SELECT id, title, aliases, excerpt, status, entry_order, entry_register,
              determination, entry_type, source_path, public_url
       FROM entries ORDER BY source_path, id`);
    const availableFilters = {
      order: uniqueSorted(rows.map((row) => row.entry_order)),
      register: uniqueSorted(rows.map((row) => row.entry_register)),
      kind: uniqueSorted(rows.map((row) => row.entry_type)),
      status: uniqueSorted(rows.map((row) => row.status)),
      determination: uniqueSorted(rows.map((row) => row.determination)),
      scope: uniqueSorted(rows.map((row) => sourceScope(row.source_path))),
    };
    const invalidKinds = [...kinds].filter((value) => !availableFilters.kind.includes(value));
    if (invalidKinds.length) return { error: "invalid kind", invalid: invalidKinds, allowed: availableFilters.kind };
    const scopeByNormal = new Map(availableFilters.scope.map((value) => [normalise(value), value]));
    const invalidScopes = [...scopes].filter((value) => !scopeByNormal.has(value));
    if (invalidScopes.length) return { error: "invalid scope", invalid: invalidScopes, allowed: availableFilters.scope };

    let rankById = null;
    const expression = query ? ftsExpression(query) : "";
    if (query && !expression) return { error: "query contains no searchable terms" };
    if (expression) {
      const hits = await dbAll(env,
        `SELECT id, bm25(entries_fts, 0.0, 8.0, 4.0, 1.0) AS rank
         FROM entries_fts WHERE entries_fts MATCH ? ORDER BY rank, id LIMIT 500`,
        [expression]);
      rankById = new Map(hits.map((hit) => [hit.id, Number(hit.rank) || 0]));
    }

    const exact = normalise(exactTitle);
    const queryNormal = normalise(query);
    const queryTerms = searchTokens(query);
    const queryStems = queryTerms.map(searchStem);
    const filtered = rows.filter((row) => {
      const aliases = JSON.parse(row.aliases || "[]");
      if (rankById && !rankById.has(row.id)) return false;
      if (ids.size && !ids.has(row.id)) return false;
      if (orders.size && !orders.has(row.entry_order)) return false;
      if (registers.size && !registers.has(row.entry_register)) return false;
      if (kinds.size && !kinds.has(row.entry_type)) return false;
      if (statuses.size && !statuses.has(row.status)) return false;
      if (determinations.size && !determinations.has(row.determination)) return false;
      if (scopes.size && !scopes.has(normalise(sourceScope(row.source_path)))) return false;
      if (exact && normalise(row.title) !== exact && !aliases.some((alias) => normalise(alias) === exact)) return false;
      return true;
    });

    filtered.sort((left, right) => {
      if (rankById) {
        const leftTitle = normalise(left.title);
        const rightTitle = normalise(right.title);
        const leftExact = leftTitle === queryNormal ? 0 : 1;
        const rightExact = rightTitle === queryNormal ? 0 : 1;
        if (leftExact !== rightExact) return leftExact - rightExact;
        const leftStemExact = queryStems.includes(leftTitle) ? 0 : 1;
        const rightStemExact = queryStems.includes(rightTitle) ? 0 : 1;
        if (leftStemExact !== rightStemExact) return leftStemExact - rightStemExact;
        const leftPrefix = [...queryTerms, ...queryStems].some((term) => leftTitle.startsWith(term)) ? 0 : 1;
        const rightPrefix = [...queryTerms, ...queryStems].some((term) => rightTitle.startsWith(term)) ? 0 : 1;
        if (leftPrefix !== rightPrefix) return leftPrefix - rightPrefix;
        const rank = (rankById.get(left.id) || 0) - (rankById.get(right.id) || 0);
        if (rank) return rank;
      }
      return left.source_path.localeCompare(right.source_path) || left.id.localeCompare(right.id);
    });

    const entries = filtered.slice(offset, offset + limit).map(entrySummary);

    return {
      query: query || null,
      exactTitle: exactTitle || null,
      total: filtered.length,
      count: entries.length,
      offset,
      hasMore: offset + entries.length < filtered.length,
      entries,
      availableFilters,
      note: "Discovery returns entry points. Read get_entry and trace_relations before making an Atlas claim.",
    };
  }

  // ── get_entry ──
  if (name === "get_entry") {
    const id = String(args.id || "").trim();
    if (!id) return { error: "id is required" };

    const row = await dbFirst(env, "SELECT * FROM entries WHERE id = ?", [id]);
    if (!row) return { notFound: true, id };

    const e = parseEntry(row);

    // Resolve structure IDs to {id, title, publicUrl}
    let resolvedStructure = null;
    if (e.structure) {
      const allIds = RELATION_KEYS.flatMap((relation) => e.structure[relation] || []).filter(Boolean);

      if (allIds.length) {
        const placeholders = allIds.map(() => "?").join(",");
        const related = await dbAll(env,
          `SELECT id, title, public_url FROM entries WHERE id IN (${placeholders})`, allIds);
        const byId = makeById(related);
        resolvedStructure = Object.fromEntries(
          RELATION_KEYS.map((relation) => [relation, resolveIds(e.structure[relation], byId)]),
        );
      }
    }

    return {
      id: e.id, title: e.title, publicUrl: e.public_url,
      sourcePath: e.source_path,
      ...(args.include_provenance ? { provenance: githubSourceLinks(e.source_path) } : {}),
      status: e.status,
      order: e.entry_order, register: e.entry_register,
      determination: e.determination,
      kind: e.entry_type,
      structure: resolvedStructure,
      conditions: e.conditions,
      content: e.content,
      headings: e.headings,
      wordCount: e.word_count,
    };
  }

  // ── trace_relations ──
  if (name === "trace_relations") {
    const id = String(args.id || "").trim();
    if (!id) return { error: "id is required" };
    const selected = asList(args.relations);
    const relations = selected.length ? selected : [...RELATION_KEYS];
    const invalidRelations = relations.filter((relation) => !RELATION_KEYS.includes(relation));
    if (invalidRelations.length) return { error: "invalid relations", invalid: invalidRelations, allowed: [...RELATION_KEYS] };
    const direction = String(args.direction || "outgoing");
    if (!["outgoing", "incoming", "both"].includes(direction)) {
      return { error: "invalid direction", invalid: direction, allowed: ["outgoing", "incoming", "both"] };
    }
    const depth = Math.min(Math.max(parseInt(args.depth) || 1, 1), TRACE_MAX_DEPTH);
    const maxNodes = Math.min(Math.max(parseInt(args.max_nodes) || 100, 2), TRACE_MAX_NODES);

    const rows = await dbAll(env,
      "SELECT id, title, public_url, entry_order, entry_register, determination, entry_type, structure FROM entries ORDER BY id");
    const entries = new Map(rows.map((row) => [row.id, {
      ...row,
      structure: row.structure ? JSON.parse(row.structure) : Object.fromEntries(RELATION_KEYS.map((relation) => [relation, []])),
    }]));
    const start = entries.get(id);
    if (!start) return { notFound: true, id };

    const nodes = new Map([[id, {
      id: start.id,
      title: start.title,
      publicUrl: start.public_url,
      order: start.entry_order,
      register: start.entry_register,
      determination: start.determination,
      kind: start.entry_type,
      depth: 0,
    }]]);
    const queue = [{ id, depth: 0, path: [id] }];
    const visitedAt = new Map([[id, 0]]);
    const edges = [];
    const edgeKeys = new Set();
    let truncated = false;

    const addEdge = (from, to, relation, traversed, nextDepth, path) => {
      const key = `${from}\0${relation}\0${to}\0${traversed}`;
      if (!edgeKeys.has(key)) {
        edgeKeys.add(key);
        edges.push({ from, to, relation, traversed, depth: nextDepth, path });
      }
    };

    while (queue.length) {
      const current = queue.shift();
      if (current.depth >= depth) continue;
      const currentEntry = entries.get(current.id);
      const candidates = [];

      if (direction === "outgoing" || direction === "both") {
        for (const relation of relations) {
          for (const target of currentEntry.structure[relation] || []) {
            candidates.push({ next: target, from: current.id, to: target, relation, traversed: "outgoing" });
          }
        }
      }
      if (direction === "incoming" || direction === "both") {
        for (const candidate of entries.values()) {
          for (const relation of relations) {
            if ((candidate.structure[relation] || []).includes(current.id)) {
              candidates.push({ next: candidate.id, from: candidate.id, to: current.id, relation, traversed: "incoming" });
            }
          }
        }
      }

      for (const candidate of candidates) {
        const nextEntry = entries.get(candidate.next);
        if (!nextEntry) {
          addEdge(candidate.from, candidate.to, candidate.relation, candidate.traversed, current.depth + 1, [...current.path, candidate.next]);
          continue;
        }
        if (!nodes.has(candidate.next) && nodes.size >= maxNodes) {
          truncated = true;
          continue;
        }
        const nextDepth = current.depth + 1;
        const path = [...current.path, candidate.next];
        addEdge(candidate.from, candidate.to, candidate.relation, candidate.traversed, nextDepth, path);
        if (!nodes.has(candidate.next)) {
          nodes.set(candidate.next, {
            id: nextEntry.id,
            title: nextEntry.title,
            publicUrl: nextEntry.public_url,
            order: nextEntry.entry_order,
            register: nextEntry.entry_register,
            determination: nextEntry.determination,
            kind: nextEntry.entry_type,
            depth: nextDepth,
          });
        }
        if (!visitedAt.has(candidate.next) || nextDepth < visitedAt.get(candidate.next)) {
          visitedAt.set(candidate.next, nextDepth);
          queue.push({ id: candidate.next, depth: nextDepth, path });
        }
      }
    }

    return {
      start: nodes.get(id),
      relations,
      direction,
      depth,
      maxNodes,
      nodeCount: nodes.size,
      edgeCount: edges.length,
      truncated,
      nodes: [...nodes.values()],
      edges,
      note: "Every edge is an authored Atlas declaration. No dependency direction, primitive status, groundedness, equivalence, or shared meaning is inferred.",
    };
  }

  // ── open_source_for_entry ──
  if (name === "open_source_for_entry") {
    const id = String(args.id || "").trim();
    const title = String(args.title || "").trim();
    if (!id && !title) return { error: "id or title is required" };

    const rows = id
      ? await dbAll(env,
          "SELECT id, title, source_path, public_url FROM entries WHERE id = ?",
          [id])
      : await dbAll(env,
          "SELECT id, title, source_path, public_url FROM entries WHERE title = ? COLLATE NOCASE",
          [title]);

    if (!rows.length) return { notFound: true, id: id || null, title: title || null };

    const entries = rows.map((row) => {
      const source = githubSourceLinks(row.source_path);
      return {
        id: row.id,
        title: row.title,
        publicUrl: row.public_url,
        sourcePath: row.source_path || null,
        maintainedRecord: source,
        editable: !!source,
      };
    });

    return {
      query: id ? { id } : { title },
      count: entries.length,
      collision: entries.length > 1,
      entries,
      instruction: "Use the local public Atlas for ordinary reading. Use the maintained record only for proof or an explicitly authorised source edit; then regenerate and publish through the repository dependency path.",
    };
  }

  throw Object.assign(new Error(`unknown tool: ${name}`), { code: -32601 });
}

// ── JSON-RPC ───────────────────────────────────────────────────────────────────

const rpcError = (code, message) => Object.assign(new Error(message), { code });
const ok   = (id, result) => ({ jsonrpc: "2.0", id, result });
const fail = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });

async function handleRpc(msg, env, ctx) {
  const { id = null, method, params = {} } = msg || {};
  try {
    switch (method) {
      case "initialize":
        return ok(id, { protocolVersion: params.protocolVersion || PROTOCOL_VERSION,
          capabilities: { tools: {}, resources: {} }, serverInfo: SERVER_INFO,
          instructions: MCP_INSTRUCTIONS });
      case "ping":
        return ok(id, {});
      case "tools/list":
        return ok(id, { tools: advertisedTools(ctx.authToken || "", env) });
      case "tools/call": {
        const name = params.name;
        if (!TOOLS.some(t => t.name === name))
          return fail(id, -32601, `unknown tool: ${name}`);
        const result = await callTool(name, params.arguments || {}, env);
        return ok(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result, isError: !!result.error });
      }
      default:
        if (typeof method === "string" && method.startsWith("notifications/")) return null;
        return fail(id, -32601, `method not found: ${method}`);
    }
  } catch (e) {
    console.log("internal_error", method, e?.message);
    return fail(id, e.code || -32603, e.message || "internal error");
  }
}

// ── HTTP ───────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: { ...cors, ...identityHeaders } });
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname !== "/mcp") {
      try {
        const readModel = await requireCurrentTranslation(env);
        return json({ name: SERVER_INFO.name, version: SERVER_INFO.version,
          transport: "streamable-http", endpoint: "/mcp", tools: advertisedTools("", env).map(t => t.name),
          canonicalSourceHash: CANONICAL_SOURCE_HASH, translationHash: TRANSLATION_HASH,
          releaseIdentifier: RELEASE_IDENTIFIER, parity: readModel.parity }, 200);
      } catch (error) {
        return json({ error: "current_translation_unavailable", detail: error.message,
          canonicalSourceHash: CANONICAL_SOURCE_HASH, translationHash: TRANSLATION_HASH }, 503);
      }
    }

    if (url.pathname !== "/mcp") return json({ error: "not found" }, 404);
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { ...cors, Allow: "POST" } });

    let body;
    try { body = await request.json(); } catch { return json(fail(null, -32700, "parse error"), 200); }

    const batch = Array.isArray(body);
    const msgs = batch ? body : [body];
    if (msgs.length > 25) return json(fail(null, -32600, "too many messages"), 200);

    const authHeader = request.headers.get("Authorization") || "";
    const authToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const ctx = { authToken };

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
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", ...cors, ...identityHeaders },
  });
}
