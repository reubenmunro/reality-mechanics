/**
 * D-020B — amplify existing Field mechanics through rendering only.
 * No new mechanics; scales parameters the runtime already computes.
 */

export const MECHANICS_AMPLIFICATION = Object.freeze({
  condensation: {
    focusPulseDepth: 1.55,
    focusArrivalAlpha: 1.42,
    focusEdgeIrregularity: 1.35,
    endpointContrast: 1.28,
  },
  ratio: {
    discreteStrandBoost: 1.14,
    transitionalBlend: 1.22,
    continuousStrandCut: 0.52,
    continuousCompressionGlow: 1.55,
    continuousLineTightness: 1.32,
  },
  trace: {
    wiggleBoost: 1.48,
    intermittenceAlpha: 1.38,
    pressureTraceStrength: 1.65,
    pressureTraceDecayScale: 0.72,
    memoryPulse: 1.32,
  },
  carry: {
    wiggleCut: 0.38,
    bowCut: 0.58,
    cadenceBoost: 1.42,
    beadRadius: 1.28,
    beadAlpha: 1.24,
  },
  nest: {
    containmentBoost: 1.55,
    circulationRate: 1.38,
    enclosureBow: 1.45,
    beadOrbit: 1.32,
  },
  coupling: {
    outOfFrameTarget: 0.04,
    inFrameBoost: 1.14,
    relationFloor: 0.03,
  },
  frameTransition: {
    pulseDecay: 1.6,
    homeUnderlayBoost: 0.42,
    sensibilityLerp: 4.2,
  },
});

export function ratioVisualScale(ratioMode = {}) {
  const mode = ratioMode.mode || "discrete";
  const transition = Number(ratioMode.transition || 0);
  const continuous = Number(ratioMode.continuous || 0);
  const amp = MECHANICS_AMPLIFICATION.ratio;

  if (mode === "continuous") {
    return {
      mode,
      strandScale: amp.continuousStrandCut,
      wiggleScale: 0.34 + continuous * 0.18,
      compressionGlow: amp.continuousCompressionGlow,
      lineTightness: amp.continuousLineTightness,
      filamentScale: 0.74,
    };
  }

  if (mode === "transitional") {
    const blend = 0.5 + transition * amp.transitionalBlend * 0.5;
    return {
      mode,
      strandScale: 1.02 - transition * 0.34,
      wiggleScale: 0.88 - transition * 0.22,
      compressionGlow: 0.55 + transition * 0.85,
      lineTightness: 0.96 + transition * 0.18,
      filamentScale: 0.9 - transition * 0.12,
    };
  }

  return {
    mode: "discrete",
    strandScale: amp.discreteStrandBoost,
    wiggleScale: 1.08,
    compressionGlow: 0.48,
    lineTightness: 0.9,
    filamentScale: 1.06,
  };
}

export function couplingRelationSensibility(inFrameA, inFrameB, alphaA, alphaB, frameActive) {
  if (!frameActive) return 1;
  const amp = MECHANICS_AMPLIFICATION.coupling;
  if (inFrameA && inFrameB) return amp.inFrameBoost;
  return Math.max(amp.relationFloor, (alphaA + alphaB) * 0.5);
}

export function couplingSensibilityTarget(inFrame, frameActive) {
  if (!frameActive) return 1;
  return inFrame ? 1 : MECHANICS_AMPLIFICATION.coupling.outOfFrameTarget;
}

export function tracePressureStrength(baseStrength, relationKey) {
  if (relationKey !== "traces") return baseStrength;
  return baseStrength * MECHANICS_AMPLIFICATION.trace.pressureTraceStrength;
}

export function tracePressureDecayScale(relationKey) {
  if (relationKey !== "traces") return 1;
  return MECHANICS_AMPLIFICATION.trace.pressureTraceDecayScale;
}

export function amplifiedRhythmExpression(typeKey, rhythm, pulse, base) {
  const amp = MECHANICS_AMPLIFICATION;
  if (typeKey === "traces") {
    return {
      ...base,
      t: base.t,
      radiusScale: base.radiusScale * (0.92 + rhythm.intermittence * 0.14 * amp.trace.memoryPulse),
      alphaScale: base.alphaScale * amp.trace.intermittenceAlpha,
    };
  }
  if (typeKey === "carries") {
    return {
      ...base,
      t: pulse,
      radiusScale: base.radiusScale * (1 + rhythm.cadence * 0.28 * amp.carry.beadRadius),
      alphaScale: base.alphaScale * amp.carry.beadAlpha,
    };
  }
  if (typeKey === "nests") {
    return {
      ...base,
      radiusScale: base.radiusScale * amp.nest.beadOrbit,
      alphaScale: base.alphaScale * (1 + rhythm.circulation * 0.18),
    };
  }
  return base;
}

export function amplifiedCondensationFocus(structuralMass, pulseDepth, irregularity, arrivalAlpha) {
  const amp = MECHANICS_AMPLIFICATION.condensation;
  return {
    pulseDepth: pulseDepth * amp.focusPulseDepth * (1 - structuralMass * 0.18),
    irregularity: irregularity * amp.focusEdgeIrregularity,
    arrivalAlpha: arrivalAlpha * amp.focusArrivalAlpha,
  };
}

export function frameTransitionUnderlayAlpha(homeAlpha, frameActive, transitionPulse) {
  const amp = MECHANICS_AMPLIFICATION.frameTransition;
  const base = Math.max(homeAlpha, frameActive ? 0.58 : 0);
  return base + transitionPulse * amp.homeUnderlayBoost;
}
