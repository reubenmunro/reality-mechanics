---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.capacity
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "supportable carrying within a current condition."
  needs:
    targets:
      - second.compatibility
      - first.threshold
      - second.carrying
  holds:
    targets:
      - second.compatibility
      - first.threshold
      - second.carrying
    read: "[[Compatibility]], [[Threshold]], and [[Carrying]]."
  pairs:
    targets:
      - second.overload
    read: "[[Overload]]. Capacity names supportable carrying; Overload names load exceeding that supportable capacity."
  traces:
    targets:
      - second.compatibility
      - first.threshold
      - second.carrying
      - second.load
  nests:
    targets: []
    read: "as a carrying condition and passage check. It names supportable carrying before overload, failure, shift, or re-resolution."
  reads:
    targets: []
    read: "where a carrying condition can be read by what it can support within the current scope — where load remains possible up to the point at which compatibility begins to fail."
  carries:
    targets:
      - second.pressure
      - second.energy
      - second.overload
      - second.balance
      - second.resonance
publish: true
status: stable
---
# Capacity

Supportable carrying within a current condition.

Capacity is held by [[Compatibility]], [[Threshold]], and [[Carrying]].

## Places

Capacity places supportable carrying within a current condition.

## Holds

Capacity is held by [[Compatibility]], [[Threshold]], and [[Carrying]].

## Pairs

Capacity pairs with [[Overload]]. Capacity names supportable carrying; Overload names load exceeding that supportable capacity.

## Traces

- [[Compatibility]]
- [[Threshold]]
- [[Carrying]]
- [[Load]]

## Nests

Capacity nests as a carrying condition and passage check. It names supportable carrying before overload, failure, shift, or re-resolution.

## Reads

Capacity becomes recognisable where a carrying condition can be read by what it can support within the current scope — where load remains possible up to the point at which compatibility begins to fail.

Capacity becomes especially visible through [[Pressure]]: load locally borne through relation tests how much carrying can remain compatible before reduction, release, transfer, overload, or re-resolution becomes necessary.

[[Energy]] names generated availability for carrying where that availability becomes readable as supportable capacity, pressure, flow, work, movement, transformation, maintenance, repair, or continuation.

## Carries


- [[Pressure]]
- [[Energy]]
- [[Overload]]
- [[Balance]]
- [[Resonance]]
