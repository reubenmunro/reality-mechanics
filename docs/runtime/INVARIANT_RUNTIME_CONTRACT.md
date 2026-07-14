# Invariant Runtime Contract

**Runtime design document.** Commission P-003 — architecture and documentation only.  
**Governing evidence:** P-001 (`docs/reports/P-001-physics-language-investigation.md`), P-002 (`docs/reports/P-002-invariant-hierarchy.md`).  
**Status:** Descriptive contract. Not constitutional law. Not Atlas content. Not promoted theory.

**Purpose:** Prevent Observatory, MCP, Calculus, and future runtime work from confusing **invariant substrate** with **participant overlay** or **rendered appearance**.

**Related:** `docs/runtime/READ_ENGINE.md` (O-006 module pattern); the canonical Common Term Structure entry and generated Canonical Graph schema; `docs/practice/RUNTIME_PRINCIPLES.md`; `docs/runtime/DERIVED_RATIO.md`; and the P-003 through P-013, D-012, D-014, D-015B, O-005, and O-006 evidence reports. This document is maintained runtime guidance, not structural authority.

---

## 1. Contract principle

```text
Structure is canonical. Runtime translates. Observation reveals; it does not redefine.
```

Every surface — Observatory, MCP, Calibration, D1, public Calculus — must be able to answer:

1. **Which layer** does this claim belong to?
2. **What survives retrace** if structure is unchanged?
3. **What is overlay or appearance** and therefore not invariant?

If a behaviour cannot be cited to a layer, it is **unresolved** — not bonded silently.

---

## 2. Layer stack (dependency order)

Smallest evidence-backed order (P-002 §2.2):

```text
L0  atlasSource / structure invariant
L1  declared relation facts
L2  scalar ratio register
L3  parallel structure reads
L4  deterministic behaviour
    ── cross-cut: frame / visibility operator (P4)
L5  runtimeOverlay
L6  appearance
```

**Read** does not form a single layer. Structural `conditions.reads` lives in **L0**. Participant recognition (Atlas term Read, frame-dependent ratio read) lives in **practice/MCP** — not in this runtime stack.

**Observation** is not a layer. It is the **composite act** of engaging L0–L6; only L0–L4 are invariant under observation transform (P-002 §3.4).

---

## 3. Layer definitions

### L0 — atlasSource / structure invariant

| | |
|---|---|
| **What it is** | Canonical Atlas structure: GitHub markdown + frontmatter; generated D1 `entries` row; MCP `get_entry.structure`. |
| **Primary fields** | `id`, `title`, `entry_order`, `structure.{holds,traces,carries,pairs,nests,needs}`, `conditions.places`, `conditions.reads`, prose body. |
| **Survives retrace** | **Yes** — same source → same structure (modulo explicit lag). |
| **Survives observation** | **Yes** — pan, zoom, focus, frame do not edit structure. |
| **Survives transformation** | **Yes** until steward edits GitHub source or D1 rebuild changes record. |

**May claim**

- "This edge is declared in Atlas structure."
- "This term's `conditions.reads` states …"
- "Structure is invariant; runtime must not silently create it." (`invariantRule`)

**May not claim**

- That structure **equals** what is visible on canvas (compression hides edges).
- That prose overrides structure when they disagree.
- That D1 is editable source (`sourceRule`: GitHub is canonical).

**API / modules:** canonical Atlas source; generated D1 `entries`; MCP `get_entry`, `get_related`, `open_source_for_entry`; generated Canonical Graph schema.

---

### L1 — declared relation facts

| | |
|---|---|
| **What it is** | Subset of L0: explicit relation edges and dependency `needs`. Coupling exists **only** where declared (D-011 O-4). |
| **Primary fields** | `structure.holds`, `traces`, `carries`, `pairs`, `nests`; `needs`; per-term `relations` in `/api/field/states`. |
| **Survives retrace** | **Yes**. |
| **Survives observation** | **Yes** — edge existence unchanged by navigation. |
| **Survives transformation** | **Yes** until structure edit. |

