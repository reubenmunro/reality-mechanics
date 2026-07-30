import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { resolve } from "node:path";
import test from "node:test";

const repoRoot = resolve(import.meta.dirname, "../..");
const generatedRoot = resolve(repoRoot, ".atlas-publisher/generated");
const database = new DatabaseSync(":memory:");
database.exec(readFileSync(resolve(generatedRoot, "atlas-d1-schema.sql"), "utf8"));
database.exec(readFileSync(resolve(generatedRoot, "atlas-d1-sync.sql"), "utf8"));

const env = {
  ATLAS_DB: {
    prepare(sql) {
      const statement = database.prepare(sql);
      return {
        params: [],
        bind(...params) {
          this.params = params;
          return this;
        },
        async all() {
          return { results: statement.all(...this.params) };
        },
        async first() {
          return statement.get(...this.params) || null;
        },
      };
    },
  },
};

const worker = (await import("../src/index.js")).default;
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

test("real generated D1 advertises only the recalibrated command set", async () => {
  const listed = await rpc("tools/list");
  assert.deepEqual(listed.result.tools.map((tool) => tool.name), [
    "begin_atlas_session",
    "get_manifest",
    "get_structure_contract",
    "find_entries",
    "get_entry",
    "trace_relations",
    "open_source_for_entry",
  ]);
});

test("find_entries ranks the canonical operation and exposes complete filters", async () => {
  const result = await callTool("find_entries", {
    query: "A misunderstanding can be carried",
    limit: 20,
  });
  assert.equal(result.entries[0].id, "first.carry");
  assert.ok(result.availableFilters.kind.includes("operation"));
  assert.ok(result.availableFilters.status.includes("working"));
  assert.ok(result.availableFilters.determination.includes("pd.2026-07-18.calibration-revision-set"));
  assert.ok(result.availableFilters.scope.includes("Place Field"));
  assert.ok(result.availableFilters.scope.includes("Architecture"));
});

test("find_entries unifies exact title, scope, kind, and pagination", async () => {
  const exact = await callTool("find_entries", { exact_title: "Proportion" });
  assert.deepEqual(exact.entries.map((entry) => entry.id), ["first.ratio"]);

  const place = await callTool("find_entries", { scope: "Place Field" });
  assert.equal(place.total, 3);

  const architecture = await callTool("find_entries", { scope: "Architecture" });
  assert.equal(architecture.total, 9);

  const operations = await callTool("find_entries", { kind: "operation", limit: 1 });
  assert.equal(operations.total, 2);
  assert.equal(operations.count, 1);
  assert.equal(operations.hasMore, true);
});

test("get_entry prefers the local Atlas and keeps provenance optional", async () => {
  const carry = await callTool("get_entry", { id: "first.carry" });
  assert.equal(carry.publicUrl, "https://realitymechanics.nz/atlas/first.carry");
  assert.equal(carry.kind, "carrier");
  assert.equal("provenance" in carry, false);
  assert.deepEqual(Object.keys(carry.structure), [
    "needs", "holds", "pairs", "traces", "nests", "reads", "carries",
  ]);
});

test("trace_relations follows selected authored edges without evaluation", async () => {
  const carry = await callTool("trace_relations", {
    id: "first.carry",
    relations: ["needs", "pairs", "carries"],
    depth: 1,
  });
  assert.deepEqual(new Set(carry.edges.map((edge) => edge.relation)), new Set(["needs", "pairs", "carries"]));
  assert.equal(carry.edgeCount, 5);
  assert.equal(carry.note.includes("inferred"), true);
  assert.equal("atPrimitive" in carry, false);

  const seed = await callTool("trace_relations", {
    id: "ground.seed",
    relations: ["needs", "traces"],
  });
  assert.deepEqual(seed.edges.map((edge) => [edge.relation, edge.to]), [["traces", "ground.ground"]]);
});

test("retired evaluative commands are unavailable", async () => {
  for (const name of ["read_ratio", "find_shared_ground", "translate_reason"]) {
    const response = await rpc("tools/call", { name, arguments: {} });
    assert.equal(response.error.code, -32601, name);
  }
});
