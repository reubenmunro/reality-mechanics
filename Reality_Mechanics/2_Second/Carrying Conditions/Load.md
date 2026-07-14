---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.load
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "what bears on carrying."
  needs:
    targets:
      - first.bearing
      - second.carrying
  holds:
    targets:
      - first.bearing
      - second.carrying
    read: "[[Bearing]] and [[Carrying]]."
  pairs:
    targets:
      - second.capacity
      - second.overload
    read: "Asymmetry carries downward — into [[Capacity]], [[Overload]]"
  traces:
    targets:
      - first.bearing
      - second.carrying
  nests:
    targets: []
    read: "inside carrying as what bears on continuation and tests capacity."
  reads:
    targets: []
    read: "where carrying is not empty continuation but must support what bears on it — where continuation has weight, demand, or pressure that affects whether carrying can remain available."
  carries:
    targets:
      - second.capacity
      - second.pressure
      - second.overload
publish: true
status: stable
---
# Load

What bears on carrying.

Load is held by [[Bearing]] and [[Carrying]].

## Places

Load places what bears on carrying.

## Holds

Load is held by [[Bearing]] and [[Carrying]].

## Pairs

Load is vertical. It names what bears on carrying, and carries this forward into [[Capacity]], [[Pressure]], and [[Overload]]. Load holds [[Bearing]] and [[Carrying]] — it is a downstream read of what bearing presses against carrying, not a lateral co-present condition alongside another second-order term.


## Traces

- [[Bearing]]
- [[Carrying]]

## Nests

Load nests inside carrying as what bears on continuation and tests capacity.

## Reads

Load becomes recognisable where carrying is not empty continuation but must support what bears on it — where continuation has weight, demand, or pressure that affects whether carrying can remain available.

## Carries


- [[Capacity]]
- [[Pressure]]
- [[Overload]]
