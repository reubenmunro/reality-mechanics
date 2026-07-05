# D-015B — Derived Ratio Falsification

**Programme:** Runtime  
**Type:** Falsification  
**Date:** 2026-07-05  
**Target:** [`docs/runtime/DERIVED_RATIO.md`](../runtime/DERIVED_RATIO.md) (D-015A)  
**Evidence:** D-014, D-010B, D-011, D-012, Atlas relation fields  
**Method:** Attempt to falsify each D-015A claim against accepted Observatory evidence. No implementation. No Atlas edits. No theory promotion.

---

## Classification

| Verdict | **Viable with constraints** |
|---|---|

**Derived Ratio** survives as a **Field-runtime bridge name** for the carrier-derived read between structure and ratio-modulated behaviour. It does **not** survive as a complete account of Atlas Ratio, participation, recognition, or full Field behaviour.

**Primary falsification:** D-015A's "ratio signature" language **overstates** what the runtime derives. Evidence supports a **scalar-first pipeline** (carrier in-degree → mode band → client-expanded scalars), not a **rich structural signature** matching `RATIO_CONTRACT.requiredRead`.

---

## Executive summary

| D-015A claim | Falsification result |
|---|---|
| Structure → derived ratio → behaviour bridge exists | **Not falsified** — mechanical, retraceable (D-010B, D-012) |
| Ratio derived, not assigned | **Not falsified** — with threshold-config constraint |
| "Ratio signature" (rich read) | **Falsified as stated** — server output is scalar + 3-band mode |
| Full hypothesis through participation | **Falsified** — no runtime module; D-014 unknown |
| Recognition as chain terminus | **Falsified** — D-014 Law 003; D-011 O-2 |
| Structure never affects behaviour directly | **Falsified** — O-4 edge existence, O-7 layout bands read structure directly |
| All relation fields contribute to derived ratio | **Falsified** — needs, carries, pairs, nests excluded from mass |
| Derived Ratio ≡ Atlas Ratio | **Falsified** — omits frame, trace, continuation from derivation |
| One mechanic, no additional ontology | **Not falsified** — aligns with D-014 P3 |

---

## Method

For each D-015A section, record:

1. **Claim** — what D-015A asserts or hypothesises  
2. **Falsification attempt** — evidence that would disprove it  
3. **Outcome** — survives / survives with constraint / falsified  
4. **Separation** — observation vs interpretation

Central investigation (commission focus): **single scalar ratio vs richer structural signature**.

---

## Central investigation — scalar or signature?

### What the runtime actually derives

#### Server (`deriveFieldStatesPayload`)

| Output | Type | Source |
|---|---|---|
| `mass.carriers` | **Integer scalar** | Count of other entries where `structureCarriesEntry` (holds/traces in-degree only) |
| `ratioMode.mode` | **3-band enum** | Threshold on carrier count (`discrete` / `transitional` / `continuous`) |
| `ratioMode.x` | **Same integer** | Duplicate of `mass.carriers` |
| `relations.{holds,traces,carries,pairs,nests}` | **Structural edge lists** | Per-term structure JSON — **not folded into ratio derivation** |
| `settledness`, `maturityBand`, `agitation` | **Parallel reads** | Time, revisions, proposals — **not inputs to `fieldRatioMode`** |

**Observation:** Ratio derivation on the server is **one integer + one threshold mapping**. D-010B unchanged this definition.

#### Client (`ratioModeForState` → `structuralMassForState`)

From the scalar + mode band, client **expands**:

| Scalar | Derived how |
|---|---|
| `transition` | Piecewise function of `x` and mode |
| `continuous` | Non-zero only in continuous mode |
| `compression` | Non-zero in transitional/continuous modes |
| `structuralMass` | **Composite**: carriers + transition + continuous + settledness + maturity |

**Observation:** Client layer adds **derived scalars**, still not a multi-field Atlas ratio read. D-012 retraces O-2 through `mass.carriers` and `ratioMode.*`, then client overlay adds `ratioTransition`, `ratioContinuous`, `structuralMass`.

#### D-012 retrace — what Atlas fields are cited

For O-2 compression on `first.relation`, D-012 cites:

- `mass.carriers`, `ratioMode.mode`, `ratioMode.x` — **scalar path**
- `relations.holds`, `relations.traces` — **structure context**
- `holdsIn`, `tracesIn` — **decomposed in-degree** (21 holds / 23 traces in sample)

