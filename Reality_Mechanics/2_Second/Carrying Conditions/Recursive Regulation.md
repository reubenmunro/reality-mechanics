---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.recursive-regulation
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "regulation occurring through recursive carrying."
  needs:
    targets:
      - second.recursive
      - second.regulation
  holds:
    targets:
      - second.recursive
      - second.regulation
    read: "[[Recursive]] and [[Regulation]]."
  pairs:
    targets:
      - second.stability
    read: "Asymmetry carries downward — into [[Stability]]"
  traces:
    targets:
      - second.recursive
      - second.regulation
  nests:
    targets: []
    read: "where regulation loops back into what it regulates without losing dependency path."
  reads:
    targets: []
    read: "where a condition contributes to maintaining the carrying conditions through which it is itself maintained — where regulation loops back into what it regulates without losing the dependency path."
  carries:
    targets:
      - second.stability
publish: true
status: stable
---
# Recursive Regulation

Regulation occurring through recursive carrying.

Recursive Regulation is held by [[Recursive]] and [[Regulation]].

## Places

Recursive Regulation places regulation occurring through recursive carrying.

## Holds

Recursive Regulation is held by [[Recursive]] and [[Regulation]].

## Pairs

Recursive Regulation is vertical. It names regulation occurring through recursive carrying, and carries this forward into [[Stability]]. Recursive Regulation holds [[Recursive]] and [[Regulation]] — it is downstream of Recursive, not a lateral co-present condition alongside another second-order term.


## Traces

- [[Recursive]]
- [[Regulation]]

## Nests

Recursive Regulation nests where regulation loops back into what it regulates without losing dependency path.

## Reads

Recursive regulation becomes recognisable where a condition contributes to maintaining the carrying conditions through which it is itself maintained — where regulation loops back into what it regulates without losing the dependency path.

## Carries


- [[Stability]]
