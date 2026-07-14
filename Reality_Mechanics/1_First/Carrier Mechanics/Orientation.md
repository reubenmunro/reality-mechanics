---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.orientation
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the bearing-direction of a located distinction"
  needs:
    targets:
      - first.bearing
  holds:
    targets:
      - first.bearing
    read: "[[Bearing]] — strain must be held before its direction can be read"
  pairs:
    targets:
      - first.polarity
    read: "Asymmetry carries downward — into [[Polarity]]. Orientation names the bearing-direction; Polarity is what direction differentiates into. The structure flows from direction to its readable poles without a lateral co-condition."
  traces:
    targets:
      - first.bearing
  nests:
    targets: []
    read: "before preference, aim, intention, or outcome — names directionality before determination"
  reads:
    targets: []
    read: "where a located distinction can be read as bearing in one direction rather than another — where the held condition has a readable directionality"
  carries:
    targets:
      - first.polarity
      - first.shift
      - second.current
      - second.velocity
publish: true
status: stable
---
# Orientation

The bearing-direction of a located distinction.

Orientation is held by [[Bearing]]. Strain must be held before its direction can be read.

## Places

Orientation places the bearing-direction of a located distinction.

## Holds

Orientation is held by [[Bearing]]. Strain must be held before its direction can be read.

## Pairs

Asymmetry carries downward — into [[Polarity]]. Orientation names directionality before determination; Polarity is what that direction differentiates into. No lateral pair: direction of bearing does not require a co-present condition to be locatable.

## Traces

- [[Bearing]]

## Nests

Orientation nests before preference, aim, intention, or outcome. It names directionality before determination.

## Reads

Orientation becomes recognisable where a located distinction can be read as bearing in one direction rather than another — where the held condition has a readable directionality.

## Carries


- [[Polarity]]
- [[Shift]]
- [[Current]]
- [[Velocity]]
