# P-003 — Invariant Runtime Contract

**Programme:** Research / architecture  
**Type:** Documentation commission (no renderer implementation, no Atlas edits)  
**Date:** 2026-07-06 (UTC+12)  
**Governing evidence:** P-001, P-002  
**Deliverable:** `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`

---

## Executive summary

P-003 formalises the **invariant runtime contract** so Observatory, MCP, and public Calculus work can separate **invariant substrate** from **participant overlay** and **appearance**.

| Deliverable | Outcome |
|---|---|
| Layer contract | **Done** — `INVARIANT_RUNTIME_CONTRACT.md` (L0–L6 + frame cross-cut) |
| API / behaviour mapping | **Done** — §4 below |
| Violations / ambiguous wording | **13 items** — §5 below |
| Smallest follow-up alignment | **Done** — §7 (docs/manifest wording only; no code) |

**Finding:** D-012 already implements the critical split (`atlasSourceSummary` vs `runtimeOverlay`). The gap is **public vocabulary**: Calculus chain, translation surfaces, and scattered physics-named heuristics collapse layers in prose.

---

## 1. Inspection summary

### 1.1 Sources read

| Source | Role |
|---|---|
| P-001, P-002 | Governing hierarchy and ratio-invariant test |
| D-012 | Behaviour trace / `atlasSource` pattern |
| D-014 | Runtime principles; rejected laws |
| D-015B | Scalar vs Atlas Ratio; parallel paths |
| `docs/runtime/DERIVED_RATIO.md` | Scalar pipeline |
| `docs/practice/RUNTIME_PRINCIPLES.md` | P1–P4 |
| `public-surface-manifest.mjs` | `DERIVATION_CHAIN`, surface routes |
| `atlas-structure-contract.mjs` | `invariantRule`, `TRANSLATION_SURFACES`, `WORLD_PHYSICS` |
| `reality-mechanics-mcp/src/index.js` | MCP tools, `read_ratio`, `get_derivation_status` |
| `.atlas-publisher/main-website-worker.js` | `deriveFieldStatesPayload`, `collectRuntimeOverlay`, renderer |
| `.atlas-publisher/field-behaviour-trace.mjs` | `buildFieldBehaviourTrace` |

### 1.2 What already aligns

| Mechanism | Alignment |
|---|---|
| `deriveFieldStatesPayload` | Returns L0–L3 only; explicit `excludes` list |
| `buildFieldBehaviourTrace` | Separates `atlasSource` / `atlasSourceSummary` from `runtimeOverlay` |
| `collectRuntimeOverlay` | Client-only L5; merged at display time |
| `recordFieldMovement` | Marks undeclared movement `unexpected_ratio` (L1 rule) |
| `RELATION_EVENT_RUNTIME_CONTRACT.invariantRule` | L0 rule already constitutional |
| P4 in `RUNTIME_PRINCIPLES.md` | Frame as visibility cross-cut |
| D-014 rejections | Compression ≠ recognition; condensation ≠ creation |

---

## 2. Contract layers (summary)

Full definitions: `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`.

| Layer | ID | Invariant under observation? |
|---|---|---|
| atlasSource / structure | L0 | **Yes** |
| Declared relation facts | L1 | **Yes** |
| Scalar ratio register | L2 | **Yes** (thresholds calibrated) |
| Parallel structure reads | L3 | **Yes** (time-sensitive reads) |
| Deterministic behaviour | L4 | **Yes** (formulas) |
| Frame / visibility | cross-cut | **No** (visibility only) |
| runtimeOverlay | L5 | **No** |
| appearance | L6 | **No** |

---

## 3. API and renderer mapping

### 3.1 Server APIs

| API | Layers | Notes |
|---|---|---|
| `GET /api/field/states` | L0–L3 | `relations`, `mass`, `ratioMode`, `maturityBand`, `settledness`, `agitation`, `place`, `atlasUrl` |
| `GET /api/field/behaviour-trace?id=` | L0–L4 + optional L5 | `atlasSourceSummary` invariant; `runtimeOverlay` optional via `?runtime=` JSON |
| D1 `entries` (sync) | L0 | MCP and Field both consume generated model |

### 3.2 Client modules (Observatory)

