# P-002 — Invariant Hierarchy Investigation

**Programme:** Research  
**Type:** Read-only investigation (no implementation, no Atlas edits, no Observatory edits)  
**Date:** 2026-07-06 (UTC+12)  
**Precedent:** P-001 physics-language investigation; P-001 §11 ratios-as-invariants test  
**Mission:** Determine whether Reality Mechanics naturally derives a hierarchy of invariants. Test the candidate hierarchy; do not preserve it if evidence contradicts.

---

## Verdict

| Candidate | Result |
|---|---|
| Relation → Ratio → Read → Observation | **Incorrect ordering** — reordered and split |
| Layers collapse? | **Yes** — "Read" splits across Structure and Observation; "Observation" is not an invariant layer |
| Additional layers? | **Yes** — **Structure**, **Behaviour**, **Appearance**; **Frame/visibility** as cross-cutting constraint |
| Smallest dependency order | **Six layers + one cross-cut** (§2) |

**Outcome:** The repository supports an invariant hierarchy, but **not the proposed four-layer stack**. The smallest evidence-backed order places **Structure** first, separates **scalar ratio register** from **Atlas Ratio read**, splits **Read** into structural vs participant senses, and treats **Observation** as a **composite act that reveals** invariants rather than constituting one.

---

## 1. Research summary

Reality Mechanics uses "invariant" in **three distinct senses** already:

| Sense | Where | Meaning |
|---|---|---|
| **Canonical structure invariant** | `RELATION_EVENT_RUNTIME_CONTRACT.invariantRule` | Atlas structure must not be silently created at runtime |
| **Stewardship invariants** | `ATLAS_INVARIANTS.md` | Recovered structural laws (Places, Reads, retraceability, etc.) |
| **Retrace-invariant ratios** | P-001 §11, D-012 | Derived scalars unchanged when structure and config are fixed |

The proposed hierarchy conflates **ontology** (Relation primitive), **stored structure** (declared edges), **derived scalars** (Field ratio register), **participant reading** (frame-dependent), and **instrument overlay** (navigation, render). The repository **does** distinguish these — but in **different order** and **different documents**.

**Negative finding (valuable):** There is **no single "Observation invariant."** Observation changes overlay and appearance; it **does not change** structure-derived scalars. Observation **reveals** what is already invariant below the overlay line.

---

## 2. Candidate hierarchy (evidence-backed reorder)

### 2.1 Proposed hierarchy (tested)

```text
Relation invariant
    ↓
Ratio invariant
    ↓
Read invariant
    ↓
Observation invariant
```

### 2.2 Repository-backed hierarchy (smallest dependency order)

```text
Structure invariant                    [canonical — survives retrace]
    ↓
Declared relation facts                [subset of structure — survives retrace]
    ↓
Scalar ratio register                  [derived — survives retrace & observation transform]
    ↓
Parallel structure reads               [edges, order, maturity — survives retrace]
    ↓
Deterministic behaviour                [functions of above — survives given inputs]
    ↓  ← cross-cut: Frame / visibility (P4) — modulates what is seen, not what is true
Participant observation overlay        [events, traversal, frame state — does NOT survive as invariant]
    ↓
Appearance                             [render, time, performance — does NOT survive]
```

**Relation** appears as **primitive condition** (Atlas) and as **declared relation facts** (structure fields) — two levels, not one layer.

**Read** does **not** form one layer. It **splits**:

| Read sense | Layer | Invariant? |
|---|---|---|
| `conditions.reads` (frontmatter) | Structure | **Yes** under retrace |
| Atlas term **Read** (recognition) | Participant / practice | **No** — can "clarify, distort, repair" (`Read.md`) |
| Structural Reading discipline | Practice method | **No** — produces recommendations |
| `READING_ORDER` step 3 ("read the active ratio") | Participant read under frame | **No** — frame precedes ratio read |
| Field/MCP "translation read" | Surface output | **No** — lag, render, frame dependent |

**Observation** is decomposed into D-012's stack (§6), not promoted as invariant.

---

## 3. Layer-by-layer evidence

