/**
 * Reality Mechanics Atlas — MCP server backed by Cloudflare D1.
 *
 * Reads generated Atlas data from D1.
 * Atlas edits happen in GitHub first; D1 is rebuilt from the repository.
 * Streamable-HTTP MCP transport at POST /mcp.
 */

import {
  ATLAS_STRUCTURE_CONTRACT,
  CONTRACT_SUMMARY,
  LAG_STATES,
  RATIO_CONTRACT,
  TRANSLATION_SURFACES,
  WORKER_ORDER,
  relationBetween,
  structureContractForSurface,
} from "../../atlas-structure-contract.mjs";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "reality-mechanics-atlas", version: "2.3.0" };
const MAX_QUERY = 200;
const SEARCH_MAX = 25, SEARCH_DEFAULT = 8;
const LIST_MAX = 200, LIST_DEFAULT = 50;
const GITHUB_REPO_URL = "https://github.com/reubenmunro/reality-mechanics";
const GITHUB_BRANCH = "main";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, CF-Access-Client-Id, CF-Access-Client-Secret",
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

function plainTextFromContent(content) {
  return String(content || "")
    .replace(/\r\n/g, "\n")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias || target)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromText(text, max = 180) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
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

// Walk upstream holds/traces chains from a starting entry ID up to maxDepth hops.
// Returns a Set of all upstream entry IDs reachable within that depth.
async function getUpstreamIds(env, startId, maxDepth = 3) {
  const visited = new Set([startId]);
  const upstream = new Set();
  let frontier = [startId];

  for (let depth = 0; depth < maxDepth && frontier.length > 0; depth++) {
    const placeholders = frontier.map(() => "?").join(",");
    const rows = await dbAll(env,
      `SELECT id, structure FROM entries WHERE id IN (${placeholders})`, frontier);

    const nextFrontier = [];
    for (const row of rows) {
      const struct = row.structure ? JSON.parse(row.structure) : null;
      if (!struct) continue;
      const upIds = [...(struct.holds || []), ...(struct.traces || [])].filter(Boolean);
      for (const uid of upIds) {
        upstream.add(uid);
        if (!visited.has(uid)) {
          visited.add(uid);
          nextFrontier.push(uid);
        }
      }
    }
    frontier = nextFrontier;
  }

  return upstream;
}

async function manifest(env) {
  const counts = await dbAll(env,
    "SELECT garden_status, COUNT(*) as n FROM entries GROUP BY garden_status");
  const total = await dbFirst(env, "SELECT COUNT(*) as n FROM entries");
  const stats = {};
  counts.forEach(r => { stats[r.garden_status || "unknown"] = r.n; });
  return {
    atlasVersion: "d1-live",
    note: "Atlas reads come from generated D1. GitHub markdown/frontmatter is the editable source.",
    entryCount: total?.n || 0,
    maturityStats: stats,
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
    layers: LAYER_CONTRACT.layers,
    operatorContract: OPERATOR_CONTRACT,
    _read_as: READ_AS,
  };
}

// ── Content / static data ──────────────────────────────────────────────────────

const LAYER_CONTRACT = {
  sourceOfTruth: ATLAS_STRUCTURE_CONTRACT.sourceRule,
  layers: TRANSLATION_SURFACES,
  workerOrder: [
    "structure: inspect the one canonical structure before reading any translation",
    ...WORKER_ORDER.map((step) => `${step.key}: ${step.role}`),
  ],
  workerOrderDetail: WORKER_ORDER,
  lagStates: LAG_STATES,
  ratio: RATIO_CONTRACT,
  rule: ATLAS_STRUCTURE_CONTRACT.canonicalRule,
};

