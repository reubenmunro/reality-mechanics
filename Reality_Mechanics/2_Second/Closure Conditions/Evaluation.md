---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.evaluation

needs:
  - "[[Closure Scope]]"

conditions:
  places: "a read being assessed within a closure scope."
  holds: "[[Closure Scope]]."
  pairs: "Asymmetry carries downward — into [[Observation]]"
  traces:
    - "[[Closure Scope]]"
    - "[[Decision]]"
  nests: "where a read is actively checked, compared, judged, or assessed within scope."
  reads: "where a read is being actively assessed rather than merely available — where something is being checked, compared, or judged within the current scope."
  carries:
    - "[[Observation]]"
    - "[[Progress]]"

publish: true
status: stable
---
# Evaluation

A read being assessed within a closure scope.

## Places

Evaluation places a read being assessed within a closure scope.

## Holds

Evaluation is held by [[Closure Scope]].

## Pairs

Evaluation is vertical. It names a read being actively assessed within scope, and carries this forward into [[Observation]]. No lateral pair is required — assessment within scope has no structural sibling at this order.

## Traces

- [[Closure Scope]]
- [[Decision]]

## Nests

Evaluation nests where a read is actively checked, compared, judged, or assessed within scope.

## Reads

Evaluation becomes recognisable where a read is being actively assessed rather than merely available — where something is being checked, compared, or judged within the current scope.

## Carries


- [[Observation]]
- [[Progress]]
