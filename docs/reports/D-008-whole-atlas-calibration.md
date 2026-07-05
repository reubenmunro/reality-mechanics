# D-008 — Whole Atlas Calibration

**Programme:** Structural Reading → Atlas  
**Type:** Whole Atlas calibration (characterisation, not completion)  
**Date:** 2026-07-05  
**Disciplines:** Constitution · Structural Reading (`docs/practice/STRUCTURAL_READING.md`) · Calibration Engine v1 · D-006 · D-007

---

## Objective

Perform the first whole-Atlas structural calibration.

The objective is **not** to complete the Atlas.

The objective is to determine whether the existing Atlas already implies additional places or refinements through dependency, retrace, movement, and connection.

No ontology promotion. No Calculus claims. No bulk prose rewrite.

---

## Corpus scope

| Scope | Count | Notes |
|---|---:|---|
| Markdown files in `Reality_Mechanics/` | 492 | Full tree |
| **Published terms walked** (`kind: term`, publish filter) | **424** | Primary Pass 1–3 scope |
| Other published notes (crossings, carriers, primitives, meta) | 63 | Referenced where relevant; not re-classified term-by-term |
| Unpublished / filtered | 5 | Excluded by `shouldPublish` |

**Method:** Repository-wide automated structural read using `atlas-core.mjs` parsing (same primitives as D1 sync), refined by Structural Reading discipline and cross-checked against stewardship evidence (`docs/stewardship/AUDIT_LOG.md`, `docs/stewardship/OPEN_QUESTIONS.md`, C-R001A, C-F001, D-006).

**Reproducibility:** Analysis run against commit `28c3ef4` (post D-006 Connection calibration, post D1 sync).

---

## Principle (applied)

Every Atlas term names a place.

Every description names movement through that place.

Language must become more faithful by improving retrace.

The Atlas must never be expanded merely because something appears absent.

A place is only recognised when the existing structure already requires it.

---

## Pass 1 — Structural Reading (characterisation only)

For every published term, the read asked:

- Can the place be walked?
- Does movement faithfully reveal the place?
- Does the language become interpretive?
- Does dependency order remain readable?

### Place / Movement relation (experimental read)

Automated read using high-confidence prose signals only (meta-language, inverted dependency in opening, unretraceable wikilinks in opening). Template duplication (`## Places` mirroring opening) was **not** treated as obscuring movement — that mirroring is Common Term Structure convention.

| Characterisation | Terms | Share |
|---|---:|---:|
| **Movement faithfully reveals place** | 346 | 81.6% |
| **Movement obscures place** | 42 | 9.9% |
| **Drift** (movement named; retrace weak in opening) | 27 | 6.4% |
| **Stasis** (thin opening; place repeated without movement) | 9 | 2.1% |

### By order

| Order | Terms | Faithful | Obscures | Drift | Stasis |
|---|---:|---:|---:|---:|---:|
| ground | 15 | 3 | 9 | 3 | 0 |
| first | 30 | 7 | 18 | 5 | 0 |
| practice | 25 | 5 | 18 | 2 | 0 |
| second | 141 | 24 | 114 | 3 | 0 |
| third | 197 | 21 | 172 | 4 | 0 |
| higher | 16 | 3 | 12 | 1 | 0 |

**Observation:** Second and third orders show the highest **interpretive pressure in opening prose** relative to first order — largely because domain and applied-read terms carry lateral wikilinks (pairs, carries, negative reads) in opening paragraphs where first-order terms more often state hold-before-movement explicitly.

**Hub terms (manual read):**

| Term | Place/Movement | Notes |
|---|---|---|
| Relation | Faithful | Primitive; opening names place and distinguishes Ratio; no edit indicated |
| Connection | Faithful (post D-006) | D-006 calibrated; residual automated flags on Carrying/Retracing/Failure are **participant/negative reads**, not defects |
| Carry | Faithful | Hold + Connection named; forward availability legible |
| Trace | Faithful | Mirror of Carry; not separately flagged |
| Boundary | Faithful | High-linkage articulation term; prose matches C-R001A reading |
| Bearing | Obscures (mild) | Template convention; no high-confidence meta-language |
| Resolution | Drift (mild) | Opening mentions Space/Time laterally; terminal role clear in frontmatter |
| Coupling | Faithful | Foundation/joining place readable |
| Maintained Coupling | Obscures (mild) | Compatibility dependency repaired (D-004); prose load-bearing |
| Compatibility | Obscures (mild) | Recently synced; structure sound |

