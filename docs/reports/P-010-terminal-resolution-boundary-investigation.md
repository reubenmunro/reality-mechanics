# P-010 — Terminal Resolution Boundary Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new public surfaces, no new primitives)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-009 (`docs/reports/P-009-participation-threshold-investigation.md`), O-002 (`docs/reports/O-002-fabric-renderer-architecture.md`)  
**Core hypothesis (tested):** When a process reaches a **terminal resolution boundary**, the **reference frame** changes. Frame change alters **behaviour** and **resolution rate** while **underlying structure** remains invariant. This may explain phase-like transitions without importing material physics.

**Protected principle:**

> The structure may remain invariant while the frame of resolution changes.

**Method:** Atlas `needs` / `conditions` / `reads` / `order_terminal` blocks; runtime cross-check against P-003 layer contract only. Commission examples are intuition, not proof.

---

## Verdict

| Question | Result |
|---|---|
| Does RM support terminal resolution changing reference frame? | **Partial** — Atlas yes; runtime frame switch yes; order-terminal events not wired |
| Does frame change alter behaviour without structure change? | **Yes** — explicit in Reference Frame + P-003 cross-cut |
| Does frame change alter resolution rate? | **Partial** — Atlas Resolution Rate is contextual; no L2 invariant register |
| Is “phase change” a valid translation? | **Partial** — valid as **read-frame / order-lift** gloss; invalid as material physics |
| Recommendation (§9) | **Partial — supported in principle, synthesis not promoted term** |

**Bottom line:** Reality Mechanics **supports the protected principle**. **Resolution** (first-order order-terminal), **Terminal**, **Order-Terminal**, **Closure Scope**, and **Reference Frame** form a coherent chain: a read completes at scope, continuation crosses closure the current read cannot follow, and what continues must be **re-entered, restarted, or lifted into another order** — which is a **reference-frame / closure-scope change**, not a structure edit. **Behaviour** and **appearance** follow; **L2 ratio register** does not rewrite on frame switch (P-003, P-004). **“Terminal resolution boundary”** is a **commission synthesis**, not an Atlas term.

---

## 1. Atlas diagnosis

### 1.1 Commission term inventory

| Term | Atlas entry | Order | Role at resolution boundary |
|---|---|---:|---|
| **Resolution** | `1_First/Resolution.md` | first | Bearing determined at current scope **without terminating wider relation**; **order-terminal of first order** |
| **Terminal** | `2_Second/Closure Conditions/Terminal.md` | second | Read stops where continuation crosses **closure scope** current read cannot follow |
| **Order-Terminal** | `2_Second/Closure Conditions/Order-Terminal.md` | second | Readable length completes within an order; cannot continue as **same read** |
| **Boundary** | `1_First/Boundary.md` | first | Located distinction; passage condition for closure, threshold, terminal |
| **Closure Scope** | `2_Second/Closure Scope.md` | second | Bounded extent within which a read can be evaluated as holding |
| **Reference Frame** | `2_Second/Produced Distinctions/Reference Frame.md` | second | Nested placement making ratio answerable; **alias: Frame** |
| **Rate** | `2_Second/Carrying Conditions/Rate.md` | second | Relation read against interval |
| **Resolution Rate** | `2_Second/Carrying Conditions/Resolution Rate.md` | second | Meaningful distinction resolved per continuation while trace holds |
| **Frequency** | `2_Second/Carrying Conditions/Frequency.md` | second | Countable return as rate |
| **Rhythm** | `2_Second/Participation Conditions/Rhythm.md` | second | Patterned recurrence through interval; readable again at **boundaries** |
| **Pulse** | **None** | — | Runtime `frameTransitionPulse` only (P-005, P-009) |
| **Carry / Trace** | `1_First/Carrier Mechanics/` | first | Forward / backward availability on same connection |
| **Carrying / Retracing** | second-order enactment | second | Forward / backward enactment |
| **Thread** | `1_First/Carrier Mechanics/Thread.md` | first | Followable continuity; **holds Terminal** downward |
| **Fabric / Web** | `5_Higher/` | higher | Woven held whole / crossing trace within fabric |
| **Structural Gathering** | `2_Second/Presence Conditions/Structural Gathering.md` | second | Multiple participating relations as one arrangement → Fabric |
| **Coupling** | `2_Second/Coupling.md` | second | Mutual availability; precedes Participation in second order |
| **Nesting** | third-order instance | third | **Order-terminal of third order** (Order-Terminal.md) |
| **Field** | `3_Third/Field of Participation.md` | third | Recurring participation organisation — not fabric |
| **Surface** | `2_Second/Produced Distinctions/Surface.md` | second | Presenting face of a condition |
| **Visible** | `1_First/Carrier Mechanics/Visible.md` | first | Presented readability |
| **Appearance** | **None** (standalone) | — | P-003 **L6**; prose in Expression / Illusion |

