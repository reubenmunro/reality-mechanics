---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.sever
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "a trace-bearing connection to a bearing source resolved as cut, so direct return no longer remains followable."
  needs:
    targets:
      - second.bearing-source
      - second.coupled-boundary
      - first.resolution
  holds:
    targets:
      - second.bearing-source
      - second.coupled-boundary
      - first.resolution
    read: "[[Bearing Source]], [[Coupled Boundary]], and [[Resolution]]. A source must be recoverable through trace, the connection must be held through coupling, and its bearing must be determined as cut before sever can be named."
  pairs:
    targets: []
    read: "No lateral pair is required at this placement yet. Decoupling names mutual availability no longer holding; Sever names the trace-bearing path itself cut."
  traces:
    targets:
      - second.bearing-source
      - second.coupled-boundary
      - first.resolution
  nests:
    targets: []
    read: "within coupling where a cut makes the prior path to source no longer directly enterable, whether or not downstream carrying continues."
  reads:
    targets: []
    read: "Sever becomes readable where a condition remains present or effective but its direct trace-bearing passage to what sourced, grounded, or previously carried it has been cut."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Sever

A trace-bearing connection to a bearing source resolved as cut, so direct return no longer remains followable.

Sever is held by [[Bearing Source]], [[Coupled Boundary]], and [[Resolution]]. A source must be recoverable through trace, the connection must be held through coupling, and its bearing must be determined as cut before sever can be named.

Sever does not necessarily end carrying. A downstream condition may remain present, stable, useful, or effective after the path through which it returned to source has been cut.

## Places

Sever places a trace-bearing connection to a bearing source resolved as cut, so direct return no longer remains followable.

## Holds

Sever is held by [[Bearing Source]], [[Coupled Boundary]], and [[Resolution]]. A source must be recoverable through trace, the connection must be held through coupling, and its bearing must be determined as cut before sever can be named.

## Pairs

No lateral pair is required at this placement yet. Decoupling is a useful distinction: Decoupling names mutual availability no longer holding; Sever names the trace-bearing path itself cut.

## Traces

- [[Bearing Source]]
- [[Coupled Boundary]]
- [[Resolution]]

## Nests

Sever nests within coupling where a cut makes the prior path to source no longer directly enterable, whether or not downstream carrying continues.

## Reads

Sever becomes readable where a condition remains present or effective but its direct trace-bearing passage to what sourced, grounded, or previously carried it has been cut.

A severed condition may still carry inherited form, capacity, consequence, memory, or use. What has ended is not necessarily its effectiveness, but direct return through the connection from which that carrying came.

Sever can make later [[Source Drift]] possible, but does not produce it by definition. Source Drift begins only where downstream carrying is then mistaken for source because retrace stops at what remains.

## Carries

This note carries no further public branch at this scope.
