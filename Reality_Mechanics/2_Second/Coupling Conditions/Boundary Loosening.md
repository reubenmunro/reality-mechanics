---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.boundary-loosening
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a coupled boundary becoming less tightly held while the coupling has not yet fully broken."
  needs:
    targets:
      - second.coupled-boundary
      - second.compatibility
  holds:
    targets:
      - second.coupled-boundary
      - second.compatibility
    read: "[[Coupled Boundary]] and [[Compatibility]]."
  pairs:
    targets:
      - second.decoupling
    read: "Asymmetry carries downward — into [[Decoupling]]"
  traces:
    targets:
      - second.coupled-boundary
      - second.compatibility
  nests:
    targets: []
    read: "between coupled boundary and decoupling. It names weakening before full break."
  reads:
    targets: []
    read: "where a coupled boundary remains available but no longer holds the same tightness, constraint, or mutual fit it previously carried."
  carries:
    targets:
      - second.decoupling
publish: true
status: stable
---
# Boundary Loosening

A coupled boundary becoming less tightly held while the coupling has not yet fully broken.

Boundary Loosening is held by [[Coupled Boundary]] and [[Compatibility]].

## Places

Boundary Loosening places a coupled boundary becoming less tightly held while the coupling has not yet fully broken.

## Holds

Boundary Loosening is held by [[Coupled Boundary]] and [[Compatibility]].

## Pairs

Asymmetry carries downward. Boundary Loosening is a singular condition — the reduction of coupled boundary compatibility. The asymmetry is expressed in what boundary loosening carries: [[Decoupling]].

## Traces

- [[Coupled Boundary]]
- [[Compatibility]]

## Nests

Boundary Loosening nests between coupled boundary and decoupling. It names weakening before full break.

## Reads

Boundary Loosening becomes recognisable where a coupled boundary remains available but no longer holds the same tightness, constraint, or mutual fit it previously carried.

## Carries


- [[Decoupling]]
