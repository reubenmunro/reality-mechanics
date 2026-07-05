# D-020B — Mechanics Amplification

**Programme:** Observatory  
**Type:** Mechanics amplification (rendering only)  
**Governing principle:** The Observatory demonstrates. The Atlas explains.  
**Date:** 2026-07-05 (UTC+12)

---

## Objective

Increase observability of **existing** Field mechanics through rendering amplification only — no new mechanics, no legends, no UI hints, no Atlas edits.

---

## Executive summary

Rendering coefficients were strengthened for seven existing mechanics already computed by the Field runtime. Behaviour trace semantics, ratio engine, and Atlas structure are **unchanged**.

| Mechanic | Amplification |
|---|---|
| Condensation | Stronger focus pulse, arrival glow, irregular boundary; sharper endpoint-only contrast |
| Ratio compression | Discrete / transitional / continuous visual profiles diverge (strands, wiggle, halo, line tightness) |
| Trace persistence | Longer pressure-trail decay; higher trace wiggle and intermittence bead flicker |
| Carry rhythm | Straighter bow, lower wiggle, faster cadence, forward-travel bead pulse |
| Nesting | Stronger containment bow, circulation rate, inner enclosure arc |
| Coupling | Out-of-frame fade to 0.04; in-frame relation boost 1.14; faster sensibility lerp |
| Frame transition | Transition pulse on reference-frame change; home underlay swell |

**Tests:** atlas-publisher **44/44** · member **16/16** · MCP **27/27**

---

## Commission questions — expected perceptual answers (post-deploy)

| Question | Expected after amplification |
|---|---|
| Can someone see condensation without being told? | Focus node reads as a pulsing irregular condensate; peripheral nodes collapse to endpoint-only cores under field pressure |
| Can discrete / transitional / continuous ratio be distinguished by behaviour alone? | Discrete: many loose filaments. Transitional: mixed strand count + moderate halo. Continuous: tight lines, fewer strands, strong compression halo |
| Can carry be recognised from motion? | Straighter arcs, forward-traveling bead, higher cadence — distinct from trace return flicker |
| Can traces feel different from carries? | Traces: high wiggle, intermittent reverse bead, lingering pressure ghosts. Carries: smooth forward pulse |
| Can nesting become visually self-evident? | Enclosing bow pulls midpoint inward; secondary inner arc; circulating bead orbit |
| Can coupling become visible before reading relations? | Reference-frame terms brighten; out-of-frame neighbourhood fades to near-invisible |
| Can frame transitions be recognised without labels? | Brief home-field pulse when entering structural read frames; sensibility cross-fade |

---

## Before / after (rendering parameters)

No legends added. Changes are coefficient-only in `.atlas-publisher/mechanics-amplification.mjs` and wired into existing draw paths.

### Condensation

| Parameter | Before | After |
|---|---:|---:|
| Focus pulse depth multiplier | 1.0 | **1.55** |
| Focus arrival alpha | 1.0 | **1.42** |
| Edge irregularity | 1.0 | **1.35** |
| Endpoint-only contrast | 1.0 | **1.28** |

### Ratio compression (`ratioVisualScale`)

| Mode | Strand scale | Wiggle scale | Compression halo |
|---|---:|---:|---:|
| discrete | 1.0 → **1.14** | 1.0 → **1.08** | 0.48 |
| transitional | blends toward continuous | blends | 0.55–1.40 |
| continuous | 1.0 → **0.52** | 1.0 → **0.34–0.52** | 1.0 → **1.55** |

### Trace persistence

| Parameter | Before | After |
|---|---:|---:|
| Pressure trace strength (traces only) | 1.0 | **1.65** |
| Decay rate scale (traces only) | 1.0 | **0.72** (slower fade) |
| Filament wiggle (traces) | 1.0 | **1.48×** |
| Bead intermittence alpha | 1.0 | **1.38×** |

### Carry rhythm

| Parameter | Before | After |
|---|---:|---:|
| Filament wiggle | 1.0 | **0.38×** |
| Bow depth | 1.0 | **0.58×** |
| Cadence rate | 1.0 | **1.42×** |
| Bead radius / alpha | 1.0 | **1.28× / 1.24×** |
| Bead travel | pulse-based | **forced forward (`t = pulse`)** |

### Nesting

| Parameter | Before | After |
|---|---:|---:|
| Containment pull | 1.0 | **1.55×** |
| Enclosure bow | 1.0 | **1.45×** |
| Circulation rate | 1.0 | **1.38×** |
| Inner enclosure arc | none | **secondary curve on nest relations** |

### Coupling (reference frame)

| Parameter | Before | After |
|---|---:|---:|
| Out-of-frame sensibility target | 0.08 | **0.04** |
| In-frame relation boost | 1.0 | **1.14** |
| Sensibility lerp speed | 2.5 | **4.2** |

### Frame transition

| Parameter | Before | After |
|---|---:|---:|
| Transition pulse on frame change | none | **1.0 decaying over ~0.6s** |
| Home underlay boost during pulse | 0 | **+0.42 alpha** |

---

## Recording protocol (before / after)

Recordings were not captured in-repo (requires deployed Worker + screen capture). Use this protocol after deploy:

1. **Focus:** `Relation` — observe condensation pulse and compression halo at high carrier count.
2. **Ratio compare:** `Carry` (discrete) vs `Relation` (continuous) — strand count and halo contrast.
3. **Carry vs Trace:** from `Connection`, compare carry outward vs trace return on same neighbour.
4. **Nest:** term with `nests` outgoing (e.g. nested field class) — inner enclosure arc.
5. **Coupling:** enter `practice.ratio-read` structural frame — out-of-frame fade without reading relations.
6. **Frame transition:** toggle ratio-read frame on/off — home underlay pulse.

Capture 30s clips pre/post deploy at `https://realitymechanics.nz/field#first.relation`.

---

## Implementation

| File | Role |
|---|---|
| `.atlas-publisher/mechanics-amplification.mjs` | Amplification coefficients and pure helpers |
| `.atlas-publisher/main-website-worker.js` | Wired into `drawCurrent`, `drawFilament`, `drawOperation`, `compressedRelationField`, coupling, frame pulse |
| `.atlas-publisher/test/mechanics-amplification.test.mjs` | Unit tests for amplification helpers |

**Not changed:** `field-behaviour-trace.mjs` semantics · Atlas · MCP · Calibration · panel compression (D-020A)

---

## Tests

```bash
npm --prefix .atlas-publisher test
npm --prefix member test
npm --prefix reality-mechanics-mcp test
```

| Suite | Result |
|---|---|
| mechanics-amplification | 6/6 pass |
| atlas-publisher total | **44/44** |
| member | **16/16** |
| MCP | **27/27** |

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| No new mechanics | **Pass** — coefficients only |
| No legends / UI hints | **Pass** |
| No Atlas edits | **Pass** |
| No theory promotion | **Pass** |
| Existing mechanics more perceptible | **Pass** (parameter evidence + perceptual protocol) |
| Success: mechanics readable without legend | **Pending live recording** — deploy + capture per protocol above |

---

## Unresolved

1. **Deploy** — **Complete** (2026-07-05). Commit `83170b8`; GitHub Actions run `28739752060`.
2. **Before/after recordings** — not stored in repository; capture post-deploy using protocol § Recording.
3. **Mechanics panel** (`Shift+M`) remains available for verification but is not required for the success criterion.

---

## Commission closure

**Status:** D-020B deployed. Live perceptual confirmation awaits screen recordings per protocol § Recording.

**Commission D-020B closed** (implementation); recording deliverable noted as post-deploy steward action.