### 3.1 Relation invariant

**Question:** Is Relation itself invariant, or only certain constrained relations?

#### Evidence for

| Claim | Source |
|---|---|
| Relation is **primitive** inside the Atlas — no prior term produces it | `Relation.md`; `STEWARDSHIP_V1.md` |
| Runtime couples **only on declared edges** — no relation without structure | D-011 O-4; P1 `invariantRule` |
| Carry/Trace are **one condition** carved by direction — direction is stable read | `STEWARDSHIP_V1.md`; `Carry.md`, `Trace.md` |
| `WORLD_PHYSICS.ratios.invariant` ("1 : 1-") names asymmetry as generative invariant | `atlas-structure-contract.mjs` — contract-level, not runtime-derived |

#### Evidence against

| Claim | Source |
|---|---|
| Relation primitive is **not a scalar invariant** — it is a condition type, not a retraceable value | No `relation.invariant` in API |
| **Specific relations** are the invariant facts — `holds`, `traces`, etc. as **structure JSON** | `RELATION_FIELDS`; D1 `entries.structure` |
| Relation **does not survive** as the sole layer — **Structure** is named invariant first in contract | `canonicalRule`, `invariantRule` |
| Undeclared movement is **`unexpected_ratio`** — relation is **constrained**, not universal | P2; `STRUCTURAL_EVENT_TYPES` |

#### What remains unchanged / changes / carried / produced / observed

| | Relation primitive | Declared relation facts |
|---|---|---|
| **Unchanged** | Status as primitive condition | Edge lists for each term under fixed structure |
| **Changes** | Nothing within Atlas system | When steward edits structure |
| **Carried** | Generative condition for downstream terms | Dependency, coupling channels, mass input |
| **Produced** | Readable ratios, reads, terms (downstream) | Runtime coupling visibility, carrier in-degree |
| **Observed** | Through terms that hold it | Through explicit edges only (O-4) |

**Finding:** **Partial pass.** "Relation invariant" is **true for the primitive** and **true for declared edges as structure facts**. It is **false** if interpreted as "any relation is invariant" or "Relation is the top layer." **Structure subsumes declared relations.**

---

### 3.2 Ratio invariant

**Question:** Is the invariant the value, derivation, constraint, or something else?

#### Evidence for

| Claim | Source |
|---|---|
| **Value** invariant under retrace: `mass.carriers`, `ratioMode.x` | D-012 `first.relation` example; `deriveFieldStatesPayload` |
| **Derivation** invariant: holds/traces in-degree rule locked | `field-maturity.mjs` §3.3; D-010B |
| **Function** invariant: `structuralMassForState`, `ratioModeForState` deterministic | `field-behaviour-trace.mjs` |
| Scalar chain in public Calculus | `DERIVATION_CHAIN` steps 1–3 |

#### Evidence against

| Claim | Source |
|---|---|
| **Threshold constraint** not invariant — config can change mode bands without structure change | `garden_config` `field_ratio_mode_thresholds`; D-015B |
| **Atlas Ratio** ≠ **Derived Ratio** — `RATIO_CONTRACT.requiredRead` six fields not derived | D-015B falsification |
| Ratio **read** is frame-dependent — `READING_ORDER`: locate frame **before** read ratio | `atlas-structure-contract.mjs` |
| `needs`, carries out-degree, pairs, nests **excluded** from mass — ratio register is **narrow** | D-010B |

#### What is the invariant?

| Candidate | Verdict |
|---|---|
| **The value** (`mass.carriers`) | **Yes** at fixed structure + fixed time snapshot for maturity |
| **The derivation rule** | **Yes** — locked carrier in-degree definition |
| **The threshold constraint** | **Calibrated, not invariant** — changes without Atlas edit |
| **Something else** | **Yes** — the **ratio register**: relation made readable as **scalar participation** without collapsing to Atlas Ratio prose |

**Finding:** **Pass with split.** "Ratio invariant" correctly names the **scalar derived register** and its **derivation rule**, not Atlas Ratio term semantics and not threshold config.

---

### 3.3 Read invariant

