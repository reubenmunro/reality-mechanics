---

grounded: true
register: practice
kind: check
ai_role: practice
condition_key: practice.care-control-check
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the practice check that reads what kind of force a determination generates: care, compatible control, control drift, or unresolved force."
  needs:
    targets:
      - practice.ark-run
      - practice.determination
      - third.care
      - third.control
      - third.control-drift
      - practice.check
  holds:
    targets:
      - practice.ark-run
      - practice.determination
      - third.care
      - third.control
      - third.control-drift
      - practice.check
    read: "[[Ark Run]], [[Determination]], [[Care]], [[Control]], [[Control Drift]], and [[Check]]."
  pairs:
    targets:
      - third.care-without-bearing
    read: "[[Care Without Bearing]]. Care-Control Check asks whether care or control remains borne; Care Without Bearing names a failure where care is claimed without bearing."
  traces:
    targets:
      - practice.determination
      - practice.ark-run
      - third.care
      - third.control
      - third.control-drift
      - practice.check
  nests:
    targets: []
    read: "inside Ark Run as the force-read after determination and before movement to the next posture."
  reads:
    targets: []
    read: "where a determination begins to carry force and that force must be read for availability, correction, drift, and remaining openness."
  carries:
    targets: []
    read: "No direct downstream term is required. Care-Control Check constrains movement by checking generated force."
publish: true
status: working
---
# Care-Control Check

The practice check that reads what kind of force a determination generates: care, compatible control, control drift, or unresolved force.

Care-Control Check is held by [[Ark Run]], [[Determination]], [[Care]], [[Control]], [[Control Drift]], and [[Check]].

It is not a moral label placed on a person. It is a runtime read of generated force.

## Places

Care-Control Check places the practice check that reads what kind of force a determination generates.

## Holds

Care-Control Check is held by [[Ark Run]], [[Determination]], [[Care]], [[Control]], [[Control Drift]], and [[Check]].

Determination generates force because something has been temporarily fixed. Care-Control Check asks what that force now does.

## Pairs

Care-Control Check pairs with [[Care Without Bearing]]. Care-Control Check asks whether care or control remains borne; Care Without Bearing names a failure where care is claimed without bearing.

## Traces

- [[Determination]]
- [[Ark Run]]
- [[Care]]
- [[Control]]
- [[Control Drift]]
- [[Check]]

## Nests

Care-Control Check nests inside [[Ark Run]] as the force-read after determination and before movement to the next posture.

## Reads

Care-Control Check becomes recognisable through questions:

- What force does this determination generate?
- Does the force preserve availability?
- Does it direct while remaining correctable by what it directs?
- Has it begun to proceed after correction is no longer being received?
- Must the run remain unresolved, retrace, or rescope?

In the Ark runtime, care preserves availability. Compatible control directs while remaining answerable to correction from the directed condition. Control drift blocks movement until correction or rescope occurs.

## Carries

No direct downstream term is required. Care-Control Check constrains movement by checking generated force.