| Module / symbol | Primary layer | Notes |
|---|---|---|
| `allOps` + `fieldStatesPayload` | L0–L3 | Bootstrap from states API |
| `computeProfile`, `ratioModeForState`, `structuralMassForState` | L2–L3 | Client expansion |
| `relationCompressionLimit` | L4 | |
| `buildFieldBehaviourTrace` (import) | L0–L4 | Server-side in worker |
| `collectRuntimeOverlay` | L5 | `localCount`, `fieldPressure`, `settled`, `referenceFrame`, … |
| `recordFieldMovement`, `traversalMap` | L5 | |
| `setCurrentFieldReferenceFrame`, `coupledSensibility` | cross-cut | |
| `buildPressureField`, `pressureGradientAt` | L4–L6 | Display field lerps (L6) |
| `buildHomePressureField`, `drawHomeMembrane` | L4–L6 | O-001; heuristic flow = L6 |
| `enginePhysics` | L6 | Heuristic naming |
| `drawCurrent`, `drawOperation`, `drawHomeCondensation` | L6 | |
| `adaptiveAmbientScale`, `FIELD_RENDER_BUDGET` | L6 | Performance |

### 3.3 MCP tools

| Tool | Layers | Notes |
|---|---|---|
| `get_entry`, `get_related` | L0–L1 | Structure-first |
| `read_ratio` | Practice / participant read | Frame parameter — **not** L2 scalar register |
| `get_derivation_status` | Calculus documentation | Partial stack (L1–L2–L4) |
| `get_public_surfaces` | Programme | Routes to states/behaviour-trace |
| `get_structure_contract` | Meta | `TRANSLATION_SURFACES` needs layer gloss (§5) |
| `get_field_terms` | L0 domain filter | **Atlas field** domain — not canvas field layer |

### 3.4 Behaviour trace behaviours (D-012)

| Behaviour id | atlasSource (L0–L3) | Overlay-sensitive (L5/L6) |
|---|---|---|
| `focus-condensation` | mass, ratioMode, relations | `settled`, local neighbourhood |
| `ratio-compression` | mass.carriers, ratioMode | hidden edge counts depend on focus neighbourhood size |
| `peripheral-endpoint-fading` | structuralMass | `fieldPressure`, `endpointOnly` |
| `reference-frame-dimming` | frame membership from structure terms | active frame, alpha |
| `relation-rhythm-signature` | declared edge type | sample selection from visible relations |

### 3.5 Public Calculus (`DERIVATION_CHAIN`)

| Step | Contract layer | Gap |
|---|---|---|
| Declared relation | L1 | OK |
| Structural mass | L2 | OK |
| Ratio mode | L2 (calibrated) | OK |
| Render behaviour | **L4 + L6 collapsed** | Should note overlay/appearance |
| Retrace | L0–L4 verification | OK |

---

## 4. What survives (contract quick reference)

| | Retrace | Observation transform | Structure edit |
|---|---|---|---|
| L0–L3 | Yes | Yes | Recomputed |
| L4 formulas | Yes | Yes | Recomputed |
| Frame visibility | N/A | Changes | N/A |
| L5 overlay | No | No | May reset session |
| L6 appearance | No | No | N/A |

---

## 5. Violations and ambiguous wording

**Not necessarily bugs** — many are **documentation gaps** that invite layer collapse.

| # | Location | Issue | Layer confusion | Severity |
|---|---|---|---|---|
| V1 | `DERIVATION_CHAIN` step "Render behaviour" | Single step covers L4, L5, L6 | Behaviour + overlay + appearance | **High** — Calculus public face |
| V2 | `TRANSLATION_SURFACES.field` | "Visual and pressure translation" | Implies one blob | **Medium** |
| V3 | `enginePhysics` keys (`gravity`, `pressure`, …) | Physics ontology naming | L6 heuristic read as L2 | **Medium** |
| V4 | `pressureField` / `buildPressureField` | Name collision with Atlas **Pressure** | L6 vs L0 Atlas term (C-A001) | **High** |
| V5 | MCP `read_ratio` | Sounds like L2 scalar read | Participant frame read (practice) | **Medium** |
| V6 | MCP `get_field_terms` | "field" in tool name | Atlas domain vs runtime field fabric | **Low** |
| V7 | `WORLD_PHYSICS` in contract | Sounds like runtime derivation source | Authoring metaphor vs L0–L6 | **Medium** |
| V8 | Landing copy "field reads before any term" | Visitor may read L6 as L0 | Appearance vs invariant | **Low** (O-001 improved) |
| V9 | D-023 "pressure/basin/wake kept as traceable" | Correct intent; missing layer labels | L4–L6 undifferentiated in prose | **Low** |
| V10 | `collectRuntimeOverlay` `fieldPressure` | Blends L2 mass + L5 `localCount` | Mixed-layer scalar in overlay | **Medium** — document only |
| V11 | Visible edge count vs structural edge count | Compression (O-2) | L6 mistaken for L1 | **High** — user-facing |
| V12 | `DERIVED_RATIO.md` "Related" list | No link to invariant contract | Doc drift | **Low** |
| V13 | `RUNTIME_PRINCIPLES.md` convergence table | Lists grains but not L5/L6 | Incomplete stack | **Low** |

