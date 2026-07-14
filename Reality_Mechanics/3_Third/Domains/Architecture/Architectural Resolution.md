---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.architectural-resolution
determination: pd.v3.pre-provenance-baseline
domain: architecture

conditions:
  places: "determination of built carrying across design conditions, construction conditions, regulatory conditions, and occupation."
  needs:
    targets:
      - third.architecture
      - first.resolution
      - second.carrying
      - second.compatibility
  holds:
    targets:
      - third.architecture
      - first.resolution
      - second.carrying
      - second.compatibility
    read: "[[Architecture]], [[Resolution]], [[Carrying]], [[Compatibility]]."
  pairs:
    targets:
      - third.architectural-boundary
    read: "[[Architectural Boundary]]. Architectural Resolution names the determination of strain at architectural scope; Architectural Boundary names where that determination is required."
  traces:
    targets:
      - third.architecture
      - first.resolution
      - second.carrying
      - second.compatibility
  nests:
    targets: []
    read: "where this read holds at its field, domain, or practice scope without losing trace."
  reads:
    targets: []
    read: "Architectural Resolution becomes readable where a built condition is determined enough for use, support, or construction to continue compatibly."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Architectural Resolution

Determination of built carrying across design conditions, construction conditions, regulatory conditions, and occupation.

Architectural Resolution is held by [[Architecture]], [[Resolution]], [[Carrying]], [[Compatibility]].

## Places

Architectural Resolution places determination of built carrying across design conditions, construction conditions, regulatory conditions, and occupation.

## Holds

Architectural Resolution is held by [[Architecture]], [[Resolution]], [[Carrying]], [[Compatibility]].

## Pairs

Architectural Resolution pairs with [[Architectural Boundary]]. Architectural Resolution names the determination of strain at architectural scope; Architectural Boundary names where that determination is required.

## Traces

- [[Architecture]]
- [[Resolution]]
- [[Carrying]]
- [[Compatibility]]

## Nests

Architectural Resolution nests where this read holds at its field, domain, or practice scope without losing trace.

## Reads

Architectural Resolution becomes readable where a built condition is determined enough for use, support, or construction to continue compatibly.

The dependency movement is:

First: [[Resolution]] determines what the built condition becomes.

Second: [[Carrying]] and [[Compatibility]] make that determination continuable through use.

Third: [[Architectural Resolution]] places that structural read inside architecture.

## Carries

This note carries no further public branch at this scope.
