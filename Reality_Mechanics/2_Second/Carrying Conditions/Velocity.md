---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.velocity
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "speed with direction through traversal."
  needs:
    targets:
      - second.speed
      - first.orientation
      - second.traversal
  holds:
    targets:
      - second.speed
      - first.orientation
      - second.traversal
    read: "[[Speed]], [[Orientation]], and [[Traversal]]."
  pairs:
    targets:
      - second.acceleration
    read: "Asymmetry carries downward — into [[Acceleration]]"
  traces:
    targets:
      - second.speed
      - first.orientation
      - second.traversal
  nests:
    targets: []
    read: "inside traversal as speed with direction."
  reads:
    targets: []
    read: "where traversal can be read as both how fast it proceeds and which way it bears."
  carries:
    targets:
      - second.acceleration
publish: true
status: stable
---
# Velocity

Speed with direction through traversal.

Velocity is held by [[Speed]], [[Orientation]], and [[Traversal]].

## Places

Velocity places speed with direction through traversal.

## Holds

Velocity is held by [[Speed]], [[Orientation]], and [[Traversal]].

## Pairs

Asymmetry carries downward. Velocity is a singular condition — speed with orientation. The asymmetry is expressed in what velocity carries: [[Acceleration]].

## Traces

- [[Speed]]
- [[Orientation]]
- [[Traversal]]

## Nests

Velocity nests inside traversal as speed with direction.

## Reads

Velocity becomes recognisable where traversal can be read as both how fast it proceeds and which way it bears.

## Carries


- [[Acceleration]]
