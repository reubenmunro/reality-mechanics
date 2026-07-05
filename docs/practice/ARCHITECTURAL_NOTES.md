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

Architectural debt is created whenever a practice concept exists without an Atlas trace. Reducing this debt is a primary responsibility of the architect.

### Derivation Discipline

Every practice concept should be treated as a temporary placeholder until it can be retraced into Atlas structure.

The architect should attempt to reduce, not increase, the number of independent concepts in the Practice.

When proposing a new concept, the architect should first ask:

1. Does this already exist in the Atlas under another name?
2. Is this a primitive, or a read of something more primitive?
3. What structural relation requires this concept to exist?
4. What observation would falsify this proposal?

If these questions cannot be answered, the concept should remain explicitly provisional.

---

### Governance and Stewardship

Governance is not a substitute for structure. Governance exists to ensure that changes to the Atlas and Practice are justified, retraceable, and structurally supported.

Stewardship is responsible for verifying that each change to the repository, Atlas, or Practice meets the required standard of evidence and structural support.

Governance documents, including these architectural notes, are living records. They may be revised, rejected, or replaced as structural understanding improves.

### Governance Standard

All governance processes must remain accountable to the same structural ratio as architectural notes.

No governance rule, convention, or process should be accepted unless it can be retraced to structural necessity, demonstrated utility, or explicit observation.

Where a governance rule cannot be justified, it should remain provisional or be removed.

---

### Required Trace Fields

Every architectural note should include the following fields:

| Field | Purpose |
|------|---------|
| **State** | Observation, Proposal, Decision, or Invariant |
| **Structural Support** | Observed, Derived, Demonstrated, or Invariant |
| **Atlas Trace** | The Atlas terms, relations, or invariants presently supporting the note. Use `None yet` until a retrace exists. |
| **Promotion Condition** | The structural condition required before the note may advance to its next state. |

These fields are mandatory. They ensure every architectural note carries its own burden of proof.

### Architectural Standard of Care

The architect is responsible for the quality of the questions, not ownership of the truth.

The architect shall:

- distinguish observation from derivation
- distinguish derivation from demonstration
- distinguish demonstration from invariant
- identify where structural support is absent
- reduce architectural debt by retracing concepts into the Atlas
- revise or withdraw proposals when evidence no longer supports them

The architect shall not:

- invent primitives
- promote proposals because they are elegant or useful
- exceed available evidence
- substitute memory, preference, or authority for repository truth

Reality remains the final authority.
The Atlas remains the structural authority.
The repository preserves the current best retraceable understanding.

---

## Note 001 — Practice Emergence

**State:** Observation

**Structural Support:** Observed.
**Atlas Trace:** None yet.
**Promotion Condition:** Demonstrate that the Practice can be structurally derived from the Atlas rather than existing only as governance.

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
**Atlas Trace:** None yet.
**Promotion Condition:** Demonstrate across multiple independent contracts that contracts remain the minimal bounded carrying structure.

Repository work should be administered through contracts rather than informal tasks.

Reason: a contract has a governing question, scope, exclusions, evidence standard, and acceptance condition. This prevents AI momentum, scope spread, and ungrounded implementation.

C003 confirmed the usefulness of this pattern by converting repository reproducibility from an unknown into a clear relation.

**Status:** Accepted through practice use.

---

## Note 003 — Evidence Before Recommendation

**State:** Decision

**Structural Support:** Demonstrated by C003; not yet invariant.
**Atlas Trace:** None yet.
**Promotion Condition:** Show that evidence-before-recommendation follows from Atlas structure rather than professional convention.

The contractor returns evidence before the architect recommends action.

Governance documents should be updated after contract evidence is accepted, not during investigation.

Reason: investigation and documentation updates carry different authority. Combining them can blur evidence and recommendation.

**Status:** Accepted after C003.

---

## Note 004 — Relation over Percentage

**State:** Decision

**Structural Support:** Derived from Reality Mechanics preference for relation and ratio; demonstrated in C003.
**Atlas Trace:** None yet.
**Promotion Condition:** Trace relation-over-percentage explicitly to Atlas terms governing ratio and read.

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
**Atlas Trace:** None yet.
**Promotion Condition:** Derive 'decision as purchased value' from Atlas structure or reject the proposal.

