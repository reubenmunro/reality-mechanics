/**
 * ratio-register.mjs — L2 scalar expansion (mechanics substrate).
 * Shared by thread-mechanics, gathering-read, and behaviour trace — breaks import cycles.
 */

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n || 0)));
}

function maturityValue(state) {
  return ({ placed: 0.08, fresh: 0.16, settling: 0.42, established: 0.68, mature: 0.9 })[state?.maturityBand] ?? 0.08;
}

export function ratioModeForState(state, thresholds = {}) {
  const x = Number(state?.ratioMode?.x ?? state?.mass?.carriers ?? 0);
  const mode = state?.ratioMode?.mode || "discrete";
  const transitionalMin = Math.max(1, Number(thresholds.transitionalMinMass ?? thresholds.transitional_min_mass ?? 3));
  const continuousMin = Math.max(transitionalMin + 1, Number(thresholds.continuousMinMass ?? thresholds.continuous_min_mass ?? 8));
  if (mode === "continuous") {
    return {
      mode, x,
      transition: 1,
      continuous: clamp01(0.46 + (x - continuousMin) / Math.max(continuousMin, 6)),
      compression: clamp01(0.58 + (x - continuousMin) / Math.max(continuousMin * 1.4, 8)),
    };
  }
  if (mode === "transitional") {
    const t = clamp01((x - transitionalMin) / Math.max(1, continuousMin - transitionalMin));
    return { mode, x, transition: 0.42 + t * 0.52, continuous: 0, compression: 0.18 + t * 0.28 };
  }
  return {
    mode, x,
    transition: clamp01(x / transitionalMin) * 0.18,
    continuous: 0,
    compression: 0,
  };
}

export function structuralMassForState(state, thresholds = {}) {
  const ratio = ratioModeForState(state, thresholds);
  const carriers = Number(state?.mass?.carriers ?? 0);
  const settledness = Number(state?.settledness?.score ?? 0);
  const maturity = maturityValue(state);
  return clamp01(
    0.04
    + Math.min(0.28, carriers * 0.035)
    + ratio.transition * 0.18
    + ratio.continuous * 0.26
    + settledness * 0.14
    + maturity * 0.1,
  );
}

export const RATIO_REGISTER_VERSION = "ratio-register.v1";
