# D-024 — Calculus Public Surface

**Programme:** Public Structure
**Type:** New public surface — the derivation surface
**Date:** 2026-07-06 (UTC+12)
**Base:** `main` @ `1bce75e` (D-023, deployed and live-verified this session)

---

## Diagnosis

The repository already contained a real derivation programme that was publicly invisible:

1. **A live, mechanically retraceable derivation chain** runs on the Observatory — `holds/traces in-degree → mass.carriers → ratioMode → client expansion → ratio-modulated render → D-012 retrace` (`docs/runtime/DERIVED_RATIO.md`, falsified "viable with constraints" in D-015B) — with its mathematics explicit in code (`fieldRatioMode`, `structureCarriesEntry`, `field-maturity.mjs`) and stated nowhere publicly.
2. **The candidate calculus has precise, honest results** hidden in reports: seven working stages compress into the Atlas's own `Ark Run` (C-001); the Order/Ark candidate was tested and found **not minimal**, with minimal seat `Relation → Connection` (C-003); the `:` operator is explicitly unaccepted (C010).
3. **The four-way status distinction already exists in repository practice, unnamed publicly:** derived (locked definitions, forced results), calibrated (tested rules, configured thresholds), heuristic (rendering coefficients), unresolved (preserved gaps).
4. **Principal design risk:** the page must not read as "our mathematics." It is a derivation *status* surface.

## Design decisions and structural grounding

| Decision | Grounding |
|---|---|
| **Route `/calculus` on the Field worker**, nav symbol **∴** (therefore) — five public surfaces: Observatory · Pulse · Theory · Proof · Calculus | Commissioned; 410 message updated to name five surfaces |
| **Unpromotion notice leads the page** — "Nothing on this page is promoted. The Calculus has no accepted operation; the `:` operator is not accepted." | C010; `PRACTICE_CALCULUS.md` status; commissions register |
| **Status vocabulary block** defining derived / calibrated / heuristic / unresolved as non-interchangeable | Commissioned distinction, mapped onto existing repo practice (locked definitions; D-018 calibration; D-020B "rendering only"; OPEN_QUESTIONS gap discipline) |
| **The live derivation chain as centerpiece**, each step with its exact rule and status chip: declared relations (canonical) → `mass(t) = \|{ s ≠ t : t ∈ holds(s) ∪ traces(s) }\|` (derived, D-010B locked) → `mode(x)` thresholds 3/8 (calibrated, configured) → amplification coefficients (heuristic, D-020B) → `/api/field/behaviour-trace` retrace (derived, D-012) | `DERIVED_RATIO.md` "smallest retraceable chain supported today"; worker source |
| **Explicit caveat:** the scalar chain is *not* Atlas Ratio; richer structural signature is a future unknown | D-015B primary-label and non-equivalence rulings |
| **Maturity block** — bands derived at read time, never stored; thresholds calibrated | `field-maturity.mjs` |
| **Candidate calculus section** — working relation `Order : Structure : Read`; Ark Run `Pressure → Trace → Check → Determine → Step` (candidate); minimum-support **negative result kept**: not minimal, minimal seat `Relation → Connection`; three standing constraints before any promotion | `PRACTICE_CALCULUS.md`; C-001; C-002; C-003; C-C000A; C010 |
| **Full four-status inventory** with report links (C-R001, Stewardship V1, D-010B, D-012/D-015B, D-014 / D-018A, D-018D, D-008, thresholds / D-020B, D-022, D-023 budgets / C-A001, C010, C-C000A, C-003 grain, Second Order marker, C005, structural signature) | Each item links to its evidence document |
| **Theory page** gains a Calculus surface card; all page navs and the Pulse worker nav gain ∴ Calculus | Surface-role coherence |

Deliberately not done: no derivation was completed, extended, or smoothed; no unresolved item was restated with more confidence than its source report carries; Proof's accepted list (from Submission 001) was left untouched.

## What is derived / calibrated / heuristic / unresolved (as published)

