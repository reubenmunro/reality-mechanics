# C-C000 — Operation Characterisation

**Mode:** Read-only investigation. No files edited, no governance updated, no primitives proposed, no calculus decided. Every claim is cited to a repository path (and line where useful). Previous chat is not treated as authority; conclusions rest on repository evidence only.

**Governing question:** What qualifies something as an operation in Reality Mechanics?

**Constraint compliance:** This report does not treat `:` as accepted calculus, does not promote `Order : Structure : Read`, and does not decide the first operation. It characterises only what the repository already says about "operation."

---

## Key finding up front

The repository contains **substantial, but distributed and partially inconsistent, material on "operation."** There is no single definitional entry titled "Operation." Instead, "operation" is specified across at least **five distinct mechanisms**, which do not fully agree on scope:

1. A **`kind: operation`** frontmatter value, used by two terms: `Place` (`first.place`) and `Determine` (`practice.determine`).
2. An **`ai_role: operation`** value, used by two practice instruments: `Atlas Oracle`, `Oracle Carrying Conditions`.
3. The **`Operational Condition`** class — "first-order conditions that act on located distinction" (Boundary, Availability, Strain, Threshold, Bearing, Resolution).
4. The **`Operation Carrier`** class — carriers that "make any condition readable" across the system (Apparent, Trace, Read, Orientation).
5. A **Theory-level definition** — "An Atlas term … is a placed operation," with a validity test (`relation holds, order carries, trace places`).

Whether these five converge on one definition is **not settled by the repository** (see §4, §6). This directly answers the acceptance question: the repository contains rich operation *material* but not a single reconciled *definition*.

> **Evidence correction:** A parenthetical in `docs/reports/C-C001-first-operation-characterisation.md` stated "No `kind: operation` exists in the Atlas." That is contradicted by repository evidence: `Reality_Mechanics/1_First/Carrier Mechanics/Place.md:5` and `Reality_Mechanics/4_Practice/Determine.md:4` both carry `kind: operation`. This report supersedes that specific claim on evidence. (No file edited; flagged for the Architect/Steward.)

---

## 1. All explicit uses of operation / operational

**Frontmatter typing**
- `kind: operation`: `Place.md:5` (`first.place`); `Determine.md:4` (`practice.determine`).
- `ai_role: operation`: `Atlas Oracle.md:5`; `Oracle Carrying Conditions.md:5`.

**Class definitions**
- `Operational Condition.md:25`: "operations act on distinction — locating it, making it available, straining it, bearing it, and resolving it. Boundary, availability, strain, bearing, resolution, and threshold are all operational conditions." (`kind: class`, `needs: [[Bounded Asymmetry]]`).
- `Emergent Condition.md:27`: "Where operations act on distinction, emergent conditions name what becomes available prior to those acts — the conditions that make operations possible." (defines operations by contrast).
- `Operation Carrier.md:25`: "operation carriers run through the whole system — making distinction apparent, followable, held, and recognisable at any point. Apparent, trace, read, and orientation are operation carriers." (`kind: class`).

**Term-level statements**
- `Boundary.md:61`: "boundary names the locating act itself — the operation through which that distinction becomes a local condition."
- `Place.md:30`: "the first-order operation by which something becomes enterable, readable, checkable, correctable, or carryable within relation."
- `Determine.md:18, :35`: "Determine names the operation; Determination names the temporary hold produced by the operation" / "the Ark Run operation that carries pressure into a temporary bounded hold."
- `Place Field/Placed Participation.md:34`: "[[Place]] names the operation by which something becomes locatable … Placed Participation names a downstream field read" — explicitly separating a **root operation** from a **downstream read**.
- `Primitive Carrier.md:42`: "The carrying role flows into its operational form."

**Theory / postulate level**
- `Theory.md:90-92`: heading "Terms As Operations" — "An Atlas term is not free meaning. It is a placed operation."
- `Theory.md:227-231`: "An Atlas operation is provisionally valid where: `AtlasValid(x) if Rel(x) and Ord(x) and Tr(x)`" (relation holds; order carries; trace places).
- `Theory.md:153`: "An order names a mode in which carrying operates."
- `Atlas.md:48`: "The working postulate — relation holds, order carries, trace places — bounds what counts as a valid Atlas operation."

**Practice / methodological sense (distinct)**
- `docs/stewardship/STEWARDSHIP_V1.md:46`: "a single recursive operation" (the stewardship *calculus* sense — an audit step, not an Atlas condition).
- `docs/stewardship/archive/Inheritance Order.md:73`: "Four operations, three of them strictly sequential" (stewardship-method sense).
- `Reality_Mechanics/4_Practice/Generate and Regenerate.md:160`, `Generative Trace.md:79`: `operation` as a field in a trace-classification schema ("what operation produced continuation").

