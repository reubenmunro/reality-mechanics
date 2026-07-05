# D-020C — Initial Render Investigation

**Programme:** Observatory  
**Type:** Investigation only (no fix)  
**Date:** 2026-07-05 (UTC+12)  
**Context:** After D-020A/B deploy, Observatory panel is correct. Field canvas appears almost empty on initial page load; hit-testing and term interaction still work.

---

## Observation

| Symptom | Detail |
|---|---|
| Initial load | Field canvas appears almost empty |
| Data present | Hit-testing works; terms respond to clicks |
| After interaction | Field becomes visibly populated |
| Panel | D-020A compressed panel unaffected |

This points to a **rendering/state** issue, not missing `/api/field/states` data.

---

## Investigation method

Static trace of `.atlas-publisher/main-website-worker.js` client render loop:

- `bootstrap()` → first `focusId` → `initOperations()` / `layout()` → `requestAnimationFrame(loop)`
- `step(dt)` state updates
- `draw()` → `drawHomeField` / `drawCurrent` / `drawOperation`
- D-020B diff vs pre-D-020 (`ac33c59`) for amplification wiring

No coefficient tuning. No code changes.

---

## Initial state at first `requestAnimationFrame` (after bootstrap)

Default entry: hash term, else **Relation**, else first state id (`bootstrap()` ~L2801–2816).

| Variable | Initial value | Role |
|---|---|---|
| `focusId` | Set (e.g. `first.relation`) | Focus term selected before loop starts |
| `homeMode` | `false` | Bootstrap sets focused view, not static home |
| `homeAlpha` | `1.0` | Decays at `dt * 3.5` while `homeMode` is false |
| `currentFieldReferenceFrame` | `null` | Bootstrap does **not** call `setCurrentFieldReferenceFrame()` |
| `frameTransitionPulse` | `0` | Only set when reference frame toggles |
| `coupledSensibility` | All ids → `1` | No out-of-frame fade without active frame |
| `settled` | `0` | Bootstrap never primes; `enterOperation()` resets to `0` |
| `fieldPressure` | **High for default hub terms** (~0.93 for Relation-scale mass + neighbourhood) | Drives condensation mode |
| `endpointOnly` | **`true` for all non-focus nodes** when `fieldPressure > 0.38` | Collapses neighbours to endpoint cores |
| `op.x` / `op.y` | Spiral defaults from `initOperations()` | `layout()` updates `tx`/`ty` only — positions lag until `step()` converges |

### Reference frame / sensibility (initial)

With `currentFieldReferenceFrame === null`:

- `coupledSensibilityTarget(id)` → `1` for all ids
- `sensibilityAlpha(id)` → `1`
- `relationSensibility(a, b)` → `1`

D-020B coupling fade (`outOfFrameTarget: 0.04`) does **not** apply on initial load. No initial visibility regression from coupling.

---

## Variable comparison: before first click vs after

### Scenario A — Default load (Relation / large hub), no navigation

| Variable | Before first interaction | After ~1.8s (no click) | After click same term (sheet toggle) |
|---|---|---|---|
| `settled` | `0` | → `1.8` | unchanged |
| `settleRamp` (non-focus, non-endpoint path) | `0.12` | → `1.0` | unchanged |
| `fieldPressure` | ~`0.93` | ~`0.93` | unchanged |
| `endpointOnly` | `true` | `true` | unchanged |
| Node alpha (neighbours) | Endpoint-only (~0.06 core) | Same | Same |
| `homeAlpha` | `1.0` → decays | → `~0` | unchanged |
| Home underlay alpha | `~1.0` (D-020B `frameTransitionUnderlayAlpha`) | → `~0` | unchanged |
| Relation strand count (continuous mode) | Reduced by D-020B `strandScale: 0.52` | Same | Same |
| `op.x/y` vs `tx/ty` | Mismatch | Converging | unchanged |

For default hub focus, **neighbour visibility does not improve via `settled`** because `endpointOnly` bypasses the `settleRamp` path entirely (`drawOperation` early return at L2334–2373).

Gradual improvement without navigation comes mainly from:

1. **`homeAlpha` decay** — home underlay fades over ~0.3s  
2. **`op.x/y` convergence** — nodes and relation endpoints move toward layout ring over ~1–2s  

### Scenario B — First click navigates to a different term (typical canvas interaction)

| Variable | Before | After `enterOperation(otherId)` |
|---|---|---|
| `focusId` | Hub (e.g. Relation) | Smaller / peripheral term |
| `fieldPressure` | ~`0.93` | Often **`< 0.38`** (e.g. 0.14–0.35) |
| `endpointOnly` | `true` (all neighbours) | **`false`** |
| Node alpha path | Endpoint cores only | Full condensation + `settleRamp` |
| `settled` | `0` or rising | **Reset to `0`** |
| `settleRamp` | N/A (endpoint path) | `0.12` initially, then rises |
| `frameTransitionPulse` | `0` | `1` if structural frame term clicked |
| `coupledSensibility` | All `1` | Frame-dependent if structural frame activated |

