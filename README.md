# Reality Mechanics

Reality Mechanics is a **five-surface public programme**. Canonical product description: [`public-surface-manifest.mjs`](public-surface-manifest.mjs). Contributor entry: [`docs/PROGRAMME_INDEX.md`](docs/PROGRAMME_INDEX.md).

## Public surfaces

| Surface | URL | Role |
|---|---|---|
| **Observatory** | [realitymechanics.nz](https://realitymechanics.nz), `/field` | See structure — the structural field instrument |
| **Pulse** | [calibration.realitymechanics.nz](https://calibration.realitymechanics.nz) | Sense behaviour through time |
| **Theory** | `/theory` | Understand the claim |
| **Proof** | `/proof`, `/submission` | Retrace the evidence |
| **Calculus** | `/calculus` | Derivation surface (nothing promoted) |
| **MCP** | `mcp.realitymechanics.nz` | Read-only Atlas + programme traversal for AI |

**Infrastructure names** in code (Field, Calibration, `/api/field/*`) are legacy aliases — public vocabulary is Observatory · Pulse · Theory · Proof · Calculus.

Retired routes (Garden, standalone Atlas pages, Ark, old proposal workflows) return **410**. Theory at `/theory` is **live**.

## Architecture entry points

Start future work from:

- [`docs/PROGRAMME_INDEX.md`](docs/PROGRAMME_INDEX.md)
- [`docs/reports/R-005-programme-synthesis.md`](docs/reports/R-005-programme-synthesis.md)
- [`docs/reports/R-006-operation-reconciliation.md`](docs/reports/R-006-operation-reconciliation.md)
- [`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`](docs/runtime/INVARIANT_RUNTIME_CONTRACT.md)
- [`docs/runtime/READ_ENGINE.md`](docs/runtime/READ_ENGINE.md)
- [`docs/practice/COMMISSIONS.md`](docs/practice/COMMISSIONS.md)

## Atlas source of truth

GitHub is canonical for Atlas term content and structure.

Atlas term edits start in the repository, inside `Reality_Mechanics/`. The markdown note and its front matter are the editable record. Observatory states, MCP reads, and D1 tables are generated translations of that repository record.

D1 is generated. It is not an editing surface for Atlas terms.

D1 can be wiped and rebuilt from the repository with the repo-to-D1 sync command. Direct D1 edits to `entries`, including section edits, grounding changes, new terms, and structure changes, are not part of the workflow.

The intended path is:

1. Edit Atlas terms in `Reality_Mechanics/`.
2. Commit and push those edits to GitHub.
3. Generate the Atlas D1 sync data from the repository.
4. Sync the generated data into D1.
5. Let Observatory and the read-only MCP read D1 as a generated cache.

Before syncing, recover any term data that exists only in D1 into markdown files and commit it. The sync command is allowed to replace D1 because D1 is only a generated read model.

## Local commands

- `npm --prefix .atlas-publisher test`
- `npm --prefix .atlas-publisher run sync:d1`
- `npm --prefix member test`
- `npm --prefix reality-mechanics-mcp test`

To apply the generated D1 sync locally, run:

```bash
npm --prefix .atlas-publisher run sync:d1 -- --apply
```

The sync refuses dirty `Reality_Mechanics/` changes by default so GitHub remains canonical.

## GitHub deployment

GitHub Actions deploys Observatory (Field worker), Pulse (Calibration worker), and MCP from `.github/workflows/deploy.yml`.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Pull requests run tests only and do not deploy. Pushes to `main` and manual **Run workflow** runs deploy the active surfaces after a Cloudflare secret preflight.

If deploy fails before a Worker uploads, check:

1. GitHub repository **Settings → Secrets and variables → Actions**.
2. `CLOUDFLARE_API_TOKEN` exists and has Workers/D1 deploy permissions.
3. `CLOUDFLARE_ACCOUNT_ID` matches the Cloudflare account that owns the routes and `atlas-d1`.
