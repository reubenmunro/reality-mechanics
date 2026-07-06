# FABLE — Repository State Finding

**Programme:** Stewardship / Documentation
**Type:** Repository investigation (read-only)
**Date:** 2026-07-06 (UTC+12)
**Investigated at:** `main` @ `bf772fa` — *Strip public site to Observatory, Pulse, Theory, and Proof (D-021.5)* — committed 2026-07-06 00:37 +1200, equal to `origin/main` at time of inspection.

No repository files were edited during this investigation. This report is the only artefact produced.

---

## 1. Current repository state

### 1.1 Public website surfaces and routes

The Field worker (`.atlas-publisher/main-website-worker.js`, worker `super-frost-d434`, route `realitymechanics.nz`) serves exactly these routes (`handleRequest`, lines ~3234–3264):

| Route | Surface |
|---|---|
| `/`, `/field` | Observatory (whole-field canvas) |
| `/theory` | Theory page (links to canonical GitHub docs) |
| `/proof`, `/submission`, `/submission-001` | Proof page |
| `/api/field/states` | Observatory API |
| `/api/field/behaviour-trace` | Mechanics trace API |
| `/member`, `/bench`, `/calibration` | 302 → `calibration.realitymechanics.nz` |
| `/robots.txt` | Meta |
| everything else | **410** — "Reality Mechanics exposes Observatory, Pulse, Theory, and Proof only." |

The Pulse worker (`member/src/index.js`, worker `reality-mechanics-calibration`, route `calibration.realitymechanics.nz`) serves `/` (Pulse cardiogram HTML) and `/api/health` only. The Calibration Engine public API (`/api/calibration/engine`) was removed in D-021.5; `member/src/calibration-engine.mjs` remains in-repo for tests.

**Live verification (2026-07-06, cache-busted fetches):**

- `realitymechanics.nz/field` serves the current Observatory page (title *Observatory · Reality Mechanics*, four-item nav).
- `realitymechanics.nz/theory` serves the new Theory page.
- `calibration.realitymechanics.nz/` serves the current Pulse page (title *Pulse · Reality Mechanics*).

**Both workers are running D-021.5 code. The push-to-main deploy pipeline worked.**

Caveat: non-cache-busted fetches of `/`, `/field`, and the Pulse root returned **old** HTML (pre-D-021 "Field / Atlas / Garden" nav; old "Reasoning Calibration" page). Current `HTML_HEADERS` sets `Cache-Control: no-cache` (`main-website-worker.js:33`), so this is most likely intermediary/fetch-tool caching of responses served before that header existed — but it means some clients may still see retired surfaces for a while. See §7.

### 1.2 Atlas source structure

- `Reality_Mechanics/` holds **492 markdown files** (counted directly), organised `1_First` / `2_Second` (implied) / `3_Third` (Domains, Fields, Placement Modes, Path Reads, Applied Diagnosis) / `4_Practice` / `5_Higher`, plus foundation notes.
- Authoring constraint: `Reality_Mechanics/Common Term Structure.md` (frontmatter grammar: `condition_key`, `needs`, `conditions.{places,holds,pairs,traces,nests,reads,carries}`, `publish`, `status`; wikilinks perform structural work).
- Runtime contract: `atlas-structure-contract.mjs` (version `2026-06-30.ratio-reading-order` per `PROJECT_STATUS.md`).
- No commits have touched `Reality_Mechanics/` since `ac33c59` (the D-018/D-019 sync point): `git log ac33c59..HEAD -- Reality_Mechanics/` is empty. **Atlas source and D1 are therefore currently in step.**

### 1.3 D1 / MCP / website read path

- Both Field and MCP workers bind `atlas-d1` (id `ffc9622e-…`) as `ATLAS_DB` read-only (`.atlas-publisher/wrangler.toml`, `reality-mechanics-mcp/wrangler.toml`). Pulse has no D1 binding (`member/wrangler.toml`).
- D1 is generated from the repo by `.atlas-publisher/sync-d1-from-repo.mjs`; sync is **manual** (`npm --prefix .atlas-publisher run sync:d1 -- --apply`) and not in CI. Last applied sync: D-019, 2026-07-05 — 492 queries, 3431 rows (`docs/reports/D-019-atlas-website-sync-deployment.md`).
- MCP worker (`reality-mechanics-mcp/src/index.js`, server `reality-mechanics-atlas` v2.3.0) exposes **15 read-only tools** (begin_atlas_session … translate_reason). Unchanged by D-021.5.
- D1 is explicitly **not an editing surface** (`README.md`, `PROJECT_STATUS.md`, `.atlas-publisher/LOCAL_SOURCE_POLICY.md`). Nothing found that contradicts this; the read path is GitHub → generated SQL → D1 → Field/MCP.

