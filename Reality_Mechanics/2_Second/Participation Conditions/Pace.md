---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.pace
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "supportable rate through carrying."
  needs:
    targets:
      - second.rate
      - second.carrying
      - second.compatibility
  holds:
    targets:
      - second.rate
      - second.carrying
      - second.compatibility
    read: "[[Rate]], [[Carrying]], and [[Compatibility]]."
  pairs:
    targets:
      - third.learning-pace
      - third.pace-mismatch
    read: "Asymmetry carries downward — into [[Learning Pace]] and [[Pace Mismatch]]"
  traces:
    targets:
      - second.rate
      - second.carrying
      - second.compatibility
  nests:
    targets: []
    read: "where rate is evaluated against supportable carrying and compatibility."
  reads:
    targets: []
    read: "where a rate of proceeding can be evaluated as supportable, too fast, too slow, or mismatched for the carrying condition."
  carries:
    targets:
      - third.learning-pace
      - third.pace-mismatch
      - second.tempo
      - third.extractive-acceleration
publish: true
status: stable
---
# Pace

Supportable rate through carrying.

Pace is held by [[Rate]], [[Carrying]], and [[Compatibility]].

## Places

Pace places supportable rate through carrying.

## Holds

Pace is held by [[Rate]], [[Carrying]], and [[Compatibility]].

## Pairs

Asymmetry carries downward. Pace is a singular condition — rate of carrying through compatibility. The asymmetry is expressed in what pace carries: [[Learning Pace]] and [[Pace Mismatch]].

## Traces

- [[Rate]]
- [[Carrying]]
- [[Compatibility]]

## Nests

Pace nests where rate is evaluated against supportable carrying and compatibility.

## Reads

Pace becomes recognisable where a rate of proceeding can be evaluated as supportable, too fast, too slow, or mismatched for the carrying condition.

## Carries


- [[Learning Pace]]
- [[Pace Mismatch]]
- [[Tempo]]
- [[Extractive Acceleration]]
