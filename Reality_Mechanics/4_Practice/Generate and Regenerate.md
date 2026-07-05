---

grounded: true
order: practice
kind: instrument
ai_role: practice
condition_key: practice.generate-and-regenerate

needs:
  - "[[Order Generation]]"
  - "[[Generative Trace]]"
  - "[[Degenerative Trace]]"
  - "[[Check]]"
  - "[[Recarry]]"

conditions:
  places: "the practice instrument for asking how carrying is generated, where its trace is preserved or lost, and how it can be regenerated and carried again."
  holds: "[[Order Generation]], [[Generative Trace]], [[Degenerative Trace]], [[Check]], and [[Recarry]]. A generated carrying, a trace check, a possible degeneration path, and a way to re-enter carrying must be available before the instrument can be used."
  pairs: "[[Bearing Pass]]. Bearing Pass tends a member; Generate and Regenerate tests whether the member preserves enough generative trace to continue, diagnose loss, and re-enter carrying."
  traces:
    - "[[Order Generation]]"
    - "[[Generative Trace]]"
    - "[[Degenerative Trace]]"
    - "[[Check]]"
    - "[[Recarry]]"
  nests: "inside Atlas Practice as an instrument for designed regeneration: making the trace of a process capable of seeding another movement."
  reads: "where a participant needs to move from generated carrying through trace, degeneration diagnosis, regeneration, and recarry without losing the order that made continuation possible."
  carries:
    - "[[Ark Run]]"

publish: true
status: working
---
# Generate and Regenerate

The practice instrument for asking how carrying is generated, where its trace is preserved or lost, and how it can be regenerated and carried again.

Generate and Regenerate is held by [[Order Generation]], [[Generative Trace]], [[Degenerative Trace]], [[Check]], and [[Recarry]].

It is not the Atlas itself. It is a way to process Atlas work where the trace of generation needs to become re-enterable.

The short form is:

```text Generate leaves trace. Degenerate loses generative trace while carrying continues. Regenerate returns through trace to generative conditions. Recarry takes up carrying again, differently. ```

## Places

Generate and Regenerate places the practice instrument for asking how carrying is generated, where its trace is preserved or lost, and how it can be regenerated and carried again.

## Holds

Generate and Regenerate is held by [[Order Generation]], [[Generative Trace]], [[Degenerative Trace]], [[Check]], and [[Recarry]].

Order Generation gives exemplar systems. Generative Trace asks whether the generating order can seed continuation. Degenerative Trace asks where carrying lost contact with its generating order. Check locates the boundary. Recarry names carrying taken up again, differently.

## Pairs

Generate and Regenerate pairs with [[Bearing Pass]]. Bearing Pass tends a member; Generate and Regenerate tests whether the member preserves enough generative trace to continue, diagnose loss, and re-enter carrying.

## Traces

- [[Order Generation]]
- [[Generative Trace]]
- [[Degenerative Trace]]
- [[Check]]
- [[Recarry]]

## Nests

Generate and Regenerate nests inside [[Atlas Practice]] as an instrument for designed regeneration: making the trace of a process capable of seeding another movement.

It belongs beside the other instruments rather than above them. It becomes useful where a note, run, term, branch, field, or participant needs to know not only what was produced, but how the production can be re-entered.

[[Ark Run]] can use this instrument where a run needs to leave enough trace for another run or participant to re-enter the carrying.

## Reads

Generate and Regenerate becomes recognisable where a participant can use the following pass:

```text
1. Generate
   What conditions produced this carrying?

2. Trace
   What order of generation must remain recoverable?

3. Check
   What bound keeps the carrying answerable?

4. Diagnose
   Is the trace generative, degenerative, or merely recorded?

5. Regenerate
   What return to generative conditions can seed continuation?

6. Recarry
   What can now be carried again, differently?
```

The instrument distinguishes three traces:

```text
record trace        records what happened
generative trace    preserves enough order to seed continuation
degenerative trace  locates where carrying continued after losing generative order
```

In Ark terms:

```text
Pressure
-> Trace
-> Check
-> Bounded Carry
-> Hold / Determination
-> Generative Trace
-> Re-entry
```

A process regenerates by design where the trace of its run can seed another run.

## AI Formula

An AI may use Generate and Regenerate as a formula when asked to evaluate, continue, repair, or re-enter a note, run, read, branch, argument, design, practice, or decision.

The formula is:

```text
generated_carry =
  generate(origin, operation, bound)

trace_state =
  classify_trace(origin, operation, bound, carry, re_entry)

if trace_state == generative:
  continue_from(re_entry)

if trace_state == degenerative:
  return_to(origin, operation, bound)
  recarry(what_remains_true)

if trace_state == record_only:
  do_not_claim_regeneration
  ask_for_or_recover_missing_trace
```

The validity formula is:

```text
GT = O x P x B x R
```

Where:

```text
GT = Generative Trace
O  = Origin: what generated the carrying
P  = Process: what operation produced continuation
B  = Bound: what kept the carrying answerable
R  = Re-entry: how another run or participant can continue from it
```

This formula is multiplicative because each factor is required. If any factor is absent, the generative trace claim fails or weakens:

```text
O x P x B x R = generative trace
O x P x B x 0 = record trace
O x P x 0 x R = overreach
O x 0 x B x R = unexplained jump
0 x P x B x R = apparent source / source drift risk
O x P x 0 x 0 = generated but unre-enterable
```

The risk formula is:

```text
DR = Output / Recoverable Trace
```

Where:

```text
DR = Degeneration Risk
```

If output grows faster than recoverable trace, degeneration risk rises. For AI, this is the fluency warning: high output with low trace is source drift risk even when the output sounds coherent.

The AI-facing fields are:

```yaml
origin: what generated the carrying
operation: what rule, relation, movement, or constraint produced continuation
bound: what scope, limit, or condition kept carrying answerable
carry: what became available to continue
trace: what path makes the generation recoverable
trace_state: generative | degenerative | record_only | missing
loss_point: where carrying lost contact with generating order, if present
return_path: what returns to generative conditions
re_entry: how the next participant or run can enter
recarry: what can now be carried again, differently
```

The minimum valid output is:

```text
Generated by:
Bounded by:
Carried forward:
Trace state:
Return path:
Next recarry:
```

Rules for AI use:

- Do not call a trace generative unless re-entry is named.
- Do not call a trace degenerative merely because it is incomplete; locate where carrying continued after generative order was lost.
- Use `GT = O x P x B x R` as the validity check: origin, process, bound, and re-entry must all be present before claiming generative trace.
- Use `DR = Output / Recoverable Trace` as the risk check: if output outruns recoverable trace, flag degeneration risk.
- If origin, operation, or bound are missing, classify the trace as missing or record_only.
- If re-entry is unavailable, do not claim regeneration; ask for the missing trace or recover it from Atlas context.
- Preserve uncertainty. A partial formula is still useful if its missing fields are named.

## Carries

- [[Ark Run]]
