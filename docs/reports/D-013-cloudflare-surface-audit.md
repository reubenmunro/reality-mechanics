# D-013 — Cloudflare Surface Audit + Clean Redeploy Plan

**Programme:** Deployment / Observatory  
**Type:** Cloudflare surface audit  
**Date:** 2026-07-05  
**Repository HEAD:** `9550d0f` (D-012 deployed)  
**Method:** Live HTTP probes, Cloudflare MCP inventory, D1 queries, GitHub Actions history, repository deploy config review. **No deletions performed.**

**Canonical map:** [`docs/deployment/CLOUDFLARE_SURFACE_MAP.md`](../deployment/CLOUDFLARE_SURFACE_MAP.md)

---

## Executive summary

**Current Observatory mechanics are live and match repository HEAD.** D-010B (unified ratio), D-012 (Mechanics panel + behaviour-trace API) confirmed on production after deploy run `28736881065` (2026-07-05T09:54Z).

**Cloudflare does contain stale Garden-era workers and KV**, but they **do not appear to block** current Field mechanics. No route conflict was found on `realitymechanics.nz`.

**Primary operational gap:** D1 sync is **manual** and **not triggered by CI**. Atlas-only commits do not update the read model until `sync:d1 --apply`. D1 was synced manually during this audit session (490 entries).

**Primary deploy hazard:** `Deploy Main Website.command` can deploy Field **without D1 binding** if used instead of CI.

---

## 1. Cloudflare Workers

### Active inventory (account API, 2026-07-05)

| Worker | Modified | Route / purpose | Status |
|---|---|---|---|
| `super-frost-d434` | 2026-07-05T09:54:56Z | `realitymechanics.nz` | **Active Field** |
| `reality-mechanics-calibration` | 2026-07-05T09:54:50Z | `calibration.realitymechanics.nz` | **Active** |
| `reality-mechanics-mcp` | 2026-07-05T09:54:50Z | `mcp.realitymechanics.nz` | **Active** |

### Orphan / retired workers (no current public route)

| Worker | Modified | Evidence |
|---|---|---|
| `reality-mechanics-garden` | 2026-07-02 | Garden retired; `/garden` → 410 on Field worker |
| `reality-mechanics-garden-steward` | 2026-07-02 | No route; not in repo deploy pipeline |
| `reality-mechanics-garden-ground-check` | 2026-07-02 | Same |
| `reality-mechanics-garden-cycle` | 2026-07-02 | Same |
| `reality-mechanics-api-gardener` | 2026-07-02 | Same |
| `atlas-publisher` | 2026-06-30 | Superseded by `super-frost-d434`; not in `wrangler.toml` |

**Count:** 9 workers total — **3 active**, **6 orphaned**.

### Routes and conflicts

| Check | Result |
|---|---|
| `realitymechanics.nz` → Field | HTTP 200 |
| Retired paths (`/garden`, `/atlas`, `/ark`, …) | HTTP 410 (Field worker) |
| `garden.realitymechanics.nz` | DNS/connect failure (no live surface) |
| `*.workers.dev` probes | No response / not used for production |

**No route conflict** found between active and orphan workers on public Observatory domains.

### Last deployed commit

| Source | Commit | Time |
|---|---|---|
| GitHub Actions `28736881065` | `9550d0f` (D-012) | 2026-07-05T09:54–09:55Z |
| Cloudflare `super-frost-d434.modified_on` | aligns with above | 2026-07-05T09:54:56Z |

Jobs: Field ✓, Calibration ✓, MCP ✓, Cloudflare secrets ✓.

Workers Builds API returned **0 builds** for Field worker ID — deploys use `wrangler deploy` via GitHub Actions, not Workers Builds CI.

---

## 2. D1

