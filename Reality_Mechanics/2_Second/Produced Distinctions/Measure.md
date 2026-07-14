---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.measure
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a read compared against a bounded unit or scale."
  needs:
    targets:
      - second.scale
      - second.closure-scope
  holds:
    targets:
      - second.scale
      - second.closure-scope
    read: "[[Scale]] and [[Closure Scope]]."
  pairs:
    targets:
      - second.unit
      - second.rate
    read: "Asymmetry carries downward — into [[Unit]] and [[Rate]]"
  traces:
    targets:
      - second.scale
      - second.closure-scope
      - second.interval
      - second.number
  nests:
    targets: []
    read: "where extent, recurrence, interval, or change can be evaluated against unit or scale."
  reads:
    targets: []
    read: "where a condition can be evaluated as more, less, equal, repeated, or extended against a readable unit or scale."
  carries:
    targets:
      - second.unit
      - second.rate
      - second.speed
publish: true
status: stable
---
# Measure

A read compared against a bounded unit or scale.

Measure is held by [[Scale]] and [[Closure Scope]].

## Places

Measure places a read compared against a bounded unit or scale.

## Holds

Measure is held by [[Scale]] and [[Closure Scope]].

## Pairs

Asymmetry carries downward. Measure is a singular condition — the reading of scale against a closure scope. The asymmetry is expressed in what measure carries: [[Unit]] and [[Rate]].

## Traces

- [[Scale]]
- [[Closure Scope]]
- [[Interval]]
- [[Number]]

## Nests

Measure nests where extent, recurrence, interval, or change can be evaluated against unit or scale.

## Reads

Measure becomes recognisable where a condition can be evaluated as more, less, equal, repeated, or extended against a readable unit or scale.

## Carries


- [[Unit]]
- [[Rate]]
- [[Speed]]
