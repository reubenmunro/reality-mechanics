---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.digress

needs:
  - "[[Traversal]]"

conditions:
  places: "traversal departing from the current scope."
  holds: "[[Traversal]]."
  pairs: "No lateral pair is required. Digress may open a later [[Return]], but Return does not require departure."
  traces:
    - "[[Traversal]]"
    - "[[Proceed]]"
  nests: "where traversal departs from current scope while relation remains available."
  reads: "where traversal can be read as departing from the current scope — where participation moves outside the bounded extent without losing relation."
  carries: []

publish: true
status: stable
---
# Digress

Traversal departing from the current scope.

## Places

Digress places traversal departing from the current scope.

## Holds

Digress is held by [[Traversal]].

## Pairs

No lateral pair is required. Digress may open a later [[Return]], but Return does not require departure.

## Traces

- [[Traversal]]
- [[Proceed]]

## Nests

Digress nests where traversal departs from current scope while relation remains available.

## Reads

Digress becomes recognisable where traversal can be read as departing from the current scope — where participation moves outside the bounded extent without losing relation.

## Carries
