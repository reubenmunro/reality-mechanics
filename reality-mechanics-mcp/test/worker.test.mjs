import assert from "node:assert/strict";
import {
  AI_ENTRY_PROTOCOL,
  CANONICAL_ENTRY_COUNT,
  CANONICAL_SOURCE_HASH,
  RELATION_KEYS,
} from "../generated/canonical-participation.mjs";
import { TRANSLATION_HASH } from "../generated/release-identity.mjs";

const emptyStructure = () => Object.fromEntries(RELATION_KEYS.map((relation) => [relation, []]));
const entry = (id, title, {
  order = null,
  register = null,
  structure = emptyStructure(),
  kind = register === "practice" ? "practice" : "term",
  status = "stable",
  sourcePath = `Reality_Mechanics/${title}.md`,
  aliases = [],
} = {}) => ({
  id,
  title,
  source_path: sourcePath,
  public_url: `https://realitymechanics.nz/atlas/${id}`,
  status,
  entry_order: order,
  entry_register: register,
  determination: "pd.v3.pre-provenance-baseline",
  entry_type: kind,
  aliases: JSON.stringify(aliases),
  tags: "[]",
  related: JSON.stringify(Object.values(structure).flat()),
  structure: JSON.stringify(structure),
  conditions: JSON.stringify({
    places: `${title} test place`,
    ...Object.fromEntries(RELATION_KEYS.map((relation) => [relation, { targets: structure[relation] }])),
  }),
  headings: "[]",
  excerpt: `${title} excerpt.`,
  content: `# ${title}\n\n${title} canonical content.`,
  word_count: 4,
  updated: null,
});

const atlasStructure = emptyStructure();
atlasStructure.carries = ["practice.ai-participation"];
const seedStructure = emptyStructure();
seedStructure.traces = ["ground.ground"];
const rows = [
  entry("practice.atlas", "Atlas", { register: "practice", structure: atlasStructure }),
  entry("foundation.common-term-structure", "Common Term Structure", { register: "foundation" }),
  entry("practice.ai-participation", "AI Participation", { register: "practice" }),
  entry("first.relation", "Relation", { order: "first" }),
  entry("ground.ground", "Ground", { order: "ground" }),
  entry("ground.seed", "Seed", { order: "ground", structure: seedStructure }),
  entry("third.architecture", "Architecture", {
    order: "third",
    kind: "term",
    sourcePath: "Reality_Mechanics/3_Third/Domains/Architecture/Architecture.md",
  }),
];

function makeDb(sourceHash = CANONICAL_SOURCE_HASH, entryCount = CANONICAL_ENTRY_COUNT) {
  return {
    prepare(sql) {
      return {
        params: [],
        bind(...params) { this.params = params; return this; },
        async all() {
          if (/SELECT key, value FROM atlas_metadata/.test(sql)) {
            return { results: [
              { key: "source_hash", value: sourceHash },
              { key: "entry_count", value: String(entryCount) },
            ] };
          }
          if (/FROM entries_fts WHERE entries_fts MATCH/.test(sql)) {
            const tokens = String(this.params[0] || "").toLowerCase().match(/[a-z0-9]+/g) || [];
            return { results: rows
              .filter((row) => tokens.some((token) => `${row.title} ${row.content}`.toLowerCase().includes(token)))
              .map((row) => ({ id: row.id, rank: row.title.toLowerCase() === tokens[0] ? -10 : -1 })) };
          }
          if (/WHERE id IN/.test(sql)) {
            const ids = new Set(this.params);
            return { results: rows.filter((row) => ids.has(row.id)) };
          }
          if (/WHERE id = \?/.test(sql)) return { results: rows.filter((row) => row.id === this.params[0]) };
          if (/WHERE title = \? COLLATE NOCASE/.test(sql)) {
            const title = String(this.params[0] || "").toLowerCase();
            return { results: rows.filter((row) => row.title.toLowerCase() === title) };
          }
          return { results: rows };
        },
        async first() {
          if (/COUNT\(\*\) as n/.test(sql)) return { n: entryCount };
          if (/WHERE id = \?/.test(sql)) return rows.find((row) => row.id === this.params[0]) || null;
          return null;
        },
      };
    },
  };
}

const worker = (await import("../src/index.js")).default;
const env = { ATLAS_DB: makeDb() };
let rpcId = 0;

async function rpc(method, params = {}) {
  const response = await worker.fetch(new Request("https://mcp.example/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }),
  }), env, {});
  return response.json();
}

async function callTool(name, args = {}) {
  const response = await rpc("tools/call", { name, arguments: args });
  assert.ok(response.result, JSON.stringify(response));
  return response.result.structuredContent;
}

const init = await rpc("initialize", { protocolVersion: "2025-06-18" });
assert.equal(init.result.serverInfo.version, "4.0.0");
assert.match(init.result.instructions, /generated from the canonical Atlas/);
assert.match(init.result.instructions, /trace_relations follows only declared relations/);

const listed = await rpc("tools/list");
const tools = listed.result.tools.map((tool) => tool.name);
assert.deepEqual(tools, [
  "begin_atlas_session",
  "get_manifest",
  "get_structure_contract",
  "find_entries",
  "get_entry",
  "trace_relations",
  "open_source_for_entry",
]);
assert.ok(!tools.some((name) => /^(write|ground|update|rebuild|submit)/.test(name)));
for (const retired of [
  "get_ai_entry_protocol",
  "search_atlas",
  "get_related",
  "read_ratio",
  "get_entry_by_title",
  "list_entries",
  "get_recent_changes",
  "get_field_terms",
  "find_shared_ground",
  "translate_reason",
]) assert.equal(tools.includes(retired), false, retired);

