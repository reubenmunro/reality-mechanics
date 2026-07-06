# D-022 — Observatory Legibility (Language Enters the Field)

**Programme:** Public Structure
**Type:** Observatory MVP legibility + Theory claim
**Date:** 2026-07-06 (UTC+12)
**Base:** `main` @ `bf772fa` (D-021.5)

---

## Diagnosis

Direct inspection of `.atlas-publisher/main-website-worker.js` (3,270 lines at base) found the Observatory structurally failing as a public reading surface for one central reason:

**No language ever reached the canvas.** There was not a single `fillText` in the worker. 490 terms rendered as anonymous glows; order and relation were encoded only in sub-perceptual colour and alpha (non-local node base alpha 0.07, home edges 0.024–0.048, edge strokes 0.012, smoke puffs 0.009). Three consecutive commissions (D-020C, D-020D, D-021.4-R) were "canvas empty / nearly empty" corrections; each raised coefficients without addressing the root. Common Term Structure states *"Language positions participation. Position gives the participant a place to begin."* The canvas gave no position.

Secondary findings:

1. Substantial machinery produced texture with no ratio/order content a visitor could retrace to Atlas structure: 48 ambient smoke puffs per frame, up to 6 "wrinkle" curls per node.
2. The term entry field required already knowing term names — no suggestions over the Atlas index.
3. The dependency-order palette (`FIRE_ORDERS`) was never named on screen, so ring placement read as decoration rather than order.
4. What already worked: the compressed term sheet (order, calibrated place sentence, holds/traces/carries/pairs/nests as clickable relations, View Atlas Entry link) and the clean D1 read path (`/api/field/states`). Retraceability lived in the panel; the canvas contributed almost nothing.
5. Theory page had a clean shell but never stated the discipline's basic claim. Proof already rendered Accepted / Candidate / Unresolved without promoting the calculus. Pulse was already a distinct instrument MVP.

## MVP structure per surface (proposed and applied where smallest-coherent)

| Surface | MVP structure | This commission |
|---|---|---|
| **Observatory** | Whole-field open with labelled structural entry points per order; enter a term by suggestion, click, or deep-link; focused view labels the term and its nearest relations; term sheet carries the full structural read; order named in the field palette | **Applied** |
| **Pulse** | Single temporal instrument (Calibration cardiogram) + `/api/health`; instrument-like, no Atlas duplication | Already at MVP (D-021.5) — untouched |
| **Theory** | Basic claim + working postulate stated from canonical stable material; links to canonical documents; no Atlas duplication | **Applied** |
| **Proof** | Accepted / Candidate / Unresolved with evidence links; no overclaim | Already at MVP (D-021.5) — untouched |

## Changes

### Observatory (`.atlas-publisher/main-website-worker.js`)

| Change | Detail |
|---|---|
| Canvas term labels | New `drawTermLabel()`. Whole-field view labels the `HOME_LABELS_PER_ORDER = 4` highest-degree terms of each order (≤24 labels — structural entry points). Focused view labels the focus term (emphasised) and up to `LOCAL_LABEL_BUDGET = 14` local relation targets sorted by degree. Labels use existing node positions, so existing nearest-node click selection makes every label a click target. |
| Term entry suggestions | `<datalist id="term-suggestions">` populated from the full Atlas index at bootstrap (`populateTermSuggestions()`); input gains `list` attribute. |
| Order legend | `#order-legend` names ground → first → second → third → practice → higher in the existing `FIRE_ORDERS` palette (`buildOrderLegend()`); hidden on small viewports. |
| Legibility floor | Non-local node base alpha 0.07 → 0.11; home node core alpha 0.16 → 0.30; home node edge alpha 0.04 → 0.10; home connection alphas 0.024/0.032/0.048 → 0.045/0.055/0.085. |
| Decoration stripped | Ambient smoke-puff loop removed (`drawSmoke` now paints the backdrop gradient only). Wrinkle-curl loop removed from `drawOperation`. Neither carried retraceable ratio/order content. |

**Not changed:** relation filament/current drawing, condensation, pressure/basin/wake machinery (see Unresolved), term sheet, `/api/field/states` contract, MCP worker, Pulse worker, Atlas source, D1.

