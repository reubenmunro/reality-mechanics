import { test } from "node:test";
import assert from "node:assert/strict";
import { entryMarkdown, orderIndex, plainText, relationTargets, slugify } from "../atlas-core.mjs";
import { ORDER_VALUES, RELATION_KEYS } from "../generated/canonical-participation.mjs";

test("generic rendering helpers do not parse canonical source structure", () => {
  assert.equal(slugify("Reality Mechanics"), "reality-mechanics");
  assert.equal(plainText("# Carry\n\n[[Relation|relation]] `holds`."), "Carry relation holds.");
  assert.equal(orderIndex("third", ORDER_VALUES), 3);
  assert.equal(orderIndex("practice", ORDER_VALUES), null);
});

test("entryMarkdown carries generated content without interpreting it", () => {
  const markdown = entryMarkdown({
    title: "Carry",
    content: {
      lead: "Lead.",
      sections: [{ depth: 2, heading: "Places", markdown: "Placed." }],
    },
  });
  assert.equal(markdown, "# Carry\n\nLead.\n\n## Places\n\nPlaced.\n");
});

test("relationTargets accepts only relation keys supplied by the generated schema", () => {
  const entry = { conditions: { needs: { targets: ["first.relation"] } } };
  assert.deepEqual(relationTargets(entry, "needs", RELATION_KEYS), ["first.relation"]);
  assert.deepEqual(relationTargets(entry, "invented", RELATION_KEYS), []);
});
