---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.decay
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "decrease in carrying, scale, or available participation across traversal."
  needs:
    targets:
      - second.change
      - second.scale
      - second.carrying
  holds:
    targets:
      - second.change
      - second.scale
      - second.carrying
    read: "[[Change]], [[Scale]], and [[Carrying]]."
  pairs:
    targets:
      - second.growth
    read: "[[Growth]]. Decay reads decrease across traversal; Growth reads increase across traversal."
  traces:
    targets:
      - second.change
      - second.scale
      - second.carrying
      - second.growth
  nests:
    targets: []
    read: "inside change and scale reads as decrease across traversal."
  reads:
    targets: []
    read: "where a condition can be followed as decreasing in extent, carrying, or available participation."
  carries:
    targets:
      - second.wear
publish: true
status: stable
---
# Decay

Decrease in carrying, scale, or available participation across traversal.

Decay is held by [[Change]], [[Scale]], and [[Carrying]].

## Places

Decay places decrease in carrying, scale, or available participation across traversal.

## Holds

Decay is held by [[Change]], [[Scale]], and [[Carrying]].

## Pairs

Decay pairs with [[Growth]]. Decay reads decrease across traversal; Growth reads increase across traversal.

## Traces

- [[Change]]
- [[Scale]]
- [[Carrying]]
- [[Growth]]

## Nests

Decay nests inside change and scale reads as decrease across traversal.

## Reads

Decay becomes recognisable where a condition can be followed as decreasing in extent, carrying, or available participation.

## Carries


- [[Wear]]
