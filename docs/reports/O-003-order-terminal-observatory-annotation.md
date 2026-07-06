# O-003 — Order-Terminal Observatory Annotation

**Programme:** Observatory  
**Type:** Implementation commission (smallest readable threshold annotation)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`), P-008, O-002, P-010 (`docs/reports/P-010-terminal-resolution-boundary-investigation.md`)  
**Core rule:** Make terminal resolution visible as **reference-frame transition** — not material morph or structure edit.

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| Order-terminal registry | **Done** — `order-terminal.mjs` (Atlas instances, no D1 edit) |
| Field states payload | **Done** — `orderTerminal` + `orderTerminalAnnotation` per state |
| Behaviour trace API | **Done** — `orderTerminal` on `/api/field/behaviour-trace` |
| Term sheet annotation | **Done** — `#sheet-order-terminal` when focused term is order-terminal |
| Mechanics panel annotation | **Done** — `#mechanics-order-terminal` (Shift+M) |
| Tests | **82 passing** (atlas-publisher) |
| Report | This document |

**Acceptance:** Focusing **Resolution**, **Nesting**, or **Recursion** shows order-terminal read in term sheet and mechanics panel. Non-terminal terms show no block. No canvas/material phase effects added. L0 structure unchanged.

---

## 1. Design

### 1.1 Why a registry (not D1 schema change)

Atlas `order_terminal` lives in GitHub frontmatter (`Resolution.md`, `Nesting.md`, `Recursion.md`). D1 `entries` rows do not yet store that block. Commission constraint: **do not edit D1**.

**Smallest path:** `ORDER_TERMINAL_REGISTRY` maps `condition_key` → metadata mirroring Atlas frontmatter. `parseOrderTerminalBlock()` validates against live markdown in tests. Future D1/sync extension can replace registry lookup without changing Observatory UI contract.

### 1.2 Annotation content (P-010 aligned)

When `is_terminal: true`, participant sees:

| Field | Message |
|---|---|
| Terminally resolves | First / Third / Higher Order label |
| Passage limit | Same read cannot continue as same passage within order |
| Continuation | Re-entry, restart, or order lift required |
| Structure | L0–L1 remains invariant |
| Frame / behaviour | Reference frame and behaviour may change; appearance follows L6 |
| Read as | Reference-frame transition — not material morph or structure edit |

### 1.3 Layer touch (P-003)

| Layer | Touched? |
|---|---|
| L0–L2 | **No** — annotation only |
| L4–L6 canvas | **No** — no threshold morph visuals |
| L5 overlay | **Read-only** — mechanics panel + term sheet |
| cross-cut frame | **Unchanged** — existing `frameTransitionPulse` separate |

---

## 2. Implementation

### 2.1 New module

**File:** `.atlas-publisher/order-terminal.mjs`

- `ORDER_TERMINAL_REGISTRY` — `first.resolution`, `third.nesting`, `higher.recursion`
- `parseOrderTerminalBlock(frontmatter)` — YAML parser for tests / future sync
- `buildOrderTerminalAnnotation(metadata)` — participant-facing copy

### 2.2 Server payload

**`deriveFieldStatesPayload`** adds per state:

```json
{
  "orderTerminal": { "is_terminal": true, "terminal_of": "first_order", ... },
  "orderTerminalAnnotation": { "terminalOfLabel": "First Order", "passageRule": "...", ... }
}
```

**`buildFieldBehaviourTrace`** adds `orderTerminal` annotation on focus when metadata present.

### 2.3 Client UI

| Surface | Element | Trigger |
|---|---|---|
| Term sheet | `#sheet-order-terminal` | `renderTermSheet` → `fieldState.orderTerminalAnnotation` |
| Mechanics panel | `#mechanics-order-terminal` | `renderMechanicsPanel` → `trace.orderTerminal` |

Shared helpers: `orderTerminalAnnotationMarkup`, `renderOrderTerminalAnnotation`.

---

## 3. What was not done (by design)

- No automatic frame lift on focus (P-010 future instrumentation)
- No `resolutionRate` scalar or heatmap
- No material phase animation (ember/fire/lava, water/ice/steam)
- No Atlas term edits, D1 migration, or new public surfaces

---

## 4. Tests

| File | Coverage |
|---|---|
| `test/order-terminal.test.mjs` | Registry, parser vs `Resolution.md`, annotation copy |
| `test/field-behaviour-trace.test.mjs` | Trace `orderTerminal` for resolution focus |
| `test/field-states.test.mjs` | Payload fields; O-003 HTML contract |

---

## 5. Usage

1. Open Observatory, focus **Resolution** (`/field#first.resolution`).
2. Open term sheet — order-terminal block appears below place sentence.
3. Toggle mechanics panel (`Shift+M` or `?debug=mechanics`) — same annotation above behaviour traces.

---

## References

| ID | Path |
|---|---|
| P-010 | `docs/reports/P-010-terminal-resolution-boundary-investigation.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| O-002 | `docs/reports/O-002-fabric-renderer-architecture.md` |
| Code | `.atlas-publisher/order-terminal.mjs`, `main-website-worker.js`, `field-behaviour-trace.mjs` |

---

**Status:** O-003 complete. Threshold events readable as reference-frame transitions in participant panels; structure invariant principle preserved.
