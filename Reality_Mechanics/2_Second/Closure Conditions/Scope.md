---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.scope
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the bounded extent within which a read can hold."
  needs:
    targets:
      - second.closure
      - second.extent
  holds:
    targets:
      - second.closure
      - second.extent
    read: "[[Closure]] and [[Extent]]. Closure must bound a read, and extent must locate the reached range, before scope can name where the read holds."
  pairs:
    targets:
      - second.closure-scope
    read: "Asymmetry carries downward — into [[Closure Scope]]"
  traces:
    targets:
      - second.closure
      - second.extent
  nests:
    targets: []
    read: "as the bounded extent within which carrying, reading, or evaluation can hold."
  reads:
    targets: []
    read: "where a condition is bounded enough to say where a read holds, fails, or changes — where something can be evaluated as within or beyond the current extent."
  carries:
    targets:
      - second.closure-scope
publish: true
status: stable
---
# Scope

The bounded extent within which a read can hold.

Scope is held by [[Closure]] and [[Extent]]. Closure must bound a read, and extent must locate the reached range, before scope can name where the read holds.

## Places

Scope places the bounded extent within which a read can hold.

## Holds

Scope is held by [[Closure]] and [[Extent]]. Closure must bound a read, and extent must locate the reached range, before scope can name where the read holds.

## Pairs

Asymmetry carries downward. Scope is a singular condition — the range held within a closure. The asymmetry is expressed in what scope carries: [[Closure Scope]].

## Traces

- [[Closure]]
- [[Extent]]

## Nests

Scope nests as the bounded extent within which carrying, reading, or evaluation can hold.

## Reads

Scope becomes recognisable where a condition is bounded enough to say where a read holds, fails, or changes — where something can be evaluated as within or beyond the current extent.
## Carries


- [[Closure Scope]]
