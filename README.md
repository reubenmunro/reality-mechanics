# Reality Mechanics

Reality Mechanics observes structural relations already carried in reality and keeps every observation retraceable.

The public programme is five surfaces on [realitymechanics.nz](https://realitymechanics.nz) plus a read-only MCP for AI traversal. **Atlas is source; the website is translation.** Term content lives in `Reality_Mechanics/` in this repository. Observatory and MCP read a generated D1 cache — not an editing surface.

**Contributor entry:** [`docs/PROGRAMME_INDEX.md`](docs/PROGRAMME_INDEX.md) · **Product truth:** [`public-surface-manifest.mjs`](public-surface-manifest.mjs)

---

## Start here

| If you are… | Read |
|---|---|
| Landing on GitHub for the first time | This README → [`docs/PROGRAMME_INDEX.md`](docs/PROGRAMME_INDEX.md) |
| Checking what the public site claims | [`public-surface-manifest.mjs`](public-surface-manifest.mjs) |
| Understanding the architecture | [`docs/reports/R-005-programme-synthesis.md`](docs/reports/R-005-programme-synthesis.md) |
| Operational truth at current HEAD | [`PROJECT_STATUS.md`](PROJECT_STATUS.md) |
| Distinguishing current vs superseded reports | [`docs/reports/SUPERSESSION_INDEX.md`](docs/reports/SUPERSESSION_INDEX.md) |

---

## Five public surfaces (+ MCP)

| Surface | URL | Role |
|---|---|---|
| **Observatory** | [realitymechanics.nz](https://realitymechanics.nz), `/field` | See structure — woven-field instrument |
| **Pulse** | [calibration.realitymechanics.nz](https://calibration.realitymechanics.nz) | Sense behaviour through time |
| **Theory** | `/theory` | Understand the claim |
| **Proof** | `/proof`, `/submission` | Retrace the evidence |
| **Calculus** | `/calculus` | Derivation surface — nothing promoted |
| **MCP** | `mcp.realitymechanics.nz` | Read-only Atlas + programme traversal (17 tools) |

Infrastructure names in code (Field, Calibration, `/api/field/*`) are legacy aliases. Retired routes (Garden, standalone Atlas, Ark) return **410**.

---

## Accepted · candidate · unresolved

Claim status is **not** decided in prose on the website alone.

| Status | Meaning | Where recorded |
|---|---|---|
| **Accepted** | Carried far enough to stand in the public record | `public-surface-manifest.mjs` → `/calculus` |
| **Candidate** | Examined; not promoted | Same manifest + source reports |
| **Unresolved** | Gap preserved deliberately | Same manifest + `docs/reports/` |

Commission reports under `docs/reports/` are **evidence**, not steward decisions. Register: [`docs/practice/COMMISSIONS.md`](docs/practice/COMMISSIONS.md).

---

## Evidence and retrace

Proof fails if the evidence path fails. The website links to GitHub sources; every Calculus claim carries a repo-relative `source` path in the manifest.

```text
Atlas (Reality_Mechanics/)  →  commit on GitHub  →  D1 sync (manual)  →  Observatory / MCP read model
```

Workflow for Atlas changes:

1. Edit terms in `Reality_Mechanics/`.
2. Commit and push to GitHub.
3. Run `npm --prefix .atlas-publisher run sync:d1 -- --apply`.
4. Observatory and MCP read the updated D1 cache.

D1 is generated and may be rebuilt from the repository. Do not edit D1 directly for Atlas terms.

---

## MCP

The MCP worker shares [`public-surface-manifest.mjs`](public-surface-manifest.mjs) with the website (D-025). It reads Atlas structure from D1; it does not write Atlas, D1, or public pages.

---

## Tests

```bash
npm --prefix .atlas-publisher test    # 116 tests
npm --prefix member test              # 18 tests
npm --prefix reality-mechanics-mcp test  # 42 tests
```

**176 tests** at HEAD. GitHub Actions deploys Observatory, Pulse, and MCP on push to `main`.

---

## Deploy

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Required repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (not in tree).

Surface map: [`docs/deployment/CLOUDFLARE_SURFACE_MAP.md`](docs/deployment/CLOUDFLARE_SURFACE_MAP.md)

---

## Unresolved (steward)

| Item | Status |
|---|---|
| **Licence** | No root `LICENSE` file — choice pending |
| **D1 sync in CI** | Manual apply only |
| **GitHub About panel** | See checklist in [`docs/reports/M-003-public-github-final-cleanup.md`](docs/reports/M-003-public-github-final-cleanup.md) |
