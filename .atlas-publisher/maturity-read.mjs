/**
 * maturity-read.mjs — Maturity / settledness parallel structure read (R-MAT).
 * L3 recognition from D1-derived states — non-painting.
 * Governing evidence: P-003 L3, field-maturity, P-013, O-006.
 */

export const MATURITY_READ_VERSION = "maturity-read.v1";

const BAND_ORDER = ["placed", "fresh", "settling", "established", "mature"];

/** Focus-term maturity and settledness recognition read. */
export function resolveMaturityRead(state) {
  if (!state?.id) {
    return {
      status: "unknown",
      resolver: MATURITY_READ_VERSION,
      source: "runtime.maturity_read",
      nonPainting: true,
      evidence: {},
    };
  }
  const band = state.maturityBand || "placed";
  const settledness = Number(state.settledness?.score ?? 0);
  const agitation = Number(state.agitation?.score ?? 0);
  const bandIndex = Math.max(0, BAND_ORDER.indexOf(band));

  let status = "placed";
  if (bandIndex >= 4) status = "mature";
  else if (bandIndex >= 3) status = "established";
  else if (bandIndex >= 2) status = "settling";
  else if (bandIndex >= 1) status = "fresh";

  return {
    status,
    maturityBand: band,
    settledness: +settledness.toFixed(3),
    agitation: +agitation.toFixed(3),
    evidence: {
      attestations: state.settledness?.attestations ?? null,
      revisions30d: state.agitation?.revisions30d ?? null,
      reverts90d: state.agitation?.reverts90d ?? null,
    },
    resolver: MATURITY_READ_VERSION,
    source: "runtime.maturity_read",
    nonPainting: true,
  };
}