const OPERATOR_CONTRACT = {
  invariant: "Where an Atlas term names one of the note-grammar operations, the term must remain answerable to that operation's edge behavior.",
  families: [
    { key: "hold", edge: "holds", termForms: ["Hold", "Holding"], read: "edge shows dependency held; term shows held condition gathered" },
    { key: "trace", edge: "traces", termForms: ["Trace", "Tracing", "Retracing"], read: "edge shows return path; term shows return as condition or practice" },
    { key: "carry", edge: "carries", termForms: ["Carry", "Carrying", "Recarry"], read: "edge shows forward passage; term shows carrying capacity or mass gathered" },
    { key: "pair", edge: "pairs", termForms: ["Pair", "Pairing"], read: "edge shows contrast/coupling; term shows paired condition gathered" },
    { key: "nest", edge: "nests", termForms: ["Nest", "Nesting"], read: "edge shows membership/enclosure; term shows nested condition gathered" },
    { key: "read", edge: "reads", termForms: ["Read", "Reading"], read: "edge shows readability relation; term shows recognition as condition gathered" },
    { key: "place", edge: "places", termForms: ["Place", "Placing", "Locating"], read: "edge/section places the term; term shows placement as operation gathered" },
  ],
  rule: "For operator terms, inspect both forms: the edge behavior and the term prose/structure. If they diverge, repair the GitHub source before syncing generated D1 data.",
};

const READ_AS = `The Atlas is a dependency-ordered reading system carried by one canonical structure, not a dictionary. ${CONTRACT_SUMMARY} Frontmatter is AI language; prose is human language. Read in order: locate the reference frame, read the active ratio, trace what had to already be true, form a retraceable reason, then choose a bounded continuation.`;

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

const MCP_INSTRUCTIONS = `The Reality Mechanics Atlas is a dependency-ordered reading system carried by one canonical structure, NOT a dictionary or glossary. Before any Atlas work, call begin_atlas_session. Use this MCP as a read doorway: begin_atlas_session for orientation, search_atlas only for entry points, then get_entry and get_related before making Atlas claims. A term is located by its relations, not a definition. ${CONTRACT_SUMMARY} Frontmatter is AI language; prose is human language. Always trace before defining: call get_entry and read structure FIRST — follow holds/traces back to what a term depends on and carries forward to what it opens; use get_related to traverse further. For ratio work, use read_ratio: name the reference frame, relation, trace, and continuation pressure. Prose may communicate structure, but it does not override structure. Search only finds entry points; the meaning is in traversal. The order is a loop, not a ladder: when a trace reaches a primitive (e.g. Relation) it does NOT dead-end — the Atlas returns. Follow the return, not a wall. For field-to-field structural translation: use get_field_terms to enumerate a field's terms, find_shared_ground to identify shared first/second-order Atlas terms (the translation surface), and translate_reason to get a structured map from reason text to target-field structural equivalents. The Atlas supplies the structure; you generate and verify the translated reason via Translation Invariance.`;

const AI_ENTRY_PROTOCOL = {
  title: "AI Entry Protocol",
  purpose: "Orient an AI participant before search so the Atlas is entered as a dependency-ordered reasoning system rather than queried as a glossary.",
  principle: "Enter through the MCP before retrieval. Search finds entry points; get_entry/get_related carry authored structure.",
  structureContract: ATLAS_STRUCTURE_CONTRACT,
  layerContract: LAYER_CONTRACT,
  operatorContract: OPERATOR_CONTRACT,
  entryPath: [
    { step: 1, tool: "get_entry", arguments: { id: "practice.atlas" }, reason: "Read what the Atlas is: the dependency-ordered reasoning system." },
    { step: 2, tool: "get_entry", arguments: { id: "practice.ai-participation" }, reason: "Read the AI-facing participation constraints before contributing." },
    { step: 3, tool: "get_entry", arguments: { id: "practice.atlas-note-standard" }, reason: "Read the note grammar: holds, pairs, traces, nests, reads, carries." },
    { step: 4, tool: "search_atlas", arguments: { query: "<user term or question>" }, reason: "Use search only after orientation, and treat results as entry points." },
    { step: 5, tool: "get_entry", arguments: { id: "<selected result id>" }, reason: "For the target term, read `structure` before prose." },
    { step: 6, tool: "get_related", arguments: { id: "<selected result id>" }, reason: "Traverse holds/traces upstream and carries downstream before answering." },
  ],
  rules: [
    "Use the MCP before making Atlas claims; do not rely on memory, public page text alone, or inferred definitions.",
    "Do not answer from search results alone.",
    "For every Atlas term, read `structure` first: holds/traces before prose, carries before implications.",
    "Treat GitHub markdown/frontmatter as the editable Atlas source of truth; D1 is a generated read model for AI and worker reads.",
    ATLAS_STRUCTURE_CONTRACT.canonicalRule,
    ATLAS_STRUCTURE_CONTRACT.translationRule,
    "Do not edit Atlas terms directly in D1. Recover D1-only data into repository files, then sync generated data back into D1.",
    "Treat prose as human language: read it after structure, and keep it answerable to structure.",
    "If prose and structure disagree, name the mismatch and repair the GitHub source rather than silently reconciling it.",
    "For the seven operator families, compare edge behavior with term behavior: the edge shows operation in passage; the term shows operation gathered as condition.",
    "Treat holds/traces as what the term depends on; treat carries as what it opens.",
    "Use get_related for structural terms, practice terms, and any claim about dependency.",
    "Present uncertainty as unresolved trace, not as confident definition.",
    "Never invent primitives, carries, or merges. If a relation is not in structure, name it as a possible read rather than an Atlas dependency.",
    "For Atlas changes, edit the GitHub repository first. This MCP is read-only.",
    "When trace reaches a primitive, follow the return through pairs/practice; do not treat it as a dead end.",
  ],
  outputContract: AI_OUTPUT_CONTRACT,
  startingIds: ["practice.atlas", "practice.ai-participation", "practice.atlas-note-standard"],
};

