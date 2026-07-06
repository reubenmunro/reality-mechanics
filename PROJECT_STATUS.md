# Reality Mechanics — Project Status

**Repository cover sheet.** Read [`docs/PROGRAMME_INDEX.md`](docs/PROGRAMME_INDEX.md) first for current programme truth.

This document is not Atlas content and not part of the Stewardship specification.

---

## Purpose

Tracks what the repository **is**, what is **active**, and what remains **open or unverified**. Factual and operational only — not a roadmap.

---

## Current Repository State

**At a glance**

- **Platform:** Five public surfaces — Observatory · Pulse · Theory · Proof · Calculus — plus MCP. Canonical description: `public-surface-manifest.mjs`.
- **Atlas:** ~492 markdown files in `Reality_Mechanics/`; GitHub is the editable canonical source; D1 is generated from it.
- **Observatory runtime:** Mechanics → Read Engine → Renderer (P-013, O-006). Layer contract: `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`.
- **Stewardship:** Audit method in `docs/stewardship/`; coverage incomplete.
- **Build & deployment:** Workers on Cloudflare; D1 sync **manual**; `garden_config.atlas_version` label may lag entries.

**Git:** `main` @ `1e0b526` — Observatory mechanics pipeline + P/O research programme (2026-07-07).

**Synthesis:** `docs/reports/R-005-programme-synthesis.md` · **Operations:** `docs/reports/R-006-operation-reconciliation.md`

### Supporting detail

| Area | Characterisation | Evidence |
|------|----------------|----------|
| Public surfaces | Five surfaces + MCP — manifest is source of truth | `public-surface-manifest.mjs`; R-005 |
| Atlas source | Canonical in GitHub | `Reality_Mechanics/`; `README.md` |
| Observatory code | Read Engine + TMS modules | `.atlas-publisher/read-engine.mjs`; O-006 |
| Tests | 110 + 18 + 42 = **170** passing | R-006 |
| Live deployment | CI on `main` for worker paths | `.github/workflows/deploy.yml` |

---

## Operational Model

```
Atlas (source)  →  Stewardship (verification)  →  Platform (translation & surfaces)
     │                        │                              │
 GitHub markdown         audit method                  Cloudflare Workers
 Reality_Mechanics/      docs/stewardship/             Observatory · Pulse · MCP
                              │                              │
                              └──────── same Atlas ──────────┘
                                         │
                              D1 generated read model (atlas-d1)
                              rebuilt from repository, not edited directly
```

### 1. Atlas — structural memory (source)

- **What it is:** Editable record in `Reality_Mechanics/`.
- **Authority:** GitHub canonical; `atlas-structure-contract.mjs`.
- **Do not:** Treat D1 or canvas display as editing surfaces.

### 2. Stewardship — structural verification (method)

- **Entry:** `docs/stewardship/STEWARDSHIP_V1.md`; AI: `docs/stewardship/CURSOR.md`.
- **Do not:** Confuse stewardship invariants with Atlas Practice content.

### 3. Platform — public translation (surfaces)

| Surface | URL | Code | Reads Atlas? |
|---------|-----|------|--------------|
| **Observatory** | `realitymechanics.nz`, `/field` | `.atlas-publisher/` | Yes — D1 |
| **Pulse** | `calibration.realitymechanics.nz` | `member/` | No |
| **Theory** | `/theory` | `.atlas-publisher/` | Links only |
| **Proof** | `/proof`, `/submission` | `.atlas-publisher/` | Evidence only |
| **Calculus** | `/calculus` | `.atlas-publisher/` | Manifest render |
| **MCP** | `mcp.realitymechanics.nz` | `reality-mechanics-mcp/` | Yes — read-only |

**Deploy:** `.github/workflows/deploy.yml` on push to `main` for worker paths. Atlas file changes do **not** trigger D1 sync.

---

## Active Investigations

| Investigation | Status | Record |
|---------------|--------|--------|
| Programme synthesis | **Current** | R-005, `docs/PROGRAMME_INDEX.md` |
| Operation reconciliation | **Current** | R-006 @ `1e0b526` |
| Read Engine / thread mechanics | **Implemented** | O-004–O-006; P-011–P-013 |
| Participation / fabric reads | **Research only** | P-009, P-012 |
| D1 sync automation | **Open** | Manual apply; not in CI |
| Stewardship coverage | **In progress** | `docs/stewardship/AUDIT_LOG.md` |

---

## Known Unknowns

| Question | Why unknown |
|----------|-------------|
| D1 sync in CI? | Not in deploy workflow |
| `garden_config.atlas_version` lag | Sync script does not update label |
| `atlas-doctor.mjs` | Referenced by pre-commit; file absent |
| Client weave-state bundle | O-006 documents mirror drift risk |

---

## Canonical Sources

| Domain | Location |
|--------|----------|
| Programme entry | `docs/PROGRAMME_INDEX.md` |
| Product truth | `public-surface-manifest.mjs` |
| Runtime layers | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| Read Engine | `docs/runtime/READ_ENGINE.md` |
| Commissions | `docs/practice/COMMISSIONS.md` |
| Superseded reports | `docs/reports/SUPERSESSION_INDEX.md` |
| Atlas (editable) | `Reality_Mechanics/` |
| Observatory worker | `.atlas-publisher/main-website-worker.js` |
| Deploy (CI) | `.github/workflows/deploy.yml` |

---

## Maintenance

Update when operational facts change. Superseded narratives: see `docs/reports/SUPERSESSION_INDEX.md`. Never a roadmap.
