# R-005 — Programme Synthesis

**Programme:** Maintenance / Architecture  
**Type:** Synthesis (read-only consolidation)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** R-003, R-004, D-024, D-025, P-001–P-013, O-001–O-006, `public-surface-manifest.mjs`  
**Repository HEAD:** `1e0b526` — Observatory mechanics pipeline + P/O research programme

---

## Executive summary

Reality Mechanics is a **five-surface public programme** with a **three-layer repository model** (Atlas → Stewardship → Platform) and a **three-system Observatory runtime** (Mechanics → Read Engine → Renderer).

| Domain | Current state |
|---|---|
| **Public product** | Observatory · Pulse · Theory · Proof · Calculus (+ MCP doorway) |
| **Programme truth** | `public-surface-manifest.mjs` — one source, website + MCP readers |
| **Observatory runtime** | L0–L6 contract (`INVARIANT_RUNTIME_CONTRACT.md`); Read Engine module pattern (`read-engine.mjs`) |
| **Research front** | P-001–P-013 resolved; O-001–O-006 implemented; participation/fabric reads **not** yet instrumented |
| **What not to promote** | Calculus operations; painted fields; Atlas Ratio ≡ Derived Ratio; new primitives without commission |

**Start here for future work:** `docs/PROGRAMME_INDEX.md`

---

## 1. Public programme (five surfaces)

Canonical description: **`public-surface-manifest.mjs`** `PUBLIC_SURFACES`. Do not duplicate surface roles in root docs — link to manifest.

| Surface | Public name | Route / worker | Reads Atlas? |
|---|---|---|---|
| Observatory | Observatory | `realitymechanics.nz` `/`, `/field` | Yes — D1 read-model |
| Pulse | Pulse | `calibration.realitymechanics.nz` | No — mechanical demo |
| Theory | Theory | `/theory` | No — links canonical docs |
| Proof | Proof | `/proof`, `/submission` | No — evidence coordination |
| Calculus | Calculus | `/calculus` | No — renders manifest derivation data |
| MCP | MCP | `mcp.realitymechanics.nz/mcp` | Yes — read-only |

**Legacy infrastructure names** (still in code, not public vocabulary): Field, Calibration, `garden_config`, `/api/field/*`. See R-003 §1.2B.

---

## 2. Repository layers

```text
Atlas (GitHub markdown)  →  Stewardship (audit method)  →  Platform (Workers + D1)
```

- **Atlas edits:** `Reality_Mechanics/` only — D1 is generated, not edited (`README.md`).
- **Stewardship:** `docs/stewardship/` — verification, not authoring.
- **Platform:** `.atlas-publisher/`, `member/`, `reality-mechanics-mcp/`.

---

## 3. Observatory architecture (post P/O)

Synthesised from P-013, O-006:

```text
L0–L3  Structure + ratio register + parallel reads (deriveFieldStatesPayload)
L4     Mechanics — resolveLeg, weave-state, compression limits (thread-mechanics.mjs)
       Read Engine — versioned recognition modules (read-engine.mjs)  [NOT a P-003 layer]
L5     Overlay — traversal, frame, session (client)
L6     Appearance — canvas; must follow mechanics, not invent reads
```

**Protected principle:** The Observatory does not paint meaning. It derives reads, then lets appearance follow.

### Implemented read resolvers (catalogue)

| ID | Module | Delivery |
|---|---|---|
| R-OT | `order-terminal.mjs` | Term sheet + Mechanics |
| R-SG | `gathering-read.mjs` | Mechanics |
| R-WM/R-FE | `weave-read.mjs` | Mechanics evidence / appearance gate |
| R-MAT | `maturity-read.mjs` | Field states API |
| R-BT | `field-behaviour-trace.mjs` | Meta-instrument |

### Open research frontiers (implied, not implemented)

- Participation threshold read (P-009)
- Fabric held-whole read (P-012)
- Reference-frame / closure annotation (P-010)
- Client bundle for shared `weave-state.mjs` (O-006 gap)

---

## 4. Commission programme map

| Series | Role | Register |
|---|---|---|
| **D-** | Observatory delivery | `docs/practice/COMMISSIONS.md` through D-026, D-024, D-025 |
| **P-** | Research / architecture | P-001–P-013 — investigations only |
| **O-** | Observatory implementation | O-001–O-006 — renderer/read passes |
| **R-** | Release / reconciliation | R-001–R-004, **R-005** (this), **R-006** |
| **M-** | Maintenance | M-001 programme sorting |

---

## 5. What is current vs superseded

See `docs/reports/SUPERSESSION_INDEX.md`. In short:

| Current | Superseded |
|---|---|
| Five surfaces + Calculus (D-024/D-025) | D-021.5 four-surface framing |
| `public-surface-manifest.mjs` | R-002 `programme-orientation.mjs` (discarded R-004) |
| `get_public_surfaces` MCP tools | R-002 `get_public_programme` |
| Read Engine (O-006) | Ad-hoc gathering/order-terminal only |
| P-013 partial formalise | P-003 "Read is not one layer" still holds |

---

## 6. What not to promote

1. **Calculus** — derivation surface only; no accepted operation; four-status vocabulary preserved.
2. **Painted fields** — gathering, fabric, participation as canvas layers without mechanical read.
3. **New Atlas primitives** — without dependency evidence (P-006, P-011, P-012).
4. **Theory retirement** — `/theory` is live; Theory is not retired.
5. **Field-only product** — Observatory is the public name for the structural field instrument.

---

## 7. Recommended next commissions

| Priority | Commission theme | Evidence |
|---|---|---|
| 1 | Participation read (annotation) | P-009, Read Engine pattern |
| 2 | Client weave-state bundle | O-006 drift risk |
| 3 | D1 sync CI / version metadata | PROJECT_STATUS known unknowns |
| 4 | Documentation dedup (R-003 Phase 1) | MISSION, member README legacy names |
| 5 | Fabric held-whole read | P-012 — appearance follows read |

---

## References

| Document | Role |
|---|---|
| `docs/PROGRAMME_INDEX.md` | Entry index for contributors |
| `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` | Layer stack |
| `docs/runtime/READ_ENGINE.md` | Read module pattern |
| `docs/practice/COMMISSIONS.md` | Commission register |
| `docs/reports/R-006-operation-reconciliation.md` | Operational truth @ HEAD |

---

**Status:** R-005 complete. Programme synthesis for post–P/O architecture.
