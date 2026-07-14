---

grounded: true
register: practice
kind: map
ai_role: entry
condition_key: practice.rm-system-map
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "the current working map of the Reality Mechanics carriers: canonical structure, vault, Atlas, publisher, AI export, MCP, workers, field physics, Ark runtime, and archive."
  needs:
    targets:
      - practice.reality-mechanics
      - practice.atlas
      - practice.reality-mechanics-theory
      - practice.ai-participation
      - practice.ark-run
  holds:
    targets:
      - practice.reality-mechanics
      - practice.atlas
      - practice.reality-mechanics-theory
      - practice.ai-participation
      - practice.ark-run
    read: "[[Reality Mechanics]], [[Atlas]], [[Theory]], [[AI Participation]], and [[Ark Run]]."
  pairs:
    targets:
      - practice.atlas-root
    read: "[[Atlas Root]]. Atlas Root maps entry into the Atlas body; RM System Map maps the current carriers around that body."
  traces:
    targets:
      - practice.reality-mechanics
      - practice.atlas
      - practice.reality-mechanics-theory
      - practice.ai-participation
      - practice.ark-run
  nests:
    targets: []
    read: "beside Atlas Root as an operational map rather than a term in the dependency spine."
  reads:
    targets: []
    read: "where a participant needs to know which carrier is canonical structure, human translation, AI translation, worker lag state, public surface, retrieval layer, runtime, or preserved release."
  carries:
    targets:
      - practice.archive
publish: true
status: working
---
# RM System Map

The current working map of the Reality Mechanics carriers: canonical structure, vault, Atlas, publisher, AI export, MCP, workers, field physics, Ark runtime, and archive.

RM System Map is held by [[Reality Mechanics]], [[Atlas]], [[Theory]], [[AI Participation]], and [[Ark Run]].

It does not replace the [[Atlas Root]]. It records how the present local and public pieces carry the work.

The current correction is this: the Atlas is not stored many times. It is read many ways.

Canonical structure is the source. Vault notes, frontmatter, prose, MCP responses, workers, visual physics, static websites, AI exports, and archives are translations or carriers of that structure. They matter because each makes the structure readable from a different reference frame. They do not become separate Atlases.

## Places

RM System Map places the current working map of the Reality Mechanics carriers: canonical structure, vault, Atlas, publisher, AI export, MCP, workers, field physics, Ark runtime, and archive.

## Holds

RM System Map is held by [[Reality Mechanics]], [[Atlas]], [[Theory]], [[AI Participation]], and [[Ark Run]].

## Pairs

RM System Map pairs with [[Atlas Root]]. Atlas Root maps entry into the Atlas body; RM System Map maps the current carriers around that body.

## Traces

- [[Reality Mechanics]]
- [[Atlas]]
- [[Theory]]
- [[AI Participation]]
- [[Ark Run]]

## Nests

RM System Map nests beside Atlas Root as an operational map rather than a term in the dependency spine.

## Reads

The current carriers are:

```text
Canonical Structure   one relation/order record: identity, order, holds, traces, carries, pairs, nests, reads, status, ratio, frame, trace
Vault                 durable human working body of notes
Frontmatter           AI-readable translation of structure
Prose                 human-readable translation of structure
Atlas                 dependency-ordered reading surface
Publisher             derives public carriers from the current structure
Websites              public translations for Atlas, Theory, and main entry
AI Export             machine-readable translation generated from the same structure
MCP                   operational doorway for AI traversal, ratio reads, and bounded writes
Workers               ordered lag-state readers: read, propose, steward, ground-check, apply, publish
Field Physics         visual translation of structure, pressure, light, shade, and lag
Ark Run               runtime discipline for scoped determination
Archive               preserved public release record
```

The current operational source is carried through D1/frontmatter/vault structure until a future storage migration makes the canonical record explicit in one substrate. This lag is acceptable only when it is visible. Hidden divergence is source drift: D1 saying one thing, Markdown saying another, worker memory saying another, and the site silently choosing among them.

Workers therefore move in reading order. They observe pressure, read a ratio, form a traceable proposal, steward proportion, ground-check the continuation, apply through a boundary, and publish/export after the canonical structure has moved. Natural lag is not failure. It is the mind taking time to carry a read without collapsing it.

## Carries

- [[Archive]]
