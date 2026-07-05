# C003 — Repository Reproducibility: Evidence Report

**Type:** Verification · **Lead:** Cursor / Opus-class · **Mode:** Read-only (no fixes, no edits to repository source)

**Governing question:** *Can the repository be independently reproduced by a competent contributor using only the repository and its documented procedures?*

**Short answer:** **Partially.** The **source, build, test, and generated-content layers are fully reproducible from the repository alone** (they passed offline, without dependency installation). The **deployment layer to the canonical production surfaces is not independently reproducible from the repository alone** — it depends on external Cloudflare account ownership, secrets, a pre-existing named D1 database, and custom domains that cannot be recreated from repository contents.

---

## 1. Toolchain used for this investigation

| Tool | Version present | Notes |
|------|-----------------|-------|
| node | v26.0.0 | CI pins Node 22 (`setup-node@v5`, `node-version: "22"`) |
| npm | 11.16.0 | — |
| git | 2.46.2 | — |
| wrangler | none global | Fetched per-project via `npx` / devDependency |
| OS | macOS (Darwin arm64) | Local `.command` scripts are macOS/zsh-specific |

---

## 2. Documented build procedure

Source: root `README.md`, `member/DEPLOYMENT.md`, `.atlas-publisher/LOCAL_SOURCE_POLICY.md`.

- There is **no compilation step** for the Atlas — it is markdown + frontmatter in `Reality_Mechanics/`.
- Documented commands:
  - `npm --prefix .atlas-publisher test`
  - `npm --prefix member test`
  - `npm --prefix reality-mechanics-mcp test`
  - `npm --prefix .atlas-publisher run sync:d1` (dry run) / `... -- --apply` (apply)
- Worker bundling is delegated to `wrangler deploy` (implicit build).

---

## 3. Actual build procedure (attempted)

| Command | Result | Exit |
|---------|--------|------|
| `npm --prefix .atlas-publisher test` | **22/22 pass** (no install needed) | 0 |
| `npm --prefix member test` | **12/12 pass** (`node --check` + invariants) | 0 |
| `npm --prefix reality-mechanics-mcp test` | **27/27 pass** | 0 |
| `npm --prefix .atlas-publisher run sync:d1` | Generated `generated/atlas-d1-sync.sql` (2.5 MB) from **490 published notes**; dry run | 0 |
| `node --check .atlas-publisher/main-website-worker.js` | OK | 0 |

All three test suites use only Node built-ins and **passed without any `npm install`** — the build/test layer is reproducible even offline.

---

## 4. Documented deployment procedure

- **CI:** `.github/workflows/deploy.yml` — on push to `main` (or manual dispatch), a Cloudflare-secret preflight gates three jobs (Field, Calibration, MCP), each running tests then `npx wrangler deploy`. PRs test only. Triggers are restricted to worker paths — **`Reality_Mechanics/**` changes do not trigger CI**, so Atlas edits neither auto-deploy nor auto-sync D1.
- **Local:** macOS `.command` scripts — `Deploy Main Website.command`, `Deploy MCP Worker.command`, `Sync Atlas D1 from GitHub.command`, `Backup to GitHub.command`.
- **D1 apply:** `npm --prefix .atlas-publisher run sync:d1 -- --apply` (refuses a dirty `Reality_Mechanics/` unless `--allow-dirty`).

---

## 5. Actual deployment procedure (attempted — build stage only)

Actual upload cannot be performed without credentials, so the report ran `wrangler deploy --dry-run` (bundles locally, no auth, no upload):

| Worker | Install | Dry-run build | Bindings detected |
|--------|---------|---------------|-------------------|
| Calibration (`member`) | `npm ci` → 36 pkgs, wrangler 4.107.0 | **Built** (16.76 KiB) | none |
| MCP (`reality-mechanics-mcp`) | `npm ci` → wrangler 3.114.17 | **Built** (56.19 KiB) | `ATLAS_DB` → atlas-d1 |
| Field (`.atlas-publisher`) | `npx --yes wrangler` (4.107.0) | **Built** (126.95 KiB) | `ATLAS_DB` → atlas-d1 |

All three **compile and bundle successfully**. The step beyond this (authenticated upload) is where external dependencies bind.

---

## 6. Required dependencies

| Component | Lockfile | wrangler pin | Install determinism |
|-----------|----------|--------------|---------------------|
| `member` | `package-lock.json` present | devDep `^4.107.0` | **Deterministic** (`npm ci`) |
| `reality-mechanics-mcp` | `package-lock.json` present | devDep `^3.90.0` (resolved 3.114.17) | **Deterministic** (`npm ci`) |
| `.atlas-publisher` | **no lockfile**, **no declared wrangler dep** | none | **Non-deterministic** — CI uses `npm install`; deploy uses `npx wrangler@latest` |

Runtime: Node.js (CI: 22). Tests need Node only. Worker builds pull `esbuild`/`workerd` via wrangler.

---

## 7. Required secrets / external services

