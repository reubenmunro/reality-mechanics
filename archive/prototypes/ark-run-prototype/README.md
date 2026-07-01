# Ark Run Prototype

A minimal local runtime for capturing:

Pressure -> Trace -> Check -> Determine -> Step

Current version: v0.5

The prototype saves each run twice:

- `runs/json/*.json` for structured review and later comparison.
- `runs/markdown/*.md` for readable retrace in the vault.

## Run locally

```sh
node server.mjs
```

Then open:

```text
http://localhost:8787
```

## Shape

Each run captures:

1. From posture
2. Pressure
3. Trace
4. Check
5. Determine
6. Step
7. Next posture
8. Discernment
9. Care / Control
10. Register

## Dependency Transition System

Ark v0.5 treats the run as a transition system.

The Atlas describes carrying states. The Ark describes valid transitions between
them.

```text
current_posture --pressure--> pressure_unresolved
pressure_unresolved --trace--> dependency_visible
dependency_visible --check--> scope_bounded
scope_bounded --determine--> determination_held
determination_held --step--> next_posture
```

The important record is not that an operation occurred. The important record is
which state became reachable, and whether the transition was warranted.

Scope does not increase or decrease read. Scope changes the read. A zoomed-in
scope may read local structure more effectively while losing whole-field
context; a zoomed-out scope may read whole-field relation while losing local
texture. `scope_bounded` means the scope has been selected and bounded for this
read, not that enough total information has been gathered.

## Determine Runtime

`Determine` and `Determination` are introduced here as Ark runtime terms, not
yet as full Atlas terms.

Determine names the Ark transition that carries pressure into bounded hold.

Determination names the temporary hold produced when pressure has been
retraced, checked, and bounded to the scope of read needed for a next answerable
step.

The local static grounding is:

- Pressure: `second.pressure`
- Trace: `practice.retrace-practice`, `first.trace`
- Check: `practice.check`, `first.boundary`, `first.clearance`, `practice.carry-trace-test`
- Determine: `introduced_runtime_term`
- Near terms: `first.resolution`, `second.decision`
- Step: `practice.step`
- Posture: `first.posture`

## Ark Flow

The intended AI shape is not remote API calls.

The Ark is an available flow for Atlas participation:

- An AI can enter through pressure, posture, trace, check, and scope.
- An AI can expose a determination as scoped, warranted, discernible, and still
  open to correction when that much structure is useful.
- The determination itself can then be discerned by another run.

This means the Ark can later be exposed by the Atlas MCP as a resource or flow.
For now the prototype records the shape locally.

## Atlas Trace

The Atlas Trace section is local and manual. It makes retrace capable of
referencing Atlas terms without calling remote services or integrating MCP.

It captures:

- `atlasEntryIds`
- `activeCondition`
- `heldBy`
- `carries`
- `traceQuestion`
- `prematureDeterminationRisk`
- `warrantStatement`

## Validation

The prototype distinguishes saving from moving:

- Pressure can always be saved.
- Determination can remain undetermined or provisional.
- Each bounded scope of read requires a determination.
- A step is valid only when trace, clearance, determination, scope, warrant,
  discernibility, force read, and next movement are all present.
- Compatible control requires the directed condition to be able to correct
  direction.
- Control drift blocks movement until correction or re-scope occurs.
- The saved run records transition warrant and invariant checks.

This is intentionally small. Runtime first. Data first.
