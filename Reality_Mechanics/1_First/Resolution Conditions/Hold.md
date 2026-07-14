---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.hold
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution remaining supportable as the same condition"
  needs:
    targets:
      - first.resolution
  holds:
    targets:
      - first.resolution
    read: "[[Resolution]] — bearing must be determined at the current scope before it can remain supportable"
  pairs:
    targets:
      - first.release
    read: "[[Release]] — Hold maintains a resolved condition in place; Release lets it go. Each requires the other to be locatable."
  traces:
    targets:
      - first.resolution
  nests:
    targets: []
    read: "under first-order resolution, remaining present through whatever it supports without being carrying itself"
  reads:
    targets: []
    read: "where resolved bearing stays together enough to remain available for reading, support, and the carrying that continues through it"
  carries:
    targets:
      - first.carry
      - first.trace
      - first.first-order-crossing
      - second.carrying
      - first.read
      - second.retain
publish: true
status: stable
---
# Hold

Resolution remaining supportable as the same condition.

Hold is held by [[Resolution]]. Bearing must be determined at the current scope before it can remain supportable.

Hold makes [[Carry]] possible — not a stage that finishes before carrying begins, but supportability that stays present while carrying continues.

Where [[Bearing]] names strain sustained as readable and [[Resolution]] names bearing determined at the current scope, Hold names that determination settling as continued support rather than collapse, discharge, deformation, or transfer.

## Places

Hold places resolution remaining supportable as the same condition.

## Holds

Hold is held by [[Resolution]]. Bearing must be determined at the current scope before it can remain supportable.

## Pairs

Hold pairs with [[Release]]: hold names the maintaining of a resolved condition in place — continuing to carry what resolution has determined; release names the letting go of that same condition. Each requires the other to be locatable: you can only name something as held because it could be released; you can only name something as released because it was held.

## Traces

- [[Resolution]]

## Nests

Hold nests under first-order resolution, remaining present through whatever it supports. It is not carrying by itself, but it does not finish before carrying begins — it stays present while carrying continues.

## Reads

Hold becomes recognisable where resolved bearing stays together enough to remain available for reading, support, and the carrying that continues through it.

## Carries
- [[Carry]]
- [[Trace]]
- [[First Order Crossing|Threshold (First → Second)]]
- [[Carrying]]
- [[Read]]
- [[Retain]]
