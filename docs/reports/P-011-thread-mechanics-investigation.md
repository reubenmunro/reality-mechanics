# P-011 — Thread Mechanics Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new primitives)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-010, D-012 (`docs/reports/D-012-behaviour-retrace-instrument.md`), D-015B (`docs/reports/D-015B-derived-ratio-falsification.md`), P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`)  
**Objective:** Derive the **mechanics of a single declared relation**, treating **thread** as the primary mechanical object of the Observatory. **Ignore appearance (L6).**

**Method:** Atlas terms (`Thread`, `Carry`, `Trace`, `Hold`, `Terminal`, …), runtime modules (`.atlas-publisher/field-behaviour-trace.mjs`, `main-website-worker.js` weave state), falsification constraints from D-015B. No new Atlas primitives.

---

## Verdict

| Question | Result |
|---|---|
| What invariant quantities belong to a thread? | **See §2** — structure edge + pair availability + endpoint L2/L3 reads |
| Which are intrinsic to one thread? | **Edge type, direction, pair carry/trace flags, endpoint scalars at draw time** |
| Which emerge from neighbours? | **Compression budget, field pressure, frame membership, web crossing, fabric network** |
| Which mechanics are reversible? | **Observation transforms, frame toggle, traversal overlay decay** |
| Which permanently change the read? | **Order-terminal crossing, structural edit, drift/archive degeneracy** |
| Can every visual behaviour be thread ratios? | **Partial — reject as universal law** (D-015B) |
| Recommendation | **Adopt Thread Mechanics Specification (§3)** as Observatory mechanical ontology |

---

## 1. Atlas diagnosis — what Thread is mechanically

### 1.1 Atlas Thread (carrier term)

| Attribute | Evidence (`Thread.md`) |
|---|---|
| **Definition** | Followable continuity through a readable length |
| **Holds** | `Term`, `Trace`, `Read` |
| **Carry** | Not in `needs` — **structurally presupposed** for “followable” (P-008) |
| **Complement** | `Terminal` — strand ends where same read cannot continue |
| **Downstream** | `Fabric`, `Web`, `Order-Terminal` |

> Thread is the strand that can be followed **before** the fabric has to be read as a whole.

Atlas Thread is a **readable condition** (noun), not a canvas stroke. Observatory mechanics must not equate thread with pixels (P-005, P-003 L6 rule).

### 1.2 Mechanical Thread (Observatory object)

The runtime already implements a narrower mechanical object (O-002, P-008):

```text
MechanicalThreadPair(A, B) ≡ declared term pair where:
  ∃ carries edge between A↔B  ∧  ∃ traces edge between A↔B
```

This yields two **directed thread legs** on the same pair:

| Leg | Declared edge | Mode (O-002) |
|---|---|---|
| Forward | `carries` | `thread_forward` iff pair has `traces` |
| Return | `traces` | `thread_return` iff pair has `carries` |

**Single declared relation** (one edge) is a **thread leg candidate**, not a full mechanical thread until paired:

```text
RelationEdge := (source, target, type)   type ∈ {holds, traces, carries, pairs, nests}
```

| Single edge | Mechanical read |
|---|---|
| `carries` only | **Drift leg** — forward without accountable return (P-008) |
| `traces` only | **Archive leg** — return without live carry |
| `carries` + `traces` (same pair) | **Thread pair** — mutual availability |
| `holds` | **Anchor leg** — sustained midpoint (rhythm: anchor) |
| `pairs` / `nests` | **Crossing leg** — lateral/enclosure; `web_crossing` if pair woven |

**Specification choice (commission-aligned):** Treat **MechanicalThreadPair** as primary object; treat **RelationEdge** as primitive leg whose mechanics are derived from pair context + endpoints.

### 1.3 Relation to weaving and fabric

| Concept | Mechanical role |
|---|---|
| **Weaving** | Process: mutual Carry∧Trace on held connections (P-006, P-008) — not a quantity |
| **Thread pair** | Minimum woven unit at pair granularity |
| **Web** | Crossing legs (`pairs`/`nests`) **within** woven pair context |
| **Fabric** | Network property: many thread pairs + convergence (P-008) — **emergent**, not single-thread |

---

## 2. Investigation — invariant quantities (Q1)

### 2.1 Quantity inventory

