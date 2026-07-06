/**
 * O-008 — Woven-field home renderer reconstruction.
 * Mechanics → classify legs → threads → crossings → fabric → condensation → labels.
 * Client bundle mirrors thread-mechanics.mjs for inline Observatory script.
 */

import {
  legStrokeAppearance,
  resolveLeg,
} from "./thread-mechanics.mjs";

export const WOVEN_FIELD_RENDERER_VERSION = "o-008.v1";

export const HOME_WOVEN_VISIBILITY = Object.freeze({
  version: WOVEN_FIELD_RENDERER_VERSION,
  minLegAlpha: 0.14,
  minLegWidth: 0.62,
  wholeFieldAlphaBoost: 1.85,
  wholeFieldWidthBoost: 1.35,
  fabricCellThreshold: 0.012,
  fabricMassMin: 0.05,
  condenseMassMin: 0.06,
  labelMassMin: 0.04,
  wholeFieldConnectionCap: 800,
  fabricCellAlphaScale: 1.55,
});

const WEAVE_DRAW_PRIORITY = Object.freeze({
  thread_forward: 50,
  thread_return: 48,
  web_crossing: 40,
  crossing_unwoven: 28,
  drift: 18,
  archive: 16,
  hold: 10,
});

export function weaveDrawPriority(weaveMode) {
  return WEAVE_DRAW_PRIORITY[weaveMode] ?? 8;
}

export function homeLegStrokeAppearance(resolved, options = {}) {
  const stroke = legStrokeAppearance(resolved, options);
  const vis = HOME_WOVEN_VISIBILITY;
  let baseAlpha = Math.max(vis.minLegAlpha, stroke.baseAlpha);
  let lineWidth = Math.max(vis.minLegWidth, stroke.lineWidth);
  if (options.wholeField) {
    baseAlpha = Math.min(0.92, baseAlpha * vis.wholeFieldAlphaBoost);
    lineWidth *= vis.wholeFieldWidthBoost;
  }
  return { ...stroke, baseAlpha, lineWidth };
}

/** Server-side draw-order plan (mirrors client classify pass). */
export function planHomeWeaveDrawOrder(connections, resolveLegFn) {
  return connections
    .map((conn) => {
      const leg = resolveLegFn(conn);
      return { conn, leg, priority: weaveDrawPriority(leg.weaveMode) };
    })
    .sort((left, right) => {
      if (right.priority !== left.priority) return right.priority - left.priority;
      const lk = `${left.conn.a?.id || ""}:${left.conn.typeKey}:${left.conn.b?.id || ""}`;
      const rk = `${right.conn.a?.id || ""}:${right.conn.typeKey}:${right.conn.b?.id || ""}`;
      return lk.localeCompare(rk);
    });
}

/**
 * Inline client bundle — must stay aligned with thread-mechanics.mjs.
 * Injected after ratioModeForState / structuralMassForState in fieldPage().
 */
