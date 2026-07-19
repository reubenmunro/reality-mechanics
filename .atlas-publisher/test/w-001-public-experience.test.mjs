import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldPage, theoryPage, submissionPage, calculusPage } from "../main-website-worker.js";

// W-001 — public experience polish. The site distinguishes two ways into one
// record (observing / MCP traversal), orients AI workers without hiding or
// overemphasising the MCP, and keeps the evidence path legible end to end.

const DOC_PAGES = [
  ["theory", theoryPage],
  ["proof", submissionPage],
  ["calculus", calculusPage],
];

test("W-001 every document surface carries the two ways in", () => {
  for (const [name, page] of DOC_PAGES) {
    const html = page();
    assert.match(html, /Two ways in/, `${name}: section present`);
    assert.match(html, /Observe .*Theory .*Proof .*Calculus .*Repository/, `${name}: human path`);
    assert.match(html, /MCP .*Atlas .*Runtime contracts .*Programme index .*Repository/, `${name}: AI path`);
  }
});

test("W-001 MCP orientation: what, why, read-only, how to begin, endpoint", () => {
  for (const [name, page] of DOC_PAGES) {
    const html = page();
    assert.match(html, /read-only doorway for AI workers/, `${name}: what`);
    assert.match(html, /read structure rather than infer it/, `${name}: why`);
    assert.match(html, /No write tools are exposed/, `${name}: read-only`);
    assert.match(html, /begin_atlas_session/, `${name}: how to begin`);
    assert.match(html, /https:\/\/mcp\.realitymechanics\.nz\/mcp/, `${name}: endpoint`);
  }
});

test("W-001 evidence ladder names canonical Atlas identity and non-canonical proof", () => {
  for (const [name, page] of DOC_PAGES) {
    const html = page();
    assert.match(html, /evidence-ladder/, `${name}: ladder present`);
    assert.match(html, /tree\/main\/Reality_Mechanics/, `${name}: Atlas link`);
    assert.match(html, /docs\/reports/, `${name}: reports link`);
    assert.match(html, /sha256:1dd98216950c6267fffd23c09070158ca7e1db5d13d8fc776c5eaa1ac6a553ce/, `${name}: canonical source hash`);
    assert.match(html, /remain non-canonical/, `${name}: proof boundary`);
  }
});

test("W-001 document surfaces are keyboard-approachable", () => {
  for (const [name, page] of DOC_PAGES) {
    const html = page();
    assert.match(html, /class="skip-link" href="#main"/, `${name}: skip link`);
    assert.match(html, /<main id="main">/, `${name}: main landmark target`);
    assert.match(html, /:focus-visible/, `${name}: visible focus`);
  }
});

test("W-001 Observatory orients without weakening the instrument", () => {
  const html = fieldPage();
  assert.match(html, /landing-meta/);
  assert.match(html, /Every claim retraces to the/);
  assert.match(html, /\/proof#ways-in/);
  assert.match(html, /canvas id="field" aria-label="Woven field of Atlas terms/);
  assert.match(html, /id="field-status" role="status"/);
  assert.match(html, /:focus-visible/);
  // The woven-field renderer is untouched: activation and draw pipeline intact.
  assert.match(html, /RMMechanics/);
  assert.match(html, /drawWovenHomeField|drawHomeField/);
});

test("W-001 neither path is treated as superior", () => {
  for (const [, page] of DOC_PAGES) {
    const html = page();
    const observing = html.indexOf("<h3>Observing</h3>");
    const ai = html.indexOf("<h3>AI participation</h3>");
    assert.ok(observing > -1 && ai > -1);
    // Same structural weight: both are h3 blocks inside one grid.
    assert.match(html, /class="ways"/);
  }
});
