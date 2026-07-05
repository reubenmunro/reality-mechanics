# Ember Runtime Model

**Runtime design document.** Commission D-017A — aligned per D-017B falsification.

**Mission:** Increase structural perception.

**Status:** Descriptive. Not authoritative. Not Calculus. Not implementation. **Ember not promoted.**

**Reports:** [`D-017A`](../reports/D-017A-ember-runtime-model.md) · [`D-017B`](../reports/D-017B-ember-runtime-falsification.md) (falsification)

**Related:** [`DERIVED_RATIO.md`](DERIVED_RATIO.md) (D-015); D-011, D-012, D-010A

---

## Classification (D-017B)

**Ember rejected as primary observable language.**

| Retained | Rejected |
|---|---|
| **Bounded visual metaphor** — fire palette, CSS `--ember`, order-hue burn comment | Ember as primary observable language |
| **Optional gloss** — human-facing read of glow, pulse, condensation visuals | Ember as runtime principle or Atlas term |
| **Profile state language** — mechanical observable layer | Ember replacing graph substrate |

**Do not promote Ember.** See D-017B for full falsification.

---

## Surviving model

Three layers — **never conflate**:

```text
Atlas
  ↓
Graph substrate          (structure: edges, layout, topology)
  ↓
Scalar derived ratio     (mass.carriers, ratioMode — D-015B)
  ↓
Profile state            (structuralMass, heat, ash, wither, compression, focus overlay)
  ↓
Canvas observation       (filaments, condensation cores, wake, alpha)
        ↑
  Frame / Focus          (parallel paths — not ember-derived)
```

**Ember** may appear only as **optional gloss** on a subset of canvas observation (glow, pulse, cooling visuals). It is **not** a layer in this chain.

---

## Commission question (D-017A → D-017B answer)

Does **ember** provide a more faithful runtime model than **graph/topography**?

| D-017A (provisional) | D-017B (aligned) |
|---|---|
| Partially — layered read, not replacement | **Mostly decorates** the runtime; **not** uniquely more faithful |
| Derived state + visual metaphor | **Profile state + graph** survive; ember demoted to optional gloss |

---

## Three-layer distinction

| Layer | What it is | Load-bearing? | Ember role |
|---|---|---|---|
| **1. Graph substrate** | D1 structure → operations, edges, layout rings | **Yes** — coupling, retrace, O-4 | **None** — ember cannot replace |
| **2. Derived runtime state** | Scalar ratio + profile scalars (`heat`, `ash`, `wither`, `structuralMass`, …) | **Yes** — mechanical observable language | **Do not rename as "ember state"** |
| **3. Canvas observation** | Condensation, filaments, wake, frame alpha | **Yes** — D-011, D-012 | Ember gloss **optional** on subset only |

| Separate bucket | Role |
|---|---|
| **Fire / ember palette** | **Visual metaphor only** — `FIRE_ORDERS`, `--ember` CSS |
| **Ember as Atlas term** | **Does not exist** |

**Rule:** Separate **metaphor** from **mechanic**. Profile scalars are the mechanical core; ember is not.

---

## 1. Mechanical reads — optional ember gloss

*Field mechanics from D-011/D-012. Ember column is **optional gloss only** — several entries **misleading** per D-017B.*

| Verb | Mechanic (authoritative) | Optional ember gloss | D-017B note |
|---|---|---|---|
| **holds** | gravity, anchor rhythm (O-6) | settling coals | Gloss OK; Atlas Hold ≠ weight |
| **carries** | continuation, outward bead (O-6) | transport heat | **Misleading** — availability ≠ flame |
| **traces** | returnForce, intermittent rhythm | return flicker | **Partial** — availability ≠ memory flame |
| **pairs** | resonance, reciprocal oscillation | two-body flicker | Gloss OK; edge still required (O-4) |
| **nests** | enclosure, flat edge (O-6) | enclosed glow | **Misleading** — 10 nest edges; no hierarchy |
| **cools** | endpointOnly, ash, decay, frame dim | cooling ember | Gloss OK; `colourMode: heat` |
| **ignites** | focus pulse, arrival glow, wake (O-1, O-9) | ignition | **Not from ratio alone** — navigation overlay |
| **condenses** | condensationPath, compression halo (O-1–O-3) | condensed core | Mechanic; not new participant |
| **becomes fire** | `colourMode: fire`, order hue | full burn | **Visual metaphor only** |

---

## 2. RM terms — ember expressiveness (D-017B corrected)

*Ember is not the primary read. Profile + graph terms are.*

