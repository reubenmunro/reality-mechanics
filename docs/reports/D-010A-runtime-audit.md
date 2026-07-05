# D-010A — Field Runtime Audit

**Programme:** Structural Reading  
**Type:** Runtime audit (evidence only)  
**Date:** 2026-07-05  
**Scope:** Field surface — `realitymechanics.nz/field`  
**Method:** Reverse-engineering from repository code only. No runtime instrumentation. No UI redesign.

**Primary sources:**

| File | Role |
|---|---|
| `.atlas-publisher/main-website-worker.js` | Field page, Canvas2D client, `/api/field/states` derivation |
| `field-maturity.mjs` | Carrier mass definition (holds/traces in-degree) |
| `atlas-structure-contract.mjs` | Runtime contract declarations |
| `.atlas-publisher/test/field-states.test.mjs` | Retired-surface assertions |

**Not present in Field runtime:** d3, force-directed graph libraries, THREE.js, spring physics, hierarchical scene graph for nesting, Ark endpoints (retired per tests).

---

## Executive summary

The Field is a **read-only structural observatory**: D1-derived JSON → client-side graph index → Canvas2D render loop. Atlas structure is **invariant** at runtime; the client **observes** participant navigation and **translates** it into structural movement events.

There is **one** simulation pipeline (`computeProfile` → `enginePhysics` → `step` / `draw`). First, second, and third order terms are **not separate physics tiers**. They differ through **bias tables**, **layout depth**, and **colour palettes** — with real but modest effects on computed scalars and forces.

Relations are **explicit graph edges** (holds, traces, carries, pairs, nests) drawn as **quadratic Bézier filaments**, not spring-connected particles. Coupling exists only where structure says so, plus reference-frame alpha dimming. Nesting is a **flat edge type**, not a transform tree.

Ratio mechanics are **real** at runtime: carrier in-degree from holds/traces drives `ratioMode`, which feeds `structuralMass` and **carry-relation rendering**. Other relation types have ratio variables wired to zero in `drawCurrent`.

---

## 1. Orders

**Question:** How are first, second, and third order terms represented? Are orders mechanically different or merely rendered differently?

**Answer:** Same engine, **different bias inputs**. Mechanical differences are real but implemented as scalar offsets into one profile pipeline — not as separate simulators.

### Data path

1. D1 `entries.entry_order` → `/api/field/states` → client `state.order` / `op.order` (`deriveFieldStatesPayload`, ```148:151:.atlas-publisher/main-website-worker.js```).
2. Display order may override: `spineDisplayOrder()` maps Seed → `'seed'` (lines 2399–2405, not quoted here).

### Per-dimension evidence

| Dimension | Mechanism | first / second / third |
|---|---|---|
| **Colour** | `FIRE_ORDERS` HSL per order; `fireFor(order)` in `drawOperation` | first h278, second h230, third h188 (```973:981:.atlas-publisher/main-website-worker.js```). Default `colourMode = 'fire'`: hue by order. Mode `'heat'`: ember↔ash by physics heat, not order. |
| **Brightness / burn** | `physics.heat`, `structuralMass`, order hue lightness | Order sets palette; intensity from profile: `burn = fr.l * (0.6 + physics.heat * 0.72)` (```2134:2138:.atlas-publisher/main-website-worker.js```). |
| **Position — home field** | `ORDER_DEPTHS` radial depth + hash angle | first 0.2, second 0.4, third 0.6 (```969:969:.atlas-publisher/main-website-worker.js```, ```2343:2351:.atlas-publisher/main-website-worker.js```). |
| **Position — focus layout** | `structuralAngleSeed` adds `orderDepth * 1.7`; `structuralRingRadius` adds `crossOrder * 42` | Terms from different orders get different ring bands (```894:928:.atlas-publisher/main-website-worker.js```). |
| **Force** | `step()`: inverse-square pull toward focus using **focus** physics | Non-focus terms pulled by focus `gravity`, `return`, `collision` (```2243:2248:.atlas-publisher/main-website-worker.js```). Order affects each term's own `physics` via `orderBias` in `computeProfile`. |
| **Mass** | `mass.carriers` = holds/traces in-degree (not order-indexed) | `structuralMassForState` blends carriers + ratio + settledness + maturity (```514:526:.atlas-publisher/main-website-worker.js```). |
| **Attraction** | Focus-centered pull + basin vector offset | No pairwise order attraction. Basin pull from `basinVector(profile, …)` (```2250:2252:.atlas-publisher/main-website-worker.js```). |
| **Decay** | `enginePhysics().decay`, `decayPressureTraces(dt)`, profile `wither`/`ash` | `orderBias` shifts resolution/turbulence inputs per order (```458:467:.atlas-publisher/main-website-worker.js```). |

