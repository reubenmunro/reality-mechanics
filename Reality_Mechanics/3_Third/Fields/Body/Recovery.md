---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.recovery
determination: pd.v3.pre-provenance-baseline
domain: body

conditions:
  places: "compatible re-bearing within the body following fatigue or injury — the restoration of carrying capacity through rest, repair, or sustained support."
  needs:
    targets:
      - third.body
      - third.fatigue
      - third.injury
      - third.repair
      - second.recarry
      - second.carrying
      - second.energy
      - second.compatibility
      - second.carried-condition
  holds:
    targets:
      - third.body
      - third.fatigue
      - third.injury
      - third.repair
      - second.recarry
      - second.carrying
      - second.energy
      - second.compatibility
      - second.carried-condition
    read: "[[Body]], [[Fatigue]], [[Injury]], [[Repair]], [[Recarry]], [[Carrying]], [[Energy]], [[Compatibility]], and [[Carried Condition]]. Prior carrying reduction or damage must be present before compatible re-bearing can be named as recovery."
  pairs:
    targets:
      - third.fatigue
    read: "[[Fatigue]]. Recovery names compatible re-bearing following reduction; Fatigue names the reduction. Both read the body's capacity for continued participation."
  traces:
    targets:
      - third.body
      - third.fatigue
      - third.injury
      - third.repair
      - second.recarry
      - second.carrying
      - second.energy
      - second.compatibility
      - second.carried-condition
  nests:
    targets: []
    read: "within the Body Field as the condition through which compatible carrying is restored following fatigue or injury."
  reads:
    targets: []
    read: "Recovery becomes readable where embodied participation can return without repeating the incompatibility that reduced or damaged it."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Recovery

Compatible re-bearing within the body following fatigue or injury — the restoration of carrying capacity through rest, repair, or sustained support.

Recovery is held by [[Body]], [[Fatigue]], [[Injury]], [[Repair]], [[Recarry]], [[Carrying]], [[Energy]], [[Compatibility]], and [[Carried Condition]]. Prior carrying reduction or damage must be present before compatible re-bearing can be named as recovery.

## Places

Recovery places compatible re-bearing within the body following fatigue or injury — the restoration of carrying capacity through rest, repair, or sustained support.

## Holds

Recovery is held by [[Body]], [[Fatigue]], [[Injury]], [[Repair]], [[Recarry]], [[Carrying]], [[Energy]], [[Compatibility]], and [[Carried Condition]]. Prior carrying reduction or damage must be present before compatible re-bearing can be named as recovery.

## Pairs

Recovery pairs with [[Fatigue]]. Recovery names compatible re-bearing following reduction; Fatigue names the reduction. Both read the body's capacity for continued participation.

## Traces

- [[Body]]
- [[Fatigue]]
- [[Injury]]
- [[Repair]]
- [[Recarry]]
- [[Carrying]]
- [[Energy]]
- [[Compatibility]]
- [[Carried Condition]]

## Nests

Recovery nests within the Body Field as the condition through which compatible carrying is restored following fatigue or injury.

## Reads

Recovery becomes readable where embodied participation can return without repeating the incompatibility that reduced or damaged it.

The dependency movement is:

First: embodied [[Strain]] or damaged [[Boundary]] reduces available bearing.

Second: [[Repair]], [[Recarry]], [[Carrying]], and [[Compatibility]] make return supportable.

Third: [[Recovery]] places that structural read inside the body branch.

## Carries

This note carries no further public branch at this scope.