**May claim**

- "Coupling is visible only on declared edges."
- "Movement without declared edge is `unexpected_ratio`." (P2)
- Out-degree / in-degree **counts** as structure facts.

**May not claim**

- Proximity, force overlap, or layout coincidence creates relation.
- Undeclared edges for visual continuity.
- That all relation types contribute equally to scalar mass (holds/traces in-degree only for L2).

**API / modules:** `deriveFieldStatesPayload` → `relations`; `field-behaviour-trace.mjs` `edgeLists`; `recordFieldMovement` relation keys.

---

### L2 — scalar ratio register

| | |
|---|---|
| **What it is** | Retrace-stable scalars derived from L0/L1: carrier in-degree → mode band → client expansion. **Not** Atlas Ratio prose (`RATIO_CONTRACT`). |
| **Primary outputs** | `mass.carriers`; `ratioMode.mode`, `ratioMode.x`; client `transition`, `continuous`, `compression`, `structuralMass`. |
| **Survives retrace** | **Yes** — deterministic from structure + thresholds + timestamped maturity reads. |
| **Survives observation** | **Yes** — unchanged by pan, zoom, focus, frame. |
| **Survives transformation** | **Partial** — threshold config can change mode without structure edit (calibrated, not invariant). |

**May claim**

- Exact carrier rule: holds/traces in-degree only (D-010B locked).
- `structuralMassForState` / `ratioModeForState` are pure functions of L2 inputs.
- Physics **expression** of these scalars (density, effective mass) as **rendering language** (P-001).

**May not claim**

- Derived Ratio ≡ Atlas Ratio (D-015B).
- `needs`, carries out-degree, pairs, nests increment `mass.carriers`.
- Threshold bands (3 / 8) are derived constants (they are **calibrated**).
- Compression **is** recognition (D-014 Law 003 rejected).

**API / modules:** `deriveFieldStatesPayload`; `field-maturity.mjs` `structureCarriesEntry`, `countCarriers`; `field-behaviour-trace.mjs` `ratioModeForState`, `structuralMassForState`; client `computeProfile` expansion.

---

### L3 — parallel structure reads

| | |
|---|---|
| **What it is** | Structure-derived reads that affect behaviour but are **not** folded into L2 scalar derivation (D-015B parallel paths). |
| **Primary outputs** | `maturityBand`, `settledness`, `agitation`; `entry_order` / order depth; incoming/outgoing edge counts; relation-type identity; rhythm **mode** per type. |
| **Survives retrace** | **Yes** at fixed timestamp and config. |
| **Survives observation** | **Yes** for stored/API reads; rhythm **phase** is not L3 (see L6). |
| **Survives transformation** | Maturity/agitation change with time and revisions. |

**May claim**

- Edge existence and layout bands read structure directly (D-011 O-4, O-7).
- Maturity/settledness are parallel reads from revisions/proposals.
- Relation-type rhythm **mode** is fixed per `holds`/`traces`/`carries`/`pairs`/`nests`.

**May not claim**

- These reads are inputs to server `fieldRatioMode` today.
- A "rich structural signature" is already derived (D-015B: future unknown).

**API / modules:** `deriveFieldStatesPayload` maturity/settledness/agitation; `field-behaviour-trace.mjs` `RHYTHM_SIGNATURES`; client `ORDER_DEPTHS`, `orderBias`, `structuralRingRadius`.

---

### L4 — deterministic behaviour

| | |
|---|---|
| **What it is** | Pure functions of L0–L3 (+ calibrated/heuristic constants): compression limits, rhythm modulation weights, condensation thresholds, tension from gradient **given** pressure state. |
| **Examples** | `relationCompressionLimit`; `fieldTensionFromGradient`; behaviour-trace `mechanicalOutput`; D-011 O-1–O-6 classifications. |
| **Survives retrace** | **Yes** — same inputs → same outputs. |
| **Survives observation** | **Yes** for formulas; **visible instance count** may change with focus neighbourhood (overlay context). |
| **Survives transformation** | Recalculated when inputs change. |