### 1.4 Deployment

`.github/workflows/deploy.yml`: push to `main` on worker paths (`.atlas-publisher/**`, `member/**`, `reality-mechanics-mcp/**`, contract/maturity files, the workflow itself) → secret preflight → test + deploy Field, Calibration, MCP via `npx wrangler deploy`. PRs test only. `Reality_Mechanics/**` changes trigger **nothing** — Atlas publishing is the manual D1 sync. Root `.command` scripts provide the local path.

---

## 2. Documentation accuracy

### 2.1 README.md — stale, now misleading

- Names the surfaces **Field / Calibration / MCP** and never mentions Observatory, Pulse, Theory, or Proof — the naming that D-021.1 established and D-021.5 shipped (live nav is Observatory · Pulse · Theory · Proof).
- States "Retired public surfaces such as Garden, standalone Atlas pages, **Theory**, Ark … are not part of the active product" (`README.md:10`). This now **contradicts** the live `/theory` route and the D-021.5 report ("Routes retained: `/theory` — Theory"). The sentence was true of the *old GitHub-direct Theory shortcut*, but as written it denies a live public surface.
- The Atlas source-of-truth section (GitHub canonical, D1 generated, sync steps) remains **accurate**.

### 2.2 PROJECT_STATUS.md — stale by six commits

- "Git: `main` @ `83170b8` … D-020A/B Field Worker live (2026-07-05)" (`PROJECT_STATUS.md:23`). Actual HEAD is `bf772fa`; the entire D-021 series (021.1–021.5: nav rename, Observatory landing, Pulse identity, instrument contract, render blocker, strip-back) is absent.
- "D-020A/B Field Worker changes **ready for deploy**" (`PROJECT_STATUS.md:20`) — deployed and since superseded.
- Surfaces table still labels the public surfaces Field / Calibration only; no `/theory`, `/proof` routes; Calibration not identified as Pulse.
- Still accurate: operational model (three layers), D1-not-an-editing-surface, known unknowns (`atlas-doctor.mjs` missing, `structural-mechanics-migration` branch undocumented, `garden_config.atlas_version` label stale).

### 2.3 docs/deployment/CLOUDFLARE_SURFACE_MAP.md — stale

"Last verified 2026-07-05, HEAD `9550d0f`" — 11 commits behind. Retired-route 410 message quoted as "*Field and Calibration only*" (now "*Observatory, Pulse, Theory, and Proof only*"); `/theory` and `/proof` routes absent; Calibration section predates Pulse branding and engine-API removal.

### 2.4 Current and healthy

