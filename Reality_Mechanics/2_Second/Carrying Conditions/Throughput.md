---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.throughput
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "flow measured through a boundary or medium at a rate."
  needs:
    targets:
      - second.flow
      - second.rate
      - first.boundary
  holds:
    targets:
      - second.flow
      - second.rate
      - first.boundary
    read: "[[Flow]], [[Rate]], and [[Boundary]]."
  pairs:
    targets:
      - second.rate
      - first.boundary
    read: "Asymmetry carries downward — flow through [[Rate]] and [[Boundary]]"
  traces:
    targets:
      - second.flow
      - second.rate
      - first.boundary
  nests:
    targets: []
    read: "inside flow as amount passing through a medium or boundary per interval."
  reads:
    targets: []
    read: "where carrying through a medium or boundary can be measured as amount per interval."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Throughput

Flow measured through a boundary or medium at a rate.

Throughput is held by [[Flow]], [[Rate]], and [[Boundary]].

## Places

Throughput places flow measured through a boundary or medium at a rate.

## Holds

Throughput is held by [[Flow]], [[Rate]], and [[Boundary]].

## Pairs

Asymmetry carries downward. Throughput is a singular condition — flow measured through [[Rate]] at a [[Boundary]]. There is no lateral contrast required at this level.

## Traces

- [[Flow]]
- [[Rate]]
- [[Boundary]]

## Nests

Throughput nests inside flow as amount passing through a medium or boundary per interval.

## Reads

Throughput becomes recognisable where carrying through a medium or boundary can be measured as amount per interval.

## Carries


