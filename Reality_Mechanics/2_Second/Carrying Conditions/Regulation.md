---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.regulation
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "carrying maintained within condition."
  needs:
    targets:
      - second.constraint
      - second.compatibility
  holds:
    targets:
      - second.constraint
      - second.compatibility
    read: "[[Constraint]] and [[Compatibility]]."
  pairs:
    targets:
      - second.constraint
    read: "[[Constraint]]. Constraint bounds availability; Regulation maintains carrying within those bounds."
  traces:
    targets:
      - second.constraint
      - second.compatibility
  nests:
    targets: []
    read: "where carrying is maintained within condition."
  reads:
    targets: []
    read: "where carrying continues within its conditions — where participation is maintained without departing from or breaking the conditions that make carrying possible."
  carries:
    targets:
      - second.recursive-regulation
      - second.splinter
      - second.integration
      - third.space-based-solar-power
      - higher.self-regulation
publish: true
status: stable
---
# Regulation

Carrying maintained within condition.

Regulation is held by [[Constraint]] and [[Compatibility]].

## Places

Regulation places carrying maintained within condition.

## Holds

Regulation is held by [[Constraint]] and [[Compatibility]].

## Pairs

Regulation pairs with [[Constraint]]. Constraint bounds availability; Regulation maintains carrying within those bounds.

## Traces

- [[Constraint]]
- [[Compatibility]]

## Nests

Regulation nests where carrying is maintained within condition.

## Reads

Regulation becomes recognisable where carrying continues within its conditions — where participation is maintained without departing from or breaking the conditions that make carrying possible.

## Carries


- [[Recursive Regulation]]
- [[Splinter]]
- [[Integration]]
- [[Space-Based Solar Power]]
- [[Self-Regulation]]
