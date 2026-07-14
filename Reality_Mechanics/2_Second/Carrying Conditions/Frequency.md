---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.frequency
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "countable return as rate."
  needs:
    targets:
      - second.recurrence
      - second.return
      - second.rate
  holds:
    targets:
      - second.recurrence
      - second.return
      - second.rate
    read: "[[Recurrence]], [[Return]], and [[Rate]]."
  pairs:
    targets:
      - second.period
    read: "No universal lateral pair is required. [[Period]] is the reciprocal measure of Frequency where returns form a stable cycle; irregular recurrence may have a rate without one fixed period."
  traces:
    targets:
      - second.recurrence
      - second.return
      - second.rate
  nests:
    targets: []
    read: "inside recurrence and rate as counted returns within an interval."
  reads:
    targets: []
    read: "where recurring participation has a return condition distinct enough to count per interval."
  carries:
    targets:
      - second.hertz
      - second.resonance
publish: true
status: stable
---
# Frequency

Countable return as rate.

Frequency is held by [[Recurrence]], [[Return]], and [[Rate]]. Recurrence must provide another occurrence, Return must make a carried condition readable enough to distinguish, and Rate must relate the count to an interval.

## Places

Frequency places countable return as rate.

## Holds

Frequency is held by [[Recurrence]], [[Return]], and [[Rate]]. Recurrence must provide another occurrence, Return must make a carried condition readable enough to distinguish, and Rate must relate the count to an interval.

## Pairs

No universal lateral pair is required. [[Period]] is the reciprocal measure of Frequency where returns form a stable cycle. Irregular recurrence can still have a measured or averaged frequency without one fixed period.

## Traces

- [[Recurrence]]
- [[Return]]
- [[Rate]]

## Nests

Frequency nests inside recurrence and rate as counted returns within an interval.

## Reads

Frequency becomes recognisable where recurring participation has a return condition distinct enough to count per interval.

## Carries


- [[Hertz]]
- [[Resonance]]
