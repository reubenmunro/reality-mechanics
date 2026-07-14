---

grounded: true
order: third
kind: term
ai_role: term
condition_key: third.noise
determination: pd.v3.pre-provenance-baseline
domain: music

conditions:
  places: "sound not currently readable as signal, pattern, relation, or line at the relevant scope."
  needs:
    targets:
      - third.sound
      - second.readability
      - second.scope
  holds:
    targets:
      - third.sound
      - second.readability
      - second.scope
    read: "[[Sound]], [[Readability]], and [[Scope]]. Sound must be present, and a scope of reading must be active, before unreadable audible carrying can be named as noise."
  pairs:
    targets:
      - third.sound
    read: "[[Sound]]. Sound names audible carrying that can become available to read; Noise names sound whose relation is not currently readable at the relevant scope."
  traces:
    targets:
      - third.sound
      - second.readability
      - second.scope
  nests:
    targets: []
    read: "within the music domain as the sound/readability boundary where audible carrying is present but not currently readable as signal, pattern, relation, or line."
  reads:
    targets: []
    read: "Noise becomes readable where sound is present but cannot be carried as signal, pattern, relation, melody, harmony, or rhythm at the current scope or resolution band."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Noise

Sound not currently readable as signal, pattern, relation, or line at the relevant scope.

Noise is held by [[Sound]], [[Readability]], and [[Scope]]. Sound must be present, and a scope of reading must be active, before unreadable audible carrying can be named as noise.

Noise is not bad sound. It may be meaningful at another scope, with another instrument, in another domain, or for another participant. It is noise where audible carrying is present but cannot currently be read as signal, pattern, relation, melody, harmony, or rhythm.

## Places

Noise places sound not currently readable as signal, pattern, relation, or line at the relevant scope.

## Holds

Noise is held by [[Sound]], [[Readability]], and [[Scope]]. Sound must be present, and a scope of reading must be active, before unreadable audible carrying can be named as noise.

## Pairs

Noise pairs with [[Sound]]. Sound names audible carrying that can become available to read; Noise names sound whose relation is not currently readable at the relevant scope.

## Traces

- [[Sound]]
- [[Readability]]
- [[Scope]]

## Nests

Noise nests within the music domain as the sound/readability boundary where audible carrying is present but not currently readable as signal, pattern, relation, or line.

## Reads

Noise becomes readable where sound is present but cannot be carried as signal, pattern, relation, melody, harmony, or rhythm at the current scope or resolution band.

## Carries

Noise carries no further public branch at this scope.
