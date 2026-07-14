---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.dependency
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "one condition requiring another to remain available."
  needs:
    targets:
      - ground.dependency-order
      - second.carrying
  holds:
    targets:
      - ground.dependency-order
      - second.carrying
    read: "[[Dependency Order]] and [[Carrying]]."
  pairs:
    targets:
      - second.dependency-disorder
    read: "[[Dependency Disorder]]. Dependency names required support; Dependency Disorder names disorder where required support is misread, missing, or displaced."
  traces:
    targets:
      - ground.dependency-order
      - second.carrying
  nests:
    targets: []
    read: "inside carrying where one condition requires another to remain available."
  reads:
    targets: []
    read: "where a condition cannot remain available without another condition also holding — where carrying is conditional on what else must be carried."
  carries:
    targets:
      - second.dependency-disorder
publish: true
status: stable
---
# Dependency

One condition requiring another to remain available.

Dependency is held by [[Dependency Order]] and [[Carrying]].

## Places

Dependency places one condition requiring another to remain available.

## Holds

Dependency is held by [[Dependency Order]] and [[Carrying]].

## Pairs

Dependency pairs with [[Dependency Disorder]]. Dependency names required support; Dependency Disorder names disorder where required support is misread, missing, or displaced.

## Traces

- [[Dependency Order]]
- [[Carrying]]

## Nests

Dependency nests inside carrying where one condition requires another to remain available.

## Reads

Dependency becomes recognisable where a condition cannot remain available without another condition also holding — where carrying is conditional on what else must be carried.

## Carries


- [[Dependency Disorder]]
