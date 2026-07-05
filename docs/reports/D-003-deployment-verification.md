# D-003 — Deployment Verification

**Programme:** Deployment Verification  
**Type:** Release audit (read-only verification; this report is the only file created)  
**Governing question:** Is the Reality Mechanics Observatory internally consistent and publicly deployed from the current repository state?

**Audit date:** 2026-07-05 (UTC+12)  
**Repository HEAD:** `48bab6b` — *Deliver Observatory loop: Atlas correction, Calibration term test, Submission 001*  
**Auditor method:** Repository inspection, local build/test execution, live HTTP probes, GitHub Actions history, Cloudflare Workers API.

---

## Executive summary

**Repository, deployment, and Observatory are not fully synchronised.**

The synchronisation break occurs at **stage 4 — D1 read-model sync**, not at worker deployment or Observatory routing.

| Layer | Status | Evidence |
|---|---|---|
| Git repository | Clean, pushed, aligned with `origin/main` | `git status`; HEAD `48bab6b` |
| Worker builds & tests | All pass locally and in CI | member 16/16; field 25/25; mcp 27/27 |
| Worker deployment | **Synchronised** with `48bab6b` | GitHub Actions run `28733802660` success; Cloudflare `modified_on` 2026-07-05T07:47Z for Field, Calibration, MCP |
| D1 read-model | **Not synchronised** with current Atlas source | Live `atlasVersion: 2026.07.03-i983`; accepted `Maintained Coupling → Compatibility` repair present in repo but absent in live Field/MCP reads |
| Observatory surfaces | **Partially synchronised** | Submission 001, structural Calibration, and navigation are live; Field/MCP Atlas reads reflect stale D1 |
| Atlas integrity tooling | **Incomplete** | `atlas-doctor.mjs` referenced but missing; no full integrity scan runnable |

**What is healthy:** Worker code from D-002 is deployed and reachable. Submission 001 is public. Calibration structural term-test is live. Retired routes return intentional 410s. Governance separation (accepted / candidate / unresolved) is preserved on the live submission page. No unaccepted Calculus claim is promoted publicly.

**What is not healthy:** The canonical Atlas edit path stops before D1. Field and MCP continue to serve a read-model two days behind the accepted Atlas repair. Pre-commit integrity gate cannot run. `REPOSITORY_VERIFICATION.md` and `DELIVERY_PLAN.md` current-priority text are stale relative to programme state.

---

## 1. Repository status

### Working tree

| Check | Result | Evidence |
|---|---|---|
| Working tree | Clean | `git status`: nothing to commit |
| Uncommitted changes | None | — |
| Pending commits | None locally; branch matches remote | `main...origin/main` (no ahead/behind) |
| Current branch | `main` @ `48bab6b` | `git branch -vv` |
| Merge conflicts | None | Clean tree |
| Generated artefacts committed | No — correctly gitignored | `.gitignore` ignores `.atlas-publisher/generated/`; `atlas-d1-sync.sql` exists locally only |

### Recent commits (relevant to this audit)

| Commit | Summary |
|---|---|
| `48bab6b` | D-002 delivery: Observatory loop, Calibration structural test, Submission 001 route, Maintained Coupling repair |
| `bb178f4` | S-001 programme characterisation |
| `8faa655` | Repository verification commission template |

### Programme-area presence (repository)

| Area | Present in repo? | Notes |
|---|---|---|
| Atlas | Yes | 492 markdown files in `Reality_Mechanics/`; 490 published to D1 sync |
| Practice | Yes | `docs/practice/` — PRACTICE, COMMISSIONS, DECISION_REGISTER, ARCHITECTURAL_NOTES |
| Calculus | Yes (candidate only) | Reports C-001/002/003; `PRACTICE_CALCULUS.md` evidence, not accepted |
| Theory | Yes | `Reality_Mechanics/Theory.md` (`kind: theory`, `status: stable`) |
| Proof | Declared only | Named in `MISSION.md` / `DELIVERY_PLAN.md`; no Proof workstream document |
| Calibration | Yes | `member/` worker |
| Field / Observatory | Yes | `.atlas-publisher/` worker + Submission 001 page |
| AI Workers | Yes | `reality-mechanics-mcp/` (read-only MCP) |
| Submission 001 | Yes | `docs/submissions/SUBMISSION-001-first-public-submission.md` + live `/submission` page |

