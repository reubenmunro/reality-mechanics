# Evidence Grading

Evidence classes describe **how strongly a conclusion is anchored**, not whether a repair is permitted. A low evidence class does not block a repair if the Dependency Membership or Language Integrity test (see `STEWARDSHIP_V1.md`, Section 3) is otherwise decisively passed or failed. It only means the finding should be reported with appropriately calibrated confidence, so future stewards know how much independent corroboration actually exists behind a given repair.

Do not overstate evidence. Always report the highest class actually earned — no higher.

---

## E1 — Local

**Definition:** Recovered from a single term's own fields (Dependency, Places, Reads, opening sentence).

**Example:** Engineered Coupling's missing Compatibility dependency — found entirely within its own Places text ("compatible mutual availability") and its own Reads field (explicit wikilink to `[[Compatibility]]`). No second, independent entry was consulted or required.

**Also E1:** Nested Coupling (missing Participation, from its own opening sentence), Maintained Coupling (missing Compatibility, from its own opening sentence and Reads field, deliberately independent of the rejected narrative-authority assumption — see `STEWARDSHIP_CASE_STUDIES.md`).

---

## E2 — Compound

**Definition:** Recovered by comparing multiple dependencies within one term.

**Example:** The Contribution Uniqueness Test applied to Recarry's Trace versus Groundedness — both look similar on the surface ("connect to something real"), and both were confirmed structurally distinct only by checking what specifically disappears if each is removed while the other remains (Trace answers *where from*; Groundedness answers *still supported by what*).

---

## E3 — Cross-entry corroboration

**Definition:** Two or more independently-written entries mutually support the same structural claim.

**Example:** Second Order Crossing's own text independently states Field of Participation's generation-path (Participation + Recurrence), confirming a gap found separately, and first, in Field of Participation's own fields. Neither entry was written with the other's gap in mind.

**Also E3:** Release's missing Bearing dependency — initially logged as E1, later corrected on review once compared against all four sibling entries (Transfer, Absorb, Yield, Failure), each of which independently cites Bearing where Release did not. **This upgrade is itself a worked example of the discipline this document asks for: report the highest class actually earned, and revise the classification when a stronger corroboration is later found — do not leave an earlier, weaker classification standing once better evidence exists.**

---

## E4 — Long-range trace integrity

**Definition:** Recovered by tracing ancestry through multiple generations and confirming the repository's own Traces field is structurally correct. The criterion is **successful structural retraceability**, not depth for its own sake — a five-generation trace that fails is not stronger evidence than a two-generation trace that succeeds.

**Example:** Identity's Traces field claims ancestry to Coupling, but neither of Identity's two direct dependencies (Form, Recognition Read) leads there. The claim looked unsupported at two generations. It was confirmed true only after tracing five full generations: Identity → Recognition Read → Cognitive Participation → Participation → Presence → Coupling.

**Also E4:** Carry and Trace's Reads-field divergence, confirming Reads is a genuinely separate question from Places despite identical Dependency, Contribution, and Generation.

---

## E5 — Repository invariant

**Definition:** Recovered only through exhaustive repository evidence — a whole-repository scan, or a property holding across every audited family without a single exception.

**Examples:**
- The whole-repository scan for `is_terminal: true`, which found exactly three matches across all 492 entries (Resolution, Nesting, Recursion) — a complete count, not a sample, and the basis for the entire Language Integrity Test.
- "Every mechanic names a recoverable condition, stated in Places" — confirmed across all ~51 audited terms in seventeen structurally varied families with no exception found.
- "Dependencies supply distinct contributions, never bare description" — no counterexample across every compound tested.

---

## Practical Guidance for Applying This Table

1. When a finding is reported, state both the conclusion and the evidence class in the same sentence. Example: *"Long-range trace integrity confirmed. Evidence: E4 (successful structural retraceability across five generations)."*
2. Revisit and upgrade a classification when stronger corroboration surfaces later — do not let an early, weaker classification stand once a cross-entry or invariant-level confirmation is found (see the Release example above).
3. A repair does not require E3 or higher to be made. E1 is sufficient when the Dependency Membership Test is otherwise clearly passed (Engineered Coupling, Nested Coupling, Maintained Coupling were all made on E1 evidence). The grading exists so a future steward auditing the same territory again knows exactly how much independent confirmation already exists, not so that low-graded repairs are treated as provisional.
