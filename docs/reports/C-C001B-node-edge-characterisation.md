# C-C001B — Node and Edge Characterisation

**Mode:** Read-only investigation. No files edited, no governance updated, no primitives proposed, no theory of nodes/edges invented, operation not reconciled, calculus not decided. Every claim is cited to a repository path (and line where useful). Previous chat is not treated as authority.

**Governing question:** What is the structural difference between a node and an edge in Reality Mechanics?

**Constraint compliance:** This report does not invent a theory of nodes and edges, does not promote `Order : Structure : Read`, and does not assume `:` is accepted calculus. Where the Atlas/tooling uses `:` (e.g. Ratio: "Trace : Carry"), it is reported as that surface's own device, not endorsed.

---

## Verdict up front

**"Node" and "edge" are foreign to the repository's native structure.** Neither is a defined first-class concept. What the repository actually has is:

- **Terms** — placed conditions/reads, distinguished by a `kind` field (primitive, term, carrier, class, operation). These are what a graph would call nodes.
- **Relation fields** — a fixed frontmatter set the tooling names explicitly: `RELATION_FIELDS = ["holds", "traces", "carries", "pairs", "nests", "reads"]` (`atlas-structure-contract.mjs:23-30`), plus the dependency field `needs`. These are what a graph would call edges.

But the repository does something a plain graph does not: **it reifies its edges as terms.** `Connection`, `Carry`, `Trace`, and `Relation` itself are all Atlas entries with their own `kind` and their own relation fields — i.e. the "edges" (relation/connection/carry/trace) are also "nodes." And "edge" as an Atlas *word* means a **boundary/limit** (a located condition), not a link between terms. So the node/edge dichotomy is a useful outside lens but does not match the repository's own idiom, in which relations are named as conditions and directionality is a *read*, not a second edge.

---

## 1. Does the repository explicitly define "node" and "edge"?

**No — neither is defined as a Reality Mechanics concept.**

**"node":** appears only informally.
- As Atlas prose "**the structural node**" in some third-order field terms — a locus where conditions gather/hold/press: `Physical Field Conditions.md:18, :48`; `Emotion.md:18, :44`; `Feeling.md:18, :44`; `Tool.md:19, :43`; `Consent.md:19, :43`. It is descriptive, never defined, and confined to a few field entries.
- As tooling (Node.js) in reports (`C003…:15`, `C004…:71`) — irrelevant to structure.
- As analytic graph metaphor in stewardship: "the same sufficiency test applied at a different point in **the graph**" (`STEWARDSHIP_V1.md:46`), and in the C-C000A report's own framing.

**"edge":** appears, but **means a boundary/limit, not a link.**
- "the active **edge** where carrying becomes felt, formed, adjusted, resisted, retained, released, or resolved" (`Pressure.md:42`).
- "it locates the **edge** through which later carrying can pass, fail, close, or remain outside scope" (`Boundary.md:89`).
- "relation meeting at a boundary, **edge**, surface, or point of touch" (`Contact.md:34`).
- "the structural **edge** that separates compatible from incompatible relation" (`Safety Boundary.md:16`).
- "**Higher-Order Edge:**" section header = the crossing/limit where a third-order term crosses into higher order (`Self.md:75-79`) — again a boundary, not a term-to-term link.

So in the Atlas, "edge" is a *node-like located condition* (a boundary), and the graph-edge sense (a link between two terms) appears only in stewardship metaphor and analytic reports. **Neither "node" nor "edge" is first-class.**

---

## 2. How Atlas terms function structurally

Every Atlas term is a **placed condition/read**, carrying:
- a `kind` (primitive / term / carrier / class / operation) and `ai_role`;
- an `order` (ground, first, second, third, higher, practice);
- a `needs` list (its dependencies — "what must already hold before later terms can become available", `Root Order.md:12, :44`);
- relation fields (`holds`, `carries`, `traces`, `pairs`, `nests`, `reads`, plus `places`).

Terms are units that must be **traceable backward through prior conditions** (`Root Order.md:70`). Even the primitive is a condition, not a thing: "Relation is not an object, substance, cause, or container. It names the relating condition that holds" (`Relation.md:46`). The dependency arrangement over terms is drawn explicitly as a spine (`Root Order.md:93-103`):

```text
Relation
↓
Connection → Carry / Trace
↓
Asymmetry → Bounded Asymmetry → Strained Asymmetry → Resolved Asymmetry
↓
Boundary → Availability → Strain → Bearing → Resolution
```

This is graph-shaped, but the repository names it **dependency / order**, not node/edge.

---

## 3. How the frontmatter relations function structurally

