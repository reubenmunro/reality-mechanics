---

grounded: true
order: first
id: first.place
kind: operation
ai_role: carrier
condition_key: first.place
canonical_key: first.place

needs:
  - "[[Relation]]"

conditions:
  places: "locatable entry into relation, so an operation can be read, checked, corrected, or carried forward."
  holds: "[[Relation]]. Relation must remain available for any operation to become locatable within it — Relation does not finish before Place begins."
  pairs: "No lateral pair is required. Place is a first-order operation in the Atlas, locatable through relation, carry, and trace rather than constituted by a lateral pairing."
  traces:
    - "[[Relation]]"
  nests: "within first order, as the operation that makes carrying enterable, readable, and correctable — distinct from field-specific place reads."
  reads: "where an operation becomes locatable enough to be entered, read, checked, corrected, or carried forward without being confused with a later field of place."
  carries:
    - "[[First Order Crossing|Threshold (First → Second)]]"
    - "[[Atlas Practice]]"

publish: true
status: working
---
# Place

Locatable entry into relation, so an operation can be read, checked, corrected, or carried forward.

Place is not location alone. A location can be named without the operation being placed in Atlas order. Place names the availability of a locatable position through which relation, holding, carrying, and trace can become answerable, entered, and checked.

## Places

Place places locatable entry into relation, so an operation can be read, checked, corrected, or carried forward.

## Holds

Place is held by [[Relation]]. Relation must remain available for any operation to become locatable within it — Relation does not finish before Place begins; Place is Relation's own availability made locatable, checkable, and enterable. This is the first-order Place operation identified by `first.place`, not the downstream field note of the same title.

## Pairs

No lateral pair is required. Place is a first-order operation in the Atlas, locatable through relation, carry, and trace rather than constituted by a lateral pairing.

## Traces

- [[Relation]]

## Nests

Place nests within first order as the operation that makes carrying enterable, readable, and correctable.

It is not identical to [[Placed Participation]], [[Place Field]], or any domain-specific place term. Those are downstream reads that can use first-order Place without becoming the root operation. Links to [[Place]] from first-order carrier mechanics should resolve to this `first.place` operation.

## Reads

Place becomes recognisable where an operation is locatable enough to be entered, read, checked, corrected, or carried forward without being confused with a later field of place.

Without Place, a carry may be available but not enterable; a hold may persist but not be checkable; a trace may exist but not be recoverable to a participant.

## Carries

- [[First Order Crossing|Threshold (First → Second)]]
- [[Atlas Practice]]
