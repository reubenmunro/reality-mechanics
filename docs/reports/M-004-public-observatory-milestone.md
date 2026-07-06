# Public Observatory Milestone

**Commission:** M-004  
**State:** Resolved  
**Date:** 2026-07-07  
**Repository HEAD at closure:** `66b14a8` (W-001)  
**Type:** Stewardship record — no implementation

---

## Purpose

Reality Mechanics completed its first publicly inspectable programme: five surfaces, a read-only MCP, a public GitHub evidence backend, and an Observatory that renders derived mechanics rather than decorative structure. This document records that milestone before development pauses. It is a historical record of what became true at Phase One closure — not a roadmap, not a promotion, and not a claim that the discipline is finished.

---

## What now exists

### Public surfaces (live)

| Surface | URL | Role (as deployed) |
|---|---|---|
| **Observatory** | [realitymechanics.nz](https://realitymechanics.nz), `/field` | Whole-field woven instrument; D1-derived states; neutral open on first load |
| **Pulse** | [calibration.realitymechanics.nz](https://calibration.realitymechanics.nz) | Mechanical calibration instrument; no Atlas mutation |
| **Theory** | `/theory` | Public claim orientation; links to canonical repository documents |
| **Proof** | `/proof`, `/submission` | Retrace pathway; evidence coordination |
| **Calculus** | `/calculus` | Derivation surface from `public-surface-manifest.mjs`; nothing promoted beyond source status |

### MCP

- **Endpoint:** `https://mcp.realitymechanics.nz/mcp`
- **Character:** Read-only; 17 tools; shares manifest with website (D-025)
- **Orientation:** Documented on Theory, Proof, and Calculus via W-001 “Two ways in”

### GitHub evidence

- Repository **public** — anonymous links return HTTP 200 (verified M-003)
- README, `PROGRAMME_INDEX.md`, commission reports, runtime contracts, and manifest cohere at HEAD
- Website surfaces link to GitHub sources; Proof and Calculus state the evidence ladder explicitly (W-001)

### Atlas

- ~490 terms in `Reality_Mechanics/` — editable canonical source in GitHub
- D1 (`atlas-d1`) is a **generated** read-model; manual sync from repository
- Observatory and MCP read D1; they do not edit Atlas terms through public surfaces

---

## What was achieved

Recorded outcomes from resolved commissions — evidence only:

| Outcome | Commission / record |
|---|---|
| Five-surface public architecture | D-024, D-025, R-005 |
| Product truth in one manifest | `public-surface-manifest.mjs` |
| Programme entry and supersession index | M-001, `PROGRAMME_INDEX.md`, `SUPERSESSION_INDEX.md` |
| Public GitHub cleanup and link audit | M-003 |
| Invariant runtime layer stack (L0–L6) | P-003, `INVARIANT_RUNTIME_CONTRACT.md` |
| Thread mechanics resolver (TMS) | P-011, O-004, `thread-mechanics.mjs` |
| Read Engine module pattern | P-013, O-006, `read-engine.mjs`, `READ_ENGINE.md` |
| Woven-field Observatory renderer (client activation) | O-008, `woven-field-renderer.mjs`, `RMMechanics` @ `o-008.v2` |
| Behaviour retrace API + Mechanics panel reads | D-012, O-003, O-005, O-006 |
| Public experience wayfinding (human / AI paths) | W-001 |
| CI deploy of Observatory, Pulse, MCP on `main` | `.github/workflows/deploy.yml` |
| Test suites | 122 (atlas-publisher) · 20 (member) · 42 (MCP) @ `66b14a8` |

The Observatory first-load field now expresses carry/trace weave mechanics derived from Atlas structure (O-008). Public pages distinguish observing from AI participation without treating either as superior (W-001).

---

## What did NOT happen

Important negatives — preserved deliberately:

| Item | Status |
|---|---|
| **Calculus promoted** | No — candidate calculus and `:` operator remain unpromoted |
| **Pressure as Practice primitive** | Unresolved — C-A001; commission language remains working read only |
| **Participation / fabric held-whole reads painted** | No — P-009, P-012 research only; not instrumented on canvas |
| **D1 sync in CI** | No — manual `sync:d1 -- --apply` |
| **Root licence chosen** | No — no `LICENSE` file at closure |
| **Stewardship coverage complete** | No — audit method exists; coverage incomplete |
| **Reality Mechanics declared complete** | No — Atlas continues to evolve; open frontiers remain in `PROGRAMME_INDEX.md` |
| **Theory retired** | No — live at `/theory` |
| **Atlas edited via D1 or public surfaces** | No — GitHub remains canonical edit path |
| **MCP write path** | No — read-only by design |

Reports remain evidence, not steward decisions (C007 discipline).

---

## Current architectural state

Stable layering at Phase One closure:

```text
Atlas (Reality_Mechanics/ — GitHub canonical)
        ↓
Runtime contracts (INVARIANT_RUNTIME_CONTRACT, READ_ENGINE, manifest)
        ↓
Thread mechanics (thread-mechanics.mjs — L4 resolver)
        ↓
Read Engine (read-engine.mjs + modules — non-painting reads)
        ↓
Observatory renderer (woven-field-renderer.mjs — L5–L6 appearance)
        ↓
Public surfaces (Observatory · Pulse · Theory · Proof · Calculus)
        ↓
GitHub (evidence backend — public retrace)
        ↓
MCP (read-only traversal for AI workers)
```

**Operational note:** Pulse does not depend on MCP in its source (D-021.4 contract). Pulse orients participants toward other surfaces via wayfinding, not by embedding the MCP endpoint (W-001).

---

## Phase One conclusion

The first public programme is **publicly inspectable**.

A participant can observe the woven field, read the claim on Theory, retrace evidence on Proof, inspect derivation status on Calculus, sense mechanical behaviour on Pulse, and follow links to GitHub sources that resolve anonymously. An AI worker can enter through the read-only MCP, read the same manifest the website renders, and traverse Atlas structure without mutating it.

Evidence is no longer private-by-default. Programme orientation is indexed (`PROGRAMME_INDEX.md`). Superseded narratives are marked (`SUPERSESSION_INDEX.md`). The closing commissions (M-003, W-001) addressed the evidence path and public wayfinding — the last gaps before pause.

This milestone marks **completion of the first publicly inspectable programme**, not completion of Reality Mechanics as a discipline.

---

## Next era

Future work should arise from **observation, use, and retrace** — what participants and stewards learn from living with the public programme — rather than from continuous expansion for its own sake.

Open frontiers recorded in `PROGRAMME_INDEX.md` (participation read, D1 automation, licence, stewardship coverage, and others) remain **unresolved**. They are not assigned here.

Development pauses with a stable, documented foundation.

---

*M-004 complete. Phase One closed @ `66b14a8`.*
