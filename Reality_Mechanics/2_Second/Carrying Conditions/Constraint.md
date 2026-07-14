---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.constraint
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "availability bounded through carrying."
  needs:
    targets:
      - first.bearing
      - second.carrying
  holds:
    targets:
      - first.bearing
      - second.carrying
    read: "[[Bearing]] and [[Carrying]]."
  pairs:
    targets:
      - second.regulation
    read: "[[Regulation]]. Constraint narrows availability through carrying; Regulation maintains carrying within those bounds."
  traces:
    targets:
      - first.bearing
      - second.carrying
  nests:
    targets: []
    read: "as carrying narrowed into bounded availability. It can support regulation, resistance, binding, and restraint."
  reads:
    targets: []
    read: "where carrying can be read as limiting what is available — where what can participate is narrowed or directed through the carrying condition."
  carries:
    targets:
      - second.regulation
      - second.resistance
      - third.binding
      - third.restraint
      - third.control
      - third.engineered-coupling
      - second.guard
      - third.governing
publish: true
status: stable
---
# Constraint

Availability bounded through carrying.

Constraint is held by [[Bearing]] and [[Carrying]].

## Places

Constraint places availability bounded through carrying.

## Holds

Constraint is held by [[Bearing]] and [[Carrying]].

## Pairs

Constraint pairs with [[Regulation]]. Constraint narrows availability through carrying; Regulation maintains carrying within those bounds.

## Traces

- [[Bearing]]
- [[Carrying]]

## Nests

Constraint nests as carrying narrowed into bounded availability. It can support regulation, resistance, binding, and restraint.

## Reads

Constraint becomes recognisable where carrying can be read as limiting what is available — where what can participate is narrowed or directed through the carrying condition.

## Carries


- [[Regulation]]
- [[Resistance]]
- [[Binding]]
- [[Restraint]]
- [[Control]]
- [[Engineered Coupling]]
- [[Guard]]
- [[Governing]]
