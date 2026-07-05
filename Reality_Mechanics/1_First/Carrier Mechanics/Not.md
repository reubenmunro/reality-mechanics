---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.not

needs:
  - "[[Boundary]]"
  - "[[Availability]]"

conditions:
  places: "non-availability within the current scope — relation marked as unavailable, interrupted, absent, excluded, or outside scope"
  holds: "[[Boundary]] and [[Availability]] — scope must be bounded and availability readable before non-availability can be marked"
  pairs: "Asymmetry carries downward — Not applies the [[Boundary]]↔[[Availability]] structure to mark specific conditions as not-available within scope. In carries interior placement; Out carries exterior placement — both already paired. Not operates on the negative side without a lateral co-condition."
  traces:
    - "[[Boundary]]"
    - "[[Availability]]"
  nests: "as a structural carrier of absence, interruption, exclusion, and outside-scope relation without turning them into conclusions"
  reads: "where a condition is read through what it excludes — where the boundary of a scope is as readable as its interior"
  carries: []

publish: true
status: stable
---
# Not

Non-availability within the current scope — relation marked as unavailable, interrupted, absent, excluded, or outside scope.

Not is held by [[Boundary]] and [[Availability]]. Scope must be bounded, and availability must be readable, before non-availability can be marked.

Not marks that what cannot be reached, traced, or carried within the current structure is not available here.

## Places

Not places non-availability within the current scope.

## Holds

Not is held by [[Boundary]] and [[Availability]]. Scope must be bounded, and availability must be readable, before non-availability can be marked.

## Pairs

Asymmetry carries downward. Not marks non-availability as a structural carrier: it applies the [[Boundary]]/[[Availability]] pair to specific conditions. [[Availability]] already names the positive condition upstream.

## Traces

- [[Boundary]]
- [[Availability]]

## Nests

Not nests as a structural carrier of absence, interruption, exclusion, and outside-scope relation without turning them into conclusions.

## Reads

Not becomes recognisable where a condition is read through what it excludes — where the boundary of a scope is readable as much as its interior.

Not allows absence, interruption, exclusion, and outside-scope relation to be carried without turning them into objects or conclusions.

## Carries
