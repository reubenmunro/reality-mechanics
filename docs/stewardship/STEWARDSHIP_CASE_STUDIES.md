# Stewardship Case Studies

Five worked investigations, chosen because each teaches a distinct lesson the summary tables in `STEWARDSHIP_V1.md` can't fully convey on their own. Read these before performing your first audit — pattern-recognition from a compressed rule is not the same as understanding why the rule exists.

---

## Case Study 1: Bearing → Resolution — Pattern vs. Individual Verification

**This is the single most important case study in this repository. Read it fully before applying the Language Integrity Test to anything.**

### Question
Bearing's Pairs field stated: *"the structural asymmetry is fully expressed by what bearing becomes: [[Resolution]]."* Three other cases in the same session — Strain→Bearing, Presence→Bearing Relation, Bearing Relation→Participation — had already been identified as the same defect: "becomes" falsely implying a downstream term finishes a sequence, when the actual relationship is the upstream dependency *remaining true* while the downstream condition continues.

### Investigation
The obvious move was to apply the same fix: rewrite Bearing's Pairs field to state persistence instead of transformation, matching the three already-confirmed cases. This was actually done — the edit was made.

Then, before pushing, the fix was checked against Resolution's own metadata rather than assumed correct by resemblance. Resolution carries `is_terminal: true`, `terminal_of: first_order`. Its own body text states directly: *"resolution closes one condition without ending relation"* and *"bearing has become determined enough that the same first-order passage cannot continue as the same passage."* This is not persistence. Something genuinely closes.

