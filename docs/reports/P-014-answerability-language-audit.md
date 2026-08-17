# P-014 — Answerability Language Audit

**Programme:** Research / Atlas readability
**Type:** Bounded lexical and structural audit (one prose clarification; no relation-metadata changes, no new terms, no bulk Atlas rewrite)
**Date:** 2026-08-17 (UTC+12)
**Pre-change canonical basis:** Atlas MCP v4.1, release `first-canonical-translation-rc-001b-4b3018d605b0`, source hash `sha256:aa7717f692e8cec839cb30c9062f66775df387f230a3a0b3982b3ca320a01443`, 495 entries, parity `true`

## Verdict

| Question | Result |
|---|---|
| Does the model/design distinction refine the Atlas? | **Yes, as a narrow clarification of Modelling.** |
| Does it justify new Model, Design, Correction, or Mechanics entries? | **No.** |
| Is `answerable` one consistently placed mechanic? | **No.** It carries several distinguishable structural senses. |
| Should all uses be replaced now? | **No.** A bulk rewrite would cross multiple orders, fields, and determinations. |
| What is warranted now? | Keep the Modelling clarification; calibrate load-bearing uses of `answerable` against the mechanics each use intends. |

**Bottom line:** The Atlas already distinguishes a model from the condition it represents and already provides Reality Check, Bearing Source, Effect, Consequence, Check, and Atlas Practice. The useful refinement is to state that model formation bounds the representation but does not make the represented condition hold. The word `answerable` should not be used as a substitute for the particular trace, check, correction, response, or responsibility being claimed.

## 1. Trigger and scope

The audit was triggered when `answerable` did not make its intended operation readable in ordinary use. That is material because the Atlas uses the word throughout its load-bearing and domain language.

A case-insensitive repository search found:

- **269 occurrences** of `answerable` or `answerability`
- on **260 matched lines**
- across **81 Atlas files**
- including repeated frontmatter and body formulations, so the count is an expression count rather than 269 independent claims

This audit classifies the recurring senses. It does not determine that every occurrence is defective and does not authorise automatic replacement.

A working classification assigned each matched line one dominant sense:

| Dominant sense | Lines | Direct structural reading |
|---|---:|---|
| Dependency or bearing fidelity | 47 | Retraceable to what holds, bears, carries, or generated it |
| Reference or scope boundedness | 28 | Valid relative to an explicit boundary, frame, scale, warrant, or standard |
| Trace and check support | 49 | Support remains exposed to challenge and retrace |
| Bounded practical movement | 23 | A step, hold, or action is scoped enough to check, revise, or stop |
| Responsibility or control | 45 | Participation or authority is traceable for effects and open to correction |
| Mutual or public relation | 13 | Participants remain responsive to one another through boundary, restraint, and repair |
| Responsive exposure | 12 | Carrying becomes locally available to read, response, or encounter |
| Cognition-branch usage | 25 | Thought returns to body, relation, task, reality, or consequence; this includes title and index references |
| Metatheoretical umbrella | 18 | Answerable order, placement, or continuation is asserted without one fully specified mechanism |

These are audit categories, not proposed Atlas terms. Sections 3.1–3.4 group them into broader review families.

## 2. Existing model boundary

The distinction developed in the inquiry is already distributed across declared entries:

| Structural role | Existing placement |
|---|---|
| A model carries a simplified or usable representation without becoming the condition. | `third.modelling` |
| A read enters order and may alter what it enters, but does not create that order. | `first.read` |
| A model or claim is checked against what bears it at a relevant scope. | `third.reality-check` |
| A carried change must be traced through coupling before Effect can be named. | `second.effect` |
| Consequence is an effect continuing into later conditions through carrying and trace. | `second.consequence` |
| Structured design can make incompatibility readable; design does not establish the model as true. | `third.experimental-science` |
| The Atlas remains a worked surface rather than becoming the thing itself. | `practice.atlas-practice` |

The resulting distinction is:

```text
model formation
  -> shapes representation, visibility, testability, and claim scope

represented condition
  -> is not made to hold by that formation

reality check
  -> evaluates compatibility with a bearing source at scope

effect / consequence
  -> become relevant only where change and continuation remain traceable

revision
  -> may alter model, read, design, or scope without erasing the failure path
```

This is not a single generative chain. Models can be formed without intervention; Reality Check can test claims and reads that are not models; and a consequence does not by itself prove or disprove a model.

## 3. Distinct senses currently carried by `answerable`

### 3.1 Dependency fidelity

Representative entries: `ground.groundedness`, `first.read`, `practice.reasoning`, `practice.reality-mechanics-theory`, `practice.atlas`.

Intended structure: a term, read, or continuation remains **traceable to what holds it** and has not substituted its carrier, explanation, or apparent source for the bearing relation.

Preferred direct language where this is the only intended sense:

> traceable to what holds it

### 3.2 Procedural corrigibility

Representative entries: `practice.check`, `practice.discipline`, `practice.atlas-practice`, `practice.step`, `practice.determination`, `foundation.common-term-structure`.

