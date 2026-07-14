/**
 * gathering-read.mjs — Structural Gathering neighbourhood read (O-005).
 * Conservative arrangement read from declared structure only — no scalar, no painted field.
 * Governing evidence: P-012, P-011, O-002, O-004, P-003.
 */

import { ratioModeForState, structuralMassForState } from "./ratio-register.mjs";
import {
  pairKey,
  THREAD_RELATION_KEYS,
  weaveModeForLeg,
} from "./thread-mechanics.mjs";
import { buildWeaveStateFromEdges } from "./weave-state.mjs";

export const GATHERING_READ_VERSION = "gathering.v1";

/** O-002 fabricMassMin default — ratio-readable endpoint threshold. */
export const DEFAULT_FABRIC_MASS_MIN = 0.12;

function relationsOf(state) {
  return state?.relations && typeof state.relations === "object" ? state.relations : state || {};
}

/** Directed edges between terms in the focus neighbourhood. */
export function enumerateNeighbourhoodEdges(neighbourhoodIds, statesById) {
  const idSet = new Set(neighbourhoodIds);
  const edges = [];
  neighbourhoodIds.forEach((srcId) => {
    const src = statesById[srcId];
    if (!src) return;
    const rel = relationsOf(src);
    THREAD_RELATION_KEYS.forEach((typeKey) => {
      (rel[typeKey] || []).forEach((tgtId) => {
        if (idSet.has(tgtId) && statesById[tgtId]) {
          edges.push({ srcId, tgtId, typeKey });
        }
      });
    });
  });
  return edges;
}

/** Aggregate pair flags for neighbourhood edges (shared weave-state module). */
export function buildNeighbourhoodPairWeave(edges) {
  return buildWeaveStateFromEdges(edges);
}

function ratioReadableState(state, thresholds, fabricMassMin) {
  const mass = structuralMassForState(state, thresholds);
  return mass >= fabricMassMin;
}

function countSharedThreadTerms(threadPairKeys) {
  const incidence = new Map();
  threadPairKeys.forEach((key) => {
    const [idA, idB] = key.split("\x00");
    incidence.set(idA, (incidence.get(idA) || 0) + 1);
    incidence.set(idB, (incidence.get(idB) || 0) + 1);
  });
  let shared = 0;
  incidence.forEach((count) => {
    if (count >= 2) shared += 1;
  });
  return shared;
}

/**
 * Conservative Structural Gathering read for a focus neighbourhood.
 * Not topology, not a scalar, not a canvas layer — arrangement evidence only.
 */
