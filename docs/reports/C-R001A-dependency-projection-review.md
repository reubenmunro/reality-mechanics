# C-R001A — Dependency Projection Review

**Mode:** Read-only review. No Atlas files edited, no governance updated, no Calculus derived. This report reviews `docs/reports/C-R001-first-order-dependency-topology.md` against the full Atlas relation model. Findings are reproducible from repository files.

**Governing question:** What did C-R001 actually measure, and what did it not measure?

---

## Headline

C-R001 measured **one** of the Atlas's relation fields — `needs` — and reported it accurately **except for one file**, where a parser assumption about YAML indentation dropped real dependencies. That single defect produced C-R001's most load-bearing structural claim, **"two internal roots (Relation, Resolution)," which is false.** `Resolution` declares `needs: [[Bearing]], [[Clearance]]` and is marked `order_terminal: is_terminal: true` (`Resolution.md:7-9, :34-37`) — it is the **first-order terminal, not a root**. Only **Relation** is a true internal root.

The durable metric findings (acyclic, single connected body, Boundary most-linked) survive correction. The **interpretation** ("Boundary is the pivot") does not follow from them, and the repository itself warns against the inference.

---

## 1. What C-R001 validly proves

Confirmed under a corrected parser (robust to both indented and unindented YAML list styles):

