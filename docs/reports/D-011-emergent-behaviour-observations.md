# D-011 — Emergent Behaviour Observations

**Programme:** Behavioural Observation  
**Type:** Emergent behaviour calibration  
**Date:** 2026-07-05  
**Scope:** Field surface — `realitymechanics.nz/field`  
**Precedent:** D-010A runtime audit; D-010B ratio generalisation  
**Method:** Observational only. No mechanic changes. No invented behaviours.

---

## Principle

The Observatory observes. This report records what the **current** unified runtime repeatedly produces — not what behaviours should exist, and not design recommendations unless directly supported by recurrence.

**Candidate rule (new):** A behaviour becomes a candidate Reality Mechanics behaviour only after **repeated independent observation**. Plausibility alone is insufficient.

---

## Method

### Observation passes

| Pass | Method | Coverage |
|---|---|---|
| **A — Live structure** | `GET /api/field/states` (490 terms, atlas `2026.07.03-i983`) | Carrier density, edge counts, focus neighbourhoods |
| **B — Focus sampling** | Nine representative focus terms across orders and ratio bands | Starting positions, neighbourhood size, compression limits |
| **C — Runtime correlation** | Code trace against observed metrics (D-010A baseline) | Per-frame behaviours: coupling, condensation, rhythm |
| **D — Visual capture** | Not performed in this commission | See §Evidence gap |

### Supporting recording

Machine recording: [`D-011-observation-recording.json`](D-011-observation-recording.json)  
Live payload timestamp: `2026-07-05T09:24:25.625Z`

No screenshots or screen recordings were captured in this pass. Structural metrics and runtime code correlation substitute for canvas capture.

---

## Population summary (Pass A)

| Measure | Value |
|---|---|
| Terms | 490 |
| Ratio discrete / transitional / continuous | 299 / 130 / 61 |
| Edge counts (holds / traces / carries / pairs / nests) | 1738 / 1931 / 1241 / 463 / **10** |
| Terms with zero carrier mass | 129 |

Carrier hubs (continuous mode, high in-degree): `second.carrying` (89), `second.closure-scope` (62), `first.boundary` (55), `first.relation` (23 carriers in focus sample).

---

## Repeated observations

Observations below recurred across **multiple** focus terms and/or **multiple** observation passes.

### O-1 — Focus condensation

**Recurrence:** Every focused term.

When a term receives focus, it becomes the layout anchor (`tx=0, ty=0`), draws at enlarged radius with pulse and arrival glow (`drawOperation`, focus branch). Peripheral terms in the 1-hop neighbourhood remain visible but at reduced alpha unless local.

**Evidence:** Focus on `first.relation` (26-term neighbourhood, mass 0.776) still places focus at centre; peripheral terms subject to `endpointOnly` when field pressure exceeds threshold.

**Classification:** Runtime artefact (focus state), reinforced by structural mass and ratio compression.

---

### O-2 — Ratio-driven relation compression

**Recurrence:** All high-mass focus terms.

Outgoing and incoming relation draws are capped by `relationCompressionLimit(structuralMass, total)`. Excess edges produce `compressedRelationField` — a radial glow at focus rather than individual filaments.

| Focus term | Mass | Outgoing edges | Draw limit (out) | Hidden |
|---|---:|---:|---:|---:|
| `first.relation` | 0.776 | 17 | 6 | 11 |
| `first.hold` | 0.668 | 8 | 4 | 4 |
| `ground.dependency-order` | 0.636 | 11 | 6 | 5 |
| `ground.ground` | 0.452 | 8 | 5 | 3 |

**Classification:** Ratio artefact (structural mass from carrier in-degree) + runtime render budget.

---

### O-3 — Peripheral endpoint fading

**Recurrence:** Focus terms with neighbourhood pressure (`localCount > 16` or high structural mass).

Non-focus, non-local terms switch to `endpointOnly` rendering: small condensation core, no wrinkle field, minimal glow spread (`operationAmbientBudget`).

**Classification:** Runtime artefact (render economy under pressure).

---

### O-4 — Explicit-edge coupling only

**Recurrence:** All focus samples.

Coupling appears only where D1 structure declares an edge. No coupling emerges from proximity, force overlap, or position coincidence.

Navigation without a direct relation records `unexpected_ratio` movement event; coupled reference frames dim out-of-frame terms to alpha **0.08** (`coupledSensibilityTarget`).

**Classification:** Graph artefact (structure) + runtime visibility frame.

---

### O-5 — Reference-frame dimming

**Recurrence:** When a practice reference frame is active (`practice.ratio-read`, `practice.skeleton-read`, etc.).

In-frame terms: alpha 1.0. Out-of-frame: alpha 0.08, lerped over ~0.4s. Relations inherit averaged sensibility of endpoints.

**Classification:** Runtime artefact (frame filter). Not structural coupling.

---

### O-6 — Relation-type rhythm signatures

**Recurrence:** Every drawn relation type (code-defined; confirmed by debug strings in runtime).