The tooling freezes two distinct groups:
- **Dependency:** `needs` — the dependency edge ("what must already hold"). *Not* in `RELATION_FIELDS`.
- **Relations:** `RELATION_FIELDS = ["holds", "traces", "carries", "pairs", "nests", "reads"]` (`atlas-structure-contract.mjs:23-30`).

Read from the entries:

| Field | Direction | Structural role | Evidence |
|-------|-----------|-----------------|----------|
| `needs` | upward | Dependency: what must already hold | `Carry.md:8-10` (needs Hold, Connection); `Root Order.md:44` |
| `holds` | upward | What holds/supports this term | `Carry.md:14` "held by Hold and Connection" |
| `traces` | backward | Retrace path to supporting conditions | `Carry.md:16-18` traces Hold, Connection |
| `carries` | forward | What this term makes available downstream | `Relation.md:17-33` (Relation carries Connection, Place, …) |
| `pairs` | lateral | Co-condition / contrast at the same level | `Carry.md:15` pairs Trace; often "No lateral pair required" (`Place.md:16`) |
| `nests` | containment | Placement within an order/class | `Operational Condition.md:45` |
| `reads` | recognition | Where the term becomes recognisable | `Carry.md:20` |
| `places` | self | What the term names/places (its definition) | `Carry.md:13` |

Two structural facts stand out:
- **`carries` (forward) and `traces` (backward) are the same connection read two ways**, not two edges: "Carry is the forward availability of held connection; Trace is the backward availability of the **same** connection" (`Carry.md:15`, `Trace.md:15`); "Carry and trace do not make two connections; they are directional availability within **one** connection" (`Connection.md:31`).
- **`needs` (dependency) is held separate from the six relation fields** by the tooling — the repository distinguishes *dependency* from *relation-reads*.

---

## 4. Are relations treated as things, operations, paths, dependencies, or reads?

**Primarily as dependencies and as directional reads of a held connection — and, distinctively, reified as conditions/terms. Not as "things," and not as two separate edges.**

- **Dependencies:** `needs` and the spine name "what must already hold" (`Root Order.md:12, :44`).
- **Reads:** direction is a *read*, not a second relation — Carry/Trace are "directional availability within one connection" (`Connection.md:31`); a participant enacting it (`Carrying`, `Retracing`) "creates" nothing (`Connection.md:34`).
- **Reified as terms:** `Relation` (`kind: primitive`), `Connection` (`kind: term`), `Carry`/`Trace` (`kind: carrier`) are all full Atlas entries. What a graph calls edges are, here, also nodes.
- **Explicitly not things:** "Relation is not an object, substance, cause, or container" (`Relation.md:46`).
- **The "between-terms" relation exists but is called a Ratio:** "Relation made readable **between distinguishable terms** from within a reference frame" (`atlas-structure-contract.mjs:100`; `Ratio` examples "Trace : Carry", "Seed : Ground"). Ratio is the readable form of relation, using `:` as its device — reported here as evidence, not endorsed.

So a "relation" in Reality Mechanics is simultaneously a dependency, a directional read, and (when named) a condition/term — a richer object than a bare graph edge.

---

## 5. Does "edge" exist as a first-class concept, or only as graph/tooling language?

**Neither, exactly.** As a graph link between terms, "edge" is **not** first-class — it appears only as stewardship metaphor (`STEWARDSHIP_V1.md:46` "point in the graph") and analytic report framing. The tooling itself avoids "edge": its canonical layer is the "**relation/order layer**" (`atlas-structure-contract.mjs:33`) and its links are "**relation fields**" (`:23-30`). Meanwhile the Atlas *word* "edge" is first-class only in a **different** meaning — a boundary/limit (§1). There is no first-class graph-edge concept.

---

## 6. Does "node" exist as a first-class concept, or only as graph/tooling language?

**Only informally.** "structural node" is used as prose in a handful of third-order field entries (§1) to mean a locus where conditions hold — but it is never defined, never typed, and not part of the tooling vocabulary (which uses "term"). As a formal category, "node" is **not** first-class; the repository's unit is the **term** (distinguished by `kind`).

---

## 7. What structural distinction, if any, separates a term from a relation?

**The repository does not maintain a term-vs-relation dichotomy. A relation is a kind of term; the linking is done by frontmatter fields.**

- What a graph would split into "nodes" and "edges", the repository splits differently — by **`kind`**: `Relation` is `kind: primitive`; `Connection` is `kind: term`; `Carry`/`Trace` are `kind: carrier`. All are terms; none is a separate "relation type."
- The actual term-to-term links live in **frontmatter fields** (`needs`, `holds`, `carries`, `traces`, `pairs`, `nests`, `reads`) — these are attributes of terms, not terms themselves.
- So the real structure is: **terms (all kinds) = the graph's nodes; frontmatter relation/dependency fields = the graph's edges** — *except* that several edge-concepts (connection, carry, trace, relation) are additionally **reified as terms**, blurring the split.

