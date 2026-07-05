# C-003 — Minimum Support Test for the Ark–Order Calculus Candidate

**Programme:** Calculus · **Commission:** C-003 · **Mode:** Read-only research report (no Atlas, Practice, Calculus, Constitution, or governance files edited).

**Primary question:** What is the smallest Atlas-grounded structure capable of supporting the cooperation between Order and Ark?

**Rules honoured:** `Order : Ark` is not promoted; pair directionality is not assumed; no terminology invented; observation separated from recommendation; unresolved questions preserved.

**Method:** Transitive `needs`-closures were computed (read-only, robust parser) across the whole Atlas for each pole and for the cooperation seat. Removal of each tested term is assessed against those closures. Figures are reproducible.

---

# PART A — OBSERVATIONS

## A0. The closures (evidence base)

Transitive `needs`-closures (what each term ultimately requires):

- **`Connection`** → `{Relation}` **only** (`Connection.md:8-9`).
- **`Carry`** → `{Connection, Hold, Relation, Resolution, Bearing, Strain, Availability, Boundary, Distinction, Bounded Asymmetry, Asymmetry, Clearance, Clear, Clean}` (`Carry.md:8-10`).
- **`Trace`** → identical to `Carry` (`Trace.md:8-10`).
- **`Hold`** → `{Resolution, Bearing, Strain, Availability, Boundary, Distinction, Bounded Asymmetry, Asymmetry, Clearance, Clear, Clean, Relation}` (`1_First/Resolution Conditions/Hold.md:8-9`, `needs: [[Resolution]]`).
- **`Root Order`** (Order-as-arrangement) → `{Ground}` (`0_Ground/Root Order.md`).
- **`Order Trace`** (Order-as-path) → large closure incl. Relation, Trace, Hold, Boundary, Resolution, the whole spine (`Order Trace.md:8-12`).
- **`Ark Run`** → large closure incl. Pressure, Check, Determine, Boundary, Hold, Resolution, Relation (`Ark Run.md:8-14`).

**Decisive structural fact:** `Carry` and `Trace` each require `Hold` (`Carry.md:8-10`, `Trace.md:8-10`); `Hold` requires `Resolution` (`1_First/Resolution Conditions/Hold.md:8-9`); `Resolution` requires `Bearing → Strain → Availability → Boundary → Distinction → Bounded Asymmetry → Asymmetry → Relation` (`Resolution.md:7-9`). Therefore **any held forward carry / backward trace transitively requires Boundary and the entire first-order operational spine.** Only `Connection` sits below this — it needs `Relation` alone.

## A1. Test 1 — Relation

- **Atlas grounding:** `1_First/Relation.md`, `kind: primitive`, `needs: []`.
- **Dependency role:** the primitive; present in every closure above.
- **Required?** **Yes — unconditionally.** Connection needs Relation; both poles ground in it.
- **Evidence:** `Connection.md:9`; `Relation.md:42` "no prior term inside the system produces it."
- **Failure mode if absent:** no active relation → nothing to connect, hold, carry, or trace → neither Order nor Ark exists. Total collapse.
- **Confidence:** HIGH.

## A2. Test 2 — Boundary

- **Atlas grounding:** `1_First/Boundary.md`, `needs: [[Distinction]]`.
- **Dependency role:** locating act; member of the operational-condition spine.
- **Required?** **Yes — but transitively, through `Hold`, not directly through `Connection`.** `Connection` (the cooperation seat) does **not** need Boundary. But `Carry`/`Trace` need `Hold`, `Hold` needs `Resolution`, and `Resolution`'s chain includes `Boundary` (`Carry.md` closure contains Boundary). So Boundary is required **iff the cooperation requires held Carry/Trace**, and **not required** if the cooperation is taken at the bare `Connection` grain.
- **Evidence:** `Carry.md:8-10` (needs Hold); `1_First/Resolution Conditions/Hold.md:8-9` (needs Resolution); `Resolution.md:7-9` (needs Bearing, Clearance); Availability→Boundary via the Strain chain. Boundary appears in the Carry/Trace/Hold closures but **not** in the Connection closure.
- **Failure mode if absent:** the Availability→Strain→Bearing→Resolution chain breaks → `Hold` cannot be grounded → a connection cannot be *held* → held Carry/Trace lose their passage → the cooperation degenerates. (The bare bidirectional passage of Connection would survive.)
- **Confidence:** HIGH that Boundary is transitively required for held carry/trace; the *directness* of its role depends on the grain chosen (A5).

## A3. Test 3 — Connection

- **Atlas grounding:** `1_First/Connection.md`, `kind: term`, `needs: [[Relation]]`.
- **Dependency role:** "relation holding between distinguishable conditions so that passage is available in more than one direction" (`:12`); "Forward, held connection offers Carry. Backward, it offers Trace" (`:31`).
- **Required?** **Yes — this is the seat of the cooperation.** The Order/Ark cooperation *is* one connection read forward and backward. Carry and Trace both need Connection.
- **Evidence:** `Connection.md:12,:31,:48`; `Carry.md:10`, `Trace.md:10`.
- **Failure mode if absent:** no held passage → no forward or backward availability → no carry, no trace → the cooperation cannot exist at all.
- **Confidence:** HIGH. **Connection is the minimal seat and needs only Relation.**

