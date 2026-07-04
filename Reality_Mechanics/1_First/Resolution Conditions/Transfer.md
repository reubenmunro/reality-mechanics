---
grounded: true
order: first
kind: term
ai_role: term
condition_key: first.transfer

needs:
  - "[[Resolution]]"
  - "[[Bearing]]"
  - "[[Boundary]]"

conditions:
  places: "resolution where bearing passes strain, load, or support into another condition"
  holds: "[[Resolution]], [[Bearing]], and [[Boundary]] — what was borne must be determined enough to pass across a boundary"
  pairs: "[[Absorb]] — Transfer moves a resolved condition to another carrier; Absorb takes a condition in under strain. Each requires the other to be locatable."
  traces:
    - "[[Resolution]]"
    - "[[Bearing]]"
    - "[[Boundary]]"
  nests: "under first-order resolution — can open carrying but is not carrying in the second-order sense"
  reads: "where bearing resolves by passing strain or support across a boundary into another condition"
  carries:

publish: true
status: stable
---
# Transfer

Transfer names resolution where bearing passes strain, load, or support into another condition. Transfer is not carrying in the second-order sense; it is the first-order determination that what was borne is now borne elsewhere.

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

