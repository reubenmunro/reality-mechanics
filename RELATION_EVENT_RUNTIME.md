# Relation/Event Runtime Direction

The redesign is not a website redesign.

It is a runtime redesign.

The Atlas is an invariant relational structure. The runtime exists to reveal that structure, not redefine it.

The Ark is nested within the Atlas.

```text
Atlas
  -> Ark
      -> Participant State
      -> Inhabitants
```

The structural ratio is `Ark : Atlas`.

The Atlas is the world/invariant structure. The Ark is the vessel/environment that carries participants through that structure.

Atlas ecology is place-level response and accumulated traversal history: traversal, visibility, pressure, and path history. It may respond ecosystemically, but it must not mutate invariant Atlas structure.

Ark experience is participant-local movement, memory, inhabitants, and symbolic responses.

## World Physics

World Physics describes Reality Mechanics itself. It should not depend on implementation.

`Seed : Ground` is the generative ratio.

Seed becomes readable only against Ground. Ground becomes active as what can hold Seed.

`One : Other` is the read ratio.

The moment one is readable, other is implied.

`1 : 1-` is the invariant.

Relation cannot appear as pure sameness. Difference is not added later; it is the first readable asymmetry.

Frequency is not a global property.

Frequency is how a participant reads its own changing ratio from within relation. Time is the lived experience of local frequency.

Structural events arise whenever participants move through relation.

The runtime should implement these principles. It does not define them.

## Runtime Contract

The runtime observes participant movement through the Atlas.

It translates that movement into structural events.

Listeners subscribe to those events.

Listeners never mutate Atlas structure.

Listeners only respond to structural events.

The Atlas remains the source of truth.

The runtime does not create meaning. It preserves the conditions under which meaning remains retraceable.

The runtime is a structural observatory: dependency-light, deterministic, and unaware of listeners.

## Structural Events

Participant movement becomes readable as events.

Initial runtime event types:

- `first_encounter`
- `transition`
- `return`
- `retrace`
- `loop_completed`
- `unexpected_ratio`
- `absence_return`
- `overload`
- `settling`

Each event should carry enough structure for listeners to respond without knowing term-specific names:

```js
{
  id,
  participantId,
  type,
  from,
  to,
  relation,
  referenceFrame,
  ratio,
  localFrequency,
  trace,
  occurredAt
}
```

## Deterministic Listeners

Interfaces listen.

AI inhabitants listen.

Ambient effects listen.

Garden actions listen.

No listener owns the Atlas. No listener invents structure. A listener may translate, illuminate, compress, delay, shade, surface pressure, or propose through the Garden. It must remain answerable to the structural event that called it.

The first deterministic listener is Trace Memory.

Trace Memory observes structural events and derives local participant memory:

- visit count
- return count
- retrace count
- loop count
- last visited
- local frequency
- recent path

It does not interpret meaning or make decisions. It preserves participant history in a retraceable form for future listeners and inhabitants.

## Participant Experience

Participant Experience is a separate deterministic layer.

It reads:

- the current structural event
- Trace Memory state

It derives experiential signals:

- recurrence
- familiarity
- anticipation
- rhythm
- local frequency

It does not use AI, inspect term prose, depend on bespoke term names, mutate Atlas structure, or mutate Trace Memory.

Trace Memory remembers what happened. Participant Experience derives how it is locally recurring.

## Participant State

Participant State is a deterministic composition layer.

It applies one structural event to Trace Memory, then derives Participant Experience from the updated memory. It does not add interpretation. It exists so future systems can read one participant-local state object without making the Runtime Observatory aware of listeners.

The continuing architecture is nested:

```text
Atlas
  -> Ark
      -> Runtime Observatory
      -> Deterministic Listeners
      -> Participant Experience
      -> Participant State
      -> Symbolic Inhabitants
```

## Symbolic Inhabitants

The first inhabitant is Pulse.

Pulse consumes only Participant State. Its bounded responsibility is to express local recurrence as a deterministic symbolic response. It does not inspect Atlas terms, generate media, use AI, initiate interaction, or know who will consume its response.

Pulse lives inside the Ark. It proves that an inhabitant can live downstream of participant experience without coupling itself to Atlas prose or bespoke term logic.

