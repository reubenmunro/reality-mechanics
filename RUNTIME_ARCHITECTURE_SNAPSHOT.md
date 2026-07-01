# Runtime Architecture Snapshot

This snapshot locks the current boundary before the runtime grows.

## Protected Invariant

The Atlas is an invariant relational structure.

The runtime is translation, not origin. It observes participant movement through Atlas relation and makes that movement readable as structural events. It must not create meaning, define World Physics, mutate Atlas structure, inspect Atlas prose, or introduce term-specific behaviour.

The Ark is not separate from the Atlas. The Ark is nested within the Atlas.

The structural ratio is:

```text
Ark : Atlas
```

The Atlas is the world/invariant structure. The Ark is the vessel/environment that carries participants through that structure.

Atlas ecology names place-level response and accumulated traversal history: traversal, visibility, pressure, and path history. Atlas ecology may respond ecosystemically, but it must not mutate invariant Atlas structure.

Ark experience names participant-local movement, memory, inhabitants, and symbolic responses.

The protected invariant is:

```text
Atlas
-> Ark
   -> Runtime Observatory
   -> Participant State
      -> Trace Memory
      -> Participant Experience
   -> Inhabitants
      -> Pulse
      -> Threshold
   -> Symbolic Response Composition
```

## Current Files

- `atlas-structure-contract.mjs`  
  Shared invariant and runtime contract: structure fields, relation fields, World Physics, structural event fields, and relation helpers.

- `RELATION_EVENT_RUNTIME.md`  
  Living runtime direction and contracts.

- `relation-event-runtime.mjs`  
  Runtime Observatory inside the Ark. Translates participant movement through Atlas structure into structural events.

- `trace-memory-listener.mjs`  
  Deterministic listener. Preserves participant history from structural events.

- `participant-experience.mjs`  
  Deterministic derivation layer. Reads current event plus Trace Memory and derives local experience signals.

- `participant-state-reducer.mjs`  
  Deterministic Ark composition layer. Applies one event to memory, derives experience, and returns participant-local state.

- `pulse-inhabitant.mjs`  
  Symbolic Ark inhabitant. Expresses local recurrence as heartbeat.

- `threshold-inhabitant.mjs`  
  Symbolic Ark inhabitant. Expresses boundary/contact state.

- `symbolic-inhabitant-composer.mjs`  
  Response gatherer. Runs independent inhabitants against the same Participant State and gathers their symbolic responses.

- `runtime-chain.fixture.test.mjs`  
  Full non-visual proof chain from mock structural movement to gathered symbolic responses.

- `runtime-event-shapes.fixture.test.mjs`  
  Full non-visual proof fixtures for `loop_completed`, `absence_return`, `overload`, and `settling`.

- `*.test.mjs` files  
  Deterministic layer tests.

## Layer Responsibilities

### World Physics

Describes Reality Mechanics itself:

- `Seed : Ground` as generative ratio
- `One : Other` as read ratio
- `1 : 1-` as invariant asymmetry
- participant-local frequency
- structural events arising from participant movement through relation

Must never depend on implementation.

### Runtime Observatory

File: `relation-event-runtime.mjs`

Responsibility:

- observe participant movement through Atlas relation
- translate that movement into structural events
- remain dependency-light, deterministic, and listener-agnostic
- serve Ark experience without becoming Atlas ecology

Must never:

- know who is listening
- mutate Atlas structure
- inspect Atlas prose
- create meaning
- use AI, UI, media, or term-specific logic
- accumulate place-level ecology

### Trace Memory

File: `trace-memory-listener.mjs`

Responsibility:

- remember what happened
- derive visit count, return count, retrace count, loop count, last visited, local frequency, recent path, and visits by term

Must never:

- interpret meaning
- make decisions
- mutate Atlas structure
- mutate prior memory
- inspect terms or prose

### Participant Experience

File: `participant-experience.mjs`

Responsibility:

- derive how the current event is locally recurring
- produce recurrence, familiarity, anticipation, rhythm, and local frequency signals from event shape and Trace Memory

Must never:

- use AI
- inspect term prose
- depend on bespoke term names
- mutate Atlas structure
- mutate Trace Memory

### Participant State

File: `participant-state-reducer.mjs`

Responsibility:

- compose Trace Memory and Participant Experience into one participant-local state object
- preserve a stable input for future inhabitants
- remain Ark-local

Must never:

- add interpretation
- know about inhabitants
- mutate prior state
- inspect Atlas prose
- become Atlas ecology

### Pulse

File: `pulse-inhabitant.mjs`

Responsibility:

- live inside the Ark and express local recurrence as one deterministic symbolic heartbeat

Must never:

- generate media
- call AI
- initiate interaction
- mutate Atlas or Participant State
- infer meaning from term names
- coordinate with other inhabitants

### Threshold

File: `threshold-inhabitant.mjs`

Responsibility:

- live inside the Ark and express participant boundary/contact state as one deterministic symbolic response

Must never:

- generate media
- call AI
- initiate interaction
- mutate Atlas or Participant State
- infer meaning from term names
- coordinate with Pulse or other inhabitants

### Symbolic Response Composition

File: `symbolic-inhabitant-composer.mjs`

Responsibility:

- gather independent symbolic inhabitant responses
- gather rejection reasons

Must never:

- orchestrate inhabitants
- coordinate responses
- interpret combined meaning
- choose priority
- inspect Atlas terms or prose
- mutate Participant State

## Full Chain

The current proof chain is:

```text
mock Atlas movement
-> Atlas
   -> Ark
      -> Runtime Observatory
      -> structural event
      -> Participant State
         -> Trace Memory
         -> Participant Experience
      -> Pulse
      -> Threshold
      -> Symbolic Response Composition
      -> gathered symbolic responses
```

This is verified by `runtime-chain.fixture.test.mjs`.

Additional event-shape fixtures verify that `loop_completed`, `absence_return`, `overload`, and `settling` all preserve the same chain without adding architecture.

## Next Safe Extension Points

Safe next steps are small and deterministic:

- add another symbolic inhabitant with one bounded responsibility
- add fixtures for additional event shapes such as loop, absence return, overload, or settling
- add persistence adapters for Participant State, kept separate from the reducer
- add a read-only adapter that exposes gathered symbolic responses to UI later
- add contract tests that prevent term names from leaking into inhabitant responses

Unsafe next steps for now:

- AI inhabitants
- sound, light, weather, or generated media
- UI coupling
- term-specific behaviour
- any layer that coordinates inhabitants or interprets combined symbolic meaning
