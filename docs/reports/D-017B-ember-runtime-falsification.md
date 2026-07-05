# D-017B — Ember Runtime Model Falsification

**Programme:** Runtime  
**Type:** Falsification  
**Date:** 2026-07-05  
**Target:** [`docs/runtime/EMBER_RUNTIME_MODEL.md`](../runtime/EMBER_RUNTIME_MODEL.md) (D-017A)  
**Evidence:** D-010A, D-011, D-012, D-014, D-015B, D-017A, Field runtime code  
**Method:** Attempt to falsify Ember as primary observable language. Not defend. No implementation.

---

## Recommendation

| Outcome | **Reject Ember as primary observable language** |
|---|---|
| **Retain** | **Derived-state documentation vocabulary** (bounded) + **visual metaphor** (fire palette, CSS) |
| **Do not promote** | Ember as runtime principle, Atlas term, or Calculus read |
| **Compress to** | **Profile state language** as the mechanical observable layer; graph as structural substrate |

**Central question answered:** Ember **mostly decorates** the current runtime. It does **not** provide a uniquely more faithful observable language for Reality Mechanics overall. It is **partially faithful** for intensity, condensation, and cooling reads — and **misleading** for coupling, nesting, boundaries, frame, and Ark.

**Preferred outcome achieved:** smallest explanation survives — not Ember as primary label, but **graph + scalar derived ratio + profile state → canvas observation**.

---

## Three-layer distinction (preserved)

| Layer | Current implementation | Ember conflation risk |
|---|---|---|
| **1. Structural substrate** | Graph, edges, layout, topology (D-010A) | Ember cannot replace |
| **2. Derived runtime state** | `mass.carriers`, `ratioMode`, `structuralMass`, `heat`, `ash`, `wither`, compression, focus | Ember **renames** this layer — does not replace it |
| **3. Observable language** | Candidate: Ember | **Falsified as primary** — profile scalars + D-011 behaviour names are smaller and retraceable |

**Rule:** Never conflate layers. Ember is at most a **read** of layer 2–3, not layer 1.

---

## Investigation One — Can Ember replace the graph?

### Falsification attempt

If Ember were the runtime model, edge existence, coupling, layout rings, and retrace would be expressible without graph adjacency.

### Evidence

| Fact | Source |
|---|---|
| Coupling visible **only where structure declares edges** | D-011 O-4 |
| Relations are explicit Bézier graph edges, not particles | D-010A |
| Nesting is flat `nests[]` edge type — no scene graph | D-010A |
| `unexpected_ratio` when navigation lacks declared edge | D-012, P2 |
| Condensation halos **hide** edges — do not replace adjacency | D-011 O-2 |
| Home field draws static graph underlay | D-011 O-8 |

### Contradiction

Ember vocabulary has **no mechanic** for adjacency, edge declaration, or explicit coupling. "Ignition" and "condensation" are **node render states**, not relation topology.

### Verdict

**Falsified.** Ember **cannot** replace the graph.

**Why:** Structural perception of *where relation is declared* requires substrate visibility. Ember obscures edges under compression (O-2) without substituting structural read.

---

## Investigation Two — Primary observable language with graph substrate?

### Candidate chain (commission)

```text
Atlas → Graph → Derived Ratio → Profile State → Observable Ember Behaviour
```

### Falsification attempt

Is this chain **better supported** than D-017A's "derived state + visual metaphor on graph"?

### Evidence for layered chain

| Link | Supported? |
|---|---|
| Atlas → Graph | **Yes** — D1 structure → operations/edges |
| Graph → Derived Ratio | **Partial** — mass from holds/traces in-degree only (D-015B) |
| Derived Ratio → Profile State | **Yes** — `structuralMass` modulates `computeProfile` outputs |
| Profile State → Ember observation | **Partial** — heat/ash/pulse/condensation render |

### Evidence against "Observable Ember Behaviour" as primary label

| Issue | Source |
|---|---|
| D-012 retraces behaviours without ember ontology | cites `mass.carriers`, `ratioMode`, overlay fields |
| D-011 classifications use runtime artefact names, not ember | O-1 focus condensation, O-2 ratio compression |
| Parallel paths bypass ember read | O-4 edges, O-5 frame, O-7 layout |
| "Ember behaviour" is **interpretation** of profile + canvas | not separate module |

### Compressed chain (smaller, lossless)