---

## 2. Build status

All executable build steps **pass**. No lint configuration exists in the repository.

### npm installs

| Package | Command | Result |
|---|---|---|
| `member/` | `npm ci` | Pass (npm allow-scripts warnings only) |
| `.atlas-publisher/` | `npm install --no-audit --fund=false` | Pass |
| `reality-mechanics-mcp/` | `npm ci` | Pass (npm allow-scripts warnings only) |

### Tests

| Suite | Command | Result |
|---|---|---|
| Calibration invariants | `npm --prefix member test` | **16/16 pass** |
| Field / atlas-core | `npm --prefix .atlas-publisher test` | **25/25 pass** (11 atlas-core + 14 field-states) |
| MCP worker | `npm --prefix reality-mechanics-mcp test` | **27/27 pass** |

### Syntax / worker builds

| Check | Result |
|---|---|
| `node --check .atlas-publisher/main-website-worker.js` | Pass |
| `node --check member/src/index.js` (via member test) | Pass |
| `wrangler deploy --dry-run` Field | Pass — 134.26 KiB bundle |
| `wrangler deploy --dry-run` Calibration | Pass — 27.18 KiB bundle |

### Atlas generation / D1 generation

| Step | Command | Result |
|---|---|---|
| D1 sync generation (dry run) | `npm --prefix .atlas-publisher run sync:d1` | Pass — generated from **490 tracked** Atlas notes |
| D1 sync apply | Not run (audit only) | N/A |
| Atlas note count | 492 total `.md`; 490 published; 2 skipped (`Common Term Structure.md`, `Current Record Convention.md`) | Expected per `shouldPublish` |

### Linting

No ESLint, Prettier, or other lint config found at repository root or in worker packages. **Not present — not failed.**

### Recorded failures

None in build or test execution. Non-blocking warnings: npm `devdir` config warning; npm `allow-scripts` advisory; wrangler log-file write permission in sandbox (bundle still produced).

---

## 3. Deployment status

### GitHub Actions

Latest deploy workflow for `48bab6b`:

- **Run:** `28733802660` — *Deliver Observatory loop…*
- **Trigger:** push to `main`
- **Result:** success (33s)
- **Jobs:** Cloudflare secrets ✓ · Field ✓ · Calibration ✓ · MCP ✓
- **headSha:** `48bab6b6108e8c5036fe4d867c575724a7d3f4ba`

Deploy workflow (`.github/workflows/deploy.yml`) deploys **Workers only**. It does **not** run `sync:d1` or apply D1 changes. Atlas file changes under `Reality_Mechanics/**` do **not** trigger deploy.

### Cloudflare Workers (live)

| Worker | Route | `modified_on` (Cloudflare API) | Sync with repo? |
|---|---|---|---|
| `super-frost-d434` | `realitymechanics.nz` | 2026-07-05T07:47:47Z | **Yes** — matches post-`48bab6b` CI deploy |
| `reality-mechanics-calibration` | `calibration.realitymechanics.nz` | 2026-07-05T07:47:45Z | **Yes** |
| `reality-mechanics-mcp` | `mcp.realitymechanics.nz` | 2026-07-05T07:47:47Z | **Yes** |

Orphaned Workers still present in account (retired product): `reality-mechanics-garden`, `reality-mechanics-garden-*`, `atlas-publisher`, `reality-mechanics-api-gardener`. These are not linked from active Observatory navigation; last modified 2026-06-30 to 2026-07-02. Not a public-surface break, but operational clutter.

### D1 (`atlas-d1`)

