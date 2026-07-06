# P-006 — Weaving as Operation Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no Weave term, no new public surfaces)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-005 (`docs/reports/P-005-weave-fabric-investigation.md`)  
**Core hypothesis (tested):** Thread, Fabric, and Web are conditions / readable states. Weaving is not another thing. Weaving is the **operation** by which followable continuity becomes held whole and traceable crossing-pattern.

**Method:** Atlas `needs` / `conditions` / `structure` fields and `atlas-structure-contract.mjs` operator families. No memory authority. **Do not freeze an operation into an object unless dependency evidence requires it.**

---

## Verdict

| Question | Result |
|---|---|
| Is weaving already implied by existing operator families? | **Yes** |
| Is weaving a distinct or compound operation? | **Compound** — not a seventh relation primitive |
| Does weaving need a new Atlas term **Weave**? | **No** |
| Should weaving remain process language? | **Yes — keep** |
| Does Fabric name the result of weaving? | **Yes** — “woven continuity” as **held whole** |
| Does Web name the trace pattern? | **Yes** — crossing-pattern **within** that whole |

**Recommendation:** **Keep weaving as process language.** Do **not** promote **Weave** to a noun. The Atlas already performs weaving through **declared structure operators** (`holds`, `traces`, `carries`, `pairs`, `nests`) plus **enacted/practice operations** (Carrying, Retracing, Read → Thread) converging at **Structural Gathering → Fabric → Web**.

---

## 1. Diagnosis — noun vs operation

### 1.1 Commission distinction (tested)

| Item | Atlas kind | Role |
|---|---|---|
| **Thread** | first-order **carrier** (noun) | Followable continuity state |
| **Fabric** | higher-order **term** (noun) | Held whole — “woven continuity” |
| **Web** | higher-order **term** (noun) | Traceable crossing-pattern within fabric |
| **Weave / weaving** | **Not a term** | Process descriptor in Fabric/Web pairing prose only |
| **Weaving** (hypothesis) | **Compound operation** | What operator families **do** jointly |

### 1.2 Atlas pattern for operations vs conditions

The Atlas does **not** give every process its own noun. It uses a disciplined split:

| Pattern | Examples | When used |
|---|---|---|
| **Base condition** | Hold, Carry, Trace, Pair, Nesting | Locatable structural state |
| **Enacted operation (-ing term)** | Carrying, Tracing, Retracing | When enactment must be **named as condition** |
| **Structure operator field** | `holds`, `traces`, `carries`, `pairs`, `nests`, `reads` | Declared facts on every entry (`RELATION_FIELDS`) |
| **Result state (participle)** | “**woven** continuity” on Fabric/Web | Outcome readable **without** process noun |

**Critical negative finding:** There is **no** `[[Weave]]` link anywhere in the vault. “Weave” appears only as **modifier** (“face/trace **of the weave**”) inside Fabric/Web `conditions.pairs` — describing a **process relation between two result nouns**, not naming a third entity.

### 1.3 Medium vs Fabric (do not conflate)

| Term | Order | Definition | Relation to weaving |
|---|---|---|---|
| **Medium** | second | “What carrying occurs **through**” (`second.medium`) | Through-condition of carrying — **not** the held whole |
| **Fabric** | higher | “Relation carried as **woven continuity**… held whole” | **Result** of compound weaving read |

`Medium.md` is held by Carrying + Participation + Allow — it names the **passage**, not the **completed weave**. Weaving **produces** fabric readability; medium names what participation passes through **during** carry. Observatory must not replace Fabric with Medium.

---

## 2. Evidence that weaving is already implied

### 2.1 Structure operator families (canonical)

`atlas-structure-contract.mjs`:

```javascript
export const RELATION_FIELDS = Object.freeze([
  "holds", "traces", "carries", "pairs", "nests", "reads",
]);
```

Observatory runtime mirrors this exactly:

```javascript
const FIELD_RELATION_KEYS = ["holds", "traces", "carries", "pairs", "nests"];
```

