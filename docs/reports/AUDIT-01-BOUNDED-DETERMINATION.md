# Audit 01 Bounded Repair — Pre-edit Determination Record

Commission source: `Kimi_Agent.zip`, generated against commit `8ee9d7a`.

Repository state at intake:

- Repository: `reubenmunro/reality-mechanics`
- Audited commit resolves to `8ee9d7aa56da5b94c5ec11f52076ef504bce0aec`.
- Intake `HEAD` was exactly the audited commit; `HEAD` had not moved.
- Existing unrelated untracked files were present and are outside this commission.

## Accepted repairs

| Item | Classification | Repair form |
| --- | --- | --- |
| A1 | ACCEPT | Edit only the dependency-spine diagram in `Reality_Mechanics/00_ROOT.md` to insert Distinction between Bounded Asymmetry and Boundary. |
| A2 | ACCEPT | Edit the same diagram to separate the Boundary branch from the Strained Asymmetry → Resolved Asymmetry → Coupling branch. |
| B2 | ACCEPT | Frontmatter repair. Add `ground.passage-condition` to Allow's `needs.targets` and `holds.targets`, and mirror it in `holds.read`. The live file already names Passage Condition in both Holds prose and `traces.targets`; Passage Condition also carries Allow. Removing the prose would discard an already retraceable relation. |
| B3 | ACCEPT | Prose repair. Add `[[Translation Boundary]]` to the two Holds statements in each of the seven listed entries. Their `needs.targets`, `holds.targets`, `holds.read`, and `traces.targets` already agree, so removing frontmatter would discard declared structure. |

These repairs restore representation parity only. They do not determine a new status, pair, cycle treatment, definition, terminality rule, or graph-normalisation convention.

## Held finding A3 — Place in the terminal row

Classification: **HELD**. No edit is authorised.

### Current representation

The root dependency spine places `Hold   Carry   Place` together below Resolution. In the live graph:

- `first.hold` needs `first.resolution`.
- `first.carry` needs both `first.hold` and `first.connection`.
- `first.place` needs and traces only `first.relation`.

Place is therefore shown beside terminal/carrying terms even though its declared dependency begins directly at Relation.

### Relevant Atlas convention

Common Term Structure defines `needs` as what must already be available, `holds` as what presently bears the determination, and `traces` as the recoverable dependency. The root document also calls this diagram a dependency spine. Under that convention, visual adjacency should not silently assert an undeclared dependency.

### Minimum available alternatives and consequences

1. Move Place to a direct branch from Relation.
   - Consequence: the diagram matches Place's declared need and trace.
   - Consequence: the current working-postulate/first-order operational grouping of Hold, Carry, and Place is no longer expressed by the terminal row.
2. Keep Place in the terminal row and add a note that the row is an operational read, not a dependency edge from Resolution or Hold.
   - Consequence: preserves the visible `hold / carry / place` grouping.
   - Consequence: the diagram mixes dependency and operational grouping and therefore requires an explicit visual or textual distinction.
3. Keep the diagram unchanged.
   - Consequence: preserves the existing presentation.
   - Consequence: leaves the current dependency-spine ambiguity unresolved.

### Recommended determination

**Recommendation:** choose alternative 1 unless the owner determines that the terminal row is intentionally an operational overlay. If that overlay is intentional, choose alternative 2 and mark it explicitly. Do not change Place's graph fields merely to fit the drawing.

## Held finding B1 — Seed's empty holds field

Classification: **HELD**. No edit is authorised.

### Current representation

`ground.seed` has empty `needs.targets` and `holds.targets`. Its authored Holds read and prose say Seed is held by Ground, while `traces.targets` contains `ground.ground`. The entry also says Seed and Ground are outside the dependency spine and describes Ground as the acknowledged prior.

### Relevant Atlas convention

Common Term Structure distinguishes the reads: `needs` records what must already be available, `holds` records what presently bears the determination, and `traces` records recoverable dependency, which may extend beyond immediate need. Empty targets are represented explicitly. The standard therefore permits trace to differ from need, but the current empty `holds.targets` conflicts with the authored Holds read unless Ground-level acknowledged-prior semantics are an explicit exception.

### Minimum available alternatives and consequences

1. Add `ground.ground` to `holds.targets` only.
   - Consequence: aligns the Holds field with its authored read and prose while preserving Seed's empty `needs.targets` and its exclusion from the dependency spine.
   - Consequence: records Ground as presently bearing Seed even though Ground is treated as an acknowledged prior rather than an ordinary dependency.
2. Add `ground.ground` to both `needs.targets` and `holds.targets`.
   - Consequence: produces ordinary need/hold/prose parity.
   - Consequence: risks placing Seed into the dependency structure that its prose explicitly says it is outside.
3. Keep both arrays empty and record a Ground-level exception to target mirroring.
   - Consequence: preserves the current acknowledged-prior treatment.
   - Consequence: requires an explicit convention so the empty target is not read as an accidental omission.
4. Remove the claim that Seed is held by Ground from the Holds read and prose, leaving Ground only in trace.
   - Consequence: makes the empty Holds field literal.
   - Consequence: weakens the current determination that Ground presently bears Seed and would require more prose change than the other alternatives.

### Recommended determination

**Recommendation:** choose alternative 1 if "held by Ground" is intended literally; it restores Holds parity without turning Ground into an ordinary prerequisite. Choose alternative 3 only if the owner determines and records an explicit Ground-level acknowledged-prior exception. Alternatives 2 and 4 have wider structural or semantic consequences.
