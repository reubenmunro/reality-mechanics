#!/usr/bin/env node

import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { buildRemoteImport, resolveWrangler, verifyRemoteD1 } from "./d1-remote.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const apply = args.has("--apply");
const allowDirty = args.has("--allow-dirty");
const databaseArgs = rawArgs.filter((arg) => arg.startsWith("--database="));
const unknown = [...args].filter((arg) => !["--apply", "--allow-dirty"].includes(arg) && !arg.startsWith("--database="));

if (unknown.length || databaseArgs.length > 1 || databaseArgs[0] === "--database=") {
  console.error(`Unknown argument${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`);
  console.error("Usage: node sync-d1-from-repo.mjs [--apply] [--allow-dirty] [--database=<D1 name>]");
  process.exit(1);
}
const database = databaseArgs[0]?.slice("--database=".length) || "atlas-d1";

if (!allowDirty) {
  const status = execFileSync(
    "git",
    ["status", "--porcelain", "--untracked-files=all", "--", "Reality_Mechanics"],
    { cwd: repoRoot, encoding: "utf8" },
  ).trim();
  if (status) {
    console.error("Atlas translation stopped: Reality_Mechanics has uncommitted or untracked changes.");
    console.error("Use --allow-dirty only for an explicitly reviewed migration or recovery run.");
    process.exit(1);
  }
}

const translation = spawnSync("ruby", [join(here, "translate-atlas.rb")], {
  cwd: repoRoot,
  encoding: "utf8",
});
if (translation.stdout) process.stdout.write(translation.stdout);
if (translation.stderr) process.stderr.write(translation.stderr);
if (translation.status !== 0) process.exit(translation.status ?? 1);

if (!apply) {
  console.log("Generated disposable participation artefacts. D1 was not written.");
  process.exit(0);
}

const generatedRoot = join(here, "generated");
const schemaSql = await readFile(join(generatedRoot, "atlas-d1-schema.sql"), "utf8");
const dataSql = await readFile(join(generatedRoot, "atlas-d1-sync.sql"), "utf8");
const importSql = buildRemoteImport(schemaSql, dataSql);
const wrangler = await resolveWrangler(repoRoot);
const temporaryRoot = await mkdtemp(join(tmpdir(), "rm-d1-import-"));
const importFile = join(temporaryRoot, "atlas-d1-import.sql");

try {
  await writeFile(importFile, importSql);
  const result = spawnSync(
    wrangler.command,
    [...wrangler.prefix, "d1", "execute", database, "--remote", "--file", importFile, "--yes"],
    { cwd: repoRoot, stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);

  const verification = await verifyRemoteD1({ database, generatedRoot, repoRoot, wrangler });
  console.log("D1 import and exact generated parity verified:");
  console.log(JSON.stringify(verification, null, 2));
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
