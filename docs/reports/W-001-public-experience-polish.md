# W-001 — Public Experience Polish

**Programme:** Reality Mechanics
**Type:** Architecture-preserving implementation
**Date:** 2026-07-07 (UTC+12)
**Base:** `main` @ `4678f8e` (M-003) — synchronised with `origin/main` before work
**Governing principle:** The website is not persuading; it is making Reality Mechanics available for inspection.

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| Two ways in (human / AI) | **Done** — shared `ways-in` section on Theory, Proof, Calculus; neither path styled as primary |
| MCP orientation | **Done** — what, why, read-only, how to begin (`begin_atlas_session` → `get_public_surfaces`), endpoint `https://mcp.realitymechanics.nz/mcp` |
| Evidence ladder | **Done** — site → GitHub → Atlas → reports → runtime contracts, linked on every document surface |
| Observatory | Orientation line (repository + MCP), canvas description, live status region, visible focus — renderer untouched |
| Pulse | Ways-in footer pointing into Observatory/Theory/Proof and to the MCP orientation — instrument contract preserved |
| Accessibility | Skip links, `<main id="main">` landmarks, `:focus-visible` outlines on all five surfaces |
| Tests | **All passing** — 122 (atlas-publisher, +6 W-001) · member suite (+1 file, wired into script) · 42 (mcp) |
| Registers | `COMMISSIONS.md` + `PROGRAMME_INDEX.md` updated |

Nothing was redesigned. No theory, mechanics, Atlas content, runtime contracts, MCP behaviour, or repository structure changed. The largest addition is wayfinding — the one thing a first-time visitor could not previously recover from the pages themselves.

---

## 1. What the audit found

The surfaces were already carefully set (D-023/D-026 typography; O-008 woven field live; M-003 evidence links all HTTP 200). The gaps were orientational, not visual:

1. **No page distinguished the human path from the AI path.** The MCP existed in the manifest and the MCP worker, but no public page said what it is, why it exists, that it is read-only, or where to begin.
2. **The evidence ladder was implicit.** Pages linked to individual GitHub documents, but nowhere stated the shape — site reads from GitHub; Atlas canonical; reports preserve evidence; runtime contracts govern claims.
3. **Keyboard access was unfinished.** No skip links, no visible focus indication, no `main` landmarks; the Observatory status line was not a live region and the canvas had no accessible description.
4. **Pulse dead-ended.** The instrument explained itself but did not place itself in the programme.

## 2. What was implemented

### Shared wayfinding (`ways-in`)

One generated section (`waysInHtml()` + `WAYS_IN_CSS` in the Field worker), rendered at the foot of Theory, Proof, and Calculus:

- **Observing** — Observe → Theory → Proof → Calculus → Repository, one sentence per step.
- **AI participation** — MCP → Atlas → Runtime contracts → Programme index → Repository, with the four orientation facts and the endpoint set in a quiet code chip. Links to `docs/PROGRAMME_INDEX.md` and `Reality_Mechanics/AI_PARTICIPATION.md`.
- **Evidence ladder** — a single sentence with five links; ends: "Every public claim retraces along that path."

Both ways are equal-weight `h3` blocks in one grid; the section is data in one place, so the three surfaces cannot drift apart.

### Observatory (instrument preserved)

A `landing-meta` line under the landing actions: "Every claim retraces to the public repository. AI workers enter through the read-only MCP" (linking to `/proof#ways-in`). Canvas gains an `aria-label` describing the woven field; `#field-status` becomes `role="status"`; `:focus-visible` outlines added. No renderer, mechanics, threshold, or copy-contract changes — the O-008 pipeline and its tests are untouched.

### Pulse (contract respected)

A ways-in footer placing Pulse among the surfaces. First attempt embedded the MCP endpoint and was **rejected by Pulse's own invariant test** ("no Atlas or Garden network dependency" — the D-021.4 instrument contract forbids `mcp.realitymechanics.nz` in its source). The footer now points to the Proof orientation instead. The invariant stands unmodified — the correct outcome: the contract did its job.

### Accessibility

Skip links + `main` landmarks + `:focus-visible` on Theory/Proof/Calculus; focus outlines on the Observatory's buttons, links, and search input; Pulse focus styles. Contrast, heading hierarchy, and paragraph measure were audited and left as-is — they already sit within the D-026 instrument aesthetic (17px/1.72 serif, ~600px measure).

## 3. Acceptance against the commission

A first-time visitor can now answer, from the pages alone: what Reality Mechanics is (Theory lede + postulate), where to begin (ways-in, both paths), how to inspect evidence (Proof + evidence ladder), how to explore the Observatory (landing + orientation line), how AI accesses the programme (MCP orientation ×3 pages), where the Atlas lives and why GitHub matters (evidence ladder + canonical-source statements).

## 4. Files changed

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | `waysInHtml()`/`WAYS_IN_CSS`/`MCP_ENDPOINT`; ways-in on three doc pages; skip links + landmarks; Observatory landing-meta, canvas label, status role, focus styles |
| `member/src/index.js` | Ways-in footer; focus styles |
| `member/package.json` | New test wired into the test script |
| `.atlas-publisher/test/w-001-public-experience.test.mjs` | **New** — 6 tests: paths, MCP orientation facts, evidence ladder, keyboard access, Observatory preservation, path parity |
| `member/test/w-001-ways-in.test.mjs` | **New** — orientation + focus assertions (endpoint deliberately absent per invariant) |
| `docs/practice/COMMISSIONS.md`, `docs/PROGRAMME_INDEX.md` | W-001 rows; test count |

## 5. Remaining notes

Live deploy should confirm the ways-in grid on narrow viewports (CSS `auto-fit` should stack; not browser-verified here). A future micro-pass could align the Observatory's `#access-row` nav markup with the document pages' `header/nav` structure — deferred because the Observatory intentionally floats its nav over the canvas.

---

*W-001 complete. Presentation now serves the architecture: one record, two ways in, every claim retraceable.*
