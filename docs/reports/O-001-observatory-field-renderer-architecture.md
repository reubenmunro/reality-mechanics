# O-001 — Observatory Field Renderer Architecture

**Programme:** Observatory  
**Type:** Architecture commission (field instrument, not visual polish)  
**Date:** 2026-07-06 (UTC+12)  
**Governing principle:** The field comes first. Physics is the rendering language for ratios already carried by the Atlas — not a claim that Reality Mechanics is physics.

---

## Executive summary

O-001 re-architected the **neutral whole-field (home) renderer** from graph-first (nodes, labels, edge strokes) toward field-first (membrane, gradient currents, mass condensation). Focused observation mode is unchanged in this pass; the smallest coherent shift targets first-load behaviour where visitors previously saw a network diagram before selecting anything.

| Deliverable | Outcome |
|---|---|
| Renderer diagnosis | **Done** — §1 |
| Field-rendering model | **Done** — §2 |
| Smallest coherent MVP | **Done** — home membrane + pressure currents + condensation |
| Tests | **135 passing** — 75 + 18 + 42 |
| Report | This document |

**Acceptance (partial):** On first load the visitor now sees a continuous pressure membrane before term selection. Relations curve through derived home pressure. Terms condense at mass peaks; labels appear on hover only. Focused mode still uses world-space layout bands — remains graph-adjacent (§4).

---

## 1. Renderer diagnosis

### 1.1 What behaved like graph rendering (before O-001)

| Behaviour | Location | Graph character |
|---|---|---|
| `drawHomeNode()` | Radial gradient circles at fixed `homePosition()` | Terms as primary dots |
| `drawHomeField()` edge loop | Quadratic strokes between node positions | Relations as lines between dots |
| `homeLabelIds.forEach` | 4 labels per order on first paint | Language placed, not discovered |
| Landing copy | "Every point is an Atlas term; every strand a declared relation" | Network-diagram framing |
| `homeConnections` bow-only curvature | Hash jitter + relation-type bow, no pressure | Decorative path, not medium traversal |
| Focused mode `operations` layout | D-023 bearing placement in world space | Retained — not in O-001 scope |

### 1.2 Existing ratios and machinery available

| Ratio / read | Source | Home MVP use |
|---|---|---|
| `structuralMass` / `mass.carriers` | `deriveFieldStatesPayload`, `structuralMassForState` | Membrane deformation strength; condensation eligibility |
| `ratioMode` (discrete / transitional / continuous) | Field states API | Focused `drawCurrent` only (unchanged) |
| `profile.density` | Client `computeProfile` | Membrane cell strength; condensation radius |
| `relationTypes[].strength`, `bowMult`, `color` | Renderer constants | Current stroke weight and colour |
| `relationSensibility` | Traversal memory | Current alpha modulation |
| `fieldTensionFromGradient` | Shared helper | Condensation irregularity; current tension |
| `fillCondensation` / `condensationPath` | Focus renderer | Home term emergence shape |
| `pressureGradientAt` / `buildPressureField` | World-space focused field | Pattern reused for screen-space home grid |
| `homePosition` / `buildHomeAngles` | D-023 declared-structure placement | Mass source positions (layout band, not visual primary) |
| `homeConnections` | Declared holds/traces/carries/pairs/nests | Current paths + relation-midpoint pressure |

### 1.3 What remains missing (unresolved)

| Desired behaviour | Gap |
|---|---|
| True membrane elasticity / permeability from availability | No `availability` or permeability ratio in runtime |
| `membraneEdge` | Listed in `deriveFieldStatesPayload` exclusions — planned, not implemented |
| World-space home field unified with focused `pressureField` | Home uses screen grid; focus uses world grid — two fabrics |
| Relation paths as multi-segment trajectories through pressure | Home still uses single quadratic Bezier (pressure-biased, not integrated path) |
| Nest enclosure geometry from ratio | Nest `containment` logic exists in `drawCurrent` only |
| Basin / wake reads on neutral field | `basinTypes` used in focused draw only |

---

## 2. Proposed field-rendering model (implemented MVP)

Physics vocabulary maps to **existing ratios only**. Status per mapping:

| Ratio / read | Visual behaviour (home) | Status |
|---|---|---|
| `structuralMass` | Deforms membrane; gates condensation | **Derived** (D-010B mass rule) |
| `profile.density` | Modulates membrane cell strength and condensation size | **Derived** (client profile) |
| Relation midpoint + `relationTypes.strength` | Adds tension lumps along declared edges | **Heuristic** (midpoint weight table — not in DERIVED_RATIO.md) |
| `homePressureGradientAt` | Bends relation currents (`fieldBend` pattern from `drawCurrent`) | **Calibrated** (reuses focused gradient math on home grid) |
| `fieldTensionFromGradient` | Condensation irregularity and current alpha | **Calibrated** |
| `fillCondensation` at mass peaks | Readable term emerges where field stabilises | **Derived** (mass threshold 0.24) |
| `homeLabelIds` | Eligibility for condensation, not auto-label | **Heuristic** (entry-point list retained for low-mass anchors) |
| Hover probe | Term label on interaction only | **Heuristic** (D-023 probe pattern) |
| `drawHomeMembraneFlow` | Sparse gradient streamlines on membrane | **Heuristic** — not ratio-documented |
| `homePosition` layout | Hidden scaffold for mass deposition | **Derived** (D-023 structure placement) |

