---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.thread
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "followable continuity through a readable length, across terms, or within an order."
  needs:
    targets:
      - ground.term
      - first.trace
      - first.read
  holds:
    targets:
      - ground.term
      - first.trace
      - first.read
    read: "[[Term]], [[Trace]], and [[Read]]."
  pairs:
    targets:
      - first.thread
      - higher.recursion
    read: "Term, Trace, and Read carry forward — into [[Thread]]. Thread is the continuity that holds when following, reading, and terms are sustained through a readable length. Thread's structural complements appear at other orders: Terminal at second order names where the strand ends; [[Recursion]] at higher order names where carrying folds back."
  traces:
    targets:
      - ground.term
      - first.trace
      - first.read
  nests:
    targets: []
    read: "as the continuity by which a read can be followed through a term, across terms, or within an order."
  reads:
    targets: []
    read: "where a read remains followable across a readable length without yet crossing the terminal boundary of that read."
  carries:
    targets:
      - second.terminal
      - higher.fabric
      - higher.web
      - second.order_terminal
publish: true
status: stable
---
# Thread

Followable continuity through a readable length, across terms, or within an order.

Thread is held by [[Term]], [[Trace]], and [[Read]].

[[Fabric]] names many threads held together as woven continuity. Thread is the strand that can be followed before the fabric has to be read as a whole.

A thread continues while the same read remains followable. It reaches [[Terminal]] where that continuity can no longer continue as the same read.

## Places

Thread places followable continuity through a readable length, across terms, or within an order.

## Holds

Thread is held by [[Term]], [[Trace]], and [[Read]].

## Pairs

[[Term]], [[Trace]], and [[Read]] carry forward into Thread. Thread is the continuity that holds when following, reading, and terms are sustained through a readable length. Its complements appear at other orders: [[Terminal]] names where the strand can no longer be followed as the same read; [[Recursion]] names where carrying folds back into its own condition.

## Traces

- [[Term]]
- [[Trace]]
- [[Read]]

## Nests

Thread nests as the continuity by which a read can be followed through a term, across terms, or within an order.

## Reads

Thread becomes recognisable where a read remains followable across a readable length without yet crossing the terminal boundary of that read.

## Carries

- [[Terminal]]
- [[Fabric]]
- [[Web]]
- [[Order-Terminal]]
