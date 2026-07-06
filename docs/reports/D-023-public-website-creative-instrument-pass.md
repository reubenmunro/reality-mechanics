# D-023 — Public Website Creative Instrument Pass

**Programme:** Public Structure
**Type:** Creative public-surface pass (commissioned with creative authority)
**Date:** 2026-07-06 (UTC+12)
**Base:** `main` @ `4d7388c` (D-022)

---

## Creative diagnosis

The four pages already shared a competent visual language (void / ember / parchment, one serif). The failure was compositional: nothing composed into an instrument.

1. **Observatory geometry carried no structure.** Term placement was hash-random within order rings — the field's shape meant nothing, and relation strands criss-crossed arbitrarily. An instrument's geometry should be the reading.
2. **The cursor got no read.** `hoverId` was tracked on every pointermove and never rendered.
3. **The instrument never declared what it was reading.** No term count, no Atlas version, no statement that the surface is a generated read-model.
4. **The strands were never named.** Five relation types render in distinct colours and behaviours (holds taut, traces branching, carries bowed, pairs lateral, nests enclosing) with no visible name.
5. **Theory was correct but flat** — the basic claim had no typographic authority.
6. **Proof understated its own evidence** — "Production deployment / D1-sync not yet file-verified" had been false since D-003/D-004/D-019 — and the retrace pathway was described but never shown.
7. **Pulse never declared its strongest property** — mechanical runtime, no AI, no Atlas mutation.

A deliberate non-move: the pressure/basin/wake runtime machinery was **kept**. It feeds the documented D-012 behaviour-trace instrument and the D-014/D-015 structure → derived ratio → behaviour chain — it is traceable runtime translation, not decoration. (Smoke and wrinkles, which translated nothing, were already removed in D-022.)

## Design decisions and structural grounding

| Decision | Grounding |
|---|---|
| **Dependency-bearing placement** — a term's angle is the circular mean of the bearings of its declared relation targets in earlier orders (+ deterministic jitter); radius remains the order ring. Dependency families now align along radial corridors from ground outward; the whole-field shape *is* the dependency structure. | Position derives from declared `holds/traces/carries/pairs/nests` only — Runtime Principle 1 (runtime translates, never invents) and 2 (declared relations). Deterministic; fallback for terms with no placed dependency is the previous hash angle. |
| **Hover probe** — sweeping the field surfaces the term name under the cursor in both whole-field and focused reads; cursor becomes a pointer over places. | "Terms are places"; language positions participation (Common Term Structure). Reads existing `hoverId`; adds no new state. |
| **Field status readout** — bottom-right: `N terms · M orders · atlas <version> · generated read-model`. | Honesty instrument: displays exactly which generated Atlas read-model is live (D1 `garden_config.atlas_version`), making read-model lag publicly visible instead of hidden (D-013 lag-explicitness). |
| **Relation legend** — the five relation types listed under the order legend in the renderer's exact colours. | Names come from the Atlas relation grammar; colours are read from `relationTypes`, not restyled — the legend reads the field. |
| **Landing postulate** — orientation opens with *Relation holds. Order carries. Trace places.* and states "every point is an Atlas term; every strand a declared relation." | `Reality_Mechanics/Theory.md` v0.6 (stable, published). |
| **Theory recomposition** — h1 becomes the claim ("Reality already carries order."), postulate as attributed centerpiece, one Constitution quotation ("independently reviewable / independently retraceable"), three-surface instrument cards. | `MISSION.md`, `Theory.md`, `docs/CONSTITUTION.md` (Constitutional Aim). Quotations sparse and attributed. |
| **Proof pathway** — visible four-step retrace strip: Claim → Source → Method → Record, each linking to the Atlas tree, `STEWARDSHIP_V1.md`, and `docs/reports/`. | Constitution (retraceability standard); Stewardship V1 ("burden of proof sits on every proposed change"). |
| **Proof humility block** — "What this does not claim": no invention of structure, no calculus promotion, prose answers to structure, no presumed soundness. | `MISSION.md`; commissions register (operator unaccepted, candidate not minimal); Stewardship Governing Rule. |
| **Proof correction** — stale bullet "Production deployment / D1-sync not yet file-verified" replaced with the genuinely open item: "D1 schema and non-entries recovery path uncharacterised (commission C005, open)"; evidence list gains `REPOSITORY_VERIFICATION.md`. | Verification completed in D-003/D-004/D-019; C005 open in `docs/practice/COMMISSIONS.md`. The website no longer under-claims its own evidence. |
| **Pulse honest readout** — "Mechanical runtime · no AI · no Atlas mutation · live health · instrument contract"; intro line "The Observatory shows structure; Pulse shows what structure does under time." | `member/wrangler.toml` (no AI/D1/KV), `/api/health` payload, D-021.4 instrument contract, D-021.3 Pulse identity. |
| **Route canonicalisation** — all nav Proof links point to `/proof` (the `/submission` alias remains served). | D-021.5 route set unchanged; naming coherence only. |

