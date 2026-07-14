---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.scale
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "readable extent along a dimension within a reference frame."
  needs:
    targets:
      - second.dimension
      - second.reference-frame
  holds:
    targets:
      - second.dimension
      - second.reference-frame
    read: "[[Dimension]] and [[Reference Frame]]."
  pairs:
    targets:
      - second.pattern
      - second.measure
    read: "Asymmetry carries downward — into [[Pattern]] and [[Measure]]"
  traces:
    targets:
      - second.dimension
      - second.reference-frame
  nests:
    targets: []
    read: "where dimension has readable extent within closure scope."
  reads:
    targets: []
    read: "where a dimension can be read as having extent — where something can be evaluated as more or less along a readable axis, and where order can be checked for continuity or substitution across a scale transition."
  carries:
    targets:
      - second.pattern
      - second.information
      - second.measure
      - second.relative
      - second.growth
      - second.decay
      - second.thing
      - third.timescale
      - second.member
      - third.extractive-acceleration
publish: true
status: stable
---
# Scale

Readable extent along a dimension within a reference frame.

Scale is held by [[Dimension]] and [[Reference Frame]].

Scale does not guarantee that order survives a change of scale. A scale transition remains traceable only where the operational order can be retraced across the transition. Where the apparent continuity of scale hides a substituted order, scale has become a site of drift rather than a preserved read.

Order may recur across scale, but each recurrence resolves through a different band. Recurrence allows translation across scale; resolution difference prevents collapse into sameness.

## Places

Scale places readable extent along a dimension within a reference frame.

## Holds

Scale is held by [[Dimension]] and [[Reference Frame]].

## Pairs

Asymmetry carries downward. Scale is the magnitude of difference within a dimension. Its asymmetry is expressed in what it carries: [[Pattern]] and [[Measure]].

## Traces

- [[Dimension]]
- [[Reference Frame]]

## Nests

Scale nests where dimension has readable extent within closure scope.

## Reads

Scale becomes recognisable where a dimension can be read as having extent: more or less along a readable axis, from a placed reference.

Scale also becomes recognisable where an order is tested across transition: the question is not only whether something is larger, smaller, faster, slower, nearer, or wider, but whether the same order can still be retraced after the change in extent.

A scale may exceed a participant's resolution band without ceasing to be effective. At that point the scale must be translated, measured, sampled, inferred, or nested through another carrier before it becomes readable.

## Carries


- [[Pattern]]
- [[Information]]
- [[Measure]]
- [[Relative]]
- [[Growth]]
- [[Decay]]
- [[Thing]]
- [[Timescale]]
- [[Member]]
- [[Extractive Acceleration]]
