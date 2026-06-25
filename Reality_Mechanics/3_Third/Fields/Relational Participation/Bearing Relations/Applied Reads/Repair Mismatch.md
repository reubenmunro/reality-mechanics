---
grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.repair-mismatch
domain: relational-participation

needs:
  - "[[Applied Read]]"
  - "[[Repair]]"
  - "[[Misrepair]]"
  - "[[Closure Scope]]"

conditions:
  places: "the applied read where repair is attempted but addresses the wrong scope, condition, or bearing gap — restoration that misses where it needs to land."
  holds: "[[Applied Read]], [[Repair]], [[Misrepair]], and [[Closure Scope]]."
  pairs: "No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read."
  traces:
    - "[[Applied Read]]"
    - "[[Repair]]"
    - "[[Misrepair]]"
    - "[[Closure Scope]]"
  nests: "within Relational Participation as an applied read of Repair and Misrepair, where restoration of bearing misses the required scope."
  reads: "Repair Mismatch becomes readable where repair-like action preserves proceeding while failing to restore the bearing condition that was lost."
  carries: []

publish: true
status: stable
garden_status: rooted
---
# Repair Mismatch

Repair Mismatch reads a local case where repair is attempted but does not re-enter the lost bearing into compatible carrying.

## Places

Repair Mismatch places the applied read where repair is attempted but addresses the wrong scope, condition, or bearing gap — restoration that misses where it needs to land.

## Holds

Repair Mismatch is held by [[Applied Read]], [[Repair]], [[Misrepair]], and [[Closure Scope]].

## Pairs

No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read.

## Traces

- [[Applied Read]]
- [[Repair]]
- [[Misrepair]]
- [[Closure Scope]]

## Nests

Repair Mismatch nests within Relational Participation as an applied read of Repair and Misrepair, where restoration of bearing misses the required scope.

## Reads

Repair Mismatch becomes readable where repair-like action preserves proceeding while failing to restore the bearing condition that was lost.

The dependency movement is:

First: [[Bearing]] must be restored where relation has lost support.

Second: [[Compatibility]], [[Misrepair]], and [[Closure Scope]] make attempted repair evaluable as restored bearing or wrong-condition continuation.

Third: [[Repair Mismatch]] tests that condition inside the [[Relational Participation Field]] as an applied relation read.

Case Movement:

```text
bearing is lost
-> repair is attempted
-> proceeding continues
-> compatibility is not restored
```

## Carries

This note carries no further public branch at this scope.