```text
Atlas → Graph → Scalar Derived Ratio → Profile State → Canvas Observation
                                                      ↑
                                            Frame / Focus (parallel)
```

### Verdict

**Partially falsified.** The **middle chain survives**; **"Observable Ember Behaviour" as primary term does not** — it adds vocabulary without adding retrace precision.

**Better supported read:** Profile state is the observable **mechanical** language; ember is optional **human-facing gloss** for subset of canvas effects.

---

## Investigation Three — Why Ember? Alternative phenomena

### Falsification attempt

Is Ember **uniquely** suitable, or do other phenomena express RM better?

| Alternative | RM fit | vs Ember |
|---|---|---|
| **Water** (ice / liquid / vapour) | Phase transitions from shared substance; maps to discrete/transitional/continuous ratio bands + cooling | **Stronger** for "multiple stable states through one mechanic" — already partially implemented as heat/ash/wither, not ember-specific |
| **Magnetism** (alignment / field) | Reference frames dim out-of-frame terms (O-5); sensibility inheritance on relations | **Stronger** for coupling visibility under frame — no ember mechanic |
| **Wave propagation** | Bézier filaments, bead travel, rhythm expressions (O-6) | **Equal or better** for Carry/Trace **without** combustion connotation |
| **Plant growth** (seed → shoot → branch) | Dependency order, `ORDER_DEPTHS`, spine — not heat-based | **Better** for Order/dependency read; weak ember fit |
| **Crystal growth** | Condensation cores, radial symmetry | **Equal** for condensation visual — risks same misread (growth ≠ new participant) |
| **Ant colonies** | Traversal emphasis, recurrence (O-9) | **Equal** for path reinforcement — no fire implied |

### Observations

- Field code already uses **heat/ash/wither**, not an `Ember` state machine.
- `colourMode: 'heat'` is literally **ember↔ash** — but `colourMode: 'fire'` default is **order-hue burn**, which is **not** ember physics.
- Atlas **Carry** = forward **availability**, not flame transport — wave/travel read is more faithful (D-011 carry recognition).

### Contradiction to "Ember uniquely suitable"

Ember over-indexes on **combustion** imagery. RM terms **Hold**, **Clearance**, **Connection**, **Resolution** are stability/support reads — water phase + wave + magnetism cover more of the observation set with **less semantic damage**.

### Verdict

**Falsified** — Ember is **not uniquely** suitable.

**No single alternative wins entirely.** Closest compressed competitor for Investigation Four: **phase/state transition language** (water-like), not ember specifically.

**Why Ember remained in D-017A:** Existing code comments, CSS `--ember`, condensation/glow visuals — **implementation history**, not structural necessity.

---

## Investigation Four — Ember vs "one mechanic, multiple stable states"

### Falsification attempt

Is the discovery **Ember**, or **one mechanic expressing multiple stable states**?

### Evidence

| Observation | Interpretation |
|---|---|
| `ratioMode` bands: discrete / transitional / continuous | One scalar → multiple stable render regimes |
| `endpointOnly` vs full wrinkle field | Same operation, different visibility state |
| `colourMode` fire vs heat | Same profile, different palette read |
| Focus vs non-focus | Same graph node, different observation state |
| D-014 convergence | One recursive mechanic — translation under movement |

### Verdict

**The important discovery is not Ember.**

**Compressed principle (candidate, not promoted):**

> **One derived state vector (profile + ratio mass) expresses multiple stable observable regimes under the same graph substrate.**

Ember is an **implementation candidate / visual gloss** for a **subset** of those regimes (warm, cool, glow, condense). It is **not** the runtime principle.

---

## Investigation Five — Derived Ratio → ember phenomena without extra mechanics?

### Falsification matrix

| Phenomenon | From scalar derived ratio alone? | Additional mechanics required |
|---|---|---|
| **Warming** | **Partial** — `structuralMass` + `continuation` → `heat` via `computeProfile` | Edge counts, order bias, settledness |
| **Cooling** | **Partial** — mass reduces pulse; `endpointOnly` | `fieldPressure`, neighbourhood `localCount`, frame dimming |
| **Glow** | **Partial** — heat alpha × radial gradient | Focus flag, `colourMode`, order hue |
| **Fading** | **Partial** — ash, decay, alpha | Frame membership (O-5), homeAlpha fade (O-8) |
| **Condensation** | **Partial** — mass → compression limit | Focus anchor (O-1), render budget, `condensationPath` |
| **Ignition** | **Falsified from ratio alone** | Focus entry, movement wake (O-9), `arrivalGlow` — **navigation overlay** |

