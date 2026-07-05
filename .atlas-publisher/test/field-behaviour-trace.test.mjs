import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildFieldBehaviourTrace,
  buildTraceIndex,
  relationCompressionLimit,
  structuralMassForState,
} from "../field-behaviour-trace.mjs";
import worker, { fieldPage } from "../main-website-worker.js";

const relationFocusState = {
  id: "first.relation",
  title: "Relation",
  order: "first",
  relations: {
    holds: [],
    traces: [],
    carries: ["first.carry", "first.hold", "first.trace", "first.pair", "first.nest"],
    pairs: ["first.carry", "first.hold"],
    nests: [],
  },
  ratioMode: { mode: "continuous", x: 23 },
  mass: { carriers: 23 },
  maturityBand: "established",
  settledness: { score: 0.06 },
};

const neighbourStates = [
  relationFocusState,
  {
    id: "first.carry",
    title: "Carry",
    order: "first",
    relations: { holds: ["first.relation"], traces: [], carries: [], pairs: [], nests: [] },
    ratioMode: { mode: "discrete", x: 2 },
    mass: { carriers: 2 },
  },
  {
    id: "second.held",
    title: "Held",
    order: "second",
    relations: { holds: ["first.relation"], traces: ["first.relation"], carries: [], pairs: [], nests: [] },
    ratioMode: { mode: "continuous", x: 2 },
    mass: { carriers: 2 },
  },
];

test("buildFieldBehaviourTrace exposes five D-011 behaviours with atlas source fields", () => {
  const statesById = buildTraceIndex(neighbourStates);
  const trace = buildFieldBehaviourTrace({
    focusId: "first.relation",
    focusState: relationFocusState,
    statesById,
    thresholds: { ratioMode: { transitionalMinMass: 3, continuousMinMass: 8 } },
    runtimeOverlay: { localCount: 26, fieldPressure: 0.62, endpointOnly: true },
  });

  assert.equal(trace.focusId, "first.relation");
  assert.equal(trace.behaviours.length, 5);
  assert.equal(trace.atlasSourceSummary.values.carriers, 23);
  assert.equal(trace.atlasSourceSummary.values.ratioMode, "continuous");

  const compression = trace.behaviours.find((b) => b.id === "ratio-compression");
  assert.match(compression.meaning, /holds\/traces referencing/i);
  assert.ok(compression.atlasSource.fields.includes("mass.carriers"));
  assert.ok(compression.mechanicalOutput.relationsHiddenOut >= 0);

  const rhythm = trace.behaviours.find((b) => b.id === "relation-rhythm-signature");
  assert.equal(rhythm.runtimeInput.relationType, "carries");
  assert.equal(rhythm.mechanicalOutput.rhythmMode, "travel");
});

test("relationCompressionLimit tightens as structural mass rises", () => {
  const mass = structuralMassForState(relationFocusState, { transitionalMinMass: 3, continuousMinMass: 8 });
  assert.ok(mass > 0.7);
  const highMassLimit = relationCompressionLimit(mass, 17);
  const lowMassLimit = relationCompressionLimit(0.2, 17);
  assert.ok(highMassLimit < lowMassLimit);
  assert.ok(highMassLimit >= 3);
});

test("fieldPage includes mechanics panel and behaviour trace API client", () => {
  const html = fieldPage();
  assert.match(html, /id="mechanics-panel"/);
  assert.match(html, /Shift\+M toggles/i);
  assert.match(html, /fetch\('\/api\/field\/behaviour-trace/);
  assert.match(html, /window\.__fieldBehaviourTrace/);
});

test("/api/field/behaviour-trace returns trace for known focus id", async () => {
  const entries = [
    {
      id: "first.relation",
      title: "Relation",
      entry_order: "first",
      structure: JSON.stringify({
        holds: [],
        traces: [],
        carries: ["first.carry"],
        pairs: [],
        nests: [],
      }),
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
  assert.equal(body.focusId, "first.relation");
  assert.equal(body.behaviours.length, 5);
  assert.equal(body.atlasSourceSummary.values.carriers, 1);
});

test("/api/field/behaviour-trace returns 404 for unknown focus", async () => {
  const env = {
    ATLAS_DB: {
      prepare(sql) {
        return {
          params: [],
          bind(...params) { this.params = params; return this; },
          async all() {
            if (/FROM entries\b/.test(sql)) return { results: [] };
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
    new Request("https://realitymechanics.nz/api/field/behaviour-trace?id=missing.term"),
    env,
  );
  assert.equal(res.status, 404);
});
