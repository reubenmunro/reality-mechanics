# D-020A — Observatory Panel Compression

**Programme:** Observatory  
**Type:** Observatory panel compression  
**Governing principle:** The Observatory demonstrates. The Atlas explains.  
**Date:** 2026-07-05 (UTC+12)

---

## Objective

Reduce the Field term sheet (Observatory panel) to the minimum information required to orient observation — without duplicating Atlas explanatory prose or changing Atlas source files.

---

## Executive summary

The Field term sheet now shows **Order · Title · Place · Relations · View Atlas Entry** only.

Hold paragraphs, movement prose, interpretive paragraphs, and truncated multi-paragraph excerpts are **removed from the panel**. Duplicated term titles are stripped at render time (including repeated prefixes). Full Atlas notes remain on GitHub via a subtle **View Atlas Entry** link.

**Tests:** atlas-publisher **44/44 pass** (8 observatory-panel tests including Invariant, Field Relationships, Connection).

---

## Before / after

### Before (D-019 panel)

| Element | Shown |
|---|---|
| Order | Yes |
| Title | Yes |
| Body text | **28-word `excerpt`** from flattened plain text — often included title repetition, hold sentence, and movement fragments |
| Relations | Yes (lowercase labels: holds, traces, …) |
| Atlas access | None |
| Hold paragraph | Often visible in excerpt |
| Movement / interpretive prose | Often visible in excerpt |

**Example — Invariant (before):**

```text
ground
Invariant
Invariant What remains stable across traversal, revision, application, or scale — preserved structure, not permanent immobility. Invariant is held by Root Order
holds … traces …
```

The duplicate title came from `plain_text` flattening: H1 text survives `#` stripping, so the excerpt began with `Invariant What remains…` beside the sheet title.

**Example — Field Relationships (before):**

```text
third
Field Relationships
Field Relationships A working grouping of third-order fields by recurring participation emphasis. Field Relationships is held by Third Order
holds … traces …
```

Problems: repeated title; hold prose in sheet; excerpt mixed Atlas layers.

### After (D-020A panel)

| Element | Shown |
|---|---|
| Order | Yes |
| Title | Yes |
| Place | **First pre-template paragraph only**, title prefix stripped when duplicated |
| Relations | Yes — **Holds · Traces · Carries · Pairs · Nests** (when present) |
| Atlas access | **View Atlas Entry** → GitHub blob of canonical source |
| Hold paragraph | **No** |
| Movement / interpretive prose | **No** |
| Template sections (`## Places`, etc.) | **No** |
| Applied examples / Not sections | **No** |

**Example — Invariant (after):**

```text
ground
Invariant
What remains stable across traversal, revision, application, or scale — preserved structure, not permanent immobility.
View Atlas Entry
Holds … Traces … Carries … Pairs … Nests …
```

**Example — Field Relationships (after):**

```text
third
Field Relationships
A working grouping of third-order fields by recurring participation emphasis.
View Atlas Entry
Holds … Traces … Carries … Pairs … Nests …
```

---

## Fields removed from panel display

| Removed from Observatory panel | Still available |
|---|---|
| Hold paragraph (`… is held by …`) | Atlas note (GitHub) · MCP `get_entry` |
| Movement / interpretive paragraphs | Atlas note · MCP |
| Truncated multi-paragraph excerpt | D1 `excerpt` column unchanged; no longer exposed in Field states API |
| Template body sections | Atlas note |
| Applied examples | Atlas note |
| `## Not` / extended prose | Atlas note |

**Atlas source files:** unchanged.

**Field canvas mechanics:** unchanged (ratio engine, behaviour trace, mechanics panel).

---

## Duplicated title resolution

**Rule:** If the first opening paragraph begins with the term title (case-insensitive), strip the title prefix repeatedly until the place sentence no longer repeats the term name.

