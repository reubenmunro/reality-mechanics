# D-002 — Atlas + Calibration + Website Delivery

**Programme:** Delivery
**Type:** Atlas → Calibration → Field/Website → Submission
**Mode:** Implementation delivery (write, then verify with tests)
**Governing context:** `docs/submissions/S-001-programme-characterisation.md`, `docs/submissions/SUBMISSION-001-first-public-submission.md`

## Objective

Turn accepted programme evidence into a working Observatory loop:

```text
Atlas  →  Calibration  →  Field / Website  →  Submission
```

No new theory. No Calculus promotion. No invented Atlas terms. No wholesale Atlas rewrite.

---

## 1. Files changed

| File | Part | Change |
|---|---|---|
| `member/src/index.js` | 2 | Added a **Structural Calibration — Term Test** mode: embedded bounded first-order dataset, dependency read, removal/restore simulation, and an Observation / Evidence / Recommendation output. Added navigation to Submission 001. |
| `member/test/invariants.test.mjs` | 2 | Added assertions locking the structural mode: dataset present, no new input surfaces, obs/evidence/rec separation, load-bearing/weak/unresolved characterisation, navigation. |
| `.atlas-publisher/main-website-worker.js` | 3 | Added `submissionPage()` and routes `/submission` + `/submission-001`; added a **Submission 001** link to the Field access-row. |
| `.atlas-publisher/test/field-states.test.mjs` | 3 | Added assertions: Field links to Submission 001; `/submission` returns 200 with accepted/candidate/unresolved; submission page does not promote the Calculus. |
| `docs/reports/D-002-atlas-calibration-website-delivery.md` | 4 | This delivery note. |

### Part 1 — Atlas: no new change required

The only accepted Atlas correction on record — `Maintained Coupling` gaining `[[Compatibility]]` in `needs`/`holds`/`traces` (Evidence E1) — was already committed in the preceding delivery and is recorded as **Committed** in `docs/stewardship/AUDIT_LOG.md:43` with **Outstanding Proposals: None** (`AUDIT_LOG.md:86-88`) and marked **Resolved** in `PROJECT_STATUS.md:90`. No candidate or unresolved term was touched (per commission constraint). The source file carries the correction at `Reality_Mechanics/3_Third/Fields/Relational Participation/Bearing Relations/Maintained Coupling.md:13,17,23`.

---

## 2. Tests run

All three worker suites and both build checks pass.

| Command | Result |
|---|---|
| `member: node --check src/index.js` | pass |
| `member: node test/invariants.test.mjs` | **16 / 16 assertions pass** |
| `.atlas-publisher: node --check main-website-worker.js` | pass |
| `.atlas-publisher: node --test test/*.test.mjs` | **25 / 25 tests pass** |
| `reality-mechanics-mcp: node test/worker.test.mjs` | **27 / 27 assertions pass** |
| `member: wrangler deploy --dry-run` | build ok — 27.18 KiB (gzip 8.04 KiB) |
| `.atlas-publisher: wrangler deploy --dry-run` | build ok — 134.26 KiB (gzip 36.11 KiB) |

