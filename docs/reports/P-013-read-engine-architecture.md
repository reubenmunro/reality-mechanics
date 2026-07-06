# P-013 — Read Engine Architecture Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new public surfaces)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-012, O-002, O-004, O-005, P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`)  
**Core hypothesis (tested):** The Observatory should not primarily render effects. It should derive structurally grounded **reads**, then let **appearance** follow.

**Protected principle:**

> The Observatory does not paint meaning.  
> It derives reads, then lets appearance follow.

**Method:** Runtime module audit, P-003 layer contract, O-commission resolver pattern, Atlas term cross-check. Do not conflate Atlas `conditions.reads` (L0) with runtime participant recognition.

---

## Verdict

| Question | Result |
|---|---|
| Is Observatory separating into Mechanics → Read → Renderer? | **Yes — emergent, incomplete** |
| Does RM need a formal Read Engine **layer**? | **Reject** — conflicts with P-003; Read is not one stack stratum |
| Does RM need a formal Read Engine **module pattern**? | **Accept — partial formalisation** |
| Keep reads ad hoc forever? | **Reject** — drift risk rising after O-003/O-005 |
| Recommendation (§8) | **Partial formalise** — resolver catalogue + source-of-truth rules; not new L-layer |

**Bottom line:** The three-system split is **real in practice** but **not yet named in architecture**. **Mechanics** (`resolveLeg`, weave state, compression limits) produces what structure **can do**. **Reads** (`resolveGatheringRead`, order-terminal annotation, behaviour-trace recognition) state what can be **recognised** from mechanics without painting it. **Renderer** (canvas draw paths, pressure grid display, amplification) makes reads and mechanics **visible**. RM should **formalise the read resolver pattern** as a **parallel module family** sitting between L4 behaviour and L6 appearance — **without** promoting Read to a P-003 layer above mechanics.

---

## 1. Observatory architecture diagnosis

### 1.1 Three-system emergence (hypothesis test)

```text
┌─────────────────────────────────────────────────────────────┐
│  L0–L3  Structure + scalar register + parallel structure    │
│         reads (deriveFieldStatesPayload)                    │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  MECHANICS  — what structure can do (L4 deterministic)      │
│  thread-mechanics.mjs: resolveLeg, weaveMode, eligibility   │
│  field-behaviour-trace: compression limits, rhythm weights    │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  READ ENGINE (de facto) — what can be recognised (condition) │
│  gathering-read.mjs: resolveGatheringRead                   │
│  order-terminal.mjs: orderTerminalForEntryId + annotation   │
│  behaviour-trace: flight recorder + participant annotations │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDERER — how visibility follows (L5 overlay + L6)        │
│  main-website-worker.js: draw*, pressure display, sheet UI  │
└─────────────────────────────────────────────────────────────┘
```

**Supported:** O-004 wired `resolveLeg` before `legStrokeAppearance`. O-005 added gathering read **without** canvas effect. O-002 fabric face remains **emergent** from leg eligibility + pressure deposit — not a read painted as field.

**Incomplete:** Reads live in three modules with no shared contract file. Behaviour trace still **mixes** L4 mechanical documentation with read annotations. Renderer still contains inline mechanical logic (`buildHomeWeaveState`, `relationCompressionLimit` calls) not fully delegated.

### 1.2 Tension with P-003

P-003 §2 states:

> **Read** does not form a single layer. Structural `conditions.reads` lives in **L0**. Participant recognition lives in **practice/MCP** — not in this runtime stack.

P-013 **does not overturn P-003**. It refines it:

| Sense of "Read" | Layer | P-013 ruling |
|---|---|---|
| Atlas `conditions.reads` prose | L0 | Unchanged — canonical structure |
| Atlas term **Read** (practice) | L0 + practice | Not runtime invariant |
| **Runtime recognition read** | **Between L4 and L6** — module pattern | **New clarity** — participant-facing condition recognition derived from L0–L4 |
| D-012 behaviour trace | L0–L4 documentation + L5 merge | Meta-instrument, not pure read |

**Read Engine** is therefore a **resolver family and annotation contract**, not a replacement for L3 "parallel structure reads."

---

## 2. Definition of Read Engine

### 2.1 What is a Read in the Observatory? (Q1)

