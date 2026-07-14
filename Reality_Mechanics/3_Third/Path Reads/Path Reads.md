---

grounded: true
order: third
kind: class
ai_role: class
condition_key: third.path-reads
determination: pd.v3.pre-provenance-baseline
domain: path-reads

conditions:
  places: "reusable reads that become available by following a dependency path."
  needs:
    targets:
      - third.branch
      - second.readability
  holds:
    targets:
      - third.branch
      - second.readability
    read: "[[Branch]] and [[Readability]]."
  pairs:
    targets: []
    read: "No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read."
  traces:
    targets:
      - third.branch
      - second.readability
      - third.domain
      - second.terminal
      - third.translation-boundary
  nests:
    targets: []
    read: "as reusable reads made available by branches through fields or domains."
  reads:
    targets: []
    read: "Path Reads become recognisable where following a dependency path through a field, domain, or their crossing makes a downstream condition readable."
  carries:
    targets:
      - third.applied-read
      - third.degeneration-read
publish: true
status: stable
---
# Path Reads

Reusable reads that become available by following a dependency path.

Path Reads is held by [[Branch]] and [[Readability]].

In Third Order, a path read often follows a branch through a [[Translation Boundary|translation joint]]: source term, terminal point, local domain term, applied read.

## Places

Path Reads places reusable reads that become available by following a dependency path.

## Holds

Path Reads is held by [[Branch]] and [[Readability]].

## Pairs

No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read.

## Traces

- [[Branch]]
- [[Readability]]
- [[Domain]]
- [[Terminal]]
- [[Translation Boundary]]

## Nests

Path Reads nests as reusable reads made available by branches through fields or domains.

They can nest the movement from structural term into terminal domain expression, then into local application.

[[Applied Read]]
[[Enchantment]]
[[Resolution Polarity]]

## Reads

Path Reads become recognisable where following a dependency path through a field, domain, or their crossing makes a downstream condition readable.

They help show whether a dense cluster is actually a branch: the read should reveal what carries forward, where it changes language, and how it remains retraceable.
## Carries

- [[Applied Read]]
- [[Degeneration Read]]
