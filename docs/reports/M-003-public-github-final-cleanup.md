# M-003 — Public GitHub Final Cleanup

**Commission:** M-003  
**State:** Resolved  
**Date:** 2026-07-07  
**Commit inspected:** `333773c` (base); this report committed on same maintenance pass  
**Governing principle:** Proof fails if the evidence path fails.

---

## 1. Repository state verified

| Check | Result |
|---|---|
| Branch | `main` |
| Working tree | Clean before M-003 commit |
| `HEAD` vs `origin/main` | Matched @ `333773c` |
| O-008 committed & pushed | Yes — `3e00067`…`333773c` chain |
| O-008 live | Yes — `o-008.v2`, `RMMechanics`, `drawWovenHomeField` on `/field` |
| GitHub visibility | **Public** — anonymous root URL HTTP **200** |

---

## 2. Public evidence link audit

### Method

Anonymous `curl -L` probes against GitHub URLs referenced from:

- Observatory HTML (`main-website-worker.js` — Theory, Proof, Calculus, landing Atlas link)
- Pulse worker (`member/src/index.js`)
- MCP worker (`reality-mechanics-mcp/src/index.js`)
- Root docs (`README.md`, `PROGRAMME_INDEX.md`, manifest)

### Results

| Target | HTTP | Notes |
|---|---|---|
| `github.com/reubenmunro/reality-mechanics` | 200 | Root — was 404 when private (R-001/R-002) |
| `…/tree/main/Reality_Mechanics` | 200 | Observatory “Browse the Atlas” |
| `…/blob/main/README.md` | 200 | |
| `…/blob/main/docs/PROGRAMME_INDEX.md` | 200 | |
| `…/blob/main/docs/reports/O-008-…` | 200 | |
| `…/blob/main/public-surface-manifest.mjs` | 200 | |
| `…/blob/main/Reality_Mechanics/Theory.md` | 200 | Theory page |
| `…/blob/main/docs/CONSTITUTION.md` | 200 | Theory page |
| `…/blob/main/docs/practice/RUNTIME_PRINCIPLES.md` | 200 | Theory page |
| `…/blob/main/docs/practice/PRACTICE_CALCULUS.md` | 200 | Theory + Calculus |
| `…/tree/main/docs/reports` | 200 | Proof retrace step |
| `…/blob/main/REPOSITORY_VERIFICATION.md` | 200 | Proof page |
| `…/blob/main/docs/stewardship/STEWARDSHIP_V1.md` | 200 | Proof page |
| `…/blob/main/docs/submissions/SUBMISSION-001-…` | 200 | Proof page |
| Commission / C-report paths sampled | 200 | Calculus + Proof citations |

**Broken links fixed:** None required — all sampled targets resolve after public release.

**Stale doc claims fixed:** Root truth docs updated from `1e0b526` / 170 tests to `333773c` / 176 tests; public-release checklist marked visibility resolved.

---

## 3. Files changed (M-003)

| File | Change |
|---|---|
| `README.md` | Public landing rewrite — surfaces, evidence model, MCP, Atlas workflow |
| `PROJECT_STATUS.md` | HEAD, tests, O-008, public GitHub, licence gap |
| `docs/PROGRAMME_INDEX.md` | M-003 reconciliation, test counts |
| `docs/deployment/CLOUDFLARE_SURFACE_MAP.md` | HEAD, O-008 live probe |
| `docs/deployment/PUBLIC_RELEASE_CHECKLIST.md` | Supersession — visibility resolved |
| `docs/practice/COMMISSIONS.md` | M-003 registered |
| `docs/reports/SUPERSESSION_INDEX.md` | O-001–O-004, R-006 partial; README entry |
| `docs/reports/O-001-…`, `O-002-…`, `O-004-…` | Supersession banners → O-008 |
| `docs/reports/R-006-…` | Partial supersession banner |
| `docs/runtime/READ_ENGINE.md` | Woven-field renderer module row |
| `docs/reports/M-003-public-github-final-cleanup.md` | This report |

