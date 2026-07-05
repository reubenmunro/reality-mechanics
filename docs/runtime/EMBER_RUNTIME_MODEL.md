# Ember Runtime Model

**Runtime design document.** Commission D-017A — candidate model only.

**Mission:** Increase structural perception.

**Status:** Descriptive. Not authoritative. Not Calculus. Not implementation. **Not promoted theory.**

**Report:** [`docs/reports/D-017A-ember-runtime-model.md`](../reports/D-017A-ember-runtime-model.md)

**Related:** [`DERIVED_RATIO.md`](DERIVED_RATIO.md) (D-015); D-011, D-012, D-010A Field evidence

---

## Commission question

Does **ember** provide a more faithful runtime model than **graph/topography** for making Reality Mechanics sensible?

**Provisional answer (D-017A):** **Partially — as a layered read, not a replacement.**

The Field already combines:

1. **Graph/topography** — explicit edges, ring layout, flat adjacency (D-010A).
2. **Ember-like derived state** — `heat`, `ash`, `wither`, condensation cores, pulse, wake, fire palette (code + D-011).
3. **Scalar derived ratio** — `structuralMass` modulates ember expression (D-015B).

Ember language **describes render state and visual condensation** more faithfully than it replaces the graph engine. A full ember runtime model is **candidate only** — falsification reserved for D-017B.

---

## Bounding the model

| Layer | What it is | Load-bearing? |
|---|---|---|
| **Graph/topography** | D1 structure → operations, edges, layout rings | **Yes** — mechanical source of coupling and edge existence |
| **Profile / physics scalars** | `computeProfile` → heat, ash, gravity, continuation, etc. | **Yes** — derived state driving render intensity |
| **Condensation / glow / pulse** | Canvas radial cores, filaments, wake | **Yes** — observable behaviour (D-011, D-012) |
| **Fire / ember palette** | Order-hue colour; CSS `--ember`; comment metaphor | **Visual metaphor** — not separate simulation entity |
| **Ember as Atlas term** | **Does not exist** as grounded term in repository | **N/A** |

**Rule:** Separate **metaphor** (fire palette, "ember at ground" comment) from **mechanic** (profile scalars, condensation functions, ratio-modulated mass).

---

## 1. Mechanical reads — relation verbs on an operation

*Candidate mapping from current Field code and D-011 observations. Not Atlas definitions.*

Each row: what the runtime **does** when an operation (term) participates in that relation type or state transition.

### holds

| | |
|---|---|
| **Mechanic** | `op.holds.length`, `incoming.holds` → `gravity`, anchor basin weights; hold rhythm: sustained midpoint, low wiggle (D-011 O-6) |
| **Ember read** | **Weight / anchor** — ember settles; higher gravity, lower motion |
| **Metaphor vs mechanic** | Mechanic (profile + rhythm). Ember = settling coals |

### carries

| | |
|---|---|
| **Mechanic** | `op.carries.length`, `incoming.carries` → `continuation`; carry rhythm: outward-progressing bead (O-6); `physics.velocity`, `physics.heat` |
| **Ember read** | **Transport** — heat and forward motion along filament |
| **Metaphor vs mechanic** | Mechanic. "Carry" in Atlas ≠ literal flame transport |

### traces

| | |
|---|---|
| **Mechanic** | `op.traces.length`, `incoming.traces` → `returnForce`; trace rhythm: intermittent return, high wiggle (O-6); contributes to `wither` |
| **Ember read** | **Return flicker** — intermittent glow along remembered path |
| **Metaphor vs mechanic** | Mechanic for rhythm; ember metaphor for intermittence |

### pairs

| | |
|---|---|
| **Mechanic** | `op.pairs.length` → `resonance`; pair rhythm: reciprocal oscillation around midpoint (O-6) |
| **Ember read** | **Two-body flicker** — lateral answering pulse |
| **Metaphor vs mechanic** | Mechanic. Coupling visibility still requires declared edge (O-4) |

### nests

| | |
|---|---|
| **Mechanic** | `op.nests.length` → `enclosure`; nest rhythm: slow containment circulation (O-6); **flat edge only** — no scene graph (D-010A) |
| **Ember read** | **Enclosed glow** — inward bow, circulation |
| **Metaphor vs mechanic** | Partial mechanic; nest under-observed (D-011 gap) |

### cools

