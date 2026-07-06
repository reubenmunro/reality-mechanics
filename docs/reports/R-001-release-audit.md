# R-001 — Reality Mechanics Release Audit

**Programme:** Release  
**Type:** Architectural audit (read-only)  
**Date:** 2026-07-06 (UTC+12)  
**Repository HEAD audited:** `083086c`  
**Auditor stance:** Independent practical completion review — no implementation performed.

---

## Executive summary

Reality Mechanics has a **coherent architectural spine** and a **live five-surface public product** (Observatory · Pulse · Theory · Proof · Calculus) backed by **116 automated tests** and **53 persisted evidence reports**. The programme is structurally serious.

It is **not ready for public release** in the sense this audit defines: an independent participant encountering the system for the first time can use the website, but **cannot retrace claims through GitHub** (repository returns 404 anonymously), **will likely perceive the Observatory as empty or broken on first load**, and **will be misled by root documentation** that still describes a three-surface Field/Calibration product with Theory retired.

The highest-risk failures are not missing features. They are **trust fractures**: private repository vs public retrace claims, documentation drift vs live product, and Observatory first-impression legibility.

**Verdict: NOT READY FOR PUBLIC RELEASE**

Justification: public surfaces work; public *programme integrity* does not yet hold end-to-end for an unauthenticated first-time visitor.

---

## Release readiness scores

| Domain | Score | Summary |
|---|---:|---|
| Repository | **70%** | Sound layout and evidence chain; stale root docs and hygiene gaps |
| Website | **76%** | Five surfaces live; nav and routing coherent; outbound GitHub links fail |
| Observatory | **58%** | API healthy; first-load perception is the weakest public surface |
| MCP | **68%** | Strong Atlas traversal; weak public-programme orientation |
| Documentation | **55%** | Excellent commission reports; poor root-doc currency |
| Deployment | **74%** | CI deploys three workers; D1 sync manual; operational hazards remain |
| Retraceability | **65%** | Strong internal reports; public retrace path broken at GitHub |

**Overall programme readiness: 67%**

**Overall verdict: NOT READY FOR PUBLIC RELEASE**

---

## 1. Repository health

### Structure

| Layer | Location | State |
|---|---|---|
| Atlas source | `Reality_Mechanics/` (~492 markdown files) | Canonical in GitHub workflow |
| Platform — Field/Observatory | `.atlas-publisher/` | Active; worker `super-frost-d434` |
| Platform — Pulse | `member/` | Active; worker `reality-mechanics-calibration` |
| Platform — MCP | `reality-mechanics-mcp/` | Active; 15 tools |
| Stewardship | `docs/stewardship/` | Method stabilised; partial coverage |
| Evidence | `docs/reports/` (53 reports) | Strong commission traceability |
| Practice | `docs/practice/COMMISSIONS.md` | Current through D-026 |

Three-layer model (Atlas → Stewardship → Platform) is consistently expressed in governance docs and matches implementation.

### Strengths

- Commission register (`docs/practice/COMMISSIONS.md`) accurately records D-021 through D-026 programme closure.
- `atlas-structure-contract.mjs` provides a shared contract across Field and MCP.
- Test suites pass at audit time: **71** (atlas-publisher) + **18** (member) + **27** (MCP) = **116**.
- No committed `.env` files or hardcoded production API keys found in application code.
- Retired routes intentionally return **410** with a five-surface message.

### Weaknesses

| Issue | Severity | Detail |
|---|---|---|
| Root doc drift | **High** | `README.md`, `PROJECT_STATUS.md`, `DELIVERY_PLAN.md`, `REPOSITORY_VERIFICATION.md` lag live product by six+ commissions |
| Naming split | **Medium** | Docs say Field/Calibration; live UI says Observatory/Pulse |
| Missing `atlas-doctor.mjs` | **Medium** | Referenced by `.githooks/pre-commit` and `atlas-core.mjs`; file absent |
| Untracked lockfile | **Low** | `.atlas-publisher/package-lock.json` untracked |
| Stale version label | **Medium** | `garden_config.atlas_version` = `2026.07.03-i983` while entries current |
| Entry count ambiguity | **Low** | 492 Atlas files vs 490 D1/API states — unexplained in root docs |
| Open commission C005 | **Medium** | D1 schema and non-entries recovery path uncharacterised |
| Orphan remote branch | **Low** | `origin/structural-mechanics-migration` undocumented |