## A4. Test 4 — Carry

- **Atlas grounding:** `1_First/Carrier Mechanics/Carry.md`, `kind: carrier`, `needs: [[Hold]], [[Connection]]`.
- **Dependency role:** "the forward availability of held connection" (`:30`) — the **Ark / forward** pole.
- **Required?** **Yes for the Ark pole as a named carrier** — but note the forward *availability* is already offered by Connection (`Connection.md:31`) before Carry is instantiated. Carry names/holds that availability, and by doing so pulls in `Hold` (and the spine).
- **Evidence:** `Carry.md:15,:30`; `Connection.md:31`.
- **Failure mode if absent:** no named forward availability → the Ark pole is unexpressed → only static Order remains (contradicting C004 — Calculus Authority, "The Calculus derives operations and transformations", `docs/CONSTITUTION.md:79-81`).
- **Confidence:** HIGH.

## A5. Test 5 — Trace

- **Atlas grounding:** `1_First/Carrier Mechanics/Trace.md`, `kind: carrier`, `needs: [[Hold]], [[Connection]]`.
- **Dependency role:** "the backward availability of held connection" (`:51`) — the **Order-preservation / backward** pole.
- **Required?** **Yes for the Order-preservation pole as a named carrier** — again, the backward availability is already offered by Connection; Trace names it and pulls in `Hold`.
- **Evidence:** `Trace.md:15,:51`; `Connection.md:31`.
- **Failure mode if absent:** no named backward availability → carrying cannot be confirmed to preserve order → **Degenerate** ("carrying continues while the generative trace is lost", `Order Trace.md:154`).
- **Confidence:** HIGH.

## A6. Test 6 — other required terms

- **`Hold` — REQUIRED, and not in the commission's list.** Both `Carry` and `Trace` need `Hold` ("Connection must remain held for forward/backward passage", `Carry.md:14`, `Trace.md:14`). `Hold` names "resolution remaining supportable as the same condition" and "makes Carry possible" (`1_First/Resolution Conditions/Hold.md:32`). It is the term through which "preservation" enters — and the term that transitively pulls in `Resolution → Bearing → Strain → Availability → Boundary`. **`Hold` is the pivotal hidden dependency of the whole candidate.** Failure if absent: connection cannot remain held → no stable carry/trace → no preservation. Confidence HIGH.
- **`Resolution` — REQUIRED (via Hold).** `Hold` needs `Resolution` (`1_First/Resolution Conditions/Hold.md:8-9`). Failure: Hold ungrounded. Confidence HIGH.
- **`Bearing`, `Strain`, `Availability`, `Distinction`, `Bounded Asymmetry`, `Asymmetry`, `Clearance`, `Clear`, `Clean` — all REQUIRED (via Hold→Resolution chain).** They appear in the Carry/Trace closures. Confidence HIGH.
- **`Ground` — REQUIRED for the Order pole.** `Root Order` needs `Ground` (`0_Ground/Root Order.md`). Confidence MEDIUM-HIGH.
- **`Pressure`, `Check`, `Determine`, `Step` — NOT required for the cooperation.** They are the practice-grain *content* of `Ark Run` (what is carried and how), not the cooperation itself. The bare cooperation (carry preserving trace on a held connection) does not need them. Confidence MEDIUM-HIGH.

## A7. The two grains (the crux observation)

The cooperation has **two possible grains**, and minimality depends entirely on which is meant:

- **Grain 1 — bidirectional passage.** `Relation → Connection`. Connection already "makes passage available in more than one direction" and "offers Carry forward, Trace backward" (`Connection.md:12,:31`). This supports the *form* of the Order/Ark cooperation — forward carrying and backward preservation — with a support set of just **{Relation, Connection}**.
- **Grain 2 — held, named carriers.** `Relation → Connection + Hold → Carry / Trace`. The moment the forward and backward availabilities are named as held carriers (so that order is *preserved*, not merely available), `Hold` is required, and `Hold` transitively requires **Resolution, Bearing, Strain, Availability, Boundary, Distinction, Bounded Asymmetry, Asymmetry, Clearance, Clear, Clean, Relation** — nearly the whole first order.

The C-002 candidate (`Ark Run` grain: Pressure→Trace→Check→Determine→Step, with Order Trace) sits **above even Grain 2**, adding Pressure, Check, Determine, Step, Ground, Atlas Practice.

---

# PART B — RECOMMENDATION

## B1. Is the Ark–Order candidate minimal?

**No.** As stated in C-002 (held carry/trace at Ark Run / Order Trace grain), the candidate is far from minimal. Its cooperation transitively requires **Hold → Resolution → Bearing → Strain → Availability → Boundary → Distinction → Bounded Asymmetry → Asymmetry → Clearance → Clear → Clean → Relation**, plus (at Ark Run grain) Pressure, Check, Determine, Step, Ground. The candidate is an **elaboration**, not a minimum.

