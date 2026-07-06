import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldPage } from "../main-website-worker.js";
import {
  HOME_WOVEN_VISIBILITY,
  WOVEN_FIELD_RENDERER_VERSION,
  homeLegStrokeAppearance,
  planHomeWeaveDrawOrder,
  weaveDrawPriority,
} from "../woven-field-renderer.mjs";
import { resolveLeg, emptyPairState, mergePairState } from "../thread-mechanics.mjs";

test("O-008 woven-field renderer: client mechanics bundle emitted in field HTML", () => {
  const html = fieldPage();
  assert.match(html, /window\.RMMechanics/);
  assert.match(html, /activateRMMechanics/);
  assert.match(html, /var resolveLeg = RMMechanics\.resolveLeg/);
  assert.match(html, /var legStrokeAppearance = RMMechanics\.legStrokeAppearance/);
  assert.match(html, /var buildPairStateFromOps = RMMechanics\.buildPairStateFromOps/);
  assert.match(html, /homeLegStrokeAppearance/);
  assert.match(html, /classifyHomeWeaveLegs/);
  assert.match(html, /function frameTransitionUnderlayAlpha/);
  assert.match(html, /const MECHANICS_AMPLIFICATION = Object\.freeze/);
  assert.match(html, /O-008 woven-field renderer/);
});

test("O-008 woven-field renderer: first-load draw pipeline is called", () => {
  const html = fieldPage();
  assert.match(html, /function drawWovenHomeField/);
  assert.match(html, /function drawHomeField\(alpha\)/);
  assert.match(html, /drawWovenHomeField\(alpha\)/);
  assert.match(html, /drawHomeStructuralLabels\(alpha\)/);
  assert.match(html, /RMMechanics\.classifyHomeWeaveLegs/);
  assert.match(html, /drawHomeFabricFace\(alpha\)/);
  assert.match(html, /buildHomeWeaveState\(\)/);
});

test("O-008 woven-field renderer: visibility floors are not below perceptibility threshold", () => {
  assert.ok(HOME_WOVEN_VISIBILITY.minLegAlpha >= 0.12);
  assert.ok(HOME_WOVEN_VISIBILITY.minLegWidth >= 0.55);
  assert.ok(HOME_WOVEN_VISIBILITY.fabricCellThreshold <= 0.02);
  assert.ok(HOME_WOVEN_VISIBILITY.condenseMassMin <= 0.1);
  assert.equal(HOME_WOVEN_VISIBILITY.version, WOVEN_FIELD_RENDERER_VERSION);
});

test("O-008 woven-field renderer: draw order prioritises threads over drift/archive", () => {
  const threadPair = mergePairState(mergePairState(emptyPairState(), "carries"), "traces");
  const resolveLegFn = (conn) => resolveLeg({
    typeKey: conn.typeKey,
    pairState: conn.a.id === "thread.a" ? threadPair : emptyPairState(),
    srcRatio: { structuralMass: 0.2, transition: 0, continuous: 0 },
    tgtRatio: { structuralMass: 0.2, transition: 0, continuous: 0 },
  });

  const plan = planHomeWeaveDrawOrder(
    [
      { a: { id: "drift.a" }, b: { id: "drift.b" }, typeKey: "carries" },
      { a: { id: "archive.a" }, b: { id: "archive.b" }, typeKey: "traces" },
      { a: { id: "thread.a" }, b: { id: "thread.b" }, typeKey: "carries" },
    ],
    resolveLegFn,
  );

  assert.equal(plan[0].leg.weaveMode, "thread_forward");
  assert.ok(weaveDrawPriority("thread_forward") > weaveDrawPriority("drift"));
  assert.ok(weaveDrawPriority("web_crossing") > weaveDrawPriority("archive"));
});

test("O-008 woven-field renderer: homeLegStrokeAppearance enforces alpha floor", () => {
  const leg = resolveLeg({
    typeKey: "traces",
    pairState: emptyPairState(),
    srcRatio: { structuralMass: 0.01, transition: 0, continuous: 0 },
    tgtRatio: { structuralMass: 0.01, transition: 0, continuous: 0 },
  });
  const faint = homeLegStrokeAppearance(leg, { typeStrength: 0.2, alpha: 0.3, wholeField: false });
  assert.ok(faint.baseAlpha >= HOME_WOVEN_VISIBILITY.minLegAlpha);
  const whole = homeLegStrokeAppearance(leg, { typeStrength: 0.2, alpha: 1, wholeField: true });
  assert.ok(whole.baseAlpha > faint.baseAlpha);
  assert.ok(whole.lineWidth >= HOME_WOVEN_VISIBILITY.minLegWidth);
});

test("O-008 woven-field renderer: legacy hash-sorted home pass removed", () => {
  const html = fieldPage();
  assert.doesNotMatch(html, /hashStr\(left\.a\.id \+ left\.typeKey \+ left\.b\.id\)/);
});
