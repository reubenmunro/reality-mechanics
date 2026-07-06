# P-007 — Operational Calculus Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new public surfaces, no new operators)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-006 (`docs/reports/P-006-weaving-operation-investigation.md`)  
**Core hypothesis (tested):** Reality Mechanics does not begin with nouns. It derives stable conditions from operations. **Operations first. Conditions follow.**

**Method:** Atlas `needs` / `conditions` / `structure`, `atlas-structure-contract.mjs`, C-001/C-C000/C-C000A calculus reports, Theory postulate. No new primitives invented.

---

## Verdict

| Question | Result |
|---|---|
| Recommendation (§9) | **Operational calculus is partial** |
| Are commission operator families the primitives? | **Partial** — they are **one layer** among three operator strata |
| Independent or derived? | **Mostly derived** — few primitives; long dependency spine |
| Weaving = compound simultaneous supportability? | **Yes** (P-006) |
| Fabric = stable condition when compound holds? | **Yes** |
| Formal unified calculus ready? | **No** — rich fragments, unreconciled “operation” senses |

**Bottom line:** Reality Mechanics **already performs** an operational calculus through **declared structure operators** (`RELATION_FIELDS`), **carrier enactment** (Carry/Carrying, Trace/Retracing), and **practice runtime** (Ark Run). It is **not yet** one formal system. Moving from term Atlas toward operational calculus is **supported in principle** without new primitives — but requires **reconciling operation senses** (C-C000A) before promotion.

---

## 1. Operator inventory

### 1.1 Three operator strata (repository evidence)

Reality Mechanics does **not** store all operations in one list. Evidence shows **three strata**:

| Stratum | Members | Mechanism | Role |
|---|---|---|---|
| **A — Structure operators** | `holds`, `traces`, `carries`, `pairs`, `nests`, `reads` | `RELATION_FIELDS` on every entry | Declared relation facts (L1) |
| **B — Carrier / enactment** | Hold, Carry, Trace; Carrying, Tracing, Retracing; Read | Atlas terms + `needs` spine | Availability → enactment → recognition |
| **C — Locating / resolving** | Boundary, Availability, Strain, Bearing, Resolution; Place; Determine | Operational Condition class + `kind: operation` | Act on located distinction |

**Commission families map primarily to Stratum A + B:**

| Commission | Atlas nouns | Enactment (-ing) | Structure field |
|---|---|---|---|
| hold / holding | **Hold** | (prose only) | `holds` |
| carry / carrying | **Carry** | **Carrying** | `carries` |
| trace / tracing / retracing | **Trace** | **Tracing**, **Retracing** | `traces` |
| pair / pairing | **Pair** | (prose only) | `pairs` |
| nest / nesting | **Nesting** | — | `nests` |
| read / reading | **Read** | (prose only) | `reads` |
| place / placing | **Place** (`kind: operation`) | Placement Mode (sorting) | — |

**Additional operator classes (not in commission list but load-bearing):**

| Class | Members | Cite |
|---|---|---|
| **Operational Condition** | Boundary, Availability, Strain, Threshold, Bearing, Resolution | `Operational Condition.md` |
| **Operation Carrier** | Apparent, Trace, Read, Orientation | `Operation Carrier.md` |
| **Practice operations** | Determine, Check, Step | Ark Run (`C-001`) |
| **Compound (process language)** | **Weaving** | P-006 — not a term |

### 1.2 Noun vs operation vs term (commission distinction)

| Category | Definition | Examples |
|---|---|---|
| **Operation** | What is carried out / declared / enacted | `carries` edge, Carrying, Place, Determine |
| **Condition** | What becomes stably readable | Hold, Coupling, Thread, Pressure |
| **Term** | Named readable condition in Atlas | Any published entry |
| **Behaviour** | Operation expressed through time / frame | L4 rhythms, overlay traversal |
| **Appearance** | Rendered consequence | L6 fabric face, condensation |

**Atlas rule (clearest operation → product statement):**

> Determine names the **operation**; Determination names the temporary hold **produced by** the operation. (`Determine.md`)

Same pattern: Carry (availability) → Carrying (enactment); Trace (availability) → Retracing (enactment).

---

## 2. Dependency order between operators

### 2.1 Primitive floor

| Item | Status |
|---|---|
| **Relation** | Primitive — no prior `needs` |
| **Connection** | First placed passage from Relation |
| **Bounded Asymmetry → Boundary** | Locating spine begins |

Everything in the commission list **derives** from Relation + resolution/carrying spine.

