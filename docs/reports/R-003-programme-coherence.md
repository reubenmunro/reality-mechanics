# R-003 — Programme Coherence Audit

**Programme:** Release / Architecture  
**Type:** Read-only coherence audit (no implementation)  
**Date:** 2026-07-06 (UTC+12)  
**Stance:** Judge by elegance — remove the most while preserving the most.  
**Governing premise:** Public release has been reached; this audit treats the programme as one living system and verifies prior commissions rather than assuming them.

---

## Executive summary

Reality Mechanics has a **sound architectural spine** (Atlas → Stewardship → Platform, Constitution authority order, one structure contract, generated D1). The public product is **live and coherent at the surface level**: five HTML surfaces + MCP, unified nav, intentional 410 retirement.

The programme's deepest incoherence is **not missing features** — it is **parallel truths**:

1. **Production ≠ local repository.** `origin/main` @ `a094565` (D-025) is deployed; local `HEAD` @ `083086c` is one commit behind; uncommitted R-002 work introduces a **third** programme-orientation module with different MCP tool names.
2. **Naming schism** between public vocabulary (Observatory · Pulse) and infrastructure vocabulary (Field · Calibration · `garden_config` · `/api/field/*`) is deliberate but incomplete — stale docs still teach the old names.
3. **Documentation entropy** — 55+ commission reports, multiple overlapping “programme state” documents, and superseded reports (D-021.5 “four surfaces”) still authoritative in places.
4. **Monolithic worker** — 3,690-line `main-website-worker.js` embeds four programme pages plus the entire Observatory client; Calculus derivation on `origin/main` is correctly moving to shared data, but the local tree has not caught up.

**Verdict:** The programme is **publicly releasable** but **internally over-described and forked**. The highest-value path to elegance is consolidation around **one generated manifest** (D-025 pattern), retirement of duplicate orientation layers, and archival of superseded reports — not new surfaces or tools.

---

## 1. Programme diagnosis

### 1.1 What is coherent (verified)

| Domain | State | Evidence |
|---|---|---|
| Public surfaces | Live 200 | `realitymechanics.nz/field`, `/theory`, `/proof`, `/calculus`; `calibration.realitymechanics.nz` |
| GitHub retrace | Public | `github.com/reubenmunro/reality-mechanics` → HTTP 200 (2026-07-06 probe) |
| Five-surface nav | Consistent on live HTML | Observatory · Pulse · Theory · Proof · Calculus; D-026 icon-free typography |
| Retired routes | Correct 410 | `/atlas`, `/garden` → five-surface message |
| Atlas source | Canonical in GitHub | `Reality_Mechanics/` ~492 files; D1 ~490 entries |
| Structure contract | Single shared module | `atlas-structure-contract.mjs` imported by Field worker + MCP |
| MCP read-only | Enforced | No write tools; `write_proposal` returns -32601 |
| Tests | 129 passing locally | 73 + 18 + 38 (includes uncommitted R-002 assertions) |
| Commission discipline | Strong traceability | `COMMISSIONS.md` register through D-026, R-001, R-002 |

### 1.2 What is incoherent (verified)

#### A. Three-way repository / production drift (critical)

| Layer | Programme orientation | Calculus derivation | Observatory first-load |
|---|---|---|---|
| **Production (live)** | `get_public_surfaces`, `get_derivation_status` (17 tools, v2.4.0) | Rendered from `public-surface-manifest.mjs` (D-025 on `origin/main`) | Pre–R-002 behaviour (`openTermSheet` on neutral load; no `Reading field…`) |
| **`origin/main` @ `a094565`** | D-025: `public-surface-manifest.mjs` + two MCP readers | Shared manifest module | R-002 not present |
| **Local `HEAD` @ `083086c`** | 15 Atlas tools only; no manifest module | Handwritten HTML in worker | Pre–R-002 |
| **Local uncommitted (R-002)** | `programme-orientation.mjs` + `get_public_programme`, `get_governance_document` | Unchanged handwritten | R-002 UX fixes present only in working tree |

