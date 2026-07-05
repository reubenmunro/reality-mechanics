# D-009 — Format + Layout Consistency Check

**Programme:** Structural Reading / Repository Hygiene  
**Type:** Format + layout consistency (mechanical only)  
**Date:** 2026-07-05  
**Pre-commit gate for:** D-008 whole-Atlas calibration artefacts

---

## Objective

Check repository document layout consistency before committing D-008.

No theory work. No new terms. No candidate promotion. No stylistic prose rewrite.

---

## Scope checked

| Area | Files | Result |
|---|---:|---|
| Atlas term files (`Reality_Mechanics/`) | 492 | Template consistent (424 published terms) |
| Practice docs (`docs/practice/`) | 8 | Minor link-path fixes applied |
| Reports (`docs/reports/`) | 22 | D-008 artefacts fixed; legacy issues deferred |
| Submission docs (`docs/submissions/`) | 2 | No issues in scope |
| Delivery/governance (root + plan) | 4 | Count labels aligned with D-008 register |

**Total markdown files scanned:** 528

---

## Atlas term layout (Common Term Structure)

Checked every published term (`kind: term`, publish filter) for:

| Check | Result |
|---|---|
| YAML frontmatter present | **Pass** — 0 missing |
| Required sections (`## Places` → `## Carries`) | **Pass** — 0 missing across 424 terms |
| H1 title matches term name | **Pass** — 0 mismatches |
| Section naming convention | **Pass** — matches `Common Term Structure.md` |

No Atlas files changed.

---

## D-008 artefacts reviewed

| File | Issues found | Fixed |
|---|---|---|
| `docs/reports/D-008-whole-atlas-calibration.md` | Short internal paths; Class A/D counts drift vs register | Yes |
| `docs/reports/D-008-term-register.md` | Missing Atlas term **Term** (header collision); Connection misclassified A; 423 rows not 424 | Yes — regenerated |
| `docs/reports/D-008-candidate-places.md` | Short stewardship paths | Yes |
| `docs/practice/STRUCTURAL_READING_BACKLOG.md` | Short paths; Class A/D counts | Yes |

Supporting docs aligned for count consistency:

- `docs/practice/STRUCTURAL_READING.md`
- `docs/practice/PRACTICE.md`
- `docs/practice/COMMISSIONS.md`
- `DELIVERY_PLAN.md`
- `PROJECT_STATUS.md`

---

## Issues found

### Fixed (mechanical)

| # | Issue | Location | Fix |
|---|---|---|---|
| 1 | **Term register missing one row** — Atlas term `Term` collided with table header `\| Term \|` | `D-008-term-register.md` | Renamed column to **Atlas term**; regenerated full register (424 rows) |
| 2 | **Connection misclassified Class A** in register despite D-006 calibration | `D-008-term-register.md` | Connection → Class D, Place/Movement faithful, Calibrated yes (D-006) |
| 3 | **Class count drift** — report/backlog said 68 A / 355 D; register implied 423 rows | D-008 suite + practice/status | Aligned to **67 A / 357 D / 424 total** (Connection + Term corrections) |
| 4 | **Broken short internal paths** — `OPEN_QUESTIONS.md`, `AUDIT_LOG.md`, `STEWARDSHIP_V1.md` without `docs/stewardship/` prefix | D-008 reports, backlog | Full repo-root paths in backticks |
| 5 | **Broken short paths in relation table** | `STRUCTURAL_READING.md` | Prefixed `docs/practice/` on sibling doc references |
| 6 | **Ambiguous commission resolution path** | `COMMISSIONS.md` | Full path to backlog and D-008 reports |

### Deferred (out of D-009 scope or pre-existing)

| # | Issue | Location | Reason deferred |
|---|---|---|---|
| 1 | Table column oscillation (3↔4 cols) | `D-003-deployment-verification.md` | Pre-existing committed report; not D-008 gate |
| 2 | Heading level skip false positives | `D-006-calibrated-prose-refinement.md` | `###` headings inside Pass 5 follow `## Pass 5`; code-block `# Connection` triggers audit false positive |
| 3 | Repository-wide short internal paths | Many older reports/practice docs | Hygiene pass beyond D-008 gate; no broken D-008 artefact paths remain |
| 4 | Commission naming glob `D-00x-*.md` in prose | `COMMISSIONS.md` | Intentional pattern reference, not a link |
| 5 | `atlas-doctor.mjs` absent | Pre-commit hook | Known ops gap (D-004); not format/layout |

---

## Files changed

| File | Change type |
|---|---|
| `docs/reports/D-008-term-register.md` | Regenerated — column rename, 424 rows, totals footer |
| `docs/reports/D-008-whole-atlas-calibration.md` | Path fixes; Class A/D count alignment |
| `docs/reports/D-008-candidate-places.md` | Stewardship path fixes |
| `docs/practice/STRUCTURAL_READING_BACKLOG.md` | Path fixes; count alignment |
| `docs/practice/STRUCTURAL_READING.md` | Path fixes; backlog count |
| `docs/practice/PRACTICE.md` | Backlog count label |
| `docs/practice/COMMISSIONS.md` | D-008 resolution paths; Class A count |
| `DELIVERY_PLAN.md` | (prior D-008 programme entry — unchanged meaning in D-009) |
| `PROJECT_STATUS.md` | Class A count label |

**Atlas term files changed:** 0  
**Meaning/prose changed:** 0  
**Ontology changed:** 0

---

## Consistency checks passed

| Check | Status |
|---|---|
| Markdown tables render cleanly (D-008 suite) | **Pass** |
| Term register row count = 424 | **Pass** |
| Register totals: 67 A + 357 D = 424 | **Pass** |
| Atlas term template sections | **Pass** |
| D-008 internal paths resolve from repo root | **Pass** |
| Commission/report naming (`D-00N-description.md`) | **Pass** |
| No ontology or prose meaning altered | **Pass** |

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
| Markdown tables render cleanly | **Pass** |
| Atlas term layout remains consistent | **Pass** |
| D-008 artefacts readable and internally consistent | **Pass** |
| No ontology or prose meaning changed | **Pass** |
| Tests pass | **Pass** |

---

## Recommendation

**Accept** D-009. D-008 artefacts are ready to commit as a consistent package.

**Next:** Commit D-008 + D-009 together; no D1 sync required (no Atlas source edits).

---

**Status:** D-009 complete. Mechanical layout fixes applied; pre-existing repository-wide path hygiene deferred.
