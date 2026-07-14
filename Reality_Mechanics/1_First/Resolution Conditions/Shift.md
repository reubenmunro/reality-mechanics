---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.shift
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution where bearing relocates orientation without yielding, failing, transferring, or being lost"
  needs:
    targets:
      - first.resolution
      - first.orientation
  holds:
    targets:
      - first.resolution
      - first.orientation
    read: "[[Resolution]] and [[Orientation]] — bearing must be determined and orientation available before reorientation can be read"
  pairs:
    targets:
      - first.yield
    read: "[[Yield]] — shift changes orientation-direction without giving under strain; yield gives under strain without failing"
  traces:
    targets:
      - first.resolution
      - first.orientation
  nests:
    targets:
      - first.threshold
    read: "under first-order resolution as reorientation without loss — may return to [[Threshold]] where the new orientation makes a change-limit readable"
  reads:
    targets: []
    read: "where resolved bearing relocates its orientation rather than staying, giving, exiting, or failing — where the condition has changed direction while remaining itself"
  carries:
    targets:
      - first.threshold
      - second.adaptation
publish: true
status: stable
---
# Shift

Resolution where bearing relocates orientation without yielding, failing, transferring, or being lost.

Shift is held by [[Resolution]] and [[Orientation]]. Bearing must be determined, and orientation must be available, before reorientation can be read.

Where [[Hold]] names resolution staying the same and [[Yield]] names a give under strain, Shift names bearing resolving into a changed orientation without yielding or failing.

## Places

Shift places resolution where bearing relocates orientation without yielding, failing, transferring, or being lost.

## Holds

Shift is held by [[Resolution]] and [[Orientation]]. Bearing must be determined, and orientation must be available, before reorientation can be read.

## Pairs

Shift pairs with [[Yield]]: shift names resolution where bearing relocates its orientation without giving; yield names resolution where bearing gives under strain without fully failing.

## Traces

- [[Resolution]]
- [[Orientation]]

## Nests

Shift nests under first-order resolution as reorientation without loss. It may return to [[Threshold]] where the new orientation makes a change-limit readable.

## Reads

Shift becomes recognisable where resolved bearing relocates its orientation rather than staying, giving, exiting, or failing — where the condition is read as having changed direction while remaining itself.

## Carries

- [[Threshold]]
- [[Adaptation]]
