---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.grip
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "useful friction at coupled contact."
  needs:
    targets:
      - second.coupled-contact
      - second.friction
      - second.compatibility
  holds:
    targets:
      - second.coupled-contact
      - second.friction
      - second.compatibility
    read: "[[Coupled Contact]], [[Friction]], and [[Compatibility]]."
  pairs:
    targets:
      - second.traction
    read: "Asymmetry carries downward — into [[Traction]]"
  traces:
    targets:
      - second.coupled-contact
      - first.contact
      - second.friction
      - second.compatibility
      - second.resistance
  nests:
    targets: []
    read: "inside friction as useful coupled contact resistance that supports carrying."
  reads:
    targets: []
    read: "where coupled contact resists enough to hold carrying without simply blocking it."
  carries:
    targets:
      - second.traction
publish: true
status: stable
---
# Grip

Useful friction at coupled contact.

Grip is held by [[Coupled Contact]], [[Friction]], and [[Compatibility]].

## Places

Grip places useful friction at coupled contact.

## Holds

Grip is held by [[Coupled Contact]], [[Friction]], and [[Compatibility]].

## Pairs

Asymmetry carries downward. Grip is a singular condition — compatible coupled contact through friction. The asymmetry is expressed in what grip carries: [[Traction]].

## Traces

- [[Coupled Contact]]
- [[Contact]]
- [[Friction]]
- [[Compatibility]]
- [[Resistance]]

## Nests

Grip nests inside friction as useful coupled contact resistance that supports carrying.

## Reads

Grip becomes recognisable where coupled contact resists enough to hold carrying without simply blocking it.

## Carries

- [[Traction]]
