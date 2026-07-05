---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.velocity

needs:
  - "[[Speed]]"
  - "[[Orientation]]"
  - "[[Traversal]]"

conditions:
  places: "speed with direction through traversal."
  holds: "[[Speed]], [[Orientation]], and [[Traversal]]."
  pairs: "Asymmetry carries downward — into [[Acceleration]]"
  traces:
    - "[[Speed]]"
    - "[[Orientation]]"
    - "[[Traversal]]"
  nests: "inside traversal as speed with direction."
  reads: "where traversal can be read as both how fast it proceeds and which way it bears."
  carries:
    - "[[Acceleration]]"

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
