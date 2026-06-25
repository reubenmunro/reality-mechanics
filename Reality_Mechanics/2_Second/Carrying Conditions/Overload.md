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
    - "[[Incoherence]]"
    - "[[Collapse]]"

publish: true
status: stable
garden_status: rooted
---
# Overload

Overload names load or pressure exceeding supportable capacity. Where load names what bears on carrying, pressure names load locally borne through relation, and capacity names supportable carrying within a current condition, overload names the condition where carrying is strained beyond what can remain compatible at that scope. Overload does not name weakness or failure by itself; it names the excess condition that makes reduction, release, re-resolution, disorder, or collapse likely unless support or scope changes.

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

Overload becomes recognisable where what bears on carrying exceeds what the current condition can support — where continuation cannot remain compatible without change, support, reduction, or re-resolution.

Overload can occur when demand exceeds the resolution band of the carrier: too much scale, rate, intensity, ambiguity, novelty, or consequence is required to be received and carried at once. The problem is not only quantity of load; it is incompatibility between demand and the range through which the carrier can resolve order.

## Carries


- [[Incoherence]]
- [[Collapse]]
