---

grounded: true
register: practice
kind: term
ai_role: practice
condition_key: practice.generative-trace
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the trace that preserves enough of the generating order to seed continuation."
  needs:
    targets:
      - first.trace
      - ground.generic
      - second.carrying
      - ground.regenerate
      - practice.order-generation
  holds:
    targets:
      - first.trace
      - ground.generic
      - second.carrying
      - ground.regenerate
      - practice.order-generation
    read: "[[Trace]], [[Generic]], [[Carrying]], [[Regenerate]], and [[Order Generation]]. A generative source, a carrying path, and a recoverable trace of how carrying became available must be present before a trace can be read as generative."
  pairs:
    targets:
      - practice.degenerative-trace
    read: "[[Degenerative Trace]]. Generative Trace preserves the generating order strongly enough to seed continuation; Degenerative Trace follows where carrying continued while that generating order was lost."
  traces:
    targets:
      - first.trace
      - ground.generic
      - second.carrying
      - ground.regenerate
      - practice.order-generation
  nests:
    targets: []
    read: "inside Atlas Practice as the bridge between a recorded trace and a re-enterable carrying process."
  reads:
    targets: []
    read: "where a trace does not merely record what happened, but preserves how carrying became possible enough that another participant or later run can re-enter and continue."
  carries:
    targets:
      - practice.generate-and-regenerate
publish: true
status: working
---
# Generative Trace

The trace that preserves enough of the generating order to seed continuation.

Generative Trace is held by [[Trace]], [[Generic]], [[Carrying]], [[Regenerate]], and [[Order Generation]].

It is not only a record of what happened. It is a trace of how carrying became possible.

The core read is:

```text A trace is generative where it can re-enter as seed. ```

## Places

Generative Trace places the trace that preserves enough of the generating order to seed continuation.

## Holds

Generative Trace is held by [[Trace]], [[Generic]], [[Carrying]], [[Regenerate]], and [[Order Generation]].

Trace gives the return path. Generic names the generative source condition. Carrying names what became available to continue. Regenerate names return to generative conditions. Order Generation gives exemplar systems where bounded rules produce ordered continuation.

## Pairs

Generative Trace pairs with [[Degenerative Trace]]. Generative Trace preserves the generating order strongly enough to seed continuation; Degenerative Trace follows where carrying continued while that generating order was lost.

## Traces

- [[Trace]]
- [[Generic]]
- [[Carrying]]
- [[Regenerate]]
- [[Order Generation]]

## Nests

Generative Trace nests inside [[Atlas Practice]] as the bridge between a recorded trace and a re-enterable carrying process.

The Atlas preserves dependency order. Generative Trace asks whether the preserved trace can seed another movement through that order.

## Reads

Generative Trace becomes recognisable where a trace preserves:

```text
origin      what generated the carrying
operation   what rule or movement produced continuation
bound       what kept carrying answerable
carry       what became available to continue
re-entry    how another participant or run can enter again
```

Counting a Fibonacci operation makes the generation traceable. When the counted trace can re-enter as seed, the trace is no longer only a record; it is generative.

In Atlas practice, a note, run, or instrument has generative trace where another participant can return to it and recover enough of the generating order to continue, correct, or regenerate the carrying.

## Carries

- [[Generate and Regenerate]]
