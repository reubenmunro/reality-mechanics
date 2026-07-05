# C-F001 — Frontmatter Field Characterisation

**Mode:** Read-only investigation. No files edited, no governance updated, no Calculus derived, no Atlas terms proposed, no fields redefined. Every claim is cited; quantitative figures are parsed read-only from first-order frontmatter and reproducible. Previous chat is not treated as authority.

**Governing question:** What structural read does each Atlas frontmatter field perform?

**Constraint compliance:** No meanings are invented (field meanings are taken from `Common Term Structure.md` and the structure contract); `Order : Structure : Read` is not assumed; `:` is not promoted as calculus; and graph counts are used only as evidence about **field encoding**, never treated as structural meaning.

---

## Headline

The repository **does** state a coherent grammar for the fields: `Common Term Structure.md` defines each field as "another structural read of the same proceeding operation," calibrated "from different structural positions" (`:61-67`). By that intent the fields form a reading grammar, and the runtime contract enumerates it: a term "must become readable … through order, relations, dependency, carry, trace, pair, nest, and reads" (`atlas-structure-contract.mjs:203`).

**But the intent is not matched by usage for the upstream fields.** At the link level, across the 57 first-order terms that carry them: **`holds` lists exactly the same targets as `needs` in 57/57 cases**, and **`traces` equals `needs` in 50/57 (extends it in 7)**. The three "backward/support" fields (`needs`, `holds`, `traces`) are therefore **near-redundant in practice**, distinguished only by prose gloss. `pairs` is **polyfunctional**. So the grammar is coherent *as declared* but **overloaded and under-differentiated in the upstream region**, which is the area a Calculus derivation would most rely on.

---

## 1. How each field is defined or constrained

**Canonical definitions — `Common Term Structure.md` ("Structural Reads", `:61-107`):**

| Field | Definition (verbatim) | Source |
|-------|-----------------------|--------|
| Places | "calibrates where the operation becomes available" | `Common Term Structure.md:69-71` |
| Holds | "calibrates what presently bears the operation" | `:73-75` |
| Pairs | "calibrates what completes the read of the operation where a paired condition is recoverable" | `:77-79` |
| Traces | "calibrates the recoverable dependency through which the operation can be retraced" (+ "continues as far as structural retrace requires") | `:81-85` |
| Nests | "calibrates where the operation remains stable enough to participate in larger or smaller reads" | `:87-89` |
| Reads | "calibrates how another participant can recover the operation from the current record" | `:91-93` |
| Carries | "calibrates what the operation makes available for downstream retrace" (+ "Carry records demonstrated continuation … remains an opening until a downstream trace confirms it") | `:101-107` |

**`needs`** is defined not in this block but at the top level of the record (`Common Term Structure.md:124`, YAML convention) and characterised by `Root Order.md:12, :44`: "what must already hold before later terms can become available," with "Dependency placement follows the **nearest** condition that must already hold" (`Root Order.md:141`).

**Contract constraints — `atlas-structure-contract.mjs`:**
- `RELATION_FIELDS = ["holds", "traces", "carries", "pairs", "nests", "reads"]` (`:23-30`) — the frozen relational set. Note: **`needs` and `places` are *not* in it.** `needs` is dependency; `places` is the definitional/self read.
- `termRule`: readability "through order, relations, dependency, carry, trace, pair, nest, and reads" (`:203`).
- Wikilink rule: "A wikilink performs structural work. It holds, traces, pairs, nests, reads, or carries the current condition" (`Common Term Structure.md:158-160`).

**Framing constraint:** "Each heading provides another structural read of the same proceeding operation … calibrate the record from different structural positions … Each section preserves the same operation through its own read" (`Common Term Structure.md:63-67`).

---

## 2. What each field reads structurally

