---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.terminal
determination: pd.v3.pre-provenance-baseline
conditions:
  places: "the boundary where a read stops because continuation crosses a closure scope the current read cannot follow."
  needs:
    targets:
      - first.thread
      - second.closure-scope
      - first.boundary
  holds:
    targets:
      - first.thread
      - second.closure-scope
      - first.boundary
    read: "[[Thread]], [[Closure Scope]], and [[Boundary]]."
  pairs:
    targets:
      - second.terminal
    read: "Thread carries downward — into [[Terminal]]. Terminal names where the followable strand can no longer continue as the same read."
  traces:
    targets:
      - first.thread
      - second.closure-scope
      - first.boundary
  nests:
    targets: []
    read: "where the current closure scope cannot follow continuation though carrying continues beyond it."
  reads:
    targets: []
    read: "where a read can no longer be followed across a boundary, not because carrying has ceased, but because continuation has crossed into a closure scope unavailable to the current read."
  carries:
    targets:
      - second.collapse
      - second.order_terminal
      - third.translation-boundary
publish: true
status: stable
---
# Terminal

The boundary where a read stops because continuation crosses a closure scope the current read cannot follow.

Terminal is held by [[Thread]], [[Closure Scope]], and [[Boundary]].

## Places

Terminal places the boundary where a read stops because continuation crosses a closure scope the current read cannot follow.

## Holds

Terminal is held by [[Thread]], [[Closure Scope]], and [[Boundary]].

## Pairs

[[Thread]] carries downward — into Terminal. Terminal names where the followable strand can no longer continue as the same read: where continuation crosses a closure scope the current read cannot follow.


## Traces

- [[Thread]]
- [[Closure Scope]]
- [[Boundary]]

## Nests

Terminal nests where the current closure scope cannot follow continuation though carrying continues beyond it.

## Reads

Terminal becomes recognisable where a read can no longer be followed across a boundary, not because carrying has ceased, but because continuation has crossed into a closure scope unavailable to the current read.
## Carries

- [[Collapse]]
- [[Order-Terminal]]
- [[Translation Boundary]]

## Order-Terminal

Order-terminal names terminal relative to an order. It is the condition where a readable length completes within its order and cannot continue as the same read without re-entry, restart, or lifting into another order. Order-terminal does not mean the order is dead or final; it means the current read has reached the limit at which continuing changes the kind of passage being read.