export function resolveGatheringRead({
  neighbourhoodIds,
  statesById,
  thresholds = {},
  fabricMassMin = DEFAULT_FABRIC_MASS_MIN,
}) {
  const ids = neighbourhoodIds || [];
  const edges = enumerateNeighbourhoodEdges(ids, statesById);
  const pairWeave = buildNeighbourhoodPairWeave(edges, statesById);

  let threadPairCount = 0;
  const threadPairKeys = [];
  pairWeave.forEach((state, key) => {
    if (state.carries && state.traces) {
      threadPairCount += 1;
      threadPairKeys.push(key);
    }
  });

  const threadNetworkTermIds = new Set();
  threadPairKeys.forEach((key) => {
    const [idA, idB] = key.split("\x00");
    threadNetworkTermIds.add(idA);
    threadNetworkTermIds.add(idB);
  });

  let webCrossingCount = 0;
  let pairsEdgeCount = 0;
  let nestsEdgeCount = 0;
  const wovenCrossingPairs = new Set();
  edges.forEach(({ srcId, tgtId, typeKey }) => {
    if (typeKey === "pairs") pairsEdgeCount += 1;
    if (typeKey === "nests") nestsEdgeCount += 1;
    if (typeKey !== "pairs" && typeKey !== "nests") return;
    const key = pairKey(srcId, tgtId);
    const state = pairWeave.get(key);
    if (state && weaveModeForLeg(typeKey, state) === "web_crossing") wovenCrossingPairs.add(key);
  });
  webCrossingCount = wovenCrossingPairs.size;

  const sharedThreadTerms = countSharedThreadTerms(threadPairKeys);
  const ratioThresholds = thresholds.ratioMode || thresholds;
  let ratioReadableInNetwork = 0;
  threadNetworkTermIds.forEach((termId) => {
    if (ratioReadableState(statesById[termId], ratioThresholds, fabricMassMin)) {
      ratioReadableInNetwork += 1;
    }
  });

  const nestedRelationSignals = nestsEdgeCount;
  const formClosureReadable = ratioReadableInNetwork >= 2 && threadNetworkTermIds.size >= 3;

  const approximatesGathering = threadPairCount >= 2
    && webCrossingCount >= 1
    && threadNetworkTermIds.size >= 3
    && sharedThreadTerms >= 1
    && ratioReadableInNetwork >= 2
    && (nestedRelationSignals >= 1 || pairsEdgeCount >= 2);

  let status = "none";
  if (threadPairCount >= 1 && threadNetworkTermIds.size >= 2) {
    status = approximatesGathering ? "approximates_gathering" : "thread_network_only";
  }

  return {
    status,
    approximatesGathering,
    evidence: {
      neighbourhoodSize: ids.length,
      threadPairCount,
      threadNetworkTermCount: threadNetworkTermIds.size,
      webCrossingCount,
      sharedThreadTerms,
      pairsEdgeCount,
      nestsEdgeCount,
      nestedRelationSignals,
      ratioReadableInNetwork,
      formClosureReadable,
      declaredEdgeCount: edges.length,
    },
    distinctions: {
      threadNetwork: "Runtime incidence set — terms on at least one carry∧trace pair in this neighbourhood.",
      structuralGathering: "Arrangement read — multiple nested relations held as one readable whole under Form.",
      fabric: "Held whole — woven continuity; not asserted by this read alone.",
      web: "Crossing-pattern within Fabric — woven pair/nest legs (web_crossing), not graph topology.",
    },
    resolver: GATHERING_READ_VERSION,
    source: "runtime.structural_gathering_read",
  };
}

/** Participant-facing Mechanics annotation — no canvas effect. */
export function buildGatheringReadAnnotation(read) {
  if (!read || read.status === "none") return null;

  const e = read.evidence;
  const rows = [
    ["Read status", read.status === "approximates_gathering"
      ? "Neighbourhood approximates Structural Gathering"
      : "Thread network present — gathering read not yet held"],
    ["Thread network", `${e.threadNetworkTermCount} terms on ${e.threadPairCount} thread pair(s)`],
    ["Woven crossings", String(e.webCrossingCount)],
    ["Shared thread terms", String(e.sharedThreadTerms)],
    ["Ratio-readable (network)", String(e.ratioReadableInNetwork)],
    ["Nest / pair edges", `${e.nestsEdgeCount} nest · ${e.pairsEdgeCount} pair`],
  ];

  if (read.status === "approximates_gathering") {
    rows.push(
      ["Arrangement", "Multiple declared relations in this neighbourhood read together as one arrangement — not traced only as isolated pairs."],
      ["Not Fabric", read.distinctions.fabric],
      ["Not Web alone", read.distinctions.web],
    );
  } else {
    rows.push(
      ["Thread network only", read.distinctions.threadNetwork],
      ["Gathering", "Structural Gathering requires woven crossings, shared terms, and ratio-readable endpoints — not topology alone."],
    );
  }

  rows.push(
    ["Principle", "Fabric must emerge from mechanical evidence — it is never painted as a field layer."],
  );

  return {
    status: read.status,
    approximatesGathering: read.approximatesGathering,
    evidence: e,
    distinctions: read.distinctions,
    rows,
    resolver: read.resolver,
    source: read.source,
  };
}

export function gatheringReadForNeighbourhood(params) {
  const read = resolveGatheringRead(params);
  return {
    read,
    annotation: buildGatheringReadAnnotation(read),
  };
}
