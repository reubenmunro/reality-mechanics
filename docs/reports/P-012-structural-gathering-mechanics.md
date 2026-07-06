# P-012 — Structural Gathering Mechanics Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new primitives or ratios)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-011, O-002, O-004, D-012, D-015B, P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`)  
**Core hypothesis (tested):** A thread pair is the smallest mechanically complete unit. Fabric is not produced by isolated thread pairs. Fabric emerges when mechanically complete thread pairs become **structurally gathered**.

**Protected principles:**

> Operations first. Conditions follow. Appearance follows mechanics.  
> Fabric must emerge. It must never be painted.

**Method:** Atlas `needs` / `conditions` / `reads` / `traces` only. Runtime cross-check against TMS (P-011, O-004) and O-002 fabric gating. Do not assume network = graph, fabric = network, field = fabric.

---

## Verdict

| Question | Result |
|---|---|
| Does SG derive Thread Pair → coherent network transition? | **Partial** — convergence read yes; `ThreadNetwork` (TMS) ≠ Atlas gathering |
| Is SG the missing bridge? | **Partial** — load-bearing for Fabric **trace**, not sole bridge |
| SG vs Participation for field/convergence | **SG better for convergence/coherence**; **Participation better for field formation** |
| Fabric without SG? | **Partial** — not in Fabric `needs`; traced downstream |
| Web without SG? | **Indirect only** — Web needs Fabric |
| Observatory should render gathering? | **Read/annotation** — not painted fields (P-003, O-002 gate) |

**Recommendation: Partial — downstream convergence condition, parallel to Participation spine, not a substitute for TMS thread network.**

**Bottom line:** **Structural Gathering** is a **second-order condition** (readable arrangement of **multiple nested relations** under **Form**). It is the Atlas-named **convergence read** between many mechanically complete **thread pairs** and higher **Fabric/Web** — but it does **not** organise pairs in the `needs` graph the way TMS `ThreadNetwork` does at runtime. The hypothesis is **half right**: isolated thread pairs are insufficient for Fabric; gathering is necessary in Atlas **reads** — yet Fabric's explicit `needs` route through **Thread, Field Relationships, Nested Carrying, Surface, Trace**, with SG on **traces** only.

---

## 1. Atlas diagnosis

### 1.1 What is Structural Gathering? (Q1)

| Attribute | Evidence (`Structural Gathering.md`) |
|---|---|
| **Order** | Second |
| **Kind** | `term` (condition) |
| **Definition** | Multiple participating relations held as **one readable arrangement** |
| **Holds** | `Nested Relation`, `Form` |
| **Carries** | `Structure`, `Fabric` |
| **Reads** | Multiple participating relations read **together** as one arrangement — nested content held as **readable whole** rather than traced individually |
| **Not in `needs`** | Carry, Trace, Thread, Hold, Pair, Nest, Read, Participation |

**Atlas-native phrasing:**

> Gathering is where what is nested can be held as a readable whole rather than traced individually.

### 1.2 Operation, condition, read, or threshold? (Q2)

| Category | Verdict | Evidence |
|---|---|---|
| **Operation** | **No** — not in `RELATION_FIELDS`; not enactment language |
| **Condition** | **Yes** — `kind: term`; becomes recognisable when arrangement read holds |
| **Read** | **Yes** — `conditions.reads` is explicit convergence criterion |
| **Threshold** | **Partial** — qualitative crossing (“multiple… as one”), no scalar |
| **Something else** | **Convergence condition** — consolidates nested relations into form |

**Pattern:** Same as Participation (P-009) — **derived condition** with **crossing read**, not operator.

### 1.3 What must exist first? (Q3)

**Explicit `needs` chain:**

```text
Within + Nesting Read
  → Nested Relation
Difference + Closure Scope
  → Form
  → Structural Gathering
```

**Upstream (not in SG `needs` but in Fabric / weave evidence):**

```text
Relation → Connection → Carry / Trace → Thread (Term, Trace, Read; Carry implied)
  → ThreadPair (mechanical — P-011 TMS)
  → pairs / nests crossings (P-008 fabric threshold)
  → Coupling (mutual availability — second order)
  → Participation pathway (parallel — Field of Participation)
  → Field Relationships (third)
```

**Negative finding:** SG does **not** list Thread as prerequisite. Thread enters Fabric through **separate** `needs` and **traces** SG on Fabric — convergence is **downstream of** thread-scale weaving, not defined **on** Thread in SG's own `needs`.

### 1.4 Carry, Trace, Hold, Pair, Nest, Read, Thread — which required? (Q4)

