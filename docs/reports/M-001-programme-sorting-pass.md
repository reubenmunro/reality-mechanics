# M-001 — Programme Sorting Pass

**Programme:** Maintenance  
**Type:** Reconciliation (no theory, no renderer, no Atlas/D1 edits)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** R-003, R-004, R-005 (created), R-006 (created), current repository @ `1e0b526`

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| Root doc truth | **Done** — README, PROJECT_STATUS, CLOUDFLARE_SURFACE_MAP |
| R-005 / R-006 entry points | **Done** — synthesis + operation reconciliation |
| Supersession index + banners | **Done** — D-021.5, FABLE, R-002, R-004, S-001 |
| PROGRAMME_INDEX | **Done** — `docs/PROGRAMME_INDEX.md` |
| Manifest as product truth | **Done** — root docs link to manifest |
| Tests | **170 passing** |
| Report | This document |

**Acceptance:** A contributor can enter via `docs/PROGRAMME_INDEX.md` and know current vs superseded vs unresolved.

---

## 1. Root documentation fixes

| File | Change |
|---|---|
| `README.md` | Five surfaces; Theory live; architecture entry points; manifest link |
| `PROJECT_STATUS.md` | HEAD `1e0b526`; Observatory/Read Engine; 170 tests |
| `docs/deployment/CLOUDFLARE_SURFACE_MAP.md` | Five routes + Calculus; 17 MCP tools; readEngine probe |

**Removed stale claims:**

- Theory retired ❌ → Theory live at `/theory` ✓
- Field/Calibration/MCP-only product ❌ → Five surfaces + MCP ✓

---

## 2. New architectural documents

| Document | Role |
|---|---|
| `docs/reports/R-005-programme-synthesis.md` | Current architecture map |
| `docs/reports/R-006-operation-reconciliation.md` | HEAD operational truth |
| `docs/PROGRAMME_INDEX.md` | Single contributor entry |
| `docs/reports/SUPERSESSION_INDEX.md` | Superseded vs current index |

---

## 3. Supersession banners

Banners added (reports not deleted):

- `D-021.5-public-website-strip-back.md` — four → five surfaces
- `FABLE-REPO-STATE-FINDING-2026-07-06.md` — archival snapshot
- `R-002-release-blocker-remediation.md` — MCP orientation discarded
- `R-004-repository-truth-reconciliation.md` — extended by R-006
- `S-001-programme-characterisation.md` — pre-Calculus product map

---

## 4. Protected principle

> Sort the programme before extending it.

No theory added. No renderer changes. No Atlas/D1 edits. No Calculus promotion. Evidence preserved.

---

## 5. Tests

| Package | Count | Status |
|---|---:|---|
| `.atlas-publisher` | 110 | Pass |
| `member` | 18 | Pass |
| `reality-mechanics-mcp` | 42 | Pass |
| **Total** | **170** | **Pass** |

---

## 6. Next work (documented, not implemented)

See `docs/PROGRAMME_INDEX.md` §10 — participation read, client weave bundle, D1 CI, doc vocabulary pass.

---

**Status:** M-001 complete.
