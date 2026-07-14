---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.closure
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a read becoming bounded enough for evaluation."
  needs:
    targets:
      - first.boundary
      - first.resolution
  holds:
    targets:
      - first.boundary
      - first.resolution
    read: "[[Boundary]] and [[Resolution]]. A read must be bounded and determined enough to be evaluated."
  pairs:
    targets:
      - second.closure-scope
      - second.scope
    read: "Asymmetry carries downward — into [[Closure Scope]] via [[Scope]]"
  traces:
    targets:
      - first.boundary
      - first.resolution
  nests:
    targets: []
    read: "as a second-order support root. It makes evaluation, traversal, scope, and local holding possible without requiring finality."
  reads:
    targets: []
    read: "where a read is bounded enough to be evaluated — where something can be assessed as holding or not holding within a delimited extent."
  carries:
    targets:
      - second.closure-scope
      - second.scope
      - second.decision
publish: true
status: stable
---
# Closure

A read becoming bounded enough for evaluation.

Closure is held by [[Boundary]] and [[Resolution]]. A read must be bounded and determined enough to be evaluated.

## Places

Closure places a read becoming bounded enough for evaluation.

## Holds

Closure is held by [[Boundary]] and [[Resolution]]. A read must be bounded and determined enough to be evaluated.

## Pairs

Asymmetry carries downward. Closure is a singular condition — the bounding of resolution at a [[Scope]]. There is no lateral contrast at the closure level. The asymmetry is expressed in [[Closure Scope]]: closure does not finish before closure scope begins; closure scope is closure remaining bounded while its range becomes locatable.

## Traces

- [[Boundary]]
- [[Resolution]]

## Nests

Closure nests as a second-order support root. It makes evaluation, traversal, scope, and local holding possible without requiring finality.

## Reads

Closure becomes recognisable where a read is bounded enough to be evaluated — where something can be assessed as holding or not holding within a delimited extent.
## Carries


- [[Closure Scope]]
- [[Scope]]
- [[Decision]]