| Field | Structural read | Position relative to the term |
|-------|-----------------|-------------------------------|
| `places` | Its own definition — where it becomes available | self / definitional |
| `needs` | Immediate dependency ("nearest condition that must hold") | upstream, immediate |
| `holds` | What presently bears it | upstream, present support |
| `traces` | Recoverable dependency for retrace (may extend beyond immediate) | upstream, full retrace |
| `carries` | What it makes available downstream (demonstrated only) | downstream, forward |
| `pairs` | What completes the read laterally | sideways, co-condition |
| `nests` | Where it stays stable across larger/smaller reads | containment / scale |
| `reads` | How a participant recovers it | recognition / descriptive |

---

## 3. Directional / lateral / vertical / recursive / terminal / descriptive

| Field | Classification (from its definition) |
|-------|--------------------------------------|
| `needs` | **Directional (backward), immediate** — nearest upstream dependency |
| `holds` | **Vertical (present support)** — "what presently bears" |
| `traces` | **Directional (backward), recursive** — "continues as far as structural retrace requires" (`Common Term Structure.md:85`) |
| `carries` | **Directional (forward)** — downstream availability, demonstrated |
| `pairs` | **Lateral** — co-condition that "completes the read" |
| `nests` | **Vertical / recursive (scale)** — "larger or smaller reads" |
| `reads` | **Descriptive (recognition)** — recovery condition |
| `places` | **Descriptive (self / definitional)** — where it becomes available |

**Terminal** is *not* expressed by any of these eight fields. Terminality is a separate top-level marker: `order_terminal.is_terminal` (e.g. `Resolution.md:34-37`), and crossings use `kind: crossing`. So "terminal" is outside the field grammar under review.

---

## 4. How the fields differ from one another

Per `Common Term Structure.md:63-67`, they are **the same operation read from different structural positions**: self (`places`), present support (`holds`), immediate upstream (`needs`), full retrace (`traces`), forward (`carries`), lateral (`pairs`), scale (`nests`), recognition (`reads`). The intended division of labour is **position**, not different content.

That intended difference holds cleanly for **five** fields — `places`, `carries`, `pairs`, `nests`, `reads` occupy distinct positions and generally carry distinct content. It **does not hold** for the three upstream fields, which carry the same content (see §6–§7).

---

## 5. Do the fields form a coherent grammar of structural reading?

**As declared: yes.** The repository explicitly asserts a grammar — one operation, read from eight positions (`Common Term Structure.md:61-67`), enumerated by the runtime `termRule` (`atlas-structure-contract.mjs:203`) and frozen as `RELATION_FIELDS` + `needs` + `places`. Each field has a stated, distinct structural read (§2). This is a genuine, intentional reading grammar, not an accidental set of tags.

**As used: partially.** The forward/lateral/scale/recognition/self fields realise the grammar; the upstream trio collapses (§7). So the grammar is coherent in design and coherent for the downstream and lateral reads, but **under-differentiated where it points upstream** — precisely the region a dependency-order Calculus depends on.

---

## 6. Where field usage is inconsistent or ambiguous

