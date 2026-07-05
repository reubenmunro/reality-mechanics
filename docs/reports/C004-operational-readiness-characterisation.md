# C004 — Operational Readiness Characterisation

**Contract Class:** B — Repository Investigation · **Contractor:** Cursor (Opus 4.8) · **Mode:** Read-only investigation

**Governing question:** Can the Reality Mechanics operational platform reliably support ongoing Atlas stewardship without introducing avoidable operational risk?

**Method:** Repository evidence only. Previous chat conversations are not authority. Prior repository report `docs/reports/C003-repository-reproducibility.md` is cited where relevant. Every conclusion is traceable to a cited file.

---

## Executive Summary

The Reality Mechanics platform is a **small, source-canonical, read-model system**. One editable source (Atlas markdown in `Reality_Mechanics/`) is translated into a generated read model (Cloudflare D1 `atlas-d1`), which three Cloudflare Workers read: Field (`realitymechanics.nz`), MCP (`mcp.realitymechanics.nz`), and — independently, with no Atlas dependency — Calibration (`calibration.realitymechanics.nz`). The architecture's central discipline is explicit and consistently stated: **structure is canonical, every surface is a translation, D1 is never an editing surface** (`README.md`, `.atlas-publisher/LOCAL_SOURCE_POLICY.md`, `atlas-structure-contract.mjs`).

Operationally the system is **strongly documented at the intent level and partially verified at the mechanism level.** Development build and test paths are reproducible and pass (confirmed in C003). The deployment and data-apply paths are **environment-dependent**: they require Cloudflare credentials, a hardcoded D1 database, and custom domains that are external to the repository.

Three characterising facts shape everything below:

1. **The Atlas → D1 → surfaces pipeline is one-directional and mostly manual.** CI deploys Workers but does not sync D1; Atlas edits do not trigger any pipeline (`.github/workflows/deploy.yml`).
2. **D1 is only partially regenerable from the repository.** The sync rebuilds the `entries` table only; other tables the platform reads (`entry_revisions`, `proposals`, `garden_config`) have no schema or regeneration source in the repository.
3. **Named tooling is absent.** `atlas-core.mjs` declares three consumers — `build.mjs`, `build-atlas-ai-index.mjs`, `atlas-doctor.mjs` — none of which exist in the tree; `atlas-doctor.mjs` is additionally required by the git pre-commit hook.

The platform is **suitable for continued Atlas authoring and stewardship at the source level** (edit markdown, test, commit). It carries **avoidable operational risk at the deployment, schema, and recovery boundaries**, all of which are characterised below. This report does not recommend solutions.

---

## Repository

### Current Character

A single Git repository holds four concerns in distinct locations: Atlas source (`Reality_Mechanics/`), stewardship method (`docs/stewardship/`), practice/governance (`docs/practice/`, `docs/reports/`, `docs/PROJECT_DELIVERY.md`, `PROJECT_STATUS.md`), and platform code (`.atlas-publisher/`, `member/`, `reality-mechanics-mcp/`). Work is administered as contracts (`docs/PROJECT_DELIVERY.md`). Governance is coupled to the repository by convention and by a pre-commit hook, not by CI.

### Evidence

- Component roots: `.atlas-publisher/`, `member/`, `reality-mechanics-mcp/`, `Reality_Mechanics/`, `docs/` (directory listing; `README.md:1-8`).
- Atlas is 492 tracked markdown files (`git ls-files 'Reality_Mechanics/*.md'` = 492; C003 report §11).
- Branching: local `main`; remotes `origin/main` and `origin/structural-mechanics-migration` (`git branch -a`).
- Governance documents: `docs/practice/ARCHITECTURAL_NOTES.md`, `docs/PROJECT_DELIVERY.md`, `PROJECT_STATUS.md`; stewardship spec in `docs/stewardship/STEWARDSHIP_V1.md`.
- Governance coupling to Git: `.githooks/pre-commit` runs an integrity gate on commit (see Automation).
- Contract history persisted: `docs/reports/C003-repository-reproducibility.md`.

### Structural Relations

- Documentation : intent — **documented** (README, LOCAL_SOURCE_POLICY, atlas-structure-contract all state the model explicitly).
- Governance : enforcement — **explicit : implicit** (contract model is documented; enforcement is by convention, not CI).
- Branching : documentation — **implicit** (`structural-mechanics-migration` exists but is undocumented in root docs).
- Source of truth : surfaces — **canonical : generated** (repeatedly stated).