**May claim**

- "Given structuralMass M and edge count N, compression limit is …"
- Behaviour trace **meaning** fields describe mechanical consequence of L2/L3.
- Five D-011 behaviours are **candidate** runtime observations (D-012), not promoted ontology.

**May not claim**

- Behaviour creates structure or participants (D-014 Laws 001, 003 rejected).
- Filament motion **is** Atlas carrying — it is ratio-modulated render.
- All Field behaviour is ratio-complete (parallel paths required — D-015B).

**API / modules:** `field-behaviour-trace.mjs` `buildFieldBehaviourTrace`; client `drawCurrent`, `drawOperation`, `relationCompressionLimit`.

---

### Cross-cut — frame / visibility operator (P4)

| | |
|---|---|
| **What it is** | Reference frame membership and order visibility. Modulates **what is seen**, not **what is true**. |
| **Primary mechanisms** | Participant frame input, `coupledSensibility`, `couplingSensibilityTarget`, and `relationSensibility`. No canonical frame identity is currently selected. |
| **Survives retrace** | Frame input is session state. It is not Atlas structure. |
| **Survives observation** | **No** — alpha 1.0 in-frame, 0.08 out (D-011 O-5). |
| **Invariant substrate** | **Unchanged** — L2 scalars unchanged when frame switches. |

**May claim**

- Order and frame constrain visibility, not validity (P4).
- `READING_ORDER`: locate reference frame **before** ratio read.

**May not claim**

- Out-of-frame terms cease to exist structurally.
- Frame switch changes `mass.carriers`.

**API / modules:** `refreshCoupledFrame`; behaviour trace behaviour `reference-frame-dimming`. The former unresolved `practice.*-read` IDs were retired during Canonical Translation.

---

### L5 — runtimeOverlay

| | |
|---|---|
| **What it is** | Participant and session state merged into behaviour trace and mechanics panel. **Not** structure-derived invariant. |
| **Primary fields** | `localCount`, `fieldPressure` (client blend), `endpointOnly`, `referenceFrame` (active), `settled` (animation), `traversalMap`, `fieldMovementEvent`, `relationPressureTraces`, `relationTrajectoryMemory`, `lastTraversalKey`. |
| **Survives retrace** | **No** — not in `/api/field/states`; optional `?runtime=` on behaviour-trace. |
| **Survives observation** | **No** — accumulates, decays, or changes with navigation. |
| **Reveals vs changes** | Reveals L0–L4; does **not** change L2 scalars (P-001 §11.3). |

**May claim**

- "Participant traversed A → B."
- "Neighbourhood pressure raised endpoint-only rendering."
- Wake, traversal emphasis, movement event typing.

**May not claim**

- Overlay state is Atlas structure.
- Repeated traversal changes carrier count.
- `fieldMovementEvent` without retrace citation to declared edge (mark `unexpected_ratio`).

**API / modules:** `collectRuntimeOverlay`; `recordFieldMovement`; `deriveFieldBehaviourTrace(..., runtimeOverlay)`; trace payload `runtimeOverlay` + per-behaviour `runtimeInput`.

---

### L6 — appearance

| | |
|---|---|
| **What it is** | Canvas output: alpha, colour, phase animation, DPR, layout positions, pressure grid **display** lerp, legibility floors, membrane/heuristic flow. |
| **Survives retrace** | **No**. |
| **Survives observation** | **No** — changes with pan, zoom, resize, focus, time, `adaptiveAmbientScale`. |
| **Grounding rule** | Must trace to L4 behaviour + L5 overlay + heuristic constants; label heuristic in docs/reports. |

**May claim**

- "Render compression hides N edges" (budget artefact — O-2).
- Visual uses physics **language** for L2 ratios (P-001).
- Legibility floors are heuristic (D-022).

**May not claim**

- Fewer drawn edges = fewer structural edges.
- `enginePhysics.gravity` is Atlas gravity.
- `pressureField` is Atlas **Pressure** term (C-A001: unresolved).
- Membrane flow streamlines are derived ratios (O-001: heuristic).