| Property | Live value | Repository expectation |
|---|---|---|
| Database | `atlas-d1` (`ffc9622e-…`) | Matches both `wrangler.toml` files |
| Entry count | **490** | Sync script: 490 tracked notes |
| `garden_config.atlas_version` | `2026.07.03-i983` | Label may lag manual sync (metadata not auto-bumped) |
| `field_ratio_mode_thresholds` | **Not in D1** | Code defaults: transitional ≥3, continuous ≥8 |
| Schema | 15 tables incl. Garden legacy | Field reads `entries`, `entry_revisions`, `proposals`, `garden_config` |

### Repository vs D1

| Check | Result |
|---|---|
| Sync dry-run | 490 notes from repo checkout |
| Live `/api/field/states` | 490 states |
| Probe entries `first.relation`, `first.carry` | Present; `updated` 2026-07-05 |
| Sync automation | **Manual only** — `npm --prefix .atlas-publisher run sync:d1 -- --apply` |

**CI does not sync D1.** Pushes changing only `Reality_Mechanics/**` or `docs/**` do **not** deploy workers or update D1.

---

## 3. Public surfaces

| Surface | URL | HTTP | Verified |
|---|---|---:|---|
| Field root | `https://realitymechanics.nz/` | 200 | ✓ |
| Field | `https://realitymechanics.nz/field` | 200 | ✓ |
| Submission 001 | `/submission` | 200 | ✓ |
| Calibration | `https://calibration.realitymechanics.nz/api/health` | 200 | ✓ |
| MCP | `POST …/mcp` initialize | 200 | ✓ v2.3.0 |
| MCP tools | `tools/list` | 15 tools | ✓ |
| MCP D1 read | `get_entry first.relation` | Returns Relation | ✓ |
| Retired `/atlas`, `/garden`, `/ark`, `/api/field/entries`, `/api/ark/enter` | — | 410 | ✓ |

---

## 4. Caching

| Resource | Header | Stale bundle risk |
|---|---|---|
| Field HTML | `Cache-Control: no-cache` | **Low** — worker serves inline bundle |
| `/api/field/states` | `public, max-age=120` | Low — 2 min TTL; structure changes need sync anyway |
| `/api/field/behaviour-trace` | `no-store` | None |

### Live bundle verification (2026-07-05)

| Marker | Expected (post D-010B/D-012) | Live |
|---|---|---|
| `mechanics-panel` | present | ✓ |
| `fetch('/api/field/behaviour-trace` | present | ✓ |
| `termRatioMode(a)` (all relations) | present | ✓ |
| `discreteRatioMode` | absent | ✓ (0 matches) |
| `holdTransition = isHold` | present (D-010B) | ✓ |
| `?debug=mechanics` | panel markup in HTML | ✓ |

**Mechanics panel visibility:** Hidden by default. Requires `?debug=mechanics` or **Shift+M**. This is **by design**, not a deployment failure.

---

## 5. Verification probes (live results)

### Field mechanics

```
GET /field?debug=mechanics     → mechanics-panel, behaviour-trace, Shift+M toggles
GET /api/field/behaviour-trace?id=first.relation
  → focusId: first.relation
  → behaviours: 5
  → carriers: 23
  → compression hiddenOutgoing: 11
GET /api/field/states
  → atlasVersion: 2026.07.03-i983
  → states: 490
```

### Ratio generalisation (D-010B)

Live bundle uses shared `termRatioMode(a)` for all relation types. Per-type application weights remain in render formulas (pre-existing). **Confirmed live.**

### Behaviour retrace (D-012)

API and client panel infrastructure **live**. Panel opt-in only.

---

## 6. Breakpoints — where mechanics fail to show

| # | Condition | Symptom | Root cause | Severity |
|---|---|---|---|---|
| B1 | User expects Mechanics panel without opt-in | Panel not visible | Debug mode off (`?debug=mechanics` / Shift+M) | **Design** — not a bug |
| B2 | Atlas edited; D1 not synced | Field/MCP prose/structure stale | Manual sync not run; CI excludes D1 | **Operational** |
| B3 | `Deploy Main Website.command` used | Field 503 / empty states | Deploy without `wrangler.toml` D1 binding | **Hazard** |
| B4 | Docs-only push after worker change | N/A today | CI path filters skip deploy | Expected |
| B5 | Orphan Garden workers | None on public routes | Legacy resources | **Hygiene** — no current block |
| B6 | `atlas_version` label | May not reflect sync date | Not updated by sync script | **Metadata** — cosmetic |