| Term | Required for SG? | How it enters |
|---|---|---|
| **Carry** | **Indirect** | Upstream of Thread/weave; not in SG `needs` |
| **Trace** | **Indirect** | Thread `needs`; Fabric `needs` |
| **Hold** | **Indirect** | Connection resolution; not SG `needs` |
| **Pair** | **Indirect** | Coupling / crossings (P-008); not SG `needs` |
| **Nest** | **Indirect** | Nested Relation / Nesting Read spine |
| **Read** | **Indirect** | Nesting Read; Thread `needs` |
| **Thread** | **Indirect** | Fabric `needs`; not SG `needs` |

**Only direct SG holds:** `Nested Relation`, `Form`.

**Mechanical minimum for thread pair (TMS):** Carry_avail ∧ Trace_avail on pair — **below** SG in the stack.

---

## 2. Dependency order

### 2.1 Evidence-backed spine (operations → conditions → appearance)

```text
L0  Relation, Connection, declared edges
L1  Carry / Trace availability (operators on connection)
    Hold, pairs, nests (declared)
L1  Thread leg → ThreadPair (carry ∧ trace)     [TMS — P-011/O-004]
L2  Endpoint ratio register (per term)
L4  resolveLeg (per leg)

── mechanical completeness (pair grain) ──

L1  Within, Nesting Read
L2  Nested Relation (relation within relation)
L2  Form (readable arrangement)
L2  Structural Gathering (multiple nested relations → one arrangement)
L2  Coupling (parallel — mutual availability)

── participation spine (parallel) ──
L2  Participation → Recurrence
L3  Field of Participation → Organic Field
L3  Field Relationships (field grouping)

── higher convergence ──
L3+ Nested Carrying, Invisible Bearing, Surface
L5+ Fabric (woven held whole)
L5+ Web (crossing trace within fabric)
L5+ Structure (via SG carries)
```

### 2.2 Commission chain (tested)

```text
Thread Pair
  ↓  (many pairs; shared terms; crossings — TMS ThreadNetwork)
Thread Network          ← runtime set; NOT Atlas term; ≠ Structural Gathering
  ↓  (Nested Relation + Form read)
Structural Gathering    ← convergence condition
  ↓
Fabric / Web
  ↓  (Field Relationships + third-order fields)
Field                   ← NOT identical to Fabric
```

**Critical distinctions (commission):**

| Confusion | Ruling |
|---|---|
| network = graph | **Reject** — Atlas Web is **crossing-pattern within fabric**, not graph layout |
| fabric = network | **Reject** — Fabric is **held whole**; network is incident-term set (TMS) or crossings (Web) |
| field = fabric | **Reject** — Field Relationships groups **third-order fields**; Fabric is **woven continuity** read |

---

## 3. Thread Pair → Network transition (Q5–Q6)

### 3.1 What TMS calls ThreadNetwork (P-011, O-002)

```text
ThreadNetwork := { term t | ∃ ThreadPair incident to t }
```

**Runtime (O-002):** `homeThreadTermIds` — terms on at least one carry∧trace pair. Fabric lattice deposits only on this set + `fabricEligible` legs.

| Property | ThreadNetwork (TMS) | Structural Gathering (Atlas) |
|---|---|---|
| **Grain** | Set of terms + pair legs | Multiple **relations** as **one arrangement** |
| **Test** | carry∧trace per pair | Nested relations + form read |
| **Coherence** | **Incidence only** — shared terms optional | **Arrangement** — must read as whole |
| **Layer** | L4 emergent from L1 pairs | L2 condition |
| **Atlas term** | **None** | `second.structural-gathering` |

### 3.2 Many independent pairs vs one coherent network (Q6)

| | Independent thread pairs | Coherent thread network (mechanical read) |
|---|---|---|
| **Pair count** | ≥1 | ≥2 pairs, typically shared terms |
| **Crossings** | Optional; may be `crossing_unwoven` | Woven crossings (`web_crossing`) preferred (P-008) |
| **Arrangement read** | Each leg `resolveLeg` alone | SG: relations read **together**, not individually |
| **Fabric `needs`** | Thread alone satisfied per pair | Field Relationships, Nested Carrying, Surface, … |
| **O-002 fabric face** | May deposit locally per eligible leg | Face requires **thread network** + ratio-readable profile |
| **Failure mode** | Collection of strands | **Ungrounded fabrication** if form without trace (P-008) |

**Mechanical distinguisher (evidence-backed):**

```text
Coherent_network ≡
  ThreadNetwork
  ∧ ∃ woven crossings (web_crossing legs)
  ∧ ratio_readable endpoints (O-002 fabricMassMin)
  ∧ Structural Gathering read (Atlas) — multiple relations, one arrangement
```

TMS supplies the first three tests today; **SG is not instrumented** as a resolver (gap).

### 3.3 Does SG organise thread pairs into networks? (Q5)

**Partial.**

