---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.polarity
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "opposed direction — distinction presented as bearing in opposing directions within relation"
  needs:
    targets:
      - first.orientation
  holds:
    targets:
      - first.orientation
    read: "[[Orientation]] — direction must be readable before opposition of direction can be read"
  pairs:
    targets:
      - third.resolution-polarity
    read: "[[Resolution Polarity]] — Polarity is first-order directional opposition; Resolution Polarity carries that opposition into resolution reads"
  traces:
    targets:
      - first.orientation
  nests:
    targets: []
    read: "before conflict or hierarchy — names directional opposition without making opposition into separation"
  reads:
    targets: []
    read: "where distinction is read as bearing in opposed directions — where two orientations face away from each other within relation"
  carries:
    targets:
      - third.resolution-polarity
publish: true
status: stable
---
# Polarity

Opposed direction — distinction presented as bearing in opposing directions within relation.

Polarity is held by [[Orientation]]. Direction must be readable before opposition of direction can be read.

## Places

Polarity places opposed direction within relation.

## Holds

Polarity is held by [[Orientation]]. Direction must be readable before opposition of direction can be read.

## Pairs

Polarity pairs with [[Resolution Polarity]]. Polarity is first-order directional opposition; Resolution Polarity carries that opposition into resolution reads.

## Traces

- [[Orientation]]

## Nests

Polarity nests before conflict or hierarchy. It names directional opposition without making opposition into separation.

## Reads

Polarity becomes recognisable where distinction is read as bearing in opposed directions — where two orientations face away from each other within relation.

## Carries


- [[Resolution Polarity]]
