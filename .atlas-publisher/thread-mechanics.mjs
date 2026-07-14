/**
 * thread-mechanics.mjs — Thread Mechanics Specification resolver (P-011 §3, O-004).
 * L4 behaviour only; L6 appearance via legStrokeAppearance / legFocusedAppearance.
 */

import { ratioModeForState, structuralMassForState } from "./ratio-register.mjs";
import { RELATION_KEYS } from "./generated/canonical-participation.mjs";

// Non-canonical product selection for thread behaviour. Canonical membership is
// validated against the generated Atlas relation vocabulary.
export const THREAD_RELATION_KEYS = Object.freeze(["holds", "traces", "carries", "pairs", "nests"]);
for (const key of THREAD_RELATION_KEYS) {
  if (!RELATION_KEYS.includes(key)) throw new Error(`Thread relation is not canonical: ${key}`);
}

export const LEG_RHYTHM_MODES = Object.freeze({
  holds: "anchor",
  traces: "return",
  carries: "travel",
  pairs: "answer",
  nests: "circulate",
});

export const FABRIC_ELIGIBLE_MODES = new Set(["thread_forward", "thread_return", "web_crossing"]);

export const TMS_RESOLVER_VERSION = "tms.v1";

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n || 0)));
}

export function pairKey(idA, idB) {
  return idA < idB ? `${idA}\x00${idB}` : `${idB}\x00${idA}`;
}

export function emptyPairState() {
  return { carries: false, traces: false, pairs: false, nests: false, holds: false };
}

export function mergePairState(state, typeKey) {
  if (Object.prototype.hasOwnProperty.call(state, typeKey)) state[typeKey] = true;
  return state;
}

/** Aggregate declared edges between two terms (L1 pair flags). */
export function buildPairStateFromOps(srcOp, tgtOp) {
  const state = emptyPairState();
  if (!srcOp || !tgtOp) return state;
  const srcId = srcOp.id;
  const tgtId = tgtOp.id;
  for (const key of THREAD_RELATION_KEYS) {
    if ((srcOp[key] || []).includes(tgtId)) mergePairState(state, key);
    if ((tgtOp[key] || []).includes(srcId)) mergePairState(state, key);
  }
  return state;
}

/** P-011 §3.2 weave mode from pair flags + leg type. */
export function weaveModeForLeg(typeKey, pairState) {
  const p = pairState || emptyPairState();
  if (typeKey === "carries") return p.traces ? "thread_forward" : "drift";
  if (typeKey === "traces") return p.carries ? "thread_return" : "archive";
  if (typeKey === "pairs" || typeKey === "nests") {
    return p.carries && p.traces ? "web_crossing" : "crossing_unwoven";
  }
  return "hold";
}

/** P-011 §3.3 ratioConsequence by relation type (source-primary). */
export function ratioConsequence(typeKey, transition, continuous) {
  const t = Number(transition || 0);
  const c = Number(continuous || 0);
  switch (typeKey) {
    case "carries": return t * 0.18 + c * 0.42;
    case "traces": return t * 0.18 + c * 0.5;
    case "holds": return t * 0.28 + c * 0.62;
    case "pairs": return t * 0.2 + c * 0.48;
    case "nests": return t * 0.26 + c * 0.58;
    default: return 0;
  }
}

export function endpointRatioFromFieldState(state, thresholds = {}) {
  const ratio = ratioModeForState(state, thresholds);
  const structuralMass = structuralMassForState(state, thresholds);
  return {
    carriers: Number(state?.mass?.carriers ?? ratio.x ?? 0),
    mode: ratio.mode,
    x: ratio.x,
    transition: ratio.transition,
    continuous: ratio.continuous,
    structuralMass,
  };
}

/**
 * L4 leg resolver — appearance-free mechanical output (P-011 §3.3).
 * Session/frame/compression belong in overlay, not intrinsic leg state.
 */
