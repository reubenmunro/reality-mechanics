---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.absorb
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution where bearing takes strain into itself and dampens or contains it"
  needs:
    targets:
      - first.resolution
      - first.bearing
      - first.strain
  holds:
    targets:
      - first.resolution
      - first.bearing
      - first.strain
    read: "[[Resolution]], [[Bearing]], and [[Strain]] — strain must be borne before it can be taken in"
  pairs:
    targets:
      - first.transfer
    read: "[[Transfer]] — Absorb takes a condition in under strain; Transfer moves a resolved condition to another carrier. Each requires the other to be locatable."
  traces:
    targets:
      - first.resolution
      - first.bearing
      - first.strain
  nests:
    targets: []
    read: "under first-order resolution — can support later carrying where contained strain remains supportable"
  reads:
    targets: []
    read: "where bearing resolves by taking strain into the condition rather than passing it on, releasing it, or collapsing under it"
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Absorb

Resolution where bearing takes strain into itself and dampens or contains it.

Absorb is held by [[Resolution]], [[Bearing]], and [[Strain]]. Strain must be borne before it can be taken in.

## Places

Absorb places resolution where bearing takes strain into itself and dampens or contains it.

## Holds

Absorb is held by [[Resolution]], [[Bearing]], and [[Strain]]. Strain must be borne before it can be taken in.

## Pairs

Absorb pairs with [[Transfer]]: absorb names the taking in of a condition under strain and bearing — receiving and holding what presses; transfer names the moving of a resolved condition from one carrier to another. Each requires the other to be locatable: absorbing is only readable against the possibility of transferring; transferring is only readable against the possibility of absorbing at the receiving end.

## Traces

- [[Resolution]]
- [[Bearing]]
- [[Strain]]

## Nests

Absorb nests under first-order resolution. It can support later carrying where contained strain remains supportable.

## Reads

Absorb becomes recognisable where bearing resolves by taking strain into the condition rather than passing it on, releasing it, or collapsing under it.

## Carries


