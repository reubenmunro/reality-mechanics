---

grounded: true
order: first
kind: carrier
ai_role: carrier
condition_key: first.visible
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "presented readability — distinction presented to read"
  needs:
    targets:
      - first.apparent
  holds:
    targets:
      - first.apparent
    read: "[[Apparent]] — a distinction must be apparent before it can be presented to read"
  pairs:
    targets:
      - first.invisible
    read: "[[Invisible]] — Visible presents readability; Invisible carries non-presented readability without becoming absent or hidden"
  traces:
    targets:
      - first.apparent
  nests:
    targets: []
    read: "under apparent presentation — can support truth, explanation, and understanding without being identical with them"
  reads:
    targets: []
    read: "where distinction is read as presented rather than hidden, absent, or unavailable"
  carries:
    targets:
      - second.visibility
      - second.surface
publish: true
status: stable
---
# Visible

Presented readability — distinction presented to read.

Visible is held by [[Apparent]]. A distinction must be apparent before it can be presented to read.

## Places

Visible places presented readability.

## Holds

Visible is held by [[Apparent]]. A distinction must be apparent before it can be presented to read.

## Pairs

Visible pairs with [[Invisible]]. Visible presents readability; Invisible can carry non-presented readability without becoming absent or hidden.

## Traces

- [[Apparent]]

## Nests

Visible nests under apparent presentation. It can support truth, explanation, and understanding without being identical with them.

## Reads

Visible becomes recognisable where distinction is read as presented rather than hidden, absent, or unavailable.

## Carries

- [[Visibility]]
- [[Surface]]
