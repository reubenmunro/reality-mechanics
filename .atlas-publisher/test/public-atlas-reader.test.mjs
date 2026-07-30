import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../main-website-worker.js";
import {
  atlasEntryPath,
  atlasPage,
  landingPage,
  provenancePage,
} from "../public-atlas.mjs";
import {
  CANONICAL_SOURCE_HASH,
  RELATION_KEYS,
} from "../generated/canonical-participation.mjs";
import {
  RELEASE_IDENTIFIER,
  TRANSLATION_HASH,
} from "../generated/release-identity.mjs";

function currentEnv() {
  return {
    ATLAS_DB: {
      prepare() {
        return {
          bind() { return this; },
          async all() {
            return { results: [
              { key: "source_hash", value: CANONICAL_SOURCE_HASH },
              { key: "entry_count", value: "493" },
            ] };
          },
        };
      },
    },
  };
}

test("landing page orients before either primary human entrance", () => {
  const html = landingPage();
  assert.match(html, /Two ways into one structure/);
  assert.match(html, /A dependency-ordered Atlas and a set of instruments for reading its structure/);
  assert.match(html, /href="\/atlas"[\s\S]*Read the Atlas/);
  assert.match(html, /href="\/field"[\s\S]*Enter the Observatory/);
  assert.match(html, /href="\/provenance">Provenance/);
  assert.doesNotMatch(html, /github\.com/i);
});

test("provenance is on-site and GitHub is an optional maintained-record disclosure", () => {
  const html = provenancePage();
  assert.match(html, new RegExp(CANONICAL_SOURCE_HASH));
  assert.match(html, new RegExp(TRANSLATION_HASH));
  assert.match(html, new RegExp(RELEASE_IDENTIFIER));
  assert.match(html, /fetch\("\/manifest\.json"\)/);
  assert.match(html, /<details>[\s\S]*Maintained record[\s\S]*github\.com/);
  assert.match(html, /public Atlas and Observatory are generated participation in one canonical/);
});

test("Atlas reader consumes only generated canonical translation assets", () => {
  const html = atlasPage("first.carry");
  assert.match(html, /data-initial-entry="first\.carry"/);
  assert.match(html, /fetch\("\/participation\/search-index\.json"\)/);
  assert.match(html, /fetch\("\/ai\/current\/entries\/"/);
  assert.match(html, /One declared relation-hop from the selected entry/);
  assert.match(html, /history\.pushState/);
  assert.match(html, /popstate/);
  assert.match(html, new RegExp(CANONICAL_SOURCE_HASH));
  for (const relation of RELATION_KEYS) assert.match(html, new RegExp(`"${relation}"`), relation);
  assert.doesNotMatch(html, /github\.com/i);
});

test("Atlas entry paths preserve exact canonical identifiers", () => {
  assert.equal(atlasEntryPath("first.carry"), "/atlas/first.carry");
  assert.equal(atlasEntryPath("practice.atlas"), "/atlas/practice.atlas");
});

test("public routes serve landing, Atlas, deep links, and provenance with one identity", async () => {
  for (const path of ["/", "/atlas", "/atlas/first.carry", "/provenance"]) {
    const response = await worker.fetch(new Request(`https://realitymechanics.nz${path}`), currentEnv());
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-rm-canonical-source-hash"), CANONICAL_SOURCE_HASH, path);
    assert.equal(response.headers.get("x-rm-translation-hash"), TRANSLATION_HASH, path);
    assert.equal(response.headers.get("x-rm-release-identifier"), RELEASE_IDENTIFIER, path);
  }
});

test("unknown Atlas identifiers fail without inventing an entry", async () => {
  const response = await worker.fetch(
    new Request("https://realitymechanics.nz/atlas/first.not-a-canonical-entry"),
    currentEnv(),
  );
  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Atlas entry not found.");
});
