# D-018B — Hold & Movement Calibration

**Programme:** Atlas  
**Type:** Hold & movement calibration (investigation only — no Atlas edits)  
**Date:** 2026-07-05  
**Method:** Corpus-wide structural assessment of the first explanatory paragraph after the D-018A place sentence.

**Disciplines:** D-006 · D-008 · D-010 · D-018A · Structural Reading · Discovery → Implementation (Document only)

---

## Executive summary

| Measure | Count / share |
|---|---:|
| Published Atlas notes assessed | **491** |
| Excluded (narrative document) | **1** (`Theory.md`) |
| Notes with explanatory paragraph after place | **223** (45.4%) |
| Notes with place sentence only (no para 2) | **268** (54.6%) |
| **Class A — already aligned** | **3** (0.6%) |
| **Class B — compression / insertion only** | **272** (55.4%) |
| **Class C — structural reordering** | **9** (1.8%) |
| **Class D — cannot be mechanically derived** | **207** (42.2%) |
| **Mechanically derivable (A + B)** | **275** (**56.0%**) |
| **Stewardship required (C + D)** | **216** (**44.0%**) |

**Primary question answered:** Yes — a common structural source exists for the hold paragraph.

**`conditions.holds`** is the field equivalent to `conditions.places` (D-018A). In **487 / 492** published notes, the `## Holds` section already encodes the same hold sentence the derivation rule would produce. The explanatory gap is not missing structure in frontmatter — it is **uneven placement** of hold prose between the place sentence and the template sections.

**Preferred outcome achieved:** One reusable derivation rule discovered. **Not applied** in this commission.

**Machine log:** `docs/reports/D-018B-hold-movement-calibration.json`  
**Assessment script:** `scripts/assess-hold-movement.py`

---

## Primary question

> Is there an existing structural source equivalent to `conditions.places` that already describes what the explanatory paragraph is trying to say?

### Finding

| Candidate source | Verdict | Role |
|---|---|---|
| **`conditions.holds`** | **Primary source** | Hold sentence — what must remain before movement reads |
| **`## Holds` (first sentence)** | **Canonical encoding** | Already mirrors `conditions.holds` in 487/492 terms |
| `needs` | Supporting | Link targets for hold sentence when holds field leads with prose |
| **`conditions.carries`** | **Secondary (Tier 2)** | Optional third paragraph — carried availability after hold (D-006 / D-010 pattern) |
| `conditions.pairs` | Partial | Lateral comparison — often belongs in para 3+ or template only; not a single-sentence rule |
| `conditions.traces` | No | List field — belongs in `## Traces`, not opening hold paragraph |
| `conditions.nests` | No | Placement read — template section |
| `conditions.reads` | No | Recognisability read — template section |
| Frontmatter relations (`needs` alone) | Insufficient | Coincident with holds but does not carry hold condition prose |

**Conclusion:** The Atlas already stores hold-before-movement in **`conditions.holds`**. D-010 Tier 1 calibrations (Hold, Clear, Shift, Release, Tact) proved this field can anchor faithful opening hold prose. D-018B confirms the pattern is corpus-wide in frontmatter and template sections — not in the pre-template body.

---

## Discovered derivation rule (not applied)

### Tier 1 — hold sentence (primary)

Insert or align the **first explanatory paragraph** from `conditions.holds`:

```text
{Title} is held by {dependency links from holds / needs}.
{Remainder of holds field — hold condition prose}.
```

**Evidence:**

- `## Holds` opens with this pattern in **487 / 492** published notes.
- D-010 operations document the same sequence as **hold before movement**.
- **268** notes currently have **no** pre-template paragraph after the place sentence — hold prose exists only under `## Holds`.

**Exclusions from Tier 1 template:**

| Case | Example | Reason |
|---|---|---|
| Acknowledged-prior holds | Ground | `holds: "acknowledged but not derived…"` — no `{Title} is held by` sentence |
| Empty / meta holds prose | Common Term Structure | Foundation doc; non-standard body (`## Purpose` not place-first) |
| Holds field is prose-only without links | rare | Derive prose sentence without link prefix |