### 2.2 Carrier spine (must hold before enactment)

```text
Resolution
  → Hold (supportability)
  → Connection (Relation holding between conditions)
  → Carry + Trace (forward / backward availability on same connection)
  → Carrying / Retracing (enactment — participant or process enters)
  → Read (recognition)
  → Thread (followable continuity)
```

**Ordering rules (Atlas text):**

| Rule | Source |
|---|---|
| Hold does not finish before Carry begins | `Hold.md`, `Carry.md` |
| Same connection offers Carry forward and Trace backward | `Carry.md`, `Trace.md`, `Carrying.md` |
| Trace does not finish before Read begins | `Read.md` |
| Carrying pairs Retracing | `Carrying.md`, `Retracing.md` |

### 2.3 Structure operators (declared, not enacted)

```text
Coupling (+ Resolved Asymmetry, Carrying)
  → Pair (bounded two-read)
Participation + Recurrence + Field of Participation
  → Nesting
[Any term]
  → declares holds / traces / carries / pairs / nests / reads targets
```

### 2.4 Convergence (condition collapse)

```text
Nested Relation + Form
  → Structural Gathering
  → Fabric (held whole)
  → Web (crossing trace within whole)
```

### 2.5 Practice calculus spine (C-001)

```text
Pressure → Trace → Check → Determine → Step   (Ark Run)
```

Parallel first-order operational spine:

```text
Boundary → Availability → Strain → Bearing → Resolution
```

These are **different grains** (practice vs first-order) — not merged in repo today (C-C000A).

---

## 3. Primitive vs derived operators

### 3.1 Answers — Questions 1–2

| Q | Answer |
|---|---|
| 1. Current operational primitives? | **Not only the commission list.** Primitives are **Relation** + **structure operator fields** + **operational spine** fragments. Commission families are **derived carriers** and **declared fields**. |
| 2. Independent or derived? | **Mostly derived.** Carry/Trace need Hold+Connection. Carrying needs Carry. Pair needs Coupling. Thread needs Term+Trace+Read. Nesting needs field participation. |

### 3.2 Primitive vs derived table

| Operator / field | Primitive? | Derives from |
|---|---|---|
| Relation | **Yes** (primitive) | — |
| `holds`/`traces`/`carries`/`pairs`/`nests`/`reads` | **Primitive at structure layer** | Relation-declared facts |
| Hold | Derived | Resolution |
| Carry, Trace | Derived | Hold + Connection |
| Carrying | Derived | Hold + Carry |
| Retracing, Tracing | Derived | Trace + Practice |
| Read | Derived | Trace |
| Thread | Derived | Term + Trace + Read |
| Pair | Derived | Coupling + Readability + Closure Scope |
| Nesting | Derived | Participation + Recurrence + Field |
| Place | Derived | Relation (`first.place`) |
| Boundary…Resolution | Derived | Bounded Asymmetry chain |
| Weaving | **Compound** (process) | Simultaneous A-stratum + B-stratum supportability |
| Fabric, Web | **Conditions** (results) | Structural Gathering + convergence |

---

## 4. Composition rules

### 4.1 Which operations combine

| Composition | Rule | Evidence |
|---|---|---|
| **Carry + Trace** | Same connection, opposite direction — **one relation, two availabilities** | `Carrying.md`; STEWARDSHIP_V1 carry/trace unity |
| **Carry + Trace simultaneous** | Locates nesting position / bearing | `Nesting.md` construction read |
| **holds + carries + traces + pairs + nests** | Joint declaration on terms — **weaving substrate** | `RELATION_FIELDS`; P-006 |
| **Coupling + Nesting** | Connected **and** depth-ordered participation | `Nesting.md` |
| **Pair + Coupling** | Pair is scoped read **of** coupling | `Pair.md` |
| **Read + Ratio** | Ratio readable under frame | `Ratio.md`, `READING_ORDER` |
| **Multiple structure fields + ratio** | **Weaving** (compound supportability) | P-006 |
| **Structural Gathering + Fabric** | Many relations → one arrangement → woven whole | `Structural Gathering.md` |

### 4.2 Answers — Questions 3–4

| Q | Answer |
|---|---|
| 3. What must hold before another operation? | See §2. **Hold before carry/trace enactment; Coupling before Pair; field participation before Nesting; Fabric-convergence needs Thread + Field Relationships + Nested Carrying + Surface + Trace** (`Fabric.md` `needs`). |
| 4. When do operations reinforce? | When **bidirectional availability** (carry+trace), **coupling+nesting**, **declared multi-field structure**, and **ratio readability** align — weaving succeeds toward Fabric/Web reads. |

