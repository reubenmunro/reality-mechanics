---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.progress

needs:
  - "[[Proceed]]"
  - "[[Evaluation]]"

conditions:
  places: "continuation evaluated as advancement."
  holds: "[[Proceed]] and [[Evaluation]]."
  pairs: "[[Regress]]. Progress evaluates continuation as advancement; Regress evaluates continuation as loss of prior availability."
  traces:
    - "[[Proceed]]"
    - "[[Evaluation]]"
    - "[[Process]]"
  nests: "where continuation is evaluated as moving toward the assessed condition."
  reads: "where continuation can be read as advancing toward the evaluated condition — where what is proceeding is assessed as moving in the right direction within the current scope."
  carries:
    - "[[Regress]]"
    - "[[Ship and Ark]]"

publish: true
status: stable
---
# Progress

Continuation evaluated as advancement.

## Places

Progress places continuation evaluated as advancement.

## Holds

Progress is held by [[Proceed]] and [[Evaluation]].

## Pairs

Progress pairs with [[Regress]]. Progress evaluates continuation as advancement; Regress evaluates continuation as loss of prior availability.

## Traces

- [[Proceed]]
- [[Evaluation]]
- [[Process]]

## Nests

Progress nests where continuation is evaluated as moving toward the assessed condition.

## Reads

Progress becomes recognisable where continuation can be read as advancing toward the evaluated condition — where what is proceeding is assessed as moving in the right direction within the current scope.

## Carries


- [[Regress]]
- [[Ship and Ark]]