**Why this exists:** D-025 (`a094565`) landed on `origin/main` after local `HEAD`; R-002 was executed against an older snapshot and re-solved programme orientation with a **different module and tool names**, duplicating D-025's intent.

**What becomes simpler:** One manifest, two readers (D-025). Discard R-002's parallel `programme-orientation.mjs`.

**Risk removed:** AI and humans reading different programme truths; deploy/revert confusion; commission reports (R-002) claiming tools that production does not expose under those names.

#### B. Naming schism (Field/Calibration vs Observatory/Pulse)

Public UI and post–R-002 root docs use **Observatory · Pulse**. Infrastructure retains **Field · Calibration**:

- Routes: `/field`, `/api/field/*`
- CI jobs: `field`, `calibration`
- Modules: `field-maturity.mjs`, `field-behaviour-trace.mjs`
- D1: `garden_config` table
- `atlas-structure-contract.mjs` translation surfaces: `field`, `calibration`
- `member/README.md` title: "Calibration" (28 occurrences vs 21 Pulse)

Stale docs still teach old names: `S-001` (Field · Calibration · MCP), `REPOSITORY_VERIFICATION.md`, `MISSION.md` (Calibration not Pulse), `DELIVERY_PLAN.md`, `member/README.md`.

**Why it exists:** D-021 rename was public-facing; infrastructure rename deferred to avoid breaking APIs and D1 bindings.

**What becomes simpler:** One vocabulary everywhere, or one explicit legacy-alias table (D-025/`programme-orientation` pattern) referenced by all docs.

**Risk removed:** First-time participants and AI agents misrouting between `/field` and "Observatory"; doc authors updating the wrong file.

#### C. Documentation entropy

| Document | Role | Drift |
|---|---|---|
| `README.md` | Onboarding | Current (post–R-002, uncommitted) |
| `PROJECT_STATUS.md` | Operational cover | Current (uncommitted) |
| `MISSION.md` | Timeless purpose | Uses Calibration; overlaps MCP governance excerpts |
| `S-001-programme-characterisation.md` | Commission snapshot | **Stale:** Field/Calibration; pre-D-024 Calculus; cites unverified deploy |
| `SUBMISSION-001` | Public submission | Current surfaces (uncommitted) |
| `REPOSITORY_VERIFICATION.md` | Deploy tracker | COMPLETE but Field/Calibration language; old HEAD `48bab6b` |
| `DELIVERY_PLAN.md` | Programme history | Mixed Observatory/Field |
| `COMMISSIONS.md` | 50+ resolved rows | Valuable index but heavy; D-021.5 contradicts D-024 |
| `docs/reports/` | 55 `.md` reports | D-020×4, D-021×6, D-018×4 clusters; `FABLE-REPO-STATE` duplicates R-001/R-002 |
| `public-surface-manifest.mjs` | **On origin only** | Intended canonical programme data |

**Why it exists:** Constitutional discipline (reports as evidence, C007) produced thorough commission traces; promotion/archival pass never ran.

**What becomes simpler:** One machine-readable manifest + one human cover sheet + archived report index.

**Risk removed:** Stewards and AI reading superseded programme characterisations as current.

#### D. Monolithic Observatory worker

`main-website-worker.js` — **3,690 lines**: router + Observatory canvas client + Theory + Calculus + Proof/Submission HTML + APIs.

- Nav HTML repeated across page functions (~12 `access-row` patterns).
- `/proof`, `/submission`, `/submission-001` all serve **identical** `submissionPage()` — three routes, one page.
- Theory and Proof content partially duplicates `Reality_Mechanics/Theory.md` and submission markdown (intentional public compression, but handwritten twice).

On `origin/main`, Calculus vocabulary/chain/inventory **derives** from `public-surface-manifest.mjs`. Local tree still hand-embeds Calculus prose.