Intended structure: a read or movement can be **checked, bounded, corrected, and retraced within scope**.

Preferred direct language:

> checkable and correctable within its declared scope

### 3.3 Participatory responsibility

Representative entries: `second.responsibility`, `third.authority`, `third.civil`, and `third.borne-and-carried`.

Intended structure: trace returns an effect to the coupled boundary through which participation made it actionable. This is not merely epistemic traceability; it concerns **who or what bears responsibility for what follows**.

Preferred direct language:

> participation to which the effect can be traced

or, where the full determination holds:

> responsible for the effect at the traced coupled boundary

### 3.4 Responsive presentation or return

Representative entries: `second.face`, `third.answerable-mind`, and some coupling and relation reads.

Intended structure: carrying reaches a face, mind, participant, or boundary through which a response or return can occur. Here ordinary "able to answer" language is part of the claim rather than shorthand for Groundedness or Responsibility.

This sense may retain `answerable` only where the entry also makes clear:

- what can respond or return;
- to what condition;
- through which boundary, face, trace, or read;
- and what failure of response would mean.

### 3.5 Hybrid uses

Some sentences join dependency fidelity, correction, and responsibility in one use of `answerable`. Those sentences should be sectioned before revision. Replacing the word with a synonym would preserve the ambiguity.

## 4. High-risk load-bearing uses

The following uses merit first review because the word currently joins unlike mechanics:

1. `Reality_Mechanics/Reality Mechanics.md:53` makes answerability appear to be a stage after traceability and before return to practice, without placing the additional operation.
2. `Reality_Mechanics/00_ROOT.md:128` says everything must remain answerable to the working root. Read literally, this can make the Atlas's own model the final counterpart rather than the relation that bears it.
3. `Reality_Mechanics/Atlas.md:63` joins reality, participant review, Atlas Practice, and correction as counterparts of one answerability relation, although they are respectively bearing condition, authority/review, method, and response.
4. `Reality_Mechanics/2_Second/Produced Distinctions/Face.md:50-58` uses answerability for exposure to read and response. The operative mechanics appear to be surface, readability, return, and availability rather than responsibility.
5. `Reality_Mechanics/3_Third/Fields/Cognition/Answerable Mind.md:60-64` joins body, relation, task, reality, care, consequence, and truth as things cognition answers to. Those require different dependency, epistemic, normative, and consequential tests.
6. `Reality_Mechanics/AI_PARTICIPATION.md:73` risks carrying structural participation into obligation without separately locating authority and responsibility.

These are review findings, not determinations that the entries are wrong.

## 5. Failure modes

| Failure | Consequence |
|---|---|
| Treating Answerability as one undeclared universal mechanic | Traceability, correction, responsiveness, and responsibility collapse. |
| Treating a designed model as its own bearing source | The model becomes self-sealing. |
| Treating any change as Effect or any later state as Consequence | Coupling, carrying, and trace requirements are bypassed. |
| Treating a consequence as proof | Scope, alternative causes, instrument effects, and competence boundaries disappear. |
| Saying reality or an occurrence "answers" without locating a return path | Agency or judgement is attributed where only constraint or effect has been shown. |
| Bulk replacement of `answerable` | Existing determinations and distinct domain meanings may be silently rewritten. |

## 6. Lexical test for future use

Before retaining `answerable`, ask:

1. Is the intended mechanic dependency trace, procedural correction, responsibility, or responsive return?
2. What specifically is answering, returning, being checked, or bearing an effect?
3. To what condition or participant?
4. Through what trace, boundary, coupling, or scope?
5. What observable failure would make the claim stop holding?

If those questions can be answered by an existing mechanic, use that mechanic directly. Retain `answerable` only where the capacity to answer or return is itself material and has been placed.

## 7. Implemented bounded clarification

The authorised refinement adds one paragraph to `third.modelling` under **Reads**:

> Forming a model does not make the condition it represents hold. Choices or constraints in its formation set what it can show or test and the scope of its claims. A separate Reality Check tests those claims against their bearing source at that scope. Where use or intervention produces a traceable Effect or Consequence, the result may become material for that check. Revision may change the model, read, design, or scope, but the path through what failed remains traceable.

The clarification adds no `needs`, `holds`, `pairs`, `traces`, `nests`, `reads`, or `carries` target. It does not claim that all modelling is intentional, that all models undergo Reality Check, or that consequence establishes truth.

## 8. Recommended next boundary

Any later canonical revision of `answerable` should begin with the load-bearing spine rather than the 81-file expression set:

1. `ground.groundedness`
2. `practice.atlas`
3. `practice.reality-mechanics-theory`
4. `foundation.common-term-structure`
5. `first.read`
6. `practice.check`
7. `practice.reasoning`

For each occurrence, preserve the existing determination unless an exact before/after proposal shows that its intended structural claim changes. Domain-specific uses, especially Responsibility, Face, Authority, Civil, and Answerable Mind, require separate review because their use of answer and response may be substantive rather than shorthand.

No bulk Atlas rewrite is authorised by this audit.