### Order bias tables (mechanical, not cosmetic)

`orderBias` adds per-order offsets into profile scalars (```458:467:.atlas-publisher/main-website-worker.js```):

| Scalar | first | second | third |
|---|---:|---:|---:|
| gravity | +0.14 | +0.10 | +0.06 |
| return | +0.18 | +0.10 | +0.08 |
| continuation | +0.18 | +0.14 | +0.18 |
| enclosure | +0.04 | +0.08 | +0.20 |
| turbulence | +0.08 | +0.02 | +0.04 |
| resolution | −0.02 | +0.18 | +0.10 |

`orderBasinBias` shifts basin weights (```532:541:.atlas-publisher/main-website-worker.js```): e.g. first emphasises trace/carry; second bearing/gateway/terminal; third nest/carry.

### Verdict

**Mechanically different through shared formulas, not merely painted differently.** Orders change computed gravity, continuation, enclosure, layout depth, ring radius, and colour. They do **not** select different force laws, integrators, or relation models.

---

## 2. Relations

**Question:** How do relations behave?

**Answer:** Explicit **directed adjacency lists** from D1 `structure` JSON, rendered as **styled Bézier filaments** with type-specific rhythm parameters. No spring simulation.

### Storage

```29:36:.atlas-publisher/main-website-worker.js
const FIELD_RELATION_KEYS = ["holds", "traces", "carries", "pairs", "nests"];
function fieldRelations(structure) {
  ...
}
```

Five relation kinds, each an array of target entry IDs on every term.

### Relation type config

```383:393:.atlas-publisher/main-website-worker.js
const relationTypes = [
  { key: 'holds',   ... direction: 'anchor',  wiggMult: 0.18, bowMult: 0.5,  ... },
  { key: 'traces',  ... direction: 'return',  wiggMult: 1.85, bowMult: 0.85, ... },
  { key: 'carries', ... direction: 'outward', wiggMult: 0.32, bowMult: 1.5,  ... },
  { key: 'pairs',   ... direction: 'lateral', wiggMult: 0.65, bowMult: 0.4,  ... },
  { key: 'nests',   ... direction: 'enclose', wiggMult: 0.12, bowMult: 0.28, ... },
];
```

### Behaviour matrix

| Hypothesis | Evidence |
|---|---|
| **Springs** | **No.** Term positions integrate via damped lerp toward layout targets (`op.tx`, `op.ty`), not spring forces between nodes (```2253:2255:.atlas-publisher/main-website-worker.js```). |
| **Bézier curves** | **Yes.** `bezierPoint`, quadratic control points, animated bead on curve (`drawCurrent`, ```1813:1816:.atlas-publisher/main-website-worker.js```). Home field uses fixed quadratic arcs (```2387:2389:.atlas-publisher/main-website-worker.js```). |
| **Graph edges** | **Yes.** Edge existence = `source[type.key].includes(targetId)` (`relationKeysBetween`, ```1018:1023:.atlas-publisher/main-website-worker.js```). |
| **Attraction forces** | **Partial.** Focus pull in `step()`; pressure-field gradient bends relation midpoints (`fieldBend`, ```1810:1811:.atlas-publisher/main-website-worker.js```). Not edge-to-edge force simulation. |
| **Shortest paths** | **No graph shortest-path.** `fireMix` uses shortest arc on colour wheel only (hue interpolation, line ~1493). |
| **Cached geometry** | **Yes.** `relationTrajectoryMemory` Map smooths Bézier control points per `aId:typeKey:bId` (cap 720 entries, ```1817:1819:.atlas-publisher/main-website-worker.js```). `pressureField` Float32Array grid relaxed each focused frame (`buildPressureField`, ```1255:1299:.atlas-publisher/main-website-worker.js```). |

