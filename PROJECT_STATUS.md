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
- **Build & deployment:** Workers verified live (D-003); D1 entry read-model synchronised (D-004). `garden_config.atlas_version` label still stale; `atlas-doctor.mjs` missing.
- **Structural reading:** Whole Atlas calibrated (D-008); backlog `docs/practice/STRUCTURAL_READING_BACKLOG.md`; Connection prose refined and synced (D-006).

**Git:** `main` working tree clean and up to date with `origin/main` (as of D-004, 2026-07-05).

No repository document declares a single project phase label (Discovery, Release Candidate, etc.).

### Supporting detail

| Area | Characterisation | Evidence |
|------|----------------|----------|
| Public surfaces | Operational — intentionally small product set | `README.md` |
| Atlas source | Canonical in GitHub — 492 files | `Reality_Mechanics/`; `README.md` |
| Stewardship method | Stabilised — spec, case studies, audit log in place | Commits through 2026-07-04 on `main` |
| Stewardship coverage | In progress — ~10% of Atlas files directly audited | `docs/stewardship/AUDIT_LOG.md` |
| Live deployment & D1 sync | **Verified** — Workers current (D-003); D1 entries synced 2026-07-05 (D-004); version label `2026.07.03-i983` unchanged | `docs/reports/D-003-deployment-verification.md`; `docs/reports/D-004-d1-sync-read-model-verification.md` |

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
| **Build & deployment verification** | **Resolved** — D-003 audit + D-004 D1 sync repair | `REPOSITORY_VERIFICATION.md` (COMPLETE); `docs/reports/D-003-…`; `docs/reports/D-004-…` |
| **Structural reading / Atlas prose calibration** | **D-008 complete** — 424 terms characterised; 67 Class A backlog; 0 ontology promotions | `docs/practice/STRUCTURAL_READING_BACKLOG.md`; `docs/reports/D-008-whole-atlas-calibration.md`; `docs/reports/D-008-term-register.md` |
| **Maintained Coupling dependency gap** | Resolved — live in D1 after D-004 | `AUDIT_LOG.md`; Field/MCP verified `second.compatibility` in holds/traces |
| **Interposed Carrier `"carrying"` language** | Open — insufficient evidence either direction | `docs/stewardship/OPEN_QUESTIONS.md`; `AUDIT_LOG.md` Confirmed Non-Repairs |
| **Stewardship coverage gap** | ~51 of 492 Atlas files audited; no queue of remaining families | `docs/stewardship/AUDIT_LOG.md`; method in `docs/stewardship/README.md` |
| **`structural-mechanics-migration` branch** | Remote branch exists; purpose relative to `main` undocumented | `git branch -a` |

---

## Next Investigation

**D1 sync after Atlas prose commit**

Connection opening prose was refined through structural reading (D-006). Apply D1 sync before Field/MCP serve the updated text.

**D1 sync automation + version metadata**

D-004 restored entry-level synchronisation. Remaining operational gaps:

- `garden_config.atlas_version` is not updated by `sync-d1-from-repo.mjs` (Field still reports `2026.07.03-i983` while entries are current).
- D1 sync remains manual — not in `.github/workflows/deploy.yml`.
- `.githooks/pre-commit` references missing `atlas-doctor.mjs`.

Stewardship open items remain in `docs/stewardship/OPEN_QUESTIONS.md`.

---

## Known Unknowns

| Question | Why unknown |
|----------|-------------|
| Where is `atlas-doctor.mjs`? | Referenced by `.githooks/pre-commit` and `atlas-core.mjs` comment; file absent |
| Which Atlas families to audit next? | `AUDIT_LOG.md` lists completed families only |
| Status of `origin/structural-mechanics-migration` | Not documented in root docs |
| Whether pre-commit hooks are installed locally | Hooks in `.githooks/`; requires manual `git config core.hooksPath` |
| Whether `garden_config.atlas_version` should track sync | Sync script does not update it; label may lag entry data |

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
| **Stewardship** | Method stabilised; audit partial | Zero method failures; no outstanding proposals (`AUDIT_LOG.md:86-88`) |
| **Field** | Active surface | D1-bound; entries synced 2026-07-05 (D-004) |
| **Calibration** | Active surface | No D1/MCP/AI; `npm --prefix member test` |
| **MCP** | Active surface | Read-only, D1-bound; post-sync structure verified |
| **Build / sync** | Verified operational | D-004 sync apply success; manual apply still required after Atlas commits |
| **Deployment** | CI + local scripts | `deploy.yml` excludes `Reality_Mechanics/**` from triggers |
| **Automation** | Partial | Pre-commit + GitHub Actions; atlas-doctor missing |
| **Retired** | Excluded | Garden, standalone Atlas pages, Theory, Ark (`README.md`) |

---

## Maintenance

Update this document when operational facts change. Keep it factual — never a roadmap or planning backlog.
