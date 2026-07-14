---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.indivisible-bearing
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "bearing that cannot be separated without changing the carrying condition."
  needs:
    targets:
      - first.bearing
      - first.indivisible
  holds:
    targets:
      - first.bearing
      - first.indivisible
    read: "[[Bearing]] and [[Indivisible]]."
  pairs:
    targets:
      - second.divisible-bearing
    read: "[[Divisible Bearing]]. Indivisible Bearing must remain whole to carry; Divisible Bearing carries across distinguishable divisions."
  traces:
    targets:
      - first.bearing
      - first.indivisible
  nests:
    targets: []
    read: "where carrying must be read whole to remain the same carrying condition."
  reads:
    targets: []
    read: "where carrying can only be read as whole — where separating the bearing condition would change what is being carried."
  carries:
    targets:
      - second.identity
publish: true
status: stable
---
# Indivisible Bearing

Bearing that cannot be separated without changing the carrying condition.

Indivisible Bearing is held by [[Bearing]] and [[Indivisible]].

## Places

Indivisible Bearing places bearing that cannot be separated without changing the carrying condition.

## Holds

Indivisible Bearing is held by [[Bearing]] and [[Indivisible]].

## Pairs

Indivisible Bearing pairs with [[Divisible Bearing]]. Indivisible Bearing must remain whole to carry; Divisible Bearing carries across distinguishable divisions.

## Traces

- [[Bearing]]
- [[Indivisible]]

## Nests

Indivisible Bearing nests where carrying must be read whole to remain the same carrying condition.

## Reads

Indivisible bearing becomes recognisable where carrying can only be read as whole — where separating the bearing condition would change what is being carried.

## Carries


- [[Identity]]
