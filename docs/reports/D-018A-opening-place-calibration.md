# D-018A — Opening Place Calibration

**Programme:** Atlas  
**Type:** Opening place calibration  
**Date:** 2026-07-05  
**Method:** Mechanical opening pass — `conditions.places` → first body sentence. No frontmatter, ontology, dependency, or section changes.

**Principle:** The heading performs the naming. The opening sentence performs the placing.

**Disciplines:** D-006 · D-008 · Structural Reading · Discovery → Implementation (Document → calibrate; no Implement)

---

## Executive summary

| Measure | Count |
|---|---:|
| Published Atlas notes with opening + `conditions.places` | **490** |
| **Opening prose calibrated** | **489** |
| Already place-aligned (unchanged) | **1** |
| Excluded (unchanged, documented) | **2** |
| Post-calibration place alignment | **490 / 490** eligible |

Every eligible published note now opens with one concise **place sentence** derived from `conditions.places`. Self-referential naming patterns were removed from the opening paragraph.

---

## Rule applied

**Avoid:** `[Term] names…`, `[Term] is…`, `[Term] carries…`, `The term…`, self-reference, explanatory preambles in the opening sentence.

**Prefer:** A place statement — capitalised first sentence from `conditions.places`.

**Scope:** First paragraph only (through first blank line or `##` heading). All subsequent prose, template sections, and frontmatter **unchanged**.

---

## Method

1. Walk every `publish: true` note under `Reality_Mechanics/`.
2. Read `conditions.places`.
3. Replace opening paragraph when it did not already match the place sentence.
4. Preserve meaning via existing frontmatter place field (D-008 whole-Atlas calibration source).
5. Record before/after in machine log: `docs/reports/D-018A-opening-place-calibration.json`.

**Tool:** `scripts/calibrate-opening-place.py` (reproducible; two passes — self-reference batch, then remaining non-place openings).

---

## Recurring patterns found (before)

| Pattern | Approx. share | Example |
|---|---|---|
| **`[Term] names …`** | ~85% | `Connection names relation holding…` |
| **`[Term] is …`** | ~8% | `Hold is held by [[Resolution]]…` (opening) |
| **`[Term] carries …`** | ~4% | `In carries interior placement…` |
| **`This [role] names …`** | ~2% | `This threshold names the crossing…` |
| **Case-variant naming** | ~1% | `Bounded asymmetry names…` (title case mismatch) |
| **Narrative / map opening** | rare | Atlas Root discipline preamble |

Second-pass openings included meta maps, crossings, carriers, and asymmetry terms that did not match the primary `{Title} names` regex on pass one.

---

## Patterns eliminated

| Eliminated from opening | Retained elsewhere |
|---|---|
| `[Term] names …` | `## Places` sections unchanged (Common Term Structure) |
| `[Term] is …` (when opening) | Hold/movement sentences in paragraph 2+ |
| `[Term] carries …` (carriers) | Carrier semantics in body and template |
| `The term …` | — |
| Multi-sentence self-naming openers | Compressed to single place sentence |

**Not changed:** dependency (`needs`), relation fields, section order, wikilink targets, ontology.

---

## Examples — before / after

### Connection (`1_First/Connection.md`) — D-006 precedent extended

**Before**

```markdown
# Connection

Connection names relation holding between distinguishable conditions so that passage is available in more than one direction.
```

**After**

```markdown
# Connection

Relation holding between distinguishable conditions so that passage is available in more than one direction.
```

---

### Hold (`1_First/Resolution Conditions/Hold.md`)

**Before**

```markdown
# Hold

Hold names resolution remaining supportable as the same condition.
```

**After**

```markdown
# Hold

Resolution remaining supportable as the same condition.
```

---

### In (`1_First/Carrier Mechanics/In.md`) — carrier term

**Before**

```markdown
# In

In carries interior placement: relation readable as within a bounded condition.
```

**After**

```markdown
# In

Interior relation within a bounded condition.
```

---

### Threshold (`1_First/First Order Crossing.md`) — crossing kind

**Before**

```markdown
# Threshold (First → Second)

This threshold names the crossing from First Order into Second Order.
```

**After**

```markdown
# Threshold (First → Second)

The crossing where held first-order carry is entered and enacted as second-order carrying.
```

---

### Atlas Root (`00_ROOT.md`) — entry map

**Before**

```markdown
# Atlas Root

Reality Mechanics is the discipline of keeping relation traceable as order. Generative order and reading order are distinct…
```

**After**

```markdown
# Atlas Root

The root entrance to Reality Mechanics and the Atlas: the working postulate, dependency spine, posture read, order crossing map, and entry practice.

The working postulate remains:
```

*(Second paragraph preserved — not opening calibration scope.)*

---

## Terms left unchanged (with reasons)

| File | Reason |
|---|---|
| `Theory.md` | **Excluded.** Narrative working-postulate document; opening is intentional prose block (`Reality Mechanics does not begin by defining reality…`), not a term place sentence. Has `conditions.places` for map consistency but is not a term note. |
| `Common Term Structure.md` | **Skipped.** Template specification; no `#` title / opening paragraph structure. Unpublished-style reference doc (`publish: true` but no walkable opening). |
| *(one term)* | **Already aligned.** Opening already matched `conditions.places` before edit (pass-one detection). |

All other **490** published notes with `conditions.places` now open with the place sentence.

---

## Verification

| Check | Result |
|---|---|
| Opening matches `conditions.places` (normalised) | **490 / 490** eligible |
| Frontmatter unchanged | **Pass** — script edits body only |
| `needs` / relation fields unchanged | **Pass** |
| Section structure (`## Places` …) unchanged | **Pass** |
| Self-reference in opening | **0** remaining (eligible corpus) |

---

## Structural Reading alignment

| Discipline read | D-018A effect |
|---|---|
| Place primary | Opening now states place before movement paragraphs |
| Heading names | `# Title` unchanged |
| Hold before movement | Paragraph 2+ often still names hold — Tier 1 operations unchanged (separate commission) |
| D-008 characterisation | Uses same `conditions.places` source — opening now consistent with Pass 1 place read |

---

## Observatory display

Opening prose is now **place-first** across the published Atlas — suitable for Observatory display without UI-specific rewriting of the first sentence. Display layers may still use `conditions.places` from D1; body opening now matches that read.

---

## Constraints honoured

| Constraint | Status |
|---|---|
| Opening prose only | **Pass** |
| No ontology change | **Pass** |
| No dependency change | **Pass** |
| No frontmatter change | **Pass** |
| No section structure change | **Pass** |
| No new terms | **Pass** |
| Meaning preserved via `conditions.places` | **Pass** |

---

## Artefacts

| Artefact | Location |
|---|---|
| This report | `docs/reports/D-018A-opening-place-calibration.md` |
| Machine log (pass 2 snapshot) | `docs/reports/D-018A-opening-place-calibration.json` |
| Calibration script | `scripts/calibrate-opening-place.py` |

---

## Acceptance

| Criterion | Status |
|---|---|
| Every published Atlas term opens with place sentence | **Pass** (490/490 eligible; 2 excluded with reason) |
| Consistent opening structure | **Pass** |
| Meaning preserved | **Pass** (from existing places field) |
| No ontology / dependency / frontmatter / section changes | **Pass** |
| No new terms | **Pass** |
| Observatory-ready opening prose | **Pass** |

---

**Status:** D-018A complete. 489 openings calibrated; 2 documents excluded; Atlas opening place discipline applied corpus-wide.
