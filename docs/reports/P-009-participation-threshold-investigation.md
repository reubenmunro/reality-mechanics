# P-009 — Participation Threshold Investigation

**Programme:** Research / architecture  
**Type:** Investigation (no renderer changes, no Atlas/D1 edits, no new public surfaces, no new primitives)  
**Date:** 2026-07-07 (UTC+12)  
**Governing evidence:** P-001 through P-008, O-002 (`docs/reports/O-002-fabric-renderer-architecture.md`)  
**Core hypothesis (tested):** Carry, Trace, Hold, Pair, and Nest describe individual operational participation. Fabric does not appear because another operator exists — **Fabric appears when participation itself changes.**

**Method:** Atlas `needs` / `conditions` / `reads` blocks only. Collective behaviour must be **derived**, not assumed.

---

## Verdict

| Question | Result |
|---|---|
| Is Participation the individual → collective transition? | **Partial** — **spine yes, sole cause no** |
| Does participation threshold exist in Atlas? | **Yes — as crossing reads**, not one scalar |
| Is Fabric a direct consequence of Participation? | **No** — Fabric `needs` omit Participation |
| Does Thread become Fabric because participation changes? | **Indirect only** — weave convergence primary (P-008) |
| Recommendation (§9) | **Derived, load-bearing for collective pathway; partially orthogonal to Fabric** |

**Bottom line:** Participation is a **second-order derived condition** (“bearing relation actively taking part in a scope”), not an operator. Collective behaviour emerges when **participation recurs and orders** (`Recurrence` → `Field of Participation` → `Nesting` → crossings), then **converges** at `Structural Gathering` / weave success → `Fabric`. The hypothesis is **half right**: participation **change** (especially **recurrence** and **ordered nesting**) explains the **field** and **nesting** tiers of collectivity; it does **not** alone explain **Fabric**, which Atlas grounds in **Thread + weave convergence + higher-order bearing reads**.

---

## 1. Atlas diagnosis — Participation

### 1.1 What Participation is

| Attribute | Evidence |
|---|---|
| **Entry** | `2_Second/Participation.md`, `second.participation`, faithful D (D-008) |
| **Definition** | “Bearing relation **actively taking part in a scope**” |
| **Holds** | `Carrying`, `Presence`, `Bearing Relation` |
| **Places** | Active taking-part — not mere connection, not observation alone |
| **Carries** | `Recurrence`, `Field of Participation`, `Nesting`, `Third Order`, `Medium`, `Practice`, … |

**Not:**

| Confusion | Ruling |
|---|---|
| participation = interaction | **No** — needs enacted carrying + presence + bearing relation |
| participation = observation | **No** — `Cognitive Participation` carries `Observation` downstream; observation is not participation |
| participation = cognition | **No** — `Cognitive Participation` is separate hinge (`Readability` + `Participation`) |

### 1.2 Operation, condition, or other?

| Category | Verdict |
|---|---|
| Operation (act) | **No** — not `kind: operation`; not in `RELATION_FIELDS` |
| Condition (readable state) | **Yes** — `kind: term`; becomes recognisable when carrying is present and bearing relation takes part |
| Enactment | **Upstream** — requires `Carrying` (enacted forward availability) already operative |

**Pattern:** Availability (`Carry`/`Trace`) → enactment (`Carrying`/`Retracing`) → scope condition (`Participation`) → recurrence (`Recurrence`) → collective beds (`Field of Participation`).

### 1.3 Related terms (commission list)

| Term | Order | Relation to Participation |
|---|---|---|
| **Cognitive Participation** | second | Hinge: readability uptake **within** participating scope |
| **Field of Participation** | third | Recurring organisation **arising through** participation + recurrence |
| **Organic Field** | third | Recurring field; needs Field of Participation |
| **Field Relationships** | third | Field grouping; carries Fabric/Web — **not** Participation |
| **Fabric** | higher | Woven held whole; **no Participation in `needs`** |
| **Web** | higher | Crossing trace within fabric |
| **Thread** | first | Followable continuity; no Participation in `needs` |
| **Pulse** | — | **No Atlas term** — runtime `frameTransitionPulse` only |

