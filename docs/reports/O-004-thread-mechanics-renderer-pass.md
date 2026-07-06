# O-004 — Thread Mechanics Renderer Pass

**Programme:** Observatory  
**Type:** Implementation commission  
**Date:** 2026-07-07 (UTC+12)  
**Governing contract:** P-011 Thread Mechanics Specification §3 (`docs/reports/P-011-thread-mechanics-investigation.md`)  
**Core rule:** Appearance follows `resolveLeg`. Appearance does not define mechanics.

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| TMS resolver module | **Done** — `.atlas-publisher/thread-mechanics.mjs` |
| Home connection draw | **Aligned** — `resolveHomeLeg` → `legStrokeAppearance` |
| Focused `drawCurrent` | **Partial align** — TMS dash/width/cadence/bow; overlay rhythms retained |
| O-002 weave model | **Preserved** — `buildHomeWeaveState`, fabric gating unchanged |
| Tests | **92 passing** |
| Report | This document |

**Acceptance:** Visible home connections trace through `resolveLeg`. Focused carries/traces legs show drift/archive dashes when pair flags require. Parallel overlay resolvers (compression, frame, traversal, `relationRhythm`) remain explicit.

---

## 1. Diagnosis — TMS bypasses (pre O-004)

| Location | Bypass | Layer |
|---|---|---|
| `homeConnectionWeaveMode` | Inline weave rules duplicated in worker | L4 |
| `drawHomeRelationCurrent` | Ad-hoc dash/width/alpha from `weaveMode` switch | L6 |
| `drawCurrent` | Inline `ratioConsequence` coefficients | L4 |
| `drawCurrent` | No drift/archive dash on focused legs | L6 gap |
| `relationRhythm` | Profile/gradient/movement blend | L5 overlay (kept) |
| `relationCompressionLimit` | Focus fanout | L4 overlay (kept) |
| `relationSensibility` | Frame membership | cross-cut (kept) |

---

## 2. Implementation

### 2.1 `thread-mechanics.mjs` (TMS v1)

Exports:

| Function | Role |
|---|---|
| `buildPairStateFromOps` | L1 pair flags from two terms |
| `weaveModeForLeg` | P-011 §3.2 |
| `ratioConsequence` | P-011 §3.3 type weights |
| `endpointRatioFromFieldState` | L2 from D1 state |
| `resolveLeg` | L4 mechanical output |
| `legStrokeAppearance` | L6 home stroke mapping |
| `legFocusedAppearance` | L6 focused width/dash/cadence |
| `fabricEligibleWeaveMode` | O-002 fabric gate |

### 2.2 Pipeline (implemented)

```text
L1 edge + pair flags
  → endpoint L2 (endpointRatioFromFieldState)
  → ratioConsequence(type)
  → resolveLeg
  → legStrokeAppearance / legFocusedAppearance
  → L6 canvas stroke
```

### 2.3 Home renderer

- `resolveHomeLeg(conn)` — pair state from `homePairWeave` + endpoint ratios
- `drawHomeRelationCurrent` — bow from `leg.pathCurvature`; stroke from `legStrokeAppearance`
- `fabricEligibleConnection` — uses `fabricEligibleWeaveMode`

### 2.4 Focused renderer (safe alignment)

`drawCurrent` now:

- Builds `pairState` via `buildPairStateFromOps(a, b)`
- Resolves `tmsLeg` + `tmsAppear`
- Applies **drift/archive dash** on carries/traces legs
- Scales **line width** via `filamentWeight` / `widthScale`
- Uses **TMS ratioConsequence** per active leg type
- Uses **pathCurvature** for bow base on forward legs

**Still overlay/heuristic (explicitly separate):**

- `relationRhythm` + `relationRhythmExpression` — pressure/movement blend
- `fieldBend` from pressure grid
- `traversalEmphasis`, `movementRatioSignature`
- `relationSensibility` frame dimming
- Filament strands, beads, fire crossing glow

---

## 3. Connection appearance map

| weaveMode | Home L6 | Focused L6 |
|---|---|---|
| `drift` | dashed [4,5], warm tint | dashed [4,5] |
| `archive` | dashed [2,6], muted | dashed [2,6] |
| `thread_forward` | solid, full alpha | solid |
| `thread_return` | solid, full alpha | solid |
| `web_crossing` | solid, boosted | (via pair/nest leg resolver) |
| `crossing_unwoven` | reduced alpha | unchanged overlay |

---

## 4. What was not changed

- No Atlas / D1 edits
- No new ratios or primitives
- No public surfaces
- Fabric face / pressure grid algorithms (O-002)
- Term condensation, layout rings, compression halo
- Full removal of `relationRhythm` (emergent overlay per D-015B)

---

## 5. Tests

| File | Coverage |
|---|---|
| `test/thread-mechanics.test.mjs` | TMS rules, resolveLeg, appearance mapping |
| `test/field-states.test.mjs` | O-004 HTML contract; O-002 updated for module split |

---

## 6. Retrace guide

For any visible connection, ask:

1. **Pair flags?** `carryAvail`, `traceAvail` → `weaveMode`
2. **Endpoint L2?** `structuralMass`, `ratioMode` on source
3. **L4 leg?** `resolveLeg` output (`filamentWeight`, `pathCurvature`, `cadence`)
4. **L6 stroke?** `legStrokeAppearance` / `legFocusedAppearance`
5. **Overlay?** frame sensibility, compression, traversal, rhythm — separate

If step 4 cannot be cited → mark **heuristic overlay** (not TMS violation if documented).

---

## References

| ID | Path |
|---|---|
| P-011 | `docs/reports/P-011-thread-mechanics-investigation.md` |
| O-002 | `docs/reports/O-002-fabric-renderer-architecture.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| Code | `.atlas-publisher/thread-mechanics.mjs`, `main-website-worker.js` |

---

**Status:** O-004 complete. Threads are legs; mechanical threads require carry∧trace; appearance follows `resolveLeg`.