**Why it exists:** Cloudflare Worker deployment favours single-file bundles; commissions added pages incrementally.

**What becomes simpler:** Shared manifest + thin HTML shells; one Proof route.

**Risk removed:** Calculus/MCP/website drift (D-025 explicitly addressed this on origin).

#### E. MCP session-orientation overlap

Even on production (17 tools), orientation is fragmented:

| Tool | Overlap |
|---|---|
| `begin_atlas_session` | Protocol + governance + manifest + practice entries + next steps |
| `get_ai_entry_protocol` | Subset of session protocol |
| `get_manifest` | Atlas read-model identity (improved in D-025 to real version label) |
| `get_public_surfaces` | Full programme structure |
| `get_derivation_status` | Calculus slice of manifest |
| `get_structure_contract` | Translation contract (also embedded in session) |

R-002's uncommitted `get_public_programme` + `get_governance_document` would add a **sixth** orientation path.

**Why it exists:** Incremental MCP growth; each commission added a doorway without retiring the prior one.

**What becomes simpler:** `begin_atlas_session` → points to `get_public_surfaces` only; deprecate redundant entry tools or fold into session response.

**Risk removed:** AI calling three orientation tools and reconciling conflicts.

#### F. Garden-era persistence

Correctly **410** at route level; incorrectly **still named** in:

- D1 `garden_config` (version label stale: `2026.07.03-i983`)
- Six orphan Cloudflare workers (documented D-013, not deleted)
- `.githooks/pre-commit` → missing `atlas-doctor.mjs`
- `Backup to GitHub.command` → Garden growth script reference
- `Deploy Main Website.command` → deploy without D1 binding (D-013 hazard)

**Why it exists:** Retirement was route-level; schema and ops tooling not cleaned.

**What becomes simpler:** Rename `garden_config` → `atlas_config`; delete orphan workers; fix or remove hazardous scripts.

**Risk removed:** Wrong deploy path; false version label; dormant hook referencing missing file.

#### G. Practice / runtime doc overlap

Multiple practice documents restate similar flows:

- `PRACTICE.md`, `DISCOVERY_TO_IMPLEMENTATION.md`, `STRUCTURAL_READING.md`, `STRUCTURAL_READING_OPERATIONS.md`, `RUNTIME_PRINCIPLES.md`, `ARCHITECTURAL_NOTES.md`

Runtime candidates correctly marked unpromoted (`EMBER_RUNTIME_MODEL.md`, `DERIVED_RATIO.md` + falsification reports) — **keep**, but index should be generated from manifest "open items" not hand-maintained in three places.

#### H. Commission contradictions (verified, not assumed)

| Report A | Report B | Contradiction |
|---|---|---|
| D-021.5 (four surfaces) | D-024 (five surfaces + Calculus) | Same day; D-021.5 objective superseded, not reconciled |
| R-002 (claims `get_public_programme`) | D-025 on `origin/main` (`get_public_surfaces`) | Duplicate solution, different names |
| D-026 (remove emoji nav) | D-025 manifest (`symbol: "🔭"`) | Symbols in data module only — low user impact, but internal inconsistency |
| S-001 ("Proof/Observatory unimplemented") | D-021.2, `/proof` live | S-001 observation obsolete |

---

## 2. Coherence map

