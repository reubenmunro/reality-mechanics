# Structural Reading

**Practice discipline.** This document records how Atlas language may be read and refined through structural calibration — not stylistic editing.

It is not Atlas content.

It is not the Practice Calculus.

It is not a style guide.

It is not a constitutional constraint.

It is the discipline for reading and refining Atlas language when calibration asks whether a place can be walked.

---

## Mission

Reality Mechanics exists to increase structural perception (`MISSION.md`).

Structural reading serves that mission by asking whether Atlas prose names a **place** faithfully enough that an independent reader can **walk** it — move through it, retrace it, and recover its dependencies without importing interpretation.

---

## Working Postulate

Language is not primary.

Place is primary.

Movement reveals place.

Language becomes more faithful as movement becomes more retraceable.

This postulate is **observational**, not promoted Calculus. It follows from D-006 (`docs/reports/D-006-calibrated-prose-refinement.md`), where Connection prose improved when Relation was named before Carry/Trace — not when sentences were shortened for elegance.

---

## Calibration Principle

The calibration engine no longer asks:

> Is this sentence well written?

It asks:

> Can this place be walked?

**Walk** means: an independent reader can move through the term's place, follow what becomes available, return through dependency, and recover every statement without unsupported abstraction.

The Calibration Engine v1 (`member/src/calibration-engine.mjs`) demonstrates movement through a place in read-model only. Structural reading extends that discipline to Atlas prose.

---

## What This Discipline Is Not

| Not this | Because |
|---|---|
| Style guide | Elegance, tone, and voice are out of scope |
| Proof | Calibration produces evidence and characterisation, not certainty |
| Atlas edit authority | The steward decides; reading produces recommendation |
| Calculus derivation | The `:` operator and operation grammar remain unaccepted |
| Ontology invention | No new terms, relations, or frontmatter fields without separate commission |

---

## Reading Process

For each selected Atlas term, run five passes **in order**. Do not rewrite until Pass 5.

### 1. Place

Identify the place being named.

Ignore wording. Only determine:

**What place exists?**

Read `conditions.places` and the term's opening body together. The place is what the term **places** — not what a reader prefers it to mean.

Record:

- what becomes available at this placement;
- what the term is **not** (negative reads count only when grounded in Atlas terms);
- whether the place is primitive, placed, or carried from elsewhere.

**Do not edit in Pass 1.**

---

### 2. Movement

Identify how movement occurs through that place.

Ask:

- **What changes?** — what becomes available when the place holds;
- **What remains?** — what must stay held for the place to remain readable;
- **What becomes available?** — what the term `carries`, and in which direction if directional.

Use frontmatter fields as movement reads, not as decoration:

| Field | Movement read |
|---|---|
| `needs` | what must already hold before this place can be read |
| `holds` | what presently bears this place |
| `traces` | how this place retraces backward |
| `carries` | what becomes available forward from this place |
| `pairs` | what completes or contrasts laterally without splitting the place |

**Do not edit in Pass 2.**

---

### 3. Retrace

Can an independent reader return to every statement through dependency?

Highlight every sentence that **cannot** be retraced.

A sentence is **unretraceable** when:

- it names no Atlas term, field, or grounded dependency reachable from the term under review;
- it imports meta-language ("working root", document order, editorial preference) without a retraced link;
- it names a condition that sounds Atlas-like but has no grounded term (e.g. unlinked "drift" where no `Drift` term exists);
- it states dependency **after** movement that depends on it (inverted order).

Record unretraceable sentences verbatim. Do not fix yet.

**Do not edit in Pass 3.**

---

### 4. Connection

Does every sentence strengthen connection?

Or merely decorate it?

**Connection** here means structural linkage — dependency, hold, trace, carry — not eloquence.

Ask of each sentence:

- does it name a retraced relation already present in frontmatter?
- does it strengthen dependency order (ancestor before descendant)?
- does it duplicate a structural field without adding movement?
- does it interpret where it should name?

Mark sentences as **load-bearing**, **duplicate**, **inverted**, or **interpretive**.

**Do not edit in Pass 4.**

---

### 5. Language

Only now rewrite.

Never for elegance.

Only for structural fidelity.

Rules:

- preserve meaning;
- remove unsupported wording;
- strengthen retrace;
- strengthen dependency order;
- reduce interpretation;
- improve readability only where readability serves retrace;
- never invent ontology;
- change **one term per commission** unless steward explicitly authorises more.

