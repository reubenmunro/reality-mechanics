---

grounded: true
register: practice
kind: term
ai_role: practice
condition_key: practice.contend
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "tending under strain, pressure, resistance, or competing claim."
  needs:
    targets:
      - practice.tend
      - first.strain
      - second.pressure
      - second.resistance
      - first.boundary
  holds:
    targets:
      - practice.tend
      - first.strain
      - second.pressure
      - second.resistance
      - first.boundary
    read: "[[Tend]], [[Strain]], [[Pressure]], [[Resistance]], and [[Boundary]]. A relation must be tended, and that tending must meet pressure or opposition at a boundary, before contending can be named."
  pairs:
    targets:
      - practice.tend
    read: "[[Tend]]. Tend names care applied through attended practice; Contend names the same care where resistance must be met without losing relation."
  traces:
    targets:
      - practice.tend
      - first.strain
      - second.pressure
      - second.resistance
      - first.boundary
  nests:
    targets: []
    read: "within practice where care has to hold through opposition, pressure, or competing claim."
  reads:
    targets: []
    read: "Contend becomes readable where tending cannot continue by simple maintenance, because pressure, resistance, or competing claim must be met and carried at a boundary."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Contend

Tending under strain, pressure, resistance, or competing claim.

Contend is held by [[Tend]], [[Strain]], [[Pressure]], [[Resistance]], and [[Boundary]]. A relation must be tended, and that tending must meet pressure or opposition at a boundary, before contending can be named.

Contending is not simply fighting. It is tending where care has to meet opposition without dropping the relation. A participant may contend with a limit, a pressure, an argument, a wound, a competing claim, or a condition that resists simple maintenance.

## Places

Contend places tending under strain, pressure, resistance, or competing claim.

## Holds

Contend is held by [[Tend]], [[Strain]], [[Pressure]], [[Resistance]], and [[Boundary]]. A relation must be tended, and that tending must meet pressure or opposition at a boundary, before contending can be named.

## Pairs

Contend pairs with [[Tend]]. Tend names care applied through attended practice; Contend names the same care where resistance must be met without losing relation.

## Traces

- [[Tend]]
- [[Strain]]
- [[Pressure]]
- [[Resistance]]
- [[Boundary]]

## Nests

Contend nests within practice where care has to hold through opposition, pressure, or competing claim.

## Reads

Contend becomes readable where tending cannot continue by simple maintenance, because pressure, resistance, or competing claim must be met and carried at a boundary.

Contend becomes unsafe where the relation is dropped and only force remains. It remains answerable where resistance is met in a way that preserves or clarifies the relation being tended.

## Carries

Contend carries no further public branch at this scope.