| Quantity | Symbol | Layer | Thread scope | Retrace-stable? |
|---|---|---:|---|---|
| **Edge existence** | `declared(type)` | L1 | Single leg | **Yes** |
| **Source / target ids** | `src`, `tgt` | L1 | Single leg | **Yes** |
| **Relation type** | `type` | L1 | Single leg | **Yes** |
| **Direction** | `dir` ∈ {out, in, return} | L4 read | Single leg | **Yes** (from focus) |
| **Carry availability** | `carryAvail` | L1 pair | Pair | **Yes** |
| **Trace availability** | `traceAvail` | L1 pair | Pair | **Yes** |
| **Hold on pair** | `holdAvail` | L1 pair | Pair | **Yes** |
| **Pair / nest crossing** | `crossAvail` | L1 pair | Pair | **Yes** |
| **Weave mode** | `weaveMode` | L4 derived | Leg | **Yes** (fn of L1 pair) |
| **Carrier in-degree** | `mass.carriers` | L2 | Endpoint | **Yes** |
| **Ratio mode band** | `ratioMode.mode` | L2 | Endpoint | **Yes**† |
| **Ratio scalar** | `ratioMode.x` | L2 | Endpoint | **Yes** |
| **Transition / continuous** | `transition`, `continuous` | L2 client | Endpoint | **Yes**† |
| **Structural mass** | `structuralMass` | L2/L4 | Endpoint / leg blend | **Yes**† |
| **Maturity band** | `maturityBand` | L3 | Endpoint | **Yes** at timestamp |
| **Settledness** | `settledness.score` | L3 | Endpoint | **Yes** at timestamp |
| **Agitation** | `agitation.score` | L3 | Endpoint | **Yes** at timestamp |
| **Order rank** | `orderOf(id)` | L0/L3 | Endpoint | **Yes** |
| **Order distance** | `|orderOf(src) − orderOf(tgt)|` | L3 derived | Leg | **Yes** |
| **Nesting depth** | `nestDepth` | — | — | **Unresolved** — no runtime scalar |
| **Rhythm signature** | `rhythm.mode` | L4 | Leg (type-fixed) | **Yes** (lookup) |
| **Relation mass (leg)** | `(structuralMass_src + structuralMass_tgt) / 2` | L4 | Leg | **Yes** |
| **Frame membership** | `inFrame(id)` | cross-cut | Endpoint | Session |
| **Neighbourhood size** | `localCount` | L4/L5 | Focus context | Session |
| **Field pressure** | `fieldPressure` | L5 | Focus context | Session |
| **Traversal count** | `traversalMap[key]` | L5 | Leg path | Session |
| **Compression limit** | `relationCompressionLimit` | L4 | Focus + fanout | **Yes** given focus mass |

† Threshold config may change band without structure edit (calibrated, P-003 L2 note).

### 2.2 Commission examples mapped

| Example | Spec mapping | Intrinsic? |
|---|---|---|
| carry | `carryAvail` + `carries` leg | Pair + leg |
| trace | `traceAvail` + `traces` leg | Pair + leg |
| structuralMass | Endpoint composite (L2+L3) | Endpoint; blended on leg |
| ratioMode | Endpoint band + expansion | Endpoint |
| maturity | `maturityBand` | Endpoint |
| order distance | `orderOf` delta | Leg derived |
| nesting depth | **No invariant scalar today** | Emergent/unresolved |
| pair state | `pairs`/`nests` edges + `crossAvail` | Pair + leg |

### 2.3 Minimum thread state vector (single leg)

For one `RelationEdge` `(src → tgt, type)` evaluated at mechanical read time:

```text
ThreadLegState := {
  // L1 — intrinsic structure
  src, tgt, type,
  pair: { carryAvail, traceAvail, holdAvail, crossAvail },

  // L2 — endpoint registers (source-primary for ratio-modulated legs)
  srcRatio: { carriers, mode, x, transition, continuous, structuralMass },
  tgtRatio: { … },                                    // optional mirror
  legMass: mean(srcRatio.structuralMass, tgtRatio.structuralMass),

  // L3 — slow parallel reads (endpoints)
  srcMaturity, srcSettledness, srcAgitation,
  orderDistance: |orderOf(src) − orderOf(tgt)|,

  // L4 — leg mechanics (derived, appearance-free)
  weaveMode: f(pair, type),                           // drift|archive|thread_*|web_crossing|…
  rhythm: RHYTHM_SIGNATURES[type],
  ratioConsequence: g(type, srcRatio.transition, srcRatio.continuous),
}
```

