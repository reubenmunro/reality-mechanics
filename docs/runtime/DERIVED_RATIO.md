# Derived Ratio

**Runtime design document.** Commission D-015A — observational only. Updated per D-015B falsification.

**Mission:** Increase structural perception.

**Status:** Descriptive. Not authoritative. Not Calculus. Not implementation. **Not promoted theory.**

**Falsification:** [`docs/reports/D-015B-derived-ratio-falsification.md`](../reports/D-015B-derived-ratio-falsification.md) — **viable with constraints**

**Purpose:** Characterise whether **Derived Ratio** is a bridge between Atlas structure and observable runtime behaviour — without introducing additional mechanics.

**Required evidence:** D-014, D-010B, D-011, D-012, D-015B  
**Related:** [`docs/practice/RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md)

---

## Classification (D-015B)

**Derived Ratio: viable with constraints.**

The scalar derived ratio bridge is **mechanical, retraceable, and live** on the Field surface. It is **not** a complete account of Atlas Ratio, full Field behaviour, or a rich structural signature. See D-015B for falsification detail.

---

## Primary label

Use **scalar derived ratio** or **scalar pipeline with client expansion** — not "ratio signature" as the primary name for the derivation rule.

| Term | Meaning |
|---|---|
| **Scalar derived ratio** | `mass.carriers` + `ratioMode` from holds/traces in-degree (server) |
| **Scalar pipeline with client expansion** | Server scalar → client `transition` / `continuous` / `compression` → `structuralMass` |
| **Structural signature** | **Future unknown / possible richer read** — `relations.*`, order, frame as parallel structure reads; **not** current ratio derivation |

---

## Mass rule (current runtime)

**`mass.carriers` is derived from holds/traces in-degree only.**

- Count: how many **other** entries' `structure.holds` or `structure.traces` reference this term's id (`structureCarriesEntry`, `deriveFieldStatesPayload`).
- **`needs` does not contribute to mass.**
- **`carries`, `pairs`, and `nests` do not contribute to mass** (out-degree excluded; D-010B locked definition).

These fields may declare edges or shape reading — they do **not** increment `mass.carriers` today.

---

## Derived Ratio is not Atlas Ratio

| | Atlas Ratio | Derived Ratio (Field) |
|---|---|---|
| **Source** | Atlas term + `RATIO_CONTRACT` | D1 structure scan |
| **Read** | Frame, relation, trace, continuation (`requiredRead`) | Carrier in-degree + threshold bands |
| **Nature** | Relation made readable between distinguishable terms | Numeric translation for render |
| **Equivalence** | — | **Not equivalent** — Derived Ratio is a **narrower Field read**, not Atlas Ratio |

Do not treat Derived Ratio as instantiation of Atlas Ratio prose.

---

## Commission verdict

**Is Derived Ratio a coherent bridge?** **Partially — viable with constraints** (D-015B).

The Observatory implements a **deterministic scalar intermediate read** between D1 structure and ratio-modulated Field render behaviour:

```text
holds/traces in-degree → mass.carriers → ratioMode → client expansion → ratio-modulated render
```

D-012 makes the scalar path mechanically retraceable. Some Field behaviour runs **parallel paths** (edge existence, layout bands, focus, frame — D-011 O-4, O-5, O-7; D-015B).

**Smallest retraceable chain supported today:**

> Structure (holds/traces in-degree) → scalar derived ratio → ratio-modulated render behaviour → observation.

---

## Hypothesis under investigation

*Constrained. Not promoted. Not a conclusion.*

The following was tested in D-015A and **partially falsified** in D-015B:

> Structure does not determine behaviour directly.  
> Structure derives a ratio.  
> Ratio determines participation.  
> Participation becomes observable behaviour.

| Clause | D-015B outcome |
|---|---|
| Structure does not determine behaviour directly | **Partially falsified** — edge existence and layout read structure directly (O-4, O-7) |
| Structure derives a ratio | **Supported** — scalar derived ratio |
| Ratio determines participation | **Falsified as load-bearing** — participation not defined; not a runtime module |
| Participation → observable behaviour | **Falsified as load-bearing** — interpretive; remove from constrained chain |

**Recognition** is not part of the constrained chain (D-014 rejected compression-as-recognition; D-015B).

The hypothesis remains on record for steward review. It must **not** be treated as an accepted runtime principle.

---

## 1. Definition

### What is Derived Ratio?

**Derived Ratio** names the **scalar derived ratio** produced when the Field read model translates canonical structure into readable scalars — without assigning ratio by hand and without storing it as an Atlas field.

**Not Atlas Ratio.** See table above.

### Server derivation (scalar)

| Output | Source |
|---|---|
| `mass.carriers` | Holds/traces in-degree count |
| `ratioMode.mode` | `discrete` / `transitional` / `continuous` via thresholds |
| `ratioMode.x` | Same integer as `mass.carriers` |

### Client expansion (downstream)

| Output | Source |
|---|---|
| `transition`, `continuous`, `compression` | `ratioModeForState` from scalar + mode band |
| `structuralMass` | Composite: carriers + ratio scalars + **settledness + maturity** (not all are ratio derivation) |
| Compression limits, filament modulation | Render formulas (D-011 O-2, O-6) |

**Observation:** 490 terms in D-011 Pass A: 299 discrete / 130 transitional / 61 continuous — from structure scan, not assignment.

### Evidence

| Stage | Mechanism | Source |
|---|---|---|
| Carrier count | Other entries' `holds` or `traces` reference this id | `field-maturity.mjs`; `deriveFieldStatesPayload` |
| Mode bands | Threshold on carrier count | `fieldRatioMode(mass.carriers, thresholds)` |
| Render use | Source-term `termRatioMode(a)` on all relation types | D-010B; D-011 O-6 |
| Retrace | `mass.carriers`, `ratioMode.*` | D-012 |

D-012 (O-2): *Carrier in-degree sets ratio mode and structural mass; higher mass lowers relationCompressionLimit.*

### Interpretation

Derived Ratio is the Field operational name for D-014 **P3** at scalar grain: relation made readable through **carrier in-degree**, not a separate runtime ontology.

### Unknowns

| Unknown | Why preserved |
|---|---|
| Whether a **richer structural signature** could derive from more fields | Future read only — not current runtime |
| Whether Derived Ratio should merge with P3 or remain Field alias | Steward decision |
| Whether `needs` should ever contribute to mass | Open — would require commission |

---

## 2. Why ratio should be derived rather than assigned

### Observation

- No per-term ratio field in D1 `entries`.
- No runtime API to set ratio on a term.
- D-010B removed `discreteRatioMode()` — assigned discrete rendering without source-term ratio.
- Changing holds/traces and syncing D1 changes `mass.carriers` and `ratioMode` without code edits.

### Evidence

| Claim | Source |
|---|---|
| Ratio is not first a number | Atlas `Ratio.md` |
| Structure canonical; surfaces translate | `ATLAS_STRUCTURE_CONTRACT` |
| Mass: holds/traces in-degree only | `field-maturity.mjs` §3.3; D-010B; D-015B |
| One shared ratio source | D-010B |
| Behaviours retrace to structure-derived scalars | D-012 |

### Interpretation

Derivation keeps the scalar **answerable to structure**. Thresholds in `garden_config` configure how counts map to mode bands — translation config, not per-term assignment (D-015B constraint).

### Unknowns

| Unknown | Risk |
|---|---|
| Threshold tuning vs Atlas edit | Mode bands can shift without structure change |

---

## 3. Dependency order

### Supported chain (D-015B — evidence-first)

```text
Relation → Structure → Scalar derived ratio → Ratio-modulated behaviour → Observation
                              ↑
                    Frame / Order (visibility — parallel)
                              ↑
                    Structure → edges / layout (parallel — O-4, O-7)
```

### Retired from load-bearing chain

The following appeared in D-015A as a **candidate** order. D-015B falsified participation and recognition as mechanical links:

```text
… → Participation → … → Recognition   (not load-bearing)
```

Do not use participation or recognition in runtime design unless separately formalised.

### Hypothesis link assessment (D-015B)

| Clause | Assessment |
|---|---|
| Structure → scalar derived ratio | **Supported** |
| Scalar derived ratio → ratio-modulated behaviour | **Supported** (partial — not all behaviour) |
| Parallel structure → behaviour | **Supported** (edges, layout) |
| Participation / recognition in chain | **Falsified as load-bearing** |

---

## 4. Atlas contribution to derived ratio

*Accepted relation types only. No new ontology.*

### Mass contribution (current runtime)

| Field | Contributes to `mass.carriers`? |
|---|---|
| **needs** | **No** |
| **holds** | **Yes** (in-degree on this term) |
| **traces** | **Yes** (in-degree on this term) |
| **carries** | **No** |
| **pairs** | **No** |
| **nests** | **No** |

### Behaviour contribution (may read structure or scalar)

| Field | Role |
|---|---|
| **needs** | Dependency spine; Structural Reading — not mass |
| **holds / traces** | Mass input + edge draw + rhythm (D-011 O-6) |
| **carries / pairs / nests** | Edge draw; source-term ratio scalars modulate render (D-010B) — **not mass** |

**Observation:** 129 terms with zero carrier mass (D-011) despite possible `needs` or carries out-edges.

**Interpretation:** Scalar derived ratio measures **being held or traced by others**, not dependency depth or forward load. Locked by D-010B; confirmed D-015B.

---

## 5. Relationship to Runtime Principles (D-014)

Derived Ratio is the **Field articulation of P3**, not a fifth principle.

| Principle | Relation |
|---|---|
| **P1** | Scalar is translation output, not authored structure |
| **P2** | `unexpected_ratio` when movement lacks declared edge |
| **P3** | **Core overlap** — carrier in-degree |
| **P4** | Frame/order modulate visibility after scalar exists |

D-014 rejections binding this document: compression is not recognition; condensation does not create participants; compute-follows-participation is implementation.

---

## 6. Relationship to current Field mechanics

*D-010B, D-011, D-012, D-015B.*

### Consistent with scalar derived ratio

| | Item |
|---|---|
| **Observed** | O-2 compression; O-6 rhythm + ratio scalars |
| **Implemented** | `deriveFieldStatesPayload` → `mass.carriers` → `ratioMode`; one `termRatioMode(a)` |
| **Retrace** | D-012 O-1, O-2, O-6 → `mass.carriers`, `ratioMode.*` |

### Parallel or partial (not ratio-complete)

| | Item |
|---|---|
| **Observed** | O-1 focus; O-3 fading; O-4 edge existence; O-5 frame; O-7 layout |
| **Implemented** | Thresholds; maturity/settledness in `structuralMass`; D-012 client overlay |

Full behaviour explanation requires scalar path **and** parallel paths (D-015B).

---

## 7. Relationship to Calibration

Calibration walks **place** in read-model — not `mass.carriers` or `ratioMode` today.

Field and Calibration may remain **parallel translations** of the same structure. Convergence means both answerable to structure; they need not share the scalar.

Whether Calibration could adopt a structural read from structure is **unknown** — not evidenced; not proposed here.

---

## 8. Relationship to Structural Reading

Structural Reading implies ratio must be **read, not assigned**, under a reference frame (`READING_ORDER` step 3).

**Carrier in-degree as scalar derived ratio** is a **Field runtime characterisation** — not stated in Structural Reading discipline.

Structural Reading uses `needs` / `holds` for hold-before-movement — not carrier mass.

---

## 9. Risks

| Risk | D-015B correction |
|---|---|
| "Ratio signature" overstates derivation | Use **scalar derived ratio** |
| Derived Ratio ≡ Atlas Ratio | **False** — explicitly not equivalent |
| Participation / recognition as mechanics | **Remove from load-bearing claims** |
| Structure never affects behaviour | **False** for edges and layout |
| Ratio explains all Field behaviour | **False** — parallel paths required |
| **Structural signature** as current state | **Future unknown only** |

---

## 10. Unknowns (preserved)

1. Whether a **richer structural signature** (beyond scalar) could derive from more Atlas fields without new ontology.
2. Whether `needs` should contribute to mass (commission required).
3. Whether Derived Ratio remains a Field alias for P3 or merges into practice docs.
4. Whether threshold configuration belongs in Atlas, D1 config, or implementation only.
5. Whether Calibration should ever expose scalar derived ratio.

---

## 11. Constraints (D-015B — if reference retained)

Architectural only. No code.

| Constraint | Source |
|---|---|
| **Scalar first** — holds/traces in-degree → `mass.carriers` | D-010B, D-015B |
| **needs / carries / pairs / nests do not increment mass** | D-010B, D-015B |
| **Not Atlas Ratio** | D-015B |
| **Client expansion is downstream** — not Atlas derivation | D-015B |
| **Partial bridge** — cite parallel paths for full behaviour | D-011, D-015B |
| **No load-bearing participation / recognition** | D-014, D-015B |
| Derived from structure, not assigned per term | P1, D-012 |
| One shared `termRatioMode(a)` source | D-010B |
| Mass rule changes require commission | Locked definition |
| Retrace must cite Atlas source fields + overlay when needed | D-012 |
| Do not treat compression as recognition | D-011, D-014 |
| Do not mutate structure at runtime | P1 |

---

## 12. References

| ID | Document |
|---|---|
| **D-015B** | [`docs/reports/D-015B-derived-ratio-falsification.md`](../reports/D-015B-derived-ratio-falsification.md) |
| **D-015A** | This document (original commission) |
| **D-014** | [`docs/reports/D-014-runtime-principles-derivation.md`](../reports/D-014-runtime-principles-derivation.md) |
| **D-014** | [`docs/practice/RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md) |
| **D-010B** | [`docs/reports/D-010B-generalise-ratio-mechanics.md`](../reports/D-010B-generalise-ratio-mechanics.md) |
| **D-011** | [`docs/reports/D-011-emergent-behaviour-observations.md`](../reports/D-011-emergent-behaviour-observations.md) |
| **D-012** | [`docs/reports/D-012-behaviour-retrace-instrument.md`](../reports/D-012-behaviour-retrace-instrument.md) |
| Atlas | [`Reality_Mechanics/1_First/Ratio.md`](../../Reality_Mechanics/1_First/Ratio.md) |
| Contract | [`atlas-structure-contract.mjs`](../../atlas-structure-contract.mjs) |
| Runtime | [`field-maturity.mjs`](../../field-maturity.mjs), [`.atlas-publisher/main-website-worker.js`](../../.atlas-publisher/main-website-worker.js) |

---

## Status

**Scalar derived ratio: viable with constraints** (D-015B). Descriptive design document only. Hypothesis constrained, not promoted. Steward decides whether this remains a load-bearing runtime design reference.

**D-015A acceptance:** Pass (original). **D-015B alignment:** Pass (this revision). No Atlas, Field, or Calculus changes.
