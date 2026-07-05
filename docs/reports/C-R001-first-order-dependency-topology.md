# C-R001 — First-Order Dependency Topology

**Mode:** Read-only investigation. No files edited, no governance updated, no Calculus derived, no terminology reconciled, no concepts proposed. The topology below is extracted mechanically from the `needs` frontmatter of the accepted first-order Atlas entries (read-only parse); every figure is reproducible from repository files. Previous chat is not treated as authority.

**Governing question:** What is the actual dependency topology of the accepted first-order Atlas?

**Method note:** 58 accepted entries under `Reality_Mechanics/1_First/` were parsed. Dependency is taken from the `needs` field ("what must already hold", `Root Order.md:12, :44`). `pairs` is treated separately as the repository's *lateral* relation. `carries`/`traces` were read as the forward/backward mirrors of `needs`. Terminology is kept to the repository's own words (dependency, needs, pairs, lineage, cycle, isolated, bottleneck, root); imported node/edge language is avoided (found foreign in C-C001B).

> **Correction from C-R001A:**
> This report's parser assumed `needs` list items are indented beneath the `needs:` key. `Resolution.md` uses **unindented** YAML list items, so this report read its `needs` as empty and wrongly classified **Resolution** as a second internal root. In fact `Resolution` declares `needs: [[Bearing]], [[Clearance]]` and is marked `order_terminal: is_terminal: true` (`Resolution.md:7-9, :34-37`) — it is the **first-order terminal, not a root**. The corrected picture has **one internal root (Relation)**, with `Resolution` near the end of the order.
>
> Claims affected: "two internal roots" / "two root-systems that converge downstream" (Headline, §2, §4, §6, §8) are **incorrect** and should be read as **one root (Relation)** plus the first-order terminal (Resolution). The remaining `needs`-metric findings — **acyclic**, **single connected body**, **Boundary as the most-depended-upon term** — still hold under the corrected parse. Note also (C-R001A) that "Boundary is the pivot" is a *linkage* metric only; per `Root Order.md:143`, "High linkage alone does not make a term a root." See `docs/reports/C-R001A-dependency-projection-review.md`.

---

## Headline findings

- The first-order `needs` structure contains **no dependency cycles**.
- All 58 first-order terms form **one connected dependency body** — there are **no isolated regions**.
- There are **two internal roots** (terms with empty `needs`): **Relation** (`kind: primitive`) and **Resolution** (`kind: term`). Everything else traces to these plus three external ground dependencies (`Seed`, `Root Order`, `Term`).
- The dominant dependency bottleneck is **Boundary** (depended on by 13 terms; its removal separates the structure into 5 regions) — **not** the primitive Relation. The body is held together by *convergence terms*, not only by its roots.

---

## 1. Complete dependency map

Every accepted first-order term and its `needs` (◆ = external to first order: ground/other-order):