**Observation:** Retrace exposes **scalar + relation breakdown**, but **derivation rule uses total carrier count only** — holds vs traces split is informational, not a separate ratio input.

### Falsification verdict — signature language

| Claim | Verdict |
|---|---|
| Runtime derives a **single scalar ratio** (carrier in-degree) | **Survives** — D-010B, D-012, `fieldRatioMode` |
| Runtime derives a **rich structural signature** matching Atlas Ratio | **Falsified** — no frame, no continuation pressure, no per-relation-type mass; `RATIO_CONTRACT.requiredRead` six fields not derived |
| "Ratio signature" is accurate neutral language | **Falsified as primary label** — prefer **scalar pipeline with client expansion** |
| Client composite (`structuralMass`) is part of Derived Ratio | **Constraint** — yes for behaviour, but **mixes ratio scalars with settledness/maturity** (non-structure ratio inputs) |

### Recommended terminology (post-falsification)

| Term | Allowed use |
|---|---|
| **Derived Ratio (scalar)** | `mass.carriers` + `ratioMode` from holds/traces in-degree |
| **Ratio-modulated profile** | Client `transition` / `continuous` / `compression` / `structuralMass` |
| **Structural signature** | `relations.*` edge lists + order — **parallel read**, not current ratio derivation |
| **Atlas Ratio** | Full frame-relative readable relation — **not instantiated** at Field derivation |

---

## Falsification by evidence source

### Against D-014 Runtime Principles

| D-015A alignment | Falsification | Outcome |
|---|---|---|
| Derived Ratio ≈ P3 | P3 says "carrier in-degree" — matches scalar derivation | **Survives** |
| Depends on P1, P4 | Threshold config and frame paths independent of P3 — consistent with P1/P4 split | **Survives** |
| Full hypothesis chain | P3 does **not** claim participation or recognition; D-014 rejected Laws 001, 003, 004 | **Falsified** — D-015A hypothesis clauses 3–4 exceed P3 |
| P3 confidence high | Falsification does not reduce P3; reduces **D-015A overreach** beyond P3 | **P3 survives; extended chain falsified** |
| "Bridge between structure and all behaviour" | P2, P4 handle movement and visibility without ratio | **Falsified as universal bridge** — **partial bridge** only |

**Constraint:** Derived Ratio is the **Field articulation of P3**, not a fifth principle and not a replacement for P2/P4.

---

### Against D-010B ratio generalisation

| D-015A claim | Falsification | Outcome |
|---|---|---|
| One shared `termRatioMode(a)` source | D-010B confirms; tests assert removal of `discreteRatioMode` | **Survives** |
| Mass from holds/traces in-degree only | D-010B explicitly unchanged; pairs/nests/carries out-degree excluded | **Survives** |
| Ratio generalised across relation types | Application weights differ per type; **source scalar shared** | **Survives with constraint** — generalisation is **read** of same scalar, not per-type derivation |
| "No new ratio definition" | Confirms scalar derivation unchanged | **Survives** |
| All relation types contribute to **derived ratio mass** | D-010B falsifies this reading — carries/pairs/nests contribute to **render**, not mass | **Falsified** — D-015A §4 table is correct but easy to misread |

**Observation:** D-010B strengthened the **scalar bridge**; it did not enrich the derivation rule.

---

### Against D-011 behaviour observations

| Behaviour | Consistent with scalar Derived Ratio? | Falsification |
|---|---|---|
| **O-2** Ratio-driven compression | **Yes** — `structuralMass` from carrier path | Not falsified |
| **O-6** Relation-type rhythm + ratio scalars | **Partial** — rhythm is type-coded; ratio modulates weights | Survives with constraint |
| **O-1** Focus condensation | **Partial** — focus state primary; mass reinforces | **Falsified** as ratio-only behaviour |
| **O-3** Endpoint fading | **Partial** — neighbourhood pressure + render budget | **Falsified** as ratio-complete explanation |
| **O-4** Explicit-edge coupling | **No for ratio** — structure declares edge | **Falsified** — direct structure → behaviour path |
| **O-5** Frame dimming | **No** — P4 path | **Falsified** — parallel to ratio |
| **O-7** Layout ring banding | **No** — relation type + order from structure | **Falsified** — structure → layout without ratio |
| **O-8** Home field underlay | **No** | Parallel path |
| **O-9** Movement wake | **No** — P2 navigation observer | Parallel path |

**Population (Pass A):** 129 terms with **zero carrier mass** despite possible structural richness (needs, carries out-edges). **Falsifies** claim that Derived Ratio fully represents structural participation.