**These six fields are the Atlas’s operator vocabulary.** Every published term’s weaving-relevant behaviour is declared through them. No separate “weave” slot exists — **by design**.

### 2.2 Operator family → weaving role

| Operator / term | Weaving function | Atlas cite |
|---|---|---|
| **Hold** | Supportability — resolution remains same condition | `Hold.md`; enables Carry/Trace |
| **Carry** | Forward thread availability | `Carry.md` pairs Trace |
| **Trace** | Backward thread availability | `Trace.md` pairs Carry |
| **Carrying** | Forward enactment along connection | `Carrying.md` — “does not create separate relation from trace” |
| **Retracing / Tracing** | Participant backward enactment | `Retracing.md`, `Tracing.md` |
| **pairs** (structure) | Crossings — mutual availability without collapse | `Coupling.md`, `Pair.md` |
| **nests** (structure) | Depth — prior within later | `Nesting.md` |
| **Read** | Recognition → meaningful distinction | `Read.md` carries Thread |
| **Thread** | Followable continuity strand | `Thread.md` |
| **Place** | Locatable entry into relation | `Place.md` (`first.place`) |
| **Structural Gathering** | Multiple relations as one arrangement | carries **Fabric** |
| **Field Relationships** | Field crossings | carries Web, Fabric |
| **Nested Carrying** | Nesting operative as bearing | holds path to Invisible Bearing → Fabric |
| **Ratio** (readable constraint) | Comparison without collapse | `Ratio.md` — reading-order constraint |

### 2.3 Simultaneous carry + trace = weaving logic

`Nesting.md` (construction read):

> Running **carry and trace simultaneously** through the same passage resolves position… makes [nested] bearing readable.

This is the Atlas’s own statement of **compound operation**: forward + backward + nested depth **together** locate structure. That compound is what P-005/P-006 call **weaving** in process language — already present without a Weave term.

### 2.4 Convergence terms name outcomes, not process

| Term | Role |
|---|---|
| **Structural Gathering** | “Multiple participating relations held as one readable arrangement” → carries Fabric |
| **Fabric** | Readable when “whole carries before each thread separately read” |
| **Web** | Readable when “crossings remain followable without tearing fabric” |

The Atlas names **when weaving has succeeded** (Fabric/Web reads), not a frozen intermediate object (Weave).

---

## 3. Evidence against making Weave a term

| # | Evidence | Source |
|---|---|---|
| 1 | **No `needs` graph slot** — Fabric and Web already paired; adding Weave creates homonym/triangle risk | `Fabric.md`, `Web.md` |
| 2 | **Participle pattern** — Atlas uses “woven” as adjective on continuity, not process noun | Fabric/Web prose |
| 3 | **Operator redundancy** — `RELATION_FIELDS` + Carrying/Read/Thread already express process | `atlas-structure-contract.mjs` |
| 4 | **Medium already covers “through”** at second order — Weave would compete ambiguously | `Medium.md` |
| 5 | **D-017B lesson** — promoting gloss (ember) to primary label collapses layers; Weave risks same | P-005, D-017B |
| 6 | **P-005 finding** — Weave is unregistered verb; investigation goal was vocabulary adoption, **not** term creation | P-005 §7.2 |
| 7 | **Stewardship rule** — do not freeze operation into object without dependency requirement | Commission principle |
| 8 | **Carrying.md** — same connection carries forward and traces back; third “weave” substance would violate unity | `Carrying.md` L88 |

**Dependency test:** Nothing in the Atlas `needs` spine **fails** because Weave is absent. Thread → (convergence) → Fabric/Web closes without it.

---

## 4. Proposed operational definition of weaving

**Weaving** (process language only — not an Atlas term):

> The **compound operation** by which declared relation operators remain jointly supportable under ratio-readable constraint, such that forward carry and backward trace stay available on the same connections, crossings pair without collapse, nesting retains depth, and followable **thread** continuity reads as **woven whole** (**fabric**) with navigable **crossing-pattern** (**web**).

**Not weaving:** pre-existing sheet, particle field, undeclared proximity bond, decorative animation, or L6 paint without L1 edges.

