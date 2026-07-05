# D-010B — Generalise Ratio Mechanics

**Programme:** Structural Reading  
**Type:** Runtime generalisation  
**Date:** 2026-07-05  
**Precedent:** D-010A runtime audit  
**Scope:** Field relation rendering — ratio pipeline only

---

## Mission

Increase Field fidelity to the Atlas by extending the existing ratio pipeline to all grounded relation types. No new mechanics. No Atlas changes. No UI redesign.

---

## Investigation

### Shared ratio engine (already present)

Ratio is derived once per term from D1 structure:

| Stage | Function | Input |
|---|---|---|
| API | `fieldRatioMode(mass.carriers, thresholds)` | Holds/traces **in-degree** only |
| Client | `ratioModeForState(state)` | `transition`, `continuous`, `compression` scalars |
| Term lookup | `termRatioMode(op)` | Source term state |
| Profile | `computeProfile` | `continuation`, `structuralMass` |
| Compression | `relationCompressionLimit` | Visible edge budget |

Mass definition unchanged: pairs, nests, and carries **out-degree** do not increment carrier mass (`field-maturity.mjs`).

### Per-relation characterisation

| Relation | Existing runtime behaviour | Ratio inputs before D-010B | Unused hooks (stubbed) | Carry generalises? | Structural asymmetry justified? |
|---|---|---|---|---|---|
| **Holds** | Anchor rhythm; persistence basin; gravity profile | Source `ratioMode` available via API; **render used `discreteRatioMode()`** | `holdTransition`, `holdContinuous`, `holdConsequence`, modeDetail, strand/bead/alpha weights | **Yes** — same `termRatioMode(a)` source | **No** for ratio source — carrier mass is order-agnostic. **Yes** for application weights — pre-existing hold coefficients in render formulas |
| **Traces** | Return rhythm; intermittence; mass in-degree | Same stub | `traceTransition`, `traceContinuous`, `traceConsequence`, return bow | **Yes** | **No** for source (traces contribute to mass). **Yes** for trace-specific render weights |
| **Carries** | Outward rhythm; continuation profile; full ratio render | **Active** — reference implementation | None | N/A (baseline) | Application weights differ; source shared |
| **Pairs** | Lateral/reciprocal rhythm; resonance profile | Stub | `pairTransition`, `pairContinuous`, pair bow/answer | **Yes** | **No** for source. **Yes** for lateral application weights |
| **Nests** | Enclose rhythm; enclosure profile; containment bow | Stub | `nestTransition`, `nestContinuous`, nest cycle | **Yes** | **No** for source. **Yes** for enclose application weights |

### Finding

Generalisation is **safe and warranted**:

1. **One ratio source** — `termRatioMode(a)` on the relation **source term** was already correct for carries; D-010A confirmed infrastructure for all types existed with zero stubs.
2. **No new ratio definition** — mass still from holds/traces in-degree; no relation-type-specific mass rules added.
3. **Application asymmetry is pre-existing** — `drawCurrent` already applied different transition/continuous multipliers per relation type in filament width, alpha, strand count, bead radius, and modeDetail. Those are **relation behaviour** expressions, not separate ratio engines.
4. **Runtime contract preserved** — structure remains read-only from D1; client only interprets existing `ratioMode` on each term.

No bespoke term branches introduced. No Atlas edits required.

---

## Implementation

**File:** `.atlas-publisher/main-website-worker.js` — `drawCurrent()`

### Before

```javascript
const ratioMode = isCarry ? termRatioMode(a) : discreteRatioMode();
const holdTransition = 0;
const holdContinuous = 0;
// … all non-carry types stubbed to zero
```

### After

```javascript
const ratioMode = termRatioMode(a);
const ratioTransition = ratioMode.transition;
const ratioContinuous = ratioMode.continuous;
const carryTransition = isCarry ? ratioTransition : 0;
// … each active relation type receives the same source scalars
const holdConsequence = holdTransition * 0.28 + holdContinuous * 0.62;
// … consequence formulas aligned with existing modeDetail coefficients
```

### Removed

- `discreteRatioMode()` — dead after generalisation
- Carry-only guard on `termRatioMode(a)`
- Carry-only null in relation debug samples

### Unchanged

- `deriveFieldStatesPayload` / carrier mass definition
- `ratioModeForState`, `structuralMassForState`, `computeProfile`
- Relation type config (`relationTypes`), rhythm, Bézier geometry
- Per-type application weights in render formulas (pre-existing)

---

## Acceptance

| Criterion | Status |
|---|---|
| Removes code duplication | **Pass** — single ratio source; removed `discreteRatioMode` |
| Keeps one runtime | **Pass** — same `termRatioMode` → `ratioModeForState` pipeline |
| Backward compatible | **Pass** — carry path unchanged; terms with low carrier mass remain discrete |
| No Atlas changes | **Pass** |
| No new relation-specific special cases | **Pass** — activated existing hooks only |
| Ratio is relation behaviour, not carry-only | **Pass** |
| Runtime contract preserved | **Pass** |

---

## Test

`.atlas-publisher/test/field-states.test.mjs`:

- Asserts `const ratioMode = termRatioMode(a)` in embedded Field client
- Asserts `discreteRatioMode` and carry-only guard absent

---

## Observation

After D-010B, a term with high holds/traces in-degree (e.g. `first.carry` with mass 2, continuous mode) will express ratio through **all** outgoing relation filaments when focused — not only through `carries` edges. Terms with zero carrier mass (e.g. `third.not-carrier`) remain discrete across all relation types, consistent with D1 structure.

Ratio mass asymmetry (holds/traces in-degree only; pairs/nests/carries out-degree excluded) is **structurally justified** by existing `structureCarriesEntry` and tests — not altered in this commission.

---

**Status:** D-010B complete. Ratio generalised across holds, traces, carries, pairs, and nests through the shared term ratio engine.
