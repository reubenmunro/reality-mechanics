# C-001 — Practice Calculus Derivation (Research Report)

**Programme:** Calculus · **Commission:** C-001 · **Mode:** Derivation research (read-only; no Atlas, governance, or Practice files edited). Deliverable is this report only.

**Mission alignment:** Increase structural perception by finding the *smallest operational calculus that can generate the Reality Mechanics Practice* (`MISSION.md:5`; `DELIVERY_PLAN.md:75` Epoch III). Task is to **derive, not redesign**. The existing `PRACTICE_CALCULUS.md` is treated as **evidence, not authority** (per commission).

**Method discipline:** Preserve retraceability; do not optimise wording; invent no terminology (this report uses only existing Atlas terms); prefer removing concepts to adding them; support every conclusion with Atlas dependencies; **separate observation from recommendation** (two parts below).

---

# PART A — OBSERVATIONS

## A0. The decisive prior evidence: the Atlas already contains a small runtime

Before classifying the seven proposed stages, the central observation: **the Atlas already grounds a small operational runtime for exactly this problem** — carrying an unresolved condition without losing dependency order.

**`Ark Run`** (`Reality_Mechanics/4_Practice/Ark Run.md`, `kind: practice`, `status: working`):

```text
Pressure -> Trace -> Check -> Determine -> Step        (Ark Run.md:48-50)
```

as carrying postures:

```text
current posture -> pressure unresolved -> dependency visible -> scope bounded -> determination held -> next posture   (Ark Run.md:54-61)
```

`Ark Run` `needs: [[Pressure]], [[Retrace Practice]], [[Check]], [[Determine]], [[Step]], [[AI Participation]]` and `carries [[Determination]]` (`:8-14, :29-31`). It is defined as "the runtime practice by which pressure is carried through retrace, check, determination, and step without losing dependency order" (`:38`).

This runtime **predates and underlies** the seven-stage `PRACTICE_CALCULUS.md` flow, and every one of its elements is a grounded Atlas term. It is the primary candidate for the "smaller operational calculus" and the frame against which the seven stages are assessed below.

Supporting Atlas operations already grounded:
- **`Determine`** (`kind: operation`): "carries pressure into a temporary bounded hold" (`Determine.md:35`); "Determine names the operation; Determination names the temporary hold produced by the operation" (`:18`).
- **`Determination`** (`kind: state`): "the temporary scoped hold produced when pressure has been retraced, checked, and bounded enough for a next answerable step" (`Determination.md:37`); pairs `[[Decision]]` — "Decision may select; Determination holds only where the selected read remains scoped, warranted, and retraceable" (`:19`).
- **`Check`**: "testing a term from both directions to locate its boundary" (`Check.md:39`); "Check bounds the scope of read" (`Ark Run.md:71`).

---

## A1–A5. Classification of the seven proposed stages

Assessed against Atlas dependencies. For each: **grounding**, **classification** (state / appearance / operation), **Atlas dependencies**, **evidence**, **confidence**.

### Pressure
- **Atlas grounding:** Yes — `2_Second/Carrying Conditions/Pressure.md` (`grounded: true`), `needs: Load, Relation, Boundary, Capacity, Compatibility`; "emergent load becoming locally borne through relation" (`:40`).
- **Classification:** genuine **structural state** — but at second order. The practice sense ("unresolved carrying that makes work necessary", `PRACTICE.md:77`) is closer to first-order **`Strain`** — "available distinction under contrast — present and pressing without yet being held or resolved" (`Strain.md:12,:33`). (Consistent with C-A001.)
- **Confidence:** state = HIGH; *which grain* (2nd-order Pressure vs 1st-order Strain) = UNRESOLVED.

