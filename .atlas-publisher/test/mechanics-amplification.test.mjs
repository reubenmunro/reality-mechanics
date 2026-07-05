import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MECHANICS_AMPLIFICATION,
  amplifiedCondensationFocus,
  amplifiedRhythmExpression,
  couplingRelationSensibility,
  couplingSensibilityTarget,
  frameTransitionUnderlayAlpha,
  ratioVisualScale,
  tracePressureDecayScale,
  tracePressureStrength,
} from "../mechanics-amplification.mjs";

test("ratioVisualScale separates discrete, transitional, and continuous profiles", () => {
  const discrete = ratioVisualScale({ mode: "discrete", transition: 0, continuous: 0 });
  const transitional = ratioVisualScale({ mode: "transitional", transition: 0.72, continuous: 0 });
  const continuous = ratioVisualScale({ mode: "continuous", transition: 1, continuous: 0.62 });

  assert.equal(discrete.mode, "discrete");
  assert.equal(continuous.mode, "continuous");
  assert.ok(discrete.strandScale > continuous.strandScale);
  assert.ok(discrete.wiggleScale > continuous.wiggleScale);
  assert.ok(continuous.compressionGlow > discrete.compressionGlow);
  assert.ok(transitional.strandScale > continuous.strandScale);
  assert.ok(transitional.strandScale < discrete.strandScale);
});

test("coupling amplifies in-frame relations and fades out-of-frame targets", () => {
  assert.equal(couplingSensibilityTarget(true, true), 1);
  assert.equal(couplingSensibilityTarget(false, true), MECHANICS_AMPLIFICATION.coupling.outOfFrameTarget);
  assert.ok(couplingRelationSensibility(true, true, 1, 1, true) > 1);
  assert.ok(couplingRelationSensibility(false, false, 0.08, 0.08, true) <= 0.08);
  assert.ok(couplingRelationSensibility(false, false, 0.08, 0.08, true) < couplingRelationSensibility(true, true, 1, 1, true));
});

test("trace persistence helpers boost trace pressure only", () => {
  assert.equal(tracePressureStrength(0.02, "carries"), 0.02);
  assert.ok(tracePressureStrength(0.02, "traces") > 0.02);
  assert.ok(tracePressureDecayScale("traces") < tracePressureDecayScale("carries"));
});

test("amplifiedRhythmExpression distinguishes carry travel from trace return", () => {
  const rhythm = { cadence: 0.7, intermittence: 0.8, circulation: 0.6 };
  const carry = amplifiedRhythmExpression("carries", rhythm, 0.82, {
    mode: "travel", t: 0.5, radiusScale: 1, alphaScale: 1,
  });
  const trace = amplifiedRhythmExpression("traces", rhythm, 0.82, {
    mode: "return", t: 0.18, radiusScale: 1, alphaScale: 0.5,
  });

  assert.equal(carry.t, 0.82);
  assert.equal(trace.t, 0.18);
  assert.ok(carry.radiusScale > trace.radiusScale);
  assert.ok(trace.alphaScale > 0.5);
});

test("frameTransitionUnderlayAlpha rises with transition pulse", () => {
  const idle = frameTransitionUnderlayAlpha(0, false, 0);
  const active = frameTransitionUnderlayAlpha(0.2, true, 0);
  const pulse = frameTransitionUnderlayAlpha(0.2, true, 1);
  assert.ok(active >= 0.58);
  assert.ok(pulse > active);
});

test("amplifiedCondensationFocus increases focus readability", () => {
  const out = amplifiedCondensationFocus(0.35, 0.02, 0.12, 0.3);
  assert.ok(out.pulseDepth > 0.02);
  assert.ok(out.irregularity > 0.12);
  assert.ok(out.arrivalAlpha > 0.3);
});