The steward does not buy reports, code, or documents. The steward buys reduction in uncertainty sufficient to make a grounded decision.

Reports are evidence.

Decisions are value.

This suggests each contract should identify the decision or resolution it enables.

**Status:** Open. Not yet implemented in the contract register.

---

## Note 006 — Pressure Before Commission

**State:** Proposal

**Structural Support:** Observed; possible derivation from unresolved carrying or strain remains unproven.
**Atlas Trace:** None yet.
**Promotion Condition:** Identify whether pressure derives from an existing Atlas primitive or remove it as a primitive candidate.

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
**Atlas Trace:** None yet.
**Promotion Condition:** Derive the authority separation from Atlas relations rather than organisational practice.

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
**Atlas Trace:** None yet.
**Promotion Condition:** Show that the Architect's Pen is a structural consequence of authority separation.

The GitHub connector functions as the Architect's Pen when used to edit governance, contracts, specifications, and architectural notes.

Cursor remains the contractor for repository investigation, implementation, tests, and verification.

This allows the architect to maintain practice documents without using contractor tokens for architectural prose, while still leaving implementation work with Cursor.

**Status:** Emerging.

---

## Note 009 — Architect Does Not Invent Primitives

**State:** Decision

**Structural Support:** Derived from the practice standard that architectural notes must be accountable to structural ratio.
**Atlas Trace:** None yet.
**Promotion Condition:** Demonstrate that every accepted practice primitive can be retraced to Atlas structure.

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
**Atlas Trace:** None yet.
**Promotion Condition:** Derive expiry conditions from structural ratio rather than governance preference.

Architectural notes should have expiry conditions.

A note should not remain open indefinitely simply because it was written.

Possible expiry conditions:

- promote after three independent contracts support it
- revise if a simpler Atlas derivation appears
- reject if contradicted by repository evidence
- keep open if pressure remains unresolved

This would make the architectural notebook self-correcting rather than accumulative.

**Status:** Open. Needs derivation from structural ratio before adoption.

---

## Note 011 — Practice Must Be Derived

**State:** Proposal

**Structural Support:** Observed; not yet derived.

**Atlas Trace:** None yet.

**Promotion Condition:** Demonstrate that each essential practice concept can be retraced to existing Atlas structure, or remove concepts that cannot be derived.

The Practice should not become an independent management methodology.

Its concepts should emerge from the same structural relations that govern the Atlas.

Where a practice concept cannot be derived, it should remain provisional until either:

- an Atlas trace is established,
- the concept is replaced by an existing structural relation, or
- it is rejected.

The long-term objective is that the Practice becomes an application of Reality Mechanics rather than an overlay upon it.


**Status:** Open. This is the governing architectural investigation for future practice development.

---

## Note 012 — The Practice Exists to Eliminate Itself

**State:** Proposal

**Structural Support:** Observed; not yet derived.

**Atlas Trace:** None yet.

**Promotion Condition:** Demonstrate that each practice concept can be replaced by an existing Atlas relation, leaving no irreducible practice primitives.

The long-term objective of the Practice is not to become another permanent body of knowledge.

Its objective is to discover whether the Atlas already contains the relations required for sound stewardship.

If a practice concept cannot eventually be traced into the Atlas, it should remain provisional or be rejected.

If it can be traced, the practice concept should become a readable application of Atlas structure rather than an independent idea.

Success therefore is not measured by how much practice documentation exists.

Success is measured by how little remains that cannot be structurally retraced.

This note establishes a standing architectural discipline:

> Every new practice concept creates a debt until it is either retraced to the Atlas or removed.

**Status:** Open. This note should guide all future architectural work.

---

## Note 013 — Reduction Before Expansion

**State:** Decision

**Structural Support:** Derived from the Standard of Care.

**Atlas Trace:** None yet.

**Promotion Condition:** Replace `None yet` with explicit Atlas relations or remove this decision if reduction cannot be demonstrated.