```text
                         ┌─────────────────────────────────────┐
                         │         CONSTITUTION / MISSION       │
                         │    (governance — stable, timeless)   │
                         └─────────────────┬───────────────────┘
                                           │ authority ↓  evidence ↑
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
│  ATLAS SOURCE   │   generate   │   STEWARDSHIP   │   informs    │    PRACTICE     │
│ Reality_Mechanics│ ──────────► │ docs/stewardship │ ───────────► │ docs/practice   │
│ 492 md files    │              │ method + audits  │              │ (many docs)     │
└────────┬────────┘              └─────────────────┘              └────────┬────────┘
         │ sync (manual)                                                    │
         ▼                                                                  │
┌─────────────────┐                                                         │
│  D1 READ-MODEL  │◄────────────────────────────────────────────────────────┘
│   atlas-d1      │         reports (evidence, not decisions)
│ garden_config ⚠ │◄─── docs/reports (55 files) ─── COMMISSIONS register
└────────┬────────┘
         │ read
         ├──────────────────────┬──────────────────────┐
         ▼                      ▼                      ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  OBSERVATORY    │   │      PULSE      │   │       MCP       │
│ /field worker   │   │ calibration.*   │   │ 17 read tools   │
│ 3690-line mono  │   │ standalone demo │   │ Atlas + programme│
└────────┬────────┘   └─────────────────┘   └────────┬────────┘
         │                                              │
         │  Theory / Proof / Calculus pages             │
         └──────────────────┬───────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  INTENDED SINGLE TRUTH     │  ◄── D-025 on origin/main
              │  public-surface-manifest   │
              │  (website + MCP readers)   │
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  PARALLEL / STALE LAYERS   │  ◄── incoherence
              │  programme-orientation.mjs  │      (R-002 uncommitted)
              │  S-001, REPOSITORY_VERIF.  │
              │  D-021.5, FABLE snapshot   │
              └───────────────────────────┘
```

**Reading the map:** Evidence flows up; authority flows down. The platform should read **one generated manifest** at the Practice/Platform boundary. Today, handwritten HTML, MCP modules, and commission reports all claim programme truth.

---

## 3. Top twenty simplification opportunities

Ranked by elegance impact (remove / consolidate / generate). Each item includes why it exists, why it can change, what simplifies, what risk it removes.

| # | Opportunity | Why it exists | Why it can change | What simplifies | Risk removed |
|---|---|---|---|---|---|
| 1 | **Reconcile to D-025; discard R-002 `programme-orientation.mjs`** | R-002 executed before pull of `a094565` | D-025 already implements one manifest, two readers | One programme module; one tool pair | Three-way drift |
| 2 | **Pull `origin/main` to local; deploy single HEAD** | Local behind by 1 commit | Git merge is mechanical | One deployable truth | Production ≠ repo |
| 3 | **Archive superseded reports** (D-020A–D, D-021.1–3, D-021.5, FABLE) | Commission evidence preserved | Superseding reports exist (D-024, D-026, R-001) | 55 → ~35 active reports | Reading obsolete surface counts |
| 4 | **Retire `/submission` and `/submission-001` routes** | Historical submission URLs | `/proof` is canonical public name | 3 routes → 1 | Navigation confusion |
| 5 | **Unify programme state docs** | Organic growth | `public-surface-manifest.mjs` can drive tables | README + PROJECT_STATUS + SUBMISSION surface tables generated | Doc drift |
| 6 | **Mark S-001 archived** | Commission snapshot at S-001 time | Explicitly superseded by D-024, D-025, R-001 | One less "current" characterisation | AI reading Field/Calibration as active |
| 7 | **Fold REPOSITORY_VERIFICATION into PROJECT_STATUS** | Separate verification tracker | Status COMPLETE; facts belong in cover sheet | One operational doc | Duplicate deploy narrative |
| 8 | **Update MISSION.md vocabulary** | Written pre-D-021 | Single-word swap Calibration→Pulse, add Calculus | Mission matches public product | Mission/surface mismatch |
| 9 | **Rename `member/README.md` to Pulse** | Package folder still `member/` | Public name is settled (D-021.3) | One README voice | Pulse page vs Calibration README |
| 10 | **Merge MCP orientation tools** | Incremental MCP growth | `begin_atlas_session` can embed public surfaces pointer | 17 → ~15 tools | AI orientation fatigue |
| 11 | **Deprecate `get_ai_entry_protocol` as separate tool** | Historical entry ritual | Returned inside `begin_atlas_session` already | One front door | Duplicate protocol reads |
| 12 | **Extract shared nav HTML from worker** | Monolith growth | One `navHtml()` function or manifest-driven nav | ~200 duplicated lines | Nav drift between pages |
| 13 | **Render Theory/Proof from markdown at build** | Public compression hand-copied | Source files exist; build step already pattern (D1 sync) | Worker shrinks; prose single-sourced | Theory page ≠ Theory.md drift |
| 14 | **Rename `garden_config` → `atlas_config` in D1** | Garden-era schema | No Garden consumer reads it | One config namespace | garden_* confusion |
| 15 | **Delete six orphan Cloudflare workers** | D-013 documented orphans | No routes; steward sign-off only | 9 → 3 workers in account | Accidental redeploy / cost |
| 16 | **Remove or repair `Deploy Main Website.command`** | Pre-wrangler.toml local script | CI is canonical; script deploys without D1 | One deploy path | Field without Atlas DB |
| 17 | **Remove Garden stanza from `Backup to GitHub.command`** | `root-live-atlas.mjs` absent | Garden retired | Backup script honest | False Garden workflow |
| 18 | **Resolve `atlas-doctor.mjs` — restore or remove hook** | Referenced, missing | Hook silently skips or blocks if file returns | Pre-commit real or absent | False integrity gate |
| 19 | **COMMISSIONS resolved archive index** | Full register valuable | Resolved D-* need not stay in active table | Active register ~15 rows | Commission table entropy |
| 20 | **CI path filter: docs-only deploy for manifest** | Manifest changes need both workers | D-025 added `public-surface-manifest.mjs` to deploy.yml on origin | Manifest change → auto-align | Website/MCP calculus drift |