### Operational Risks

- The purpose/status of `origin/structural-mechanics-migration` is undocumented; its relation to `main` cannot be determined from repository files (`git branch -a` only).
- Governance rules (contract discipline, evidence-before-recommendation) are documented but not machine-enforced; adherence depends on operator behaviour (`docs/practice/ARCHITECTURAL_NOTES.md`).

### Unknowns

- Whether `structural-mechanics-migration` is active, merged, or abandoned.
- Whether any contributor other than the owner has ever reproduced the repository (no CONTRIBUTING or onboarding record found).

---

## Deployment

### Current Character

Deployment is performed by GitHub Actions on push to `main` (or manual dispatch), and alternately by local macOS `.command` scripts. Each of the three Workers is tested then deployed with `wrangler deploy`. A secret-preflight job gates all deploys. PRs test only.

### Evidence

- `.github/workflows/deploy.yml`: jobs `cloudflare-secrets` (preflight), `field`, `calibration`, `mcp`; deploy steps guarded by `if: github.event_name != 'pull_request'` (`deploy.yml:24-114`).
- Triggers restricted to worker paths — `.atlas-publisher/**`, `member/**`, `reality-mechanics-mcp/**`, `atlas-structure-contract.mjs`, `field-maturity.mjs`, the workflow itself (`deploy.yml:6-22`). `Reality_Mechanics/**` is **not** a trigger path.
- Node pinned to 22 in CI (`deploy.yml:53-55, 77-79, 100-102`).
- Wrangler invocation: `npx wrangler deploy` per component (`deploy.yml:63-66, 86-91, 108-114`).
- Local scripts: `Deploy Main Website.command` (deploys Worker `super-frost-d434` via a user-home wrangler workdir), `Deploy MCP Worker.command` (`npx --yes wrangler@latest deploy`), `Sync Atlas D1 from GitHub.command`, `Backup to GitHub.command`.
- Worker configs: `.atlas-publisher/wrangler.toml` (name `super-frost-d434`, route `realitymechanics.nz`, D1 `atlas-d1`), `member/wrangler.toml` (route `calibration.realitymechanics.nz`, no bindings), `reality-mechanics-mcp/wrangler.toml` (route `mcp.realitymechanics.nz`, D1 `atlas-d1`).
- Deployment dependency chain established in C003: Cloudflare account + `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` + ownership of the three custom-domain routes.

### Structural Relations

- Build/test : deploy — **reproducible : environment-dependent** (tests pass offline; deploy needs external credentials — C003 §3, §7).
- CI trigger scope : Atlas — **isolated** (Atlas changes do not trigger CI).
- Wrangler pinning: `member` **pinned** (`^4.107.0`, lockfile); `reality-mechanics-mcp` **pinned** (`^3.90.0`, resolved 3.114.17, lockfile); `.atlas-publisher` **unpinned** (no wrangler dependency, no lockfile — deploys via `npx wrangler@latest`).
- Local deploy : CI deploy — **redundant paths** (two independent ways to deploy the same Workers).

### Operational Risks

- The Field Worker (`.atlas-publisher`) deploys with a floating `wrangler@latest`; a future wrangler release can change Field build/deploy behaviour with no repository change (`.atlas-publisher/package.json` has no wrangler dep; `Deploy Main Website.command` and `deploy.yml` both use latest/`npx`).
- Two divergent local-vs-CI deploy mechanisms for Field exist (`deploy.yml` `field` job uses `working-directory: .atlas-publisher` + `npx wrangler deploy`; `Deploy Main Website.command` uses a separate `$HOME/Reality_Atlas_Build` wrangler workdir with explicit `--name` and `--compatibility-date`). Behavioural equivalence is assumed, not verified.
- Deploy authority is a single Cloudflare account/token (see Security).

### Unknowns

- Current deployed versions of any Worker (no version/health record stored in repo).
- Whether CI has ever successfully deployed (no run history in repository).
- Whether local `.command` compatibility-date/name overrides match the committed `wrangler.toml` in practice.

---

## Data

### Current Character

The Atlas is authored as markdown; a Node generator (`sync-d1-from-repo.mjs`) reads tracked, published notes and emits a single SQL artefact that rebuilds the D1 `entries` table (and its full-text index). D1 is a generated, disposable read model. The generated SQL is gitignored (not committed).

