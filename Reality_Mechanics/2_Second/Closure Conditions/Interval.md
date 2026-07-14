---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.interval
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a bounded separation within traversal."
  needs:
    targets:
      - second.occur
      - second.traversal
      - second.closure-scope
  holds:
    targets:
      - second.occur
      - second.traversal
      - second.closure-scope
    read: "[[Occur]], [[Traversal]], and [[Closure Scope]]."
  pairs:
    targets:
      - second.period
      - second.rate
      - second.measure
    read: "Asymmetry carries downward — into [[Period]], [[Rate]], and [[Measure]]"
  traces:
    targets:
      - second.occur
      - second.traversal
      - second.closure-scope
      - first.time
  nests:
    targets: []
    read: "inside traversal as bounded between-condition that can align, separate, pause, or return."
  reads:
    targets: []
    read: "where traversal can be read through a bounded between: before and after, here and there, one occurrence and another. An interval is not empty by default; it can carry relation by letting what surrounds it align, separate, pause, or return."
  carries:
    targets:
      - second.period
      - second.rate
      - second.measure
      - second.rhythm
      - second.acceleration
publish: true
status: stable
---
# Interval

A bounded separation within traversal.

Interval is held by [[Occur]], [[Traversal]], and [[Closure Scope]].

## Places

Interval places a bounded separation within traversal.

## Holds

Interval is held by [[Occur]], [[Traversal]], and [[Closure Scope]].

## Pairs

Asymmetry carries downward. Interval is a singular condition — the traversal between occurrences. The asymmetry is expressed in what interval carries: [[Period]], [[Rate]], and [[Measure]].

## Traces

- [[Occur]]
- [[Traversal]]
- [[Closure Scope]]
- [[Time]]

## Nests

Interval nests inside traversal as bounded between-condition that can align, separate, pause, or return.

## Reads

Interval becomes recognisable where traversal can be read through a bounded between: before and after, here and there, one occurrence and another. An interval is not empty by default; it can carry relation by letting what surrounds it align, separate, pause, or return.

## Carries


- [[Period]]
- [[Rate]]
- [[Measure]]
- [[Rhythm]]
- [[Acceleration]]