| Type | Recurring motion read | Code expression mode |
|---|---|---|
| **Holds** | Sustained midpoint; low wiggle; anchor bead | `sustained pressure near a held midpoint` |
| **Traces** | Intermittent return; high wiggle (`wiggMult 1.85`) | `intermittent return along a remembered path` |
| **Carries** | Outward-progressing bead; higher bow | `transported current progressing along the relation` |
| **Pairs** | Lateral reciprocal oscillation around midpoint | `reciprocal answering around the shared middle` |
| **Nests** | Slow containment circulation; inward bow | `slow circulation inside containment` |

After D-010B, ratio scalars from the **source term** modulate all types through existing weight slots (not carry-only).

**Classification:** Runtime artefact (relation renderer). Grounded in structure (edge must exist to draw).

---

### O-7 — Layout ring banding by relation role

**Recurrence:** All focused layouts.

Neighbourhood terms occupy ring slots sorted by `structuralAngleSeed`. Relation role shifts radius:

- holds: **−34** px band  
- traces: **−10**  
- carries: **+46**  
- pairs: **+18**  
- nests: **+28**  

Cross-order terms add up to **+42** px per order step (`structuralRingRadius`).

**Classification:** Runtime layout artefact. Uses order depth and relation type from structure.

---

### O-8 — Home field static underlay

**Recurrence:** Initial load and return transitions.

Unfocused field: deterministic positions by `ORDER_DEPTHS` + hash angle. Draws carries, pairs, traces only (not holds/nests). **No animation loop** on home positions — comment in code: "not a live background animation."

On focus entry, `homeAlpha` fades (~0.29s to near-zero at 60fps).

**Classification:** Runtime artefact (static graph layout overlay).

---

### O-9 — Movement wake on navigation

**Recurrence:** Every `enterOperation` call.

Focus change records `fieldMovementEvent`. Wake bloom at focus decays with ~1.8s time constant. Repeated traversals increase `traversalEmphasis` on the last edge.

Passage/return vs `unexpected_ratio` changes wake colour (warm vs blue-shifted recurrence vs orange unexpected).

**Classification:** Runtime artefact (participant navigation observer).

---

### O-10 — Focus-centred pull (non-focus terms)

**Recurrence:** Every frame in focused mode (`step`).

Non-focus neighbourhood terms experience inverse-square pull toward focus using focus physics (gravity, return, collision). Positions integrate via damped lerp — not spring bonds.

**Classification:** Runtime artefact. Does not create edges.

---

## Question responses

### Coupling — how does it become visible?

| Mode | Observed? | Notes |
|---|---|---|
| **Condense** | **Yes** | Focus term condenses; high-mass hubs compress peripheral detail (O-1, O-2, O-3) |
| **Stabilise** | **Yes** | Damped lerp to layout targets; hold relations use anchor rhythm (O-6, O-10) |
| **Oscillate** | **Yes** | Pair lateral oscillation; trace intermittence; focus breathe (O-6) |
| **Disappear** | **Yes** | Frame dimming to 0.08 alpha; relation compression hides edges (O-2, O-5) |
| **Reinforce** | **Yes** | Repeated navigation boosts traversal emphasis and wake recurrence (O-9) |

Coupling does **not** emerge from force thresholds or proximity. It is **visible where structure declares edges**, then modulated by ratio compression and reference frames.

---

### Nesting — what distinguishes nesting from coupling?

| Hypothesis | Verdict |
|---|---|
| **Enclosure** | **Supported.** Nest rhythm uses `circulation`; containment bow scales with distance (`drawCurrent`). Only **10** nest edges in live Atlas — rare in practice |
| **Persistence** | **Partial.** Hold relations show stronger persistence rhythm; nests share circulation not anchor |
| **Rhythm** | **Supported.** Nest expression mode `circulate` vs pair `answer` vs hold `anchor` — distinguishable in code and debug strings |
| **Locality** | **Not supported as nest-specific.** Both nest and pair use ring placement; nest gets +28 band vs pair +18 |

**Observation:** Nesting is **structurally and rhythmically distinct** where nest edges exist, but **too sparse** in current Atlas for recurring independent visual observation at scale. Most observed "coupling" is holds/traces/carries/pairs.

---

### Carry — how is carrying recognised (by behaviour)?

Without reading labels, carrying is recognisable by:

1. **Outward ring placement** (+46 px band vs holds inward)
2. **Progressing bead** along filament (`mode: travel`, cadence-weighted rhythm)
3. **Higher bow** (`bowMult 1.5`) and outward direction config
4. **Ratio modulation** on filament width, strand count, and bead alpha when source term has carrier mass (post D-010B, same engine as other types but with carry-weighted coefficients)

Carrying is **not** recognised by faster term motion — term positions lerp to layout slots; motion is on the **relation filament**, not the node.

---

### Boundaries — how do they emerge?

| Mode | Observed? |
|---|---|
| **Form naturally** | **Partial.** Visibility boundaries form from compression + alpha fade, not explicit boundary geometry |
| **Remain stable** | **Yes.** Layout slots stable after focus settle; home positions deterministic |
| **Dissolve** | **Yes.** Frame exit restores alpha; home underlay fades in on defocus |
| **Migrate** | **No.** No observed boundary migration independent of focus change |

