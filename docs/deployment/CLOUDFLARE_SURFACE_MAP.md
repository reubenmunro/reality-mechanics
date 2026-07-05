# Cloudflare Surface Map

**Canonical map of Reality Mechanics Cloudflare deployment.**  
**Last verified:** 2026-07-05 (D-013 audit)  
**Repository HEAD:** `9550d0f`

---

## Active public surfaces

| Surface | Domain / route | Worker | D1 | Deploy source | Status |
|---|---|---|---|---|---|
| **Field** | `realitymechanics.nz`, `/field` | `super-frost-d434` | `atlas-d1` | `.atlas-publisher/` via `.github/workflows/deploy.yml` | **Live** — D-010B, D-012 confirmed |
| **Calibration** | `calibration.realitymechanics.nz` | `reality-mechanics-calibration` | none | `member/` via `deploy.yml` | **Live** |
| **MCP** | `mcp.realitymechanics.nz/mcp` | `reality-mechanics-mcp` | `atlas-d1` (read-only) | `reality-mechanics-mcp/` via `deploy.yml` | **Live** — 15 tools |

### Field API routes (same worker)

| Route | Purpose |
|---|---|
| `GET /api/field/states` | D1-derived renderer states |
| `GET /api/field/behaviour-trace?id=` | D-012 behaviour retrace (optional `runtime` JSON) |
| `GET /submission` | Submission 001 page |
| `GET /`, `/field` | Field HTML (embedded client bundle) |

### Retired routes (410 from Field worker)

`/atlas`, `/garden`, `/ark`, `/api/field/entries`, `/api/garden/*`, `/api/ark/*`, `/api/enter`, theory shortcuts — all return *Field and Calibration only*.

---

## D1

| Property | Value |
|---|---|
| Name | `atlas-d1` |
| ID | `ffc9622e-02a4-4561-b11e-4e54fac92967` |
| Bindings | `ATLAS_DB` on Field + MCP workers |
| Entries | 490 rows (2026-07-05) |
| `garden_config.atlas_version` | `2026.07.03-i983` |
| Sync | **Manual** — `npm --prefix .atlas-publisher run sync:d1 -- --apply` |
| CI sync | **None** — `Reality_Mechanics/**` changes do not trigger deploy or D1 sync |

### Schema tables (selected)

| Table | Used by Field/MCP today |
|---|---|
| `entries` | Yes |
| `entry_revisions` | Yes (maturity derivation) |
| `proposals` | Yes (settledness derivation) |
| `garden_config` | Yes (`atlas_version`, optional thresholds) |
| `atlas_garden_archive`, `atlas_pending_edits`, `proposal_events`, … | Legacy Garden schema — **not read by current Field/MCP** |

---

## Deploy pipeline

| Trigger | Field | Calibration | MCP | D1 sync |
|---|---|---|---|---|
| Push to `main` (worker paths) | deploy | deploy | deploy | no |
| Push to `main` (`Reality_Mechanics/**` only) | no | no | no | no |
| Push to `main` (`docs/**` only) | no | no | no | no |
| Manual `workflow_dispatch` | deploy | deploy | deploy | no |
| Local `Deploy Main Website.command` | deploy ⚠️ | — | — | — |
| Local `Sync Atlas D1 from GitHub.command` | — | — | — | apply |

**Secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (GitHub Actions)

**Latest successful deploy:** GitHub Actions run `28736881065` — commit `9550d0f` (D-012), 2026-07-05T09:54–09:55Z. Cloudflare worker `modified_on` matches for Field, Calibration, MCP.

---

## Orphan / retired Cloudflare resources

| Resource | Type | Last modified | Route evidence | Recommendation |
|---|---|---|---|---|
| `reality-mechanics-garden` | Worker | 2026-07-02 | No public route; `/garden` → 410 on Field worker | Delete after steward sign-off |
| `reality-mechanics-garden-steward` | Worker | 2026-07-02 | None found | Delete after sign-off |
| `reality-mechanics-garden-ground-check` | Worker | 2026-07-02 | None found | Delete after sign-off |
| `reality-mechanics-garden-cycle` | Worker | 2026-07-02 | None found | Delete after sign-off |
| `reality-mechanics-api-gardener` | Worker | 2026-07-02 | None found | Delete after sign-off |
| `atlas-publisher` | Worker | 2026-06-30 | Superseded by `super-frost-d434` | Delete after sign-off |
| `atlas-garden` | KV namespace | — | Garden-era | Delete after confirming no worker binding |

**No Cloudflare Pages project** identified in repository or account tooling for this programme.

---

## Caching

| Asset | Cache-Control | Notes |
|---|---|---|
| Field HTML (`/`, `/field`) | `no-cache` | Bundle served from worker; reflects latest deploy |
| `/api/field/states` | `public, max-age=120` | 2-minute edge cache; D1-derived |
| `/api/field/behaviour-trace` | `no-store` | Per-request trace |

Stale Field **JS bundle is not observed** on 2026-07-05 probes after D-012 deploy.

---

## Local deploy hazard

`Deploy Main Website.command` runs:

```bash
wrangler deploy main-website-worker.js --name=super-frost-d434 --compatibility-date=2026-06-03
```

from `$HOME/Reality_Atlas_Build/.wrangler-main-workdir` **without** `.atlas-publisher/wrangler.toml` D1 binding. If used instead of CI/`wrangler deploy` from `.atlas-publisher/`, Field could deploy **without `ATLAS_DB`** and fail at runtime. **Prefer GitHub Actions or `cd .atlas-publisher && npx wrangler deploy`.**

---

## Verification quick probes

```bash
curl -sI https://realitymechanics.nz/field | grep -i cache-control
curl -s "https://realitymechanics.nz/field?debug=mechanics" | rg "mechanics-panel|behaviour-trace"
curl -s "https://realitymechanics.nz/api/field/behaviour-trace?id=first.relation" | jq '.behaviours|length'
curl -s https://realitymechanics.nz/api/field/states | jq '{atlasVersion, count: (.states|length)}'
curl -s https://calibration.realitymechanics.nz/api/health
curl -s -X POST https://mcp.realitymechanics.nz/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | jq '.result.tools|length'
```

Expected: mechanics markers present; behaviour trace `5`; states `490`; calibration `200`; MCP `15` tools.
