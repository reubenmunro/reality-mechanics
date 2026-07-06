# P-004 — Ratio Phase Engine Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer implementation, no Atlas/D1 edits, no external physics engine adoption yet)  
**Date:** 2026-07-06 (UTC+12)  
**Governing evidence:** P-001, P-002, P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`)  
**Core hypothesis (tested):** When effects reach a different ratio reference frame, and enough relations couple and nest, behaviour changes.

---

## Verdict

| Question | Result |
|---|---|
| Does RM need a generic game/physics engine? | **No** — structural misfit with L1 edge-only coupling and P-003 contract |
| Does phase-like behaviour already exist? | **Yes — partial** — `ratioMode` bands, `ratioVisualScale`, maturity, frame visibility, nest/carry rhythms |
| Is ember → fire → lava a valid RM phase model? | **No as primary ontology** — D-017B rejected; usable only as **L6 gloss** on L2/L4 registers |
| What engine is needed? | **Custom RM field engine** — scalar lattice + declared-topology currents + **phase register**; extend current Canvas medium |
| Smallest architecture | **Phase Register (L2/L3) → Field Medium (L4) → Visibility (cross-cut) → Appearance (L6)** on existing graph substrate |

---

## 1. Diagnosis — current Observatory mechanics

### 1.1 Substrate (unchanged, load-bearing)

| Mechanic | Layer | Evidence |
|---|---|---|
| Declared edges only | L1 | D-011 O-4; `unexpected_ratio` |
| Focus neighbourhood BFS | L1 | `localIdsFromIndex`, `initOperations` |
| Layout rings by relation role | L3/L4 | `structuralRingRadius`, O-7 |
| Home deterministic placement | L3/L4 | `buildHomeAngles`, D-023 |
| Behaviour trace / retrace | L0–L4 | D-012 |

**No rigid bodies, no collision graph, no particles as ontology** (D-017B).

### 1.2 Ratio and “phase-adjacent” registers (already live)

| Register | Values | Layer | Retrace-stable? |
|---|---|---|---|
| `mass.carriers` | integer in-degree | L2 | **Yes** |
| `ratioMode.mode` | discrete / transitional / continuous | L2 | **Yes** (given thresholds) |
| `transition`, `continuous`, `compression` | client scalars | L2 | **Yes** |
| `structuralMass` | composite | L2 | **Yes** |
| `maturityBand` | placed → mature | L3 | **Yes** at timestamp |
| `settledness`, `agitation` | scores | L3 | **Yes** at timestamp |
| Profile scalars | `heat`, `ash`, `wither`, `turbulence`, `resolution`, `density` | L4 (from L3) | Deterministic from state |
| `ratioVisualScale` | strand/wiggle/halo/tightness | L4 | Deterministic from L2 |

**Thresholds today (configured):**

| Threshold | Default | Layer | Status |
|---|---|---:|---|
| `transitional_min_mass` | 3 | L2 | **Calibrated** (`garden_config`) |
| `continuous_min_mass` | 8 | L2 | **Calibrated** |
| `maturity_bands` | JSON config | L3 | **Calibrated** |
| `HOME_PRESSURE_GRID.condenseThreshold` | 0.24 | L4/L6 | **Heuristic** (O-001) |
| `endpointOnly` fieldPressure | 0.38 | L4/L5 blend | **Heuristic** |
| `relationCompressionLimit` | mass function | L4 | **Derived** |

### 1.3 Field medium (partial, dual)

| Mechanic | Layer | Notes |
|---|---|---|
| `buildPressureField` (world) | L4/L6 | Gaussian deposition from mass; gradient bend |
| `buildHomePressureField` (screen) | L4/L6 | O-001; not unified with world grid |
| `relationPressureTraces` | L5/L6 | Decaying deposit along paths |
| `pressureGradientAt` / `fieldBend` | L4 | Deterministic given grid state |
| `drawHomeMembrane` / flow lines | L6 | Flow lines **heuristic** (O-001) |

### 1.4 Relation rhythms (type = mode, not material phase)

| Type | Rhythm mode | L4 expression | Nest/couple role |
|---|---|---|---|
| holds | anchor | sustained midpoint | tension |
| traces | return | wiggle, pressure memory | path memory |
| carries | travel | forward bead, bow | propagation |
| pairs | answer | lateral oscillation | coupling oscillation |
| nests | circulate | containment bow | enclosure (10 edges Atlas-wide) |

### 1.5 Reference-frame and coupling (hypothesis test)

| Mechanic | On frame change | Layer |
|---|---|---|
| `setCurrentFieldReferenceFrame` | `frameTransitionPulse = 1` | cross-cut + L5 |
| `coupledSensibility` lerp | in-frame 1.0 / out 0.04 | cross-cut |
| `ratioVisualScale` | **unchanged** — driven by source term `ratioMode`, not frame | L2/L4 |
| `mass.carriers` | **unchanged** | L2 |
| Visible neighbourhood | subset changes | cross-cut |
| `collectRuntimeOverlay` `referenceFrame` | session state | L5 |

**Hypothesis result:**

| Clause | Verdict |
|---|---|
| Reference-frame change alters behaviour | **Supported** for **visibility, coupling alpha, transition pulse** (D-020B) |
| Reference-frame change alters ratio register | **Falsified** — L2 scalars unchanged (P-003, P4) |
| Enough relations couple and nest → behaviour change | **Partial** — coupling requires **declared edges**; nesting **sparse** (10 nest edges); compression changes **drawn** behaviour not structure |
| Thermodynamic phase ladder (ember/fire/lava; water/ice/steam) | **Not evidenced** in runtime — metaphor only at L6 (`FIRE_ORDERS`, D-017B) |

### 1.6 Condensation, wake, amplification

| Mechanic | Layer | Phase-like? |
|---|---|---|
| Focus / mass condensation | L4 → L6 | **Threshold** on `structuralMass` — yes |
| `compressedRelationField` halo | L4/L6 | ratio compression phase |
| Movement wake | L5/L6 | traversal overlay — not invariant |
| `MECHANICS_AMPLIFICATION` | L6 coefficients | heuristic appearance boost |
| `enginePhysics` | L6 naming | not a phase engine |

---

## 2. Phase / reference-frame model (L0–L6)

### 2.1 Terminology discipline (P-003)

| Term in commission | RM runtime meaning | Layer |
|---|---|---|
| **Phase register** | `ratioMode` band + client `transition`/`continuous` + optional maturity band | **L2–L3** |
| **Reference frame** | `practice.ratio-read`, etc. — visibility membership | **cross-cut** |
| **Phase transition (invariant)** | Carrier count crosses 3 or 8; maturity band step | **L2/L3** (calibrated / time) |
| **Phase transition (appearance)** | `ratioVisualScale` profile switch; fire palette | **L4/L6** |
| **Material phase (water/ice/steam)** | **Unresolved** — no ratio in repo | **Not assigned** |
| **Ember / fire / lava** | Optional L6 gloss on order hue + profile heat | **L6 only** (D-017B) |

### 2.2 Layer assignment for “phase”

```text
L0  Structure — no phase (topology is fact, not state register)
L1  Declared edges — enable coupling channels; not phase
L2  ratioMode {discrete, transitional, continuous} + scalars     ← primary phase REGISTER
L3  maturityBand, settledness, agitation, order depth            ← slow parallel phase READS
L4  ratioVisualScale, relation rhythms, compression, field bend  ← phase BEHAVIOUR resolver
    cross-cut  frame membership → visibility + sensibility        ← observation-phase (not mass phase)
