---
grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.term-drift
determination: pd.v3.pre-provenance-baseline
domain: language

conditions:
  places: "Term drift occurs when a word recurs while its structural participation changes."
  needs:
    targets:
      - third.language-domain
      - ground.term
      - second.recurrence
      - second.difference
      - second.compatibility
  holds:
    targets:
      - third.language-domain
      - ground.term
      - second.recurrence
      - second.difference
      - second.compatibility
    read: "[[Language Domain]], [[Term]], [[Recurrence]], [[Difference]], [[Compatibility]]."
  pairs:
    targets:
      - third.inherited-term-drift
    read: "[[Inherited Term Drift]]. Term Drift names loss of dependency contact within a language context through recurrence; Inherited Term Drift names that loss carried across translation between contexts. Each is a distinct form of term drift."
  traces:
    targets:
      - third.language-domain
      - ground.term
      - second.recurrence
      - second.difference
      - second.compatibility
  nests:
    targets: []
    read: "where this read holds at its field, domain, or practice scope without losing trace."
  reads:
    targets: []
    read: "Term Drift becomes readable where recurrence of a term no longer carries the same dependency position."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Term Drift

Term drift occurs when a word recurs while its structural participation changes.

Term Drift is held by [[Language Domain]], [[Term]], [[Recurrence]], [[Difference]], [[Compatibility]].

## Places

Term Drift places Term drift occurs when a word recurs while its structural participation changes.

## Holds

Term Drift is held by [[Language Domain]], [[Term]], [[Recurrence]], [[Difference]], [[Compatibility]].

## Pairs

Term Drift pairs with [[Inherited Term Drift]]. Term Drift names loss of dependency contact within a language context through recurrence; Inherited Term Drift names that loss carried across translation between contexts. Each is a distinct form of term drift.

## Traces

- [[Language Domain]]
- [[Term]]
- [[Recurrence]]
- [[Difference]]
- [[Compatibility]]

## Nests

Term Drift nests where this read holds at its field, domain, or practice scope without losing trace.

## Reads

Term Drift becomes readable where recurrence of a term no longer carries the same dependency position.

The dependency movement is:

First: [[Difference]] changes participation.

Second: [[Recurrence]] and [[Compatibility]] make repeated term use evaluable.

Third: [[Term Drift]] places that structural read inside language.

Case Movement:

```text
term recurs
→ participation changes
→ dependency position shifts
→ apparent sameness becomes drift
```

## Carries

This note carries no further public branch at this scope.