**API / modules:** Canvas `draw*`, `buildPressureField`, `buildHomePressureField`, `enginePhysics`, `FIELD_RENDER_BUDGET`, `MECHANICS_AMPLIFICATION`.

---

## 4. Retrace contract (D-012)

Every promoted Field behaviour must declare:

| Field | Layer |
|---|---|
| `atlasSource.fields` / `atlasSourceSummary` | L0–L3 |
| `ratioRelationState` | L2–L4 |
| `runtimeInput` with overlay keys | L5 |
| `mechanicalOutput` | L4–L6 |
| `meaning` | Human translation — not authoritative |

**Retrace API:** `GET /api/field/behaviour-trace?id={term}`  
**States API:** `GET /api/field/states` → L0–L3 per term  
**MCP retrace:** `get_entry` → L0; `get_derivation_status` → Calculus chain (partial stack)

Server-side trace **defaults** `runtimeOverlay` to `{}`. Client **merges** `collectRuntimeOverlay()` before display.

---

## 5. Surface mapping

| Surface | Layers served | Must not conflate |
|---|---|---|
| **GitHub / Atlas** | L0 | — |
| **D1** | L0 generated read model | With editable source |
| **MCP** | L0 read traversal; programme manifest | `get_field_terms` = Atlas **domain** field, not L6 canvas |
| **`/api/field/states`** | L0–L3 | With L6 appearance |
| **`/api/field/behaviour-trace`** | L0–L4 + optional L5 | `atlasSourceSummary` vs `runtimeOverlay` |
| **Observatory canvas** | L4–L6 (+ cross-cut frame) | Invariant substrate vs paint |
| **Public Calculus** | L1–L2 + partial L4 (chain) | Overlay/appearance split absent today |
| **Calibration** | Practice translation (parallel) | Field scalar register |

---

## 6. Naming discipline

| Token | Layer | Warning |
|---|---|---|
| `atlasSource`, `atlasSourceSummary` | L0–L3 | Preferred invariant citation |
| `structure`, `relations.*` | L0–L1 | |
| `mass.carriers`, `ratioMode`, `structuralMass` | L2 | Not Atlas Ratio |
| `maturityBand`, `settledness` | L3 | |
| `runtimeOverlay`, `runtimeInput` | L5 | |
| `enginePhysics`, `pressureField` | L6 (heuristic) | Not physics ontology |
| Atlas term **Pressure** | L0 Atlas prose | Not `pressureField` until derived |
| Atlas term **Read** | L0 field + practice | Not participant read invariant |
| `WORLD_PHYSICS` (contract) | Authoring metaphor | Not runtime derivation |

---

## 7. Constraints for future work

1. **No silent layer collapse** — do not document overlay as structure; do not document appearance as ratio.
2. **No new layer without commission** — e.g. permeability belongs in L2 only after derivation.
3. **Bespoke per-term render** forbidden (`bespokeRule`) — extend translation vocabulary instead.
4. **Four-status vocabulary** preserved as non-canonical Calculus evidence: derived / calibrated / heuristic / unresolved (`calculus-evidence.mjs`).
5. **Physics expression** allowed on L2–L4; **physics ontology** claims forbidden without derivation (P-001).

---

## 8. References

| ID | Document |
|---|---|
| P-001 | `docs/reports/P-001-physics-language-investigation.md` |
| P-002 | `docs/reports/P-002-invariant-hierarchy.md` |
| P-003 | `docs/reports/P-003-invariant-runtime-contract.md` |
| D-012 | `docs/reports/D-012-behaviour-retrace-instrument.md` |
| D-014 | `docs/reports/D-014-runtime-principles-derivation.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| Canonical structure | Atlas Common Term Structure; generated Canonical Graph schema |
| Ratio | `docs/runtime/DERIVED_RATIO.md` |
| Principles | `docs/practice/RUNTIME_PRINCIPLES.md` |

---

**Status:** P-003 contract. Descriptive. Steward decides load-bearing adoption beyond runtime interpretation.
