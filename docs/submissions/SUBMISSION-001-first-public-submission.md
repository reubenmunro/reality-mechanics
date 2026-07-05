# Reality Mechanics — Submission 001

**First public submission for review.**

This is a coordinated submission package, not a claim of final certainty. It exposes what Reality Mechanics currently holds as accepted, what it is still investigating, and what remains unresolved — so that independent participants can review, challenge, and retrace it, the way a consent authority reviews a coordinated building‑consent package (`DELIVERY_PLAN.md:108-127`).

- **Medium:** the Observatory (public surfaces).
- **Supporting evidence:** the repository and its reports (`docs/reports/`).
- **Reviewers:** the public.

Every claim below cites repository evidence. Where something is not yet established, it is marked unresolved rather than asserted (Constitution C008).

---

## 1. What Reality Mechanics is

> **Reality Mechanics exists to increase structural perception.** (`MISSION.md:5`)

Reality already carries order; participation becomes more faithful when the questions asked, the operations performed, and the answers preserved remain **retraceable** (`MISSION.md:7-17`). Reality Mechanics does not claim to invent structure. It builds instruments to perceive, preserve, and communicate structure that is already there.

The programme is intentionally small in what it serves publicly today (`README.md:3-10`):

| Surface | What it is | Address |
|---|---|---|
| **Field / Atlas** | The public structural field — a dependency‑ordered reasoning system | `realitymechanics.nz` |
| **Calibration** | A live reasoning instrument you can watch run | `calibration.realitymechanics.nz` |
| **MCP** | Read‑only Atlas traversal for AI participants | `mcp.realitymechanics.nz` |

---

## 2. How to review this submission

Reality Mechanics is designed to be **corrigible** — every accepted body remains open to correction through evidence (Constitution C013, `docs/CONSTITUTION.md:258-264`). Reviewers are invited to challenge it on its own terms:

- **Retraceability (C002):** every accepted claim should be independently retraceable. Where it is not, it is provisional.
- **Evidence over memory (C001):** repository evidence has authority over assertion or preference.
- **Unknowns stay unknown (C008):** invented certainty is a defect, not a feature.
- **Relation over percentage (C009):** readiness is expressed as structural relations, not invented scores.

If a reviewer can show that an accepted claim cannot be retraced, that is a valid correction, not an attack.

---

## 3. The three‑layer architecture

```text
Atlas (source)  →  Stewardship (verification)  →  Platform (public surfaces)
```

- **Atlas** — the editable, dependency‑ordered record of structural reads; canonical in GitHub (`Reality_Mechanics/`, 492 files; `README.md:12-20`).
- **Stewardship** — a recovered audit method that verifies existing Atlas structure against itself; it authors nothing new (`docs/stewardship/README.md:5-9`).
- **Platform** — Cloudflare Workers that *read* the Atlas through a generated D1 read‑model; D1 is generated, never an editing surface (`README.md:18-20`).

Governance runs above all three, with an explicit **authority order** (governance, not derivation): Reality → Atlas → Calculus → Practice → Platform → Reports (`CONSTITUTION.md:104-116`). Authority flows down; evidence flows up.

---

## 4. Working Architecture (what is accepted vs open)

This is the heart of the submission. It is presented honestly: the **accepted body is small and conservative; the investigated body is large.** That is by design (C004A — derivation before promotion).

### 4.1 Accepted

- The Constitution (C001–C014) as governing constraints; considered stable (`CONSTITUTION.md:329-346`).
- The Atlas as canonical source; D1 as a generated read‑model (`README.md:12-20`).
- **Relation** as the sole primitive (`Reality_Mechanics/1_First/Relation.md:42`; `AI_PARTICIPATION.md:64`).
- The **Working Postulate** v0.6 — "relation holds, order carries, trace places" — currently load‑bearing and answerable (`Reality_Mechanics/Theory.md:37-41,:84-88`).
- The **Stewardship method** v1: eight recovered invariants, an evidence grading scheme (E1–E5), and a burden‑of‑proof discipline; zero method failures to date (`docs/stewardship/ATLAS_INVARIANTS.md`; `AUDIT_LOG.md:82-84`).
- Practice governance decisions D001–D006 (`docs/practice/DECISION_REGISTER.md`).
- Public surfaces Field, Calibration, MCP (`README.md:3-8`).

