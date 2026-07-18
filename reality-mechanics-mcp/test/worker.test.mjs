import assert from "node:assert/strict";
import {
  AI_ENTRY_PROTOCOL,
  CANONICAL_ENTRY_COUNT,
  CANONICAL_SOURCE_HASH,
  RELATION_KEYS,
} from "../generated/canonical-participation.mjs";
import { TRANSLATION_HASH } from "../generated/release-identity.mjs";

const emptyStructure = () => Object.fromEntries(RELATION_KEYS.map((relation) => [relation, []]));
const entry = (id, title, { order = null, register = null, structure = emptyStructure() } = {}) => ({
  id,
  title,
  source_path: `Reality_Mechanics/${title}.md`,
  public_url: `https://realitymechanics.nz/field#${id}`,
  status: "stable",
  grounded: 1,
  entry_order: order,
  entry_register: register,
  determination: "pd.v3.pre-provenance-baseline",
  entry_type: register === "practice" ? "practice" : "term",
  aliases: "[]",
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
const rows = [
  entry("practice.atlas", "Atlas", { register: "practice", structure: atlasStructure }),
  entry("foundation.common-term-structure", "Common Term Structure", { register: "foundation" }),
  entry("practice.ai-participation", "AI Participation", { register: "practice" }),
  entry("first.relation", "Relation", { order: "first" }),
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
assert.equal(init.result.serverInfo.version, "3.0.0");
assert.match(init.result.instructions, /generated from the canonical Atlas/);

const listed = await rpc("tools/list");
const tools = listed.result.tools.map((tool) => tool.name);
assert.ok(["begin_atlas_session", "get_manifest", "get_ai_entry_protocol", "get_structure_contract", "get_entry", "get_related"].every((name) => tools.includes(name)));
assert.ok(!tools.includes("get_public_surfaces"));
assert.ok(!tools.includes("get_derivation_status"));
assert.ok(!tools.some((name) => /^(write|ground|update|rebuild|submit)/.test(name)));

const protocol = await callTool("get_ai_entry_protocol");
assert.equal(protocol.sourceHash, CANONICAL_SOURCE_HASH);
assert.equal(protocol.translationHash, TRANSLATION_HASH);
assert.deepEqual(protocol.members, [...AI_ENTRY_PROTOCOL]);
assert.equal("startingIds" in protocol, false);

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

const contract = await callTool("get_structure_contract");
assert.equal(contract.sourceHash, CANONICAL_SOURCE_HASH);
assert.equal(contract.translationHash, TRANSLATION_HASH);
assert.deepEqual(Object.keys(contract.atlasSchema.relations), RELATION_KEYS);
assert.deepEqual(contract.protocols["ai-entry"], [...AI_ENTRY_PROTOCOL]);

const atlas = await callTool("get_entry", { id: "practice.atlas" });
assert.equal(atlas.register, "practice");
assert.equal(atlas.order, null);
assert.equal(atlas.determination, "pd.v3.pre-provenance-baseline");
assert.deepEqual(Object.keys(atlas.structure), RELATION_KEYS);
assert.equal(atlas.structure.carries[0].id, "practice.ai-participation");
assert.equal("layers" in atlas, false);

const related = await callTool("get_related", { id: "practice.atlas" });
assert.deepEqual(Object.keys(related.relations), RELATION_KEYS);
assert.equal(related.relations.carries[0].id, "practice.ai-participation");

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
