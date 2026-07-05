---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.maintained-coupling-failure
domain: relational-participation

needs:
  - "[[Applied Read]]"
  - "[[Maintained Coupling]]"
  - "[[Stability]]"
  - "[[Closure Scope]]"

conditions:
  places: "the applied read where maintained coupling loses its stability at a closure scope — where the condition of held distinct relation fails to sustain."
  holds: "[[Applied Read]], [[Maintained Coupling]], [[Stability]], and [[Closure Scope]]."
  pairs: "[[Maintained Coupling]]. Maintained Coupling names the held condition; Maintained Coupling Failure names its breakdown at scope."
  traces:
    - "[[Applied Read]]"
    - "[[Maintained Coupling]]"
    - "[[Stability]]"
    - "[[Closure Scope]]"
  nests: "within Relational Participation as an applied read of Maintained Coupling at the point of failure."
  reads: "Maintained Coupling Failure becomes readable where relation continues while the bearing required to sustain compatible coupling is no longer available."
  carries: []

publish: true
status: stable
---
# Maintained Coupling Failure

The applied read where maintained coupling loses its stability at a closure scope — where the condition of held distinct relation fails to sustain.

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
