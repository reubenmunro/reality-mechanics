/**
 * garden-schema.mjs — Shared contract for all Atlas garden workers.
 *
 * Imported by api-gardener, api-steward, and api-applier.
 * Single source of truth for proposal validation and parsing.
 */

// Canonical field constraints
export const PROPOSAL_CONSTRAINTS = {
  replacementMinWords: 50,
  replacementMaxChars: 3600,
  notesMaxChars: 260,
  prohibitedPhrases: ["not yet named", "to be completed", "tbd", "todo", "placeholder"],
};

/**
 * Validate a proposed_changes string against the canonical template.
 * Used by gardener (pre-flight) and steward (local check).
 */
export function validateProposal(proposed_changes) {
  const text = String(proposed_changes || "");

  // Clean-pass format is always valid
  if (/## What I propose\s*\n\s*No changes required/m.test(text)) {
    return { valid: true, cleanPass: true, section: "", proposed: "", why: "", wordCount: 0, reason: "clean-pass" };
  }

  const sectionMatch = text.match(/^### (.+)$/m);
  const proposedMatch = text.match(/\*\*Proposed text:\*\*\s*\n([\s\S]*?)\n\n\*\*Why:/m);
  const whyMatch = text.match(/\*\*Why:\*\* (.+)/);

  const section = sectionMatch?.[1]?.trim() || "";
  const proposed = proposedMatch?.[1]?.trim() || "";
  const why = whyMatch?.[1]?.trim() || "";

  const wordCount = proposed.split(/\s+/).filter(Boolean).length;
  const hasProhibited = PROPOSAL_CONSTRAINTS.prohibitedPhrases
    .some(p => proposed.toLowerCase().includes(p));
  const hasHeading = /^#{1,6}\s/m.test(proposed);

  const valid = Boolean(
    section &&
    proposed &&
    why &&
    wordCount >= PROPOSAL_CONSTRAINTS.replacementMinWords &&
    !hasProhibited &&
    !hasHeading
  );

  return {
    valid,
    cleanPass: false,
    section,
    proposed,
    why,
    wordCount,
    reason: !section ? "missing section" :
            !proposed ? "missing proposed text" :
            !why ? "missing why" :
            wordCount < PROPOSAL_CONSTRAINTS.replacementMinWords
              ? `replacement too thin (${wordCount} words, need ${PROPOSAL_CONSTRAINTS.replacementMinWords})`
            : hasProhibited ? "replacement contains placeholder language" :
            hasHeading ? "replacement contains heading" : "ok",
  };
}

/**
 * Parse a validated proposed_changes string for application.
 * Returns { section, replacement } or null if invalid.
 */
export function parseForApply(proposed_changes) {
  const v = validateProposal(proposed_changes);
  if (!v.valid || v.cleanPass) return null;
  return { section: v.section, replacement: v.proposed };
}

/**
 * Build a canonical proposed_changes string from gardener AI output.
 */
export function buildProposedChanges({ finding, section, currentText, replacement, why, unsure, reciprocityIssues }) {
  const current = String(currentText || "").trim() || "missing";
  const currentLines = current.split("\n").map(l => `> ${l}`).join("\n");
  return [
    "## What I found",
    "",
    String(finding || "").trim(),
    "",
    "## What I propose",
    "",
    `### ${section}`,
    "",
    "**Current text:**",
    currentLines,
    "",
    "**Proposed text:**",
    String(replacement || "").trim(),
    "",
    `**Why:** ${String(why || "").trim()}`,
    "",
    "## What I am not sure about",
    "",
    String(unsure || "Nothing flagged.").trim(),
    "",
    "## Reciprocity issues found",
    "",
    String(reciprocityIssues || "None found.").trim(),
  ].join("\n");
}

/**
 * Build a canonical clean-pass proposed_changes string.
 */
export function buildCleanPass(finding) {
  return [
    "## What I found",
    "",
    String(finding || "This term passed all checks: reciprocity holds, sections are complete, frontmatter aligns with body, no source drift detected.").trim(),
    "",
    "## What I propose",
    "",
    "No changes required.",
    "",
    "## What I am not sure about",
    "",
    "Nothing flagged.",
    "",
    "## Reciprocity issues found",
    "",
    "None found.",
  ].join("\n");
}