---

## 2. Dependency position of Participation

### 2.1 Spine (evidence-backed)

```text
Relation (primitive)
  → Connection, Hold
  → Carry / Trace (availability)
  → Carrying / Retracing (enactment)
  → Presence, Bearing Relation
  → Participation (actively taking part in scope)     ← second-order condition
  → Recurrence (participation occurring again)
  → Second Order Crossing (threshold read)
  → Field of Participation (recurring organisation)
  → Nesting (ordered participation)
  → Third Order / domains
  …
  → Structural Gathering (multiple participating relations as one arrangement)
  → Fabric / Web (higher — weave convergence + bearing reads)
```

### 2.2 Answers — Questions 1–2

| # | Answer |
|---|---|
| 1. What is Participation? | **Derived second-order condition**: carried, present bearing relation actively taking part in a scope |
| 2. Operation, condition, or other? | **Condition** (term); presupposes **Carrying** enactment |

### 2.3 Primitive vs derived

| | Participation |
|---|---|
| Primitive? | **No** |
| Derived from | `Carrying` + `Presence` + `Bearing Relation` |
| Load-bearing? | **Yes** — second-order order root; carries crossing into Third Order |

---

## 3. Participation threshold investigation

### 3.1 Can participation increase or decrease? (Q3)

| Evidence | Finding |
|---|---|
| Atlas prose | Participation is **readable or not** — no scalar “participation level” term |
| `Recurrence` | “Participation **occurring again**” — qualitative threshold, not meter |
| `Rate`, `Frequency`, `Count` | Carried by Recurrence — **related**, not participation register |
| Runtime | `mass.carriers`, `maturityBand`, `settledness` — **not** participation (D-014, P-003) |
| D-015B | “Participation → behaviour” — **falsified** as invariant derivation |

**Verdict:** Participation **can intensify in prose** (more scopes, more recurrence) but Atlas does **not** define a participation invariant scalar. Thresholds are **crossing reads**, not continuous quantity.

### 3.2 What changes at the threshold? (Q4)

**Named crossing:** `Second Order Crossing` / Threshold (Second → Third) (`Second Order Crossing.md`):

> “The crossing where carrying through **recurring participation** begins to organise into a **field**.”

> Readable where “carrying through participation **recurs enough** to organise into a field of participation.”

| Before crossing | After crossing |
|---|---|
| Individual scope participation (Carrying + Presence + Bearing Relation) | **Field of Participation** — recurring organisation |
| Single-instance taking-part | **Recurrence**-backed recognisable repetition |
| Second-order roots | **Third Order** entry (`Nesting`, domains) |

**Higher convergence (not Participation-named):**

| Read | Change |
|---|---|
| **Structural Gathering** | Multiple **participating** relations → one readable arrangement → carries **Fabric** |
| **Weave success** (P-008) | Carry ∧ Trace mutual support → thread → fabric face (runtime) |
| **Nested Carrying** | Nesting **operative** as bearing → path to Invisible Bearing → Fabric `needs` |

### 3.3 Collective threshold — derived chain

```text
Individual operational participation:
  Hold, Carry, Trace, Carrying, Coupling, Pair, Nest (structure operators + enactment)

Collective transition (Atlas-derived, not assumed):
  Participation + Recurrence
    → Second Order Crossing (threshold read)
    → Field of Participation
    → Nesting (ordered participation in field)
    → Field Relationships / Organic Field

Fabric-tier collective (additional convergence — not Participation alone):
  Thread + mutual carry/trace (P-008)
  + Structural Gathering + Nested Carrying + Field Relationships
    → Fabric / Web
```

**Negative finding:** There is **no** term “Participation Threshold.” The repository uses **crossing** and **reads** language, not a numeric phase change.

---

## 4. Collective participation and commission targets (Q5–7)

