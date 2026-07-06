# Reality Mechanics — Programme Index

**Canonical entry document for contributors and AI workers.**  
**Last reconciled:** M-003 @ `333773c` (2026-07-07)

> Sort the programme before extending it.

---

## 1. Start here

| Priority | Document | Why |
|---|---|---|
| 1 | **This index** | What is current, superseded, unresolved |
| 2 | [`public-surface-manifest.mjs`](../public-surface-manifest.mjs) | **Product truth** — five surfaces + MCP; do not duplicate |
| 3 | [`docs/reports/R-005-programme-synthesis.md`](reports/R-005-programme-synthesis.md) | Current architecture synthesis |
| 4 | [`docs/reports/R-006-operation-reconciliation.md`](reports/R-006-operation-reconciliation.md) | Operational truth @ HEAD |
| 5 | [`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`](runtime/INVARIANT_RUNTIME_CONTRACT.md) | Observatory layer stack (P-003) |
| 6 | [`docs/runtime/READ_ENGINE.md`](runtime/READ_ENGINE.md) | Read module pattern (O-006) |
| 7 | [`docs/practice/COMMISSIONS.md`](practice/COMMISSIONS.md) | Commission register |

---

## 2. Public surfaces (five + MCP)

**Source of truth:** `public-surface-manifest.mjs` → `PUBLIC_SURFACES`

| Surface | Route | Infrastructure alias (code only) |
|---|---|---|
| **Observatory** | `realitymechanics.nz/`, `/field` | Field worker, `/api/field/*` |
| **Pulse** | `calibration.realitymechanics.nz` | Calibration worker, `member/` |
| **Theory** | `/theory` | Same Field worker |
| **Proof** | `/proof`, `/submission` | Same Field worker |
| **Calculus** | `/calculus` | Same Field worker; renders manifest |
| **MCP** | `mcp.realitymechanics.nz/mcp` | Read-only; 17 tools |

Theory is **live and public** — not retired.

---

## 3. Repository layers

```text
Atlas (Reality_Mechanics/)  →  Stewardship (docs/stewardship/)  →  Platform (Workers)
```

- Edit Atlas in GitHub → sync D1 manually → Field/MCP read generated model.
- See [`README.md`](../README.md) for sync commands.

---

## 4. Observatory runtime (current)

```text
Mechanics (L4)  →  Read Engine (modules)  →  Renderer (L5–L6)
```

| Contract | Path |
|---|---|
| Layer stack | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| Read catalogue | `.atlas-publisher/read-engine.mjs` |
| Thread mechanics | `.atlas-publisher/thread-mechanics.mjs` |
| Woven-field renderer | `.atlas-publisher/woven-field-renderer.mjs` (`RMMechanics` client bundle) |
| Behaviour trace API | `GET /api/field/behaviour-trace?id=` |

**Principle:** Derive reads first; appearance follows. Do not paint meaning.

---

## 5. Synthesis & reconciliation reports

| Report | Role |
|---|---|
| R-005 | Programme synthesis — architecture map |
| R-006 | Operation reconciliation — HEAD truth |
| R-004 | D-025 manifest reconciliation (historical) |
| R-003 | Coherence audit (historical; Phase 1 docs still open) |

---

## 6. Research programme (resolved investigations)

| Range | Topic | Entry |
|---|---|---|
| P-001–P-003 | Physics language, hierarchy, runtime contract | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| P-004–P-008 | Ratio, weave, carry/trace | P-008 for fabric threshold |
| P-009–P-010 | Participation, order-terminal | P-010 frame transition |
| P-011–P-013 | Thread mechanics, gathering, read engine | `docs/reports/P-011-thread-mechanics-investigation.md` |

| Range | Implementation | Entry |
|---|---|---|
| O-001–O-002 | Field/fabric renderer | O-002 fabric gating |
| O-003–O-006 | Reads + read engine | O-006 formalisation |
| O-008 | Renderer reconstruction | `docs/reports/O-008-observatory-renderer-reconstruction.md` — client `RMMechanics` activation |
| W-001 | Public experience polish — wayfinding, MCP orientation, accessibility | `docs/reports/W-001-public-experience-polish.md` |

Full register: `docs/practice/COMMISSIONS.md`

---

## 7. Open frontiers (unresolved)

| Frontier | Evidence | Do not |
|---|---|---|
| Participation read | P-009 | Paint collective field |
| Fabric held-whole read | P-012 | Paint fabric without weave |
| Pressure derivation | C-A001 | Promote Pressure as primitive |
| D1 sync automation | PROJECT_STATUS | Edit D1 directly |
| Client weave-state read bundle | O-006 §5 | Fork weave logic in draw* — thread resolver now in `RMMechanics`; full weave-state read bundle still server-side |

---

## 8. Superseded documents

**Do not treat as current truth.** See [`docs/reports/SUPERSESSION_INDEX.md`](reports/SUPERSESSION_INDEX.md).

| Superseded | Current |
|---|---|
| D-021.5 four-surface framing | D-024 + D-025 five surfaces |
| R-002 MCP `get_public_programme` | D-025 `get_public_surfaces` |
| S-001 Field/Calibration product map | R-005 five-surface synthesis |
| FABLE snapshot @ `bf772fa` | R-006, M-003 @ `333773c` |
| Root docs Field-only | This index + manifest |

---

## 9. What not to promote

1. Calculus operations or `: operator`
2. Atlas/Derived Ratio identity
3. New renderer fields without read commission
4. Theory retirement (it is live at `/theory`)
5. Reports as decisions (C007 — evidence only)

---

## 10. Next recommended commissions

1. **Participation read annotation** — P-009 + Read Engine pattern  
2. **Client weave-state bundle** — close O-006 drift gap  
3. **D1 sync / version metadata** — operational gap  
4. **Root doc vocabulary pass** — MISSION, member README (R-003 Phase 1)

---

## 11. Quick commands

```bash
npm --prefix .atlas-publisher test    # 116 tests
npm --prefix member test              # 18 tests
npm --prefix reality-mechanics-mcp test # 42 tests
npm --prefix .atlas-publisher run sync:d1 -- --apply  # after Atlas edits
```

---

*Maintained by M-001, M-003. Update when operational facts or synthesis reports change.*