**Question:** Does a read remain invariant across observer, frame, time, rendering, traversal?

#### Evidence for (invariant reads)

| Read type | Survives | Source |
|---|---|---|
| `conditions.reads` field text | Retrace | `ATLAS_INVARIANTS.md` primitive 3 — separate from Places |
| `conditions.places` | Retrace | Primitive 1 |
| Derived scalars when "reading" structure mechanically | Retrace, observation transform | P-001 §11.2; D-012 |
| MCP `get_entry` structure layer | Retrace to GitHub source | P1 canonical rule |

#### Evidence against (non-invariant reads)

| Read type | Fails across | Source |
|---|---|---|
| Atlas **Read** term (recognition) | Observer — read "can clarify, distort, repair" | `Read.md` |
| Ratio read under practice | Frame — frame before ratio in `READING_ORDER` | `READING_ORDER` step 2→3 |
| Structural Reading calibration | Observer, time — produces recommendations | `STRUCTURAL_READING.md` |
| Field visual read | Rendering, frame, focus, viewport | D-011 O-5; P-001 §11.3 |
| Participant traversal read | Traversal history | `traversalMap`, `fieldMovementEvent` |

#### Cross-dimension matrix

| Dimension | Structural read (`conditions.reads`) | Scalar ratio read | Participant Read term / ratio read |
|---|---|---|---|
| **Observer** | Invariant (same text) | Invariant | **Not invariant** |
| **Frame** | Invariant | Invariant (carriers unchanged) | **Not invariant** (visibility) |
| **Time** | Invariant until edit | Invariant until structure/revision change | Overlay decays / accumulates |
| **Rendering** | Invariant | Invariant | **Not invariant** |
| **Traversal** | Invariant | Invariant | **Not invariant** |

**Finding:** **Fail as single layer.** "Read invariant" **collapses into Structure** (frontmatter reads/places) and **separates from Observation** (participant recognition, frame-limited ratio read). The proposed hierarchy **misplaces Read between Ratio and Observation** — practice order is **frame → ratio read → trace**, so participant read is **above** ratio in dependency but **not invariant**.

---

### 3.4 Observation invariant

**Question:** Does observation change the invariant or merely reveal it?

#### Decomposition (D-012 + P-001)

| Component | Invariant? | Role |
|---|---|---|
| **Structure** | **Yes** | What exists in D1 / GitHub |
| **Invariant read** (scalars, edge lists) | **Yes** | `atlasSource` in behaviour trace |
| **Participant overlay** | **No** | `runtimeOverlay`: frame, localCount, settled, traversal |
| **Appearance** | **No** | Canvas alpha, phase, pressure lerp, DPR |

#### Evidence for "reveals, does not change"

- `mass.carriers` unchanged by pan, zoom, focus, frame (P-001 §11.3)
- Behaviour trace API returns same `atlasSource` regardless of who calls it (structure fixed)
- `invariantRule`: runtime interprets, does not create structure

#### Evidence against "observation invariant"

- Observation **produces** `fieldMovementEvent`, `traversalMap` — new participant state
- Reference frame **changes visibility** (0.08 alpha) without changing structure
- Rendering **compresses** relations — observation **hides** edges (O-2) while structure retains them
- Read term explicitly allows observation to **alter** the relation being read

**Finding:** **Fail as invariant layer.** Observation is the **composite** of invariant substrate + non-invariant overlay. It **reveals** structure-derived invariants; it **does not constitute** an invariant.

---

## 4. What survives retrace

| Layer | Survives full retrace? | Mechanism |
|---|---|---|
| Structure (all fields) | **Yes** | GitHub → D1 → API |
| Declared relations | **Yes** | `entries.structure` |
| `mass.carriers`, `ratioMode` | **Yes** | `deriveFieldStatesPayload` |
| `structuralMass` expansion | **Yes** | `structuralMassForState` |
| Maturity/settledness/agitation | **Yes** at timestamp | `field-maturity.mjs` |
| Edge counts, relation lists | **Yes** | behaviour trace `atlasSource` |
| Behaviour trace meanings | **Yes** | Deterministic from above |
| Participant overlay | **No** | Client session state |
| Appearance | **No** | Not in retrace API |

