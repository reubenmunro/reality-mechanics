---

grounded: true
register: practice
kind: term
ai_role: practice
condition_key: practice.retracing
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a participant following trace backward through connection."
  needs:
    targets:
      - first.trace
      - practice.practice
  holds:
    targets:
      - first.trace
      - practice.practice
    read: "[[Trace]] and [[Practice]]. A backward path must be available through connection, and a participant must enter it, before retracing occurs."
  pairs:
    targets:
      - second.carrying
      - practice.tracing
    read: "[[Carrying]] and [[Tracing]]. Carrying enacts connection forward; Retracing follows connection backward. Tracing locates or marks the trace that Retracing follows."
  traces:
    targets:
      - first.trace
      - practice.retrace-practice
      - practice.practice
  nests:
    targets: []
    read: "within higher-order or practice conditions."
  reads:
    targets: []
    read: "where a participant follows the backward availability of a connection, whether for return, checking, recovery, or understanding."
  carries:
    targets:
      - practice.carry-trace-test
      - practice.check
publish: true
status: working
---
# Retracing

A participant following trace backward through connection.

Retracing is held by [[Trace]] and [[Practice]]. A backward path must be available through connection, and a participant must enter it, before retracing occurs.

Trace is the backward availability offered by connection. Retracing is the act of entering and following that availability. Retracing may support checking, recovery, return, or understanding, but those purposes do not define the basic movement.

## Places

Retracing places a participant following trace backward through connection.

## Holds

Retracing is held by [[Trace]] and [[Practice]]. A backward path must be available through connection, and a participant must enter it, before retracing occurs.

## Pairs

Retracing pairs with [[Carrying]] and [[Tracing]]. Carrying enacts connection forward; Retracing follows connection backward. Tracing locates or marks the trace that Retracing follows.


## Traces

- [[Trace]]
- [[Retrace Practice]]
- [[Practice]]

## Nests

Retracing nests within higher-order or practice conditions.

## Reads

Retracing becomes recognisable where a participant follows the backward availability of a connection, whether for return, checking, recovery, or understanding.

## Carries

- [[Carry-Trace Test]]
- [[Check]]
