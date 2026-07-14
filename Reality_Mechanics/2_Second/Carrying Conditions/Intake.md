---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.intake
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "availability crossing inward through a boundary into carrying."
  needs:
    targets:
      - first.in
      - first.availability
      - second.carrying
  holds:
    targets:
      - first.in
      - first.availability
      - second.carrying
    read: "[[In]], [[Availability]], and [[Carrying]]."
  pairs:
    targets:
      - second.integration
      - second.splinter
    read: "Asymmetry carries downward — into [[Integration]] and [[Splinter]]. Intake names inward crossing; Integration and Splinter name whether what crossed becomes carried by the receiving order or remains unresolved within it."
  traces:
    targets:
      - first.in
      - first.availability
      - second.carrying
  nests:
    targets: []
    read: "at the boundary where outside availability crosses inward into carrying."
  reads:
    targets: []
    read: "where availability crosses inward through a boundary and enters carrying — where what was outside is no longer merely present at the boundary but has become available within the carrying condition."
  carries:
    targets:
      - second.integration
      - second.splinter
      - third.space-based-solar-power
publish: true
status: stable
---
# Intake

Availability crossing inward through a boundary into carrying.

Intake is held by [[In]], [[Availability]], and [[Carrying]].

## Places

Intake places availability crossing inward through a boundary into carrying.

## Holds

Intake is held by [[In]], [[Availability]], and [[Carrying]].

## Pairs

Intake is vertical. It names inward crossing into carrying and carries this forward into [[Integration]] and [[Splinter]]. Integration names what becomes carried by the receiving order; Splinter names what remains unresolved within it.

## Traces

- [[In]]
- [[Availability]]
- [[Carrying]]

## Nests

Intake nests at the boundary where outside availability crosses inward into carrying.

## Reads

Intake becomes recognisable where availability crosses inward through a boundary and enters carrying — where what was outside is no longer merely present at the boundary but has become available within the carrying condition.

## Carries


- [[Integration]]
- [[Splinter]]
- [[Space-Based Solar Power]]