### Repository hygiene

- `Deploy Main Website.command` can deploy Field **without** D1 binding — diverges from CI (`docs/deployment/CLOUDFLARE_SURFACE_MAP.md`, D-013).
- Garden-era Cloudflare workers remain as orphans (documented, not blocking runtime).
- `Reality_Mechanics/.obsidian/plugins/` contains large third-party bundles (local tooling; not deployed).

---

## 2. Website health

### Live verification (2026-07-06)

| URL | Status | Notes |
|---|---|---|
| `https://realitymechanics.nz/` | **200** | Same as `/field` (Observatory root) |
| `https://realitymechanics.nz/field` | **200** | ~133 KB HTML; canvas + bootstrap present |
| `https://realitymechanics.nz/api/field/states` | **200** | 490 states; `atlasVersion: 2026.07.03-i983`; latency **1–4s** |
| `https://realitymechanics.nz/theory` | **200** | Expanded Theory page (D-023) |
| `https://realitymechanics.nz/proof` | **200** | Retrace pathway |
| `https://realitymechanics.nz/calculus` | **200** | Derivation surface (D-024) |
| `https://calibration.realitymechanics.nz/` | **200** | Pulse cardiogram |
| `https://calibration.realitymechanics.nz/api/health` | **200** | Mechanical runtime |
| `https://mcp.realitymechanics.nz/` | **200** | MCP manifest v2.4.0 |
| `/atlas`, `/garden` | **410** | Correct retirement message |
| `/member`, `/calibration` | **302** | → Pulse subdomain |

### Navigation

Five surfaces linked on all checked pages: **Observatory · Pulse · Theory · Proof · Calculus**. D-026 removed emoji icons; text-only quiet nav. Observatory uses centered `#access-row`; document pages use fixed header — intentional but not fully unified.

### Visual consistency (D-026)

Typography-led hierarchy, reduced card chrome, ember used sparingly. Theory reads as essay; Proof as archival record; Calculus as laboratory notebook; Pulse as open instrument. Coherent instrument language across surfaces.

### Broken / weak links

| Target | Issue |
|---|---|
| `github.com/reubenmunro/reality-mechanics/...` | **HTTP 404** for anonymous requests — repository appears **private** |
| Theory / Proof / Calculus pages | 22+ canonical GitHub links; structurally correct in repo, **publicly unreachable** |
| Proof page `.../blob/main/Reality_Mechanics` | Directory link, not a file |
| Proof page `.../blob/main/docs/reports` | Directory link |

**Critical:** The public website claims retraceability through GitHub while the repository is not publicly accessible.

### Responsiveness

Observatory CSS includes `@media (max-width: 700px)` breakpoints. Order legend hidden on small viewports. No dedicated mobile audit performed; no catastrophic layout failures observed in HTML structure.

### User flow (first-time visitor)

1. Lands on Observatory (`/` = `/field`).
2. Sees landing copy + (after API load) neutral term sheet open on the right.
3. Canvas may appear dark/empty during API wait and after load.
4. Can navigate to Theory/Proof/Calculus/Pulse via quiet nav.
5. Cannot follow GitHub evidence links without repository access.

Flow is **intellectually coherent** but **perceptually fragile** at step 3.

---

## 3. Observatory assessment

### Why the field currently appears empty

**Live API is healthy** (490 states). Empty appearance is not primarily a data outage. It is a **composition of intentional design choices and UX gaps**:

#### A. Bootstrap loading gap (defect-class UX)