## B2. What is the smaller support structure?

**`Relation → Connection`.** The minimal Atlas-grounded structure that supports the Order/Ark cooperation is a single held **Connection** on the primitive **Relation**. Connection *already provides* the two directions the cooperation names — forward availability (the Ark/carry direction) and backward availability (the Order/trace direction) — "within one connection, not two separate relations" (`Connection.md:31`). Everything the candidate adds (`Hold`, `Carry`, `Trace`, `Boundary`, the operational spine, `Ark Run`, `Order Trace`) is elaboration of this seat, not a precondition of it.

The dependency ladder of grains:

```text
Grain 1 (minimal seat):     Relation -> Connection                     {2 terms}
Grain 2 (held carriers):    + Hold -> Resolution -> Bearing -> Strain
                              -> Availability -> Boundary -> ... -> Relation   {~14 terms}
Grain 3 (C-002 candidate):  + Pressure, Check, Determine, Step, Ground,
                              Order Trace, Atlas Practice ...            {~50+ terms}
```

## B3. Does the candidate need revision before promotion?

**Yes.** Two revisions are required before any promotion:

1. **Declare the grain.** The candidate must state whether the Calculus is the *minimal bidirectional passage* (Grain 1: Connection on Relation) or the *held, preserved carrying* (Grain 2/3). These are different-sized claims. C-002 conflates them by naming the poles "Ark/Order" (Grain 3 vocabulary) while implying a fundamental relation (Grain 1 intuition).
2. **Surface `Hold`.** `Hold` is the hidden pivot: it is where "preservation" actually enters and where Boundary and the whole spine become required. Any promoted calculus must name `Hold` explicitly; it cannot be left implicit, because it carries the entire minimality cost.

## B4. Exact recommendation to the Lead Architect

> **Do not promote `Order : Ark` as the minimal Reality Mechanics Calculus.**
>
> 1. Record that the **minimal Atlas-grounded seat of the Order/Ark cooperation is `Connection` on `Relation`** (Grain 1): one held connection already offers forward carry (Ark) and backward trace (Order). This is smaller than, and prior to, the C-002 candidate.
> 2. Reclassify the C-002 `Ark Run`/`Order Trace` candidate as an **elaboration** of that seat at practice grain, not the minimum.
> 3. Require any future calculus statement to (a) **declare its grain** and (b) **name `Hold`** explicitly, since `Hold` is the dependency that pulls Boundary and the entire first-order spine into the cooperation.
> 4. Keep `:` **unaccepted** (C010/C004A); keep **pair directionality** open (Connection holds both directions of one relation, so neither `Order : Ark` nor `Ark : Order` is established).
> 5. Resolve the open questions in B5 before Calculus promotion.

## B5. Unresolved questions (preserved)

1. **Grain choice.** Is the Calculus the minimal passage (Connection) or the held carrying (Carry/Trace)? Minimality favours Connection; the "preservation of order" reading (C-002 report) favours the held grain. Unresolved.
2. **Hold's dependency on Resolution.** `Hold` needs `Resolution`, making the "support" chain circular-feeling (to hold you need resolution; to resolve you need bearing/strain which need boundary/availability). Whether this is a genuine ordering or a placement to review is unresolved (relates to C-R001A's finding that Resolution is the first-order terminal).
3. **Directionality.** Connection is vertical and holds both directions "within one connection" (`Connection.md:48`); the pair order (`Order : Ark` vs `Ark : Order`) is therefore not determined by evidence.
4. **Ark has no minimal term.** "Ark" exists only at elaborated grain (`Ark Run`, `Ship and Ark`); there is no bare `Ark`. Whether the forward pole should be named `Carry` (minimal) rather than `Ark` (elaborated) is unresolved and must not be settled by inventing a term (C004A).
5. **Whether Connection alone is *sufficient* or merely *necessary*.** Connection provides the two directions, but whether the cooperation requires them *held* (→ Hold → spine) is the grain question again; sufficiency at Grain 1 is asserted from `Connection.md:31` but not independently tested.

## B6. Bottom line

The Ark–Order candidate is **not minimal**. Its minimal Atlas-grounded support is **`Relation → Connection`** — a single held connection that already offers the forward (Ark) and backward (Order) directions the candidate names. The candidate's apparent size comes almost entirely from **`Hold`**, which enters with "preservation" and transitively requires `Boundary` and the whole first-order spine. The recommendation is to **not promote** `Order : Ark`, to record Connection-on-Relation as the minimal seat, and to require grain-declaration and explicit `Hold` before any Calculus promotion. This report **proposes; it does not decide** (C007).

---

**Scope note:** This contract created only this report (`docs/reports/C-003-minimum-support-test.md`). No other files edited. `Order : Ark` not promoted; pair directionality not assumed; no terminology invented; observation (A) separated from recommendation (B); closures are reproducible; `:` treated as unaccepted (C010/C004A); unresolved questions preserved.