**Negative finding:** **“Terminal resolution boundary”** does not appear as a single Atlas term. It composes **Resolution** (determination at scope) + **Terminal** / **Order-Terminal** (read limit) + **Boundary** + **Closure Scope** (where evaluation holds).

### 1.2 What Resolution is (Q1)

| Attribute | Evidence |
|---|---|
| **Definition** | Bearing determined at current scope — strain settling into readable condition **without terminating relation** |
| **Holds** | `Bearing`, `Clearance` |
| **Order-terminal** | Completes first-order readable length; same first-order passage cannot continue as same passage |
| **Continuation rule** | What continues must be **carried forward, re-entered, or read under another order** |
| **Nests** | First-order crossing support into Second Order — closes at one scope without terminating wider relation |

Resolution is **not** finality. It is **local determination** that **closes a scope** while relation continues elsewhere.

### 1.3 Does Atlas support terminal resolution? (Q2)

| Sense | Supported? | Evidence |
|---|---|---|
| **Resolution as order-terminal** | **Yes** | `Resolution.md` `order_terminal.is_terminal: true`, `terminal_of: first_order` |
| **Terminal as read-stop at boundary** | **Yes** | `Terminal.md` — Thread + Closure Scope + Boundary |
| **Order-Terminal as order-relative completion** | **Yes** | Instances: Resolution (first), Nesting (third), Recursion (higher) |
| **Compound “terminal resolution boundary”** | **Synthesis only** | No published term; valid **process read** across existing terms |

**Atlas-native phrasing (preferred):**

> At order-terminal, resolution completes within closure scope; continuation changes the **kind of passage** being read.

(`Terminal.md` Order-Terminal section; `Order-Terminal.md` reads.)

### 1.4 What is a boundary doing at resolution? (Q3)

| Layer | Boundary role |
|---|---|
| **First-order** | Locates distinction — unevenness becomes readable **here / there** |
| **Closure** | Bounds where a read can close locally without overclaim |
| **Terminal** | Names where followable read **cannot cross** closure scope |
| **Reference Frame** | Boundary + Closure Scope are **holds** — frame is answerable only within declared scope |
| **Translation Boundary** | Third-order: structural read terminal to field/domain without losing retrace |

Boundary at resolution is **not** a wall that ends relation. It is the **locating act** that makes **scope** and **terminality** readable: something holds **here**, within this extent, and continuation beyond that extent is a **different read**.

### 1.5 Reference Frame (Q4–Q6)

**Definition** (`Reference Frame.md`):

> The nested placement through which a ratio, relation, scale, or relative read becomes answerable and **one face of carrying** becomes readable.

**Critical prose (structure invariant, frame changes):**

> Reality remains continuous. Different nested reference frames illuminate **different faces of the same carrying**. Seed may read as latent from one frame; from another, the same seed may read as carrying, generative, and radiant. **The seed has not changed. The frame has.**

**Holds:** `Ratio`, `Boundary`, `Closure Scope`, `Readability`.

**Implication for hypothesis:** Reference-frame change is **Atlas-grounded**. It explicitly separates **invariant carrying** from **readable face**. Terminal / order-terminal events are the structural moments where **continuation requires lifting scope or order** — i.e. where the **frame of resolution** must change for the read to remain followable.

### 1.6 Resolution Rate (Q6)

**Definition** (`Resolution Rate.md`):

