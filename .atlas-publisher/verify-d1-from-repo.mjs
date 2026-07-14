#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveWrangler, verifyRemoteD1 } from "./d1-remote.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const databaseArgs = process.argv.slice(2).filter((arg) => arg.startsWith("--database="));
const unknown = process.argv.slice(2).filter((arg) => !arg.startsWith("--database="));

if (unknown.length || databaseArgs.length > 1 || databaseArgs[0] === "--database=") {
  console.error("Usage: node verify-d1-from-repo.mjs [--database=<D1 name>]");
  process.exit(1);
}

const database = databaseArgs[0]?.slice("--database=".length) || "atlas-d1";
const wrangler = await resolveWrangler(repoRoot);
const result = await verifyRemoteD1({
  database,
  generatedRoot: resolve(here, "generated"),
  repoRoot,
  wrangler,
});
console.log(JSON.stringify(result, null, 2));
