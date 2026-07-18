import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_SOURCE_HASH,
} from "../generated/canonical-participation.mjs";
import {
  RELEASE_IDENTIFIER,
  TRANSLATION_HASH,
} from "../generated/release-identity.mjs";
import worker, { legacyRedirectFor } from "../main-website-worker.js";

const here = dirname(fileURLToPath(import.meta.url));
const publisherRoot = resolve(here, "..");
const repoRoot = resolve(publisherRoot, "..");
const generatedRoot = join(publisherRoot, "generated");
const publicRoot = join(generatedRoot, "public");

function filesUnder(root) {
  return readdirSync(root, { recursive: true })
    .map(String)
    .filter((path) => statSync(join(root, path)).isFile())
    .sort();
}

function treeHash(roots) {
  const hash = createHash("sha256");
  for (const root of roots) {
    for (const path of filesUnder(root)) {
      hash.update(`${root.slice(repoRoot.length + 1)}/${path}\0`);
      hash.update(readFileSync(join(root, path)));
      hash.update("\0");
    }
  }
  return hash.digest("hex");
}

function mime(pathname) {
  if (pathname.endsWith(".json")) return "application/json; charset=utf-8";
  if (pathname.endsWith(".md")) return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

function workerEnv(sourceHash = CANONICAL_SOURCE_HASH) {
  return {
    ATLAS_DB: {
      prepare(sql) {
        return {
          bind() { return this; },
          async all() {
            if (/FROM atlas_metadata\b/.test(sql)) return { results: [
              { key: "source_hash", value: sourceHash },
              { key: "entry_count", value: sourceHash === CANONICAL_SOURCE_HASH ? "493" : "490" },
            ] };
            return { results: [] };
          },
        };
      },
    },
    ASSETS: {
      async fetch(request) {
        const pathname = new URL(request.url).pathname;
        const path = join(publicRoot, pathname.replace(/^\//, ""));
        if (!existsSync(path)) return new Response("not found", { status: 404 });
        return new Response(readFileSync(path), { headers: { "content-type": mime(pathname) } });
      },
    },
  };
}

test("public bundle contains only the approved 493-entry generated participation", () => {
  const manifest = JSON.parse(readFileSync(join(publicRoot, "manifest.json"), "utf8"));
  const index = JSON.parse(readFileSync(join(publicRoot, "ai", "current", "index.json"), "utf8"));
  assert.equal(manifest.canonicalSourceHash, CANONICAL_SOURCE_HASH);
  assert.equal(manifest.canonicalGraphHash, "sha256:7fc43f39b0cad3eecaa044fb16d6bf9ed73ba80eac8d88a90430421a46636bfc");
  assert.equal(manifest.translationHash, TRANSLATION_HASH);
  assert.equal(manifest.translationHash, "sha256:33b117628f44450da2ed0c6897c71ae275ba276b1f1ccae66837de2a0df72596");
  assert.equal(manifest.releaseIdentifier, RELEASE_IDENTIFIER);
  assert.deepEqual(manifest.counts, {
    entries: 493,
    orderEntries: 444,
    registerEntries: 49,
    relationTargets: 7323,
    determinationReferences: 493,
    determinationRecords: 7,
    protocolMembers: 3,
    generatedOutputs: 504,
    publicAssets: 497,
  });
  assert.equal(index.entryCount, 493);
  assert.equal(index.entryIds.length, 493);
  assert.equal(filesUnder(join(publicRoot, "ai", "current", "entries")).length, 493);
  assert.equal(index.entryIds.includes("practice.atlas-condition-header"), false);
  assert.equal(index.entryIds.includes("practice.atlas-note-standard"), false);
  assert.deepEqual(manifest.expectedD1DatasetHashes, {
    entries: "sha256:7eb50021481ad1ae4fd8c6a4e04ab566341453c35a9f070bc37f6c07657d019d",
    fts: "sha256:add49f7a6543644eeb95e08ba6e6bec8f2a90ac5023f45dccd83d2c30653fe6d",
    metadata: "sha256:7a510403cc09cbc1c2395eaa42b6ebd734dc02160b8ea7f8f9d52705f349552d",
    determinations: "sha256:aeed8bfe92d332d6106d8aa7b9200359557f889204c91b60f9e55f88bd77cc1a",
    protocol: "sha256:94829b499c48fe785a2f3aee9fd8902d36aa9262966e601bfb9b740e48b1b2be",
  });
});

test("public bundle bytes are exact projections of existing generated outputs", () => {
  const paths = [
    "ai/current/index.json",
    "ai/current/entries/practice.atlas.json",
    "participation/search-index.json",
    "participation/atlas-source-format.md",
  ];
  for (const path of paths) {
    assert.deepEqual(readFileSync(join(publicRoot, path)), readFileSync(join(generatedRoot, path)), path);
  }
});

test("Main Worker serves every generated route with matching Translation identity", async () => {
  const paths = [
    "/ai/current/index.json",
    "/ai/current/entries/practice.atlas.json",
    "/participation/search-index.json",
    "/participation/atlas-source-format.md",
    "/manifest.json",
  ];
  for (const path of paths) {
    const response = await worker.fetch(new Request(`https://realitymechanics.nz${path}`), workerEnv());
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-rm-canonical-source-hash"), CANONICAL_SOURCE_HASH, path);
    assert.equal(response.headers.get("x-rm-translation-hash"), TRANSLATION_HASH, path);
    assert.equal(response.headers.get("x-rm-release-identifier"), RELEASE_IDENTIFIER, path);
  }
});

test("every Atlas-bearing HTML route exposes the same release identity", async () => {
  for (const path of ["/", "/field", "/theory", "/proof", "/calculus"]) {
    const response = await worker.fetch(new Request(`https://realitymechanics.nz${path}`), workerEnv());
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-rm-canonical-source-hash"), CANONICAL_SOURCE_HASH, path);
    assert.equal(response.headers.get("x-rm-translation-hash"), TRANSLATION_HASH, path);
  }
});

test("Main and MCP consume one generated Translation identity", async () => {
  const mcpIdentity = await import("../../reality-mechanics-mcp/generated/release-identity.mjs");
  assert.equal(mcpIdentity.TRANSLATION_HASH, TRANSLATION_HASH);
  assert.equal(mcpIdentity.RELEASE_IDENTIFIER, RELEASE_IDENTIFIER);
  assert.deepEqual(
    readFileSync(join(generatedRoot, "release-identity.mjs")),
    readFileSync(join(repoRoot, "reality-mechanics-mcp", "generated", "release-identity.mjs")),
  );
});

test("Main Worker fails closed before a stale generated asset can be served", async () => {
  let assetReads = 0;
  const env = workerEnv("sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  env.ASSETS.fetch = async () => {
    assetReads += 1;
    return new Response(JSON.stringify({ entryCount: 493 }));
  };
  for (const path of ["/ai/current/index.json", "/theory"]) {
    const response = await worker.fetch(new Request(`https://realitymechanics.nz${path}`), env);
    const body = await response.json();
    assert.equal(response.status, 503, path);
    assert.equal(body.error, "current_translation_unavailable", path);
  }
  assert.equal(assetReads, 0);
});

test("removed pre-migration records cannot be served from the approved bundle", async () => {
  for (const id of ["practice.atlas-condition-header", "practice.atlas-note-standard"]) {
    const response = await worker.fetch(new Request(`https://realitymechanics.nz/ai/current/entries/${id}.json`), workerEnv());
    assert.equal(response.status, 404, id);
  }
});

test("legacy custom and default Pages hosts map to the approved destinations", () => {
  assert.equal(
    legacyRedirectFor("https://theory.realitymechanics.nz/old?from=pages"),
    "https://realitymechanics.nz/theory?from=pages",
  );
  assert.equal(
    legacyRedirectFor("https://reality-mechanics-theory.pages.dev/"),
    "https://realitymechanics.nz/theory",
  );
  assert.equal(
    legacyRedirectFor("https://atlas.realitymechanics.nz/ai/current/index.json?v=1"),
    "https://realitymechanics.nz/ai/current/index.json?v=1",
  );
  assert.equal(
    legacyRedirectFor("https://atlas.realitymechanics.nz/ai"),
    "https://realitymechanics.nz/ai/current/index.json",
  );
  assert.equal(
    legacyRedirectFor("https://reality-mechanics-atlas.pages.dev/ai/current/entries/first.relation.json"),
    "https://realitymechanics.nz/ai/current/entries/first.relation.json",
  );
  assert.equal(
    legacyRedirectFor("https://atlas.realitymechanics.nz/relation"),
    "https://github.com/reubenmunro/reality-mechanics/tree/main/Reality_Mechanics",
  );
});

test("no Pages builder or manual canonical declaration remains in active deployment", () => {
  for (const path of [
    "Build Atlas Website.command",
    "Deploy Atlas Website.command",
    ".atlas-publisher/build.mjs",
    ".atlas-publisher/build-atlas-ai-index.mjs",
  ]) assert.equal(existsSync(join(repoRoot, path)), false, path);
  const workflow = readFileSync(join(repoRoot, ".github", "workflows", "deploy.yml"), "utf8");
  assert.doesNotMatch(workflow, /pages deploy|wrangler pages|build-atlas-ai-index|Build Atlas Website/);
  for (const path of [
    ".atlas-publisher/wrangler.toml",
    "reality-mechanics-mcp/wrangler.toml",
    "member/wrangler.toml",
  ]) {
    const config = readFileSync(join(repoRoot, path), "utf8");
    assert.match(config, /workers_dev\s*=\s*false/, path);
    assert.doesNotMatch(config, /workers_dev\s*=\s*true/, path);
  }
});

test("the exact D1 sync path leaves the complete public Translation deployable", () => {
  const sync = spawnSync(process.execPath, [join(publisherRoot, "sync-d1-from-repo.mjs")], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(sync.status, 0, sync.stderr);
  assert.equal(existsSync(publicRoot), true);
  assert.equal(filesUnder(publicRoot).length, 497);
  assert.equal(existsSync(join(publicRoot, "manifest.json")), true);
  assert.equal(existsSync(join(generatedRoot, "release-identity.mjs")), true);

  const manifest = JSON.parse(readFileSync(join(publicRoot, "manifest.json"), "utf8"));
  assert.equal(manifest.canonicalSourceHash, CANONICAL_SOURCE_HASH);
  assert.equal(manifest.canonicalGraphHash, "sha256:7fc43f39b0cad3eecaa044fb16d6bf9ed73ba80eac8d88a90430421a46636bfc");
  assert.equal(manifest.translationHash, TRANSLATION_HASH);
  assert.equal(manifest.releaseIdentifier, RELEASE_IDENTIFIER);
});

test("Main Worker dry-runs immediately after the exact D1 sync path", {
  skip: !process.env.RM_WRANGLER_BIN,
}, () => {
  const sync = spawnSync(process.execPath, [join(publisherRoot, "sync-d1-from-repo.mjs")], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(sync.status, 0, sync.stderr);

  const dryRun = spawnSync(process.env.RM_WRANGLER_BIN, ["deploy", "--config", "wrangler.toml", "--dry-run"], {
    cwd: publisherRoot,
    encoding: "utf8",
  });
  assert.equal(dryRun.status, 0, dryRun.stderr);
  assert.match(dryRun.stdout, /Read 501 files from the assets directory/);
  assert.match(dryRun.stdout, /--dry-run: exiting now/);
});

test("D1 sync, direct Translation, and repeated orchestration are byte-identical", () => {
  const roots = [
    generatedRoot,
    join(repoRoot, "reality-mechanics-mcp", "generated"),
    join(repoRoot, "docs", "generated"),
  ];
  const syncArgs = [join(publisherRoot, "sync-d1-from-repo.mjs")];
  const firstSync = spawnSync(process.execPath, syncArgs, { cwd: repoRoot, encoding: "utf8" });
  assert.equal(firstSync.status, 0, firstSync.stderr);
  const syncHash = treeHash(roots);

  const direct = spawnSync("npm", ["run", "translate"], { cwd: publisherRoot, encoding: "utf8" });
  assert.equal(direct.status, 0, direct.stderr);
  assert.equal(treeHash(roots), syncHash);

  const secondSync = spawnSync(process.execPath, syncArgs, { cwd: repoRoot, encoding: "utf8" });
  assert.equal(secondSync.status, 0, secondSync.stderr);
  assert.equal(treeHash(roots), syncHash);
});
