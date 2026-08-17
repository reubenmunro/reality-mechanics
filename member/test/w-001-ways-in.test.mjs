// W-001: Pulse remains one bounded primary surface without predeclaring the
// nested Theory, Proof, and Calculus inquiry.
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "../src/index.js"), "utf8");

let n = 0;
const t = (name, fn) => { fn(); n++; console.log("  ✓", name); };

t("Pulse stays within the primary navigation", () => {
  assert.ok(src.includes("realitymechanics.nz/atlas"));
  assert.ok(src.includes("realitymechanics.nz/field"));
  assert.ok(!src.includes('class="ways-in"'));
  assert.ok(!src.includes("proof#ways-in"));
  assert.doesNotMatch(src, /realitymechanics\.nz\/(?:theory|proof|calculus)/);
});

t("Pulse keeps calm keyboard focus", () => {
  assert.ok(src.includes(":focus-visible"));
});

console.log(`w-001 pulse orientation: all ${n} assertions passed.`);
