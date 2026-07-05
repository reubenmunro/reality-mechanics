# C-C000A — Operation Consistency Audit

**Mode:** Read-only investigation. No files edited, no governance updated, no final definition proposed, no calculus decided. Every claim is cited to a repository path (and line where useful). Previous chat is not treated as authority; conclusions rest on repository evidence only.

**Governing question:** Does the repository use the word "operation" consistently?

**Constraint compliance:** This report does not invent a unified definition, does not promote `Order : Structure : Read`, and does not assume `:` is accepted calculus. Where the Constitution uses `:` as an operator (`CONSTITUTION.md:234`), it is reported as that document's own device, not endorsed. No Atlas content is altered.

---

## Verdict up front

**"Operation" is not used consistently.** The repository uses the word in **at least six structural senses**, plus loose prose usage. The six senses do not merely differ in emphasis — they split across **two incompatible ontological categories**:

- **Operation-as-node** (a *term / condition* in the dependency graph) — the Atlas senses: Operational Condition, `kind: operation`, Operation Carrier, and Theory's "placed operation."
- **Operation-as-edge** (a *transformation between states*) — the Calculus/Constitution sense: "concerned with what occurs **between states**, not merely the names of states" (`CONSTITUTION.md:184`); "the `:` marks an operation" (`CONSTITUTION.md:234, :143`-clause C010).

These two categories share only the word. In addition there is one internal Atlas contradiction (Theory says *every* term is an operation, while `kind: operation` is reserved for two terms) and one genuine, *deliberate* internal distinction the Atlas does maintain consistently (act-at-a-point vs read-across-system). The material is rich enough to derive **from**, but a single concept of "operation" cannot currently be assumed — it must be **resolved before derivation treats "operation" as one thing.**

---

## 1. All distinct meanings of "operation" currently present

| # | Sense | One-line meaning | Category |
|---|-------|------------------|----------|
| **M1** | Operational condition | A first-order **condition that acts on located distinction** (locating, making available, straining, bearing, resolving) | node (term/condition) |
| **M2** | `kind: operation` term-type | A **term whose frontmatter kind is "operation"** — names an act | node (term) |
| **M3** | Operation carrier | A **reading operation that runs across the whole system**, making any condition readable | node (carrier class) |
| **M4** | Theory "placed operation" | **Every valid Atlas term**, viewed as a placed act answerable to retrace | node (all terms) |
| **M5** | `ai_role: operation` | A **bounded, governed instrument that runs** (practice/AI) | role (runnable procedure) |
| **M6** | Calculus / Constitution operator | A **derived transformation between states/terms**, marked by `:` where used | edge (transformation) |
| **M7** | Loose / schema / prose | A record field ("what operation produced continuation") or ordinary-language "operation" | non-structural |

---

## 2. Which files and terms use each meaning

**M1 — Operational condition (node; act on located distinction)**
- `1_First/Boundary Conditions/Operational Condition.md:25` (`kind: class`): "operations act on distinction — locating it, making it available, straining it, bearing it, and resolving it."
- Members (`Operational Condition.md:45-52`), all `kind: term`: **Boundary, Availability, Strain, Threshold, Bearing, Resolution**.
- Contrast anchor: `Emergent Condition.md:27` — emergent conditions are "prior to operation."
- `1_First/Boundary.md:61`: "boundary names the locating act itself — the operation."

**M2 — `kind: operation` term-type (node; a term that is an act)**
- `1_First/Carrier Mechanics/Place.md:5` (`kind: operation`, also `ai_role: carrier`): "the first-order operation by which something becomes enterable, readable, checkable, correctable, or carryable" (`:30`).
- `4_Practice/Determine.md:4` (`kind: operation`, `ai_role: practice`): "the Ark Run operation that carries pressure into a temporary bounded hold" (`:35`).

**M3 — Operation carrier (node; cross-system reading operation)**
- `1_First/Carrier Mechanics/Operation Carrier.md:25` (`kind: class`): "operation carriers run through the whole system — making distinction apparent, followable, held, and recognisable at any point."
- Members (`Operation Carrier.md:45-50`): **Apparent, Trace, Read, Orientation** (`Trace`, `Read` are `kind: carrier`).

