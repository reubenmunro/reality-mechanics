---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.flow
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "carrying continuing through a medium."
  needs:
    targets:
      - second.carrying
      - second.medium
      - second.process
  holds:
    targets:
      - second.carrying
      - second.medium
      - second.process
    read: "[[Carrying]], [[Medium]], and [[Process]]."
  pairs:
    targets:
      - second.throughput
      - second.current
      - second.resistance
    read: "Asymmetry carries downward — into [[Throughput]], [[Current]], and [[Resistance]]"
  traces:
    targets:
      - second.carrying
      - second.medium
      - second.process
      - second.change
  nests:
    targets: []
    read: "inside carrying through a medium. It can open current, throughput, resistance, friction, drag, and heat."
  reads:
    targets: []
    read: "where a carried condition continues through a medium as an available process."
  carries:
    targets:
      - second.throughput
      - second.current
      - second.energy
      - second.resistance
      - second.friction
      - second.drag
      - second.heat
publish: true
status: stable
---
# Flow

Carrying continuing through a medium.

Flow is held by [[Carrying]], [[Medium]], and [[Process]].

## Places

Flow places carrying continuing through a medium.

## Holds

Flow is held by [[Carrying]], [[Medium]], and [[Process]].

## Pairs

Asymmetry carries downward — into [[Throughput]], [[Current]], and [[Resistance]]

## Traces

- [[Carrying]]
- [[Medium]]
- [[Process]]
- [[Change]]

## Nests

Flow nests inside carrying through a medium. It can open current, throughput, resistance, friction, drag, and heat.

## Reads

Flow becomes recognisable where a carried condition continues through a medium as an available process.

Where generated availability carries through a medium as work, movement, transformation, maintenance, or continuation, flow can make [[Energy]] readable.

## Carries


- [[Throughput]]
- [[Current]]
- [[Energy]]
- [[Resistance]]
- [[Friction]]
- [[Drag]]
- [[Heat]]
