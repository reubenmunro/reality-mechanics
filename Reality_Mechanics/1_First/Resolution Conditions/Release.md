---
grounded: true
order: first
kind: term
ai_role: term
condition_key: first.release

needs:
  - "[[Resolution]]"
  - "[[Strain]]"

conditions:
  places: "resolution where held strain exits, discharges, or is no longer retained by the bearing condition"
  holds: "[[Resolution]] and [[Strain]] — strain must be present and determined as leaving the bearing condition"
  pairs: "[[Hold]] and [[Retain]] — Release lets a resolved condition go; Hold maintains it in place; Retain keeps pressure within a carrying relation. Release is readable against both what was held and what could be retained."
  traces:
    - "[[Resolution]]"
    - "[[Strain]]"
  nests: "under first-order resolution — can open later decoupling where the released condition no longer remains coupled"
  reads: "where strain is resolved by being let out, discharged, or no longer retained in the bearing condition"
  carries:
    - "[[Decoupling]]"
    - "[[Recarry]]"
    - "[[Balance]]"
    - "[[Decommissioning]]"

publish: true
status: stable
bearing_status: bearing
---
# Release

Release names resolution where held strain exits, discharges, or is no longer retained by the bearing condition. It is the determination of strain leaving the hold of the condition that bore it.

At second order, release becomes part of pressure regulation. [[Retain]] names pressure kept within a carrying relation; release names the letting-out or leaving condition that prevents pressure from being held as if it must remain in place.

## Places

Release places resolution where held strain exits, discharges, or is no longer retained.

## Holds

Release is held by [[Resolution]] and [[Strain]]. Strain must be present and determined as leaving the bearing condition.

## Pairs

Release pairs with [[Hold]] and [[Retain]]. Release lets a resolved strained condition go. Hold maintains the condition in place; Retain keeps pressure within a carrying relation.

## Traces

- [[Resolution]]
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