// ── Tool definitions ───────────────────────────────────────────────────────────

const strOrArr = { anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] };

const TOOLS = [
  { name: "begin_atlas_session",
    description: "Start any Reality Mechanics Atlas session. Returns the protocol, required practice entries, manifest/version, and current governance rules before search or edits.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_manifest",
    description: "Return the identity and current state of the Atlas read model.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_ai_entry_protocol",
    description: "Return the required entry ritual for AI participants: enter through Reasoning, Atlas, AI Participation, and Atlas Note Standard before search.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false } },

  { name: "get_structure_contract",
    description: "Return the canonical Atlas structure contract: one structure, many translations, explicit ratio reads, and lag-aware worker order.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      surface: { type: "string", description: "Optional translation surface: structure, frontmatter, prose, mcp, field, calibration, d1" } } } },

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

  { name: "open_source_for_entry",
    description: "Return the GitHub source file for an Atlas entry after reading it through D1. This is a read-only bridge from semantic navigation to source editing.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      id: { type: "string", description: "Atlas entry id, e.g. first.ratio" },
      title: { type: "string", description: "Exact Atlas title when id is not known, e.g. Ratio" } } } },

  { name: "read_ratio",
    description: "Read a ratio between two Atlas entries from a declared reference frame. Returns the structural relation, reciprocal relation, and continuation pressure without creating a new dependency.",
    inputSchema: { type: "object", additionalProperties: false, required: ["left_id", "right_id"], properties: {
      left_id: { type: "string" },
      right_id: { type: "string" },
      reference_frame: { type: "string", description: "Frame from which the ratio is being read, e.g. reading-order, field, calibration, human-prose, ai-frontmatter" } } } },

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

  // ── Translation tools ────────────────────────────────────────────────────────

  { name: "get_field_terms",
    description: "Return all entries belonging to a named field or domain by source_path match. Use to enumerate a field's terms before finding shared ground between fields or translating a reason across them. Known fields: 'Society', 'Natural World', 'Knowledge', 'Life', 'Expression', 'Making', 'Body', 'Sustenance', 'Faith', 'Place', 'Cognition', 'Our Story', 'Relational Participation'.",
    inputSchema: { type: "object", additionalProperties: false, required: ["field_name"], properties: {
      field_name: { type: "string", description: "Field name as in the vault path, e.g. 'Society', 'Natural World', 'Knowledge'" },
      limit: { type: "integer", minimum: 1, maximum: LIST_MAX } } } },

  { name: "find_shared_ground",
    description: "Given two or more entry IDs, walk their upstream holds/traces chains (up to 3 hops) and return the first/second-order Atlas terms that appear in all chains. The intersection is the genuine structural translation surface between any two terms or fields — not metaphor, shared dependency.",
    inputSchema: { type: "object", additionalProperties: false, required: ["ids"], properties: {
      ids: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 10,
             description: "Two or more entry IDs to find shared upstream ground for" } } } },

  { name: "translate_reason",
    description: "Translate a reason (traceable support) from one field register into another using shared Atlas grounding. FTS-matches the reason text to source Atlas terms, traces upstream to find the shared first/second-order translation surface, then returns the target field's terms that hold those same structural conditions. Output is a structured map only — the calling AI generates the target-field reason and verifies it via Translation Invariance.",
    inputSchema: { type: "object", additionalProperties: false, required: ["reason", "target_field"], properties: {
      reason: { type: "string", description: "The reason to translate — natural language traceable support" },
      target_field: { type: "string", description: "Target field name, e.g. 'Natural World', 'Knowledge', 'Society'" },
      source_field: { type: "string", description: "Optional: narrow FTS to a specific source field" } } } },
];