### Pulse Contract

Pulse is the heartbeat.

It senses only:

- `participantState.experience.recurrence`
- `participantState.experience.familiarity`
- `participantState.experience.rhythm`
- `participantState.experience.localFrequency`

It cannot sense:

- Atlas term titles
- Atlas prose
- authored explanations
- UI state
- sound, light, weather, or visual systems
- other inhabitants
- who will consume its response

It expresses:

- one symbolic recurrence response
- one deterministic intensity
- one deterministic tempo
- the event id and time it is answerable to

It must never:

- generate media
- call AI
- initiate interaction
- mutate Atlas structure
- mutate Participant State
- infer meaning from term names
- inspect term prose
- choose navigation
- coordinate other inhabitants

It remains term-agnostic by excluding term names and destination ids from its response. It reads only participant-local recurrence, familiarity, rhythm, and local frequency.

It remains answerable to Participant State by returning the `eventId` and `at` values from the experience that produced the response. If Participant State has no memory or experience, Pulse refuses to respond.

The second inhabitant is Threshold.

Threshold is contact.

Threshold consumes only Participant State. Its bounded responsibility is to express the participant's boundary/contact state as a deterministic symbolic response. It does not inspect Atlas terms, generate media, use AI, initiate interaction, coordinate with Pulse, or know who will consume its response.
Threshold lives inside the Ark.

### Threshold Contract

Threshold senses only:

- `participantState.experience.recurrence`
- `participantState.experience.relation`
- `participantState.experience.rhythm.currentEventType`

It cannot sense:

- Atlas term titles
- Atlas prose
- authored explanations
- UI state
- sound, light, weather, or visual systems
- Pulse or other inhabitants
- who will consume its response

It expresses one symbolic contact response:

- `entering`
- `crossing`
- `returning`
- `settling`
- `withdrawing`
- `held`

It must never:

- generate media
- call AI
- initiate interaction
- mutate Atlas structure
- mutate Participant State
- infer meaning from term names
- inspect term prose
- choose navigation
- coordinate other inhabitants

It remains term-agnostic by excluding term names and destination ids from its response. It reads only current event type, direct relation shape, reciprocal relation shape, and recurrence flags already present in Participant State.

It remains answerable to Participant State by returning the `eventId` and `at` values from the experience that produced the response. If Participant State has no memory or experience, Threshold refuses to respond.

### Symbolic Response Composition

Symbolic response composition gathers inhabitant responses.

It consumes:

- one Participant State
- a list of independent inhabitant response functions

It returns:

- accepted symbolic responses
- rejected inhabitant reasons

It must never:

- use AI
- inspect Atlas terms or prose
- generate media
- mutate Participant State
- coordinate inhabitants
- interpret combined meaning
- choose which inhabitant is more important

Composition proves that multiple inhabitants can live beside one another without becoming a single orchestrator. Each inhabitant receives the same Participant State and responds independently.

### Runtime Chain Fixture

The non-visual fixture proves the full deterministic chain:

```text
Runtime Observatory
-> Participant State
-> Pulse
-> Threshold
-> Symbolic Inhabitant Composer
```

It uses mock Atlas entries with structural relations only. It observes one participant movement, reduces participant state, gathers Pulse and Threshold responses, and checks that symbolic responses remain answerable to the event without leaking term names.

## AI Inhabitants

AI does not inhabit terms. AI inhabits relation.

An AI inhabitant has:

- one bounded responsibility
- limited senses
- one expressive medium
- one profession

It responds to structural events. It does not author, oracle, initiate, or invent structure.

Its behaviour depends on event shape and relation behaviour, not specific term names. It responds to the same invariant physics as every other participant.

Examples:

- sound responds to recurrence, loop, overload, and settling
- light responds to first encounter, return, absence, and proximity
- weather responds to unresolved pressure, drift, and unexpected ratio
- movement responds to transition shape and retrace
- Garden stewardship responds only to proposed structural continuations

## Runtime Test

Add a term.

If the world can read it by its relations, dependency, order, trace, carry, pair, nest, and reads, the runtime is coherent.

If the world needs custom interface code, custom AI instructions, or custom authored effects for that term, the invariant is too weak.
