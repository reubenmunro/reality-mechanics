# C-A001 — Pressure Derivation Evidence Report

**Mode:** Read-only. No files edited, no derivation decided, no new practice concepts proposed. Every claim is cited to a file path (and line where useful).

**Important disambiguation surfaced by the evidence:** the token "Pressure" appears in **three distinct senses** across the repository, which the commission does not distinguish. Keeping them separate is itself a finding (see §5).

1. **Atlas term `Pressure`** — a grounded second-order term (`Reality_Mechanics/2_Second/Carrying Conditions/Pressure.md`).
2. **Stewardship methodological "Pressure"** — a labelling category for a repeated-but-unpromoted pattern (`docs/stewardship/CURSOR.md:41`; `docs/stewardship/OPEN_QUESTIONS.md:26`; `docs/stewardship/STEWARDSHIP_V1.md:160`).
3. **Practice concept "Pressure"** — the pre-commission element under derivation (`docs/practice/ARCHITECTURAL_NOTES.md:218-250`, Note 006; brief at `:465-525`).

---

## 1. Relevant Atlas terms found

| Term | Path | Order / kind | Status |
|------|------|--------------|--------|
| Pressure | `Reality_Mechanics/2_Second/Carrying Conditions/Pressure.md` | second / term | stable |
| Relation | `Reality_Mechanics/1_First/Relation.md` | first / **primitive** | stable |
| Ratio | `Reality_Mechanics/1_First/Ratio.md` | first / term | working |
| Strain | `Reality_Mechanics/1_First/Strain.md` | first / term | stable |
| Bearing | `Reality_Mechanics/1_First/Bearing.md` | first / term | stable |
| Availability | `Reality_Mechanics/1_First/Availability.md` | first / term | stable |
| Resolution | `Reality_Mechanics/1_First/Resolution.md` | first / term | stable (order-terminal, first_order) |
| Read | `Reality_Mechanics/1_First/Carrier Mechanics/Read.md` | first / carrier | stable |
| Carrying | `Reality_Mechanics/2_Second/Carrying.md` | second / term | stable |
| Load | `Reality_Mechanics/2_Second/Carrying Conditions/Load.md` | second / term | stable |
| Capacity | `Reality_Mechanics/2_Second/Carrying Conditions/Capacity.md` | second / term | stable |
| Overload | `Reality_Mechanics/2_Second/Carrying Conditions/Overload.md` | second / term | stable |
| Energy | `Reality_Mechanics/2_Second/Carrying Conditions/Energy.md` | second / term | working |

(An Atlas term named **Pressure already exists and is grounded/stable** — `Pressure.md:1-37`.)

---

## 2. Relevant passages / frontmatter relations

**Atlas `Pressure`** (`Pressure.md`)

- `places`: "emergent load becoming locally borne through relation." (`:16`)
- `holds`: `[[Load]], [[Relation]], [[Boundary]], [[Capacity]], [[Compatibility]]` (`:8-14, :17`)
- `pairs`: "No lateral pair is required at this placement yet…" (`:18`)
- `nests`: "inside carrying as the local emergence of load within a relation." (`:25`)
- `reads`: "…load is not only present but locally borne through a relation, making demand, strain, form, or adjustment active at a boundary, body, surface, system, or field." (`:26`)
- `carries`: `[[Retain]], [[Energy]], [[Balance]], [[Overload]], [[Grief]], [[Contend]]` (`:27-33`)
- Body: "the active edge where carrying becomes felt, formed, adjusted, resisted, retained, released, or resolved." (`:42`); "Where pressure generates supportable availability for carrying, it can become readable as [[Energy]]." (`:44`)

**Strain** (first-order, note the shared "press" language)

- `places`: "available distinction under contrast — present and pressing without yet being held or resolved" (`Strain.md:12`)
- `nests`: "names why a distinction becomes worth holding, resolving, or checking" (`:17, :53`)
- `reads`: "present and pressing rather than merely available" (`:18, :57`)
- Structural Role: "names the pressure that remains present while bearing holds it." (`:61`)

**Load**

- Body: "Load becomes [[Pressure]] where it becomes locally borne through relation." (`Load.md:31`)
- `carries`: `[[Capacity]], [[Pressure]], [[Overload]]` (`:21-24`)

**Capacity**

- Body: "Capacity becomes especially visible through [[Pressure]]: load locally borne through relation tests how much carrying can remain compatible…" (`Capacity.md:65`)

**Relation** (primitive)

- `carries` list includes `[[Pressure]]` directly (`Relation.md:27, :87`).
- "Relation names active relation… no prior term inside the system produces it." (`:40-42`)

**Ratio**

- "Ratio names relation made readable between distinguishable terms." (`Ratio.md:35`); pairs with Relation (`:16, :51`). **No frontmatter link to Pressure found.**

**Read** (carrier)

