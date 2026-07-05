# Architectural Notes

## Status

Architectural notebook.

These notes are not Atlas content, not Stewardship specification, and not repository truth by themselves.

They record architectural observations, proposals, rejected paths, and emerging principles so that decisions remain retraceable.

Each note should be marked as:

- **Observation** — something noticed
- **Proposal** — something under consideration
- **Decision** — something accepted by the Project Steward
- **Invariant** — something repeatedly demonstrated as structurally necessary

---

## Structural Support Standard

Architectural notes must remain accountable to structural ratio.

A useful idea is not enough.

A note should identify its level of support:

| Support Level | Meaning |
|---------------|---------|
| **Observed** | A pattern has been noticed, but not yet derived |
| **Derived** | The pattern appears to follow from existing Reality Mechanics relations |
| **Demonstrated** | The pattern has survived multiple contracts, cases, or repository examples |
| **Invariant** | The pattern appears structurally necessary and cannot be otherwise without contradiction |

Every proposal should name its current structural support.

If a structural ratio cannot yet be shown, the note must remain a proposal or observation.

Do not promote architectural notes by usefulness, elegance, or convenience alone.

---

## Note 001 — Practice Emergence

**State:** Observation

**Structural Support:** Observed.

Reality Mechanics is no longer only an Atlas and platform project. It is beginning to operate as a practice.

The practice needs governance that is distinct from Atlas content, Stewardship specification, and platform implementation.

The emerging bodies are:

- Atlas — what Reality Mechanics says
- Stewardship — how Atlas changes are verified
- Platform — how Reality Mechanics is served
- Practice — how work is commissioned, carried, reviewed, and resolved

**Status:** Open.

---

## Note 002 — Contracts over Tasks

**State:** Decision

**Structural Support:** Demonstrated by C003; not yet invariant.

Repository work should be administered through contracts rather than informal tasks.

Reason: a contract has a governing question, scope, exclusions, evidence standard, and acceptance condition. This prevents AI momentum, scope spread, and ungrounded implementation.

C003 confirmed the usefulness of this pattern by converting repository reproducibility from an unknown into a clear relation.

**Status:** Accepted through practice use.

---

## Note 003 — Evidence Before Recommendation

**State:** Decision

**Structural Support:** Demonstrated by C003; not yet invariant.

The contractor returns evidence before the architect recommends action.

Governance documents should be updated after contract evidence is accepted, not during investigation.

Reason: investigation and documentation updates carry different authority. Combining them can blur evidence and recommendation.

**Status:** Accepted after C003.

---

## Note 004 — Relation over Percentage

**State:** Decision

**Structural Support:** Derived from Reality Mechanics preference for relation and ratio; demonstrated in C003.

Delivery value should be measured by relation rather than invented percentage.

Accepted relations include:

- checked : total
- known : unknown
- blocked : unblocked
- development reproducible : canonical deployment blocked

Where a relation cannot be counted, it should be described qualitatively and marked unknown.

**Status:** Accepted.

---

## Note 005 — Decision as Purchased Value

**State:** Proposal

**Structural Support:** Observed; not yet derived.

The steward does not buy reports, code, or documents. The steward buys reduction in uncertainty sufficient to make a grounded decision.

Reports are evidence.

Decisions are value.

This suggests each contract should identify the decision or resolution it enables.

**Status:** Open. Not yet implemented in the contract register.

---

## Note 006 — Pressure Before Commission

**State:** Proposal

**Structural Support:** Observed; possible derivation from unresolved carrying or strain remains unproven.

Commission may not be the first element of practice.

Pressure appears first.

A steward commissions work because pressure is present. The commission authorises the pressure to be carried by a contract.

Working flow:

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

**Status:** Open. Needs testing across C004 and later contracts.

---

## Note 007 — Authority Separation

**State:** Observation

**Structural Support:** Observed; not yet derived.

The practice currently distinguishes four authorities:

| Authority | Responsibility |
|-----------|----------------|
| Steward | Commissions work and accepts or rejects decisions |
| Architect | Prepares contracts and reviews evidence |
| Contractor | Investigates, implements, tests, and reports evidence |
| Repository | Preserves accepted work |

This separation appears to reduce drift.

**Status:** Emerging.

---

## Note 008 — Architect's Pen

**State:** Observation

**Structural Support:** Observed in repository workflow; not yet derived.

The GitHub connector functions as the Architect's Pen when used to edit governance, contracts, specifications, and architectural notes.

Cursor remains the contractor for repository investigation, implementation, tests, and verification.

This allows the architect to maintain practice documents without using contractor tokens for architectural prose, while still leaving implementation work with Cursor.

**Status:** Emerging.

---

## Note 009 — Architect Does Not Invent Primitives

**State:** Decision

**Structural Support:** Derived from the practice standard that architectural notes must be accountable to structural ratio.

The architect may propose language, contracts, and readings, but does not invent primitives for the Practice.

Any new practice term must either:

- derive from existing Reality Mechanics structure
- be demonstrated through repeated contract use
- remain explicitly marked as an observation or proposal
- be rejected if no structural ratio can be shown

This protects the Practice from becoming a conventional project-management overlay or an architect's preference system.

**Status:** Accepted.

---

## Note 010 — Expiry by Condition

**State:** Proposal

**Structural Support:** Observed as useful; not yet derived.

Architectural notes should have expiry conditions.

A note should not remain open indefinitely simply because it was written.

Possible expiry conditions:

- promote after three independent contracts support it
- revise if a simpler Atlas derivation appears
- reject if contradicted by repository evidence
- keep open if pressure remains unresolved

This would make the architectural notebook self-correcting rather than accumulative.

**Status:** Open. Needs derivation from structural ratio before adoption.
