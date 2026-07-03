---
grounded: true
order: practice
kind: condition
ai_role: operation
condition_key: practice.oracle-carrying-conditions

needs:
  - "[[Atlas Oracle]]"
  - "[[AI Participation]]"
  - "[[Check]]"
  - "[[Care-Control Check]]"
  - "[[Carried Condition]]"
  - "[[Generate and Regenerate]]"

conditions:
  places: "the operational conditions that must hold for Atlas Oracle to run without drifting from bounded carrying into unbounded AI use."
  holds: "[[Atlas Oracle]], [[AI Participation]], [[Check]], [[Care-Control Check]], [[Carried Condition]], and [[Generate and Regenerate]]."
  pairs: "External governance. Oracle Carrying Conditions governs by operation: if the conditions do not hold, the Oracle does not run."
  traces:
    - "[[Atlas Oracle]]"
    - "[[AI Participation]]"
    - "[[Check]]"
    - "[[Care-Control Check]]"
    - "[[Carried Condition]]"
    - "[[Generate and Regenerate]]"
  nests: "inside Atlas Oracle as the runtime conditions that preserve bounded carrying."
  reads: "where governance is not a separate policy layer but a condition of operation: the answer can run only while cost, scope, trace, storage, safety, and review remain bounded."
  carries:
    - "[[Garden Pass]]"
    - "[[Generative Trace]]"

publish: true
status: working
garden_status: planted
aliases:
  - Oracle Conditions
  - Oracle Governance
---
# Oracle Carrying Conditions

Oracle Carrying Conditions names the operational conditions that must hold for [[Atlas Oracle]] to run without drifting from bounded carrying into unbounded AI use.

Governance is not placed outside the operation. It is carried inside the operation.

If the conditions do not hold, the Oracle does not run as Oracle.

## Places

Oracle Carrying Conditions places governance as a carrying condition of the Oracle itself.

The point is not to add a policy after the answer. The point is to make the answer unable to proceed when the conditions that keep it answerable are absent.

## Holds

Oracle Carrying Conditions is held by [[Atlas Oracle]], [[AI Participation]], [[Check]], [[Care-Control Check]], [[Carried Condition]], and [[Generate and Regenerate]].

Atlas Oracle gives the instrument. AI Participation constrains the artificial participant. Check tests the boundary. Care-Control Check reads generated force. Carried Condition supplies the return point when load exceeds interpretation. Generate and Regenerate tests whether the operation left recoverable trace.

## Pairs

Oracle Carrying Conditions pairs with external governance.

External governance can drift because it depends on later enforcement. Oracle Carrying Conditions governs by operation: if the conditions fail, the Oracle pauses, returns a bounded message, or sends the participant to the Atlas without AI.

## Traces

- [[Atlas Oracle]]
- [[AI Participation]]
- [[Check]]
- [[Care-Control Check]]
- [[Carried Condition]]
- [[Generate and Regenerate]]

## Nests

Oracle Carrying Conditions nests inside [[Atlas Oracle]] as the runtime conditions that preserve bounded carrying.

The public form may be simple:

```text
The Oracle is available while its carrying conditions hold.
If those conditions fail, AI access pauses and the Atlas remains available.
```

The runtime form is stricter:

```text
input bounded
model named
MCP trace available
output structured
answer bounded
review available
raw storage off by default
cost cap active
rate limit active
safety route active
pause available
trace-preserving embed only
koha optional after use
```

## Reads

Oracle Carrying Conditions becomes recognisable where the Oracle refuses to continue rather than exceed its carrying.

The refusal is not failure. It is governance holding.

Examples:

```text
AI access is paused because the shared carrying limit has been reached.
The Atlas remains available.
```

```text
The Oracle cannot answer this under current carrying conditions.
Meaning can wait. Seek immediate support where immediate danger is present.
```

```text
The answer would require more trace than is currently available.
Try a smaller pressure or inspect the Atlas directly.
```

The essential check is:

```text
Can this operation answer, expose trace, preserve review, stay within cost, avoid unnecessary storage, and remain correctable?
```

If not, the next movement is pause, reduce, return, or recarry.

Embedding is allowed only where the carrying conditions travel with the Oracle. A detached answer without source, trace, bound, and review is no longer an Oracle answer.

Koha is allowed only as optional reciprocal carrying. It should not become the condition by which the first answer is made available.

## Carries

- [[Garden Pass]]
- [[Generative Trace]]
