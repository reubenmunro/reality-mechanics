---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.hertz
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "frequency measured as counted returns per second."
  needs:
    targets:
      - second.frequency
      - second.unit
  holds:
    targets:
      - second.frequency
      - second.unit
    read: "[[Frequency]] and [[Unit]]."
  pairs:
    targets:
      - second.frequency
      - second.unit
    read: "Asymmetry carries downward — unit of [[Frequency]] per [[Unit]] of time"
  traces:
    targets:
      - second.frequency
      - second.unit
  nests:
    targets: []
    read: "as a unit-read of frequency measured against the standard interval of one second."
  reads:
    targets: []
    read: "where readable returns are counted per second."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Hertz

Frequency measured as counted returns per second.

Hertz is held by [[Frequency]] and [[Unit]].

This is an Atlas readability account of what makes a recurrence countable. It does not replace the physical definition or metrology of hertz.

## Places

Hertz places frequency measured as counted returns per second.

## Holds

Hertz is held by [[Frequency]] and [[Unit]].

## Pairs

Asymmetry carries downward. Hertz is a singular condition — the standard unit of frequency. Its asymmetry is expressed through what it names: [[Frequency]] per [[Unit]].

## Traces

- [[Frequency]]
- [[Unit]]

## Nests

Hertz nests as a unit-read of frequency measured against the standard interval of one second.

## Reads

Hertz becomes recognisable where readable returns are counted per second.

## Carries
