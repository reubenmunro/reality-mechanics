# C-C001 — First Operation Characterisation

**Mode:** Read-only investigation. No files edited, no governance updated, no primitives proposed, no calculus decided. Every claim is cited to a repository path (and line where useful). Previous chat is not treated as authority.

**Governing question:** What is the first retraceable operation in Reality Mechanics?

**Constraint compliance:** This report does not promote `Order : Structure : Read`, does not treat `:` as accepted calculus, and does not create terminology. Where the Atlas uses `:` (e.g. Ratio, Seed : Ground), it is reported as that term's own device, not endorsed as calculus.

> **Correction from C-C000:**
> This report originally stated that no `kind: operation` exists in the Atlas. C-C000 later found that `Place` and `Determine` both use `kind: operation`. That earlier statement is therefore incorrect. The broader C-C001 finding still stands only as evidence that "operation" is not consistently represented by a single Atlas category.

---

## Key finding up front

The Atlas contains an **explicit, grounded distinction between "emergent conditions" and "operations,"** which directly addresses the governing question:

- **Emergent conditions** "arise from within relation through asymmetry rather than being … established by operations … the conditions that make operations possible, arising … prior to operation" — Asymmetry, Bounded Asymmetry, Strained Asymmetry, Resolved Asymmetry (`Reality_Mechanics/1_First/Asymmetry Conditions/Emergent Condition.md:25-27, :48`).
- **Operational conditions** are "the class of first-order conditions that act on located distinction — locating, making available, straining, bearing, and resolving." Named members: **Boundary, Availability, Strain, Threshold, Bearing, Resolution** (`Reality_Mechanics/1_First/Boundary Conditions/Operational Condition.md:12, :25, :45-52`).
- **Boundary** is the first-listed operational condition and is explicitly called an operation in its own entry: "the locating act itself — **the operation** through which that distinction becomes a local condition" (`Reality_Mechanics/1_First/Boundary.md:61`).

On the Atlas's own classification, therefore, the **earliest term the repository explicitly names as an operation is Boundary** (the locating act), with everything upstream of it classed as emergent (prior to operation) or as primitive/ground. This report presents that evidence and the alternatives it must be weighed against; it does **not** declare the question settled (see §5–§6).

---

## 1. Candidate first operations found in the repository

| Candidate | Path | `kind` | `needs` |
|-----------|------|--------|---------|
| Ground | `0_Ground/Ground.md` | term (order: ground) | `[]` |
| Seed | `0_Ground/Seed.md` | term (order: ground) | `[]` |
| Relation | `1_First/Relation.md` | **primitive** | `[]` |
| Asymmetry | `1_First/Asymmetry.md` | term | `[[Relation]]` |
| Bounded Asymmetry | `1_First/Asymmetry Conditions/Bounded Asymmetry.md` | term | `[[Asymmetry]]` |
| Distinction | `1_First/Asymmetry Conditions/Distinction.md` | term | `[[Bounded Asymmetry]]` |
| Boundary | `1_First/Boundary.md` | term | `[[Distinction]]` |
| Availability | `1_First/Availability.md` | term | `[[Boundary]]` |
| Strain | `1_First/Strain.md` | term | `[[Availability]]` |
| Bearing | `1_First/Bearing.md` | term | `[[Strain]]` |
| Resolution | `1_First/Resolution.md` | term | `[[Bearing]], [[Clearance]]` |
| Connection | `1_First/Connection.md` | term | `[[Relation]]` |
| Carry | `1_First/Carrier Mechanics/Carry.md` | **carrier** | `[[Hold]], [[Connection]]` |
| Trace | `1_First/Carrier Mechanics/Trace.md` | **carrier** | `[[Hold]], [[Connection]]` |
| Read | `1_First/Carrier Mechanics/Read.md` | **carrier** | `[[Trace]]` |
| Ratio | `1_First/Ratio.md` | term | `[[One]], [[Other]], [[Clearance]]` |
| Structure | `2_Second/Produced Distinctions/Structure.md` | term (order: second) | `[[Form]], [[Carrying]], [[Relation]]` |
| Emergent Condition | `1_First/Asymmetry Conditions/Emergent Condition.md` | **class** | `[[Asymmetry]]` |
| Operational Condition | `1_First/Boundary Conditions/Operational Condition.md` | **class** | `[[Bounded Asymmetry]]` |

