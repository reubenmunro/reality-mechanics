# P-008 — Carry / Trace / Weaving Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new public surfaces, no Weave term/primitive)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-007 (`docs/reports/P-007-operational-calculus-investigation.md`)  
**Core hypothesis (tested):** Weaving is **carrying that remains traceable** — the compound operation where carrying and tracing stay mutually available across coupled and nested relations. This may be the threshold where continuation becomes **fabric** rather than **drift**.

**Protected principle:**

> A system that carries forward but cannot retrace **drifts**.  
> A system that can retrace but cannot carry becomes **archive**.  
> **Fabric requires both.**

---

## Verdict

| Recommendation | Result |
|---|---|
| §7 verdict | **Confirm hypothesis — with revision** |
| Carry + Trace = weaving core? | **Yes** — strongest structural evidence in repository |
| Carry + Trace = minimum for Thread? | **Partial** — Trace explicit; Carry implicit via followability chain |
| Carry + Trace alone = Fabric? | **No** — necessary, not sufficient; convergence + coupling/nesting + ratio required |
| Weaving remains process language? | **Yes** — compound of existing operators; no new term |

**Revision:** Weaving is not *only* Carry + Trace. It is **mutual supportability of forward carry and backward trace on the same held connections**, plus **ratio-readable constraint**, and — for **fabric** threshold — **coupled/nested crossings** converging through Structural Gathering. The commission’s short form (“carrying that remains traceable”) is **accurate as the core**; the full form adds pairing, nesting, and convergence.

---

## 1. Carry / Trace dependency diagnosis

### 1.1 Unified connection, two availabilities

| Term | Role | Layer |
|---|---|---|
| **Hold** | Resolution remains supportable | L0–L1 |
| **Connection** | Relation holding between distinguishable conditions | L1 |
| **Carry** | Forward availability of held connection | L1 availability |
| **Trace** | Backward availability of held connection | L1 availability |
| **Carrying** | Forward enactment through connection | L4 enactment |
| **Retracing / Tracing** | Backward enactment (practice) | L4/L5 enactment |

**Atlas unity statement** (`Carrying.md`):

> Carrying does not create a separate relation from trace. The same connection that carries forward offers Trace backward.

**Pairing** (`Carry.md` / `Trace.md`):

> Carry pairs with Trace. Forward availability / backward availability of the **same** held connection.

**Structure mirror:** `carries` and `traces` are separate `RELATION_FIELDS` on terms — declared forward and backward bindings on the same graph.

### 1.2 Dependency spine

```text
Relation
  → Connection
  → Hold
  → Carry  ─┐
  → Trace  ─┴─ same connection (bidirectional availability)
  → Carrying / Retracing (enactment)
  → Read (recognition — needs Trace)
  → Thread (followable continuity — needs Term, Trace, Read)
```

**Read** explicitly needs **Trace** only (`Read.md`). Forward continuation enters through **Read’s participation in carried relation** and through **Carrying** upstream — Carry is not in `Thread.needs` but is **structurally presupposed** by “followable” continuity.

### 1.3 Commission distinctions (tested)

| Term | Atlas meaning |
|---|---|
| **Carry** | Forward availability / continuation path offered |
| **Trace** | Backward recoverability / return path offered |
| **Thread** | Followable continuity while same read holds |
| **Weaving** | Compound: carry + trace **mutually supportable** on declared connections under ratio |
| **Fabric** | Held whole when weaving **succeeds** at convergence scale |
| **Web** | Navigable crossing-pattern **within** fabric |
| **Drift** | Continuation without accountable retrace (Source Drift, Degenerative Trace) |
| **Dead archive** | Record/retrace without re-enterable carry (Generative Trace contrast) |

---

## 2. Minimum condition for Thread

### 2.1 Explicit Atlas `needs` (`Thread.md`)

```text
Thread holds: Term, Trace, Read
```

| Question | Answer |
|---|---|
| Q1. Carry + Trace as **minimum** for Thread? | **Partial.** **Trace is explicit.** **Carry is not listed** but is **structurally required** for “followable” continuity — a thread that cannot continue forward is not a thread. |
| Q2. Thread requires forward + backward? | **Yes for followability.** Backward: Trace in `needs`. Forward: implied by followable read along a length; Carrying/Carry chain upstream. Thread read: “read remains followable across a readable length.” |