---

## 4. Highest-value removals

| Removal | Evidence | Impact |
|---|---|---|
| **Uncommitted `programme-orientation.mjs` + R-002 MCP tool renames** | Duplicates D-025 on `origin/main`; live MCP exposes `get_public_surfaces`, not `get_public_programme` | Eliminates parallel programme truth immediately |
| **`/submission` + `/submission-001` routes** | `main-website-worker.js` L3677 — same handler as `/proof` | −2 routes, clearer public vocabulary |
| **Orphan Cloudflare workers (×6)** | `D-013-cloudflare-surface-audit.md` | −6 deployable artefacts |
| **`Deploy Main Website.command`** (or rewrite to use `.atlas-publisher/wrangler.toml`) | `CLOUDFLARE_SURFACE_MAP.md` local deploy hazard | Removes D1-less deploy path |
| **Garden growth block in Backup script** | `Backup to GitHub.command` L14–17; script missing | Removes false workflow |
| **`FABLE-REPO-STATE-FINDING-2026-07-06.md`** | Duplicates R-001/R-002/S-001 conclusions | −1 redundant snapshot |
| **Pre-commit `atlas-doctor` reference** (if doctor not restored) | `.githooks/pre-commit` L10; file absent | Honest hooks or working gate |
| **D-025 manifest `symbol` fields** (optional) | D-026 removed public emoji; symbols unused in live HTML | Data module matches instrument aesthetic |

---

## 5. Highest-value consolidations

| Consolidation | From → To | Evidence |
|---|---|---|
| **Programme truth** | README + PROJECT_STATUS + SUBMISSION + MCP orientation + Calculus HTML → **`public-surface-manifest.mjs`** | D-025 design on `origin/main`; live MCP already uses it |
| **Operational status** | REPOSITORY_VERIFICATION + PROJECT_STATUS deploy tables → **PROJECT_STATUS only** | REPOSITORY_VERIFICATION COMPLETE but stale naming |
| **Submission characterisation** | S-001 + SUBMISSION-001 → **SUBMISSION-001 public + manifest `supportingReports`** | S-001 L55 still says Field · Calibration |
| **MCP session entry** | `begin_atlas_session` + `get_ai_entry_protocol` + partial `get_manifest` → **one session object with links** | Three tools return overlapping governance |
| **Unresolved items** | OPEN_QUESTIONS + SUBMISSION §4.3 + manifest `openItems` + programme-orientation `UNRESOLVED_ITEMS` → **manifest `openItems` generated from OPEN_QUESTIONS + COMMISSIONS open rows** | Same six items repeated in four places |
| **Observatory worker pages** | Inline HTML × 4 → **manifest-driven shells + shared CSS module** | 3,690-line monolith |
| **Practice reading path** | STRUCTURAL_READING + OPERATIONS + DISCOVERY_TO_IMPLEMENTATION → **PRACTICE.md index pointing to one workflow** | Overlapping stage models |
| **Commission history** | 50-row active register → **active (open) + `docs/reports/INDEX.md` generated from COMMISSIONS** | Register is not a task list but reads like one |

