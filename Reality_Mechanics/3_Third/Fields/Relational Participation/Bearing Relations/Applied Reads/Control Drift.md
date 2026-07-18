---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.control-drift
determination: pd.2026-07-18.calibration-revision-set
domain: relational-participation

conditions:
  places: "the applied read where control departs from compatible directed availability, becoming incompatible carrying beyond the closure scope of its relational grounding."
  needs:
    targets:
      - third.applied-read
      - third.control
      - second.drift
      - second.dependency-disorder
      - second.closure-scope
  holds:
    targets:
      - third.applied-read
      - third.control
      - second.drift
      - second.dependency-disorder
      - second.closure-scope
    read: "[[Applied Read]], [[Control]], [[Drift]], [[Dependency Disorder]], and [[Closure Scope]]."
  pairs:
    targets:
      - third.control-after-harm
    read: "[[Control After Harm]]. Control Drift names the disorder where control loses retrace to what it was constraining; Control After Harm names the disorder where control is applied after harm without first restoring bearing. Each is a distinct form of control losing its structural ground."
  traces:
    targets:
      - third.applied-read
      - third.control
      - second.drift
      - second.dependency-disorder
      - second.closure-scope
  nests:
    targets: []
    read: "within Relational Participation as an applied read of Control, where direction of availability loses its compatible grounding."
  reads:
    targets: []
    read: "Control Drift becomes readable where direction continues after the bearing condition required for compatible proceeding has been displaced, forced, or made unable to correct the direction."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Control Drift

The applied read where control departs from compatible directed availability, becoming incompatible carrying beyond the closure scope of its relational grounding.

Control Drift is held by [[Applied Read]], [[Control]], [[Drift]], [[Dependency Disorder]], and [[Closure Scope]].

## Places

Control Drift places the applied read where control departs from compatible directed availability, becoming incompatible carrying beyond the closure scope of its relational grounding.

## Holds

Control Drift is held by [[Applied Read]], [[Control]], [[Drift]], [[Dependency Disorder]], and [[Closure Scope]].

## Pairs

Control Drift pairs with [[Control After Harm]]. Control Drift names the disorder where control loses retrace to what it was constraining; Control After Harm names the disorder where control is applied after harm without first restoring bearing. Each is a distinct form of control losing its structural ground.

## Traces

- [[Applied Read]]
- [[Control]]
- [[Drift]]
- [[Dependency Disorder]]
- [[Closure Scope]]

## Nests

Control Drift nests within Relational Participation as an applied read of Control, where direction of availability loses its compatible grounding.

## Reads

Control Drift becomes readable where direction continues after the bearing condition required for compatible proceeding has been displaced, forced, or made unable to correct the direction.

The dependency movement is:

First: [[Bearing]] and [[Availability]] must hold enough for direction to remain supportable.

Second: [[Drift]], [[Dependency Disorder]], and [[Closure Scope]] make departure from compatible direction and its forced continuation evaluable.

Third: [[Control Drift]] tests that condition inside the [[Relational Participation Field]] as an applied relation read.

Case Movement:

```text
availability is directed
-> bearing weakens
-> direction continues
-> correction from the directed condition is not received
-> control becomes forced proceeding
```

## Carries

This note carries no further public branch at this scope.