| Term | kind | needs |
|------|------|-------|
| Relation | primitive | — (root) |
| Resolution | term | — (root) |
| One | primitive | Seed ◆ |
| First Order | order | Root Order ◆ |
| Thread | carrier | Term ◆, Trace, Read |
| Other | primitive | One, Seed ◆ |
| Asymmetry | term | Relation |
| Clean | term | Relation |
| Place | operation | Relation |
| Connection | term | Relation |
| Clear | term | Relation, Clean |
| Tact | term | Relation, Clean |
| Clearance | term | Relation, Clear |
| Ratio | term | One, Other, Clearance |
| Bounded Asymmetry | term | Asymmetry |
| Emergent Condition | class | Asymmetry |
| Distinction | term | Bounded Asymmetry |
| Operational Condition | class | Bounded Asymmetry |
| Strained Asymmetry | term | Bounded Asymmetry |
| Resolved Asymmetry | term | Strained Asymmetry |
| Boundary | term | Distinction |
| Availability | term | Boundary |
| Apparent | carrier | Boundary |
| Divisible | carrier | Boundary |
| Indivisible | carrier | Boundary |
| In | carrier | Boundary |
| Out | carrier | Boundary |
| Allow | term | Boundary, Availability |
| Not | carrier | Boundary, Availability |
| Strain | term | Availability |
| Threshold | term | Boundary, Strain |
| Bearing | term | Strain |
| Orientation | carrier | Bearing |
| Polarity | carrier | Orientation |
| Shift | term | Resolution, Orientation |
| Hold | term | Resolution |
| Failure | term | Resolution, Bearing |
| Yield | term | Resolution, Bearing |
| Absorb | term | Resolution, Bearing, Strain |
| Release | term | Resolution, Bearing, Strain |
| Transfer | term | Resolution, Bearing, Boundary |
| Carry | carrier | Hold, Connection |
| Trace | carrier | Hold, Connection |
| Read | carrier | Trace |
| Posture | term | Connection, Asymmetry |
| Invisible | carrier | Apparent |
| Visible | carrier | Apparent |
| Notice | carrier | Apparent, Availability |
| Space | term | Clearance |
| Time | term | Clearance |
| Relation Read | term | Clearance, Clear |
| Primitive Carrier | class | Boundary, Clearance |
| Contact | term | Boundary, Clearance, Tact |
| Operation Carrier | class | Primitive Carrier |
| Structural Carrier | class | Primitive Carrier, Read |
| Enter | carrier | Notice, Boundary, Threshold, Allow, Space |
| Attend | carrier | Notice, Enter, Availability |
| First Order Crossing | crossing | First Order, Hold, Connection, Carry, Place |

---

## 2. Independent dependency lineages

Five lineages can be reconstructed from `needs` without interpretation. Two originate from internal roots; three enter from ground.

**Lineage A — Relation (internal root, primitive).** Splits into three sub-lineages:
- **A1 Asymmetry / operational spine:** Relation → Asymmetry → Bounded Asymmetry → { Distinction → **Boundary** → (Availability → Strain → Bearing → Orientation → Polarity; Threshold; Apparent → Visible/Invisible/Notice; In/Out/Divisible/Indivisible/Not/Allow); Strained Asymmetry → Resolved Asymmetry; Operational Condition; Emergent Condition }.
- **A2 Clarity spine:** Relation → Clean → { Clear → Clearance → (Space, Time, Relation Read, …); Tact }.
- **A3 Connection spine:** Relation → Connection → (Carry, Trace → Read); Posture (Connection + Asymmetry).
- Direct: Relation → Place.

**Lineage B — Resolution (internal root, term).** Resolution → { Hold; and the resolution-conditions Failure, Yield, Absorb, Release, Transfer, Shift } — the resolution-conditions also draw on Bearing/Strain/Boundary from Lineage A (see §4).

**Lineage C — Reading order (ground root Seed).** Seed ◆ → One → Other; and Ratio (One + Other + Clearance).

**Lineage D — Order register (ground root Root Order).** Root Order ◆ → First Order → First Order Crossing.

**Lineage E — Term (ground root Term).** Term ◆ → Thread (with Trace + Read).

These lineages are not sealed off — they cross-link at the convergence terms in §4. Presented separately only because each has a distinct origin.

---

## 3. Shared ancestors (where lineages share dependency)

Most-depended-upon first-order terms (count = number of first-order terms whose `needs` include it):

| Ancestor | Depended on by | Role |
|----------|----------------|------|
| **Boundary** | 13 | Shared ancestor of the availability/strain/bearing chain, the apparent chain, the in/out/divisible/not/allow set, and the carrier/contact terms |
| **Resolution** | 7 | Shared ancestor of Hold and all resolution-conditions |
| **Relation** | 7 | Shared ancestor of the asymmetry, clarity, connection, and place sub-lineages |
| **Bearing** | 6 | Shared by Orientation, Failure, Yield, Absorb, Release, Transfer |
| **Clearance** | 6 | Shared by Space, Time, Ratio, Relation Read, Primitive Carrier, Contact |
| **Availability** | 5 | Shared by Strain, Allow, Not, Notice, Attend |
| **Connection** | 4 | Shared by Carry, Trace, Posture, First Order Crossing |
| **Strain** | 4 | Shared by Threshold, Bearing, Absorb, Release |
| Asymmetry / Hold / Apparent / Bounded Asymmetry | 3 each | Sub-spine hubs |

