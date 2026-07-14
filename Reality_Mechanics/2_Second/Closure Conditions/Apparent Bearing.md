---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.apparent-bearing
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "bearing becoming presented."
  needs:
    targets:
      - first.bearing
      - first.apparent
  holds:
    targets:
      - first.bearing
      - first.apparent
    read: "[[Bearing]] and [[Apparent]]."
  pairs:
    targets:
      - second.observation
    read: "Asymmetry carries downward — into [[Observation]]"
  traces:
    targets:
      - first.bearing
      - first.apparent
  nests:
    targets: []
    read: "inside bearing reads as bearing presented enough to be noticed."
  reads:
    targets: []
    read: "where carrying can be noticed — where holding presents itself as holding rather than remaining invisible."
  carries:
    targets:
      - second.observation
publish: true
status: stable
---
# Apparent Bearing

Bearing becoming presented.

Apparent Bearing is held by [[Bearing]] and [[Apparent]].

## Places

Apparent Bearing places bearing becoming presented.

## Holds

Apparent Bearing is held by [[Bearing]] and [[Apparent]].

## Pairs

Apparent Bearing is vertical. It names the read of bearing becoming presented, and carries this forward into [[Observation]]. No lateral co-present condition is required for Apparent Bearing to be locatable — the presentation of bearing has no structural sibling at this order.


## Traces

- [[Bearing]]
- [[Apparent]]

## Nests

Apparent Bearing nests inside bearing reads as bearing presented enough to be noticed.

## Reads

Apparent bearing becomes recognisable where carrying can be noticed — where holding presents itself as holding rather than remaining invisible.

## Carries


- [[Observation]]