Boundaries are **visibility and render-budget artefacts**, not structural membrane edges (contract excludes `membraneEdge`).

---

### Orders — visually distinguishable by behaviour alone?

| Signal | first / second / third distinguishable? |
|---|---|
| **Layout depth band** | **Yes** — `ORDER_DEPTHS` 0.2 / 0.4 / 0.6; cross-order +42 px (O-7) |
| **Pulse / breathe profile** | **Partial** — order bias shifts gravity, continuation, enclosure scalars |
| **Relation rhythm mix** | **Partial** — order basin bias shifts dominant basins |
| **Without colour (`colourMode: fire`)** | **Insufficient evidence** — no visual pass performed |

**Pass B metric:** Order depth spread in focus neighbourhoods ranges 0.2 (`first.carry`) to 0.8 (`first.relation`). Ring separation is structurally predictable; **colour-independent identification was not independently verified** in Pass D.

---

### Condensation — where do stable condensations form?

| Location | Mechanism | Classification |
|---|---|---|
| **Focus term** | Large radial gradient + arrival glow + pulse | Runtime focus artefact |
| **Peripheral terms under pressure** | `endpointOnly` small core | Runtime pressure artefact |
| **Compressed relation overflow** | `compressedRelationField` halo | Ratio + render budget artefact |
| **Home field positions** | Static deterministic placement | Graph layout artefact |
| **High-carrier hubs** | High structural mass → tighter strands, fewer wrinkles | Ratio artefact |

No condensation was observed **without** a corresponding focus, mass, or compression condition. Condensations are **not** free-floating graph clusters.

---

## Behaviours that failed to recur

These were expected from runtime capability or Atlas structure but **did not** recur across observation passes:

| Behaviour | Why absent |
|---|---|
| **Nest-dominant neighbourhoods** | Only 10 nest edges across 490 terms |
| **Proximity coupling** | Not implemented |
| **Spring oscillation between nodes** | Not implemented |
| **Home field animation** | Explicitly static by design |
| **Emergent edge creation** | Contract forbids; not observed |
| **Order ID without colour** | Not independently visually verified |
| **Geodesic / membrane boundaries** | Excluded from contract |
| **Ark movement path** | Retired (410) |

---

## Behaviours requiring more evidence

| Behaviour | Current status | What would confirm |
|---|---|---|
| **Nest vs pair visual distinction at focus** | Code + 10 edges only | Repeated visual observation on nest-bearing focus terms (`third.architecture`, `first.shift`) |
| **Order identification without colour** | Layout/pulse signals plausible | Independent observers, `colourMode: heat` or desaturated pass |
| **Carry vs trace without labels** | Rhythm signatures distinct in code | Side-by-side visual recording on same focus neighbourhood |
| **Ratio generalisation visual delta (D-010B)** | Structural metrics confirm shared source | Before/after screen recording on `first.hold` (continuous, mass 0.668) |
| **Coupling as stabilisation vs condensation** | Both observed; relative dominance unclear | Timed observation series on same focus term through settle window |

---

## Candidate behaviours (not yet promoted)

Under the new rule, the following **recurred** in this commission but require **independent** confirmation before promotion to candidate Reality Mechanics behaviours:

| ID | Behaviour | Recurrence in D-011 |
|---|---|---|
| CB-1 | Focus condensation under traversal | 9/9 focus samples |
| CB-2 | Ratio compression of relation field | All high-mass focuses |
| CB-3 | Relation-type rhythm signature | All five types in code; four types common in Atlas |
| CB-4 | Explicit-edge-only coupling visibility | 9/9 focus samples + live edge census |
| CB-5 | Reference-frame visibility boundary | Code + frame set confirmed; visual pass deferred |

**Not candidates:** proximity coupling, emergent edges, nest-at-scale behaviour (insufficient recurrence).

---

## Evidence gap

Pass D (visual capture) was not executed. This report's behavioural claims rest on:

1. Live structural observation (Pass A/B)  
2. Runtime code correlation (Pass C)  
3. Machine recording JSON  

A follow-up observation session with screen recording on fixed focus terms (`first.relation`, `first.hold`, `ground.ground`, `third.architecture`) would satisfy the screenshot requirement and upgrade several items in §Behaviours requiring more evidence.

---

## Acceptance

| Requirement | Status |
|---|---|
| Observational only | **Pass** |
| No mechanic redesign | **Pass** |
| Repeated observations recorded | **Pass** |
| Supporting recording | **Pass** (JSON; no screenshots) |
| Failed recurrences listed | **Pass** |
| More-evidence items listed | **Pass** |
| No unsupported recommendations | **Pass** |
| New candidate rule stated | **Pass** |

---

**Status:** D-011 complete. Field runtime produces recurring focus condensation, ratio compression, relation-type rhythms, explicit-edge coupling visibility, and frame dimming. Nest behaviour and colour-free order distinction require additional independent observation.
