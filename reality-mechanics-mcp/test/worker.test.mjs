/**
 * Offline tests for the Reality Mechanics Atlas MCP Worker.
 * Mocks the Cache API and fetch with Atlas-export fixtures; no network.
 * Run: npm test   (or: node test/worker.test.mjs)
 */
import assert from "node:assert";

// ---- fixtures (shape matches build-atlas-ai-index.mjs output) ----
const manifest = { schemaVersion: "1.0.1", atlasVersion: "v1", builtAt: "2026-06-20T00:00:00.000Z",
  sourceCommit: null, entryCount: 2, contentHash: "sha256:deadbeef",
  current: { index: "/ai/current/index.json", atlas: "/ai/current/atlas.md", entries: "/ai/current/entries/" } };
const relation = { id: "first.relation", title: "Relation", slug: "relation",
  sourcePath: "Reality_Mechanics/1_First/Relation.md", publicUrl: "https://atlas.realitymechanics.nz/relation.html",
  excerpt: "Relation names the primitive condition.", status: "stable", type: "primitive", order: "first",
  branch: undefined, aliases: [], tags: [], related: ["first.connection"], updated: "2026-06-20",
  contentHash: "sha256:rel", content: "# Relation\nRelation names the primitive condition.\n\n## Holds\nRelation is primitive.\n\n## Carries\n- [[Connection]]\n",
  plainText: "Relation names the primitive condition", headings: [{ depth: 2, text: "Holds", anchor: "holds" }], wordCount: 5 };
const connection = { id: "first.connection", title: "Connection", slug: "connection",
  sourcePath: "Reality_Mechanics/1_First/Connection.md", publicUrl: "https://atlas.realitymechanics.nz/connection.html",
  excerpt: "Connection is relation holding between distinguishable conditions.", status: "working", type: "term", order: "first",
  aliases: [], tags: [], related: ["first.relation"], updated: "2026-06-19", contentHash: "sha256:con",
  content: "# Connection\nConnection is relation holding between distinguishable conditions.",
  plainText: "Connection is relation holding between distinguishable conditions", headings: [], wordCount: 7 };

const compact = (e) => ({ id: e.id, title: e.title, slug: e.slug, sourcePath: e.sourcePath, publicUrl: e.publicUrl,
  excerpt: e.excerpt, status: e.status, type: e.type, order: e.order, branch: e.branch, aliases: e.aliases,
  tags: e.tags, related: e.related, updated: e.updated, contentHash: e.contentHash });
const searchRec = (e) => ({ ...compact(e), headings: e.headings.map((h) => h.text), text: e.plainText });

const FIX = {
  "/ai/manifest.json": manifest,
  "/ai/current/index.json": { schemaVersion: "1.0.1", atlasVersion: "v1", entries: [compact(relation), compact(connection)] },
  "/ai/current/search.json": { schemaVersion: "1.0.1", atlasVersion: "v1", entries: [searchRec(relation), searchRec(connection)] },
  "/ai/current/entries/first.relation.json": { ...relation, schemaVersion: "1.0.1", atlasVersion: "v1" },
};

// ---- mock Cache API + fetch ----
const cacheStore = new Map();
globalThis.caches = { default: {
  async match(req) { const k = req.url || String(req); return cacheStore.has(k) ? new Response(cacheStore.get(k)) : undefined; },
  async put(req, res) { const k = req.url || String(req); cacheStore.set(k, await res.text()); },
} };
globalThis.fetch = async (url) => {
  const u = new URL(String(url));
  const key = Object.keys(FIX).find((k) => u.pathname === k);
  if (!key) return new Response("not found", { status: 404 });
  return new Response(JSON.stringify(FIX[key]), { status: 200, headers: { "content-type": "application/json" } });
};

const worker = (await import("../src/index.js")).default;
const env = { ATLAS_BASE: "https://atlas.realitymechanics.nz" };
let rpcId = 0;
async function rpc(method, params) {
  const req = new Request("https://mcp.example/mcp", { method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }) });
  const res = await worker.fetch(req, env, {});
  return res.json();
}
const callTool = async (name, args) => {
  const r = await rpc("tools/call", { name, arguments: args });
  assert.ok(r.result, `tools/call ${name} returned: ${JSON.stringify(r)}`);
  return r.result.structuredContent;
};

