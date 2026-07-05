---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.cycle

needs:
  - "[[Recurrence]]"
  - "[[Return]]"
  - "[[Period]]"

conditions:
  places: "a return bounded by a recognisable period."
  holds: "[[Recurrence]], [[Return]], and [[Period]]."
  pairs: "No lateral pair is required. [[Recurrence]], [[Return]], and [[Period]] carry downward into Cycle."
  traces:
    - "[[Recurrence]]"
    - "[[Return]]"
    - "[[Period]]"
  nests: "where recurrence makes a carried condition readable again through a recognisable period."
  reads: "where a return can be bounded as one complete recurrence through a period."
  carries: []
publish: true
status: stable
---
# Cycle

A return bounded by a recognisable period.

Cycle is held by [[Recurrence]], [[Return]], and [[Period]].

## Places

Cycle places a return bounded by a recognisable period.

## Holds

Cycle is held by [[Recurrence]], [[Return]], and [[Period]].

## Pairs

No lateral pair is required. [[Recurrence]], [[Return]], and [[Period]] carry downward into Cycle as one bounded readable passage.

## Traces

- [[Recurrence]]
- [[Return]]
- [[Period]]

## Nests

Cycle nests where recurrence makes a carried condition readable again through a recognisable period.

## Reads

Cycle becomes recognisable where a return can be bounded as one complete recurrence through a period.

## Carries
