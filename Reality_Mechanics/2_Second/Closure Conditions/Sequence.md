---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.sequence
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "an ordered traversal: reads followed through a scope in a dependency-readable arrangement."
  needs:
    targets:
      - second.traversal
  holds:
    targets:
      - second.traversal
    read: "[[Traversal]]."
  pairs:
    targets:
      - second.process
    read: "[[Process]]. Sequence orders traversal; Process carries the sequence as participation."
  traces:
    targets:
      - second.traversal
  nests:
    targets: []
    read: "where traversal has readable order and direction."
  reads:
    targets: []
    read: "where reads can be followed one after another through an ordered arrangement — where the traversal has a readable direction."
  carries:
    targets:
      - second.process
publish: true
status: stable
---
# Sequence

An ordered traversal: reads followed through a scope in a dependency-readable arrangement.

Sequence is held by [[Traversal]].

## Places

Sequence places an ordered traversal: reads followed through a scope in a dependency-readable arrangement.

## Holds

Sequence is held by [[Traversal]].

## Pairs

Sequence pairs with [[Process]]. Sequence orders traversal; Process carries the sequence as participation.

## Traces

- [[Traversal]]

## Nests

Sequence nests where traversal has readable order and direction.

## Reads

Sequence becomes recognisable where reads can be followed one after another through an ordered arrangement — where the traversal has a readable direction.

## Carries


- [[Process]]
