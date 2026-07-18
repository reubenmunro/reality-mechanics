import test from "node:test";
import assert from "node:assert/strict";
import { calculusPage, fieldPage, submissionPage, theoryPage } from "../main-website-worker.js";

// W-003 — mobile presentation remains one source-preserving public frame.

test("W-003 document surfaces share one readable mobile navigation frame", () => {
  for (const html of [theoryPage(), submissionPage(), calculusPage()]) {
    assert.match(html, /viewport-fit=cover/);
    assert.match(html, /header \.brand \{ display:none; \}/);
    assert.match(html, /header nav \{[\s\S]*?flex-wrap:nowrap/);
    assert.match(html, /header nav a \{[\s\S]*?min-height:2\.75rem/);
    assert.match(html, /width:calc\(100vw - 36px\)/);
    assert.match(html, /overflow-wrap:anywhere/);
  }
});

test("W-003 Observatory reduces labels on phones without changing structural selection", () => {
  const html = fieldPage();
  assert.match(html, /const localLabelBudget = isMobileObservatory\(\) \? 4 : LOCAL_LABEL_BUDGET/);
  assert.match(html, /homeLabelIds\.forEach\(\(id, index\) =>/);
  assert.match(html, /isMobileObservatory\(\) && index % HOME_LABELS_PER_ORDER !== 0/);
  assert.match(html, /\.slice\(0, localLabelBudget\)/);
  assert.match(html, /body\.mobile-observatory #enter-form \{[\s\S]*?border-radius: 999px/);
  assert.match(html, /max-height: min\(72dvh, 640px\)/);
});

test("W-003 keeps canonical source routes visible from mobile surfaces", () => {
  const field = fieldPage();
  const theory = theoryPage();
  assert.match(field, /id="sheet-atlas-link"/);
  assert.match(field, /View Atlas Entry/);
  assert.match(field, /sheetAtlasLinkEl\.href = op\.atlasUrl/);
  assert.match(theory, /class="canonical-identity"/);
  assert.match(theory, /Generated from <a href=/);
  assert.match(theory, /Source: <code>sha256:/);
});
