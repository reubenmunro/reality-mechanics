# D-010 — Structural Reading Operations Discovery

**Programme:** Structural Reading  
**Type:** Operations discovery (refinement + extraction)  
**Date:** 2026-07-05  
**Corpus:** Tier 1 backlog — Hold, Clear, Shift, Release, Tact  
**Disciplines:** `docs/practice/STRUCTURAL_READING.md` · D-006 · D-008

---

## Objective

Discover the repeatable operations Structural Reading performs whenever language becomes more faithful to structure.

The Atlas is the evidence. The refined terms are the observations. The operations are the deliverable.

Not primarily prose improvement. Not methodology invention. Not style prescription.

---

## Process summary

For each Tier 1 term: Pass 1–4 Structural Reading (characterise only); Pass 5 calibrated opening prose; Pass 2 recorded **operations** not sentences; Pass 3 compared five terms for independent recurrence.

D-006 (Connection) used as corroborating evidence where operations recur.

---

## Deliverable 1 — Refined Atlas terms

Opening body prose only. Frontmatter unchanged. Template sections unchanged.

| Term | Path | Primary issue (D-008) | Operations applied |
|---|---|---|---|
| **Hold** | `Reality_Mechanics/1_First/Resolution Conditions/Hold.md` | Inverted dependency | hold before movement; wikilink restoration (observed, not promoted) |
| **Clear** | `Reality_Mechanics/1_First/Relation Conditions/Clear.md` | Inverted dependency | hold before movement; places field alignment; carried availability after hold |
| **Shift** | `Reality_Mechanics/1_First/Resolution Conditions/Shift.md` | Inverted dependency | hold before movement; places field alignment; pair comparison deferred (unknown) |
| **Release** | `Reality_Mechanics/1_First/Resolution Conditions/Release.md` | Inverted dependency | hold before movement |
| **Tact** | `Reality_Mechanics/1_First/Boundary Conditions/Tact.md` | Inverted dependency | hold before movement; places field alignment; carried availability after hold |

Mechanical layout: normalised blank lines before `## Carries` (Hold, Shift, Release).

---

## Pass 1 — Place / Movement (summary)

| Term | Place/Movement (pre) | Place/Movement (post) |
|---|---|---|
| Hold | Movement obscures | Faithful |
| Clear | Movement obscures | Faithful |
| Shift | Movement obscures | Faithful |
| Release | Movement obscures | Faithful |
| Tact | Movement obscures | Faithful |

All five: opening named movement or carried terms before retraced hold. Structure (frontmatter + template) was already walkable.

---

## Pass 2 — Operations recorded (per term)

### Hold

| Operation | Detail |
|---|---|
| hold before movement | Resolution hold sentence inserted before Carry |
| wikilink restoration | Bearing, Resolution wikilinked in ancestry sentence |

### Clear

| Operation | Detail |
|---|---|
| places field alignment | Opening extended with `places` clause |
| hold before movement | Clean + Relation hold before Clearance |
| carried availability after hold | "Held clear offers…" replaces "Clear opens" |

### Shift

| Operation | Detail |
|---|---|
| places field alignment | "transferring" from `places` added to opening |
| hold before movement | Resolution + Orientation hold before Hold/Yield pair read |
| pair comparison deferred | Lateral pair moved after hold |

### Release

| Operation | Detail |
|---|---|
| hold before movement | Resolution + Bearing + Strain hold before second-order Retain paragraph |

### Tact

| Operation | Detail |
|---|---|
| places field alignment | Opening extended with `places` clause |
| hold before movement | Clean + Relation hold before Contact |
| carried availability after hold | "Held tact offers Contact" replaces "Tact opens" |

---

## Pass 3 — Cross-term comparison

| Operation | Hold | Clear | Shift | Release | Tact | Connection (D-006) | Recurrence |
|---|---:|---:|---:|---:|---:|---:|---|
| hold before movement | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6 / 6** |
| places field alignment | — | ✓ | ✓ | — | ✓ | ✓ | **4 / 6** |
| carried availability after hold | ✓ | ✓ | — | — | ✓ | ✓ | **4 / 6** |
| wikilink restoration | ✓ | ✓ | — | — | — | — | 2 / 6 |
| pair comparison deferred | — | — | ✓ | — | — | — | 1 / 6 |

---

## Deliverable 2 — Operations document

`docs/practice/STRUCTURAL_READING_OPERATIONS.md`

### Operations found (supported)

| Operation | Confidence |
|---|---|
| **hold before movement** | High |
| **places field alignment** | Medium-high |
| **carried availability after hold** | Medium |

### Operations rejected (single instance or not refinement)

| Candidate | Reason |
|---|---|
| Scale-order paragraph preserved | Preservation only (Release) |
| Interpretive qualifier retained | Judgment, not repeatable (Tact) |

### Operations needing more evidence (unknown)

| Candidate | Instances | Status |
|---|---:|---|
| wikilink restoration | 2 | Unknown |
| pair comparison deferred | 1 | Unknown — may subsume under hold before movement |

---

## Validation

| Criterion | Assessment |
|---|---|
| Easier to walk | Yes — hold precedes movement in all five openings |
| Easier to retrace | Yes — needs/holds mirrored in opening before carries |
| Fewer unsupported abstractions | Unchanged — no spurious drift/meta removed in this batch |
| Stronger dependency order | Yes — primary D-008 finding addressed |
| Clearer place | Yes — Clear, Tact, Shift aligned with `places` |
| Clearer movement | Yes — carries named after hold |

Every wording change maps to a frontmatter field, a needs edge, or inverted-dependency correction. Not stylistic.

---

## Repository changes

| File | Change |
|---|---|
| Five Tier 1 Atlas terms | Opening body prose refined |
| `docs/practice/STRUCTURAL_READING_OPERATIONS.md` | New — evidence-based operations |
| `docs/reports/D-010-structural-reading-operations.md` | This report |
| `docs/practice/STRUCTURAL_READING_BACKLOG.md` | Tier 1 marked complete |

Frontmatter **unchanged** on all five terms.

---

## Tests run

| Command | Result |
|---|---|
| `npm --prefix .atlas-publisher test` | 25/25 pass |
| `npm --prefix member test` | 16/16 pass |
| `npm --prefix reality-mechanics-mcp test` | 27/27 pass |

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| All five Tier 1 terms calibrated | **Pass** |
| Every prose refinement structurally justified | **Pass** |
| Recurring operations extracted | **Pass** — 3 supported |
| Unsupported operations remain unknown | **Pass** — 2 unknown, 2 rejected |
| Atlas improved | **Pass** — five opening bodies refined |
| Structural Reading more reproducible | **Pass** — operations document created |

---

## Recommendation

**Accept** D-010. Three operations are supported by six independent calibrations (five Tier 1 + D-006).

**Apply D1 sync** after commit — five Atlas source files changed.

**Next commission options:**

- **D-010A** — Test operations on Tier 2 hub terms (Maintained Coupling, Union, Pressure)
- **D-010B** — Blind retrace audit of Tier 1 calibrations
- Update term register Class A counts for calibrated terms

---

**Status:** D-010 complete. Five terms refined; three operations supported; two unknown; ontology unchanged.