### 2.2 Minimum condition (evidence-backed)

```text
Thread_min ≡ Term ∧ Trace ∧ Read ∧ Carry_avail(connection)
```

Where `Carry_avail` is not a fourth `needs` entry but a **dependency consequence** of Connection + Hold + followability. The Atlas encodes this as **Carry ↔ Trace pair** at the connection layer, not as duplicate entries on Thread.

**Negative finding:** Thread can be **named** in structure with `traces` edges and Trace in spine without **live** carry enactment — but it **fails the read** (“followable”) if forward continuation is dead. Minimum for Thread **as readable condition** requires both directions.

---

## 3. Weaving composition test

### 3.1 Core composition (hypothesis core)

```text
Weave_core(S) ≡ ∀ connection c in S:
  Carry_avail(c) ∧ Trace_avail(c) ∧ Hold(c)
```

**Supported by:** Carry/Trace pairing; `Carrying.md`; Nesting construction read (carry + trace **simultaneously** locates bearing); P-006 compound operation; Generate and Regenerate multiplicative trace formula.

### 3.2 Full composition (fabric threshold)

```text
Weave_fabric(S) ≡ Weave_core(S)
  ∧ ratio_readable(S)           [Ratio / L2]
  ∧ coupling_crossings(S)       [pairs / Coupling]
  ∧ nesting_depth(S)            [nests / Nesting — sparse but load-bearing]
  ∧ multi_thread_convergence(S) [Structural Gathering → Fabric]
```

| Question | Answer |
|---|---|
| Q3. Weaving requires Carry + Trace + Pair/Nest under ratio? | **Yes for fabric-scale weaving.** Core weaving is Carry+Trace mutual support; **fabric threshold** adds pairs, nests, ratio, convergence. |
| Q4. Fabric = stable condition when carrying traceable across coupled/nested relations? | **Yes** — `Fabric.md`: “relation carried as woven continuity… whole carries before each thread separately read”; needs Thread, Trace, Nested Carrying, Field Relationships, etc. |
| Q5. Web = navigable crossing-pattern of that fabric? | **Yes** — explicit Fabric/Web pair: face vs trace of weave; Web `needs` Fabric. |

### 3.3 Threshold: fabric vs drift

| Stage | What holds | Read outcome |
|---|---|---|
| Carry only, trace weak | Forward continuation | **Drift risk** (Degenerative Trace, Source Drift) |
| Trace only, carry weak | Record / diagnosis | **Archive risk** (record trace, not generative) |
| Carry + Trace, single thread | Followable strand | **Thread** — not yet fabric |
| Carry + Trace + crossings + ratio + convergence | Mutual support across relations | **Fabric / Web** reads |

**P-008 refinement of P-006:** Weaving is interesting **because** it requires Carry and Trace to remain **simultaneously** available — that is the **load-bearing compound**. Pair/Nest/ratio raise it from **thread** to **fabric**.

---

## 4. Failure modes

### 4.1 Carry without Trace (Q6)

| Symptom | Atlas / practice read |
|---|---|
| Continuation without answerability | **Source Drift** — “carrying taken as source **without retrace**” |
| Carrying after generative loss | **Degenerative Trace** — “carrying continued while contact with generating order was lost” |
| Fluent output, broken dependency | **Ungrounded Fabrication** — coherent form, trace absent/broken |
| Outward extension unmoored | **Extend** — evaluated by whether carrying “remains traceable… or **drifts**” |
| High output / low recoverable trace | **Generate and Regenerate** — `DR = Output / Recoverable Trace`; `0 × P × B × R` = apparent source / drift risk |
| Recursion without retrace | **Recursion.md** — “self-validating **drift**” |

**Commission mapping:** **Drift** — continuation without retrace. Not always total failure — Degenerative Trace preserves *some* trace for diagnosis.

### 4.2 Trace without Carry (Q7)

| Symptom | Atlas / practice read |
|---|---|
| Record without re-entry | **Generative Trace** contrast — “not only a record”; generative trace **seeds continuation** |
| Formula degeneracy | `O × P × B × 0` = **record trace** (`Generate and Regenerate.md`) |
| Retrace without forward seed | **Generative Trace** vs dead record — bridge to “re-enterable carrying process” |
| Recognition without continuation | **Retrace Read** pairs **Recognition Read** — “retrace without recognition has no pattern to return to” (inverse: recognition without carry forward stalls) |
| Archive misuse | **Retrace Practice** — “can use storage or archives, but is **not defined by them**” |

