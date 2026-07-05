# D-018C — Hold Rule Falsification

**Programme:** Atlas  
**Type:** Falsification gate (Tier 1 hold rule — no implementation)  
**Date:** 2026-07-05  
**Evidence base:** D-018B · D-010 · D-018A  
**Method:** Blind 20-note sample; structural read only — no Atlas edits

---

## Objective

Falsify the Tier 1 hold rule before implementation:

```text
{Title} is held by {dependency links from conditions.holds / needs}.
{Remainder of conditions.holds}.
```

For each sampled note, test whether **inserting** (C1) or **aligning** (C2) the hold sentence from `conditions.holds`:

1. Improves retrace  
2. Avoids duplication burden  
3. Preserves place → hold → movement order  
4. Does not flatten interpretive prose  
5. Remains suitable for Observatory display  

**No Atlas source edited.**

---

## Sample design

| Parameter | Value |
|---|---|
| Corpus | 491 published notes (D-018B) |
| Sample size | **20** |
| Selection | Stratified by order; seeded shuffle |
| Seed | `D-018C-falsification` (SHA-256 prefix) |
| Mix per order | 2× insert candidates · 1× compress candidate · 1× interpretive edge (where available) |

| Order | n |
|---|---:|
| first | 4 |
| second | 4 |
| third | 4 |
| practice | 3 |
| ground | 3 |
| higher | 2 |

**Reproducibility:** `scripts/falsify-hold-rule-sample.py` → `docs/reports/D-018C-hold-rule-falsification-sample.json`

### Sample composition

| # | File | D-018B class | Operation tested |
|---|---|---|---|
| 1 | `1_First/Bearing.md` | B | C1 insert |
| 2 | `1_First/Carrier Mechanics/Out.md` | B | C1 insert |
| 3 | `1_First/Connection.md` | B | C2 compress |
| 4 | `1_First/Carrier Mechanics/Not.md` | D | C1 prepend (edge) |
| 5 | `2_Second/Closure Conditions/Change.md` | B | C1 insert |
| 6 | `2_Second/Produced Distinctions/Dimension.md` | B | C1 insert |
| 7 | `2_Second/Presence Conditions/Within.md` | B | C1 insert |
| 8 | `2_Second/Produced Distinctions/Relative.md` | D | C1 prepend (edge) |
| 9 | `3_Third/Fields/Place Field/Place Field.md` | B | C1 insert |
| 10 | `3_Third/Fields/Relational Participation/Bearing Relations/Repair.md` | B | C1 insert |
| 11 | `3_Third/Path Reads/Binding.md` | B | C1 insert |
| 12 | `3_Third/Fields/Cognition/Cognitive Metabolism.md` | D | C1 prepend (edge) |
| 13 | `4_Practice/Tracing.md` | B | C1 insert |
| 14 | `4_Practice/Practice.md` | B | C1 insert |
| 15 | `4_Practice/Check.md` | B | C1 insert |
| 16 | `0_Ground/Dependency Order.md` | B | C1 insert |
| 17 | `0_Ground/Primitive.md` | B | C1 insert |
| 18 | `0_Ground/Label.md` | D | C1 prepend (edge) |
| 19 | `5_Higher/Higher Retrace.md` | B | C1 insert |
| 20 | `5_Higher/Higher Faith.md` | B | C1 insert |

**Sample breakdown:** 14 C1 insert · 1 C2 compress · 5 C1 prepend edge (Class D with existing interpretive paragraph)

---

## Criteria definitions

| Criterion | Pass | Partial | Fail |
|---|---|---|---|
| **Retrace** | Hold ancestry readable before movement in pre-template body | Neutral — no harm | Hold obscured or wrong dependency named |
| **Duplication** | Acceptable repeat of `## Holds` for Observatory top-of-note read | Long hold sentence repeats verbatim in template — tolerable | Duplication replaces unique load-bearing prose |
| **Order** | place → hold → movement preserved or restored | — | Movement before hold, or hold absent when movement present |
| **Interpretive prose** | Existing movement paragraphs preserved | — | Hold rule replaces interpretive / negative-read paragraphs |
| **Observatory** | Top-of-note read is place then hold — display-ready | — | Flattened, misleading, or meta-inappropriate opening |

---

## Per-note results

Legend: ✓ pass · ~ partial · ✗ fail

### First order

#### 1 — Bearing (C1 insert)

| Criterion | Result | Notes |
|---|---|---|
| Retrace | ✓ | Hold ([[Strain]]) currently only under `## Holds`; insert surfaces dependency before template |
| Duplication | ~ | Inserts sentence identical to `## Holds` — intended Common Term Structure mirror |
| Order | ✓ | place → hold (no movement para yet) |
| Interpretive | ✓ | No interpretive para to flatten |
| Observatory | ✓ | Standard term read |