---

## 6. Highest-value generated artefacts

| Artefact | Replaces | Pattern |
|---|---|---|
| **`public-surface-manifest.mjs`** (already on `origin/main`) | Handwritten Calculus HTML; MCP programme tools; duplicate surface tables | Data module at repo root; imported by both workers |
| **`PROJECT_STATUS` surface table** (generated from manifest at commit or CI) | Manual table edits in PROJECT_STATUS + README | `npm run generate:status` |
| **Calculus page HTML functions** (`calculusVocabHtml`, etc. on origin) | Static prose in worker | Already implemented in D-025 |
| **`docs/reports/INDEX.md`** (generated from COMMISSIONS + report filenames) | Manual report discovery | Script reads `COMMISSIONS.md` + `docs/reports/` |
| **`atlas-doctor.mjs`** (restored from structure contract rules) | Missing pre-commit gate | Generate checks from `atlas-structure-contract.mjs` + parser |
| **D1 sync in CI** (optional, guarded) | Manual `sync:d1 --apply` | Reduces ops steps; requires dirty-tree policy |
| **Nav component** (generated string from manifest `PUBLIC_SURFACES`) | 4× copied nav blocks in worker | Single `renderNav(manifest)` |

**Principle:** Handwritten material should appear once (Atlas markdown, Constitution, Mission). Everything that describes **how the platform exposes** the programme should derive.

---

## 7. Implementation roadmap

Phased for elegance — each phase removes before adding.

### Phase 0 — Reconcile repository truth (immediate, no new features)

1. **Pull `origin/main` (`a094565`)** into local workspace.
2. **Revert uncommitted R-002 MCP orientation** (`programme-orientation.mjs`, `get_public_programme`, `get_governance_document`) — keep R-002 Observatory UX fixes only if not already superseded; re-apply atop D-025 base.
3. **Verify tests** against D-025 tool names (`get_public_surfaces`, `get_derivation_status`).
4. **Deploy** so production Observatory receives R-002 first-load fixes *and* D-025 manifest alignment in one HEAD.

**Exit criterion:** `git rev-parse HEAD` = `origin/main`; live MCP tools match repo; Calculus page imports manifest.

### Phase 1 — Documentation deduplication (read-only tree cleanup)

1. Archive superseded reports to `docs/reports/archive/2026-07-observatory-delivery/` (D-020*, D-021.1–3, D-021.5, FABLE).
2. Add banner to S-001: *"Archived characterisation — see `public-surface-manifest.mjs` and SUBMISSION-001."*
3. Merge REPOSITORY_VERIFICATION facts into PROJECT_STATUS; retire or stub REPOSITORY_VERIFICATION.
4. Update MISSION.md, `member/README.md`, DELIVERY_PLAN surface vocabulary.
5. Add `docs/reports/INDEX.md` (generated or hand-curated once).

**Exit criterion:** New contributor reads README + PROJECT_STATUS + manifest only for programme shape.

### Phase 2 — Platform simplification (small code removals)

1. Remove `/submission` and `/submission-001` routes (301 → `/proof` if needed).
2. Extract `renderNav()` in worker from manifest.
3. Fold `get_ai_entry_protocol` into session response; document deprecation.
4. Fix or remove `Deploy Main Website.command` and Garden backup stanza.
5. Delete orphan Cloudflare workers after sign-off.