- `docs/practice/COMMISSIONS.md` — up to date through D-021.5 (all D-series Resolved; operational **C005 remains Open**: D1 schema and non-entries recovery path).
- `docs/reports/D-021.*` — internally consistent with worker code and live site.
- `docs/stewardship/*` — self-consistent; `STEWARDSHIP_V1.md` authoritative; `OPEN_QUESTIONS.md` cleanly separated (see §5).
- `REPOSITORY_VERIFICATION.md` — COMPLETE status still holds (pipeline re-demonstrated by today's live D-021.5 deploy), though its evidence list stops at D-020A/B.
- `MISSION.md`, `Common Term Structure.md` — stable, no conflicts found.

---

## 3. Latest commission reports

The most recent programme is **D-021 (Public Structure)**, closed today:

| Report | Delivered |
|---|---|
| D-021.1-navigation.md | Nav rename → Observatory · Pulse · Theory · Proof |
| D-021.2-observatory-landing.md | Landing orientation before Field observation |
| D-021.3-pulse-identity.md | Calibration confirmed as first Pulse instrument |
| D-021.4-pulse-instrument-contract.md | Eight-clause instrument contract C1–C8 |
| D-021.4-observatory-render-blocker.md | Home nodes + whole-field visibility fix |
| D-021.5-public-website-strip-back.md | Four-surface public site; Pulse simplification; `/theory`; Proof reframe; tests 53/53 + member pass |

---

## 4. Open stewardship questions (docs/stewardship/OPEN_QUESTIONS.md)

- **Confirmed gap:** Second Order has no order-level terminal marker — do **not** invent one.
- **Pressure:** collapse-preventing-dependency pattern (2 instances; watch for a third); one-dependency sufficiency residue in every tested compound (3 instances; revisit at a fourth); crossing-architecture non-uniformity across orders.
- **Future investigations:** Interposed Carrier's "carrying" language (test independently, not by resemblance); whether the Places→Term carving pattern recurs beyond Carry/Trace; whether Second Order's accumulative character is binary or a spectrum.

Operational open item: commission **C005** (D1 schema + non-entries recovery characterisation) in `COMMISSIONS.md`.

---

## 5. What appears live / current

- Worker code at `bf772fa` deployed on both public workers (verified §1.1).
- D1 entries current with Atlas source (no Atlas commits since the D-019 sync).
- MCP surface (15 tools, v2.3.0) unchanged and consistent with the surface map's tool count.
- CI deploy pipeline functioning (today's push deployed).
- `COMMISSIONS.md`, D-021.x reports, stewardship corpus.

## 6. What should not be touched yet

- **Atlas source (`Reality_Mechanics/`)** — no evidence-backed reason; any term work must go through Common Term Structure + stewardship method.
- **Stewardship docs** — `OPEN_QUESTIONS.md` carries explicit do-not-resolve instructions; no new evidence gathered here.
- **Worker code** — shipped today, live-verified, tests green; no defect found.
- **D1** — not an editing surface; currently in step with source.
- **`garden_config.atlas_version` label and sync-script behaviour** — a real gap, but changing sync behaviour is runtime work needing its own commission (and touches C005 territory), not a documentation patch.
- **`.githooks/pre-commit` / missing `atlas-doctor.mjs`** — the hook as written would block every commit if installed (missing script → non-zero exit). Restoring or rewriting atlas-doctor is authoring-adjacent tooling work; document it, don't improvise it.

## 7. Risks / unknowns

1. **Stale cached public HTML.** Old "Field/Atlas/Garden" and "Reasoning Calibration" pages were still returned by plain fetches of `/`, `/field`, and Pulse root today. Probably intermediary caching predating the current `no-cache` header; unknown horizon. Worth a follow-up check from a clean client; not fixable by repo edit.
2. **Manual D1 sync.** Any future Atlas commit silently diverges Field/MCP from GitHub until someone runs the sync. Known and documented, but remains the biggest sync risk.
3. **Version label lag.** D1 `garden_config.atlas_version` = `2026.07.03-i983` while entries are from 2026-07-05 — retraceability of "which Atlas is live" rests on reports, not the label.
4. **Entry-count discrepancy (minor, unexplained).** 492 Atlas files; D-019 sync wrote 492 queries / 3431 rows; surface map records **490** D1 entry rows. Plausibly two non-entry or unpublished files, but no document states which. Small, worth pinning down during C005.
5. **`origin/structural-mechanics-migration`** branch exists, purpose undocumented (confirmed via `git branch -a`).
6. **atlas-doctor.mjs missing** while referenced by `.githooks/pre-commit` (and an `atlas-core.mjs` comment).
7. This investigation used a fresh clone at `~/Claude/Projects/RM`; a second working clone exists at `~/Reality_Mechanics_Workspace/reality-mechanics`. Both tracked `bf772fa` today, but two local clones are a standing drift hazard for local-command workflows.

## 8. Recommended next patches

**First patch — README.md surface alignment (smallest, highest-leverage, zero runtime risk).**
Update the surface list to the four public surfaces (Observatory `/` `/field`, Pulse `calibration.…`, Theory `/theory`, Proof `/proof` `/submission`) plus MCP; fix the retired-surfaces sentence so it no longer denies the live Theory page (retire "GitHub-direct Theory nav", not "Theory"). Leave the Atlas source-of-truth and deploy sections as-is — they are correct. Evidence base: D-021.5 report + `handleRequest` route table + live checks (§1.1).

**Second patch — PROJECT_STATUS.md refresh.**
Move the Git pointer to `bf772fa`; record the D-021 programme (021.1–021.5) in state and Active Investigations; rename surfaces in the platform table (Field→Observatory, Calibration→Pulse) with the new routes; replace "ready for deploy" with "deployed + live-verified 2026-07-06". Keep Known Unknowns, adding the 490-vs-492 entry-count question.

**Third (after the above): docs/deployment/CLOUDFLARE_SURFACE_MAP.md re-verification** against live Cloudflare state — new 410 message, `/theory` `/proof` routes, Pulse worker description, engine-API removal. Best done as its own small verification pass since the document's value is its "last verified" claim.

---

*Report produced from direct inspection of `main` @ `bf772fa` and live-site probes on 2026-07-06. No repository files other than this report were created or modified.*
