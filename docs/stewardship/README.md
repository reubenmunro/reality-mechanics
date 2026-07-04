# Reality Mechanics Stewardship

This directory is the permanent home of the Reality Mechanics stewardship method. If you are new to this repository — human or AI — start here.

## What Stewardship Is

Stewardship is the application of a recovered, tested method to verify existing Atlas structure against itself. It does not create new Atlas terms, mechanics, or vocabulary. It asks one question of every entry: does this term's own structure survive being tested against the method the Atlas itself has already forced us to recover?

Stewardship is not authoring, not discovery for its own sake, not symmetry-seeking, and not edit-maximizing. A clean audit that finds nothing to repair is a valid, valuable result — evidence of structural health, not an absence of effort.

## Where to Start

**If you are an AI steward (Cursor or otherwise): read `CURSOR.md` first.** It contains your standing operating instructions.

**Everyone else, in this order:**

1. `STEWARDSHIP_V1.md` — the authoritative specification. Read this in full before doing anything else. It is authoritative: if any other document here appears to conflict with it, this document governs, unless it is shown to conflict with the Atlas itself — in which case the Atlas wins, and `STEWARDSHIP_V1.md` gets revised.
2. `STEWARDSHIP_CASE_STUDIES.md` — five full worked investigations. Read before your first audit. Case Study 1 in particular (Bearing → Resolution) documents the one point where this method was nearly applied wrong, and is the single most important lesson in this directory.
3. `EVIDENCE_GRADING.md` and `ATLAS_INVARIANTS.md` — reference documents for classifying findings and understanding the recovered structural invariants.
4. `AUDIT_LOG.md` — what has already been checked. Consult before re-auditing a family or term.
5. `OPEN_QUESTIONS.md` — what remains genuinely unresolved, separated from watch-list patterns and from solved questions.

## Which Document Is Authoritative

`STEWARDSHIP_V1.md`. Every other document in this directory exists to support it — expanding on evidence classification, invariants, worked examples, or factual history — and none of them override it. If a future steward's investigation produces a genuine revision to the calculus or its tests, that revision belongs in `STEWARDSHIP_V1.md` directly, with the reasoning recorded in `STEWARDSHIP_CASE_STUDIES.md` or `AUDIT_LOG.md` as appropriate.

## How Future Audits Should Be Performed

Family by family, not alphabetically and not by search-for-defects. Each audit applies the full six-layer calculus (Dependency → Contribution → Generation → Places → Reads → Term) and the four object-level tests described in `STEWARDSHIP_V1.md` to every term in the family, whether or not a defect is expected. Findings are classified by evidence strength (`EVIDENCE_GRADING.md`) and reported with recovered/proposed/rejected/pressure kept strictly distinct. A family with zero findings is recorded plainly in `AUDIT_LOG.md`, not treated as an incomplete audit.

## The Burden of Proof Philosophy

Every Atlas entry is presumed structurally sound until a specific, named test decisively fails against it. The burden of proof sits on the proposed change, never on the existing structure. This means: do not go looking for problems to justify activity; do not restore symmetry the Atlas hasn't demanded; do not pattern-match a fix across cases that merely look similar without re-verifying each one individually. The single clearest illustration of why this matters is in `STEWARDSHIP_CASE_STUDIES.md`, Case Study 1 — a case where an edit was actually made, matching three already-confirmed instances of a defect, and then reverted before being committed, once the specific case was checked on its own terms rather than trusted by resemblance.

## Directory Contents

```
docs/stewardship/
    README.md                      — this file
    CURSOR.md                      — permanent AI steward operating instructions
    STEWARDSHIP_V1.md              — the authoritative specification
    STEWARDSHIP_CASE_STUDIES.md    — five worked investigations
    ATLAS_INVARIANTS.md            — recovered structural invariants
    EVIDENCE_GRADING.md            — evidence classification (E1–E5)
    AUDIT_LOG.md                   — factual audit history
    OPEN_QUESTIONS.md              — unresolved gaps, pressure, future work
    archive/                       — superseded working notes, preserved for history
```

`archive/` contains the original working documents from which this specification was recovered (`Primitive Mechanics.md`, `Inheritance Order.md`, `Method Reconciliation.md`). They are historical record, not current guidance — everything load-bearing from them has been carried forward into the documents above. Consult the archive only if you need to understand *how* a conclusion in `STEWARDSHIP_V1.md` was originally reached, in more exploratory detail than the case studies provide.