> The rate at which **meaningful distinction** can be resolved while maintaining **retraceable order**.

| Property | Finding |
|---|---|
| Distinct from Speed | Speed = traversal per interval; Resolution Rate = resolved relation per available continuation |
| Context-dependent | Drummer vs beginner; architect vs graduate — **same material, different nested order** → different rate |
| Not raw output speed | Fast summaries ≠ high resolution rate unless trace and re-entry improve |
| Runtime register | **None** — no L2 scalar; practice/read comparison only |

**Frame link:** Reference Frame holds Closure Scope. When closure scope shifts (order lift), **what counts as “available continuation”** shifts → resolution rate can change **without** L0 structure edit.

### 1.7 Rhythm, Frequency, Pulse

| Term | Relation to terminal resolution |
|---|---|
| **Rhythm** | Recurrence readable again at **boundaries within pattern** — boundary as return place, not order-terminal |
| **Frequency** | Countable return per interval — orthogonal to order completion |
| **Pulse** | **Not Atlas** — `frameTransitionPulse` marks **practice frame toggle** (L5/L6) |

Rhythm explains **intra-pattern** boundary returns; Order-Terminal explains **inter-order** read completion. Do not collapse them.

### 1.8 Carry / Trace / Thread / Fabric chain

```text
Connection → Carry ∧ Trace (availability)
  → Carrying / Retracing (enactment)
  → Thread (followable continuity — holds Terminal downward)
  → Terminal (read stop at closure scope)
  → Order-Terminal (order-relative completion)
  → Translation Boundary (structural → field/domain)
  …
  → Structural Gathering → Fabric / Web (weave convergence — P-008)
```

**Commission intuition vs evidence:**

| Intuition path | Atlas pathway | Verdict |
|---|---|---|
| drift → thread → fabric | Mutual Carry+Trace + weave convergence (P-008) | **Weave threshold**, not order-terminal |
| archive → retrace → carrying | Trace without live Carry = archive; mutual restore = fabric | **Operational**, not frame lift |
| ember → fire → lava | L6 colour bands from order + mass (P-004) | **Appearance only** |

---

## 2. Terminal resolution boundary model

### 2.1 Synthesis (commission construct)

```text
TerminalResolutionBoundary(read R, order O) ≡
  Resolution completes at scope S
  ∧ ClosureScope(S) bounds evaluable read
  ∧ Terminal(R): continuation crosses scope S unavailable to R
  ∧ OrderTerminal(O): R cannot continue as same passage within O
```

**What happens next (Atlas continuation rule):**

```text
continue(R) ⇒ re_enter(R') ∨ restart(R') ∨ lift_order(O → O')
```

Each continuation arm implies a **new or shifted reference frame** (closure scope, order visibility, ratio read placement).

### 2.2 Dependency spine

```text
Distinction
  → Boundary (locate)
  → Closure / Closure Scope (bound evaluable read)
  → Resolution (determine bearing at scope)
  → [order completes]
  → Terminal (read cannot follow)
  → Order-Terminal (passage kind changes)
  → Reference Frame shift (nested placement for next read)
  → Relative / Ratio read under new frame
  → Behaviour + Resolution Rate read under new frame
```

**Structure invariant throughout:** L0 `needs`, `holds`, `traces`, `carries`, `pairs`, `nests` unchanged.

### 2.3 Boundary types (do not conflate)

| Boundary kind | Order | Function |
|---|---|---|
| **Boundary** (first) | first | Locate distinction |
| **Closure Scope** | second | Bound valid evaluation |
| **Terminal** | second | Stop same read at scope crossing |
| **Translation Boundary** | third | Structural trunk → field/domain local read |
| **Coupled Boundary** | second | Coupling-specific passage |
| Domain boundaries (Fatigue, Safety, …) | third | Applied reads — local, not general model |

Terminal resolution boundary model uses **Closure Scope + Terminal + Order-Terminal**, not domain-specific boundaries.

---

## 3. Reference-frame change model

### 3.1 Three frame senses in RM (P-003, P-004)

