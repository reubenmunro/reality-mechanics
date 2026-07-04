# Stewardship v1 — Handover Specification

This document is self-contained. It assumes no prior conversation, no memory of how it was recovered, and no familiarity with any working session. Read this before touching any Atlas entry.

---

## 1. Stewardship Purpose

**Stewardship is the application of a recovered, tested method to verify existing Atlas structure against itself.** It answers one question, asked term by term: *does this entry's own structure survive being tested against the method the Atlas itself has already forced us to recover?*

**Stewardship is not:**
- Authoring. A steward does not invent Atlas terms, mechanics, or categories.
- Discovery for its own sake. Interesting patterns that the Atlas has not repeatedly forced are recorded as Pressure, not acted on.
- Symmetry-seeking. Structural differences between families are evidence to record, not defects to fix. Do not restore symmetry where the Atlas has not demanded it.
- Maximizing edits. A steward's job is not to produce the most repairs possible. It is to produce justified confidence — in the Atlas, and in the method itself. A run of clean audits is evidence of that confidence, not an absence of results.
- Improving prose because it reads better. Language is only corrected when it misstates an already-established structural fact.

**The burden of proof sits on every proposed change, never on existing structure.** Every entry is presumed structurally sound until a specific, named test fails against it.

---

## 2. Stewardship Calculus

Six layers, recovered independently and confirmed non-mergeable by direct testing (not by assumption — each adjacent pair was checked for collapse and none collapsed).

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

**Dependency** — *what must remain true.* The complete `holds`/`needs` set for a term, established as a fixed list before any further analysis. This must come first and stay separate from Contribution: you need the complete denominator before you can check whether your description of what each member contributes is exhaustive. Skipping this step risks silently missing a member.

**Contribution** — *what unique work each dependency performs, described independently, with a verb, before any comparison or sorting.* Recover this for every member of the Dependency set on its own terms. Do not classify dependencies into categories (see Section 6 — this was tried and rejected). Two dependencies that look similar must be checked individually for overlap; adjacency is not evidence of redundancy (see Section 3, Contribution Uniqueness Test).

**Generation** — *the smallest set of contributions that is jointly sufficient to account for the mechanic.* This is a **membership test**, not a labeling exercise: the question is only "is this subset enough," never "what should we call the members that aren't in it." Contributions outside the sufficient set need no name — their contribution already stands, fully described, from the previous layer. Generation also collapses what earlier work called "nearest" and "sufficient" into a single recursive operation: testing whether a nearer or more distant candidate could substitute is the same sufficiency test applied at a different point in the graph, not a second procedure.

**Places** — *the recovered condition itself.* This is not a new methodological layer invented during stewardship. It is the Atlas's own mandatory field, present on every entry. Working recovery temporarily used the word "Mechanic" for this point in the chain; testing across eleven terms in two structurally different families found no divergence between the recovered "Mechanic" and the entry's own Places field. This was reconciled, not merely renamed: the Atlas already had stronger language than the temporary working term, and Atlas terminology takes precedence whenever this happens (see the Governing Rule, Section 5).

**Reads** — *the distinct way the condition becomes recoverable.* This is genuinely separate from Places, not a restatement of it — proven, not assumed, by Carry and Trace: identical Dependency, identical Contribution, identical Generation, yet their own Reads fields diverge by direction alone ("passage from a prior condition into a further condition" versus "a path back toward the condition from which its forward carry proceeds"). If Reads were redundant with Places, this divergence could not produce two different terms from one shared condition. It does. Reads is the Atlas's own mandatory field of the same name; it collapses trivially into Places wherever a condition supports only one access-path, and becomes independently visible only where more than one path exists.

**Term** — *the name given to a particular Read, not to the condition and not to any dependency.* Confirmed across every audited term: no term's name is simply one of its own dependencies restated (Boundary ≠ Distinction; Resolution ≠ Bearing + Clearance). Naming also involves a carving choice, not a strict one-condition-one-term mapping — Carry and Trace are one underlying condition (held Connection + Hold availability) carved into two terms by direction. This carving pattern has been confirmed once, cleanly; whether it recurs elsewhere in the Atlas beyond directional pairs is still open (Section 8).

