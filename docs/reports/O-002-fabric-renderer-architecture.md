# O-002 — Fabric Renderer Architecture

> **Supersession (M-003):** Fabric gating and weave-mode rules remain valid evidence. **Live renderer order and client activation** superseded by **O-008**. See [`O-008-observatory-renderer-reconstruction.md`](O-008-observatory-renderer-reconstruction.md).

**Programme:** Observatory  
**Type:** Architecture commission (smallest coherent fabric/weave step)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-008, O-001  
**Core rule:** Do not render Fabric unless carrying and tracing remain mutually available on declared connections under ratio-readable constraint.

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| Renderer diagnosis | **Done** — §1 |
| Membrane → fabric language | **Done** — renamed functions and copy |
| Weave state model | **Done** — `buildHomeWeaveState`, `homeConnectionWeaveMode` |
| Fabric gating | **Done** — lattice deposits only on thread/web + ratio-readable terms |
| Drift / archive edge reads | **Done** — dashed styling on carry-only / trace-only pairs |
| Tests | **76 passing** (atlas-publisher) |
| Report | This document |

**Acceptance:** Home renderer no longer paints a generic pressure membrane over all terms. It renders **declared weave behaviour**: forward carry, backward trace, thread (carry+trace), web crossings (pairs/nests on thread pairs), fabric face (gated lattice), drift risk, and archive mode.

---

## 1. Diagnosis — what O-001 still did (pre O-002)

| Behaviour | Problem vs P-008 |
|---|---|
| `drawHomeMembrane` over full grid | Generic field — fabric appeared without carry∧trace test |
| `buildHomePressureField` on all terms | Proximity/mass deposition without thread network |
| Relation midpoints on all edge types | Holds/pairs without weave eligibility contributed to fabric |
| `drawHomeRelationCurrent` uniform stroke | No drift vs archive distinction |
| `buildHomeConnections` omitted `nests` | Web crossings incomplete |
| Landing copy “field reads” | Membrane-era vocabulary |

Focused mode (`drawCurrent`) unchanged in this pass — smallest step targets **home / neutral whole-field** renderer only.

---

## 2. Implemented fabric model

### 2.1 Weave state (declared connections only)

```text
buildHomeConnections()  →  homeConnections[]
buildHomeWeaveState()   →  homePairWeave Map, homeThreadTermIds Set
```

Per unordered term pair:

| Flag | Meaning |
|---|---|
| `carries` | Forward edge declared |
| `traces` | Backward edge declared |
| `pairs` / `nests` | Crossing edges declared |
| `carries ∧ traces` | **Thread** — pair enters `homeThreadTermIds` |

**No proximity graph.** Undeclared adjacency does not enter weave state.

### 2.2 Connection weave modes

| Mode | Condition | Render read |
|---|---|---|
| `thread_forward` | `carries` + pair has `traces` | Forward continuation (solid) |
| `thread_return` | `traces` + pair has `carries` | Backward recoverability (solid, finer) |
| `drift` | `carries` only | Dashed, warm tint — drift risk |
| `archive` | `traces` only | Dashed, muted — record mode |
| `web_crossing` | `pairs`/`nests` on thread pair | Emphasised crossing (web) |
| `crossing_unwoven` | pairs/nests without thread | Reduced alpha |

### 2.3 Fabric face gating

`buildHomePressureField` deposits lattice strength **only when**:

1. Term is in `homeThreadTermIds`, **and** `ratioReadableProfile` (`structuralMass ≥ fabricMassMin`), **or**
2. Connection is `fabricEligibleConnection` (`thread_*` or `web_crossing`)

`drawHomeFabricFace` paints **only if** `homeThreadTermIds.size > 0`.

**Render order:**

```text
buildHomePressureField()
  → drawHomeRelationCurrent()   // thread, web, drift, archive edges
  → drawHomeFabricFace()        // fabric face where lattice coheres
  → drawHomeCondensation()      // terms in thread network + mass threshold
```

### 2.4 Renames (membrane → fabric)

| O-001 | O-002 |
|---|---|
| `drawHomeMembrane` | `drawHomeFabricFace` |
| `drawHomeMembraneFlow` | `drawHomeFabricWeaveCurrents` |
| “deforms the membrane” comment | “fabric lattice” comment |

`membraneEdge` remains in API exclusions (planned boundary read — not implemented).

---

## 3. Ratio-readable constraint

| Constant | Value | Role |
|---|---|---|
| `HOME_PRESSURE_GRID.fabricMassMin` | `0.12` | Minimum mass for fabric lattice deposition |
| `HOME_PRESSURE_GRID.condenseThreshold` | `0.24` | Term condensation (unchanged) |

Uses existing `structuralMass` / `mass.carriers` derived register (L2) — no new maths.

---

## 4. Protected principle — implementation mapping

| Principle | Implementation |
|---|---|
| Carry without trace drifts | `weaveMode === 'drift'` — dashed carry edges |
| Trace without carry archives | `weaveMode === 'archive'` — dashed trace edges |
| Fabric requires both | `homeThreadTermIds` + `drawHomeFabricFace` gate |
| No undeclared fabric | `buildHomeWeaveState` uses declared `homeConnections` only |

---

## 5. What remains (out of scope)

| Item | Notes |
|---|---|
| Focused mode `drawCurrent` weave modes | Home pass only |
| Unified world/home fabric lattice | Still dual grids |
| `membraneEdge` / fabric boundary | Excluded from contract |
| Ark Run / drift overlay labels in UI | Edge styling only |
| Availability / permeability ratios | Unresolved (P-005) |

---

## 6. Files changed

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | Weave state, fabric gating, renames, drift/archive/web styling, nests in connections, landing copy |
| `.atlas-publisher/test/field-states.test.mjs` | O-001/O-002/D-021.2/D-023 test updates |

---

## 7. Tests

| Test | Asserts |
|---|---|
| O-001 (updated) | `drawHomeFabricFace`, weave landing copy |
| O-002 (new) | `buildHomeWeaveState`, `homeConnectionWeaveMode`, drift/archive/thread/web modes, no `drawHomeMembrane` |
| D-021.2 / D-023 | Updated landing orientation strings |

---

## 8. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-008 | **Met** |
| No generic membrane field on undeclared proximity | **Met** |
| carries → forward, traces → backward reads | **Met** |
| Thread = carry ∧ trace on pair | **Met** |
| Fabric gated on thread + ratio | **Met** |
| Web = pairs/nests on thread pairs | **Met** |
| Drift / archive modes | **Met** |
| Tests preserved + extended | **Met** — 76/76 |
| No Atlas/D1/public surface edits | **Met** |

---

## References

| ID | Path |
|---|---|
| O-001 | `docs/reports/O-001-observatory-field-renderer-architecture.md` |
| P-008 | `docs/reports/P-008-carry-trace-weaving-investigation.md` |
| P-006 | `docs/reports/P-006-weaving-operation-investigation.md` |
| P-005 | `docs/reports/P-005-weave-fabric-investigation.md` |
| Code | `.atlas-publisher/main-website-worker.js` |

---

**Status:** O-002 complete. Observatory home renderer begins **weave behaviour** — not a generic field.
