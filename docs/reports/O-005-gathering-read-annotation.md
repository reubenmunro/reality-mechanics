# O-005 — Gathering Read Annotation

**Programme:** Observatory  
**Type:** Implementation commission (Mechanics panel read only)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-012 (`docs/reports/P-012-structural-gathering-mechanics.md`), P-011, O-004, O-002, P-003 (`docs/runtime/INVARIANT_RUNTIME_CONTRACT.md`)  
**Core rule:** Structural Gathering is a **read** — multiple nested relations held as one readable arrangement under Form. Not topology, not a scalar, not a painted field.

---

## Executive summary

| Deliverable | Outcome |
|---|---|
| `resolveGatheringRead` | **Done** — `gathering-read.mjs` |
| Behaviour trace API | **Done** — `gatheringRead` + `gatheringReadAnnotation` on `/api/field/behaviour-trace` |
| Mechanics panel | **Done** — `#mechanics-gathering-read` (Shift+M) |
| Canvas / field layer | **None** — no new visual effect |
| Atlas / D1 edits | **None** |
| Tests | **99 passing** (atlas-publisher) |
| Report | This document |

**Acceptance:** When a focused neighbourhood has sufficient declared evidence (thread pairs, woven crossings, shared terms, nests/pairs, ratio-readable endpoints), the Mechanics panel states that the neighbourhood **approximates Structural Gathering**. When only a thread network exists, it distinguishes **ThreadNetwork** from gathering. Fabric is never asserted or painted by this read.

---

## 1. Design

### 1.1 Why annotation only (P-012 §7)

P-012 concluded:

- Paint generic fields → **reject**
- Annotate gathering read when subgraph satisfies convergence → **accept** (like O-003 order-terminal)
- Fabric face remains **emergent** from O-002 leg evidence

O-005 implements the annotation path only.

### 1.2 Distinctions enforced in copy

| Term | Runtime meaning in annotation |
|---|---|
| **ThreadNetwork** | Incidence set — terms on ≥1 carry∧trace pair in focus neighbourhood |
| **Structural Gathering** | Arrangement read — multiple relations read as one whole |
| **Fabric** | Held whole — **not** asserted by gathering read alone |
| **Web** | Woven pair/nest crossings (`web_crossing`), not graph topology |

### 1.3 Conservative read criteria

`approximates_gathering` requires **all** of:

```text
threadPairCount ≥ 2
webCrossingCount ≥ 1        (pairs/nests legs with carry∧trace)
threadNetworkTermCount ≥ 3
sharedThreadTerms ≥ 1
ratioReadableInNetwork ≥ 2  (structuralMass ≥ fabricMassMin, O-002 default 0.12)
nestedRelationSignals ≥ 1 OR pairsEdgeCount ≥ 2
```

`thread_network_only`: ≥1 thread pair, ≥2 terms, but criteria above not all met.

`none`: no thread network.

No gathering scalar invented. Status is a discrete read outcome only.

---

## 2. Implementation

### 2.1 Module: `gathering-read.mjs`

| Export | Role |
|---|---|
| `enumerateNeighbourhoodEdges` | Directed edges within `focusNeighbourhoodIds` |
| `buildNeighbourhoodPairWeave` | Aggregate pair flags (same as home weave) |
| `resolveGatheringRead` | Evidence + status |
| `buildGatheringReadAnnotation` | Participant-facing Mechanics copy |
| `gatheringReadForNeighbourhood` | Read + annotation bundle |

Uses existing TMS helpers: `pairKey`, `mergePairState`, `weaveModeForLeg`, `structuralMassForState`.

### 2.2 Behaviour trace integration

`field-behaviour-trace.mjs` calls `gatheringReadForNeighbourhood` with the same `neighbourhoodIds` already computed for D-011 traces. API response adds:

- `gatheringRead` — mechanical evidence object
- `gatheringReadAnnotation` — null when `status === "none"`

### 2.3 Observatory UI

- HTML: `#mechanics-gathering-read` between order-terminal and behaviour traces
- `gatheringReadAnnotationMarkup` / `renderGatheringReadAnnotation`
- `renderMechanicsPanel` renders from `trace.gatheringReadAnnotation`
- **No** term sheet block (Mechanics panel only per commission)
- **No** canvas changes

---

## 3. Tests

| File | Coverage |
|---|---|
| `test/gathering-read.test.mjs` | Edge enumeration, isolated pair vs woven hub, annotation copy, trace shape |
| `test/field-behaviour-trace.test.mjs` | HTML includes `#mechanics-gathering-read`; resolution focus has `none` |
| `test/field-states.test.mjs` | O-005 HTML contract — markup functions, no sheet element |

---

## 4. Protected principle

> Fabric must emerge. It must never be painted.

O-005 does not add fabric face, pressure field, or gathering overlay. O-002 fabric rendering is unchanged. Gathering is visible only in the Mechanics panel as a **derived read** on declared structure.

---

## 5. Gaps (honest)

| Gap | Note |
|---|---|
| Nested Relation / Form not resolved as Atlas terms | Uses nest edges + ratio-readable endpoints as mechanical proxy (P-012 §6) |
| Full Atlas subgraph | Neighbourhood is focus-local (`focusNeighbourhoodIds`), not session-wide |
| Term sheet | Intentionally omitted — Mechanics panel only |

Future commission could add term-sheet copy if needed; must remain read-only annotation.

---

## References

| ID | Path |
|---|---|
| P-012 | `docs/reports/P-012-structural-gathering-mechanics.md` |
| P-011 | `docs/reports/P-011-thread-mechanics-investigation.md` |
| O-004 | `docs/reports/O-004-thread-mechanics-renderer-pass.md` |
| O-003 | `docs/reports/O-003-order-terminal-observatory-annotation.md` |
| Code | `.atlas-publisher/gathering-read.mjs` |

---

**Status:** O-005 complete. Observatory can state when a focused neighbourhood approximates Structural Gathering — without scalar, topology, or painted field.