`bootstrap()` **awaits** `fetch('/api/field/states')` before `requestAnimationFrame(loop)`. During **1–4 seconds** of API latency, no draw loop runs. Loading indicator is suppressed (`#top { display: none; }`). User sees static dark gradient only.

```3089:3138:.atlas-publisher/main-website-worker.js
async function bootstrap() {
  modeEl.textContent = 'loading';
  try {
    const statesRes = await fetch('/api/field/states');
    // ... populate allOps ...
  } catch(err) { /* allOps may stay {} */ }
  if (!explicitTermId) {
    homeMode = true;
    renderNeutralSheet();
    openTermSheet();
    requestAnimationFrame(loop);
    return;
  }
}
```

#### B. Neutral home + open sheet (intentional, high friction)

Default path (no hash deep-link): `homeMode = true`, `operations = {}`, **`openTermSheet()` immediately**. Right panel says *"Select a place in the field to observe its structure."* Landing block remains until dismissed. Canvas and sheet compete for attention; canvas loses.

This follows D-021.2 (orient before observe) and D-021.4 (neutral whole-field open). It conflicts with D-026 goal (*enter an observatory, not software*).

#### C. Subtle home-field rendering (intentional, borderline)

`drawHomeField` / `drawHomeNode` use **low alpha** strokes and glows (D-022 legibility floors). On many displays the 490-term home field reads as void even when data is loaded.

#### D. Fetch failure path (hard defect)

If `/api/field/states` fails, `allOps` stays `{}`, `drawHomeField` returns immediately when empty, and loop may run with nothing to draw. No user-visible error surface beyond `console.error`.

### Classification

| Factor | Expected or defect? |
|---|---|
| API wait before animation | **Defect-class UX** (no loading affordance) |
| Neutral home without default term | **Expected** (D-021.4) |
| Open term sheet on first load | **Expected** (D-021.2) but **questionable** for release |
| Low-contrast home nodes | **Expected** (D-022/D-026) but **undermines release** |
| API failure → blank canvas | **Defect** |

### Should home state contain a meaningful read?

**Yes, for public release.** The programme claims structural perception begins immediately (`MISSION.md`, Observatory landing). Current home state requires the visitor to infer that:

- the dark canvas is the field,
- the sheet is instruction not content,
- they must click nodes or search.

Structural perception does **not** begin immediately; orientation begins immediately.

### Is first interaction obvious?

**No.** Three competing entry cues: landing block (left), open sheet (right), faint canvas (center), search (bottom). No single dominant affordance. D-022 added canvas labels and order legend — helpful after data loads, not sufficient for first second.

### Recommendation (audit only — not implemented)

Before release, Observatory needs a **release-grade home state**: visible field read during bootstrap, sheet closed by default or deferred, and explicit loading/rhythm until `/api/field/states` resolves. This does not require reversing D-021 programme intent — it requires reconciling orientation with perception.

---

## 4. Atlas integration assessment

### Current state

| Aspect | State |
|---|---|
| Canonical source | `Reality_Mechanics/` in GitHub |
| Public `/atlas` route | **410 Gone** (intentional since D-021.5) |
| Public Atlas browsing | GitHub links from term panel + MCP |
| D1 | Generated read-model; 490 entries live |
| Atlas in public nav | **Absent** — correct for current programme |

### Should Atlas remain publicly navigable as a primary destination?

**No — recommendation: keep Atlas as background canonical source.**

| For | Against primary `/atlas` nav |
|---|---|
| Five-surface product is complete and tested | Duplicates Observatory's job (structure visible) |
| Proof/Calculus already retrace to reports | Atlas browser reintroduces Garden-era complexity |
| Constitution favours small public surface | Visitors confuse source editing with observation |
| D-024 established Calculus as derivation surface | Two navigation paradigms fracture instrument identity |

### Recommended public architecture

