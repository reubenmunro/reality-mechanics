---
grounded: true
order: practice
kind: state
ai_role: practice
condition_key: practice.determination

needs:
  - "[[Ark Run]]"
  - "[[Determine]]"
  - "[[Hold]]"
  - "[[Trace]]"
  - "[[Scope]]"
  - "[[Check]]"

conditions:
  places: "the temporary scoped hold produced when pressure has been retraced, checked, and bounded enough for a next answerable step."
  holds: "[[Ark Run]], [[Determine]], [[Hold]], [[Trace]], [[Scope]], and [[Check]]."
  pairs: "[[Decision]]. Decision may select; Determination holds only where the selected read remains scoped, warranted, and retraceable."
  traces:
    - "[[Determine]]"
    - "[[Ark Run]]"
    - "[[Hold]]"
    - "[[Trace]]"
    - "[[Scope]]"
    - "[[Check]]"
  nests: "inside Ark Run as the held state between bounded scope and next carrying posture."
  reads: "where a participant can state what is temporarily fixed, at what scope, by what warrant, and what remains open."
  carries:
    - "[[Care-Control Check]]"

publish: true
status: working
garden_status: planted
---
# Determination

Determination names the temporary scoped hold produced when pressure has been retraced, checked, and bounded enough for a next answerable step.

A determination is not simply an answer. It is an answerable hold.

## Places

Determination places the temporary scoped hold produced when pressure has been retraced, checked, and bounded enough for a next answerable step.

## Holds

Determination is held by [[Ark Run]], [[Determine]], [[Hold]], [[Trace]], [[Scope]], and [[Check]].

It must show what was determined, at what scope, by what dependency trace, under what warrant, and with what remaining openness.

## Pairs

Determination pairs with [[Decision]]. Decision may select; Determination holds only where the selected read remains scoped, warranted, and retraceable.

## Traces

- [[Determine]]
- [[Ark Run]]
- [[Hold]]
- [[Trace]]
- [[Scope]]
- [[Check]]

## Nests

Determination nests inside [[Ark Run]] as the held state between bounded scope and next carrying posture.

## Reads

Determination becomes recognisable where a participant can state:

- what is now temporarily fixed;
- the scope of read in which it is fixed;
- the retrace that warrants it;
- what remains open;
- where the determination may be challenged;
- how it may be revised.

An AI may make a determination only where the determination can itself be discerned.

## Carries

- [[Care-Control Check]]