| Term | Raw opening paragraph | Panel `place` |
|---|---|---|
| Invariant | `What remains stable across traversal…` (Atlas body) | Unchanged — no prefix in source |
| Invariant (legacy excerpt shape) | `Invariant Invariant What remains…` | `What remains…` |
| Field Relationships | `Field Relationships A working grouping…` | `A working grouping of third-order fields by recurring participation emphasis.` |
| Connection | `Relation holding between distinguishable conditions…` | Unchanged (no duplicate prefix) |
| Hold | `Resolution remaining supportable as the same condition.` | Unchanged |

Implementation: `.atlas-publisher/observatory-panel.mjs` — `stripDuplicatedTitle()` + `observatoryPlaceDisplay()`.

Place extraction uses the **first pre-template paragraph** from D1 `content` (content before first `##` heading), skipping `#` H1 lines. Hold-only openings return empty place (edge case guard).

---

## Atlas link behaviour

| Property | Value |
|---|---|
| Label | **View Atlas Entry** |
| Target | GitHub blob URL from D1 `source_path` |
| Pattern | `https://github.com/reubenmunro/reality-mechanics/blob/main/{source_path}` |
| Opens | New tab (`target="_blank"`, `rel="noopener noreferrer"`) |
| Hidden when | `source_path` absent |

The Observatory does not host long-form Atlas reading. `/atlas` remains retired (410).

---

## Implementation

| File | Change |
|---|---|
| `.atlas-publisher/observatory-panel.mjs` | **New** — place extraction, title dedup, GitHub view URL |
| `.atlas-publisher/main-website-worker.js` | Field states API adds `place` + `atlasUrl`; term sheet UI compressed |
| `.atlas-publisher/test/observatory-panel.test.mjs` | **New** — unit tests |
| `.atlas-publisher/test/field-states.test.mjs` | Updated for compressed panel contract |

### API change (`GET /api/field/states`)

Per-state payload:

- **Added:** `place`, `atlasUrl`
- **Removed from Field states:** `excerpt` (D1 column retained for other consumers; not surfaced to Field client)

---

## Tests

```bash
npm --prefix .atlas-publisher test
```

| Suite | Result |
|---|---|
| observatory-panel (8 tests) | Pass — Invariant, Field Relationships, Connection, title strip loop, hold guard, Atlas URL |
| field-states | Pass — `place`/`atlasUrl` in payload; no `excerpt`; panel HTML contract |
| field-behaviour-trace | Pass — mechanics unchanged |
| atlas-core | Pass |

**Total:** 44/44 pass.

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Observatory shows Order, Title, Place, Relations | **Pass** |
| No repeated title in opening display | **Pass** |
| No explanatory paragraphs (hold, movement, interpretive) | **Pass** |
| Atlas unchanged | **Pass** |
| Runtime mechanics unchanged | **Pass** |
| Mechanics remain primary teacher for behaviour | **Pass** — panel orients; Field canvas + optional mechanics panel teach behaviour |
| View Atlas Entry link | **Pass** |

---

## Design intent preserved

```text
observe (Field canvas + compressed panel)
    ↓
become curious (relations + mechanics)
    ↓
open Atlas (GitHub source)
```

Never the reverse.

---

## Unresolved / follow-on

1. **Deploy required** — Worker change in `.atlas-publisher/`; GitHub Actions deploy on push to `main`. No D1 re-sync required (uses existing `content` + `source_path` columns).
2. **Empty place edge case** — Notes whose opening paragraph is hold-shaped only show title + relations until prose structure is corrected in Atlas (none required for this commission).
3. **Future public Atlas reader** — If a dedicated read surface is added, `atlasUrl` can point there without changing panel compression logic.

---

## Follow-on mechanics visibility

D-020B amplifies recurring Field behaviours through rendering only; the compressed panel leaves room for mechanics to teach through the canvas.

---

## Commission closure

**Status:** D-020A complete. Observatory panel compressed; Atlas canonical record unchanged.

**Commission D-020A closed.**
