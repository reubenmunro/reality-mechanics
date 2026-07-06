# O-008 — Observatory Renderer Reconstruction

**Commission:** O-008  
**State:** Resolved  
**Date:** 2026-07-07  
**HEAD context:** post M-001 programme sort; implements activation O-007 never delivered

---

## Problem

The live Observatory appeared almost empty on first load. Participants could not perceive carry/trace thread mechanics, drift/archive distinction, woven crossings, fabric emergence, or structurally earned condensation within five seconds — before selecting a term.

This was not a polish pass. The woven-field mechanics were derived in repository modules (`thread-mechanics.mjs`, `read-engine.mjs`, `weave-read.mjs`) but the **browser renderer could not execute them**.

---

## Verification (first task)

| Check | Finding |
|-------|---------|
| O-007 code committed? | **No** — `docs/reports/O-007-woven-field-renderer.md` absent; no prior woven-field activation module |
| Client mechanics bundle in HTML? | **No** (before O-008) — worker imported `resolveLeg` server-side only |
| `RMMechanics` in page source? | **No** (before O-008) |
| Browser console errors? | **Expected:** `ReferenceError: resolveLeg is not defined` on every `draw()` — caught by `try/catch` in animation loop → empty canvas |
| O-007 drawing functions called? | `drawHomeField` existed but leg resolution failed silently |
| Visibility thresholds hiding mechanics? | **Yes** — `legStrokeAppearance` base alpha ~0.05; fabric cell skip `p < 0.035`; condensation `mass >= 0.24` |
| Deployment behind local repo? | Possible for HTML content; root cause was **missing client activation**, not deploy lag alone |

**Verdict:** O-007 was never built. O-008 fixes **activation first**, then **visibility tuning**.

---

## Implementation

### 1. Client mechanics activation (`woven-field-renderer.mjs`)

- New module: `.atlas-publisher/woven-field-renderer.mjs`
- `buildClientMechanicsBundle()` injects inline browser script after `ratioModeForState` / `structuralMassForState`
- Exposes `window.RMMechanics` with thread-mechanics resolver (aligned with `thread-mechanics.mjs`)
- Mirrors globals: `var resolveLeg = RMMechanics.resolveLeg` (and `legStrokeAppearance`, `buildPairStateFromOps`, etc.)

### 2. Woven-field draw pipeline (`drawWovenHomeField`)

Renderer order (commission):

1. `buildHomeWeaveState()` — derive mechanics
2. `RMMechanics.classifyHomeWeaveLegs()` — classify legs by weave mode priority
3. Thread batch (`thread_forward`, `thread_return`)
4. Crossing batch (`web_crossing`, `crossing_unwoven`)
5. Remainder batch (`drift`, `archive`, `hold`)
6. `drawHomeFabricFace()` — fabric only where pressure lattice eligible
7. `drawHomeCondensation()` — structural mass / thread network
8. `drawHomeStructuralLabels()` — `homeLabelIds` (earned per order spine)
9. Hover label last

Removed legacy hash-sorted connection pass (O-002) that drew arbitrary edge subsets without weave priority.

### 3. Visibility floors (`HOME_WOVEN_VISIBILITY`)

| Parameter | Before | After (O-008) |
|-----------|--------|---------------|
| Leg alpha floor | ~0.05 | `minLegAlpha: 0.14` (+ whole-field boost 1.85×) |
| Leg width floor | ~0.44 | `minLegWidth: 0.62` (+ whole-field boost 1.35×) |
| Fabric cell threshold | 0.035 | 0.012 |
| Fabric mass min | 0.12 | 0.05 |
| Condense mass (neutral) | 0.24 | 0.06 |
| Connection cap (neutral) | ~96 hash sample | up to 800 by weave priority |

`drawHomeRelationCurrent` uses `RMMechanics.homeLegStrokeAppearance(..., { wholeField: neutralWholeFieldOpen() })`.

### 4. Tests

- `.atlas-publisher/test/o-008-woven-field-renderer.test.mjs` (6 tests)
- Updated O-001 / O-004 assertions in `field-states.test.mjs`
- **116 tests pass** @ O-008

Tests fail if:

- `RMMechanics` / `resolveLeg` activation absent from HTML
- `drawWovenHomeField` not called on first-load path
- Visibility floors drop below perceptibility thresholds
- Legacy hash-sorted home pass returns

---

## Deployment verification

After deploy of Field worker (`main-website-worker.js`):

### Grep live HTML (`/field` or `/`)

```bash
curl -s https://realitymechanics.nz/field | rg 'RMMechanics|drawWovenHomeField|activateRMMechanics'
```

Expect:

- `activateRMMechanics`
- `window.RMMechanics`
- `function drawWovenHomeField`
- `var resolveLeg = RMMechanics.resolveLeg`

### Browser console

```javascript
RMMechanics.version          // "o-008.v1"
RMMechanics.resolveLeg       // function
RMMechanics.classifyHomeWeaveLegs  // function
RMMechanics.HOME_WOVEN_VISIBILITY.minLegAlpha  // 0.14
```

No `[field] draw error: ReferenceError: resolveLeg is not defined` in console.

### Visual signs (neutral first load, no term selected)

Within ~5 seconds participant should perceive:

- **Carrying** — solid warm carry strokes (thread_forward)
- **Tracing** — dashed archive strokes on trace-only legs; return threads where carry∧trace
- **Thread continuity** — continuous thread pairs brighter than drift-only carries
- **Drift vs archive** — dashed drift (carry-only) vs finer-dash archive (trace-only)
- **Woven crossings** — pair/nest legs on thread pairs (`web_crossing`) drawn in second batch
- **Fabric emergence** — blue-warm lattice between thread-network terms (not flat void)
- **Condensation** — soft radial term glows on thread-network / spine-label terms
- **Named terms** — faint structural labels on highest-degree terms per order (not decoration-first)

Protected principle: **if the field still looks empty, the renderer has failed** — even when tests pass.

---

## Files changed

| File | Change |
|------|--------|
| `.atlas-publisher/woven-field-renderer.mjs` | **New** — bundle, visibility, draw plan |
| `.atlas-publisher/main-website-worker.js` | Inject bundle; `drawWovenHomeField`; labels; visibility |
| `.atlas-publisher/test/o-008-woven-field-renderer.test.mjs` | **New** |
| `.atlas-publisher/test/field-states.test.mjs` | O-001 / O-004 activation assertions |
| `docs/practice/COMMISSIONS.md` | O-008 resolved |
| `docs/PROGRAMME_INDEX.md` | Observatory renderer row |

**Not changed (per commission):** Atlas terms, D1, public surfaces, Theory/Proof/Pulse/Calculus.

---

## Relation to prior work

- **O-004** wired TMS resolver in worker source but never emitted it to the browser — O-008 closes that gap.
- **O-002** fabric gating and drift/archive modes preserved; draw order and activation reconstructed.
- **O-007** (referenced in commission brief) was planned but not present — O-008 delivers the activation and visibility pass O-007 was meant to provide.

---

## Steward decision

Commission **resolved**: Observatory first-load renderer now derives and paints woven-field mechanics already present in repository evidence. Deploy Field worker to make live site match local HEAD.
