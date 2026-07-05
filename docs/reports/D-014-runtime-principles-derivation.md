# D-014 — Runtime Principles Derivation

**Programme:** Runtime  
**Type:** Runtime principles derivation  
**Date:** 2026-07-05  
**Scope:** Atlas, runtime, Structural Reading, Observatory evidence (D-007–D-013)  
**Method:** Falsification-first challenge of seven candidate laws; independent derivation; convergence comparison. **No implementation changes.**

**Surviving principles (promoted nowhere):** [`docs/practice/RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md)

---

## Executive summary

**Central question:** What is the smallest invariant set explaining Atlas structure, runtime behaviour, retrace, Structural Reading, Calibration, Order, Ark, and Ratio?

**Finding:** Evidence supports **one recursive mechanic** expressed at four observational grains — not seven independent laws:

> **Invariant relation is translated into readable observation under participant movement.**

The seven candidate laws **do not survive as stated**. Three are **rejected** (condensation-as-creation, compression-as-recognition, compute-follows-participation). Two **merge** into Principles P2–P3. Two **remain unknown** (state-before-identity; full Carry–Ark transformation read).

**Ark:** Atlas practice term and generative read exist; **public Ark runtime is retired** (410). Ark cannot justify live Field mechanics in D-014.

**Preferred outcome achieved:** smallest number of principles (four) still explains all accepted Observatory observations without inventing mechanics.

---

## Method

### Pass 1 — Independent derivation (candidates withheld)

Sources read first: `atlas-structure-contract.mjs`, `MISSION.md`, `CONSTITUTION.md`, `STRUCTURAL_READING.md`, D-010A/B, D-011, D-012, D-013, `field-maturity.mjs`.

### Pass 2 — Candidate falsification

Each Candidate Runtime Law 001–007 challenged against Pass 1 and commission evidence.

### Pass 3 — Convergence

Compare Pass 1 and Pass 2; merge duplicates; record confidence.

---

## Second investigation — Independent derivation

*Conducted without using candidate law wording as targets.*

### Observations derived from evidence

| # | Observation | Primary evidence |
|---|---|---|
| I1 | **One canonical structure; many translations** | `ATLAS_STRUCTURE_CONTRACT.canonicalRule`, `translationRule`; GitHub → D1 → Field/MCP |
| I2 | **Runtime observes; does not author structure** | `RELATION_EVENT_RUNTIME_CONTRACT.invariantRule`, `principle`; D-010A explicit edges only |
| I3 | **Five relation types are the shared mechanical vocabulary** | `RELATION_FIELDS`; one `computeProfile` pipeline; D-010B generalised ratio hooks |
| I4 | **Participant movement becomes structural events** | `recordFieldMovement`, `STRUCTURAL_EVENT_TYPES`; traversal emphasis decay |
| I5 | **Ratio readability derives from holds/traces in-degree** | `structureCarriesEntry`; Atlas Ratio term; D-010B/D-012 |
| I6 | **Observation condenses under focus and mass** | D-011 O-1, O-2, O-3; focus at layout anchor; `relationCompressionLimit` |
| I7 | **Reference frames and order shape visibility** | `STRUCTURAL_FIELD_FRAMES`, `ORDER_DEPTHS`; D-011 O-5, O-7 |
| I8 | **Lag between source and read model is explicit** | `lagRule`, D-013 manual D1 sync; `atlasVersion` label may lag |
| I9 | **Structural Reading: place before movement; movement reveals place** | `STRUCTURAL_READING.md`; D-010 operations (hold before movement) |
| I10 | **Calibration walks places in read-model** | `member/` engine; separate from Field mutation |

### Independent smallest set (Pass 1)

| Principle | Statement |
|---|---|
| **R1** | Structure is invariant; surfaces translate without inventing structure |
| **R2** | Movement through declared relation is recorded as retraceable events |
| **R3** | Ratio mode reads carrier density from holds/traces structure |
| **R4** | Order and reference frame modulate observability, not structural validity |

**Recursive read:** R1–R4 are one mechanic — **translation of invariant relation under observation**.

---

## First investigation — Candidate law falsification

For each candidate: supporting evidence, contradicting evidence, Atlas terms, runtime evidence, Structural Reading evidence, overlap, verdict.

---

### Candidate Runtime Law 001 — Stable participation condenses

> When participation repeatedly maintains itself through retrace and reaches sufficient ratio, it becomes a new participant. Previous participation preserved.

| Dimension | Assessment |
|---|---|
| **Supporting** | Focus condensation (D-011 O-1); ratio modes discrete/transitional/continuous; Constitution preservation clause; Carry "held support becoming available" |
| **Contradicting** | Runtime **never creates Atlas terms** (`invariantRule`). Condensation is focus layout + render (`drawOperation`, `endpointOnly`). High carrier mass compresses **drawing**, not ontology. D-011 classifies condensation as runtime artefact |
| **Atlas terms** | Carry, Hold, Ratio, Connection; no term "participation condenses into new participant" |
| **Runtime** | `structuralMass`, focus anchor, `compressedRelationField` — observational, not generative |
| **Structural Reading** | Movement reveals place; does not create new places |
| **Overlap** | Partial overlap with R3 (ratio mass) and R2 (retrace) — not new law |
| **Verdict** | **Reject** as stated. **Merge** weak read: *observed participation condenses visually under focus and carrier mass* — not new participant creation |

**Confidence if merged as visual read:** Medium. **Confidence as ontological law:** Rejected.

---

### Candidate Runtime Law 002 — Participation changes state before identity

| Dimension | Assessment |
|---|---|
| **Supporting** | Carry vs Carrying; Trace vs Retracing; lag states (`LAG_STATES`); Ratio "not first a number" |
| **Contradicting** | Atlas terms have stable `id`; repository identity is not fluid. "Participation" is mission language, not a single grounded primitive with formal mechanics |
| **Atlas terms** | Carry/Carrying, Trace/Retracing, Ratio, lag vocabulary in contract |
| **Runtime** | `ratioMode`, maturity bands, settledness — state scalars on fixed ids |
| **Structural Reading** | Place stable; prose refines readability not identity |
| **Overlap** | Subsumed by translation lag (R1 + R8) |
| **Verdict** | **Remain unknown** — plausible analogy; not derivable as invariant law without formalising "participation" |

**Confidence:** Low–medium as law; medium as Atlas distinction between availability and enactment.

---

### Candidate Runtime Law 003 — Compression is recognition

> Compression is not optimisation. Stable participation becoming one observable participant.

| Dimension | Assessment |
|---|---|
| **Supporting** | Ratio = relation made readable; high-mass terms draw fewer, stronger filaments; D-012 trace links compression to carriers |
| **Contradicting** | D-011 O-2 explicit classification: **ratio artefact + render budget**. `relationCompressionLimit` is deterministic cull (`FIELD_RENDER_BUDGET`). `endpointOnly` is render economy. Code purpose is performance + readability under mass, not semantic recognition event |
| **Atlas terms** | Ratio, Clearance — readability, not "compression equals recognition" |
| **Runtime** | `relationCompressionLimit`, `compressedRelationField`, `operationAmbientBudget` |
| **Structural Reading** | No compression-as-recognition operation in D-010 |
| **Overlap** | Law 001 partial overlap; R3 explains mass without recognition claim |
| **Verdict** | **Reject** philosophical claim. **Retain** factual: *high carrier mass produces render compression* (D-011, D-012) |

**Confidence:** High for rejection; high for factual render read.

---

### Candidate Runtime Law 004 — Compute follows participation

| Dimension | Assessment |
|---|---|
| **Supporting** | Fewer wrinkles/strands when `structuralMass` high; `endpointOnly` under `fieldPressure`; adaptive render quality |
| **Contradicting** | Constitution: implementations replaceable. Explicit budgets and lerps — **computational optimisation**. Not stated in Atlas as world physics |
| **Atlas terms** | None direct |
| **Runtime** | `FIELD_RENDER_BUDGET`, `adaptiveAmbientScale`, `operationAmbientBudget` |
| **Structural Reading** | N/A |
| **Overlap** | Consequence of R3 + observatory rule, not separate mechanic |
| **Verdict** | **Reject** as Reality Mechanics law. **Accept** as implementation consequence of same inputs |

**Confidence:** High for rejection as principle.

---

### Candidate Runtime Law 005 — Trace survives transition

| Dimension | Assessment |
|---|---|
| **Supporting** | `recordFieldMovement`; relation keys on events; `traversalMap`; Atlas Trace; `READING_ORDER` trace step; Constitution retraceability; D-012 traces movement; Structural Reading movement pass |
| **Contradicting** | Emphasis **decays** (`exp` on age); not all transitions persist equally; `unexpected_ratio` when no edge — trace of absence, not carry |
| **Atlas terms** | Trace, Retrace Practice, Connection, structural events |
| **Runtime** | `fieldMovementEvent`, `movementRatioSignature`, behaviour-trace API |
| **Structural Reading** | Hold before movement; dependency recovery |
| **Overlap** | Core of R2 |
| **Verdict** | **Remain** — merged into **Principle P2**. Qualify: *retraceable record, not infinite persistence* |

**Confidence:** High (qualified).

---

### Candidate Runtime Law 006 — Carry is preserved through transformation

| Dimension | Assessment |
|---|---|
| **Supporting** | Carry traces Hold/Connection; Constitution transformation preservation; carrier mass uses holds+traces in-degree; Carry/Trace pair |
| **Contradicting** | **Ark API retired** (410, D-010A, README). Runtime "carry" is relation type + forward rhythm — not full Atlas Carry semantics. Transformation at runtime is **navigation**, not Atlas edit |
| **Atlas terms** | Carry, Trace, Connection, Hold; Ark Run (practice, not live surface) |
| **Runtime** | `carries[]` edges; D-010B ratio on all types; mass from holds/traces only |
| **Structural Reading** | Forward/backward availability in Connection calibration (D-006) |
| **Overlap** | P2 + P3; Ark portion **cannot** justify live runtime |
| **Verdict** | **Merge partially** into P2/P3. **Reject** Ark as runtime evidence. Full transformation preservation: **Atlas yes, runtime partial** |

**Confidence:** Medium for Atlas read; high that Ark is not live justification.

---

### Candidate Runtime Law 007 — Order constrains valid transformation

| Dimension | Assessment |
|---|---|
| **Supporting** | `entry_order`, spine, `ORDER_DEPTHS`; Constitution authority order; dependency order in Ark Run prose; Structural Reading hold order; `READING_ORDER` |
| **Contradicting** | Runtime does **not validate** transformations — structure invariant, no mutation API. Order affects layout, bias, frame membership — **visibility**, not permission |
| **Atlas terms** | Order, Dependency Order, entry_order; practice reference frames |
| **Runtime** | `orderBias`, `SPINE_ORDERS`, `structuralFieldFrameIds` |
| **Structural Reading** | Dependency order in opening prose operations |
| **Overlap** | P4 |
| **Verdict** | **Split** — Order constrains **Atlas governance and reading** (high confidence). Order constrains **runtime validity** (reject). **Merge** into P4 |

**Confidence:** High for visibility read; reject validity gate at runtime.

---

## Third investigation — One mechanic or many?

### Irreducibility test

| Candidate separate mechanic | Absorbed by |
|---|---|
| Condensation-as-creation | Rejected — not a mechanic |
| Compression-as-recognition | Rejected — render consequence of R3 |
| Compute-follows-participation | Rejected — implementation |
| Trace survives transition | R2 |
| Carry through transformation | R2 + R3 (partial) |
| Order validity gate | Rejected — R4 visibility only |
| State before identity | Unknown — not irreducible law |

### Smallest irreducible set

**Four principles** (see `RUNTIME_PRINCIPLES.md`) — or **one recursive mechanic** with four grains:

```text
Invariant relation
  → translated on each surface (P1)
  → observed as movement events (P2)
  → read as ratio from carrier structure (P3)
  → scoped by order and frame (P4)
```

**Calibration** fits as a **participant-facing translation** of place-walking (I10) — same P1, different surface (`TRANSLATION_SURFACES.calibration`). Not a fifth mechanic.

**Ark** fits as **practice prose** for pressure→trace→step — not live runtime (retired). Cited in Atlas; excluded from runtime principle evidence.

---

## Convergence — Pass 1 vs Pass 2

| Pass 1 (R1–R4) | Pass 2 survivors | Convergence |
|---|---|---|
| R1 Structure invariant | P1, rejection of 001/003/004 creation claims | **Full** |
| R2 Movement events | P2, Law 005 merged | **Full** |
| R3 Ratio from carriers | P3, Law 006 partial, 003 rejected as recognition | **Full** |
| R4 Order/frame visibility | P4, Law 007 split | **Full** |
| I8 Lag explicit | Not a principle; operational note (D-013) | **Consistent** |
| I9 Structural Reading | Supports P2, P4; not separate runtime law | **Consistent** |

**Divergence:** Candidate 001 and 003 **over-interpret** runtime render behaviours as ontological events. Pass 2 falsification corrects this.

---

## Rejected principles

| ID | Statement | Reason |
|---|---|---|
| RL-001 | Stable participation condenses into new participants | Runtime does not create structure; condensation is observational |
| RL-003 | Compression is recognition | D-011/D-010A: render budget + mass cull |
| RL-004 | Compute follows participation | Implementation optimisation; Constitution replaceability |
| RL-007b | Order validates runtime transformation | No runtime mutation; order modulates visibility only |

---

## Merged principles

| Sources merged | Result |
|---|---|
| Laws 005, 006 (partial), R2 | **P2** Movement → retraceable relation events |
| Laws 006 (partial), 007 (partial), R3, R4 | **P3** Ratio from carrier structure |
| Laws 007 (visibility), R4 | **P4** Order/frame → visibility |
| Laws 001, 003 (factual render), R1 | **P1** Structure invariant; translate only |

---

## Unknown (not promoted)

| Item | Blocker |
|---|---|
| Law 002 — state before identity | Carry/Carrying analogy strong; "participation" not formalised |
| Full Carry–Ark transformation preservation | Atlas prose yes; Ark runtime retired; Field partial |
| Single-word name for recursive mechanic | Convergence descriptive, not Atlas term |

---

## Confidence table

| Item | Confidence | Notes |
|---|---|---|
| P1 Structure invariant | **High** | Contract + D-010A + Constitution |
| P2 Retraceable movement | **High** | Events + Structural Reading + D-012 |
| P3 Ratio from carriers | **High** | field-maturity + D-010B + Atlas Ratio |
| P4 Order/frame visibility | **Medium–high** | Runtime clear; Atlas governance overlap |
| One recursive mechanic | **Medium** | Synthesis across surfaces |
| Rejection of Laws 001, 003, 004 | **High** | D-011 classifications decisive |
| Ark as runtime principle source | **Rejected** | 410 retired |

---

## Implementation check

| Area | Modified? |
|---|---|
| Atlas | **No** |
| Runtime code | **No** |
| Calibration | **No** |
| Structural Reading | **No** |
| Behaviour retrace | **No** |

Deliverables: this report + `RUNTIME_PRINCIPLES.md` only.

---

## Architectural intent — response

The Observatory is discovering the **smallest translation philosophy** the evidence already supports:

- **Simpler:** four principles, one recursive read, one relation vocabulary, one pipeline (D-010A).
- **Not simpler by assertion:** rejected laws that mistook render behaviour for ontology.
- **Future implementation:** extend translation of structure (D-012 retrace model), avoid bespoke term branches (`bespokeRule`).

---

## Acceptance

| Criterion | Status |
|---|---|
| Every candidate challenged | **Pass** (7/7) |
| Evidence and contradiction separate | **Pass** |
| Duplicates merged | **Pass** |
| Unsupported remain unknown | **Pass** |
| Implementation unchanged | **Pass** |
| Smallest coherent philosophy characterised | **Pass** (4 principles / 1 recursive mechanic) |

---

## Unresolved questions (for steward)

1. Should "participation" become a formal practice primitive, enabling Law 002 review?
2. Should `atlas_version` sync track repository commits automatically (operational, D-013)?
3. Does Calculus promotion require a separate commission before any principle becomes Calculus?

---

**Status:** D-014 complete. Seven candidates falsified or merged; four principles survive in `RUNTIME_PRINCIPLES.md`; one recursive mechanic characterised from evidence.