| RM term | Primary observable language | Ember gloss |
|---|---|---|
| **Hold** | gravity basin, anchor rhythm | optional |
| **Carry** | filament travel, outward ring (D-011) | **avoid** — misreads availability |
| **Trace** | return rhythm, wake recurrence (O-9) | optional, bounded |
| **Ratio** | scalar derived ratio, structuralMass (D-015B) | **avoid** — not temperature |
| **Order** | layout depth, bias tables, hue palette (O-7) | fire palette = metaphor only |
| **Coupling** | explicit edges (O-4) | **avoid** — ember suggests heat-bonding |
| **Nesting** | flat nest edge, circulation rhythm | **avoid** — too sparse (10 edges) |
| **Resolution** | `profile.resolution`, damping | partial; ≠ Atlas Resolution |
| **Ark** | *unsupported live* (retired) | **avoid** |

---

## 3. What ember is (post-falsification)

| Option | D-017B verdict |
|---|---|
| Primary observable language | **Rejected** |
| Standalone runtime model | **Rejected** |
| Derived state model named "ember" | **Rejected** — use **profile state** |
| Bounded visual metaphor | **Retained** |
| Optional gloss on canvas subset | **Retained** |

**Compressed principle (not promoted):** one profile state vector expresses multiple stable observable regimes on the same graph substrate. Ember names a **subset** of those regimes for human reading only.

---

## 4. Relation to Derived Ratio

```text
holds/traces in-degree → mass.carriers → ratioMode → structuralMass → profile state → canvas observation
```

| Stage | Role |
|---|---|
| Scalar derived ratio | `mass.carriers`, `ratioMode` (D-015B) |
| Profile state | `heat`, `ash`, `wither`, `continuation`, `structuralMass`, … |
| Canvas observation | pulse, condensation, endpointOnly, wake |
| Ember gloss | **Optional** label on glow/cool/pulse subset only |

**Not supported (D-015B, D-017B):** participation, recognition, ignition from ratio alone, condensation-as-new-participant.

Parallel paths: **focus**, **frame**, **direct edges** (O-4, O-5, O-7).

---

## 5. Metaphor separated from mechanic

| Metaphor (retained, bounded) | Mechanic (authoritative) |
|---|---|
| "Ember at ground" comment | `FIRE_ORDERS.ground` |
| `--ember` CSS | Typography |
| "Becomes fire" | `colourMode === 'fire'` |
| Optional "ignition" gloss | focus + `arrivalGlow` + wake |
| Optional "cooling" gloss | `endpointOnly` + ash |
| Condensation creates participant | **Rejected** (D-011, D-015B, D-017B) |

Future implementation must not encode ember metaphor as Atlas structure.

---

## 6. Implementation constraints

| Constraint | Source |
|---|---|
| Graph substrate not replaceable by ember | D-010A, D-017B Inv.1 |
| No Atlas term "Ember" | D-017A/B |
| Primary language = profile state + graph | D-017B |
| Ember gloss optional, never load-bearing | D-017B |
| Derived Ratio mass rule locked | D-015B |
| Retrace cites structure + ratio + overlay | D-012 |
| D-016 gate before any promotion | D-016 |

---

## 7. D-017B outcomes (summary)

| Investigation | Result |
|---|---|
| Ember replace graph? | **No** |
| Ember primary language + graph substrate? | **Profile state primary**; ember label rejected |
| Ember uniquely suitable? | **No** — phase/wave/magnetism alternatives often better |
| Discovery = ember? | **No** — multi-state profile on graph |
| Ratio → full ember set without extra mechanics? | **No** — focus, frame, layout required |
| D-011 fidelity via ember? | **Partial** — Carry/Trace/Coupling forced |
| Failure cases | **Systematic** — see D-017B §7 |
| Compression | **Runtime terms smaller** than ember vocabulary |

Full report: [`D-017B-ember-runtime-falsification.md`](../reports/D-017B-ember-runtime-falsification.md)

---

## 8. Unknowns (preserved)

- Whether `colourMode: heat` vs `fire` should be documented as preferred visual metaphor.
- Whether profile-state vocabulary gets a separate design doc (without ember in the title).
- Steward: any future commission to rename UI copy — not authorised here.

---

## References

| ID | Document |
|---|---|
| **D-017B** | [`docs/reports/D-017B-ember-runtime-falsification.md`](../reports/D-017B-ember-runtime-falsification.md) |
| D-017A | [`docs/reports/D-017A-ember-runtime-model.md`](../reports/D-017A-ember-runtime-model.md) |
| D-015 | [`DERIVED_RATIO.md`](DERIVED_RATIO.md), D-015B |
| D-014 | [`RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md) |
| D-011, D-012, D-010A | Field evidence |
| D-016 | Discovery-to-implementation gate |

---

**Status:** Aligned with D-017B. Ember rejected as primary observable language; bounded metaphor/gloss only. Surviving model: graph + scalar derived ratio + profile state + canvas observation. No code or Atlas changes.
