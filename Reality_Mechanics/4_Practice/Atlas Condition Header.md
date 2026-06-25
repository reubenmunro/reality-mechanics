---
grounded: true
order: practice
domain: atlas-practice
kind: standard
ai_role: standard
condition_key: practice.atlas-condition-header

needs:
  - "[[Terms and Conditions]]"
  - "[[Term]]"
  - "[[Condition]]"

conditions:
  places: "root-level Atlas practice standard"
  holds: "[[Terms and Conditions]], [[Term]], and [[Condition]]. Terms and conditions must remain traceable before the compact condition summary can serve Atlas notes."
  pairs: "No lateral pair is required at this placement. Atlas Condition Header is a note-standard format rather than one side of a structural pair."
  traces:
    - "[[Term]]"
    - "[[Condition]]"
    - "[[Terms and Conditions]]"
    - "[[Atlas Note Standard]]"
  nests: "within Atlas practice, note formatting, AI-assisted reading, and grounding workflow"
  reads: "the top of a note carries the gathered condition summary while the body carries the full human-facing read"
  carries: []

publish: true
status: stable
garden_status: rooted
---

# Atlas Condition Header

Atlas Condition Header names the compact condition summary placed at the top of an Atlas note.

It allows a note to remain human-facing while giving AI and other tools a clear, stable way to locate the gathered condition information.

The header does not replace the note body. The body carries the full read. The header carries the condition summary.

## Places

Atlas Condition Header places within Atlas practice as a note-formatting standard.

It belongs at the level of the root note standards, beside the notes that define how terms, conditions, service, and grounding are handled.

## Holds

Atlas Condition Header is held by [[Terms and Conditions]], [[Term]], and [[Condition]].

A term only serves where its conditions remain traceable. The header gives those conditions a compact form at the top of the note.

## Pairs

No lateral pair is required at this placement. Atlas Condition Header is a note-standard format rather than one side of a structural pair.

## Traces

- [[Term]]
- [[Condition]]
- [[Terms and Conditions]]
- [[Atlas Note Standard]]

## Nests

Atlas Condition Header nests within the Human-AI organisation of the Atlas.

It is not an authorship claim, an audit status, or a grounding decision. It is a structural summary that helps AI and other tools scan the note quickly while leaving groundedness as the simple authority marker.

## Reads

Atlas Condition Header becomes recognisable where the top of a note carries the gathered condition information in a predictable form:

```yaml
---
grounded: false
order:
domain:
kind: term
condition_key:

needs: []

conditions:
  places: ""
  holds: ""
  pairs: ""
  traces: []
  nests: ""
  reads: ""
  carries: []
---
```

The condition keys mirror the body headings:

- Places
- Holds
- Pairs
- Traces
- Nests
- Reads
- Carries

The header is not a checklist. It does not add a separate pass/fail layer. It only carries the gathered structural information in a compact form.

## Carries

Atlas Condition Header carries forward a cleaner Human-AI workflow:

- the body remains readable to humans;
- the header remains scannable to AI;
- grounded remains the simple acceptance field;
- condition summaries can be searched, compared, checked, and mapped without rewriting the note body.

The rule is:

```text
The body carries the full note.
The header carries the condition summary.
Grounded carries acceptance.
```