- "Read names recognition of meaningful distinction." (`Read.md:37`) **No frontmatter link to Pressure found.** (Pressure's `reads:` field is the mandatory per-term field, not a dependency on the `Read` term.)

**Resolution**

- `holds`: `[[Bearing]], [[Clearance]]` (`Resolution.md:7-9`); `is_terminal: true`, `terminal_of: first_order` (`:34-37`).

**Stewardship "Pressure"** (different sense)

- "Pressure — a pattern you notice repeating, worth recording, not yet strong enough to act on or promote to a rule." (`docs/stewardship/CURSOR.md:41`; mirrored `STEWARDSHIP_V1.md:160`, `OPEN_QUESTIONS.md:26-34`)

---

## 3. Existing relations among those terms

Direct frontmatter relations (source → field → target):

- `Relation` —carries→ `Pressure` (`Relation.md:87`)
- `Load` —carries→ `Pressure`; `Pressure` —holds→ `Load` (`Load.md:23`; `Pressure.md:9`) — **reciprocal**
- `Capacity` —carries→ `Pressure`; `Pressure` —holds→ `Capacity` (`Capacity.md:72`; `Pressure.md:12`) — **reciprocal**
- `Pressure` —holds→ `Relation`, `Boundary`, `Compatibility` (`Pressure.md:10,11,13`)
- `Pressure` —carries→ `Overload`; `Overload` —holds→ `Pressure` (`Pressure.md:31`; `Overload.md:10`) — **reciprocal**
- `Pressure` —carries→ `Energy`; `Energy` —holds→ `Pressure` (`Pressure.md:29`; `Energy.md:12`) — **reciprocal**

First-order chain (for comparison):

- `Availability` —holds→ `Boundary`; —carries→ `Strain` (`Availability.md:9, :72`)
- `Strain` —holds→ `Availability`; —carries→ `Bearing` (`Strain.md:9, :67`)
- `Bearing` —holds→ `Strain`; —carries→ `Resolution` (`Bearing.md:9, :88`)
- `Resolution` —holds→ `Bearing`, `Clearance` (`Resolution.md:8-9`)

Chain: `Availability → Strain → Bearing → Resolution` (first order).

Second-order carrying neighbourhood: `Carrying —carries→ Load, Capacity, Pressure, Energy, Overload` (`Carrying.md:122,123`) and Load/Capacity/Pressure hold `Carrying`/`Relation`. Note `Load` holds both `Bearing` and `Carrying` (`Load.md:8-10`), linking the first-order strain chain to the second-order pressure neighbourhood.

---

## 4. Does any existing term appear to carry the structure now called "Pressure"?

Evidence points to **two Atlas structures that each carry part of the practice concept's shape** (`ARCHITECTURAL_NOTES.md:226-248`). This report does **not** decide between them — it presents both correspondences with citations:

**Candidate A — the Atlas term `Pressure` itself (second order).**

- Same word; already grounded/stable (`Pressure.md`).
- Structure: "emergent load becoming locally borne through relation" (`:16`); "the active edge where carrying becomes felt, formed, adjusted, resisted, retained, released, or resolved" (`:42`).
- The practice usage — "a steward commissions work because pressure is present… authorises the pressure to be carried by a contract" (`ARCHITECTURAL_NOTES.md:230`) — echoes load *borne / carried through relation*.

**Candidate B — first-order `Strain` (available distinction under contrast).**

- "present and pressing rather than merely available" (`Strain.md:57`); "names why a distinction becomes worth holding, resolving, or checking" (`:53`); "the pressure that remains present while bearing holds it" (`:61`).
- The practice flow `Pressure → … → Resolution` (`ARCHITECTURAL_NOTES.md:234-248`) is structurally parallel to the Atlas first-order chain `Strain → Bearing → Resolution` (`Strain.md:67`, `Bearing.md:88`, `Resolution.md:88`) — a "pressing condition that must be held and then resolved."

**Tension between the two candidates (evidence, not verdict):**

- Candidate A shares the *name* and the *carry-through-relation* wording, but sits at **second order** and its terminal branch is Overload/Energy, not Resolution.
- Candidate B matches the practice *flow shape* to Resolution, but sits at **first order** and does **not** use the name "Pressure" (it uses "pressing"/"pressure" descriptively).
- `Load.md:31` explicitly distinguishes them: "Load becomes [[Pressure]] where it becomes locally borne through relation" — i.e., in the Atlas, `Pressure` is a *specific second-order read of Load-in-relation*, downstream of the first-order strain chain, not identical to `Strain`.

---

## 5. Unknowns

1. **Which sense of "Pressure" Note 006 intends is unstated.** The Atlas term (`Pressure.md`), the stewardship methodological label (`CURSOR.md:41`), and the practice concept (`ARCHITECTURAL_NOTES.md:218`) are three different referents; the brief (`:465-525`) does not say whether the practice concept should map onto the existing Atlas term, and none of the three cross-reference each other.
2. **Order mismatch is unresolved by the evidence.** The practice flow terminates in "Resolution" (first-order terminal, `Resolution.md:34-37`) but is named for "Pressure" (second-order, `Pressure.md:3`). Whether the practice flow is a first-order chain (Strain→Bearing→Resolution) or a second-order carrying read (Load→Pressure→Overload/Energy) is not determinable from repository text.
3. **`Ratio` and `Read` show no direct structural relation to `Pressure`.** Neither appears in Pressure's frontmatter, nor Pressure in theirs (`Ratio.md`, `Read.md`, `Pressure.md`). Their listing as "initial trace candidates" (`ARCHITECTURAL_NOTES.md:487-494`) is not supported or refuted by any existing relation found.
4. **No stewardship audit of the `Pressure` family is recorded.** `docs/stewardship/AUDIT_LOG.md` lists 17 audited families; the Carrying-Conditions cluster (Load, Capacity, Pressure, Overload, Energy) is **not** among them — so no prior stewardship verdict on Pressure's structure exists to cite.
5. **`kind` divergence.** Atlas `Pressure` is `kind: term` (`Pressure.md:4`), while `Relation` is `kind: primitive` (`Relation.md:4`). The brief's outcome option "Pressure is an existing Atlas primitive" (`ARCHITECTURAL_NOTES.md:457`) has no support in the current frontmatter — the existing Atlas `Pressure` is not marked primitive. (Reported as fact; not a derivation decision.)

---

**Scope note:** Per the commission, this report did not decide outcomes 1–4 of the A001 brief, did not propose new concepts, and did not edit any Atlas file. Evidence was gathered read-only.