| | |
|---|---|
| **Mechanic** | `endpointOnly` render; `ash`, `decay`, `wither`; `structuralMass` reduces pulse depth, wrinkle count, heat alpha; frame dimming to 0.08 (O-3, O-5) |
| **Ember read** | **Cooling ember** — small core, reduced glow spread, ash gradient |
| **Metaphor vs mechanic** | **Strong mechanic** — `colourMode: 'heat'` explicitly maps ember↔ash |

### ignites

| | |
|---|---|
| **Mechanic** | Focus entry: enlarged radius, pulse, arrival glow (`drawOperation` focus branch); movement wake on navigation (O-1, O-9); `movementHeat`, warm wake colours |
| **Ember read** | **Ignition** — sudden bright core + pulse |
| **Metaphor vs mechanic** | Mechanic tied to **focus state** + navigation — not spontaneous combustion from structure alone |

### condenses

| | |
|---|---|
| **Mechanic** | `condensationPath`, `fillCondensation`, `strokeCondensation`; focus condensation (O-1); high-mass `relationCompressionLimit` → `compressedRelationField` halo (O-2); endpoint-only cores (O-3) |
| **Ember read** | **Condensed core** — radial gradient replaces many filaments |
| **Metaphor vs mechanic** | Mechanic. D-011/D-015B: **not** new participant creation |

### becomes fire

| | |
|---|---|
| **Mechanic** | `colourMode: 'fire'`: order-hue palette (`FIRE_ORDERS`); `burn = fr.l * (0.6 + physics.heat * 0.72)`; filaments and beads use `fireColor` / `fireMix` |
| **Ember read** | **Full burn** — order read as single burn (code comment: ember at ground → white-hot higher → cool home) |
| **Metaphor vs mechanic** | **Primarily visual metaphor** on top of profile scalars; not a state machine named "fire" |

---

## 2. RM terms — natural expression via ember read

*Candidate fit only. Not promotion.*

| RM term | Ember expressiveness | Evidence | Gap |
|---|---|---|---|
| **Hold** | **Medium** | Gravity, anchor rhythm, sustained filament | Atlas Hold = resolution supportability; runtime = render weight |
| **Carry** | **Medium** | Continuation, outward bead, heat | Atlas Carry = forward availability; runtime = motion profile |
| **Trace** | **Medium–high** | Return force, intermittent rhythm, wake recurrence (O-9) | Trace emphasis decays; not full retrace persistence |
| **Ratio** | **Medium** | `structuralMass` dampens pulse, wrinkles, heat; drives compression (O-2) | Derived Ratio is scalar — not Atlas Ratio (D-015B) |
| **Order** | **High (visual)** | `FIRE_ORDERS`, `ORDER_DEPTHS`, ring band offsets (O-7) | Order as governance ≠ order as hue |
| **Ark** | **Unsupported live** | Ark API retired (D-010A, D-014) | Practice prose only |
| **Coupling** | **Low for ember** | Explicit edges (O-4); frame dimming (O-5) | No ember-specific coupling physics |
| **Nesting** | **Low–medium** | Enclosure scalar + nest rhythm; 10 nest edges in population | No hierarchical nest transform |
| **Resolution** | **Medium** | `profile.resolution`, arrival glow on focus, damping | Runtime resolution scalar ≠ Atlas Resolution term completely |

**Summary:** Ember language fits **intensity, condensation, cooling, pulse, and order-colour** better than it fits **coupling, nesting hierarchy, or Ark**.

---

## 3. Classification — what ember is

| Option | Verdict (D-017A) |
|---|---|
| **Only a visual metaphor** | **Partially true** — fire palette, CSS ember, burn comment |
| **A runtime model** | **Not standalone** — no `Ember` entity; operations + profile + canvas |
| **A derived state model** | **Best fit** — `heat` / `ash` / `wither` / `structuralMass` / condensation renders derived from structure + ratio + focus |
| **Unsupported analogy** | **Partially true** for Atlas term mapping and participation/recognition chains |

**Compressed classification:** **Derived state model + visual metaphor**, operating **on** graph/topography — not a replacement for it.

### vs graph/topography

| Graph/topography (current) | Ember layer (current) |
|---|---|
| Edge existence, Bézier filaments | Glow, pulse, condensation cores |
| Ring layout by relation role | Radial gradients, wrinkle fields |
| Flat adjacency index | Heat/ash profile scalars |
| Structure invariant | Ratio-modulated render intensity |

**More faithful for RM sensibility?** Ember helps **participants feel** state, trace, carry, condensation. Graph helps **participants see** declared structure. Neither alone matches full Atlas prose.