The first responsibility of the architect is not to create new structure.

The first responsibility is to determine whether an existing structure already explains the observation.

Every new practice concept increases architectural debt until it is structurally retraced.

Therefore:

- prefer reduction before expansion
- prefer derivation before invention
- prefer retracing before naming
- prefer removing concepts over accumulating them

A successful architectural cycle should normally reduce the number of unexplained concepts within the Practice.

**Status:** Accepted as the current architectural operating discipline, subject to future Atlas derivation.

---

## Current Architectural Direction

The immediate objective of the Practice is no longer to design better governance.

It is to establish explicit Atlas traces for every remaining unresolved practice concept.

Current unresolved concepts include:

- Pressure
- Commission
- Contract
- Evidence
- Recommendation
- Decision
- Resolution

No additional core practice concepts should be introduced until at least one of these has been structurally retraced into the Atlas or rejected, except where a proposed relation directly constrains derivation itself.

This becomes the architect's primary line of investigation.

### First Derivation Target

Do not introduce another core practice concept.

Instead, begin with the first unresolved concept — **Pressure** — and attempt to retrace it into existing Atlas structure.

Possible outcomes are only:

1. Pressure is an existing Atlas primitive.
2. Pressure is a read of an existing Atlas relation.
3. Pressure is unnecessary and should be removed from the Practice.

No fourth outcome should be assumed.

---

## Note 014 — Order : Structure : Read

---

## Note 015 — The Architect's Vision

**State:** Proposal

**Structural Support:** Observed; awaiting Atlas derivation.

**Atlas Trace:** None yet.

**Promotion Condition:** Demonstrate that each major transformation in Reality Mechanics can be described as an operational relation preserving order through structure into read.

The present architectural vision is not to build a repository, a website, or an AI workflow.

The vision is to establish a discipline in which the order of operations can pass through successive transformations without losing structural accuracy.

The governing relation remains:

```text
Order : Structure : Read
```

Each `:` represents an operation.

The responsibility of every layer is to preserve the order being carried into the next readable form.

This gives each body of the project a distinct responsibility:

| Body | Responsibility |
|------|----------------|
| Atlas | Discover and preserve structural order |
| Calculus | Preserve order through derivation |
| Practice | Preserve order through stewardship |
| Platform | Preserve order through presentation |
| Read | Receive structure without losing the order that produced it |

The long-term aim is not to accumulate documentation.

It is to reduce the loss of order across every transformation.

This note is an architectural direction, not an accepted invariant.

**Status:** Open architectural vision.

**State:** Proposal

**Structural Support:** Observed; awaiting Atlas derivation.

**Atlas Trace:** None yet.

**Promotion Condition:** Demonstrate from existing Atlas terms that structure is the readable consequence of order, and that an accurate read preserves the order that produced the structure.

The current working relation is:

```text
Order : Structure : Read
```

The `:` is not punctuation. It marks the operation.

Read the relation as:

- Order **operates to become** Structure.
- Structure **operates to become** Read.

The relation therefore expresses transformation rather than association.

```text
Order
  :
Structure
  :
Read
```

Each `:` should be treated as an operational boundary where carrying is transformed while preserving the order that produced it.

This is an architectural investigation, not an accepted primitive.

The proposal is that each operation (:) preserves the order that is being carried into its next readable form:

- structure is the readable consequence of order,
- every read is a further transformation of that structure,
- and a read remains accurate only where it preserves the order that produced the structure.

This refines the earlier architectural emphasis on `Structure : Read`.

The stronger question becomes:

> Does this transformation preserve the order that produced the structure being read?

This relation should be tested against:

- Atlas derivation
- Calculus
- Stewardship
- Practice
- Platform
- AI responses

Do not promote this relation until it can be retraced through the Atlas.

**Status:** Open architectural investigation.

---

## A001 — Pressure Derivation Brief

**Type:** Architectural derivation.

**Status:** Evidence gathered — derivation unresolved.

**Governing Question:** What is Pressure structurally?

**Constraint:** Do not define Pressure by preference, metaphor, or professional practice. Derive it from Atlas structure or leave it unresolved.

