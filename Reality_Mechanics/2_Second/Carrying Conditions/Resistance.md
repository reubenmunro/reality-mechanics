---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.resistance
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "carrying opposed, narrowed, or slowed by a condition it must pass through."
  needs:
    targets:
      - second.constraint
      - second.flow
      - second.carrying
  holds:
    targets:
      - second.constraint
      - second.flow
      - second.carrying
    read: "[[Constraint]], [[Flow]], and [[Carrying]]."
  pairs:
    targets:
      - second.friction
      - second.drag
      - second.grip
    read: "Asymmetry carries downward — into [[Friction]], [[Drag]], [[Grip]]"
  traces:
    targets:
      - second.constraint
      - second.flow
      - second.carrying
  nests:
    targets: []
    read: "where carrying continues only through opposition, narrowing, or slowing."
  reads:
    targets: []
    read: "where carrying or flow continues only through opposition, narrowing, or slowing."
  carries:
    targets:
      - second.friction
      - second.drag
      - second.grip
      - practice.contend
publish: true
status: stable
---
# Resistance

Carrying opposed, narrowed, or slowed by a condition it must pass through.

Resistance is held by [[Constraint]], [[Flow]], and [[Carrying]].

## Places

Resistance places carrying opposed, narrowed, or slowed by a condition it must pass through.

## Holds

Resistance is held by [[Constraint]], [[Flow]], and [[Carrying]].

## Pairs

Resistance is vertical. It names carrying opposed, narrowed, or slowed by a condition it must pass through, and carries this forward into [[Friction]], [[Drag]], and [[Grip]]. Resistance holds [[Constraint]], [[Flow]], and [[Carrying]] — it is a downstream read of carrying meeting opposition, not a lateral co-present condition alongside another second-order term.


## Traces

- [[Constraint]]
- [[Flow]]
- [[Carrying]]

## Nests

Resistance nests where carrying continues only through opposition, narrowing, or slowing.

## Reads

Resistance becomes recognisable where carrying or flow continues only through opposition, narrowing, or slowing.

## Carries


- [[Friction]]
- [[Drag]]
- [[Grip]]
- [[Contend]]
