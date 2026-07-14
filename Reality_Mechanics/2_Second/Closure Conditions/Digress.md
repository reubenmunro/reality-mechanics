---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.digress
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "traversal departing from the current scope."
  needs:
    targets:
      - second.traversal
  holds:
    targets:
      - second.traversal
    read: "[[Traversal]]."
  pairs:
    targets:
      - second.return
    read: "No lateral pair is required. Digress may open a later [[Return]], but Return does not require departure."
  traces:
    targets:
      - second.traversal
      - second.proceed
  nests:
    targets: []
    read: "where traversal departs from current scope while relation remains available."
  reads:
    targets: []
    read: "where traversal can be read as departing from the current scope — where participation moves outside the bounded extent without losing relation."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Digress

Traversal departing from the current scope.

Digress is held by [[Traversal]].

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
