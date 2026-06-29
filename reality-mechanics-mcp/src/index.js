/**
 * Reality Mechanics Atlas — MCP server backed by Cloudflare D1.
 *
 * Reads and writes the canonical Atlas directly from/to D1.
 * No static build required — changes are live immediately.
 * Streamable-HTTP MCP transport at POST /mcp.
 */

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "reality-mechanics-atlas", version: "2.0.0" };
const MAX_QUERY = 200;
const SEARCH_MAX = 25, SEARCH_DEFAULT = 8;
const LIST_MAX = 200, LIST_DEFAULT = 50;
const DEFAULT_GARDEN_URL = "https://realitymechanics.nz";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id, Mcp-Protocol-Version",
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
    headings: JSON.parse(row.headings || "[]"),
    grounded: row.grounded === 1,
  };
}

async function dbAll(env, sql, params = []) {
  const result = await env.ATLAS_DB.prepare(sql).bind(...params).all();
  return result.results || [];
}

async function dbFirst(env, sql, params = []) {
  return env.ATLAS_DB.prepare(sql).bind(...params).first();
}

async function dbRun(env, sql, params = []) {
  return env.ATLAS_DB.prepare(sql).bind(...params).run();
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

async function manifest(env) {
  const counts = await dbAll(env,
    "SELECT garden_status, COUNT(*) as n FROM entries GROUP BY garden_status");
  const total = await dbFirst(env, "SELECT COUNT(*) as n FROM entries");
  const stats = {};
  counts.forEach(r => { stats[r.garden_status || "unknown"] = r.n; });
  return {
    atlasVersion: "d1-live",
    note: "Atlas is live from D1 — no build version, changes are immediate.",
    entryCount: total?.n || 0,
    gardenStats: stats,
  };
}

function sessionEntry(row) {
  if (!row) return null;
  const entry = parseEntry(row);
  return {
    id: entry.id,
    title: entry.title,
    publicUrl: entry.public_url,
    status: entry.status,
    gardenStatus: entry.garden_status,
    grounded: entry.grounded,
    order: entry.entry_order,
    type: entry.entry_type,
    structure: entry.structure,
    excerpt: entry.excerpt,
    content: clip(entry.content),
    _read_as: READ_AS,
  };
}

// ── Content / static data ──────────────────────────────────────────────────────

const READ_AS = "The Atlas is a dependency-ordered reasoning system carried by structure, not a dictionary. `structure` is primary: holds/traces are what this depends on (trace them back); carries is what it opens; pairs is its contrast; nests is membership. Follow the relations — do not read the term as a standalone definition.";

const AI_OUTPUT_CONTRACT = {
  purpose: "Keep Atlas-assisted AI answers traceable through the MCP rather than fluent from memory.",
  rule: "Use MCP tools before making Atlas claims. Search finds entry points; get_entry/get_related supply the authored structure.",
  minimumFields: ["Pressure","Trace","Bound","Determination","Trace state","Next recarry","Unresolved"],
  oracleFields: ["Answer","Trace path","Primary handle","Supporting handles","Move made","Bound","Next recarry","Review options"],
  oracleCarryingConditions: ["bounded input","bounded answer","MCP trace available","structured output","review path","raw storage off by default","cost cap active","rate limit active","safety route active","pause available"],
  regenerationCheck: {
    formula: "GT = O x P x B x R",
    factors: { O: "Origin: what generated the carrying", P: "Process: what operation produced continuation", B: "Bound: what kept the carrying answerable", R: "Re-entry: how another run or participant can continue from it" },
    rule: "If any factor is missing, do not claim generative trace or regeneration.",
  },
};

const MCP_INSTRUCTIONS = "The Reality Mechanics Atlas is a dependency-ordered reasoning system carried by structure, NOT a dictionary or glossary. Before any Atlas work, call begin_atlas_session. AI participants should use this MCP as the primary doorway for Atlas work: call begin_atlas_session for orientation, search_atlas only for entry points, then get_entry and get_related before making Atlas claims. A term is located by its relations, not by a definition. Always trace before defining: for any term, call get_entry and read its `structure` FIRST — follow `holds`/`traces` back to what it depends on and `carries` forward to what it opens; use get_related to traverse further. Present where a term sits in the order and what it carries and traces, never as a standalone glossary entry. Where an AI participant wants to change the Atlas, use AI Garden Work: read first, trace first, call write_proposal once, and stop; do not directly rewrite canonical Atlas content or ground entries. Where pressure moves toward determination, use the Ark Run shape: Pressure, Trace, Bound, Determination, Trace state, Next recarry, Unresolved. Where a public participant asks the Atlas, use the Atlas Oracle shape: one input, one Atlas-grounded answer, one inspectable trace, one review path, no raw personal storage by default. Preserve Oracle Carrying Conditions inside the operation: if input, answer, MCP trace, output structure, review, storage, safety, cost, rate limit, or pause conditions do not hold, do not proceed as Oracle. Where continuation or repair is being evaluated, use Generate and Regenerate through the MCP: GT = O x P x B x R, and if Origin, Process, Bound, or Re-entry is missing, do not claim generative trace. search_atlas only finds entry points; the meaning is in the traversal. The order is a loop, not a ladder: when a trace reaches a primitive (empty upstream, e.g. Relation) it does NOT dead-end — the Atlas returns. Relation pairs with Ground and Seed (Seed is the return-side), and the highest order crosses through Practice back to Ground. Follow the return, not a wall; the return is not a repeat.";

const AI_ENTRY_PROTOCOL = {
  title: "AI Entry Protocol",
  purpose: "Orient an AI participant before search so the Atlas is entered as a dependency-ordered reasoning system rather than queried as a glossary.",
  principle: "Enter through the MCP before retrieval. Search finds entry points; get_entry/get_related carry authored structure.",
  entryPath: [
    { step: 1, tool: "get_entry", arguments: { id: "practice.reasoning" }, reason: "Read what a reason is in Atlas terms: traceable support." },
    { step: 2, tool: "get_entry", arguments: { id: "practice.atlas" }, reason: "Read what the Atlas is: the dependency-ordered reasoning system." },
    { step: 3, tool: "get_entry", arguments: { id: "practice.ai-participation" }, reason: "Read the AI-facing participation constraints before contributing." },
    { step: 4, tool: "get_entry", arguments: { id: "practice.ai-garden-work" }, reason: "Read the Garden proposal protocol before suggesting or writing Atlas changes." },
    { step: 5, tool: "get_entry", arguments: { id: "practice.ark-run" }, reason: "Read the runtime shape for carrying pressure through trace, bound, determination, and next posture." },
    { step: 6, tool: "get_entry", arguments: { id: "practice.atlas-oracle" }, reason: "Read the bounded public operation for answering through the Atlas with inspectable trace." },
    { step: 7, tool: "get_entry", arguments: { id: "practice.oracle-carrying-conditions" }, reason: "Read the operational governance conditions that must hold before Oracle answering proceeds." },
    { step: 8, tool: "get_entry", arguments: { id: "practice.generate-and-regenerate" }, reason: "Read the regeneration formula and trace-state check for continuation or repair." },
    { step: 9, tool: "get_entry", arguments: { id: "practice.atlas-note-standard" }, reason: "Read the note grammar: places, holds, pairs, traces, nests, reads, carries." },
    { step: 10, tool: "search_atlas", arguments: { query: "<user term or question>" }, reason: "Use search only after orientation, and treat results as entry points." },
    { step: 11, tool: "get_entry", arguments: { id: "<selected result id>" }, reason: "For the target term, read `structure` before prose." },
    { step: 12, tool: "get_related", arguments: { id: "<selected result id>" }, reason: "Traverse holds/traces upstream and carries downstream before answering." },
  ],
  rules: [
    "Use the MCP before making Atlas claims; do not rely on memory, public page text alone, or inferred definitions.",
    "Do not answer from search results alone.",
    "For every Atlas term, read `structure` first: holds/traces before prose, carries before implications.",
    "Treat holds/traces as what the term depends on; treat carries as what it opens.",
    "Use get_related for structural terms, practice terms, and any claim about dependency.",
    "Present uncertainty as unresolved trace, not as confident definition.",
    "Never invent primitives, carries, or merges. If a relation is not in structure, name it as a possible read rather than an Atlas dependency.",
    "For Atlas changes, use AI Garden Work: propose with write_proposal rather than directly applying canonical edits.",
    "When trace reaches a primitive, follow the return through pairs/practice; do not treat it as a dead end.",
    "For Atlas Oracle answers, return one answer with trace path, primary handle, supporting handles, move made, bound, next recarry, and review options.",
    "For Atlas Oracle answers, governance is operational: if Oracle Carrying Conditions fail, pause, reduce, or return without pretending the Oracle answered.",
  ],
  outputContract: AI_OUTPUT_CONTRACT,
  startingIds: ["practice.reasoning","practice.atlas","practice.ai-participation","practice.ai-garden-work","practice.ark-run","practice.atlas-oracle","practice.oracle-carrying-conditions","practice.generate-and-regenerate","practice.atlas-note-standard"],
};

// ── Tool definitions ───────────────────────────────────────────────────────────

const strOrArr = { anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] };