### Evidence

- Generator: `.atlas-publisher/sync-d1-from-repo.mjs`. Reads `git ls-files Reality_Mechanics` (`:44`), applies the shared publish filter (`:57`, `atlas-core.mjs:41-45`), and writes `generated/atlas-d1-sync.sql` (`:20, :141-143`).
- Emitted SQL shape: `DELETE FROM entries;` then per-row `INSERT INTO entries (...)`, then `INSERT INTO entries_fts(entries_fts) VALUES('rebuild');` (`:125-139`).
- Apply path writes to remote: `wrangler d1 execute atlas-d1 --remote --file <sql>` under `--apply` (`:145-167`).
- Dirty-guard: sync refuses when `Reality_Mechanics` has uncommitted/untracked changes unless `--allow-dirty` (`:45-51`).
- Generated artefact is gitignored: `.atlas-publisher/generated/` (`.gitignore:6`). Dry run produced 2.5 MB SQL from 490 published notes (C003 §3).
- Read model consumed by Field and MCP via `env.ATLAS_DB` D1 binding (`.atlas-publisher/main-website-worker.js:54,73,191`; `reality-mechanics-mcp/src/index.js:49-56`).
- Additional D1 tables read by the platform but **not** produced by any repository script: `entry_revisions`, `proposals`, `garden_config` (`field-maturity.mjs:18, 30-45, 71-74`).
- No schema definition in the repository: zero `.sql` files (glob `**/*.sql` = 0); no `CREATE TABLE`/migration in any project script (grep — matches only in Obsidian plugin bundles under `Reality_Mechanics/.obsidian/`).

### Structural Relations

- Atlas source : D1 — **canonical : generated** (`README.md:15-31`, `atlas-structure-contract.mjs:215`).
- Read/write boundary — **read : generated-write** (surfaces read D1; only sync writes it; `LOCAL_SOURCE_POLICY.md:9-19`).
- `entries` : `entry_revisions`/`proposals`/`garden_config` — **regenerable : externally-managed** (sync rebuilds `entries` only).
- Schema : repository — **assumed : absent** (no DDL in repo; tables assumed pre-existing in D1).
- Sync direction — **one-way** (repo → D1; no D1 → repo path in code; `README.md:31` notes recovering D1-only data is a manual pre-sync step, unautomated).

### Operational Risks

- A full D1 loss is only partially recoverable from the repository: `entries` can be regenerated, but `entry_revisions`, `proposals`, and `garden_config` have no repository source (`field-maturity.mjs` reads them; no script writes them).
- Schema drift is undetectable from the repository: because no DDL exists in-repo, a mismatch between the assumed columns (`sync-d1-from-repo.mjs:119-123`) and the live D1 schema would only surface at apply time.
- `--apply` operates on `--remote` only; there is no local/staging D1 target in code (`sync-d1-from-repo.mjs:163`), so the first place an apply error can appear is production.

### Unknowns

- The authoritative definition and current schema of `entries`, `entries_fts`, `entry_revisions`, `proposals`, `garden_config` (not in repository).
- Whether D1 currently holds data present only in D1 (the `README.md:31` recovery caveat) that is not represented in markdown.
- Last successful sync time and whether live D1 matches current `main` (no record; C003 Known Unknowns).

---

## Platform

### Current Character

Three deployed Workers plus one generated data store. Field and MCP are Atlas-coupled (both read `atlas-d1`); Calibration is fully isolated (no Atlas, no D1, no AI). "Oracle" and "website" are not separate deployed services: the website is the Field Worker; Oracle exists only as Atlas content and as MCP session-guidance field names.

### Evidence

