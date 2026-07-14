#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
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
import { buildRemoteImport } from "./d1-remote.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const generatedRoot = join(here, "generated");
const publicRoot = join(generatedRoot, "public");
const mcpGeneratedRoot = join(repoRoot, "reality-mechanics-mcp", "generated");

const D1_DATASETS = {
  entries: "SELECT * FROM entries ORDER BY id;",
  fts: "SELECT id,title,plain_text FROM entries_fts ORDER BY id;",
  metadata: "SELECT key,value FROM atlas_metadata ORDER BY key;",
  determinations: "SELECT * FROM atlas_determinations ORDER BY id;",
  protocol: "SELECT protocol,ordinal,entry_id FROM atlas_protocol_members ORDER BY protocol,ordinal;",
};

function sha256(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function filesUnder(root) {
  return readdirSync(root, { recursive: true })
    .map(String)
    .filter((path) => statSync(join(root, path)).isFile())
    .sort();
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, ...options });
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout;
}

function d1DatasetHashes() {
  const root = mkdtempSync(join(tmpdir(), "rm-public-translation-"));
  const db = join(root, "atlas.db");
  try {
    const schema = readFileSync(join(generatedRoot, "atlas-d1-schema.sql"), "utf8");
    const data = readFileSync(join(generatedRoot, "atlas-d1-sync.sql"), "utf8");
    run("sqlite3", [db], { input: buildRemoteImport(schema, data) });
    return Object.fromEntries(Object.entries(D1_DATASETS).map(([name, sql]) => {
      const rows = JSON.parse(run("sqlite3", ["-json", db, sql]) || "[]");
      return [name, sha256(JSON.stringify(rows))];
    }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function implementationCommit() {
  const value = process.env.RM_TRANSLATION_COMMIT
    || execFileSync("git", ["-C", repoRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  if (!/^[a-f0-9]{40}$/.test(value)) throw new Error(`Invalid Translation implementation commit: ${value}`);
  return value;
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function publicProjection() {
  const projection = [
    [join(generatedRoot, "ai", "current"), join(publicRoot, "ai", "current")],
    [join(generatedRoot, "participation", "search-index.json"), join(publicRoot, "participation", "search-index.json")],
    [join(generatedRoot, "participation", "atlas-source-format.md"), join(publicRoot, "participation", "atlas-source-format.md")],
  ];
  for (const [source, destination] of projection) {
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true });
  }
}

function outputIdentities(root, excluded = () => false) {
  const files = filesUnder(root).filter((path) => !excluded(path));
  const aggregate = createHash("sha256");
  const hashes = {};
  for (const path of files) {
    const bytes = readFileSync(join(root, path));
    hashes[`/${path}`] = sha256(bytes);
    aggregate.update(`/${path}\0`);
    aggregate.update(bytes);
    aggregate.update("\0");
  }
  return {
    files,
    hashes,
    aggregateHash: `sha256:${aggregate.digest("hex")}`,
  };
}

function declaration(graph, key) {
  const owners = Object.values(graph.entries).filter((entry) => entry[key]);
  if (owners.length !== 1) throw new Error(`Expected one ${key} declaration; found ${owners.length}`);
  return owners[0][key];
}

function assertDeliveryCopy(actual, expected, label) {
  if (!actual.equals(expected)) throw new Error(`${label} diverges from its primary generated output`);
}

export function buildPublicTranslation() {
  rmSync(publicRoot, { recursive: true, force: true });
  rmSync(join(generatedRoot, "manifest.json"), { force: true });
  rmSync(join(generatedRoot, "release-identity.mjs"), { force: true });

  const graphBytes = readFileSync(join(generatedRoot, "canonical-graph.json"));
  const graph = JSON.parse(graphBytes);
  const outputIdentity = outputIdentities(generatedRoot, (path) => path.startsWith("public/"));
  publicProjection();
  const publicIdentity = outputIdentities(publicRoot);
  const deliveryCopies = {
    "reality-mechanics-mcp/generated/canonical-participation.mjs": readFileSync(join(mcpGeneratedRoot, "canonical-participation.mjs")),
    "docs/generated/atlas-source-format.md": readFileSync(join(repoRoot, "docs", "generated", "atlas-source-format.md")),
  };
  assertDeliveryCopy(
    deliveryCopies["reality-mechanics-mcp/generated/canonical-participation.mjs"],
    readFileSync(join(generatedRoot, "canonical-participation.mjs")),
    "MCP canonical participation module",
  );
  assertDeliveryCopy(
    deliveryCopies["docs/generated/atlas-source-format.md"],
    readFileSync(join(generatedRoot, "participation", "atlas-source-format.md")),
    "generated source-format documentation",
  );
  const translationCommit = implementationCommit();
  const releaseIdentifier = process.env.RM_RELEASE_ID
    || `first-canonical-translation-rc-001b-${translationCommit.slice(0, 12)}`;
  const relationCount = Object.values(graph.entries).reduce((total, entry) => total
    + Object.entries(entry.conditions)
      .filter(([name]) => name !== "places")
      .reduce((entryTotal, [, relation]) => entryTotal + relation.targets.length, 0), 0);
  const determinations = declaration(graph, "determinationRecords");
  const protocols = declaration(graph, "protocols");

  const manifest = {
    formatVersion: 1,
    canonicalSourceHash: graph.sourceHash,
    canonicalGraphHash: sha256(graphBytes),
    translationHash: outputIdentity.aggregateHash,
    aggregateGeneratedOutputHash: outputIdentity.aggregateHash,
    aggregateScope: "All primary Canonical Translation outputs under .atlas-publisher/generated except the public delivery copies, release manifest, and release identity module; ordered by generated path.",
    translationImplementationCommit: translationCommit,
    releaseIdentifier,
    counts: {
      entries: Object.keys(graph.entries).length,
      orderEntries: Object.values(graph.entries).filter((entry) => entry.order).length,
      registerEntries: Object.values(graph.entries).filter((entry) => entry.register).length,
      relationTargets: relationCount,
      determinationReferences: Object.values(graph.entries).filter((entry) => entry.determination).length,
      determinationRecords: Object.keys(determinations).length,
      protocolMembers: Object.values(protocols).reduce((total, members) => total + members.length, 0),
      generatedOutputs: outputIdentity.files.length + Object.keys(deliveryCopies).length,
      publicAssets: publicIdentity.files.length + 1,
    },
    protocols,
    outputs: outputIdentity.hashes,
    deliveryCopies: Object.fromEntries(Object.entries(deliveryCopies).map(([path, bytes]) => [path, sha256(bytes)])),
    publicOutputs: publicIdentity.hashes,
    expectedD1DatasetHashes: d1DatasetHashes(),
    authority: "Generated participation. The GitHub Atlas is the sole maintained structural authority.",
  };

  writeJson(join(generatedRoot, "manifest.json"), manifest);
  writeJson(join(publicRoot, "manifest.json"), manifest);

  const identityModule = `// Generated from the release-bound Translation outputs. Delete and regenerate; do not edit.\n`
    + `export const CANONICAL_GRAPH_HASH = ${JSON.stringify(manifest.canonicalGraphHash)};\n`
    + `export const TRANSLATION_HASH = ${JSON.stringify(manifest.translationHash)};\n`
    + `export const TRANSLATION_IMPLEMENTATION_COMMIT = ${JSON.stringify(translationCommit)};\n`
    + `export const RELEASE_IDENTIFIER = ${JSON.stringify(releaseIdentifier)};\n`
    + `export const EXPECTED_D1_DATASET_HASHES = Object.freeze(${JSON.stringify(manifest.expectedD1DatasetHashes)});\n`;
  writeFileSync(join(generatedRoot, "release-identity.mjs"), identityModule);
  mkdirSync(mcpGeneratedRoot, { recursive: true });
  writeFileSync(join(mcpGeneratedRoot, "release-identity.mjs"), identityModule);

  return {
    canonicalSourceHash: manifest.canonicalSourceHash,
    canonicalGraphHash: manifest.canonicalGraphHash,
    translationHash: manifest.translationHash,
    releaseIdentifier,
    publicAssets: manifest.counts.publicAssets,
    publicBytes: filesUnder(publicRoot).reduce((total, path) => total + statSync(join(publicRoot, path)).size, 0),
    publicRoot: relative(repoRoot, publicRoot),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(buildPublicTranslation(), null, 2));
}