const TOOLS = [
  { name: "begin_atlas_session",
    description: "Start any Reality Mechanics Atlas session. Returns the protocol, required practice entries, manifest/version, and current governance rules before search or edits.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_manifest",
    description: "Return the identity and current state of the Atlas (entry count, garden stats).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_ai_entry_protocol",
    description: "Return the required entry ritual for AI participants: enter through Reasoning, Atlas, AI Participation, and Atlas Note Standard before search.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "search_atlas",
    description: "Find entry points into the dependency-ordered Atlas by text and metadata. Each result is a place to begin tracing, not a final answer — follow its relations with get_entry/get_related.",
    inputSchema: { type: "object", additionalProperties: false, required: ["query"], properties: {
      query: { type: "string" }, order: strOrArr, garden_status: strOrArr,
      grounded: { type: "boolean" }, limit: { type: "integer", minimum: 1, maximum: SEARCH_MAX } } } },

  { name: "get_entry",
    description: "Return one Atlas entry with its dependency `structure` (holds/traces/carries/pairs/nests) as the primary field. Relation-first: trace the structure rather than reading the term as a definition.",
    inputSchema: { type: "object", additionalProperties: false, properties: { id: { type: "string" } } } },

  { name: "get_related",
    description: "Traverse an entry's typed, directional dependency relations: upstream (holds/traces — what it depends on), downstream (carries — what it opens), lateral (pairs), nesting. The core navigation tool.",
    inputSchema: { type: "object", additionalProperties: false, required: ["id"], properties: { id: { type: "string" } } } },

  { name: "get_entry_by_title",
    description: "Look up one or more Atlas entries by exact title (case-insensitive).",
    inputSchema: { type: "object", additionalProperties: false, required: ["title"], properties: { title: { type: "string" } } } },

  { name: "list_entries",
    description: "List entries by metadata filters. Supports pagination via offset.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      order: strOrArr, garden_status: strOrArr, grounded: { type: "boolean" },
      limit: { type: "integer", minimum: 1, maximum: LIST_MAX },
      offset: { type: "integer", minimum: 0 } } } },

  { name: "get_recent_changes",
    description: "Return entries updated after a given date.",
    inputSchema: { type: "object", additionalProperties: false, required: ["since"], properties: {
      since: { type: "string", description: "ISO date" },
      limit: { type: "integer", minimum: 1, maximum: LIST_MAX } } } },

  { name: "list_garden_proposals",
    description: "Read the public Garden proposal queue so an AI can avoid duplicating pending, approved, or needs-preparation work before planting a new proposal.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      status: strOrArr,
      entry_id: { type: "string", description: "Filter by proposal_for entry id" },
      limit: { type: "integer", minimum: 1, maximum: LIST_MAX } } } },

  // ── Write tools ──────────────────────────────────────────────────────────────

  { name: "ground_entry",
    description: "Mark an entry as grounded (garden_status → rooted, grounded → true). Only call this after Reuben has explicitly approved grounding. Cannot be undone via MCP — requires direct D1 edit.",
    inputSchema: { type: "object", additionalProperties: false, required: ["id"], properties: {
      id: { type: "string", description: "Entry ID to ground" } } } },

  { name: "update_entry_section",
    description: "Update one section of an entry's content (e.g. ## Reads, ## Places). Replaces the named section body. Does not change structure, grounded status, or garden_status.",
    inputSchema: { type: "object", additionalProperties: false, required: ["id", "section", "new_text"], properties: {
      id: { type: "string" },
      section: { type: "string", description: "Section heading name, e.g. 'Reads' or 'Places'" },
      new_text: { type: "string", description: "Complete replacement text for the section body (without the ## heading line)" } } } },

  { name: "write_proposal",
    description: "Write a tending proposal for an entry — records what was found and what is proposed, with status 'pending'. Reuben reviews and grounds via the garden page. Use this instead of update_entry_section when you are uncertain.",
    inputSchema: { type: "object", additionalProperties: false, required: ["entry_id", "kind", "summary", "proposed_changes", "confidence"], properties: {
      entry_id: { type: "string" },
      kind: { type: "string", enum: ["reciprocity", "thin-section", "alignment", "drift", "clean-pass"] },
      summary: { type: "string", description: "One sentence describing what was found" },
      proposed_changes: { type: "string", description: "Concrete proposed edit. Prefer: Section: <existing section name>, blank line, Proposed replacement:, then the complete replacement body for that section." },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
      reciprocity_issues: { type: "string", description: "Description of any carry/trace breaks found, or 'None'" },
      garden_password: { type: "string", description: "Optional fallback when the MCP client cannot send Authorization headers. Ask Reuben for the Garden password before calling write_proposal." } } } },
];