| Sense | Source | Changes L0–L2? | Changes behaviour? |
|---|---|---|---|
| **Atlas Reference Frame** | `Reference Frame.md`; Ratio carries | **No** | **Yes** — which face of carrying is readable |
| **Practice ratio read frame** | MCP `reference_frame`; `READING_ORDER` | **No** | **Yes** — practice read placement |
| **Runtime structural frame** | `STRUCTURAL_FIELD_FRAMES`; Observatory toggle | **No** | **Yes** — visibility, sensibility alpha |

All three are **observation / read placements**, not structure editors.

### 3.2 Frame change at order-terminal

When Order-Terminal fires:

| Invariant | May change |
|---|---|
| L0 structure | — |
| L1 declared edges | — |
| L2 `mass.carriers`, `ratioMode` | — (on practice frame switch; P-003) |
| L3 parallel reads (maturity, order depth) | **Yes** — reads reference new order context |
| L4 behaviour resolver | **Yes** — rhythms, compression, weave modes |
| cross-cut visibility | **Yes** — frame membership set |
| L5 overlay | **Yes** — `referenceFrame`, pulse, traversal |
| L6 appearance | **Yes** — follows L4/L5 |

### 3.3 Canonical model statement

```text
FrameChange(event) ≡
  structure(S) unchanged
  ∧ readable_face(carrying, frame_before) ≠ readable_face(carrying, frame_after)
  ∧ behaviour_resolver(inputs, frame_after) ≠ behaviour_resolver(inputs, frame_before)
```

**Supported by:** `Reference Frame.md` seed example; P-003 cross-cut contract; runtime `setCurrentFieldReferenceFrame` (dims out-of-frame terms, does not edit `allOps` structure).

---

## 4. Resolution-rate model

### 4.1 Definition (Atlas)

```text
ResolutionRate(system, frame, scope) =
  meaningful_distinctions_resolved / available_continuation
  subject to: Coupling ∧ Clearance ∧ RetraceableOrder
```

### 4.2 Frame change effect

| Before terminal boundary | After lift |
|---|---|
| Continuation measured within order O | Continuation measured within order O' or re-entered scope S' |
| Nested prior order may be shallow | More order nested → **higher** resolution rate possible (architect example) |
| Or: scope overclaim blocked | **Lower** effective rate if frame refuses false carries |

Resolution rate is **not** a conserved scalar across frame change. It is a **comparative read** between systems or frames (Resolution Rate.md reads).

### 4.3 Runtime gap

| Present | Absent |
|---|---|
| `ratioMode`, `maturityBand`, `settledness` (L2/L3) | `resolutionRate` scalar |
| `frameTransitionPulse` (event marker) | Order-terminal event detector |
| Practice frame visibility | Automatic frame lift on Resolution completion |

**Status:** Resolution-rate **model supported** in Atlas; **instrumentation unresolved**.

---

## 5. Phase-change translation assessment (Q7)

### 5.1 P-004 distribution

Phase-like behaviour in Observatory is **distributed**:

| Locus | Mechanism |
|---|---|
| L2 | `ratioMode` discrete / transitional / continuous |
| L3 | `maturityBand`, `settledness` |
| L4 | `ratioVisualScale`, relation rhythms |
| cross-cut | Frame membership dimming |
| L6 | Ember/fire/lava **appearance** |

No single “phase” variable exists — correctly per P-002/P-004.

### 5.2 Translation verdict

| Translation | Valid? | Condition |
|---|---|---|
| “Phase change” = **read-frame / order-lift transition** | **Partial ✓** | Use Order-Terminal + Reference Frame language |
| “Phase change” = **material state change** (water/ice/steam) | **Reject** | Availability/permeability unresolved (P-004) |
| “Phase change” = **L6 palette step** (ember/fire/lava) | **Appearance only** | D-017B; not L0–L3 ontology |
| “Phase change” = **ratioMode threshold** | **Partial** | L2 register band crossing — distinct from frame lift |

**Preferred RM translation:**

> **Order-terminal passage** or **reference-frame transition** — not “phase change” in physics sense.

Commission examples remain **intuition** for designers; they are **not** structural proof.

---

