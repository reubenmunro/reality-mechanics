# D-012 — Behaviour Retrace Instrument

**Programme:** Runtime / Observatory  
**Type:** Behaviour retrace instrument  
**Date:** 2026-07-05  
**Precedent:** D-011 emergent behaviour observations  
**Scope:** Field flight recorder — no runtime redesign

---

## Mission

Make Field behaviour mechanically retraceable to Atlas structure. The Observatory observes; this commission makes observation **legible** without inventing behaviours or promoting unaccepted theory.

---

## Deliverables

| Deliverable | Location |
|---|---|
| Shared trace builder | `.atlas-publisher/field-behaviour-trace.mjs` |
| Behaviour trace API | `GET /api/field/behaviour-trace?id={focusId}&runtime={json}` |
| Mechanics panel (client) | `#mechanics-panel` in Field page |
| Client trace state | `window.__fieldBehaviourTrace` |
| Tests | `.atlas-publisher/test/field-behaviour-trace.test.mjs` |
| This report | `docs/reports/D-012-behaviour-retrace-instrument.md` |

---

## Activation

| Method | Effect |
|---|---|
| URL `?debug=mechanics` | Opens Mechanics panel on load |
| **Shift+M** | Toggles Mechanics panel |
| API | Structural trace + optional runtime overlay JSON |

Relation rhythm debug (`?debug=relations`, Shift+D) remains separate.

---

## Trace schema

Each behaviour trace entry contains six fields (commission requirement):

1. **Observation** — D-011 behaviour name  
2. **Runtime input** — live or computed runtime scalars  
3. **Ratio / relation state** — ratio mode, compression, frame, rhythm selection  
4. **Atlas source fields** — D1-derived field names and values  
5. **Mechanical output** — what the renderer does  
6. **Meaning** — human-readable retrace (no Calculus promotion)

Top-level trace payload:

```json
{
  "contractVersion": 1,
  "focusId": "…",
  "focusTitle": "…",
  "atlasSourceSummary": { "fields": […], "values": {…} },
  "neighbourhood": { "size", "outgoing", "incoming" },
  "runtimeOverlay": {…},
  "behaviours": [ … five entries … ]
}
```

---

## Retraced behaviours (D-011 minimum five)

| D-011 ID | Observation | Atlas source fields cited |
|---|---|---|
| O-1 | Focus condensation | `mass.carriers`, `ratioMode`, `relations.*`, in-degree |
| O-2 | Ratio-driven relation compression | `mass.carriers`, `ratioMode.mode`, `ratioMode.x` |
| O-3 | Peripheral endpoint fading | structural mass + neighbourhood pressure (overlay) |
| O-5 | Reference-frame dimming | practice frame id + frame membership |
| O-6 | Relation-type rhythm signature | `relations.{type}`, source `ratioMode` |

All five are exposed in every trace response when focus exists.

---

## Working example — `first.relation`

**Live API:** `GET /api/field/behaviour-trace?id=first.relation`

**Representative compression trace** (structural + runtime overlay from D-011 focus sample):

```json
{
  "observation": "Ratio-driven relation compression",
  "runtimeInput": {
    "structuralMass": 0.838,
    "ratioMode": "continuous",
    "ratioTransition": 1,
    "ratioContinuous": 1,
    "outgoingEdgeCount": 17,
    "incomingEdgeCount": 46
  },
  "ratioRelationState": {
    "compressionLimitOut": 5,
    "compressionLimitIn": 3,
    "hiddenOutgoing": 12,
    "hiddenIncoming": 43
  },
  "atlasSource": {
    "fields": [
      "mass.carriers",
      "ratioMode.mode",
      "ratioMode.x",
      "relations.holds",
      "relations.traces",
      "incoming holds/traces/pairs/carries/nests in-degree"
    ],
    "values": {
      "carriers": 23,
      "ratioMode": "continuous",
      "ratioX": 23,
      "holdsIn": 21,
      "tracesIn": 23
    }
  },
  "mechanicalOutput": {
    "relationsDrawnOut": 5,
    "relationsHiddenOut": 12,
    "compressedRelationField": true
  },
  "meaning": "Carrier in-degree (holds/traces referencing this term) sets ratio mode and structural mass; higher mass lowers relationCompressionLimit so fewer, stronger filaments are drawn and overflow becomes a compressed halo."
}
```

**Field UI:** Focus `first.relation` with `?debug=mechanics` — Mechanics panel lists all five behaviours with Atlas field citations.

---

## Architecture

```text
D1 entries.structure + mass.carriers
        ↓ deriveFieldStatesPayload
        ↓ buildFieldBehaviourTrace (field-behaviour-trace.mjs)
        ↓ /api/field/behaviour-trace
        ↓ client merges collectRuntimeOverlay()
        ↓ window.__fieldBehaviourTrace + #mechanics-panel
```

Runtime overlay (client-only): `localCount`, `fieldPressure`, `endpointOnly`, `referenceFrame`, `settled`, selected `relationType` from visible relation samples.

No Atlas terms edited. No new simulation mechanics. Trace **reads** existing formulas (`structuralMassForState`, `relationCompressionLimit`, rhythm expression map).

---

## Acceptance

| Criterion | Status |
|---|---|
| Existing tests pass | **Pass** (31/31) |
| Field builds | **Pass** (worker module loads; fieldPage renders) |
| Five D-011 behaviours retraceable | **Pass** |
| Explanations cite Atlas source fields | **Pass** |
| No Atlas terms edited | **Pass** |
| No unaccepted theory promoted | **Pass** |
| Working `first.relation` example | **Pass** |

---

## Observation

The flight recorder makes D-011 candidate behaviours (CB-1–CB-5) **mechanically auditable** without promoting them to Reality Mechanics claims. Independent visual confirmation (D-011 Pass D) remains open.

---

**Status:** D-012 complete. Field behaviour is retraceable through the Mechanics panel and behaviour-trace API.
