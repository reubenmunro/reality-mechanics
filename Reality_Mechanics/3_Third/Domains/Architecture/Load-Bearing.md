---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.load-bearing
determination: pd.v3.pre-provenance-baseline
domain: architecture

conditions:
  places: "the architectural read where required bearing continues through built use without exceeding load, capacity, carrying, or compatibility."
  needs:
    targets:
      - third.architecture
      - first.bearing
      - second.load
      - second.capacity
      - second.carrying
      - second.compatibility
  holds:
    targets:
      - third.architecture
      - first.bearing
      - second.load
      - second.capacity
      - second.carrying
      - second.compatibility
    read: "[[Architecture]], [[Bearing]], [[Load]], [[Capacity]], [[Carrying]], [[Compatibility]]."
  pairs:
    targets: []
    read: "No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read."
  traces:
    targets:
      - third.architecture
      - first.bearing
      - second.load
      - second.capacity
      - second.carrying
      - second.compatibility
  nests:
    targets:
      - third.architecture
    read: "within [[Architecture]] as a local translation of bearing, load, capacity, carrying, and compatibility."
  reads:
    targets: []
    read: "Load-Bearing becomes readable where required load continues through built use without exceeding capacity or compatibility at the current closure scope."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Load-Bearing

The architectural read where required bearing continues through built use without exceeding load, capacity, carrying, or compatibility.

Load-Bearing is held by [[Architecture]], [[Bearing]], [[Load]], [[Capacity]], [[Carrying]], [[Compatibility]].

## Places

Load-Bearing places the architectural read where required bearing continues through built use without exceeding load, capacity, carrying, or compatibility.

## Holds

Load-Bearing is held by [[Architecture]], [[Bearing]], [[Load]], [[Capacity]], [[Carrying]], [[Compatibility]].

## Pairs

No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read.

## Traces

- [[Architecture]]
- [[Bearing]]
- [[Load]]
- [[Capacity]]
- [[Carrying]]
- [[Compatibility]]

## Nests

Load-Bearing nests within [[Architecture]] as a local translation of bearing, load, capacity, carrying, and compatibility.

## Reads

Load-Bearing becomes readable where required load continues through built use without exceeding capacity or compatibility at the current closure scope.

The dependency movement is:

First: [[Bearing]] carries strained asymmetry.

Second: [[Load]], [[Capacity]], [[Carrying]], and [[Compatibility]] make load support locally evaluable.

Third: [[Load-Bearing]] places that structural read inside architecture.

## Carries

This note carries no further public branch at this scope.
