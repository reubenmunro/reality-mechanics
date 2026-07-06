import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPairStateFromOps,
  emptyPairState,
  fabricEligibleWeaveMode,
  legFocusedAppearance,
  legStrokeAppearance,
  mergePairState,
  ratioConsequence,
  resolveLeg,
  weaveModeForLeg,
} from "../thread-mechanics.mjs";
import { fieldPage } from "../main-website-worker.js";

test("weaveModeForLeg implements P-011 TMS pair rules", () => {
  const woven = { carries: true, traces: true, pairs: false, nests: false, holds: false };
  assert.equal(weaveModeForLeg("carries", woven), "thread_forward");
  assert.equal(weaveModeForLeg("traces", woven), "thread_return");
  assert.equal(weaveModeForLeg("pairs", woven), "web_crossing");

  const carryOnly = { carries: true, traces: false, pairs: false, nests: false, holds: false };
  assert.equal(weaveModeForLeg("carries", carryOnly), "drift");

  const traceOnly = { carries: false, traces: true, pairs: false, nests: false, holds: false };
  assert.equal(weaveModeForLeg("traces", traceOnly), "archive");
});

test("buildPairStateFromOps aggregates both directions", () => {
  const a = { id: "first.a", carries: ["second.b"], traces: [], holds: [], pairs: [], nests: [] };
  const b = { id: "second.b", carries: [], traces: ["first.a"], holds: [], pairs: [], nests: [] };
  const pair = buildPairStateFromOps(a, b);
  assert.equal(pair.carries, true);
  assert.equal(pair.traces, true);
});

test("resolveLeg returns L4 mechanical fields without appearance", () => {
  const leg = resolveLeg({
    typeKey: "carries",
    pairState: { carries: true, traces: true, pairs: false, nests: false, holds: false },
    srcRatio: { structuralMass: 0.6, transition: 0.4, continuous: 0.2 },
    tgtRatio: { structuralMass: 0.5, transition: 0.3, continuous: 0.1 },
  });
  assert.equal(leg.weaveMode, "thread_forward");
  assert.equal(leg.rhythmMode, "travel");
  assert.ok(leg.filamentWeight > 0);
  assert.ok(leg.pathCurvature !== 0);
  assert.equal(leg.eligibility.fabricEligible, true);
  assert.equal(leg.eligibility.threadPair, true);
  assert.equal(leg.resolver, "tms.v1");
});

test("ratioConsequence varies by type at same transition", () => {
  const t = 0.5;
  const c = 0.5;
  assert.notEqual(ratioConsequence("carries", t, c), ratioConsequence("holds", t, c));
});

test("legStrokeAppearance maps drift and archive to dash styles", () => {
  const drift = resolveLeg({
    typeKey: "carries",
    pairState: mergePairState(emptyPairState(), "carries"),
    srcRatio: { structuralMass: 0.3, transition: 0, continuous: 0 },
    tgtRatio: { structuralMass: 0.2, transition: 0, continuous: 0 },
  });
  const archive = resolveLeg({
    typeKey: "traces",
    pairState: mergePairState(emptyPairState(), "traces"),
    srcRatio: { structuralMass: 0.3, transition: 0, continuous: 0 },
    tgtRatio: { structuralMass: 0.2, transition: 0, continuous: 0 },
  });
  assert.deepEqual(legStrokeAppearance(drift).dash, [4, 5]);
  assert.deepEqual(legStrokeAppearance(archive).dash, [2, 6]);
  assert.equal(legStrokeAppearance(drift).layer, "L6-from-L4");
});

test("legFocusedAppearance provides width and dash from resolveLeg", () => {
  const leg = resolveLeg({
    typeKey: "traces",
    pairState: { carries: false, traces: true, pairs: false, nests: false, holds: false },
    srcRatio: { structuralMass: 0.4, transition: 0.2, continuous: 0 },
    tgtRatio: { structuralMass: 0.3, transition: 0.1, continuous: 0 },
  });
  const appear = legFocusedAppearance(leg, { emphasis: 1, scale: 1, ratioVisual: {} });
  assert.deepEqual(appear.dash, [2, 6]);
  assert.ok(appear.widthScale > 0);
});

test("fabricEligibleWeaveMode matches O-002 fabric gating", () => {
  assert.equal(fabricEligibleWeaveMode("thread_forward"), true);
  assert.equal(fabricEligibleWeaveMode("drift"), false);
});

test("O-004 field page wires TMS resolver in worker script", () => {
  const html = fieldPage();
  assert.match(html, /function resolveHomeLeg/);
  assert.match(html, /buildPairStateFromOps/);
  assert.match(html, /legStrokeAppearance/);
  assert.match(html, /legFocusedAppearance/);
  assert.match(html, /tmsLeg/);
});
