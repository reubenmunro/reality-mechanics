---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.fatigue-boundary
domain: body

needs:
  - "[[Applied Read]]"
  - "[[Fatigue]]"
  - "[[Capacity]]"
  - "[[Compatibility]]"
  - "[[Control]]"

conditions:
  places: "the applied read of the located limit on available carrying — the closure scope at which continued participation becomes incompatible with current capacity."
  holds: "[[Applied Read]], [[Fatigue]], [[Capacity]], [[Compatibility]], and [[Control]]. Fatigue must be readable and capacity must be locally evaluable before the limit on compatible carrying can be named."
  pairs: "No lateral pair is required at this placement yet. Fatigue Boundary names the applied read that locates the edge of compatible continuation under fatigue; no contrasting applied read exists in the Body field at this time."
  traces:
    - "[[Applied Read]]"
    - "[[Fatigue]]"
    - "[[Capacity]]"
    - "[[Compatibility]]"
    - "[[Control]]"
    - "[[Body]]"
  nests: "within the Body Field as an applied read of Fatigue at the boundary of compatible carrying."
  reads: "Fatigue Boundary becomes readable where reduced availability is sensed and the next action either respects, adjusts, supports, or overrides that limit."
  carries: []

publish: true
status: stable
---
# Fatigue Boundary

The applied read of the located limit on available carrying — the closure scope at which continued participation becomes incompatible with current capacity.

## Places

Fatigue Boundary places the applied read of the located limit on available carrying — the closure scope at which continued participation becomes incompatible with current capacity.

## Holds

Fatigue Boundary is held by [[Applied Read]], [[Fatigue]], [[Capacity]], [[Compatibility]], and [[Control]]. Fatigue must be readable and capacity must be locally evaluable before the limit on compatible carrying can be named.

## Pairs

No lateral pair is required at this placement yet. Fatigue Boundary names the applied read that locates the edge of compatible continuation under fatigue; no contrasting applied read exists in the Body field at this time.

## Traces

- [[Applied Read]]
- [[Fatigue]]
- [[Capacity]]
- [[Compatibility]]
- [[Control]]

- [[Body]]
## Nests

Fatigue Boundary nests within the Body Field as an applied read of Fatigue at the boundary of compatible carrying.

## Reads

Fatigue Boundary becomes readable where reduced availability is sensed and the next action either respects, adjusts, supports, or overrides that limit.

The dependency movement is:

First: [[Boundary]], [[Availability]], and [[Strain]] must hold enough for fatigue to become readable as a limit.

Second: [[Capacity]], [[Compatibility]], and [[Closure Scope]] make continued effort evaluable as supportable or incompatible.

Third: [[Fatigue Boundary]] tests that condition inside the [[Body Field]] as an applied body read.

Case Movement:

```text
fatigue becomes readable
-> boundary of available effort is located
-> capacity for continued action is checked
-> action adjusts, pauses, or receives support
-> or the read is overridden and strain becomes incompatible
```

## Carries

This note carries no further public branch at this scope.