**Not changed (per commission):** Atlas terms, Observatory mechanics, website design, public surfaces.

---

## 4. Supersession clarity

Historical reports **retained**. Banners or index entries added for:

| Material | Superseded by |
|---|---|
| D-021.5 four-surface framing | D-024/D-025 five surfaces (banner @ M-001) |
| FABLE snapshot @ `bf772fa` | R-006, M-003 (banner @ M-001) |
| R-002 MCP `get_public_programme` | D-025 `get_public_surfaces` (banner @ M-001) |
| S-001 product map | R-005 manifest (index) |
| O-001–O-004 renderer reports | **O-008** live activation (banners @ M-003) |
| R-006 HEAD/test claims | M-003 / O-008 extension (banner @ M-003) |

Index: [`SUPERSESSION_INDEX.md`](SUPERSESSION_INDEX.md)

---

## 5. GitHub metadata checklist (manual)

Steward action in GitHub **Settings → General**:

| Setting | Suggested value | Status |
|---|---|---|
| **Description** | Structural field programme — five public surfaces + read-only MCP | Manual |
| **Website** | `https://realitymechanics.nz` | Manual |
| **Topics** | `reality-mechanics`, `structural-reading`, `cloudflare-workers`, `atlas`, `mcp` | Manual |
| **Licence** | No `LICENSE` file in repository | **Unresolved — steward choice** |
| **About panel** | Link website + short description matching README | Manual |
| **Releases** | Optional — no release tagged at M-003 | Open |

Do not assume licence without steward decision.

---

## 6. Security / public-readiness scan

| Check | Result |
|---|---|
| Hardcoded secrets in workers | None found (grep: API tokens, `ghp_`, `sk-`) |
| Committed `.env` | None |
| GitHub Actions secrets | External only (`CLOUDFLARE_*`) — documented in README |
| Local paths in docs | None problematic |
| Obsidian plugin bulk | Present under `Reality_Mechanics/.obsidian/` — local tooling; copilot data gitignored |
| `atlas-doctor.mjs` | Referenced by pre-commit; **file absent** — operational gap, not secret |
| Generated junk in root | None identified |
| Deploy commands | Current — `npm --prefix … test`, `sync:d1 -- --apply`, GitHub Actions deploy |

**Uncertain / report only:**

- Obsidian plugin vendored JS is large third-party code — not deployed; consider future `.gitignore` scope (low priority).
- D1 database id hardcoded in wrangler configs — intentional; not a secret.

---

## 7. Test results

| Suite | Result |
|---|---|
| `.atlas-publisher` | **116/116 pass** |
| `member` | **18/18 pass** |
| `reality-mechanics-mcp` | **42/42 pass** |
| **Total** | **176 pass** |

---

## 8. Remaining risks

| Risk | Severity | Mitigation |
|---|---|---|
| No root `LICENSE` | Medium | Steward selects licence |
| D1 sync manual | Medium | Documented; automation open |
| `garden_config.atlas_version` lag | Low | Known; PROJECT_STATUS |
| R-005/R-006 body still cite `1e0b526` in places | Low | Banners + root docs current; full R-006 rewrite deferred |
| Pre-O-008 reports without banners | Low | O-001/O-002/O-004/R-006 updated; others in SUPERSESSION_INDEX |

---

## 9. Acceptance

A first-time public reviewer can:

1. Land on GitHub README and see five surfaces + evidence model.
2. Follow Proof/Theory/Calculus/Observatory links to **HTTP 200** GitHub sources.
3. Use `SUPERSESSION_INDEX.md` to avoid mistaking four-surface or pre-O-008 renderer reports for current truth.

**Evidence path:** operational @ M-003 completion.

---

*Commission M-003 resolved. Proceed to final website polish pass with coherent public backend.*
