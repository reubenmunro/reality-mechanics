---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.decoupling
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "coupling no longer holding a coupled boundary as mutual availability."
  needs:
    targets:
      - second.coupled-boundary
      - second.boundary-loosening
      - first.release
  holds:
    targets:
      - second.coupled-boundary
      - second.boundary-loosening
      - first.release
    read: "[[Coupled Boundary]], [[Boundary Loosening]], and [[Release]]."
  pairs:
    targets:
      - second.coupling
    read: "[[Coupling]]. Decoupling names mutual availability no longer holding; Coupling names distinct resolved conditions held in mutual availability. Each requires the other to be locatable."
  traces:
    targets:
      - second.coupled-boundary
      - second.boundary-loosening
      - first.release
  nests:
    targets: []
    read: "where coupled boundary resolves as separation, release, or loss of mutual availability."
  reads:
    targets: []
    read: "where a coupled boundary resolves as separation, release, or loss of mutual availability rather than continued contact, compatibility, or participation."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Decoupling

Coupling no longer holding a coupled boundary as mutual availability.

Decoupling is held by [[Coupled Boundary]], [[Boundary Loosening]], and [[Release]].

## Places

Decoupling places coupling no longer holding a coupled boundary as mutual availability.

## Holds

Decoupling is held by [[Coupled Boundary]], [[Boundary Loosening]], and [[Release]].

## Pairs

Decoupling pairs with [[Coupling]]: decoupling names mutual availability no longer holding; coupling names distinct resolved conditions held in mutual availability. Each is only locatable against the other — decoupling is only readable where coupling was operative, and coupling is only readable where decoupling is possible.

## Traces

- [[Coupled Boundary]]
- [[Boundary Loosening]]
- [[Release]]
## Nests

Decoupling nests where coupled boundary resolves as separation, release, or loss of mutual availability.

## Reads

Decoupling becomes recognisable where a coupled boundary resolves as separation, release, or loss of mutual availability rather than continued contact, compatibility, or participation.

## Carries