**Commission mapping:** **Dead archive** — retrace without continuation. Trace remains valuable for diagnosis/regeneration but does not weave fabric.

### 4.3 Q8 — Failure taxonomy

| Failure | Carry | Trace | Atlas name |
|---|---|---|---|
| **Drift** | ✓ | ✗ (weak/broken) | Source Drift, Degenerative Trace, AI Drift |
| **False continuity** | ✓ (apparent) | ✗ (displaced) | Ungrounded Fabrication, Apparent Source |
| **Dead archive** | ✗ (no re-entry) | ✓ | Record trace; non-generative trace state |
| **Ungrounded fabrication** | ✓ (form) | ✗ (bearing source) | Ungrounded Fabrication |

**Hidden / Invisible Bearing:** Not failures themselves — but **risk amplifiers**. When bearing is non-presenting (`Invisible Bearing`, `Hidden Bearing`), carry continues while retrace path is **harder to enter** — drift risk if `Higher Retrace` is not available in principle (`Hidden Bearing.md`, `Source Drift.md`).

### 4.4 Structural combination failures

| Mode | Effect | Evidence |
|---|---|---|
| **Coupling without nesting** | Flat participation — direction without depth | `Nesting.md` |
| **Nesting without coupling** | Detached — depth without mutual availability | `Nesting.md` |
| **Fabric without Web** | Whole may hold but crossings not navigable | Fabric read vs Web read (`Web.md`: “crossings remain followable”) |
| **Web without Fabric** | **Cannot satisfy Atlas `needs`** — Web held by Fabric | `Web.md` `needs: [[Fabric]]` |

---

## 5. Relationship to P-007 operational calculus

| P-007 element | P-008 refinement |
|---|---|
| Stratum B (Carry / Trace) | **Bidirectional unity** — weaving’s atomic compound |
| Composition: carry + trace simultaneous | **Central** — Nesting construction read = calculus proof case |
| Weaving = compound supportability | **Specialised** to carry∧trace mutual availability |
| Fabric = condition collapse | Requires **generative** trace, not archive trace |
| Failure modes §5 | Extended with drift/archive taxonomy |

**Operational calculus fragment (informal, not promoted):**

```text
GENERATIVE ≡ Carrying ∧ Trace_avail ∧ (Trace ∧ Return ∧ Read)
DRIFT      ≡ Carrying ∧ ¬Trace_to_source
ARCHIVE    ≡ Trace_record ∧ ¬Carry_reentry
FABRIC     ≡ GENERATIVE ∧ Coupling ∧ Nesting ∧ ratio ∧ convergence
```

Process language only — no new operators (P-007, commission constraint).

---

## 6. Observatory implications

### 6.1 What to render as carrying (Q10)

| Render | Layer | Mechanism today |
|---|---|---|
| Forward continuation along declared `carries` edges | L1 + L4 | `carries` relation type — outward/travel rhythm, forward bead |
| Carrying enactment / traversal | L5 | `fieldMovementEvent`, wake, `relationPressureTraces` deposit |
| Ratio-modulated forward depth | L2→L4 | `continuous` scalar, `carries` rhythm profile |

**Rule:** Carrying render must remain **citable to declared `carries` edges** — no invented forward paths.

### 6.2 What to render as tracing

| Render | Layer | Mechanism today |
|---|---|---|
| Backward recoverability on `traces` edges | L1 + L4 | `traces` relation type — return/wiggle rhythm, pressure memory |
| Retrace / behaviour trace | L4–L5 | `field-behaviour-trace.mjs`, `unexpected_ratio` on undeclared move |
| Dependency visibility | L3 | MCP/retrace panel — not L6 decoration |

**Rule:** Tracing render is **return-path readability**, not dimming unrelated edges.

### 6.3 What appears only when both hold (weaving read)