- **Field / website / Atlas serving:** `.atlas-publisher/main-website-worker.js` serves `/`, `/field`, `/api/field/states`, `/robots.txt`, and a `/member|/bench|/calibration` doorway (`:2584-2596`); reads `env.ATLAS_DB` (`:54,73,191`). Field maturity derived at read time, never stored (`field-maturity.mjs:66` "derived, never stored (INV-14)"). This Worker *is* the public website (`realitymechanics.nz`).
- **Calibration:** `member/src/index.js` is a static browser mechanism; "deliberately not AI" (`:1-15`); tests assert "no canon storage or worker bindings," "no AI dependency," "no Atlas or Garden network dependency" (`member/test` output; `member/DEPLOYMENT.md:34-44` "no D1, KV, MCP, or workflow binding").
- **MCP:** `reality-mechanics-mcp/src/index.js` is a read-only D1-backed MCP server (`:1-7`); exposes read/traversal tools; tests assert "tools/list exposes no write, maintenance, or Garden tools" and "write_proposal is not callable" (`reality-mechanics-mcp/test` output).
- **Oracle:** no Worker, route, or wrangler config. Appears as Atlas prose (`Reality_Mechanics/4_Practice/Atlas Oracle.md`, `Oracle Carrying Conditions.md`), as MCP session-guidance string arrays `oracleFields` / `oracleCarryingConditions` (`reality-mechanics-mcp/src/index.js:206-207`), and as a verb in `atlas-structure-contract.mjs:192`.
- Shared contract module imported by both MCP and (per workflow trigger paths) Field: `atlas-structure-contract.mjs` (`reality-mechanics-mcp/src/index.js:9-18`).
- Retired surfaces (Garden, standalone Atlas pages, Theory, Ark) are asserted absent by Field tests (`.atlas-publisher/test` output).

### Structural Relations

- Field ↔ MCP — **coupled** (shared `atlas-d1`, shared `atlas-structure-contract.mjs`).
- Calibration ↔ Atlas — **isolated** (no binding; independently deployable/failable).
- Oracle : deployment — **content : (no service)** (specified in Atlas/MCP guidance, not deployed).
- Website : Field — **same Worker** (not a distinct surface).
- Surfaces : source — **translation : canonical** (`atlas-structure-contract.mjs:32-40, 213-216`).

### Operational Risks

- Field and MCP share a single D1 (`atlas-d1`, id `ffc9622e-...`); a D1 outage or bad apply affects both simultaneously (`.atlas-publisher/wrangler.toml:9-12`, `reality-mechanics-mcp/wrangler.toml:11-14`).
- "Oracle" is described operationally in MCP session guidance (cost cap, rate limit, safety route — `reality-mechanics-mcp/src/index.js:207`) but no such service is deployed in the repository; the guidance describes carrying conditions for an oracle that does not exist as code here.

### Unknowns

- Whether an Oracle service exists outside this repository (cannot be determined from repository files).
- Whether MCP route is currently live (its `wrangler.toml:6-9` route block is present/active; a comment in `Deploy MCP Worker.command:22-23` implies it may need manual uncommenting — the committed toml has it enabled, so state is ambiguous).

---

## Recovery

### Current Character

Backup is Git push to GitHub (source of truth). D1 recovery is partial rebuild-from-source. There is no disaster-recovery document, no restore runbook, and no backup of the externally-managed D1 tables.

### Evidence

- Backup path: `Backup to GitHub.command` stages all but volatile Obsidian/wrangler/DS_Store paths, commits with a timestamp, and `git push origin main` (`:20-37`).
- D1 rebuild path: `Sync Atlas D1 from GitHub.command` → `sync-d1-from-repo.mjs` regenerates `entries` and can `--apply` to remote (`sync-d1-from-repo.mjs:128, 145-167`).
- Explicit design intent: "D1 can be wiped and rebuilt from the repository" (`README.md:20`); "The repository must be able to rebuild D1 from scratch" (`.atlas-publisher/LOCAL_SOURCE_POLICY.md:20-23`).
- Pre-sync recovery caveat: "recover any term data that exists only in D1 into markdown files and commit it" before syncing (`README.md:31`) — a manual step with no supporting tooling in the repo.
- No `.sql` schema, no restore script, no DR/runbook doc found (glob/grep; `docs/` contains only stewardship, practice, and reports).

### Structural Relations

- Atlas source : recoverability — **recoverable** (Git + regenerable `entries`).
- `entry_revisions`/`proposals`/`garden_config` : recoverability — **unrecoverable from repo** (no source, no schema).
- Restore : documentation — **partial : undocumented** (rebuild of `entries` is documented; full D1 restore is not).
- Backup : automation — **manual** (owner-run `.command`; no scheduled backup in repo).

### Operational Risks

- Loss of D1 loses `entry_revisions` (maturity history), `proposals`, and `garden_config` with no repository-based restore (`field-maturity.mjs` depends on these tables).
- Backup depends on a single human running a local macOS script and pushing to a single remote; there is no CI-side or scheduled backup in the repository.
- Recreating D1 from scratch requires a schema that does not exist in the repository (see Data), so "rebuild from repository" currently reconstructs data into an assumed-existing schema, not the schema itself.