| Target | Explained by Participation? | Evidence |
|---|---|---|
| **Fabric** | **Indirect / partial** | Fabric `needs`: Thread, Field Relationships, Nested Carrying, Invisible Bearing, Surface, Trace — **not Participation**. Traces Structural Gathering (“participating relations”). |
| **Field** | **Yes (strong)** | Field of Participation = “recurring organisation **arising through participation**” |
| **Condensation** | **Weak** | Runtime heuristic (O-002); Atlas nearest: Structural Gathering / mass read — not Participation-derived |
| **Coupling** | **No (upstream)** | Coupling needs Resolved Asymmetry + Carrying — **enables** mutual availability before pair participation |
| **Nesting** | **Yes (strong)** | Nesting holds Participation + Recurrence + Field of Participation |
| **Rhythm** | **Partial** | Rhythm needs Pattern + Recurrence — shares recurrence arm, not Participation directly |
| **Pulse** | **No** | No Atlas term |

### Q6 — Is Fabric a consequence of collective participation?

**Partial.** Collective **participation ordering** (recurrence, nesting, field beds) is **necessary context** for higher-order reads, but Fabric’s **dependency list** names **weave results** (Thread, Trace) and **operative nesting** (Nested Carrying), not Participation. Atlas separates:

- **Field of Participation** = collective **recurrence bed** (third order)
- **Fabric** = **woven held whole** (higher order)

Collapsing them contradicts `Fabric.md` vs `Field of Participation.md` (P-005).

### Q7 — Thread → Fabric because participation changes?

**Mostly no; revised yes only indirectly.**

| Primary driver (P-008) | Participation role |
|---|---|
| Carry ∧ Trace mutual support on declared connections | Enables thread **followability** — participation enactment presupposed, not the threshold |
| Ratio-readable constraint | L2 register — not participation |
| Coupling + nesting on thread pairs | Nesting **holds** Participation; coupling does not |
| Structural Gathering convergence | “Participating relations” in **read prose**; `needs` are Nested Relation + Form |

**Verdict:** Thread becomes Fabric because **weave convergence and gathering reads succeed**, in a context where participation **already recurs and nests** — not because a new “participation operator” is added.

---

## 5. Observatory and invariant questions (Q8–10)

### Q8 — Render participation rather than objects?

| Layer | O-002 today | Recommendation |
|---|---|---|
| Objects / terms | Condensation on thread-network terms | **Keep** — terms are L0–L1 facts |
| Operations | carries/traces edges, drift/archive | **Keep** — primary instrument (P-008) |
| Participation | Not a separate render layer | **Do not** add participation particles or meters |

**Verdict:** Observatory should render **operational participation** (carrying, tracing, entering scope, recurrence in traversal overlay) — **not** abstract Participation as a second visual ontology. Participation **informs** what “taking part” means; weave engine **shows** it.

### Q9 — Can participation become an invariant read?

| Sense | Verdict |
|---|---|
| L2 scalar invariant | **No** — no participation register; D-014 Law 002 **unknown** |
| L3 parallel read | **Partial** — maturity, recurrence of visits (L5 overlay) — proxies only |
| L0 `conditions.reads` | **Yes** — Participation readability is structural claim on entries |
| Participant enactment trace | **L5** — traversal, frame — labelled overlay |

**Verdict:** Participation is **not** a retrace-stable ratio invariant. It is a **readable condition** at second order when dependencies hold.

### Q10 — Does this change operational calculus? (P-007)

| P-007 fragment | P-009 addition |
|---|---|
| Stratum B carry/trace | Presupposes enactment before Participation condition |
| Stratum C locating/resolving | Parallel — not replaced |
| Weaving composition | **Primary** for Fabric-tier calculus |
| **New clarity** | **Participation spine**: `Carrying → Participation → Recurrence → Crossing → Field of Participation → Nesting` |

Calculus remains **partial** (P-007). P-009 adds a **collective transition arm** — does not replace weave arm.

---

## 6. Relationship to P-003 invariant runtime layers

| Element | P-003 layer |
|---|---|
| Participation (Atlas term) | **Not L0–L4 invariant** — readable condition; practice/second-order |
| Carrying / Retracing enactment | L4 behaviour |
| Recurrence in traversal | L5 overlay |
| Field of Participation | Atlas third-order **structure read** — not runtime scalar |
| Fabric face (O-002) | L6 — gated on thread weave, not participation meter |
| Cognitive Participation | Participant read — **not** invariant |

