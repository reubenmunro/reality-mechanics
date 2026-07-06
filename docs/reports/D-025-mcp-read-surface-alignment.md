# D-025 — MCP Read Surface Alignment

**Programme:** Public Structure
**Type:** AI read-access alignment — MCP as companion to the public website
**Date:** 2026-07-06 (UTC+12)
**Base:** `main` @ `93287ab` (D-024, pushed at session start)

---

## Diagnosis

The MCP (15 tools, v2.3.0) was an excellent Atlas instrument with no knowledge of the public structure:

1. **No surface awareness** — nothing answered "what are the public surfaces, their roles, their routes?" An AI could traverse 490 Atlas terms but could not discover that Observatory, Pulse, Theory, Proof, and Calculus exist.
2. **No derivation-status access** — the D-024 four-status vocabulary and derivation chain existed only as generated HTML.
3. **Weak version awareness** — `get_manifest` returned the placeholder `atlasVersion: "d1-live"` instead of the actual `garden_config.atlas_version` label.
4. **The anti-drift pattern already existed** — both workers import shared root modules (`atlas-structure-contract.mjs`, `field-maturity.mjs`). Public-surface knowledge belonged in the same pattern.

## AI read-access model

**One source of truth, two readers.** New root module **`public-surface-manifest.mjs`** carries the public structure as versioned data (`2026-07-06.d-025`): the five public surfaces plus the MCP doorway (id, role, worker, baseUrl, routes, APIs, Atlas read path, notes, repo-relative sources), the four-status vocabulary, the derivation chain (exact rules, per-step status, source paths), the derivation inventory, the supporting-reports index, and explicit drift notes.

- The **website Calculus page renders** its vocabulary, chain, caveat, and inventory **from this module** (`calculusVocabHtml` / `calculusChainHtml` / `calculusCaveatHtml` / `calculusInventoryHtml`).
- The **MCP serves the same data** through two new tools. Human and AI readers read literally the same objects; drift between the two is structurally impossible for this content.

**Retraceability model:** every claim object carries a repo-relative `source` path; both readers derive GitHub URLs from it via a shared `sourceUrl()`. The MCP additionally reports the live read-model reading (entry count + real `atlas_version` label) with an explicit lag-honesty note (D-013): the version label and entry data are separate reads, never conflated.

## Tools / endpoints changed or added

| Item | Change |
|---|---|
| `get_public_surfaces` (new) | Manifest version, all six surface descriptions with routes/APIs/sources/sourceUrls, live read-model reading, supporting-reports index, drift notes, retraceability statement |
| `get_derivation_status` (new) | Unpromotion rule first, status vocabulary, derivation chain with rules + per-step sourceUrls, Atlas-Ratio caveat, four-status inventory, open items, public route |
| `get_manifest` (improved) | Reports real `garden_config.atlas_version` (fallback "unrecorded") with a version-lag honesty note instead of the `"d1-live"` placeholder |
| Server version | `reality-mechanics-atlas` 2.3.0 → **2.4.0**; 15 → **17 tools**, all read-only |
| `.github/workflows/deploy.yml` | `public-surface-manifest.mjs` added to both trigger path lists — manifest changes redeploy both workers |

## Required coverage — how each question is answered

| # | Question | Answer path |
|---|---|---|
| 1 | Current public surfaces | `get_public_surfaces.surfaces` (5 + MCP) |
| 2 | What each surface does | `surfaces[].role` + `notes` |
| 3 | Routes per surface | `surfaces[].routes` + `apis` |
| 4 | What the Observatory is reading | observatory entry (D1 read-model, states/behaviour-trace APIs) + `liveReadModel` (entry count, version label) |
| 5 | Pulse and its mechanics | pulse entry: drift/pulse/strain/carried-strain, `/api/health`, mechanical/no-AI/no-mutation, C1–C8 contract |
| 6 | Theory claim | theory entry: claim + Working Postulate v0.6 + constitutional standard, with canonical sources |
| 7 | Proof and its pathway | proof entry: accepted/candidate/unresolved separation + Claim → Source → Method → Record |
| 8 | What Calculus is | calculus entry + `get_derivation_status` |
| 9 | Derived / calibrated / heuristic / unresolved | `get_derivation_status.statusVocabulary` + `inventory` |
| 10 | Live version / read-model | `liveReadModel.atlasVersion` + `entryCount` + `versionNote` (lag-honest) |
| 11 | What remains open | `get_derivation_status.openItems` + `inventory.unresolved` |
| 12 | Supporting reports | `get_public_surfaces.supportingReports` (D-021.5, D-022, D-023, D-024, D-019, D-013) |