L5  traversal, wake, frameTransitionPulse, overlay pressure blend
L6  membrane paint, fire palette, amplification, animation phase
```

**Negative finding:** A single “phase” variable does not exist today. Phase is **distributed** across L2 band, L3 maturity, L4 visual resolver, and cross-cut frame — correctly per P-002.

### 2.3 Reference-frame vs ratio-frame (critical distinction)

| | Ratio reference frame (Atlas) | Runtime structural frame |
|---|---|---|
| **Source** | `READING_ORDER`, `read_ratio` MCP | `STRUCTURAL_FIELD_FRAMES` |
| **Affects** | Practice read under clearance | Term visibility set |
| **Changes L2?** | **No** | **No** |
| **Changes behaviour?** | **Yes** — what is seen and emphasised | **Yes** — alpha, compression context |
| **Contract layer** | Practice (outside L0–L6 stack) | cross-cut + L5 |

Runtime must **not** conflate MCP `reference_frame` parameter with `ratioMode.mode`.

---

## 3. Ratio → phase behaviour table

Status: **derived** / **calibrated** / **heuristic** / **unresolved** / **appearance-only**

| Ratio / read | Phase-like behaviour | Layer | Status | Retrace cite |
|---|---|---|---|---|
| `mass.carriers` 0–2 | discrete phase: loose filaments, many strands | L2→L4→L6 | derived + heuristic amp | `mass.carriers` |
| `mass.carriers` 3–7 | transitional phase: blended strand/halo | L2→L4→L6 | calibrated thresholds | `ratioMode.mode` |
| `mass.carriers` ≥ 8 | continuous phase: tight lines, compression halo | L2→L4→L6 | calibrated | `ratioMode.mode` |
| `transition` scalar | intra-band blend (transitional) | L2→L4 | derived | `ratioModeForState` |
| `continuous` scalar | continuous modulation depth | L2→L4 | derived | `ratioModeForState` |
| `structuralMass` high | condensation, endpoint-only, pulse damped | L2→L4→L6 | derived | D-012 O-1, O-3 |
| `maturityBand` ↑ | settledness ↑, agitation weight ↓ | L3→L4 | derived | `field-maturity.mjs` |
| `settledness` high | resolution ↑, turbulence ↓ in profile | L3→L4 | derived | `computeProfile` |
| Frame active, out-of-frame | visibility phase “dim” | cross-cut | calibrated (0.08 alpha) | D-011 O-5 |
| Frame switch | transition pulse, sensibility lerp | L5/L6 | heuristic | D-020B |
| `pairs` + high reciprocity | oscillatory phase | L4 | heuristic rhythm | relation type |
| `nests` + circulation | enclosure phase | L4 | heuristic; sparse data | relation type |
| `carries` + high continuous | forward-travel phase | L4 | derived ratio mod + heuristic bead | D-010B |
| `traces` | return-memory phase | L4 | heuristic wiggle/trace decay | D-010B |
| Pressure grid local peak | membrane deformation read | L4/L6 | heuristic lattice | O-001 |
| `FIRE_ORDERS` hue | ember/fire/lava **appearance** | L6 | appearance-only | D-017B |
| Availability / permeability | entry phase (solid/liquid/gas analog) | — | **unresolved** | — |
| Atlas Pressure | load-bearing phase | — | **unresolved** | C-A001 |
| Cross-term nest density | collective phase change | — | **unresolved** | no scalar |

---

## 4. Missing thresholds and registers

| Needed for hypothesis | Present? | Gap |
|---|---|---|
| Ratio band thresholds (3/8) | **Yes** | — |
| Client expansion curves | **Yes** | — |
| Maturity band thresholds | **Yes** (config) | — |
| Nest / coupling **density** threshold | **No** | Cannot trigger “collective phase” from nest count alone |
| Availability → permeability | **No** | Blocks water/ice/steam **invariant** analogy |
| Frame-specific ratio read scalar | **No** | Frame correctly affects visibility only |
| `membraneEdge` | **No** | Planned exclusion in `deriveFieldStatesPayload` |
| Material state machine | **No** | Would invent theory if added without Atlas derivation |
| Energy/conservation invariant | **No** | P-001 negative result — intentional |

---

## 5. Engine comparison (structural fit, not popularity)

Scoring: **Fit** / **Partial** / **Poor** against P-003 contract and RM graph substrate.

| Approach | Fit | Why |
|---|---|---|
| **Custom RM field engine** (scalar grid + graph currents + phase register) | **Fit** | Respects L1 edge-only coupling; extends `buildPressureField`, `ratioVisualScale`; retraceable |
| **Current Canvas engine extended** | **Fit** | Already 80% of needed L4/L6; no new dependency; Worker-safe |
| **Lightweight grid / shader solver** (cellular automata / blur on mass grid) | **Partial** | Good for L6 membrane; must not create L1 edges; GPU optional |
| **Membrane solver** (mass-spring sheet) | **Partial** | Visual L6 only unless anchored to L2 deposition; risk of fake physics |
| **Particle system** | **Poor** | Implies proximity coupling; falsified as substrate (D-017B) |
| **Matter.js** | **Poor** | Rigid bodies, collision, gravity world — invents coupling |
| **Planck.js / Box2D** | **Poor** | 2D rigid dynamics; contradicts explicit-edge model |
| **Rapier** | **Poor** | 3D/2D physics; WASM weight; same coupling violation |
| **nape-js** | **Poor** | Soft-body; proximity fields; not graph-declared |
| **No external engine** | **Fit** (default) | Correct for L0–L4; external only for optional L6 GPU later |

**No physics library in repository** (`package.json` scan) — clean slate; Canvas 2D only today.

---

## 6. Recommendation — smallest RM field engine architecture

### 6.1 Name and scope

**RM Field Engine (RMFE)** — not a physics engine. A **phase-aware field medium** over **declared topology**.

```text
Inputs (L0–L3, immutable per observation)
        ↓
