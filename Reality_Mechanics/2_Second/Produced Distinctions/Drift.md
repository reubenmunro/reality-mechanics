---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.drift
determination: pd.2026-07-18.calibration-revision-set

conditions:
  places: "a carried condition departing across traversal from the reference through which its prior position or path remains readable."
  needs:
    targets:
      - second.carrying
      - second.change
      - second.reference-frame
      - first.trace
  holds:
    targets:
      - second.carrying
      - second.change
      - second.reference-frame
      - first.trace
    read: "[[Carrying]], [[Change]], [[Reference Frame]], and [[Trace]]. A condition must be carried, change across traversal, remain located against an explicit reference, and offer backward availability before departure can be read as drift."
  pairs:
    targets: []
    read: "No lateral pair is required at this placement yet. Return, correction, and resolution may answer particular drift without completing every drift read."
  traces:
    targets:
      - second.carrying
      - second.change
      - second.reference-frame
      - first.trace
      - second.traversal
  nests:
    targets: []
    read: "where a carried condition can be compared across traversal within an explicit reference frame."
  reads:
    targets: []
    read: "where the current condition departs from a prior or expected position or path while the reference required to compare them remains available."
  carries:
    targets:
      - higher.source-drift
      - third.control-drift
      - third.harmonic-drift
      - third.ai-drift
publish: true
status: working
---
# Drift

A carried condition departing across traversal from the reference through which its prior position or path remains readable.

Drift is held by [[Carrying]], [[Change]], [[Reference Frame]], and [[Trace]]. A condition must be carried, change across traversal, remain located against an explicit reference, and offer backward availability before departure can be read as drift.

Drift is not inherently disorder. It may be deliberate, compatible, recoverable, or correctable. It becomes a disorder read where the relevant reference, dependency path, or capacity for return becomes unavailable while carrying continues.

Drift is not [[Bounded Asymmetry]]. Bounded Asymmetry names localised unevenness. Drift requires departure across [[Traversal]] relative to a reference through which the earlier position or path can still be compared.

## Places

Drift places a carried condition departing across traversal from the reference through which its prior position or path remains readable.

## Holds

Drift is held by [[Carrying]], [[Change]], [[Reference Frame]], and [[Trace]].

## Pairs

No lateral pair is required at this placement yet. Return, correction, and resolution may answer particular drift without completing every drift read.

## Traces

- [[Carrying]]
- [[Change]]
- [[Reference Frame]]
- [[Trace]]
- [[Traversal]]

## Nests

Drift nests where a carried condition can be compared across traversal within an explicit reference frame.

## Reads

Drift becomes readable where the current condition departs from a prior or expected position or path while the reference required to compare them remains available.

Recoverable drift retains trace. Lost drift becomes a disorder condition where carrying continues but the reference or dependency path needed for comparison and return can no longer be entered.

## Carries

- [[Source Drift]]
- [[Control Drift]]
- [[Harmonic Drift]]
- [[AI Drift]]