**Retrace instrument:** D-012 `/api/field/behaviour-trace` — explicitly cites Atlas source fields per behaviour.

---

## 5. What survives observation

"Observation" = participant/instrument engaging the Field without structure edit.

| Layer | Survives observation transform? |
|---|---|
| Structure | **Yes** |
| Scalar ratio register | **Yes** |
| Declared edges (existence) | **Yes** |
| Rhythm **mode** per relation type | **Yes** |
| Rhythm **phase** | **No** (time) |
| Frame visibility weights | **N/A** — changes with frame (by design P4) |
| Layout positions | **No** (focus/viewport context) |
| Traversal memory | **No** (accumulates) |
| Render compression visible count | **No** (budget artifact) |

**Key distinction:** Observation transforms **visibility and appearance**; it does **not** transform **structure-derived scalars**.

---

## 6. What survives transformation

| Transformation type | What survives |
|---|---|
| **Atlas structural edit** | Only what steward preserves — invariants **recomputed**, not preserved |
| **Config threshold change** | Structure yes; **ratioMode band** may change without structure change |
| **Reference frame switch** | Structure + scalars yes; **visibility** changes |
| **Focus / navigation** | Structure + scalars yes; overlay + appearance change |
| **Pan / zoom / resize** | Structure + scalars yes; layout + screen pressure grid change |
| **Time passage** | Structure yes until edit; **maturity/agitation** may change; animation phase changes |
| **Surface translation** (MCP → Field → prose) | Structure answerable through all — **lag** explicit (`lagRule`) |

**Negative finding:** No transformation class preserves **participant overlay** as invariant — by design.

---

## 7. Relationship to existing Calculus

### 7.1 Public derivation chain (D-024 manifest)

```text
Declared relation (canonical)
    → Structural mass (derived)
    → Ratio mode (calibrated)
    → Render behaviour (heuristic)
    → Retrace (derived)
```

**Mapping to P-002 hierarchy:**

| Calculus step | P-002 layer |
|---|---|
| Declared relation | Structure → declared relation facts |
| Structural mass | Scalar ratio register |
| Ratio mode | Scalar ratio register (calibrated band) |
| Render behaviour | Behaviour → Appearance |
| Retrace | Cross-cutting verification — not a layer |

**Finding:** Public Calculus describes the **middle** of the invariant stack. It does **not** name Relation primitive, Read split, or observation decomposition. It **implicitly assumes** Structure canonical (step 1).

### 7.2 Stewardship calculus (six-layer)

```text
Dependency → Contribution → Generation → Places → Reads → Term
```

**Orthogonal** to runtime invariant hierarchy — this is **term recovery** order, not Observatory render order. **Reads** here = `conditions.reads` (structure), aligning with P-002 **Structure** layer not participant Read.

### 7.3 Unaccepted Calculus

- `:` operator — unresolved (C010)
- Calculus grain — undeclared (C-003)
- **No constitutional derivation sequence** — authority order ≠ derivation order (`CONSTITUTION.md`)

### 7.4 Runtime principles (D-014)

| Principle | Hierarchy role |
|---|---|
| P1 Structure invariant | **Top layer** |
| P2 Movement events | **Participant overlay** (retraceable events, not invariant state) |
| P3 Ratio from carriers | **Scalar ratio register** |
| P4 Order/frame visibility | **Cross-cut** — not invariant, constrains observation |

---

## 8. Relationship to existing Atlas terms