### 4.3 Formal composition sketch (not promoted calculus)

```text
Weaving(S) ≡ ∀ e ∈ declared_edges(S):
  hold(e) ∧ carry_avail(e) ∧ trace_avail(e)
  ∧ ratio_readable(S)
  ∧ coupling_crossings_supportable(S)
  ∧ nesting_depth_locatable(S)

Fabric_read(S) ≡ weaving(S) ∧ structural_gathering(S) ∧ convergence(S)
Web_read(S) ≡ fabric_read(S) ∧ crossings_navigable(S)
```

Process language only — **not** a new operator or `:` calculus.

---

## 5. Failure modes

### 5.1 Interference and collapse

| Q | Answer |
|---|---|
| 5. When do operations interfere? | See table below |
| 6. When do operations collapse to stable condition? | Resolution→Hold; Determine→Determination; Gathering→Fabric; successful weaving reads |

| Failure mode | Conflict | Evidence |
|---|---|---|
| **Decoupling** | Coupling mutual availability lost | `Decoupling.md` pairs Coupling |
| **Release vs Hold** | Supportability ends | `Hold.md` pairs Release |
| **Flat participation** | Connection without nesting — no depth | `Nesting.md` |
| **Detached nesting** | Nesting without coupling | `Nesting.md` |
| **False pair** | No shared traceable carrier | `Pair.md` |
| **Read distortion** | Read alters relation entered | `Read.md` |
| **unexpected_ratio** | Movement without declared edge | `STRUCTURAL_EVENT_TYPES` |
| **Overload / incompatible pressure** | Pressure beyond carrier band | `Pressure.md` |
| **Source Drift** | Hidden/invisible bearing unaccounted | `Source Drift.md` |
| **Ungrounded Fabrication** | Form without trace | `Ungrounded Fabrication.md` |
| **Layer collapse** | Appearance pretends to be structure | P-003, D-017B |

| Stable collapse (operation → condition) | Product |
|---|---|
| Boundary act | Located distinction |
| Determine | Determination (temporary hold) |
| Asymmetry → Bearing | Operative carrying (parallel pattern) |
| Nesting → Nested Carrying | Operative nested bearing |
| Weaving (compound) | **Fabric** / **Web** reads |

---

## 6. Relationship to weaving / fabric / web

| Item | Calculus role |
|---|---|
| **Weaving** | **Compound operation** — joint supportability of structure + carrier operators under ratio (P-006). **Not** a calculus primitive. |
| **Fabric** | **Stable condition** — readable when weaving succeeds (“woven continuity… held whole”) |
| **Web** | **Stable pattern condition** — crossings followable within fabric |
| **Thread** | **Intermediate condition** — followable continuity before whole-fabric read |

### Answers — Questions 7–8

| Q | Answer |
|---|---|
| 7. Does weaving name compound simultaneous supportability? | **Yes** — P-006; Nesting carry+trace read is Atlas-native statement of same composition |
| 8. Does fabric name the stable condition produced? | **Yes** — participle “woven” marks **completed readability**, not process noun |

---

## 7. Relationship to P-003 invariant runtime layers

| Calculus element | P-003 layer |
|---|---|
| Structure operator declarations (`RELATION_FIELDS`) | **L1** declared relation facts |
| `needs` / dependency spine | **L0** structure invariant |
| Ratio register | **L2** |
| Thread, maturity, order reads | **L3** |
| Carrying enactment, rhythms, field bend, weaving composition | **L4** deterministic behaviour |
| Frame / visibility | **cross-cut** |
| Traversal, Ark Run overlay | **L5** |
| Fabric face, web strokes | **L6** appearance |

**Operations first, conditions follow — in runtime:**

1. **L0–L1** declare what operations **may** bind (structure).  
2. **L2–L3** derive readable registers (conditions).  
3. **L4** enacts operator-specific behaviour (Carrying analog).  
4. **L5–L6** observe and render — **do not** author new operations.

---

## 8. Implications for Calculus and Observatory

### 8.1 Calculus (`/calculus`, `PRACTICE_CALCULUS.md`, C-001)

