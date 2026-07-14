---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.dependency-disorder
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "disorder in which the dependency path itself becomes unreadable."
  needs:
    targets:
      - second.disorder
      - ground.dependency-order
  holds:
    targets:
      - second.disorder
      - ground.dependency-order
    read: "[[Disorder]] and [[Dependency Order]]."
  pairs:
    targets:
      - second.dependency
    read: "[[Dependency]]. Dependency names required support; Dependency Disorder names the dependency path becoming unreadable."
  traces:
    targets:
      - second.disorder
      - ground.dependency-order
      - ground.structural-disorder
      - second.dependency
  nests:
    targets: []
    read: "where the trace required to re-establish a read is obscured, bypassed, displaced, reversed, or forced."
  reads:
    targets: []
    read: "where a condition appears to proceed while the dependency required for its carrying has been bypassed, displaced, or forced — where the trace back to what must hold is no longer available."
  carries:
    targets:
      - second.collapse
      - second.delayed-availability
      - second.second-order-disorder-effects
publish: true
status: stable
---
# Dependency Disorder

Disorder in which the dependency path itself becomes unreadable.

Dependency Disorder is held by [[Disorder]] and [[Dependency Order]].

## Places

Dependency Disorder places disorder in which the dependency path itself becomes unreadable.

## Holds

Dependency Disorder is held by [[Disorder]] and [[Dependency Order]].

## Pairs

Dependency Disorder pairs with [[Dependency]]. Dependency names required support; Dependency Disorder names the dependency path becoming unreadable.

## Traces

- [[Disorder]]
- [[Dependency Order]]
- [[Structural Disorder]]
- [[Dependency]]

## Nests

Dependency Disorder nests where the trace required to re-establish a read is obscured, bypassed, displaced, reversed, or forced.

## Reads

Dependency disorder becomes recognisable where a condition appears to proceed while the dependency required for its carrying has been bypassed, displaced, or forced — where the trace back to what must hold is no longer available.

## Carries


- [[Collapse]]
- [[Delayed Availability]]
- [[Second-Order Disorder Effects]]
