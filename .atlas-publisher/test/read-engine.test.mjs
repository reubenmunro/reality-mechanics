import { test } from "node:test";
import assert from "node:assert/strict";
import {
  READ_CATALOGUE,
  READ_ENGINE_VERSION,
  SOURCE_OF_TRUTH_RULES,
  allReadsNonPainting,
  catalogueEntry,
  resolveFocusReads,
} from "../read-engine.mjs";
import { buildTraceIndex } from "../field-behaviour-trace.mjs";
import { buildFieldBehaviourTrace } from "../field-behaviour-trace.mjs";
import { buildWeaveStateFromEdges, threadNetworkTermIdsFromWeave } from "../weave-state.mjs";
import { resolveWeaveLegRead } from "../weave-read.mjs";
import { resolveMaturityRead } from "../maturity-read.mjs";

const thresholds = { ratioMode: { transitionalMinMass: 3, continuousMinMass: 8 } };

const hubState = {
  id: "term.hub",
  title: "Hub",
  order: "second",
  relations: {
    carries: ["term.a", "term.b"],
    traces: ["term.a", "term.b"],
    pairs: ["term.a"],
    nests: ["term.c"],
    holds: [],
  },
  ratioMode: { mode: "transitional", x: 6 },
  mass: { carriers: 6 },
  maturityBand: "established",
  settledness: { score: 0.4 },
  agitation: { score: 0.1 },
};

const termA = {
  id: "term.a",
  relations: {
    carries: ["term.hub", "term.b"],
    traces: ["term.hub", "term.b"],
    pairs: ["term.hub"],
    nests: [],
    holds: [],
  },
  mass: { carriers: 5 },
  ratioMode: { mode: "transitional", x: 5 },
};

const termB = {
  id: "term.b",
  relations: {
    carries: ["term.hub", "term.a"],
    traces: ["term.hub", "term.a"],
    pairs: ["term.hub"],
    nests: [],
    holds: [],
  },
  mass: { carriers: 12 },
  ratioMode: { mode: "continuous", x: 12 },
};

const termC = {
  id: "term.c",
  relations: {
    carries: ["term.hub"],
    traces: ["term.hub"],
    nests: ["term.hub"],
    pairs: [],
    holds: [],
  },
  mass: { carriers: 1 },
};

test("READ_CATALOGUE registers all P-013 reads and behaviour trace instrument", () => {
  assert.ok(catalogueEntry("order-terminal"));
  assert.ok(catalogueEntry("structural-gathering"));
  assert.ok(catalogueEntry("weave-leg"));
  assert.ok(catalogueEntry("fabric-eligibility"));
  assert.ok(catalogueEntry("maturity-settledness"));
  assert.equal(catalogueEntry("behaviour-trace").kind, "meta-instrument");
  assert.equal(Object.keys(READ_CATALOGUE).length, 6);
});

test("all catalogue reads declare nonPainting", () => {
  assert.equal(allReadsNonPainting(), true);
  Object.values(READ_CATALOGUE).forEach((entry) => {
    assert.equal(entry.nonPainting, true, entry.id);
    assert.ok(entry.version, entry.id);
  });
});

test("SOURCE_OF_TRUTH_RULES includes paint and appearance discipline", () => {
  assert.ok(SOURCE_OF_TRUTH_RULES.length >= 6);
  const joined = SOURCE_OF_TRUTH_RULES.join(" ");
  assert.match(joined, /does not paint/i);
  assert.match(joined, /Appearance follows/i);
  assert.match(joined, /Mechanics single path/i);
});

test("resolveFocusReads bundles versioned reads with backward-compatible fields", () => {
  const statesById = buildTraceIndex([hubState, termA, termB, termC]);
  const neighbourhoodIds = ["term.hub", "term.a", "term.b", "term.c"];
  const bundle = resolveFocusReads({
    focusId: "term.hub",
    focusState: hubState,
    statesById,
    neighbourhoodIds,
    thresholds,
  });
  assert.equal(bundle.engine, READ_ENGINE_VERSION);
  assert.ok(bundle.reads.structuralGathering.read);
  assert.equal(bundle.reads.structuralGathering.nonPainting, true);
  assert.equal(bundle.gatheringRead.status, "approximates_gathering");
  assert.ok(bundle.reads.maturity.resolver);
  assert.ok(bundle.reads.weaveSummary.fabricEligibleLegs >= 0);
});

test("resolveWeaveLegRead is non-painting classification", () => {
  const read = resolveWeaveLegRead({
    typeKey: "carries",
    pairState: { carries: true, traces: true, pairs: false, nests: false, holds: false },
  });
  assert.equal(read.weaveMode, "thread_forward");
  assert.equal(read.fabricEligible, true);
  assert.equal(read.nonPainting, true);
  assert.equal(read.resolver, "weave-read.v1");
});

test("resolveMaturityRead derives band without appearance fields", () => {
  const read = resolveMaturityRead(hubState);
  assert.equal(read.status, "established");
  assert.equal(read.maturityBand, "established");
  assert.equal(read.nonPainting, true);
  assert.equal(read.resolver, "maturity-read.v1");
});

test("buildWeaveStateFromEdges matches thread network incidence for home-style edges", () => {
  const edges = [
    { srcId: "a", tgtId: "b", typeKey: "carries" },
    { srcId: "b", tgtId: "a", typeKey: "traces" },
    { srcId: "a", tgtId: "c", typeKey: "carries" },
  ];
  const weave = buildWeaveStateFromEdges(edges);
  const network = threadNetworkTermIdsFromWeave(weave);
  assert.equal(network.size, 2);
  assert.ok(network.has("a"));
  assert.ok(network.has("b"));
  assert.equal(network.has("c"), false);
});

test("buildFieldBehaviourTrace exposes readEngine bundle on API shape", () => {
  const statesById = buildTraceIndex([hubState, termA, termB, termC]);
  const trace = buildFieldBehaviourTrace({
    focusId: "term.hub",
    focusState: hubState,
    statesById,
    thresholds,
    runtimeOverlay: {},
  });
  assert.equal(trace.readEngine.version, READ_ENGINE_VERSION);
  assert.ok(trace.readEngine.reads.structuralGathering);
  assert.equal(trace.gatheringRead.status, "approximates_gathering");
  assert.ok(trace.readEngine.sourceOfTruthRules.length >= 6);
});
