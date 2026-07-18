import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker, { deriveFieldStatesPayload, fieldPage, submissionPage, theoryPage, calculusPage } from "../main-website-worker.js";

const entries = [
  {
    id: "first.carry",
    title: "Carry",
    entry_order: "first",
    content: "# Carry\n\nDirectional availability within one relation.\n\nCarry is held by [[Connection]].\n\n## Places",
    source_path: "Reality_Mechanics/1_First/Carry.md",
    structure: JSON.stringify({ holds: [], traces: [], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "second.held",
    title: "Held",
    entry_order: "second",
    content: "# Held\n\nHeld prose.",
    source_path: "Reality_Mechanics/Second/Held.md",
    structure: JSON.stringify({ holds: ["first.carry"], traces: [], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "second.traced",
    title: "Traced",
    entry_order: "second",
    content: "# Traced\n\nTraced prose.",
    source_path: "Reality_Mechanics/Second/Traced.md",
    structure: JSON.stringify({ holds: [], traces: ["first.carry"], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "third.not-carrier",
    title: "Not Carrier",
    entry_order: "third",
    content: "# Not Carrier\n\nNot Carrier prose.",
    source_path: "Reality_Mechanics/Third/Not Carrier.md",
    structure: JSON.stringify({ holds: [], traces: [], carries: ["first.carry"], pairs: ["first.carry"], nests: ["first.carry"] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ground.invariant",
    title: "Invariant",
    entry_order: "ground",
    content: "# Invariant\n\nWhat remains stable across traversal, revision, application, or scale — preserved structure, not permanent immobility.\n\nInvariant is held by [[Root Order]].\n\n## Places",
    source_path: "Reality_Mechanics/0_Ground/Invariant.md",
    structure: JSON.stringify({ holds: ["second.held"], traces: [], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "first.connection",
    title: "Connection",
    entry_order: "first",
    content: "# Connection\n\nRelation holding between distinguishable conditions so that passage is available in more than one direction.\n\nConnection is held by [[Relation]].\n\n## Places",
    source_path: "Reality_Mechanics/1_First/Connection.md",
    structure: JSON.stringify({ holds: [], traces: [], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "first.resolution",
    title: "Resolution",
    entry_order: "first",
    content: "# Resolution\n\nBearing determined at the current scope of evaluation.\n\nResolution is held by [[Bearing]].\n\n## Places",
    source_path: "Reality_Mechanics/1_First/Resolution.md",
    structure: JSON.stringify({ holds: [], traces: [], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "third.field-relationships",
    title: "Field Relationships",
    entry_order: "third",
    content: "# Field Relationships\n\nField Relationships A working grouping of third-order fields by recurring participation emphasis.\n\nField Relationships is held by [[Third Order]].\n\n## Places",
    source_path: "Reality_Mechanics/3_Third/Field Relationships.md",
    structure: JSON.stringify({ holds: ["second.held"], traces: [], carries: [], pairs: [], nests: [] }),
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
  },
];

const revisions = [
  { entry_id: "first.carry", edit_class: "structural", actor: "apply", at: "2026-04-01T00:00:00.000Z" },
  { entry_id: "first.carry", edit_class: "prose", actor: "apply", at: "2026-06-20T00:00:00.000Z" },
];

const proposals = [
  {
    entry_id: "first.carry",
    status: "affirmed",
    light_count: 1,
    shade_count: 0,
    created_at: "2026-06-15T00:00:00.000Z",
    updated_at: "2026-06-15T00:00:00.000Z",
  },
];

function makeDb() {
  return {
    prepare(sql) {
      return {
        params: [],
        bind(...params) { this.params = params; return this; },
        async all() {
          if (/FROM atlas_metadata\b/.test(sql)) return { results: [
            { key: "source_hash", value: "sha256:cdb20a2e39aa5f1865a395749331fb9d541e549fa9d70e79f8d771233f849164" },
            { key: "entry_count", value: "493" },
          ] };
          if (/FROM entries\b/.test(sql)) return { results: entries };
          if (/FROM entry_revisions\b/.test(sql)) return { results: revisions };
          if (/FROM proposals\b/.test(sql)) return { results: proposals };
          return { results: [] };
        },
        async first() {
          if (/FROM garden_config\b/.test(sql)) {
            const key = this.params[0];
            if (key === "atlas_version") return { value: "test-atlas-version" };
            if (key === "field_ratio_mode_thresholds") {
              return { value: JSON.stringify({ transitional_min_mass: 1, continuous_min_mass: 2 }) };
            }
          }
          return null;
        },
      };
    },
  };
}

const CURRENT_ENV = { ATLAS_DB: makeDb() };

test("deriveFieldStatesPayload derives renderer states from D1 records only", async () => {
  const payload = await deriveFieldStatesPayload(
    { ATLAS_DB: makeDb() },
    new Date("2026-07-02T00:00:00.000Z"),
  );

  assert.equal(payload.contractVersion, 1);
  assert.equal(payload.source, "d1-derived");
  assert.equal(payload.sourceHash, "sha256:cdb20a2e39aa5f1865a395749331fb9d541e549fa9d70e79f8d771233f849164");
  assert.deepEqual(payload.excludes, ["weather", "clearance", "lightShadowPressure", "geodesicBending", "membraneEdge"]);

  const carry = payload.states.find((state) => state.id === "first.carry");
  assert.deepEqual(carry.relations, { needs: [], holds: [], pairs: [], traces: [], nests: [], reads: [], carries: [] });
  assert.equal(carry.place, "Directional availability within one relation.");
  assert.match(carry.atlasUrl, /github\.com\/reubenmunro\/reality-mechanics\/blob\/main\//);
  assert.equal("excerpt" in carry, false);
  assert.equal(carry.mass.carriers, 2, "mass counts holds/traces in-degree only");
  assert.equal(carry.ratioMode.mode, "continuous");
  assert.equal(carry.ratioMode.x, 2);
  assert.equal(carry.maturityBand, "established");
  assert.equal(carry.agitation.revisions30d, 1);
  assert.equal(carry.settledness.affirmedPasses, 1);
  assert.equal(carry.settledness.appliedProseTendings, 1);

  const notCarrier = payload.states.find((state) => state.id === "third.not-carrier");
  assert.deepEqual(notCarrier.relations.carries, ["first.carry"]);
  assert.deepEqual(notCarrier.relations.pairs, ["first.carry"]);
  assert.deepEqual(notCarrier.relations.nests, ["first.carry"]);
  assert.equal(notCarrier.mass.carriers, 0);

  const fieldRelationships = payload.states.find((state) => state.id === "third.field-relationships");
  assert.equal(
    fieldRelationships.place,
    "A working grouping of third-order fields by recurring participation emphasis.",
  );

  const invariant = payload.states.find((state) => state.id === "ground.invariant");
  assert.equal(
    invariant.place,
    "What remains stable across traversal, revision, application, or scale — preserved structure, not permanent immobility.",
  );

  const connection = payload.states.find((state) => state.id === "first.connection");
  assert.equal(
    connection.place,
    "Relation holding between distinguishable conditions so that passage is available in more than one direction.",
  );

  const resolution = payload.states.find((state) => state.id === "first.resolution");
  assert.equal(resolution.orderTerminal.terminal_of, "first_order");
  assert.equal(resolution.orderTerminalAnnotation.terminalOfLabel, "First Order");
  assert.match(resolution.orderTerminalAnnotation.frameTransition, /reference-frame transition/i);

  const carryNoTerminal = payload.states.find((state) => state.id === "first.carry");
  assert.equal(carryNoTerminal.orderTerminal, null);
  assert.equal(carryNoTerminal.orderTerminalAnnotation, null);
});

test("fieldPage consumes only the derived states endpoint", () => {
  const html = fieldPage();
  assert.match(html, /fetch\('\/api\/field\/states'\)/);
  assert.doesNotMatch(html, /fetch\('\/api\/field\/entries'\)/);
  assert.doesNotMatch(html, /fetch\('\/api\/garden\/proposals'\)/);
  assert.doesNotMatch(html, /gardenMemory|liveProposals|relationRatioMode|hasWord/);
  assert.doesNotMatch(html, /drawOrderSpine|drawOrderScaleView|spineActive|spineCoasting|scaleMode|isNearSpine/);
  assert.doesNotMatch(html, /id="panel"|read-chip|renderPanel|closePanel|read-data/);
  assert.doesNotMatch(html, /field-read|renderFieldRead|fr-title|fr-order|fr-composition|fr-enabled|fr-care/);
  assert.doesNotMatch(html, /fieldParticles|stepFieldParticles|initFieldParticles|ambientWrinkles|orbitSignature|orbitPhase/);
  assert.match(html, /Static home field/);
  assert.match(html, /Movement belongs to the reference and relation events/);
  assert.match(html, /id="enter-form"/);
  assert.match(html, /id="term-sheet"/);
  assert.match(html, /id="access-row"/);
  assert.match(html, /href="\/field"[^>]*>Observatory/);
  assert.match(html, /href="https:\/\/calibration\.realitymechanics\.nz\/">Pulse/);
  assert.match(html, /href="\/theory">Theory/);
  assert.doesNotMatch(html, /Theory\.md">📖 Theory/);
  assert.match(html, /href="\/proof">Proof/);
  assert.match(html, /href="\/calculus">Calculus/);
  assert.doesNotMatch(html, /href="\/atlas"/);
  assert.doesNotMatch(html, /href="\/garden"/);
  assert.doesNotMatch(html, /href="https:\/\/theory\.realitymechanics\.nz\/#theory-descent"/);
  assert.match(html, /id="sheet-place"/);
  assert.match(html, /id="sheet-atlas-link"/);
  assert.match(html, /View Atlas Entry/);
  assert.match(html, /place: state\.place/);
  assert.match(html, /atlasUrl: state\.atlasUrl/);
  assert.doesNotMatch(html, /id="sheet-excerpt"/);
  assert.doesNotMatch(html, /excerpt: state\.excerpt/);
  assert.match(html, /function openTermSheet/);
  assert.doesNotMatch(html, /THREE\\.|three\\.min\\.js|fetch\\('\/api\/enter'\\)/);
  assert.doesNotMatch(html, /fetch\('\/api\/ark/);
});

test("drawCurrent applies shared term ratio mode to all relation types", () => {
  const html = fieldPage();
  assert.match(html, /const ratioMode = termRatioMode\(a\)/);
  assert.doesNotMatch(html, /discreteRatioMode/);
  assert.doesNotMatch(html, /isCarry \? termRatioMode\(a\)/);
});

test("Field links to Proof alongside Pulse", () => {
  const html = fieldPage();
  assert.match(html, /href="\/proof">Proof/);
  assert.match(html, /href="https:\/\/calibration\.realitymechanics\.nz\/">Pulse/);
  assert.match(html, /href="\/field"[^>]*>Observatory/);
  assert.match(html, /href="\/theory">Theory/);
  assert.match(html, /href="\/calculus">Calculus/);
  assert.doesNotMatch(html, /Theory\.md">📖 Theory/);
});

test("D-021.2 observatory landing orients before observation", () => {
  const html = fieldPage();
  assert.match(html, /id="observatory-landing"/);
  assert.match(html, /Reality Mechanics Observatory/);
  assert.match(html, /Observe how declared carrying and tracing weave into thread, fabric, and web\./);
  assert.match(html, /id="landing-observe">Observe the Field/);
  assert.match(html, /id="landing-continue" hidden>Continue where I left off/);
  assert.match(html, /id="landing-atlas" href="https:\/\/github\.com\/reubenmunro\/reality-mechanics\/tree\/main\/Reality_Mechanics"/);
  assert.match(html, /Browse the Atlas/);
  assert.match(html, /id="sheet-neutral"/);
  assert.match(html, /id="sheet-neutral-title">Observatory/);
  assert.match(html, /Select a place in the field to observe its structure\./);
  assert.match(html, /id="sheet-term" hidden/);
  assert.match(html, /observatory\.lastFocusId/);
  assert.match(html, /function renderNeutralSheet/);
  assert.match(html, /function observeTerm/);
  assert.match(html, /function dismissObservatoryLanding/);
  assert.match(html, /body\.landing-dismissed #observatory-landing/);
  assert.match(html, /<title>Observatory · Reality Mechanics<\/title>/);
});

test("D-021.4 neutral initial load renders whole field without Relation default", () => {
  const html = fieldPage();
  assert.match(html, /D-020D \/ D-021\.4: neutral whole-field opening/);
  assert.match(html, /const explicitTermId = \(hash && allOps\[hash\]\) \? hash : null/);
  assert.match(html, /if \(!explicitTermId\) \{/);
  assert.match(html, /homeMode = true/);
  assert.match(html, /focusId = null/);
  assert.match(html, /function neutralWholeFieldOpen/);
  assert.match(html, /function drawHomeCondensation/);
  assert.match(html, /function drawHomeFabricFace/);
  assert.match(html, /function buildHomePressureField/);
  assert.match(html, /function nearestHomeOperation/);
  assert.match(html, /if \(homeMode\) return nearestHomeOperation/);
  assert.match(html, /if \(!homeMode\) \{/);
  assert.doesNotMatch(html, /op\.title === 'Relation'/);
  assert.doesNotMatch(html, /op\.title === 'Reality Mechanics'/);
});

test("D-021.4 hash deep-link still enters focused observation", () => {
  const html = fieldPage();
  assert.match(html, /homeMode = false/);
  assert.match(html, /observeTerm\(explicitTermId,/);
  assert.match(html, /revealTermSheetForSelection\(explicitTermId\)/);
  assert.match(html, /replaceFieldLocation\(explicitTermId\)/);
});

test("D-021.4 endpointOnly path is confined to focused condensation draw", () => {
  const html = fieldPage();
  assert.match(html, /if \(ambientBudget\.endpointOnly\)/);
  assert.match(html, /neutralWholeFieldOpen\(\)/);
  assert.match(html, /wholeField = neutralWholeFieldOpen\(\)/);
});

test("/theory serves the complete generated canonical Theory entry", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/theory"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /<h1>The Working Postulate<\/h1>/);
  assert.match(html, /Theory\.md/);
  assert.match(html, /Failure Tests/);
  assert.match(html, /Determination:/);
  assert.match(html, /sha256:cdb20a2e39aa5f1865a395749331fb9d541e549fa9d70e79f8d771233f849164/);
  assert.doesNotMatch(html, /^# Invariant/m);
  assert.doesNotMatch(html, /border-bottom:1px solid var\(--line\)/);
});

test("D-026 visual refinement removes nav icons and card chrome", () => {
  const fieldHtml = fieldPage();
  const proofHtml = submissionPage();
  const theoryHtml = theoryPage();
  const calculusHtml = calculusPage();

  for (const html of [fieldHtml, proofHtml, theoryHtml, calculusHtml]) {
    assert.doesNotMatch(html, /🔭|❤️|📖|✓|∴/);
  }
  assert.doesNotMatch(proofHtml, /class="card/);
  assert.match(proofHtml, /record-section atlas-record/);
  assert.match(theoryHtml, /canonical-identity/);
  assert.match(calculusHtml, /chain-step/);
  assert.match(fieldHtml, /homeMode && !focusId/);
});

test("/proof serves the retrace pathway page", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/proof"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /Retrace pathway/);
  assert.match(html, /Observatory/);
  assert.match(html, /Pulse/);
});

test("/submission serves the public Submission 001 page", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/submission"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /Retrace pathway/);
  assert.match(html, /Submission 001/);
  assert.match(html, /Recorded in Atlas/);
  assert.match(html, /Candidate/);
  assert.match(html, /Unresolved/);
  assert.match(html, /href="\/field"/);
  assert.match(html, /href="https:\/\/calibration\.realitymechanics\.nz\//);
  assert.match(html, /operator is not accepted/);
  assert.doesNotMatch(html, /Walk the forest/);
  assert.doesNotMatch(html, /structural term test/i);
});

test("D-021.5 public structure is Observatory Pulse Theory Proof Calculus", () => {
  const fieldHtml = fieldPage();
  const proofHtml = submissionPage();
  const theoryHtml = theoryPage();
  const calculusHtml = calculusPage();

  for (const html of [fieldHtml, proofHtml, theoryHtml, calculusHtml]) {
    assert.match(html, />Observatory</);
    assert.match(html, />Pulse</);
    assert.match(html, />Theory</);
    assert.match(html, />Proof</);
    assert.match(html, />Calculus</);
    assert.doesNotMatch(html, /🔭|❤️|📖|✓|∴/);
  }
  assert.doesNotMatch(fieldHtml, /href="\/atlas"/);
  assert.doesNotMatch(fieldHtml, /href="\/garden"/);
});

test("submissionPage separates generated Atlas records from candidate and unresolved evidence", () => {
  const html = submissionPage();
  assert.match(html, /first\.relation/);
  assert.match(html, /practice\.atlas/);
  assert.match(html, /Determination:/);
  assert.match(html, /not minimal/);
  assert.match(html, /does not determine Atlas structure/);
});

test("/atlas redirects to the canonical GitHub Atlas", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/atlas"), {});
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("location"), "https://github.com/reubenmunro/reality-mechanics/tree/main/Reality_Mechanics");
});

test("/member is a compatibility doorway to Calibration", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/member"), {});

  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), "https://calibration.realitymechanics.nz/");
});

test("/api/enter is retired as a renderer placement mechanism", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/api/enter", { method: "POST" }), {});
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Observatory, Pulse, Theory, Proof, and Calculus only/);
});

test("Ark movement API is retired as a second renderer state path", async () => {
  for (const path of ["/api/ark/enter", "/api/ark/move"]) {
    const res = await worker.fetch(new Request(`https://realitymechanics.nz${path}`, { method: "POST" }), {});
    const body = await res.text();

    assert.equal(res.status, 410, path);
    assert.match(body, /Observatory, Pulse, Theory, Proof, and Calculus only/, path);
  }
});

test("/ark is retired as a standalone doorway", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/ark"), {});
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Observatory, Pulse, Theory, Proof, and Calculus only/);
});

test("/api/field/entries is retired in favour of derived field states", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/api/field/entries"), CURRENT_ENV);
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Observatory, Pulse, Theory, Proof, and Calculus only/);
});

test("Garden routes are no longer public surfaces", async () => {
  const routes = [
    ["https://realitymechanics.nz/api/garden/log", { method: "POST" }],
    ["https://realitymechanics.nz/api/garden/stats"],
    ["https://realitymechanics.nz/api/garden/needs-preparation/test-id", { method: "POST" }],
    ["https://realitymechanics.nz/api/garden/steward-note/test-id", { method: "POST" }],
    ["https://realitymechanics.nz/api/garden/complete/test-id", { method: "POST" }],
    ["https://realitymechanics.nz/api/garden/bulk-discard-prep-kv-legacy", { method: "POST" }],
  ];

  for (const [url, init] of routes) {
    const res = await worker.fetch(new Request(url, init), {});
    const body = await res.text();
    assert.equal(res.status, 410, url);
    assert.match(body, /Observatory, Pulse, Theory, Proof, and Calculus only/, url);
  }
});

test("/garden is no longer a public surface", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/garden"), {});
  const html = await res.text();

  assert.equal(res.status, 410);
  assert.match(html, /Observatory, Pulse, Theory, Proof, and Calculus only/);
});

test("Theory shortcuts are no longer public surfaces", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/coupled-read"), {});
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Observatory, Pulse, Theory, Proof, and Calculus only/);
});

test("D-022 language enters the field: canvas term labels", () => {
  const html = fieldPage();
  assert.match(html, /function drawTermLabel/);
  assert.match(html, /ctx\.fillText\(text, x, y\)/);
  assert.match(html, /HOME_LABELS_PER_ORDER/);
  assert.match(html, /LOCAL_LABEL_BUDGET/);
  assert.match(html, /homeLabelIds/);
  assert.match(html, /drawTermLabel\(focus, pf\.x, pf\.y \+ 30, 0\.92, 14, true\)/);
});

test("D-022 term entry offers the Atlas index", () => {
  const html = fieldPage();
  assert.match(html, /<datalist id="term-suggestions">/);
  assert.match(html, /list="term-suggestions"/);
  assert.match(html, /function populateTermSuggestions/);
});

test("D-022 dependency order is named in the field palette", () => {
  const html = fieldPage();
  assert.match(html, /id="order-legend"/);
  assert.match(html, /function buildOrderLegend/);
});

test("D-022 decorative machinery removed from Observatory draw", () => {
  const html = fieldPage();
  assert.doesNotMatch(html, /smokePuffs \* adaptiveAmbientScale/);
  assert.doesNotMatch(html, /wrinkleCount/);
});

test("D-022 Theory states the working postulate without inventing theory", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/theory"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /Relation holds\./);
  assert.match(html, /Order carries\./);
  assert.match(html, /Trace places\./);
  assert.match(html, /Rooted working postulate, version 0\.6/);
  assert.match(html, /Structural Care/);
});

test("D-023 placement derives from declared structure only", () => {
  const html = fieldPage();
  assert.match(html, /function buildHomeAngles/);
  assert.match(html, /circular mean of the bearings/);
  assert.match(html, /declaredRelationIds/);
  assert.match(html, /homeAngles\.get\(op\.id\)/);
});

test("D-023 the cursor is a probe and the instrument declares its reading", () => {
  const html = fieldPage();
  assert.match(html, /canvas\.style\.cursor = hoverId \? 'pointer' : ''/);
  assert.match(html, /id="field-status"/);
  assert.match(html, /generated read-model/);
  assert.match(html, /terms · /);
});

test("D-023 the strands are named in renderer colours", () => {
  const html = fieldPage();
  assert.match(html, /legend-stroke/);
  assert.match(html, /relationColor\(type, 0\.9\)/);
});

test("D-023 landing opens with the working postulate", () => {
  const html = fieldPage();
  assert.match(html, /landing-postulate">Relation holds\. Order carries\. Trace places\./);
  assert.match(html, /Continuation and recoverability read before any term is chosen/);
});

test("D-023 Theory leads with the claim and cites sparingly", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/theory"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /<h1>The Working Postulate<\/h1>/);
  assert.match(html, /current participant-determined postulate/);
  assert.match(html, /version 0\.6/);
  assert.match(html, /Failure Tests/);
  assert.match(html, /practice\.reality-mechanics-theory|Theory\.md/);
});

test("D-023 Proof shows the retrace pathway and visible humility", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/proof"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /The retrace pathway/);
  assert.match(html, /<b>Claim<\/b>/);
  assert.match(html, /<b>Source<\/b>/);
  assert.match(html, /<b>Method<\/b>/);
  assert.match(html, /<b>Record<\/b>/);
  assert.match(html, /What this does not claim/);
  assert.match(html, /commission C005, open/);
  assert.doesNotMatch(html, /Production deployment \/ D1-sync not yet file-verified/);
  assert.match(html, /REPOSITORY_VERIFICATION\.md/);
});

test("D-024 /calculus serves the derivation surface", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/calculus"), CURRENT_ENV);
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /<title>Calculus · Reality Mechanics<\/title>/);
  assert.match(html, /Derive the structure\./);
  assert.match(html, /Nothing on this page is promoted/);
  assert.match(html, /operator is not accepted/);
});

test("D-024 Calculus distinguishes derived, calibrated, heuristic, unresolved", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/calculus"), CURRENT_ENV);
  const html = await res.text();

  for (const status of ["derived", "calibrated", "heuristic", "unresolved"]) {
    assert.match(html, new RegExp('class="inv ' + status + '"'));
    assert.match(html, new RegExp('<b>' + status + '</b>'));
  }
  assert.match(html, /gap is preserved deliberately/);
});

test("D-024 implied mathematics is explicit and honest", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/calculus"), CURRENT_ENV);
  const html = await res.text();

  assert.match(html, /mass\(t\) = \|\{ s ≠ t : t ∈ holds\(s\) ∪ traces\(s\) \}\|/);
  assert.match(html, /continuous if x ≥ 8 · transitional if x ≥ 3 · else discrete/);
  assert.match(html, /not<\/b> Atlas Ratio/);
  assert.match(html, /rendering only, no new mechanics|Rendering only — no new mechanics/i);
});

test("D-024 candidate calculus presented without promotion", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/calculus"), CURRENT_ENV);
  const html = await res.text();

  assert.match(html, /Order : Structure : Read/);
  assert.match(html, /Pressure → Trace → Check → Determine → Step/);
  assert.match(html, /not minimal/);
  assert.match(html, /Relation → Connection/);
  assert.match(html, /promotes nothing/);
});

test("D-024 five public surfaces reachable from every page", () => {
  const pages = [fieldPage(), theoryPage(), submissionPage(), calculusPage()];
  for (const html of pages) {
    assert.match(html, /href="\/calculus"[^>]*>Calculus/);
    assert.match(html, /href="\/proof"[^>]*>Proof/);
    assert.match(html, /href="\/field"[^>]*>Observatory/);
    assert.doesNotMatch(html, /🔭|❤️|📖|✓|∴/);
  }
});

test("D-024 Atlas route carries canonical source redirect", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/atlas"), {});
  assert.equal(res.status, 308);
  assert.match(res.headers.get("location"), /github\.com\/reubenmunro\/reality-mechanics\/tree\/main\/Reality_Mechanics/);
});

test("Stage 2 separates generated structure from maintained Calculus evidence", () => {
  const theory = theoryPage();
  const calculus = calculusPage();
  const mcpSource = readFileSync(new URL("../../reality-mechanics-mcp/src/index.js", import.meta.url), "utf8");

  assert.match(theory, /sha256:cdb20a2e39aa5f1865a395749331fb9d541e549fa9d70e79f8d771233f849164/);
  assert.match(theory, /Failure Tests/);
  assert.match(calculus, /Canonical comparison baseline/);
  assert.match(calculus, /needs · holds · pairs · traces · nests · reads · carries/);
  assert.doesNotMatch(mcpSource, /calculus-evidence|public-surface-manifest/);
});

test("R-004 Observatory first impression: readiness before API and sheet closed on neutral open", () => {
  const html = fieldPage();
  assert.match(html, /Reading field…/);
  assert.match(html, /requestAnimationFrame\(loop\);\s*bootstrap\(\)/);
  assert.match(html, /classList\.remove\('sheet-open'\)/);
  assert.doesNotMatch(html, /renderNeutralSheet\(\);\s*openTermSheet\(\);\s*if \(mechanicsEnabled\)/);
  assert.match(html, /Field unavailable/);
});

test("R-004 landing observe dismisses without opening term sheet", () => {
  const html = fieldPage();
  assert.match(html, /landingObserveEl\.addEventListener\('click'/);
  assert.match(html, /dismissObservatoryLanding\(\);\s*closeTermSheet\(\)/);
});

test("O-001 field-first home renderer: woven structure before condensation, structural labels earned", () => {
  const html = fieldPage();
  assert.match(html, /O-008: woven-field renderer/);
  assert.match(html, /function drawHomeRelationCurrent/);
  assert.match(html, /function homePressureGradientAt/);
  assert.match(html, /HOME_PRESSURE_GRID/);
  assert.match(html, /buildHomePressureField\(\)/);
  assert.match(html, /drawHomeFabricFace\(alpha\)/);
  assert.doesNotMatch(html, /function drawHomeNode/);
  assert.match(html, /function drawHomeStructuralLabels/);
  assert.match(html, /homeLabelIds\.forEach/);
  assert.match(html, /Continuation and recoverability read before any term is chosen/);
});

test("O-002 fabric renderer: carry+trace weave rules and drift/archive modes", () => {
  const html = fieldPage();
  assert.match(html, /function buildHomeWeaveState/);
  assert.match(html, /function resolveHomeLeg/);
  assert.match(html, /function opInThreadNetwork/);
  assert.match(html, /function fabricEligibleConnection/);
  assert.match(html, /function drawHomeFabricFace/);
  assert.match(html, /function drawHomeFabricWeaveCurrents/);
  assert.doesNotMatch(html, /function drawHomeMembrane/);
  assert.match(html, /'nests'/);
});

test("O-003 order-terminal annotation: term sheet and mechanics panel", () => {
  const html = fieldPage();
  assert.match(html, /id="sheet-order-terminal"/);
  assert.match(html, /id="mechanics-order-terminal"/);
  assert.match(html, /function orderTerminalAnnotationMarkup/);
  assert.match(html, /function renderOrderTerminalAnnotation/);
  assert.match(html, /Terminally resolves/);
  assert.match(html, /annotation\.frameTransition/);
  assert.match(html, /annotation\.continuationRule/);
  assert.match(html, /annotation\.structureInvariant/);
});

test("O-005 gathering read annotation: mechanics panel only", () => {
  const html = fieldPage();
  assert.match(html, /id="mechanics-gathering-read"/);
  assert.match(html, /function gatheringReadAnnotationMarkup/);
  assert.match(html, /function renderGatheringReadAnnotation/);
  assert.match(html, /Structural Gathering read/);
  assert.match(html, /trace\.gatheringReadAnnotation/);
  assert.doesNotMatch(html, /sheet-gathering-read/);
});

test("O-006 read engine: behaviour trace exposes readEngine bundle", async () => {
  const entries = [
    {
      id: "first.relation",
      title: "Relation",
      entry_order: "first",
      structure: JSON.stringify({ holds: [], traces: [], carries: ["first.carry"], pairs: [], nests: [] }),
      created: "2026-01-01T00:00:00.000Z",
      updated: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "first.carry",
      title: "Carry",
      entry_order: "first",
      structure: JSON.stringify({ holds: ["first.relation"], traces: [], carries: [], pairs: [], nests: [] }),
      created: "2026-01-01T00:00:00.000Z",
      updated: "2026-01-01T00:00:00.000Z",
    },
  ];
  const env = {
    ATLAS_DB: {
      prepare(sql) {
        return {
          params: [],
          bind(...params) { this.params = params; return this; },
          async all() {
            if (/FROM atlas_metadata\b/.test(sql)) return { results: [
              { key: "source_hash", value: "sha256:cdb20a2e39aa5f1865a395749331fb9d541e549fa9d70e79f8d771233f849164" },
              { key: "entry_count", value: "493" },
            ] };
            if (/FROM entries\b/.test(sql)) return { results: entries };
            return { results: [] };
          },
          async first() {
            if (/FROM garden_config\b/.test(sql)) {
              const key = this.params[0];
              if (key === "atlas_version") return { value: "test-atlas-version" };
              if (key === "field_ratio_mode_thresholds") {
                return { value: JSON.stringify({ transitional_min_mass: 3, continuous_min_mass: 8 }) };
              }
            }
            return null;
          },
        };
      },
    },
  };
  const res = await worker.fetch(
    new Request("https://realitymechanics.nz/api/field/behaviour-trace?id=first.relation"),
    env,
  );
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.readEngine.version, "read-engine.v1");
  assert.ok(body.readEngine.reads.maturity);
  assert.ok(body.readEngine.sourceOfTruthRules.length >= 6);
});

test("O-004 thread mechanics renderer: shared resolveLeg path activated in client", () => {
  const html = fieldPage();
  assert.match(html, /function resolveHomeLeg/);
  assert.match(html, /window\.RMMechanics/);
  assert.match(html, /var resolveLeg = RMMechanics\.resolveLeg/);
  assert.match(html, /var buildPairStateFromOps = RMMechanics\.buildPairStateFromOps/);
  assert.match(html, /legFocusedAppearance/);
  assert.match(html, /tmsLeg/);
  assert.match(html, /RMMechanics\.homeLegStrokeAppearance/);
});