**D-011 classification of O-2:** "Ratio artefact + runtime render budget." **Falsifies** treating compression as pure structural recognition (consistent with D-015A bounds).

---

### Against D-012 behaviour retrace instrument

| D-015A claim | Falsification | Outcome |
|---|---|---|
| Chain mechanically retraceable | D-012 traces O-1, O-2, O-6 to `mass.carriers`, `ratioMode.*` | **Survives** for ratio-mediated behaviours |
| Atlas source fields cited | Trace schema requires six fields; cites scalar + relations | **Survives** |
| "Carrier in-degree sets ratio mode and structural mass" | D-012 meaning string; matches code | **Survives** |
| All five retraced behaviours are ratio-determined | O-3 cites structural mass + **overlay**; O-5 cites **frame** | **Falsified** — retrace explicitly separates ratio path from overlay |
| Runtime overlay in trace | `localCount`, `fieldPressure`, `endpointOnly`, `referenceFrame` — client-only | **Falsified** — full behaviour explanation requires **non-derived-ratio overlay** |

**Observation:** D-012 is the strongest evidence **for** scalar Derived Ratio **and** for its **insufficiency alone** to explain Field behaviour.

---

### Against Atlas relation fields

**Contract:** `RELATION_FIELDS = [holds, traces, carries, pairs, nests, reads]` (`atlas-structure-contract.mjs`). **`needs`** is dependency spine, not in `RELATION_FIELDS` (C-F001).

| Field | Contributes to derived ratio mass? | Falsification of "structure derives ratio" |
|---|---|---|
| **needs** | **No** | **Falsified** if "structure" means full frontmatter — only holds/traces **in-degree on other entries** counts |
| **holds** | **Yes** (in-degree) | Survives |
| **traces** | **Yes** (in-degree) | Survives |
| **carries** | **No** (out-degree excluded) | **Falsified** for forward-load terms |
| **pairs** | **No** | **Falsified** for lateral structure |
| **nests** | **No** (10 edges population-wide) | **Falsified** for enclosure; under-sampled |
| **reads** | **No** | Not in Field ratio path |

**Atlas Ratio term** (`Ratio.md`, `RATIO_CONTRACT`): requires left, right, referenceFrame, relation, trace, continuation. **Falsified:** Field Derived Ratio implements **none** of these as derivation inputs — only carrier count proxy.

**C-F001:** holds ≡ needs at link level (57/57 first-order). Runtime uses holds/traces in-degree on **other entries referencing this id**, not self-field `needs`. Dependency topology and ratio mass are **decoupled** in implementation.

---

## Claim-by-claim falsification of D-015A

| # | D-015A claim | Result |
|---|---|---|
| C1 | Derived Ratio is missing bridge structure ↔ behaviour | **Constraint** — partial bridge only |
| C2 | Deterministic intermediate read exists | **Survives** |
| C3 | "Ratio signature" | **Falsified** → scalar pipeline |
| C4 | Structure does not determine behaviour directly | **Falsified** → mostly true for modulation; false for edge existence and layout |
| C5 | Structure derives a ratio | **Survives** (scalar) |
| C6 | Ratio determines participation | **Falsified** — participation undefined |
| C7 | Participation → behaviour | **Falsified** — interpretive |
| C8 | Alternative C minimal chain best fit | **Survives** |
| C9 | Derived Ratio narrower than Atlas Ratio | **Survives** — understates gap |
| C10 | Thresholds are translation not assignment | **Constraint** — steward judgement; can shift modes without structure edit |
| C11 | Maturity parallel read noted | **Survives** — falsifies single-read model if maturity confused with ratio |
| C12 | Implementation constraints list | **Survives** pending D-015B addendum below |

---

## Required constraints (if Derived Ratio retained)

Derived Ratio may be referenced **only with** these constraints:

1. **Scalar first** — primary derivation is `mass.carriers` (holds/traces in-degree), not a multi-field signature.  
2. **Client expansion explicit** — `transition`, `continuous`, `compression`, `structuralMass` are **downstream transforms**, not Atlas-derived ratio fields.  
3. **Partial bridge** — edge existence, layout bands, focus, frame, and navigation run **parallel paths** (D-011 O-4, O-5, O-7, O-9).  
4. **Not Atlas Ratio** — do not equate with `RATIO_CONTRACT` or Ratio term prose.  
5. **No participation / recognition** — remove from load-bearing chain until formalised (D-014).  
6. **Mass rule locked** — holds/traces in-degree only (D-010B); needs/carries/pairs/nests do not increment mass.  
7. **Retrace honesty** — D-012 overlay fields must be cited when explaining behaviour beyond scalar path.  
8. **Rename risk** — "signature" acceptable only when listing **full payload** (scalar + relations + parallel reads), not as synonym for derivation rule.