### Traversal vs structure

- **Focus neighbourhood:** 1-hop outgoing + incoming on five keys (`initOperations`, line 846).
- **Expanded neighbourhood:** BFS up to 120 nodes (`localIdsFromIndex`, ```804:843:.atlas-publisher/main-website-worker.js```).
- **Home field:** draws only `carries`, `pairs`, `traces` — not holds or nests (`buildHomeConnections`, ```2354:2368:.atlas-publisher/main-website-worker.js```).

### Render pipeline per relation

`drawCurrent` → rhythm from profiles + pressure gradient → Bézier control → `drawFilament` strands + glow bead. Relation visibility capped by `relationCompressionLimit(structuralMass, total)` (```1930:1935:.atlas-publisher/main-website-worker.js```).

---

## 3. Coupling

**Question:** What causes two terms to couple?

| Mechanism | Type | Code evidence |
|---|---|---|
| **Structure adjacency** | Explicit | Edge exists iff target ID in source relation array |
| **Movement event** | Inferred read | Navigation without direct relation → `unexpected_ratio` event (`recordFieldMovement`, ```1040:1045:.atlas-publisher/main-website-worker.js```) |
| **Reference frame** | Visual coupling | `coupledSensibility`: in-frame terms alpha 1.0, out-of-frame 0.08 (`coupledSensibilityTarget`, ```789:801:.atlas-publisher/main-website-worker.js```) |
| **Force threshold bond** | **None** | No force creates edges; forces do not bind terms |
| **Graph adjacency for display** | BFS / 1-hop | Determines visible neighbourhood only |

**`coupledSensibility` is not a physics bond** — it modulates render alpha under practice reference frames (`STRUCTURAL_FIELD_FRAMES`, ```692:698:.atlas-publisher/main-website-worker.js```).

When participant moves from term A to B:

```1025:1050:.atlas-publisher/main-website-worker.js
fieldMovementEvent = {
  ...
  type: !from ? 'first'
    : direct.length || reciprocal.length ? (reverse ? 'return' : 'passage')
    : 'unexpected_ratio',
  relation: direct,
  ratio: { reciprocalRelation: reciprocal },
  ...
};
```

Coupling for **observation** is structural. Coupling for **visibility** is frame membership. There is no emergent coupling from proximity or force overlap.

---

## 4. Nesting

**Question:** How is nesting represented mechanically?

**Answer:** As **`nests: string[]`** — the same flat adjacency model as holds/traces/carries/pairs. **No parent transform, no nested coordinate system, no scene graph.**

Mechanical reads of `nests`:

| Layer | Effect |
|---|---|
| **Structure** | Outgoing edge list on source term |
| **Profile** | `op.nests.length`, `incoming.nests` → `enclosure` scalar (`computeProfile`, line 634) |
| **Basins** | `nest` basin weight via `orderBasinBias` (third order +0.18 nest bias) |
| **Render** | `direction: 'enclose'`, circulation rhythm, containment bow in `drawCurrent` (```1781:1783:.atlas-publisher/main-website-worker.js```, ```1812:.atlas-publisher/main-website-worker.js```) |

**Carrier mass does not count nests** — only holds/traces in-degree (`field-maturity.mjs`, ```25:28:field-maturity.mjs```, comment lines 48–51).

**Distinct from nesting:** `recursiveCarries()` walks `carries` edges for `practice.growth-read` frame filtering (```722:734:.atlas-publisher/main-website-worker.js```) — still flat graph traversal, not hierarchical nesting.

---

## 5. Runtime loop

**Question:** Document the per-frame pipeline.

### Top-level loop

```2303:2311:.atlas-publisher/main-website-worker.js
function loop(now) {
  ...
  step(dt);
  draw();
  requestAnimationFrame(loop);
}
```

`dt` capped at 0.05s. Adaptive render quality adjusts from frame time (`updateAdaptiveRenderQuality`).

### Pipeline (focused mode)