"Order" is not a single Atlas term: it appears as **Root Order**, **Dependency Order**, **Natural Order** (all `order: ground`), which name arrangement, not an act on distinction (`0_Ground/Root Order.md`, `0_Ground/Dependency Order.md`).

**No `kind: operation` exists in the Atlas.** The Atlas `kind` values observed are `primitive`, `term`, `carrier`, `class`. "Operation" appears as (a) the Operational Condition *class*, and (b) prose (notably Boundary). This is itself relevant to whether "operation" as the Calculus intends it is an Atlas category (see §6).

---

## 2. Relevant Atlas terms and passages

**Ground (acknowledged prior, outside the spine)**
- "what Reality Mechanics acknowledges but does not derive … the source-limit" (`Ground.md:30`).
- "[[Relation]] is the primitive where the dependency spine begins. Ground names what holds prior to that beginning without being traced to." (`Ground.md:32`). `needs: []` (`Ground.md:8`).

**Relation (primitive)**
- `kind: primitive`, `needs: []` (`Relation.md:4, :8`).
- "the primitive condition through which generation can occur and from which tracing begins." (`Relation.md:11`); "relation relates, and no prior term inside the system produces it." (`:42`).

**Asymmetry → Bounded Asymmetry → Distinction (emergent side)**
- Asymmetry: "the first readable unevenness within Relation — what makes distinction possible before locality or order can be read"; `needs: [[Relation]]` (`Asymmetry.md:12, :8`).
- Bounded Asymmetry: "the hinge where uneven relation becomes local enough to be distinguished — asymmetry held locally enough that a boundary can form"; `needs: [[Asymmetry]]` (`Bounded Asymmetry.md:12, :8`).
- Distinction: "bounded unevenness becoming distinguishable within relation **before it is located as boundary** or read as difference"; `needs: [[Bounded Asymmetry]]` (`Distinction.md:12, :8`); "Distinction is not division." (`:56`).

**Boundary (first operational condition)**
- "the locating act itself — the operation through which that distinction becomes a local condition." (`Boundary.md:61`); `needs: [[Distinction]]` (`:8`).

**Operational vs Emergent classes**
- Operational Condition (`kind: class`, `needs: [[Bounded Asymmetry]]`): "operations act on distinction — locating it, making it available, straining it, bearing it, and resolving it. Boundary, availability, strain, bearing, resolution, and threshold are all operational conditions." (`Operational Condition.md:25`, list `:45-52`).
- Emergent Condition (`kind: class`, `needs: [[Asymmetry]]`): "Where operations act on distinction, emergent conditions name what becomes available prior to those acts — the conditions that make operations possible." (`Emergent Condition.md:27`).

**Carrier operations (parallel lineage)**
- Connection: "relation holding between distinguishable conditions … offers [[Carry]] and [[Trace]]" (`Connection.md:29-31`); `needs: [[Relation]]`.
- Carry: "the forward availability of held connection … Carry is not yet [[Carrying]]." (`Carry.md:30-32`).
- Trace: "the backward availability of held connection … Trace is not yet [[Retracing]]." (`Trace.md:51-53`).
- Read: "recognition of meaningful distinction … [[Trace]] makes a distinction followable; read takes that distinction up as meaningful" (`Read.md:37`); `needs: [[Trace]]`.

**Reading / generative order (not the dependency spine)**
- Root Order states the reading/generation distinction and that neither `One : Other` nor `Ratio` replaces Relation as primitive (`Root Order.md:105-114`).
- Ratio: "relation made readable between distinguishable terms … Ratio does not generate [[Relation]]." (`Ratio.md:35-39`).
- Seed: "Generation begins when Seed : Ground becomes active relation." (`Seed.md:29`).

---

## 3. Is each candidate a term, relation, operation, read, or unresolved?

Classified strictly from repository evidence (`kind` field + the Emergent/Operational classes):

