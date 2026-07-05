---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.fatigue
domain: body

needs:
  - "[[Body]]"
  - "[[Strain]]"
  - "[[Load]]"
  - "[[Capacity]]"
  - "[[Availability]]"
  - "[[Carrying]]"
  - "[[Compatibility]]"
  - "[[Closure Scope]]"

conditions:
  places: "embodied reduction in available carrying where continued participation requires rest, pacing, support, release, or recovery."
  holds: "[[Body]], [[Strain]], [[Load]], [[Capacity]], [[Availability]], [[Carrying]], [[Compatibility]], and [[Closure Scope]]. Accumulated load must reduce available capacity before the limit on continued participation can be named as fatigue."
  pairs: "[[Recovery]]. Fatigue names the reduction in available carrying through accumulated load; Recovery names the restoration of compatible carrying following fatigue or injury."
  traces:
    - "[[Body]]"
    - "[[Strain]]"
    - "[[Load]]"
    - "[[Capacity]]"
    - "[[Availability]]"
    - "[[Carrying]]"
    - "[[Compatibility]]"
    - "[[Closure Scope]]"
  nests: "within the Body Field as the structural condition through which accumulated load reduces what can be carried — the ground for recovery, fatigue boundary, and capacity reads."
  reads: "Fatigue becomes readable where accumulated load reduces available capacity and changes what the body can carry without further incompatibility."
  carries:
    - "[[Recovery]]"
    - "[[Fatigue Boundary]]" 

publish: true
status: stable
---
# Fatigue

Embodied reduction in available carrying where continued participation requires rest, pacing, support, release, or recovery.

Fatigue is held by [[Body]], [[Strain]], [[Load]], [[Capacity]], [[Availability]], [[Carrying]], [[Compatibility]], and [[Closure Scope]]. Accumulated load must reduce available capacity before the limit on continued participation can be named as fatigue.

## Places

Fatigue places embodied reduction in available carrying where continued participation requires rest, pacing, support, release, or recovery.

## Holds

Fatigue is held by [[Body]], [[Strain]], [[Load]], [[Capacity]], [[Availability]], [[Carrying]], [[Compatibility]], and [[Closure Scope]]. Accumulated load must reduce available capacity before the limit on continued participation can be named as fatigue.

## Pairs

Fatigue pairs with [[Recovery]]. Fatigue names the reduction in available carrying through accumulated load; Recovery names the restoration of compatible carrying following fatigue or injury.

## Traces

- [[Body]]
- [[Strain]]
- [[Load]]
- [[Capacity]]
- [[Availability]]
- [[Carrying]]
- [[Compatibility]]
- [[Closure Scope]]

## Nests

Fatigue nests within the Body Field as the structural condition through which accumulated load reduces what can be carried — the ground for recovery, fatigue boundary, and capacity reads.

## Reads

Fatigue becomes readable where accumulated load reduces available capacity and changes what the body can carry without further incompatibility.

The dependency movement is:

First: [[Strain]] reduces available bearing.

Second: [[Load]], [[Capacity]], [[Carrying]], [[Compatibility]], and [[Closure Scope]] make the limit on continued participation evaluable.

Third: [[Fatigue]] places that structural read inside the body branch.

## Carries

Fatigue carries [[Recovery]] and [[Fatigue Boundary]]. Recovery names the restoration of compatible carrying following fatigue; Fatigue Boundary names the located limit at which continued participation becomes incompatible with current capacity.

- [[Recovery]]
- [[Fatigue Boundary]]