```text
INPUT
  Pointer pan/pinch, keyboard spine navigation, term selection (enterOperation)
  → recordFieldMovement(from, to) on navigation
  → initOperations(focusId), layout(focusId), refreshProfiles on focus change

step(dt)  — "field update" + partial force
  time += dt; settled += dt
  decayPressureTraces(dt)
  pan/scale lerp toward targets
  coupledSensibility lerp per term (reference frame)
  FOR each visible operation:
    computeProfile(op) if not cached
    IF not focus: inverse-square pull toward focus (focusPhysics)
    basin vector offset
    focus breathe oscillation
    damped lerp: op.x/y → tx/ty + offsets
  NOTE: refreshProfiles NOT called every frame
  NOTE: relation geometry NOT updated here

draw()  — ratio prep, relation update, render
  drawSmoke (ambient)
  drawHomeField (static underlay, deterministic positions)
  IF NOT homeMode:
    drawBasinGradients
    buildPressureField()          ← pressure grid from term positions
    drawIncomingCurrents(focus)
    FOR outgoing relations (sorted, compressed by structuralMass):
      drawCurrent(...)            ← ratio + rhythm + Bézier + trajectory memory
    drawFieldMovementWake(focus)  ← last navigation event
    drawOperation(each op)        ← term condensation / colour
  renderRelationDebug (optional)
```

### Home mode

Static deterministic placement — **not live animation** (comment ```2336:2338:.atlas-publisher/main-website-worker.js```). `homeAlpha` fades underlay when entering focus.

### Ratio update timing

`ratioMode` computed at profile refresh and inside `drawCurrent` for carry edges. **Not a separate ratio integrator** — reads from `fieldState.ratioMode` derived at API load plus `ratioModeForState()` client-side.

### Force update

Occurs inside `step()` only: focus pull + basin offset + breathe. **Not** inter-term force graph.

### Relation update

Occurs inside `draw()`: pressure field rebuild, trajectory memory smoothing, filament draw. Relation existence is static; relation **geometry and emphasis** update per frame.

---

## 6. Ratio

**Question:** Where do Atlas ratios influence actual runtime mechanics?

### Server derivation (D1 → API)

**Mass `x`** = count of other entries whose `structure.holds` or `structure.traces` include this entry ID:

```25:28:field-maturity.mjs
export function structureCarriesEntry(structure, entryId) {
  return (structure.holds || []).includes(entryId) || (structure.traces || []).includes(entryId);
}
```

```62:69:.atlas-publisher/main-website-worker.js
function fieldRatioMode(mass, thresholds = {}) {
  ...
  mode: x >= continuous ? "continuous" : x >= transitional ? "transitional" : "discrete",
  x,
}
```

Thresholds from `garden_config.field_ratio_mode_thresholds` (default transitional ≥ 3, continuous ≥ 8). Pairs, nests, carries mentions **do not** increment `x`.

Contract explicitly excludes legacy ratio features: `excludes: ["weather", "clearance", ...]` (```179:179:.atlas-publisher/main-website-worker.js```).

### Client mechanical consumers

| Consumer | Ratio effect |
|---|---|
| `structuralMassForState` | `ratio.transition`, `ratio.continuous` → mass → damping, compression, render budget |
| `computeProfile` → `continuation` | `+ ratioMode.continuous * 0.22` (line 632) |
| `relationCompressionLimit` | Fewer visible edges when mass high (```1930:1935:.atlas-publisher/main-website-worker.js```) |
| `drawCurrent` | **Only `carries` edges** use `termRatioMode(a)`; all others get `discreteRatioMode()` (zeros) (```1757:1777:.atlas-publisher/main-website-worker.js```) |
| `movementRatioSignature` | Navigation event shape → bow, emphasis, wake, tension (```991:1015:.atlas-publisher/main-website-worker.js```) |
| `traversalEmphasis` | Recent path weighting on relation draw (```1053:1064:.atlas-publisher/main-website-worker.js```) |

**Critical asymmetry:** Ratio mode machinery is fully implemented for **carry** relation rendering. Hold, trace, pair, nest ratio variables in `drawCurrent` are **hardcoded to zero** (lines 1764–1777) — infrastructure present, mechanics inactive.

Ratio is **not** read from Atlas prose. It is derived from **structure in-degree (holds/traces)** and thresholds in `garden_config`.

---

## 7. Opportunity

**Question:** Where could existing runtime be driven by Order, Ark, Runtime, Coupling, Nesting, Carry, Trace, Ratio — only where evidence already exists?