**Contract rule:** Do not promote Participation to L2 register without Atlas/runtime derivation (D-015B pattern).

---

## 7. Relationship to O-002

| O-002 rule | Participation link |
|---|---|
| Fabric only if carry ∧ trace | **Operational** participation — enactment on declared edges |
| Thread network | Followability — Participation presupposed, not measured |
| Drift / archive | Failed mutual support — degenerative participation reads (Source Drift) |
| No generic field | Correctly avoids painting “collective” without weave evidence |

**Gap (future, not P-009):** Recurrence / enter-scope reads could label L5 overlay — not implemented.

---

## 8. Implications for Observatory evolution

| Priority | Direction |
|---|---|
| **Keep** | Weave-first instrument (O-002, P-008) |
| **Add later** | Enter/scope read when participant focuses term (Participation-adjacent) |
| **Add later** | Recurrence overlay on repeated traversal (L5) |
| **Do not** | Participation heatmap, cognition layer, or collective particles |
| **Do not** | Fabric without thread weave — even if “high participation” metaphor |

---

## 9. Recommendation

| Option | Verdict |
|---|---|
| Participation is **foundational** | **Reject** — derived from Carrying + Presence + Bearing Relation |
| Participation is **derived** | **Accept ✓** |
| Participation is **orthogonal** | **Partial** — orthogonal to Fabric `needs`; **parallel spine** to weave calculus |
| Participation should **not** guide Observatory | **Reject** — guides **scope and recurrence** language; does **not** replace weave renderer |

### Canonical finding (process language)

> **Individual operational participation** is enacted carrying and tracing on declared connections under hold.  
> **Collective behaviour** is **derived** when participation **recurs** and **orders** through field and nesting crossings — then **converges** at gathering/weave reads as Fabric/Web.  
> **Do not assume** collective behaviour from participation alone.

---

## 10. Question summary

| # | Short answer |
|---|---|
| 1 | Bearing relation actively taking part in scope (derived condition) |
| 2 | **Condition** — not operation |
| 3 | Readable/intensifiable; **no invariant scalar** |
| 4 | Second→Third crossing: recurrence organises field; gathering/weave → fabric |
| 5 | Strong: Field, Nesting. Partial: Rhythm, Fabric. Weak: Condensation. No: Pulse |
| 6 | **Partial** — context yes, direct `needs` no |
| 7 | **Indirect** — weave convergence primary |
| 8 | Render **operations** of participation, not Participation object |
| 9 | **Not** L2 invariant; structural read yes |
| 10 | Extends P-007 spine; does not replace weave calculus |

---

## 11. Acceptance

| Criterion | Status |
|---|---|
| Governing P-001–P-008, O-002 | **Met** |
| Atlas diagnosis | **Met** — §1 |
| Dependency position | **Met** — §2 |
| Threshold investigation | **Met** — §3 |
| Carry/Trace/Thread/Fabric/Web | **Met** — §4 |
| P-003, P-007, O-002 | **Met** — §6–7 |
| Recommendation | **Met** — §9 derived + pathway |
| Collective behaviour derived | **Met** |
| No implementation/Atlas/D1 changes | **Met** |
| Report persisted | **Met** |

---

## References

| ID | Path |
|---|---|
| P-008 | `docs/reports/P-008-carry-trace-weaving-investigation.md` |
| P-007 | `docs/reports/P-007-operational-calculus-investigation.md` |
| P-003 | `docs/runtime/INVARIANT_RUNTIME_CONTRACT.md` |
| O-002 | `docs/reports/O-002-fabric-renderer-architecture.md` |
| D-014 | `docs/reports/D-014-runtime-principles-derivation.md` |
| D-015B | `docs/reports/D-015B-derived-ratio-falsification.md` |
| Atlas | `Participation.md`, `Recurrence.md`, `Second Order Crossing.md`, `Field of Participation.md`, `Nesting.md`, `Structural Gathering.md`, `Fabric.md`, `Cognitive Participation.md` |

---

**Status:** P-009 complete. Participation is **derived** and **load-bearing for collective pathway**; **Fabric** requires **weave + gathering convergence**, not participation alone.
