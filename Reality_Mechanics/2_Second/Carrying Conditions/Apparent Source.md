---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.apparent-source
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a presented or attributed structure taken as source where trace does not recover it as what actually bears the carrying."
  needs:
    targets:
      - first.apparent
      - first.trace
      - second.carrying
      - second.structure
  holds:
    targets:
      - first.apparent
      - first.trace
      - second.carrying
      - second.structure
    read: "[[Apparent]], [[Trace]], [[Carrying]], and [[Structure]]. A structure must be presented, carrying must be active, and trace must be available to test whether the presented source actually bears it before apparent source can be named."
  pairs:
    targets:
      - second.bearing-source
    read: "[[Bearing Source]]. Bearing Source names the structure recovered by trace as what actually bears a carried condition; Apparent Source names a presented or attributed structure taken as source that trace does not recover as its bearer."
  traces:
    targets:
      - first.apparent
      - first.trace
      - second.carrying
      - second.structure
  nests:
    targets: []
    read: "inside carrying where a visible, proximal, authoritative, or stable structure is taken as source while its bearing remains unsupported by trace."
  reads:
    targets: []
    read: "where retrace passes through or beyond the structure treated as source and recovers the actual bearing elsewhere."
  carries:
    targets:
      - higher.source-drift
publish: true
status: stable
---
# Apparent Source

A presented or attributed structure taken as source where trace does not recover it as what actually bears the carrying.

Apparent Source is held by [[Apparent]], [[Trace]], [[Carrying]], and [[Structure]]. A structure must be presented, carrying must be active, and trace must be available to test whether the presented source actually bears it before apparent source can be named.

A structure may be visible, proximal, authoritative, fluent, stable, or powerful enough to appear as source. Apparent Source does not mean the structure is unreal or carries nothing. It means the structure does not bear the carrying in the source-role attributed to it.

## Places

Apparent Source places a presented or attributed structure taken as source where trace does not recover it as what actually bears the carrying.

## Holds

Apparent Source is held by [[Apparent]], [[Trace]], [[Carrying]], and [[Structure]]. A structure must be presented, carrying must be active, and trace must be available to test whether the presented source actually bears it before apparent source can be named.

## Pairs

Apparent Source pairs with [[Bearing Source]]. Bearing Source names the structure recovered by trace as what actually bears a carried condition; Apparent Source names a presented or attributed structure taken as source that trace does not recover as its bearer. Each requires the other to be locatable: actual source is tested against what only appears to bear, while apparent source can only be diagnosed where actual bearing remains recoverable.

## Traces

- [[Apparent]]
- [[Trace]]
- [[Carrying]]
- [[Structure]]

## Nests

Apparent Source nests inside carrying where a visible, proximal, authoritative, or stable structure is taken as source while its bearing remains unsupported by trace.

## Reads

Apparent Source becomes recognisable where retrace passes through or beyond the structure treated as source and recovers the actual bearing elsewhere.

An author may be the apparent source of a claim whose bearing comes from a wider practice, world, or inherited relation. A model may be the apparent source of an answer whose bearing comes from training, tools, human labour, energy, and checked external conditions. Apparent Source does not erase the local carrier; it corrects the role assigned to it.

## Carries

- [[Source Drift]]