### Tier 2 — carried availability (secondary, conditional)

Where `conditions.carries` is non-empty and the term is a structural hub, a **third** paragraph may follow Tier 1 using the D-006 / D-010 pattern:

```text
Held {term} offers {carried terms} as {directional availability}.
```

**Evidence:** Connection, Hold, Clear, Tact (D-006, D-010). **Not universal** — Shift and Release stop at place + hold in opening; carries remain in template sections.

**Confidence:** Medium — recurs on hub terms; not safe as bulk mechanical rule without term-kind filter.

### Rejected as mechanical rules

| Candidate | Reason |
|---|---|
| Bulk derive from `pairs` | Lateral reads; pair comparison deferred (Shift — unknown in D-010) |
| Bulk derive from `reads` / `nests` | Template-section reads; not hold paragraphs |
| Negative-read openings (`{Term} is not…`) | Applied-read stewardship prose — not in holds field |
| Duplicate `## Places` into body | Convention, not movement calibration |

---

## Corpus classification

### Method

For each `publish: true` note with `conditions.places`:

1. Read opening place sentence (paragraph 1).
2. Read first explanatory paragraph (paragraph 2), if present.
3. Compare paragraph 2 against `conditions.holds`, derived hold sentence, and `## Holds` first sentence.
4. Check hold-before-movement order (hold links vs carried links).
5. Classify A / B / C / D.
6. Preserve unknowns — no prose invented, no Atlas edits.

### Classes

| Class | Definition | Count | Share |
|---|---|---:|---:|
| **A** | Paragraph 2 already faithfully expresses `conditions.holds` / `## Holds` | 3 | 0.6% |
| **B** | Same structural content; wording compression or **insertion** from holds field suffices | 272 | 55.4% |
| **C** | Structural content present but **wrong order** (movement before hold) | 9 | 1.8% |
| **D** | Interpretive, domain, negative-read, or meta prose — not reducible to holds alone | 207 | 42.2% |

### By order

| Order | Terms | A | B | C | D | Tier 1 viable (A+B) |
|---|---:|---:|---:|---:|---:|---:|
| first | 58 | 3 | 33 | 3 | 19 | 62% |
| second | 146 | 0 | 95 | 1 | 50 | 65% |
| third | 204 | 0 | 133 | 2 | 69 | 65% |
| ground | 16 | 0 | 2 | 0 | 14 | 12% |
| practice | 47 | 0 | 5 | 2 | 40 | 11% |
| higher | 18 | 0 | 3 | 1 | 14 | 17% |
| foundation | 2 | 0 | 1 | 0 | 1 | 50% |

**Observation:** First, second, and third orders are **~62–65% Tier 1 viable**. Ground, practice, and higher orders concentrate Class D interpretive prose — meta maps, discipline language, applied reads, acknowledged-prior terms.

### Pre-template paragraph distribution

| Paragraphs before `##` | Notes | Typical structure |
|---:|---:|---|
| 1 (place only) | 267 | Place → `## Places` (hold only in template) |
| 2 | 118 | Place → hold/movement → template |
| 3+ | 105 | Place → hold → movement / pairs / negative reads → template |

---

## Recurring paragraph patterns

| Pattern | Count | Typical orders | Mechanical? |
|---|---:|---|---|
| **No explanatory paragraph** (place → template) | 268 | second, third, carriers | **Yes** — insert Tier 1 from holds |
| **Hold sentence** (`{Term} is held by…`) | 7 | first (D-010 calibrated) | **Yes** — already Tier 1 |
| **Hold sentence + minor wording drift** | ~30 | first, second hubs | **Yes** — compress to holds field |
| **Pair / contrast paragraph** | ~25 | first, third | **Partial** — reorder (C) or steward (D) |
| **Negative read opening** (`{Term} is not…`) | 35 | third applied reads | **No** — stewardship |
| **Link-opens prose** (`[[Term]] names…`) | 16 | ground, carriers | **No** — often inverted or interpretive |
| **Domain / field interpretive** | ~120 | third, practice | **No** — load-bearing applied prose |
| **Meta / map prose** | ~15 | practice, root, maps | **No** — document role, not term hold |

