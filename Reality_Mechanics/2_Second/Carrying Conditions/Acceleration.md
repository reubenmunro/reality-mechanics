---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.acceleration
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "change in velocity across interval."
  needs:
    targets:
      - second.velocity
      - second.change
      - second.interval
  holds:
    targets:
      - second.velocity
      - second.change
      - second.interval
    read: "[[Velocity]], [[Change]], and [[Interval]]."
  pairs:
    targets:
      - second.velocity
      - second.change
    read: "Asymmetry carries downward — change of [[Velocity]] through [[Change]]"
  traces:
    targets:
      - second.velocity
      - second.change
      - second.interval
      - second.speed
  nests:
    targets: []
    read: "in traversal and rate reads. It depends on velocity, change, and interval without by itself identifying what bears the change."
  reads:
    targets: []
    read: "where directed traversal can be read as speeding up, slowing down, or changing velocity across interval."
  carries:
    targets:
      - third.extractive-acceleration
publish: true
status: stable
---
# Acceleration

Change in velocity across interval.

Acceleration is held by [[Velocity]], [[Change]], and [[Interval]].

## Places

Acceleration places change in velocity across interval.

## Holds

Acceleration is held by [[Velocity]], [[Change]], and [[Interval]].

## Pairs

Asymmetry carries downward. Acceleration is a singular condition — the rate of [[Change]] of [[Velocity]]. There is no lateral contrast required at this level.

## Traces

- [[Velocity]]
- [[Change]]
- [[Interval]]
- [[Speed]]

## Nests

Acceleration nests in traversal and rate reads. It depends on velocity, change, and interval without by itself identifying what bears the change.

## Reads

Acceleration becomes recognisable where directed traversal can be read as speeding up, slowing down, or changing velocity across interval.

## Carries

- [[Extractive Acceleration]]
