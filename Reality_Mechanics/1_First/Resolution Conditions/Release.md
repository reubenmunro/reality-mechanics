---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.release
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution where held strain exits, discharges, or is no longer retained by the bearing condition"
  needs:
    targets:
      - first.resolution
      - first.bearing
      - first.strain
  holds:
    targets:
      - first.resolution
      - first.bearing
      - first.strain
    read: "[[Resolution]], [[Bearing]], and [[Strain]] — strain must be present, borne, and determined as leaving the bearing condition"
  pairs:
    targets:
      - first.hold
      - second.retain
    read: "[[Hold]] and [[Retain]] — Release lets a resolved condition go; Hold maintains it in place; Retain keeps pressure within a carrying relation. Release is readable against both what was held and what could be retained."
  traces:
    targets:
      - first.resolution
      - first.bearing
      - first.strain
  nests:
    targets: []
    read: "under first-order resolution — can open later decoupling where the released condition no longer remains coupled"
  reads:
    targets: []
    read: "where strain is resolved by being let out, discharged, or no longer retained in the bearing condition"
  carries:
    targets:
      - second.decoupling
      - second.recarry
      - second.balance
      - practice.composting
publish: true
status: stable
---
# Release

Resolution where held strain exits, discharges, or is no longer retained by the bearing condition.

Release is held by [[Resolution]], [[Bearing]], and [[Strain]]. Strain must be present, borne, and determined as leaving the bearing condition.

Release names the determination of strain leaving the hold of the condition that bore it.

At second order, release becomes part of pressure regulation. [[Retain]] names pressure kept within a carrying relation; Release names the letting-out or leaving condition that prevents pressure from being held as if it must remain in place.

## Places

Release places resolution where held strain exits, discharges, or is no longer retained.

## Holds

Release is held by [[Resolution]], [[Bearing]], and [[Strain]]. Strain must be present, borne, and determined as leaving the bearing condition.

## Pairs

Release pairs with [[Hold]] and [[Retain]]. Release lets a resolved strained condition go. Hold maintains the condition in place; Retain keeps pressure within a carrying relation.

## Traces

- [[Resolution]]
- [[Bearing]]
- [[Strain]]

## Nests

Release nests under first-order resolution and can open later decoupling where the released condition no longer remains coupled.

## Reads

Release becomes recognisable where strain is resolved by being let out, discharged, or no longer retained in the bearing condition.

Release can restore compatibility where retained pressure has exceeded the relation able to carry it. It can become incompatible where what is released has no relation able to receive, distribute, or carry the consequence.

## Carries

- [[Decoupling]]
- [[Recarry]]
- [[Balance]]
- [[Decommissioning]]