Produce:

- original text;
- calibrated text;
- explanation of every change;
- structural justification for every change.

If Passes 1–4 find no improvement, **record that result**. Do not force edits.

---

## Validation

The refined language should satisfy these relations — not stylistic preferences:

| Validation | Question |
|---|---|
| Easier to walk | Can a reader move through the place without stopping at unsupported language? |
| Easier to retrace | Can every sentence be returned to through `needs`, `holds`, `traces`, or grounded terms? |
| Fewer unsupported abstractions | Is meta-language removed or replaced with retraced terms? |
| Stronger dependency order | Are ancestors named before descendants that depend on them? |
| Clearer place | Does opening prose name the full place (as `places` reads)? |
| Clearer movement | Are carried directions and holds legible without duplication? |

Justify every change **structurally**. If a change cannot be justified structurally, it does not belong in calibrated prose.

---

## Experimental Read: Place and Movement

Introduce an experimental read only.

**Not a score.**

**A relation.**

```text
Place
──────
Movement
```

Characterise — do not quantify:

| Characterisation | When it applies |
|---|---|
| **Movement faithfully reveals place** | Language names the place; movement through dependency is legible; retrace succeeds |
| **Movement obscures place** | Language interprets, decorates, or inverts dependency; retrace fails or requires import |
| **Stasis** | Retrace succeeds but no movement is named — place is repeated without discovery |
| **Drift** | Movement is named but cannot be retraced to the place — progress without retrace |

These labels describe **relations between place and movement in the prose**, not qualities of the term itself. They are calibration reads, not Atlas terms.

When movement faithfully reveals the place, language becomes sensible.

When movement obscures the place, language becomes interpretive.

---

## Worked Evidence

The first application of this discipline (before this document was formalised) is recorded in:

- `docs/reports/D-006-calibrated-prose-refinement.md` — **Connection**

D-006 finding: Connection prose improved when **Relation** was named before **Carry/Trace**, when "working root" was removed, and when ungrounded "drift" was replaced with retraced **Failure** / **Disorder**. Place/Movement read: **movement obscured place** in the original opening; **movement faithfully reveals place** in the calibrated opening.

Use D-006 as evidence, not authority.

---

## Relation to Other Practice Documents

| Document | Relation |
|---|---|
| `docs/practice/DISCIPLINE_OF_STRUCTURAL_QUESTIONS.md` | Field questions inform Pass 2 (Movement) and Pass 4 (Connection) |
| `docs/practice/PRACTICE.md` | Steward flow governs when calibrated prose may be applied |
| `docs/practice/PRACTICE_CALCULUS.md` | Calculus remains candidate; structural reading does not promote it |
| Calibration Engine v1 | Demonstrates read-model walk; structural reading extends to Atlas prose |
| `docs/practice/STRUCTURAL_READING_OPERATIONS.md` | Evidence-based operations from D-010 (+ D-006); not promoted Calculus |

---

## Steward Decision

Structural reading produces **Observation**, **Evidence**, and **Recommendation**.

The steward **accepts**, **rejects**, or **defers**.

Applying calibrated prose to the Atlas is a steward act — not an automatic output of calibration.

Atlas frontmatter changes require separate evidence and commission scope.

---

## Current Status

**State:** Discipline established — whole-Atlas calibration complete (D-008).

**Structural Support:** D-006 (Connection calibrated prose); D-008 (424-term characterisation); Calibration Engine v1 (movement through place).

**Backlog:** `docs/practice/STRUCTURAL_READING_BACKLOG.md` — 67 Class A prose refinements; ontology expansion rejected (0 Class C).

**Atlas Trace:** One term prose-refined (Connection opening body); frontmatter unchanged.

**Promotion Condition:** Repeat successfully on a second term without forcing edits; steward accepts the discipline as load-bearing for Atlas prose work.

This document should not be treated as canon until tested and accepted by steward review.

---

## Falsification

This discipline should be weakened or rejected if:

1. calibrated prose repeatedly fails to improve retrace on blind review;
2. structural justification collapses into stylistic preference under audit;
3. Place/Movement characterisation cannot be applied consistently across terms;
4. the discipline pressures ontology change disguised as prose refinement.

Record falsification attempts as evidence reports, not as silent edits.