- **Derived:** Relation as sole internal first-order root (C-R001); Carry/Trace one condition carved by direction; the mass rule (D-010B, locked); behaviour retrace mechanics (D-012); runtime principles as implications only (D-014); the C-003 negative minimality result.
- **Calibrated:** Tier-1 place and hold prose (D-018A/D — 481 files, 485/488); whole-Atlas calibration (D-008); ratio-mode thresholds (3/8); maturity bands.
- **Heuristic:** mechanics amplification coefficients (D-020B); legibility floors (D-022); placement jitter and label budgets (D-023); adaptive render budgets.
- **Unresolved (preserved):** Pressure underived (C-A001); `:` unaccepted (C010); "operation" six senses (C-C000A); calculus grain undeclared (C-003); Second Order terminal marker (OPEN_QUESTIONS); C005 D1 schema/recovery; structural signature beyond the scalar (D-015B).

## Files changed

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | New `calculusPage()`; `/calculus` route; 410 message → five surfaces; ∴ Calculus in all four page navs; Theory surface card |
| `member/src/index.js` | ∴ Calculus nav link |
| `.atlas-publisher/test/field-states.test.mjs` | 6 new D-024 tests; 8 × 410-message assertions updated; `calculusPage` import |
| `member/test/invariants.test.mjs` | 1 new nav test |
| `docs/reports/D-024-calculus-public-surface.md` | This report |
| `docs/practice/COMMISSIONS.md` | Register entry |

## Routes affected

New: `/calculus` (200). Changed: all retired routes' 410 body now names five surfaces; nav on `/`, `/field`, `/theory`, `/proof`, `/submission`, and the Pulse worker gains ∴ Calculus. Unchanged: all APIs, MCP worker, D1.

## Tests run

| Suite | Result |
|---|---|
| `npm --prefix .atlas-publisher test` | **70/70 pass** (64 + 6 new) |
| `npm --prefix member test` | **Pass** — 17 assertions (16 + 1 new) |
| `npm --prefix reality-mechanics-mcp test` | **Pass** — 27 assertions |
| `node --check` both workers | Pass |

Deployment note: D-022/D-023 were pushed and live-verified at the start of this session (`bf772fa..1bce75e`; `/theory` recomposition confirmed live). D-024 is committed locally; push deploys via the existing workflow.

## What remains unresolved

1. Everything in the page's own unresolved column — by design.
2. The Calculus page is hand-composed against today's reports; when C-series evidence changes, the page must be re-derived (no generation from the register yet).
3. Proof's "Accepted" card still reflects Submission 001's four-surface era ("Public surfaces: Observatory, Pulse, MCP") — accurate to its source document, but a Submission 002 would be the honest vehicle to refresh the accepted list, now five surfaces exist.
4. D-023's deferred items stand: live-field verification of dependency-bearing placement; render-layer audit against `DERIVED_RATIO.md`.
5. Documentation follow-ups (README / PROJECT_STATUS / CLOUDFLARE_SURFACE_MAP) now also lack the fifth surface.

## Next recommended commission

**D-025 — Submission 002 + repository documentation alignment.** Coordinate a second public submission that refreshes the accepted/candidate/unresolved lists against the current repository (five public surfaces, D-022–D-024 evidence), and align README, PROJECT_STATUS, and CLOUDFLARE_SURFACE_MAP with the deployed reality — closing the documentation drift recorded in FABLE-REPO-STATE-FINDING-2026-07-06 in one pass, under Proof's own standard.

---

## Acceptance

| Criterion | Status |
|---|---|
| Visitor can see how claims are progressively derived | **Pass** — live chain with per-step rules and statuses; candidate section; inventory |
| derived / calibrated / heuristic / unresolved distinguished | **Pass** — defined vocabulary; chips; four-column inventory; tested |
| Implied mathematics made explicit | **Pass** — mass rule, mode thresholds, maturity bands, retrace endpoint |
| Heuristics identified honestly | **Pass** — named as carrying no structural claim |
| Gaps preserved | **Pass** — unpromotion notice; unresolved column; Atlas-Ratio caveat |
| No invented theory or mathematics | **Pass** — every formula read from worker source / locked definitions |
| Tests pass | **Pass** — 70/70 + 17 + 27 |
