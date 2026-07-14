---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.speed
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "rate of traversal through a closure scope."
  needs:
    targets:
      - second.traversal
      - second.rate
      - second.measure
  holds:
    targets:
      - second.traversal
      - second.rate
      - second.measure
    read: "[[Traversal]], [[Rate]], and [[Measure]]."
  pairs:
    targets:
      - second.velocity
      - second.acceleration
    read: "Asymmetry carries downward — into [[Velocity]] and [[Acceleration]]"
  traces:
    targets:
      - second.traversal
      - second.rate
      - second.measure
      - second.change
  nests:
    targets: []
    read: "inside traversal as rate through closure scope before direction is added."
  reads:
    targets: []
    read: "where traversal through a scope can be evaluated as faster or slower per interval."
  carries:
    targets:
      - second.velocity
      - second.acceleration
      - second.drag
publish: true
status: stable
---
# Speed

Rate of traversal through a closure scope.

Speed is held by [[Traversal]], [[Rate]], and [[Measure]].

## Places

Speed places rate of traversal through a closure scope.

## Holds

Speed is held by [[Traversal]], [[Rate]], and [[Measure]].

## Pairs

Asymmetry carries downward. Speed is a singular condition — traversal measured as rate. The asymmetry is expressed in what speed carries: [[Velocity]] and [[Acceleration]].

## Traces

- [[Traversal]]
- [[Rate]]
- [[Measure]]
- [[Change]]

## Nests

Speed nests inside traversal as rate through closure scope before direction is added.

## Reads

Speed becomes recognisable where traversal through a scope can be evaluated as faster or slower per interval.

## Carries


- [[Velocity]]
- [[Acceleration]]
- [[Drag]]