| Candidate | Repository classification |
|-----------|---------------------------|
| Ground | Ground-level acknowledged prior; `kind: term`; **outside the dependency spine** (`Ground.md:32`). Not an operation. |
| Seed | Ground-level generative condition; `kind: term`; outside the spine (`Seed.md:33`). "Generation begins when Seed : Ground becomes active" — a generative *becoming*, not classed as an operation. |
| Relation | **Primitive** (`kind: primitive`). Named "active relation"; the Atlas frames it as the primitive condition, **not** as an operation. |
| Asymmetry | **Emergent condition** (`Emergent Condition.md:27`); "prior to operation." Term. |
| Bounded Asymmetry | **Emergent condition**; "hinge … that a boundary can form." Term. |
| Distinction | Term; distinguishability **before it is located** (`Distinction.md:12`) — sits on the emergent side of the operation boundary (pre-location). |
| Boundary | **Operation** — the Atlas's first-listed operational condition and explicitly "the operation" (`Boundary.md:61`; `Operational Condition.md:45`). |
| Availability, Strain, Bearing, Resolution | **Operations** (operational conditions) — later in the chain (`Operational Condition.md:45-52`). |
| Connection | Term; "relation holding between distinguishable conditions" — a held passage, not itself an act (`Connection.md:29`). |
| Carry, Trace | **Carriers** (`kind: carrier`); *availability* of connection (forward/backward), "not yet" the enacted carrying/retracing (`Carry.md:32`, `Trace.md:53`). |
| Read | **Carrier / read** (`kind: carrier`); "recognition of meaningful distinction" (`Read.md:37`). A recognition operation, downstream of Trace. |
| Ratio | Term; **reading order**, "relation made readable"; not an operation on distinction (`Ratio.md:35`). Uses `:` as its own device. |
| Order (Root/Dependency/Natural) | Terms; arrangement/precedence, not acts on distinction (`Root Order.md`, `Dependency Order.md`). |
| Structure | Term (second order); "ordered relation that bears"; downstream, not a first operation (`Structure.md:39`). |
| Emergent Condition / Operational Condition | **Classes** (`kind: class`) — classifications of conditions, not operations themselves. |

---

## 4. Which candidate appears earliest in dependency order

The `needs` fields give an unambiguous chain (each arrow = "is needed by"):

```
Ground (needs [])        Seed (needs [])         ← order: ground, outside the spine
        │
   Relation (needs [])    ← primitive; spine begins here (Root Order.md:32, :114)
        │
   Asymmetry (needs Relation)              ┐
        │                                  │ Emergent conditions —
   Bounded Asymmetry (needs Asymmetry)     │ "prior to operation"
        │                                  │ (Emergent Condition.md:27)
   Distinction (needs Bounded Asymmetry)   ┘  (distinguishable, not yet located)
        │
   Boundary (needs Distinction)            ┐
        │                                  │ Operational conditions —
   Availability (needs Boundary)           │ "operations on located distinction"
        │                                  │ (Operational Condition.md:25, :45-52)
   Strain → Bearing → Resolution           ┘
```

This matches the Root Order "Dependency Spine" diagram, which independently states the same order and marks Relation as the primitive start (`Root Order.md:93-114`).

Reading this against the requested candidates:

- **Earliest of anything:** Ground / Seed (`order: ground`, `needs: []`), but the Atlas states these are **outside the dependency spine** and not derived (`Ground.md:32`, `Seed.md:33`).
- **Earliest in the dependency spine:** **Relation** (primitive, `needs: []`) — but the Atlas classes it as a primitive *condition*, not an operation.
- **Earliest term the Atlas explicitly classes as an operation:** **Boundary** — because operations "act on located distinction," the emergent asymmetry family (through Distinction) is "prior to operation," and Boundary is the first-listed operational condition and the "locating act … the operation" (`Boundary.md:61`, `Operational Condition.md:45`, `Emergent Condition.md:27`).

