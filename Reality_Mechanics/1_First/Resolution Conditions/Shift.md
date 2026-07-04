---
grounded: true
order: first
kind: term
ai_role: term
condition_key: first.shift

needs:
  - "[[Resolution]]"
  - "[[Orientation]]"

conditions:
  places: "resolution where bearing relocates orientation without yielding, failing, transferring, or being lost"
  holds: "[[Resolution]] and [[Orientation]] — bearing must be determined and orientation available before reorientation can be read"
  pairs: "[[Yield]] — shift changes orientation-direction without giving under strain; yield gives under strain without failing"
  traces:
    - "[[Resolution]]"
    - "[[Orientation]]"
  nests: "under first-order resolution as reorientation without loss — may return to [[Threshold]] where the new orientation makes a change-limit readable"
  reads: "where resolved bearing relocates its orientation rather than staying, giving, exiting, or failing — where the condition has changed direction while remaining itself"
  carries:
    - "[[Threshold]]"
    - "[[Adaptation]]"

publish: true
status: stable
---
# Shift

Shift names resolution where bearing relocates orientation without yielding, failing, or being lost. Where [[Hold]] names resolution staying the same and [[Yield]] names a give under strain, shift names bearing resolving into a changed orientation.

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
