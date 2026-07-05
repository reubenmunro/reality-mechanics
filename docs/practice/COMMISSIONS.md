# Commissions

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

---

## Notes

A resolved commission does not mean all related work is complete.

It means the named unresolved condition has been carried far enough that its current relation is known and the steward can decide what follows.

The term Pressure remains under architectural derivation. Until resolved, this register should treat pressure-language as a working read of an unresolved condition rather than an accepted Practice primitive.
