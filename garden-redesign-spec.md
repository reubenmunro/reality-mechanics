# Garden Redesign Spec

## Context

The Reality Mechanics Atlas garden is a set of three Cloudflare Workers that cycle through Atlas notes and propose edits:

- **api-gardener** — picks an entry, calls OpenAI, writes a proposal via the garden API
- **api-steward** — evaluates pending proposals, signals light/shade/needs_preparation
- **api-applier** — applies approved proposals to the Atlas via the MCP `update_entry_section` tool

All three live in `~/Reality_Mechanics_Workspace/`. The main website worker (`main-website-worker.js` in `.atlas-publisher/`) hosts the garden API and KV storage.

The garden is currently paused (pace set to 1000 minutes). Do not re-enable it until this redesign is complete.

---

## What is broken

### 1. No shared contract between workers

Each worker defines its own version of what a valid proposal looks like. The gardener writes a flat string to `proposed_changes`. The steward parses that string with a regex. The applier parses it again differently. The gaps between these interpretations cause cascading failures.

### 2. Gardener produces thin proposals

The gardener's OpenAI schema requires `replacement_text` but imposes no quality floor. The AI frequently returns one-liners ("Contact pairs are not yet named.") that are structurally valid but too thin to apply. There is no pre-flight check before writing.

### 3. Steward's `needs_preparation` option creates an infinite cycle

When the steward's OpenAI judge returns `needs_preparation`, the proposal is flagged. The gardener sees the entry as un-tended and picks it up again next run. If the gardener generates another thin proposal, the steward flags it again. This cycle runs every minute and produced 191 stuck proposals before the garden was paused.

The local `hasPreparedReplacement` check already catches truly malformed proposals. Giving the AI judge a `needs_preparation` option is redundant and dangerous.

### 4. Steward judges blind

The steward receives the proposal but not the entry's current section content. It cannot evaluate whether the proposed replacement is actually an improvement. It is judging in the dark.

### 5. Proposals:index capped at 200

The index is sliced to 200 on every write. With 464 notes cycling through the garden, old proposals silently drop off. No entry with a dropped proposal knows it was ever tended.

### 6. No backoff for repeated failures

If an entry consistently produces bad proposals, the garden memory has no mechanism to back off. The entry stays in rotation indefinitely.

---

## The canonical proposal template

The file `garden-agent-prompt.md` (in `.atlas-publisher/`) defines the correct proposal format. This is the source of truth. All three workers must agree on it.

A proposal's `proposed_changes` field must follow this structure:

```
## What I found

{One paragraph. Specific — cite section names, quote existing text.}

## What I propose

### {Section name}

**Current text:**
> {exact quote from the current section body, or "missing" if absent}

**Proposed text:**
{Complete replacement text. Not a description — the actual content to write.
Must be at least 50 words. Must stand alone as valid Atlas content.
No placeholder language ("to be completed", "not yet named", "TBD").
No headings inside the replacement.}

**Why:** {One sentence. Must trace to a named RM structural concept.}

## What I am not sure about

{Honest flags for Reuben. Or "Nothing flagged."}

## Reciprocity issues found

{Specific carry/trace breaks by term name. Or "None found."}
```

For clean passes (no changes needed):

```
## What I found

This term passed all checks: reciprocity holds, sections are complete,
frontmatter aligns with body, no source drift detected.

## What I propose

No changes required.

## What I am not sure about

Nothing flagged.

## Reciprocity issues found

None found.
```

---

## Changes required

### A. Create `garden-schema.mjs` (shared across all workers)

Create a single shared module at `~/Reality_Mechanics_Workspace/garden-schema.mjs` that all three workers import. It should export:

```javascript
// Canonical field names and constraints
export const PROPOSAL_CONSTRAINTS = {
  replacementMinWords: 50,
  replacementMaxChars: 3600,
  notesMaxChars: 260,
  prohibitedPhrases: ["not yet named", "to be completed", "tbd", "todo", "placeholder"],
};

// Shared validation — used by gardener (pre-flight) AND steward (local check)
export function validateProposal(proposed_changes) {
  const sectionMatch = proposed_changes.match(/^### (.+)$/m);
  const currentMatch = proposed_changes.match(/\*\*Current text:\*\*\s*\n>([\s\S]*?)\n\n\*\*Proposed text:/m);
  const proposedMatch = proposed_changes.match(/\*\*Proposed text:\*\*\s*\n([\s\S]*?)\n\n\*\*Why:/m);
  const whyMatch = proposed_changes.match(/\*\*Why:\*\* (.+)/);

  const section = sectionMatch?.[1]?.trim() || "";
  const proposed = proposedMatch?.[1]?.trim() || "";
  const why = whyMatch?.[1]?.trim() || "";

  const wordCount = proposed.split(/\s+/).filter(Boolean).length;
  const hasProhibited = PROPOSAL_CONSTRAINTS.prohibitedPhrases
    .some(p => proposed.toLowerCase().includes(p));
  const hasHeading = /^#{1,6}\s/m.test(proposed);

  return {
    valid: Boolean(section && proposed && why && wordCount >= PROPOSAL_CONSTRAINTS.replacementMinWords && !hasProhibited && !hasHeading),
    section,
    proposed,
    why,
    wordCount,
    reason: !section ? "missing section" :
            !proposed ? "missing proposed text" :
            !why ? "missing why" :
            wordCount < PROPOSAL_CONSTRAINTS.replacementMinWords ? `replacement too thin (${wordCount} words, need ${PROPOSAL_CONSTRAINTS.replacementMinWords})` :
            hasProhibited ? "replacement contains placeholder language" :
            hasHeading ? "replacement contains heading" : "ok",
  };
}

// Parse for applier
export function parseForApply(proposed_changes) {
  const v = validateProposal(proposed_changes);
  if (!v.valid) return null;
  return { section: v.section, replacement: v.proposed };
}
```