### Exact break points

1. **Focus** — not derived from ratio; participant navigation state (O-1, O-9).
2. **Reference frame** — alpha 0.08 out-of-frame (O-5) — P4 path, not ratio.
3. **Layout rings** — relation role offsets (O-7) — graph/layout, not ember.
4. **Settledness / maturity** — feed `structuralMass` and `resolution` — parallel reads, not carriers alone (D-015B).

### Verdict

**Falsified** — scalar derived ratio **cannot** produce the full ember phenomenon set without **focus, frame, layout, and parallel maturity reads**.

Ember language **hides** these dependencies.

---

## Investigation Six — Behavioural fidelity (D-011)

| Behaviour | Ember natural? | Forced interpretation? |
|---|---|---|
| **Condensation** | **Medium** — radial cores fit | Confounded with focus artefact (O-1) |
| **Carry** | **Low** — "transport heat" misreads availability | D-011: motion on **filament**, not node; ember suggests burning along edge |
| **Trace** | **Medium** — intermittent flicker | Atlas Trace = backward availability; ember suggests memory flame not retrace |
| **Wake** | **Medium–high** | Navigation artefact — ember OK for glow decay |
| **Pulse** | **High** | Focus + heat — fits |
| **Fading** | **High** | endpointOnly, frame — fits |
| **Recurrence** | **Medium** | Traversal emphasis — ember "re-ignition" overstates |

### Verdict

**Partially falsified.** Ember **forces interpretation** for **Carry**, **Trace**, and **Coupling** (edge visibility vs glow).

D-011 behaviour names (`focus condensation`, `ratio compression`, `explicit-edge coupling`) are **more faithful** observables than ember verbs.

---

## Investigation Seven — Failure cases (Ember misleads)

| RM area | Why Ember obscures | Evidence |
|---|---|---|
| **Coupling** | Suggests heat-bonding; coupling is **declared edge** + optional dimming | O-4, O-5 |
| **Nesting** | Suggests enclosed fire; nesting is **flat edge** + circulation rhythm; 10 edges | D-011 nesting section, D-010A |
| **Boundaries** | Suggests physical membrane; boundaries are **compression + alpha** artefacts | D-011 boundaries |
| **Order** | Suggests burn temperature hierarchy; order is **bias tables + layout depth + hue palette** | O-7; governance order ≠ fire order |
| **Frame** | Suggests field line; frame is **practice reference filter** | O-5, P4 |
| **Resolution** | Suggests extinguishment; runtime `resolution` scalar + arrival glow ≠ Atlas Resolution | `computeProfile.resolution` |
| **Ark** | Suggests vessel/preservation through fire | Ark API **retired**; no live ember path (D-014) |
| **Ratio** | Suggests temperature proportion; Derived Ratio is **carrier in-degree scalar** (D-015B) | Not Atlas Ratio |
| **Hold** | Suggests grasping coal; Atlas Hold = **resolution supportability** | Hold.md vs gravity basin |
| **Condensation → participant** | Suggests new entity forming | **Rejected** D-011, D-015B |

### Verdict

**Falsified as primary language** — failure cases are **systematic**, not edge cases.

---

## Investigation Eight — Compression analysis

### A. Current runtime terminology (smaller?)

**Core terms:** graph edge, operation, focus, `mass.carriers`, `ratioMode`, `structuralMass`, `heat`, `ash`, `wither`, `endpointOnly`, `relationCompressionLimit`, frame alpha, movement event.

**Properties:** directly in code; D-012 retrace; D-011 observation IDs.

### B. Ember runtime vocabulary

**Additional terms:** ember, ignite, cool, become fire, condensation (ambiguous with O-1/O-2), transport heat, enclosed glow, re-ignition…

**Properties:** interpretive mapping layer; duplicates profile scalars; conflates palette with state.

### Count / complexity

| Metric | Runtime terms | Ember vocabulary |
|---|---|---|
| Retrace precision | **High** (D-012) | **Low** — must translate back to scalars |
| Atlas term fidelity | **Medium** — gaps documented | **Low** — systematic mismatches (table §7) |
| Concept count for same behaviours | ~12 mechanical | ~18+ metaphorical |
| New ontology | **None** | **Risk** — "Ember" as pseudo-term |