| Atlas term | Hierarchy placement | Invariant character |
|---|---|---|
| **Relation** | Primitive (above derived terms); declared edges in Structure | Primitive condition invariant; instances are structure facts |
| **Ratio** | Reading-order term; parallel to **Derived Ratio** register | Atlas Ratio prose **not** equal to scalar invariant (D-015B) |
| **Read** | Carrier term; `conditions.reads` on every entry | **Split:** field = structure; term = participant recognition |
| **Trace** | Carrier; contributes to **mass** in-degree | Invariant as structure; backward availability |
| **Carry** | Carrier; edge type + rhythm mode | Direction invariant; motion on filament is behaviour |
| **Hold** | First-order; anchor rhythm | Structure + rhythm mode |
| **Availability** | First-order; no runtime ratio yet | **Unresolved** — not in invariant stack today |
| **Pressure** | Second-order; three senses (C-A001) | **Unresolved** — not derived in Field chain |
| **Order** (`entry_order`) | Governance + layout depth | Invariant as metadata; visibility cross-cut |
| **Clean** | "invariant carrier" in Atlas prose | Term-level claim — stewardship, not runtime scalar |

---

## 9. Implications for the Observatory

### 9.1 Instrument architecture (conceptual only)

The Observatory should **encode the hierarchy explicitly** in its read model:

```text
atlasSource (invariant)  →  behaviour (deterministic)  →  runtimeOverlay (participant)  →  appearance (render)
```

D-012 already implements the first split. P-001/O-001 extend toward **appearance following invariant substrate**.

### 9.2 Rules implied by hierarchy

| Rule | Rationale |
|---|---|
| Never treat overlay as invariant | Traversal, frame, wake are not retraced as structure |
| Never treat appearance as ratio | Render compression ≠ recognition (D-014 Law 003 rejected) |
| Retrace must cite Structure + scalar register | D-012 acceptance standard |
| Frame changes visibility, not carriers | P4 |
| "Read" in UI copy must disambiguate | Structure read vs participant read |

### 9.3 What Observatory should not claim

- That observation **is** an invariant layer
- That Atlas **Read** term behaviour is frozen across observers
- That rendered relation count equals structural relation count (compression O-2)

### 9.4 Future research hooks (from gaps)

- **Availability** as permeability scalar — would add to ratio register, not Read layer
- **Atlas Pressure** derivation — would link second-order term to behaviour layer
- **Rich structural signature** — might add parallel reads between Structure and Behaviour

---

## 10. Acceptance mapping

| Criterion | Result |
|---|---|
| Hierarchy correct | **No** — requires reordering |
| Hierarchy requires reordering | **Yes** — §2.2 |
| Layers collapse | **Yes** — Read splits; Observation decomposes |
| Additional layers exist | **Yes** — Structure, Behaviour, Appearance; Frame cross-cut |
| Smallest dependency order | **Yes** — §2.2 |
| Negative findings valuable | **Yes** — Observation not invariant; Read not single layer |
| No implementation / Atlas / Observatory edits | **Met** |

---

## 11. Recommended next commissions

| ID | Question |
|---|---|
| **P-003** | Formalise the `atlasSource` / `runtimeOverlay` / `appearance` contract in runtime docs (architecture only) |
| **P-004** | Test whether **Frame** is a layer or only a visibility operator on Behaviour |
| **P-005** | Availability permeability — does it belong in ratio register or Structure? |
| **P-006** | Align public Calculus chain with P-002 hierarchy wording (docs only) |

---

## References

| ID | Document |
|---|---|
| P-001 | `docs/reports/P-001-physics-language-investigation.md` |
| Contract | `atlas-structure-contract.mjs` |
| Stewardship | `docs/stewardship/ATLAS_INVARIANTS.md`, `STEWARDSHIP_V1.md` |
| Runtime | `docs/practice/RUNTIME_PRINCIPLES.md`, `docs/runtime/DERIVED_RATIO.md` |
| D-011 | `docs/reports/D-011-emergent-behaviour-observations.md` |
| D-012 | `docs/reports/D-012-behaviour-retrace-instrument.md` |
| D-014 | `docs/reports/D-014-runtime-principles-derivation.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| Calculus | `public-surface-manifest.mjs` (`DERIVATION_CHAIN`) |
| Atlas | `Relation.md`, `Ratio.md`, `Read.md`, `Carry.md`, `Trace.md` |
| Trace module | `.atlas-publisher/field-behaviour-trace.mjs` |

---

**Status:** Research complete. Report only. No code, Atlas, or Observatory changes.