export function resolveLeg({
  typeKey,
  pairState,
  srcRatio,
  tgtRatio,
  overlay = {},
}) {
  const weaveMode = weaveModeForLeg(typeKey, pairState);
  const legMass = (Number(srcRatio?.structuralMass || 0) + Number(tgtRatio?.structuralMass || 0)) * 0.5;
  const ratioConseq = ratioConsequence(typeKey, srcRatio?.transition, srcRatio?.continuous);
  const rhythmMode = LEG_RHYTHM_MODES[typeKey] || "travel";

  const bowBase = {
    carries: 36,
    traces: -46,
    holds: 14,
    pairs: 9,
    nests: 11,
  };
  let pathCurvature = bowBase[typeKey] ?? 14;
  if (typeKey === "pairs") pathCurvature *= 0.25 + ratioConseq * 0.5;
  if (typeKey === "nests") pathCurvature *= 0.82 + ratioConseq * 0.24;
  if (typeKey === "carries") pathCurvature *= 0.82 + ratioConseq * 0.18;

  const filamentWeight = clamp01(0.38 + legMass * 0.62 + ratioConseq * 0.28);
  const cadence = clamp01(0.12 + ratioConseq * 0.38 + (typeKey === "carries" ? 0.14 : typeKey === "traces" ? 0.08 : 0));

  return {
    typeKey,
    weaveMode,
    rhythmMode,
    legMass,
    ratioConsequence: ratioConseq,
    pathCurvature,
    filamentWeight,
    cadence,
    eligibility: {
      drawable: true,
      fabricEligible: FABRIC_ELIGIBLE_MODES.has(weaveMode),
      threadPair: Boolean(pairState?.carries && pairState?.traces),
      compressed: Boolean(overlay.compressed),
      frameSensibility: overlay.frameSensibility ?? 1,
    },
    resolver: TMS_RESOLVER_VERSION,
  };
}

/** L6 stroke read for home / simple leg draw (follows resolveLeg). */
export function legStrokeAppearance(resolved, options = {}) {
  const {
    typeStrength = 0.5,
    alpha = 1,
    sense = 1,
    lineBoost = 1,
    relationTension = 0,
  } = options;
  const { weaveMode, filamentWeight, typeKey } = resolved;

  let dash = [];
  let modeAlpha = 1;
  let modeBoost = lineBoost;
  let tint = null;

  if (weaveMode === "drift") {
    dash = [4, 5];
    modeAlpha = 0.68;
    tint = "drift";
  } else if (weaveMode === "archive") {
    dash = [2, 6];
    modeAlpha = 0.52;
    tint = "archive";
  } else if (weaveMode === "web_crossing") {
    modeBoost *= 1.18;
    modeAlpha = 1.08;
  } else if (weaveMode === "crossing_unwoven") {
    modeAlpha = 0.78;
  }

  const baseAlpha = typeStrength * 0.11 * modeBoost * alpha * sense * modeAlpha
    * (0.7 + relationTension * 0.3);
  const lineWidth = (typeKey === "carries" ? 0.68 : typeKey === "traces" ? 0.5 : 0.44)
    * (0.82 + filamentWeight * 0.36);

  return {
    dash,
    baseAlpha,
    lineWidth,
    tint,
    weaveMode,
    filamentWeight,
    resolver: TMS_RESOLVER_VERSION,
    layer: "L6-from-L4",
  };
}

/** L6 multipliers for focused drawCurrent (ratio cadence/weight only — overlay separate). */
export function legFocusedAppearance(resolved, options = {}) {
  const { emphasis = 1, scale = 1, ratioVisual = {} } = options;
  const { ratioConsequence: rc, filamentWeight, weaveMode, cadence } = resolved;
  const dash = weaveMode === "drift" ? [4, 5] : weaveMode === "archive" ? [2, 6] : [];
  const dashAlpha = weaveMode === "drift" ? 0.82 : weaveMode === "archive" ? 0.72 : 1;
  const widthScale = (0.88 + filamentWeight * 0.48) * (ratioVisual.lineTightness ?? 1);
  const cadenceScale = 0.16 + cadence * 1.18 + rc * 0.34;
  const alphaBoost = 1 + rc * 0.42;

  return {
    dash,
    dashAlpha,
    widthScale,
    cadenceScale,
    alphaBoost,
    pathCurvatureScale: 1 + rc * 0.12,
    weaveMode,
    resolver: TMS_RESOLVER_VERSION,
    layer: "L6-from-L4",
  };
}

export function fabricEligibleWeaveMode(weaveMode) {
  return FABRIC_ELIGIBLE_MODES.has(weaveMode);
}