## 6. Relationship to Fabric / Web and Field / Participation

### 6.1 Fabric / Web (P-005, P-008, O-002)

| Link | Finding |
|---|---|
| Terminal resolution → Fabric | **Indirect** — Fabric needs Thread + weave convergence + Structural Gathering |
| Thread → Terminal | **Direct** — Terminal holds Thread; thread ends as followable read at closure |
| Frame change → fabric face | **Yes** — different frame illuminates different **face** of same woven carrying (Reference Frame seed parallel) |
| Weave modes (drift/archive/thread) | **Operational** threshold — mutual Carry+Trace, not order-terminal |

**Distinction:** **Weave threshold** (carry∧trace convergence) and **order-terminal threshold** (readable length completes) are **parallel crossings**. Fabric emergence is weave-primary (P-008); order-terminal explains **why the read must shift** before higher-order faces become available.

### 6.2 Field / Participation (P-009)

| Link | Finding |
|---|---|
| Participation → frame change | **No direct** — Participation is derived enactment condition |
| Recurrence → field | **Yes** — Second Order Crossing when participation recurs |
| Nesting as order-terminal (third) | **Yes** — order lift parallels Resolution (first) |
| Collective “phase” | **Derived** via Recurrence → Field of Participation → Nesting — not terminal resolution alone |

Participation explains **who is taking part**; terminal resolution explains **where the current read must stop and re-frame**.

### 6.3 Structural Gathering bridge

```text
Order-terminal (local) → lift / re-enter
  → nested prior order available (Nesting Read)
  → Resolution Rate may rise
  → Structural Gathering (multiple relations as one arrangement)
  → Fabric / Web (if weave convergence — P-008)
```

---

## 7. P-003 layer mapping (Q8)

```text
L0  structure invariant                    — UNCHANGED at terminal resolution
L1  declared relation facts                — UNCHANGED
L2  scalar ratio register                  — UNCHANGED on frame switch (P-003 §cross-cut)
L3  parallel structure reads               — MAY CHANGE (order depth, maturity context)
L4  deterministic behaviour                — CHANGES (resolver inputs include frame)
    ── cross-cut: frame / visibility       — CHANGES (primary frame-change operator)
L5  runtimeOverlay                         — CHANGES (referenceFrame, pulse, traversal)
L6  appearance                             — FOLLOWS L4/L5 (do not confuse with L0–L3)
```

### Event trace (recommended documentation pattern)

| Event | Layer touch | Retrace cite |
|---|---|---|
| Resolution completes at scope | L0 read only | `Resolution.md` order_terminal |
| Same read hits Terminal | L3/L4 read | `Terminal.md` |
| Participant lifts practice frame | cross-cut, L5, L6 | `setCurrentFieldReferenceFrame` |
| ratioMode band crossing | L2→L4→L6 | P-004; distinct from frame lift |
| Weave mode drift/archive | L4/L6 | O-002; operational not order-terminal |

**Contract rule:** Never claim L6 appearance change implies L0 structure change (P-003, D-014).

---

## 8. Observatory implications (Q10)

### 8.1 What to render at threshold events

| Event type | Render | Layer | Do not |
|---|---|---|---|
| **Practice frame switch** | `frameTransitionPulse`, sensibility lerp, in/out-frame alpha | cross-cut, L5, L6 | Edit structure or L2 |
| **Order-terminal read** (future) | Annotation: “passage kind changes”; suggest re-enter/lift | L5 overlay / Mechanics panel | Particle burst / material morph |
| **ratioMode band cross** | Filament/halo blend step | L2→L4→L6 | Call it “melting” or “freezing” |
| **Weave threshold** | drift / archive / thread_forward / web_crossing modes | L4/L6 (O-002) | Fabric without carry∧trace |
| **Participation recurrence** (future) | Traversal recurrence overlay | L5 | Participation heatmap |

### 8.2 Protected rendering principle

```text
ThresholdEvent → show frame_transition + behaviour_delta
              → never imply structure_mutation
```

**Seed test (from Atlas):** If canvas shows radiant seed after frame lift, **same** `allOps[id]` structure must retrace unchanged.