---

## What would falsify Derived Ratio entirely?

Conditions that would push classification to **insufficient** or **rejected**:

| Condition | Current status |
|---|---|
| Runtime assigned per-term ratio | **Not observed** — would reject |
| `mass.carriers` not from structure | **Not observed** — would reject |
| D-012 retraces ratio behaviours elsewhere | **Not observed** — would reject scalar bridge |
| D-010B reverted to carry-only ratio | **Not observed** |

None met. Scalar bridge **viably** retraces. Overreach is the failure mode, not absence of derivation.

---

## Comparison to classification options

| Class | Applicable? | Reason |
|---|---|---|
| **Viable** | No | Overreach falsified; not full bridge; not rich signature |
| **Viable with constraints** | **Yes** | Scalar derivation retraces; must drop signature/participation/recognition claims |
| **Insufficient** | No | Core scalar path is real and load-bearing in runtime |
| **Rejected** | No | Would discard accurate P3 Field read |

---

## Unknowns (preserved)

1. Should D-015A document be amended to replace "ratio signature" with "scalar pipeline"? (Steward — out of scope for D-015B implementation)  
2. Should holds vs traces in-degree ever split into two ratio inputs? (Not evidenced)  
3. Should `needs` contribute to mass without breaking D-010B lock? (Open)  
4. Can a **richer** derived read be added without new ontology? (Not tested — not implemented)  
5. Does `structuralMass` belong under Derived Ratio or under a separate "participation profile" name? (Unknown)

---

## Recommendations (non-binding, not promotion)

| Item | Recommendation |
|---|---|
| D-015A wording | Replace primary "ratio signature" with **scalar derived ratio** where derivation rule is meant |
| RUNTIME_PRINCIPLES P3 | Already accurate — "carrier in-degree"; no change required for falsification |
| Future runtime work | Any enrichment of derivation requires commission; falsification does not authorise |

---

## Implementation check

| Area | Modified? |
|---|---|
| Atlas | **No** |
| Field runtime | **No** |
| D-015A document | **No** (falsification report only) |
| Calculus | **No promotion** |

---

## Acceptance (D-015B)

| Criterion | Status |
|---|---|
| Report created | **Pass** |
| Falsified against D-014, D-010B, D-011, D-012, Atlas fields | **Pass** |
| Classification recorded | **Pass** — **viable with constraints** |
| Scalar vs signature investigated | **Pass** |
| No implementation | **Pass** |
| No Atlas edits | **Pass** |
| No theory promotion | **Pass** |
| Observations separated from interpretation | **Pass** |
| Unknowns preserved | **Pass** |

---

## References

| ID | Document |
|---|---|
| D-015A | [`docs/runtime/DERIVED_RATIO.md`](../runtime/DERIVED_RATIO.md) |
| D-014 | [`docs/reports/D-014-runtime-principles-derivation.md`](D-014-runtime-principles-derivation.md) |
| D-014 | [`docs/practice/RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md) |
| D-010B | [`docs/reports/D-010B-generalise-ratio-mechanics.md`](D-010B-generalise-ratio-mechanics.md) |
| D-011 | [`docs/reports/D-011-emergent-behaviour-observations.md`](D-011-emergent-behaviour-observations.md) |
| D-012 | [`docs/reports/D-012-behaviour-retrace-instrument.md`](D-012-behaviour-retrace-instrument.md) |
| Atlas | [`atlas-structure-contract.mjs`](../../atlas-structure-contract.mjs) — `RELATION_FIELDS`, `RATIO_CONTRACT` |
| Atlas | [`docs/reports/C-F001-frontmatter-field-characterisation.md`](C-F001-frontmatter-field-characterisation.md) — needs/holds/traces overlap |
| Runtime | [`field-maturity.mjs`](../../field-maturity.mjs), [`.atlas-publisher/main-website-worker.js`](../../.atlas-publisher/main-website-worker.js) |

---

**Status:** D-015B complete. **Derived Ratio: viable with constraints.** Primary correction: runtime derives a **scalar carrier ratio**, not a rich structural signature; Field behaviour requires parallel non-ratio paths.
