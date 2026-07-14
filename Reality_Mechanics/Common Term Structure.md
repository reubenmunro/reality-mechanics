---
grounded: true
register: foundation
kind: principle
ai_role: practice
condition_key: foundation.common-term-structure
determination: pd.v3.phase-4-minimal-architecture

conditions:
  places: "the common structural reads through which an Atlas term records one participant determination as placed, answerable, retraceable, bounded, readable, and able to carry demonstrated continuation."
  needs:
    targets:
      - practice.atlas
      - ground.term
      - second.structure
      - ground.groundedness
      - first.place
      - first.hold
      - second.pair
      - first.trace
      - third.nesting
      - first.read
      - first.carry
  holds:
    targets:
      - practice.atlas
      - ground.term
      - second.structure
      - ground.groundedness
      - first.place
      - first.hold
      - second.pair
      - first.trace
      - third.nesting
      - first.read
      - first.carry
    read: "[[Atlas]], [[Term]], [[Structure]], [[Groundedness]], [[Place]], [[Hold]], [[Pair]], [[Trace]], [[Nesting]], [[Read]], and [[Carry]]."
  pairs:
    targets: []
    read: "No lateral pair is required. Common Term Structure governs the structural reads of an Atlas term rather than completing one side of a lateral condition."
  traces:
    targets:
      - practice.reality-mechanics
      - practice.atlas
      - ground.term
      - second.structure
      - ground.groundedness
      - first.place
      - first.hold
      - second.pair
      - first.trace
      - third.nesting
      - first.read
      - first.carry
  nests:
    targets: []
    read: "wherever a participant determination is recorded as an Atlas term across changes of carrier."
  reads:
    targets: []
    read: "where one determination can be recovered through Places, Holds, Pairs, Traces, Nests, Reads, and Carries without confusing those reads with their repository encoding."
  carries:
    targets:
      - practice.terms-and-conditions
      - practice.atlasing
      - practice.carry-trace-test
      - practice.discipline
      - practice.ai-participation
atlas_schema:
  identity_field: condition_key
  required_fields:
    - title
    - grounded
    - condition_key
    - kind
    - status
    - publish
    - determination
    - conditions
    - placement
  placement:
    exactly_one_of:
      - order
      - register
    order_values:
      - ground
      - first
      - second
      - third
      - higher
    register_values:
      - foundation
      - practice
  status_values:
    stable: "A grounded determination whose current claim, placement, and declared dependencies have no active bounded revision scope."
    working: "A grounded determination whose current claim and placement govern while a bounded expression or correction remains actively revisable; it is not unresolved investigation."
  structural_radii:
    - local
    - dependency
    - constitutional
    - translation
    - repository
  relation_meanings:
    needs: "What must already be available before the determination can hold."
    holds: "What presently bears the determination."
    pairs: "What completes the read laterally where a pair is structurally required."
    traces: "The recoverable dependency through which the determination can be returned to what made it available."
    nests: "Where the determination remains stable enough to participate in a larger or smaller read."
    reads: "How another participant can recover the determination from the term."
    carries: "Demonstrated downstream continuation, never predicted possibility."
  condition_representation:
    places: authored_read
    relations: explicit_targets_and_optional_authored_read
  target_absence:
    mode: explicit_empty_array
    read_required_for:
      - pairs
      - carries

publish: true
status: stable
---
# Common Term Structure

The common structural reads through which an Atlas term records one participant determination as placed, answerable, retraceable, bounded, readable, and able to carry demonstrated continuation.

Common Term Structure is held by [[Atlas]], [[Term]], [[Structure]], [[Groundedness]], [[Place]], [[Hold]], [[Pair]], [[Trace]], [[Nesting]], [[Read]], and [[Carry]].

It records structural questions, not a repository layout. Markdown, frontmatter, headings, wikilinks, databases, protocols, and other carriers may translate these reads, but no carrier defines or repairs the structure.

## Purpose

Each Atlas term records one participant determination.

Common Term Structure keeps that determination recoverable from the structural positions through which it is placed, borne, related, traced, nested, read, and carried.

## Structural Reads

Each structural read asks a different question of the same determination.

The same target may answer more than one question without making the questions identical. A dependency may both be needed and presently bear a term; a trace may include an immediate dependency and continue beyond it. Coincident targets do not collapse distinct reads.

Translation carries the declared answers. It does not infer an answer where the Atlas does not contain one.

## Places

Places records where the determination becomes structurally available.

## Holds

Holds records what presently bears the determination.

## Pairs

Pairs records what completes the read laterally where a paired condition is structurally required.

Where no lateral pair is required, the record states that absence rather than inventing a pair.

## Traces

Traces records the dependency through which the determination can be recovered.

Trace may extend beyond immediate need where structural retrace requires it. Every trace target is explicitly determined in the Atlas; translation does not infer trace depth.

## Nests

Nests records where the determination remains stable enough to participate in larger or smaller reads.

## Reads

Reads records how another participant can recover the determination from the term.

## Carries

Carries records demonstrated downstream continuation.

Possible continuation remains an opening. A carry is recorded only where the downstream term can trace the prior determination and relevant passage.

## Validation

Before a term is promoted to the Atlas, confirm:

- the claim is preserved
- dependency is traced and placed
- structural radius is assessed
- participant determination is recorded
- each structural read is answered, including an explicit absence where no pair or carry is required
- trace remains recoverable
- carry records demonstrated continuation rather than prediction
- the carrier remains answerable to the determination and does not define it
