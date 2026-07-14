---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.order_terminal
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "terminality relative to an order — the point where a readable length completes within its order and cannot continue as the same read."
  needs:
    targets:
      - ground.term
      - first.thread
      - second.terminal
  holds:
    targets:
      - ground.term
      - first.thread
      - second.terminal
    read: "[[Term]], [[Thread]], and [[Terminal]]. A term carries a readable length; thread carries the continuity of the read through that length; terminal names the limit of readability at the current closure scope."
  pairs:
    targets:
      - second.order_terminal
    read: "Terminal carries downward — into [[Order-Terminal]]. Order-terminal is a role/condition of completion; no lateral complement holds the same position."
  traces:
    targets:
      - ground.term
      - first.thread
      - second.terminal
  nests:
    targets: []
    read: "where a term completes the readable length of an order without ending relation itself."
  reads:
    targets: []
    read: "where continuation would cross the closure scope of the current order, requiring re-entry, restart, or lifting into another order."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Order-Terminal

Terminality relative to an order — the point where a readable length completes within its order and cannot continue as the same read.

Order-terminal is held by [[Term]], [[Thread]], and [[Terminal]]. A term carries a readable length; thread carries the continuity of the read through that length; terminal names the limit of readability at the current closure scope.

A term carries a readable length of relation. [[Terminal]] names where a current read stops because continuation crosses a closure scope the read cannot follow. Order-terminal marks the term-position where a thread through an order completes enough that continuation cannot remain the same read.

Order-terminal does not end relation. What continues must be re-entered, restarted, or lifted into another order.

## Places

Order-terminal places terminality relative to an order — the point where a readable length completes within its order and cannot continue as the same read.

## Holds

Order-terminal is held by [[Term]], [[Thread]], and [[Terminal]]. A term carries a readable length; thread carries the continuity of the read through that length; terminal names the limit of readability at the current closure scope.

## Pairs

[[Terminal]] carries downward into Order-Terminal. Order-terminal is a role-condition of completion.

## Traces

- [[Term]]
- [[Thread]]
- [[Terminal]]

## Nests

Order-terminal nests where a term completes the readable length of an order without ending relation itself.

Its instances are recognised across orders rather than carried as descendants:

- [[Resolution]] — order-terminal of first order
- [[Nesting]] — order-terminal of third order
- [[Recursion]] — order-terminal of higher order

No second-order instance is presently confirmed. [[Coupling]] precedes [[Presence]], [[Bearing Relation]], and [[Participation]] inside Second Order, so it does not complete that order's readable length.

## Reads

Order-terminal becomes recognisable where continuation would cross the closure scope of the current order, requiring re-entry, restart, or lifting into another order.

## Carries

Order-terminal carries no further public branch at this scope. Its instances are recorded under Nests.