## Files changed

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | `buildHomeAngles()` dependency-bearing placement; hover probe rendering + cursor; `#field-status` readout; relation legend; landing postulate; Theory recomposition; Proof pathway, humility block, C005 correction; nav → `/proof` |
| `member/src/index.js` | Runtime readout line; intro time-framing sentence; nav → `/proof` |
| `.atlas-publisher/test/field-states.test.mjs` | 6 new D-023 tests; nav assertions updated to `/proof`; one D-022 phrase assertion updated to recomposed cite |
| `member/test/invariants.test.mjs` | 1 new D-023 test; nav assertion updated |
| `docs/reports/D-023-public-website-creative-instrument-pass.md` | This report |
| `docs/practice/COMMISSIONS.md` | Register entry |

**Not changed:** Atlas source, D1, MCP worker, `/api/*` contracts, behaviour-trace machinery, 410 route set.

## Routes affected

`/`, `/field` (placement, probe, readout, legend, landing), `/theory` (recomposition), `/proof` + `/submission` (recomposition; nav now names `/proof`), `calibration.realitymechanics.nz/` (readout, copy). No routes added or removed.

## Tests run

| Suite | Result |
|---|---|
| `npm --prefix .atlas-publisher test` | **64/64 pass** (58 + 6 new) |
| `npm --prefix member test` | **Pass** — 16 assertions (15 + 1 new) |
| `npm --prefix reality-mechanics-mcp test` | **Pass** — 27 assertions |
| `node --check` both workers | Pass |

## What improved

The site now behaves like one instrument: the field's geometry carries the dependency structure it renders; the cursor reads places; the instrument declares its own reading and its read-model version; every strand and ring is named; Theory gives the basic claim typographic authority with two attributed quotations; Proof shows the retrace pathway it previously only described, makes humility explicit, and no longer misstates its own verification status; Pulse declares its honest mechanical character.

## What remains unresolved

1. **Dependency-bearing placement is first-generation** — circular-mean bearings can crowd where many terms share dependencies; no collision relaxation pass yet. Visual quality on very dense orders untested against real data (only verifiable on the live field).
2. **The pressure/basin/wake machinery still awaits its layer-by-layer audit** against `DERIVED_RATIO.md` (the original D-023 recommendation from the D-022 report — deferred again here in favour of the perceptual pass; renumber as D-024 candidate).
3. **Focused-read layout** still uses the older relation-ring geometry; it does not yet inherit the dependency-bearing idea.
4. **Typography is unified by convention, not by shared template** — the four pages repeat their CSS; a shared design constant block would prevent drift.
5. Documentation follow-ups from FABLE-REPO-STATE-FINDING-2026-07-06 remain (README/PROJECT_STATUS/CLOUDFLARE_SURFACE_MAP).

## Next recommended commission

**D-024 — Live field verification + render-layer audit.** First, verify dependency-bearing placement against the real 490-term field after deploy (crowding, corridor legibility, label overlap on small screens), tuning jitter/spread from observation. Second, complete the deferred layer-by-layer audit of pressure/basins/wake/condensation against `docs/runtime/DERIVED_RATIO.md`, keeping layers with demonstrated structural translation and stripping the rest, with tests pinning the surviving set.

---

## Acceptance

| Criterion | Status |
|---|---|
| Feels like one instrument, not a debug surface with labels | **Pass** — geometry, probe, readout, legend, landing compose |
| Order / relation / carrying perceivable | **Pass** — placement by declared bearings; named strands; named rings |
| Theory clean, clear, sparing canonical quotation | **Pass** — two attributed quotes |
| Proof separates accepted/candidate/unresolved/evidence; humility visible | **Pass** — pathway + "does not claim" + corrected status |
| Pulse distinct temporal MVP | **Pass** — honest readout; time-framing |
| No new theory; every claim traceable | **Pass** — grounding table above |
| Tests pass | **Pass** — 64/64 + 16 + 27 |