---

## 2. Terms currently treated as operational conditions

**Explicitly nested under `Operational Condition`** (`Operational Condition.md:45-52`):

| Term | Path | `kind` |
|------|------|--------|
| Boundary | `1_First/Boundary.md` | term |
| Availability | `1_First/Availability.md` | term |
| Strain | `1_First/Strain.md` | term |
| Threshold | `1_First/…/Threshold` (nested) | term |
| Bearing | `1_First/Bearing.md` | term |
| Resolution | `1_First/Resolution.md` | term |

**Typed `kind: operation`** (a different mechanism than the Operational Condition class):

| Term | Path | Order | Note |
|------|------|-------|------|
| Place | `1_First/Carrier Mechanics/Place.md` | first | `kind: operation` **and** `ai_role: carrier` (dual typing) |
| Determine | `4_Practice/Determine.md` | practice | `kind: operation`, `ai_role: practice` |

**Nested under `Operation Carrier`** (reading operations across the system; `Operation Carrier.md:45-50`): Apparent, Trace, Read, Orientation. (`Trace`, `Read` are themselves `kind: carrier`.)

**Typed `ai_role: operation`** (practice/AI instruments): `Atlas Oracle`, `Oracle Carrying Conditions`.

Note the membership does **not** form one clean set: the Operational Condition members are all `kind: term`; the `kind: operation` terms (Place, Determine) are **not** in the Operational Condition list; and the Operation Carrier members overlap with `kind: carrier`.

---

## 3. Are operations defined as acts, conditions, transformations, reads, or products?

Repository evidence points to **"acts on/within located relation," explicitly distinguished from the conditions or products they yield** — not "transformations":

- **Act on located distinction** is the dominant definition: "operations act on distinction — locating it, making it available, straining it, bearing it, and resolving it" (`Operational Condition.md:25`); "boundary names the locating act itself — the operation" (`Boundary.md:61`).
- **Placed/locatable act**: "the first-order operation by which something becomes enterable, readable, checkable, correctable, or carryable" (`Place.md:30`); "a placed operation" (`Theory.md:92`).
- **Explicitly distinguished from the product**: "Determine names the operation; Determination names the temporary hold **produced by** the operation" (`Determine.md:18`). This is the clearest operation-vs-product statement in the repository.
- **Reading operations are a named sub-type**: operation carriers "make any condition readable rather than acting on distinction at one point" (`Operation Carrier.md:54`) — i.e., some operations act at a point (operational conditions), others read across the system (operation carriers).
- **Validity, not substance, is the Theory definition**: an operation is "provisionally valid where `relation holds, order carries, trace places`" (`Theory.md:227-231`) — a test of whether a read qualifies as an Atlas operation, not a statement of what an operation *is*.
- **Not "transformation":** no entry defines an operation as a transformation. "becomes" language throughout describes *conditions becoming readable* (e.g. `Boundary.md:61` "becomes a local condition"), not an operation defined as a state change.

**Summary relation:** operation : product — **act : produced-condition** (Determine : Determination; locating act : located distinction). operation : validity — **substance : test** (the Theory postulate tests validity but does not name substance).

---

## 4. What distinguishes an operation from a term, relation, condition, carrier, or read

Assembled strictly from repository statements:

