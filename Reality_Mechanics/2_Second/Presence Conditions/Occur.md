---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.occur
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "presence taking place within a closure scope."
  needs:
    targets:
      - second.presence
      - second.closure-scope
  holds:
    targets:
      - second.presence
      - second.closure-scope
    read: "[[Presence]] and [[Closure Scope]]."
  pairs:
    targets:
      - second.recurrence
      - second.interval
      - third.scene
    read: "Asymmetry carries downward — into [[Recurrence]], [[Interval]], and [[Scene]]"
  traces:
    targets:
      - second.presence
      - second.closure-scope
  nests:
    targets: []
    read: "where presence takes place within closure scope before recurrence, sequence, process, or scene."
  reads:
    targets: []
    read: "where presence can be read as taking place within scope — where a condition is not only available to be encountered, but has happened, is happening, or can be distinguished as a local occurrence."
  carries:
    targets:
      - second.recurrence
      - second.interval
      - third.scene
publish: true
status: stable
---
# Occur

Presence taking place within a closure scope.

Occur is held by [[Presence]] and [[Closure Scope]].

Occur does not name recurrence, sequence, process, or event by itself. Recurrence requires occurring again. Sequence requires ordered traversal. Process requires a carried sequence. Scene gathers occurrence into a bounded field of what is happening here.

An occurrence may precede [[Notice]] in lived sequence, but the term Occur names taking-place once presence can be read within scope.

## Places

Occur places presence taking place within a closure scope.

## Holds

Occur is held by [[Presence]] and [[Closure Scope]].

## Pairs

Asymmetry carries downward. Occur is a singular condition — the minimal event required for [[Recurrence]], [[Interval]], or [[Scene]] to be readable. There is no lateral contrast at the occur level.

## Traces

- [[Presence]]
- [[Closure Scope]]

## Nests

Occur nests where presence takes place within closure scope before recurrence, sequence, process, or scene.

## Reads

Occur becomes recognisable where presence can be read as taking place within scope — where a condition is not only available to be encountered, but has happened, is happening, or can be distinguished as a local occurrence.

## Carries


- [[Recurrence]]
- [[Interval]]
- [[Scene]]