**Hold** enters as `holdAvail` and as rhythm `anchor` on `holds` legs — resolution supportability at pair scope (Atlas `Hold`), not a separate mass input.

---

## 3. Thread Mechanics Specification (TMS)

**Status:** Descriptive mechanical contract. Not Atlas. Not renderer. Not physics.

### 3.1 Objects

```text
Term          := L0/L1 node with order, relations, L2/L3 reads
PairKey       := unordered (A, B), A ≠ B
PairState     := aggregate of declared edges between A and B
ThreadPair    := PairState where carryAvail ∧ traceAvail
ThreadLeg     := directed RelationEdge with PairState context
ThreadNetwork := { terms | ∃ ThreadPair incident }
```

### 3.2 Pair aggregation rules (O-002, evidence-backed)

```text
carryAvail  ⇔ ∃ carries edge on pair (either direction)
traceAvail  ⇔ ∃ traces edge on pair
holdAvail   ⇔ ∃ holds edge on pair
crossAvail  ⇔ ∃ pairs ∨ nests edge on pair

weaveMode(carries leg) = traceAvail ? thread_forward : drift
weaveMode(traces leg)  = carryAvail  ? thread_return  : archive
weaveMode(pairs|nests) = (carryAvail ∧ traceAvail) ? web_crossing : crossing_unwoven
```

### 3.3 Leg behaviour resolver (L4, appearance-free)

Mechanical output of a thread leg (what L6 must follow, not replace):

```text
resolveLeg(ThreadLegState) → {
  rhythmMode,              // anchor|return|travel|answer|circulate
  filamentWeight,          // f(legMass, ratioConsequence, type)
  pathCurvature,           // f(rhythm, ratioTransition, type)  // bow, not pixel
  cadence,                 // f(rhythm, type, MECHANICS_AMPLIFICATION.*)
  eligibility: {
    drawable,              // declared edge exists
    compressed,            // fanout > compressionLimit(focus)
    frameVisible,          // inFrame(src) ∧ inFrame(tgt) sensibility
    fabricEligible,        // weaveMode ∈ {thread_forward, thread_return, web_crossing}
  }
}
```

**Ratio consequence by type** (from `drawCurrent` structure, L4 only):

| Type | `ratioConsequence` uses |
|---|---|
| carries | `transition`, `continuous` on source |
| traces | same |
| holds | stronger continuous weighting |
| pairs | reciprocity oscillation driver |
| nests | circulation / enclosure driver |

### 3.4 Intrinsic vs emergent (Q2–Q3)

#### Intrinsic to one thread leg (survives if neighbourhood frozen)

| Quantity | Why intrinsic |
|---|---|
| `type`, `src`, `tgt` | Declared fact |
| `pair.*Avail` flags | Determined from pair edges only |
| `weaveMode` | Pure function of pair flags + leg type |
| `rhythm.mode` | Fixed lookup per relation type (D-012 O-6) |
| Endpoint `mass.carriers`, `ratioMode` | L2 on endpoints |
| `legMass` | Blend of two endpoint scalars |
| `orderDistance` | Order ranks of endpoints only |
| `ratioConsequence` | Type + source ratio expansion |

#### Emergent only with neighbours / focus / session

| Quantity | Why emergent |
|---|---|
| `relationCompressionLimit` | Depends on **focus** structuralMass + **total outgoing/incoming** fanout (D-012 O-2) |
| `fieldPressure`, `endpointOnly` | Neighbourhood count + focus mass blend (D-012 O-3) |
| `fabricEligible` / thread network | Requires **other legs** on pair + network membership |
| `web_crossing` | Requires carry∧trace **plus** crossing edge on same pair |
| `frameVisible`, `relationSensibility` | Practice frame set — cross-cut (P-003) |
| `traversalEmphasis` | L5 path memory |
| `movementRatioSignature` | Last traversal event |
| Fabric / pressure deposition | Aggregates **many** thread pairs (O-002 `buildHomePressureField`) |
| Nesting depth | No per-thread scalar; nest **count** is local structure fact, not depth metric |

**Rule:** If a quantity requires a third term beyond `(src, tgt)` or session overlay, it is **not** intrinsic to the single leg.

### 3.5 Reversibility (Q4)