- **The first-order `needs` structure has no dependency cycles.** ✔ (holds even with Resolution's restored edges).
- **All 58 first-order terms form one connected dependency body; no isolated regions.** ✔
- **Boundary is the most-depended-upon first-order term** (13 dependents) and a genuine disconnection point in the `needs` projection. ✔
- **Reciprocity is carried laterally in `pairs`, not as a `needs` cycle** — the acyclic-dependency / lateral-reciprocity separation is real. ✔
- Boundary's linkage dominance is **direction-robust**: it also tops the `carries` (forward) count (35), with Bearing (28), Trace (23), Relation (16) below it.

These are valid facts **about the `needs`/`carries` projections**.

## 2. What C-R001 does not prove

- **It measured one relation field.** The Atlas relation model has at least seven (`needs`, `holds`, `traces`, `carries`, `pairs`, `nests`, `reads`) plus accepted invariants and audited families. C-R001 used `needs` (and `pairs` separately). It says nothing about a combined model.
- **It contained a measurement defect.** For `Resolution.md` (unindented list items) the parser returned empty `needs`/`carries`. Corrected: `needs: Bearing, Clearance`; `carries: Hold, Failure, Yield, Release, Transfer, Absorb, Shift, …` (`Resolution.md:7-9, :19-33`). **Exactly one first-order file was affected**, but it was consequential.
- **Its root claim is therefore wrong.** "Two internal roots (Relation, Resolution)" and "two root-systems that converge downstream" do not hold. There is **one internal root (Relation)**; `Resolution` is the first-order **terminal** (`order_terminal.is_terminal: true`, `terminal_of: first_order`, `Resolution.md:34-37`).
- **It did not read the terminal/crossing markers.** `Resolution` (`order_terminal`) and `First Order Crossing` (`kind: crossing`) carry explicit order-position metadata that a `needs`-only pass ignores.
- **It did not weight invariants or families.** Accepted invariants attach to Relation and Connection (C-CON001; `INVARIANTS.md:41,44`), and `AUDIT_LOG.md` records audited families — neither enters a link-count.
- **It did not separate generative from reading order.** `needs` is the backward/reading projection ("what must already hold"); the Atlas explicitly distinguishes this from generative (forward) order (`Root Order.md:105-114`). Backward link-counting distorts the roles of the two order-*ends*.

## 3. Is "Boundary is the pivot" supported only within `needs`?

**Boundary's high *linkage* is supported in both `needs` and `carries`** (top of each), so as a *linkage* statement it is robust — not a `needs`-only artefact.

**But "pivot"/"centre" is a linkage claim, not a structural-order or meaning claim, and the repository explicitly rejects the inference:** "High linkage alone does not make a term a root" (`Root Order.md:143`); "Dependency placement follows the nearest condition that must already hold. Readable sequence may present dependency order but does not create or govern it" (`Root Order.md:141`). By the Atlas's own rule, Boundary being the most-linked term does **not** make it a root, centre, or governing origin. It is a **high-linkage articulation term within the dependency projection** — which is what the evidence supports, and no more.

## 4. Do Relation and Resolution need a different structural reading than bottleneck analysis?

**Yes — and this is where C-R001's instrument mismatched its objects.**

- **Relation** is `kind: primitive`, the generative source (`Relation.md:40-46`). Removal/disconnection metrics inherently **under-weight a source**: because the body is cross-linked by convergence terms, removing the origin does not fragment it, so Relation scored *low* on disconnection despite being the origin. Relation's actual weight shows in **forward `carries`** (16) and in **accepted invariants**, not in `needs`-in. A root must be read as an origin, not scored as a bottleneck.
- **Resolution** is the first-order **terminal** (`Resolution.md:34-37`), not a co-root. Its high `needs`-in count reflects **convergence at closure** (many conditions resolve into it), which a backward metric mistook for root-like origin. Reading a terminal with root vocabulary is what produced the error.
- The Atlas frames these as the two **ends of a movement**: generative order runs forward, reading order runs backward (`Root Order.md:105-114`). Relation (source) and Resolution (terminal) are precisely the positions a single backward link-metric cannot characterise correctly. They require **order reading** (generative + terminal position), not linkage counting.

## 5. Is a fuller structural topology contract required?

**Yes.** The `needs` projection is a valid first slice but insufficient to characterise structural order. A fuller contract should:

1. Project **all seven relation fields** (`needs`, `holds`, `traces`, `carries`, `pairs`, `nests`, `reads`) and cross-check `needs`↔`carries` reciprocity (declare where a `needs` edge lacks a matching `carries`, and vice versa).
2. Incorporate **order-position metadata** — `order_terminal`, `kind: crossing`, `kind: primitive` — so sources and terminals are read as such, not link-scored.
3. Weight **accepted invariants** and **audited families** (`INVARIANTS.md`, `AUDIT_LOG.md`) alongside link structure.
4. Distinguish **generative order from reading order** explicitly (`Root Order.md:105-114`), rather than treating backward dependency as the whole structure.
5. Use a **parser robust to YAML formatting variants** (the defect found here), and validate parse coverage against every file before drawing structural conclusions.

(Recommended, not derived — per mode.)

---

## Acceptance — the three levels the Architect asked to separate

- **Dependency metrics** — counts and removal-impact in a single relation field. C-R001 delivered these for `needs` (accurately, except the `Resolution.md` parse). *Boundary tops them.* Valid at this level.
- **Dependency meaning** — what `needs` *means*: "what must already hold," a **backward/reading** projection; and the Atlas's own caution that **linkage ≠ root** (`Root Order.md:141-143`). At this level, "Boundary is the pivot" is **not** licensed — high linkage is not centrality.
- **Structural order** — the full generative+reading order across all relations, invariants, families, and terminal/crossing/primitive markers. C-R001 **did not measure this**, and its one structural claim (two roots) was an error of reading a **terminal** (Resolution) and a **source** (Relation) through a backward link-metric.

**Bottom line for the Architect:** accept C-R001's `needs`-metric evidence (with the `Resolution` correction), but **not** its structural interpretation. Boundary is the highest-linkage term, not a proven centre; Relation is the sole internal root; Resolution is the first-order terminal. A fuller, multi-relation, order-aware contract is required before any centrality or ordering claim is made.

---

**Flag (no file edited):** `docs/reports/C-R001-first-order-dependency-topology.md` currently states "two internal roots (Relation, Resolution)" and related claims that this review finds incorrect (`Resolution` needs Bearing + Clearance and is the first-order terminal). Per mode I have not edited it; a correction note can be added on your authorisation, mirroring the C-C001 correction.

**Scope note:** This contract created only this report (`docs/reports/C-R001A-dependency-projection-review.md`). No Atlas files edited, no governance updated, no Calculus derived. All findings are cited and reproducible; the single parse defect was verified against source (`Resolution.md`).