### Evidence
E5 (the metadata is a whole-repository invariant — only three entries in all of Reality Mechanics carry `is_terminal: true`, and Resolution's own prose independently corroborates what the metadata states).

### Outcome
The edit was reverted before pushing. "Becomes" was the linguistically correct word for this specific relationship, precisely because Resolution genuinely terminates the first-order chain. The three other fixes (Strain→Bearing, Presence→Bearing Relation, Bearing Relation→Participation) remained correct, because none of *their* downstream targets carry `is_terminal: true`.

### Stewardship Lesson
**Never apply the Language Integrity Test by resemblance to a prior case, no matter how many times the pattern has already been confirmed.** Three confirmed instances of a defect create a strong intuitive pull toward treating a fourth similar-looking case as the same thing. It very nearly wasn't. The only reason this mistake didn't ship was that the specific downstream term's metadata was checked individually, one more time, out of habit rather than necessity. Build that habit deliberately. Do not trust pattern-matching across "the same" defect, ever, regardless of session-local confidence.

---

## Case Study 2: Release — Specific Referent, Corroborated by Siblings

### Question
Release's Holds field listed only `[[Resolution]]` and `[[Strain]]`. Its own Places and Reads fields both stated the relevant condition as *"no longer retained by **the bearing condition**"* — a definite-article reference to a specific structural entity, not present in Holds.

### Investigation
The Dependency Membership Test requires distinguishing a load-bearing, specific reference from casual general language. Checked Release's four sibling entries in the same folder (Transfer, Absorb, Yield, Failure) — every one of them explicitly cites `[[Bearing]]` as a dependency. Release was the sole exception, despite being arguably the most bearing-centric definition of the five (its entire content is about strain leaving a bearing condition).

### Evidence
Originally logged as **E1** (local — the evidence appeared to come only from Release's own fields). On later review, this was corrected to **E3** (cross-entry corroboration) — the comparison against four independently-written sibling entries is real, external evidence, not merely an internal reading of one file. This correction is itself the lesson: initial evidence classification can understate what was actually done, and should be revisited rather than left standing once the fuller picture is clear.

### Outcome
`[[Bearing]]` added to Release's needs, holds, and traces fields (frontmatter and body). Places, Reads, and Term text left unchanged — this was a dependency-list correction, not a meaning correction.

### Stewardship Lesson
When a specific referent is found in one file, checking sibling entries in the same structural family for consistency is not optional extra diligence — it is where the real evidence often actually lives, and where an evidence classification can be quietly under-reported if the check isn't made explicitly.

---

## Case Study 3: Field of Participation — Cross-Entry Corroboration Without Being Asked

### Question
Field of Participation's Holds field listed `[[Participation]]` and `[[Natural Order]]`. Its own Places and Reads both used "recurring" and "repeatedly" — language neither dependency obviously supplies.

### Investigation
Second Order Crossing — audited independently, in an earlier and entirely separate family, with no anticipation of this later question — states directly: *"The first third-order condition is Field of Participation — recurring organisation arising through participation,"* and builds this from `[[Participation]]` and `[[Recurrence]]` jointly in its own Holds field.

This is stronger evidence than Release's case, and the distinction matters: Release's corroboration came from *actively checking* four siblings for consistency. Field of Participation's corroboration was **already sitting in the repository**, written by a separate audit that had no reason to anticipate this question, before this question was ever asked.

### Evidence
**E3**, and the strongest instance of E3 found in the whole audit — genuine independent corroboration, not solicited comparison.

### Outcome
`[[Recurrence]]` added alongside the existing `[[Participation]]` and `[[Natural Order]]`. Natural Order was kept, not replaced — it supplies a genuinely distinct contribution (order without imposition, keeping the field organic rather than artificially categorised), independently necessary alongside Recurrence.

### Stewardship Lesson
The strongest corroborating evidence is sometimes evidence that already exists in the repository, from work done for entirely different reasons. This is why full-repository awareness (or at minimum, checking related audited families) matters more than re-deriving a conclusion from one file's own text alone.

---

## Case Study 4: Identity → Coupling — Long-Range Trace Integrity

### Question
Identity's Traces field listed `[[Coupling]]` as ancestral. Its two direct dependencies, Form and Recognition Read, did not obviously lead there — Form traced to Difference and Closure Scope (a completely separate lineage, back to Boundary/Resolution), and Recognition Read's own dependencies didn't obviously reach Coupling either at first inspection.

### Investigation
Rather than assume Identity's Traces field was loose or aspirational, the claim was traced properly, one generation at a time:
- Recognition Read → Readability, Cognitive Participation.
- Readability → Read, Attend (a dead end — this is the Carrier Mechanics lineage, unrelated to Coupling).
- Cognitive Participation → Readability, **Participation**.
- Participation → Carrying, **Presence**, Bearing Relation.
- Presence → **Coupling**.

The path exists, five generations deep, through Cognitive Participation's *second* dependency (Participation), not through the more obvious-looking Readability path.

### Evidence
**E4.** The criterion is successful retraceability, not the number of generations traversed — a five-generation trace that had failed would not have been weaker evidence of a problem; it would simply have been a confirmed gap. The depth here is incidental to the method; what matters is that the retrace was attempted fully rather than abandoned after the first dead end.

### Outcome
No edit. Identity's Traces field claim was confirmed accurate. This is recorded as a positive finding in its own right, not merely "no defect found" — it is a confirmed case where a claim that looked false on cursory inspection was verified true by doing the actual work, which is a stronger result than an uneventful pass on a claim nobody had reason to doubt.

### Stewardship Lesson
A Traces-field claim that looks unsupported through direct dependencies is not evidence of an error until the full ancestral path has actually been walked. Dead ends along the way (Readability's path) do not disprove the claim if an alternative path (through Participation) succeeds. Always trace to a conclusion — accurate or not — rather than stopping at the first dead end and reporting a false negative.

---

## Case Study 5: Maintained Coupling — Rejecting Narrative Authority

### Question
Several terms (Engineered Coupling, Nested Coupling, Maintained Coupling) contain an extended "dependency movement" narrative embedded in their Reads sections, formatted as a structured, formally-wikilinked, multi-step account of ancestry — distinct from and more elaborate than the terms' own Holds fields. Does this narrative section carry the same authority as a formal Holds field?

### Investigation
Tested this directly against Maintained Coupling specifically, checking the narrative section's own internal consistency against the same file's uncontroversial Holds field. Maintained Coupling's Holds field lists `[[Coupling]]`, `[[Bearing]]`, `[[Recurrence]]` — clean, uncontested. Its own "dependency movement" narrative states: *"Second: [[Coupling]], [[Carrying]], [[Recurrence]], and [[Compatibility]] make continuing coupling evaluable."*

This narrative **omits Bearing entirely** — a dependency unambiguously present in the same file's own Holds field — while adding two items (Carrying, Compatibility) that Holds doesn't list. This is not the narrative *supplementing* the formal field. It is the narrative *disagreeing* with its own file on an item both should agree on.

Separately, the actual missing-Compatibility gap (see below) was found and confirmed using only the term's own opening sentence and Reads field — deliberately without relying on the narrative section's authority, specifically to test whether the conclusion needed that assumption at all. It didn't.

### Evidence
**E3** for the internal-contradiction finding (comparing narrative against Holds within one file counts as cross-entry-equivalent scrutiny, since the two sections were effectively functioning as independent sources within the same document). **E1** for the actual Compatibility gap that was confirmed and fixed, since that conclusion rested entirely on the opening sentence and Reads field, not the narrative section.

### Outcome
Compatibility added to Maintained Coupling's dependencies, justified independently of the narrative section. The narrative-authority assumption itself was **rejected** — not merely left unproven. Every dependency gap actually confirmed across the whole audit (Engineered Coupling, Nested Coupling, Maintained Coupling) turned out to be independently supported by the opening sentence or Reads field anyway; the narrative section was never the thing actually holding up a conclusion, even in the cases where it happened to also mention the missing term.

### Stewardship Lesson
A textual apparatus that *looks* authoritative — formatted, structured, explicitly wikilinked, narratively confident — is not automatically evidence-bearing. Test it against the plainest, most reliable source available within the same document (the formal Holds field) before trusting it as a standalone source for anything. When a repair can be justified without leaning on a disputed source, justify it that way, and treat the disputed source as unproven rather than quietly reinforced by successful repairs that didn't actually need it.
