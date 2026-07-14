# S-001 — Programme Characterisation for First Public Submission

> **Superseded evidence:** This submission predates Canonical Translation. Counts, paths, contracts, and public-surface claims below describe that earlier state and are not current authority. See [`PROJECT_STATUS.md`](../../PROJECT_STATUS.md) and [`docs/reports/SUPERSESSION_INDEX.md`](../reports/SUPERSESSION_INDEX.md).

**Programme:** First Public Submission · **Commission:** S-001 · **Role:** Programme Characterisation Lead (architectural coordination, not research, theory, or editing).

**Mode:** Read-only characterisation. No repository files were modified except the creation of this report. Nothing is promoted, derived, or implemented. Every claim is cited to a repository path.

**Method note (how to read this report):** Following the commission, **Observation**, **Evidence**, and **Recommendation** are kept strictly separate. Sections 1–5 contain only Observation and Evidence. All Recommendation is deferred to **Section 6 — Delivery Roadmap**. Where a section needs to point forward, it says "see §6" rather than merging a recommendation inline.

**Primary question:** *What is the current architectural state of Reality Mechanics?*

**One-line answer (from evidence):** Reality Mechanics is a **governed, evidence-disciplined programme with a mature Atlas source and stable governance, a deployed but minimal public platform, and a Calculus that is actively investigated but not yet derived.** Its accepted body is small and its provisional body is large — and the repository states this about itself explicitly.

---

# 1. Programme Characterisation

## 1.1 Observation — current architectural model

The programme organises itself into **five governed bodies** with an explicit authority order (`docs/CONSTITUTION.md:104-116`):

```text
Reality → Atlas → Calculus → Practice → Platform → Reports
```

Authority flows downward; evidence and interpretation flow upward for review; authority never flows upward (`CONSTITUTION.md:118-138`). This is a **governance order, explicitly not a derivation order** (`CONSTITUTION.md:90-100`).

The programme's self-declared purpose is singular: **"to increase structural perception"** (`MISSION.md:5`), served by eight named workstreams — Atlas, Practice, Calculus, Theory, Proof, Calibration, Observatory, AI Workers (`DELIVERY_PLAN.md:94-102`).

The working *shape* of the programme is a **continuous delivery cycle** (`DELIVERY_PLAN.md:52-73`): detect pressure → commission → produce a persisted deliverable → characterise → architect review → accept/reject/defer → (if accepted) promote to Working Architecture → propagate across the workstreams → prepare the next submission. The Observatory is the public submission medium; reports are supporting evidence (`DELIVERY_PLAN.md:108-127`).

## 1.2 Observation — working architecture vs promoted architecture

The repository maintains a deliberate, load-bearing distinction between **what is accepted** and **what is under investigation**, enforced constitutionally:

- C004A — Derivation Before Promotion (`CONSTITUTION.md:186-190`)
- C007 — Reports as Evidence: "A report may enable a decision, but it does not itself decide" (`CONSTITUTION.md:206-210`)
- C008 — Unknowns Remain Unknown (`CONSTITUTION.md:212-216`)
- C011 — Separation of Investigation and Authority (`CONSTITUTION.md:244-250`)

The consequence, observable throughout the tree, is that **almost all recent work sits in the "provisional / evidence" tier**, and the "promoted" tier is small and conservative. This is by design, not by neglect (`docs/practice/ARCHITECTURAL_NOTES.md:40` — "Architectural debt is created whenever a practice concept exists without an Atlas trace").

## 1.3 Evidence — accepted (promoted) architecture

| Accepted body | Status in repository | Evidence |
|---|---|---|
| Constitution (C001–C014) | "stable governing document" | `CONSTITUTION.md:329-346` |
| Authority order | Recognised governance order | `CONSTITUTION.md:102-116` |
| Atlas as canonical source | GitHub canonical; D1 generated | `README.md:12-20`; `PROJECT_STATUS.md:54-59` |
| Relation as sole primitive | "Only Relation is primitive" | `Reality_Mechanics/AI_PARTICIPATION.md:64`; `Reality_Mechanics/1_First/Relation.md:42` |
| Working Postulate v0.6 | "currently load-bearing … answerable" | `Reality_Mechanics/Theory.md:84-88` |
| Stewardship method v1 | Method stabilised; 0 method failures | `docs/stewardship/AUDIT_LOG.md:82-84` |
| 8 Atlas invariants | 4 primitive, 3 derived, 1 governing | `docs/stewardship/ATLAS_INVARIANTS.md` |
| Practice governance decisions D001–D006 | Accepted | `docs/practice/DECISION_REGISTER.md` |
| Note 001 — Order : Structure | Accepted / Closed | `docs/PROJECT_DELIVERY.md:17-27` |
| Platform surfaces Field · Calibration · MCP | Active/operational | `README.md:3-8`; `PROJECT_STATUS.md:73-77` |

