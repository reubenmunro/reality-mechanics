---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.allow
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "condition-side permission for passage, read, or carrying at a boundary or scope"
  needs:
    targets:
      - first.boundary
      - first.availability
  holds:
    targets:
      - first.boundary
      - first.availability
    read: "[[Boundary]] and [[Availability]] — scope must be bounded and distinction present before permission at that scope can be read"
  pairs:
    targets:
      - first.enter
    read: "[[Enter]] — Allow names permitted passage from the condition side; Enter names taken passage from the participating side"
  traces:
    targets:
      - first.boundary
      - first.availability
      - ground.passage-condition
  nests:
    targets: []
    read: "as a passage condition — may permit one read while not permitting another, depending on capacity, compatibility, and scope"
  reads:
    targets: []
    read: "where the condition permits passage or read enough for relation to enter, continue, or be carried — what passes remains allowable by the capacity, compatibility, and scope that support it"
  carries:
    targets:
      - first.enter
      - second.medium
      - second.visibility
      - third.communicating
publish: true
status: stable
---
# Allow

Condition-side permission for passage, read, or carrying at a boundary or scope.

Allow is held by [[Boundary]], [[Availability]], and [[Passage Condition]]. Scope must be bounded and distinction present before permission at that scope can be read.

Agreement, approval, consent, or moral permission can involve allow, but allow first names what a condition permits at a boundary or scope.

What is allowed is not always allowable. Allowable means able to be allowed without exceeding [[Capacity]], breaking [[Compatibility]], or extending beyond [[Scope]].

## Places

Allow places condition-side permission for passage, read, or carrying at a boundary or scope.

## Holds

Allow is held by [[Boundary]], [[Availability]], and [[Passage Condition]]. Scope must be bounded and distinction present before permission at that scope can be read.

## Pairs

Allow pairs with [[Enter]]. Allow names permitted passage from the condition side; Enter names taken passage from the participating side.

## Traces

- [[Boundary]]
- [[Availability]]
- [[Passage Condition]]

## Nests

Allow nests as a passage condition. It may permit one read while refusing another, depending on capacity, compatibility, and scope.

## Reads

Allow becomes recognisable where the condition permits passage or read enough for relation to enter, continue, or be carried, and where what passes remains allowable by the capacity, compatibility, and scope that support it.

## Carries


- [[Enter]]
- [[Medium]]
- [[Visibility]]
- [[Communicating]]
