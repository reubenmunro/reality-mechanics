# Stewardship V1 — Core Specification

**Status: authoritative.** This document is the primary specification for Reality Mechanics stewardship. If any other document in this repository conflicts with this one, this document wins unless it is itself shown to conflict with the Atlas — in which case the Atlas wins, and this document is revised.

This document is self-contained. It assumes no prior conversation and no memory of how it was recovered.

---

## 1. Stewardship Purpose

**Stewardship is the application of a recovered, tested method to verify existing Atlas structure against itself.** It answers one question, asked term by term: *does this entry's own structure survive being tested against the method the Atlas itself has already forced us to recover?*

**Stewardship is not:**
- Authoring. A steward does not invent Atlas terms, mechanics, or categories.
- Discovery for its own sake. Interesting patterns that the Atlas has not repeatedly forced are recorded as Pressure, not acted on. See `OPEN_QUESTIONS.md`.
- Symmetry-seeking. Structural differences between families are evidence to record, not defects to fix.
- Maximizing edits. A steward's job is not to produce the most repairs possible. It is to produce justified confidence — in the Atlas, and in the method itself. A run of clean audits is evidence of that confidence, not an absence of results.
- Improving prose because it reads better. Language is only corrected when it misstates an already-established structural fact.

**The burden of proof sits on every proposed change, never on existing structure.** Every entry is presumed structurally sound until a specific, named test (Section 3) fails against it.

---

## 2. Stewardship Calculus

Six layers, recovered independently and confirmed non-mergeable by direct testing — each adjacent pair was checked for collapse, and none collapsed.

```
Dependency
  ↓
Contribution
  ↓
Generation
  ↓
Places (the recovered condition)
  ↓
Reads
  ↓
Term
```

**Dependency** — *what must remain true.* The complete `holds`/`needs` set for a term, established as a fixed list before any further analysis. This must come first and stay separate from Contribution: you need the complete denominator before you can check whether your description of what each member contributes is exhaustive.

**Contribution** — *what unique work each dependency performs, described independently, with a verb, before any comparison or sorting.* Do not classify dependencies into categories (see `STEWARDSHIP_CASE_STUDIES.md` — this was tried and rejected). Two dependencies that look similar must be checked individually for overlap; adjacency is not evidence of redundancy (Section 3, Contribution Uniqueness Test).

**Generation** — *the smallest set of contributions that is jointly sufficient to account for the mechanic.* A **membership test**, not a labeling exercise: the question is only "is this subset enough," never "what should we call the members that aren't in it." Contributions outside the sufficient set need no name. Generation also collapses what earlier work called "nearest" and "sufficient" into a single recursive operation — testing whether a nearer or more distant candidate could substitute is the same sufficiency test applied at a different point in the graph.

**Places** — *the recovered condition itself.* Not a new methodological layer — the Atlas's own mandatory field, present on every entry. Recovery temporarily used the word "Mechanic" for this point in the chain; testing across eleven terms in two structurally different families found no divergence between recovered "Mechanic" and the entry's own Places field. Atlas terminology took precedence once this was found (see the Governing Rule in `ATLAS_INVARIANTS.md`).

**Reads** — *the distinct way the condition becomes recoverable.* Proven genuinely separate from Places, not assumed, by Carry and Trace: identical Dependency, identical Contribution, identical Generation, yet their own Reads fields diverge by direction alone. If Reads were redundant with Places, this divergence could not produce two different terms from one shared condition. It does. Reads is the Atlas's own mandatory field of the same name; it collapses trivially into Places wherever a condition supports only one access-path.

**Term** — *the name given to a particular Read, not to the condition and not to any dependency.* Confirmed across every audited term: no term's name is simply one of its own dependencies restated. Naming also involves a carving choice, not a strict one-condition-one-term mapping — Carry and Trace are one underlying condition carved into two terms by direction. Whether this carving pattern recurs elsewhere is open (`OPEN_QUESTIONS.md`).