The nearest thing to a clean "term vs relation" boundary is the tooling's separation of `needs` (dependency) from `RELATION_FIELDS` (readable relations), and the `kind` distinction between `carrier`/`primitive` (relation-like) and `term`/`class`/`operation`. But these are gradations of term, not a term/relation dichotomy.

---

## 8. Can the node/edge distinction help reconcile the C-C000A operation inconsistency?

**It clarifies the inconsistency but cannot resolve it — because the repository's own convention is precisely to reify edges as terms.**

- C-C000A found "operation" split between operation-as-node (term/condition) and operation-as-edge (transformation between states). The node/edge lens **names** that split cleanly.
- But the repository routinely **names transformations as terms**: `Determine` is a `kind: operation` term that names an act (carrying pressure into a hold) — a transformation reified as a term (`Determine.md:18, :35`); `Carry`/`Trace` are terms naming directional availabilities (edge-like) (`Carry.md`, `Trace.md`). So "an operation that is both a placed term and a transformation" is **the repository's normal move**, not a contradiction in its own idiom.
- Therefore the node/edge distinction, imported from graph vocabulary, is **partly foreign**: it presumes a clean split the repository deliberately collapses. It can help a steward *label* the two operation senses, but importing it as a rule would impose an outside ontology.
- The repository does, however, offer a **native reconciling pattern** (presented as available, not applied): **one held connection, read forward as Carry and backward as Trace** (`Connection.md:31`; `Carry.md:15`; `Trace.md:15`). By that pattern, an "operation" could conceivably be one condition read two ways — as a placed act (node) and as the transformation it makes available (edge) — without being two things. Building that is a derivation and is **out of scope here**; it is noted only as the repository's own structural resource, in contrast to the imported node/edge frame.

**Net:** node/edge is *useful as a clarifier*, *foreign as a native category*, and *insufficient alone to reconcile* the operation overload. The repository's own analogue is Connection + directional reads, not node + edge.

---

## 9. Unknowns

1. Whether "structural node" (third-order field prose) is intended as a concept or is incidental description — undetermined.
2. Whether the canonical "edges" are meant to be the frontmatter relation fields, or the reified relation-terms (`Connection`/`Carry`/`Trace`), or both — not stated.
3. Whether `needs` (dependency) and `carries`/`traces` (forward/backward relation) are the same underlying edge read differently or genuinely distinct links — the entries suggest carry/trace are one connection's two directions, but `needs` is held separate by the tooling; the relationship between `needs` and `carries` is not fully specified.
4. Whether the Connection→Carry/Trace "one connection, two reads" pattern is intended to generalise to operations (that is the C-C000A reconciliation question, which is a derivation).
5. Whether "edge" (boundary sense) and any future graph-edge sense would collide in vocabulary — the word is already load-bearing as "boundary/limit."
6. Whether `kind` values (primitive/term/carrier/class/operation) are meant to encode a node/edge-like typing at all, or are orthogonal to it — not stated.

---

## Acceptance — decision this report enables

The Architect and Steward can now decide the status of the node/edge distinction:

- **Present?** Not as native concepts. "node" and graph-"edge" appear only as informal prose, stewardship metaphor, and analytic report framing. The Atlas word "edge" means *boundary*. The repository's native units are **terms** (typed by `kind`) linked by **relation/dependency fields**.
- **Useful?** Yes as an external clarifier — it cleanly labels the C-C000A operation split and matches the graph shape of the dependency spine. It is the vocabulary of the tooling/analysis layer, not the Atlas.
- **Foreign?** Partly. The repository **reifies edges as terms** and treats directionality as a **read of one connection**, not as separate edges. A strict node/edge dichotomy imposes a split the repository deliberately collapses.

On this basis a steward can decide whether to (a) adopt node/edge only as analytic shorthand while keeping term + relation-field as canonical, or (b) treat the mismatch as a signal that the operation reconciliation should use the repository's native Connection/Carry/Trace pattern rather than an imported node/edge frame. This report does not choose (per constraints); it establishes that the distinction is **externally useful but not native**, and that the repository already carries its own directional-read structure to reason with instead.

---

**Scope note:** This contract created only this report (`docs/reports/C-C001B-node-edge-characterisation.md`). No repository files were edited, no governance updated, no theory of nodes/edges invented, "operation" not reconciled, no first operation or calculus decided, and `:` / `Order : Structure : Read` were neither assumed nor promoted. All conclusions are cited; unknowns are stated rather than resolved.
