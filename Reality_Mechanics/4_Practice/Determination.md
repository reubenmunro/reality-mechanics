---

grounded: true
register: practice
kind: state
ai_role: practice
condition_key: practice.determination
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the temporary scoped hold produced when pressure has been retraced, checked, and bounded enough for a next answerable step."
  needs:
    targets:
      - practice.ark-run
      - practice.determine
      - first.hold
      - first.trace
      - second.scope
      - practice.check
  holds:
    targets:
      - practice.ark-run
      - practice.determine
      - first.hold
      - first.trace
      - second.scope
      - practice.check
    read: "[[Ark Run]], [[Determine]], [[Hold]], [[Trace]], [[Scope]], and [[Check]]."
  pairs:
    targets:
      - second.decision
    read: "[[Decision]]. Decision may select; Determination holds only where the selected read remains scoped, warranted, and retraceable."
  traces:
    targets:
      - practice.determine
      - practice.ark-run
      - first.hold
      - first.trace
      - second.scope
      - practice.check
  nests:
    targets: []
    read: "inside Ark Run as the held state between bounded scope and next carrying posture."
  reads:
    targets: []
    read: "where a participant can state what is temporarily fixed, at what scope, by what warrant, and what remains open."
  carries:
    targets:
      - practice.care-control-check
publish: true
status: working
---
# Determination

The temporary scoped hold produced when pressure has been retraced, checked, and bounded enough for a next answerable step.

Determination is held by [[Ark Run]], [[Determine]], [[Hold]], [[Trace]], [[Scope]], and [[Check]].

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
