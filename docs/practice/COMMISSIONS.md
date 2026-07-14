# Commissions

> Historical register. Entries below describe the architecture at the time of each commission and may cite files or tools retired by Canonical Translation. They are evidence, not current structural authority.

## Purpose

This register records commissions issued by the Project Steward and their current state.

A commission begins with an unresolved condition, presently named Pressure in the working Practice flow, and authorises a contract or architectural response.

This is not a task list.

---

## Commission States

| State | Meaning |
|-------|---------|
| **Open** | Commission has been named but not resolved |
| **Contracted** | A contract has been issued |
| **Resolved** | The unresolved condition has been carried enough for a steward decision to stand |
| **Rejected** | Commission was not accepted or no longer applies |
| **Continued** | The unresolved condition remains and further work is required |

---

## Register

| Commission | Related Contract | State | Unresolved Condition | Resolution |
|------------|------------------|-------|----------------------|------------|
| Repository cover sheet | C001 | Resolved | Repository orientation unclear | `PROJECT_STATUS.md` established |
| Delivery framework | C002 | Resolved | AI effort needed quantity-survey control | `docs/PROJECT_DELIVERY.md` established |
| Repository reproducibility | C003 | Resolved | Reproducibility unknown | Development reproducible : canonical deployment blocked |
| Operational readiness characterisation | C004 | Resolved | Platform stability and deployment risks require characterisation | Operational character known; D1 schema and recovery path remain open pressure |
| D1 schema and recovery characterisation | C005 | Open | D1 schema and non-entries recovery path unknown | Pending |

## Register — Calculus & Investigation Programme

These commissions use a hyphenated series distinct from the operational `C001`–`C005` above. All produced read-only evidence reports under `docs/reports/` (C007 — reports are evidence, not decisions). None promoted anything.

| Commission | Related Report | State | Unresolved Condition | Resolution |
|------------|----------------|-------|----------------------|------------|
| Pressure derivation evidence | C-A001 | Resolved | Pressure structurally undefined | Three senses distinguished; derivation unresolved (A001) |
| First-order dependency topology | C-R001 / C-R001A | Resolved | First-order dependency unknown | Relation sole internal root; linkage ≠ centrality (corrected) |
| Frontmatter field characterisation | C-F001 | Resolved | Field grammar unclear | Coherent grammar in intent; `needs`/`holds`/`traces` largely coincident |
| Operation characterisation | C-C000 / C-C000A | Resolved | "operation" meaning unclear | Six senses; node-like vs edge-like split (unresolved) |
| First operation / node-edge / connection | C-C001 / C-C001B / C-CON001 | Resolved | Structural centre unclear | Node/edge foreign; Connection a scoped load-bearing hub |
| Practice calculus derivation | C-001 | Resolved | Smallest practice calculus unknown | `Ark Run` candidate runtime (Pressure→Trace→Check→Determine→Step) |
| Ark–Order calculus derivation | C-002 | Resolved | Candidate calculus undefined | `Order : Ark` proposed candidate (not promoted) |
| Minimum support test | C-003 | Resolved | Candidate minimality untested | Not minimal; minimal seat `Relation → Connection`; do not promote |
| Programme characterisation (S-001) | S-001 | Resolved | Programme state unclear for submission | Working-architecture map; delivery order set |

---

## Register — Observatory Delivery Programme

Hyphenated `D-00x` commissions deliver Observatory loop artefacts. Reports under `docs/reports/D-00x-*.md`.

