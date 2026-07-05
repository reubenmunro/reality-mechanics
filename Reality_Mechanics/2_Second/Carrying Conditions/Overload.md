---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.overload

needs:
  - "[[Load]]"
  - "[[Pressure]]"
  - "[[Capacity]]"
  - "[[Compatibility]]"

conditions:
  places: "load exceeding supportable capacity."
  holds: "[[Load]], [[Pressure]], [[Capacity]], and [[Compatibility]]."
  pairs: "[[Capacity]]. Capacity names supportable carrying; Overload names load exceeding that supportable capacity."
  traces:
    - "[[Load]]"
    - "[[Pressure]]"
    - "[[Capacity]]"
    - "[[Compatibility]]"
  nests: "at the excess point where load exceeds supportable capacity."
  reads: "where what bears on carrying exceeds what the current condition can support or resolve — where continuation cannot remain compatible without change, support, reduction, translation, or re-resolution."
  carries:
    - "[[Carried Condition]]"
    - "[[Incoherence]]"
    - "[[Collapse]]"

publish: true
status: stable
---
# Overload

Load exceeding supportable capacity.

Overload is held by [[Load]], [[Pressure]], [[Capacity]], and [[Compatibility]].

## Places

Overload places load exceeding supportable capacity.

## Holds

Overload is held by [[Load]], [[Pressure]], [[Capacity]], and [[Compatibility]].

## Pairs

Overload pairs with [[Capacity]]. Capacity names supportable carrying; Overload names load exceeding that supportable capacity.

## Traces

- [[Load]]
- [[Pressure]]
- [[Capacity]]
- [[Compatibility]]

## Nests

Overload nests at the excess point where load exceeds supportable capacity.

## Reads

Overload becomes recognisable where what bears on carrying exceeds what the current condition can support — where continuation cannot remain compatible without change, support, reduction, return to [[Carried Condition]], or re-resolution.

Overload can occur when demand exceeds the resolution band of the carrier: too much scale, rate, intensity, ambiguity, novelty, or consequence is required to be received and carried at once. The problem is not only quantity of load; it is incompatibility between demand and the range through which the carrier can resolve order.

## Carries


- [[Incoherence]]
- [[Collapse]]
- [[Carried Condition]]