| Check | Repository | Live (Field `/api/field/states`) |
|---|---|---|
| `atlasVersion` | Generated locally 2026-07-05 (not applied) | `2026.07.03-i983` |
| Entry count | 490 in generated sync | 492 states returned |
| **Maintained Coupling structure** | `needs`/`holds`/`traces` include **Compatibility** (parsed via `atlas-core.mjs`) | `holds`/`traces`: Coupling, Bearing, Recurrence only — **Compatibility absent** |
| MCP `get_entry_by_title("Maintained Coupling")` | — | **Compatibility absent** |

**Conclusion:** Worker deployment is current; **D1 is not**. The accepted E1 Atlas repair committed in `48bab6b` exists in GitHub source but has **not** been synced to production D1.

### Local-only vs live

| Exists locally, not reflected in live D1 | Exists live, correct |
|---|---|
| Maintained Coupling `[[Compatibility]]` dependency repair | D-002 worker HTML/JS (Submission page, structural Calibration, nav links) |
| Fresh `generated/atlas-d1-sync.sql` (2026-07-05) | Retired-route 410 behaviour |
| — | Calibration `/api/health` mechanical runtime |

---

## 4. Observatory status

Live HTTP probes (2026-07-05):

| URL | Status | Size | Notes |
|---|---|---|---|
| `https://realitymechanics.nz/` | 200 | 109 KB | Field page |
| `https://realitymechanics.nz/field` | 200 | 109 KB | Field page |
| `https://realitymechanics.nz/submission` | 200 | 7 KB | Submission 001 — **reachable** |
| `https://realitymechanics.nz/submission-001` | 200 | alias route works |
| `https://calibration.realitymechanics.nz/` | 200 | 27 KB | Structural Calibration + strain pass |
| `https://calibration.realitymechanics.nz/api/health` | 200 | `{"ok":true,"runtime":"mechanical","ai":false}` |
| `https://mcp.realitymechanics.nz/` | 200 | MCP manifest v2.3.0 |
| `https://realitymechanics.nz/api/field/states` | 200 | 495 KB JSON | D1-derived states |

### Navigation

| Link | Present live? |
|---|---|
| Field → Calibration | Yes (`access-row`) |
| Field → Submission 001 | Yes |
| Calibration → Field | Yes |
| Calibration → Submission 001 | Yes |
| Submission → Field | Yes |
| Submission → Calibration | Yes |

### Retired routes (expected 410)

`/atlas`, `/garden`, `/ark`, `/api/field/entries` — all return **410** with "Field and Calibration only" message. **Correct.**

### Runtime errors observed

No obvious runtime errors on probed routes. Field loads and fetches `/api/field/states`. Calibration structural test UI markers present (`Structural Calibration`, `termSelect`, `ttRun`, `load-bearing`). MCP `tools/list` responds.

### Atlas term resolution

Field states API resolves terms (e.g. `first.connection` → Connection with `holds: ["first.relation"]`). Resolution works against **current D1 content**, which is stale relative to Git source for at least Maintained Coupling.

---

## 5. Atlas status

### Runnable validation

| Tool | Status | Result |
|---|---|---|
| `atlas-core.mjs` unit tests | Present | 11/11 pass |
| `sync-d1-from-repo.mjs` generation | Present | Pass — 490 notes |
| `atlas-doctor.mjs` | **Missing** | `.githooks/pre-commit` references it; file absent; `node .atlas-publisher/atlas-doctor.mjs` → MODULE_NOT_FOUND |
| Pre-commit hook active | No | `core.hooksPath` not set; default `.git/hooks/pre-commit` not installed |

### Structure contract

`atlas-structure-contract.mjs` present at repository root; imported by Field worker and MCP. Version `2026-06-30.ratio-reading-order`.

### Accepted repair verification (spot check)

**Maintained Coupling → Compatibility (E1, committed):**

- **Repo source:** `needs`, `holds`, `traces` all include `[[Compatibility]]` (`Maintained Coupling.md:13,17,23`)
- **Generated sync SQL:** prose and structure include Compatibility (generation run 2026-07-05)
- **Live D1 / Field / MCP:** Compatibility **not present** in structure reads

