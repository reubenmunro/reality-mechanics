# Runtime Principles

**Practice artefact.** Principles that survived D-014 investigation — not promoted Calculus, not constitutional law, not implementation spec.

These principles describe what the **current** Observatory runtime and accepted Atlas material **already imply**. They are derived from evidence. They do not authorise new mechanics.

**Evidence report:** [`docs/reports/D-014-runtime-principles-derivation.md`](../reports/D-014-runtime-principles-derivation.md)

**Field bridge (D-015A):** [`docs/runtime/DERIVED_RATIO.md`](../runtime/DERIVED_RATIO.md) — structure → derived ratio → behaviour chain; descriptive, not authoritative.

**Layer contract (P-003):** [`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`](../runtime/INVARIANT_RUNTIME_CONTRACT.md) — separates invariant substrate (L0–L4), frame visibility, participant overlay (L5), and appearance (L6).

**Steward decides** whether any principle becomes load-bearing beyond runtime interpretation.

---

## Principle 1 — Structure is invariant; runtime translates

**Statement**

Canonical structure lives in the repository. Every surface — Field, MCP, Calibration, D1, prose, frontmatter — **translates** structure. Runtime may interpret structure. It must not silently create it.

**Evidence**

- Canonical Common Term Structure and the generated Canonical Graph schema
- D-010A: one shared pipeline; explicit edges only
- D-012: behaviour retrace cites Atlas source fields, not invented events
- `MISSION.md`: purpose is not to invent structure

**Does not claim**

That translations are always current (lag is explicit — D-013).

---

## Principle 2 — Movement is observed as retraceable relation events

**Statement**

Participant movement through the Field is translated into **structural events** keyed to declared relations (`holds`, `traces`, `carries`, `pairs`, `nests`). Valid movement leaves retraceable record; movement without declared relation is marked `unexpected_ratio` — not silently bonded.

**Evidence**

- `RELATION_EVENT_RUNTIME_CONTRACT`, `STRUCTURAL_EVENT_TYPES`
- `recordFieldMovement`, `traversalMap`, D-012 traces
- Atlas **Trace** / **Carry** as backward and forward availability of held connection
- Structural Reading: movement reveals place; hold before movement (D-010 operations)
- Constitution: accepted decisions independently retraceable

**Does not claim**

That all trace persists forever (runtime emphasis decays; observation is local).

---

## Principle 3 — Ratio reads carrier participation from structure

**Statement**

**Ratio** at runtime is relation made readable through **carrier in-degree**: how many other entries' `holds` or `traces` reference this term. That scalar drives ratio mode, structural mass, and relation rendering — across all relation types after D-010B.

**Evidence**

- `field-maturity.mjs` `structureCarriesEntry`
- Atlas **Ratio**: relation readable between distinguishable terms under clearance
- `RATIO_CONTRACT`, `READING_ORDER` step 3
- D-010B, D-011 O-2, D-012 compression trace
- D-015A Field bridge characterisation (`docs/runtime/DERIVED_RATIO.md`)

**Does not claim**

That render compression **is** recognition (it is readability under budget — see D-014 rejection of Law 003).

---

## Principle 4 — Order and reference frame constrain visibility, not validity

**Statement**

**Order** (`entry_order`, spine sequence) and participant reference frames determine **what is visible and emphasised** in observation. They do not validate or mutate Atlas structure at runtime. The retired `practice.*-read` product IDs are not canonical Atlas identities.

**Evidence**

- generated order values, `orderBias`, and `coupledSensibility`
- D-011 O-5, O-7
- Atlas order as dependency band; Constitution authority order (governance, not runtime gate)
- Structural Reading: frame before ratio read (`READING_ORDER`)

**Does not claim**

That order is a runtime permission system for Atlas edits.

---

## Working convergence (single recursive read)

The four principles above are one recursive mechanic at different grains:

> **Invariant relation is translated into readable observation under participant movement.**

| Grain | Principle |
|---|---|
| Source | Structure invariant (P1) |
| Movement | Retraceable events (P2) |
| Density | Ratio from carriers (P3) |
| Scope | Frame and order (P4) |

Future implementation should extend **translation of the same relation vocabulary**, not introduce independent behaviours (`RELATION_EVENT_RUNTIME_CONTRACT.bespokeRule`).

---

## Explicitly not principles (D-014 outcomes)

| Rejected hypothesis | Why excluded |
|---|---|
| Stable participation condenses into new participants | Runtime condensation is observational focus + render mass, not Atlas term creation |
| Compression is recognition | Compression is render budget + structural mass (D-011 artefact classification) |
| Compute follows participation | Render economy; implementations replaceable (Constitution) |
| Ark as live runtime law | Ark public surface retired; Ark Run is practice prose, not Field path |

| Remains unknown | Why |
|---|---|
| Participation changes state before identity | Suggested by Carry/Carrying split; "participation" not formalised as single Atlas primitive |
| Carry preserved through transformation (full Ark read) | Atlas-supported; live runtime only partial via holds/traces mass |

---

## Confidence summary

| Principle | Confidence |
|---|---|
| P1 Structure invariant; runtime translates | **High** |
| P2 Movement → retraceable relation events | **High** |
| P3 Ratio from carrier structure | **High** |
| P4 Order/frame → visibility | **Medium–high** |
| Single recursive convergence | **Medium** (interpretive synthesis, not single Atlas term) |

---

**Status:** Surviving principles only. Hypotheses not promoted.
