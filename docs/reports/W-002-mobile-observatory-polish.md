# W-002 — Mobile Observatory Polish

**Commission:** W-002  
**State:** Resolved  
**Date:** 2026-07-07  
**Type:** Presentation only — no mechanics, Atlas, renderer, or runtime changes

---

## Purpose

Final implementation commission before programme rest. Improve how the Observatory is experienced on phones without changing structural behaviour. Desktop interaction remains unchanged.

---

## Control points (identified before implementation)

All Observatory UI lives in `.atlas-publisher/main-website-worker.js` → `fieldPage()` (inline HTML, CSS, client script).

| Concern | Location |
|---|---|
| Mobile layout | Inline `<style>`; `@media (max-width: 900px)` + `body.mobile-observatory`; `syncMobileObservatoryClass()` |
| Initial panel opening | `bootstrap()` — neutral path calls `renderNeutralSheet()` + `closeTermSheet()`; mobile auto-dismisses landing |
| Term selection | `enterOperation()`, canvas `pointerup`, `enter-form` submit, `toggleTermSheet()` |
| Panel / drawer | `#term-sheet`, `openTermSheet()`, `closeTermSheet()`, `renderTermSheet()`, `observeTerm()` |

Atlas panel content pipeline (`observatory-panel.mjs`) unchanged — display translation only at server build time.

---

## What changed

| Area | Change |
|---|---|
| Mobile layout | Field-first chrome; compressed nav; safe-area insets; landing prose hidden on mobile; status + search de-emphasised |
| Lazy disclosure | Neutral open: sheet closed; empty canvas tap does not open neutral panel on mobile |
| Term tap | `pulseSelectedTerm()` + `drawTapPulse()` then delayed `openTermSheet()` (420ms); lazy `renderTermSheet()` until reveal |
| Bottom drawer | `#term-sheet` slides from bottom on mobile; `#sheet-backdrop`; `#sheet-drag-handle` drag-to-dismiss; close button preserved |
| Desktop | Side panel CSS and immediate sheet open unchanged (`revealTermSheetForSelection` branches on `isMobileObservatory()`) |

---

## What did not change

- `thread-mechanics.mjs`, `read-engine.mjs`, `woven-field-renderer.mjs`
- Runtime contracts, ratio/condensation/fabric/web logic, MCP, GitHub evidence
- Canvas draw mechanics (`drawWovenHomeField`, `drawCurrent`, etc.)

---

## Tests

| Suite | Count |
|---|---|
| `.atlas-publisher` | 127 (+5 W-002) |
| `member` | 20 |
| `reality-mechanics-mcp` | 42 |

New file: `.atlas-publisher/test/w-002-mobile-observatory.test.mjs`

---

## Acceptance

| Criterion | Result |
|---|---|
| Desktop unchanged | Side panel CSS + immediate open path preserved |
| Mechanics unchanged | No forbidden modules edited |
| Mobile opens to woven field | Landing dismissed; sheet closed on neutral bootstrap |
| No auto term panel | `closeTermSheet()` on neutral load; no mobile empty-tap open |
| Deliberate tap reveals info | Pulse + delayed drawer |
| Bottom drawer | Transform slide, backdrop, drag handle, scrollable content |
| Existing tests pass | Yes |

---

*W-002 complete. Final implementation commission before observation.*
