# Discovery to Implementation

**Practice artefact.** Commission D-016 — process definition only.

**Purpose:** Define the required process for moving any architectural discovery toward implementation.

**Worked example:** D-015A / D-015B (Derived Ratio characterisation and falsification). That example is **process evidence**, not promoted theory.

**Status:** Descriptive gate for future commissions. Not Calculus. Not constitutional law.

---

## Process

```text
Observe
  ↓
Document
  ↓
Falsify
  ↓
Compress
  ↓
Align
  ↓
Implement
```

Each stage produces a **persisted deliverable** before the next stage may begin.

---

## Required rule

**No stage may be skipped.**

```text
No implementation before compression.
No compression before falsification.
No falsification before documentation.
No documentation before observation.
```

| Gate | Blocks |
|---|---|
| Without observation | Documentation is assertion |
| Without documentation | Falsification has no target |
| Without falsification | Compression preserves overreach |
| Without compression | Alignment edits multiply drift |
| Without alignment | Implementation encodes the wrong read |

Future commissions that propose Atlas edits, runtime changes, or promotion to Working Architecture should cite which gates have passed.

---

## Stages

### 1. Observe

**Purpose:** Gather recurrence, mechanism, and contradiction from accepted evidence — not preference.

**Deliverables:** Observation reports, audits, behaviour recordings, repository facts, command outputs.

**Must not:** Invent mechanics, assign ratio by hand, or treat plausibility as proof.

**Exit criterion:** Repeated or mechanical observations are recorded with source citations.

---

### 2. Document

**Purpose:** Characterise the discovery as a **candidate** read — descriptive, not authoritative.

**Deliverables:** Design documents, characterisations, architectural notes under `docs/`.

**Must not:** Promote to Calculus, conflate observation with conclusion, or skip unknowns.

**Exit criterion:** A falsifiable document exists; observations are separated from interpretation.

---

### 3. Falsify

**Purpose:** Attempt to disprove the documented discovery against accepted evidence.

**Deliverables:** Falsification reports with supporting and contradicting evidence recorded **separately**.

**Must not:** Defend hypotheses, merge unsupported claims, or treat falsification failure as promotion.

**Exit criterion:** Each major claim has a verdict: survives / survives with constraint / falsified / unknown.

---

### 4. Compress

**Purpose:** Reduce the discovery to the **smallest retraceable explanation** that still accounts for accepted observations — **without loss** of necessary constraints.

**Acceptance standard:** Compression **without loss**.

| Lossless compression | Loss (reject) |
|---|---|
| Merge duplicate principles | Drop contradicting evidence |
| Replace overbroad labels with precise ones | Collapse unknowns into conclusions |
| Retain explicit constraints | Promote falsified links as law |

**Exit criterion:** A classification or minimal set is recorded (e.g. viable with constraints, rejected, unknown).

---

### 5. Align

**Purpose:** Bring all affected documents into agreement with the compressed read.

**Deliverables:** Revised design docs, practice cross-references, commission register updates — **no code** unless Implement is separately commissioned.

**Must not:** Leave prior documents stating falsified claims as if current.

**Exit criterion:** Documented discovery, falsification report, and aligned artefacts tell one retraceable story.

---

### 6. Implement

**Purpose:** Encode the **aligned** read in Atlas, runtime, calibration, or deployment — only when implementation is explicitly commissioned.

**Deliverables:** Code, Atlas edits, tests, deployment verification.

**Must not:** Begin before Align; silently extend beyond compressed scope; promote discovery during implementation.

**Exit criterion:** Implementation matches aligned documents; evidence report records what changed and what was not changed.

---

## 1. Why discoveries must be documented before implementation

Implementation is expensive to reverse and easy to misread as truth.

Documentation forces:

- separation of observation and interpretation;
- explicit unknowns;
- a falsifiable target;
- steward-visible scope before code or Atlas edits.

The Practice flow (Pressure → Commission → Contract → Evidence) already requires persisted deliverables. **Document** is the architectural discovery equivalent: a candidate read must exist on paper before it can be disproved or encoded.

---

## 2. Why falsification is required before promotion

Promotion — to Working Architecture, runtime principles, or Calculus — requires knowing what **failed**, not only what survived.

Falsification:

- records contradicting evidence separately;
- rejects overreach without discarding accurate observations;
- prevents "viable with constraints" from being read as unconditional proof.

D-014 demonstrated falsification-first principle derivation. D-015B applied the same method to a design document.

---

## 3. Why compression without loss is the acceptance standard

Architectural intent favours **fewer principles that explain more** — not fewer principles by deleting inconvenient facts.

Compression without loss means:

- duplicates merge;
- falsified claims are removed or constrained, not hidden;
- unknowns remain unknown;
- the smallest set still retraces to evidence.

If compression requires dropping accepted observations, the discovery is **insufficient** — not ready for Align or Implement.

---

## 4. Why alignment must occur before code changes

