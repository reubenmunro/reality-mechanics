---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.contact
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "relation meeting at a boundary, edge, surface, or point of touch."
  needs:
    targets:
      - first.boundary
      - first.clearance
      - first.tact
  holds:
    targets:
      - first.boundary
      - first.clearance
      - first.tact
    read: "[[Boundary]], [[Clearance]], and [[Tact]]. Boundary locates distinction, clearance can close into meeting, and tact keeps contact from collapsing into interference, pressure, or harm."
  pairs:
    targets:
      - first.contact
    read: "Clear and Tact carry downward — into [[Contact]]. Meeting is where the readability and handling tracks converge."
  traces:
    targets:
      - first.boundary
      - first.clearance
      - first.tact
      - first.relation
  nests:
    targets: []
    read: "at the edge where located distinction meets, touches, or becomes locally available for later coupling."
  reads:
    targets: []
    read: "where relation is no longer only separated by clearance, but meets at an edge, surface, or point of touch."
  carries:
    targets:
      - second.coupled-contact
      - second.interposed_carrier
      - second.recarry
publish: true
status: stable
---
# Contact

Relation meeting at a boundary, edge, surface, or point of touch.

Contact is held by [[Boundary]], [[Clearance]], and [[Tact]]. Boundary locates distinction, clearance can close into meeting, and tact keeps contact from collapsing into interference, pressure, or harm.

Contact can support later carrying, resistance, grip, or traction through [[Coupled Contact]].

## Places

Contact places relation meeting at a boundary, edge, surface, or point of touch.

## Holds

Contact is held by [[Boundary]], [[Clearance]], and [[Tact]]. Boundary locates distinction, clearance can close into meeting, and tact keeps contact from collapsing into interference, pressure, or harm.

## Pairs

[[Clear]] and [[Tact]] carry downward into Contact. Meeting is where the readability and handling tracks converge: clearance has closed enough to touch, and tact has kept the approach clean enough to meet without interference.

## Traces

- [[Boundary]]
- [[Clearance]]
- [[Tact]]
- [[Relation]]

## Nests

Contact nests at the edge where located distinction meets, touches, or becomes locally available for later coupling.

## Reads

Contact becomes recognisable where relation is no longer only separated by clearance, but meets at an edge, surface, or point of touch.

## Carries

- [[Coupled Contact]]
- [[Interposed Carrier]]
- [[Recarry]]
