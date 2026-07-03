/**
 * Offline tests for the D1-backed Reality Mechanics Atlas MCP Worker.
 * No network; provides a tiny ATLAS_DB mock with the SQL shapes used here.
 */
import assert from "node:assert";

const rows = [
  {
    id: "practice.atlas",
    title: "Atlas",
    public_url: "https://realitymechanics.nz/field#practice.atlas",
    status: "stable",
    garden_status: "rooted",
    grounded: 1,
    entry_order: "practice",
    entry_type: "practice",
    aliases: "[]",
    tags: "[]",
    related: "[]",
    structure: JSON.stringify({ holds: [], traces: [], carries: ["practice.ai-participation"], pairs: [], nests: [], reads: [] }),
    headings: "[]",
    excerpt: "Atlas names the dependency-ordered reasoning system.",
    content: "# Atlas\n\nAtlas names the dependency-ordered reasoning system.",
    word_count: 7,
    updated: "2026-06-30T00:00:00.000Z",
  },
  {
    id: "practice.ai-participation",
    title: "AI Participation",
    public_url: "https://realitymechanics.nz/field#practice.ai-participation",
    status: "stable",
    garden_status: "rooted",
    grounded: 1,
    entry_order: "practice",
    entry_type: "practice",
    aliases: "[]",
    tags: "[]",
    related: "[]",
    structure: JSON.stringify({ holds: ["practice.atlas"], traces: [], carries: [], pairs: [], nests: [], reads: [] }),
    headings: "[]",
    excerpt: "AI participation remains answerable to Atlas structure.",
    content: "# AI Participation\n\nAI participation remains answerable to Atlas structure.",
    word_count: 8,
    updated: "2026-06-30T00:00:00.000Z",
  },
  {
    id: "practice.atlas-note-standard",
    title: "Atlas Note Standard",
    public_url: "https://realitymechanics.nz/field#practice.atlas-note-standard",
    status: "stable",
    garden_status: "rooted",
    grounded: 1,
    entry_order: "practice",
    entry_type: "practice",
    aliases: "[]",
    tags: "[]",
    related: "[]",
    structure: JSON.stringify({ holds: ["practice.atlas"], traces: [], carries: [], pairs: [], nests: [], reads: [] }),
    headings: "[]",
    excerpt: "Atlas Note Standard names the note grammar.",
    content: "# Atlas Note Standard\n\n## Holds\n\nAtlas.",
    word_count: 6,
    updated: "2026-06-30T00:00:00.000Z",
  },
  {
    id: "practice.ungrounded",
    title: "Ungrounded",
    public_url: "https://realitymechanics.nz/field#practice.ungrounded",
    status: "stable",
    garden_status: "planted",
    grounded: 0,
    entry_order: "practice",
    entry_type: "practice",
    aliases: "[]",
    tags: "[]",
    related: "[]",
    structure: JSON.stringify({ holds: ["practice.atlas"], traces: [], carries: [], pairs: [], nests: [], reads: [] }),
    headings: "[]",
    excerpt: "Ungrounded test entry.",
    content: "# Ungrounded\n\n## Reads\n\nStill settling.",
    word_count: 4,
    content_hash: "sha256:ungrounded-before",
    updated: "2026-06-30T00:00:00.000Z",
  },
];

function makeDb() {
  return {
    prepare(sql) {
      return {
        params: [],
        bind(...params) { this.params = params; return this; },
        async all() {
          if (/GROUP BY garden_status/.test(sql)) {
            return { results: [{ garden_status: "rooted", n: rows.length }] };
          }
          if (/WHERE id IN/.test(sql)) {
            const ids = new Set(this.params);
            return { results: rows.filter((row) => ids.has(row.id)) };
          }
          return { results: rows };
        },
        async first() {
          if (/COUNT\(\*\) as n/.test(sql)) return { n: rows.length };
          if (/WHERE id = \?/.test(sql)) return rows.find((row) => row.id === this.params[0]) || null;
          return rows[0] || null;
        },
        async run() {
          return { success: true };
        },
      };
    },
  };
}

const worker = (await import("../src/index.js")).default;
const env = { ATLAS_DB: makeDb() };
let rpcId = 0;

async function rpc(method, params, headers = {}) {
  const req = new Request("https://mcp.example/mcp", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }),
  });
  return (await worker.fetch(req, env, {})).json();
}