---

## 4. Relation to Derived Ratio

*Constrained hypothesis — D-015B bounds.*

D-015B established:

```text
holds/traces in-degree → mass.carriers → ratioMode → structuralMass → render behaviour
```

### Ember layer in that chain

| Stage | Ember-relevant effect |
|---|---|
| Scalar derived ratio | `structuralMass` input |
| Profile | `continuation`, `density`, `turbulence` feed `heat`, `wither`, `ash` |
| Render | Pulse depth `(1 - structuralMass * 0.46)`; wrinkle reduction; compression halo |

### Three-link hypothesis (constrained — not promoted)

| Link | D-017A read |
|---|---|
| Ratio changes state | **Supported mechanically** — ratio → `structuralMass` → profile/render scalars |
| State changes participation | **Not supported as load-bearing** — participation undefined (D-014, D-015B) |
| Participation changes observable behaviour | **Replace with:** state changes **observable render** (pulse, condensation, endpoint-only) |

**Accurate chain for investigation:**

```text
Scalar derived ratio → structuralMass / profile state → ember-like observable behaviour
```

Parallel paths still apply: focus, frame, direct edges (D-015B).

---

## 5. Metaphor separated from mechanic

| Metaphor | Mechanic |
|---|---|
| "Ember at ground" (comment) | `FIRE_ORDERS.ground` HSL values |
| `--ember` CSS brand colour | Typography only |
| "Becomes fire" | `colourMode === 'fire'` + `physics.heat` brightness |
| "Ignition" | Focus + `arrivalGlow` + movement wake |
| "Cooling" | `endpointOnly` + ash gradient |
| "Condensation creates participant" | **Rejected** — render budget + focus (D-011, D-015B) |

Future implementation must not encode metaphor as Atlas structure.

---

## 6. Implementation constraints

*Architectural only — no authorisation to implement in D-017A.*

| Constraint | Rationale |
|---|---|
| Ember model must not replace graph adjacency | D-010A; O-4 explicit edges |
| No new Atlas term "Ember" without steward commission | D-017A scope |
| Condensation ≠ recognition / new participant | D-011, D-015B |
| Derived Ratio mass rule unchanged unless commissioned | holds/traces in-degree only |
| Distinguish `colourMode` palette from profile mechanics | Metaphor vs state |
| Retrace must cite structure + ratio + overlay | D-012 |
| Ark not live runtime evidence | D-014 |
| D-017B falsification required before promotion | D-016 gate |
| Implement only after Observe→Align if commissioned | D-016 |

---

## 7. Falsification questions (for D-017B)

1. Does any Field behaviour **require** ember ontology, or only graph + scalar ratio?
2. Is `heat`/`ash`/`wither` redundant with `structuralMass` — can one be collapsed?
3. Does ember language **mislead** for Hold/Carry/Trace (availability vs glow)?
4. Can order-colour fire palette be removed without losing structural perception?
5. Does condensation track carrier mass **without** focus artefact (O-1 confound)?
6. Is nest ember read supported with only 10 nest edges?
7. Does ember model add mechanics or only rename existing render formulas?
8. Would ember-as-model violate D-015B constraints on participation/recognition?
9. Is graph/topography **more faithful** for coupling and retrace than ember?
10. Should ember remain **render vocabulary** only, never runtime principle?

---

## 8. Unknowns (preserved)

- Whether ember should become a named runtime design principle after D-017B.
- Whether `colourMode: heat` (ember↔ash) is truer to RM than `colourMode: fire` (order-hue).
- Whether profile scalars should be documented as the mechanical core with ember as read-only vocabulary.
- Whether a future model merges graph + ember state without new ontology.

---

## References

| ID | Document |
|---|---|
| D-017A | [`docs/reports/D-017A-ember-runtime-model.md`](../reports/D-017A-ember-runtime-model.md) |
| D-015 | [`DERIVED_RATIO.md`](DERIVED_RATIO.md), D-015B report |
| D-014 | [`RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md) |
| D-011 | Emergent behaviour observations |
| D-012 | Behaviour retrace instrument |
| D-010A | Field runtime audit |
| D-016 | Discovery-to-implementation gate |
| Runtime | `.atlas-publisher/main-website-worker.js` — `computeProfile`, `drawOperation`, `FIRE_ORDERS` |

---

**Status:** Candidate model documented. Await D-017B falsification. No code, Atlas, or promotion changes.