| Commission | Related Report | State | Unresolved Condition | Resolution |
|------------|----------------|-------|----------------------|------------|
| Observatory loop (Atlas → Calibration → Field → Submission) | D-002 | Resolved | Loop not connected | Field ↔ Calibration ↔ Submission linked |
| Deployment verification | D-003 | Resolved | Live state unknown | Workers current; D1 stale (led to D-004) |
| D1 sync + read-model repair | D-004 | Resolved | Compatibility absent live | D1 synced; read-model repaired |
| Calibration Engine v1 | D-005 | Resolved | No structural walk demo | `member/src/calibration-engine.mjs` |
| Connection prose calibration | D-006 | Resolved | Can prose be structurally refined? | Connection opening refined; evidence recorded |
| Structural Reading discipline | D-007 | Resolved | No prose-reading discipline | `docs/practice/STRUCTURAL_READING.md` |
| Whole Atlas calibration | D-008 | Resolved | Does Atlas imply unnamed places or prose gaps? | Reports `docs/reports/D-008-*`; backlog `docs/practice/STRUCTURAL_READING_BACKLOG.md`; 67 Class A; 0 Class C |
| Format + layout check (pre D-008 commit) | D-009 | Resolved | D-008 artefacts layout-consistent? | `docs/reports/D-009-format-layout-check.md` |
| Structural Reading operations discovery | D-010 | Resolved | What operations recur when prose becomes faithful? | `docs/practice/STRUCTURAL_READING_OPERATIONS.md`; Tier 1 calibrated |
| Field runtime audit | D-010A | Resolved | How does Field behave at runtime? | `docs/reports/D-010A-runtime-audit.md` |
| Generalise ratio mechanics | D-010B | Resolved | All relation types participate in shared ratio engine | `docs/reports/D-010B-generalise-ratio-mechanics.md` |
| Emergent behaviour observations | D-011 | Resolved | What behaviours recur from current runtime? | `docs/reports/D-011-emergent-behaviour-observations.md` |
| Behaviour retrace instrument | D-012 | Resolved | Make Field behaviour retraceable to Atlas structure | `docs/reports/D-012-behaviour-retrace-instrument.md`; `/api/field/behaviour-trace`; Mechanics panel |
| Cloudflare surface audit | D-013 | Resolved | Are stale Cloudflare surfaces blocking current mechanics? | `docs/reports/D-013-cloudflare-surface-audit.md`; `docs/deployment/CLOUDFLARE_SURFACE_MAP.md` |
| Runtime principles derivation | D-014 | Resolved | What runtime laws does evidence already imply? | `docs/reports/D-014-runtime-principles-derivation.md`; `docs/practice/RUNTIME_PRINCIPLES.md` |
| Derived Ratio design document | D-015A | Resolved | Document Derived Ratio as structure–behaviour bridge | `docs/runtime/DERIVED_RATIO.md` |
| Derived Ratio falsification | D-015B | Resolved | Falsify D-015A against Observatory evidence | `docs/reports/D-015B-derived-ratio-falsification.md` |
| Discovery-to-implementation process | D-016 | Resolved | Gate architectural discoveries before implementation | `docs/practice/DISCOVERY_TO_IMPLEMENTATION.md` |
| Ember runtime model | D-017A | Resolved | Characterise ember as candidate runtime model | `docs/runtime/EMBER_RUNTIME_MODEL.md`; `docs/reports/D-017A-ember-runtime-model.md` |
| Ember runtime falsification | D-017B | Resolved | Falsify ember as primary observable language | `docs/reports/D-017B-ember-runtime-falsification.md` |
| Opening place calibration | D-018A | Resolved | Calibrate Atlas opening prose to place sentences | `docs/reports/D-018A-opening-place-calibration.md` |
| Hold & movement calibration | D-018B | Resolved | Can explanatory body align from existing structure? | `docs/reports/D-018B-hold-movement-calibration.md`; Tier 1 rule from `conditions.holds`; not applied |
| Hold rule falsification | D-018C | Resolved | Does Tier 1 hold rule survive blind sample test? | `docs/reports/D-018C-hold-rule-falsification.md`; **safe with exclusions**; not applied |
| Tier 1 hold sentence calibration | D-018D | Resolved | Apply revised Tier 1 hold rule corpus-wide | `docs/reports/D-018D-tier-1-hold-calibration.md`; 481 files; 485/488 aligned |
| Atlas website sync + deployment | D-019 | Resolved | Publish D-018D prose to live Observatory | `docs/reports/D-019-atlas-website-sync-deployment.md`; D1 synced; Field + MCP verified |
| Observatory panel compression | D-020A | Resolved | Panel duplicated Atlas prose | `docs/reports/D-020A-observatory-panel-compression.md`; place-only panel + Atlas link |
| Mechanics amplification | D-020B | Resolved | Mechanics too weak to read without legend | `docs/reports/D-020B-mechanics-amplification.md`; rendering coefficients only |
| Initial render investigation | D-020C | Resolved | Field almost empty on first paint | `docs/reports/D-020C-initial-render-investigation.md`; `fieldPressure` → `endpointOnly` |
| Observatory presentation corrections | D-020D | Resolved | Empty opening + wikilinks in panel | `docs/reports/D-020D-presentation-corrections.md`; whole-field bootstrap + wikilink strip |
| Public navigation rename | D-021.1 | Resolved | Nav labels misaligned with public structure | `docs/reports/D-021.1-navigation.md`; Observatory · Pulse · Theory · Proof |
| Observatory landing | D-021.2 | Resolved | Field dominated first screen without orientation | `docs/reports/D-021.2-observatory-landing.md`; instrument landing + neutral panel |
| Pulse identity | D-021.3 | Resolved | Is Calibration already Pulse? | `docs/reports/D-021.3-pulse-identity.md`; yes — elevate Calibration as first Pulse instrument |
| Pulse instrument contract | D-021.4 | Resolved | What must every Pulse instrument satisfy? | `docs/reports/D-021.4-pulse-instrument-contract.md`; eight-clause contract C1–C8 |
| Observatory render blocker | D-021.4-R | Resolved | Canvas empty on first load after D-020D | `docs/reports/D-021.4-observatory-render-blocker.md`; home nodes + whole-field visibility |
| Public website strip-back | D-021.5 | Resolved | Public site beyond four surfaces | `docs/reports/D-021.5-public-website-strip-back.md`; Pulse-only + /theory + Proof reframe |
| Visual refinement | D-026 | Resolved | Site structurally correct but visually literal | `docs/reports/D-026-visual-refinement.md`; typography, radiance, icon-free nav |
| Observatory legibility | D-022 | Resolved | Field carried no language; visitor could not position | `docs/reports/D-022-observatory-legibility.md`; canvas term labels + order legend + term suggestions + Theory postulate; render-layer audit continued as D-023 recommendation |
| Public website creative instrument pass | D-023 | Resolved | Surfaces did not compose into a public instrument | `docs/reports/D-023-public-website-creative-instrument-pass.md`; dependency-bearing placement + hover probe + field readout + relation legend + Theory/Proof recomposition + Pulse honest readout; render-layer audit deferred |
| Calculus public surface | D-024 | Resolved | Derivation programme publicly invisible | `docs/reports/D-024-calculus-public-surface.md`; `/calculus` derivation surface — live chain with explicit rules, four-status vocabulary (derived/calibrated/heuristic/unresolved), candidate calculus unpromoted; five public surfaces |
| MCP read surface alignment | D-025 | Resolved | AI readers could not read the public structure | `docs/reports/D-025-mcp-read-surface-alignment.md`; `public-surface-manifest.mjs` shared by website + MCP; `get_public_surfaces` + `get_derivation_status`; real version label with lag honesty; MCP v2.4.0, 17 read-only tools |
| Release audit | R-001 | Resolved | Programme readiness before further development | `docs/reports/R-001-release-audit.md`; NOT READY — GitHub private, doc drift, Observatory first-load |
| Release blocker remediation | R-002 | Resolved | R-001 top blockers block public release integrity | `docs/reports/R-002-release-blocker-remediation.md`; doc truth, Observatory first impression; MCP orientation superseded by D-025 |
| Programme coherence audit | R-003 | Resolved | Programme internally forked despite public release | `docs/reports/R-003-programme-coherence.md`; reconcile to D-025 manifest; Phase 0 roadmap |
| Repository truth reconciliation | R-004 | Resolved | Parallel truths between origin, local, and R-002 MCP fork | `docs/reports/R-004-repository-truth-reconciliation.md`; HEAD = origin/main @ D-025; R-002 Observatory fixes preserved; R-002 programme-orientation discarded |
| Programme synthesis | R-005 | Resolved | Post–P/O architecture unclear for new workers | `docs/reports/R-005-programme-synthesis.md`; five surfaces; Mechanics→Read→Renderer |
| Operation reconciliation | R-006 | Resolved | Operational truth after P/O @ 1e0b526 | `docs/reports/R-006-operation-reconciliation.md`; test counts; read-engine inventory |
| Observatory field renderer architecture | O-001 | Resolved | Observatory still behaved as graph renderer (nodes, labels, edges) | `docs/reports/O-001-observatory-field-renderer-architecture.md`; home membrane + pressure currents + mass condensation MVP |
| Fabric renderer architecture | O-002 | Resolved | Generic membrane field ignored carry∧trace weave rule | `docs/reports/O-002-fabric-renderer-architecture.md`; fabric gating, drift/archive modes, thread/web edges |
| Order-terminal Observatory annotation | O-003 | Resolved | Order-terminal threshold invisible to participants | `docs/reports/O-003-order-terminal-observatory-annotation.md`; term sheet + mechanics panel; registry without D1 edit |
| Thread mechanics renderer pass | O-004 | Resolved | Connection appearance bypassed TMS resolveLeg pipeline | `docs/reports/O-004-thread-mechanics-renderer-pass.md`; thread-mechanics.mjs; home + focused leg alignment |
| Gathering read annotation | O-005 | Resolved | Structural Gathering invisible as read; no painted field | `docs/reports/O-005-gathering-read-annotation.md`; gathering-read.mjs; Mechanics panel only |
| Read engine module formalisation | O-006 | Resolved | Reads ad hoc after O-003/O-005; drift risk | `docs/reports/O-006-read-engine-module-formalisation.md`; read-engine.mjs catalogue; resolveFocusReads; weave-state shared |
| Physics language investigation | P-001 | Resolved | Whether physics is natural expressive language for RM ratios | `docs/reports/P-001-physics-language-investigation.md`; partially appropriate; physics for invariant layer expression only |
| Invariant hierarchy investigation | P-002 | Resolved | Whether RM derives a hierarchy of invariants | `docs/reports/P-002-invariant-hierarchy.md`; reorder required; Structure first; Read splits; Observation not invariant |
| Invariant runtime contract | P-003 | Resolved | Overlay and appearance confused with invariant substrate | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`; `docs/reports/P-003-invariant-runtime-contract.md` |
| Ratio phase engine investigation | P-004 | Resolved | What field/phase engine RM needs for ratio frame changes | `docs/reports/P-004-ratio-phase-engine-investigation.md`; custom RM field engine; no external physics lib |
| Weave / fabric investigation | P-005 | Resolved | Whether weave/fabric is grounded Observatory medium language vs membrane | `docs/reports/P-005-weave-fabric-investigation.md`; hybrid replace membrane; Fabric/Web/Thread grounded; Weave prose-only |
| Weaving as operation investigation | P-006 | Resolved | Whether weaving is operation vs term; Weave term needed? | `docs/reports/P-006-weaving-operation-investigation.md`; keep process language; no Weave term; compound of RELATION_FIELDS |
| Operational calculus investigation | P-007 | Resolved | Can RM derive operational calculus without new primitives? | `docs/reports/P-007-operational-calculus-investigation.md`; partial — three operator strata; Ark Run + RELATION_FIELDS; reconcile operation senses before promotion |
| Carry / Trace / weaving investigation | P-008 | Resolved | Is weaving grounded as Carry+Trace mutual supportability? | `docs/reports/P-008-carry-trace-weaving-investigation.md`; confirm+revise; drift vs archive; fabric requires both |
| Participation threshold investigation | P-009 | Resolved | Is Participation the individual→collective transition? | `docs/reports/P-009-participation-threshold-investigation.md`; derived; recurrence/nesting threshold; Fabric needs weave convergence |
| Terminal resolution boundary investigation | P-010 | Resolved | Do terminal resolution boundaries change reference frame without changing structure? | `docs/reports/P-010-terminal-resolution-boundary-investigation.md`; partial — principle supported; order-terminal + Reference Frame; phase gloss only |
| Thread mechanics investigation | P-011 | Resolved | What are the invariant mechanics of a single declared relation / thread? | `docs/reports/P-011-thread-mechanics-investigation.md`; TMS spec; leg ratios partial; parallel resolvers mandatory |
| Structural gathering mechanics investigation | P-012 | Resolved | Does SG bridge thread pairs to coherent networks and Fabric? | `docs/reports/P-012-structural-gathering-mechanics.md`; partial — downstream convergence; parallel to Participation |
| Read engine architecture investigation | P-013 | Resolved | Does Observatory need formal Read Engine between mechanics and renderer? | `docs/reports/P-013-read-engine-architecture.md`; partial formalise module pattern; reject new P-003 layer |
| Programme sorting pass | M-001 | Resolved | Repository doc entropy after P/O programme | `docs/reports/M-001-programme-sorting-pass.md`; PROGRAMME_INDEX; R-005/R-006; supersession banners |
| Observatory renderer reconstruction | O-008 | Resolved | First-load field empty; woven mechanics not perceptible | `docs/reports/O-008-observatory-renderer-reconstruction.md`; `woven-field-renderer.mjs`; `RMMechanics` client bundle; `drawWovenHomeField` |
| Public GitHub final cleanup | M-003 | Resolved | Evidence backend incoherent for public reviewers | `docs/reports/M-003-public-github-final-cleanup.md`; README; supersession index; link audit |
| Public experience polish | W-001 | Resolved | Public surfaces lacked shared wayfinding: human/AI paths undistinguished, MCP unoriented, evidence ladder implicit | `docs/reports/W-001-public-experience-polish.md`; ways-in on Theory/Proof/Calculus; Observatory + Pulse orientation; skip links + visible focus; 122 · 20 · 42 tests |
| Mobile Observatory polish | W-002 | Resolved | Mobile compressed desktop layout; term panel opened before observation | `docs/reports/W-002-mobile-observatory-polish.md`; mobile bottom drawer; lazy term disclosure; field-first layout; 127 · 20 · 42 tests |
| Public Observatory milestone | M-004 | Resolved | Phase One complete; record before development pause | `docs/reports/M-004-public-observatory-milestone.md`; Phase One closure @ `66b14a8` |

---

## Notes

A resolved commission does not mean all related work is complete.

It means the named unresolved condition has been carried far enough that its current relation is known and the steward can decide what follows.

The term Pressure remains under architectural derivation. Until resolved, this register should treat pressure-language as a working read of an unresolved condition rather than an accepted Practice primitive.