A **Read** is a **derived recognition outcome**: a structurally grounded statement that a named Atlas **condition** (or commission-bounded proxy) **holds, partially holds, or does not hold** in a declared scope — **without** creating structure, **without** inventing a scalar ontology, and **without** asserting appearance as proof.

**Formal properties:**

| Property | Rule |
|---|---|
| **Inputs** | L0–L4 only (+ optional L5 **context** for display, never for validity) |
| **Output** | Discrete status + evidence object + optional participant annotation |
| **Reversibility** | Same structure → same read (at fixed timestamp/config) |
| **Non-painting** | Read true ≠ canvas effect added (O-005, P-012) |
| **Versioned** | `resolver: "gathering.v1"` style — not silent drift |

**Examples today:**

- "This neighbourhood **approximates Structural Gathering**" (`gathering-read.mjs`)
- "This term is **order-terminal** — frame transition, structure invariant" (`order-terminal.mjs`)
- "This leg is **drift** / **archive** / **web_crossing**" (weave mode — mechanical classification usable as read)

**Not reads:**

- Alpha, colour, dash pattern, pressure grid cell value
- Traversal count, movement wake, session `settled` animation
- Layout ring position, DPR, legibility floor

### 2.2 Read vs mechanics (Q2)

| | **Mechanics** | **Read** |
|---|---|---|
| **Question** | What can this structure **do**? | What can be **recognised** from what it does? |
| **Grain** | Per-leg, per-term register, per-limit formula | Per-neighbourhood, per-term condition, per-frame transition |
| **Output type** | Continuous weights, modes, eligibility flags | Categorical status + evidence + human annotation |
| **Atlas anchor** | Operators (Carry, Trace), Thread leg | Conditions (Structural Gathering, Order-Terminal, Terminal) |
| **Module** | `thread-mechanics.mjs` `resolveLeg` | `gathering-read.mjs`, `order-terminal.mjs` |
| **P-003 layer** | L4 | L4 consequence **interpreted** toward L0 condition (recognition) |

**Canonical distinction:**

```text
Mechanics: weaveMode = "thread_forward"     (mutual carry∧trace on leg)
Read:      gathering.status = "approximates_gathering"   (arrangement holds in scope)
```

Mechanics supplies **evidence**; read supplies **recognition**.

### 2.3 Read vs appearance (Q3)

| | **Read** | **Appearance** |
|---|---|---|
| **Survives pan/zoom** | Yes (recomputable) | No |
| **Proves condition** | Claims recognition only | Must not prove condition |
| **Delivery** | Mechanics panel, term sheet annotation, API JSON | Canvas strokes, glow, pressure lerp, pulse |
| **Direction** | Read → may inform appearance | Appearance **must not** invent read |
| **O-002 fabric face** | Not a read — **emergent L6** from eligible legs | Yes — deposit + draw |

**Protected principle enforcement:** O-005 explicitly rejected painting gathering. O-002 fabric face is appearance **gated** by mechanical eligibility (`fabricEligible`, `homeThreadTermIds`) — not by a gathering scalar.

### 2.4 Overlay (commission distinction)

**Overlay** = participant/session/frame state that **modulates visibility and trace context** but does not change L2 scalars or structure (P-003 L5, cross-cut P4).

| Overlay | Not a read because |
|---|---|
| `traversalMap` | Accumulates session path — not structure recognition |
| `fieldPressure` (client blend) | Heuristic neighbourhood blend for rendering |
| `endpointOnly` | Budget/legibility mode |
| Active `referenceFrame` | Visibility operator — membership dims, does not validate frame |
| `settled` animation | Time/session smoothing |

Overlay may be **cited in read annotations** ("under frame X") but must not **define** read truth.

---

## 3. Inventory: mechanics / reads / overlays / appearance

### 3.1 Mechanics (Q4)

