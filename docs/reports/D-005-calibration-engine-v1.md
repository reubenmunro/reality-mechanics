# D-005 — Calibration Engine v1

**Programme:** Calibration  
**Type:** Calibration Engine v1  
**Date:** 2026-07-05

---

## Objective

Build the first repeatable Calibration Engine demonstrating how Reality Mechanics uncovers structure by testing whether a term can advance while preserving retrace.

No Calculus promotion. No Atlas auto-edits. No new theory. Existing Calibration strain pass preserved; engine **extends** the page.

---

## Core model (labels only — not promoted Calculus)

| Role | Function in engine |
|---|---|
| **Order** | read / map / retrace / preserve |
| **Ark** | test / perturb / carry / restore / observe |
| **Steward** | accept / reject / defer |

Forest metaphor:

- **Forward** — new trajectory (perturb step)
- **Backward** — ancestry (retrace step)
- **Healthy** — progress remains retraceable
- **Drift** — progress without retrace
- **Stasis** — retrace without discovery

---

## Implementation

| File | Change |
|---|---|
| `member/src/calibration-engine.mjs` | **New** — repeatable engine: load, ancestry, retrace, perturb, observe, restore, characterise; Maintained Coupling post D-004 slice |
| `member/src/index.js` | **Extended** — Calibration Engine v1 UI (forest walk), `GET /api/calibration/engine` |
| `member/test/calibration-engine.test.mjs` | **New** — engine unit tests |
| `member/test/invariants.test.mjs` | Updated for engine v1 invariants |
| `member/package.json` | Test script includes engine module checks |

Replaced the earlier D-002 bounded term-test section with Engine v1 (same page extended; strain pass unchanged).

---

## Demo: Maintained Coupling

**Term:** Maintained Coupling (`third.maintained-coupling`)  
**Data:** Post D-004 synchronised read-model — `needs` / `holds` / `traces` include **Compatibility**  
**Perturbation:** Simulate removing **Compatibility** from needs (read-model only)

Engine steps (8):

1. Load  
2. Ancestry (needs, holds, traces, pairs)  
3. Retrace  
4. Perturb  
5. Observe  
6. Restore  
7. Characterise  
8. Steward (accept / reject / defer — records intent only)

Public UI: **Walk the forest** animates steps; Observation / Evidence / Recommendation appear at end; steward buttons enabled after run.

API:

```http
GET /api/calibration/engine
GET /api/calibration/engine?term=Maintained%20Coupling&perturb=Compatibility
```

---

## Tests run

| Suite | Result |
|---|---|
| `npm --prefix member test` | **16/16** invariants + engine assertions |
| `npm --prefix .atlas-publisher test` | **25/25** pass |
| `npm --prefix reality-mechanics-mcp test` | **27/27** pass |
| `wrangler deploy --dry-run` (member) | Bundle builds |

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Existing tests pass | Pass |
| Calibration page builds | Pass |
| Demo runs without changing Atlas source | Pass — read-model perturbation only |
| Maintained Coupling shows synchronised data (Compatibility) | Pass |
| Observation / Evidence / Recommendation separated | Pass |
| No Calculus claim promoted | Pass — roles labelled; no `:` calculus notation |
| Steward decision explicit | Pass — steward step + buttons; no authority transfer |

---

## Outstanding / next

- Engine read-model slice is local to Calibration (not live Field fetch) — keeps Calibration standalone per invariants.
- Additional terms can be added to `ENGINE_TERMS` without UI rewrite.
- Optional: wire steward intent to practice governance (out of scope).

**Recommended next commission:** Expand engine term catalogue from Field `/api/field/states` with opt-in fetch, or D-005A — atlas-doctor / sync automation from D-004 backlog.

---

**Status:** D-005 delivered. Calibration Engine v1 live in worker code; deploy to `calibration.realitymechanics.nz` via existing CI on push to `member/**`.
