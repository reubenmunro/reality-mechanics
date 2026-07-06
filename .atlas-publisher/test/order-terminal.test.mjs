import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ORDER_TERMINAL_REGISTRY,
  parseOrderTerminalBlock,
  buildOrderTerminalAnnotation,
  orderTerminalForEntryId,
  orderTerminalAnnotationForEntryId,
} from "../order-terminal.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("ORDER_TERMINAL_REGISTRY covers Atlas order-terminal instances", () => {
  assert.ok(ORDER_TERMINAL_REGISTRY["first.resolution"]);
  assert.ok(ORDER_TERMINAL_REGISTRY["third.nesting"]);
  assert.ok(ORDER_TERMINAL_REGISTRY["higher.recursion"]);
});

test("parseOrderTerminalBlock reads Resolution.md frontmatter", async () => {
  const raw = await readFile(join(repoRoot, "Reality_Mechanics/1_First/Resolution.md"), "utf8");
  const frontmatter = raw.startsWith("---\n") ? raw.slice(4, raw.indexOf("\n---", 4)) : "";
  const parsed = parseOrderTerminalBlock(frontmatter);
  assert.equal(parsed.is_terminal, true);
  assert.equal(parsed.terminal_of, "first_order");
  assert.equal(parsed.terminal_mode, "resolves_current_asymmetry");
});

test("buildOrderTerminalAnnotation states frame transition without structure mutation", () => {
  const annotation = buildOrderTerminalAnnotation(ORDER_TERMINAL_REGISTRY["first.resolution"]);
  assert.equal(annotation.terminalOfLabel, "First Order");
  assert.match(annotation.passageRule, /cannot continue as the same passage/i);
  assert.match(annotation.continuationRule, /re-entry, restart, or order lift/i);
  assert.match(annotation.structureInvariant, /remains invariant/i);
  assert.match(annotation.frameTransition, /reference-frame transition/i);
  assert.match(annotation.frameTransition, /not a material morph/i);
});

test("orderTerminalForEntryId returns null for non-terminal terms", () => {
  assert.equal(orderTerminalForEntryId("first.carry"), null);
});

test("orderTerminalAnnotationForEntryId builds annotation for first.resolution", () => {
  const annotation = orderTerminalAnnotationForEntryId("first.resolution");
  assert.equal(annotation.terminalOf, "first_order");
  assert.equal(annotation.isTerminal, true);
});