**No code violation found** that breaks retrace: server trace without client overlay remains L0–L4 clean.

---

## 6. Relationship to existing documents

| Document | Relationship after P-003 |
|---|---|
| `INVARIANT_RUNTIME_CONTRACT` | **Layer authority** for runtime interpretation |
| `DERIVED_RATIO.md` | L2 specialist doc — should cite contract §L2 |
| `RUNTIME_PRINCIPLES.md` | P1–P4 map to L0, L5 events, L2, cross-cut — extend with L5/L6 |
| `atlas-structure-contract.mjs` | L0 rules; `WORLD_PHYSICS` needs gloss pointing to contract §6 |
| `public-surface-manifest.mjs` | Calculus chain should gain layer column (follow-up) |
| D-012 | **Prototype** of `atlasSource` / overlay split — contract codifies it |
| D-015B | Explains why L3 parallel paths and L2 narrowness are mandatory |
| P-002 | Hierarchy evidence for layer order |

---

## 7. Smallest follow-up changes (recommended)

**No renderer or Atlas code in this commission.** Smallest alignment path:

### 7.1 Documentation only (low risk)

| Change | File | Action |
|---|---|---|
| Add Related link | `docs/runtime/DERIVED_RATIO.md` | Point to `INVARIANT_RUNTIME_CONTRACT.md` |
| Add Related link | `docs/practice/RUNTIME_PRINCIPLES.md` | Same + one paragraph L5/L6 |
| Register commission | `docs/practice/COMMISSIONS.md` | P-003 resolved entry |

### 7.2 Public Calculus wording (manifest + `/calculus` HTML source)

| Change | Action |
|---|---|
| Add `layer` field to each `DERIVATION_CHAIN` step | `public-surface-manifest.mjs` — e.g. Render → `L4–L6 (heuristic)` |
| Split or annotate "Render behaviour" note | Mention overlay/appearance explicitly |
| Add `DERIVATION_CAVEAT` sibling | `overlayCaveat`: "Participant overlay and canvas appearance are not invariant — see INVARIANT_RUNTIME_CONTRACT" |

*Requires worker/manifest edit — defer to small docs commission if user wants zero code.*

### 7.3 Observatory language (no render logic change)

| Change | Action |
|---|---|
| Mechanics panel section headers | Label blocks "Invariant source" vs "Session overlay" (HTML strings only) |
| Relation debug / field status | When citing pressure, prefix `render pressure` not Atlas Pressure |

### 7.4 MCP orientation (strings only)

| Change | Action |
|---|---|
| `read_ratio` tool description | Clarify: practice ratio read under `reference_frame`, not `mass.carriers` |
| `get_derivation_status` response | Optional `layers` array in manifest-driven payload (future) |

### 7.5 Not recommended yet

- Renaming `pressureField` in code (wide churn)
- Adding permeability to L2 without P-005 derivation
- Promoting contract to Constitution

---

## 8. Implications for Observatory (documentation only)

1. **Mechanics panel** is the reference UI for the contract — preserve `atlasSource` citations per behaviour.
2. **Canvas** must always be described as **L6** in programme docs; **states API** as **L0–L3**.
3. **First-load field** (O-001) is appearance expressing L2 — not structure replacing L0.
4. Future O-002 (focused field unification) should cite contract layers when merging home/world pressure grids.

---

## 9. Acceptance

| Criterion | Status |
|---|---|
| Governed by P-001, P-002 | **Met** |
| Eight distinguished layers + frame | **Met** — contract §2–3 |
| May / may not claim per layer | **Met** — contract §3 |
| API and renderer mapping | **Met** — §3 |
| Violations identified | **Met** — §5 |
| Calculus / Observatory language follow-up | **Met** — §7 |
| No implementation / Atlas / renderer changes | **Met** |
| Persist contract + report | **Met** |

---

## 10. Files created

| File | Role |
|---|---|
| `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` | Authoritative layer contract |
| `docs/reports/P-003-invariant-runtime-contract.md` | This report |

**Files changed:** None else (by commission scope).

---

## References

| ID | Path |
|---|---|
| Contract | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| P-001 | `docs/reports/P-001-physics-language-investigation.md` |
| P-002 | `docs/reports/P-002-invariant-hierarchy.md` |
| D-012 | `docs/reports/D-012-behaviour-retrace-instrument.md` |
| D-014 | `docs/reports/D-014-runtime-principles-derivation.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |

---

**Status:** P-003 complete. Contract persisted. Implementation deferred per commission scope.