// ── Tool dispatch ─────────────────────────────────────────────────────────────

function advertisedTools() {
  return TOOLS;
}

async function callTool(name, args, env) {
  if (!env.ATLAS_DB) throw new Error("ATLAS_DB binding not configured");

  // ── begin_atlas_session ──
  if (name === "begin_atlas_session") {
    const startingIds = AI_ENTRY_PROTOCOL.startingIds;
    const placeholders = startingIds.map(() => "?").join(",");
    const rows = await dbAll(env,
      `SELECT * FROM entries WHERE id IN (${placeholders})`, startingIds);
    const byId = makeById(rows);
    return {
      purpose: "Begin a Reality Mechanics Atlas session before search or traversal.",
      manifest: await manifest(env),
      protocol: AI_ENTRY_PROTOCOL,
      requiredPracticeEntries: startingIds
        .map(id => sessionEntry(byId.get(id)))
        .filter(Boolean),
      governance: {
        firstMove: "Call begin_atlas_session before Atlas work.",
        searchRule: "Search finds entry points only; do not answer from search results alone.",
        structureRule: ATLAS_STRUCTURE_CONTRACT.canonicalRule,
        layerRule: `Frontmatter is AI language; prose is human language. ${ATLAS_STRUCTURE_CONTRACT.translationRule}`,
        lagRule: ATLAS_STRUCTURE_CONTRACT.lagRule,
        ratioRule: RATIO_CONTRACT.rule,
        operatorRule: OPERATOR_CONTRACT.invariant,
        workerOrder: LAYER_CONTRACT.workerOrder,
        dependencyRule: "Use get_related before making dependency, carry, trace, pair, or nesting claims.",
        changeRule: "This MCP is read-only. Atlas edits start in GitHub and reach D1 only through repo-to-D1 sync.",
        translationRule: "For field-to-field translation: use get_field_terms to enumerate a field's terms, find_shared_ground to locate the shared first/second-order Atlas terms (the translation surface), translate_reason to get a structured map from reason text to target-field structural equivalents. AI generates the translated reason; the Atlas provides structural grounding only. Verify via Translation Invariance: retrace the generated reason back to the shared ground terms and locate any loss.",
        translationCapability: "The Atlas spans multiple fields (Society, Natural World, Knowledge, Life, Expression, Making, etc.) through shared first/second-order terms. Two field-local terms that trace back to the same first/second-order Atlas conditions are structurally equivalent — not metaphorically. Translation holds where the dependency trace is recoverable; where it fails, the failure names what depended on field-local medium rather than shared structure.",
        aiRole: "AI generates reasons (traceable support). The Atlas provides structural grounding. Translation between fields is structural: AI locates shared Atlas grounding, generates a reason in target-field terms, and verifies via Translation Invariance. The Atlas does not generate prose — it supplies the dependency structure the prose must answer to.",
      },
      next: {
        forQuestions: ["search_atlas", "get_entry", "get_related"],
        forKnownTerms: ["get_entry_by_title", "get_entry", "get_related"],
        forFieldTranslation: ["get_field_terms", "find_shared_ground", "translate_reason"],
      },
    };
  }

  // ── get_structure_contract ──
  if (name === "get_structure_contract") {
    return structureContractForSurface(args.surface || "mcp");
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
      sourcePath: e.source_path,
      source: githubSourceLinks(e.source_path),
      status: e.status, gardenStatus: e.garden_status, grounded: e.grounded,
      order: e.entry_order, type: e.entry_type,
      structure: resolvedStructure,
      layers: LAYER_CONTRACT.layers,
      operatorContract: OPERATOR_CONTRACT,
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

  // ── open_source_for_entry ──
  if (name === "open_source_for_entry") {
    const id = String(args.id || "").trim();
    const title = String(args.title || "").trim();
    if (!id && !title) return { error: "id or title is required" };

    const rows = id
      ? await dbAll(env,
          "SELECT id, title, source_path, public_url, updated, content_hash FROM entries WHERE id = ?",
          [id])
      : await dbAll(env,
          "SELECT id, title, source_path, public_url, updated, content_hash FROM entries WHERE title = ? COLLATE NOCASE",
          [title]);

    if (!rows.length) return { notFound: true, id: id || null, title: title || null };

    const entries = rows.map((row) => {
      const source = githubSourceLinks(row.source_path);
      return {
        id: row.id,
        title: row.title,
        publicUrl: row.public_url,
        updated: row.updated,
        contentHash: row.content_hash,
        sourcePath: row.source_path || null,
        source,
        editable: !!source,
      };
    });

    return {
      query: id ? { id } : { title },
      count: entries.length,
      collision: entries.length > 1,
      entries,
      instruction: "Read through MCP first, edit the GitHub source file, commit, then run the repo-to-D1 sync so MCP reads the regenerated structure.",
    };
  }

  // ── read_ratio ──
  if (name === "read_ratio") {
    const leftId = String(args.left_id || "").trim();
    const rightId = String(args.right_id || "").trim();
    const referenceFrame = String(args.reference_frame || "reading-order").trim();
    if (!leftId || !rightId) return { error: "left_id and right_id are required" };

    const rows = await dbAll(env,
      "SELECT id, title, entry_order, public_url, structure FROM entries WHERE id IN (?, ?)",
      [leftId, rightId]);
    const byId = makeById(rows);
    const left = byId.get(leftId);
    const right = byId.get(rightId);
    if (!left || !right) {
      return { error: "entry not found", missing: [!left ? leftId : null, !right ? rightId : null].filter(Boolean) };
    }

    const leftStructure = left.structure ? JSON.parse(left.structure) : {};
    const rightStructure = right.structure ? JSON.parse(right.structure) : {};
    const leftToRight = relationBetween(leftStructure, rightId);
    const rightToLeft = relationBetween(rightStructure, leftId);
    const hasDirectRelation = leftToRight.length > 0 || rightToLeft.length > 0;

    return {
      ratio: `${left.title} : ${right.title}`,
      left: { id: left.id, title: left.title, order: left.entry_order, publicUrl: left.public_url },
      right: { id: right.id, title: right.title, order: right.entry_order, publicUrl: right.public_url },
      referenceFrame,
      relation: hasDirectRelation
        ? { leftToRight, rightToLeft }
        : { leftToRight: [], rightToLeft: [], note: "No canonical direct relation is recorded; treat this as a possible read, not an Atlas dependency." },
      trace: {
        instruction: "Use get_related on both entries, then trace upstream holds/traces before making a claim about this ratio.",
        leftDependsOn: [...(leftStructure.holds || []), ...(leftStructure.traces || [])],
        rightDependsOn: [...(rightStructure.holds || []), ...(rightStructure.traces || [])],
      },
      continuation: hasDirectRelation
        ? "Canonical relation exists; reason from the typed relation and declared frame."
        : "No direct relation exists; treat it as a possible read unless the GitHub source is changed and synced.",
      contract: RATIO_CONTRACT,
      _read_as: "Ratio is relation made readable from a frame; do not collapse it into a definition or invent missing structure.",
    };
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

  // ── get_field_terms ──
  if (name === "get_field_terms") {
    const fieldName = String(args.field_name || "").trim();
    if (!fieldName) return { error: "field_name is required" };
    const limit = Math.min(Math.max(parseInt(args.limit) || LIST_DEFAULT, 1), LIST_MAX);

    const pattern1 = `%/Fields/${fieldName}/%`;
    const pattern2 = `%/Domains/${fieldName}/%`;

    const countRow = await dbFirst(env,
      `SELECT COUNT(*) as n FROM entries WHERE source_path LIKE ? OR source_path LIKE ?`,
      [pattern1, pattern2]);

    const rows = await dbAll(env,
      `SELECT id, title, entry_order, entry_type, garden_status, grounded, public_url, source_path, structure
       FROM entries WHERE (source_path LIKE ? OR source_path LIKE ?) ORDER BY entry_order, title LIMIT ?`,
      [pattern1, pattern2, limit]);

    if (!rows.length) {
      return {
        field: fieldName, total: 0, count: 0, entries: [],
        note: `No entries found for field '${fieldName}'. Check spelling — known fields include: Society, Natural World, Knowledge, Life, Expression, Making, Body, Sustenance, Faith, Place, Cognition, Our Story, Relational Participation.`,
      };
    }

    return {
      field: fieldName,
      total: countRow?.n || 0,
      count: rows.length,
      entries: rows.map(r => {
        const struct = r.structure ? JSON.parse(r.structure) : null;
        return {
          id: r.id, title: r.title, order: r.entry_order, type: r.entry_type,
          gardenStatus: r.garden_status, grounded: r.grounded === 1,
          publicUrl: r.public_url, sourcePath: r.source_path,
          upstream: struct ? { holds: (struct.holds || []), traces: (struct.traces || []) } : null,
        };
      }),
      note: "upstream.holds and upstream.traces are raw IDs — use find_shared_ground or get_entry to resolve them.",
    };
  }

  // ── find_shared_ground ──
  if (name === "find_shared_ground") {
    const ids = Array.isArray(args.ids) ? args.ids.map(String).filter(Boolean) : [];
    if (ids.length < 2) return { error: "ids must contain at least two entry IDs" };

    // Walk upstream for each starting ID
    const upstreamSets = await Promise.all(ids.map(id => getUpstreamIds(env, id)));

    // Intersect all sets
    const intersection = new Set(upstreamSets[0]);
    for (let i = 1; i < upstreamSets.length; i++) {
      for (const id of intersection) {
        if (!upstreamSets[i].has(id)) intersection.delete(id);
      }
    }

    if (intersection.size === 0) {
      return {
        sourceIds: ids,
        sharedGround: [],
        note: "No shared upstream terms found within 3 hops. The entries may not share Atlas grounding at this depth, or they may have diverged before the first/second order.",
      };
    }

    const sgIds = [...intersection];
    const placeholders = sgIds.map(() => "?").join(",");
    const rows = await dbAll(env,
      `SELECT id, title, entry_order, public_url FROM entries WHERE id IN (${placeholders}) AND entry_order IN ('ground', 'first', 'second') ORDER BY CASE entry_order WHEN 'ground' THEN 0 WHEN 'first' THEN 1 WHEN 'second' THEN 2 ELSE 3 END, title`,
      sgIds);

    return {
      sourceIds: ids,
      sharedGround: rows.map(r => ({ id: r.id, title: r.title, order: r.entry_order, publicUrl: r.public_url })),
      note: "Shared first/second-order Atlas terms in all entries' upstream dependency chains — the genuine translation surface. These terms appear in both fields under different local names.",
    };
  }

  // ── translate_reason ──
  if (name === "translate_reason") {
    const reason = String(args.reason || "").trim();
    const targetField = String(args.target_field || "").trim();
    const sourceField = String(args.source_field || "").trim();

    if (!reason) return { error: "reason is required" };
    if (!targetField) return { error: "target_field is required" };

    // Step 1: FTS reason text to find candidate source Atlas terms
    const ftsQuery = reason.slice(0, MAX_QUERY).replace(/['"*]/g, " ").trim() + "*";
    const sourceClauses = ["e.id IN (SELECT id FROM entries_fts WHERE entries_fts MATCH ?)"];
    const ftsParams = [ftsQuery];

    if (sourceField) {
      sourceClauses.push("(e.source_path LIKE ? OR e.source_path LIKE ?)");
      ftsParams.push(`%/Fields/${sourceField}/%`, `%/Domains/${sourceField}/%`);
    }

    ftsParams.push(12);
    const sourceRows = await dbAll(env,
      `SELECT e.id, e.title, e.entry_order, e.public_url, e.source_path
       FROM entries e WHERE ${sourceClauses.join(" AND ")} LIMIT ?`, ftsParams);

    // Step 2: Trace upstream from source terms → find shared ground
    const sourceIds = sourceRows.map(r => r.id);
    let sharedGroundEntries = [];
    let translationSurfaceIds = [];

    if (sourceIds.length > 0) {
      const upstreamSets = await Promise.all(sourceIds.map(id => getUpstreamIds(env, id)));

      // For single source term, its entire upstream is the surface;
      // for multiple, intersect.
      let sharedSet;
      if (upstreamSets.length === 1) {
        sharedSet = upstreamSets[0];
      } else {
        sharedSet = new Set(upstreamSets[0]);
        for (let i = 1; i < upstreamSets.length; i++) {
          for (const id of sharedSet) {
            if (!upstreamSets[i].has(id)) sharedSet.delete(id);
          }
        }
      }

      if (sharedSet.size > 0) {
        const sgIds = [...sharedSet];
        const placeholders = sgIds.map(() => "?").join(",");
        const sgRows = await dbAll(env,
          `SELECT id, title, entry_order, public_url FROM entries WHERE id IN (${placeholders}) AND entry_order IN ('ground', 'first', 'second') ORDER BY CASE entry_order WHEN 'ground' THEN 0 WHEN 'first' THEN 1 WHEN 'second' THEN 2 ELSE 3 END, title`,
          sgIds);
        sharedGroundEntries = sgRows.map(r => ({ id: r.id, title: r.title, order: r.entry_order, publicUrl: r.public_url }));
        translationSurfaceIds = sharedGroundEntries.map(g => g.id);
      }
    }

    // Step 3: Get target field entries with structure
    const tPattern1 = `%/Fields/${targetField}/%`;
    const tPattern2 = `%/Domains/${targetField}/%`;
    const targetRows = await dbAll(env,
      `SELECT id, title, entry_order, public_url, source_path, structure FROM entries WHERE (source_path LIKE ? OR source_path LIKE ?) ORDER BY entry_order, title LIMIT 100`,
      [tPattern1, tPattern2]);

    if (!targetRows.length) {
      return {
        reason: reason.slice(0, 500), targetField, sourceField: sourceField || null,
        sourceTerms: sourceRows.map(r => ({ id: r.id, title: r.title, order: r.entry_order, sourcePath: r.source_path })),
        sharedGround: sharedGroundEntries, translationSurfaceIds,
        targetEquivalents: [],
        meta: { sourceTermCount: sourceRows.length, sharedGroundCount: sharedGroundEntries.length, targetEquivalentCount: 0, targetFieldTotal: 0 },
        note: `No entries found for target field '${targetField}'. Check spelling — known fields: Society, Natural World, Knowledge, Life, Expression, Making.`,
      };
    }

    // Step 4: Find target terms that hold/trace any shared ground term
    const sgSet = new Set(translationSurfaceIds);
    const sgById = new Map(sharedGroundEntries.map(g => [g.id, g.title]));
    const targetEquivalents = [];

    for (const row of targetRows) {
      const struct = row.structure ? JSON.parse(row.structure) : null;
      if (!struct) continue;
      const upIds = [...(struct.holds || []), ...(struct.traces || [])].filter(Boolean);
      const matchingIds = upIds.filter(id => sgSet.has(id));
      if (matchingIds.length > 0) {
        targetEquivalents.push({
          id: row.id, title: row.title, order: row.entry_order, publicUrl: row.public_url,
          holdsSharedGround: matchingIds.map(id => ({ id, title: sgById.get(id) || id })),
        });
      }
    }

    return {
      reason: reason.slice(0, 500),
      targetField,
      sourceField: sourceField || null,
      sourceTerms: sourceRows.map(r => ({ id: r.id, title: r.title, order: r.entry_order, sourcePath: r.source_path })),
      sharedGround: sharedGroundEntries,
      translationSurfaceIds,
      targetEquivalents,
      meta: {
        sourceTermCount: sourceRows.length,
        sharedGroundCount: sharedGroundEntries.length,
        targetEquivalentCount: targetEquivalents.length,
        targetFieldTotal: targetRows.length,
      },
      instructions: {
        role: "The Atlas provides structural grounding; you generate and verify the reason. Do not invent Atlas relations.",
        step1: "sourceTerms — Atlas terms your reason invokes. Read with get_entry to understand their dependency structure.",
        step2: "sharedGround — first/second-order Atlas terms in all source terms' upstream chains. These are the genuine translation surface.",
        step3: "targetEquivalents — target field terms that hold or trace the same sharedGround conditions. These are the structural equivalents in the target field.",
        step4: "Generate a reason in targetField language that traces through the same sharedGround dependency path.",
        step5: "Verify via Translation Invariance: retrace the generated reason back to sharedGround terms. Locate any loss — what cannot be translated reveals what was field-local medium rather than shared structure.",
      },
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
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname !== "/mcp")
      return json({ name: SERVER_INFO.name, version: SERVER_INFO.version,
        transport: "streamable-http", endpoint: "/mcp", tools: advertisedTools("", env).map(t => t.name) }, 200);

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