**Exit criterion:** Fewer routes, fewer MCP doors, one deploy script path.

### Phase 3 — Schema and ops honesty

1. Plan `garden_config` → `atlas_config` migration (D1 migration script).
2. Wire `sync:d1` to update version label or stop displaying stale label.
3. Restore `atlas-doctor.mjs` **or** remove pre-commit reference entirely.
4. Evaluate CI D1 sync (optional; policy decision).

**Exit criterion:** Version label matches entry data; hooks honest; no `garden_*` in active read paths.

### Phase 4 — Worker decomposition (only if Phase 0–3 insufficient)

1. Split `main-website-worker.js` into route handlers + client bundle **only** if manifest extraction does not shrink enough.
2. Prefer **data → HTML** over **file → file** splits.

**Exit criterion:** Worker < 2,500 lines or manifest-driven pages > 50% of programme HTML.

---

## 8. Verification of prior commissions (sample)

| Commission | Claim | Verified? | Notes |
|---|---|---|---|
| D-021.5 | Four public surfaces | **Superseded** | D-024 added Calculus same day |
| D-024 | Five surfaces + `/calculus` | **Live** | HTTP 200 |
| D-025 | One manifest, two readers | **On origin/main + production MCP** | **Not in local HEAD** |
| D-026 | Icon-free nav | **Live** | No emoji in HTML probes |
| R-001 | NOT READY (67%) | **Partially obsolete** | GitHub now public; doc drift partially fixed in uncommitted R-002 |
| R-002 | MCP `get_public_programme` | **Conflicts with D-025** | Should not merge as-is |
| D-020C/D-021.4-R | First-load empty | **Partially live** | API healthy; R-002 UX not deployed |
| D-013 | Orphan workers | **Still true** | Not deleted |
| C005 | D1 schema open | **Still open** | COMMISSIONS register |

---

## 9. Coherence score (elegance lens)

| Domain | Score | Note |
|---|---:|---|
| Architectural spine | **88%** | Constitution, Atlas source, structure contract, generated D1 |
| Public product | **82%** | Five surfaces live; nav coherent |
| Single programme truth | **45%** | Three competing orientation layers |
| Documentation | **52%** | Excellent evidence; poor currency density |
| Runtime / deploy | **68%** | CI works; manual D1; hazardous local script |
| Naming | **60%** | Public rename incomplete in infra + stale docs |
| MCP | **72%** on production | D-025 good; session tool overlap remains |
| **Overall elegance** | **65%** | Strong programme carrying excess description |

---

## 10. Closing judgment

Reality Mechanics has reached **public release** with a legitimate five-surface instrument. The programme does not need more surfaces, tools, or reports — it needs **fewer authorities**.

The strongest next move is not R-002's parallel orientation module but **finishing D-025's consolidation**: one manifest, two readers, archived superseded evidence, retired duplicate routes, and honest ops tooling.

> The highest quality architecture usually contains fewer moving parts.

That standard implies: **merge to `origin/main`, delete the fork, archive the superseded, generate the repeated.**

---

## Appendix — Live probes (2026-07-06)

| Probe | Result |
|---|---|
| `realitymechanics.nz/field` | 200 |
| `realitymechanics.nz/theory` | 200 |
| `realitymechanics.nz/proof` | 200 |
| `realitymechanics.nz/calculus` | 200 |
| `calibration.realitymechanics.nz/` | 200 |
| `github.com/reubenmunro/reality-mechanics` | 200 (public) |
| MCP `tools/list` | 17 tools; includes `get_public_surfaces`, `get_derivation_status` |
| MCP GET `/` version | 2.4.0 |
| `/api/field/states` | 490 states; `atlasVersion: 2026.07.03-i983` |
| Local `HEAD` vs `origin/main` | `083086c` behind `a094565` (D-025) |

---

*R-003 complete. No implementation performed. Report is the deliverable.*
