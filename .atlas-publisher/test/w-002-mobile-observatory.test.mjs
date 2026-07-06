import test from "node:test";
import assert from "node:assert/strict";
import { fieldPage } from "../main-website-worker.js";

// W-002 — mobile Observatory polish. Presentation only; mechanics unchanged.

test("W-002 mobile layout uses bottom drawer and field-first chrome", () => {
  const html = fieldPage();
  assert.match(html, /body\.mobile-observatory #term-sheet/);
  assert.match(html, /transform: translateY\(calc\(100% \+ 1px\)\)/);
  assert.match(html, /#sheet-backdrop/);
  assert.match(html, /#sheet-drag-handle/);
  assert.match(html, /env\(safe-area-inset-bottom/);
  assert.match(html, /isMobileObservatory\(\)/);
  assert.match(html, /syncMobileObservatoryClass\(\)/);
});

test("W-002 neutral open keeps sheet closed on mobile", () => {
  const html = fieldPage();
  assert.match(html, /renderNeutralSheet\(\);\s*closeTermSheet\(\)/);
  assert.match(html, /if \(isMobileObservatory\(\)\) dismissObservatoryLanding\(\)/);
  assert.match(html, /else if \(!selectedTermId && !isMobileObservatory\(\)\) openTermSheet\(\)/);
});

test("W-002 term selection pulses before mobile sheet reveal", () => {
  const html = fieldPage();
  assert.match(html, /function drawTapPulse\(\)/);
  assert.match(html, /function pulseSelectedTerm\(id\)/);
  assert.match(html, /function revealTermSheetForSelection\(id\)/);
  assert.match(html, /observeTerm\(found, \{ deferRender: isMobileObservatory\(\) \}\)/);
  assert.match(html, /MOBILE_SHEET_REVEAL_MS/);
});

test("W-002 mobile drawer is dismissible", () => {
  const html = fieldPage();
  assert.match(html, /sheetBackdropEl\.addEventListener\('click', closeTermSheet\)/);
  assert.match(html, /function initMobileTermDrawer\(\)/);
  assert.match(html, /if \(dy > 96\) closeTermSheet\(\)/);
});

test("W-002 desktop side panel mechanics preserved", () => {
  const html = fieldPage();
  assert.match(html, /#term-sheet \{\s*position: fixed; top: 0; right: min\(-28rem, -88vw\)/);
  assert.match(html, /#term-sheet\.open \{ right: 0; \}/);
  assert.doesNotMatch(html, /@media \(max-width: 700px\)/);
});