// ── Tool dispatch ─────────────────────────────────────────────────────────────

const WRITE_TOOLS = new Set(["ground_entry", "update_entry_section", "write_proposal"]);

function checkAuth(authToken, env) {
  if (!env.GARDEN_SECRET) return true; // secret not configured — allow (dev mode)
  return authToken === env.GARDEN_SECRET;
}

function checkProposalAuth(args, authToken, env) {
  if (checkAuth(authToken, env)) return true;
  return !!env.GARDEN_SECRET && String(args?.garden_password || "") === env.GARDEN_SECRET;
}

async function callTool(name, args, env, authToken) {
  if (!env.ATLAS_DB) throw new Error("ATLAS_DB binding not configured");

  // ── begin_atlas_session ──
  if (name === "begin_atlas_session") {
    const startingIds = AI_ENTRY_PROTOCOL.startingIds;
    const placeholders = startingIds.map(() => "?").join(",");
    const rows = await dbAll(env,
      `SELECT * FROM entries WHERE id IN (${placeholders})`, startingIds);
    const byId = makeById(rows);
    return {
      purpose: "Begin a Reality Mechanics Atlas session before search, answers, Oracle work, or Atlas change proposals.",
      manifest: await manifest(env),
      protocol: AI_ENTRY_PROTOCOL,
      requiredPracticeEntries: startingIds
        .map(id => sessionEntry(byId.get(id)))
        .filter(Boolean),
      governance: {
        firstMove: "Call begin_atlas_session before Atlas work.",
        searchRule: "Search finds entry points only; do not answer from search results alone.",
        structureRule: "Read structure before prose. Use holds/traces for what an entry depends on and carries for what it opens.",
        dependencyRule: "Use get_related before making dependency, carry, trace, pair, or nesting claims.",
        changeRule: "Use write_proposal for suggested Atlas changes unless Reuben explicitly approves direct editing.",
        gardenQueueRule: "Call list_garden_proposals before write_proposal so existing Garden work is not duplicated.",
        writeProposalAuth: "Prefer hidden Authorization. If the client cannot send headers, ask Reuben for the Garden password and include garden_password in write_proposal.",
        directEditRule: "Do not call update_entry_section unless Reuben explicitly approves direct editing.",
        groundingRule: "Never call ground_entry unless Reuben explicitly approves grounding.",
      },
      next: {
        forQuestions: ["search_atlas", "get_entry", "get_related"],
        forKnownTerms: ["get_entry_by_title", "get_entry", "get_related"],
        forSuggestedChanges: ["get_entry", "get_related", "list_garden_proposals", "write_proposal"],
      },
    };
  }

  // ── get_manifest ──
  if (name === "get_manifest") {
    return manifest(env);
  }

  // ── get_ai_entry_protocol ──
  if (name === "get_ai_entry_protocol") return AI_ENTRY_PROTOCOL;

  // ── search_atlas ──
  if (name === "search_atlas") {
    const query = String(args.query || "").trim();
    if (!query) return { error: "query is required" };
    if (query.length > MAX_QUERY) return { error: `query too long (max ${MAX_QUERY})` };
    const limit = Math.min(Math.max(parseInt(args.limit) || SEARCH_DEFAULT, 1), SEARCH_MAX);

    // Build WHERE clauses for filters
    const clauses = [];
    const params = [];

    // FTS search
    clauses.push("e.id IN (SELECT id FROM entries_fts WHERE entries_fts MATCH ?)");
    params.push(query.replace(/['"*]/g, " ").trim() + "*");

    if (args.order) {
      const orders = Array.isArray(args.order) ? args.order : [args.order];
      clauses.push(`e.entry_order IN (${orders.map(() => "?").join(",")})`);
      params.push(...orders);
    }
    if (args.garden_status) {
      const gs = Array.isArray(args.garden_status) ? args.garden_status : [args.garden_status];
      clauses.push(`e.garden_status IN (${gs.map(() => "?").join(",")})`);
      params.push(...gs);
    }
    if (args.grounded !== undefined) {
      clauses.push("e.grounded = ?");
      params.push(args.grounded ? 1 : 0);
    }

    const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";
    params.push(limit);

    const rows = await dbAll(env,
      `SELECT e.id, e.title, e.excerpt, e.status, e.garden_status, e.grounded,
              e.entry_order, e.entry_type, e.source_path, e.public_url, e.updated, e.content_hash
       FROM entries e ${where} LIMIT ?`, params);

    return {
      query, count: rows.length,
      results: rows.map(r => ({
        id: r.id, title: r.title, excerpt: r.excerpt,
        status: r.status, gardenStatus: r.garden_status, grounded: r.grounded === 1,
        order: r.entry_order, type: r.entry_type,
        sourcePath: r.source_path, publicUrl: r.public_url,
        updated: r.updated, contentHash: r.content_hash,
      })),
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
      const allIds = [
        ...(e.structure.holds || []),
        ...(e.structure.traces || []),
        ...(e.structure.carries || []),
        ...(e.structure.pairs || []),
        ...(e.structure.nests || []),
        ...(e.structure.reads || []),
      ].filter(Boolean);

      if (allIds.length) {
        const placeholders = allIds.map(() => "?").join(",");
        const related = await dbAll(env,
          `SELECT id, title, public_url FROM entries WHERE id IN (${placeholders})`, allIds);
        const byId = makeById(related);
        resolvedStructure = {
          holds:   resolveIds(e.structure.holds,   byId),
          traces:  resolveIds(e.structure.traces,  byId),
          carries: resolveIds(e.structure.carries, byId),
          pairs:   resolveIds(e.structure.pairs,   byId),
          nests:   resolveIds(e.structure.nests,   byId),
          reads:   resolveIds(e.structure.reads,   byId),
          _source: "d1-frontmatter",
        };
      }
    }

    return {
      id: e.id, title: e.title, publicUrl: e.public_url,
      status: e.status, gardenStatus: e.garden_status, grounded: e.grounded,
      order: e.entry_order, type: e.entry_type,
      structure: resolvedStructure,
      content: e.content,
      headings: e.headings,
      wordCount: e.word_count,
      updatedAt: e.updated,
      _read_as: READ_AS,
    };
  }

  // ── get_related ──
  if (name === "get_related") {
    const id = String(args.id || "").trim();
    if (!id) return { error: "id is required" };

    const row = await dbFirst(env, "SELECT * FROM entries WHERE id = ?", [id]);
    if (!row) return { notFound: true, id };
    const e = parseEntry(row);

    let upstream = { holds: [], traces: [] };
    let downstream = { carries: [] };
    let lateral = { pairs: [] };
    let nesting = { nests: [] };

    if (e.structure) {
      const allIds = [
        ...(e.structure.holds || []), ...(e.structure.traces || []),
        ...(e.structure.carries || []), ...(e.structure.pairs || []),
        ...(e.structure.nests || []),
      ].filter(Boolean);

      if (allIds.length) {
        const placeholders = allIds.map(() => "?").join(",");
        const related = await dbAll(env,
          `SELECT id, title, public_url FROM entries WHERE id IN (${placeholders})`, allIds);
        const byId = makeById(related);
        upstream  = { holds: resolveIds(e.structure.holds, byId), traces: resolveIds(e.structure.traces, byId) };
        downstream = { carries: resolveIds(e.structure.carries, byId) };
        lateral   = { pairs: resolveIds(e.structure.pairs, byId) };
        nesting   = { nests: resolveIds(e.structure.nests, byId) };
      }
    }

    const result = {
      id, title: e.title,
      upstream, downstream, lateral, nesting,
      note: "Upstream (holds/traces) is what this depends on — trace it back; downstream (carries) is what it opens.",
    };

    if (upstream.holds.length === 0 && upstream.traces.length === 0) {
      result.atPrimitive = true;
      result.return = "Trace has reached a primitive — this is NOT a dead end. The Atlas returns: follow lateral.pairs (e.g. Ground / Seed, the return-side) and the Practice crossing back to Ground. The order is a loop, and the return is not a repeat.";
    }

    return result;
  }

  // ── get_entry_by_title ──
  if (name === "get_entry_by_title") {
    const query = String(args.title || "").trim();
    if (!query) return { error: "title is required" };

    const rows = await dbAll(env,
      "SELECT id, title, entry_order, entry_type, status, garden_status, source_path, public_url, content_hash FROM entries WHERE title = ? COLLATE NOCASE",
      [query]);

    if (!rows.length) {
      // Suggest near-matches
      const suggestions = await dbAll(env,
        "SELECT id, title, entry_order FROM entries WHERE title LIKE ? COLLATE NOCASE LIMIT 5",
        [`%${query}%`]);
      return { notFound: true, query, suggestions: suggestions.map(r => ({ id: r.id, title: r.title, order: r.entry_order })) };
    }

    return {
      query, count: rows.length, collision: rows.length > 1,
      entries: rows.map(r => ({
        id: r.id, title: r.title, order: r.entry_order, type: r.entry_type,
        status: r.status, gardenStatus: r.garden_status,
        sourcePath: r.source_path, publicUrl: r.public_url, contentHash: r.content_hash,
      })),
    };
  }

  // ── list_entries ──
  if (name === "list_entries") {
    const limit = Math.min(Math.max(parseInt(args.limit) || LIST_DEFAULT, 1), LIST_MAX);
    const offset = Math.max(parseInt(args.offset) || 0, 0);
    const clauses = [];
    const params = [];

    if (args.order) {
      const orders = Array.isArray(args.order) ? args.order : [args.order];
      clauses.push(`entry_order IN (${orders.map(() => "?").join(",")})`);
      params.push(...orders);
    }
    if (args.garden_status) {
      const gs = Array.isArray(args.garden_status) ? args.garden_status : [args.garden_status];
      clauses.push(`garden_status IN (${gs.map(() => "?").join(",")})`);
      params.push(...gs);
    }
    if (args.grounded !== undefined) {
      clauses.push("grounded = ?");
      params.push(args.grounded ? 1 : 0);
    }

    const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";
    const countRow = await dbFirst(env, `SELECT COUNT(*) as n FROM entries ${where}`, params);
    const rows = await dbAll(env,
      `SELECT id, title, status, garden_status, grounded, entry_order, public_url, source_path, updated FROM entries ${where} ORDER BY source_path, id LIMIT ? OFFSET ?`,
      [...params, limit, offset]);

    return {
      total: countRow?.n || 0, count: rows.length, offset,
      hasMore: offset + rows.length < (countRow?.n || 0),
      entries: rows.map(r => ({
        id: r.id, title: r.title, status: r.status,
        gardenStatus: r.garden_status, grounded: r.grounded === 1,
        order: r.entry_order, publicUrl: r.public_url,
        sourcePath: r.source_path, updated: r.updated,
      })),
    };
  }

  // ── get_recent_changes ──
  if (name === "get_recent_changes") {
    const since = String(args.since || "");
    const limit = Math.min(Math.max(parseInt(args.limit) || LIST_DEFAULT, 1), LIST_MAX);
    const rows = await dbAll(env,
      "SELECT id, title, updated, public_url, garden_status, grounded FROM entries WHERE updated > ? ORDER BY updated DESC LIMIT ?",
      [since, limit]);
    return {
      count: rows.length,
      entries: rows.map(r => ({ id: r.id, title: r.title, updated: r.updated, publicUrl: r.public_url, gardenStatus: r.garden_status, grounded: r.grounded === 1 })),
    };
  }

  // ── list_garden_proposals ──
  if (name === "list_garden_proposals") {
    const limit = Math.min(Math.max(parseInt(args.limit) || LIST_DEFAULT, 1), LIST_MAX);
    const res = await fetch(`${env.GARDEN_URL || DEFAULT_GARDEN_URL}/api/garden/proposals`, {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || `garden_http_${res.status}` };

    const wantedStatuses = args.status
      ? new Set((Array.isArray(args.status) ? args.status : [args.status]).map(String))
      : null;
    const entryId = String(args.entry_id || "").trim();
    const proposals = (data.proposals || [])
      .filter(p => !wantedStatuses || wantedStatuses.has(String(p.status || "")))
      .filter(p => !entryId || p.proposal_for === entryId)
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        entryId: p.proposal_for || "",
        term: p.term || "",
        status: p.status || "",
        kind: p.kind || "",
        confidence: p.confidence || "",
        summary: p.summary || "",
        order: p.order || "",
        proposedAt: p.proposed_at || "",
        lightCount: Number(p.light_count || 0),
        shadeCount: Number(p.shade_count || 0),
        hasPreparedReplacement: /(^|\n)Section:\s*.+\n\nProposed replacement:\s*\n/i.test(String(p.proposed_changes || "")),
      }));
    return {
      count: proposals.length,
      proposals,
      note: "Use this before write_proposal to avoid duplicating work already in the Garden.",
    };
  }

  // ── auth guard for write tools ──
  if (WRITE_TOOLS.has(name) && !checkAuth(authToken, env)) {
    if (name !== "write_proposal" || !checkProposalAuth(args, authToken, env)) {
      return { error: "unauthorized", message: "Write tools require Authorization: Bearer <GARDEN_SECRET>. write_proposal may also include garden_password when the MCP client cannot send headers." };
    }
  }

  // ── ground_entry ──
  if (name === "ground_entry") {
    const id = String(args.id || "").trim();
    if (!id) return { error: "id is required" };

    const existing = await dbFirst(env, "SELECT id, title, garden_status, grounded FROM entries WHERE id = ?", [id]);
    if (!existing) return { error: "entry not found", id };
    if (existing.grounded === 1) return { alreadyGrounded: true, id, title: existing.title };

    const now = new Date().toISOString();
    await dbRun(env,
      "UPDATE entries SET grounded = 1, garden_status = 'rooted', grounded_at = ?, updated = ? WHERE id = ?",
      [now, now.slice(0, 10), id]);

    return { ok: true, id, title: existing.title, groundedAt: now, previousStatus: existing.garden_status };
  }

  // ── update_entry_section ──
  if (name === "update_entry_section") {
    const id = String(args.id || "").trim();
    const section = String(args.section || "").trim();
    const newText = String(args.new_text || "").trim();
    if (!id || !section || !newText) return { error: "id, section, and new_text are required" };

    const row = await dbFirst(env, "SELECT id, title, content, grounded FROM entries WHERE id = ?", [id]);
    if (!row) return { error: "entry not found", id };

    // Replace the named section body in content
    const heading = `## ${section}`;
    const content = row.content || "";
    const sectionRe = new RegExp(`(##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n)([\\s\\S]*?)(?=\\n##\\s|$)`, "i");
    const m = content.match(sectionRe);
    if (!m) return { error: `Section '${section}' not found in entry ${id}` };

    const updated = content.replace(sectionRe, `$1${newText}\n`);
    const now = new Date().toISOString();
    await dbRun(env,
      "UPDATE entries SET content = ?, tended_at = ?, updated = ? WHERE id = ?",
      [updated, now, now.slice(0, 10), id]);

    // Keep the entry write authoritative. Search index repair is best-effort so
    // a damaged FTS virtual table cannot block Garden transplants.
    let searchIndexWarning = null;
    try {
      await dbRun(env, "INSERT INTO entries_fts(entries_fts, rowid, id, title, plain_text, excerpt) VALUES('delete', (SELECT rowid FROM entries WHERE id = ?), ?, ?, '', '')", [id, id, row.title]);
    } catch (error) {
      searchIndexWarning = error.message || "search_index_refresh_failed";
      console.log("search_index_refresh_failed", searchIndexWarning);
    }

    return { ok: true, id, title: row.title, section, tendedAt: now, searchIndexWarning };
  }

  // ── write_proposal ──
  if (name === "write_proposal") {
    const { entry_id, kind, summary, proposed_changes, confidence, reciprocity_issues } = args;
    if (!entry_id || !kind || !summary) return { error: "entry_id, kind, and summary are required" };

    const entry = await dbFirst(env, "SELECT id, title, entry_order FROM entries WHERE id = ?", [entry_id]);
    if (!entry) return { error: "entry not found", entry_id };

    // Log to garden API on main worker
    const proposalId = `${entry_id.replace(/\./g, "-")}-${Date.now()}`;
    const now = new Date().toISOString();
    let gardenLogError = null;

    try {
      const logRes = await fetch("https://realitymechanics.nz/api/garden/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.GARDEN_SECRET ? { "Authorization": `Bearer ${env.GARDEN_SECRET}` } : {}),
        },
        body: JSON.stringify({
          proposal_id: proposalId,
          term: entry.title,
          proposal_for: entry_id,
          order: entry.entry_order || "",
          kind, confidence, summary,
          proposed_changes: proposed_changes || "",
          reciprocity_issues: reciprocity_issues || "None",
          proposed_at: now,
          status: "pending",
        }),
      });
      if (!logRes.ok) throw new Error(`garden_log_http_${logRes.status}`);
    } catch (e) {
      gardenLogError = e.message;
      console.log("garden_log_error", gardenLogError);
    }

    // Mark as tended
    await dbRun(env, "UPDATE entries SET tended_at = ? WHERE id = ?", [now, entry_id]);

    if (gardenLogError) {
      return {
        error: "garden_log_failed",
        message: gardenLogError,
        proposalId,
        entryId: entry_id,
        title: entry.title,
      };
    }

    return {
      ok: true, proposalId, entryId: entry_id, title: entry.title,
      kind, confidence, proposedAt: now,
      note: "Proposal logged to garden page for Reuben's review.",
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
        return ok(id, { tools: TOOLS });
      case "tools/call": {
        const name = params.name;
        if (!TOOLS.some(t => t.name === name)) return fail(id, -32601, `unknown tool: ${name}`);
        const result = await callTool(name, params.arguments || {}, env, ctx.authToken || "");
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
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname !== "/mcp")
      return json({ name: SERVER_INFO.name, version: SERVER_INFO.version,
        transport: "streamable-http", endpoint: "/mcp", tools: TOOLS.map(t => t.name) }, 200);

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
    headers: { "content-type": "application/json; charset=utf-8", ...cors },
  });
}