const manifest = await callTool("get_manifest");
assert.equal(manifest.parity, true);
assert.equal(manifest.entryCount, 493);
assert.equal(manifest.sourceHash, CANONICAL_SOURCE_HASH);
assert.equal(manifest.translationHash, TRANSLATION_HASH);

const session = await callTool("begin_atlas_session");
assert.deepEqual(session.protocol.members, [...AI_ENTRY_PROTOCOL]);
assert.deepEqual(session.requiredEntries.map((item) => item.id), [...AI_ENTRY_PROTOCOL]);
assert.ok(session.requiredEntries.every((item) => item.determination));
assert.ok(session.requiredEntries.every((item) => !("operatorContract" in item)));
assert.deepEqual(session.next, {
  discover: ["find_entries"],
  read: ["get_entry"],
  traverse: ["trace_relations"],
  provenance: ["open_source_for_entry"],
});

const contract = await callTool("get_structure_contract");
assert.equal(contract.sourceHash, CANONICAL_SOURCE_HASH);
assert.equal(contract.translationHash, TRANSLATION_HASH);
assert.deepEqual(Object.keys(contract.atlasSchema.relations), RELATION_KEYS);
assert.deepEqual(contract.protocols["ai-entry"], [...AI_ENTRY_PROTOCOL]);

const atlas = await callTool("get_entry", { id: "practice.atlas" });
assert.equal(atlas.register, "practice");
assert.equal(atlas.order, null);
assert.equal(atlas.determination, "pd.v3.pre-provenance-baseline");
assert.equal(atlas.kind, "practice");
assert.equal(atlas.publicUrl, "https://realitymechanics.nz/atlas/practice.atlas");
assert.deepEqual(Object.keys(atlas.structure), RELATION_KEYS);
assert.equal(atlas.structure.carries[0].id, "practice.ai-participation");
assert.equal("layers" in atlas, false);
assert.equal("grounded" in atlas, false);
assert.equal("provenance" in atlas, false);

const atlasWithProvenance = await callTool("get_entry", { id: "practice.atlas", include_provenance: true });
assert.match(atlasWithProvenance.provenance.githubViewUrl, /github\.com\/reubenmunro/);

const found = await callTool("find_entries", { query: "Atlas can be carried", limit: 10 });
assert.equal(found.entries[0].id, "practice.atlas");
assert.equal(found.entries[0].kind, "practice");
assert.ok(found.availableFilters.kind.includes("practice"));
assert.ok(found.availableFilters.scope.includes("Architecture"));

const exact = await callTool("find_entries", { exact_title: "architecture" });
assert.deepEqual(exact.entries.map((item) => item.id), ["third.architecture"]);

const scoped = await callTool("find_entries", { scope: "Architecture" });
assert.deepEqual(scoped.entries.map((item) => item.id), ["third.architecture"]);

const filtered = await callTool("find_entries", { register: "practice", limit: 1 });
assert.equal(filtered.total, 2);
assert.equal(filtered.count, 1);
assert.equal(filtered.hasMore, true);

const invalidFilter = await callTool("find_entries", { order: "not-an-order" });
assert.equal(invalidFilter.error, "invalid order");

const traced = await callTool("trace_relations", {
  id: "practice.atlas",
  relations: "carries",
  direction: "outgoing",
  depth: 1,
});
assert.equal(traced.edgeCount, 1);
assert.deepEqual(traced.edges[0], {
  from: "practice.atlas",
  to: "practice.ai-participation",
  relation: "carries",
  traversed: "outgoing",
  depth: 1,
  path: ["practice.atlas", "practice.ai-participation"],
});

const incoming = await callTool("trace_relations", {
  id: "practice.ai-participation",
  relations: "carries",
  direction: "incoming",
});
assert.equal(incoming.edges[0].from, "practice.atlas");

const seedTrace = await callTool("trace_relations", {
  id: "ground.seed",
  relations: ["needs", "traces"],
});
assert.equal(seedTrace.edges[0].relation, "traces");
assert.equal("atPrimitive" in seedTrace, false);

const source = await callTool("open_source_for_entry", { id: "practice.atlas" });
assert.equal(source.entries[0].publicUrl, "https://realitymechanics.nz/atlas/practice.atlas");
assert.ok(source.entries[0].maintainedRecord.githubViewUrl);

for (const retired of ["read_ratio", "find_shared_ground", "translate_reason"]) {
  const response = await rpc("tools/call", { name: retired, arguments: {} });
  assert.equal(response.error.code, -32601, retired);
}

const rootResponse = await worker.fetch(new Request("https://mcp.example/"), env, {});
const rootBody = await rootResponse.json();
assert.equal(rootResponse.status, 200);
assert.equal(rootResponse.headers.get("x-rm-canonical-source-hash"), CANONICAL_SOURCE_HASH);
assert.equal(rootResponse.headers.get("x-rm-translation-hash"), TRANSLATION_HASH);
assert.equal(rootBody.translationHash, TRANSLATION_HASH);

const staleEnv = {
  ATLAS_DB: makeDb("sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 493),
};
const staleResponse = await worker.fetch(new Request("https://mcp.example/mcp", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 999,
    method: "tools/call",
    params: { name: "get_entry", arguments: { id: "practice.atlas" } },
  }),
}), staleEnv, {});
const staleBody = await staleResponse.json();
assert.equal(staleBody.error.code, -32010);
assert.match(staleBody.error.message, /translation_identity_mismatch/);
assert.equal(staleResponse.headers.get("x-rm-translation-hash"), TRANSLATION_HASH);

console.log("MCP Canonical Translation tests passed");
