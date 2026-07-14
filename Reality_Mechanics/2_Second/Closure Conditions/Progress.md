---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.progress
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "continuation evaluated as advancement."
  needs:
    targets:
      - second.proceed
      - second.evaluation
  holds:
    targets:
      - second.proceed
      - second.evaluation
    read: "[[Proceed]] and [[Evaluation]]."
  pairs:
    targets:
      - second.regress
    read: "[[Regress]]. Progress evaluates continuation as advancement; Regress evaluates continuation as loss of prior availability."
  traces:
    targets:
      - second.proceed
      - second.evaluation
      - second.process
  nests:
    targets: []
    read: "where continuation is evaluated as moving toward the assessed condition."
  reads:
    targets: []
    read: "where continuation can be read as advancing toward the evaluated condition — where what is proceeding is assessed as moving in the right direction within the current scope."
  carries:
    targets:
      - second.regress
      - third.ship-and-ark
publish: true
status: stable
---
# Progress

Continuation evaluated as advancement.

Progress is held by [[Proceed]] and [[Evaluation]].

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