### Patterns eliminated (if Tier 1 applied in D-018C)

| Would remove / standardise | Would remain in template / stewardship |
|---|---|
| Missing hold paragraph before `## Places` | `## Pairs`, `## Reads` sections |
| Wording drift from `conditions.holds` | Negative reads, domain translation |
| Some inverted hold/movement order (Class C) | Ground acknowledged-prior prose |
| — | Applied-read multi-paragraph bodies |

---

## Candidate derivation sources — examples

### Class A — already aligned

**Clear** (`1_First/Relation Conditions/Clear.md`)

Paragraph 2 matches `## Holds` exactly:

```markdown
Clear is held by [[Clean]] and [[Relation]]. Relation must remain free from residue or drift before clearance can be held.
```

Also aligned: **Tact**, **Release** (D-010 Tier 1).

---

### Class B — compression / insertion only

**In** (`1_First/Carrier Mechanics/In.md`) — insertion

**Current:** place sentence only; hold prose under `## Holds`.

**Derivable (not applied):**

```markdown
In is held by [[Boundary]]. A boundary must locate distinction before interior placement can be read.
```

**Connection** (`1_First/Connection.md`) — minor compression

**Current paragraph 2:**

```markdown
Connection is held by [[Relation]]. Relation must remain held before connection within relation can be read.
```

**From `conditions.holds`:**

```markdown
Connection is held by [[Relation]]. Relation must remain held for connection within relation to be available.
```

Same structure; wording compression only.

**Flow** (`2_Second/Carrying Conditions/Flow.md`) — insertion (268-note pattern)

Place sentence only → Tier 1 insert from holds field.

---

### Class C — structural reordering

**Clearance** (`1_First/Relation Conditions/Clearance.md`)

Movement names Space/Time before hold ancestry — inverted relative to hold-before-movement.

**Contact** (`1_First/Boundary Conditions/Contact.md`)

Carried term `[[Coupled Contact]]` appears before hold links in paragraph 2.

**Shift** (`1_First/Resolution Conditions/Shift.md`) — borderline

Paragraph 2 is hold-aligned (Class B). Paragraph 3 names Hold/Yield pair — correct order post-D-010; pair comparison remains stewardship-sensitive.

---

### Class D — cannot be mechanically derived

**Ground** (`0_Ground/Ground.md`)

```markdown
[[Relation]] is the primitive where the dependency spine begins. Ground names what holds prior to that beginning…
```

Synthesises pairs, carries, and acknowledged-prior — not reducible to `{Title} is held by`.

**Grief** (`3_Third/…/Grief.md`)

```markdown
Grief is not failed letting go, and it is not automatically ungrounded…
```

Negative read and domain translation — holds field lists fourteen dependencies but does not encode the negative-read opening.

**Degenerate** (`0_Ground/Degenerate.md`)

Distinction prose against [[Structural Disorder]] — interpretive, not holds-shaped.

**Atlas Root** (`00_ROOT.md`)

Paragraph 2 is structural map prose (`The working postulate remains:`) — document role, not term hold.

---

## Percentages

| Category | Share | Notes |
|---|---:|---|
| **Mechanically derivable (A + B)** | **56.0%** | Tier 1 holds rule — mostly 268 insertions + hold-aligned compression |
| **Stewardship — reorder (C)** | **1.8%** | Hold-before-movement reorder without new prose |
| **Stewardship — interpretive (D)** | **42.2%** | Applied reads, ground, practice, meta — preserve |
| **Tier 2 carries paragraph (optional)** | **~1–2%** | Hub terms only; D-006 / D-010 evidence |

**Important:** 56% is **not** “fully automated corpus rewrite.” It is “hold paragraph can be sourced from existing `conditions.holds` without inventing prose.” The 268 insertion cases duplicate content already present in `## Holds` — the commission question is structural faithfulness, not net-new information.