**M4 — Theory "placed operation" (node; every term)**
- `Theory.md:90-92`: "Terms As Operations … An Atlas term is not free meaning. It is a placed operation."
- `Theory.md:227-231`: "An Atlas operation is provisionally valid where `AtlasValid(x) if Rel(x) and Ord(x) and Tr(x)`."
- `Theory.md:308`, `Atlas.md:48`, `Atlas Practice.md:112`: "whether a term remains a valid Atlas operation."

**M5 — `ai_role: operation` (role; runnable governed instrument)**
- `4_Practice/Atlas Oracle.md:5` (`ai_role: operation`): "For an AI participant, it is an operation" (`:96`); "human-facing instrument and AI-facing bounded operation" (`:31, :92`).
- `4_Practice/Oracle Carrying Conditions.md:5` (`ai_role: operation`): "governance is … a condition of operation" (`:28`); "Governance is not placed outside the operation. It is carried inside the operation" (`:43`).

**M6 — Calculus / Constitution operator (edge; transformation between states)**
- `docs/CONSTITUTION.md:144`: "The Calculus derives operations. It does not invent them by preference."
- `CONSTITUTION.md:182-184` (C004): "The Calculus derives and justifies operations and transformations. It is concerned with **what occurs between states, not merely the names of states**."
- `CONSTITUTION.md:232-242` (C010 — Operations Are Accountable): "Where `:` is used as an operator, the operation must remain accountable to derivation … The transformation between terms must become retraceable."
- `CONSTITUTION.md:42`: "Every accepted transformation should either preserve the order it carries into its next readable form, or explicitly identify where that preservation remains unresolved."
- `CONSTITUTION.md:170` (C002): retraceability "applies equally to … derivations, operations, decisions, and amendments."

**M7 — Loose / schema / prose (non-structural)**
- Trace-schema field: `4_Practice/Generate and Regenerate.md:160, :194`, `Generative Trace.md:79` — `operation` = "what rule/movement produced continuation."
- Ordinary prose: `Member.md:74` "a recurring operation"; `Applied Diagnosis/Diagnosis.md:18, :47` "a distinct operation on a path read"; `Communion.md:37` / `Clean.md:32` "the visible operation"; `Seed.md:16` "before the first order operates"; `Not.md:15` "Not operates on"; `Theory.md:153` "a mode in which carrying operates"; `Scale.md:40` "operational order."

---

## 3. Where meanings overlap

- **`Place` occupies M2 + M4 + carrier-family at once.** It is `kind: operation` (M2), it is a term and therefore a "placed operation" under M4, and it is `ai_role: carrier` — adjacent to M3. One term carries three of the operation senses simultaneously (`Place.md:5, :16, :30`).
- **M4 subsumes M1, M2, M3.** If "every Atlas term is a placed operation" (`Theory.md:92`), then operational conditions, `kind: operation` terms, and operation carriers are all special cases of M4. M4 is the widest sense and the others sit inside it.
- **M1 and M3 are two named species that overlap in the word "operation" but are explicitly separated in function** (see §4 — this is the one deliberate, consistent distinction).
- **M3 overlaps `kind: carrier`.** Operation Carrier (`kind: class`) nests `Trace` and `Read`, which are themselves `kind: carrier` — so "operation carrier" spans the operation and carrier vocabularies.
- **M6 references M1's members by consequence.** The Calculus "derives operations" (`CONSTITUTION.md:144`); the operations it would derive are presumably the acts the Atlas already names (M1/M2) — but the Constitution frames them as transformations (edges), not as the terms the Atlas records (nodes). The overlap is nominal, not structural.

---

## 4. Where meanings contradict