### 8.3 Future instrumentation (architecture only)

| Priority | Direction |
|---|---|
| **Keep** | Frame transition pulse; weave-first fabric (O-002) |
| **Add later** | Order-terminal annotation when term with `order_terminal` focused |
| **Add later** | Closure-scope read in behaviour trace |
| **Do not** | `resolutionRate` heatmap without Atlas derivation |
| **Do not** | Physics phase library or fluid sim as structure (P-004) |

---

## 9. Recommendation

| Option | Verdict |
|---|---|
| Hypothesis **fully supported** as promoted primitive | **Reject** — synthesis term; do not promote |
| Hypothesis **supported in principle** | **Accept ✓** |
| Reference frame changes at order-terminal | **Accept ✓** — Atlas prose + Order-Terminal continuation rule |
| Behaviour changes, structure invariant | **Accept ✓** — Reference Frame + P-003 |
| Resolution rate changes with frame | **Partial ✓** — Atlas contextual; no runtime scalar |
| “Phase change” translation | **Partial** — use order-lift / frame-transition language |
| Runtime already implements full model | **Reject** — frame toggle only; no order-terminal wiring |

### Canonical finding (process language)

> **Terminal resolution** is **Resolution completing at scope** while **Terminal / Order-Terminal** marks that the **same read cannot continue** without **re-entry, restart, or order lift**. That lift is a **reference-frame / closure-scope change**. **Structure stays invariant**; **readable face, behaviour, and resolution rate** may change. **Appearance follows** at L6. Do not import material phase ontology.

**Recommendation: Partial — supported in principle.**

---

## 10. Question summary

| # | Short answer |
|---|---|
| 1 | Resolution = bearing determined at current scope without terminating wider relation; first-order order-terminal |
| 2 | **Yes** — Resolution + Terminal + Order-Terminal; not one compound term |
| 3 | Boundary locates distinction; at terminal, bounds where read can close and where continuation crosses unavailable scope |
| 4 | **Yes** — continuation requires frame/scope lift; Reference Frame explicit on invariant carrying |
| 5 | **Yes** — “Seed has not changed. The frame has.” |
| 6 | **Partial** — Resolution Rate contextual; changes with nested order/frame; no L2 register |
| 7 | **Partial** — valid as order-lift gloss; reject as physics material phase |
| 8 | L0–L2 invariant; L3–L6 and cross-cut may change; appearance last |
| 9 | Weave = operational threshold; order-terminal = read-scope threshold; Participation = enactment/recurrence pathway |
| 10 | Frame pulse, weave modes, order-terminal annotation; never structure mutation visuals |

---

## 11. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-009 | **Met** |
| Atlas diagnosis | **Met** — §1 |
| Terminal resolution boundary model | **Met** — §2 |
| Reference-frame change model | **Met** — §3 |
| Resolution-rate model | **Met** — §4 |
| Phase-change assessment | **Met** — §5 |
| Fabric/Web + Field/Participation | **Met** — §6 |
| P-003 layer mapping | **Met** — §7 |
| Observatory implications | **Met** — §8 |
| Recommendation | **Met** — §9 partial |
| Protected principle preserved | **Met** |
| No implementation/Atlas/D1 changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-009 | `docs/reports/P-009-participation-threshold-investigation.md` |
| P-008 | `docs/reports/P-008-carry-trace-weaving-investigation.md` |
| P-004 | `docs/reports/P-004-ratio-phase-engine-investigation.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| O-002 | `docs/reports/O-002-fabric-renderer-architecture.md` |
| D-014 | `docs/reports/D-014-runtime-principles-derivation.md` |
| D-017B | `docs/reports/D-017B-ember-runtime-falsification.md` |
| Atlas | `Resolution.md`, `Terminal.md`, `Order-Terminal.md`, `Reference Frame.md`, `Resolution Rate.md`, `Boundary.md`, `Closure Scope.md`, `Translation Boundary.md` |

---

**Status:** P-010 complete. Terminal resolution boundaries **change the frame of resolution** in Atlas-grounded RM; **structure remains invariant**; recommendation **partial** — principle supported, composite term not promoted.