**Weaving succeeds** when Fabric/Web `conditions.reads` become true — not when a separate Weave object appears.

---

## 5. Dependency conditions for weaving

### 5.1 Minimum chain (must hold)

```text
Relation (primitive)
  → Connection
  → Hold (supportability)
  → Carry + Trace (bidirectional availability)
  → [declared holds/traces/carries/pairs/nests on terms]
  → Read → Thread (followable continuity)
  → Ratio readable (One : Other under Clearance)
```

### 5.2 Convergence chain (fabric/web reads)

```text
Coupling + Pair (crossings)
  → Nesting (+ Nested Carrying at higher order)
  → Field Relationships (field crossings)
  → Structural Gathering
  → Fabric (held whole)
  → Web (traceable crossings within whole)
```

### 5.3 What changes when weaving succeeds

| Before | After (reads become available) |
|---|---|
| Threads followable individually | **Fabric** read: whole carries before each thread separately read |
| Crossings declared but not navigable as pattern | **Web** read: crossings followable without tearing fabric |
| Seed nested in Relation, not recovered | **Fabric** read: Seed recognisable in holding without full retrace |
| Surface not yet presenting whole | **Surface** / **Visible** present face answerable to carry |
| Pressure local only | **Pressure** may read as load borne **through** relation at boundary |

**Runtime (P-004):** `ratioMode` band shift, `ratioVisualScale` change, lattice coherence — **behaviour** changes on same L1 edges; structure does not.

### 5.4 Answers — Questions 6–7

| Question | Answer |
|---|---|
| 6. Does Fabric name the result of weaving? | **Yes** — “woven continuity returned as held whole” |
| 7. Does Web name the trace pattern of weaving? | **Yes** — “trace of the weave” = crossing-pattern within continuity |

---

## 6. Mapping to P-003 runtime layers

| Weaving phase | P-003 layer | Runtime expression |
|---|---|---|
| Declared operators | **L1** | `structure.holds/traces/carries/pairs/nests` |
| Ratio constraint | **L2** | `mass.carriers`, `ratioMode` |
| Thread / maturity / order reads | **L3** | maturity, settledness, order depth |
| Operator enactment + rhythms | **L4** | `relationRhythm`, `ratioVisualScale`, field bend |
| Frame visibility | **cross-cut** | `coupledSensibility`, structural frames |
| Traversal overlay | **L5** | wake, `frameTransitionPulse` |
| Fabric face / web crossings paint | **L6** | pressure lattice, edge strokes, condensation |

**Weaving is not one layer.** It is the **joint L1–L4 effect** that L6 may reveal. Appearance (L6) is **rendered consequence** — not weaving itself.

---

## 7. Implications for O-002 Observatory renderer

### 7.1 Render weaving without decoration

| Do | Do not |
|---|---|
| Show **L1 edges** as web skeleton (declared crossings) | Pre-fill fabric before structure loads |
| Modulate edge behaviour by **ratio** (L2) and relation type (L4) | Add “weaving particles” unrelated to edges |
| Let **fabric face** emerge when lattice + mass cohere (condensation) | Treat fabric as elastic membrane (retired language) |
| Tie currents to **pressure deposition** from declared terms | Run decorative flow without mass/ratio cite |
| Label overlay events as **L5** (traversal), not structure | Freeze partial weave as pseudo-object |

### 7.2 Operational render sequence (P-005 + P-006)

```text
1. Web     — declared crossings visible (L1)
2. Weaving — operator-specific edge behaviour under ratio (L1–L4)  [process, not noun]
3. Fabric  — coherent face when reads succeed (L6)
4. Behaviour — rhythms, coupling, phase on fabric (L4 → L6)
```

### 7.3 O-002 refactor vocabulary

| Retire / avoid | Use |
|---|---|
| `drawHomeMembrane` (implementation name) | `drawFabricFace` when O-002 refactors |
| “Weave layer” as object | “weaving phase” as process |
| Weave term in UI | Thread / Web / Fabric + operator names |

