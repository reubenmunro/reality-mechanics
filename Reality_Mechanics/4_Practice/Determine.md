---

grounded: true
register: practice
kind: operation
ai_role: practice
condition_key: practice.determine
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the Ark operation that carries pressure into a temporary bounded hold."
  needs:
    targets:
      - second.pressure
      - practice.check
      - first.boundary
      - first.clearance
      - first.hold
  holds:
    targets:
      - second.pressure
      - practice.check
      - first.boundary
      - first.clearance
      - first.hold
    read: "[[Pressure]], [[Check]], [[Boundary]], [[Clearance]], and [[Hold]]."
  pairs:
    targets:
      - practice.determination
    read: "[[Determination]]. Determine names the operation; Determination names the temporary hold produced by the operation."
  traces:
    targets:
      - second.pressure
      - practice.check
      - first.boundary
      - first.clearance
      - first.hold
  nests:
    targets: []
    read: "inside Ark Run as the transition from bounded scope to held determination."
  reads:
    targets: []
    read: "where pressure may settle only after retrace and check have made the present scope sufficiently bounded."
  carries:
    targets:
      - practice.determination
publish: true
status: working
---
# Determine

The Ark operation that carries pressure into a temporary bounded hold.

Determine is held by [[Pressure]], [[Check]], [[Boundary]], [[Clearance]], and [[Hold]].

It is not the act of producing an absolute answer. It is the act of allowing a determination to hold at the present scope because enough dependency has been retraced for that scope of read.

## Places

Determine places the Ark operation that carries pressure into a temporary bounded hold.

## Holds

Determine is held by [[Pressure]], [[Check]], [[Boundary]], [[Clearance]], and [[Hold]].

Pressure supplies the need to settle. Check and boundary test whether the scope is sufficiently bounded. Clearance preserves what must remain open. Hold lets the determination stabilise without pretending finality.

## Pairs

Determine pairs with [[Determination]]. Determine names the operation; Determination names the temporary hold produced by the operation.

## Traces

- [[Pressure]]
- [[Check]]
- [[Boundary]]
- [[Clearance]]
- [[Hold]]

## Nests

Determine nests inside [[Ark Run]] as the transition from bounded scope to held determination.

## Reads

Determine becomes recognisable where pressure toward settlement has been carried long enough that a scoped hold can become answerable.

If dependency has not been retraced, determine should not occur. The run should continue tracing, checking, or rescoping.

## Carries

- [[Determination]]

