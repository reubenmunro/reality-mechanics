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

t("public page presents Pulse as mechanical, not a worksheet", () => {
  assert.ok(/Behaviour through time/.test(src));
  assert.ok(/does not need your input/.test(src));
});

t("mechanism grammar is visible", () => {
  for (const label of ["Open Strain", "Pulses", "Threshold", "Local average", "Carried Strain"]) {
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

t("D-021.5 forest demo and calibration engine removed from public Pulse", () => {
  assert.doesNotMatch(src, /Walk the forest/);
  assert.doesNotMatch(src, /Calibration Engine v1/);
  assert.doesNotMatch(src, /id="ceWalk"/);
  assert.doesNotMatch(src, /forest-path/);
  assert.doesNotMatch(src, /\/api\/calibration\/engine/);
  assert.doesNotMatch(src, /import \{ runCalibration/);
});

t("Pulse presents Calibration as the first instrument only", () => {
  assert.ok(src.includes('class="brand">Pulse</'));
  assert.ok(src.includes("Behaviour through time."));
  assert.ok(src.includes("<h2>Calibration</h2>"));
  assert.ok(src.includes("Open Strain"));
});

t("D-026 Pulse visual refinement removes card chrome", () => {
  assert.ok(!src.includes("border:1px solid var(--line)"));
  assert.ok(!src.includes('class="eyebrow"'));
  assert.ok(src.includes("Iowan Old Style"));
});

t("navigation reaches Observatory, Theory, and Proof", () => {
  assert.ok(src.includes('href="https://realitymechanics.nz/field">Observatory'));
  assert.ok(src.includes('href="https://realitymechanics.nz/submission">Proof'));
  assert.ok(src.includes('href="https://calibration.realitymechanics.nz/" aria-current="page">Pulse'));
  assert.ok(src.includes('href="https://realitymechanics.nz/theory">Theory'));
  assert.ok(!/🔭|❤️|📖|✓/.test(src));
});

console.log(`\ncalibration invariants: all ${n} assertions passed.`);
