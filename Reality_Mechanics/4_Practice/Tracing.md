---

grounded: true
register: practice
kind: term
ai_role: practice
condition_key: practice.tracing
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the practice of locating or marking a trace so its backward availability becomes readable."
  needs:
    targets:
      - first.trace
      - practice.practice
  holds:
    targets:
      - first.trace
      - practice.practice
    read: "[[Trace]] and [[Practice]]."
  pairs:
    targets:
      - practice.retracing
    read: "[[Retracing]]. Tracing locates or marks a trace; Retracing follows that trace backward through connection."
  traces:
    targets:
      - first.trace
      - practice.practice
      - practice.retrace-practice
  nests:
    targets: []
    read: "within higher-order or practice conditions."
  reads:
    targets: []
    read: "where a participant makes the backward availability of a connection explicit enough to be followed."
  carries:
    targets:
      - practice.check
publish: true
status: stable
---
# Tracing

The practice of locating or marking a trace so its backward availability becomes readable.

Tracing is held by [[Trace]] and [[Practice]].

## Places

Tracing places the practice of locating or marking a trace so its backward availability becomes readable.

## Holds

Tracing is held by [[Trace]] and [[Practice]].

## Pairs

Tracing pairs with [[Retracing]]. Tracing locates or marks a trace; Retracing follows that trace backward through connection.


## Traces

- [[Trace]]
- [[Practice]]
- [[Retrace Practice]]

## Nests

Tracing nests within higher-order or practice conditions.

## Reads

Tracing becomes recognisable where a participant makes the backward availability of a connection explicit enough to be followed.

## Carries

- [[Check]]

A located trace also offers retracing, but a participant may or may not follow it.