| Combined read | When |
|---|---|
| **Thread followability** | Same edge set supports forward rhythm **and** return memory |
| **Weaving activity** (process) | Carry_avail ∧ Trace_avail on coupled connections under ratio |
| **Fabric face** | Lattice coherence + condensation — **after** bidirectional support across neighbourhood |
| **Web crossings** | Declared `pairs`/`nests`/`carries`/`traces` jointly navigable without tearing |

**Do not** paint fabric face on:
- `carries`-only subgraph (drift risk),
- `traces`-only subgraph (archive read),
- undeclared proximity.

### 6.4 Failure visibility (instrument, not punishment)

| Signal | Observatory read |
|---|---|
| High carry visual, no trace cite | Flag as **drift risk** (overlay label / calculus vocab) |
| Static structure, no forward traversal | **Archive** mode — valid for proof/history |
| `unexpected_ratio` | Broken weave — movement without declared edge |
| Compression hiding edges | **Invisible bearing** read — structure present, path non-presenting |

---

## 7. Why weaving stays process language (Q9)

| Reason | Evidence |
|---|---|
| Carry + Trace already name the bidirectional unit | Pairing on same connection — no third noun needed |
| Weaving = **simultaneous satisfaction** of existing operators | P-006, P-007 — compound, not primitive |
| Promoting Weave would freeze a **process** into an **object** | Commission principle; D-017B layer-collapse lesson |
| Fabric/Web already name **success conditions** | Outcome terms sufficient |
| Degenerative/Generative Trace name **failure/success of trace-carry balance** | Practice vocabulary covers edge cases |

---

## 8. Question-by-question summary

| # | Question | Answer |
|---|---|---|
| 1 | Carry + Trace minimum for Thread? | **Partial** — Trace explicit; Carry structurally required |
| 2 | Thread needs forward + backward? | **Yes** (followability) |
| 3 | Weaving needs Carry + Trace + Pair/Nest + ratio? | **Yes** for fabric-scale; core is Carry ∧ Trace |
| 4 | Fabric when carrying traceable across coupled/nested relations? | **Yes** |
| 5 | Web = navigable crossing-pattern? | **Yes** |
| 6 | Carry without Trace? | **Drift**, false continuity, degenerative trace |
| 7 | Trace without Carry? | **Archive**, record trace, non-generative |
| 8 | Failure taxonomy? | Drift / false continuity / ungrounded fabrication / archive |
| 9 | Process language not term? | **Yes** |
| 10 | Observatory implications? | §6 — render carry and trace distinctly; fabric only when both hold |

---

## 9. Recommendation

| Option | Verdict |
|---|---|
| **Confirm hypothesis** | **Yes (core)** — weaving is carrying that remains traceable |
| **Revise hypothesis** | **Yes (full form)** — add coupling, nesting, ratio, convergence for fabric threshold |
| **Reject hypothesis** | **No** — Atlas evidence strongly supports |

**Canonical process-language definition (P-008):**

> **Weaving** is the compound operation in which forward **carry** and backward **trace** remain mutually available on the same held connections under ratio-readable constraint, such that continuation stays answerable rather than drifting, and — when coupling and nesting converge — readable as **fabric** with navigable **web**.

---

## 10. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-007 | **Met** |
| Carry/Trace diagnosis | **Met** — §1 |
| Thread minimum | **Met** — §2 |
| Weaving composition test | **Met** — §3 |
| Failure modes | **Met** — §4 |
| P-007 relationship | **Met** — §5 |
| Observatory implications | **Met** — §6 |
| Recommendation | **Met** — §9 confirm + revise |
| Protected principle | **Met** |
| No implementation/Atlas/D1/surface changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-006 | `docs/reports/P-006-weaving-operation-investigation.md` |
| P-007 | `docs/reports/P-007-operational-calculus-investigation.md` |
| P-005 | `docs/reports/P-005-weave-fabric-investigation.md` |
| Atlas | `Carry.md`, `Trace.md`, `Carrying.md`, `Thread.md`, `Fabric.md`, `Web.md`, `Nesting.md`, `Source Drift.md`, `Ungrounded Fabrication.md`, `Generative Trace.md`, `Degenerative Trace.md`, `Generate and Regenerate.md` |

---

**Status:** P-008 complete. **Weaving is structurally grounded as mutual Carry + Trace supportability** — the compound where continuation stays traceable; **fabric** is the convergence read when that holds across coupled, nested, ratio-readable relations.
