# D-020D — Observatory Presentation Corrections

**Programme:** Observatory  
**Type:** Presentation Corrections  
**Date:** 2026-07-06 (UTC+12)  
**Context:** D-020C identified bootstrap condensation as the initial visibility cause; place panel still exposed Obsidian wikilink syntax in some terms.

---

## Objective

Resolve remaining Observatory presentation issues without new features, Atlas edits, or mechanics tuning.

---

## 1. Initial field visibility

### Cause (from D-020C)

Default bootstrap selected a high-mass hub (Relation), set `homeMode = false`, and rendered focused condensation with `fieldPressure > 0.38` → `endpointOnly` for all neighbours. The field was present but near-invisible until navigation lowered field pressure.

### Fix

Open in **neutral whole-field mode** when no explicit term is supplied (no hash deep-link):

- `homeMode = true`, `homeAlpha = 1.0`
- Static home field drawn at full alpha (`drawHomeField`)
- No focused condensation overlay (`endpointOnly` path not entered)
- Term selection via canvas click, enter form, Continue, or hash still calls `enterOperation()` → condensation becomes deliberate

Hash deep-links continue to open directly on the named term.

### Files

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | Bootstrap branches on `explicitTermId`; `nearestHomeOperation()` for home-mode hit testing |

---

## 2. Wikilink rendering

### Cause

`observatoryPlaceDisplay()` returned the first pre-template paragraph verbatim. Atlas source legitimately contains `[[Term]]` wikilinks in body prose; these leaked into the Observatory panel.

### Fix

Added `stripObsidianWikilinks()` in `observatory-panel.mjs`:

- `[[Target]]` → `Target`
- `[[Target|label]]` → `label`
- `[[Target#section]]` → `Target`

Applied after title deduplication in `observatoryPlaceDisplay()`. Atlas source and D1 content unchanged — translation only at display time.

### Files

| File | Change |
|---|---|
| `.atlas-publisher/observatory-panel.mjs` | `stripObsidianWikilinks()`; wired into place pipeline |
| `.atlas-publisher/test/observatory-panel.test.mjs` | Wikilink stripping tests |
| `.atlas-publisher/test/field-states.test.mjs` | D-020D bootstrap contract test |

---

## Tests

```bash
npm --prefix .atlas-publisher test
```

| Suite | Result |
|---|---|
| atlas-publisher | Pass — wikilink strip + whole-field bootstrap assertions |

---

## Acceptance

| Criterion | Status |
|---|---|
| Whole field visibly present on first load | **Pass** — home field at full alpha without hub condensation |
| No Obsidian wikilinks in Observatory panel | **Pass** — stripped at place display |
| Atlas unchanged | **Pass** |
| Runtime unchanged except agreed bootstrap | **Pass** — no coefficient or draw-path tuning |
| Tests added for wikilink stripping | **Pass** |

---

## Commission closure

**Status:** D-020D complete. Opening state and place display corrected; mechanics untouched.

**Commission D-020D closed.**
