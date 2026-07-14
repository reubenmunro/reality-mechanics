---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.decision
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a carried sequence resolved at a choice point."
  needs:
    targets:
      - second.strategy
      - second.closure
  holds:
    targets:
      - second.strategy
      - second.closure
    read: "[[Strategy]] and [[Closure]]."
  pairs:
    targets:
      - second.strategy
    read: "[[Strategy]]. Strategy orients a carried sequence; Decision names its point of determination."
  traces:
    targets:
      - second.strategy
      - second.closure
  nests:
    targets: []
    read: "at a closure point in a carried strategy where continuation requires one path to be taken."
  reads:
    targets: []
    read: "where a carried, oriented sequence reaches a point where continuation requires selecting one available path — where strategy resolves into a taken direction."
  carries:
    targets:
      - second.evaluation
publish: true
status: stable
---
# Decision

A carried sequence resolved at a choice point.

Decision is held by [[Strategy]] and [[Closure]].

## Places

Decision places a carried sequence resolved at a choice point.

## Holds

Decision is held by [[Strategy]] and [[Closure]].

## Pairs

Decision pairs with [[Strategy]]. Strategy orients a carried sequence; Decision names its point of determination.

## Traces

- [[Strategy]]
- [[Closure]]

## Nests

Decision nests at a closure point in a carried strategy where continuation requires one path to be taken.

## Reads

Decision becomes recognisable where a carried, oriented sequence reaches a point where continuation requires selecting one available path — where strategy resolves into a taken direction.

## Carries


- [[Evaluation]]
