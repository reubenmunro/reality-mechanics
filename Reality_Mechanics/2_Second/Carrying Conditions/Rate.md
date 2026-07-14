---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.rate
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "relation read against interval."
  needs:
    targets:
      - second.recurrence
      - second.interval
      - second.measure
  holds:
    targets:
      - second.recurrence
      - second.interval
      - second.measure
    read: "[[Recurrence]], [[Interval]], and [[Measure]]."
  pairs:
    targets:
      - second.frequency
      - second.speed
      - second.tempo
    read: "Asymmetry carries downward — into [[Frequency]], [[Speed]], and [[Tempo]]"
  traces:
    targets:
      - second.recurrence
      - second.interval
      - second.measure
  nests:
    targets: []
    read: "inside interval and measure as recurrence, change, or carrying read per interval."
  reads:
    targets: []
    read: "where recurrence, change, or carrying can be read as occurring per interval."
  carries:
    targets:
      - second.frequency
      - second.speed
      - second.tempo
      - second.pace
      - third.timescale
      - second.throughput
      - second.resolution-rate
publish: true
status: stable
---
# Rate

Relation read against interval.

Rate is held by [[Recurrence]], [[Interval]], and [[Measure]].

## Places

Rate places relation read against interval.

## Holds

Rate is held by [[Recurrence]], [[Interval]], and [[Measure]].

## Pairs

Asymmetry carries downward. Rate is a singular condition — recurrence measured per interval. The asymmetry is expressed in what rate carries: [[Frequency]], [[Speed]], and [[Tempo]].

## Traces

- [[Recurrence]]
- [[Interval]]
- [[Measure]]

## Nests

Rate nests inside interval and measure as recurrence, change, or carrying read per interval.

## Reads

Rate becomes recognisable where recurrence, change, or carrying can be read as occurring per interval.

## Carries


- [[Frequency]]
- [[Speed]]
- [[Tempo]]
- [[Pace]]
- [[Timescale]]
- [[Throughput]]
- [[Resolution Rate]]
