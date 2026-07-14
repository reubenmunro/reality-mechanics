---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.drag
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "slowing resistance carried through flow."
  needs:
    targets:
      - second.resistance
      - second.flow
      - second.speed
  holds:
    targets:
      - second.resistance
      - second.flow
      - second.speed
    read: "[[Resistance]], [[Flow]], and [[Speed]]."
  pairs:
    targets:
      - second.flow
      - second.speed
    read: "Asymmetry carries downward — resistance applied through [[Flow]] and [[Speed]]"
  traces:
    targets:
      - second.resistance
      - second.flow
      - second.speed
      - second.friction
  nests:
    targets: []
    read: "inside resistance and flow as slowing resistance rather than blockage."
  reads:
    targets: []
    read: "where flow continues while being slowed by the condition it passes through."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Drag

Slowing resistance carried through flow.

Drag is held by [[Resistance]], [[Flow]], and [[Speed]].

## Places

Drag places slowing resistance carried through flow.

## Holds

Drag is held by [[Resistance]], [[Flow]], and [[Speed]].

## Pairs

Asymmetry carries downward. Drag is a singular condition — resistance applied through [[Flow]] against [[Speed]]. There is no lateral contrast required at this level.

## Traces

- [[Resistance]]
- [[Flow]]
- [[Speed]]
- [[Friction]]

## Nests

Drag nests inside resistance and flow as slowing resistance rather than blockage.

## Reads

Drag becomes recognisable where flow continues while being slowed by the condition it passes through.

## Carries

