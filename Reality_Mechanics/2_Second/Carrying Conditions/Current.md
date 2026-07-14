---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.current
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "directed flow through a medium."
  needs:
    targets:
      - second.flow
      - first.orientation
      - second.medium
  holds:
    targets:
      - second.flow
      - first.orientation
      - second.medium
    read: "[[Flow]], [[Orientation]], and [[Medium]]."
  pairs:
    targets:
      - first.orientation
      - second.medium
    read: "Asymmetry carries downward — flow through [[Orientation]] and [[Medium]]"
  traces:
    targets:
      - second.flow
      - first.orientation
      - second.medium
  nests:
    targets: []
    read: "inside flow as oriented carrying through a medium."
  reads:
    targets: []
    read: "where flow can be read as moving in a direction through a medium."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Current

Directed flow through a medium.

Current is held by [[Flow]], [[Orientation]], and [[Medium]].

## Places

Current places directed flow through a medium.

## Holds

Current is held by [[Flow]], [[Orientation]], and [[Medium]].

## Pairs

Asymmetry carries downward. Current is a singular condition — flow directed through [[Orientation]] and [[Medium]]. There is no lateral contrast required at this level.

## Traces

- [[Flow]]
- [[Orientation]]
- [[Medium]]

## Nests

Current nests inside flow as oriented carrying through a medium.

## Reads

Current becomes recognisable where flow can be read as moving in a direction through a medium.

## Carries

