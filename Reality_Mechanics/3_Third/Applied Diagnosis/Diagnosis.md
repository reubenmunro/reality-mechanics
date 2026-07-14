---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.diagnosis
determination: pd.v3.pre-provenance-baseline
domain: applied-diagnosis

conditions:
  places: "an applied read that traces an unresolved condition back through dependency order to locate where readability, carrying, or resolution has become unavailable."
  needs:
    targets:
      - third.applied-read
      - ground.structural-disorder
      - ground.dependency-order
      - second.closure-scope
  holds:
    targets:
      - third.applied-read
      - ground.structural-disorder
      - ground.dependency-order
      - second.closure-scope
    read: "[[Applied Read]], [[Structural Disorder]], [[Dependency Order]], and [[Closure Scope]]."
  pairs:
    targets:
      - third.placement-mode
    read: "[[Placement Mode]]. Placement Mode sorts by carrying mode; Diagnosis tests how a path read applies in a bounded case. Each is a distinct operation on a path read."
  traces:
    targets:
      - third.applied-read
      - ground.structural-disorder
      - ground.dependency-order
      - second.closure-scope
  nests:
    targets: []
    read: "where applied reads are tested against a bounded local condition."
  reads:
    targets:
      - ground.structural-disorder
    read: "Diagnosis is readable where an unresolved condition is traced by asking what asymmetry is present, where it can be bounded, what order unfolds, and whether resolution determines coupling, recurrence, release, collapse, or return to [[Structural Disorder]]."
  carries:
    targets:
      - third.space-based-solar-power
      - third.extractive-acceleration
publish: true
status: stable
---
# Diagnosis

An applied read that traces an unresolved condition back through dependency order to locate where readability, carrying, or resolution has become unavailable.

Diagnosis is held by [[Applied Read]], [[Structural Disorder]], [[Dependency Order]], and [[Closure Scope]].

## Places

Diagnosis places an applied read that traces an unresolved condition back through dependency order to locate where readability, carrying, or resolution has become unavailable.

## Holds

Diagnosis is held by [[Applied Read]], [[Structural Disorder]], [[Dependency Order]], and [[Closure Scope]].

## Pairs

Diagnosis pairs with [[Placement Mode]]. Placement Mode sorts by carrying mode; Diagnosis tests how a path read applies in a bounded case. Each is a distinct operation on a path read.

## Traces

- [[Applied Read]]
- [[Structural Disorder]]
- [[Dependency Order]]
- [[Closure Scope]]

## Nests

Diagnosis nests where applied reads are tested against a bounded local condition.

## Reads

Diagnosis is readable where an unresolved condition is traced by asking what asymmetry is present, where it can be bounded, what order unfolds, and whether resolution determines coupling, recurrence, release, collapse, or return to [[Structural Disorder]].
## Carries

- [[Space-Based Solar Power]]
- [[Extractive Acceleration]]
