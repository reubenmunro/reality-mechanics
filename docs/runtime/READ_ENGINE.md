# Read Engine — Runtime Module Pattern

**Status:** Descriptive contract (O-006). Not a P-003 invariant layer.  
**Governing evidence:** P-013 (`docs/reports/P-013-read-engine-architecture.md`), P-003 (`INVARIANT_RUNTIME_CONTRACT.md`).

## Principle

> The Observatory does not paint meaning. It derives reads, then lets appearance follow.

## Module layout

| Module | Role |
|---|---|
| `read-engine.mjs` | Catalogue + `resolveFocusReads` orchestration |
| `order-terminal.mjs` | R-OT order-terminal read |
| `gathering-read.mjs` | R-SG Structural Gathering read |
| `weave-read.mjs` | R-WM / R-FE weave and fabric-eligibility reads |
| `maturity-read.mjs` | R-MAT maturity / settledness read |
| `weave-state.mjs` | Shared mechanics substrate (not a read) |
| `woven-field-renderer.mjs` | L6 woven-field home renderer (O-008) |
| `field-behaviour-trace.mjs` | R-BT meta-instrument |

## Source-of-truth rules

1. Structure canonical — reads never invent L1 edges.
2. Mechanics single path — weave state via `weave-state.mjs` + `thread-mechanics.mjs`.
3. Read does not paint — no canvas effect from read resolver by default.
4. Appearance follows — `draw*` uses mechanics eligibility, not read status.
5. Overlay is context — `runtimeOverlay` does not define read truth.
6. No read scalar — discrete status + evidence unless Atlas register exists.
7. Version resolvers — bump `*.vN` on criteria change.
8. Behaviour trace imports reads — no duplicated recognition logic.

## Resolver pattern

```text
resolveXRead(inputs) → { status, evidence, resolver, nonPainting: true }
buildXAnnotation(read) → participant copy | null
```

Appearance (L6) may consume **mechanics** outputs (`resolveLeg`, `fabricEligibleWeaveMode`) — not read status directly.

## Catalogue

See `READ_CATALOGUE` in `.atlas-publisher/read-engine.mjs`.