```text
Reality Mechanics (programme)
  → Observatory   (observe structure in the field)
  → Pulse         (behaviour through time)
  → Theory        (why the discipline works)
  → Proof         (retrace accepted evidence)
  → Calculus      (derivation state — unpromoted gaps shown)
  
Atlas (GitHub)    → canonical source, linked, not nav-primary
MCP               → read-only traversal for AI participants
```

**Exception:** If GitHub is made public, Atlas entry links (`View Atlas Entry` in term panel, MCP `open_source_for_entry`) become viable retrace paths. If GitHub stays private, those links must not be presented as public proof.

### Should recent Atlas-nav decisions be reversed?

**No.** Retiring `/atlas` (D-021.5) and adding `/calculus` (D-024) are structurally sound. The gap is not missing Atlas nav — it is **broken public access to Atlas source URLs**.

---

## 5. MCP assessment

### Tool inventory (15 tools)

| Tool | Purpose |
|---|---|
| `begin_atlas_session` | Session bootstrap + governance protocol |
| `get_manifest` | Entry count, atlas version |
| `get_ai_entry_protocol` | AI entry rules |
| `get_structure_contract` | Atlas structure contract |
| `search_atlas` | FTS search |
| `get_entry` | Full entry with resolved structure |
| `get_related` | Graph traversal |
| `open_source_for_entry` | GitHub edit bridge |
| `read_ratio` | Ratio read between terms |
| `get_entry_by_title` | Title lookup |
| `list_entries` | Paginated enumeration |
| `get_recent_changes` | Change feed |
| `get_field_terms` | Field enumeration |
| `find_shared_ground` | Upstream intersection |
| `translate_reason` | Field translation map |

### What MCP exposes well

- Atlas structure, entries, relations, ratios, GitHub source paths
- AI entry protocol and governance framing
- Field term enumeration (`get_field_terms`)

### What MCP does **not** expose

| Gap | Impact |
|---|---|
| **No public surface map** | AI cannot learn Observatory/Pulse/Theory/Proof/Calculus URLs from MCP alone |
| **No Mission/Constitution tools** | Governance docs not directly readable via MCP |
| **No runtime/public-route tools** | `/api/field/states`, behaviour trace, Pulse health not described |
| **No release-state tool** | Cannot query programme readiness or commission status |
| **No report index tool** | `docs/reports/` evidence chain not traversable |
| **No auth enforcement** | `Authorization` parsed but not required — public callable |
| **Zero matches** for "Observatory", "Pulse", "Theory", "Proof", "Calculus" in MCP codebase |

### MCP readiness for AI participants

**Adequate for Atlas scholarship. Inadequate for whole-programme orientation.**

An AI starting at `begin_atlas_session` understands Atlas rules but not the five public instruments, their boundaries, or what is accepted vs candidate on the website.

### Recommended MCP additions (post-audit implementation)

1. `get_public_programme` — surfaces, URLs, accepted/candidate/unresolved summary
2. `get_governance_doc` — Mission, Constitution, Runtime Principles by path
3. `list_reports` — commission evidence index
4. Optional: auth for write-adjacent tools if exposure grows

---

## 6. Deployment assessment

### Topology (verified)

| Domain | Worker | D1 | Deploy path |
|---|---|---|---|
| `realitymechanics.nz` | `super-frost-d434` | `atlas-d1` | `.atlas-publisher/` via `deploy.yml` |
| `calibration.realitymechanics.nz` | `reality-mechanics-calibration` | none | `member/` via `deploy.yml` |
| `mcp.realitymechanics.nz` | `reality-mechanics-mcp` | `atlas-d1` | `reality-mechanics-mcp/` via `deploy.yml` |

GitHub Actions deploy on push to `main` for worker paths. **Atlas markdown changes do not trigger deploy or D1 sync.**

### Confirmed public routes

**Field worker:** `/`, `/field`, `/theory`, `/proof`, `/submission`, `/submission-001`, `/calculus`, `/api/field/states`, `/api/field/behaviour-trace`, `/robots.txt`

