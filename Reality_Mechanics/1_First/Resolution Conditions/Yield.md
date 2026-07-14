---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.yield
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution where bearing gives under strain without fully failing"
  needs:
    targets:
      - first.resolution
      - first.bearing
  holds:
    targets:
      - first.resolution
      - first.bearing
    read: "[[Resolution]] and [[Bearing]] — bearing must be determined under strain before give can be read"
  pairs:
    targets:
      - first.shift
    read: "[[Shift]] — yield gives under strain without failing; shift changes orientation-direction without yielding"
  traces:
    targets:
      - first.resolution
      - first.bearing
  nests:
    targets: []
    read: "under first-order resolution as partial give rather than stable hold or total failure"
  reads:
    targets: []
    read: "where bearing resolves as deformation, concession, or give while some support or continuity remains"
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Yield

Resolution where bearing gives under strain without fully failing.

Yield is held by [[Resolution]] and [[Bearing]]. Bearing must be determined under strain before give can be read.

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


