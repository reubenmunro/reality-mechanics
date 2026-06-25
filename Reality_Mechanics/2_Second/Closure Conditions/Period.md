---
grounded: true
order: second
kind: term
ai_role: term
condition_key: second.period

needs:
  - "[[Interval]]"
  - "[[Recurrence]]"

conditions:
  places: "the interval per recurrence."
  holds: "[[Interval]] and [[Recurrence]]."
  pairs: "No universal lateral pair is required. [[Frequency]] is the reciprocal measure of Period where returns form a stable cycle; irregular recurrence may have a period or rate without a single reciprocal pair."
  traces:
    - "[[Interval]]"
    - "[[Recurrence]]"
  nests: "where recurrence is read by the interval it takes to return or occur again."
  reads: "where one recurrence can be read by the interval it takes to return or occur again."
  carries:
    - "[[Cycle]]"

publish: true
status: stable
garden_status: rooted
---
# Period

Period names the interval per recurrence. Where frequency reads countable returns per interval, period reads the interval required for one recurrence.

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