**Pulse worker:** `/`, `/api/health`

**MCP worker:** `/`, `/mcp`

### Deployment risks

| Risk | Severity |
|---|---|
| Manual D1 sync | **High** — Atlas commits can ship without live data update |
| `CLOUDFLARE_SURFACE_MAP.md` stale | **Medium** — documents three surfaces, old 410 text |
| Local deploy script without D1 | **Medium** |
| Orphan Garden workers in Cloudflare account | **Low** |
| Worker internal name `super-frost-d434` | **Low** — ops confusion only |

Latest deploy at audit: `083086c` (D-026 merge) pushed successfully.

---

## 7. GitHub public-readiness assessment

### Repository visibility

**`https://api.github.com/repos/reubenmunro/reality-mechanics` → 404**  
**`https://github.com/reubenmunro/reality-mechanics` → 404** (anonymous)

The repository is **private** while the public website, Proof page, Theory page, Calculus page, and Submission 001 **link to it as canonical evidence**.

### Recommendation

**NOT READY TO MAKE PUBLIC** — as currently presented to the world.

Two valid release paths (choose one before launch):

| Path A | Path B |
|---|---|
| Make repository **public** | Keep repository private |
| Refresh root docs to five surfaces | Remove/replace all public GitHub links |
| Verify all outbound links | Host evidence on-site or release archive |
| Add `LICENSE`, release notes, contribution boundary | Reframe Proof as operator-attested, not publicly retraceable |

**Path A is strongly preferred** — the programme's identity is retraceable open evidence (Constitution C002, Submission 001).

### Hygiene checklist

| Item | Status |
|---|---|
| Secrets in repo | **Pass** — none found in application code |
| `.env` committed | **Pass** — none |
| Generated files policy | **Pass** — D1 sync generated; gitignored |
| Historical artefacts | **Caution** — 53 reports, some superseded naming (D-021.4 duplicate IDs) |
| Duplicated documents | **Low** — D-021.4 render blocker vs pulse contract share number |
| Obsolete reports | **Acceptable** — retained as evidence per programme rules |
| `LICENSE` | **Not verified** — not assessed in this audit |
| README accuracy | **Fail** — contradicts live product |
| Release documentation | **Fail** — no R-001 sign-off doc existed until this audit |

---

## 8. Documentation assessment

### Strong

- `docs/practice/COMMISSIONS.md` — authoritative programme register
- `docs/reports/` — 53 evidence reports with commission linkage
- `docs/CONSTITUTION.md`, `MISSION.md` — stable governance
- `docs/submissions/SUBMISSION-001-first-public-submission.md` — honest accepted/candidate/unresolved framing
- Per-commission reports D-021 through D-026 document recent product evolution

### Stale or contradictory

| Document | Problem |
|---|---|
| `README.md` | Lists Field/Calibration; says Theory retired; omits Proof, Calculus |
| `PROJECT_STATUS.md` | HEAD `83170b8`; D-020 "ready for deploy"; three surfaces only |
| `DELIVERY_PLAN.md` | Stops at D-020B |
| `REPOSITORY_VERIFICATION.md` | COMPLETE but evidence stops at D-020 |
| `docs/deployment/CLOUDFLARE_SURFACE_MAP.md` | HEAD `9550d0f`; three surfaces; old 410 message |
| `docs/submissions/SUBMISSION-001-first-public-submission.md` | Still names Field/Calibration in surface table |
| `docs/reports/FABLE-REPO-STATE-FINDING-2026-07-06.md` | Superseded same day by D-022–D-026 |

### Documentation readiness

Internal evidence chain: **strong**.  
External orientation (root docs + submission): **poor**.  
A first-time visitor reading only `README.md` and `PROJECT_STATUS.md` will misunderstand the product.

---

## 9. Top 10 issues (structural priority)