### 4.2 Under investigation (candidate — not accepted)

- A candidate practice runtime, `Ark Run` (`docs/reports/C-001-…`).
- A candidate calculus relating **Order** and **Ark** (`C-002-…`), tested and found **not minimal**; the minimal seat is `Relation → Connection` (`C-003-…`).
- A hypothesis that Atlas frontmatter fields are calibrated structural questions (`docs/practice/DISCIPLINE_OF_STRUCTURAL_QUESTIONS.md`).

### 4.3 Unresolved (openly declared)

- The **Calculus** has no accepted operation yet, and the `:` operator is not accepted (C010, `CONSTITUTION.md:232-242`).
- **Pressure** is not yet derived (`docs/practice/ARCHITECTURAL_NOTES.md:577`).
- "operation" is used inconsistently across the repository (`C-C000A`).
- Second Order has a confirmed terminal‑marker gap, deliberately left unfilled (`docs/stewardship/OPEN_QUESTIONS.md:13-22`).
- Production deployment/D1‑sync verification is documented but not yet verified from files alone (`PROJECT_STATUS.md:97-108`).

---

## 5. Public exhibits

### 5.1 The Atlas / Field

A dependency‑ordered reasoning system — "the worked and tended surface where terms, traces, reads, and corrections are held in retraceable order" (`Reality_Mechanics/Atlas.md:40`). It is not a glossary; terms are handles and order is what they handle. It is canonical in GitHub and served publicly through Field.

### 5.2 Calibration

A public reasoning instrument that shows reasoning has mechanics by running one live in front of the viewer — no AI, no input required (`member/README.md:3-9`). It reads the Atlas's own first‑order spine, Strain → Bearing → Resolution, and surfaces Carried Strain because Resolution's structure demands something survive it (`member/README.md:20-24`).

### 5.3 MCP

Read‑only Atlas traversal tools for AI participants, following the AI participation rules that forbid inventing primitives or grounding notes autonomously (`Reality_Mechanics/AI_PARTICIPATION.md:43-70`).

---

## 6. Evidence base

Fourteen read‑only reports support this submission (`docs/reports/`). Under the Constitution, **a report is evidence, not a decision** (C007). They divide into:

- **Operational:** repository reproducibility (C003) and operational readiness (C004).
- **Structural / Calculus:** the dependency‑topology, frontmatter, operation, connection, and calculus‑derivation series (C‑R001/A, C‑F001, C‑C000/A, C‑C001/B, C‑CON001, C‑001/002/003).

A full characterisation of the programme's state, from which this submission is drawn, is in `docs/submissions/S-001-programme-characterisation.md`.

---

## 7. What this submission asks of reviewers

1. **Test the accepted body (§4.1) for retraceability.** If any accepted claim cannot be retraced, it should fall back to provisional.
2. **Challenge the candidates (§4.2), not by preference but by evidence.** The candidate calculus in particular is explicitly unpromoted.
3. **Treat the unresolved items (§4.3) as genuinely open.** They are not hidden; they are the programme's live frontier.

Reality Mechanics measures its success not by how much it has concluded, but by how much of what it holds can be **independently retraced** (`CONSTITUTION.md:36-42`).

---

**Status:** Submission 001, first public submission. Coordinated from accepted repository evidence. Nothing in this document is promoted beyond its stated status; the Calculus is presented as an open investigation. Prepared under the Constitution's standard of care (C001, C002, C007, C008, C009, C013).
