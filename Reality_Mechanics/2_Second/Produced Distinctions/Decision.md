---
grounded: true
order: second
kind: term
ai_role: term
condition_key: second.decision

needs:
  - "[[Strategy]]"
  - "[[Closure]]"

conditions:
  places: "a carried sequence resolved at a choice point."
  holds: "[[Strategy]] and [[Closure]]."
  pairs: "[[Strategy]]. Strategy orients a carried sequence; Decision names its point of determination."
  traces:
    - "[[Strategy]]"
    - "[[Closure]]"
  nests: "at a closure point in a carried strategy where continuation requires one path to be taken."
  reads: "where a carried, oriented sequence reaches a point where continuation requires selecting one available path — where strategy resolves into a taken direction."
  carries:
    - "[[Evaluation]]"

publish: true
status: stable
bearing_status: bearing
---
# Decision

Decision names a carried sequence resolved at a choice point. Where strategy names a carried sequence oriented toward a resolution, decision names the condition through which that orientation reaches a point of determination — where one path is taken over others within the current closure scope. Decision does not name finality or correctness; it names the readable condition through which a strategy reaches its closure point.

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
