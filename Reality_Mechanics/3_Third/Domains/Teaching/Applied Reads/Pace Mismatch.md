---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.pace-mismatch
determination: pd.v3.pre-provenance-baseline
domain: teaching

conditions:
  places: "the local teaching case where instruction continues faster than learning can be compatibly borne."
  needs:
    targets:
      - third.applied-read
      - third.learning-pace
      - third.teaching-boundary
      - second.capacity
      - second.overload
      - second.closure-scope
      - second.pace
      - third.teaching
  holds:
    targets:
      - third.applied-read
      - third.learning-pace
      - third.teaching-boundary
      - second.capacity
      - second.overload
      - second.closure-scope
      - second.pace
      - third.teaching
    read: "[[Applied Read]], [[Learning Pace]], [[Teaching Boundary]], [[Capacity]], [[Overload]], [[Closure Scope]], [[Pace]], [[Teaching]]."
  pairs:
    targets: []
    read: "No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read."
  traces:
    targets:
      - third.applied-read
      - third.learning-pace
      - third.teaching-boundary
      - second.capacity
      - second.overload
      - second.closure-scope
      - second.pace
      - third.teaching
  nests:
    targets: []
    read: "where this read holds at its field, domain, or practice scope without losing trace."
  reads:
    targets: []
    read: "Pace Mismatch becomes readable where instruction proceeds from the teacher's carrying while the learner's capacity for uptake is exceeded at the evaluated scope, and the overload has not yet corrected the teaching pace."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Pace Mismatch

The local teaching case where instruction continues faster than learning can be compatibly borne.

Pace Mismatch is held by [[Applied Read]], [[Learning Pace]], [[Teaching Boundary]], [[Capacity]], [[Overload]], [[Closure Scope]], [[Pace]], [[Teaching]].

## Places

Pace Mismatch places the local teaching case where instruction continues faster than learning can be compatibly borne.

## Holds

Pace Mismatch is held by [[Applied Read]], [[Learning Pace]], [[Teaching Boundary]], [[Capacity]], [[Overload]], [[Closure Scope]], [[Pace]], [[Teaching]].

## Pairs

No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read.

## Traces

- [[Applied Read]]
- [[Learning Pace]]
- [[Teaching Boundary]]
- [[Capacity]]
- [[Overload]]
- [[Closure Scope]]
- [[Pace]]
- [[Teaching]]

## Nests

Pace Mismatch nests where this read holds at its field, domain, or practice scope without losing trace.

## Reads

Pace Mismatch becomes readable where instruction proceeds from the teacher's carrying while the learner's capacity for uptake is exceeded at the evaluated scope, and the overload has not yet corrected the teaching pace.

The dependency movement is:

First: [[Bearing]], [[Availability]], and [[Threshold]] must hold enough for learning to continue.

Second: [[Capacity]], [[Overload]], [[Carrying]], [[Compatibility]], and [[Closure Scope]] make pace evaluable as supportable or mismatched.

Third: [[Pace Mismatch]] tests that condition inside the [[Knowledge Field]] as an applied teaching read.

Case Movement:

```text
instruction proceeds
→ learner carrying weakens
→ pace exceeds supportable capacity
→ learner uptake fails to correct instruction
→ teaching boundary needs repair
```

## Carries

This note carries no further public branch at this scope.
