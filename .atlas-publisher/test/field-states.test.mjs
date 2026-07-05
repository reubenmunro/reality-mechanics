import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { deriveFieldStatesPayload, fieldPage, submissionPage } from "../main-website-worker.js";

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

test("deriveFieldStatesPayload derives renderer states from D1 records only", async () => {
  const payload = await deriveFieldStatesPayload(
    { ATLAS_DB: makeDb() },
    new Date("2026-07-02T00:00:00.000Z"),
  );

  assert.equal(payload.contractVersion, 1);
  assert.equal(payload.source, "d1-derived");
  assert.equal(payload.atlasVersion, "test-atlas-version");
  assert.deepEqual(payload.excludes, ["weather", "clearance", "lightShadowPressure", "geodesicBending", "membraneEdge"]);

  const carry = payload.states.find((state) => state.id === "first.carry");
  assert.deepEqual(carry.relations, { holds: [], traces: [], carries: [], pairs: [], nests: [] });
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
  assert.doesNotMatch(html, /href="\/field"/);
  assert.doesNotMatch(html, /href="\/atlas"/);
  assert.doesNotMatch(html, /href="\/garden"/);
  assert.doesNotMatch(html, /href="https:\/\/theory\.realitymechanics\.nz\/#theory-descent"/);
  assert.match(html, /href="https:\/\/calibration\.realitymechanics\.nz\/">Calibration/);
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

test("Field links to Submission 001 alongside Calibration", () => {
  const html = fieldPage();
  assert.match(html, /href="\/submission">Submission 001/);
  assert.match(html, /href="https:\/\/calibration\.realitymechanics\.nz\/">Calibration/);
});

test("/submission serves the public Submission 001 page", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/submission"), {});
  const html = await res.text();

  assert.equal(res.status, 200);
  assert.match(html, /Submission 001/);
  assert.match(html, /Accepted/);
  assert.match(html, /Candidate/);
  assert.match(html, /Unresolved/);
  // Reachable back to the other surfaces.
  assert.match(html, /href="\/field"/);
  assert.match(html, /href="https:\/\/calibration\.realitymechanics\.nz\//);
  // No unaccepted Calculus claim promoted: the ":" operator stays unaccepted.
  assert.match(html, /operator is not accepted/);
});

test("submissionPage renders accepted/candidate/unresolved without promoting the calculus", () => {
  const html = submissionPage();
  assert.match(html, /Relation<\/b> as the sole primitive|Relation<\/b> as the sole/);
  assert.match(html, /not minimal/);
  assert.match(html, /explicitly unpromoted/);
});

test("/atlas is no longer a public surface", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/atlas"), {});
  const html = await res.text();

  assert.equal(res.status, 410);
  assert.match(html, /Field and Calibration only/);
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
  assert.match(body, /Field and Calibration only/);
});

test("Ark movement API is retired as a second renderer state path", async () => {
  for (const path of ["/api/ark/enter", "/api/ark/move"]) {
    const res = await worker.fetch(new Request(`https://realitymechanics.nz${path}`, { method: "POST" }), {});
    const body = await res.text();

    assert.equal(res.status, 410, path);
    assert.match(body, /Field and Calibration only/, path);
  }
});

test("/ark is retired as a standalone doorway", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/ark"), {});
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Field and Calibration only/);
});

test("/api/field/entries is retired in favour of derived field states", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/api/field/entries"), {});
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Field and Calibration only/);
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
    assert.match(body, /Field and Calibration only/, url);
  }
});

test("/garden is no longer a public surface", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/garden"), {});
  const html = await res.text();

  assert.equal(res.status, 410);
  assert.match(html, /Field and Calibration only/);
});

test("Theory shortcuts are no longer public surfaces", async () => {
  const res = await worker.fetch(new Request("https://realitymechanics.nz/coupled-read"), {});
  const body = await res.text();

  assert.equal(res.status, 410);
  assert.match(body, /Field and Calibration only/);
});