export function buildClientMechanicsBundle() {
  const visJson = JSON.stringify(HOME_WOVEN_VISIBILITY);
  return `
// O-008 woven-field renderer — client thread-mechanics activation (keep aligned with thread-mechanics.mjs)
(function activateRMMechanics() {
  const TMS_RESOLVER_VERSION = 'tms.v1';
  const LEG_RHYTHM_MODES = Object.freeze({
    holds: 'anchor', traces: 'return', carries: 'travel', pairs: 'answer', nests: 'circulate',
  });
  const FABRIC_ELIGIBLE_MODES = new Set(['thread_forward', 'thread_return', 'web_crossing']);
  const WEAVE_DRAW_PRIORITY = Object.freeze({
    thread_forward: 50, thread_return: 48, web_crossing: 40, crossing_unwoven: 28,
    drift: 18, archive: 16, hold: 10,
  });
  const HOME_WOVEN_VISIBILITY = Object.freeze(${visJson});

  function clamp01(n) { return Math.max(0, Math.min(1, Number(n || 0))); }
  function pairKey(idA, idB) { return idA < idB ? idA + '\\x00' + idB : idB + '\\x00' + idA; }
  function emptyPairState() { return { carries: false, traces: false, pairs: false, nests: false, holds: false }; }
  function mergePairState(state, typeKey) {
    if (Object.prototype.hasOwnProperty.call(state, typeKey)) state[typeKey] = true;
    return state;
  }
  function buildPairStateFromOps(srcOp, tgtOp) {
    const state = emptyPairState();
    if (!srcOp || !tgtOp) return state;
    const srcId = srcOp.id, tgtId = tgtOp.id;
    ['holds', 'traces', 'carries', 'pairs', 'nests'].forEach((key) => {
      if ((srcOp[key] || []).includes(tgtId)) mergePairState(state, key);
      if ((tgtOp[key] || []).includes(srcId)) mergePairState(state, key);
    });
    return state;
  }
  function weaveModeForLeg(typeKey, pairState) {
    const p = pairState || emptyPairState();
    if (typeKey === 'carries') return p.traces ? 'thread_forward' : 'drift';
    if (typeKey === 'traces') return p.carries ? 'thread_return' : 'archive';
    if (typeKey === 'pairs' || typeKey === 'nests') return p.carries && p.traces ? 'web_crossing' : 'crossing_unwoven';
    return 'hold';
  }
  function ratioConsequence(typeKey, transition, continuous) {
    const t = Number(transition || 0), c = Number(continuous || 0);
    switch (typeKey) {
      case 'carries': return t * 0.18 + c * 0.42;
      case 'traces': return t * 0.18 + c * 0.5;
      case 'holds': return t * 0.28 + c * 0.62;
      case 'pairs': return t * 0.2 + c * 0.48;
      case 'nests': return t * 0.26 + c * 0.58;
      default: return 0;
    }
  }
  function endpointRatioFromFieldState(state, thresholds) {
    const ratio = ratioModeForState(state);
    const structuralMass = structuralMassForState(state);
    return {
      carriers: Number(state?.mass?.carriers ?? ratio.x ?? 0),
      mode: ratio.mode,
      x: ratio.x,
      transition: ratio.transition,
      continuous: ratio.continuous,
      structuralMass,
    };
  }
  function resolveLeg(input) {
    const typeKey = input.typeKey;
    const pairState = input.pairState || emptyPairState();
    const srcRatio = input.srcRatio || {};
    const tgtRatio = input.tgtRatio || {};
    const overlay = input.overlay || {};
    const weaveMode = weaveModeForLeg(typeKey, pairState);
    const legMass = (Number(srcRatio.structuralMass || 0) + Number(tgtRatio.structuralMass || 0)) * 0.5;
    const ratioConseq = ratioConsequence(typeKey, srcRatio.transition, srcRatio.continuous);
    const rhythmMode = LEG_RHYTHM_MODES[typeKey] || 'travel';
    const bowBase = { carries: 36, traces: -46, holds: 14, pairs: 9, nests: 11 };
    let pathCurvature = bowBase[typeKey] ?? 14;
    if (typeKey === 'pairs') pathCurvature *= 0.25 + ratioConseq * 0.5;
    if (typeKey === 'nests') pathCurvature *= 0.82 + ratioConseq * 0.24;
    if (typeKey === 'carries') pathCurvature *= 0.82 + ratioConseq * 0.18;
    return {
      typeKey, weaveMode, rhythmMode, legMass, ratioConsequence: ratioConseq, pathCurvature,
      filamentWeight: clamp01(0.38 + legMass * 0.62 + ratioConseq * 0.28),
      cadence: clamp01(0.12 + ratioConseq * 0.38 + (typeKey === 'carries' ? 0.14 : typeKey === 'traces' ? 0.08 : 0)),
      eligibility: {
        drawable: true,
        fabricEligible: FABRIC_ELIGIBLE_MODES.has(weaveMode),
        threadPair: Boolean(pairState.carries && pairState.traces),
        compressed: Boolean(overlay.compressed),
        frameSensibility: overlay.frameSensibility ?? 1,
      },
      resolver: TMS_RESOLVER_VERSION,
    };
  }
  function legStrokeAppearance(resolved, options) {
    options = options || {};
    const typeStrength = options.typeStrength ?? 0.5;
    const alpha = options.alpha ?? 1;
    const sense = options.sense ?? 1;
    const lineBoost = options.lineBoost ?? 1;
    const relationTension = options.relationTension ?? 0;
    const weaveMode = resolved.weaveMode;
    const filamentWeight = resolved.filamentWeight;
    const typeKey = resolved.typeKey;
    let dash = [], modeAlpha = 1, modeBoost = lineBoost, tint = null;
    if (weaveMode === 'drift') { dash = [4, 5]; modeAlpha = 0.68; tint = 'drift'; }
    else if (weaveMode === 'archive') { dash = [2, 6]; modeAlpha = 0.52; tint = 'archive'; }
    else if (weaveMode === 'web_crossing') { modeBoost *= 1.18; modeAlpha = 1.08; }
    else if (weaveMode === 'crossing_unwoven') { modeAlpha = 0.78; }
    const baseAlpha = typeStrength * 0.11 * modeBoost * alpha * sense * modeAlpha * (0.7 + relationTension * 0.3);
    const lineWidth = (typeKey === 'carries' ? 0.68 : typeKey === 'traces' ? 0.5 : 0.44) * (0.82 + filamentWeight * 0.36);
    return { dash, baseAlpha, lineWidth, tint, weaveMode, filamentWeight, resolver: TMS_RESOLVER_VERSION, layer: 'L6-from-L4' };
  }
  function legFocusedAppearance(resolved, options) {
    options = options || {};
    const emphasis = options.emphasis ?? 1;
    const scale = options.scale ?? 1;
    const ratioVisual = options.ratioVisual || {};
    const rc = resolved.ratioConsequence;
    const filamentWeight = resolved.filamentWeight;
    const weaveMode = resolved.weaveMode;
    const cadence = resolved.cadence;
    const dash = weaveMode === 'drift' ? [4, 5] : weaveMode === 'archive' ? [2, 6] : [];
    const dashAlpha = weaveMode === 'drift' ? 0.82 : weaveMode === 'archive' ? 0.72 : 1;
    const widthScale = (0.88 + filamentWeight * 0.48) * (ratioVisual.lineTightness ?? 1);
    const cadenceScale = 0.16 + cadence * 1.18 + rc * 0.34;
    const alphaBoost = 1 + rc * 0.42;
    return {
      dash, dashAlpha, widthScale, cadenceScale, alphaBoost,
      pathCurvatureScale: 1 + rc * 0.12, weaveMode, resolver: TMS_RESOLVER_VERSION, layer: 'L6-from-L4',
    };
  }
  function fabricEligibleWeaveMode(weaveMode) { return FABRIC_ELIGIBLE_MODES.has(weaveMode); }
  function weaveDrawPriority(weaveMode) { return WEAVE_DRAW_PRIORITY[weaveMode] ?? 8; }
  function homeLegStrokeAppearance(resolved, options) {
    options = options || {};
    const stroke = legStrokeAppearance(resolved, options);
    const vis = HOME_WOVEN_VISIBILITY;
    let baseAlpha = Math.max(vis.minLegAlpha, stroke.baseAlpha);
    let lineWidth = Math.max(vis.minLegWidth, stroke.lineWidth);
    if (options.wholeField) {
      baseAlpha = Math.min(0.92, baseAlpha * vis.wholeFieldAlphaBoost);
      lineWidth *= vis.wholeFieldWidthBoost;
    }
    return Object.assign({}, stroke, { baseAlpha, lineWidth });
  }
  function classifyHomeWeaveLegs(connections, resolveLegFn) {
    return connections.map((conn) => {
      const leg = resolveLegFn(conn);
      return { conn, leg, priority: weaveDrawPriority(leg.weaveMode) };
    }).sort((left, right) => {
      if (right.priority !== left.priority) return right.priority - left.priority;
      const lk = (left.conn.a?.id || '') + ':' + left.conn.typeKey + ':' + (left.conn.b?.id || '');
      const rk = (right.conn.a?.id || '') + ':' + right.conn.typeKey + ':' + (right.conn.b?.id || '');
      return lk < rk ? -1 : lk > rk ? 1 : 0;
    });
  }

  window.RMMechanics = Object.freeze({
    version: HOME_WOVEN_VISIBILITY.version,
    TMS_RESOLVER_VERSION,
    HOME_WOVEN_VISIBILITY,
    emptyPairState, mergePairState, pairKey, buildPairStateFromOps, weaveModeForLeg,
    endpointRatioFromFieldState, resolveLeg, legStrokeAppearance, legFocusedAppearance,
    fabricEligibleWeaveMode, weaveDrawPriority, homeLegStrokeAppearance, classifyHomeWeaveLegs,
  });
})();

var resolveLeg = RMMechanics.resolveLeg;
var legStrokeAppearance = RMMechanics.legStrokeAppearance;
var legFocusedAppearance = RMMechanics.legFocusedAppearance;
var buildPairStateFromOps = RMMechanics.buildPairStateFromOps;
var emptyPairState = RMMechanics.emptyPairState;
var mergePairState = RMMechanics.mergePairState;
var weaveModeForLeg = RMMechanics.weaveModeForLeg;
var fabricEligibleWeaveMode = RMMechanics.fabricEligibleWeaveMode;
var endpointRatioFromFieldState = RMMechanics.endpointRatioFromFieldState;
`;
}
