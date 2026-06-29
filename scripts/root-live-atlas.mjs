#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const MCP_URL = process.env.MCP_URL || "https://mcp.realitymechanics.nz/mcp";
const GARDEN_URL = process.env.GARDEN_URL || "https://realitymechanics.nz";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const all = args.has("--all");
const idsArg = process.argv.find((arg) => arg.startsWith("--ids="));
const idsFilter = idsArg ? idsArg.slice("--ids=".length).split(",").map((id) => id.trim()).filter(Boolean) : null;

function splitFrontmatter(text) {
  if (!text.startsWith("---\n")) return { frontmatter: "", body: text };
  const end = text.indexOf("\n---", 4);
  if (end === -1) return { frontmatter: "", body: text };
  const closeEnd = text.indexOf("\n", end + 4);
  const boundaryEnd = closeEnd === -1 ? text.length : closeEnd + 1;
  return {
    frontmatter: text.slice(0, boundaryEnd),
    body: text.slice(boundaryEnd),
  };
}

function normalizeBody(text) {
  return String(text || "").replace(/\r\n/g, "\n").trim() + "\n";
}

async function mcpCall(name, callArgs = {}) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: callArgs },
    }),
  });
  if (!res.ok) throw new Error(`MCP ${name} HTTP ${res.status}`);
  const payload = await res.json();
  const text = payload?.result?.content?.[0]?.text;
  if (!text) throw new Error(`MCP ${name} returned no text content`);
  const data = JSON.parse(text);
  if (data?.error) throw new Error(`MCP ${name}: ${data.error}`);
  return data;
}

async function listAllEntries() {
  const entries = [];
  const limit = 500;
  for (let offset = 0; ; offset += limit) {
    const page = await mcpCall("list_entries", { limit, offset });
    entries.push(...(page.entries || []));
    if (!page.entries || page.entries.length < limit) break;
  }
  return entries;
}

async function appliedProposalEntryIds() {
  const res = await fetch(`${GARDEN_URL}/api/garden/proposals?v=${Date.now()}`);
  if (!res.ok) throw new Error(`Garden proposals HTTP ${res.status}`);
  const data = await res.json();
  const ids = new Set();
  for (const proposal of data.proposals || []) {
    if (proposal.status === "applied" && proposal.proposal_for) ids.add(String(proposal.proposal_for));
  }
  return ids;
}

async function rootEntry(entry) {
  if (!entry.sourcePath) return { id: entry.id, skipped: true, reason: "missing_source_path" };
  const filePath = resolve(root, entry.sourcePath);
  if (!filePath.startsWith(root + "/")) return { id: entry.id, skipped: true, reason: "source_path_outside_workspace" };

  let current;
  try {
    current = await readFile(filePath, "utf8");
  } catch {
    return { id: entry.id, path: entry.sourcePath, skipped: true, reason: "missing_local_file" };
  }

  const live = await mcpCall("get_entry", { id: entry.id });
  if (!live.content) return { id: entry.id, path: entry.sourcePath, skipped: true, reason: "missing_live_content" };

  const parts = splitFrontmatter(current);
  const localBody = normalizeBody(parts.body);
  const liveBody = normalizeBody(live.content);
  if (localBody === liveBody) return { id: entry.id, title: entry.title, path: entry.sourcePath, changed: false };

  if (apply) {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, `${parts.frontmatter}${liveBody}`, "utf8");
  }

  return {
    id: entry.id,
    title: entry.title,
    path: entry.sourcePath,
    changed: true,
    applied: apply,
    localBytes: localBody.length,
    liveBytes: liveBody.length,
  };
}

async function main() {
  const entries = await listAllEntries();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  let targetIds;
  if (idsFilter) {
    targetIds = new Set(idsFilter);
  } else if (all) {
    targetIds = new Set(entries.map((entry) => entry.id));
  } else {
    targetIds = await appliedProposalEntryIds();
  }

  const targets = [...targetIds].map((id) => byId.get(id)).filter(Boolean);
  const missing = [...targetIds].filter((id) => !byId.has(id));

  console.log(apply ? "Rooting live Atlas into Markdown..." : "Dry run: live Atlas entries that would root into Markdown");
  console.log(`Mode: ${all ? "all entries" : idsFilter ? "selected ids" : "applied Garden proposals"}`);
  console.log(`Targets: ${targets.length}${missing.length ? ` (${missing.length} missing from MCP list)` : ""}`);

  const results = [];
  for (const entry of targets) results.push(await rootEntry(entry));

  const changed = results.filter((result) => result.changed);
  const skipped = results.filter((result) => result.skipped);
  for (const result of changed.slice(0, 80)) {
    console.log(`${apply ? "rooted" : "would root"} ${result.id} -> ${result.path}`);
  }
  if (changed.length > 80) console.log(`...and ${changed.length - 80} more changed entries`);
  for (const result of skipped.slice(0, 20)) {
    console.log(`skipped ${result.id}${result.path ? ` -> ${result.path}` : ""}: ${result.reason}`);
  }

  console.log(`Changed: ${changed.length}`);
  console.log(`Unchanged: ${results.filter((result) => result.changed === false).length}`);
  console.log(`Skipped: ${skipped.length}`);
  if (!apply && changed.length) console.log("Run again with --apply to write these changes.");
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
