/**
 * order-terminal.mjs — Order-terminal reads for Observatory (O-003).
 * Maps Atlas `order_terminal` frontmatter to participant annotations without D1 schema edits.
 * Governing evidence: P-010, Order-Terminal.md instances.
 */

/** Atlas instances with `order_terminal.is_terminal: true` (condition_key → metadata). */
export const ORDER_TERMINAL_REGISTRY = {
  "first.resolution": {
    is_terminal: true,
    terminal_of: "first_order",
    terminal_mode: "resolves_current_asymmetry",
  },
  "third.nesting": {
    is_terminal: true,
    terminal_of: "third_order",
    terminal_mode: "nested_participation",
  },
  "higher.recursion": {
    is_terminal: true,
    terminal_of: "higher_order",
    terminal_mode: "recursive_nesting",
  },
};

const TERMINAL_OF_LABELS = {
  first_order: "First Order",
  second_order: "Second Order",
  third_order: "Third Order",
  higher_order: "Higher Order",
};

/** Parse `order_terminal:` block from Atlas frontmatter YAML. */
export function parseOrderTerminalBlock(frontmatter) {
  if (!frontmatter || typeof frontmatter !== "string") return null;
  const lines = frontmatter.split("\n");
  const idx = lines.findIndex((l) => /^order_terminal:\s*$/.test(l.replace(/\r$/, "")));
  if (idx === -1) return null;
  const block = {};
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, "");
    if (line.length > 0 && !/^[ \t]/.test(line)) break;
    const m = line.match(/^[ \t]+(\w+):\s*(.+?)\s*$/);
    if (!m) continue;
    const key = m[1];
    const raw = m[2].trim().replace(/^["']|["']$/g, "");
    if (key === "is_terminal") block.is_terminal = raw === "true";
    else block[key] = raw;
  }
  return block.is_terminal ? block : null;
}

export function orderTerminalForEntryId(id, metadata = null) {
  if (metadata?.is_terminal) return metadata;
  return ORDER_TERMINAL_REGISTRY[id] || null;
}

export function terminalOfLabel(terminalOf) {
  return TERMINAL_OF_LABELS[terminalOf] || String(terminalOf || "").replace(/_/g, " ");
}

/** Participant-facing annotation — reference-frame transition, not structure mutation. */
export function buildOrderTerminalAnnotation(metadata) {
  if (!metadata?.is_terminal) return null;
  const terminalOf = metadata.terminal_of || null;
  return {
    isTerminal: true,
    terminalOf,
    terminalOfLabel: terminalOfLabel(terminalOf),
    terminalMode: metadata.terminal_mode || null,
    passageRule: "The same read cannot continue as the same passage within this order.",
    continuationRule: "Continuation requires re-entry, restart, or order lift.",
    structureInvariant: "Atlas structure remains invariant (L0–L1); the reference frame of resolution may change.",
    behaviourNote: "Behaviour and resolution rate may change under the new frame; appearance follows at L6.",
    frameTransition: "Read this as a reference-frame transition — not a material morph or structure edit.",
    source: "atlas.order_terminal",
  };
}

export function orderTerminalAnnotationForEntryId(id, metadata = null) {
  const raw = orderTerminalForEntryId(id, metadata);
  return raw ? buildOrderTerminalAnnotation(raw) : null;
}