let passed = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); console.log("  ✓ " + msg); passed++; };

// ---- tests ----
const init = await rpc("initialize", { protocolVersion: "2025-06-18" });
ok(init.result.serverInfo.name === "reality-mechanics-atlas", "initialize returns server info");
ok(init.result.protocolVersion === "2025-06-18", "initialize echoes protocol version");

const list = await rpc("tools/list", {});
const toolNames = list.result.tools.map((t) => t.name);
ok(["get_manifest","get_ai_entry_protocol","search_atlas","get_entry","get_related","list_entries","get_recent_changes"].every((t) => toolNames.includes(t)),
  "tools/list lists all seven tools");
ok(!toolNames.includes("submit_atlas_insert"), "tools/list does not advertise legacy submit_atlas_insert");

const man = await callTool("get_manifest", {});
ok(man.atlasVersion === "v1" && man.entryCount === 2, "get_manifest returns current version + count");

const proto = await callTool("get_ai_entry_protocol", {});
ok(proto.entryPath[0].arguments.id === "practice.reasoning" && proto.rules.some((r) => r.includes("structure")),
  "get_ai_entry_protocol returns the AI entry ritual");

const resources = await rpc("resources/list", {});
ok(resources.result.resources.some((r) => r.uri === "atlas://ai-entry-protocol"),
  "resources/list exposes the AI entry protocol");
const protocolResource = await rpc("resources/read", { uri: "atlas://ai-entry-protocol" });
ok(protocolResource.result.contents[0].text.includes("practice.ai-participation"),
  "resources/read returns the AI entry protocol");

const s = await callTool("search_atlas", { query: "Relation" });
ok(s.results[0].title === "Relation" && s.results[0].matchedFields.includes("title"), "search_atlas finds exact title");
ok(s.results.every((r) => r.atlasVersion === "v1"), "every search result carries atlas version");
const sBody = await callTool("search_atlas", { query: "distinguishable" });
ok(sBody.results.some((r) => r.title === "Connection" && r.matchedFields.includes("content")), "body-term search returns relevant entry");
const sFilter = await callTool("search_atlas", { query: "relation", type: "primitive" });
ok(sFilter.results.every((r) => r.type === "primitive"), "search type filter works");
const sLimit = await callTool("search_atlas", { query: "relation", limit: 1 });
ok(sLimit.results.length <= 1, "search result limit enforced");

const ent = await callTool("get_entry", { id: "first.relation" });
ok(ent.content.includes("# Relation") && ent._trace.publicUrl === relation.publicUrl, "get_entry returns full source + trace");
ok(ent.structure.carries.some((r) => r.id === "first.connection"), "get_entry leads with dependency structure (carries)");
ok(ent.atlasVersion === "v1", "get_entry carries atlas version");
const entBad = await callTool("get_entry", { id: "../secret" });
ok(entBad.error, "invalid id is rejected (no path escape)");
const entMiss = await callTool("get_entry", { id: "nope.missing" });
ok(entMiss.notFound, "unknown id returns structured not-found");

const rel = await callTool("get_related", { id: "first.relation" });
ok(rel.downstream.carries.some((r) => r.id === "first.connection"), "get_related groups typed/directional relations");
const relInf = await callTool("get_related", { id: "first.relation", includeInferred: true });
ok(Array.isArray(relInf.inferred) && relInf.inferredNote.includes("authored"), "inferred relations are clearly separated");

const li = await callTool("list_entries", { order: "first" });
ok(li.entries.length === 2 && li.total === 2, "list_entries filters by metadata");

const rc = await callTool("get_recent_changes", { since: "2026-06-19" });
ok(rc.basis === "metadata" && rc.entries.some((e) => e.id === "first.relation"), "get_recent_changes is metadata-based and works");

const bad = await rpc("tools/call", { name: "does_not_exist", arguments: {} });
ok(bad.error && bad.error.code === -32601, "unknown tool -> method-not-found error");

console.log(`\nAll ${passed} assertions passed.`);