### Unknowns

- Whether any external D1 backup/export exists (Cloudflare-side; not visible in repo).
- Whether the `entries` schema is version-controlled anywhere outside this repository.

---

## Automation

### Current Character

Automation is limited and bounded: CI tests+deploys Workers; a git pre-commit hook runs an Atlas integrity gate; everything else (D1 sync/apply, backup, D1-only data recovery) is manual and operator-initiated.

### Evidence

- CI responsibilities: test and deploy the three Workers; preflight secrets (`.github/workflows/deploy.yml`). CI does **not** sync D1 or touch Atlas.
- Pre-commit automation: `.githooks/pre-commit` runs `node .atlas-publisher/atlas-doctor.mjs --check collisions,unresolved,leaks,reciprocity,orphans,drift`, blocking commits on integrity errors; skips gracefully if `node` absent (`.githooks/pre-commit:10-13`).
- The hook's target `atlas-doctor.mjs` **does not exist** (glob `**/atlas-doctor*` = 0; `ls .atlas-publisher/atlas-doctor.mjs` → No such file).
- The hook is not active by default: `git config core.hooksPath` is unset (C003 §9); no repository step wires it.
- `atlas-core.mjs` header names three consumers — `build.mjs`, `build-atlas-ai-index.mjs`, `atlas-doctor.mjs` (`atlas-core.mjs:4-6`) — **none exist** (glob `**/{build,build-atlas-ai-index,atlas-doctor}.mjs` = 0).
- Generated artefacts are not committed: `.atlas-publisher/generated/` gitignored (`.gitignore:6`).

### Structural Relations

- Worker deploy : automated; D1 sync/apply : **manual**; backup : **manual**.
- Integrity gate : availability — **specified : absent** (hook references a missing script).
- Integrity gate : activation — **present-in-repo : inactive-by-default** (unset `core.hooksPath`).
- Generated artefact : version control — **excluded** (rebuilt, never stored).

### Operational Risks

- If a contributor wires the pre-commit hook (`git config core.hooksPath .githooks`), every commit fails because `atlas-doctor.mjs` is missing (`.githooks/pre-commit:10`).
- The stated anti-drift guarantee of `atlas-core.mjs` (build/export/linter "cannot drift apart", `:4-6`) is not currently in force: two of the three named consumers and the linter do not exist in the tree.
- Atlas structural integrity is not automatically checked anywhere reachable from the repository, despite the hook implying it is.

### Unknowns

- Whether `atlas-doctor.mjs`, `build.mjs`, `build-atlas-ai-index.mjs` existed previously and were removed, or were never committed (history not inspected in this contract; only presence/absence established).

---

## Security

Characterisation only. No security recommendations are made except where directly supported by repository evidence.

### Current Character

Trust is concentrated in one Cloudflare account and two repository secrets. Calibration is credential-free. MCP is read-only with permissive CORS. Secrets are handled via GitHub Actions secrets and are not stored in the repository; `.gitignore` actively excludes several credential-bearing local files.

### Evidence

- Deploy secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, consumed only via `${{ secrets.* }}` in CI (`deploy.yml:31-33, 66-68, 89-91, 112-114`); preflight fails the build if absent (`deploy.yml:34-44`).
- No secrets committed: wrangler configs contain only public route/DB identifiers (`*/wrangler.toml`). Calibration requires none (`member/DEPLOYMENT.md:34-44`).
- `.gitignore` excludes credential-risk files: `Reality_Mechanics/.obsidian/plugins/copilot/data.json` ("may hold API keys"), `.claude/settings.local.json`, `.wrangler/` (`.gitignore:17-25`).
- MCP CORS: `Access-Control-Allow-Origin: *` with Authorization and CF-Access headers allowed (`reality-mechanics-mcp/src/index.js:28-32`); MCP is read-only (write tools gated off — Platform §Evidence).
- MCP references a specific GitHub owner/repo for source links: `github.com/reubenmunro/reality-mechanics` (`reality-mechanics-mcp/src/index.js:25`).
- D1 database id is hardcoded in two wrangler configs (`.atlas-publisher/wrangler.toml:12`, `reality-mechanics-mcp/wrangler.toml:14`).

