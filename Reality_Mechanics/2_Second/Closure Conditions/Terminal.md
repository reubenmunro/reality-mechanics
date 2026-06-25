---
grounded: true
order: second
kind: term
ai_role: term
condition_key: second.terminal
needs:
- '[[Thread]]'
- '[[Closure Scope]]'
- '[[Boundary]]'
conditions:
  places: the boundary where a read stops because continuation crosses a closure scope
    the current read cannot follow.
  holds: '[[Thread]], [[Closure Scope]], and [[Boundary]].'
  pairs: "Thread carries downward — into [[Terminal]]. Terminal names where the followable strand can no longer continue as the same read."
  traces:
  - '[[Thread]]'
  - '[[Closure Scope]]'
  - '[[Boundary]]'
  nests: where the current closure scope cannot follow continuation though carrying
    continues beyond it.
  reads: where a read can no longer be followed across a boundary, not because carrying
    has ceased, but because continuation has crossed into a closure scope unavailable
    to the current read.
  carries:
  - '[[Collapse]]'
  - '[[Order-Terminal]]'
  - '[[Translation Boundary]]'

publish: true
status: stable
garden_status: rooted
---
# Terminal

Terminal names the boundary where a read stops because continuation crosses a closure scope the current read cannot follow. Where threshold names a located condition that can hold or shift while reading continues, and a crossing hands a read off into the next register, terminal names where reading ends while bearing continues unread beyond the available scale. A terminal is not an end: what is carried continues past it. It names the limit of readability at the current closure scope, not the limit of carrying.

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