1. **Scope contradiction (M4 vs M2).** Theory: *every* valid Atlas term "is a placed operation" (`Theory.md:92`). Frontmatter: `kind: operation` is reserved for exactly two terms, `Place` and `Determine`. If all terms are operations, a `kind: operation` label cannot be doing distinguishing work; if `kind: operation` distinguishes, then not all terms are operations. Both are asserted. **Direct contradiction of scope.**

2. **Category contradiction (Atlas node senses vs Calculus edge sense — M1/M2/M3/M4 vs M6).** The Atlas treats operations as **terms/conditions** — Operational Condition members are `kind: term`; `kind: operation` terms are graph nodes; operation carriers are a class of terms. The Constitution treats operations as **transformations between states** — "concerned with what occurs between states, **not merely the names of states**" (`CONSTITUTION.md:184`), and as what `:` marks *between terms* (`CONSTITUTION.md:234, C010`). A node (a named condition) and an edge (a transformation between named conditions) are different kinds of thing. Same word, two ontological categories. **This is the deepest inconsistency.**

3. **Typing conflation (operation vs carrier).** `Place` is simultaneously `kind: operation` and `ai_role: carrier` (`Place.md:5-6`); Operation Carrier nests `kind: carrier` terms. The repository's own type fields do not keep "operation" and "carrier" disjoint. Whether this is intended layering (kind vs ai_role) or drift is not stated.

**One thing that is NOT a contradiction:** M1 vs M3 is a *deliberate, consistently maintained* distinction. Operation Carrier explicitly reads "where a term names something that makes any condition readable **rather than acting on distinction at one point in the sequence**" (`Operation Carrier.md:54`), and Operational Condition is "conditions that **act on located distinction**" (`Operational Condition.md:25`). The Atlas cleanly separates *act-at-a-point* operations from *read-across-system* operations. This is the one place "operation" is disambiguated on purpose.

---

## 5. Can `Place`, `Determine`, `Boundary`, `Operational Condition`, `Operation Carrier` be read as one structure?

**On current evidence they cannot be collapsed into one structure. They are one loose family, not one structure.** Their differences are recorded, not incidental:

| Term | `kind` | Order | Ground (`needs`/holds) | Operation-function |
|------|--------|-------|------------------------|--------------------|
| Boundary | term | first | Bounded Asymmetry (via class) | locating act (M1) |
| Operational Condition | class | first | `[[Bounded Asymmetry]]` (`:13`) | the *class* of act-on-distinction operations (M1) |
| Place | operation | first | `[[Relation]]` (`Place.md:11`) | locatable-entry act (M2), also `ai_role: carrier` |
| Determine | operation | practice | `[[Pressure]], [[Check]], [[Boundary]], [[Clearance]], [[Hold]]` (`Determine.md:8-13`) | carry-pressure-into-hold act (M2) |
| Operation Carrier | class | first | `[[Primitive Carrier]]` (`Operation Carrier.md:8`) | read-across-system operation (M3) |

Observations from the table:
- **Boundary is inside Operational Condition** (`Operational Condition.md:45`). That pair *is* one structure (member and class).
- **Place and Determine (both `kind: operation`) are outside the Operational Condition class**, sit at different orders (first vs practice), and rest on different grounds (Relation vs Pressure). They share a *label* but not a placement.
- **Operation Carrier is explicitly contrasted with Operational Condition** (`Operation Carrier.md:54`) — the Atlas itself says these are different (act-at-a-point vs read-across-system).

So the repository already tells us they are **distinct placements that share a name**. They *might* be unifiable under a future derived definition of "operation," but the repository does not currently express them as one structure, and (per constraints) this report does not construct that unification. **Verdict: must remain distinct until a derivation reconciles them.**

---

## 6. Is "operation" currently used as a kind, class, role, act, condition, carrier, transformation, or product?

The repository uses "operation" as **all of these except product** — which is itself strong evidence of inconsistency:

