---

grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.ai-reply-drift
determination: pd.v3.pre-provenance-baseline
domain: ai

conditions:
  places: "the applied read of AI Drift at the level of a single reply — where an AI answer remains fluent while losing the dependency path it claims to carry."
  needs:
    targets:
      - third.applied-read
      - third.ai-drift
      - third.ai-atlas-grounding
      - second.surface
      - second.closure-scope
  holds:
    targets:
      - third.applied-read
      - third.ai-drift
      - third.ai-atlas-grounding
      - second.surface
      - second.closure-scope
    read: "[[Applied Read]], [[AI Drift]], [[AI Atlas Grounding]], [[Surface]], and [[Closure Scope]] — it requires surface coherence and a legible dependency claim against which drift becomes readable."
  pairs:
    targets:
      - third.ai-confident-correction
    read: "[[AI Confident Correction]]. Both are applied reads of AI disorder — reply drift at the response level, confident correction at the level of a specific correction event."
  traces:
    targets:
      - third.applied-read
      - third.ai-drift
      - third.ai-atlas-grounding
      - second.surface
      - second.closure-scope
      - third.ai
  nests:
    targets: []
    read: "within the AI domain as an applied read of AI Drift, scoped to a single AI response."
  reads:
    targets: []
    read: "AI Reply Drift becomes readable where a reply continues the surface topic while bypassing the dependency conditions that made the topic available."
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# AI Reply Drift

The applied read of AI Drift at the level of a single reply — where an AI answer remains fluent while losing the dependency path it claims to carry.

AI Reply Drift is held by [[Applied Read]], [[AI Drift]], [[AI Atlas Grounding]], [[Surface]], and [[Closure Scope]] — it requires surface coherence and a legible dependency claim against which drift becomes readable.

## Places

AI Reply Drift places the applied read of AI Drift at the level of a single reply — where an AI answer remains fluent while losing the dependency path it claims to carry.

## Holds

AI Reply Drift is held by [[Applied Read]], [[AI Drift]], [[AI Atlas Grounding]], [[Surface]], and [[Closure Scope]] — it requires surface coherence and a legible dependency claim against which drift becomes readable.

## Pairs

AI Reply Drift pairs with [[AI Confident Correction]]. Both are applied reads of AI disorder — reply drift at the response level, confident correction at the level of a specific correction event.

## Traces

- [[Applied Read]]
- [[AI Drift]]
- [[AI Atlas Grounding]]
- [[Surface]]
- [[Closure Scope]]

- [[AI]]
## Nests

AI Reply Drift nests within the AI domain as an applied read of AI Drift, scoped to a single AI response.

## Reads

AI Reply Drift becomes readable where a reply continues the surface topic while bypassing the dependency conditions that made the topic available.

Case Movement:

```text
question supplies dependency path
→ reply preserves surface coherence
→ dependency path weakens
→ grounding check becomes required
```

## Carries
