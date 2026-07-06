# O-006 — Read Engine Module Formalisation

**Programme:** Observatory  
**Type:** Implementation / refactor commission  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-013 (`docs/reports/P-013-read-engine-architecture.md`), P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`), O-003, O-005  
**Core rule:** Formalise reads as versioned resolver modules — not a new P-003 layer; appearance must not invent meaning.

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| Read catalogue + orchestration | **Done** — `read-engine.mjs` |
| Registered reads | **Done** — 5 reads + 1 meta-instrument |
| Source-of-truth rules | **Done** — `SOURCE_OF_TRUTH_RULES` + `docs/runtime/READ_ENGINE.md` |
| Shared weave mechanics | **Done** — `weave-state.mjs` (server/read path) |
| Ratio import cycle fix | **Done** — `ratio-register.mjs` |
| Behaviour trace integration | **Done** — `readEngine` bundle on API |
| Canvas visual behaviour | **Unchanged** |
| Tests | **110 passing** |
| Report | This document |

**Acceptance:** Reads are versioned resolver modules consumed by behaviour trace / Mechanics panel. Not a new invariant layer. No read paints canvas by default.

---

## 1. Module layout

| Module | Role | Layer |
|---|---|---|
| `read-engine.mjs` | `READ_CATALOGUE`, `resolveFocusReads`, rules | Read orchestration |
| `order-terminal.mjs` | R-OT | Read |
| `gathering-read.mjs` | R-SG | Read |
| `weave-read.mjs` | R-WM, R-FE | Read |
| `maturity-read.mjs` | R-MAT | Read |
| `weave-state.mjs` | Pair-weave aggregation | Mechanics substrate |
| `ratio-register.mjs` | L2 scalar expansion | Mechanics substrate |
| `thread-mechanics.mjs` | `resolveLeg` | Mechanics (L4) |
| `field-behaviour-trace.mjs` | R-BT meta-instrument | Imports `resolveFocusReads` |

---

## 2. READ_CATALOGUE

| Key | ID | Version | nonPainting |
|---|---|---|---|
| `order-terminal` | R-OT | `order-terminal.v1` | ✓ |
| `structural-gathering` | R-SG | `gathering.v1` | ✓ |
| `weave-leg` | R-WM | `weave-read.v1` | ✓ |
| `fabric-eligibility` | R-FE | `weave-read.v1` | ✓ |
| `maturity-settledness` | R-MAT | `maturity-read.v1` | ✓ |
| `behaviour-trace` | R-BT | `behaviour-trace.v1` | ✓ (meta-instrument) |

---

## 3. Resolver pattern

```text
resolveFocusReads({ focusId, focusState, statesById, neighbourhoodIds, thresholds })
  → {
      engine: "read-engine.v1",
      catalogue: [...],
      sourceOfTruthRules: [...],
      reads: { orderTerminal, structuralGathering, maturity, weaveSummary },
      // backward compatible:
      orderTerminal, gatheringRead, gatheringReadAnnotation,
    }
```

`/api/field/behaviour-trace` now includes `readEngine` object alongside legacy fields.

---

## 4. Source-of-truth rules (enforced in code)

Documented in `read-engine.mjs` header and `docs/runtime/READ_ENGINE.md`:

1. Structure canonical — reads never invent L1 edges  
2. Mechanics single path — weave via `weave-state.mjs` + `thread-mechanics.mjs`  
3. Read does not paint — default delivery API + Mechanics panel  
4. Appearance follows — `draw*` uses mechanics eligibility, not read status  
5. Overlay is context — `runtimeOverlay` does not define read truth  
6. No read scalar  
7. Version resolvers on criteria change  
8. Behaviour trace imports reads — no duplicated recognition logic  

---

## 5. Renderer / draw* discipline

| Change | Rationale |
|---|---|
| `gathering-read.mjs` uses `weave-state.mjs` | Read path shares mechanics substrate |
| `weave-read.mjs` uses `weave-state.mjs` | Weave summary read does not duplicate pair aggregation |
| Client `buildHomeWeaveState` | **Kept inline** with comment mirroring `weave-state.mjs` — inline browser script cannot ES-import modules without bundle commission |
| No read logic added to `draw*` | O-005/O-006 reads remain Mechanics/API only |

**Honest gap:** Client renderer weave build mirrors server `weave-state.mjs` until a client bundle step exists. Drift risk documented; tests lock read-path behaviour.

---

## 6. Import cycle fix

`gathering-read` → `field-behaviour-trace` → `read-engine` → `gathering-read` cycle broken by extracting `ratioModeForState` / `structuralMassForState` to `ratio-register.mjs`.

---

## 7. Tests

| File | Coverage |
|---|---|
| `test/read-engine.test.mjs` | Catalogue, nonPainting, rules, `resolveFocusReads`, API shape |
| `test/weave-state.test.mjs` | Shared weave aggregation |
| `test/field-states.test.mjs` | O-006 API `readEngine` bundle |
| Existing gathering / behaviour-trace tests | Backward compatibility |

---

## 8. Protected principle

> The Observatory does not paint meaning. It derives reads, then lets appearance follow.

All catalogue **reads** declare `nonPainting: true`. Fabric face (O-002) unchanged — appearance gated by mechanics `fabricEligible`, not gathering read status.

---

## References

| ID | Path |
|---|---|
| P-013 | `docs/reports/P-013-read-engine-architecture.md` |
| READ_ENGINE | `docs/runtime/READ_ENGINE.md` |
| O-005 | `docs/reports/O-005-gathering-read-annotation.md` |
| Code | `.atlas-publisher/read-engine.mjs` |

---

**Status:** O-006 complete. Read Engine formalised as module pattern — not P-003 layer.