### Scope

Investigate whether Pressure is:

1. an existing Atlas primitive,
2. a read of an existing Atlas relation,
3. or unnecessary within the Practice.

### Initial Trace Candidates

Pressure should first be tested against existing Atlas relations likely to carry the same structure:

- Relation
- Ratio
- Carrying
- Bearing
- Strain
- Availability
- Read
- Resolution

These are candidates only. They are not conclusions.

### Evidence Required

A valid derivation must show:

- the Atlas source term or relation,
- the structural ratio involved,
- why Pressure is either required or unnecessary,
- whether Pressure names a primitive, a read, or a redundant practice word.

### Possible Outcomes

| Outcome | Consequence |
|---------|-------------|
| Pressure is primitive | Add explicit Atlas Trace and justify why it cannot be reduced |
| Pressure is a read | Replace Pressure with the more primitive Atlas relation where possible |
| Pressure is unnecessary | Remove Pressure from the Practice flow |
| Pressure remains unresolved | Keep it provisional and do not derive further practice concepts from it |

### Acceptance Standard

A001 is not complete when a good explanation exists.

A001 is complete only when Pressure has either:

- an explicit Atlas Trace,
- a justified rejection,
- or a clearly stated unresolved status with no downstream promotion.

### Architect Review

Evidence gathered by C-A001 (`docs/reports/C-A001-pressure-derivation-evidence.md`):

- The existing Atlas `Pressure` is a **second-order term**, not a primitive (`Reality_Mechanics/2_Second/Carrying Conditions/Pressure.md`).
- The practice concept of Pressure appears closer to the first-order chain **Strain → Bearing → Resolution** than to the second-order Atlas term of the same name.
- **No derivation is accepted yet.** The evidence supports two candidate mappings without deciding between them.
- **No downstream practice concepts should be promoted from Pressure yet**, pending a resolved derivation.

### Cursor Contract Draft

Use Cursor only for repository evidence.

```text
C-A001 — Pressure Derivation Evidence

Read-only investigation.

Search the Atlas and stewardship docs for structural material related to pressure, strain, carrying, bearing, availability, relation, ratio, read, and resolution.

Do not edit files.
Do not propose new practice concepts.
Do not decide the derivation.

Return an evidence report with:

1. Relevant Atlas terms found.
2. Relevant passages or frontmatter relations.
3. Existing relations among those terms.
4. Whether any existing term appears to carry the structure currently being called Pressure.
5. Unknowns.

Cite files and paths for every claim.
```

---

## Note 016 — Calculus Programme Evidence State

**State:** Observation

**Structural Support:** Demonstrated across the C-001/C-002/C-003 and C-C/C-R/C-F report series.

**Atlas Trace:** Partial — the terms invoked (Relation, Connection, Carry, Trace, Hold) are Atlas terms; the *operations between them* are not yet accepted.

**Promotion Condition:** Resolve the `:` operator (C010) and the operation-consistency split (C-C000A) before any calculus operation is promoted (C004A).

The Calculus programme has produced evidence, not conclusions. Current state, recorded so future work does not re-open settled evidence or over-read it:

- The working Practice flow (Pressure→Commission→Contract→Evidence→Recommendation→Decision→Resolution) has a **candidate Atlas-grounded compression**: `Ark Run` — Pressure→Trace→Check→Determine→Step (`docs/reports/C-001-practice-calculus-derivation.md`).
- `Order : Ark` was derived as a **candidate** Reality Mechanics Calculus (`C-002`), then tested for minimality and found **not minimal** (`C-003`): the smallest Atlas-grounded seat of the Order/Ark cooperation is `Relation → Connection`, because held `Carry`/`Trace` pull in `Hold → Resolution → Boundary` and the whole first-order spine.
- "operation" is used inconsistently across the repository (six senses, node-like vs edge-like) (`C-C000A`); this is the principal blocker to a derived Calculus.
- `:` remains **unaccepted** as an operator (C010). Nothing above is promoted.

**Status:** Open. This note records evidence state only; it does not promote any operation.
