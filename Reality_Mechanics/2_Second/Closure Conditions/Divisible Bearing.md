---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.divisible-bearing
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "bearing that can be separated into distinguishable parts without losing the carrying condition."
  needs:
    targets:
      - first.bearing
      - first.divisible
  holds:
    targets:
      - first.bearing
      - first.divisible
    read: "[[Bearing]] and [[Divisible]]."
  pairs:
    targets:
      - second.indivisible-bearing
    read: "[[Indivisible Bearing]]. Divisible Bearing carries through separable parts; Indivisible Bearing must remain whole to carry."
  traces:
    targets:
      - first.bearing
      - first.divisible
  nests:
    targets: []
    read: "where carrying remains readable across distinguishable parts."
  reads:
    targets: []
    read: "where carrying can be read through distinguishable divisions — where the holding condition persists across separable parts without losing participation."
  carries:
    targets:
      - second.pattern
publish: true
status: stable
---
# Divisible Bearing

Bearing that can be separated into distinguishable parts without losing the carrying condition.

Divisible Bearing is held by [[Bearing]] and [[Divisible]].

## Places

Divisible Bearing places bearing that can be separated into distinguishable parts without losing the carrying condition.

## Holds

Divisible Bearing is held by [[Bearing]] and [[Divisible]].

## Pairs

Divisible Bearing pairs with [[Indivisible Bearing]]. Divisible Bearing carries through separable parts; Indivisible Bearing must remain whole to carry.

## Traces

- [[Bearing]]
- [[Divisible]]

## Nests

Divisible Bearing nests where carrying remains readable across distinguishable parts.

## Reads

Divisible bearing becomes recognisable where carrying can be read through distinguishable divisions — where the holding condition persists across separable parts without losing participation.

## Carries


- [[Pattern]]