**Inheritance and Crossing are separate investigative questions, not part of this six-layer chain.** Inheritance ("what mechanic continues through this term, traced ancestrally") and Crossing ("does this term's generation cross an order boundary, and by what mode") were used in specific audits — the order-crossing family and the Second Order asymmetry investigation — but are not run on every term as a matter of course, and were confirmed independent of each other (via Resolution's own text describing both a persisting mechanic and a closing scope simultaneously).

---

## 3. Stewardship Tests

Four object-level tests were actually used across the full audit. Do not invent others; recover further tests only when the Atlas repeatedly forces a question these four cannot answer.

### Dependency Membership Test
**Question:** Is a concept mentioned in an entry's own prose a missing formal dependency, or merely descriptive language?

**Test:** Does the mention name a *specific, nameable structural entity* with definite-article specificity or an explicit wikilink, doing *load-bearing work the existing dependency set doesn't cover* — as opposed to a *casual, general word-use true of an entire sibling-set equally*?

**Falsified by:** a mention that is generic and shared across an entire sibling family regardless of what distinguishes them individually. Confirmed negative case: Yield, Transfer, and Failure all mention "strain" informally; correctly left unfixed.

Full worked examples: `STEWARDSHIP_CASE_STUDIES.md` (Release, Field of Participation, Maintained Coupling).

### Language Integrity Test
**Question:** Does a Pairs-field statement about a downstream term ("X becomes Y") correctly describe the relationship, or does it misstate persistence as sequence (or vice versa)?

**Test:** Check the downstream term's own `is_terminal` metadata, individually, every single time — never by pattern-matching from a prior case. Not terminal → persistence is required, "becomes" is a false-sequence error. Terminal → "becomes" may be linguistically correct, because something genuinely closes.

**The canonical cautionary case:** Bearing → Resolution. Full account in `STEWARDSHIP_CASE_STUDIES.md`. This is the single most important procedural lesson in this specification.

### Contribution Uniqueness Test
**Question:** Do two dependencies within one compound term actually contribute different work, or does one restate the other?

**Test:** For each pair that looks similar, ask what specifically disappears if one is removed while the other remains.

### Generation Sufficiency Test
**Question:** Which dependencies in a compound are jointly sufficient, and does removing any one collapse the mechanic into a different, already-named mechanic, rather than merely making it unverifiable?

**Test:** Remove each candidate in turn. Collapse into a different named thing → in the sufficient set. Still occurs, merely disconnected → necessary but outside the sufficient set.

**Known unresolved residue:** in every compound tested, one dependency fails *both* tests — its removal produces plain absence, not a rival state and not a disconnected-but-intact mechanic. Recurred three times, never promoted to a category. See `OPEN_QUESTIONS.md` (Pressure).

---

## 4. Evidence Grading and Atlas Invariants

Full detail lives in dedicated documents — `EVIDENCE_GRADING.md` and `ATLAS_INVARIANTS.md`. Summary:

Evidence classes (E1–E5) describe **how strongly a conclusion is anchored**, not whether a repair is permitted. A low class does not block a repair if a test is otherwise decisively passed or failed; it calibrates how much independent corroboration exists.

Eight invariants were recovered, separated into four primitives (independent of each other), three derived invariants (consequences of the primitives), and one governing rule (adjudicates conflicts between structure and its prose expression — language answers to structure, never the reverse).

---

## 5. Recommendations for Every Steward

**Preserve without renegotiation:**
- The six-layer calculus and the four object-level tests.
- The rule that Dependency gaps are fixed by *supplementing* Holds/Traces, never by rewriting Places, Reads, or Term.
- The Governing Rule.

**Distrust by default:**
- Any "dependency movement" or similarly-formatted narrative sub-section as a standalone source for dependency claims. Cross-check against the term's own formal Holds field for internal consistency first. See `STEWARDSHIP_CASE_STUDIES.md` (Maintained Coupling).
- Any Pairs-field "becomes" statement, until `is_terminal` status has been checked *individually*, regardless of how many similar cases were already confirmed in the same session.

**Never change without strong, specific evidence:**
- Second Order's missing terminal marker. Do not invent one. See `OPEN_QUESTIONS.md`.
- Places, Reads, or Term wording on any term that already passes all four tests cleanly.
- Anything based solely on resemblance to a previously-fixed case.

---

## 6. Where Everything Else Lives

- `README.md` — start here first.
- `CURSOR.md` — operating instructions for AI stewards.
- `EVIDENCE_GRADING.md` — full detail on E1–E5.
- `ATLAS_INVARIANTS.md` — full detail on all eight invariants and their derivation relationships.
- `STEWARDSHIP_CASE_STUDIES.md` — five worked investigations, including every rejected assumption in full.
- `AUDIT_LOG.md` — factual record of every family, term, and repair audited to date.
- `OPEN_QUESTIONS.md` — everything genuinely unresolved, separated from Pressure and from solved questions.

## Appendix — Term Definitions

**Stewardship.** The application of a recovered, tested method to verify existing Atlas structure against itself, correcting only where a specific object-level test is decisively failed.

**Dependency.** The complete `holds`/`needs` set for a term.

**Contribution.** The specific, distinct work one dependency performs, described with a verb, independent of any other dependency.

**Generation.** The smallest subset of contributions jointly sufficient to account for a term's mechanic.

**Places.** The Atlas's own mandatory field stating the recovered condition.

**Reads.** The Atlas's own mandatory field stating the distinct way a condition becomes recoverable.

**Term.** The name given to a specific Read.

**Inheritance.** A separate investigative question — what mechanic remains recognisable through a term, traced ancestrally.

**Crossing.** A separate investigative question — whether a term's generation crosses an order boundary, and by what mode.

**Evidence class (E1–E5).** A grading of how strongly a conclusion is anchored in repository evidence. Grades confidence; does not gate whether a repair is made.

**Structural invariant.** A property confirmed to hold regardless of which family is being audited, promoted only after repeated, genuine attempts at falsification fail.

**Primitive invariant.** A structural invariant that does not follow from any other recovered invariant.

**Derived invariant.** A structural invariant whose truth follows from one or more primitive invariants.

**Governing stewardship rule.** Language answers to structure, never the reverse.

**Confirmed / Rejected / Pressure / Open.** Confirmed: forced by repository evidence, promoted. Rejected: tested and failed, with a replacement recorded. Pressure: a repeated pattern worth continued attention, not yet promoted. Open: a specific question with insufficient evidence in either direction.
