// Tests for the shared parser (atlas-core.mjs). Zero-dependency: node:test.
// Run: node --test test/   (or: npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  splitFrontmatter, frontmatterValue, shouldPublish, titleFromBody,
  wikilinkTargets, slugify, noteSlug, parseTopLevelList, parseConditionsBlock, orderOf,
} from "../atlas-core.mjs";

test("splitFrontmatter separates frontmatter and body", () => {
  const { frontmatter, body } = splitFrontmatter("---\norder: first\n---\n# Title\n\nBody.");
  assert.equal(frontmatter, "order: first");
  assert.equal(body, "# Title\n\nBody.");
});

test("splitFrontmatter with no frontmatter returns the whole body", () => {
  const { frontmatter, body } = splitFrontmatter("# No frontmatter\n");
  assert.equal(frontmatter, "");
  assert.equal(body, "# No frontmatter\n");
});

test("frontmatterValue strips quotes and preserves case", () => {
  assert.equal(frontmatterValue('status: "Working"', "status"), "Working");
  assert.equal(frontmatterValue("status: Working", "status"), "Working");
  assert.equal(frontmatterValue("order: first", "order"), "first");
  assert.equal(frontmatterValue("order: first", "missing"), "");
});

test("shouldPublish honours the five flags and defaults to publish", () => {
  assert.equal(shouldPublish("order: first"), true);
  assert.equal(shouldPublish("grounded: true"), true);
  for (const fm of ["private: true", "draft: true", "grounded: false", "publish: false", "published: false"]) {
    assert.equal(shouldPublish(fm), false, fm);
  }
});

test("titleFromBody reads the H1, else empty", () => {
  assert.equal(titleFromBody("# Bearing\n\ntext"), "Bearing");
  assert.equal(titleFromBody("no heading"), "");
});

test("wikilinkTargets extracts targets, drops aliases and headings", () => {
  assert.deepEqual(wikilinkTargets("[[Relation]] and [[Bearing|the bearing]]"), ["Relation", "Bearing"]);
  assert.deepEqual(wikilinkTargets("[[Theory#Section]]"), ["Theory"]);
  assert.deepEqual(wikilinkTargets("no links here"), []);
  assert.deepEqual(wikilinkTargets(""), []);
});

test("slugify handles case, spaces, diacritics and trimming", () => {
  assert.equal(slugify("Reality Mechanics"), "reality-mechanics");
  assert.equal(slugify("Café Noir"), "cafe-noir");
  assert.equal(slugify("  --Trim--  "), "trim");
});

test("noteSlug applies the Theory special case", () => {
  assert.equal(noteSlug("Reality Mechanics Theory", "Theory"), "theory");
  assert.equal(noteSlug("Anything", "Theory"), "theory");
  assert.equal(noteSlug("Bearing", "Bearing"), "bearing");
});

test("parseTopLevelList reads block lists of wikilinks", () => {
  const fm = ['needs:', '  - "[[A]]"', '  - "[[B]]"', "conditions:"].join("\n");
  assert.deepEqual(parseTopLevelList(fm, "needs"), ["A", "B"]);
  assert.deepEqual(parseTopLevelList(fm, "crossings"), []);
});

test("parseConditionsBlock reads string fields and list fields", () => {
  const fm = [
    "order: first",
    "conditions:",
    '  places: "the place"',
    '  holds: "[[A]] and [[B]]."',
    "  traces:",
    '    - "[[A]]"',
    '    - "[[B]]"',
    "publish: true",
  ].join("\n");
  const c = parseConditionsBlock(fm);
  assert.equal(c.places, "the place");
  assert.equal(c.holds, "[[A]] and [[B]].");
  assert.deepEqual(c.traces, ["[[A]]", "[[B]]"]);
});

test("orderOf ranks by id prefix; practice is the apex, ground is 0", () => {
  assert.equal(orderOf("first.place"), 1);
  assert.equal(orderOf("third.ai-drift"), 3);
  assert.equal(orderOf("practice.section"), 5);
  assert.equal(orderOf("ground.relation"), 0);
});
