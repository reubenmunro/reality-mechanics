#!/usr/bin/env node

import { access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const allowDirty = args.has("--allow-dirty");
const unknown = [...args].filter((arg) => !["--apply", "--allow-dirty"].includes(arg));

if (unknown.length) {
  console.error(`Unknown argument${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`);
  process.exit(1);
}

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

const wranglerCandidates = [
  join(repoRoot, ".atlas-publisher", "node_modules", ".bin", "wrangler"),
  join(repoRoot, "member", "node_modules", ".bin", "wrangler"),
  join(repoRoot, "reality-mechanics-mcp", "node_modules", ".bin", "wrangler"),
];
let wranglerCommand = "npx";
let wranglerPrefix = ["wrangler"];
for (const candidate of wranglerCandidates) {
  try {
    await access(candidate);
    wranglerCommand = candidate;
    wranglerPrefix = [];
    break;
  } catch {
    // Use npx only when no workspace Wrangler executable exists.
  }
}

for (const file of ["atlas-d1-schema.sql", "atlas-d1-sync.sql"]) {
  const result = spawnSync(
    wranglerCommand,
    [...wranglerPrefix, "d1", "execute", "atlas-d1", "--remote", "--file", join(here, "generated", file)],
    { cwd: repoRoot, stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