**Do not confuse this calculus with Inheritance and Crossing.** Inheritance ("what mechanic continues through this term, traced ancestrally") and Crossing ("does this term's generation cross an order boundary, and if so how") are separate, valid investigative questions used during specific audits — particularly the order-crossing family and the Second Order asymmetry investigation — but they are not part of the six-layer naming chain above, and are not run on every term as a matter of course. They answer different questions from the ones Dependency-through-Term answers, and were confirmed (via Resolution's own text) to be independent of each other, not sequential.

---

## 3. Stewardship Tests

Four object-level tests were actually used across the audit. Do not invent others; recover further tests only when the Atlas repeatedly forces a question these four cannot answer.

### Dependency Membership Test
**Question:** Is a concept mentioned in this entry's own prose a missing formal dependency, or merely descriptive language?

**Test:** Does the mention name a *specific, nameable structural entity* with definite-article specificity or an explicit wikilink, doing *load-bearing work the existing dependency set doesn't cover* — as opposed to a *casual, general word-use true of an entire sibling-set equally*?

**When it applies:** Whenever a term's Places, Reads, or opening definition invokes a concept its own Holds field doesn't list.

**Falsified by:** finding that the mention is generic and shared across an entire sibling family regardless of what distinguishes them individually. Confirmed negative case: Yield, Transfer, and Failure all mention "strain" informally; all three were correctly left unfixed, because the mention doesn't distinguish any one of them from its siblings.

**Confirmed positive cases:** Release (missing Bearing — "the bearing condition" invoked with definite-article specificity, absent from Holds while present in all four sibling entries); Field of Participation (missing Recurrence — its own Places/Reads use "recurring" language, and an independently-written entry, Second Order Crossing, states the same generation-path); Engineered Coupling (missing Compatibility); Nested Coupling (missing Participation); Maintained Coupling (missing Compatibility, confirmed via two non-narrative internal signals — the opening sentence and the Reads field — deliberately without relying on the rejected narrative-authority assumption, see Section 6).

### Language Integrity Test
**Question:** Does a Pairs-field statement about a downstream term ("X becomes Y" or similar) correctly describe the underlying relationship, or does it misstate persistence as sequence (or vice versa)?

**Test:** Check the downstream term's own `is_terminal` metadata, individually, every time — never by pattern-matching from a prior case. If the downstream term is **not terminal**, the relationship is persistence: the upstream dependency must remain true while the downstream condition continues, and "becomes" is a false-sequence error. If the downstream term **is terminal**, "becomes" may be the linguistically correct word, because something genuinely closes.

**When it applies:** Any vertical (non-lateral) Pairs field describing a term's relationship to what it generates downstream.

**Falsified by, decisively:** Bearing → Resolution. This was initially treated as the same defect as three other cases and fixed identically — then caught and reverted before pushing, once Resolution's own `is_terminal: true` status (already established earlier in the same work) was checked against the edit just made. This is the canonical cautionary case: **never apply this test by resemblance to a prior fix. Re-verify terminal status individually every time**, even when three prior cases in the same session looked identical on the surface.

**Confirmed positive cases (non-terminal, fixed):** Strain → Bearing, Presence → Bearing Relation, Bearing Relation → Participation, Closure → Closure Scope.

**Confirmed negative case (terminal, correctly left alone):** Bearing → Resolution.

### Contribution Uniqueness Test
**Question:** Do two dependencies within one compound term actually contribute different work, or does one merely restate the other?

**Test:** For each pair that looks similar, ask what specifically disappears if one is removed while the other remains. If the answer is the same for both, they overlap; if different, they don't.

**When it applies:** Any compound term with three or more dependencies, especially where two sit in similar semantic territory.

**Falsified by:** actively checking Recarry's Trace against Groundedness (both "connect to something real" on the surface) — found genuinely distinct: Trace answers *where from* (backward, lineage); Groundedness answers *still supported by what* (present, foundation). Also Groundedness against Compatibility (both look like "the receiving side") — found distinct: Groundedness is the carrying's own honesty; Compatibility is the destination's capacity to receive.

### Generation Sufficiency Test
**Question:** Within a compound's contribution set, which subset is jointly sufficient, and does removing any one member of that subset collapse the mechanic into a different, already-named mechanic (or an adjacent failure-mode) rather than merely making it unverifiable?

**Test:** Remove each candidate dependency in turn. If the mechanic becomes a *different, already-named* thing (or a worse neighboring failure-mode), that dependency is in the sufficient set. If the mechanic still occurs, merely disconnected from verification, it is necessary but outside the sufficient set.

**Confirmed case, corrected on review:** Recarry's sufficient set is {Contact, Release, Compatibility} — not {Contact, Release} as first concluded. Removing Compatibility doesn't merely make Recarry unverifiable; it collapses the outcome into Collapse/Failure, a different named mechanic. This correction is itself evidence the test works: applying it rigorously overturned an earlier, looser conclusion.

**Known unresolved residue:** in every compound tested (Resolution, Coupling, Recarry), one dependency (Bearing; Resolved Asymmetry; Carrying, respectively) fails *both* the sufficiency test and the "merely unverifiable" test — its removal produces plain absence, not a rival state and not a disconnected-but-intact mechanic. This recurred three times but was never promoted to a third category, per the discipline of not inventing vocabulary the Atlas hasn't repeatedly forced. Recorded as Pressure (Section 8), not resolved.

---

## 4. Evidence Grading

Evidence classes describe **how strongly a conclusion is anchored**, not whether a repair is permitted. A low evidence class does not block a repair if the Dependency Membership or Language Integrity test is otherwise decisively passed or failed; it only means the finding should be reported with appropriately calibrated confidence, and that a future steward should know how much independent corroboration actually exists.

| Class | Definition | Example |
|---|---|---|
| **E1 — Local** | Recovered from a single term's own fields (Dependency, Places, Reads, opening sentence). | Engineered Coupling's missing Compatibility — found entirely within its own Places and Reads text. |
| **E2 — Compound** | Recovered by comparing multiple dependencies within one term. | The Contribution Uniqueness Test applied to Recarry's Trace vs. Groundedness. |
| **E3 — Cross-entry corroboration** | Two or more independently-written entries mutually support the same claim. | Second Order Crossing's own text independently states Field of Participation's generation-path, confirming a gap found separately in Field of Participation's own fields. Release's gap, on review, was reclassified up from E1 to E3 once compared against all four sibling entries (Transfer, Absorb, Yield, Failure), all of which cite the dependency Release omitted. |
| **E4 — Long-range trace integrity** | Confirmed by successfully retracing ancestry through multiple generations. Not "deep" for its own sake — the criterion is that the retrace actually succeeds. | Identity's Traces claim to Coupling looked unsupported through its two direct dependencies; confirmed true only after tracing five generations (Identity → Recognition Read → Cognitive Participation → Participation → Presence → Coupling). |
| **E5 — Repository invariant** | Recovered only through exhaustive repository evidence — a whole-repository scan, or a property holding across every audited family without exception. | The whole-repository scan for `is_terminal: true` found exactly three matches in 492 entries (Resolution, Nesting, Recursion) — a complete count, not a sample. |

---

## 5. Recovered Atlas Invariants

Separated deliberately into three tiers, because testing showed they are not flat peers — some invariants presuppose others, and one is a rule about how conflicts between the rest get resolved, not a substantive claim of the same kind.

### Primitive Invariants (independent; nothing else in the set derives them)

1. **The mechanic a term names is a condition, and Places is where that condition is stated.** Confirmed across all audited terms with no exception (E5).
2. **Dependencies supply distinct contributions, never bare description.** No counterexample found across every compound tested (E5).
3. **Reads answers a genuinely separate question from Places.** Proven by Carry/Trace's divergence despite identical Dependency, Contribution, and Generation (E4).
4. **Structural ancestry remains retraceable across long distances.** Confirmed by two deep traces (Identity→Coupling, five generations; Groundedness→Root Order, back to the first family audited). Weaker sample size than the other primitives — treat as confirmed but not yet exhaustively tested (E4).

### Derived Invariants (consequences of the primitives above, confirmed but not independently load-bearing)

5. **Terms name the condition, never a dependency.** Follows directly from Primitive 1: if the mechanic is the condition, a Term naming a dependency instead would contradict Primitive 1 outright.
6. **Compound mechanics preserve contribution separation.** This is Primitive 2, applied to the specific case of more than one dependency being present. The adjacent-pair stress tests (Section 3) were tests of Primitive 2 under harder conditions, not a separate discovery.
7. **Generation is the smallest jointly sufficient contribution set.** Mostly derived from Primitives 1 and 2 (once dependencies contribute distinct pieces of a condition, asking for the minimal sufficient subset is the natural next question) — but not purely derived. Primitives 1 and 2 alone don't guarantee such a minimum is well-defined; Generation adds the further claim that sufficiency is testable and has a determinate answer.

### Governing Stewardship Rule (adjudicates between the above and their expression in prose; not itself a substantive claim about Atlas content)

8. **Language answers to structure; structure is never bent to match language.** Every language-drift repair (Section 7) worked in exactly this direction: an independently-established structural fact (terminal metadata, sufficiency, specific-referent status) was confirmed first, and prose was corrected to match it — never the reverse. This rule is what "Places and Reads outrank Holds in conflict" (used throughout Section 3 and 6) is a specific instance of, applied at the Holds/Places boundary. It is not listed as a fifth primitive because it is a different *kind* of claim — a rule for resolving disagreements between fields and their prose, not a claim about what any single field contains.

---

## 6. Rejected Assumptions

Recorded in full, including why each was plausible before it was tested, because a future steward is likely to reach for these same ideas independently.

### Generative/Supporting dependency classification
**Plausible because:** compound generation seemed to require sorting dependencies into "the ones that produce the mechanic" versus "the ones that merely support it."
**Tested against:** Resolution (Bearing/Clearance), Coupling (Resolved Asymmetry/Carrying), Recarry (all six dependencies).
**Failed because:** at least one dependency in every compound case (Bearing; Resolved Asymmetry; Carrying) resisted classification into either bucket — not because a third bucket was needed, but because the sorting question itself was premature.
**Replaced by:** recovering each dependency's specific contribution directly (a verb), with no requirement to sort it into any category at all.

### "Read" as the name for the layer between Places and Term
**Plausible because:** intuitively, a mechanic becoming nameable does feel like an act of "reading" it.
**Tested against:** the Atlas's own existing vocabulary.
**Failed because:** "Read" is already a specific, narrower First-order term (Trace's own downstream enactment as meaningful uptake). Reusing it for the general layer would create exactly the kind of naming collision the Atlas has hit and fixed elsewhere.
**Replaced by:** "Reads," matching the Atlas's own existing mandatory field name, already grammatically distinct from "Read" in the note-grammar itself.

### Composition as the general explanation for compound mechanics
**Plausible because:** Recarry's generative core (Contact → Release → Compatibility) genuinely does show sequential, output-feeding-input composition.
**Tested against:** Resolution, Carry/Trace, Carrying, Coupling, Recarry — checking whether each dependency's substrate was independent or fed from another dependency's output.
**Failed because:** five of six compounds tested showed independent-substrate conjunction (each dependency operates on its own separate material, jointly necessary by simultaneous truth, not sequence). Recarry was the sole exception.
**Replaced by:** Conjunction as the dominant, confirmed pattern; Composition retained only as a narrow, contained exception describing Recarry's own generative core specifically, not a general rule.

### Membership prior to Participation
**Plausible because:** ordinary intuition suggests something must "belong" before it can meaningfully "take part."
**Tested against:** Member's own Holds field, directly.
**Failed because:** Member's own text states the opposite explicitly — *"a thing must be... participating in a wider carried body before it can be read as a member."* The dependency graph runs Participation → Member, not the reverse.
**Replaced by:** Participation confirmed as structurally prior to Membership.

### "Dependency movement" narrative-section authority
**Plausible because:** several terms include an extended, formally-wikilinked narrative sub-section within their Reads field, describing a fuller ancestral chain than their own Holds field states — and it looks authoritative, formatted like a structured claim rather than loose color.
**Tested against:** Maintained Coupling, specifically for internal consistency — checking whether the narrative section agreed with the term's own, uncontroversial Holds field.
**Failed because:** the narrative section omitted Bearing entirely, despite Bearing being unambiguously present in Maintained Coupling's own formal Holds field. The narrative didn't just add unlisted items; it disagreed with its own file on an item both should have agreed on.
**Replaced by:** the Dependency Membership Test applied directly to Places, Reads-proper, and the term's own opening sentence — never to narrative sub-sections. Every dependency gap actually confirmed (Engineered Coupling, Nested Coupling, Maintained Coupling) turned out to be independently supported by this narrower evidence anyway; the narrative section was never load-bearing even when it happened to also mention the missing term.

### Note on Mechanic → Places (reconciliation, not rejection)
This is recorded separately because it differs in kind from the above five. "Mechanic" was not found to be *wrong* — it was found to already exist in the Atlas under a different, pre-existing name. See Section 2 and the Governing Rule (Section 5, item 8). Treat this as the discipline's own success case: independently rediscovering something the Atlas already had, and yielding to its existing terminology rather than keeping a parallel working vocabulary.

---

## 7. Audit Results

**Seventeen families audited. Approximately fifty-one primary terms directly run through the full calculus**, plus a smaller number of auxiliary entries consulted specifically for cross-verification (Distinction, Clearance, Form, Readability, Cognitive Participation) rather than audited as primary family members.

**Dependency repairs made or proposed (five):**
- Release — added Bearing. E3 on review (upgraded from initial E1 after comparison against four sibling entries).
- Field of Participation — added Recurrence. E3 (independent cross-entry corroboration via Second Order Crossing).
- Engineered Coupling — added Compatibility. E1.
- Nested Coupling — added Participation. E1.
- Maintained Coupling — Compatibility gap confirmed, E1; **fix proposed, not yet committed** at the point this document was produced.

**Language repairs made (four), all Strain:Bear-pattern persistence corrections, all individually re-verified against `is_terminal` status before fixing:**
- Strain → Bearing
- Presence → Bearing Relation
- Bearing Relation → Participation
- Closure → Closure Scope

**One correctly-identified non-repair:** Bearing → Resolution, initially fixed by pattern-match, caught and reverted before pushing, upon individual re-verification against Resolution's own terminal status.

**Rejected assumptions:** five (Section 6), plus one reconciliation (Mechanic → Places).

**Method failures:** zero. No case where the six-layer calculus, or any of the four object-level tests, failed to produce a determinate answer when applied.

**Confirmed structural gap (not filled, recorded as genuine):** Second Order has no order-level terminal marker, unlike First (Resolution), Third (Nesting), and Higher (Recursion) order. Investigated directly and specifically (not merely unsearched) and concluded, on the strongest available evidence, that this is a genuine architectural asymmetry rather than an omission: the property itself is already non-uniform where it exists (optional at the First-order boundary, mandatory at the Third-order boundary), Second Order's own audited material is consistently accumulative rather than determinative across two separate family audits, and the one plausible internal candidate (Coupling) was directly tested and found to answer a structurally different question (foundation/joining, not exhaustion). This should not be treated as an open search for future stewards to resume; see Section 9.

**Confidence:** high. The defects found (five dependency gaps, four language-drift instances) concentrated almost entirely in the audit's first seven families; the subsequent ten families, spanning single dependencies, compounds, cross-order terms, and Ground-order terms, produced zero further defects except where a specific, targeted hypothesis was deliberately tested against a likely candidate (Family 16). This is evidence of genuine, non-uniform structural health, not an absence of scrutiny.

---

## 8. Remaining Open Questions

These require further evidence before resolution. Distinct from Pressure (Section 9) — these are unresolved, not merely watched.

1. **Interposed Carrier's "carrying" language.** Its Places, Reads, and own name repeatedly invoke "carrying," but neither of its two dependencies (Contact, Boundary) supplies a carrying-quality, and no cross-corroborating second source has been checked. This sits genuinely between a confirmed gap and a safe casual mention — insufficient evidence in either direction. Do not resolve by pattern-matching against Release or Field of Participation; test independently if revisited.

2. **Whether the Mechanic→Term carving pattern (one condition, multiple directional terms) recurs beyond Carry/Trace.** Confirmed once, cleanly. One instance is a hypothesis, not yet a pattern.

3. **Whether Second Order's accumulative character is unique to it, or a matter of degree other orders also exhibit.** The asymmetry itself is confirmed (Section 7); the full characterization of *why* orders differ this way is not complete.

---

## 9. Recommendations for Future Stewards

**Preserve without renegotiation:**
- The six-layer calculus (Section 2) and the four object-level tests (Section 3). These were tested, not assumed, and none collapsed under deliberate attempts to merge or remove them.
- The rule that Dependency gaps are fixed by *supplementing* the Holds/Traces fields, never by rewriting Places, Reads, or Term. In every confirmed repair, the term's own meaning was already correct; only its stated dependency list was incomplete.
- The Governing Rule (language answers to structure, never the reverse).

**Distrust by default:**
- Any "dependency movement" or similarly-formatted narrative sub-section, as a standalone source for dependency claims. Cross-check it against the term's own formal Holds field for internal consistency before trusting anything it states that Holds doesn't already support.
- Any Pairs-field "becomes" statement, until `is_terminal` status has been checked *individually* for that specific case — regardless of how many similar cases were already confirmed in the same session. This is the single most important procedural lesson of the whole audit: pattern-matching across "the same" defect once caused a real, only-just-caught mistake.

**Never change without strong, specific evidence:**
- Second Order's missing terminal marker. Do not invent one. The evidence currently favors this being a genuine asymmetry, not a gap — treat any proposal to add a Second Order terminal marker as requiring the same burden of proof as any other structural claim, not as completing unfinished work.
- Places, Reads, or Term wording on any term that already passes all four object-level tests cleanly. A clean pass is itself evidence of health; it is not an invitation to improve phrasing.
- Anything based solely on resemblance to a previously-fixed case. Every one of the four object-level tests requires being run again, fully, on each new term — resemblance is a reason to check, never a reason to skip checking.

---

## 10. Appendix — Term Definitions

**Stewardship.** The application of a recovered, tested method to verify existing Atlas structure against itself, correcting only where a specific object-level test is decisively failed.

**Dependency.** The complete `holds`/`needs` set for a term — what must remain true for the term to exist. Established first, as a fixed list, before any further layer is attempted.

**Contribution.** The specific, distinct work one dependency performs, described with a verb, recovered independently of any other dependency and without classification into categories.

**Generation.** The smallest subset of contributions that is jointly sufficient to account for a term's mechanic. A membership test, not a labeling exercise.

**Places.** The Atlas's own mandatory field stating the recovered condition — what becomes newly true once a sufficient contribution-set holds. Equivalent to what working recovery temporarily called "Mechanic," reconciled in favor of the Atlas's own existing term.

**Reads.** The Atlas's own mandatory field stating the distinct way a condition becomes recoverable or accessible. Genuinely separate from Places; collapses into it trivially when only one access-path exists.

**Term.** The name given to a specific Read. Never names a dependency or the bare condition alone; may involve a carving choice when one condition supports more than one Read.

**Inheritance.** A separate investigative question — what mechanic remains recognisable through a term, traced ancestrally — used in specific audits, not part of the six-layer naming chain.

**Crossing.** A separate investigative question — whether a term's generation crosses an order boundary, and by what mode (direct or determined) — used in specific audits, not part of the six-layer naming chain.

**Evidence class (E1–E5).** A grading of how strongly a conclusion is anchored in repository evidence, from a single term's own fields (E1) to an exhaustive whole-repository invariant (E5). Grades confidence; does not gate whether a repair is made.

**Structural invariant.** A property confirmed to hold regardless of which family is being audited, promoted only after repeated, genuine attempts at falsification fail.

**Primitive invariant.** A structural invariant that does not follow from any other recovered invariant.

**Derived invariant.** A structural invariant whose truth follows from one or more primitive invariants, confirmed independently but not independently load-bearing.

**Governing stewardship rule.** The single rule adjudicating conflicts between structure and its own prose expression: language answers to structure, never the reverse.

**Dependency Membership Test.** The test deciding whether a prose-mentioned concept is a missing formal dependency: does it name a specific structural entity doing load-bearing work, as opposed to casual language shared across an entire sibling-set.

**Language Integrity Test.** The test deciding whether a "becomes"-style statement is correct: check the downstream term's own `is_terminal` status individually, every time.

**Contribution Uniqueness Test.** The test checking whether two dependencies within one compound term genuinely contribute different work, by asking what specifically disappears if each is removed while the other remains.

**Generation Sufficiency Test.** The test identifying which dependencies in a compound are jointly sufficient: remove each in turn and check whether the mechanic collapses into a different, already-named mechanic, or merely becomes disconnected from verification.

**Confirmed / Rejected / Pressure / Open.** Confirmed: forced by repository evidence, promoted. Rejected: tested and failed, with a replacement recorded. Pressure: a repeated pattern worth continued attention, not yet promoted to method or invariant. Open: a specific question with insufficient evidence in either direction, requiring further work before resolution.
