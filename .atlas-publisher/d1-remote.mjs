import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MAX_OUTPUT = 32 * 1024 * 1024;

export async function resolveWrangler(repoRoot) {
  const candidates = [
    join(repoRoot, ".atlas-publisher", "node_modules", ".bin", "wrangler"),
    join(repoRoot, "member", "node_modules", ".bin", "wrangler"),
    join(repoRoot, "reality-mechanics-mcp", "node_modules", ".bin", "wrangler"),
  ];
  for (const command of candidates) {
    try {
      await access(command);
      return { command, prefix: [] };
    } catch {
      // Use npx only when no workspace Wrangler executable exists.
    }
  }
  return { command: "npx", prefix: ["wrangler"] };
}

export function buildRemoteImport(schemaSql, dataSql) {
  const dataLines = dataSql.trimEnd().split("\n");
  const firstDataStatement = dataLines.find((line) => line.trim() && !line.trim().startsWith("--"));
  const lastDataStatement = dataLines.at(-1)?.trim();
  assert.notEqual(firstDataStatement, "BEGIN TRANSACTION;", "Remote D1 data must not begin an explicit transaction");
  assert.notEqual(lastDataStatement, "COMMIT;", "Remote D1 data must not commit an explicit transaction");
  return `${schemaSql.trimEnd()}\n${dataSql.trim()}\n`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: MAX_OUTPUT,
    ...options,
  });
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout;
}

function wranglerJson(wrangler, database, sql, cwd) {
  const output = run(wrangler.command, [
    ...wrangler.prefix,
    "d1",
    "execute",
    database,
    "--remote",
    "--json",
    "--command",
    sql,
  ], { cwd });
  const result = JSON.parse(output);
  assert.equal(result.length, 1, "Expected one D1 result set");
  assert.equal(result[0].success, true, "D1 parity query failed");
  return result[0].results;
}

function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export async function verifyRemoteD1({ database, generatedRoot, repoRoot, wrangler }) {
  const schemaSql = await readFile(join(generatedRoot, "atlas-d1-schema.sql"), "utf8");
  const dataSql = await readFile(join(generatedRoot, "atlas-d1-sync.sql"), "utf8");
  const graph = JSON.parse(await readFile(join(generatedRoot, "canonical-graph.json"), "utf8"));
  const importSql = buildRemoteImport(schemaSql, dataSql);
  const root = await mkdtemp(join(tmpdir(), "rm-d1-parity-"));
  const localDb = join(root, "atlas.db");

  const datasets = {
    entries: "SELECT * FROM entries ORDER BY id;",
    fts: "SELECT id,title,plain_text FROM entries_fts ORDER BY id;",
    metadata: "SELECT key,value FROM atlas_metadata ORDER BY key;",
    determinations: "SELECT * FROM atlas_determinations ORDER BY id;",
    protocol: "SELECT protocol,ordinal,entry_id FROM atlas_protocol_members ORDER BY protocol,ordinal;",
  };

  try {
    run("sqlite3", [localDb], { cwd: repoRoot, input: importSql });
    const hashes = {};
    const remoteDatasets = {};
    for (const [name, sql] of Object.entries(datasets)) {
      const local = JSON.parse(run("sqlite3", ["-json", localDb, sql], { cwd: repoRoot }) || "[]");
      const remote = wranglerJson(wrangler, database, sql, repoRoot);
      assert.deepEqual(remote, local, `${name} differs from the generated D1 projection`);
      hashes[name] = sha256(remote);
      remoteDatasets[name] = remote;
    }

    const entries = remoteDatasets.entries;
    const metadata = Object.fromEntries(remoteDatasets.metadata.map(({ key, value }) => [key, value]));
    const determinationRecords = Object.values(graph.entries)
      .find((entry) => entry.determinationRecords)?.determinationRecords;
    const protocols = Object.values(graph.entries).find((entry) => entry.protocols)?.protocols;
    assert.ok(determinationRecords, "Canonical Graph has no determination registry");
    assert.ok(protocols, "Canonical Graph has no protocol declaration");

    const relationTargets = Object.values(graph.entries).reduce((total, entry) => total
      + Object.entries(entry.conditions)
        .filter(([name]) => name !== "places")
        .reduce((entryTotal, [, relation]) => entryTotal + relation.targets.length, 0), 0);

    assert.equal(entries.length, Object.keys(graph.entries).length);
    assert.equal(entries.filter((entry) => entry.entry_order !== null).length,
      Object.values(graph.entries).filter((entry) => entry.order).length);
    assert.equal(entries.filter((entry) => entry.entry_register !== null).length,
      Object.values(graph.entries).filter((entry) => entry.register).length);
    assert.equal(entries.filter((entry) => entry.determination).length, entries.length);
    assert.equal(remoteDatasets.determinations.length, Object.keys(determinationRecords).length);
    assert.deepEqual(
      remoteDatasets.protocol.map(({ entry_id }) => entry_id),
      protocols["ai-entry"],
    );
    assert.equal(metadata.source_hash, graph.sourceHash);
    assert.equal(Number(metadata.entry_count), entries.length);

    const remoteRelationTargets = entries.reduce((total, entry) => total
      + Object.values(JSON.parse(entry.structure))
        .reduce((entryTotal, targets) => entryTotal + targets.length, 0), 0);
    assert.equal(remoteRelationTargets, relationTargets);

    const legacy = wranglerJson(wrangler, database,
      "SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name='atlas_registers';", repoRoot);
    assert.equal(legacy[0].n, 0, "Legacy atlas_registers table remains");
    const quickCheck = wranglerJson(wrangler, database, "PRAGMA quick_check;", repoRoot);
    assert.deepEqual(quickCheck, [{ quick_check: "ok" }]);

    return {
      database,
      sourceHash: graph.sourceHash,
      entries: entries.length,
      orderEntries: entries.filter((entry) => entry.entry_order !== null).length,
      registerEntries: entries.filter((entry) => entry.entry_register !== null).length,
      relationTargets,
      determinationReferences: entries.length,
      determinationRecords: remoteDatasets.determinations.length,
      protocol: remoteDatasets.protocol.map(({ entry_id }) => entry_id),
      hashes,
      quickCheck: "ok",
      legacyAtlasRegisters: 0,
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