async function callTool(name, args = {}) {
  const r = await rpc("tools/call", { name, arguments: args });
  assert.ok(r.result, `tools/call ${name} returned: ${JSON.stringify(r)}`);
  return r.result.structuredContent;
}

let passed = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); console.log("  ✓ " + msg); passed++; };

const init = await rpc("initialize", { protocolVersion: "2025-06-18" });
ok(init.result.serverInfo.name === "reality-mechanics-atlas", "initialize returns server info");
ok(init.result.instructions.includes("Frontmatter is AI language; prose is human language"), "initialize exposes layer instructions");

const preflight = await worker.fetch(new Request("https://mcp.example/mcp", {
  method: "OPTIONS",
  headers: {
    Origin: "https://realitymechanics.nz",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type,authorization,cf-access-client-id,cf-access-client-secret,mcp-session-id,mcp-protocol-version",
  },
}), env, {});
const allowedHeaders = preflight.headers.get("Access-Control-Allow-Headers") || "";
ok(preflight.status === 200 && allowedHeaders.includes("Authorization"), "MCP preflight allows Authorization");
ok(allowedHeaders.includes("CF-Access-Client-Id") && allowedHeaders.includes("CF-Access-Client-Secret"), "MCP preflight allows Cloudflare Access service-token headers");

const list = await rpc("tools/list", {});
const toolNames = list.result.tools.map((t) => t.name);
ok(["begin_atlas_session", "get_ai_entry_protocol", "get_entry", "get_related"].every((t) => toolNames.includes(t)),
  "tools/list exposes core structure-first tools");
ok(["search_atlas", "get_entry_by_title", "list_entries", "get_recent_changes", "read_ratio"].every((t) => toolNames.includes(t)),
  "tools/list exposes useful read tools");
ok(["get_field_terms", "find_shared_ground", "translate_reason"].every((t) => toolNames.includes(t)),
  "tools/list exposes field translation read tools");
ok(!["write_proposal", "update_entry_section", "ground_entry", "rebuild_search_index", "submit_atlas_insert", "list_garden_proposals"].some((t) => toolNames.includes(t)),
  "tools/list exposes no write, maintenance, or Garden tools");

const rejectedWrite = await rpc("tools/call", { name: "write_proposal", arguments: { entry_id: "practice.atlas" } });
ok(rejectedWrite.error?.code === -32601, "write_proposal is not callable");

const proto = await callTool("get_ai_entry_protocol");
ok(proto.startingIds.length === 3 && proto.startingIds[0] === "practice.atlas", "entry protocol starts from current three ids");
ok(proto.layerContract.layers.structure && proto.layerContract.layers.prose, "entry protocol includes structure/prose layer contract");
ok(proto.operatorContract.families.length === 7, "entry protocol includes seven operator families");
ok(proto.rules.some((rule) => rule.includes("GitHub markdown/frontmatter")), "entry protocol names GitHub as editable source of truth");
ok(proto.rules.some((rule) => rule.includes("edge shows operation in passage")), "entry protocol names operator edge/term correspondence");

const session = await callTool("begin_atlas_session");
ok(session.protocol.layerContract.workerOrder.some((step) => step.startsWith("structure:")), "begin_atlas_session exposes worker order");
ok(session.governance.layerRule.includes("Frontmatter is AI language"), "begin_atlas_session exposes layer governance");
ok(session.governance.operatorRule.includes("edge behavior"), "begin_atlas_session exposes operator invariant");
ok(session.requiredPracticeEntries.every((entry) => entry.layers?.structure), "session practice entries include layer contract");
ok(session.requiredPracticeEntries.every((entry) => entry.operatorContract?.families?.length === 7), "session practice entries include operator contract");

const entry = await callTool("get_entry", { id: "practice.atlas" });
ok(entry.structure.carries.some((item) => item.id === "practice.ai-participation"), "get_entry resolves canonical structure first");
ok(entry.layers.frontmatter && entry.layers.prose, "get_entry includes layer contract");
ok(entry.operatorContract.families.some((family) => family.key === "carry"), "get_entry includes operator contract");
ok(entry._read_as.includes("prose is human language"), "get_entry read-as distinguishes prose from structure");

console.log(`\nAll ${passed} assertions passed.`);