### Structural Relations

- Deploy trust : accounts — **single point of dependence** (one Cloudflare account/token deploys all surfaces and writes D1).
- Secret handling : repository — **externalised** (secrets in CI/host, not in tree; local secret files gitignored).
- MCP access : write — **read-only** (no write/maintenance tools callable).
- Calibration : credentials — **isolated** (no secrets, no bindings).
- Atlas write authority : surface — **explicit** (only GitHub is editable; D1 apply is generated; `LOCAL_SOURCE_POLICY.md`).

### Operational Risks

- Single Cloudflare account/token is the sole deployment and D1-write authority for all three surfaces (`deploy.yml`, both wrangler configs) — one credential compromise or loss affects the entire platform. (Evidence-backed statement of dependence; no remediation proposed.)
- MCP rate-limiting is present only as commented-out configuration (`reality-mechanics-mcp/wrangler.toml:16-21`), so the read-only endpoint has no in-repo rate limit enabled.

### Unknowns

- Scope/permissions actually granted to `CLOUDFLARE_API_TOKEN` (defined outside the repo).
- Whether Cloudflare Access is enforced in front of MCP (headers are allowed in code; enforcement is account-side, not in repo).
- Whether any secrets exist in the live environment beyond the two named (none others referenced in repo).

---

# Architectural Conclusion

## What became known

- The platform is a **source-canonical, one-way, mostly-manual pipeline**: Atlas markdown → generated `entries` SQL → remote D1 → Field/MCP reads; Calibration is independent (`README.md`, `sync-d1-from-repo.mjs`, `atlas-structure-contract.mjs`).
- **Development is reproducible; deployment and data-apply are environment-dependent** (confirmed C003; extended here to the data/recovery boundary).
- **D1 is only partially regenerable:** `entries` yes; `entry_revisions`, `proposals`, `garden_config` have no repository source or schema (`field-maturity.mjs`, absence of `.sql`).
- **Declared tooling is absent:** `atlas-doctor.mjs`, `build.mjs`, `build-atlas-ai-index.mjs` do not exist, and the pre-commit integrity gate would fail if activated (`atlas-core.mjs:4-6`, `.githooks/pre-commit`).
- **Oracle and "website" are not separate services:** the website is the Field Worker; Oracle is Atlas/MCP-guidance content only.
- **Trust is concentrated** in one Cloudflare account/token and a hardcoded D1 id; secrets are correctly externalised from the tree.

## Decisions now enabled

The Project Steward can now decide, on evidence:

- Whether continued Atlas stewardship may proceed on the **source layer alone** (edit → test → commit), which is reproducible and low-risk today.
- Whether the **D1 schema and the externally-managed tables** must be brought under repository control before further platform-coupled work.
- Whether the **absent tooling** (`atlas-doctor.mjs` and the two build scripts) should be treated as removed (and their references retired) or as missing (and restored) — a decision this report scopes but does not make.
- Whether the **single-account deployment dependence** and **unpinned Field wrangler** are acceptable for the current stage.

## Remaining operational pressures

- Schema management lives outside the repository; schema drift is undetectable in-repo and first surfaces at remote apply.
- Recovery of non-`entries` D1 data has no repository path.
- The integrity-gate story is internally inconsistent (hook present, target missing, hook inactive by default).
- Atlas edits and D1 state can diverge silently (CI does not sync D1; no last-sync record).
- Deployment and D1 writes target production directly, with no staging target in code.

## Recommended next contract

**C005 — Atlas ↔ D1 Schema and Recovery Characterisation** (Class B, read-only): establish, from Cloudflare/D1 and repository evidence, the authoritative schema of `entries`, `entries_fts`, `entry_revisions`, `proposals`, and `garden_config`; determine what is regenerable versus externally-managed; and characterise a restore path for the non-`entries` tables. This directly addresses the highest remaining operational pressure (partial recoverability + absent schema) before any platform-coupled implementation is commissioned. A secondary, smaller contract could resolve the absent-tooling question (removed vs missing) for `atlas-doctor.mjs`, `build.mjs`, and `build-atlas-ai-index.mjs`.

---

**Scope note:** This contract created only this report (`docs/reports/C004-operational-readiness-characterisation.md`). No repository files were edited, no fixes implemented, no architecture changed. All conclusions are cited to repository evidence; unknowns are stated explicitly rather than resolved by assumption.