No new theory. Evidence-only mapping.

| Concept | Current runtime evidence | Opportunity (existing hooks only) |
|---|---|---|
| **Order** | `orderBias`, `orderBasinBias`, `ORDER_DEPTHS`, `FIRE_ORDERS`, spine sort | Already drives profile + layout + colour. Could extend ratio or relation rhythm by order **without new physics** — tables already exist. |
| **Ark** | **Retired** — `/api/ark/*` returns 410 (field-states.test.mjs) | No runtime hook. Would violate current contract if reintroduced without redesign. |
| **Runtime** | `RELATION_EVENT_RUNTIME_CONTRACT`; `recordFieldMovement`; `fieldMovementEvent`; `traversalMap` | Event types partially implemented (`first`, `passage`, `return`, `unexpected_ratio`). Contract lists more `STRUCTURAL_EVENT_TYPES` not all wired client-side. |
| **Coupling** | `coupledSensibility` under `STRUCTURAL_FIELD_FRAMES` | Frame membership already dims non-local terms. Could tie to Atlas `pairs`/coupling terms **via structure**, not new bonds. |
| **Nesting** | `nests[]` edges → enclosure, nest rhythm, nest basin | Already profile + render. No hierarchical layout hook — would require new mechanic, not present. |
| **Carry** | `carries[]` edges; ratio on carry currents; `recursiveCarries` for growth-read frame | **Strongest ratio hook.** Extend ratio vars to traces/holds using existing `drawCurrent` slots (currently zeroed). |
| **Trace** | `traces[]` edges; trace rhythm; mass in-degree | Mass and rhythm active; ratio slots inactive. Pressure traces from relation filaments (`relationPressureTraces`). |
| **Ratio** | `fieldRatioMode`, `structuralMass`, carry-only ratio rendering | Wire hold/trace/pair/nest branches in `drawCurrent` (lines 1764–1777) to `termRatioMode` — code path exists, values stubbed. |

### Structural frames (existing filter hooks)

```692:698:.atlas-publisher/main-website-worker.js
const STRUCTURAL_FIELD_FRAMES = new Set([
  'practice.ratio-read',
  'practice.skeleton-read',
  'practice.growth-read',
  ...
]);
```

`practice.ratio-read` filters to ground + first order plus named terms (```740:746:.atlas-publisher/main-website-worker.js```). Frames already drive **what is visible**, not new structure.

### Profile pipeline (single extension point)

`computeProfile` → `enginePhysics` → `step` / `draw` is the one place order, relation counts, ratio, maturity, and agitation converge. Any future mechanical read already passes through here.

### Contract constraint

```196:204:atlas-structure-contract.mjs
invariantRule: "The Atlas structure is invariant. Runtime behaviour may interpret structure but must not silently create it."
bespokeRule: "If a new term requires bespoke frontend code ... the runtime contract is wrong."
```

Opportunities must remain **interpretation of existing structure**, not term-specific branches.

---

## Appendix — Key runtime variables

| Variable | Role |
|---|---|
| `allOps` | Full Atlas index from `/api/field/states` |
| `operations` | Focus neighbourhood subset with x/y/tx/ty |
| `fieldStatesPayload` | API contract + ratio thresholds |
| `coupledSensibility` | Per-term alpha under reference frame |
| `pressureField` | 42×28 scalar grid for medium pressure |
| `relationTrajectoryMemory` | Smoothed Bézier control points |
| `fieldMovementEvent` | Last navigation structural event |
| `structuralMass` | Derived readability weight (carriers + ratio + settledness) |

---

## Acceptance

| Requirement | Status |
|---|---|
| Code-only evidence | **Pass** |
| Orders described | **Pass** |
| Relations described | **Pass** |
| Coupling described | **Pass** |
| Nesting described | **Pass** |
| Runtime loop documented | **Pass** |
| Ratio mechanics located | **Pass** |
| Opportunity without new theory | **Pass** |
| No code changes | **Pass** |
| No redesign | **Pass** |

---

**Status:** D-010A complete. Field runtime reverse-engineered from code; orders share one engine with bias tables; relations are explicit Bézier graph edges; ratio mechanics active on carry and mass, stubbed on other relation types.
