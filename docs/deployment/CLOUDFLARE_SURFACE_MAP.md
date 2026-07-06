# Cloudflare Surface Map

**Canonical map of Reality Mechanics Cloudflare deployment.**  
**Last verified:** M-001 (2026-07-07)  
**Repository HEAD:** `1e0b526`  
**Product truth:** [`public-surface-manifest.mjs`](../public-surface-manifest.mjs) — link here for surface roles, not this table alone.

---

## Active public surfaces

| Surface | Domain / route | Worker | D1 | Deploy source | Status |
|---|---|---|---|---|---|
| **Observatory** | `realitymechanics.nz`, `/`, `/field` | `super-frost-d434` | `atlas-d1` | `.atlas-publisher/` | **Live** |
| **Pulse** | `calibration.realitymechanics.nz` | `reality-mechanics-calibration` | none | `member/` | **Live** |
| **Theory** | `realitymechanics.nz/theory` | `super-frost-d434` | none | `.atlas-publisher/` | **Live** |
| **Proof** | `/proof`, `/submission`, `/submission-001` | `super-frost-d434` | none | `.atlas-publisher/` | **Live** |
| **Calculus** | `/calculus` | `super-frost-d434` | none | `.atlas-publisher/` | **Live** |
| **MCP** | `mcp.realitymechanics.nz/mcp` | `reality-mechanics-mcp` | `atlas-d1` (read-only) | `reality-mechanics-mcp/` | **Live** — 17 tools |

### Observatory API routes (same worker)

| Route | Purpose |
|---|---|
| `GET /api/field/states` | D1-derived renderer states |
| `GET /api/field/behaviour-trace?id=` | Behaviour retrace + Read Engine bundle (D-012, O-006) |

### Retired routes (410 from Observatory worker)

`/atlas`, `/garden`, `/ark`, `/api/field/entries`, `/api/garden/*`, `/api/ark/*`, `/api/enter`, theory shortcuts — message: *Reality Mechanics exposes Observatory, Pulse, Theory, Proof, and Calculus only.*

`/member`, `/bench`, `/calibration` → 302 to Pulse worker.

---

## D1

| Property | Value |
|---|---|
| Name | `atlas-d1` |
| ID | `ffc9622e-02a4-4561-b11e-4e54fac92967` |
| Bindings | `ATLAS_DB` on Observatory + MCP workers |
| Entries | ~490 rows |
| `garden_config.atlas_version` | May lag entry data — see D-013 |
| Sync | **Manual** — `npm --prefix .atlas-publisher run sync:d1 -- --apply` |
| CI sync | **None** |

---

## Deploy pipeline

| Trigger | Observatory | Pulse | MCP | D1 sync |
|---|---|---|---|---|
| Push to `main` (worker paths) | deploy | deploy | deploy | no |
| Push to `main` (`Reality_Mechanics/**` only) | no | no | no | no |
| Manual `workflow_dispatch` | deploy | deploy | deploy | no |

**Secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

**Manifest in deploy path:** `public-surface-manifest.mjs` (D-025)

---

## Orphan / retired Cloudflare resources

See `docs/reports/D-013-cloudflare-surface-audit.md` for Garden-era workers. Recommendation unchanged: delete after steward sign-off.

---

## Verification quick probes

```bash
curl -sI https://realitymechanics.nz/field | grep -i cache-control
curl -s "https://realitymechanics.nz/theory" | head -5
curl -s "https://realitymechanics.nz/calculus" | head -5
curl -s "https://realitymechanics.nz/api/field/behaviour-trace?id=first.relation" | jq '.readEngine.version'
curl -s https://realitymechanics.nz/api/field/states | jq '{atlasVersion, count: (.states|length)}'
curl -s https://calibration.realitymechanics.nz/api/health
```

---

## Local deploy hazard

Prefer GitHub Actions or `cd .atlas-publisher && npx wrangler deploy` with `wrangler.toml` D1 binding. See D-013.

---

*Superseded snapshots: `docs/reports/SUPERSESSION_INDEX.md`. Programme entry: `docs/PROGRAMME_INDEX.md`.*