Boundary is the single largest shared ancestor of the first order.

---

## 4. Shared descendants (where lineages genuinely converge)

Terms whose `needs` draw on **more than one lineage or spine** — the true convergence points:

| Convergence term | needs (spanning) | Lineages joined |
|------------------|------------------|-----------------|
| **First Order Crossing** | First Order, Hold, Connection, Carry, Place | D (order) + B (Resolution/Hold) + A3 (Connection) + A1 (Place) |
| **Ratio** | One, Other, Clearance | C (reading) + A2 (clarity) |
| **Absorb / Release** | Resolution, Bearing, Strain | B (Resolution) + A1 (Strain/Bearing) |
| **Failure / Yield** | Resolution, Bearing | B + A1 |
| **Transfer** | Resolution, Bearing, Boundary | B + A1 |
| **Shift** | Resolution, Orientation | B + A1 (via Bearing→Orientation) |
| **Primitive Carrier** | Boundary, Clearance | A1 (Boundary) + A2 (clarity) |
| **Contact** | Boundary, Clearance, Tact | A1 + A2 |
| **Posture** | Connection, Asymmetry | A3 + A1 |
| **Thread** | Term ◆, Trace, Read | E (ground) + A3 (via Trace/Read) |
| **Structural Carrier** | Primitive Carrier, Read | (A1+A2 via Primitive Carrier) + A3 (Read) |
| **Enter** | Notice, Boundary, Threshold, Allow, Space | multiple A1 + A2 (Space) |
| **Attend** | Notice, Enter, Availability | A1 cluster |

The most significant convergences are the **resolution-conditions** (joining the two internal roots, Relation-via-Boundary and Resolution) and **First Order Crossing** (joining four origins before passage to second order). These convergence terms are also what keep the whole first order connected (see §6–§7).

---

## 5. Cycles

**Dependency (`needs`) cycles: none.** The `needs` structure is fully acyclic — no term transitively requires itself.

**Intentional reciprocal relationships (lateral `pairs`), distinct from dependency:** the repository expresses reciprocity through the `pairs` field, not `needs`. Mutual pairs found (A pairs B and B pairs A):

```
Absorb <-> Transfer        Clear <-> Tact             One <-> Other
Allow <-> Enter            Divisible <-> Indivisible  Operation Carrier <-> Structural Carrier
Asymmetry <-> Clearance    Emergent <-> Operational   Ratio <-> Relation
Availability <-> Boundary  Hold <-> Release           Resolved Asym. <-> Strained Asym.
Carry <-> Trace            In <-> Out                 Shift <-> Yield
                           Invisible <-> Visible      Space <-> Time
```

These are **lateral, by design** (co-conditions/contrasts), and do **not** create dependency cycles. One case carries both relations: **Availability ↔ Boundary** is a mutual `pair` *and* a `needs` edge (Availability needs Boundary) — a dependency in one direction plus a lateral pairing, still not a cycle.

(Parsing note: a few self-references — e.g. Contact/Thread pairing their own name — are authoring/prose artefacts, not real laterals; disregarded.)

---

## 6. Isolated regions

**None.** All 58 accepted first-order terms belong to a **single connected dependency body** under `needs`. No accepted first-order term is disconnected from the topology.

The body reaches ground through three external dependencies only: `Seed` (via One/Other), `Root Order` (via First Order), and `Term` (via Thread). Within first order there are no orphans and no detached clusters — the two root-systems (Relation and Resolution) are stitched together by the convergence terms of §4 (chiefly the resolution-conditions, Primitive Carrier, Contact, and First Order Crossing).

---

## 7. Structural bottlenecks

