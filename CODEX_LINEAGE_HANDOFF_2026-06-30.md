# Codex Lineage Handoff — 2026-06-30

## What I received

Claude handed off the current Reality Mechanics site as a dependency-ordered reasoning system whose field page makes RM relations physical. The core invariants still matter:

- Visual properties encode structure, not decoration.
- Hue follows entry order; saturation follows garden status; luminance follows groundedness.
- Carries are visually dominant and load-bearing.
- Holds are quiet and architectural.
- Traces return and should remain dashed.
- Broken carry/trace reciprocity should remain visibly unstable.
- Do not lower `SIM_DAMP` below 0.85; it is currently 0.91.
- Do not reintroduce `needs_preparation` as a garden-worker AI status.
- Do not use Oracle in AI-facing design.
- Do not modify `wrangler.toml`.

## What Reuben showed me

The live Boundary field view was structurally accurate but visually congested. Boundary has very high incoming hold/trace pressure and many outgoing carries. The previous rendering treated too many direct relations equally, so the field collapsed into a bright labeled knot. The issue was not that Boundary was heavy; it was that heaviness was being rendered as crowding.

## What I changed

All edits are in `.atlas-publisher/main-website-worker.js`.

- Quieted the field overlay and controls so the canvas carries the experience.
- Changed the local field selection so full structural counts still feed profile physics, but high-degree incoming relations are sampled for readability.
- Kept outgoing carries visually privileged, with a high render limit.
- Added deterministic relation-aware initial placement so carries, traces, holds, pairs, and nests enter the field from different regions.
- Added density-aware physics scaling: crowded terms get longer spring rest lengths, stronger repulsion, weaker vertical/order pinning, and a lower default zoom.
- Changed carry node mass from linear carry count to a square-root curve. Carry count still increases radius, but high-load terms no longer swallow the whole field.
- Tightened the carry ring for high-load terms into a close segmented halo instead of an enormous enclosing circle.
- Made labels more reluctant in dense fields, especially for incoming relations.
- Differentiated filaments further: carries are still heavier and brighter; pairs/nests are quieter; holds/traces still have no filaments.

## Verification

- `node --check .atlas-publisher/main-website-worker.js` passes.
- I ran a local preview at `http://127.0.0.1:8789/field#first.boundary` using live Atlas/Garden JSON.
- The first preview exposed an overly large carry ring; I corrected it.
- The second preview showed Boundary as a bright, loaded, more spacious field with no giant ring and fewer competing labels.

## Still open

- This pass is not deployed.
- The homepage / Enter / Atlas route structure still needs a product-level decision:
  - `/` is currently the field.
  - `/atlas` behaves like the Enter compression surface.
  - `/field` is the full physics view.
- The field page still contains CSS and JS references for `#field-input`, but the input markup is not present.
- Legacy `needs_preparation` API/UI traces remain in the main worker and should be audited separately from this visual pass.
- Oracle notes still exist in the vault. MCP-facing protocol has been trimmed, but vault-level language should be handled deliberately rather than swept casually.

## My read

The right direction is not to make the field clearer in a diagrammatic sense. It should become more spacious, more structurally legible through weight and movement, and less eager to explain itself. Boundary should feel like a loaded term under pressure, not like a graph trying to label every edge.

## Follow-up build in same lineage

Reuben clarified the key architectural read: the Atlas order itself is the runtime discipline. There should be one structural source of truth; frontmatter is AI language; prose is human language.

I built the next field-layer step:

- Added `/api/field/entry/:id` on the main worker. It returns one entry's canonical structure plus human prose content from D1.
- Turned the field side panel into layered views:
  - `Prose`: default. Shows the authored note body after frontmatter. This is the human layer.
  - `Structure`: shows relation buttons from the canonical structure. This is the AI/Atlas layer.
  - `Field`: keeps the existing diagnostic/physics readout. This is the recognition/pressure layer.
- Clicking the focused term now opens the panel into `Prose` by default. Clicking non-focused terms still enters/navigates them.
- Verified locally with Boundary:
  - Prose opens and loads Boundary's authored prose.
  - Structure tab shows holds/traces/carries/pairs.
  - Field tab shows composition/basins/engine/temperament.

This is the first concrete move away from separate pages and toward separate depths in one field.

## MCP layer contract deployment

Reuben then asked to proceed into the worker/MCP setup implied by the same discovery: Atlas order is the runtime discipline; structure is one source of truth; frontmatter/D1 is AI language; prose is human language.

I updated `reality-mechanics-mcp/src/index.js`:

- Added `LAYER_CONTRACT`.
- `initialize` instructions now state: frontmatter is AI language, prose is human language.
- `get_ai_entry_protocol` now includes the layer contract and worker order.
- `begin_atlas_session` governance now includes the layer rule and worker order.
- `get_entry` and session practice entries include `layers`.
- `_read_as` distinguishes structure from prose.

I replaced the stale static-export MCP tests with a current D1-backed mock test:

- `npm test` passes with 12 assertions.
- `node --check reality-mechanics-mcp/src/index.js` passes.

I deployed the MCP Worker:

- Worker: `reality-mechanics-mcp`
- Version ID: `47ea29ea-85f1-4e1a-bf02-702e6ce1275e`
- Custom domain verified: `https://mcp.realitymechanics.nz/mcp`

Live verification passed for:

- `initialize`: layer language present.
- `begin_atlas_session`: layer rule and worker order present.
- `get_entry practice.atlas`: `layers.prose` present and `_read_as` names prose as human language.

## Operator invariant deployment

Reuben then identified the next important structure: carrying appears both as strands and as a term. This generalized into seven operator families matching the note grammar:

1. Hold
2. Trace
3. Carry
4. Pair
5. Nest
6. Read
7. Place

Operator read: the edge shows the operation in passage; the term shows the operation gathered as condition.

I updated `.atlas-publisher/main-website-worker.js`:

- Added `operatorFamilies`.
- Focused operator terms are detected by title/id.
- Matching edge families resonate when connected to the focused operator term.
- Focused operator terms get a seven-part operator halo, with the active family subtly lit.
- Structure tab names the operator read when applicable.

I updated `reality-mechanics-mcp/src/index.js`:

- Added `OPERATOR_CONTRACT` with the seven families.
- `get_ai_entry_protocol`, `begin_atlas_session`, session entries, and `get_entry` now expose it.
- Tests now assert the seven-family contract.

Checks:

- `node --check .atlas-publisher/main-website-worker.js`
- `node --check reality-mechanics-mcp/src/index.js`
- `npm test` in `reality-mechanics-mcp` passed: 17 assertions.

Deploys:

- Main website Worker version: `87cef0a1-92b5-45f9-9d27-054a2abb6f6e`
- MCP Worker version: `9877a87b-d445-4d57-882e-f03922c4bfc8`

Live verification passed:

- `https://realitymechanics.nz/field` contains `operatorFamilies` and operator resonance code.
- `get_ai_entry_protocol` returns seven operator families.
- `get_entry practice.atlas` includes both `layers` and `operatorContract`.
