import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildGatheringReadAnnotation,
  enumerateNeighbourhoodEdges,
  resolveGatheringRead,
} from "../gathering-read.mjs";
import { buildTraceIndex } from "../field-behaviour-trace.mjs";
import { buildFieldBehaviourTrace } from "../field-behaviour-trace.mjs";

const thresholds = { ratioMode: { transitionalMinMass: 3, continuousMinMass: 8 } };

const hubState = {
  id: "term.hub",
  title: "Hub",
  order: "second",
  relations: {
    holds: [],
    traces: ["term.a", "term.b", "term.c"],
    carries: ["term.a", "term.b", "term.c"],
    pairs: ["term.a", "term.b"],
    nests: ["term.c"],
  },
  ratioMode: { mode: "transitional", x: 6 },
  mass: { carriers: 6 },
  maturityBand: "established",
  settledness: { score: 0.4 },
};

const termA = {
  id: "term.a",
  title: "A",
  order: "first",
  relations: {
    holds: [],
    traces: ["term.hub", "term.b"],
    carries: ["term.hub", "term.b"],
    pairs: ["term.hub", "term.b"],
    nests: [],
  },
  ratioMode: { mode: "transitional", x: 5 },
  mass: { carriers: 5 },
  maturityBand: "settling",
  settledness: { score: 0.2 },
};

const termB = {
  id: "term.b",
  title: "B",
  order: "first",
  relations: {
    holds: [],
    traces: ["term.hub", "term.a"],
    carries: ["term.hub", "term.a"],
    pairs: ["term.hub", "term.a"],
    nests: [],
  },
  ratioMode: { mode: "continuous", x: 12 },
  mass: { carriers: 12 },
  maturityBand: "mature",
  settledness: { score: 0.5 },
};

const termC = {
  id: "term.c",
  title: "C",
  order: "second",
  relations: {
    holds: [],
    traces: ["term.hub"],
    carries: ["term.hub"],
    pairs: [],
    nests: ["term.hub"],
  },
  ratioMode: { mode: "discrete", x: 1 },
  mass: { carriers: 1 },
};

const isolatedPairFocus = {
  id: "term.solo",
  title: "Solo",
  relations: {
    carries: ["term.other"],
    traces: ["term.other"],
    holds: [],
    pairs: [],
    nests: [],
  },
  mass: { carriers: 4 },
  ratioMode: { mode: "transitional", x: 4 },
};

const termOther = {
  id: "term.other",
  title: "Other",
  relations: {
    carries: ["term.solo"],
    traces: ["term.solo"],
    holds: [],
    pairs: [],
    nests: [],
  },
  mass: { carriers: 3 },
  ratioMode: { mode: "discrete", x: 3 },
};

test("enumerateNeighbourhoodEdges lists declared edges within neighbourhood only", () => {
  const statesById = buildTraceIndex([hubState, termA, termB, termC]);
  const ids = ["term.hub", "term.a", "term.b", "term.c"];
  const edges = enumerateNeighbourhoodEdges(ids, statesById);
  assert.ok(edges.length >= 8);
  assert.ok(edges.every((e) => ids.includes(e.srcId) && ids.includes(e.tgtId)));
});

test("resolveGatheringRead returns none for isolated single thread pair neighbourhood", () => {
  const statesById = buildTraceIndex([isolatedPairFocus, termOther]);
  const read = resolveGatheringRead({
    neighbourhoodIds: ["term.solo", "term.other"],
    statesById,
    thresholds,
  });
  assert.equal(read.status, "thread_network_only");
  assert.equal(read.approximatesGathering, false);
  assert.equal(read.evidence.threadPairCount, 1);
  assert.equal(read.evidence.webCrossingCount, 0);
  assert.equal(read.evidence.threadNetworkTermCount, 2);
});

test("resolveGatheringRead approximates gathering for multi-pair woven neighbourhood", () => {
  const statesById = buildTraceIndex([hubState, termA, termB, termC]);
  const neighbourhoodIds = ["term.hub", "term.a", "term.b", "term.c"];
  const read = resolveGatheringRead({ neighbourhoodIds, statesById, thresholds });
  assert.equal(read.status, "approximates_gathering");
  assert.equal(read.approximatesGathering, true);
  assert.ok(read.evidence.threadPairCount >= 2);
  assert.ok(read.evidence.webCrossingCount >= 1);
  assert.ok(read.evidence.sharedThreadTerms >= 1);
  assert.ok(read.evidence.ratioReadableInNetwork >= 2);
  assert.ok(read.evidence.nestsEdgeCount >= 1);
});

test("buildGatheringReadAnnotation distinguishes thread network from gathering and fabric", () => {
  const statesById = buildTraceIndex([hubState, termA, termB, termC]);
  const read = resolveGatheringRead({
    neighbourhoodIds: ["term.hub", "term.a", "term.b", "term.c"],
    statesById,
    thresholds,
  });
  const annotation = buildGatheringReadAnnotation(read);
  assert.ok(annotation);
  assert.equal(annotation.approximatesGathering, true);
  const text = annotation.rows.map((r) => r.join(" ")).join(" ");
  assert.match(text, /Thread network/i);
  assert.match(text, /not asserted/i);
  assert.match(text, /never painted/i);
  assert.match(annotation.distinctions.structuralGathering, /readable whole/i);
});

test("buildGatheringReadAnnotation returns null when no thread network", () => {
  const lone = {
    id: "term.lone",
    relations: { holds: [], traces: [], carries: [], pairs: [], nests: [] },
    mass: { carriers: 0 },
  };
  const read = resolveGatheringRead({
    neighbourhoodIds: ["term.lone"],
    statesById: buildTraceIndex([lone]),
    thresholds,
  });
  assert.equal(read.status, "none");
  assert.equal(buildGatheringReadAnnotation(read), null);
});

test("buildFieldBehaviourTrace includes gathering read on behaviour trace API shape", () => {
  const statesById = buildTraceIndex([hubState, termA, termB, termC]);
  const trace = buildFieldBehaviourTrace({
    focusId: "term.hub",
    focusState: hubState,
    statesById,
    thresholds,
    runtimeOverlay: {},
  });
  assert.ok(trace.gatheringRead);
  assert.equal(trace.gatheringRead.status, "approximates_gathering");
  assert.ok(trace.gatheringReadAnnotation);
  assert.match(trace.gatheringReadAnnotation.rows[0][1], /approximates Structural Gathering/i);
});
