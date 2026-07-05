import assert from "node:assert/strict";
import {
  runCalibration,
  canRetraceToRelation,
  buildAncestry,
  DEFAULT_TERM,
  DEFAULT_PERTURB,
  ENGINE_TERMS,
} from "../src/calibration-engine.mjs";

const mc = ENGINE_TERMS["Maintained Coupling"];
assert.deepEqual(mc.needs, ["Coupling", "Bearing", "Recurrence", "Compatibility"]);
assert.ok(mc.holds.includes("Compatibility"));
assert.ok(mc.traces.includes("Compatibility"));

const run = runCalibration(DEFAULT_TERM, DEFAULT_PERTURB);
assert.equal(run.term, "Maintained Coupling");
assert.equal(run.perturbNeed, "Compatibility");
assert.ok(run.observation.includes("Compatibility"));
assert.ok(run.evidence.includes("D-004") || run.evidence.includes("Compatibility"));
assert.ok(run.recommendation.includes("Calibration, not proof"));
assert.ok(run.stewardNote.includes("steward decides"));
assert.equal(run.steps.length, 8);
assert.ok(run.steps.some((s) => s.label === "Steward"));

for (const block of ["observation", "evidence", "recommendation"]) {
  assert.ok(typeof run[block] === "string" && run[block].length > 20, block);
}

assert.ok(canRetraceToRelation("Maintained Coupling"));
const ancestry = buildAncestry("Maintained Coupling");
assert.ok(ancestry.length > 0);

console.log("calibration-engine: all assertions passed.");
