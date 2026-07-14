---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.condition
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a read held as available within the current closure scope."
  needs:
    targets:
      - second.readability
      - second.closure-scope
  holds:
    targets:
      - second.readability
      - second.closure-scope
    read: "[[Readability]] and [[Closure Scope]]."
  pairs:
    targets:
      - second.stability
    read: "Asymmetry carries downward — into [[Stability]]"
  traces:
    targets:
      - second.readability
      - second.closure-scope
  nests:
    targets: []
    read: "where a read is held as the state currently holding within closure scope."
  reads:
    targets: []
    read: "where a read can be identified as the state currently holding — where something can be said to be the case within the current scope."
  carries:
    targets:
      - second.stability
      - practice.terms-and-conditions
      - second.condition-state-view
publish: true
status: stable
---
# Condition

A read held as available within the current closure scope.

Condition is held by [[Readability]] and [[Closure Scope]].

## Places

Condition places a read held as available within the current closure scope.

## Holds

Condition is held by [[Readability]] and [[Closure Scope]].

## Pairs

Asymmetry carries downward. Condition is a singular structural term — the readable state held at a scope. The asymmetry is expressed in what condition carries: [[Stability]].

## Traces

- [[Readability]]
- [[Closure Scope]]

## Nests

Condition nests where a read is held as the state currently holding within closure scope.

## Reads

Condition becomes recognisable where a read can be identified as the state currently holding — where something can be said to be the case within the current scope.

## Carries


- [[Stability]]
- [[Terms and Conditions]]
- [[Condition, State, and View]]