**Largest single state change:** `fieldPressure` crossing **0.38** toggles `endpointOnly`, switching neighbour rendering from near-invisible endpoint cores to full node condensation. This matches “almost empty → populated” when the first interaction selects a lower-pressure term.

### Scenario C — Pan / wheel before click

| Variable | Effect |
|---|---|
| `settled` | Wheel/pinch sets `max(0.2, settled - δ)` — floor still below `settleRamp` inflection (~0.22) |
| `fieldPressure` | Unchanged |
| `endpointOnly` | Unchanged |
| `homeAlpha` | Continues decay |

Pan alone does not materially change alpha drivers.

---

## Per-channel alpha at initial load (Relation default)

| Channel | Initial behaviour | Notes |
|---|---|---|
| **Node alpha (focus)** | Visible — `settleRamp = 1`, full condensation path | Focus ember should render |
| **Node alpha (neighbours)** | **Near-invisible** — `endpointOnly = true`, core alpha ~0.06–0.18 | `settleRamp` not applied |
| **Relation alpha** | Present but sparse — broad/core strokes + filaments | D-020B cuts continuous `strandScale` to **0.52** (~half filaments vs pre-D-020) |
| **Frame alpha (home underlay)** | **`homeAlpha = 1.0`** — full static home graph under focused view | Fades in ~0.3s |
| **`coupledSensibility`** | All **1** | No frame fade on load |
| **`fieldPressure`** | **~0.93** | Forces endpoint-only neighbours |
| **Condensation alpha (focus)** | Normal — `amplifiedCondensationFocus` applies | D-020B increases pulse depth, not zero |

---

## Did D-020B introduce an initial visibility regression?

| D-020B change | Initial-load effect | Verdict |
|---|---|---|
| `couplingSensibilityTarget` / `outOfFrameTarget: 0.04` | Inactive until reference frame set | **Not initial cause** |
| `frameTransitionUnderlayAlpha` | Home underlay alpha ≈ pre-D-020 on load (`homeAlpha = 1`) | **Neutral** |
| `ratioVisualScale` continuous `strandScale: 0.52` | Fewer relation filaments for hub terms | **Contributes to sparsity**, not empty-to-visible transition |
| `endpointContrast: 1.28` | Slightly larger endpoint cores when `endpointOnly` | **Minor**; pre-D-020 already had endpoint-only mode |
| `sensibilityLerp: 4.2` | Only when frame active | **Not initial cause** |

**Conclusion:** The empty initial appearance is **not primarily a new D-020B coefficient bug**. It follows existing runtime rules:

1. Default bootstrap focus selects a **high-mass hub** (Relation).  
2. `focusedFieldPressure()` exceeds **0.38** → **`endpointOnly`** suppresses neighbour nodes.  
3. D-020B **amplifies sparsity** (fewer continuous strands) but the dominant mechanism is **`fieldPressure` → `endpointOnly`**, which predates D-020B.

D-020A (panel compression) does not touch canvas render paths.

---

## Root cause (identified)

The field is not missing data. On initial load it renders in **high field-pressure condensation mode**:

```text
fieldPressure > 0.38
  → operationAmbientBudget.endpointOnly = true (non-focus nodes)
  → drawOperation early-return: endpoint cores only (~6% alpha)
  → neighbourhood appears absent
```

Default bootstrap focus (Relation or similar hub) produces `fieldPressure ≈ 0.93` with typical neighbourhood counts.

---

## Which variable change makes the field become visible?

**Primary (term navigation):** **`fieldPressure` falling below 0.38**, which disables **`endpointOnly`** and restores full node condensation rendering.

**Secondary (time, same focus):** **`homeAlpha`** decay (removes competing home underlay) and **`op.x/op.y`** convergence to layout targets (relations draw between correct positions).

**Not primary on hub focus:** **`settled` / `settleRamp`** — ineffective while `endpointOnly` is true; resetting to `0` on `enterOperation()` would not improve hub view.

**D-020B contribution to perceived emptiness:** Continuous-mode **`ratioVisual.strandScale`** (0.52) reduces relation filament density; does not explain empty-to-populated transition on term change.

---

## Recommended next step (out of scope for D-020C)

Do not tune coefficients yet. A fix commission should decide whether:

- Bootstrap should prime `settled` and/or avoid hub default when `fieldPressure` forces endpoint-only, or  
- Initial render should use a lower effective `fieldPressure` until first deliberate navigation, or  
- Endpoint-only threshold should not apply on first paint.

---

## Commission closure

**Status:** D-020C investigation complete. Cause identified; no code changes.

**Commission D-020C closed** (investigation).
