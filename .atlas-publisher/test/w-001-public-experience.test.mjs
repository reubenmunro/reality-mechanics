import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldPage, theoryPage, submissionPage, calculusPage } from "../main-website-worker.js";
import { atlasPage, landingPage, provenancePage } from "../public-atlas.mjs";

const DOCUMENT_PAGES = [
  ["theory", theoryPage],
  ["proof", submissionPage],
  ["calculus", calculusPage],
];

const PUBLIC_PAGES = [
  ["home", landingPage],
  ["atlas", atlasPage],
  ["observatory", fieldPage],
  ["provenance", provenancePage],
  ...DOCUMENT_PAGES,
];

function primaryNavigation(html, name) {
  const nav = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0] || "";
  assert.ok(nav, `${name}: primary navigation present`);
  return nav;
}

test("W-001 primary navigation stays bounded to four surfaces", () => {
  for (const [name, page] of PUBLIC_PAGES) {
    const nav = primaryNavigation(page(), name);
    assert.match(nav, /href="\/"[^>]*>Home/);
    assert.match(nav, /href="\/atlas"[^>]*>Atlas/);
    assert.match(nav, /href="\/field"[^>]*>Observatory/);
    assert.match(nav, /href="https:\/\/calibration\.realitymechanics\.nz\/"[^>]*>Pulse/);
    assert.doesNotMatch(nav, /href="\/(?:theory|proof|calculus)"/);
  }
});

test("W-001 inquiry is exposed as a nested relation", () => {
  const atlas = atlasPage();
  const theory = theoryPage();
  const proof = submissionPage();
  const calculus = calculusPage();

  assert.match(atlas, /href="\/theory">Read the working postulate/);
  assert.match(theory, /href="\/proof">Retrace this claim/);
  assert.match(proof, /href="\/calculus">Inspect the present limits of derivation/);
  assert.match(calculus, /href="\/proof">Retrace the evidence/);

  for (const [, page] of DOCUMENT_PAGES) {
    const html = page();
    assert.doesNotMatch(html, /Two ways in/);
    assert.doesNotMatch(html, /Atlas or Observatory .*Theory .*Proof .*Calculus/);
  }
});

test("W-001 machine access is held once in provenance", () => {
  const provenance = provenancePage();
  assert.match(provenance, /<summary>Machine access<\/summary>/);
  assert.match(provenance, /Read-only MCP/);
  assert.match(provenance, /begin_atlas_session/);
  assert.match(provenance, /https:\/\/mcp\.realitymechanics\.nz\/mcp/);

  for (const [, page] of DOCUMENT_PAGES) {
    assert.doesNotMatch(page(), /https:\/\/mcp\.realitymechanics\.nz\/mcp/);
  }
});

test("W-001 canonical and evidential boundaries remain visible", () => {
  const theory = theoryPage();
  const proof = submissionPage();
  assert.match(theory, /canonical-identity/);
  assert.match(theory, /sha256:aa7717f692e8cec839cb30c9062f66775df387f230a3a0b3982b3ca320a01443/);
  assert.match(proof, /does not assign canonical status/);
  assert.match(provenancePage(), /Publication path/);
});

test("W-001 document surfaces are keyboard-approachable", () => {
  for (const [name, page] of DOCUMENT_PAGES) {
    const html = page();
    assert.match(html, /class="skip-link" href="#main"/, `${name}: skip link`);
    assert.match(html, /<main id="main">/, `${name}: main landmark target`);
    assert.match(html, /:focus-visible/, `${name}: visible focus`);
  }
});

test("Observatory remains minimal without weakening the instrument", () => {
  const html = fieldPage();
  assert.doesNotMatch(html, /landing-meta/);
  assert.match(html, /Relation holds\. Order carries\. Trace places\./);
  assert.match(html, /Observe the Field/);
  assert.match(html, /Browse the Atlas/);
  assert.match(html, /canvas id="field" aria-label="Woven field of Atlas terms/);
  assert.match(html, /id="field-status" role="status"/);
  assert.match(html, /:focus-visible/);
  assert.match(html, /RMMechanics/);
  assert.match(html, /drawWovenHomeField|drawHomeField/);
});

test("W-001 home does not predeclare the nested inquiry", () => {
  const html = landingPage();
  assert.doesNotMatch(html, /class="support"/);
  assert.doesNotMatch(html, /href="\/(?:theory|proof|calculus)"/);
});