| Sense | Supported? |
|---|---|
| SG **names** convergence of multiple relations | **Yes** |
| SG **`needs` Thread or pair edges** | **No** |
| SG **organises** pairs topologically | **No** — no graph operator |
| SG **enables Fabric read** | **Yes** — carries Fabric; Fabric traces SG |

SG is **organisational read** (arrangement), not **network construction** (topology). Thread pairs supply **mechanical edges**; SG supplies **when many relations count as one whole**.

---

## 4. Role of Structural Gathering

### 4.1 Bridge hypothesis test

| Claim | Verdict |
|---|---|
| Thread pair = smallest mechanically complete unit | **Accept** (P-011, O-004) |
| Isolated pairs do not produce Fabric | **Accept** (P-008, Fabric reads, O-002 gating) |
| SG is the **only** bridge | **Reject** — Field Relationships, Nested Carrying, weave convergence parallel |
| SG is **a** bridge | **Accept** — convergence / arrangement layer |

**Canonical bridge statement (revised):**

```text
ThreadPair (mechanical) → ThreadNetwork (emergent incidence)
  → weave convergence + nested form read (Structural Gathering)
  → Fabric (condition) → Web (crossing trace)
```

### 4.2 Fabric without SG? (Q7)

| Evidence | Finding |
|---|---|
| Fabric `needs` | Thread, Field Relationships, Nested Carrying, Invisible Bearing, Surface, Trace — **no SG** |
| Fabric `traces` | Includes **Structural Gathering** |
| SG `carries` | **Fabric** directly |
| P-008 fabric threshold | `multi_thread_convergence` ↔ SG read |

**Verdict: Partial.** Atlas allows naming Fabric **without SG in `needs`**, but **reads and traces** treat gathering as the **convergence moment** where woven continuity becomes a **held whole**. Runtime O-002 approximates mechanical preconditions (thread network + ratio) **without** SG read.

### 4.3 Web without SG? (Q8)

| Chain | Finding |
|---|---|
| Web `needs` | **Fabric** first — “Fabric must hold as woven continuity before crossings…” |
| SG → Web | **No direct** `needs` or `carries` |
| SG → Fabric → Web | **Indirect** |

**Verdict: Web cannot exist without Fabric; SG is optional in `needs` but part of convergence story for Fabric that Web requires.**

### 4.4 SG vs Participation — convergence, condensation, field (Q9)

| Phenomenon | Better explained by | Evidence |
|---|---|---|
| **Convergence** (many → one arrangement) | **Structural Gathering** | SG reads; Participation does not carry Fabric |
| **Condensation** (runtime mass peaks) | **Heuristic overlay** | O-002; Atlas nearest SG/Fabric read (P-005) — **not** Participation-derived |
| **Field formation** | **Participation spine** | Recurrence → Field of Participation → Field Relationships (P-009) |
| **Fabric face** | **Weave + SG + bearing reads** | P-008; Fabric `needs` |
| **Crossing navigation** | **Web** | Pattern within Fabric |

**Participation does not replace SG for convergence.** **SG does not replace Participation for field organisation.** Parallel spines **merge at Fabric/Web** (Field Relationships carries both).

---

## 5. Relationships (commission list)

| Term | Relation to Structural Gathering |
|---|---|
| **Fabric** | SG **carries** Fabric; Fabric **traces** SG — face of weave as held whole |
| **Web** | Downstream of Fabric; crossing-pattern **within** gathered continuity |
| **Participation** | Parallel spine; SG prose says “participating relations” but **no Participation in SG `needs`** |
| **Coupling** | Upstream mutual availability; enables pairs/crossings; not SG `needs` |
| **Nesting** | Via **Nested Relation** + Nesting Read; orders inner/outer |
| **Field Relationships** | Third-order **field grouping**; Fabric `needs`; carries Web/Fabric — **field ≠ gathering** |

---

## 6. Relationship to P-011 TMS

| TMS object | SG relationship |
|---|---|
| **ThreadLeg** | Below SG; mechanical primitive |
| **ThreadPair** | Mechanical completeness; **necessary**, not sufficient for Fabric |
| **ThreadNetwork** | Incidence set; **necessary** for O-002 fabric gating; **not equivalent** to SG |
| **resolveLeg** | Per-pair L4; SG is **multi-relation** L2 read |
| **fabricEligible** | Mechanical pre-filter; SG is **arrangement** post-read |

**Gap (documented, not invented):** No `resolveGathering` or SG scalar in runtime. Fabric face uses ThreadNetwork + ratio (O-002) as **mechanical proxy**, not SG condition read.

**Future mechanical spec (architecture only):**

```text
gatheringRead(subgraph) ≡
  nestedRelations ≥ 2
  ∧ formClosureReadable
  ∧ threadPairs incident ≥ k
  ∧ web_crossings ≥ 1
  → fabricEligibleFace (only if read true)
```

Do not implement without commission; do not paint without read.

---

