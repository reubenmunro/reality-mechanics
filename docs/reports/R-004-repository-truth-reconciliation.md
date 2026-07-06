# R-004 — Repository Truth Reconciliation

> **Supersession (M-001):** Phase 0 reconciliation @ `a094565` remains valid for D-025 manifest. **Extended** by P/O programme @ `1e0b526` — see [`R-006-operation-reconciliation.md`](R-006-operation-reconciliation.md).

**Programme:** Release  
**Type:** Phase 0 reconciliation (governed by R-003)  
**Date:** 2026-07-06 (UTC+12)  
**Governing audit:** `docs/reports/R-003-programme-coherence.md`  
**Base:** `origin/main` @ `a094565` (D-025)

---

## Executive summary

R-004 executed R-003 Phase 0: **one local HEAD, one origin/main, one programme manifest, one MCP programme reader model.**

| Task | Outcome |
|---|---|
| Pull/reconcile `origin/main` (D-025) | **Done** — fast-forward to `a094565` |
| Preserve R-002 Observatory first-load fixes | **Done** — re-applied atop D-025 worker |
| Discard R-002 `programme-orientation.mjs` | **Done** — file removed; never committed |
| Discard R-002 MCP tool names | **Done** — `get_public_programme` / `get_governance_document` not in tree |
| Keep `public-surface-manifest.mjs` as single truth | **Done** — website + MCP import it |
| Public naming | **Verified** — Observatory · Pulse · Theory · Proof · Calculus |
| Tests | **134 passing** — 74 + 18 + 42 |

**Acceptance:** Met. No competing R-002 orientation module remains.

---

## 1. Problem (R-003 diagnosis)

Before R-004, three programme truths coexisted:

| Layer | State |
|---|---|
| Production MCP | `get_public_surfaces`, `get_derivation_status` (D-025) |
| `origin/main` | `public-surface-manifest.mjs` @ `a094565` |
| Local `HEAD` | `083086c` (behind origin) |
| Uncommitted R-002 | `programme-orientation.mjs` + duplicate MCP tools |

---

## 2. Actions taken

### 2.1 Reconcile to D-025

```text
git merge origin/main  →  fast-forward 083086c..a094565
```

Files gained from D-025:

| File | Role |
|---|---|
| `public-surface-manifest.mjs` | Canonical programme data |
| `docs/reports/D-025-mcp-read-surface-alignment.md` | Commission evidence |
| `.github/workflows/deploy.yml` | Manifest in deploy path filters |
| `reality-mechanics-mcp/src/index.js` | `get_public_surfaces`, `get_derivation_status` |
| `.atlas-publisher/main-website-worker.js` | Calculus HTML from manifest |

### 2.2 Discard R-002 duplicate orientation

| Removed | Reason |
|---|---|
| `reality-mechanics-mcp/src/programme-orientation.mjs` | Duplicated D-025 manifest |
| R-002 MCP edits (`get_public_programme`, `get_governance_document`) | Reverted before merge; D-025 tools retained |

### 2.3 Preserve R-002 Observatory fixes

Re-applied to D-025 worker (uncommitted delta on `main-website-worker.js`):

| Fix | Purpose |
|---|---|
| `#field-status` → `Reading field…` during bootstrap | Visible readiness |
| `requestAnimationFrame(loop)` before `bootstrap()` | Canvas animates during API wait |
| Neutral path: no `openTermSheet()` on first paint | Field is the first read |
| `closeTermSheet()` removes `sheet-open` / `open` classes | Sheet actually closes |
| Landing observe → `closeTermSheet()` only | No sheet on dismiss |
| Modest home-field alpha boost | Legibility (D-026 preserved) |
| Bootstrap failure → `Field unavailable` | Honest error state |

Tests added as `R-004 Observatory first impression` and `R-004 landing observe` in `field-states.test.mjs`.

### 2.4 One manifest, two readers (verified)

| Reader | Import | Reads |
|---|---|---|
| Observatory worker | `from "../public-surface-manifest.mjs"` | Calculus vocab/chain/inventory HTML |
| MCP worker | `from "../../public-surface-manifest.mjs"` | `get_public_surfaces`, `get_derivation_status` |

Test `D-025 Calculus page and MCP render from one manifest` confirms chain rules, vocabulary, and inventory match manifest exports.

---

## 3. Public surface naming (verified)

From `public-surface-manifest.mjs` `PUBLIC_SURFACES`:

| `name` | Route(s) |
|---|---|
| Observatory | `/`, `/field` |
| Pulse | `calibration.realitymechanics.nz/` |
| Theory | `/theory` |
| Proof | `/proof` |
| Calculus | `/calculus` |
| MCP | `mcp.realitymechanics.nz/mcp` |

MCP test: `get_public_surfaces covers Observatory, Pulse, Theory, Proof, Calculus, MCP`.

---

## 4. Test results

| Package | Count | Status |
|---|---:|---|
| `.atlas-publisher` | 74 | All pass |
| `member` | 18 | All pass |
| `reality-mechanics-mcp` | 42 | All pass |
| **Total** | **134** | **All pass** |

New/confirmed coverage:

- D-025 manifest ↔ Calculus HTML drift test
- D-025 MCP `get_public_surfaces` / `get_derivation_status` (12 assertions)
- R-004 Observatory first-load tests (2)

---

## 5. Repository state after R-004

| Check | Result |
|---|---|
| `git rev-parse HEAD` | `a094565` |
| `git rev-parse origin/main` | `a094565` |
| HEAD = origin/main | **Yes** (same commit) |
| `programme-orientation.mjs` exists | **No** |
| `get_public_programme` in MCP | **No** |
| `get_public_surfaces` in MCP | **Yes** |
| `public-surface-manifest.mjs` exists | **Yes** |
| Uncommitted changes | Observatory R-002 fixes + R-004 tests only |

**Note:** Observatory fixes are in the working tree atop `a094565`; deploy required for live first-load behaviour to match repository.

---

## 6. What was explicitly not done (per scope)

- No new features, surfaces, or infrastructure renames
- No report archival (R-003 Phase 1)
- No Atlas term edits
- No D1 edits
- Doc stash (`r004-docs`, `r002-observatory`) may remain in `git stash list` — superseded by merge + patch apply

---

## 7. Acceptance checklist

| Criterion | Met? |
|---|---|
| One local HEAD | Yes — `a094565` |
| One origin/main | Yes — matches HEAD |
| One programme manifest | Yes — `public-surface-manifest.mjs` |
| One MCP programme reader model | Yes — `get_public_surfaces` + `get_derivation_status` |
| No competing R-002 orientation module | Yes — removed |
| Observatory · Pulse · Theory · Proof · Calculus naming | Yes |
| All tests pass | Yes — 134 |

---

## 8. Next step (out of scope)

Deploy uncommitted Observatory fixes so production matches repository first-load behaviour. R-003 Phase 1 (documentation deduplication) remains separate.

---

*R-004 complete. Phase 0 reconciliation only.*
