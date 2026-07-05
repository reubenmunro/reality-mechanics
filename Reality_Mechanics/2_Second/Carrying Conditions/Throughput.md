---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.throughput

needs:
  - "[[Flow]]"
  - "[[Rate]]"
  - "[[Boundary]]"

conditions:
  places: "flow measured through a boundary or medium at a rate."
  holds: "[[Flow]], [[Rate]], and [[Boundary]]."
  pairs: "Asymmetry carries downward — flow through [[Rate]] and [[Boundary]]"
  traces:
    - "[[Flow]]"
    - "[[Rate]]"
    - "[[Boundary]]"
  nests: "inside flow as amount passing through a medium or boundary per interval."
  reads: "where carrying through a medium or boundary can be measured as amount per interval."
  carries: []

publish: true
status: stable
---
# Throughput

Flow measured through a boundary or medium at a rate.

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


