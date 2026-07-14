---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.transfer
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution where bearing passes strain, load, or support into another condition"
  needs:
    targets:
      - first.resolution
      - first.bearing
      - first.boundary
  holds:
    targets:
      - first.resolution
      - first.bearing
      - first.boundary
    read: "[[Resolution]], [[Bearing]], and [[Boundary]] — what was borne must be determined enough to pass across a boundary"
  pairs:
    targets:
      - first.absorb
    read: "[[Absorb]] — Transfer moves a resolved condition to another carrier; Absorb takes a condition in under strain. Each requires the other to be locatable."
  traces:
    targets:
      - first.resolution
      - first.bearing
      - first.boundary
  nests:
    targets: []
    read: "under first-order resolution — can open carrying but is not carrying in the second-order sense"
  reads:
    targets: []
    read: "where bearing resolves by passing strain or support across a boundary into another condition"
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Transfer

Resolution where bearing passes strain, load, or support into another condition.

Transfer is held by [[Resolution]], [[Bearing]], and [[Boundary]]. What was borne must be determined enough to pass across a boundary.

## Places

Transfer places resolution where bearing passes strain, load, or support into another condition.

## Holds

Transfer is held by [[Resolution]], [[Bearing]], and [[Boundary]]. What was borne must be determined enough to pass across a boundary.

## Pairs

Transfer pairs with [[Absorb]]: transfer names the moving of a resolved condition across a boundary to another carrier; absorb names the taking in of a condition under strain and bearing. Each requires the other to be locatable: transfer is only readable against the possibility of something absorbing what is moved; absorb is only readable against the possibility of what is received having been transferred or generated elsewhere.

## Traces

- [[Resolution]]
- [[Bearing]]
- [[Boundary]]

## Nests

Transfer nests under first-order resolution. It can open carrying, but it is not carrying in the second-order sense.

## Reads

Transfer becomes recognisable where bearing resolves by passing strain or support across a boundary into another condition.

## Carries

