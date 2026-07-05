---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.carry

needs:
  - "[[Hold]]"
  - "[[Connection]]"

conditions:
  places: "the forward availability of held connection."
  holds: "[[Hold]] and [[Connection]]. Connection must remain held for forward passage through it to be available — Hold does not finish before Carry begins; Carry is held support becoming available beyond itself."
  pairs: "[[Trace]]. Carry is the forward availability of held connection; Trace is the backward availability of the same connection."
  traces:
    - "[[Hold]]"
    - "[[Connection]]"
  nests: "within connection as its forward availability, before that availability is enacted as carrying."
  reads: "where held connection offers passage from a prior condition into a further condition without requiring that passage already to have been enacted."
  carries:
    - "[[First Order Crossing]]"
    - "[[Carrying]]"

publish: true
status: stable
---
# Carry

The forward availability of held connection.

Carry is held by [[Hold]] and [[Connection]]. Connection must remain held for forward passage through it to be available — Hold does not finish before Carry begins; Carry is held support becoming available beyond itself.

Carry is not yet [[Carrying]]. Carry names the passage connection offers where relation is held enough for forward availability to remain traceable. Carrying names movement through that passage. A connection may offer carry whether or not a participant, process, or condition is presently carrying through it.

Carry does not require the connected condition to remain unchanged. It only names forward availability through the connection.

## Places

Carry places the forward availability of held connection.

## Holds

Carry is held by [[Hold]] and [[Connection]]. Connection must remain held for forward passage through it to be available — Hold does not finish before Carry begins; Carry is held support becoming available beyond itself.

## Pairs

Carry pairs with [[Trace]]. Carry is the forward availability of held connection; Trace is the backward availability of the same connection.

## Traces

- [[Connection]]
- [[Hold]]

## Nests

Carry nests within connection as its forward availability, before that availability is enacted as carrying.

## Reads

Carry becomes recognisable where held connection offers passage from a prior condition into a further condition without requiring that passage already to have been enacted.

## Carries

- [[First Order Crossing|Threshold (First → Second)]]
- [[Carrying]]