Terms whose removal separates the first-order dependency structure into disconnected regions (count = number of regions remaining after removal):

| Term | Regions after removal | What detaches |
|------|-----------------------|---------------|
| **Boundary** | **5** | The availability→strain→bearing chain, the apparent chain, and the in/out/divisible sets each lose their common ancestor |
| **Bounded Asymmetry** | 3 | Distinction→Boundary subtree; Strained→Resolved; Operational Condition |
| **Clearance** | 3 | Space/Time/Relation Read cluster; Ratio; parts of the carrier/contact bridge |
| **Apparent** | 3 | Visible; Invisible; Notice (and downstream Attend/Enter) |
| Strained Asymmetry | 2 | Resolved Asymmetry detaches |
| Ratio | 2 | Reading-order tail detaches |
| First Order Crossing | 2 | Passage-to-second cluster detaches |
| Asymmetry | 2 | Posture / asymmetry consumers |
| Orientation | 2 | Polarity / Shift path |
| Primitive Carrier | 2 | Operation Carrier / Structural Carrier detach |

**Key observation:** the primitive **Relation** and the second root **Resolution** are **not** among the disconnecting terms — removing either leaves the rest connected, because the convergence terms (Hold links to Resolution; Primitive Carrier/Contact bridge clarity and boundary; resolution-conditions bridge the two roots) hold the body together independently of its origins. **Boundary, not Relation, is the structural pivot of the first order** by pure dependency.

---

## 8. Unknowns

1. **Resolution as a rootless term.** `Resolution` has empty `needs` yet is `kind: term` (not `primitive`), acting as a second origin alongside Relation. Whether this rootlessness is intended (Resolution as co-primitive) or a missing dependency is **not stated in the repository**. This is the single most consequential unknown for the topology.
2. **External origins out of scope.** Three dependencies leave first order (`Seed`, `Root Order`, `Term`); their derivation lives in ground/other-order entries not audited here, so the reading-order (C), order (D), and Term (E) lineages are only partially reconstructable from first-order files alone.
3. **`needs` vs `holds`/`traces` fidelity.** This map uses `needs`; `holds`/`traces` are prose mirrors. Any divergence between the declared `needs` and the prose `holds`/`traces` was not audited and could alter individual edges.
4. **Availability ↔ Boundary double relation.** It is both a `needs` edge and a mutual `pair`; whether the lateral pairing is intended alongside the dependency, or is a labelling overlap, is not stated.
5. **Boundary's dominance.** Whether Boundary's position as top ancestor and sole 5-way pivot is a designed centrality or an emergent accumulation is not commented on in the repository.
6. **`carries` inverse-consistency.** This report did not verify that every `needs` edge has a matching `carries` edge on the parent; mismatches (if any) would indicate undeclared or asymmetric dependencies.

---

## Acceptance — what the Architect and Steward can now see

Without intuition or terminology, the accepted first-order Atlas has this dependency structure:

- **Acyclic, single connected body of 58 terms**, resting on **two internal roots (Relation, Resolution)** and three external ground dependencies.
- **Two root-systems that converge downstream** — chiefly at the resolution-conditions and at First Order Crossing — rather than one hierarchy from a single origin.
- **Boundary is the dependency pivot** (13 dependents; 5-way disconnector), exceeding the primitive Relation; the body's cohesion comes from convergence terms, not from its roots.
- **Reciprocity is carried laterally in `pairs`, never as a `needs` cycle** — the dependency and lateral structures are cleanly separated.

The one structural question the evidence raises but cannot answer is **why Resolution is a rootless term**; that, and the external ground origins, are where first-order dependency cannot be fully reconstructed from first-order evidence alone.

---

**Scope note:** This contract created only this report (`docs/reports/C-R001-first-order-dependency-topology.md`). No repository files were edited, no governance updated, no topology invented (all figures are parsed from `needs` frontmatter and reproducible), no repository changes proposed, no convergence decision made, and no Calculus derived. Imported graph-theory terminology was avoided; unknowns are stated rather than resolved.
