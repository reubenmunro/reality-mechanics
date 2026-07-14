---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.friction
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resistance at coupled contact during flow."
  needs:
    targets:
      - second.coupled-contact
      - second.resistance
      - second.flow
  holds:
    targets:
      - second.coupled-contact
      - second.resistance
      - second.flow
    read: "[[Coupled Contact]], [[Resistance]], and [[Flow]]."
  pairs:
    targets:
      - second.grip
      - second.traction
      - second.drag
    read: "Asymmetry carries downward — into [[Grip]], [[Traction]], and [[Drag]]"
  traces:
    targets:
      - second.coupled-contact
      - first.contact
      - second.resistance
      - second.flow
  nests:
    targets: []
    read: "at coupled contact during flow. It can slow, grip, wear, heat, or support carrying."
  reads:
    targets: []
    read: "where flow meets coupled contact and that contact resists, slows, grips, wears, or heats what is carried."
  carries:
    targets:
      - second.grip
      - second.traction
      - second.drag
      - second.wear
      - second.heat
publish: true
status: stable
---
# Friction

Resistance at coupled contact during flow.

Friction is held by [[Coupled Contact]], [[Resistance]], and [[Flow]].

## Places

Friction places resistance at coupled contact during flow.

## Holds

Friction is held by [[Coupled Contact]], [[Resistance]], and [[Flow]].

## Pairs

Asymmetry carries downward. Friction is a singular condition — resistance generated through coupled contact and flow. The asymmetry is expressed in what friction carries: [[Grip]], [[Traction]], and [[Drag]].

## Traces

- [[Coupled Contact]]
- [[Contact]]
- [[Resistance]]
- [[Flow]]

## Nests

Friction nests at coupled contact during flow. It can slow, grip, wear, heat, or support carrying.

## Reads

Friction becomes recognisable where flow meets coupled contact and that contact resists, slows, grips, wears, or heats what is carried.

## Carries

- [[Grip]]
- [[Traction]]
- [[Drag]]
- [[Wear]]
- [[Heat]]
