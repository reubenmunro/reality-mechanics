---

grounded: true
register: practice
kind: term
ai_role: practice
condition_key: practice.practice
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "repeated, attended participation through which action remains available, correctable, and carried through use."
  needs:
    targets:
      - second.participation
      - second.recurrence
      - first.attend
      - second.readability
  holds:
    targets:
      - second.participation
      - second.recurrence
      - first.attend
      - second.readability
    read: "[[Participation]], [[Recurrence]], [[Attend]], and [[Readability]] — participation must recur, remain attended, and stay readable enough for correction to occur."
  pairs:
    targets:
      - practice.discipline
    read: "[[Discipline]]. Practice repeats answerable action; Discipline keeps that action ordered and retraceable."
  traces:
    targets:
      - ground.regenerate
      - second.participation
      - second.recurrence
      - first.attend
      - second.readability
      - practice.participant
  nests:
    targets: []
    read: "within higher-order or practice conditions."
  reads:
    targets: []
    read: "where return through use stays attended enough to keep action available for correction, tending, and retrace."
  carries:
    targets:
      - practice.step
      - practice.check
      - practice.tend
      - practice.discipline
      - practice.tracing
      - practice.retracing
      - practice.retrace-practice
      - practice.atlas-practice
      - practice.section
      - practice.reasoning
publish: true
status: stable
---
# Practice

Repeated, attended participation through which action remains available, correctable, and carried through use.

Practice is held by [[Participation]], [[Recurrence]], [[Attend]], and [[Readability]]. Participation must recur, remain attended, and stay readable enough for correction to occur.

## Places

Practice places repeated, attended participation through which action remains available, correctable, and carried through use.

## Holds

Practice is held by [[Participation]], [[Recurrence]], [[Attend]], and [[Readability]]. Participation must recur, remain attended, and stay readable enough for correction to occur.

## Pairs

Practice pairs with [[Discipline]]. Practice repeats answerable action; Discipline keeps that action ordered and retraceable.

## Traces

- [[Regenerate]]
- [[Participation]]
- [[Recurrence]]
- [[Attend]]
- [[Readability]]
- [[Participant]]

## Nests

Practice nests within higher-order or practice conditions.

## Reads

Practice becomes recognisable where return through use stays attended enough to keep action available for correction, tending, and retrace.

## Carries


- [[Step]]
- [[Check]]
- [[Tend]]
- [[Discipline]]
- [[Tracing]]
- [[Retracing]]
- [[Retrace Practice]]
- [[Atlas Practice]]
- [[Section]]
- [[Reasoning]]