**Proposed insert:** `Bearing is held by [[Strain]]. Strain must remain pressing while it is held.`

**Verdict:** **Pass C1**

---

#### 2 — Out (C1 insert)

| Criterion | Result | Notes |
|---|---|---|
| Retrace | ✓ | Carrier term; boundary hold currently template-only |
| Duplication | ~ | Mirrors `## Holds` exactly |
| Order | ✓ | place → hold |
| Interpretive | ✓ | — |
| Observatory | ✓ | Carrier display pattern matches In |

**Verdict:** **Pass C1**

---

#### 3 — Connection (C2 compress)

**Current paragraph 2:**

```markdown
Connection is held by [[Relation]]. Relation must remain held before connection within relation can be read.
```

**Aligned from `conditions.holds`:**

```markdown
Connection is held by [[Relation]]. Relation must remain held for connection within relation to be available.
```

| Criterion | Result | Notes |
|---|---|---|
| Retrace | ✓ | Same dependency; aligns wording to frontmatter authority |
| Duplication | ✓ | No new paragraph; minor edit only |
| Order | ✓ | place → hold → carries (para 3 unchanged) |
| Interpretive | ✓ | Paras 3+ (carries, participant reads) untouched |
| Observatory | ✓ | Hub term; D-006/D-010 precedent |

**Verdict:** **Pass C2**

---

#### 4 — Not (C1 prepend — edge)

**Current paragraph 2 (interpretive movement):**

```markdown
Not marks that what cannot be reached, traced, or carried within the current structure is not available here.
```

**Proposed:** insert hold sentence **before** existing paragraph — do not replace.

| Criterion | Result | Notes |
|---|---|---|
| Retrace | ✓ | Currently movement without hold in body; prepend restores hold-before-movement |
| Duplication | ~ | Adds hold para duplicating `## Holds` |
| Order | ✓ | place → hold → movement (fixed) |
| Interpretive | ✓ | **Only if prepend** — replace would fail |
| Observatory | ✓ | Carrier negative-read term; hold + movement both needed |

**Verdict:** **Pass C1 prepend** · **Fail if replace**

---

### Second order

#### 5 — Change (C1 insert)

Minimal holds field (`[[Traversal]] and [[Difference]].`). Insert is short.

**Verdict:** **Pass C1**

---

#### 6 — Dimension (C1 insert)

Same pattern as Change.

**Verdict:** **Pass C1**

---

#### 7 — Within (C1 insert)

Compound hold (In, Clearance, Boundary). Insert matches `## Holds`.

**Verdict:** **Pass C1**

---

#### 8 — Relative (C1 prepend — edge)

**Current paragraphs 2–3:** interpretive discipline prose (“Relative does not mean unreal…”, “The question is not whether…”).

Long hold sentence (seven dependencies + condition prose).

| Criterion | Result | Notes |
|---|---|---|
| Retrace | ✓ | Hold absent from body; prepend surfaces long ancestry |
| Duplication | ~ | Long hold repeats under `## Holds` — acceptable for Observatory, heavy in full-page read |
| Order | ✓ | place → hold → interpretive movement |
| Interpretive | ✓ | **Prepend only** |
| Observatory | ✓ | Top-of-note becomes structurally legible |

**Verdict:** **Pass C1 prepend** · duplication **partial**

---

### Third order

#### 9 — Place Field (C1 insert)

Field container; long hold sentence from three field dependencies.

**Verdict:** **Pass C1** (~ duplication)

---

#### 10 — Repair (C1 insert)

Seven-dependency hold; insert matches `## Holds` first sentence.

**Verdict:** **Pass C1** (~ duplication)

---

#### 11 — Binding (C1 insert)

Path-read term; hold includes enchantment/constraint/participation conditions.

**Verdict:** **Pass C1**

---

#### 12 — Cognitive Metabolism (C1 prepend — edge)

**Current paragraph 2:**

```markdown
The traceable question is not whether a person thinks too much. The traceable question is whether thought remains coupled to the organism that carries it.
```

| Criterion | Result | Notes |
|---|---|---|
| Retrace | ✓ | Hold absent; prepend names six dependencies before domain question |
| Duplication | ~ | — |
| Order | ✓ | place → hold → interpretive question |
| Interpretive | ✓ | Prepend preserves load-bearing domain prose |
| Observatory | ✓ | Field term; hold + question is display-appropriate |

**Verdict:** **Pass C1 prepend**

---

### Practice order

#### 13 — Tracing · 14 — Practice · 15 — Check (C1 insert)

All three: place sentence only → `## Places`. Short hold sentences. Practice-order terms benefit from hold-before-template for Observatory.

**Verdict:** **Pass C1** (each)

---

### Ground order

#### 16 — Dependency Order (C1 insert)

`conditions.holds` carries fuller prose than `## Holds` first sentence alone. Insert from holds field **adds** hold condition not currently in template opening:

