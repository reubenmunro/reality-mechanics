---
grounded: true
order: second
kind: term
ai_role: term
condition_key: second.scope

needs:
  - "[[Closure]]"
  - "[[Extent]]"

conditions:
  places: "the bounded extent within which a read can hold."
  holds: "[[Closure]] and [[Extent]]. Closure must bound a read, and extent must locate the reached range, before scope can name where the read holds."
  pairs: "Asymmetry carries downward — into [[Closure Scope]]"
  traces:
    - "[[Closure]]"
    - "[[Extent]]"
  nests: "as the bounded extent within which carrying, reading, or evaluation can hold."
  reads: "where a condition is bounded enough to say where a read holds, fails, or changes — where something can be evaluated as within or beyond the current extent."
  carries:
    - "[[Closure Scope]]"

publish: true
status: stable
garden_status: rooted
---
# Scope

Scope names the bounded extent within which a read can hold. Where [[Extent]] names the reached range of carrying, and closure names a read becoming sufficiently bounded for evaluation, scope names that extent as a readable condition: the range within which a read participates without extending beyond what holds at the current boundary. Scope is the extent of validity, not the read itself.

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
