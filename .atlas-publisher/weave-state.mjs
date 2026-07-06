/**
 * weave-state.mjs — Shared pair-weave aggregation (mechanics substrate).
 * Single source for thread-pair flags and thread-network incidence.
 * Consumed by renderer (appearance gating) and read resolvers — not owned by draw*.
 * Governing evidence: P-011, O-004, P-013, O-006.
 */

import { emptyPairState, mergePairState, pairKey } from "./thread-mechanics.mjs";

/**
 * Build pair-flag weave map from directed edge list.
 * @param {Array<{ srcId: string, tgtId: string, typeKey: string }>} edges
 * @returns {Map<string, object>}
 */
export function buildWeaveStateFromEdges(edges) {
  const weave = new Map();
  (edges || []).forEach(({ srcId, tgtId, typeKey }) => {
    if (!srcId || !tgtId || !typeKey) return;
    const key = pairKey(srcId, tgtId);
    const entry = weave.get(key) || emptyPairState();
    mergePairState(entry, typeKey);
    weave.set(key, entry);
  });
  return weave;
}

/** Terms incident on at least one carry∧trace pair in the weave map. */
export function threadNetworkTermIdsFromWeave(weave) {
  const ids = new Set();
  (weave || new Map()).forEach((entry, key) => {
    if (!entry.carries || !entry.traces) return;
    const [idA, idB] = key.split("\x00");
    ids.add(idA);
    ids.add(idB);
  });
  return ids;
}

/** Count mechanically complete thread pairs in weave map. */
export function threadPairCountFromWeave(weave) {
  let count = 0;
  (weave || new Map()).forEach((entry) => {
    if (entry.carries && entry.traces) count += 1;
  });
  return count;
}

export const WEAVE_STATE_VERSION = "weave-state.v1";