### Theory (`theoryPage()` in the same worker)

- Lede now states the basic claim: *"Reality already carries order. Reality Mechanics does not invent structure — it observes structural relations already carried in reality, and keeps every observation retraceable."* (Grounded in `MISSION.md`: "Reality already carries order"; "Its purpose is not to invent structure.")
- New section **The working postulate** quotes `Reality_Mechanics/Theory.md` (v0.6, `status: stable`, `publish: true`): *Relation holds. Order carries. Trace places.* — with its own ordinary-language expansion, explicitly marked as a versioned working claim corrected by failure, not doctrine. No new theory invented.
- New one-paragraph section mapping the four surfaces to the claim (Observatory = structure, Pulse = behaviour through time, Proof = retraceable evidence).

### Tests (`.atlas-publisher/test/field-states.test.mjs`)

Five new assertions pin the D-022 invariants: canvas labels present; datalist over the Atlas index; order legend; smoke/wrinkle machinery absent; Theory states the postulate.

## Routes affected

| Route | Effect |
|---|---|
| `/`, `/field` | Labelled whole-field open; labelled focused view; suggestions; legend; less decoration |
| `/theory` | Basic claim + working postulate |
| all other routes | Unchanged (Proof, Pulse, APIs, 410 set, MCP) |

## Tests run

| Suite | Result |
|---|---|
| `npm --prefix .atlas-publisher test` | **58/58 pass** (53 existing + 5 new) |
| `npm --prefix member test` | **Pass** — all 15 invariant assertions |
| `npm --prefix reality-mechanics-mcp test` | **Pass** — 27 assertions |
| `node --check main-website-worker.js` | Pass |

## What improved

- A visitor arriving at the Observatory now sees named places in the field, ordered by the named dependency palette, and can enter any term through suggestions — select/enter a term, see its structure, and read relation/order/carrying through the term sheet without prior knowledge of the Atlas.
- The two most clearly decorative render layers are gone; every remaining labelled element retraces to Atlas structure (term id, order, declared relations).
- Theory now makes the basic public claim in canonical language, with the postulate quoted from stable Atlas material.

## What remains unresolved

1. **Pressure/basin/wake/condensation machinery** (~1,000 lines) still renders coefficients whose structural translation is undemonstrated. It should be evaluated against `docs/runtime/DERIVED_RATIO.md` and D-014 runtime principles: keep what translates declared structure, strip what doesn't. Not attempted here — too large for a small complete commit.
2. **Label collision** — labels can overlap in dense regions; acceptable at current budgets (≤24 home, ≤15 focused) but untested on small screens.
3. **Home placement is hash-random within order rings** — order is readable, adjacency is not meaningful. A dependency-aware layout is a separate design question.
4. **Legibility floors are still hand-tuned coefficients**, the same class of fix as D-020C/D-021.4-R. A principled visibility contract (minimum perceptual floor as a tested invariant) does not yet exist.
5. Documentation follow-ups from FABLE-REPO-STATE-FINDING-2026-07-06: README/PROJECT_STATUS/CLOUDFLARE_SURFACE_MAP still describe the pre-D-021.5 site.

## Next recommended commission

**D-023 — Observatory render-layer audit against Derived Ratio.** Enumerate every remaining canvas layer (filaments, condensation, pressure grid, basins, wake, rhythm), map each to the structure → derived ratio → behaviour chain in `docs/runtime/DERIVED_RATIO.md`, keep layers with a demonstrated translation, remove the rest, and pin the surviving set with tests. This completes the "strip anything not doing specific ratio/order work" directive that D-022 began.

---

## Acceptance

| Criterion | Status |
|---|---|
| Visitor can select/enter a term and see its structure | **Pass** — suggestions + labels + existing sheet |
| Relation/order/carrying legible without noise | **Improved** — labels + legend + floors; full strip deferred to D-023 |
| No new theory invented | **Pass** — Theory quotes MISSION.md and stable Theory.md only |
| No Atlas edits, no D1 writes | **Pass** |
| Tests pass | **Pass** — 58/58 + member + MCP |
| Small complete commit | **Pass** — one worker file + one test file + this report + register entry |
