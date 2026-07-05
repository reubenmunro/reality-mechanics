import { test } from "node:test";
import assert from "node:assert/strict";
import {
  atlasSourceViewUrl,
  observatoryPlaceDisplay,
  openingParagraphsBeforeTemplate,
  stripDuplicatedTitle,
} from "../observatory-panel.mjs";

test("openingParagraphsBeforeTemplate reads pre-template body only", () => {
  const body = `# Field Relationships

A working grouping of third-order fields by recurring participation emphasis.

Field Relationships is held by [[Third Order]].

## Places

Field Relationships places a working grouping.`;

  assert.deepEqual(openingParagraphsBeforeTemplate(body), [
    "A working grouping of third-order fields by recurring participation emphasis.",
    "Field Relationships is held by [[Third Order]].",
  ]);
});

test("stripDuplicatedTitle removes repeated term name from opening", () => {
  assert.equal(
    stripDuplicatedTitle("Field Relationships", "Field Relationships A working grouping of third-order fields."),
    "A working grouping of third-order fields.",
  );
  assert.equal(
    stripDuplicatedTitle("Invariant", "Invariant Invariant What remains stable across traversal."),
    "What remains stable across traversal.",
  );
  assert.equal(
    stripDuplicatedTitle("Hold", "Resolution remaining supportable as the same condition."),
    "Resolution remaining supportable as the same condition.",
  );
});

test("observatoryPlaceDisplay returns Invariant place without repeated title", () => {
  const body = `# Invariant

What remains stable across traversal, revision, application, or scale — preserved structure, not permanent immobility.

Invariant is held by [[Root Order]].

## Places

Invariant places what remains stable across traversal, revision, application, or scale.`;

  assert.equal(
    observatoryPlaceDisplay({ title: "Invariant", body }),
    "What remains stable across traversal, revision, application, or scale — preserved structure, not permanent immobility.",
  );
});

test("observatoryPlaceDisplay strips duplicated title for Field Relationships", () => {
  const body = `# Field Relationships

Field Relationships A working grouping of third-order fields by recurring participation emphasis.

Field Relationships is held by [[Third Order]].

## Places`;

  assert.equal(
    observatoryPlaceDisplay({ title: "Field Relationships", body }),
    "A working grouping of third-order fields by recurring participation emphasis.",
  );
});

test("observatoryPlaceDisplay returns Connection place sentence only", () => {
  const body = `# Connection

Relation holding between distinguishable conditions so that passage is available in more than one direction.

Connection is held by [[Relation]].

Held connection offers [[Carry]] forward.`;

  assert.equal(
    observatoryPlaceDisplay({ title: "Connection", body }),
    "Relation holding between distinguishable conditions so that passage is available in more than one direction.",
  );
});

test("observatoryPlaceDisplay returns empty when opening is hold-only", () => {
  const body = `# Example

Example is held by [[Relation]].

Example carries movement prose.`;

  assert.equal(observatoryPlaceDisplay({ title: "Example", body }), "");
});

test("atlasSourceViewUrl points to GitHub blob for source path", () => {
  assert.equal(
    atlasSourceViewUrl("Reality_Mechanics/3_Third/Field Relationships.md"),
    "https://github.com/reubenmunro/reality-mechanics/blob/main/Reality_Mechanics/3_Third/Field%20Relationships.md",
  );
});
