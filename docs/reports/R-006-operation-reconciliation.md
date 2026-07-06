# R-006 — Operation Reconciliation

> **Partial supersession (M-003):** Operational inventory remains valid. **HEAD commit, test counts, and Observatory renderer status** in this report are pre-O-008 (`1e0b526`). Current HEAD: `333773c`; tests: **176**; live renderer: O-008 @ `o-008.v2`.

**Programme:** Maintenance  
**Type:** Operational reconciliation (extends R-004)  
**Date:** 2026-07-07 (UTC+12)  
**Governing synthesis:** `docs/reports/R-005-programme-synthesis.md`  
**Prior reconciliation:** R-004 @ `a094565` (D-025)  
**Repository HEAD:** `1e0b526`

---

## Executive summary

R-006 reconciles **operational truth** after the P/O research and implementation programme landed on `main`.

| Check | R-004 (2026-07-06) | R-006 (2026-07-07) |
|---|---|---|
| HEAD | `a094565` | `1e0b526` |
| Programme manifest | `public-surface-manifest.mjs` | **Unchanged — still canonical** |
| MCP programme tools | `get_public_surfaces`, `get_derivation_status` | **Unchanged** |
| Observatory tests | 74 (atlas-publisher) | **110** |
| Read Engine | Not present | **`read-engine.mjs` + catalogue** |
| Thread mechanics | Partial inline | **`thread-mechanics.mjs` + O-004** |

**Acceptance:** One manifest, one MCP reader model, extended mechanics/read modules documented, root docs aligned (M-001).

---

## 1. Commits since R-004

| Commit | Summary |
|---|---|
| `1e0b526` | Observatory mechanics pipeline: thread-mechanics, gathering-read, read-engine, P-001–P-013 + O-001–O-006 reports, runtime contracts |

No competing programme-orientation module. No Atlas or D1 edits in this delta.

---

## 2. Module inventory (Observatory)

| Module | Layer | Since |
|---|---|---|
| `thread-mechanics.mjs` | L4 mechanics | O-004 |
| `order-terminal.mjs` | Read | O-003 |
| `gathering-read.mjs` | Read | O-005 |
| `read-engine.mjs` | Read orchestration | O-006 |
| `weave-read.mjs` | Read | O-006 |
| `maturity-read.mjs` | Read | O-006 |
| `weave-state.mjs` | Mechanics substrate | O-006 |
| `ratio-register.mjs` | L2 mechanics | O-006 |
| `field-behaviour-trace.mjs` | Meta-instrument | D-012; imports read-engine |

---

## 3. API surfaces (unchanged routes)

| Route | Purpose |
|---|---|
| `GET /api/field/states` | L0–L3 derived states |
| `GET /api/field/behaviour-trace?id=` | D-012 trace + `readEngine` bundle (O-006) |

Behaviour trace response adds:

```json
{
  "readEngine": {
    "version": "read-engine.v1",
    "catalogue": ["order-terminal", "structural-gathering", ...],
    "reads": { ... }
  }
}
```

Legacy fields `orderTerminal`, `gatheringRead`, `gatheringReadAnnotation` preserved.

---

## 4. Test reconciliation

| Package | R-004 | R-006 |
|---|---:|---:|
| `.atlas-publisher` | 74 | **110** |
| `member` | 18 | 18 |
| `reality-mechanics-mcp` | 42 | 42 |
| **Total** | 134 | **170** |

New test files: `gathering-read`, `read-engine`, `weave-state`, `thread-mechanics`, `order-terminal`.

---

## 5. Known operational gaps (unchanged + new)

| Gap | Status | Record |
|---|---|---|
| D1 sync manual | Open | `CLOUDFLARE_SURFACE_MAP.md` |
| `garden_config.atlas_version` label lag | Open | D-013, D-019 |
| Client `buildHomeWeaveState` mirrors `weave-state.mjs` | Open — documented | O-006 |
| `atlas-doctor.mjs` missing | Open | PROJECT_STATUS |
| Participation / fabric reads | Research only | P-009, P-012 |

---

## 6. Deployment note

Push `1e0b526` to `origin/main` deploys Observatory worker with mechanics/read modules. No new public routes. Visual behaviour unchanged except mechanics panel reads already commissioned (O-003, O-005).

---

## 7. Acceptance

| Criterion | Met? |
|---|---|
| Extends R-004 without forking manifest | Yes |
| Documents post–P/O module truth | Yes |
| Test counts reconciled | Yes |
| Root docs updated (M-001) | Yes |
| No theory/Atlas/D1 edits | Yes |

---

**Status:** R-006 complete. Operational reconciliation @ `1e0b526`.