**Pass 1 conclusion:** The Atlas is **walkable at structure** (frontmatter + template sections) for all 424 terms. Opening-prose fidelity is **uneven** — concentrated in meta-language, dependency-order inversions, and lateral links not retraced in the opening paragraph.

---

## Pass 2 — Structural Calibration (recommendations only)

Issue detection excluded template mirroring and `needs` absent from opening (by design, needs often appear in `## Holds` / `## Traces`).

| Issue type | Terms affected | Recommendation class |
|---|---:|---|
| **Unsupported abstraction** (meta-language, ungrounded *drift*) | 19 | A — language refinement |
| **Inverted dependency order** (carried/paired terms before needs/holds in opening) | 23 | A — language refinement (D-006 pattern) |
| **Weak retrace links** (opening wikilink not in needs/holds/traces/carries/pairs) | 37 | A or D — see discipline note below |
| **Duplicated places** (opening ≈ `## Places`) | 224 | D — convention, not defect |
| **Needs absent opening** | 337 | D — convention, not defect |

### Discipline note on weak retrace

Stewardship Dependency Membership Test (`docs/stewardship/STEWARDSHIP_V1.md`): a concept mentioned in prose is not automatically a missing dependency. Many weak-retrace flags are **legitimate lateral or negative reads** (e.g. Connection → Failure/Disorder; Carrying → Resolution). Recommendations must be justified per term, not bulk-applied.

### Priority A refinements (first-order and hubs)

These terms combine inverted dependency and/or meta-language with structural load-bearing roles:

| Term | Issues | Recommendation |
|---|---|---|
| **Hold** | Inverted dependency | Name Resolution/Bearing hold before carried availability (Connection D-006 pattern) |
| **Clear** | Inverted dependency | Name Clearance/distinction hold before downstream reads |
| **Shift** | Inverted + weak retrace | Reorder hold before Shift movement; retrace Hold explicitly |
| **Release** | Inverted dependency | Name terminal/hold ancestry before release movement |
| **Tact** | Inverted dependency | Name Relation/distinction hold before tact placement |
| **Clean** | Ungrounded *drift* | Wikilink grounded drift term or remove (Source Drift exists) |
| **Resolution** | Weak retrace (Space, Time) | Either retrace as lateral reads or move to template-only |
| **Connection** | Residual flags only | **No further action** unless steward reopens — D-006 applied |

Full Class A register: see Appendix A (69 terms).

---

## Pass 3 — Structural Completion

Question: *Does the existing Atlas already imply a place that has not yet been named?*

Evidence sought: repeated unnamed dependency · repeated unnamed movement · recurring unnamed distinction · repeated structural gap · unavoidable unnamed place.

**Method:** Cross-corpus phrase recurrence, broken-link scan, stewardship confirmed gaps, drift-family analysis, C-R001A / C-F001 / OPEN_QUESTIONS cross-check.

**Result:** No Class **C** proposal met the commission bar (multiple independent structural lines + existing terms insufficient). Evaluated candidates are recorded in `docs/reports/D-008-candidate-places.md`.

---

## Classification summary

| Class | Meaning | Count | Action |
|---|---|---:|---|
| **A** | Language refinement only; no ontology change | 67 (+ Connection calibrated) | Backlog: `docs/practice/STRUCTURAL_READING_BACKLOG.md` |
| **B** | Existing term requires structural completion | 3 | Stewardship/open investigations — not prose-only |
| **C** | Atlas strongly implies unnamed place | **0** | **Rejected** — see `docs/reports/D-008-candidate-places.md` |
| **D** | Insufficient evidence; remain unknown | 356 | Preserve — see backlog § Preserved unknowns |

### Class B — structural completion (not prose-only)

| Term / gap | Evidence | Status |
|---|---|---|
| **Interposed Carrier** | "Carrying" language vs dependencies (Contact, Boundary) | Open — `docs/stewardship/OPEN_QUESTIONS.md`; test independently |
| **Second Order terminal marker** | Confirmed architectural asymmetry | **Do not fill** without new evidence — `docs/stewardship/OPEN_QUESTIONS.md` |
| **Maintained Coupling** | Compatibility dependency | **Resolved** (D-004); prose calibration optional (D-006A candidate) |

### Class D — preserved unknowns (selected)

| Pattern | Occurrences | Why unknown |
|---|---:|---|
| needs/holds/traces coincident | 308 / 424 | C-F001: coherent grammar in intent; not automatically redundant |
| Opening duplicates `## Places` | 224 | Common Term Structure template |
| Collapse-preventing dependency shape | 2 compounds | Pressure — not yet third instance (`docs/stewardship/OPEN_QUESTIONS.md`) |
| Generic *drift* in prose | 14 openings | Grounded drift terms exist; issue is A refinement, not new place |