**No breakpoint found** where D-010B/D-012 mechanics are deployed but broken on `realitymechanics.nz` after commit `9550d0f`.

---

## 7. Repository / deploy pipeline

| Component | Configuration | Gap |
|---|---|---|
| CI | `.github/workflows/deploy.yml` | Does not sync D1 |
| Field wrangler | `.atlas-publisher/wrangler.toml` → `super-frost-d434`, D1 bound | ✓ |
| Local Field deploy | `Deploy Main Website.command` | **No D1 binding** — diverges from CI |
| D1 sync | `sync-d1-from-repo.mjs` + `Sync Atlas D1 from GitHub.command` | Manual |
| Atlas changes | `Reality_Mechanics/**` | No CI trigger |

---

## 8. Delete list (evidence only — not executed)

Delete only after steward confirms no external dependency.

| Resource | Type | Evidence for safe deletion |
|---|---|---|
| `reality-mechanics-garden` | Worker | Garden retired; 410 on `/garden`; not in deploy.yml |
| `reality-mechanics-garden-steward` | Worker | Not routed; not in repo |
| `reality-mechanics-garden-ground-check` | Worker | Same |
| `reality-mechanics-garden-cycle` | Worker | Same |
| `reality-mechanics-api-gardener` | Worker | Same |
| `atlas-publisher` | Worker | Superseded by `super-frost-d434` |
| `atlas-garden` | KV namespace | Garden retired; verify no worker binding before delete |

**Do not delete (yet):**

- `atlas-d1` or Garden-era **D1 tables** — `proposals` / `entry_revisions` still used for Field maturity derivation; schema cleanup needs separate commission.

---

## 9. Clean redeploy plan

Next actions are **implementation**, not further investigation.

### Phase A — Confirm current state (complete in D-013)

- [x] Verify live bundle matches `9550d0f`
- [x] Verify D-010B + D-012 probes
- [x] Inventory workers, D1, routes

### Phase B — Operational hardening (no Cloudflare deletes)

1. **Standardize Field deploy** — use GitHub Actions or `cd .atlas-publisher && npx wrangler deploy` only. Deprecate or fix `Deploy Main Website.command` to use repo `wrangler.toml` (include D1 binding).
2. **Document sync discipline** — after Atlas structure commits: `npm --prefix .atlas-publisher run sync:d1 -- --apply`.
3. **Optional:** bump `garden_config.atlas_version` during sync when steward wants visible version alignment.

### Phase C — Cloudflare cleanup (steward approval required)

1. Delete six orphan workers (§8 delete list).
2. Delete `atlas-garden` KV namespace after confirming zero bindings.
3. Re-run §Verification probes from `CLOUDFLARE_SURFACE_MAP.md`.

### Phase D — Follow-on commissions (optional)

| Item | Rationale |
|---|---|
| CI job for D1 sync on `Reality_Mechanics/**` | Closes B2 |
| Pin wrangler + lockfile in `.atlas-publisher` | Reproducible Field builds |
| D1 schema retirement plan | Garden tables unused by Field/MCP |

---

## 10. Acceptance

| Criterion | Status |
|---|---|
| No deletion without evidence | **Pass** — delete list documented, nothing deleted |
| All current public surfaces verified | **Pass** |
| Stale surfaces identified | **Pass** — 6 workers + 1 KV |
| Current mechanics live or exact failure found | **Pass** — live; opt-in panel is design |
| Clean redeploy plan produced | **Pass** — §9 |
| Next action is implementation | **Pass** — Phase B/C |

---

**Status:** D-013 complete. Observatory mechanics are live on Cloudflare. Stale Garden workers and manual D1 sync are the main hygiene gaps — not stale Field bundles.
