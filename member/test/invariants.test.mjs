// Calibration invariants: public mechanical calibration, not an AI bench.
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "../src/index.js"), "utf8");
const toml = readFileSync(join(here, "../wrangler.toml"), "utf8");
const tomlLive = toml.replace(/#.*$/gm, "");
const srcLive = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

let n = 0;
const t = (name, fn) => { fn(); n++; console.log("  ✓", name); };

t("no canon storage or worker bindings", () => {
  assert.ok(!/d1_databases|ATLAS_DB|kv_namespaces|\[\[workflows\]\]/.test(tomlLive + srcLive));
});

t("no scheduled or autonomous runtime", () => {
  assert.ok(!/crons\s*=|scheduled\s*\(/.test(tomlLive + srcLive));
});

t("no AI dependency", () => {
  assert.ok(!/OPENAI|api\.openai|responses\.create|chat\/completions|MODEL|member_passphrase_required|MEMBER_PASSPHRASE/.test(srcLive + tomlLive));
});

t("no Atlas or Garden network dependency in Calibration runtime", () => {
  assert.ok(!/mcp\.realitymechanics\.nz|\/api\/chat|write_proposal|list_garden_proposals|GARDEN_SECRET/.test(srcLive + tomlLive));
});

t("no participant text input required", () => {
  assert.ok(!/<textarea/.test(src), "no textarea elements");
  assert.ok(!/<form/.test(src), "no form requiring submission");
  assert.ok(!/addEventListener\("submit"/.test(src), "no submit handler");
});

t("public page presents Calibration as mechanical, not a worksheet", () => {
  assert.ok(/Reasoning has mechanics/.test(src));
  assert.ok(/It does not answer for you/.test(src));
  assert.ok(/does not need your input/.test(src));
});

t("mechanism grammar is visible", () => {
  for (const label of ["Open Strain", "Pulses", "Threshold", "Approximation", "Local average", "Carried Strain"]) {
    assert.ok(src.includes(label), label);
  }
});

t("the carry is surfaced, not just computed", () => {
  assert.ok(src.includes('id="carriedValue"'), "readout element exists");
  assert.ok(src.includes('id="carryLabel"'), "panel label exists");
  assert.ok(/els\.carriedValue\.textContent = newStrain/.test(src), "carried value is set from the actual post-correction residual, not a placeholder");
});

t("strain never settles to zero by construction", () => {
  assert.ok(src.includes("Open Strain never reaches zero"));
  assert.ok(src.includes("function driftTarget"));
  assert.ok(src.includes("function firePulse"));
});

t("mechanism runs on discrete pulses, not continuous free-run", () => {
  assert.ok(src.includes("THRESHOLD"));
  assert.ok(src.includes("if (strain >= THRESHOLD) firePulse(strain)"));
});

t("start/pause/reset controls exist, no other input", () => {
  assert.ok(src.includes('id="toggle"'));
  assert.ok(src.includes('id="reset"'));
});

t("health reports mechanical runtime", () => {
  assert.ok(src.includes('runtime: "mechanical"'));
  assert.ok(src.includes("ai: false"));
});

t("structural term-test mode exists and stays mechanical", () => {
  assert.ok(src.includes("Structural Calibration"), "structural section present");
  assert.ok(src.includes('id="termSelect"'), "term selector present");
  assert.ok(src.includes('id="ttRun"'), "run control present");
  assert.ok(src.includes("var TERMS = {"), "bounded dataset embedded");
  assert.ok(/"Relation":\s*{\s*needs:\s*\[\]/.test(src), "Relation carried as the primitive with no needs");
  // No new input surfaces beyond a preset selector and buttons.
  assert.ok(!/<textarea/.test(src) && !/<form/.test(src), "no free-text input added");
});

t("structural test separates observation, evidence, recommendation", () => {
  for (const block of ["Observation", "Evidence", "Recommendation"]) {
    assert.ok(src.includes(">" + block + "<"), block + " block present");
  }
  assert.ok(/id="ttObs"/.test(src) && /id="ttEv"/.test(src) && /id="ttRec"/.test(src));
});

t("structural test characterises load-bearing / weak / unresolved", () => {
  for (const v of ["load-bearing", "weak", "unresolved"]) {
    assert.ok(src.includes(v), v + " characterisation present");
  }
  assert.ok(src.includes("calibration, not proof"), "framed as calibration, not proof");
});

t("navigation reaches Field and Submission 001", () => {
  assert.ok(src.includes('href="https://realitymechanics.nz/field"'));
  assert.ok(src.includes('href="https://realitymechanics.nz/submission"'));
});

console.log(`\ncalibration invariants: all ${n} assertions passed.`);
