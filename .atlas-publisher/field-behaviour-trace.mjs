/**
 * field-behaviour-trace.mjs — Retrace Field observable behaviours to Atlas structure.
 * D-012 flight recorder: structural trace from D1-derived states + optional runtime overlay.
 */

import { resolveFocusReads } from "./read-engine.mjs";
import { ratioModeForState, structuralMassForState } from "./ratio-register.mjs";
import { RELATION_KEYS } from "./generated/canonical-participation.mjs";

export { ratioModeForState, structuralMassForState };

export const FIELD_RELATION_KEYS = RELATION_KEYS;
const RHYTHM_RELATION_PRIORITY = Object.freeze(["carries", "holds", "traces", "pairs", "nests"]);
for (const key of RHYTHM_RELATION_PRIORITY) {
  if (!FIELD_RELATION_KEYS.includes(key)) throw new Error(`Rhythm relation is not canonical: ${key}`);
}

const RHYTHM_SIGNATURES = {
  holds: { mode: "anchor", behaviour: "sustained pressure near a held midpoint" },
  traces: { mode: "return", behaviour: "intermittent return along a remembered path" },
  carries: { mode: "travel", behaviour: "transported current progressing along the relation" },
  pairs: { mode: "answer", behaviour: "reciprocal answering around the shared middle" },
  nests: { mode: "circulate", behaviour: "slow circulation inside containment" },
};

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n || 0)));
}

function relationsOf(state) {
  return state?.relations && typeof state.relations === "object" ? state.relations : state || {};
}

export function relationCompressionLimit(structuralMass, total) {
  if (total <= 3) return total;
  const relationPressure = clamp01((total - 10) / 30);
  const ratioLimit = Math.round(total * (1 - structuralMass * 0.72 - relationPressure * 0.42));
  const absoluteLimit = Math.round(14 - structuralMass * 4 - relationPressure * 6);
  return Math.max(3, Math.min(total, ratioLimit, absoluteLimit));
}

export function focusNeighbourhoodIds(focusId, statesById) {
  const focus = statesById[focusId];
  if (!focus) return [focusId];
  const ids = new Set([focusId]);
  const rel = relationsOf(focus);
  FIELD_RELATION_KEYS.forEach((key) => {
    (rel[key] || []).forEach((targetId) => {
      if (statesById[targetId]) ids.add(targetId);
    });
  });
  Object.values(statesById).forEach((state) => {
    const source = relationsOf(state);
    FIELD_RELATION_KEYS.forEach((key) => {
      if ((source[key] || []).includes(focusId)) ids.add(state.id);
    });
  });
  return [...ids];
}

export function edgeLists(focusId, statesById) {
  const focus = statesById[focusId];
  const outgoing = [];
  const incoming = [];
  if (!focus) return { outgoing, incoming };
  const focusRel = relationsOf(focus);
  FIELD_RELATION_KEYS.forEach((key) => {
    (focusRel[key] || []).forEach((targetId) => {
      if (statesById[targetId]) outgoing.push({ type: key, id: targetId, title: statesById[targetId].title || targetId });
    });
  });
  Object.values(statesById).forEach((state) => {
    const source = relationsOf(state);
    FIELD_RELATION_KEYS.forEach((key) => {
      if ((source[key] || []).includes(focusId)) {
        incoming.push({ type: key, id: state.id, title: state.title || state.id });
      }
    });
  });
  return { outgoing, incoming };
}

export function countIncomingByKey(focusId, statesById) {
  const counts = Object.fromEntries(FIELD_RELATION_KEYS.map((key) => [key, 0]));
  Object.values(statesById).forEach((state) => {
    const source = relationsOf(state);
    FIELD_RELATION_KEYS.forEach((key) => {
      if ((source[key] || []).includes(focusId)) counts[key] += 1;
    });
  });
  return counts;
}

function atlasSourceFields(focusState, incomingByKey) {
  const carriers = Number(focusState?.mass?.carriers ?? 0);
  return {
    fields: [
      "mass.carriers",
      "ratioMode.mode",
      "ratioMode.x",
      "relations.holds",
      "relations.traces",
      "relations.carries",
      "relations.pairs",
      "relations.nests",
      "incoming holds/traces/pairs/carries/nests in-degree",
    ],
    values: {
      carriers,
      ratioMode: focusState?.ratioMode?.mode ?? "discrete",
      ratioX: focusState?.ratioMode?.x ?? carriers,
      holdsOut: (relationsOf(focusState).holds || []).length,
      tracesOut: (relationsOf(focusState).traces || []).length,
      carriesOut: (relationsOf(focusState).carries || []).length,
      pairsOut: (relationsOf(focusState).pairs || []).length,
      nestsOut: (relationsOf(focusState).nests || []).length,
      holdsIn: incomingByKey.holds,
      tracesIn: incomingByKey.traces,
      carriesIn: incomingByKey.carries,
      pairsIn: incomingByKey.pairs,
      nestsIn: incomingByKey.nests,
    },
  };
}