| Output | Module / site | Layer |
|---|---|---|
| `resolveLeg` — weaveMode, legMass, rhythm, eligibility | `thread-mechanics.mjs` | L4 |
| `buildPairStateFromOps`, `weaveModeForLeg` | `thread-mechanics.mjs` | L1→L4 |
| `ratioModeForState`, `structuralMassForState` | `field-behaviour-trace.mjs` | L2 |
| `relationCompressionLimit` | `field-behaviour-trace.mjs` | L4 |
| `deriveFieldStatesPayload` — relations, mass, maturity | `main-website-worker.js` | L0–L3 |
| `buildHomeWeaveState`, `homeThreadTermIds` | `main-website-worker.js` | L1→L4 |
| `fabricEligibleConnection` | `main-website-worker.js` (uses TMS) | L4 |
| Rhythm mode per relation type | `field-behaviour-trace.mjs` `RHYTHM_SIGNATURES` | L3→L4 |
| `fieldTensionFromGradient` (given pressure) | `main-website-worker.js` | L4 |

### 3.2 Reads (Q5)

| Read | Resolver | Status | Delivery |
|---|---|---|---|
| **Order-terminal** | `orderTerminalForEntryId` + `buildOrderTerminalAnnotation` | Implemented O-003 | Term sheet + Mechanics + behaviour trace |
| **Structural Gathering** | `resolveGatheringRead` + `buildGatheringReadAnnotation` | Implemented O-005 | Mechanics + behaviour trace |
| **Weave leg classification** | `weaveModeForLeg` → drift/archive/thread/web | Implemented O-002/O-004 | Implicit in leg draw + TMS tests |
| **Thread pair / network incidence** | `buildHomeWeaveState` / gathering evidence | Implemented | Mechanical evidence; gathering read distinguishes |
| **Fabric eligibility** | `fabricEligibleWeaveMode` | Implemented O-002 | Gates appearance — borderline mechanics/read |
| **Maturity / settledness band** | `deriveFieldStatesPayload` | Implemented | API states — L3 parallel read |
| **Behaviour trace (meta)** | `buildFieldBehaviourTrace` | Implemented D-012 | Five behaviours + atlasSource — **retrace instrument** |
| **Participation threshold** | — | **Not implemented** | P-009 implied |
| **Fabric held-whole read** | — | **Partial** — O-002 face only as appearance | P-012 gap |
| **Web crossing navigability** | — | **Partial** — `web_crossing` mode only | P-008 implied |
| **Reference frame active read** | — | **Partial** — dimming only | P-010 implied annotation |
| **Resolution / closure at focus** | — | **Not implemented** | P-010 implied |
| **Retrace readiness** | — | **Not implemented** | Atlas Retrace / Generative Trace |

### 3.3 Overlays (Q6)

| Overlay | Site | Layer |
|---|---|---|
| `traversalMap`, traversal emphasis | `main-website-worker.js` | L5 |
| `fieldMovementEvent`, movement wake | `main-website-worker.js` | L5 |
| `collectRuntimeOverlay` payload | client → behaviour-trace API | L5 |
| `currentFieldReferenceFrame`, `structuralFieldFrameIds` | `main-website-worker.js` | L5 + cross-cut P4 |
| `coupledSensibility`, `relationSensibility` | `main-website-worker.js` | cross-cut P4 |
| `relationPressureTraces`, trajectory memory | `main-website-worker.js` | L5 |
| Client `settled`, focus animation state | `main-website-worker.js` | L5 |

### 3.4 Appearance (Q7)

| Appearance | Site | Follows |
|---|---|---|
| `legStrokeAppearance`, `legFocusedAppearance` | `thread-mechanics.mjs` | `resolveLeg` (L4→L6) |
| `drawCurrent`, `drawHomeRelationCurrent` | `main-website-worker.js` | TMS + overlay |
| `drawHomeFabricFace`, weave currents | `main-website-worker.js` | Thread network + eligible legs + pressure grid |
| `buildPressureField` / `buildHomePressureField` display lerp | `main-website-worker.js` | Heuristic L6 |
| Focus condensation, pulse, arrival glow | `main-website-worker.js` | L4 + L5 + heuristic |
| Endpoint-only peripheral fade | `main-website-worker.js` | `fieldPressure` overlay |
| Term labels, layout rings, order bands | `main-website-worker.js` | L3 layout reads + heuristic |
| `MECHANICS_AMPLIFICATION` | `main-website-worker.js` | L6 legibility |

---

## 4. Proposed read resolver pattern

### 4.1 Should reads become formal layer/module? (Q8)

**Partial formalisation — module pattern, not P-003 layer.**

