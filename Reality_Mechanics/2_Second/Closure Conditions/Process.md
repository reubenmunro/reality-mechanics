---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.process
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a sequence being carried."
  needs:
    targets:
      - second.sequence
      - second.carrying
  holds:
    targets:
      - second.sequence
      - second.carrying
    read: "[[Sequence]] and [[Carrying]]."
  pairs:
    targets:
      - second.sequence
    read: "[[Sequence]]. Sequence orders traversal; Process carries that sequence as continuing participation."
  traces:
    targets:
      - second.sequence
      - second.carrying
  nests:
    targets: []
    read: "where an ordered traversal is sustained through carrying as participation."
  reads:
    targets: []
    read: "where a sequence can be followed as continuing participation — where the ordered traversal is being sustained rather than merely present."
  carries:
    targets:
      - second.flow
      - second.proceed
      - second.progress
      - second.become
      - second.strategy
publish: true
status: stable
---
# Process

A sequence being carried.

Process is held by [[Sequence]] and [[Carrying]].

## Places

Process places a sequence being carried.

## Holds

Process is held by [[Sequence]] and [[Carrying]].

## Pairs

Process pairs with [[Sequence]]. Sequence orders traversal; Process carries that sequence as continuing participation.

## Traces

- [[Sequence]]
- [[Carrying]]

## Nests

Process nests where an ordered traversal is sustained through carrying as participation.

## Reads

Process becomes recognisable where a sequence can be followed as continuing participation — where the ordered traversal is being sustained rather than merely present.

## Carries


- [[Flow]]
- [[Proceed]]
- [[Progress]]
- [[Become]]
- [[Strategy]]
