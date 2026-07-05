# D-017A — Ember Runtime Model

**Programme:** Runtime  
**Type:** Ember runtime model (discovery document)  
**Date:** 2026-07-05  
**Deliverable:** [`docs/runtime/EMBER_RUNTIME_MODEL.md`](../runtime/EMBER_RUNTIME_MODEL.md)  
**Method:** Map candidate ember reads to existing Field mechanics and Atlas terms. No implementation. No promotion.

---

## Objective

Document ember as a **candidate** runtime metaphor/mechanic for state, trace, carry, transition, and condensation — and assess whether it is more faithful than graph/topography alone.

---

## Executive summary

| Question | Answer |
|---|---|
| Is ember a replacement runtime model? | **No** — graph adjacency remains mechanical source |
| Is ember only visual metaphor? | **Partially** — fire palette + CSS; also profile scalars |
| Best classification | **Derived state model + visual metaphor on graph engine** |
| More faithful than graph alone? | **Partially** — ember helps intensity/condensation; graph helps structure/coupling |
| Derived Ratio relation | Ratio → `structuralMass` → heat/pulse/condensation; participation link **not load-bearing** (D-015B) |

**Next:** D-017B falsification (questions prepared in design doc §7).

---

## Investigation summary

### 1. Mechanical ember verbs (Field evidence)

| Verb | Runtime anchor | Classification |
|---|---|---|
| holds | gravity, anchor rhythm | Mechanic |
| carries | continuation, outward bead | Mechanic |
| traces | returnForce, intermittent rhythm | Mechanic |
| pairs | resonance, reciprocal oscillation | Mechanic |
| nests | enclosure scalar, flat edge | Partial (sparse data) |
| cools | endpointOnly, ash/decay, mass dampening | Mechanic |
| ignites | focus pulse, arrival glow, movement wake | Mechanic + focus artefact |
| condenses | condensationPath, compression halo | Mechanic (not ontology) |
| becomes fire | FIRE_ORDERS + heat brightness | **Visual metaphor** |

Sources: D-011 O-1–O-9; D-012 focus-condensation trace; `main-website-worker.js` `computeProfile`, `drawOperation`.

### 2. RM term expressiveness

| High fit | Medium | Low / unsupported |
|---|---|---|
| Order (colour, layout) | Hold, Carry, Trace, Ratio, Resolution | Coupling (structure not ember), Nesting (flat), **Ark (retired)** |

### 3. Ember vs graph/topography

```text
Graph/topography (structure)     Ember layer (derived render state)
─────────────────────────────     ─────────────────────────────────
Explicit edges (O-4)              Heat / ash / pulse
Ring layout (O-7)                 Condensation cores (O-1, O-2, O-3)
Flat adjacency (D-010A)           Fire palette / wake (O-9)
ratioMode → structuralMass        Ratio-modulated glow intensity
```

Both layers are live. Ember does not remove the graph.

### 4. Derived Ratio (constrained)

Supported:

```text
scalar derived ratio → structuralMass → profile/render state → ember-like observation
```

Not supported as load-bearing (D-015B): participation, recognition, condensation-as-new-participant.

---

## Observations vs interpretation

| Observation | Interpretation (candidate) |
|---|---|
| Code comment links order to burn/ember | Palette design intent — not runtime law |
| `heat`, `ash`, `wither` computed per operation | Derived state model candidate |
| Condensation functions draw radial cores | Render mechanic named "condensation" |
| D-011 classifies condensation as runtime artefact | Not Atlas term creation |
| No `Ember` Atlas entry | Ember is observatory vocabulary, not grounded term |

---

## Classification (candidate model)

**Derived state model + visual metaphor** — viable as **documentation vocabulary** only until D-017B.

Not: standalone runtime engine, Atlas Ratio substitute, or promoted Calculus.

---

## D-016 gate status

| Stage | D-017A |
|---|---|
| Observe | **Prior** — D-011, D-012, D-010A |
| Document | **This commission** — `EMBER_RUNTIME_MODEL.md` |
| Falsify | **Pending** — D-017B |
| Compress | Pending |
| Align | Pending |
| Implement | **Not commissioned** |

---

## Acceptance

| Criterion | Status |
|---|---|
| No code changes | **Pass** |
| Ember model bounded | **Pass** |
| Metaphor separated from mechanic | **Pass** |
| Implementation constraints listed | **Pass** |
| D-017B falsification questions prepared | **Pass** |
| No theory promoted | **Pass** |
| No Atlas / Field edits | **Pass** |

---

## Unresolved (for D-017B)

1. Collapse ember vocabulary to profile scalar names?
2. Retire or keep dual `colourMode` (fire vs heat)?
3. Can ember model ever supersede graph in docs without falsifying O-4?
4. Steward: promote to runtime design principle or keep render read only?

---

**Status:** D-017A complete. Candidate model documented; falsification deferred to D-017B.