┌───────────────────────┐
│ Phase Register (L2/L3) │  ratioMode band + transition/continuous + maturity/settledness
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Field Medium (L4)      │  unified scalar lattice; edge currents; gradient resolver
│  - topology: L1 edges  │
│  - no invented coupling│
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Behaviour Resolver (L4)│  ratioVisualScale, rhythms, compression, condensation rules
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Visibility Operator    │  frame membership, sensibility (cross-cut)
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Overlay Recorder (L5)  │  traversal, wake — optional, labelled
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Appearance Mapper (L6) │  Canvas (now); optional WebGL membrane pass later
└───────────────────────┘
```

### 6.2 What RMFE must express (acceptance mapping)

| Requirement | RMFE component |
|---|---|
| Invariant ratios | Phase Register reads L2 only; never mutated by L5/L6 |
| Coupling | L1 edge list → current paths only |
| Nesting | L4 `nest` rhythm + containment; no scene graph |
| Reference-frame change | Visibility Operator; **does not** rewrite Phase Register |
| Phase transition | L2 threshold crossing + L4 `ratioVisualScale` step/blend |
| Field deformation | L4 lattice deposit from `structuralMass`; gradient bend |
| Condensation | L4 threshold → L6 `fillCondensation` |
| Appearance follows behaviour | L6 reads resolver output only; amplification coefficients labelled heuristic |

### 6.3 What RMFE must not do

- Rigid-body dynamics, collision, or proximity bonds (violates L1, O-4)
- Rename L6 palette as phase ontology (D-017B)
- Treat `enginePhysics` keys as invariant fields
- Simulate water/ice/steam without availability/permeability ratio (unresolved)
- Replace graph substrate with particles or fluid cells that imply undeclared relation

### 6.4 Ember / fire / lava and water / ice / steam

| Metaphor | Allowed use | Forbidden use |
|---|---|---|
| ember → fire → lava | L6 colour / glow mapping from **order + structuralMass band** | Claiming material phase change in L0–L3 |
| water → ice / liquid / steam | **Unresolved** until availability permeability exists | Canvas fluid sim as structure |

**If pursued later:** map **discrete / transitional / continuous** to **appearance gloss** (e.g. ember glow → dense filament → compression halo), not to Atlas material ontology.

---

## 7. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Layer collapse — fluid sim pretends to be structure | **High** | P-003 contract; no L1 edges from simulation |
| Adopting Box2D/Matter “for speed” | **High** | Reject; document in RMFE spec |
| Ember promoted as phase ontology | **Medium** | D-017B gate; L6 gloss only |
| Dual pressure grids (home/world) drift | **Medium** | O-002 unification in roadmap |
| Threshold tuning mistaken for derivation | **Medium** | Four-status vocabulary on Calculus |
| Nest/couple collective phase faked with visuals | **Medium** | Mark unresolved until nest-density scalar derived |
| WebGL path bypasses retrace | **Medium** | GPU renders L6 only; logic stays L4 CPU |

---

## 8. Implementation roadmap (architecture only — not this commission)

| Phase | Commission | Deliverable | Layer touch |
|---|---|---|---|
| **0** | P-003 ✅ | `INVARIANT_RUNTIME_CONTRACT.md` | docs |
| **1** | P-004 ✅ | This report + `RM_FIELD_ENGINE.md` spec (optional follow-up) | docs |
| **2** | O-002 | Unify world/home pressure fabric | L4/L6 |
| **3** | P-005 | Availability permeability derivation or negative result | L2? |
| **4** | P-006 | Extract `phaseRegister.mjs` + `fieldMedium.mjs` from worker (pure functions) | L2–L4 refactor |
| **5** | P-007 | Calculus layer labels + phase register on `/calculus` | docs/manifest |
| **6** | O-003 | Frame transition as documented visibility event only | cross-cut |
| **7** | Optional | WebGL membrane pass reading same L4 grid | L6 only |

**Do not import** Matter.js, Planck, Rapier, or nape-js in phases 0–6.

### 8.1 Smallest first code commission (when authorised)

Extract **without behaviour change**:

1. `phaseRegisterFromState(state, thresholds)` — wraps `ratioModeForState` + maturity  
2. `fieldMediumStep(grid, operations, dt)` — wraps `buildPressureField` + decay  
3. `behaviourFromPhase(phaseRegister, relationType, edge)` — wraps `ratioVisualScale` + rhythm constants  

Worker remains orchestrator; RMFE modules are **testable and retraceable**.

---

## 9. Relationship to governing reports

| Report | P-004 use |
|---|---|
| P-001 | Physics vocabulary on L4/L6 only; no material ontology |
| P-002 | Phase distributed across L2–L4 + cross-cut; not Observation invariant |
| P-003 | RMFE layer boundaries; overlay/appearance rules |
| D-017B | Rejects ember-primary; supports profile-state phase register |
| D-020B | Frame transition + ratio visual profiles = existing phase behaviour |
| D-015B | Scalar register narrow; parallel L3 reads required |

---

## 10. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001/P-002/P-003 | **Met** |
| Diagnosis of current mechanics | **Met** — §1 |
| Phase model L0–L6 | **Met** — §2 |
| Ratio → phase table | **Met** — §3 |
| Engine comparison | **Met** — §5 |
| Recommendation | **Met** — §6 Custom RMFE, extend Canvas |
| Risks + roadmap | **Met** — §7–8 |
| No renderer / Atlas / D1 changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-001 | `docs/reports/P-001-physics-language-investigation.md` |
| P-002 | `docs/reports/P-002-invariant-hierarchy.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| P-003 report | `docs/reports/P-003-invariant-runtime-contract.md` |
| D-017B | `docs/reports/D-017B-ember-runtime-falsification.md` |
| D-020B | `docs/reports/D-020B-mechanics-amplification.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| O-001 | `docs/reports/O-001-observatory-field-renderer-architecture.md` |
| Code | `.atlas-publisher/mechanics-amplification.mjs`, `main-website-worker.js`, `field-behaviour-trace.mjs` |

---

**Status:** P-004 complete. Recommend **custom RM Field Engine** extending current Canvas lattice — **no external physics engine**.