---

## Structural patterns (whole-Atlas)

Confirmed across the walk — not recommendations:

1. **Template coherence:** All 424 published terms include full `## Places` → `## Carries` section set.
2. **Field grammar:** needs/holds/traces largely coincident on 73% of terms (308) — matches C-F001.
3. **Single internal root:** Relation — confirmed C-R001A corrected reading.
4. **Meta-vocabulary cluster:** *working root* appears in Atlas Root, First Order, Reality Mechanics — Theory/meta layer, not a missing first-order term.
5. **Drift family:** Source Drift, Term Drift, AI Drift, etc. are **named terms**; ungrounded *drift* in prose is a refinement target, not evidence of an unnamed *Drift* primitive.
6. **Linkage vs order:** High-linkage terms (Boundary) are not structural centres — C-R001A / Root Order caution applies.

---

## Relation to prior commissions

| Commission | Finding used here |
|---|---|
| D-006 | Connection calibration method; one applied refinement |
| D-007 | Five-pass discipline; Place/Movement read |
| D-004 | Maintained Coupling / Compatibility repair — not re-litigated |
| C-F001 | Field grammar characterisation |
| C-R001A | Root/terminal reading; linkage ≠ centre |
| Stewardship audits | B-class gaps; do-not-fill instructions |

---

## Recommendation

**Accept** D-008 as whole-Atlas characterisation.

**Defer** bulk prose work. The **Structural Reading backlog** (`docs/practice/STRUCTURAL_READING_BACKLOG.md`) orders 67 remaining Class A terms by structural load.

**Reject** any ontology expansion from this commission — **zero Class C proposals accepted**; seven candidates evaluated and rejected in `docs/reports/D-008-candidate-places.md`.

**Next commissions (steward choice):**

- **D-006A** — Maintained Coupling prose (already nominated)
- **D-008A** — First-order inverted-dependency batch (Hold, Clear, Shift, Release, Tact) using D-006 method
- **D-008B** — Interposed Carrier independent dependency test (stewardship scope)

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Every Atlas term structurally read | **Pass** — 424 / 424 published terms |
| Every prose refinement opportunity identified | **Pass** — 67 Class A backlog + Connection (D-006); register: `docs/reports/D-008-term-register.md` (424 rows) |
| Every genuine candidate place supported by multiple lines | **Pass** — none qualified; candidates evaluated in D-008-candidate-places |
| Unsupported proposals remain unknown | **Pass** — Class D preserved |
| No Calculus claims promoted | **Pass** |

---

## Deliverables

| Deliverable | Location |
|---|---|
| Whole-Atlas calibration report | `docs/reports/D-008-whole-atlas-calibration.md` |
| Candidate places (ontology rejection) | `docs/reports/D-008-candidate-places.md` |
| Full term register (424 terms) | `docs/reports/D-008-term-register.md` |
| Structural Reading backlog | `docs/practice/STRUCTURAL_READING_BACKLOG.md` |

---

## Appendix A — Class A register (67 terms + Connection calibrated)

Connection calibrated (D-006) — Class D in term register. Remaining Class A by order:

### first (11)

Distinction · Allow · Tact · Clean · Posture · Clear · Time · Hold · Release · Shift · Resolution

### ground (7)

Degenerate · Emergent · Generic · Ground · Invariant · Label · Seed

### second (14)

Bearing Source · Capacity · Load · Overload · Pressure · Carrying · Interposed Carrier · Responsibility · Recurrence · Occur · Number · Scale · Thing · Union

### third (21)

Communion · AI Drift · AI Reply Drift · Inherited Term Drift · Term Drift · Harmonic Drift · Improvisation · Medicine · Answerable Mind · Thought · Faith Read · Cosmic Polarity Read · Physical Field Conditions · Physical · Inheritance · Placed Participation · Parenting as Maintained Coupling · Control Drift · Grief · Control · Degeneration Read

### practice (7)

Order Trace · Retrace Practice · Retracing · Root Resilience · Section · Atlas · Reality Mechanics

### higher (8)

Consciousness · Hidden Bearing · Higher Faith · Invisible Bearing · Nested Carrying · Opacity · Recursion · Source Drift

---

**Status:** D-008 complete. 424 terms characterised; 67 Class A backlog + Connection (D-006); 0 candidate places promoted; unknowns preserved.