```text
readResolverPattern:

  resolveXRead({ scope, statesById, mechanicsEvidence, thresholds })
    → { status, evidence, distinctions, resolver, source }

  buildXAnnotation(read)
    → { rows, participantCopy } | null

  optional: appearanceFromRead(read) — ONLY where commission explicitly ties L6 to read
             (default: no canvas effect)
```

**Catalogue rules:**

1. One module per Atlas-bounded read (or commission proxy): `*-read.mjs` or `read/*.mjs`
2. **No** read logic inlined in `draw*` functions
3. Reads consume **mechanics outputs** — never re-derive weave state differently in renderer
4. `behaviour-trace` **imports** read resolvers — does not duplicate criteria
5. Version string per resolver (`gathering.v1`, `order-terminal.v1`)

### 4.2 Existing reads (Q9) — consolidated

| ID | Read | Resolver version |
|---|---|---|
| R-OT | Order-terminal frame transition | `atlas.order_terminal` (registry) |
| R-SG | Structural Gathering approximation | `gathering.v1` |
| R-WM | Weave mode (drift/archive/thread/web) | `tms.v1` (via `resolveLeg`) |
| R-FE | Fabric leg eligibility | `tms.v1` + O-002 gate |
| R-TN | Thread network incidence | mechanical aggregate (no discrete annotation yet) |
| R-MAT | Maturity / settledness recognition | D1-derived states |
| R-BT | Behaviour retrace (five behaviours) | `contractVersion: 1` |

### 4.3 Future reads implied, not implemented (Q10)

| Implied read | Evidence | Risk if painted instead |
|---|---|---|
| **Participation threshold** | P-009 — recurrence + nesting | Generic "collective field" overlay |
| **Fabric held-whole** | P-012 — convergence read distinct from face | Painting fabric without weave evidence |
| **Web navigability** | P-008 — crossings within fabric | Graph layout as Web |
| **Reference frame declaration** | P-010, P-003 cross-cut | Dimming mistaken for invalidity |
| **Closure / terminal at focus** | P-010 — Resolution, Terminal | Phase animation as structure change |
| **Field Relationships grouping** | P-009, third-order | Domain colouring |
| **Drift / archive diagnosis** | P-008 failure modes | Aesthetic dash only without annotation |
| **Retrace / generative trace readiness** | Atlas Retrace, P-008 | Archive glow as false continuity |

---

## 5. Required source-of-truth rules

| Rule | Enforcement |
|---|---|
| **Structure canonical** | Reads cite L0–L1 fields in `evidence`; never invent edges |
| **Mechanics single path** | `weaveMode` only via `weaveModeForLeg` / `resolveLeg` — renderer must not fork |
| **Read does not paint** | New reads default to Mechanics panel / API / sheet — not canvas |
| **Appearance follows** | L6 functions take `resolveLeg` / eligibility outputs — not inverse |
| **Overlay optional context** | `runtimeOverlay` in trace — never input to `resolveGatheringRead` validity |
| **No read scalar** | Discrete status + evidence counts only (O-005 model) |
| **Version resolvers** | Breaking criteria → bump `*.v2` |
| **Atlas term discipline** | Commission proxies labelled (e.g. "approximates Structural Gathering") |
| **Four-status vocabulary** | derived / calibrated / heuristic / unresolved on any new read |

---

## 6. Drift risks

| Risk | Symptom | Mitigation |
|---|---|---|
| **Painted meaning** | Gathering/fabric/participation as canvas fields without read | O-005 pattern; P-012 principle |
| **Mechanics in draw*** | `buildHomeWeaveState` duplicated criteria vs `gathering-read` | Delegate weave build to shared module |
| **Read in overlay** | Traversal count triggers "gathered" | Keep reads structure-only |
| **Behaviour trace as ontology** | Five D-011 behaviours promoted to Atlas conditions | D-012 flight recorder discipline |
| **L6 proves L0** | Fewer drawn edges ⇒ fewer relations | Compression labelled budget artefact |
| **Ad hoc sprawl** | Each O-commission invents new inline pattern | Read resolver catalogue |
| **Layer collapse** | `pressureField` ≡ Atlas Pressure | P-003 naming discipline |
| **TMS bypass** | New stroke logic skipping `resolveLeg` | O-004 regression tests |