| Finding | Implication |
|---|---|
| Ark Run already **is** a small operational calculus | Document as **practice-grain** calculus alongside structure operators |
| `Order : Structure : Read` **unaccepted** | Do not promote; C010/C-C000A |
| Six “operation” senses unreconciled | **Block** unified calculus until M1–M6 distinguished (C-C000A) |
| RELATION_FIELDS + carrier spine | Candidate **structure-grain** calculus — no new symbols |
| READING_ORDER | **Participant operational sequence** — observation protocol, not invariant layer |

**Future P-commission (not this):** Calculus page could add **operator dependency diagram** (Strata A/B/C) without accepting `:` operator.

### 8.2 Observatory

| Finding | Implication |
|---|---|
| Runtime already implements Stratum A | `FIELD_RELATION_KEYS` + per-type rhythms |
| Weaving = L1–L4 joint effect | O-002 shows **operations** (edge behaviour), not fabric-first decoration |
| Fabric/Web = success reads | Condensation / lattice coherence = **condition collapse** visible |
| Ark Run parallel | Calibration / traversal overlay = L5 enactment trace |

---

## 9. Recommendation

### 9.1 Three-way verdict

| Option | Verdict |
|---|---|
| Operational calculus **fully supported** | **Reject** — operation word inconsistent (C-C000A); `:` unaccepted |
| Operational calculus **partial** | **Accept ✓** |
| Operational calculus **not supported** | **Reject** — contradicted by RELATION_FIELDS, Ark Run, Theory postulate |

### 9.2 What “partial” means

**Supported today (fragments):**

1. **Structure calculus** — `RELATION_FIELDS` + `termRule` in runtime contract  
2. **Carrier calculus** — Hold → Carry/Trace → Carrying/Read → Thread  
3. **Practice calculus** — Ark Run five-step runtime  
4. **Validity calculus** — Theory postulate: relation holds, order carries, trace places  
5. **Composition calculus (informal)** — weaving as simultaneous supportability (P-006)  
6. **Observation calculus** — `READING_ORDER` seven steps  

**Not yet supported (gaps):**

1. Single reconciled definition of “operation” (six senses — C-C000A)  
2. Grain unification (first-order spine vs practice Ark Run vs seven-stage PRACTICE_CALCULUS)  
3. Accepted transformation operator (`:`) between states  
4. Formal inference rules published as canonical law  
5. Pressure as practice first operation (C-A001 unresolved)  

### 9.3 Protected principles

| Principle | Ruling |
|---|---|
| Operations first; conditions follow | **Preserve** — Emergent vs Operational Condition; Determine→Determination |
| Do not freeze operations into objects | **Preserve** — no Weave term (P-006); weaving stays process language |
| Do not invent new primitives | **Preserve** — compose from `RELATION_FIELDS` + existing terms |
| Term Atlas → operational calculus | **Proceed via documentation** — map strata A/B/C; do not edit Atlas |

### 9.4 Smallest next documentation moves (no implementation)

1. Optional `docs/runtime/OPERATIONAL_CALCULUS.md` — three strata, dependency spine, weaving composition ( cites only existing terms )  
2. Cross-link P-007 from `/calculus` manifest when a docs commission authorises  
3. O-002 brief: render **operator enactment** before **fabric condition**  

---

## 10. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-006 | **Met** |
| Operator inventory | **Met** — §1 |
| Dependency order | **Met** — §2 |
| Primitive vs derived | **Met** — §3 |
| Composition rules | **Met** — §4 |
| Failure modes | **Met** — §5 |
| Weaving / fabric / web | **Met** — §6 |
| P-003 mapping | **Met** — §7 |
| Calculus + Observatory implications | **Met** — §8 |
| Recommendation | **Met** — §9 partial |
| No renderer/Atlas/D1/public/new operators | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-006 | `docs/reports/P-006-weaving-operation-investigation.md` |
| P-005 | `docs/reports/P-005-weave-fabric-investigation.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| C-001 | `docs/reports/C-001-practice-calculus-derivation.md` |
| C-C000 | `docs/reports/C-C000-operation-characterisation.md` |
| C-C000A | `docs/reports/C-C000A-operation-consistency-audit.md` |
| Contract | `atlas-structure-contract.mjs` |
| Theory | `Reality_Mechanics/Theory.md` |
| Atlas | `Hold.md`, `Carry.md`, `Trace.md`, `Carrying.md`, `Read.md`, `Nesting.md`, `Pair.md`, `Place.md`, `Operational Condition.md`, `Operation Carrier.md`, `Fabric.md`, `Web.md` |

---

**Status:** P-007 complete. **Operational calculus is partial** — composable from existing operators without new primitives; unified formal promotion blocked until operation senses reconcile.
