---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.trace
determination: pd.2026-07-18.calibration-revision-set

conditions:
  places: "the backward availability of held connection."
  needs:
    targets:
      - first.hold
      - first.connection
  holds:
    targets:
      - first.hold
      - first.connection
    read: "[[Hold]] and [[Connection]]. Connection must remain held for a backward path through it to be available — Hold does not finish before Trace begins; Trace is held support becoming available backward."
  pairs:
    targets:
      - first.carry
    read: "[[Carry]]. Trace is the backward availability of held connection; Carry is the forward availability of the same connection."
  traces:
    targets:
      - first.hold
      - first.connection
  nests:
    targets: []
    read: "within connection as its backward availability, whether or not a participant is presently retracing it."
  reads:
    targets: []
    read: "where held connection offers a path back toward the condition from which its forward carry proceeds."
  carries:
    targets:
      - first.read
      - first.thread
      - second.bearing-source
      - higher.web
      - second.responsibility
      - second.consequence
      - practice.retracing
      - second.retrace-read
      - second.echo
      - second.recarry
      - second.apparent-source
      - second.extend
      - second.extent
      - third.terms-of-service
      - higher.fabric
      - practice.order-trace
      - practice.atlas-practice
      - practice.carry-trace-test
      - practice.step
      - practice.tracing
      - practice.retrace-practice
      - practice.grafting
      - practice.reasoning
      - second.drift
      - third.translation
publish: true
status: stable
---
# Trace

The backward availability of held connection.

Trace is held by [[Hold]] and [[Connection]]. Connection must remain held for a backward path through it to be available — Hold does not finish before Trace begins; Trace is held support becoming available backward.

Trace is not yet [[Retracing]]. Trace names the path connection offers where relation is held enough for backward availability to remain readable. Retracing names movement back through that path. A connection may offer trace whether or not a participant, process, or condition is presently retracing it. Forward, the same held connection offers [[Carry]]. Backward, it offers trace.

## Places

Trace places the backward availability of held connection.

## Holds

Trace is held by [[Hold]] and [[Connection]]. Connection must remain held for a backward path through it to be available — Hold does not finish before Trace begins; Trace is held support becoming available backward.

## Pairs

Trace pairs with [[Carry]]. Trace is the backward availability of held connection; Carry is the forward availability of the same connection.

## Traces

- [[Connection]]
- [[Hold]]
## Nests

Trace nests within connection as its backward availability, before that availability is followed as retracing.

## Reads

Trace becomes recognisable where held connection offers a path back toward the condition from which its forward carry proceeds.

## Carries


- [[Read]]
- [[Thread]]
- [[Bearing Source]]
- [[Web]]
- [[Responsibility]]
- [[Consequence]]
- [[Retracing]]
- [[Retrace Read]]
- [[Echo]]
- [[Recarry]]
- [[Apparent Source]]
- [[Extend]]
- [[Extent]]
- [[Terms of Service]]
- [[Fabric]]
- [[Order Trace]]
- [[Atlas Practice]]
- [[Carry-Trace Test]]
- [[Step]]
- [[Tracing]]
- [[Retrace Practice]]
- [[Splicing]]
- [[Reasoning]]
- [[Drift]]
- [[Translation]]