| Mechanic | Reversible? | Layer | Notes |
|---|---|---|---|
| Pan / zoom / focus change | **Yes** | Observation | Structure unchanged (P-003) |
| Practice frame toggle | **Yes** | cross-cut / L5 | `setCurrentFieldReferenceFrame`; structure unchanged |
| `frameTransitionPulse` decay | **Yes** | L5/L6 event | Session animation |
| Traversal overlay decay | **Yes** | L5 | `traversalMap` emphasis fades |
| Retrace along `traces` leg | **Yes** (Atlas) | L1 avail | If `traceAvail` — backward path offered |
| Forward carry along `carries` leg | **Yes** (Atlas) | L1 avail | If `carryAvail` |
| Ratio band crossing | **Partial** | L2 | Deterministic; threshold config change is steward action |
| Maturity / settledness drift | **No** (time-forward) | L3 | Timestamp-driven; not undo by observation |
| Compression hiding edges | **Yes** (re-focus) | L4 | Same structure; different focus mass → different limit |

### 3.6 Permanent read change (Q5)

| Event | Permanent? | What changes |
|---|---|---|
| Atlas structure edit | **Yes** | L0/L1 — new edges, terms |
| Order-terminal crossing | **Yes** (read) | Passage kind; requires frame lift (P-010) — structure invariant |
| Drift degeneracy (`carries` without `traceAvail`) | **Yes** (mechanical) | Forward without accountable retrace — P-008 |
| Archive degeneracy (`traces` without `carryAvail`) | **Yes** (mechanical) | Record without live continuation |
| Terminal boundary reached | **Yes** (read) | Same read cannot continue — `Terminal.md` |
| Translation Boundary entry | **Yes** (read scope) | Outside read terminal; local terms required |
| Threshold recalibration | **Partial** | Changes L2 band labels without edge edits |

**Distinction (P-010):** Order-terminal events **permanently change the reference frame of resolution** while **structure remains invariant**.

### 3.7 Behaviour consequence algebra (Q6)

**Question:** Can every visual behaviour be expressed as a consequence of thread ratios?

**Answer: Partial — reject universal reduction.**

#### Supported (leg-level, ratio-modulated)

| Behaviour class | Thread ratio inputs | Evidence |
|---|---|---|
| Filament weight / strand count | `legMass`, `ratioConsequence` | `drawCurrent`, D-012 O-6 |
| Travel vs return vs anchor rhythm | `type` + `rhythm` + ratio scalars | P-004 §1.4 |
| Carry-forward bead emphasis | `continuous` on carries legs | `drawCurrent` |
| Trace wiggle / memory | `transition` on traces legs | P-004 |
| Pair oscillation | `pairs` + reciprocity | P-004 |
| Nest enclosure bow | `nests` + circulation | P-004 |
| Weave mode classification | `carryAvail`, `traceAvail` | O-002 |
| Drift / archive classification | single-leg degeneracy | P-008 |

#### Not reducible to single-thread ratios (parallel paths — D-015B)

| Behaviour class | Independent mechanism | Evidence |
|---|---|---|
| Relation compression / hidden edges | Focus fanout + `relationCompressionLimit` | D-012 O-2, D-015B |
| Endpoint-only peripheral fade | `fieldPressure` neighbourhood blend | D-012 O-3 |
| Reference-frame dimming | `STRUCTURAL_FIELD_FRAMES` membership | D-012 O-5, P-003 cross-cut |
| Layout ring placement | `structuralRingRadius`, order bands | D-011 O-7 |
| Edge existence / coupling | L1 declared only — not ratio-derived | D-015B Law structure→behaviour |
| Order-terminal annotation | Registry read — not ratio | O-003 |
| Fabric pressure field | Multi-pair aggregation | O-002 |
| Traversal wake emphasis | L5 overlay | D-012 runtimeInput |

**Canonical statement (post-D-015B):**

```text
Thread ratios explain how a declared leg expresses ratio-modulated mechanical behaviour.
They do not explain which legs exist, which are visible, which are compressed away,
or which reference frame is active.
```

Smallest honest chain (single leg):

```text
L1 edge + pair flags → endpoint L2 scalars → ratioConsequence(type) → resolveLeg → (L4 behaviour)
```

Full Observatory behaviour requires **parallel resolvers** at focus and session scope.

---

## 4. P-003 layer mapping

```text
L0   Term identity, order, conditions.reads
L1   RelationEdge existence; PairState flags
L2   Endpoint mass.carriers, ratioMode (+ client expansion)
L3   maturityBand, settledness, agitation; orderDistance
L4   weaveMode, rhythm, resolveLeg, compression eligibility
cross-cut   frame membership → leg sensibility
L5   traversal, fieldPressure, movement events
L6   (ignored this commission) appearance follows L4
```