Drift happens when:

- a falsification report says one thing;
- a design document still says another;
- implementation follows the outdated read.

**Align** synchronises documents **after** compression and **before** implementation so that code changes have a single authoritative compressed read — still descriptive until steward promotion, but internally consistent.

Alignment is not promotion. It is consistency.

---

## 5. How D-015A / D-015B demonstrated the process

D-015 is a **worked example of the gate sequence**, not a mandate to adopt Derived Ratio.

| Stage | D-015 artefact | Outcome |
|---|---|---|
| **Observe** | D-010B, D-011, D-012, D-014 | Ratio pipeline live; behaviours retraceable; principles compressed to P1–P4 |
| **Document** | D-015A — `docs/runtime/DERIVED_RATIO.md` | Candidate bridge characterised; hypothesis recorded; not promoted |
| **Falsify** | D-015B — `docs/reports/D-015B-derived-ratio-falsification.md` | Tested against D-014, D-010B, D-011, D-012, Atlas fields |
| **Compress** | D-015B classification | **Viable with constraints** — scalar derived ratio, not rich signature; participation/recognition falsified as load-bearing |
| **Align** | D-015A revised | Terminology aligned: scalar pipeline; mass rule explicit; not Atlas Ratio |
| **Implement** | *Not commissioned* | No Field or Atlas changes — process stopped correctly at Align |

**Process lesson:** D-015 completed through **Align** without **Implement**. That is valid. Implementation requires a separate commission after gates pass.

**Not promoted:** Derived Ratio remains a descriptive runtime design reference, not Calculus or accepted theory.

---

## 6. When implementation is allowed

Implementation is allowed only when **all** of the following hold:

1. **Observe** — relevant evidence reports exist and are cited.
2. **Document** — candidate discovery is persisted and falsifiable.
3. **Falsify** — falsification report exists; no load-bearing falsified claims remain.
4. **Compress** — classification recorded; compression without loss verified.
5. **Align** — design docs and reports agree on the compressed read.
6. **Commission** — steward (or explicit commission brief) authorises implementation scope.
7. **Scope boundary** — implementation does not exceed the aligned compressed read without a new commission.

| Allowed | Not allowed |
|---|---|
| Implement aligned runtime constraint (e.g. one shared ratio source) | Implement falsified hypothesis (e.g. compression-as-recognition) |
| Extend tests for retrace | Skip falsification because code "already works" |
| Separate implementation commission after D-015 Align | Treat D-015A alone as implementation authority |

---

## 7. When a discovery must remain unknown

A discovery **must remain unknown** (not implemented, not promoted) when:

| Condition | Example from D-015 |
|---|---|
| Falsification verdict is **unknown** | Participation formalisation (D-014) |
| Classification is **insufficient** or **rejected** | Would block Implement |
| Compression would **lose** accepted observations | Cannot drop O-4 direct structure path to save a linear chain |
| Evidence gap is explicit | Nest behaviour under-sampled (D-011) |
| Steward has not commissioned next stage | D-015 stopped at Align |
| Promotion would exceed evidence | Derived Ratio ≠ Atlas Ratio |

**Unknown is a valid outcome.** The process succeeds when the relation is known — including "not yet implementable."

---

## Relationship to other Practice documents

| Document | Relation |
|---|---|
| [`PRACTICE.md`](PRACTICE.md) | Pressure → Commission → Evidence flow; this process governs **architectural discovery → implementation** |
| [`COMMISSIONS.md`](COMMISSIONS.md) | Register of completed gates per commission |
| [`DELIVERY_PLAN.md`](../../DELIVERY_PLAN.md) | Programme delivery; cites this process as implementation gate |
| [`RUNTIME_PRINCIPLES.md`](RUNTIME_PRINCIPLES.md) | Example of Compress output (D-014) — not a substitute for this process |
| [`docs/runtime/DERIVED_RATIO.md`](../runtime/DERIVED_RATIO.md) | Example of Document + Align output (D-015) — descriptive only |

---

## Commission gate checklist

Future commissions may use this checklist in acceptance criteria:

| Gate | Question | Evidence type |
|---|---|---|
| Observe | What was seen, mechanically? | Report, audit, recording |
| Document | What candidate read is falsifiable? | Design doc |
| Falsify | What failed? | Falsification report |
| Compress | What is the smallest lossless read? | Classification, merged principles |
| Align | Do all docs agree? | Revised docs, cross-refs |
| Implement | Is code/Atlas change explicitly in scope? | Implementation report, tests |

---

## Acceptance (D-016)

| Criterion | Status |
|---|---|
| Process document created | **Pass** |
| D-015 used as worked example | **Pass** |
| No theory promoted | **Pass** |
| No Atlas/runtime implementation | **Pass** |
| Future commissions can use as gate | **Pass** |

---

**Status:** Process defined. Steward decides whether commissions must cite this gate explicitly in contract templates.
