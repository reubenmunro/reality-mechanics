# R-002 — Release Blocker Remediation

**Programme:** Release  
**Type:** Remediation (governed by R-001)  
**Date:** 2026-07-06 (UTC+12)  
**Base HEAD:** `083086c`  
**Governing audit:** `docs/reports/R-001-release-audit.md`

---

## Executive summary

R-002 addressed R-001's top three release blockers and the fourth MCP orientation gap. No new theory, maths, Atlas term edits, or features were added.

| R-001 blocker | R-002 outcome | Status |
|---|---|---|
| 1. Public retrace (private GitHub) | Safety scan complete; `PUBLIC_RELEASE_CHECKLIST.md` recommends public release; **visibility change is steward action** | **Downgraded** — prepared, not yet public |
| 2. Root documentation drift | `README.md`, `PROJECT_STATUS.md`, `CLOUDFLARE_SURFACE_MAP.md`, `SUBMISSION-001` updated for five surfaces | **Resolved** |
| 3. Observatory first-load emptiness | Loading readout, early animation loop, sheet closed on neutral open, modest home-field legibility | **Resolved** (code + tests) |
| 4. MCP programme orientation | `get_public_programme`, `get_governance_document` (read-only) | **Resolved** |

**Tests at completion:** 73 (atlas-publisher) + 18 (member) + 38 (MCP) = **129** — all passing.

---

## 1. Public retrace decision (blocker 1)

### Safety scan

| Check | Result |
|---|---|
| Hardcoded secrets in Workers | None |
| Committed `.env` | None |
| Copilot `data.json` (API keys) | Gitignored |
| GitHub Actions secrets | External only |
| Private material in tracked paths | None identified |

### Deliverables

- `docs/deployment/PUBLIC_RELEASE_CHECKLIST.md` — scan record, steward actions, post-public verification curls
- Recommendation: **safe to make repository public** after licence choice and steward visibility toggle

### Evidence

- Anonymous `github.com/reubenmunro/reality-mechanics` still returns **404** at audit time (infrastructure unchanged by R-002)
- Public surfaces continue to link to GitHub for retrace; links will work once repository is public
- No unsafe material was added to the tree

### Verdict

**Downgraded from blocker to steward action.** Repository is prepared; retrace path completes when steward sets visibility public and adds `LICENSE` if required.

---

## 2. Root documentation truth (blocker 2)

### Files updated

| File | Change |
|---|---|
| `README.md` | Five surfaces: Observatory · Pulse · Theory · Proof · Calculus; Theory not retired; MCP programme tools noted |
| `PROJECT_STATUS.md` | Platform table, operational model diagram, component register aligned to live programme |
| `docs/deployment/CLOUDFLARE_SURFACE_MAP.md` | Five HTML surfaces + MCP; 17 tools; retired-route message; R-002 verification probes |
| `docs/submissions/SUBMISSION-001-first-public-submission.md` | Surface table and exhibits §5.1–5.4 rewritten |

### Preserved retraceability

- Commission reports unchanged except new R-002 entry in `COMMISSIONS.md`
- Historical report paths cited; no retroactive edits to D-021–D-026 evidence

### Verdict

**Resolved.** Root docs now match live five-surface programme naming.

---

## 3. Observatory first impression (blocker 3)

### Problem (R-001)

- Bootstrap awaited `/api/field/states` (1–4s) with no visible readiness
- Neutral path called `openTermSheet()` immediately — sheet dominated first paint
- Home field low-alpha; appeared empty

### Changes (`.atlas-publisher/main-website-worker.js`)

| Change | Purpose |
|---|---|
| `#field-status` shows `Reading field…` during bootstrap | Visible readiness before API |
| `requestAnimationFrame(loop)` before `bootstrap()` | Canvas animates during load |
| Removed `openTermSheet()` from neutral bootstrap path | Field is the first read, not sheet |
| `closeTermSheet()` removes `sheet-open` / `open` classes | Sheet actually closes |
| Landing "Observe the Field" dismisses landing only | No sheet on observe |
| Modest home node/line/label alpha boost | Meaningful whole-field read (D-026 aesthetic preserved) |
| Bootstrap failure shows `Field unavailable` | Honest error state |

### Tests

- `R-002 Observatory first impression: readiness before API and sheet closed on neutral open`
- `R-002 landing observe dismisses without opening term sheet`

### Verdict

**Resolved** in code and tests. Live verification requires deploy of Observatory worker after merge.

---

## 4. MCP programme orientation (blocker 4)

### New module

`reality-mechanics-mcp/src/programme-orientation.mjs` — curated read-only programme data.

### New tools (read-only)

| Tool | Returns |
|---|---|
| `get_public_programme` | Surfaces, routes, architecture, release state, unresolved items, report index |
| `get_governance_document` | Excerpt + GitHub URL for mission, constitution, theory, proof, calculus, runtime_principles, open_questions, commissions |

### Integration

- `begin_atlas_session` → `next.forProgramme`
- `MCP_INSTRUCTIONS` mentions `get_public_programme`
- Server version **2.4.0**; tool count **17**

### Tests

11 new MCP assertions for programme orientation tools.

### Verdict

**Resolved.**

---

## R-001 top-three blocker scorecard

| Blocker | R-001 severity | Post-R-002 | Evidence |
|---|---|---|---|
| Private GitHub | High | **Downgraded** | Checklist + recommendation; steward toggles visibility |
| Doc drift | High | **Resolved** | Four root/submission docs updated |
| Observatory first load | High | **Resolved** | Worker changes + 2 tests; deploy pending |

---

## Constraints honoured

- No new theory or maths
- No Atlas term edits
- No D1 editing surface
- D-026 instrument aesthetic preserved
- MCP remains read-only (no write tools added)

---

## Commits (grouped by blocker)

Recommended grouping for steward review:

1. **Blocker 1:** `docs/deployment/PUBLIC_RELEASE_CHECKLIST.md`
2. **Blocker 2:** `README.md`, `PROJECT_STATUS.md`, `CLOUDFLARE_SURFACE_MAP.md`, `SUBMISSION-001`
3. **Blocker 3:** `.atlas-publisher/main-website-worker.js`, `field-states.test.mjs`
4. **Blocker 4:** `programme-orientation.mjs`, `reality-mechanics-mcp/src/index.js`, `worker.test.mjs`
5. **Report:** `R-002-release-blocker-remediation.md`, `COMMISSIONS.md`

---

## Remaining release gaps (not R-002 scope)

- Steward makes GitHub repository public and adds licence
- Deploy R-002 Observatory + MCP worker changes to production
- `garden_config.atlas_version` label still stale
- Commission C005 (D1 schema recovery) still open
- `DELIVERY_PLAN.md`, `REPOSITORY_VERIFICATION.md` still lag (R-001 noted; not top-three)

---

## Acceptance

R-001 top three blockers are **resolved or explicitly downgraded with evidence**:

1. **Public retrace** — downgraded with safety scan and public-release checklist; steward action documented
2. **Root doc truth** — resolved
3. **Observatory first impression** — resolved in repository; live after deploy

MCP programme orientation (R-001 fourth gap) — resolved.

**Programme release integrity:** Improved from R-001 **67% NOT READY** to **ready for steward public-GitHub decision** after deploy of worker changes.