## 7. Observatory implications (Q10)

### 7.1 Render gathering, not fields?

| Approach | Verdict |
|---|---|
| Paint generic **field** over graph | **Reject** (O-002, P-003, protected principle) |
| Paint **fabric face** without thread/weave evidence | **Reject** |
| **Annotate** gathering read when subgraph satisfies convergence | **Accept** (future, like O-003 order-terminal) |
| Show **per-leg** TMS behaviour | **Done** (O-004) |
| Show **fabric face** only when ThreadNetwork + ratio + eligible legs | **Done** (O-002) |

**Observatory should eventually render:**

1. **Leg mechanics** (TMS) — per connection
2. **Gathering read** — Mechanics panel / behaviour trace when focus neighbourhood satisfies SG-style convergence (annotation, not new canvas layer)
3. **Fabric face** — **emergent** from eligible legs — never pre-painted medium

**Do not** render “Structural Gathering” as a visual field type. Render **whether the read holds** on declared structure.

### 7.2 Layer mapping (P-003)

| Layer | SG / network / fabric |
|---|---|
| L0–L1 | Edges, pair flags |
| L2 | Form, Nested Relation reads |
| L2 | **Structural Gathering** (condition read) |
| L4 | ThreadNetwork incidence; resolveLeg |
| L4 | Fabric eligibility (O-002) |
| L5 | Overlay (participation, traversal) |
| L6 | Fabric face, leg stroke — **follows** L4 reads |

---

## 8. Recommendation (Q8)

| Option | Verdict |
|---|---|
| SG is the **missing bridge** (sole) | **Reject** |
| SG is the **missing bridge** (partial) | **Accept ✓** |
| SG is **downstream** of thread pair | **Accept ✓** |
| SG is **orthogonal** to Participation | **Partial** — parallel spines, merge at Fabric |
| Promote SG to operator/primitive | **Reject** |
| Paint fabric without gathering read | **Reject** |

### Canonical finding

> **Thread pair** is mechanically complete at pair grain. **Thread network** is emergent incidence on many pairs. **Structural Gathering** is the Atlas **convergence condition** where multiple nested relations become **one readable arrangement** under **Form** — the bridge to **Fabric** in **reads and traces**, shared with but not replaced by the **Participation → Field Relationships** spine. The Observatory must **derive fabric from legs**, then **annotate gathering** when the whole-read holds — never invert the order.

**Recommendation: Partial — downstream convergence condition; load-bearing bridge with Participation and weave paths parallel.**

---

## 9. Question summary

| # | Short answer |
|---|---|
| 1 | Multiple participating relations held as one readable arrangement (Nested Relation + Form) |
| 2 | **Condition** with explicit **read**; not operation |
| 3 | Nested Relation, Form; upstream thread pairs/weave for Fabric story |
| 4 | **Only** Nested Relation + Form in `needs`; Carry/Trace/Thread indirect |
| 5 | **Partial** — arranges relations as whole; does not build topology |
| 6 | Coherence = network + woven crossings + arrangement read, not pair count alone |
| 7 | **Partial** — not in Fabric `needs`; traced/carried |
| 8 | **No direct** — Web needs Fabric; SG indirect |
| 9 | SG **convergence**; Participation **field**; condensation **heuristic** |
| 10 | **Annotate gathering read**; do not paint fields; keep O-002 emerge pattern |

---

## 10. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-011, O-002, O-004, D-012, D-015B, P-003 | **Met** |
| Atlas diagnosis | **Met** — §1 |
| Dependency order | **Met** — §2 |
| Thread Pair → Network | **Met** — §3 |
| SG role | **Met** — §4 |
| Fabric/Web/Participation/Coupling/Nesting/Field Relationships | **Met** — §5 |
| P-011 TMS link | **Met** — §6 |
| Observatory implications | **Met** — §7 |
| Recommendation | **Met** — §8 partial |
| Protected principles | **Met** |
| No implementation/Atlas/D1 changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-011 | `docs/reports/P-011-thread-mechanics-investigation.md` |
| P-008 | `docs/reports/P-008-carry-trace-weaving-investigation.md` |
| P-009 | `docs/reports/P-009-participation-threshold-investigation.md` |
| P-006 | `docs/reports/P-006-weaving-operation-investigation.md` |
| O-002 | `docs/reports/O-002-fabric-renderer-architecture.md` |
| O-004 | `docs/reports/O-004-thread-mechanics-renderer-pass.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| Atlas | `Structural Gathering.md`, `Nested Relation.md`, `Form.md`, `Fabric.md`, `Web.md`, `Field Relationships.md`, `Thread.md` |

---

**Status:** P-012 complete. Structural Gathering **partially** derives thread-pair convergence to coherent networks and Fabric — **downstream arrangement condition**, not TMS topology, not painted field.