| Usage | Present? | Evidence |
|-------|----------|----------|
| **kind** | Yes | `kind: operation` — `Place.md:5`, `Determine.md:4` |
| **class** | Yes | `Operational Condition` / `Operation Carrier` are `kind: class` naming classes *of* operations (`Operational Condition.md:25`, `Operation Carrier.md:25`) |
| **role** | Yes | `ai_role: operation` — `Atlas Oracle.md:5`, `Oracle Carrying Conditions.md:5` |
| **act** | Yes | "the locating act itself — the operation" (`Boundary.md:61`); "act on distinction" (`Operational Condition.md:25`) |
| **condition** | Yes | operations *are* "operational conditions" (`Operational Condition.md:25`) |
| **carrier** | Yes (overlapping) | `Operation Carrier`; `Place` is `ai_role: carrier` (`Place.md:6`) |
| **transformation** | Yes | "operations and transformations" (`CONSTITUTION.md:182`); "the transformation between terms" (`CONSTITUTION.md:238`) |
| **product** | **No** | operation is explicitly *contrasted with* its product: "Determine names the operation; Determination names the temporary hold **produced by** the operation" (`Determine.md:18`) |

That a single word is simultaneously a kind, a class, a role, an act, a condition, a carrier, and a transformation — while being deliberately *not* a product — confirms the term is overloaded rather than coherent.

---

## 7. Unknowns

1. **Node or edge?** Whether the Atlas "operation" (term/condition) and the Calculus "operation" (transformation between states, `CONSTITUTION.md:184`) are meant to be the *same* concept, two *layers* of one concept, or two *different* concepts sharing a word — undetermined by the repository.
2. **Fate of `kind: operation`.** Whether `kind: operation` should persist given Theory's "every term is a placed operation" (M4 vs M2), or whether it marks a narrower distinction the repository has not stated — undetermined.
3. **One genus or two?** Whether M1 (act-at-a-point) and M3 (read-across-system) are two species of one genus "operation" or two genera that happen to share the word — the Atlas distinguishes them but does not say whether they unify.
4. **`kind` vs `ai_role`.** Whether `ai_role: operation` (M5) is a distinct concept from `kind: operation` (M2) or the same concept viewed from the AI-participation surface — not stated.
5. **First vs practice operation.** Whether `Place` (first-order) and `Determine` (practice-order), both `kind: operation`, instantiate one operation structure across orders or are separately-coined uses — not stated.
6. **Boundary act vs product.** Whether Boundary names the operation, the located distinction it produces, or both (carried over from C-C000 §5 / C-C001) — unresolved; bears directly on the node/edge question.
7. **Calculus status.** The `:`-operator sense (M6) is *governed* (C010) but the Calculus itself is under derivation; whether M6 is an accepted sense or a placeholder for a future derived one is not settled in-repository (C004A: nothing promoted before derivation reviewed).

---

## Acceptance — decision this report enables

The Architect and Steward can now decide between two positions, both supported by the evidence:

- **"Operation" is not yet coherent enough to derive from as a single concept.** Six structural senses span two ontological categories (node vs edge), with a direct scope contradiction (M4 vs M2) and a cross-body category mismatch (Atlas term vs Calculus transformation). A derivation that treats "operation" as one thing would inherit these conflicts. On this reading, the repository **must first resolve the node/edge question and the all-terms-vs-kind scope** before "operation" can be derived cleanly.

- **The pieces needed for a derivation already exist, and are individually coherent.** Each sense is internally well-defined and cited; the Atlas even maintains one deliberate distinction (act-at-a-point vs read-across-system); and the Constitution already supplies the governing frame (C004 "what occurs between states," C010 accountability). On this reading, "operation" is **derivable, provided the derivation explicitly chooses and reconciles the senses** rather than assuming they are already one.

This report does not choose between these positions and does not construct the reconciling definition (per constraints). It establishes that **the choice is real and necessary**: the repository currently carries "operation" as an overloaded word, not a single structure.

---

**Scope note:** This contract created only this report (`docs/reports/C-C000A-operation-consistency-audit.md`). No repository files were edited, no governance updated, no unified definition invented, no first operation decided, and `:` / `Order : Structure : Read` were neither assumed nor promoted. All conclusions are cited; unknowns are stated rather than resolved.