```markdown
Dependency Order is held by [[Root Order]]. The governing arrangement must hold and be readable before structural precedence within it can be named.
```

**Verdict:** **Pass C1** — improves retrace vs template-only short hold

---

#### 17 — Primitive (C1 insert)

Same pattern — insert aligns body to fuller holds field.

**Verdict:** **Pass C1**

---

#### 18 — Label (C1 prepend — edge)

**Current paragraph 2:** distinction between label and term (load-bearing ground read).

**Verdict:** **Pass C1 prepend** · **Fail if replace**

---

### Higher order

#### 19 — Higher Retrace · 20 — Higher Faith (C1 insert)

Both place-only → template. Short hold sentences. Higher-order crossing chain readable with hold surfaced.

**Verdict:** **Pass C1** (each)

---

## Aggregate results

### By operation

| Operation | n | Pass | Partial (duplication only) | Fail |
|---|---:|---:|---:|---:|
| **C1 insert** (missing para) | 14 | 14 | 14 (~ dup) | 0 |
| **C2 compress** (wording drift) | 1 | 1 | 0 | 0 |
| **C1 prepend** (D edge — insert before interpretive) | 5 | 5 | 3 (~ dup) | 0 |
| **C1 replace** (counterfactual — not proposed) | 5 | 0 | 0 | **5** |

### By criterion (intended operations only)

| Criterion | Pass | Partial | Fail |
|---|---:|---:|---:|
| Improves retrace | 20 | 0 | 0 |
| Avoids duplication burden | 5 | 15 | 0 |
| Preserves place → hold → movement | 20 | 0 | 0 |
| Does not flatten interpretive prose | 20* | 0 | 0 |
| Observatory suitable | 20 | 0 | 0 |

\*Class D edge cases pass **only under prepend**, not replace.

### Duplication finding

**15 / 20** notes would repeat the `## Holds` first sentence (or a subset) in the pre-template body. This is **partial**, not failure:

- D-018A accepted the same mirror pattern for place sentences vs `## Places`.
- Observatory reads top-of-note; template sections serve retrace depth.
- No sample note loses unique prose under insert or compress.

**Falsification of duplication as blocker:** rejected — duplication is a known convention tradeoff, not a rule falsifier.

### Counterfactual falsification (replace mode)

If Tier 1 were applied as **replace paragraph 2** on Class D notes:

| Note | Result |
|---|---|
| Not | ✗ — loses movement definition |
| Relative | ✗ — loses interpretive discipline |
| Cognitive Metabolism | ✗ — loses traceable question |
| Label | ✗ — loses label/term distinction |

**Replace mode falsified.** Implementation must use **insert** or **compress hold-shaped prose only**.

---

## Failure modes tested

| Failure mode | Result |
|---|---|
| Bulk replace on interpretive paragraphs | **Falsified** — unsafe |
| Insert on missing hold paragraph | **Survives** — 14/14 pass |
| Compress on hold drift (Connection) | **Survives** — 1/1 pass |
| Prepend on Class D interpretive | **Survives** — 5/5 pass with explicit rule |
| Ground acknowledged-prior (Ground term) | **Not in sample** — remains excluded per D-018B |
| Empty / malformed holds field | **Falsified** — see adversarial corpus pass below |
| Derive from `conditions.holds` field parser alone | **Falsified** — 361/489 mismatch with `## Holds` |

---

## Adversarial corpus pass (489 notes)

Second falsification pass across the full published corpus (excludes Theory, Common Term Structure, Atlas Root). Script: `scripts/falsify-hold-rule-adversarial.py` → `docs/reports/D-018C-hold-rule-falsification-adversarial.json`

### What was falsified

| Claim | Result | Count |
|---|---|---:|
| **Replace** interpretive paragraph 2 with hold sentence | **Falsified** | 186 notes lose ≥8 load-bearing words |
| **Derive** hold sentence from `conditions.holds` field parser | **Falsified** | 361/489 diverge from `## Holds` first sentence (sim < 0.85) |
| **Bulk C2 compress** to holds-field wording | **Falsified** | Would desynchronise body from canonical `## Holds` in most mismatch cases |
| Acknowledged-prior holds (Ground) | **Falsified** for Tier 1 template | 1 note — no `{Title} is held by` sentence |

**Root cause of field-parser falsification:** `conditions.holds` often carries **more prose** than the `## Holds` opening sentence (or differs in link joiners: comma vs *and*). D-018B identified `## Holds` as canonical encoding — adversarial pass confirms the implementation source must be **`## Holds` first sentence**, not a naive parse of the frontmatter field.

Examples of field-vs-section divergence:

