---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.yield

needs:
  - "[[Resolution]]"
  - "[[Bearing]]"

conditions:
  places: "resolution where bearing gives under strain without fully failing"
  holds: "[[Resolution]] and [[Bearing]] — bearing must be determined under strain before give can be read"
  pairs: "[[Shift]] — yield gives under strain without failing; shift changes orientation-direction without yielding"
  traces:
    - "[[Resolution]]"
    - "[[Bearing]]"
  nests: "under first-order resolution as partial give rather than stable hold or total failure"
  reads: "where bearing resolves as deformation, concession, or give while some support or continuity remains"
  carries: []

publish: true
status: stable
---
# Yield

Resolution where bearing gives under strain without fully failing.

## Places

Yield places resolution where bearing gives under strain without fully failing.

## Holds

Yield is held by [[Resolution]] and [[Bearing]]. Bearing must be determined under strain before give can be read.

## Pairs

Yield pairs with [[Shift]]: yield names resolution where bearing gives under strain without fully failing; shift names resolution where bearing relocates orientation without yielding. Each requires the other to be locatable — yield is only readable against the possibility of shifting; shift is only readable against the possibility of yielding.

## Traces

- [[Resolution]]
- [[Bearing]]

## Nests

Yield nests under first-order resolution as partial give rather than stable hold or total failure.

## Reads

Yield becomes recognisable where bearing resolves as deformation, concession, or give while some support or continuity remains.

## Carries


