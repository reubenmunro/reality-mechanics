# Stewardship Audit Log

Factual record. No narrative, no explanation of method — see `STEWARDSHIP_V1.md` and `STEWARDSHIP_CASE_STUDIES.md` for those. This document exists so a future steward can see at a glance what has already been checked, without re-reading full investigation histories.

**As of this entry: 17 families audited. ~51 primary terms directly run through the full six-layer calculus, plus auxiliary cross-verification checks on 5 additional entries consulted for corroboration only.**

---

## Families Audited

| # | Family | Terms |
|---|---|---|
| 1 | Boundary chain | Boundary, Availability, Strain, Bearing, Resolution |
| 2 | Connection chain | Connection, Carry, Trace, Carrying, Recarry, Coupling |
| 3 | Presence/Participation chain | Presence, Bearing Relation, Participation, Participant, Member |
| 4 | Resolution outcomes | Hold, Release, Transfer, Absorb, Yield, Failure, Shift, Closure, Sever |
| 5 | Order crossings | First Order Crossing, Second Order Crossing, Third Order Crossing |
| 6 | Terminal markers | Nesting, Recursion |
| 7 | Recurrence/Field lineage | Recurrence, Field of Participation |
| 8 | Closure Scope descendants | Occur, Traversal |
| 9 | Recarry foundations | Contact, Groundedness, Compatibility |
| 10 | Contact/Bearing adjuncts | Tact, Orientation |
| 11 | Coupling compounds (cross-order test) | Coupled Contact, Interposed Carrier |
| 12 | Coupled Boundary lineage | Coupled Boundary |
| 13 | Coupled Boundary descendants | Boundary Loosening |
| 14 | Coupling/Identity trace | Identity |
| 15 | Identity descendants | Stability, Self |
| 16 | Coupling siblings | Engineered Coupling, Nested Coupling, Coupled Asymmetry |
| 17 | Coupling direct carries | Pair, Maintained Coupling |

**Auxiliary entries consulted for corroboration, not audited as primary family members:** Distinction, Clearance, Form, Readability, Cognitive Participation.

---

## Dependency Repairs

| Term | Missing dependency | Evidence class | Status |
|---|---|---|---|
| Release | Bearing | E3 (reclassified from E1) | Committed |
| Field of Participation | Recurrence | E3 | Committed |
| Engineered Coupling | Compatibility | E1 | Committed |
| Nested Coupling | Participation | E1 | Committed |
| Maintained Coupling | Compatibility | E1 | **Proposed, not yet committed as of this log entry** |

## Language Repairs (Pairs-field "becomes" → persistence correction)

| Relationship | Status |
|---|---|
| Strain → Bearing | Committed |
| Presence → Bearing Relation | Committed |
| Bearing Relation → Participation | Committed |
| Closure → Closure Scope | Committed |

## Confirmed Non-Repairs (tested, correctly left unchanged)

| Case | Reason |
|---|---|
| Bearing → Resolution | `is_terminal: true` confirmed on Resolution; "becomes" is linguistically correct. See Case Study 1. |
| Yield, Transfer, Failure ("strain" mentions) | Casual, general language shared across entire sibling-set; fails the Dependency Membership Test's specificity requirement. |
| Interposed Carrier ("carrying" language) | Insufficient evidence in either direction; recorded as Open, not resolved. See `OPEN_QUESTIONS.md`. |

## Rejected Assumptions

| Assumption | Replaced by |
|---|---|
| Generative/supporting dependency classification | Direct contribution recovery (verb-level), no classification |
| "Read" as the name for the Places→Term layer | "Reads," matching the Atlas's own existing field name |
| Composition as the general explanation for compound mechanics | Conjunction (independent-substrate, jointly-necessary) as the dominant pattern; Composition retained only as Recarry's own narrow exception |
| Membership prior to Participation | Participation confirmed prior to Membership, directly from Member's own Holds field |
| "Dependency movement" narrative-section authority | Dependency Membership Test applied directly to Places/Reads/opening sentence, never to narrative sub-sections |

**Reconciliation, not rejection:** "Mechanic" (temporary working term) → "Places" (the Atlas's own pre-existing field name). Not a failure; independently rediscovering existing Atlas terminology and yielding to it.

## Confirmed Invariants

See `ATLAS_INVARIANTS.md` for full detail. Four primitive, three derived, one governing rule. All eight confirmed with no counterexample found across the full audited set.

## Confirmed Structural Gaps

One. Second Order has no order-level terminal marker (`is_terminal: true`), unlike First (Resolution), Third (Nesting), and Higher (Recursion) order. Investigated directly across multiple families and concluded to be a genuine architectural asymmetry, not an omission. Full reasoning in `OPEN_QUESTIONS.md`. **Do not fill this gap without new, strong evidence.**

## Method Failures

Zero. No case where the six-layer calculus or any of the four object-level tests failed to produce a determinate answer when applied.

## Outstanding Proposals

1. Maintained Coupling — add `[[Compatibility]]` to needs/holds/traces. Evidence E1, fully specified, not yet committed as of this log entry.
