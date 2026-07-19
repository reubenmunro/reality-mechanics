import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildRemoteImport } from "../d1-remote.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const publisherRoot = resolve(here, "..");
const repoRoot = resolve(publisherRoot, "..");
const atlasRoot = join(repoRoot, "Reality_Mechanics");
const translator = join(publisherRoot, "translate-atlas.rb");
const generatedRoot = join(publisherRoot, "generated");
const graph = JSON.parse(readFileSync(join(generatedRoot, "canonical-graph.json"), "utf8"));

function runTranslation(args = []) {
  return spawnSync("ruby", [translator, ...args], { cwd: repoRoot, encoding: "utf8" });
}

function filesUnder(root) {
  return readdirSync(root, { recursive: true })
    .map((path) => String(path))
    .filter((path) => statSync(join(root, path)).isFile())
    .sort();
}

test("Canonical Graph carries only the validated Stage 1C source", () => {
  assert.equal(graph.sourceHash, "sha256:1dd98216950c6267fffd23c09070158ca7e1db5d13d8fc776c5eaa1ac6a553ce");
  assert.equal(Object.keys(graph.entries).length, 493);
  assert.equal(Object.values(graph.entries).filter((entry) => entry.order).length, 444);
  assert.equal(Object.values(graph.entries).filter((entry) => entry.register).length, 49);

  const schemaOwners = Object.entries(graph.entries).filter(([, entry]) => entry.atlasSchema);
  const determinationOwners = Object.entries(graph.entries).filter(([, entry]) => entry.determinationRecords);
  const protocolOwners = Object.entries(graph.entries).filter(([, entry]) => entry.protocols);
  assert.deepEqual(schemaOwners.map(([id]) => id), ["foundation.common-term-structure"]);
  assert.deepEqual(determinationOwners.map(([id]) => id), ["ground.groundedness"]);
  assert.deepEqual(protocolOwners.map(([id]) => id), ["practice.ai-participation"]);

  const schema = schemaOwners[0][1].atlasSchema;
  assert.deepEqual(Object.keys(schema.relations), ["needs", "holds", "pairs", "traces", "nests", "reads", "carries"]);
  assert.deepEqual(schema.placement.orderValues, ["ground", "first", "second", "third", "higher"]);
  assert.deepEqual(schema.placement.registerValues, ["foundation", "practice"]);
  assert.deepEqual(protocolOwners[0][1].protocols["ai-entry"], [
    "practice.atlas",
    "foundation.common-term-structure",
    "practice.ai-participation",
  ]);

  for (const [id, entry] of Object.entries(graph.entries)) {
    assert.equal(entry.publish, true, id);
    assert.equal(Boolean(entry.order) !== Boolean(entry.register), true, id);
    assert.ok(determinationOwners[0][1].determinationRecords[entry.determination], id);
    assert.deepEqual(Object.keys(entry.conditions), ["places", ...Object.keys(schema.relations)], id);
    for (const relation of Object.keys(schema.relations)) {
      assert.ok(Array.isArray(entry.conditions[relation].targets), `${id}:${relation}`);
      for (const target of entry.conditions[relation].targets) assert.ok(graph.entries[target], `${id}:${relation}:${target}`);
    }
  }
});