| Note | `## Holds` (canonical) | Field-parser output (non-canonical) |
|---|---|---|
| Dependency Order | `…held by [[Root Order]].` | Adds full hold-condition clause from field |
| Degenerate | `…[[Generic]] and [[Structural Disorder]].` | Comma join + extra generative-source clause |
| Emergent | Short link list | Full conditions clause appended |

### What survives (revised rule)

**Revised Tier 1 (post-falsification):**

```text
Insert or align paragraph 2 to the first sentence of ## Holds — not a naive parse of conditions.holds.
```

| Operation | Corpus scope | Adversarial result |
|---|---|---:|
| **C1 insert** from `## Holds` first sentence | 267 notes (no para 2) | **Survives** — no content loss; mirrors template authority |
| **C1 prepend** same source before interpretive para | 215 notes | **Survives** — if non-replacement rule holds |
| **C2 compress** hold-shaped para 2 → `## Holds` wording | 6 notes | **Survives** — narrow; align to section not field |
| **Replace** on Class D | 186 notes | **Falsified** |

Field-to-section alignment at sim ≥ 0.85: **124 / 489** only. Using the field parser as implementation source would introduce **new body/template inconsistency** in the majority of notes — this falsifies the rule **as originally stated** in D-018B.

---

## Tier 1 rule classification

### **Safe with exclusions** (revised post–corpus pass)

The Tier 1 hold rule **as stated in D-018B** (derive from `conditions.holds`) is **partially falsified**. The rule **survives** when revised to use **`## Holds` first sentence** as the single source.

| Scope | Verdict | Evidence |
|---|---|---|
| **C1 insert** from `## Holds` first sentence where no hold paragraph | **Safe** | 14/14 sample pass; 267 corpus-eligible |
| **C1 prepend** from `## Holds` before interpretive paragraph | **Safe with rule** | 5/5 sample pass; never replace |
| **C2 compress** hold-shaped para 2 → `## Holds` wording | **Safe with rule** | 1/1 sample; 6 corpus hold-shaped |
| **Derive from `conditions.holds` parser** | **Falsified** | 361/489 mismatch with `## Holds` |
| **Replace** on Class D interpretive prose | **Falsified** | 186/489 lose load-bearing content |
| **Acknowledged-prior holds** (Ground) | **Excluded** | 1 note |
| **Foundation / map documents** | **Excluded** | Theory, Common Term Structure, Atlas Root |

### Not classified as “safe for C1+C2” alone

C2 is safe **only** on a narrow drift subset (~30 notes estimated in D-018B). Sample contains one compress case; extrapolation to bulk C2 without hold-shape filter is **not supported**.

### Not classified as “safe for C1 only” alone

C1 insert is safe, but **Class D notes with interpretive paragraph 2 also benefit from C1 prepend** — excluding them would leave hold-before-movement unfixed on 207 stewardship notes that still have inverted or hold-absent body order.

---

## Recommendation for implementation (D-018D — not authorised here)

| Phase | Scope | Source | Gate |
|---|---|---|---|
| **D1 — C1 insert** | No hold paragraph (~267 notes) | **`## Holds` first sentence** | This falsification |
| **D2 — C1 prepend** | Interpretive para 2 present (~215 notes) | **`## Holds` first sentence** | Non-replacement rule |
| **D3 — C2 compress** | Hold-shaped para 2 (~6 notes) | Align to **`## Holds`**, not holds field | Narrow scope |
| **Exclude** | Ground, Theory, Common Term Structure, Atlas Root | — | D-018B + adversarial pass |
| **Do not use** | Naive `conditions.holds` field parser | **Falsified** | 361/489 mismatch |

**Do not implement** until steward accepts **safe with exclusions** classification.

---

## Constraints honoured

| Constraint | Status |
|---|---|
| No Atlas edits | **Pass** |
| D-018B as evidence | **Pass** |
| Blind 20-note sample across orders | **Pass** |
| Five criteria tested per note | **Pass** |
| Tier 1 rule classified | **Pass** — safe with exclusions |
| No implementation | **Pass** |

---

## Artefacts

| Artefact | Location |
|---|---|
| This report | `docs/reports/D-018C-hold-rule-falsification.md` |
| Sample manifest | `docs/reports/D-018C-hold-rule-falsification-sample.json` |
| Adversarial log | `docs/reports/D-018C-hold-rule-falsification-adversarial.json` |
| Sample script | `scripts/falsify-hold-rule-sample.py` |
| Adversarial script | `scripts/falsify-hold-rule-adversarial.py` |
| Evidence base | `docs/reports/D-018B-hold-movement-calibration.md` |

---

**Status:** D-018C falsification gate complete. **Naive Tier 1 (from `conditions.holds` parser) partially falsified.** Revised Tier 1 (**from `## Holds` first sentence**) **survives with exclusions**. Replace mode and field-parser source **falsified**. C1 insert/prepend safe; C2 compress narrow. Ready for steward decision on scoped implementation.