### B. Gardener changes (`api-gardener/src/index.js`)

**Prompt update:** The OpenAI system prompt must explicitly require:
- `replacement_text` must be the complete rewritten body of the section — minimum 50 words
- No placeholder language
- No headings inside the replacement
- The `Why` field must name a specific RM structural concept (e.g. "carry-trace reciprocity", "dependency order")

**Proposal format:** The gardener must write `proposed_changes` using the canonical template above, not the current flat string format.

**Pre-flight check:** Before calling `write_proposal`, the gardener must run `validateProposal` on the assembled `proposed_changes`. If it fails:
- Log the failure reason to garden memory
- Do NOT write the proposal
- Skip to the next candidate entry

**Pass the current section content to OpenAI:** The gardener already fetches the entry via the Atlas. It should extract the current body of the target section and include it in the prompt so the model can write an informed replacement. The `replacement_text` should be a rewrite of that content, not invented from scratch.

**Backoff on repeated failures:** Add `failCount` to the garden memory object. Increment it when pre-flight fails or when a proposal comes back `needs_preparation` from the steward. If `failCount >= 3`, skip the entry for `7 * gardenerInterval` before retrying. Reset `failCount` to 0 when a proposal is approved.

### C. Steward changes (`api-steward/src/index.js`)

**Remove `needs_preparation` from the OpenAI action enum entirely.** The AI judge should only return: `"none"`, `"light"`, or `"shade"`.

Update the `localJudgement` function to use `validateProposal` from `garden-schema.mjs` instead of the current `hasPreparedReplacement` regex. If local validation fails, return `shade` (not `needs_preparation`) with a note explaining why — this surfaces the issue without creating a cycle.

**Pass current content to the judge:** Before calling OpenAI, fetch the entry's current section content via the Atlas MCP (or via the proposals API — the entry ID is in the proposal). Pass both current text and proposed text in the judge prompt so the model can evaluate the actual change, not just the proposal metadata.

The judge prompt should ask: "Is this proposed replacement structurally sound for a Reality Mechanics Atlas note? Does it improve on the current text? Is it complete enough to apply?"

### D. Applier changes (`api-applier/src/index.js`)

Replace the current `parseConcreteProposal` regex with `parseForApply` from `garden-schema.mjs`.

Keep all existing `groundCheck` constraints (replacement length, no headings, no placeholder language, notes length) — they are correct. They will now rarely fire because the gardener pre-flight enforces the same rules.

### E. Proposals index

Remove the `.slice(0, 200)` cap or raise it to 1000. Add a `cleanupOldDiscarded` function that runs on each gardener cycle and removes proposals with `status === "discarded"` older than 30 days from the index (but not from KV storage). This keeps the index lean without dropping active proposals.

---

## What NOT to change

- The pace/timing system — it works, just needs a sensible default (start at pace=6, every 10 minutes)
- The applier's use of `update_entry_section` MCP tool — the chain from proposal to Atlas edit is correct
- The garden API endpoints on the main worker — they are stable
- The KV storage structure (`proposal:<id>`, `proposals:index`, `garden-memory:entry:<id>`) — keep it

---

## Re-enable sequence

Once the redesign is complete:

1. Run `atlas-doctor.mjs` to confirm the Atlas is clean before gardening resumes
2. Set pace to 6 (every 10 minutes) via the garden page — not pace=1
3. Watch for 30 minutes: confirm no `needs_preparation` accumulation
4. If clean, the garden is running correctly

---

## Files to change

| File | Change |
|------|--------|
| `garden-schema.mjs` (new) | Shared validation and parsing |
| `api-gardener/src/index.js` | Prompt, template format, pre-flight, backoff, current content |
| `api-steward/src/index.js` | Remove needs_preparation from AI, use shared validation, pass current content |
| `api-applier/src/index.js` | Use shared parseForApply |
| `.atlas-publisher/main-website-worker.js` | Raise proposals index cap |

Do not change `wrangler.toml` files, the KV namespace bindings, or the garden API route handlers.
