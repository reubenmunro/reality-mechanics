---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.architectural-constraint
determination: pd.v3.pre-provenance-baseline
domain: architecture

conditions:
  places: "limiting conditions that shape available built resolution."
  needs:
    targets:
      - third.architecture
      - second.constraint
      - first.availability
      - second.compatibility
  holds:
    targets:
      - third.architecture
      - second.constraint
      - first.availability
      - second.compatibility
    read: "[[Architecture]], [[Constraint]], [[Availability]], [[Compatibility]]."
  pairs:
    targets:
      - third.architectural-carrying
    read: "[[Architectural Carrying]]. Architectural Constraint names the bounded conditions that govern structural carrying; Architectural Carrying names the continuation that must remain within those bounds."
  traces:
    targets:
      - third.architecture
      - second.constraint
      - first.availability
      - second.compatibility
  nests:
    targets: []
    read: "where this read holds at its field, domain, or practice scope without losing trace."
  reads:
    targets: []
    read: "Architectural Constraint becomes readable where built limitation directs or restricts availability while remaining compatible with use."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Architectural Constraint

Limiting conditions that shape available built resolution.

Architectural Constraint is held by [[Architecture]], [[Constraint]], [[Availability]], [[Compatibility]].

## Places

Architectural Constraint places limiting conditions that shape available built resolution.

## Holds

Architectural Constraint is held by [[Architecture]], [[Constraint]], [[Availability]], [[Compatibility]].

## Pairs

Architectural Constraint pairs with [[Architectural Carrying]]. Architectural Constraint names the bounded conditions that govern structural carrying; Architectural Carrying names the continuation that must remain within those bounds.

## Traces

- [[Architecture]]
- [[Constraint]]
- [[Availability]]
- [[Compatibility]]

## Nests

Architectural Constraint nests where this read holds at its field, domain, or practice scope without losing trace.

## Reads

Architectural Constraint becomes readable where built limitation directs or restricts availability while remaining compatible with use.

The dependency movement is:

First: [[Availability]] presents what can be built, entered, occupied, or changed.

Second: [[Constraint]] and [[Compatibility]] make limiting conditions evaluable.

Third: [[Architectural Constraint]] places that structural read inside architecture.

## Carries

This note carries no further public branch at this scope.
