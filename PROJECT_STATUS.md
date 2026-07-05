# Reality Mechanics — Project Status

**Repository cover sheet.** Read this first before working in the tree. This document is not Atlas content and not part of the Stewardship specification.

---

## Purpose

Tracks what the repository **is**, what is **active**, and what remains **open or unverified**. Factual and operational only — not a roadmap.

---

## Current Repository State

**At a glance**

- **Platform:** Three active public surfaces — Field, Calibration, MCP — with GitHub Actions deployment on `main`. Retired surfaces (Garden, standalone Atlas pages, Theory, Ark) are explicitly excluded (`README.md`).
- **Atlas:** 492 markdown files in `Reality_Mechanics/`; GitHub is the editable canonical source; D1 is generated from it.
- **Stewardship:** Audit method stabilised in `docs/stewardship/` (2026-07-04); 17 families / ~51 terms audited; coverage incomplete.
- **Build & deployment:** Documented paths exist; production health, D1 sync state, and pre-commit integrity tooling are **not verified from repository files alone**.

**Git:** `main` working tree clean and up to date with `origin/main` (as of last local checkout).

No repository document declares a single project phase label (Discovery, Release Candidate, etc.).

### Supporting detail

| Area | Characterisation | Evidence |
|------|----------------|----------|
| Public surfaces | Operational — intentionally small product set | `README.md` |
| Atlas source | Canonical in GitHub — 492 files | `Reality_Mechanics/`; `README.md` |
| Stewardship method | Stabilised — spec, case studies, audit log in place | Commits through 2026-07-04 on `main` |
| Stewardship coverage | In progress — ~10% of Atlas files directly audited | `docs/stewardship/AUDIT_LOG.md` |
| Live deployment & D1 sync | Unknown — requires investigation | No health snapshot or sync record in repo |

---

## Operational Model

The repository has three layers. They are related but distinct — do not edit one layer as if it were another.

```
Atlas (source)  →  Stewardship (verification)  →  Platform (translation & surfaces)
     │                        │                              │
 GitHub markdown         audit method                  Cloudflare Workers
 Reality_Mechanics/      docs/stewardship/             Field · Calibration · MCP
                              │                              │
                              └──────── same Atlas ──────────┘
                                         │
                              D1 generated read model (atlas-d1)
                              rebuilt from repository, not edited directly
```

### 1. Atlas — structural memory (source)

- **What it is:** The editable record of Reality Mechanics terms — markdown and frontmatter in `Reality_Mechanics/`.
- **Authority:** GitHub is canonical. Structure is defined in `atlas-structure-contract.mjs`; authoring constraints in `Reality_Mechanics/Common Term Structure.md`.
- **Edit path:** Change files in `Reality_Mechanics/` → commit → generate and sync D1 → platform surfaces read the generated record (`README.md`, `.atlas-publisher/LOCAL_SOURCE_POLICY.md`).
- **Do not:** Treat D1, Field display, or MCP responses as editing surfaces for Atlas terms.

### 2. Stewardship — structural verification (method)

- **What it is:** A recovered audit method that verifies existing Atlas structure against itself. It does not author new terms or mechanics.
- **Authority:** `docs/stewardship/STEWARDSHIP_V1.md`. AI stewards read `docs/stewardship/CURSOR.md` first.
- **Scope:** Family-by-family audits; two repair types only (dependency supplementation, Pairs-field language correction). History in `docs/stewardship/AUDIT_LOG.md`; open items in `docs/stewardship/OPEN_QUESTIONS.md`.
- **Do not:** Confuse stewardship invariants (`docs/stewardship/ATLAS_INVARIANTS.md`) with Atlas Practice content (`Reality_Mechanics/INVARIANTS.md`).

### 3. Platform — public translation (surfaces)

- **What it is:** Workers that **read** Atlas structure through generated D1 (or, for Calibration, demonstrate mechanics without Atlas mutation).
- **Active surfaces:**

  | Surface | URL | Code | Reads Atlas? |
  |---------|-----|------|--------------|
  | **Field** | `realitymechanics.nz` | `.atlas-publisher/` | Yes — D1-bound |
  | **Calibration** | `calibration.realitymechanics.nz` | `member/` | No — standalone mechanical demo |
  | **MCP** | `mcp.realitymechanics.nz` | `reality-mechanics-mcp/` | Yes — read-only, D1-bound |

- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) on push to `main` for worker paths; local `.command` scripts at repository root. Atlas file changes do **not** trigger CI deploy or D1 sync.

---

## Active Investigations

Open work recorded in repository documents — not a priority backlog.

