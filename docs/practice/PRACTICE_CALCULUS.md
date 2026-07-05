# Practice Calculus

## Status

Architectural notes. Not specification.

This document explores whether the Reality Mechanics Practice can be derived from Reality Mechanics terms rather than imported from conventional project management.

---

## Governing Investigation

This document investigates whether the Reality Mechanics Practice can be derived through operational transformations that preserve order into structure and structure into read.

Working relation:

```text
Order
  :
Structure
  :
Read
```

The `:` marks an operation, not punctuation.

Each operation is responsible for preserving the order being carried into its next readable form.

The Practice flow below is one proposed read of this relation.

It is not yet accepted as the governing calculus.

---

## Starting Relation

The current delivery flow is a working architectural proposal.

Its first operation (`Pressure`) remains under derivation and should not yet be treated as the first operation of the Practice Calculus.

The working delivery flow is:

```text
Pressure
↓
Commission
↓
Contract
↓
Evidence
↓
Recommendation
↓
Decision
↓
Resolution
```

This is not yet canonical calculus. It is an architectural proposal for testing.

---

## Pressure

Pressure appears to be the first observable condition of practice.

Work does not begin because a task exists.

Work begins because an unresolved relation creates pressure.

Examples:

- repository reproducibility unknown
- platform deployment blocked
- Atlas audit incomplete
- D1 schema undocumented
- term relation unresolved

Pressure may be the practice-level read of unresolved carrying.

Open question: is pressure primitive, or is it a second-order read of strain, bearing, or availability?

---

## Commission

Commission is the steward's authorised response to pressure.

It does not resolve pressure.

It grants permission for the pressure to be carried by a contract.

Open question: is commission an act of relation, boundary, or carrying?

---

## Contract

Contract is a bounded carrying structure.

It gives an unresolved condition a bounded carrying structure so that investigation remains traceable without spreading into unrelated work.

A contract establishes:

- boundary
- question
- evidence standard
- scope
- exclusion
- deliverable

Open question: is contract an engineered form of bounded asymmetry?

---

## Evidence

Evidence is returned contact with repository reality.

Evidence is not belief, preference, or generated confidence.

Evidence constrains the architect's recommendation.

Open question: does evidence belong under Trace, Read, or Bearing?

---

## Recommendation

Recommendation is an architectural read of evidence.

It is not final authority.

It bridges evidence to steward decision.

Open question: is recommendation a form of carried read?

---

## Decision

Decision belongs to the steward.

Decision may not be primitive. It may be a visible act that follows from resolution pressure becoming sufficiently carried.

Open question: should the practice centre decision, or resolution?

---

## Resolution

Resolution is the state where pressure has been carried enough that the relation can stand.

Resolution does not mean all work is complete.

It means the current pressure has a known state.

Examples:

- accepted
- rejected
- blocked
- deferred
- continued
- unresolved but named

Open question: is resolution the practice equivalent of closure/readability?

---

## Relation over Percentage

The practice should avoid invented percentage confidence.

Where possible, use actual relations:

```text
checked : total
passed : failed
known : unknown
blocked : unblocked
open pressure : resolved pressure
```

Where a relation cannot be counted honestly, describe it qualitatively and mark the count as unknown.

---

## Working Mapping

| Practice Term | Possible RM Relation | Status |
|---------------|----------------------|--------|
| Pressure | unresolved carrying / strain | Open |
| Commission | authorised relation | Open |
| Contract | bounded carrying | Working hypothesis |
| Evidence | trace / read / contact | Open |
| Recommendation | carried read | Open |
| Decision | steward acceptance | Open |
| Resolution | closure / readability | Working hypothesis |

---

## Current Architectural Hypothesis

The current hypothesis is that the Reality Mechanics Practice preserves operational order through successive transformations until a grounded steward resolution becomes possible.

Contracts are bounded structures for carrying an unresolved condition toward a steward decision.

This hypothesis remains open until tested across multiple contracts.

### Governing Architectural Question

The present investigation is not whether this workflow is useful.

It is whether each transformation within the Practice can be independently derived from the Atlas.

The burden of proof therefore rests on the operations (`:`), not on the names of the stages.

If a stage cannot be derived, it should be revised, replaced, or removed.

---

## Architectural Direction

The current investigation is shifting from identifying practice stages toward identifying the operations between them.

The principal question is no longer:

> What are the stages of the Practice?

It is:

> What operation occurs at each `:` and does that operation preserve the order being carried?

The long-term aim is not to produce a project-management methodology.

It is to derive a Practice Calculus whose operations can be independently retraced to the Atlas.

---

## Derived Candidate and Minimum Support (Evidence, Not Accepted)

The following records the current state of the Calculus programme. It is **evidence, not an accepted calculus** (C007, C004A). The `:` operator remains **unaccepted** (C010). Nothing here is promoted.

### Candidate runtime — Ark Run

C-001 (`docs/reports/C-001-practice-calculus-derivation.md`) found that the seven working stages compress into a single Atlas-grounded runtime already present in the Atlas, `Ark Run`:

```text
Pressure → Trace → Check → Determine → Step
```

Of the original seven stages, three read as states, three as reads, one as a product; Commission derives weakly because it depends on external authorisation rather than Atlas structure.

### Candidate calculus — Order and Ark

C-002 (`C-002-ark-order-calculus-derivation.md`) derived the cooperative relation between **Ark** (preservation-oriented carrying) and **Order** (the standing dependency arrangement) as a candidate calculus: Ark carries a condition forward while Order is preserved through retrace.

### Minimum support — the candidate is not minimal

C-003 (`C-003-minimum-support-test.md`) tested minimality and found the candidate **not minimal**. The smallest Atlas-grounded structure that supports the Order/Ark cooperation is:

```text
Relation → Connection
```

A single held Connection (which needs only Relation) already offers forward availability (the Ark/Carry direction) and backward availability (the Order/Trace direction). The candidate's apparent size comes from `Hold`: held `Carry`/`Trace` require `Hold → Resolution → Bearing → Strain → Availability → Boundary → … → Relation`, pulling in nearly the whole first order.

### Standing constraints before any promotion

- Resolve the `:` operator (C010) — a named sequence is not enough; the transformation must be retraceable.
- Resolve the operation-consistency split (`C-C000A`) — "operation" currently carries six senses across two incompatible categories.
- Declare the calculus *grain* (minimal `Connection` seat vs held `Carry`/`Trace`) and name `Hold` explicitly (C-003).

Until these are resolved, this section records a candidate under investigation, not the Practice Calculus.
