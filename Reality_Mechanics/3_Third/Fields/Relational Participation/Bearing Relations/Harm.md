---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.harm
determination: pd.v3.pre-provenance-baseline
domain: relational-participation

conditions:
  places: "carrying proceeding incompatibly such that available bearing is damaged, weakened, or removed — the downstream persistence of incompatible carrying across a closure scope."
  needs:
    targets:
      - first.bearing
      - second.consequence
      - third.violation
  holds:
    targets:
      - first.bearing
      - second.consequence
      - third.violation
    read: "[[Bearing]], [[Consequence]], and [[Violation]]. Available bearing must be at stake, a consequence must continue incompatibly, and a violation of compatible participation must be present before the condition can be read as harm."
  pairs:
    targets:
      - third.safety
    read: "[[Safety]]. Harm names carrying that damages available bearing; Safety names the condition through which available bearing is preserved from incompatible carrying."
  traces:
    targets:
      - first.bearing
      - second.consequence
      - third.violation
  nests:
    targets: []
    read: "within Relational Participation as the condition through which incompatible carrying damages available bearing — the structural ground for repair, control-after-harm, and violation reads."
  reads:
    targets: []
    read: "Harm becomes readable where a relation proceeds in a way that makes required bearing less available or incompatible at the relevant closure scope."
  carries:
    targets:
      - third.repair
      - third.domination
publish: true
status: stable
---
# Harm

Carrying proceeding incompatibly such that available bearing is damaged, weakened, or removed — the downstream persistence of incompatible carrying across a closure scope.

Harm is held by [[Bearing]], [[Consequence]], and [[Violation]]. Available bearing must be at stake, a consequence must continue incompatibly, and a violation of compatible participation must be present before the condition can be read as harm.

## Places

Harm places carrying proceeding incompatibly such that available bearing is damaged, weakened, or removed — the downstream persistence of incompatible carrying across a closure scope.

## Holds

Harm is held by [[Bearing]], [[Consequence]], and [[Violation]]. Available bearing must be at stake, a consequence must continue incompatibly, and a violation of compatible participation must be present before the condition can be read as harm.

## Pairs

Harm pairs with [[Safety]]. Harm names carrying that damages available bearing; Safety names the condition through which available bearing is preserved from incompatible carrying.

## Traces

- [[Bearing]]
- [[Consequence]]
- [[Violation]]

## Nests

Harm nests within Relational Participation as the condition through which incompatible carrying damages available bearing — the structural ground for repair, control-after-harm, and violation reads.

## Reads

Harm becomes readable where a relation proceeds in a way that makes required bearing less available or incompatible at the relevant closure scope.

## Carries

Harm carries [[Repair]] — repair becomes available as a named condition only where harm has occurred or bearing has been lost.
- [[Repair]]
- [[Domination]]