| Rank | Issue | Domain | Why structural |
|:---:|---|---|---|
| **1** | GitHub repository private while site claims public retrace | GitHub / Proof / Theory / Calculus | Violates Constitution C002 for anonymous visitors |
| **2** | Root documentation drift (README, PROJECT_STATUS, surface map) | Documentation | Misleads every onboarding path |
| **3** | Observatory first-load appears empty; sheet opens immediately | Observatory | Fails mission promise of structural perception |
| **4** | Manual D1 sync not in CI | Deployment | Atlas source and live product can diverge silently |
| **5** | MCP lacks public-programme orientation | MCP | AI cannot understand five-surface architecture from tools alone |
| **6** | Submission 001 and governance copy still use Field/Calibration | Proof / Documentation | Public identity split undermines D-021 programme |
| **7** | Bootstrap API latency (1–4s) with no loading affordance | Observatory | First impression = broken instrument |
| **8** | Open commission C005 (D1 schema recovery) | Repository | Uncharacterised data path undermines trust |
| **9** | Missing `atlas-doctor.mjs` / broken pre-commit contract | Repository hygiene | Quality gate absent if hooks enabled |
| **10** | Stale `garden_config.atlas_version` label | Deployment | Live version metadata contradicts entry freshness |

---

## 10. Recommended implementation order

*For post-audit commissions only — not executed in R-001.*

| Phase | Work | Unblocks |
|---|---|---|
| **1** | **Release decision:** public repo (Path A) or evidence hosting alternative (Path B) | All retrace claims |
| **2** | Root doc refresh: `README.md`, `PROJECT_STATUS.md`, `CLOUDFLARE_SURFACE_MAP.md`, `SUBMISSION-001` naming | First-time orientation |
| **3** | Observatory release pass: loading state, default-closed sheet, home-field legibility floor | Primary public surface |
| **4** | D1 sync release checklist or CI automation + version label fix | Data truth |
| **5** | MCP `get_public_programme` + governance doc reader | AI participant completeness |
| **6** | Resolve or document C005 | Data integrity |
| **7** | Hygiene: `atlas-doctor.mjs`, track Field lockfile, retire orphan workers | Operator confidence |
| **8** | Optional: OpenAPI or machine-readable public API spec | External integrators |

---

## 11. Decisions that should **not** be reversed

| Decision | Reason |
|---|---|
| Retire `/atlas`, `/garden`, Garden APIs (D-021.5) | Correct product boundary |
| Five public surfaces incl. `/calculus` (D-024) | Completes derivation transparency |
| Atlas as GitHub canonical source (not D1 editing) | Architecturally sound |
| Pulse = Calibration cardiogram only (D-021.5) | Clear instrument identity |
| Icon-free nav (D-026) | Matches instrument aesthetic |

## 12. Decisions under tension (review, not necessarily reverse)

| Tension | Notes |
|---|---|
| D-021.2 open sheet on load vs D-026 instrument minimalism | Sheet-on-load contributes to empty-canvas feel |
| D-022 low-alpha home field vs D-026 radiance | Legibility floors may be too low for release |
| D-022 removed smoke puffs | Correct for retraceability; reduced atmosphere — acceptable trade |

---

## 13. Tests run (audit verification)

```bash
npm --prefix .atlas-publisher test   # 71 pass
npm --prefix member test             # 18 pass
npm --prefix reality-mechanics-mcp test  # 27 pass
```

Live curl verification: all five HTML surfaces 200; `/api/field/states` 200 (490 states); `/atlas` 410; GitHub 404 anonymous.

---

## 14. Commission closure

**Status:** R-001 complete. Audit persisted; no implementation changes made.

**Verdict: NOT READY FOR PUBLIC RELEASE**

The programme is architecturally mature and operationally live. Release is blocked by **public retrace integrity** (private GitHub), **documentation truth** (stale root docs), and **Observatory first-impression legibility** (appears empty). Addressing the top three structural issues is prerequisite to calling Reality Mechanics publicly released.

**Commission R-001 closed.**