**Invariant under observation (P-002):** L0–L4 leg resolution inputs; not L5 session; not cross-cut active frame; not L6.

---

## 5. Relationship to P-008, P-010, O-002

| Report | Thread mechanics link |
|---|---|
| **P-008** | Thread pair = Carry∧Trace mutual availability; drift/archive = single-leg failure |
| **P-010** | Terminal = leg/read stop; frame lift at order-terminal — not leg ratio change |
| **O-002** | `buildHomeWeaveState` implements PairState → ThreadPair → weave modes |
| **P-004** | Ratio registers modulate leg resolver; not material phase ontology |
| **P-009** | Participation / fabric emergence **multi-thread** — not intrinsic to one leg |

---

## 6. Gaps and unresolved quantities

| Quantity | Status |
|---|---|
| **Nesting depth** | No derived scalar; nest **edge count** per term only |
| **Pair state scalar** | Binary `crossAvail`; no reciprocity metric in L2 |
| **Atlas Ratio six-field read** | Not derived per leg (D-015B) |
| **Resolution Rate** | Practice comparison; not leg register (P-010) |
| **Thread length** | Atlas “readable length” — not path-weighted in runtime |

Do not invent scalars to fill gaps without Atlas/runtime derivation commission.

---

## 7. Recommendation

| Option | Verdict |
|---|---|
| Thread as primary mechanical object | **Accept** — MechanicalThreadPair + ThreadLeg |
| Single relation = full thread | **Reject** — need carry∧trace pair for thread; else drift/archive |
| Universal behaviour = thread ratios | **Reject** — partial only (D-015B) |
| TMS as Observatory mechanical contract | **Accept** — §3 |
| Promote new primitives | **Reject** |

### Canonical finding

> A **declared relation** is a **thread leg**. A **mechanical thread** is a **pair** where forward carry and backward trace remain mutually available. Leg behaviour is ratio-modulated from endpoint registers; neighbourhood, frame, and fanout mechanics are **emergent** and require parallel resolvers. **Appearance is not thread mechanics.**

---

## 8. Question summary

| # | Short answer |
|---|---|
| 1 | Edge + pair flags + endpoint L2/L3 + weaveMode + rhythm + legMass (§2) |
| 2 | Type, direction, pair availabilities, weaveMode, endpoint scalars, order distance, type-fixed rhythm |
| 3 | Compression, pressure, frame, traversal, fabric network, web crossing classification |
| 4 | Observation, frame toggle, overlay decay, retrace/carry if avail — yes; time maturity — no |
| 5 | Structure edit, terminal/order-terminal, drift/archive, translation boundary — yes |
| 6 | **Partial** — ratio-modulated leg behaviour yes; full Observatory behaviour no |
| 7 | TMS §3 — adopt as mechanical spec |

---

## 9. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-010, D-012, D-015B, P-003 | **Met** |
| Single declared relation derived | **Met** — ThreadLeg + PairState |
| Thread as primary object | **Met** — MechanicalThreadPair |
| Intrinsic / emergent split | **Met** — §3.4 |
| Reversibility / permanence | **Met** — §3.5–3.6 |
| Q6 answered with falsification | **Met** — §3.7 |
| Mechanics specification delivered | **Met** — §3 |
| No renderer / Atlas / D1 changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-008 | `docs/reports/P-008-carry-trace-weaving-investigation.md` |
| P-010 | `docs/reports/P-010-terminal-resolution-boundary-investigation.md` |
| P-004 | `docs/reports/P-004-ratio-phase-engine-investigation.md` |
| O-002 | `docs/reports/O-002-fabric-renderer-architecture.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| D-012 | `docs/reports/D-012-behaviour-retrace-instrument.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| DERIVED_RATIO | `docs/runtime/DERIVED_RATIO.md` |
| Atlas | `Thread.md`, `Carry.md`, `Trace.md`, `Terminal.md` |
| Runtime | `.atlas-publisher/field-behaviour-trace.mjs`, `main-website-worker.js` (`buildHomeWeaveState`, `drawCurrent`) |

---

**Status:** P-011 complete. Thread Mechanics Specification (§3) is the derived mechanical contract for Observatory — leg ratios modulate behaviour; parallel paths remain mandatory.
