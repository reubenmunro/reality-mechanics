# Atlas Invariants

Separated deliberately into three tiers, because testing showed they are not flat peers. Some invariants presuppose others, and one is a rule about how conflicts between the rest get resolved — a different *kind* of claim than a substantive statement about what a field contains.

Do not treat this as a flat list of ten equally-weighted rules. The structure below is itself a recovered finding, not organizational convenience.

---

## Primitive Invariants

Independent of each other and of everything else in this document. Nothing else recovered derives these; each required its own direct falsification attempt.

### 1. The mechanic a term names is a condition, and Places is where that condition is stated.

**Falsification attempted against:** the hardest available case, Participant, which names an agent (who takes part) rather than an availability or determination the way Boundary or Resolution do. Even there, Places is phrased as a condition ("the condition of taking part"), not a bare role-label.

**Evidence: E5.** Confirmed across all ~51 audited terms, no exception.

### 2. Dependencies supply distinct contributions, never bare description.

**Falsification attempted against:** every compound term's "merely supporting" dependencies specifically — the members most likely to be decorative if this invariant were false. Recarry's Trace and Groundedness, the least distinctively-generative members of that compound, still had separately-nameable jobs (locating origin; answering to wider foundation) — never bare restatement.

**Evidence: E5.**

### 3. Reads answers a genuinely separate question from Places.

**Falsification attempted against:** Carry and Trace, deliberately, as the single case where two terms share everything else. Identical Dependency, identical Contribution, identical Generation — Reads still diverges by direction alone. If Reads were redundant with Places, this divergence could not produce two different terms from one shared condition.

**Evidence: E4** (confirmed via the one clean case of divergence, not merely repeated non-difference — this is a different and more decisive kind of evidence than simply never finding a counterexample).

### 4. Structural ancestry remains retraceable across long distances.

**Falsification attempted against:** Identity's Traces claim to Coupling, which looked unsupported through its two direct dependencies and was confirmed true only five generations back.

**Evidence: E4.** Weaker sample size than the other three primitives — only two deep traces performed (Identity→Coupling; Groundedness→Root Order). Treat as confirmed, not yet exhaustively tested.

---

## Derived Invariants

Consequences of the primitives above. Confirmed directly, but their truth follows from what's already established rather than standing independently.

### 5. Terms name the condition, never a dependency.

**Derivation:** follows directly from Primitive 1. If the mechanic is the condition, a Term naming a dependency instead would contradict Primitive 1 outright — there is no way for this to be false while Primitive 1 is true.

**Confirmed independently anyway:** checked across all ~51 terms; no term's name is simply one of its own dependencies restated (Boundary ≠ Distinction; Resolution ≠ Bearing + Clearance; Pair ≠ Coupling + Readability + Closure Scope).

### 6. Compound mechanics preserve contribution separation.

**Derivation:** this is Primitive 2, applied specifically to the case where more than one dependency is present. The adjacent-pair stress tests (Contribution Uniqueness Test, `STEWARDSHIP_V1.md` Section 3) were tests of Primitive 2 under harder conditions, not a separate discovery.

### 7. Generation is the smallest jointly sufficient contribution set.

**Derivation:** mostly derived from Primitives 1 and 2 — once dependencies contribute distinct pieces of a condition, asking for the minimal sufficient subset is the natural next question. **Not purely derived**, however: Primitives 1 and 2 alone don't guarantee such a minimum is well-defined or unique. Generation adds one further, non-derived claim — that sufficiency is testable and has a determinate answer.

**Survived the hardest available test:** a full attempt to reframe generation entirely (replacing generative/supporting classification with contribution-language) could have broken the underlying sufficiency claim. It didn't — only the labeling of non-selected members changed; the sufficiency claim itself held through the reframe.

---

## Governing Stewardship Rule

Not a primitive invariant, and not derived from the primitives in the same sense as items 5–7. This is a rule about how disagreements between structure and its own prose expression get resolved — a procedural rule, not a substantive claim about what any field contains.

### 8. Language answers to structure; structure is never bent to match language.

Every language-drift repair worked in exactly this direction: an independently-established structural fact (terminal metadata, sufficiency, specific-referent status) was confirmed first, and prose was corrected to match it — never the reverse. The one near-miss (Bearing → Resolution, see `STEWARDSHIP_CASE_STUDIES.md`) proves this sharply: "becomes" was judged *correct*, precisely because the structural fact (terminal status) supported it — the word was never judged on its own appeal.

"Places and Reads outrank Holds when they conflict" — used throughout every dependency-gap repair — is this rule's specific instance at the Holds/Places boundary. It is not a ninth, separate invariant; it is invariant 8 applied at one particular field boundary.

---

## Why the Separation Matters

If a future steward finds a new candidate invariant, this structure tells you what to check before promoting it:

1. Can it be falsified against a hard case the way Primitives 1–4 were, or does it only ever get confirmed by absence-of-counterexample? The former is stronger evidence.
2. Does it actually follow logically from something already on this list? If so, it belongs in Derived, not Primitive — check this explicitly rather than assuming a new-sounding claim is independent.
3. Is it a substantive claim about Atlas content, or a rule about resolving disagreements between fields? The latter belongs with the Governing Rule, not with the primitives.