---

## 8. Operator family inventory (commission list)

| Commission name | Atlas entry | Noun vs operation |
|---|---|---|
| Hold / Holding | **Hold** (no “Holding” term) | Hold = condition; “holding” = prose |
| Carry / Carrying | **Carry** + **Carrying** | Carry = availability; Carrying = enacted |
| Trace / Tracing / Retracing | **Trace** + **Tracing** + **Retracing** | Trace = availability; Tracing/Retracing = practice enactment |
| Pair / Pairing | **Pair** (no “Pairing” term) | Pair = bounded coupling read |
| Nest / Nesting | **Nesting** | Nesting = ordered participation condition |
| Read / Reading | **Read** (no “Reading” term) | Read = recognition carrier |
| Place / Placing | **Place** + Placement Mode | Place = locatable entry; Placement Mode = sorting class |
| Thread | **Thread** | Noun — continuity state |
| Fabric | **Fabric** (`higher.fabric`) | Noun — result state |
| Web | **Web** | Noun — pattern state |
| Structural Gathering | **Structural Gathering** | Convergence condition → Fabric |
| Coupling | **Coupling** | Crossing support |
| Pressure | **Pressure** | Emergent load through relation |
| Rhythm | **Rhythm** | Patterned recurrence |
| Surface | **Surface** | Presenting face |
| Visible | **Visible** | Presented readability |

**Pattern:** Atlas promotes **-ing** to term only when enactment must be **locatable** (Carrying, Tracing, Retracing). Weaving does not meet that bar — its outcomes are Fabric/Web.

---

## 9. Recommendation

| Option | Verdict |
|---|---|
| **Keep weaving as process language** | **Accept (recommended)** |
| **Promote Weave term later** | **Reject unless dependency gap found** — none today |
| **Reject weave/fabric direction** | **Reject** — P-005 grounded Fabric/Web/Thread |

### 9.1 Protected principle

> Do not freeze an operation into an object unless the dependency evidence requires it.

**Weaving fails the freeze test.** Fabric and Web already name success states; `RELATION_FIELDS` already name operators; Carrying/Read/Thread already name enactment chain.

### 9.2 Documentation rule

In reports, renderer briefs, and Observatory architecture:

- Use **weaving** (verb / process) for the compound operation
- Use **Thread**, **Fabric**, **Web** when citing Atlas
- Use **holds / carries / traces / pairs / nests** when citing structure
- Never **`[[Weave]]`** unless a future steward commission finds an explicit dependency hole

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Weave term added for UI convenience | Block; use process language |
| L6 animation labelled “weaving” without L1 edges | P-003 layer labels; D-011 O-4 |
| Fabric confused with Atlas Fabric or Medium | Qualify `higher.fabric`; P-005 homonym rule |
| Operation frozen as runtime object (`weaveState`) | RM Field Engine holds lattice + phase register only (P-004) |

---

## 11. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-005 | **Met** |
| Noun vs operation diagnosis | **Met** — §1 |
| Weaving already implied | **Met** — §2 |
| Evidence against Weave term | **Met** — §3 |
| Operational definition | **Met** — §4 |
| Dependency conditions | **Met** — §5 |
| P-003 mapping | **Met** — §6 |
| O-002 implications | **Met** — §7 |
| Recommendation | **Met** — §9 keep process language |
| No renderer/Atlas/D1/public changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-005 | `docs/reports/P-005-weave-fabric-investigation.md` |
| P-004 | `docs/reports/P-004-ratio-phase-engine-investigation.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| Contract | `atlas-structure-contract.mjs` |
| Atlas | `Fabric.md`, `Web.md`, `Thread.md`, `Carrying.md`, `Nesting.md`, `Structural Gathering.md`, `Medium.md`, `Hold.md`, `Carry.md`, `Trace.md`, `Read.md`, `Place.md` |

---

**Status:** P-006 complete. **Weaving is a compound operation already performed by Atlas operator families.** **Do not add a Weave term.** Fabric and Web name its successful reads.