### Commission
- **Atlas grounding:** None. No Atlas entry; "the steward's act of authorising attention" (`PRACTICE.md:89`).
- **Classification:** **readable appearance of an authority act**, not a structural state. Its structural content is a **Boundary** (locate/attend one pressure) carrying **external authority** (a governance notion — `CONSTITUTION.md` authority order — not an Atlas operation).
- **Atlas dependencies (nearest):** `Boundary` (locating act, `Boundary.md:61`); authority is *not* Atlas-grounded.
- **Confidence:** appearance = HIGH; derivability = **LOW** (authority is external). This is the least derivable stage.

### Contract
- **Atlas grounding:** None as a term; strong as a **product of an operation**. "a bounded carrying structure" (`PRACTICE_CALCULUS.md:99`); the document itself asks "is contract an engineered form of bounded asymmetry?" (`:112`).
- **Classification:** the **product of a bounding operation** — `Boundary` + `Bounded Asymmetry` ("distinction must be local enough before operations can act on it", `Operational Condition.md:13`) + `Scope`. `Check` also "bounds the scope of read" (`Ark Run.md:71`).
- **Confidence:** derivable as engineered Bounded Asymmetry/Scope = HIGH.

### Evidence
- **Atlas grounding:** No dedicated term. "returned contact with repository reality" (`PRACTICE_CALCULUS.md:118`); the document asks "Trace, Read, or Bearing?" (`:124`).
- **Classification:** **readable appearance of a retrace** — `Trace` ("recoverable dependency", `Common Term Structure.md:83`) made readable via `Read`; `Check` tests "backward from the present read through trace" (`Check.md:68`).
- **Atlas dependencies:** `Trace`, `Read`, `Retrace Practice`, `Check`.
- **Confidence:** appearance/read = HIGH.

### Recommendation
- **Atlas grounding:** None. "the architect's reading of the evidence … must not exceed the evidence" (`PRACTICE.md:130-134`).
- **Classification:** **readable appearance** — a carried `Read` of the evidence-trace, bounded by `Check`'s rule that forward openings become grounded "only where a downstream condition can retrace" (`Check.md:72`).
- **Confidence:** read = HIGH.

### Decision
- **Atlas grounding:** Yes — `2_Second/Produced Distinctions/Decision.md` (`grounded: true`), `needs: Strategy, Closure`; "a carried sequence resolved at a choice point … one path is taken over others within the current closure scope" (`:29`).
- **Classification:** genuine **structural state** (a produced distinction) reached by the **`Determine`** operation. Atlas separates them: Decision selects; Determination holds the warranted, retraceable version (`Determination.md:19`).
- **Confidence:** state = HIGH.

### Resolution
- **Atlas grounding:** Yes — `1_First/Resolution.md` (`grounded: true`, `order_terminal: is_terminal: true`), `needs: Bearing, Clearance`; "bearing determined at the current scope … held strain settling into a readable condition without terminating relation" (`:11`).
- **Classification:** genuine **structural state** — the **first-order terminal**. This is the actual closure the practice-`Resolution` describes ("current pressure has a known state", `PRACTICE_CALCULUS.md:156`).
- **Confidence:** state = HIGH.

### Summary of A1–A5

| Stage | Genuine state? | Appearance/read? | Operation? | Atlas-derivable? |
|-------|:--:|:--:|:--:|:--:|
| Pressure | **Yes** (2nd; grain vs Strain open) | — | — | Yes |
| Commission | No | **Yes** (authority act) | locating (Boundary)+authority | **Weak** (authority external) |
| Contract | No | — | **product of bounding** | Yes (Bounded Asymmetry/Scope) |
| Evidence | No | **Yes** (retrace read) | — | Yes (Trace/Read/Check) |
| Recommendation | No | **Yes** (carried read) | — | Yes (Read/Check) |
| Decision | **Yes** (2nd) | — | via Determine | Yes |
| Resolution | **Yes** (1st terminal) | — | via Bearing→Resolution | Yes |