function pickRhythmSample(outgoing, incoming, preferredType) {
  const pool = [...outgoing, ...incoming.map((edge) => ({ ...edge, direction: "in" }))];
  if (preferredType) {
    const match = pool.find((edge) => edge.type === preferredType);
    if (match) return match;
  }
  for (const key of RHYTHM_RELATION_PRIORITY) {
    const match = pool.find((edge) => edge.type === key);
    if (match) return match;
  }
  return pool[0] || null;
}

/**
 * @param {object} params
 * @param {string} params.focusId
 * @param {object} params.focusState
 * @param {Record<string, object>} params.statesById
 * @param {object} [params.thresholds]
 * @param {object} [params.runtimeOverlay]
 */
export function buildFieldBehaviourTrace({
  focusId,
  focusState,
  statesById,
  thresholds = {},
  runtimeOverlay = {},
}) {
  const ratioThresholds = thresholds.ratioMode || thresholds;
  const ratio = ratioModeForState(focusState, ratioThresholds);
  const structuralMass = structuralMassForState(focusState, ratioThresholds);
  const neighbourhoodIds = focusNeighbourhoodIds(focusId, statesById);
  const { outgoing, incoming } = edgeLists(focusId, statesById);
  const incomingByKey = countIncomingByKey(focusId, statesById);
  const atlasSource = atlasSourceFields(focusState, incomingByKey);
  const outgoingLimit = relationCompressionLimit(structuralMass, outgoing.length);
  const incomingLimit = relationCompressionLimit(structuralMass, incoming.length);
  const localCount = runtimeOverlay.localCount ?? neighbourhoodIds.length;
  const fieldPressure = runtimeOverlay.fieldPressure ?? clamp01(structuralMass * 0.68 + clamp01((localCount - 16) / 30) * 0.58);
  const endpointOnly = runtimeOverlay.endpointOnly ?? (fieldPressure > 0.38);
  const referenceFrame = runtimeOverlay.referenceFrame ?? null;
  const outOfFrameAlpha = runtimeOverlay.outOfFrameAlpha ?? 0.08;
  const rhythmEdge = pickRhythmSample(outgoing, incoming, runtimeOverlay.relationType);
  const rhythm = rhythmEdge ? RHYTHM_SIGNATURES[rhythmEdge.type] : null;

  const behaviours = [
    {
      id: "focus-condensation",
      observation: "Focus condensation",
      runtimeInput: {
        focusId,
        isFocus: true,
        layoutAnchor: { tx: 0, ty: 0 },
        structuralMass: +structuralMass.toFixed(3),
        settled: runtimeOverlay.settled ?? null,
      },
      ratioRelationState: {
        ratioMode: ratio.mode,
        ratioX: ratio.x,
        structuralMass: +structuralMass.toFixed(3),
      },
      atlasSource,
      mechanicalOutput: {
        enlargedFocusRadius: true,
        focusPulse: true,
        arrivalGlow: true,
        peripheralAlphaReduced: localCount > 1,
      },
      meaning: "Focus places the term at the layout anchor and draws it with enlarged condensation, pulse, and arrival glow; structural mass modulates pulse depth.",
    },
    {
      id: "ratio-compression",
      observation: "Ratio-driven relation compression",
      runtimeInput: {
        structuralMass: +structuralMass.toFixed(3),
        ratioMode: ratio.mode,
        ratioTransition: +ratio.transition.toFixed(3),
        ratioContinuous: +ratio.continuous.toFixed(3),
        outgoingEdgeCount: outgoing.length,
        incomingEdgeCount: incoming.length,
      },
      ratioRelationState: {
        compressionLimitOut: outgoingLimit,
        compressionLimitIn: incomingLimit,
        hiddenOutgoing: Math.max(0, outgoing.length - outgoingLimit),
        hiddenIncoming: Math.max(0, incoming.length - incomingLimit),
      },
      atlasSource,
      mechanicalOutput: {
        relationsDrawnOut: outgoingLimit,
        relationsHiddenOut: Math.max(0, outgoing.length - outgoingLimit),
        relationsDrawnIn: incomingLimit,
        relationsHiddenIn: Math.max(0, incoming.length - incomingLimit),
        compressedRelationField: outgoing.length > outgoingLimit || incoming.length > incomingLimit,
      },
      meaning: "Carrier in-degree (holds/traces referencing this term) sets ratio mode and structural mass; higher mass lowers relationCompressionLimit so fewer, stronger filaments are drawn and overflow becomes a compressed halo.",
    },
    {
      id: "peripheral-endpoint-fading",
      observation: "Peripheral endpoint fading",
      runtimeInput: {
        localNeighbourhoodCount: localCount,
        fieldPressure: +fieldPressure.toFixed(3),
        endpointOnlyThreshold: 0.38,
      },
      ratioRelationState: {
        structuralMass: +structuralMass.toFixed(3),
        endpointOnlyActive: endpointOnly,
      },
      atlasSource,
      mechanicalOutput: {
        endpointOnlyRendering: endpointOnly,
        wrinkleBudgetReduced: endpointOnly,
        glowSpreadReduced: endpointOnly,
      },
      meaning: "When neighbourhood pressure or structural mass raises fieldPressure above threshold, non-focus terms render as endpoint-only condensations instead of full wrinkle fields.",
    },
    {
      id: "reference-frame-dimming",
      observation: "Reference-frame dimming",
      runtimeInput: {
        referenceFrame,
        inFrameAlpha: 1,
        outOfFrameAlpha,
      },
      ratioRelationState: {
        frameActive: Boolean(referenceFrame),
      },
      atlasSource: {
        fields: [],
        values: {
          referenceFrame: referenceFrame || null,
          neighbourhoodInFrame: runtimeOverlay.neighbourhoodInFrame ?? null,
        },
      },
      mechanicalOutput: {
        outOfFrameTermsDimmed: Boolean(referenceFrame),
        relationSensibilityAveraged: Boolean(referenceFrame),
      },
      meaning: "A non-canonical participant frame may modulate visibility, but no frame may be inferred from Atlas structure.",
    },
    {
      id: "relation-rhythm-signature",
      observation: "Relation-type rhythm signature",
      runtimeInput: {
        relationType: rhythmEdge?.type ?? null,
        relationTarget: rhythmEdge?.id ?? null,
        relationTitle: rhythmEdge?.title ?? null,
        direction: rhythmEdge?.direction ?? "out",
      },
      ratioRelationState: {
        sourceRatioMode: ratio.mode,
        sourceRatioX: ratio.x,
        ratioTransition: +ratio.transition.toFixed(3),
        ratioContinuous: +ratio.continuous.toFixed(3),
      },
      atlasSource: {
        fields: ["relations." + (rhythmEdge?.type || "type"), "source term ratioMode"],
        values: {
          edgeType: rhythmEdge?.type ?? null,
          edgeTarget: rhythmEdge?.id ?? null,
          declaredInStructure: Boolean(rhythmEdge),
        },
      },
      mechanicalOutput: {
        rhythmMode: rhythm?.mode ?? null,
        rhythmBehaviour: rhythm?.behaviour ?? null,
        ratioModulatesFilament: Boolean(rhythmEdge),
      },
      meaning: rhythmEdge
        ? "Each relation type maps to a fixed rhythm expression; ratio scalars from the source term modulate filament width, strands, and bead alpha through shared weight slots."
        : "No relation edge selected; rhythm trace requires a declared structure edge.",
    },
  ];

  const focusReads = resolveFocusReads({
    focusId,
    focusState,
    statesById,
    neighbourhoodIds,
    thresholds,
  });

  return {
    contractVersion: 1,
    focusId,
    focusTitle: focusState?.title || focusId,
    focusOrder: focusState?.order || null,
    generatedAt: new Date().toISOString(),
    atlasSourceSummary: atlasSource,
    neighbourhood: {
      size: neighbourhoodIds.length,
      outgoing: outgoing.length,
      incoming: incoming.length,
    },
    runtimeOverlay,
    readEngine: {
      version: focusReads.engine,
      catalogue: focusReads.catalogue,
      sourceOfTruthRules: focusReads.sourceOfTruthRules,
      reads: focusReads.reads,
    },
    orderTerminal: focusReads.orderTerminal,
    gatheringRead: focusReads.gatheringRead,
    gatheringReadAnnotation: focusReads.gatheringReadAnnotation,
    behaviours,
  };
}

export function buildTraceIndex(states) {
  return Object.fromEntries((states || []).filter((s) => s?.id).map((s) => [s.id, s]));
}