So the answer depends entirely on which sense of "operation" is intended: **Relation** (if "operation" = the primitive relating activity) versus **Boundary** (if "operation" = the Atlas's own Operational Condition class). The repository supplies decisive evidence for the Boundary reading of the word "operation," and no evidence that the Atlas calls Relation an operation.

---

## 5. Alternatives rejected or held open

**Held open (repository supports more than one reading):**
- **Relation as first operation** — supported only if "operation" includes the primitive relating condition. The Atlas labels Relation `kind: primitive` and never "operation"; held open, not rejected.
- **Distinction as first operation** — "distinguishing" could be read as an act, but Distinction is defined as distinguishability *before location* and sits on the emergent side (`Distinction.md:12`); whether "becoming distinguishable" is an operation is not stated. Held open.
- **A generative/ground operation ("generation")** — "Generation begins when Seed : Ground becomes active relation" (`Seed.md:29`) names an activity earlier than Boundary, in reading/generative order rather than the dependency spine. Whether generation is "an operation" is not classified in the Atlas. Held open.
- **Carrier operations (Carry / Trace / Read)** — a parallel first-order lineage (`Connection → Carry/Trace → Read`) that are acts of availability/recognition. Whether the "first operation" belongs to the operational-condition chain or the carrier chain is not adjudicated by the Atlas. Held open.

**Not rejected but explicitly out of scope per contract constraints:**
- The `:` notation (Ratio, Seed : Ground) is Ratio's own reading device; not evaluated as calculus.
- `Order : Structure : Read` is not assessed or promoted.

**No candidate is positively rejected by the evidence.** The evidence *orders* them; it does not eliminate any except by definition of "operation."

---

## 6. Unknowns

1. **The definition of "operation" the Calculus intends is not fixed by the Atlas.** The Atlas has an Operational Condition *class* (first-order acts on located distinction) and prose uses of "operation," but **no `kind: operation`**. Whether the Calculus's "operation" == Operational Condition cannot be confirmed from repository evidence.
2. **Whether "first" means dependency-earliest or generative-earliest.** Dependency order gives Relation → … → Boundary; generative/reading order (`Root Order.md:105-114`, `Seed.md`) runs the other way and introduces "generation" as an activity. The Atlas keeps both frames; it does not say which defines "first operation."
3. **Status of Distinction relative to the emergent/operational boundary.** Distinction needs Bounded Asymmetry and is defined as pre-location; the Atlas does not explicitly assign Distinction to either the Emergent or Operational class (it is listed as carried by Bounded Asymmetry and carries Boundary), leaving the exact emergent→operational cut at Distinction/Boundary slightly implicit.
4. **Retraceability qualifier.** "Retraceable" is a property the whole spine is designed to have (`Root Order.md:44-46, :70`), and Trace names the backward availability that makes retracing possible (`Trace.md:51`). Whether "first *retraceable* operation" adds a constraint that would privilege Trace/Read over Boundary is not determinable from the wording alone.
5. **Whether ground-level terms may host an operation.** Ground and Seed are `needs: []` and outside the spine; whether any operation exists at ground level (vs. the first operation being necessarily first-order) is not stated.

---

## Acceptance — decision this report enables

The Architect and Steward can now decide on evidence:

- **If "operation" is taken as the Atlas's Operational Condition class:** the repository gives a clear, grounded answer — **Boundary is the first operation** (the locating act on located distinction), with the asymmetry family classed as prior-to-operation and Relation as the underlying primitive (`Boundary.md:61`, `Operational Condition.md:25-52`, `Emergent Condition.md:27`, `Root Order.md:93-114`).
- **If "operation" is taken more broadly** (to include the primitive relating condition, generative activation, or carrier acts): the first operation **remains unresolved**, because the Atlas does not classify Relation, generation, or the carrier acts as "operations," and offers no single ruling among them.

In both cases the dependency ordering itself is firmly evidenced (§4). What is **not** yet settled by repository evidence is the definition of "operation" the Calculus should adopt — which is a definitional choice for the Architect/Steward, not a fact recoverable from the Atlas.

---

**Scope note:** This contract created only this report (`docs/reports/C-C001-first-operation-characterisation.md`). No repository files were edited, no primitives proposed, no calculus decided, and `Order : Structure : Read` / `:` were neither assumed nor promoted. All conclusions are cited; unknowns are stated rather than resolved by assumption.
