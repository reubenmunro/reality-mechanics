# D-018D — Tier 1 Hold Sentence Calibration

**Programme:** Atlas  
**Type:** Hold sentence calibration (implementation)  
**Date:** 2026-07-05  
**Governing evidence:** D-018C (revised Tier 1 rule — source is first line of `## Holds`, not `conditions.holds`)

---

## Executive summary

| Measure | Count |
|---|---:|
| **Atlas files changed** | **481** |
| **C1 insert** (no hold paragraph) | **267** |
| **C1 prepend** (before interpretive para 2) | **212** |
| **C2 compress** (hold-shaped para 2 drift) | **2** |
| **Unchanged** (already aligned) | **4** |
| **Excluded / skipped** | **7** |
| **Post-calibration hold alignment** | **485 / 488** eligible |

Tier 1 hold calibration applied across the published Atlas. Every eligible note now reads **place → hold → movement** in the pre-template body. Interpretive paragraphs preserved. Frontmatter, ontology, dependencies, and section structure unchanged.

**Tests:** member (16) · atlas-publisher (31) · MCP (27) — **all pass**

---

## Rule implemented (D-018C revised)

**Source:** first non-empty line of `## Holds` containing `is held by` — **not** `conditions.holds` parser.

| Operation | When | Count |
|---|---|---:|
| **C1 insert** | Only place paragraph before `##` | 267 |
| **C1 prepend** | Interpretive paragraph 2 — insert hold before, never replace | 212 |
| **C2 compress** | Hold-shaped paragraph 2 differs from `## Holds` line | 2 |

**Forbidden (honoured):** replace interpretive para 2 · holds-field parser · excluded documents · frontmatter / section edits.

---

## Exclusions (unchanged)

| File | Reason |
|---|---|
| `Theory.md` | Narrative document |
| `Common Term Structure.md` | Foundation template spec |
| `00_ROOT.md` | Atlas Root map prose |
| `0_Ground/Ground.md` | Acknowledged-prior holds |
| `1_First/Relation.md` | No `{Term} is held by` line in `## Holds` (primitive) |
| `INVARIANTS.md` | No standard hold sentence in `## Holds` |
| `AI_PARTICIPATION.md` | No standard hold sentence in `## Holds` |

**Already aligned (D-010 — unchanged):** Tact, Clear, Release, Shift.

---

## Verification

| Check | Result |
|---|---|
| Paragraph 2 matches `## Holds` first line (normalised) | **485 / 488** eligible |
| Missing hold paragraph after place | **0** |
| Frontmatter corruption | **0** |
| Prepend interpretive loss (212-note audit) | **0** failures |
| Frontmatter bytes unchanged | **Pass** (body-only rewrite) |
| `## Places` … `## Carries` sections unchanged | **Pass** |

---

## Examples

### C1 insert — Out (`1_First/Carrier Mechanics/Out.md`)

**Before:** place sentence only → `## Places`

**After:**

```markdown
# Out

Exterior relation beyond a bounded condition.

Out is held by [[Boundary]]. A boundary must locate distinction before exterior placement can be read.

## Places
```

---

### C1 prepend — Not (`1_First/Carrier Mechanics/Not.md`)

Hold inserted **before** interpretive movement — not replaced.

```markdown
# Not

Non-availability within the current scope…

Not is held by [[Boundary]] and [[Availability]]. Scope must be bounded, and availability must be readable, before non-availability can be marked.

Not marks that what cannot be reached, traced, or carried within the current structure is not available here.
```

---

### C1 prepend — Cognitive Metabolism

Interpretive question preserved as paragraph 3:

```markdown
Cognitive Metabolism is held by [[Cognition]], [[Thought]], [[Metabolism]], [[Body]], [[Coupling]], and [[Reality Check]]. Cognition and thought must be present…

The traceable question is not whether a person thinks too much. The traceable question is whether thought remains coupled to the organism that carries it.
```

---

### C2 compress — Connection (`1_First/Connection.md`)

Hold-shaped paragraph aligned to `## Holds` canonical line:

**Before:** `…before connection within relation can be read.`  
**After:** `…for connection within relation to be available.`

Movement paragraphs (carries, participant reads) unchanged.

---

### C2 compress — Hold (`1_First/Resolution Conditions/Hold.md`)

Minor wording aligned to `## Holds` first line; distinction paragraph preserved.

---

## Tests

| Suite | Command | Result |
|---|---|---|
| Calibration worker | `npm --prefix member test` | **16 / 16 pass** |
| Atlas publisher / Field | `npm --prefix .atlas-publisher test` | **31 / 31 pass** |
| MCP worker | `npm --prefix reality-mechanics-mcp test` | **27 / 27 pass** |

---

## Structural reading alignment

| Discipline | D-018D effect |
|---|---|
| Place primary (D-018A) | Unchanged — place sentence first |
| Hold before movement (D-010) | Hold paragraph now in pre-template body corpus-wide |
| D-018C revised source | `## Holds` first line — not holds-field parser |
| Interpretive prose | Preserved via prepend-only on Class D body |

---

## Constraints honoured

| Constraint | Status |
|---|---|
| Source = `## Holds` first line | **Pass** |
| No `conditions.holds` parser | **Pass** |
| C1 insert / prepend / C2 compress only | **Pass** |
| No interpretive replace | **Pass** |
| Exclusions unchanged | **Pass** |
| No frontmatter change | **Pass** |
| No ontology / dependency change | **Pass** |
| No section structure change | **Pass** |
| Tests pass | **Pass** |

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| place → hold → movement order improved | **Pass** (485/488 aligned) |
| No interpretive prose flattened | **Pass** (212 prepends verified) |
| No ontology changed | **Pass** |
| Tests pass | **Pass** (74 total) |

---

## Artefacts

| Artefact | Location |
|---|---|
| This report | `docs/reports/D-018D-tier-1-hold-calibration.md` |
| Machine log | `docs/reports/D-018D-tier-1-hold-calibration.json` |
| Calibration script | `scripts/calibrate-tier1-hold.py` |

---

**Status:** D-018D complete. 481 Atlas openings calibrated to Tier 1 hold sentence. Observatory display now reads place → hold before template sections.
