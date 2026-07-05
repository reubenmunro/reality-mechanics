# Repository Build & Deployment Verification

Status:
**COMPLETE** (verified 2026-07-05 via D-003 / D-004)

Evidence reports: `docs/reports/D-003-deployment-verification.md`, `docs/reports/D-004-d1-sync-read-model-verification.md`, `docs/reports/D-019-atlas-website-sync-deployment.md`, `docs/reports/D-020A-observatory-panel-compression.md`, `docs/reports/D-020B-mechanics-amplification.md`

---

# Objective

Verify the complete delivery pathway from source change to public Observatory.

Mission contribution:

A verified delivery pipeline increases structural perception by ensuring every accepted improvement becomes publicly observable and retraceable.

---

# System Architecture

Developer
    ↓
Git Repository
    ↓
GitHub
    ↓
Cloudflare Workers (Field · Calibration · MCP)
    ↓
D1 read-model (generated from repository)
    ↓
Observatory (Field · Calibration · Submission 001)

Note: D1 sync is **manual** (`npm --prefix .atlas-publisher run sync:d1 -- --apply`). It is not part of GitHub Actions deploy.

---

# Components

| Component | Purpose | Status | Evidence |
|-----------|---------|--------|----------|
| Local repository | Source of edits | ☑ | D-003: clean tree, `main` @ `48bab6b`+ |
| GitHub | Canonical repository | ☑ | Branch up to date with `origin/main` |
| Cloudflare Workers | Public surfaces | ☑ | D-003: deploy run `28733802660` success; Workers modified 2026-07-05 |
| D1 | Generated read-model | ☑ | D-004/D-019: `sync:d1 --apply` success; Maintained Coupling → Compatibility live; D-018D hold prose live |
| MCP | AI read interface | ☑ | D-003/D-004/D-019: endpoint live; structure and prose reads match post-sync D1 |
| Atlas | Structural source | ☑ | 492 files; GitHub canonical |
| Observatory | Public submission medium | ☑ | Submission 001, Field, Calibration linked and live |

Retired: Cloudflare Pages, Garden, Gardener, Oracle — not part of active product (`README.md`).

---

# Verification Log

## Repository

Objective: Verify that the local repository is the authoritative working copy and is capable of producing reproducible commits.

Status: **Complete**

Evidence (D-003):

- Working tree clean; no uncommitted changes at audit time.
- Branch `main`, aligned with `origin/main`.
- HEAD `48bab6b` — Observatory loop delivery.

## Deployment

Objective: Verify the deployment pathway from GitHub to the public Observatory.

Status: **Complete**

Evidence (D-003):

- GitHub Actions `Deploy Reality Mechanics` run `28733802660` — all jobs pass (Field, Calibration, MCP).
- Public website reflects D-002 features: `/submission`, Calibration structural test, navigation links.
- Worker deployment synchronised with repository commit.

Gap recorded: deploy workflow does not run D1 sync (resolved in D-004 for current state; automation still open).

## Runtime

Objective: Verify runtime services supporting the Observatory.

Status: **Complete**

Evidence (D-003/D-004/D-019):

- D1 `atlas-d1`: sync apply succeeded (492 queries, 3431 rows written — D-019 verification re-apply).
- Field `/api/field/states`: 200; 490 states; D-018D place → hold prose verified on five probe terms (Connection, Hold, Out, Not, Cognitive Metabolism). D-020A adds `place` + `atlasUrl`; removes `excerpt` from Field client payload.
- MCP `get_entry`: place → hold → movement confirmed on same five terms.
- Calibration `/api/health`: `{"ok":true,"runtime":"mechanical","ai":false}`.

Note: `garden_config.atlas_version` label still reads `2026.07.03-i983` — sync does not update this metadata key.

## AI

Objective: Verify AI worker infrastructure.

Status: **Partially complete**

Evidence (D-003):

- MCP worker deployed and operational (`mcp.realitymechanics.nz`); 15 read-only tools; tests 27/27 pass.
- Retired Gardener / Oracle workers not verified and not part of active product.

End-to-end AI edit workflow not in scope (MCP is read-only by design).

---

# Findings

Open issues:

- `garden_config.atlas_version` not updated by sync script.
- D1 sync not automated in CI after Atlas commits.
- `atlas-doctor.mjs` missing — full Atlas integrity gate unavailable.
- Orphaned Garden-era Workers remain in Cloudflare account.

Resolved issues:

- **D1 read-model stale relative to Git source** — resolved by D-004 and re-verified D-019 (`sync:d1 --apply` after D-018D).
- **Maintained Coupling → Compatibility not live** — resolved; present in Field and MCP post-sync.
- **D-018D hold calibration not live on Observatory** — resolved by D-019; Field excerpts and MCP prose verified.
- **Worker deployment unverified** — resolved by D-003.

Risks:

- Future Atlas-only commits can reach GitHub without D1 apply unless process or automation is added.
- Version label can imply staleness while entry data is current.

---

# Architect Review

Accepted / Deferred / Rejected: **Accepted** (verification complete for active Observatory path)

Reason: D-003 identified the synchronisation break; D-004 repaired and D-019 re-verified the D1 read-model after D-018D hold calibration. Residual gaps are metadata and automation, not live structure or prose for verified repairs.

---

# Next Commission

**D-005 — D1 sync automation + version metadata** (see `docs/reports/D-004-d1-sync-read-model-verification.md` §8).

Acceptance for this verification track is met for the active Observatory delivery path.
