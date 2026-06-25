---
grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.trace

needs:
  - "[[Hold]]"
  - "[[Connection]]"

conditions:
  places: "the backward availability of held connection."
  holds: "[[Hold]] and [[Connection]]. Connection must hold before a backward path through it can be available."
  pairs: "[[Carry]]. Trace is the backward availability of held connection; Carry is the forward availability of the same connection."
  traces:
    - "[[Hold]]"
    - "[[Connection]]"
  nests: "within connection as its backward availability, whether or not a participant is presently retracing it."
  reads: "where held connection offers a path back toward the condition from which its forward carry proceeds."
  carries:
    - "[[Read]]"
    - "[[Thread]]"
    - "[[Bearing Source]]"
    - "[[Web]]"
    - "[[Responsibility]]"
    - "[[Consequence]]"
    - "[[Retracing]]"
    - "[[Retrace Read]]"
    - "[[Echo]]"
    - "[[Recarry]]"
    - "[[Apparent Source]]"
    - "[[Extend]]"
    - "[[Extent]]"
    - "[[Terms of Service]]"
    - "[[Fabric]]"
    - "[[Order Trace]]"
    - "[[Atlas Practice]]"
    - "[[Carry-Trace Test]]"
    - "[[Step]]"
    - "[[Tracing]]"
    - "[[Retrace Practice]]"
    - "[[Grafting]]"

publish: true
status: stable
garden_status: rooted
---
# Trace

Trace names the backward availability of held [[Connection]].

Trace is not yet [[Retracing]]. Trace names the path connection offers where relation is held enough for backward availability to remain readable. Retracing names movement back through that path. A connection may offer trace whether or not a participant, process, or condition is presently retracing it. Forward, the same held connection offers [[Carry]]. Backward, it offers trace.

## Places

Trace places the backward availability of held connection.

## Holds

Trace is held by [[Hold]] and [[Connection]]. Connection must hold before a backward path through it can be available.

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
- [[Grafting]]