(The dry-run's only error is a sandbox log-file write permission on `~/.wrangler/logs`, not a build failure; both bundles were produced and `--dry-run: exiting now` reported.)

The removal-simulation logic was independently replayed against the embedded dataset to confirm its verdicts (§3).

---

## 3. What the calibration now demonstrates

Calibration previously showed calibration **in time** (strain rises on its own; a pulse corrects only past threshold; carried strain never resets to zero). It now also shows calibration **in structure**.

For one selected Atlas term the instrument:

1. **reads its dependencies** (`needs`) and what it **carries / traces / holds / pairs**;
2. **simulates removal** — recomputing which loaded terms can still be retraced to the primitive `Relation`;
3. **reports what becomes unretraceable**;
4. **restores** the term (nothing is mutated);
5. produces a single **load-bearing / weak / unresolved** characterisation,

with output separated into **Observation**, **Evidence**, and **Recommendation**.

It runs on a bounded, locally held first-order subset (Relation → Asymmetry → Bounded Asymmetry → Distinction → Boundary → Availability → Strain → Bearing → Clearance → Resolution → Hold, plus Connection → Carry/Trace). There is no Atlas mutation, no D1, and no network — consistent with Calibration's standing invariants.

Verified verdicts (replay of the embedded algorithm):

| Term removed | Verdict | What becomes unretraceable |
|---|---|---|
| Boundary | load-bearing | Availability, Strain, Bearing, Resolution, Hold, Carry, Trace |
| Relation | load-bearing | the whole subset |
| Connection | load-bearing | Carry, Trace |
| Hold | load-bearing | Carry, Trace |
| Resolution | load-bearing | Hold, Carry, Trace |
| Carry | weak | none (leaf at this scope) |
| Trace | weak | none (leaf at this scope) |
| Clearance | unresolved | grounding reaches `Clear`, outside the loaded subset |

These reproduce the repository's own topology findings: Boundary as the strongest first-order bottleneck (`C-R001`), and the demonstration that what a term *carries* is not what *depends on it* (Carry/Trace carry much but bear no loaded dependents). This is **calibration, not proof**, and it promotes no Calculus claim.

---

## 4. Website / Field connection

- **Field** (`realitymechanics.nz`) shows the Atlas structure and now links to both **Calibration** and **Submission 001** from its access-row.
- **Calibration** (`calibration.realitymechanics.nz`) shows how that structure can be tested and links back to **Field** and **Submission 001**.
- **Submission 001** is served at `realitymechanics.nz/submission`, laying out what is **accepted / candidate / unresolved**, and linking back to Field and Calibration. It states plainly that the `:` operator is **not accepted** and the candidate calculus is **explicitly unpromoted**.

The loop is now traversable in both directions: Atlas → Calibration → Submission and back.

---

## 5. Acceptance criteria

| Criterion | Status |
|---|---|
| Existing tests pass | Yes — member 16/16, field 25/25, mcp 27/27 |
| The site builds | Yes — both workers `node --check` clean and `wrangler --dry-run` build clean |
| Calibration demonstrates ≥ 1 Atlas structural test | Yes — one term tested end to end with obs/evidence/rec and a load-bearing/weak/unresolved verdict |
| Submission 001 reachable from the public website | Yes — `/submission`, linked from Field and Calibration |
| No unaccepted Calculus claim promoted | Yes — submission and calibration both state the calculus is candidate/unaccepted |

---

## 6. What remains unresolved

- **Calibration reads a bounded local subset, not the live Atlas.** The term test is faithful to the Atlas source it was seeded from, but it does not yet read the full Atlas / D1 read-model at runtime. Widening it beyond the first-order spine is future work.
- **Retraceability is modelled as `needs`-reachability to Relation.** This is one structural projection (per `C-R001A`), not the whole structural order; `holds`/`traces`/`carries`/`pairs` are shown but not yet used in the removal calculus.
- **The Calculus is still unresolved** — no accepted operation, `:` unaccepted (`CONSTITUTION.md:232-242`). Nothing here changes that.
- **Production deployment / D1-sync remains file-documented but not independently verified** (`C003`, `PROJECT_STATUS.md`).
- **Second Order terminal-marker gap** remains deliberately unfilled (`OPEN_QUESTIONS.md`).

---

## 7. Next commission

**D-003 — Calibration reads the live field.** Extend the structural term test to read term structure from the generated D1 read-model (or a generated static snapshot committed alongside Field), so Calibration can test any published Atlas term rather than the bounded first-order subset — while preserving the no-mutation, calibration-not-proof discipline. Secondary: fold `holds`/`traces` into the removal calculus so the verdict reflects more than `needs`-reachability.

---

**Status:** D-002 delivered. Observatory loop Atlas → Calibration → Field/Website → Submission is live and traversable; all tests and builds pass; no accepted status changed and no Calculus claim promoted.