## Files changed

| File | Change |
|---|---|
| `public-surface-manifest.mjs` (new, root) | Canonical public-structure data module |
| `reality-mechanics-mcp/src/index.js` | Two new tools; manifest version upgrade; imports; v2.4.0 |
| `.atlas-publisher/main-website-worker.js` | Calculus page renders vocabulary/chain/caveat/inventory from the manifest module |
| `.github/workflows/deploy.yml` | New root file in both trigger path lists |
| `reality-mechanics-mcp/test/worker.test.mjs` | 15 new assertions (27 → 42) |
| `.atlas-publisher/test/field-states.test.mjs` | D-025 anti-drift test: page must contain every manifest rule/claim; every manifest website route must be served (70 → 71 tests) |
| `docs/reports/D-025-mcp-read-surface-alignment.md` | This report |
| `docs/practice/COMMISSIONS.md` | Register entry |

## Source-of-truth decisions

- **The manifest module is data about the public structure, not new theory** — every entry restates what a commission report or canonical document already records, with its source path attached.
- **GitHub remains canonical; D1 remains generated.** The new tools read D1 only for the live read-model reading (count + version label); everything else is repository data compiled into the workers at deploy time.
- **MCP remains strictly read-only** — no new write paths; tests re-assert the absence of write/maintenance/Garden tools.
- **Prose duplication avoided by construction** — the only shared prose lives once, in the manifest module, rendered by both readers.

## Drift risks

1. **Manifest vs deployed reality:** the manifest is revised by commission; if a surface changes without a manifest revision, the manifest version identifies the lag (declared in `DRIFT_NOTES`, exposed by the tool). The D-025 route test catches removed/renamed website routes at CI time.
2. **Version label lag:** `atlas_version` remains a sync-time label that can trail entry data — now reported *with* that caveat rather than hidden (D-013).
3. **Hand-written page sections:** the Calculus candidate-calculus section and other page prose remain hand-composed; only vocabulary/chain/caveat/inventory are generated. Extending generation further is possible if drift appears.

## Unresolved

1. Everything in the manifest's `unresolved` inventory — by design.
2. `CLOUDFLARE_SURFACE_MAP.md` still records 15 MCP tools and a four-surface site; README/PROJECT_STATUS likewise lag (documentation alignment pass still owed).
3. Report indexing is a curated list (`SUPPORTING_REPORTS`), not generated from `docs/reports/` — acceptable at this scale, revisit if the register grows.
4. D-023's deferred items stand (live-field placement verification; render-layer audit).

## Next recommended commission

**D-026 — Submission 002 + documentation alignment** (unchanged from D-024's recommendation, now broader): refresh the accepted/candidate/unresolved lists against the current five-surface, MCP-aligned repository; align README, PROJECT_STATUS, and CLOUDFLARE_SURFACE_MAP (now also 17 tools, five surfaces, manifest module) in one pass under Proof's own standard.

---

## Acceptance

| Criterion | Status |
|---|---|
| AI can read the same public structure a human sees | **Pass** — same manifest module renders the website Calculus content and feeds the MCP |
| All 12 required questions answerable via MCP | **Pass** — coverage table above; tested |
| MCP remains read-only; D1 not an editing surface | **Pass** — read paths only; write-tool absence re-asserted |
| Structured, retraceable, version-aware, drift-honest | **Pass** — source paths on every claim; manifest version; live read-model reading with lag note; drift notes exposed |
| Tests pass | **Pass** — atlas-publisher 71/71 · member 17 · MCP 42 |
