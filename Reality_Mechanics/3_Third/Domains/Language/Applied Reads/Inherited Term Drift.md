---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.inherited-term-drift
determination: pd.v3.pre-provenance-baseline
domain: language

conditions:
  places: "the local case where a received term keeps its name while entering a different structural role."
  needs:
    targets:
      - third.applied-read
      - third.term-drift
      - third.translation
      - second.closure-scope
      - third.language-domain
  holds:
    targets:
      - third.applied-read
      - third.term-drift
      - third.translation
      - second.closure-scope
      - third.language-domain
    read: "[[Applied Read]], [[Term Drift]], [[Translation]], [[Closure Scope]], [[Language Domain]]."
  pairs:
    targets:
      - third.term-drift
    read: "[[Term Drift]]. Inherited Term Drift names drift carried across translation; Term Drift names drift within a context. Each is a distinct form of term drift."
  traces:
    targets:
      - third.applied-read
      - third.term-drift
      - third.translation
      - second.closure-scope
      - third.language-domain
  nests:
    targets: []
    read: "where this read holds at its field, domain, or practice scope without losing trace."
  reads:
    targets: []
    read: "Inherited Term Drift becomes readable where the same term is repeated after its participation has changed."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Inherited Term Drift

The local case where a received term keeps its name while entering a different structural role.

Inherited Term Drift is held by [[Applied Read]], [[Term Drift]], [[Translation]], [[Closure Scope]], [[Language Domain]].

## Places

Inherited Term Drift places the local case where a received term keeps its name while entering a different structural role.

## Holds

Inherited Term Drift is held by [[Applied Read]], [[Term Drift]], [[Translation]], [[Closure Scope]], [[Language Domain]].

## Pairs

Inherited Term Drift pairs with [[Term Drift]]. Inherited Term Drift names drift carried across translation; Term Drift names drift within a context. Each is a distinct form of term drift.

## Traces

- [[Applied Read]]
- [[Term Drift]]
- [[Translation]]
- [[Closure Scope]]
- [[Language Domain]]

## Nests

Inherited Term Drift nests where this read holds at its field, domain, or practice scope without losing trace.

## Reads

Inherited Term Drift becomes readable where the same term is repeated after its participation has changed.

The dependency movement is:

First: [[Boundary]] and [[Availability]] must hold enough for a term to be re-entered into use.

Second: [[Translation]], [[Recognition Read|Recognition]], and [[Closure Scope]] make the inherited term evaluable as preserved or drifted structural role.

Third: [[Inherited Term Drift]] tests that condition inside the [[Language Domain]] as an applied language read.

Case Movement:

```text
term is inherited
→ term is reused
→ participation changes
→ dependency position must be re-read
```

## Carries

This note carries no further public branch at this scope.