This is the clearest evidence of Atlas-source ↔ D1 desynchronisation.

### Broken references / full integrity scan

**Cannot be fully verified.** Without `atlas-doctor.mjs`, the repository's documented integrity gate (collisions, unresolved, leaks, reciprocity, orphans, drift) is **not runnable**. Partial coverage via atlas-core parser tests and sync generation only.

---

## 6. Governance status

### Accepted vs candidate separation

| Check | Result |
|---|---|
| Submission 001 live page | Separates Accepted / Candidate / Unresolved sections |
| Calculus promotion | Candidate only — "operator is not accepted", "explicitly unpromoted" on live page |
| Ark Run / Order:Ark | Listed under Candidate, not Accepted |
| Constitution C007 (reports ≠ authority) | Reports in `docs/reports/`; Submission cites them as evidence; no report promoted to governing authority in live surfaces |

### Submission accuracy vs repository

| Claim area | Accurate? | Note |
|---|---|---|
| Three-layer architecture | Yes | Matches `README.md`, `PROJECT_STATUS.md` |
| Relation as sole primitive | Yes | Matches Atlas + Constitution |
| Calculus unresolved | Yes | Matches C-003, Constitution C010 |
| Public surfaces Field · Calibration · MCP | Yes | All live |
| Stewardship "zero method failures" | Yes | Consistent with audit log |
| Production deployment "not file-verified" | **Now partially verified** | Workers verified live; D1 sync gap now evidenced |

### Minor repository governance drift (not live-surface breaks)

- `DELIVERY_PLAN.md` "Current Priority" still names **S-001** — S-001 and Submission 001 are complete; D-002 delivered.
- `PROJECT_STATUS.md` still lists build/deploy as unverified and "one outstanding proposal" for stewardship — `AUDIT_LOG.md:86-88` now says Outstanding Proposals: None.
- `REPOSITORY_VERIFICATION.md` status: **IN PROGRESS**; references Cloudflare Pages and Gardener — product has moved to Workers-only; Garden retired.

**No evidence that a report has accidentally become authority on public surfaces.**

---

## 7. Delivery-plan progress

Compared against `MISSION.md` and `DELIVERY_PLAN.md`:

### Epochs

| Epoch | Deliverable | Status |
|---|---|---|
| I — Recover structural answers (Atlas) | Atlas source + stewardship | **Partially complete** — 492 files; ~51 audited; accepted repairs in source; D1 sync manual and currently stale |
| II — Recover structural questions (Practice) | Practice governance + commissions | **Partially complete** — active commissions register; stage names underived |
| III — Recover order-preserving operations (Calculus) | Accepted calculus | **Not started** (investigation complete; no accepted operation) |
| IV — Build the structural observatory (Website) | Public Observatory | **Partially complete** — Field, Calibration, Submission 001 live; full Observatory vision (dependency/carrying/pressure visualisation per `DELIVERY_PLAN.md:133-143`) not built |
| V — Continuous calibration and stewardship | Ongoing loop | **Partially complete** — stewardship method stable; D-002 opened structural Calibration; coverage partial |

### Workstreams

| Workstream | Status | Evidence |
|---|---|---|
| **Atlas** | Partially complete | Source mature; D1 lag; stewardship coverage ~10% |
| **Practice** | Partially complete | Governance active; derivation unresolved |
| **Calculus** | Partially complete (investigation) / not accepted | C-001/002/003 reports; `:` unaccepted |
| **Theory** | Partially complete | `Theory.md` v0.6 stable and load-bearing |
| **Proof** | Not started | Declared in mission; no workstream artefact |
| **Calibration** | Partially complete | Strain pass + structural term test live; mission wording ("measures participation") still diverges from built instrument (`S-001 §1.4`) |
| **Observatory** | Partially complete | Submission 001 + Field + nav; not full deliverable list from plan |
| **AI Workers** | Partially complete | MCP deployed and functional; read-only discipline enforced in tests |

