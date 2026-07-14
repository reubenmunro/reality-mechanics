---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.regress
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "continuation evaluated as loss of prior availability."
  needs:
    targets:
      - second.progress
  holds:
    targets:
      - second.progress
    read: "[[Progress]]."
  pairs:
    targets:
      - second.progress
    read: "[[Progress]]. Progress reads advancement; Regress reads loss against a previously held condition."
  traces:
    targets:
      - second.progress
  nests:
    targets: []
    read: "where continuation is evaluated as moving away from a previously available condition."
  reads:
    targets: []
    read: "where continuation can be read as losing ground — where what is proceeding is assessed as moving away from the evaluated condition within the current scope."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Regress

Continuation evaluated as loss of prior availability.

Regress is held by [[Progress]].

## Places

Regress places continuation evaluated as loss of prior availability.

## Holds

Regress is held by [[Progress]].

## Pairs

Regress pairs with [[Progress]]. Progress reads advancement; Regress reads loss against a previously held condition.

## Traces

- [[Progress]]

## Nests

Regress nests where continuation is evaluated as moving away from a previously available condition.

## Reads

Regress becomes recognisable where continuation can be read as losing ground — where what is proceeding is assessed as moving away from the evaluated condition within the current scope.

## Carries