| Category | Repository distinction from "operation" |
|----------|------------------------------------------|
| **Relation** | Primitive; operations presuppose it. "Relation must remain available for any operation to become locatable within it" (`Place.md:15`). Relation is `kind: primitive`, never `kind: operation`. |
| **Emergent condition** | "prior to operation … the conditions that make operations possible" (`Emergent Condition.md:27`). Explicitly *not* an operation. |
| **Operational condition** | Acts "on located distinction at one point in the sequence" (`Operation Carrier.md:54`, `Operational Condition.md:25`). |
| **Operation carrier** | "makes any condition readable rather than acting on distinction at one point" (`Operation Carrier.md:54`) — a cross-system reading operation (Apparent, Trace, Read, Orientation). |
| **Carrier** | `kind: carrier` (Carry, Trace, Read). Overlaps with operation: `Place` is `kind: operation` + `ai_role: carrier`; operation carriers include `kind: carrier` terms. The boundary is **not clean**. |
| **Read** | A recognition; some reads are operation carriers ("Read" is nested under Operation Carrier). A downstream *field read* is explicitly *not* the root operation: "without replacing Place as the root operation" (`Placed Participation.md:64`). |
| **Product / held condition** | The result of an operation, named separately: Determination (from Determine), located distinction (from Boundary's locating act), a temporary hold. "produced by the operation" (`Determine.md:18`). |
| **Term (general)** | **Tension:** Theory says *every* valid Atlas term "is a placed operation" (`Theory.md:92`), which would make "operation" coextensive with "term." Yet `kind: operation` is reserved for two specific terms. The repository holds both scopings simultaneously (see §6). |

The clearest *positive* distinguishing marks the repository gives an operation: it **acts on or makes readable** (rather than merely arising or being held), it is **placeable/locatable** and **trace-answerable**, and it is **separable from the product it yields**.

---

## 5. Is `Boundary` itself an operation, or the read/product of an operation?

The repository states **both**, within the same entry, without reconciling them:

- **As operation:** "boundary names the locating act itself — **the operation** through which that distinction becomes a local condition" (`Boundary.md:61`); and Boundary is the first term nested under `Operational Condition` (`Operational Condition.md:45`). By these, Boundary **is** an operation (the locating act).
- **As located product/condition:** Boundary's own `places` and title name the **result** — "located distinction within relation" (`Boundary.md:12, :59`): "Boundary names the located distinction through which relation becomes locally distinguishable." By this, Boundary names the **located distinction** (the product of locating), not only the act.

So `Boundary` currently names **both the locating operation and the located distinction it produces** in one term. The repository does not separate these into distinct entries the way `Determine` (operation) / `Determination` (product) are separated (`Determine.md:18`). Which reading is canonical for Boundary is **unresolved by the evidence**. (Per contract scope, this report characterises the ambiguity and does not decide the first operation.)

---

## 6. Unknowns

1. **Scope conflict on "operation."** Theory: every valid term "is a placed operation" (`Theory.md:92`) — operation ≈ term. Frontmatter: `kind: operation` is reserved for `Place` and `Determine` only. These two scopings are not reconciled anywhere in the repository.
2. **No single canonical definition.** "Operation" is defined by contrast (Emergent Condition), by class (Operational Condition, Operation Carrier), by validity test (Theory), and by two term-level `kind` uses — with no entry that states the definition of "operation" as such.
3. **Operation ↔ carrier overlap.** `Place` is simultaneously `kind: operation` and `ai_role: carrier`; Operation Carrier nests `kind: carrier` terms (Trace, Read). The distinction between "operation" and "carrier" is not cleanly typed.
4. **Operation ↔ product conflation in some terms.** `Determine`/`Determination` separate operation from product; `Boundary` (and arguably others) do not (§5). Whether operations should always be named separately from their products is not stated.
5. **Cross-order senses.** `kind: operation` spans first order (`Place`) and practice (`Determine`); `ai_role: operation` covers practice AI instruments (`Atlas Oracle`, `Oracle Carrying Conditions`). Whether "operation" is one concept across orders or several same-named concepts is undetermined.
6. **Relation to the stewardship "operation" sense.** Stewardship uses "operation" for audit-calculus steps (`STEWARDSHIP_V1.md:46`) — a methodological sense that may or may not be the same concept as an Atlas operation. Not reconciled.
7. **Emergent/operational cut at Distinction.** Operations "act on *located* distinction," but the entry that first *locates* (Boundary) also names the located distinction; whether "distinguishing" (Distinction) is itself a pre-operation or an operation is not stated (also flagged in C-C001 §6).

---

## Acceptance — decision this report enables

The Architect and Steward can now decide:

- **The repository already contains a usable, if distributed, characterisation of an operation:** something that **acts on located distinction or makes conditions readable**, is **placeable and trace-answerable** (`relation holds, order carries, trace places`), and is **separable from the product it yields** (Determine : Determination). If that composite is accepted as the working definition, "operation" is **substantially derived** and needs only reconciliation, not new derivation.
- **However, "operation" is not yet reconciled into a single definition:** the Theory "every term is a placed operation" scope conflicts with the reserved `kind: operation` scope; operation/carrier and operation/product boundaries are fuzzy; and the first-order vs practice vs AI senses are not unified. On these points "operation" **remains underived** as a single concept.

In short: **operation is well-attested but not singly defined.** Whether that is "sufficient" is a definitional judgement for the Architect/Steward — the repository supplies the parts (acts-on-distinction, placeability, operation-vs-product, operation-carrier reading) but not a single reconciling statement, and this report does not supply one (per scope).

---

**Scope note:** This contract created only this report (`docs/reports/C-C000-operation-characterisation.md`). No repository files were edited, no primitives proposed, no calculus decided, and `:` / `Order : Structure : Read` were neither assumed nor promoted. All conclusions are cited; unknowns are stated rather than resolved by assumption. One prior-report factual correction is flagged (see Key finding).