## 1.4 Evidence — unresolved questions and contradictions on record

**Unresolved (the programme's own open questions):**

- **Pressure** is underived (A001 "Evidence gathered — derivation unresolved", `docs/practice/ARCHITECTURAL_NOTES.md:577`).
- **The `:` operator** is not accepted calculus (`CONSTITUTION.md:232-242` C010; `docs/practice/PRACTICE.md:31-33`).
- **Order : Structure : Read** is a Proposal awaiting Atlas trace (`docs/PROJECT_DELIVERY.md:59-73`; `ARCHITECTURAL_NOTES.md:465-509`).
- **Second Order terminal-marker gap** — confirmed genuine, explicitly not to be filled (`docs/stewardship/OPEN_QUESTIONS.md:13-22`).
- **D1 schema and non-`entries` recovery path** — open (commission C005, `docs/practice/COMMISSIONS.md:33`).
- **Build/deploy/D1 sync verification** — documented but unverified from files alone (`PROJECT_STATUS.md:97-108`; `REPOSITORY_VERIFICATION.md:3-4`).

**Contradictions / divergences observable in the evidence (characterised, not resolved):**

1. **"operation" is used inconsistently.** Six structural senses split across two incompatible categories (node-like vs edge-like) — `docs/reports/C-C000A-operation-consistency-audit.md`.
2. **Calibration: mission role vs built artefact.** Mission says Calibration "measures the quality of participation" (`MISSION.md:26`); the built Calibration is a standalone reasoning-mechanics demonstration that takes no participant input and measures nothing about a participant (`member/README.md:5,:11-19,:26-33`).
3. **`REPOSITORY_VERIFICATION.md` vs `README.md`.** The verification template names "Cloudflare Pages" and AI workers "Gardener" (`REPOSITORY_VERIFICATION.md:44,:116`), whereas the active product is Cloudflare **Workers** and **Garden is retired** (`README.md:10,:49`). The verification doc is an in-progress template, not current fact.
4. **Proof and Observatory are named workstreams with no workstream documents.** They appear only in `MISSION.md` and `DELIVERY_PLAN.md` (and Observatory in `REPOSITORY_VERIFICATION.md`); no `Proof` or `Observatory` specification, design, or implementation document exists in the tree (repository search).

## 1.5 Observation — maturity of the programme

Expressed as relations rather than scores (per `CONSTITUTION.md:218-230` C009):

```text
governance        : mature      (Constitution stable; Practice governance accepted)
Atlas source      : mature      (492 files; canonical; stable core)
Theory            : working-stable (postulate v0.6, load-bearing, answerable)
Stewardship       : method-stable : coverage-partial (~51 of 492 audited)
Platform          : deployed : unverified-from-repo
Calculus          : actively-investigated : not-derived
Proof             : declared : unbuilt
Observatory       : declared/partial (Field exists) : full-vision-unbuilt
```

The programme is best characterised as **early-but-disciplined**: the *method for making claims* is more mature than the *claims themselves*. Its central pending work is the Calculus (Epoch III, `DELIVERY_PLAN.md:83`).

---

# 2. Workstream Characterisation

Each workstream is characterised independently. "Delivery readiness" = can a deliverable be produced now. "Submission readiness" = can it appear in a public submission without overstating certainty.

## 2.1 Atlas

- **Purpose:** Preserve accepted structural reads as a dependency-ordered reasoning system (`Reality_Mechanics/Atlas.md:40`; `MISSION.md:23`).
- **Current maturity:** Mature source; stable core terms (`status: stable` on `Atlas.md`, `Theory.md`, `Carry.md`, `Trace.md`).
- **Evidence:** 492 markdown files (`PROJECT_STATUS.md:18`); canonical in GitHub (`README.md:12-20`); structure enforced by `atlas-structure-contract.mjs`; authoring constraints in `Reality_Mechanics/Common Term Structure.md`.
- **Dependencies:** Relation (sole primitive); Root Order; Theory (working postulate).
- **Outstanding work:** Stewardship coverage incomplete (~51/492); one uncommitted repair (Maintained Coupling, `AUDIT_LOG.md:88`); confirmed Second Order gap left open.
- **Delivery readiness:** High — it is the source of every other body.
- **Submission readiness:** High — already public via Field/MCP.

## 2.2 Practice

- **Purpose:** Govern how work is commissioned, carried, reviewed, resolved; reduce uncertainty until a steward can decide (`docs/practice/PRACTICE.md:5-9`; C005 `CONSTITUTION.md:192-196`).
- **Current maturity:** Working practice, coherent and in active use; explicitly **not** the Practice Calculus (`PRACTICE.md:15-17`).
- **Evidence:** 7-stage working flow Pressure→Commission→Contract→Evidence→Recommendation→Decision→Resolution (`PRACTICE.md:55-69`); Decision Register D001–D006; Commissions register C001–C005; 15 architectural notes + A001.
- **Dependencies:** Atlas (for eventual derivation); Constitution (authority).
- **Outstanding work:** Every stage-name is an underived concept (`ARCHITECTURAL_NOTES.md:435-445`); Pressure is the first derivation target (`ARCHITECTURAL_NOTES.md:449-461`).
- **Delivery readiness:** High (it is generating deliverables now).
- **Submission readiness:** Medium — presentable **only** with its provisional framing intact.

## 2.3 Calculus

- **Purpose:** Derive and justify the operations/transformations between states — "what occurs between states, not merely the names of states" (`CONSTITUTION.md:180-184` C004).
- **Current maturity:** **Under derivation; no accepted operation exists.** This is the programme's principal open frontier (Epoch III, `DELIVERY_PLAN.md:83`).
- **Evidence:** `docs/practice/PRACTICE_CALCULUS.md` (working notes, not specification); the Calculus report series C-001, C-002, C-003; the governing relation `Order : Structure : Read` remains a Proposal (`docs/PROJECT_DELIVERY.md:59-73`).
- **Dependencies:** Atlas terms; the unresolved `:` operator (C010).
- **Outstanding work:** derive the first operation; resolve `:`; resolve the operation-consistency split (C-C000A); decide the calculus grain (C-003).
- **Delivery readiness:** High for *research reports*; nil for *accepted operations*.
- **Submission readiness:** Low for conclusions; **usable as an honest "open investigation" exhibit**.

## 2.4 Theory

- **Purpose:** State the working postulate through which Atlas operations become testable — "relation holds, order carries, trace places" (`Reality_Mechanics/Theory.md:37-41`).
- **Current maturity:** Working-stable, v0.6, load-bearing but answerable (`Theory.md:84-88`).
- **Evidence:** `Reality_Mechanics/Theory.md` (`kind: theory`, `status: stable`); it is itself an Atlas term with dependencies Atlas, Relation, Root Order, Trace.
- **Dependencies:** Relation, Root Order, Trace, Atlas.
- **Outstanding work:** Open problems listed at `Theory.md:272-281` (e.g., minimum order before relation carries; whether Resolution Rate is a theory test or second-order consequence).
- **Delivery readiness:** High.
- **Submission readiness:** High — it is explicitly framed as a testable postulate, which suits public review.

## 2.5 Proof

- **Purpose (declared):** "Proof demonstrates retraceability" (`MISSION.md:28`; `DELIVERY_PLAN.md:99`).
- **Current maturity:** **Declared but unbuilt.** No `Proof` workstream document exists (repository search found `Proof` only in `MISSION.md`, `DELIVERY_PLAN.md`, `docs/stewardship/README.md`).
- **Evidence:** *De facto* retraceability is demonstrated by the reports and the stewardship audit trail, but there is no artefact that names itself the Proof workstream.
- **Dependencies:** Atlas, Calculus, Stewardship.
- **Outstanding work:** The entire workstream, if it is to be more than the existing evidence trail.
- **Delivery readiness:** Unknown — no deliverable defined.
- **Submission readiness:** Not ready (nothing to submit under this name).

## 2.6 Calibration

- **Purpose (declared):** "measure the quality of participation" (`MISSION.md:26`). **As built:** a public reasoning instrument that runs one live reasoning mechanic in front of the viewer (`member/README.md:3-9`).
- **Current maturity:** **Built and deployed** (`calibration.realitymechanics.nz`, `member/`); no AI, no D1, no Atlas mutation (`member/README.md:26-33`; `PROJECT_STATUS.md:76`).
- **Evidence:** `member/README.md`; reads the canonical first-order spine Strain → Bearing → Resolution and cites the Atlas terminal-marker on Resolution (`member/README.md:20-24`).
- **Dependencies:** Atlas first-order spine (for its structural claims); standalone otherwise.
- **Outstanding work:** Reconcile the "measure participation quality" mission role with the built "demonstrate mechanics" artefact (divergence in §1.4).
- **Delivery readiness:** High (deployed).
- **Submission readiness:** **High — arguably the most submission-ready public exhibit besides the Atlas/Field.**

## 2.7 Observatory

- **Purpose:** The public medium for reviewable submissions; progressively reveal dependency, carrying, retrace, pressure, drift, stability, calibration, hidden structure (`DELIVERY_PLAN.md:108-143`).
- **Current maturity:** **Partial.** "Field" is the current public structural field (`realitymechanics.nz`, `README.md:5`); the full Observatory vision is aspirational.
- **Evidence:** Field surface in `.atlas-publisher/` (D1-bound, `PROJECT_STATUS.md:75`); the Observatory-as-submission-medium model in `DELIVERY_PLAN.md:108-127`; `REPOSITORY_VERIFICATION.md` treats Observatory as an unverified public surface.
- **Dependencies:** Atlas, D1, Platform, Calculus (for the deeper reveals).
- **Outstanding work:** Most of the "progressive reveal" list; the submission-medium framing itself is what S-001 begins to populate.
- **Delivery readiness:** Medium (Field exists; the medium can carry a first submission).
- **Submission readiness:** Medium — the vehicle exists; the richer reveals do not.

## 2.8 AI Workers

- **Purpose:** Constrained AI participation inside the Atlas without inventing theory (`Reality_Mechanics/AI_PARTICIPATION.md:43-45`).
- **Current maturity:** **MCP built and deployed** (`mcp.realitymechanics.nz`, read-only traversal, `README.md:7`); AI behaviour specified as Atlas terms (AI Participation, Atlas Oracle, Oracle Carrying Conditions, Ark Run). Other named workers (Oracle, and the "Gardener/Steward" of the verification template) are unverified/unbuilt.
- **Evidence:** `reality-mechanics-mcp/`; `Reality_Mechanics/AI_PARTICIPATION.md`; steward operating instructions `docs/stewardship/CURSOR.md`; unverified worker list `REPOSITORY_VERIFICATION.md:107-123`.
- **Dependencies:** MCP; Atlas; Common Term Structure; Groundedness.
- **Outstanding work:** Verify/instantiate Atlas Oracle deployment; reconcile the verification template's worker names with the retired-surfaces reality.
- **Delivery readiness:** High for MCP; low for Oracle/other workers.
- **Submission readiness:** Medium — MCP is presentable; the broader worker set is not verified.

---

# 3. Evidence Integration — Completed Reports

All reports are C007 evidence (`CONSTITUTION.md:206-210`): none is promoted; none decides. They are characterised, not reinterpreted. They fall into two lineages: **Operational** (C003, C004) and **Structural/Calculus** (the C-x and Calculus series).

| Report | Purpose | Key finding (as recorded) | Promotion status | Relationship to Working Architecture |
|---|---|---|---|---|
| `C003-repository-reproducibility.md` | Can the repo be independently reproduced? | Development reproducible; canonical deployment blocked by external Cloudflare dependencies | Evidence; resolved commission C003 (`COMMISSIONS.md:31`) | Grounds Platform "deployed : environment-dependent" |
| `C004-operational-readiness-characterisation.md` | Can the platform support ongoing stewardship? | Small, source-canonical read-model; well-documented intent, environment-dependent deploy; missing `atlas-doctor.mjs` | Evidence; resolved commission C004 | Defines operational Working Architecture; raises C005 |
| `C-A001-pressure-derivation-evidence.md` | Evidence for Pressure derivation | "Pressure" has 3 senses; Atlas Pressure is 2nd-order; practice Pressure closer to first-order Strain | Evidence; A001 unresolved | Blocks Practice-Calculus derivation of Pressure |
| `C-C000-operation-characterisation.md` | What qualifies as an operation? | "operation" is substantial but distributed across ≥5 mechanisms; not transformation-defined | Evidence | Feeds Calculus authority question (C004) |
| `C-C000A-operation-consistency-audit.md` | Is "operation" used consistently? | No — 6 senses split across node-like vs edge-like categories | Evidence | Names a contradiction the Calculus must resolve |
| `C-C001-first-operation-characterisation.md` | First retraceable operation? | Boundary is earliest explicitly named operation; contains a self-correction re `kind: operation` | Evidence (with correction note) | Feeds first-operation question; unresolved |
| `C-C001B-node-edge-characterisation.md` | Node vs edge structurally? | Node/edge are foreign to native Atlas; Atlas uses terms + relation fields and reifies edges as terms | Evidence | Reframes the operation split; supports "reads of one connection" |
| `C-CON001-connection-characterisation.md` | What work does Connection do? | Connection is a real load-bearing hub for two-directional passage; scoped, not global root | Evidence | Underpins C-003 minimal-seat finding |
| `C-R001-first-order-dependency-topology.md` | Actual first-order `needs` topology | Acyclic single body; Relation the internal root; Boundary the strongest linkage bottleneck (with parser correction) | Evidence (corrected) | Grounds dependency claims used across Calculus reports |
| `C-R001A-dependency-projection-review.md` | What did C-R001 measure? | Found parser defect (Resolution mis-read as root); linkage ≠ structural centrality | Evidence | Guards against over-reading dependency metrics |
| `C-F001-frontmatter-field-characterisation.md` | What each frontmatter field reads | Coherent grammar in intent; `needs`/`holds`/`traces` largely coincident in practice; `pairs` polyfunctional | Evidence | Supports the "fields as structural reads/questions" hypothesis |
| `C-001-practice-calculus-derivation.md` | Smallest calculus generating the Practice | `Ark Run` (Pressure→Trace→Check→Determine→Step) compresses the 7 stages | Evidence (research) | Candidate runtime for Calculus |
| `C-002-ark-order-calculus-derivation.md` | Derive Ark–Order cooperative relation | `Order : Ark` proposed as candidate Calculus (Ark carries forward; Order preserved via retrace) | Evidence (research); not promoted (C010) | Candidate Calculus |
| `C-003-minimum-support-test.md` | Is the Ark–Order candidate minimal? | **No** — held Carry/Trace pull in Hold→Resolution→Boundary; minimal seat is `Relation → Connection` | Evidence (research); recommends *not* promoting `Order : Ark` | Constrains any future Calculus promotion |

**Cross-report shape (observation):** the structural series converges, without deciding, on a small set of load-bearing terms — **Relation, Connection, Carry, Trace, Hold** — and repeatedly warns against premature promotion of the `:` operator and of graph vocabulary. The related architectural paper `docs/practice/DISCIPLINE_OF_STRUCTURAL_QUESTIONS.md` (a Proposal, `:230`) gathers these into a testable "fields as calibrated questions" hypothesis.

---

# 4. Working Architecture (as supported by evidence)

Stated strictly by current repository evidence. Nothing is promoted here.

## 4.1 Accepted

- Constitution C001–C014 as governing constraints (`CONSTITUTION.md:329-346`).
- Authority order Reality→Atlas→Calculus→Practice→Platform→Reports (`CONSTITUTION.md:104-116`).
- Atlas is canonical; D1 is a generated read-model (`README.md:12-20`).
- Relation is the sole primitive (`AI_PARTICIPATION.md:64`).
- Working Postulate v0.6 is load-bearing (`Theory.md:84-88`).
- Stewardship v1: 8 invariants, evidence grading E1–E5, burden-of-proof discipline (`docs/stewardship/`).
- Practice governance: D001–D006 (`DECISION_REGISTER.md`); Notes 002, 003, 004, 009, 013 accepted (`ARCHITECTURAL_NOTES.md`).
- Note 001 — Order : Structure (Closed, `PROJECT_DELIVERY.md:17-27`).
- Platform: Field, Calibration, MCP are the active public surfaces (`README.md:3-8`).

## 4.2 Candidate (evidence exists; not accepted)

- `Ark Run` runtime as the Practice's operational compression (C-001).
- `Order : Ark` as the candidate Calculus (C-002).
- `Relation → Connection` as the *minimal* seat of the Order/Ark cooperation (C-003).
- "Frontmatter fields as calibrated structural questions" (`DISCIPLINE_OF_STRUCTURAL_QUESTIONS.md`).

## 4.3 Deferred / Under review

- Structure : Read (Note 002, Under Review, `PROJECT_DELIVERY.md:31-41`).
- Read : Action (Note 003, Proposal, `PROJECT_DELIVERY.md:45-55`).
- Pressure derivation (A001 unresolved, `ARCHITECTURAL_NOTES.md:577`).
- D1 schema & recovery (C005 Open, `COMMISSIONS.md:33`).
- Build/deploy/D1 verification (`REPOSITORY_VERIFICATION.md`, in progress).

## 4.4 Rejected

- Stewardship-recovered rejections: generative/supporting dependency classification; "Read" as layer name; composition as general explanation; membership before participation; narrative-section authority (`AUDIT_LOG.md:62-72`).
- Node/edge as native Atlas structure — found foreign (C-C001B).
- `Order : Ark` as a *minimal* calculus — recommended against by C-003 (candidate remains, minimality rejected).

## 4.5 Unresolved

- The `:` operator (C010, `CONSTITUTION.md:232-242`).
- The first operation (C-C001).
- Consistency of "operation" (C-C000A).
- Second Order terminal-marker gap — confirmed, deliberately unfilled (`OPEN_QUESTIONS.md:13-22`).
- Calibration mission-role vs built-artefact divergence (§1.4).

---

# 5. Submission Readiness

Framing: *if the Observatory were submitted for public review tomorrow.*

## 5.1 Observation — what is ready

- **The Atlas / Field** — a live, canonical, dependency-ordered body (`README.md:5,:12-20`).
- **Calibration** — a self-contained public reasoning instrument that needs no explanation of the rest of the programme (`member/README.md`).
- **MCP** — read-only Atlas traversal for AI participants (`README.md:7`).
- **The governing frame** — Mission, Constitution, and the Delivery/Submission model are coherent and public-safe (`MISSION.md`, `CONSTITUTION.md`, `DELIVERY_PLAN.md:108-127`).
- **The honest working-architecture map** — the accepted/candidate/deferred/rejected/unresolved separation (Section 4) is itself a submission-grade exhibit, because the programme's credibility rests on this discipline (C007, C008, C011).

## 5.2 Observation — what is not ready

- **The Calculus as a conclusion** — no accepted operation; `:` unaccepted.
- **Proof** — no workstream artefact exists.
- **The full Observatory reveals** — dependency/drift/stability visualisations are unbuilt (`DELIVERY_PLAN.md:131-143`).
- **Operational guarantees** — production health, D1 sync state, and the missing `atlas-doctor.mjs` are unverified (`PROJECT_STATUS.md:97-108`).
- **AI Oracle and non-MCP workers** — specified but unverified (`REPOSITORY_VERIFICATION.md:107-123`).

## 5.3 Evidence — what supporting evidence exists vs is missing

```text
exists  : 14 reports (docs/reports), stewardship audit trail, deployed Field/Calibration/MCP
missing : Proof artefact, Observatory reveal implementations, verified deploy/D1 snapshot,
          accepted Calculus operation, Oracle deployment verification
```

## 5.4 Observation — what can safely appear in the first submission

- Atlas/Field; Calibration; MCP; Mission; Constitution; the Working-Architecture map (Section 4); the stewardship method and its invariants; the Calculus **as an openly-declared investigation** (not as settled results).

## 5.5 Observation — what should remain internal (or explicitly marked provisional)

- Calculus derivation reports (C-001/002/003) — presentable as "current investigation evidence" but not as findings.
- Architectural notes and the structural-questions paper — Proposals, clearly labelled.
- `REPOSITORY_VERIFICATION.md` — an internal working template with stale surface names; not public-facing.

---

# 6. Delivery Roadmap (Recommendation)

This is the only section containing recommendation. It is **dependency-ordered** and **prioritises propagation of accepted evidence over new investigation** (per commission and `DELIVERY_PLAN.md:63-72`). Each step traces to repository evidence. Nothing here promotes anything; promotion remains a steward act.

**R1 — Verify the delivery pathway (operational, no new theory).**
Complete `REPOSITORY_VERIFICATION.md` and resolve commission **C005** (D1 schema & recovery). This is the highest-leverage step because every public surface depends on it, and it is already the declared Next Investigation (`PROJECT_STATUS.md:97-108`; `COMMISSIONS.md:33`). *Trace:* C003, C004.

**R2 — Propagate already-accepted evidence into the public frame.**
Assemble the first submission from what is already accepted (§5.4): Atlas/Field, Calibration, MCP, Mission, Constitution, and the Working-Architecture map. No new investigation required. *Trace:* Section 4.1; `DELIVERY_PLAN.md:108-127`.

**R3 — Correct the on-record divergences before they reach the public (coordination, not research).**
(a) Reconcile the Calibration mission-role vs built-artefact wording (§1.4 item 2). (b) Retire or update the stale surface names in `REPOSITORY_VERIFICATION.md` (Pages→Workers; Gardener/Garden retired). These are coordination fixes, not derivations. *Trace:* §1.4.

**R4 — Resolve or explicitly hold the Pressure derivation (A001).**
Pressure is the gating node for any Practice-Calculus claim (`ARCHITECTURAL_NOTES.md:449-461`). If it cannot be derived now, mark it held and ensure no downstream promotion depends on it. Prefer holding over new investigation unless a steward commissions it. *Trace:* C-A001; A001.

**R5 — Keep the Calculus as a declared investigation; do not promote.**
Carry C-003's constraint into any future work: the minimal seat is `Relation → Connection`; `Order : Ark` is not minimal; `:` stays unaccepted (C010). No promotion until the grain question and `:` are resolved. *Trace:* C-001, C-002, C-003; `CONSTITUTION.md:232-242`.

**R6 — Define the Proof and Observatory workstreams' first deliverable, or record them as declared-only.**
Both are named but unbuilt (§2.5, §2.7). Either scope a first deliverable or explicitly record them as declared-future so the submission does not imply they exist. *Trace:* `MISSION.md:28-29`; repository search (no artefacts).

---

# 7. Success-Criteria Answers (for the Lead Architect)

Direct answers, each traceable to the sections above.

- **What do we know?** The governance, Atlas source, Theory postulate, stewardship method, and three public surfaces are stable/deployed (§1.3, §4.1).
- **Why do we know it?** Because they are constitutionally accepted, canonical in GitHub, and audited with zero method failures (`CONSTITUTION.md:329-346`; `AUDIT_LOG.md:82-84`).
- **What is still uncertain?** The Calculus (no accepted operation), Pressure, the `:` operator, operational verification, and the Proof/Observatory build (§1.4, §4.5, §5.2).
- **What has been accepted?** Section 4.1.
- **What should now be promoted?** *Nothing new by this report* (C007). The promotable *accepted* material already exists and should be propagated, not re-decided (R2).
- **What should be delivered next?** R1 — verify the delivery pathway and close C005 (operational, highest leverage).
- **What should appear in the first public submission?** Atlas/Field, Calibration, MCP, Mission, Constitution, the Working-Architecture map, and the Calculus **as an openly-declared open investigation** (§5.4).

---

**Scope note:** This commission created only this report (`docs/submissions/S-001-programme-characterisation.md`). No repository files were modified, no Atlas terms rewritten, no theory invented, nothing promoted, no implementation performed. Observation, Evidence, and Recommendation are separated (Recommendation confined to §6). Reports are characterised, not reinterpreted (C007). Unknowns are preserved as unknown (C008). Value is expressed as relations, not percentages (C009).
