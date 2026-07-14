---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.coupled-contact
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "contact maintained strongly enough for carrying, resistance, pressure, grip, traction, or effect to pass between conditions."
  needs:
    targets:
      - first.contact
      - second.coupling
      - second.presence
  holds:
    targets:
      - first.contact
      - second.coupling
      - second.presence
    read: "[[Contact]], [[Coupling]], and [[Presence]]. Contact must remain locally available and held in relation while it carries effect."
  pairs:
    targets:
      - second.interposed_carrier
    read: "[[Interposed Carrier]] — coupled contact names contact carrying effect; interposed carrier names a condition entering between contact and coupling, changing or interrupting what can pass."
  traces:
    targets:
      - first.contact
      - second.coupling
      - second.presence
      - second.coupled-boundary
  nests:
    targets: []
    read: "at a contact condition that remains coupled enough for carrying, resistance, grip, traction, or effect to pass."
  reads:
    targets: []
    read: "where contact does more than meet: it carries effect, resistance, grip, pressure, heat, or directed carrying between conditions."
  carries:
    targets:
      - second.effect
      - second.friction
      - second.grip
      - second.traction
publish: true
status: stable
---
# Coupled Contact

Contact maintained strongly enough for carrying, resistance, pressure, grip, traction, or effect to pass between conditions.

Coupled Contact is held by [[Contact]], [[Coupling]], and [[Presence]]. Contact must remain locally available and held in relation while it carries effect.

A tyre touching the road is [[Contact]]. A tyre gripping the road so that braking and steering effects can pass through the tyre-road relation is Coupled Contact.

Coupled Contact keeps the simple word contact from carrying too much. Contact names meeting. Coupled Contact names meeting that carries effect.

## Places

Coupled Contact places contact maintained strongly enough for carrying, resistance, pressure, grip, traction, or effect to pass between conditions.

## Holds

Coupled Contact is held by [[Contact]], [[Coupling]], and [[Presence]]. Contact must remain locally available and held in relation while it carries effect.

## Pairs

Coupled Contact pairs with [[Interposed Carrier]]. Coupled Contact names contact carrying effect; Interposed Carrier names a condition entering between contact and coupling, changing or interrupting what can pass.

## Traces

- [[Contact]]
- [[Coupling]]
- [[Presence]]
- [[Coupled Boundary]]

## Nests

Coupled Contact nests at a contact condition that remains coupled enough for carrying, resistance, grip, traction, or effect to pass.

## Reads

Coupled Contact becomes recognisable where contact does more than meet: it carries effect, resistance, grip, pressure, heat, or directed carrying between conditions.

## Carries

- [[Effect]]
- [[Friction]]
- [[Grip]]
- [[Traction]]