test("Translation stops on an unresolved exact relation target", () => {
  const root = mkdtempSync(join(tmpdir(), "rm-invalid-atlas-"));
  const atlas = join(root, "Reality_Mechanics");
  cpSync(atlasRoot, atlas, { recursive: true });
  const carryPath = join(atlas, "1_First", "Carrier Mechanics", "Carry.md");
  const source = readFileSync(carryPath, "utf8");
  const changed = source.replace(/(targets:\n\s+-\s+)[^\n]+/, "$1missing.canonical-target");
  assert.notEqual(changed, source);
  writeFileSync(carryPath, changed);
  const result = runTranslation([`--atlas-root=${atlas}`, "--verify-only"]);
  rmSync(root, { recursive: true, force: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unresolved .* target missing\.canonical-target/);
});

test("D1 reconstructs all identities, placements, determinations, relations, and protocol members", () => {
  const root = mkdtempSync(join(tmpdir(), "rm-d1-"));
  const db = join(root, "atlas.db");
  const schemaSql = readFileSync(join(generatedRoot, "atlas-d1-schema.sql"), "utf8");
  const dataSql = readFileSync(join(generatedRoot, "atlas-d1-sync.sql"), "utf8");
  assert.doesNotMatch(dataSql, /^(?:BEGIN TRANSACTION|COMMIT);$/m);
  assert.match(schemaSql, /^DROP TABLE IF EXISTS atlas_registers;$/m);
  const importSql = buildRemoteImport(schemaSql, dataSql);
  const importResult = spawnSync("sqlite3", [db], { input: importSql, encoding: "utf8" });
  assert.equal(importResult.status, 0, importResult.stderr);
  const query = [
    "select count(*) from entries;",
    "select count(*) from entries where entry_order is not null;",
    "select count(*) from entries where entry_register is not null;",
    "select count(*) from atlas_protocol_members where protocol='ai-entry';",
    "select value from atlas_metadata where key='source_hash';",
  ].join(" ");
  const result = spawnSync("sqlite3", [db, query], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.stdout.trim().split("\n"), ["493", "444", "49", "3", graph.sourceHash]);

  const rowsResult = spawnSync("sqlite3", ["-json", db,
    "select id,entry_order,entry_register,determination,structure,conditions from entries order by id;"],
  { encoding: "utf8" });
  assert.equal(rowsResult.status, 0, rowsResult.stderr);
  const rows = JSON.parse(rowsResult.stdout);
  assert.equal(rows.length, 493);
  for (const row of rows) {
    const entry = graph.entries[row.id];
    assert.ok(entry, row.id);
    assert.equal(row.entry_order ?? null, entry.order ?? null, `${row.id}:order`);
    assert.equal(row.entry_register ?? null, entry.register ?? null, `${row.id}:register`);
    assert.equal(row.determination, entry.determination, `${row.id}:determination`);
    assert.deepEqual(JSON.parse(row.conditions), entry.conditions, `${row.id}:conditions`);
    assert.deepEqual(
      JSON.parse(row.structure),
      Object.fromEntries(Object.keys(entry.conditions).filter((key) => key !== "places").map((key) => [key, entry.conditions[key].targets])),
      `${row.id}:structure`,
    );
  }
  rmSync(root, { recursive: true, force: true });
});

test("D1 import removes the legacy structural register table", () => {
  const root = mkdtempSync(join(tmpdir(), "rm-d1-legacy-"));
  const db = join(root, "atlas.db");
  let result = spawnSync("sqlite3", [db, "CREATE TABLE atlas_registers (register TEXT, key TEXT, value TEXT); INSERT INTO atlas_registers VALUES ('legacy','order','foundation');"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);

  const importSql = buildRemoteImport(
    readFileSync(join(generatedRoot, "atlas-d1-schema.sql"), "utf8"),
    readFileSync(join(generatedRoot, "atlas-d1-sync.sql"), "utf8"),
  );
  result = spawnSync("sqlite3", [db], { input: importSql, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  result = spawnSync("sqlite3", [db, "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='atlas_registers';"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "0");
  rmSync(root, { recursive: true, force: true });
});

test("AI and search participation preserve graph identity and entry parity", () => {
  const aiIndex = JSON.parse(readFileSync(join(generatedRoot, "ai", "current", "index.json"), "utf8"));
  const search = JSON.parse(readFileSync(join(generatedRoot, "participation", "search-index.json"), "utf8"));
  assert.equal(aiIndex.sourceHash, graph.sourceHash);
  assert.equal(aiIndex.entryCount, 493);
  assert.deepEqual(aiIndex.entryIds, Object.keys(graph.entries));
  assert.deepEqual(search.entries.map((entry) => entry.id), Object.keys(graph.entries));

  for (const id of aiIndex.entryIds) {
    const entry = JSON.parse(readFileSync(join(generatedRoot, "ai", "current", "entries", `${id}.json`), "utf8"));
    assert.equal(entry.id, id);
    const { id: _id, ...withoutId } = entry;
    assert.deepEqual(withoutId, graph.entries[id]);
    assert.deepEqual(search.entries.find((item) => item.id === id).conditions, graph.entries[id].conditions);
  }
});

test("deleting disposable outputs and translating twice is byte-identical", () => {
  const root = mkdtempSync(join(tmpdir(), "rm-rebuild-"));
  const first = join(root, "first");
  const second = join(root, "second");
  const firstRun = runTranslation([`--output-root=${first}`]);
  const secondRun = runTranslation([`--output-root=${second}`]);
  assert.equal(firstRun.status, 0, firstRun.stderr);
  assert.equal(secondRun.status, 0, secondRun.stderr);

  const firstFiles = filesUnder(first);
  const secondFiles = filesUnder(second);
  assert.deepEqual(firstFiles, secondFiles);
  for (const path of firstFiles) {
    assert.deepEqual(readFileSync(join(first, path)), readFileSync(join(second, path)), path);
  }
  rmSync(root, { recursive: true, force: true });
});