### Verdict

**Ember increases conceptual complexity** without reducing mechanical description.

**Smaller explanation:** **A wins.** Ember fails compression-without-loss as **primary** language.

---

## Observations (summary)

1. Graph substrate is load-bearing; ember is not.
2. Profile scalars (`heat`, `ash`, `wither`, `structuralMass`) already implement multi-state expression.
3. Ember maps partially to canvas effects; not to Atlas relation semantics.
4. Default `colourMode: fire` is order-hue metaphor — **not** ember-first in live UI.
5. D-011 + D-012 provide behaviour vocabulary without ember.
6. Focus and frame are non-ember paths essential to observed behaviour.

---

## Contradictions (summary)

| D-017A claim | D-017B falsification |
|---|---|
| Ember helps RM sensibility overall | **Partial only** — hurts coupling, carry, nesting, Ark reads |
| Derived state + visual metaphor | **Survives** — but "ember" is not the best name for derived state |
| Ember as observable language candidate | **Primary role falsified** |
| Ratio → ember-like observation | **Survives with constraints** — profile state, not ember ontology |

---

## Alternative candidates (ranked)

| Rank | Observable language candidate | Role |
|---|---|---|
| 1 | **Profile state** (heat, ash, mass, compression, focus overlay) | Mechanical observable layer — **smallest** |
| 2 | **Phase transition** (water metaphor) | Human gloss for ratio bands + cooling — **better than ember** for multi-state |
| 3 | **Wave / filament** | Carry, Trace rhythm — **better for availability** reads |
| 4 | **Ember** | **Bounded gloss** for glow, pulse, condensation visuals only |
| 5 | **Fire palette** | **Visual metaphor only** — order colour |

---

## Possible outcomes — verdict table

| Outcome | Applicable? |
|---|---|
| Reject Ember | **Yes** — as primary observable language |
| Retain visual metaphor only | **Yes** — fire palette, CSS, comments |
| Retain derived state language | **Partial** — rename to **profile state language**; ember optional gloss |
| Promote Ember as primary | **No** |
| Remain Unknown | **No** — sufficient evidence to classify |

---

## Alignment actions (for steward — not implemented here)

Per D-016 gate after falsification:

| Stage | Suggested next step |
|---|---|
| **Compress** | Primary observable language = **profile state + graph**; ember demoted to optional gloss |
| **Align** | Update `EMBER_RUNTIME_MODEL.md` header classification (separate commission or steward edit) |
| **Implement** | **Not authorised** by D-017B |

---

## D-016 gate status

| Stage | Status |
|---|---|
| Observe | Done (D-011, D-012, D-010A) |
| Document | Done (D-017A) |
| Falsify | **Done (this report)** |
| Compress | **Recorded above** — profile state + graph |
| Align | Pending steward |
| Implement | Not commissioned |

---

## Acceptance

| Criterion | Status |
|---|---|
| Ember actively challenged | **Pass** |
| Alternatives compared | **Pass** |
| Graph/runtime distinction preserved | **Pass** |
| No implementation / Atlas changes | **Pass** |
| Observations vs interpretation separated | **Pass** |
| Smallest explanation preferred | **Pass** — runtime terminology over ember primary |

---

## References

| ID | Document |
|---|---|
| D-017A | [`docs/runtime/EMBER_RUNTIME_MODEL.md`](../runtime/EMBER_RUNTIME_MODEL.md) |
| D-017A | [`D-017A-ember-runtime-model.md`](D-017A-ember-runtime-model.md) |
| D-015B | [`D-015B-derived-ratio-falsification.md`](D-015B-derived-ratio-falsification.md) |
| D-011 | [`D-011-emergent-behaviour-observations.md`](D-011-emergent-behaviour-observations.md) |
| D-012 | [`D-012-behaviour-retrace-instrument.md`](D-012-behaviour-retrace-instrument.md) |
| D-010A | [`D-010A-runtime-audit.md`](D-010A-runtime-audit.md) |
| D-014 | [`RUNTIME_PRINCIPLES.md`](../practice/RUNTIME_PRINCIPLES.md) |

---

**Status:** D-017B complete. **Reject Ember as primary observable language.** Retain bounded ember/ fire as visual metaphor; compress observable language to **profile state + graph substrate**.