### Recent commissions (delivery record)

| Commission | Status |
|---|---|
| S-001 Programme Characterisation | Complete — `docs/submissions/S-001-programme-characterisation.md` |
| Submission 001 build | Complete — live at `/submission` |
| D-002 Atlas + Calibration + Website | Complete — `docs/reports/D-002-atlas-calibration-website-delivery.md` |
| D-003 Deployment Verification | **This report** |

---

## 8. Outstanding issues

### Critical (synchronisation)

1. **D1 read-model stale** — live `atlasVersion: 2026.07.03-i983`; accepted Maintained Coupling → Compatibility repair (2026-07-05) not in Field or MCP reads.
2. **No automated D1 sync in CI** — `.github/workflows/deploy.yml` deploys Workers only; Atlas edits require manual `sync:d1 --apply`.

### Operational

3. **`atlas-doctor.mjs` missing** — pre-commit gate and `atlas-core.mjs` comment reference it; full integrity validation unavailable.
4. **Pre-commit hook not installed** — `.githooks/pre-commit` exists but `core.hooksPath` not configured.
5. **Orphaned Cloudflare Workers** — retired Garden/API workers remain deployed in account.
6. **490 vs 492 note count** — two convention files intentionally excluded from publish; live API returns 492 states (includes historical/extra entries vs generated 490 — warrants sync audit, not necessarily an error).

### Documentation drift

7. **`DELIVERY_PLAN.md` current priority** stale (still S-001).
8. **`PROJECT_STATUS.md`** partially stale (verification status, stewardship outstanding proposal).
9. **`REPOSITORY_VERIFICATION.md`** IN PROGRESS; references retired architecture (Pages, Gardener).

### Programme gaps (by design or backlog)

10. **Proof workstream** — declared, unbuilt.
11. **Calculus** — investigated, not accepted.
12. **Full Observatory visualisation deliverables** — not yet implemented (`DELIVERY_PLAN.md:133-143`).

---

## 9. Recommended next actions

Priority order:

1. **D-004 — D1 sync and read-model verification**  
   Run `npm --prefix .atlas-publisher run sync:d1 -- --apply` against production `atlas-d1` (with steward authorisation). Re-probe `/api/field/states` and MCP `get_entry_by_title("Maintained Coupling")` for Compatibility. Record `atlasVersion` before/after.

2. **Wire D1 sync into delivery pipeline**  
   Either add a documented manual gate after Atlas commits or add a CI job (with explicit steward approval) so accepted Atlas repairs cannot reach GitHub without a planned D1 apply.

3. **Restore or replace `atlas-doctor.mjs`**  
   Reinstate the integrity gate referenced by pre-commit, or update hooks/docs to name the actual validation path.

4. **Update governance cover sheets**  
   Refresh `PROJECT_STATUS.md`, `DELIVERY_PLAN.md` current priority, and complete `REPOSITORY_VERIFICATION.md` from this audit's findings.

5. **Retire orphaned Cloudflare Workers**  
   Remove or archive Garden-era workers no longer in the active product (`README.md:10`).

6. **Continue D-002 follow-on**  
   D-003 confirms D-002's proposed next step remains valid: widen Calibration structural test to read live field/D1 rather than bounded local subset — **after** D1 sync is restored.

---

## Acceptance statement

This audit **does not** conclude:

> Repository, deployment and Observatory are synchronised.

Synchronisation breaks at:

```text
GitHub Atlas source (current)
        ↓
   [MISSING STEP: sync:d1 --apply]
        ↓
D1 read-model (stale: 2026.07.03-i983)
        ↓
Field + MCP (serve stale structure)
```

Worker deployment and Observatory routing **are** synchronised with commit `48bab6b`. Public participants see the latest Submission 001 and Calibration structural instrument, but **not** the latest accepted Atlas structure for at least Maintained Coupling — and potentially any other Atlas edits since the last D1 apply.

---

**Status:** D-003 complete. Release audit recorded. No repository fixes applied during verification.
