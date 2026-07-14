---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.unit
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a bounded repeatable measure."
  needs:
    targets:
      - second.measure
      - second.recurrence
  holds:
    targets:
      - second.measure
      - second.recurrence
    read: "[[Measure]] and [[Recurrence]]."
  pairs:
    targets:
      - second.count
      - second.hertz
    read: "Asymmetry carries downward — into [[Count]] and [[Hertz]]"
  traces:
    targets:
      - second.measure
      - second.recurrence
  nests:
    targets: []
    read: "where measure remains repeatable across instances without changing the comparison condition."
  reads:
    targets: []
    read: "where a measure can be repeated across instances without changing the comparison condition."
  carries:
    targets:
      - second.count
      - second.hertz
publish: true
status: stable
---
# Unit

A bounded repeatable measure.

Unit is held by [[Measure]] and [[Recurrence]].

## Places

Unit places a bounded repeatable measure.

## Holds

Unit is held by [[Measure]] and [[Recurrence]].

## Pairs

Asymmetry carries downward. Unit is a singular condition — the standard of measure against recurrence. The asymmetry is expressed in what unit carries: [[Count]] and [[Hertz]].

## Traces

- [[Measure]]
- [[Recurrence]]

## Nests

Unit nests where measure remains repeatable across instances without changing the comparison condition.

## Reads

Unit becomes recognisable where a measure can be repeated across instances without changing the comparison condition.

## Carries


- [[Count]]
- [[Hertz]]
