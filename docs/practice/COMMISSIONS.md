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

---

## Notes

A resolved commission does not mean all related work is complete.

It means the named unresolved condition has been carried far enough that its current relation is known and the steward can decide what follows.

The term Pressure remains under architectural derivation. Until resolved, this register should treat pressure-language as a working read of an unresolved condition rather than an accepted Practice primitive.