- **`holds` ≡ `needs` at the link level: 57/57 first-order terms.** `holds` never adds or drops a target relative to `needs`; the "present bearing vs must-hold" distinction (`Common Term Structure.md:73-75` vs `Root Order.md:44`) exists only in prose.
- **`traces` ⊇ `needs`, identical in 50/57, extends in 7.** The "full retrace can extend" behaviour (`Common Term Structure.md:85`) is real but rare (12%); in the majority `traces` merely repeats `needs`.
- **`pairs` is polyfunctional.** It is used for: genuine lateral contrast (Carry `pairs` Trace); explicit **absence** ("No lateral pair is required", `Place.md:16`, `Resolution.md:13`); a target that is also a **dependency** (Availability `pairs` Boundary **and** `needs` Boundary); and occasional **self-reference** parsing artefacts (a term's own name). Four different uses in one field.
- **`places` is restated.** The frontmatter `places` value is typically repeated verbatim in a prose "## Places" section — duplication rather than a second read.
- **Encoding is not uniform.** `needs`/`carries` list items are usually indented under the key, but some records (e.g. `Resolution.md:7-9`) use **unindented** YAML list items — a formatting inconsistency that changed a downstream result (C-R001A) even though it is meant to be semantically neutral.
- **`carries` scope varies.** Some `carries` lists stay immediate; others reach far cross-order (e.g. Boundary `carries` higher-order and practice terms), so `carries` mixes immediate forward availability with distant downstream reach in one field.

## 7. Is any field currently overloaded?

**Yes — two loci.**

1. **The upstream trio `needs` / `holds` / `traces` is overloaded/redundant.** All three encode backward support, and the link data shows they largely coincide: `holds`=`needs` (57/57), `traces`=`needs` (50/57, extends 7). Three fields with three stated meanings ("nearest must-hold", "present bearing", "recoverable retrace") but effectively **one shared target set**. This is the clearest overload, and it sits exactly where dependency-order reasoning would draw.
2. **`pairs` is overloaded by function** — carrying lateral contrast, absence declarations, dependency overlaps, and self-references (§6). One field, several jobs.

(`carries` is stretched by scope rather than overloaded by meaning; `places`/`nests`/`reads` are not overloaded.)

## 8. Unknowns

1. **Intended division of `needs` vs `holds` vs `traces`.** Whether these are meant to be three distinct reads (immediate / present-bearing / full-retrace) that *happen* to coincide, or whether the coincidence indicates redundant fields, is not stated. The prose asserts a distinction the link data does not show.
2. **`places` status.** Whether `places` is a relation field, a definitional self-read, or both — it sits in the `conditions` block but is excluded from `RELATION_FIELDS` (`atlas-structure-contract.mjs:23-30`).
3. **`traces` depth rule.** "as far as structural retrace requires" (`Common Term Structure.md:85`) is not operationalised — what determines when `traces` should extend beyond `needs` is unspecified (only 7/57 do).
4. **`pairs` "No lateral pair" declarations.** Whether an absence-of-pair statement is structural content or prose is not settled.
5. **`carries` reciprocity.** Whether every `carries` must mirror a downstream `needs` (and vice versa) is not stated; unverified here (flagged in C-R001A).
6. **Field completeness.** Whether `order`, `kind`, `ai_role`, `order_terminal` also perform structural reads (they are called "operational labels", `Common Term Structure.md:141`) or are metadata is not fully resolved.
7. **Encoding normativity.** Whether YAML indentation style is required to be uniform (given its downstream effect) is unaddressed.

---

## Acceptance — the decision this report enables

The Architect and Steward can now decide:

- **The frontmatter fields already form a coherent structural reading grammar *in stated intent*** — one operation read from eight positions, explicitly defined in `Common Term Structure.md` and enforced as a contract (`atlas-structure-contract.mjs`). The **downstream, lateral, scale, recognition, and self** reads (`carries`, `pairs`, `nests`, `reads`, `places`) realise that grammar with distinct content.
- **But the *upstream* region of the grammar must be clarified before Calculus derivation relies on it.** `needs`, `holds`, and `traces` are near-redundant in practice (57/57 and 50/57 coincidence), and `pairs` is polyfunctional. A Calculus that treats these as three distinct structural reads would be reading a distinction the records do not currently carry.

So: **coherent grammar, under-differentiated upstream.** The evidence supports proceeding to derive from the *forward/lateral/recognition* reads, but recommends the `needs`/`holds`/`traces` division of labour (and the `pairs` roles) be clarified first. This report does not perform that clarification (per mode).

---

**Scope note:** This contract created only this report (`docs/reports/C-F001-frontmatter-field-characterisation.md`). No files edited, no governance updated, no Calculus derived, no fields redefined, no meanings invented (definitions are quoted from `Common Term Structure.md` / the structure contract), `Order : Structure : Read` not assumed, `:` not promoted, and graph counts used only as evidence about field encoding. All figures are reproducible; unknowns are stated rather than resolved.
