---
grounded: true
order: third
kind: term
ai_role: applied_read
condition_key: third.ai-reply-drift
domain: ai

needs:
  - "[[Applied Read]]"
  - "[[AI Drift]]"
  - "[[AI Atlas Grounding]]"
  - "[[Surface]]"
  - "[[Closure Scope]]"

conditions:
  places: "the applied read of AI Drift at the level of a single reply — where an AI answer remains fluent while losing the dependency path it claims to carry."
  holds: "[[Applied Read]], [[AI Drift]], [[AI Atlas Grounding]], [[Surface]], and [[Closure Scope]] — it requires surface coherence and a legible dependency claim against which drift becomes readable."
  pairs: "[[AI Confident Correction]]. Both are applied reads of AI disorder — reply drift at the response level, confident correction at the level of a specific correction event."
  traces:
    - "[[Applied Read]]"
    - "[[AI Drift]]"
    - "[[AI Atlas Grounding]]"
    - "[[Surface]]"
    - "[[Closure Scope]]"
    - "[[AI]]"
  nests: "within the AI domain as an applied read of AI Drift, scoped to a single AI response."
  reads: "AI Reply Drift becomes readable where a reply continues the surface topic while bypassing the dependency conditions that made the topic available."
  carries: []

publish: true
status: stable
garden_status: rooted
---
# AI Reply Drift

AI Reply Drift reads a local case where an AI answer remains fluent while losing the dependency path it claims to carry.

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
