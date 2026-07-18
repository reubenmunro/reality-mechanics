# W-003 — Mobile Surface Coherence

**Commission:** W-003  
**State:** Resolved  
**Date:** 2026-07-18  
**Type:** Presentation only — no Atlas, mechanics, D1, MCP, or generated-content changes

## Purpose

Make Observatory, Pulse, Theory, Proof, and Calculus legible and coherent on phones while preserving their existing identity and direct routes back to canonical source.

## Source boundary

- `Reality_Mechanics/` remains the sole maintained structural authority.
- The Observatory continues to read the generated field state and uses the existing `atlasUrl` for **View Atlas Entry**.
- Theory continues to expose its generated source path, determination, and canonical source hash.
- Proof and Calculus retain their repository evidence links.
- Pulse remains a mechanical instrument with its maintained instrument-contract link.
- No source prose, generated identity, structural relation, renderer mechanic, D1 record, or MCP tool is changed.

## Presentation changes

| Surface | Mobile change |
|---|---|
| All five surfaces | One non-wrapping navigation row, stronger contrast, 44 px touch targets, safe-area-aware spacing |
| Theory, Proof, Calculus | Shared mobile reading width and typography; long code and identity values wrap safely |
| Pulse | Same mobile frame, clearer introduction, retained runtime and instrument-contract links |
| Observatory | Five whole-field anchor labels instead of twenty at rest; four neighbouring labels instead of fourteen in a focused read |
| Observatory search | Clear full-width term control separated from field identity status |
| Observatory drawer | Dynamic-viewport height, contained scrolling, larger close and relation targets, prominent Atlas source link |

The label reduction is a viewport visibility gate over the existing `homeLabelIds` and local relation set. It does not choose, store, or infer a second structure.

## Verification

- W-003 tests assert the shared phone frame and source routes.
- Existing W-001 and W-002 source-orientation and mobile-drawer contracts remain active.
- Field: 139 passed, 1 intentional deployment skip.
- Pulse: all 19 invariants plus calibration engine and W-001 orientation passed.
- MCP canonical Translation tests passed with the unchanged 493-entry identity.