---

## Unknowns preserved

| Unknown | Status | Notes |
|---|---|---|
| **Pair comparison deferred** | Preserved | Shift Hold/Yield — D-010 unknown; may subsume under hold-before-movement |
| **Wikilink restoration** | Preserved | Low confidence; two D-010 instances only |
| **Tier 2 carries rule scope** | Preserved | Which term kinds get a third carries paragraph — not determined |
| **Negative-read openings** | Preserved | 35 applied reads — no mechanical substitute identified |
| **Ground / acknowledged-prior** | Preserved | Tier 1 template explicitly excluded |
| **Common Term Structure body** | Preserved | Foundation doc; non-standard section order |
| **Interpretive qualifiers** | Preserved | e.g. Tact “not politeness in the shallow sense” — judgment, not rule |
| **Multi-paragraph bodies (para 3+)** | Preserved | Out of scope for single hold sentence; not assessed for bulk derivation |

---

## Relation to prior commissions

| Commission | D-018B read |
|---|---|
| **D-006** | Connection — hold + carries pattern; para 2 hold-aligned (B), para 3+ stewardship |
| **D-008** | 42 opening inversions flagged — concentrated in para 2+ where present; duplicated holds in template not treated as defect |
| **D-010** | Three operations = hold sentence + optional carries; D-018B generalises Tier 1 to holds field |
| **D-018A** | Place sentence complete; hold paragraph is the next structural layer |

---

## Recommendation for D-018C

**Do not bulk-rewrite 490 notes manually.**

### Proposed scope (implementation commission)

| Phase | Action | Est. scope |
|---|---|---:|
| **C1 — Tier 1 insert** | Insert hold sentence from `conditions.holds` where no paragraph 2 exists | ~268 notes |
| **C2 — Tier 1 compress** | Align paragraph 2 wording to holds field where similarity high but drift present | ~30 notes |
| **C3 — Class C reorder** | Apply hold-before-movement reorder only where inverted — no new prose | ~9 notes |
| **C4 — Stewardship batch** | Class D terms — Structural Reading per term; no mechanical pass | ~207 notes |
| **Exclude** | Ground, Theory, Common Term Structure, Atlas Root map prose | documented |

### Gate (Discovery → Implementation)

1. **Document** — this report (complete).
2. **Falsify** — spot-check 20-note blind sample: does Tier 1 insert improve retrace without duplicating reader burden?
3. **Compress** — one script (`calibrate-hold-movement.py`), one rule (Tier 1 only).
4. **Align** — steward accepts C1+C2 scope; C4 remains backlog.
5. **Implement** — D-018C only if falsification passes.

### Do not apply in D-018C without separate evidence

- Tier 2 carries bulk rule
- Negative-read replacement
- Pair-paragraph mechanical generation
- Ground / practice interpretive rewrite

---

## Constraints honoured

| Constraint | Status |
|---|---|
| No Atlas edits | **Pass** |
| No ontology change | **Pass** |
| No dependency change | **Pass** |
| No frontmatter change | **Pass** |
| No section structure change | **Pass** |
| No invented prose | **Pass** |
| Unknowns preserved | **Pass** |
| Derivation rule described, not applied | **Pass** |

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Entire published Atlas assessed | **Pass** (491 notes; Theory excluded) |
| No Atlas edits | **Pass** |
| Derivation opportunities identified | **Pass** — Tier 1 `conditions.holds` |
| Unknowns preserved | **Pass** |
| Recommendation for D-018C produced | **Pass** |

---

## Artefacts

| Artefact | Location |
|---|---|
| This report | `docs/reports/D-018B-hold-movement-calibration.md` |
| Machine log | `docs/reports/D-018B-hold-movement-calibration.json` |
| Assessment script | `scripts/assess-hold-movement.py` |

---

**Status:** D-018B complete. A common Tier 1 derivation exists (`conditions.holds` → hold sentence). 56% mechanically derivable; 44% requires stewardship. Rule documented; not applied. Ready for D-018C falsification gate.