---

## 7. Implications for future renderer work

1. **Renderer commissions** should declare which **reads** and **mechanics** they consume — not re-derive.
2. **New canvas effects** require mechanical gate (`eligibility`, `threadNetwork`, `fabricEligible`) — optional read annotation alongside.
3. **Mechanics panel** is the primary home for reads until a read explicitly commissions appearance coupling.
4. **Behaviour trace** should trend toward **importing** read modules rather than embedding recognition prose.
5. **Participation / Fabric / Web** future work should follow O-005 (read first) before O-002-style emergence (appearance second).
6. **Refactor candidate** (architecture only): extract `weave-state.mjs` shared by home renderer, gathering read, TMS tests — reduces drift risk; not required for P-013 acceptance.

---

## 8. Recommendation (Q8 options)

| Option | Verdict |
|---|---|
| **Formalise Read Engine** (module pattern + catalogue) | **Accept ✓** |
| **Formalise Read Engine** (new P-003 layer above L4) | **Reject** |
| **Keep reads ad hoc** | **Reject** — O-003/O-005 proved pattern; ad hoc will fork |
| **Reject read layer entirely** | **Reject** — would deny O-005/O-003 architectural meaning |

### Canonical finding

> The Observatory **is** separating into **Mechanics → Read → Renderer** in practice. **Mechanics** (`resolveLeg`, registers, limits) states what declared structure **can do**. **Reads** (`resolveGatheringRead`, order-terminal, future participation/fabric reads) state what conditions **can be recognised** without painting them. **Renderer** makes mechanics and reads visible under overlay and heuristic appearance rules. RM should **partially formalise** a **Read Engine module family** — shared resolver pattern, versioned catalogue, source-of-truth rules — **without** elevating Read to a P-003 layer or letting appearance invent meaning.

**Recommendation: Partial formalise Read Engine as module pattern between L4 mechanics and L6 appearance.**

---

## 9. Question summary

| # | Short answer |
|---|---|
| 1 | Derived recognition that a condition holds in scope — structurally grounded, non-painting |
| 2 | Mechanics = what structure can do; Read = what can be recognised from that |
| 3 | Read is recomputable recognition; appearance is visibility that must follow, not prove |
| 4 | `resolveLeg`, weave state, compression limits, ratio registers, eligibility |
| 5 | Order-terminal, gathering, weave classification, maturity; behaviour trace meta |
| 6 | Traversal, frame dimming, movement events, client pressure blend |
| 7 | Canvas draw, pressure display, stroke appearance, condensation, labels |
| 8 | **Module pattern yes; new layer no** |
| 9 | R-OT, R-SG, R-WM, R-FE, R-TN, R-MAT, R-BT (see §4.2) |
| 10 | Participation, fabric-whole, web, frame, closure, retrace (see §4.3) |

---

## 10. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-012, O-002/O-004/O-005, P-003 | **Met** |
| Architecture diagnosis | **Met** — §1 |
| Read Engine definition | **Met** — §2 |
| Inventory | **Met** — §3 |
| Resolver pattern | **Met** — §4 |
| Source-of-truth rules | **Met** — §5 |
| Drift risks | **Met** — §6 |
| Renderer implications | **Met** — §7 |
| Recommendation | **Met** — §8 partial formalise |
| Protected principle | **Met** |
| No implementation/Atlas/D1 changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| P-011 | `docs/reports/P-011-thread-mechanics-investigation.md` |
| P-012 | `docs/reports/P-012-structural-gathering-mechanics.md` |
| P-010 | `docs/reports/P-010-terminal-resolution-boundary-investigation.md` |
| O-003 | `docs/reports/O-003-order-terminal-observatory-annotation.md` |
| O-004 | `docs/reports/O-004-thread-mechanics-renderer-pass.md` |
| O-005 | `docs/reports/O-005-gathering-read-annotation.md` |
| D-012 | Behaviour retrace instrument |
| Code | `thread-mechanics.mjs`, `gathering-read.mjs`, `order-terminal.mjs`, `field-behaviour-trace.mjs` |

---

**Status:** P-013 complete. Reality Mechanics **needs** a formal **Read Engine module pattern** — not a new stack layer — between mechanics and renderer.
