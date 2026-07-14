---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.period
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the interval per recurrence."
  needs:
    targets:
      - second.interval
      - second.recurrence
  holds:
    targets:
      - second.interval
      - second.recurrence
    read: "[[Interval]] and [[Recurrence]]."
  pairs:
    targets:
      - second.frequency
    read: "No universal lateral pair is required. [[Frequency]] is the reciprocal measure of Period where returns form a stable cycle; irregular recurrence may have a period or rate without a single reciprocal pair."
  traces:
    targets:
      - second.interval
      - second.recurrence
  nests:
    targets: []
    read: "where recurrence is read by the interval it takes to return or occur again."
  reads:
    targets: []
    read: "where one recurrence can be read by the interval it takes to return or occur again."
  carries:
    targets:
      - second.cycle
publish: true
status: stable
---
# Period

The interval per recurrence.

Period is held by [[Interval]] and [[Recurrence]].

## Places

Period places the interval per recurrence.

## Holds

Period is held by [[Interval]] and [[Recurrence]].

## Pairs

No universal lateral pair is required. [[Frequency]] is the reciprocal measure of Period where returns form a stable cycle. Irregular recurrence can still be measured by varying periods or an averaged rate without producing one fixed reciprocal pair.

## Traces

- [[Interval]]
- [[Recurrence]]

## Nests

Period nests where recurrence is read by the interval it takes to return or occur again.

## Reads

Period becomes recognisable where one recurrence can be read by the interval it takes to return or occur again.

## Carries


- [[Cycle]]