---

## 3. Implementation — smallest coherent MVP

### 3.1 Render order (home)

```text
buildHomePressureField()  →  drawHomeMembrane()  →  drawHomeRelationCurrent()  →  drawHomeCondensation()  →  hover label
```

The membrane paints first. Terms are not drawn as uniform nodes; they condense after the fabric and currents are visible.

### 3.2 New functions

| Function | Role |
|---|---|
| `HOME_PRESSURE_GRID` | Screen-space 36×24 pressure lattice |
| `buildHomePressureField()` | Gaussian accumulation from `structuralMass` at `homePosition()` + relation midpoints |
| `homePressureAt` / `homePressureGradientAt` | Bilinear sample + gradient |
| `drawHomeMembrane()` | Continuous fabric from pressure cells |
| `drawHomeMembraneFlow()` | Sparse streamlines (**heuristic**) |
| `drawHomeRelationCurrent()` | Pressure-biased quadratic currents |
| `drawHomeCondensation()` | Mass-gated condensation blobs |

### 3.3 Removed / replaced

| Removed | Replaced by |
|---|---|
| `drawHomeNode()` | `drawHomeCondensation()` (mass-gated) |
| Per-order canvas labels on load | Hover-only `drawTermLabel` |
| Graph landing copy | Field-first orientation copy |

### 3.4 Unchanged (by design)

- Five public surfaces and API contracts
- Term sheet, retraceability, accessibility hooks
- Focused observation (`drawCurrent`, `drawOperation`, world `pressureField`)
- Atlas terms, D1, Theory/Proof/Calculus content
- `homePosition` / `homeConnections` data model (scaffold under field layer)

---

## 4. What became more field-like vs what remains graph-like

### More field-like

- First paint shows a **continuous membrane** before term selection
- Relations read as **currents through a medium** (gradient-biased curves, relation-type colour)
- Terms **emerge** at mass peaks rather than uniform node budget
- Labels deferred to **hover probe**
- Landing language describes field read, not points and strands

### Still graph-like

- **Focused mode** still places terms in bearing layout with endpoint condensation
- Home **currents** still connect declared endpoints (quadratic, not pressure-integrated path)
- **`homePosition`** remains a deterministic radial scaffold (hidden but present)
- **Order legend** and **relation legend** are still panel/label chrome
- **Term sheet** unchanged — correct for retraceability

---

## 5. Files changed

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | Home pressure grid, membrane, currents, condensation; landing copy; removed `drawHomeNode` |
| `.atlas-publisher/test/field-states.test.mjs` | O-001 assertions; D-021.4/D-023 landing test updates |
| `docs/practice/COMMISSIONS.md` | O-001 register entry |
| `docs/reports/O-001-observatory-field-renderer-architecture.md` | This report |

---

## 6. Ratios used (summary)

**Derived:** `structuralMass`, `mass.carriers`, `profile.density`, declared relation edges, D-023 `homePosition`  
**Calibrated:** `fieldTensionFromGradient`, `relationTypes` visual constants, `relationSensibility`, `fieldBend` transfer from `drawCurrent`  
**Heuristic:** relation midpoint weights, membrane flow streamlines, `homeLabelIds` condensation eligibility, hover-only labels, condensation threshold 0.24  
**Unresolved:** availability/permeability, `membraneEdge`, unified world/home pressure fabric, multi-step pressure trajectories

---

## 7. Test plan (executed)

```text
.atlas-publisher: npm test  → 75 pass
member:            npm test  → 18 pass
reality-mechanics-mcp: npm test → 42 pass
Total: 135 passing
```

New test: `O-001 field-first home renderer: membrane before condensation, labels on hover`

---

## 8. Next recommended commission

**O-002 — Focused field unification**

Extend the home membrane model into focused observation: unify world and screen pressure fabrics, route `drawCurrent` through shared trajectory integration, and expose `membraneEdge` when the runtime payload supports it. De-emphasise endpoint-only ambient nodes in favour of field-stabilised condensation throughout the zoom stack.

Secondary follow-up: **O-003 — Permeability read** — only if an availability or coupling ratio is added to `deriveFieldStatesPayload`; otherwise mark permeability visuals unresolved.

---

## 9. Steward note

This pass optimises for **structural fidelity**, not decorative beauty. The membrane is the higher-order visual fabric that makes existing ratio behaviour sensible; it is not the ontology. Reality Mechanics is not claimed to be physics — physics is the mature language chosen to render ratios the Atlas already carries.