**Observation:** only **three** of the seven (Pressure, Decision, Resolution) are genuine Atlas structural states; **three** (Commission, Evidence, Recommendation) are readable appearances/reads; **one** (Contract) is the product of a bounding operation. Six of seven are Atlas-derivable; **Commission is the one weak point** because it rests on *authority*, which the repository grounds in the Constitution, not the Atlas.

---

## A6. The `:` operations — what preserves the carried order at each transition

The commission's real burden: for each `:`, name the operation that preserves the order being carried. Each maps to a grounded Atlas operation.

| Transition | Operation that preserves order | Atlas dependency | Evidence |
|-----------|-------------------------------|------------------|----------|
| Pressure `:` Commission | **Boundary** (locate the pressure) + external authority | `Boundary` | "the locating act itself — the operation" (`Boundary.md:61`); authority is external (`CONSTITUTION.md`) |
| Commission `:` Contract | **Bound** → Bounded Asymmetry / Scope | `Bounded Asymmetry`, `Check` | "distinction must be local enough before operations can act on it" (`Operational Condition.md:13`); "Check bounds the scope of read" (`Ark Run.md:71`) |
| Contract `:` Evidence | **Trace / Retrace** | `Trace`, `Retrace Practice` | "recoverable dependency through which the operation can be retraced" (`Common Term Structure.md:83`); "dependency visible" (`Ark Run.md:57`) |
| Evidence `:` Recommendation | **Read / Check** | `Read`, `Check` | "recognition of meaningful distinction" (`Read.md:12`); forward openings grounded only on downstream retrace (`Check.md:72`) |
| Recommendation `:` Decision | **Determine** (select, warranted) | `Determine`, `Decision` | "carries pressure into a temporary bounded hold" (`Determine.md:35`); "strategy resolves into a taken direction" (`Decision.md:54`) |
| Decision `:` Resolution | **Bear → Resolve / Step** | `Bearing`, `Resolution`, `Step` | "held strain settling into a readable condition without terminating relation" (`Resolution.md:11`); "next posture" (`Ark Run.md:60`) |

**Observation:** the six `:` operations reduce to **{Boundary, Trace, Read/Check, Determine, Bear→Resolve/Step}** — precisely the Atlas `Ark Run` runtime (`Trace → Check → Determine → Step`) with `Boundary` at the front. The `:` marks operations that already exist in the Atlas; none required invention.

**Note on `:` itself (per commission):** the repository does *not* yet accept `:` as calculus. The Constitution conditionally governs it — "Where `:` is used as an operator, the operation must remain accountable to derivation … The transformation between terms must become retraceable" (`CONSTITUTION.md:232-242`, C010) — and C004A forbids promotion before derivation is reviewed. This report therefore treats each `:` as a *named-but-unaccepted* operation whose burden of proof is met only where the operation above is Atlas-grounded (all are, except the authority component of the first).

---

## A7. Competing hypotheses for the smallest calculus

Three candidates, all Atlas-grounded, in decreasing size:

- **H-A — Ark Run (practice runtime, 5 elements).** `Pressure → Trace → Check → Determine → Step` (`Ark Run.md:48`). Already grounded and `working`. Generates all seven stages (mapping in A6). **Confidence: HIGH.**
- **H-B — First-order operational spine (5, primitive).** `Boundary → Availability → Strain → Bearing → Resolution` (`Operational Condition.md:25`, `Root Order.md:100-102`). The most primitive derivation — the seven stages are practice reads of these five first-order operations. Lower grain than practice. **Confidence: HIGH as grounding, MEDIUM as the practice-level calculus** (it is upstream of practice).
- **H-C — Single operation (compression).** `Determine` applied to `Pressure`, producing `Determination` (`Determine.md`, `Determination.md`). Smallest, but `Determine` internally `needs` Boundary, Trace, Check, Scope, Hold — i.e. it *unfolds into* H-A. **Confidence: HIGH that it compresses, but it hides the operations rather than removing them.**

Relationship: **H-B ⊂ H-A ⊂ H-C** by grain — H-B is the first-order derivation of H-A; H-C is H-A compressed into one named operation. They are three views of one movement, not three rival calculi.

