---

grounded: false
order: foundation
kind: convention
ai_role: practice
condition_key: foundation.current-record-convention

needs:
  - "[[Common Term Structure]]"

conditions:
  places: "the current repository convention used to encode Common Term Structure as Markdown, frontmatter, headings, and wikilinks."
  holds: "[[Common Term Structure]] as the structural standard this convention implements."
  pairs: "[[Common Term Structure]] provides the mechanics; Current Record Convention records the present implementation."
  traces:
    - "[[Reality Mechanics]]"
    - "[[Common Term Structure]]"
    - "[[Structure]]"
    - "[[Trace]]"
    - "[[Carry]]"
  nests: "where repository records, frontmatter, prose, and structural references remain answerable to the same term mechanics."
  reads: "where a term can be encoded in the current repository without confusing the encoding with the mechanics it serves."
  carries:
    - "[[Carry-Trace Test]]"
    - "[[Groundedness]]"
    - "[[Retrace Practice]]"
    - "[[Check]]"

publish: true
status: developing
---
# Current Record Convention

The current repository convention used to encode Common Term Structure as Markdown, frontmatter, headings, and wikilinks.

This convention is operational.

It is not final ontology.

It may change where the terms reveal better structure.

## Places

Current Record Convention places the current implementation surface for structural terms.

The present implementation uses Markdown files, frontmatter, section headings, and wikilinks.

These forms serve the mechanics.

They do not define the mechanics.

## Holds

Current Record Convention is held by [[Common Term Structure]].

Common Term Structure defines what every structural term must answer to.

Current Record Convention defines how the present repository records that structure.

## Pairs

Current Record Convention pairs with [[Common Term Structure]].

Common Term Structure carries the mechanics.

Current Record Convention carries the encoding.

If the encoding conflicts with the mechanics, the encoding changes.

## Traces

- [[Reality Mechanics]]
- [[Common Term Structure]]
- [[Structure]]
- [[Trace]]
- [[Carry]]

Trace exists for recovery.

The record should preserve enough path for a term to be retraced.

Trace is not limited to the immediately previous term.

## Nests

Current Record Convention nests inside the repository as the present record form.

It includes:

- frontmatter
- heading
- opening prose
- Places
- Holds
- Pairs
- Traces
- Nests
- Reads
- Carries
- wikilinks

Each part should remain answerable to Common Term Structure.

## Reads

Current Record Convention becomes recognisable where a term can be stored, read, revised, checked, and regenerated without turning implementation into ontology.

The heading identifies the condition.

The body exposes the mechanics.

The frontmatter condenses the mechanics for machines and workers.

The prose carries the mechanics for human reading.

## Carries

Current Record Convention carries the present authoring format.

Use this frontmatter shape unless a later convention replaces it:

```yaml
grounded:
order:
kind:
ai_role:
condition_key:

needs:

conditions:
  places:
  holds:
  pairs:
  traces:
  nests:
  reads:
  carries:

publish:
status:
```

`condition_key` carries stable identity.

`order`, `kind`, `ai_role`, and `status` are current operational labels.

They help the present system sort, read, and publish records.

They must remain editable where the terms reveal better structure.

### Heading

The heading identifies the condition.

The body should not repeat the work already performed by the heading.

### Sections

Use the common section spine:

```text
Places
Holds
Pairs
Traces
Nests
Reads
Carries
```

These sections expose mechanics.

They do not define the condition.

### Wikilinks

The current implementation uses wikilinks to encode structural references.

Use:

```text
[[Term]]
[[Target|Visible Text]]
```

A wikilink must perform structural work.

It should hold, trace, pair, nest, read, or carry the current condition.

Decorative links should be removed.

### Validation

Before publishing or grounding a record, confirm:

- the frontmatter agrees with the body
- the section spine is present
- links perform structural work
- trace remains recoverable
- carry records demonstrated continuation
- metadata supports structure rather than freezing it
- the record remains answerable to [[Common Term Structure]]