| Investigation | Status | Record |
|---------------|--------|--------|
| **Build & deployment verification** | Unverified — production health, D1 sync, missing `atlas-doctor.mjs` | Known Unknowns (below); Next Investigation |
| **Maintained Coupling dependency gap** | Resolved — `[[Compatibility]]` committed to needs/holds/traces (E1) | `docs/stewardship/AUDIT_LOG.md` — Dependency Repairs (Committed); source file `Reality_Mechanics/3_Third/Fields/Relational Participation/Bearing Relations/Maintained Coupling.md` |
| **Interposed Carrier `"carrying"` language** | Open — insufficient evidence either direction | `docs/stewardship/OPEN_QUESTIONS.md`; `AUDIT_LOG.md` Confirmed Non-Repairs |
| **Stewardship coverage gap** | ~51 of 492 Atlas files audited; no queue of remaining families | `docs/stewardship/AUDIT_LOG.md`; method in `docs/stewardship/README.md` |
| **`structural-mechanics-migration` branch** | Remote branch exists; purpose relative to `main` undocumented | `git branch -a` |

---

## Next Investigation

**Repository Build & Deployment Verification**

Repository evidence shows several operational facts are documented but **not verified** from files alone:

- Production Worker health (`calibration.realitymechanics.nz/api/health` documented in `member/DEPLOYMENT.md`; no stored snapshot).
- Whether D1 (`atlas-d1`) matches current `main` Atlas source (sync is manual; no committed sync-state).
- Whether `.githooks/pre-commit` can run — it references `.atlas-publisher/atlas-doctor.mjs`, which is **absent from the repository tree**.
- Whether CI deploy secrets and paths cover the intended surfaces (`deploy.yml` does not run on `Reality_Mechanics/**` changes).

Confirming build, test, sync, and deploy paths work end-to-end is higher-leverage for any new contributor than a single Atlas term investigation. Stewardship open items remain recorded above and in `docs/stewardship/`.

**Suggested checks (from repository docs):**

```bash
npm --prefix .atlas-publisher test
npm --prefix member test
npm --prefix reality-mechanics-mcp test
npm --prefix .atlas-publisher run sync:d1          # dry run
npm --prefix .atlas-publisher run sync:d1 -- --apply   # apply only when intended
```

---

## Known Unknowns

| Question | Why unknown |
|----------|-------------|
| Are production Workers deployed and healthy? | No deployment timestamp or health snapshot in repository |
| Is D1 in sync with current `main`? | Sync output generated locally; no committed sync-state |
| Where is `atlas-doctor.mjs`? | Referenced by `.githooks/pre-commit` and `atlas-core.mjs` comment; file absent |
| Which Atlas families to audit next? | `AUDIT_LOG.md` lists completed families only |
| Status of `origin/structural-mechanics-migration` | Not documented in root docs |
| Whether pre-commit hooks are installed locally | Hooks in `.githooks/`; requires manual `git config core.hooksPath` |

---

## Canonical Sources

| Domain | Location | Notes |
|--------|----------|-------|
| Atlas (editable) | `Reality_Mechanics/` | GitHub canonical (`README.md`, `atlas-structure-contract.mjs`) |
| Atlas (authoring constraint) | `Reality_Mechanics/Common Term Structure.md` | |
| Atlas (runtime contract) | `atlas-structure-contract.mjs` | Version `2026-06-30.ratio-reading-order` |
| Stewardship | `docs/stewardship/STEWARDSHIP_V1.md` | Entry: `docs/stewardship/README.md`; AI: `docs/stewardship/CURSOR.md` |
| Field | `.atlas-publisher/main-website-worker.js` | Worker `super-frost-d434`; `realitymechanics.nz` |
| Calibration | `member/src/index.js` | `member/README.md`, `member/DEPLOYMENT.md` |
| MCP | `reality-mechanics-mcp/src/index.js` | Read-only traversal |
| Deployment (CI) | `.github/workflows/deploy.yml` | Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| Deployment (local) | `Deploy Main Website.command`, `Deploy MCP Worker.command`, `Sync Atlas D1 from GitHub.command`, `Backup to GitHub.command` | Root-level macOS scripts |
| Generated (D1) | `.atlas-publisher/sync-d1-from-repo.mjs` → `.atlas-publisher/generated/atlas-d1-sync.sql` | Policy: `.atlas-publisher/LOCAL_SOURCE_POLICY.md` |
| Field maturity | `field-maturity.mjs` | Derived at read time from D1 |

---

## Repository Components

| Component | Status | Notes |
|-----------|--------|-------|
| **Atlas** | Active source; 492 files | Pre-commit references missing `atlas-doctor.mjs` |
| **Stewardship** | Method stabilised; audit partial | Zero method failures; one outstanding proposal |
| **Field** | Active surface | D1-bound; `npm --prefix .atlas-publisher test` |
| **Calibration** | Active surface | No D1/MCP/AI; `npm --prefix member test` |
| **MCP** | Active surface | Read-only, D1-bound; `npm --prefix reality-mechanics-mcp test` |
| **Build / sync** | Present | `sync-d1-from-repo.mjs`; refuses dirty `Reality_Mechanics/` by default |
| **Deployment** | CI + local scripts | `deploy.yml` excludes `Reality_Mechanics/**` from triggers |
| **Automation** | Partial | Pre-commit + GitHub Actions; atlas-doctor missing |
| **Retired** | Excluded | Garden, standalone Atlas pages, Theory, Ark (`README.md`) |

---

## Maintenance

Update this document when operational facts change. Keep it factual — never a roadmap or planning backlog.