---

# PART B — RECOMMENDATION

## B1. Answer: Can the Practice be generated from a smaller operational calculus?

**Yes.** The seven-stage flow is generated by the Atlas's already-grounded runtime, with three stages revealed as reads and one as a product:

- **Genuine states:** Pressure, Decision, Resolution (three, not seven).
- **Reads/appearances:** Commission, Evidence, Recommendation (absorbed into operations, not separate stages).
- **Product:** Contract (the bounded result of a bounding operation).

## B2. Smallest candidate calculus (proposed, not finalised)

The smallest *practice-level* candidate is the Atlas runtime itself — **`Ark Run`** (H-A), removing the imported stages by absorbing them into grounded operations:

```text
Pressure  →  Trace  →  Check  →  Determine  →  Step
```

Generating map (seven stages from five operations):

| Atlas operation | Absorbs practice stage(s) |
|-----------------|---------------------------|
| Pressure (force) | Pressure |
| Trace | Evidence |
| Check | Contract (bounds scope) + Recommendation (tests the read) |
| Determine | Decision (selection, warranted) |
| Step → Determination | Resolution (held state, next posture) |
| *(before the run)* Boundary + authority | Commission |

This **removes three concepts** (Commission, Evidence, Recommendation as separate stages) and **reclassifies one** (Contract as a product), while introducing **no new terminology** — every element is an existing Atlas term.

Its first-order derivation (for retrace) is **H-B**: `Boundary → Availability → Strain → Bearing → Resolution`. Its compression is **H-C**: the single operation `Determine`.

## B3. What must be resolved before finalisation (not done here)

1. **Pressure's grain** — is the practice's first condition second-order `Pressure` or first-order `Strain`? (C-A001 unresolved.)
2. **Commission's authority** — the only non-Atlas-derivable element. Decide whether Commission is (a) an external governance act layered on `Boundary` (Constitution authority), or (b) outside the calculus entirely. It should not be treated as a derived operation until resolved.
3. **Decision vs Determination** — the Atlas separates selection (`Decision`) from warranted hold (`Determination`); the practice must choose which is its terminal, or keep both (`Determination.md:19`).
4. **Check's double load** — Check here absorbs both bounding (Contract) and read-testing (Recommendation); the C-F001 field-overload caution applies. Confirm Check can carry both without conflation.
5. **`:` acceptance** — per C010/C004A, no `:` operation may be promoted before its derivation is independently reviewed. This report supplies derivations; it does not accept them.

## B4. Confidence and unresolved questions (summary)

- **HIGH:** the Practice is generable from a smaller calculus; Ark Run is that calculus; six of seven stages are Atlas-derivable; the `:` operations are grounded.
- **MEDIUM:** whether the smallest form should be stated at practice grain (H-A) or first-order grain (H-B).
- **LOW / UNRESOLVED:** Commission's derivability (authority); Pressure's grain; Decision-vs-Determination terminal; `:` acceptance.

**Bottom line:** The Practice does not need a bespoke seven-stage calculus. It is already generated by the Atlas's grounded `Ark Run` movement (`Pressure → Trace → Check → Determine → Step`), whose operations are first-order-derivable as `Boundary → Availability → Strain → Bearing → Resolution`. The recommendation is to carry H-A forward as the smallest candidate calculus for testing — **not** to finalise it — and to resolve the five items in B3 first. This report proposes; it does not decide (C007).

---

**Scope note:** This contract created only this report (`docs/reports/C-001-practice-calculus-derivation.md`). No Atlas, Constitution, Practice, or Calculus files were edited; no terminology was invented (only existing Atlas terms used); observation (Part A) is separated from recommendation (Part B); every operation is traced to Atlas dependencies; and `:` is treated as named-but-unaccepted per `CONSTITUTION.md` C010/C004A. Unknowns are preserved as unknowns.
