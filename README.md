# Reality Mechanics

Reality Mechanics is now intentionally small:

- **Field** — `realitymechanics.nz` and `/field`; the public structural field.
- **Calibration** — `calibration.realitymechanics.nz`; the mechanical reasoning calibration tool.
- **MCP** — `mcp.realitymechanics.nz`; read-only Atlas traversal tools.
- **Atlas source** — `Reality_Mechanics/`; markdown and front matter in GitHub.

Retired public surfaces such as Garden, standalone Atlas pages, Theory, Ark, and old proposal workflows are not part of the active product.

## Atlas Source Of Truth

GitHub is canonical for Atlas term content and structure.

Atlas term edits start in the repository, inside `Reality_Mechanics/`. The markdown note and its front matter are the editable record. Field states, MCP reads, and D1 tables are generated translations of that repository record.

D1 is generated. It is not an editing surface for Atlas terms.

D1 can be wiped and rebuilt from the repository with the repo-to-D1 sync command. Direct D1 edits to `entries`, including section edits, grounding changes, new terms, and structure changes, are not part of the workflow.

The intended path is:

1. Edit Atlas terms in `Reality_Mechanics/`.
2. Commit and push those edits to GitHub.
3. Generate the Atlas D1 sync data from the repository.
4. Sync the generated data into D1.
5. Let Field and the read-only MCP read D1 as a generated cache.

Before syncing, recover any term data that exists only in D1 into markdown files and commit it. The sync command is allowed to replace D1 because D1 is only a generated read model.

## Local Commands

- `npm --prefix .atlas-publisher test`
- `npm --prefix .atlas-publisher run sync:d1`
- `npm --prefix member test`
- `npm --prefix reality-mechanics-mcp test`

To apply the generated D1 sync locally, run:

```bash
npm --prefix .atlas-publisher run sync:d1 -- --apply
```

The sync refuses dirty `Reality_Mechanics/` changes by default so GitHub remains canonical.

## GitHub Deployment

GitHub Actions deploys Field, Calibration, and MCP from `.github/workflows/deploy.yml`.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Pushes to `main` deploy changed active surfaces. The workflow can also be started manually with **Run workflow**.
