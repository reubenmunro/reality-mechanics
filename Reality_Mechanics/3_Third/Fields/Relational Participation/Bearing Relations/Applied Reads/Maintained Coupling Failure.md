---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.maintained-coupling-failure
determination: pd.v3.pre-provenance-baseline
domain: relational-participation

conditions:
  places: "the applied read where maintained coupling loses its stability at a closure scope — where the condition of held distinct relation fails to sustain."
  needs:
    targets:
      - third.applied-read
      - third.maintained-coupling
      - second.stability
      - second.closure-scope
  holds:
    targets:
      - third.applied-read
      - third.maintained-coupling
      - second.stability
      - second.closure-scope
    read: "[[Applied Read]], [[Maintained Coupling]], [[Stability]], and [[Closure Scope]]."
  pairs:
    targets:
      - third.maintained-coupling
    read: "[[Maintained Coupling]]. Maintained Coupling names the held condition; Maintained Coupling Failure names its breakdown at scope."
  traces:
    targets:
      - third.applied-read
      - third.maintained-coupling
      - second.stability
      - second.closure-scope
  nests:
    targets: []
    read: "within Relational Participation as an applied read of Maintained Coupling at the point of failure."
  reads:
    targets: []
    read: "Maintained Coupling Failure becomes readable where relation continues while the bearing required to sustain compatible coupling is no longer available."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Maintained Coupling Failure

The applied read where maintained coupling loses its stability at a closure scope — where the condition of held distinct relation fails to sustain.

Maintained Coupling Failure is held by [[Applied Read]], [[Maintained Coupling]], [[Stability]], and [[Closure Scope]].

## Places

Maintained Coupling Failure places the applied read where maintained coupling loses its stability at a closure scope — where the condition of held distinct relation fails to sustain.

## Holds

Maintained Coupling Failure is held by [[Applied Read]], [[Maintained Coupling]], [[Stability]], and [[Closure Scope]].

## Pairs

Maintained Coupling Failure pairs with [[Maintained Coupling]]. Maintained Coupling names the held condition; Maintained Coupling Failure names its breakdown at scope.

## Traces

- [[Applied Read]]
- [[Maintained Coupling]]
- [[Stability]]
- [[Closure Scope]]

## Nests

Maintained Coupling Failure nests within Relational Participation as an applied read of Maintained Coupling at the point of failure.

## Reads

Maintained Coupling Failure becomes readable where relation continues while the bearing required to sustain compatible coupling is no longer available.

The dependency movement is:

First: [[Bearing]] and [[Strain]] must hold enough for coupling to remain supportable.

Second: [[Stability]], [[Carrying]], and [[Closure Scope]] make maintained coupling evaluable as supported recurrence or unstable continuation.

Third: [[Maintained Coupling Failure]] tests that condition inside the [[Relational Participation Field]] as an applied relation read.

Case Movement:

```text
coupling persists
-> recurring strain remains
-> supportive bearing fails
-> maintained coupling becomes unstable continuation
```

## Carries

This note carries no further public branch at this scope.
