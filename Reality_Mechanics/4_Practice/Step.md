---

grounded: true
order: practice
kind: term
ai_role: practice
condition_key: practice.step

needs:
  - "[[Read]]"
  - "[[Trace]]"
  - "[[Carrying]]"
  - "[[Practice]]"

conditions:
  places: "the smallest answerable movement opened by a read."
  holds: "[[Read]], [[Trace]], [[Carrying]], and [[Practice]]."
  pairs: "[[Check]]. Check tests the boundary of a read from both directions; Step names the smallest answerable movement that boundary opens. Each requires the other: Check without Step has located a boundary but not moved from it; Step without Check has moved without establishing that the boundary held."
  traces:
    - "[[Read]]"
    - "[[Trace]]"
    - "[[Carrying]]"
    - "[[Practice]]"
    - "[[Count]]"
  nests: "where practice becomes small enough to be answerable."
  reads: "where a read opens a next movement small enough to stay with the trace and real enough to carry the read in practice."
  carries:
    - "[[Atlas Practice]]"
publish: true
status: stable
---
# Step

The smallest answerable movement opened by a read.

Step is carrying made local as movement: the first placed movement by which a read enters practice while remaining answerable to dependency. It may support progress, but it does not require progress or completion.

## Places

Step places the smallest answerable movement opened by a read.

## Holds

Step is held by [[Read]], [[Trace]], [[Carrying]], and [[Practice]].

## Pairs

Step pairs with [[Check]]. Check tests the boundary of a read from both directions; Step names the smallest answerable movement that boundary opens. Each requires the other: Check without Step has located a boundary but not moved from it; Step without Check has moved without establishing that the boundary held.

## Traces

- [[Read]]
- [[Trace]]
- [[Carrying]]
- [[Practice]]
- [[Count]]

## Nests

Step nests where practice becomes small enough to be answerable.

## Reads

Step becomes recognisable where a read opens a next movement small enough to stay with the trace and real enough to carry the read in practice.

## Carries

- [[Atlas Practice]]

[[Place]] and [[Learning]] may follow from a step in practice, but they are not carried by Step as dependency descendants.