| Requirement | Source | Reproducible from repo? |
|-------------|--------|--------------------------|
| `CLOUDFLARE_API_TOKEN` (Workers/D1 deploy perms) | `deploy.yml`, `README.md` | No — external secret |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy.yml`, `README.md` | No — external secret |
| Cloudflare account owning routes `realitymechanics.nz`, `calibration.realitymechanics.nz`, `mcp.realitymechanics.nz` | `wrangler.toml` × 3 (custom_domain routes) | No — external, DNS/domain-bound |
| D1 database `atlas-d1`, id `ffc9622e-02a4-4561-b11e-4e54fac92967` | `.atlas-publisher/wrangler.toml`, `reality-mechanics-mcp/wrangler.toml` | No — **hardcoded id** references a specific pre-existing database |
| D1 schema (`entries`, `entry_revisions`, `proposals`, `garden_config`) | Implied by `sync-d1-from-repo.mjs` (`DELETE FROM entries; INSERT ...`) and `field-maturity.mjs` queries | **Partial** — sync emits `entries` rows but **no `CREATE TABLE` / schema migration file was found**; table creation is undocumented |

---

## 8. Missing files

| File | Referenced by | Impact |
|------|---------------|--------|
| `.atlas-publisher/atlas-doctor.mjs` | `.githooks/pre-commit` (line 10, invoked with `--check`), `.atlas-publisher/atlas-core.mjs` comment | **Absent from tree.** If a contributor enables the hook, every commit fails the integrity gate. Not active by default (see §9). |
| `scripts/root-live-atlas.mjs` | `Backup to GitHub.command` (line 14) | Optional — guarded by `[ -f ... ]`; absence is handled gracefully. |

---

## 9. Undocumented assumptions

1. **Git hook is not wired by default.** `git config core.hooksPath` is **unset**, so `.githooks/pre-commit` (and its dependence on the missing `atlas-doctor.mjs`) is dormant. No documentation instructs a contributor to run `git config core.hooksPath .githooks`. The hook's integrity guarantee is therefore not actually in force.
2. **No stated local Node version.** Only CI declares Node 22; `README.md` gives no local prerequisite. (Investigation ran on Node 26 and all steps passed.)
3. **D1 table creation is unspecified.** Sync assumes `entries` already exists; no schema/migration file was located in the repository.
4. **`.atlas-publisher` deploy is version-floating.** Because it has no lockfile and pulls `wrangler@latest`, a future wrangler release could change build/deploy behaviour for the Field worker without any repository change.
5. **Shared D1 id is baked in.** The hardcoded `database_id` means the repo assumes access to *one specific* Cloudflare D1 instance; a fresh contributor cannot bind to it.
6. **macOS-only operator scripts.** `.command` files are zsh/macOS launchers; a non-macOS contributor must translate them (the underlying `npm`/`npx` commands are portable).

---

## 10. Reproduction blockers

| Layer | Blocker | Severity |
|-------|---------|----------|
| Source / tests / D1 SQL generation | None | **Reproducible** |
| Deploy to **canonical production** surfaces | Cloudflare secrets + account ownership of the specific routes/domains + the specific `atlas-d1` database | **Hard blocker** — cannot be satisfied from repo alone |
| Deploy to a **contributor's own** Cloudflare account | Must supply own secrets, create own D1, and edit `wrangler.toml` (`database_id`, routes), plus create the `entries` schema | **Soft blocker** — achievable with edits + external setup |
| Commit with integrity gate enabled | Missing `atlas-doctor.mjs` | Conditional — only if hook is manually wired |

---

## 11. Commands attempted & results (summary)

All exit codes `0`. Full transcripts captured during investigation: 3 test suites (22/12/27 pass), D1 sync dry-run (490 notes → 2.5 MB SQL), `node --check` on Field worker, and three `wrangler deploy --dry-run` builds (all bundled). Post-run `git status --short` showed only `?? PROJECT_STATUS.md` — **no repository source was modified**; `node_modules/` and `generated/` are gitignored. Atlas file count: 492 tracked = 492 on disk.

---

## Acceptance determination

> *The report must make clear whether a competent contributor can reproduce the repository, or exactly what prevents reproduction.*

- **Buildable & testable from the repository alone:** **Yes** — verified, offline, deterministic for `member`/`mcp`, non-deterministic (but working) for `.atlas-publisher`.
- **Generated content (D1 SQL) reproducible:** **Yes** — verified locally.
- **Deployable to the *canonical live* Reality Mechanics surfaces by an independent contributor using only the repository:** **No.** Prevented by (a) Cloudflare `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets, (b) account ownership of the three custom-domain routes, (c) the hardcoded `atlas-d1` database id and its undocumented schema. These are external to the repository by design (the repo treats D1 as a regenerable read model and Cloudflare as the host).
- **Deployable to a contributor's *own* environment:** **Yes, with documented-but-not-in-repo external setup** and small `wrangler.toml` edits.

**Contract review block:**

- **Evidence sufficient:** Yes — documented vs actual procedures compared; commands executed with recorded results.
- **Risk reduction relation:** unknown-reproducibility : known-reproducibility (source layer proven; deploy blockers named).
- **Knowledge gain relation:** several previously-unknown items now known — missing `atlas-doctor.mjs` confirmed, hook dormant by default, `.atlas-publisher` lockfile/wrangler-pin absence, undocumented D1 schema, hardcoded D1 id.
- **Verification coverage (checked : total):** build/test/generation **3/3 components verified**; deployment **0/3 uploaded** (external-credential blocked, build stage 3/3 verified).
- **Recommendation:** Accept as a Discovery/Verification deliverable. The repository is **self-reproducible for development** and **not self-reproducible for canonical deployment** without external Cloudflare provisioning. (Per scope: **no fixes proposed.**)
