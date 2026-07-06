/**
 * weave-read.mjs — Weave mode and fabric-eligibility reads (R-WM, R-FE).
 * Classification reads derived from mechanics — non-painting.
 * Governing evidence: P-008, O-002, O-004, P-013, O-006.
 */

import { fabricEligibleWeaveMode, pairKey, weaveModeForLeg } from "./thread-mechanics.mjs";
import { buildWeaveStateFromEdges } from "./weave-state.mjs";

export const WEAVE_READ_VERSION = "weave-read.v1";

/** Per-leg weave classification read. */
export function resolveWeaveLegRead({ typeKey, pairState }) {
  const weaveMode = weaveModeForLeg(typeKey, pairState);
  const fabricEligible = fabricEligibleWeaveMode(weaveMode);
  const threadPair = Boolean(pairState?.carries && pairState?.traces);
  return {
    status: weaveMode,
    weaveMode,
    fabricEligible,
    threadPair,
    evidence: { typeKey, pairFlags: { ...pairState } },
    resolver: WEAVE_READ_VERSION,
    source: "runtime.weave_leg_read",
    nonPainting: true,
  };
}

/** Neighbourhood summary of weave-mode distribution (read only). */
export function resolveWeaveReadSummary({ edges }) {
  const weave = buildWeaveStateFromEdges(edges || []);
  const modeCounts = Object.create(null);
  let fabricEligibleLegs = 0;
  let threadPairLegs = 0;
  (edges || []).forEach(({ srcId, tgtId, typeKey }) => {
    const pairState = weave.get(pairKey(srcId, tgtId));
    if (!pairState) return;
    const read = resolveWeaveLegRead({ typeKey, pairState });
    modeCounts[read.weaveMode] = (modeCounts[read.weaveMode] || 0) + 1;
    if (read.fabricEligible) fabricEligibleLegs += 1;
    if (read.threadPair) threadPairLegs += 1;
  });
  return {
    status: fabricEligibleLegs > 0 ? "fabric_eligible_present" : "no_fabric_eligible",
    modeCounts,
    fabricEligibleLegs,
    threadPairLegs,
    declaredEdgeCount: (edges || []).length,
    resolver: WEAVE_READ_VERSION,
    source: "runtime.weave_summary_read",
    nonPainting: true,
  };
}
