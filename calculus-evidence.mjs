/**
 * Maintained, non-canonical Calculus evidence.
 *
 * These derivation methods, status assignments, evidence links, and unresolved
 * gaps participate in Calibration. They do not determine Atlas structure and
 * are not an input to Canonical Translation.
 */

export const GITHUB_REPO = "https://github.com/reubenmunro/reality-mechanics";
export const GITHUB_BLOB = `${GITHUB_REPO}/blob/main`;

export function sourceUrl(sourcePath) {
  return `${GITHUB_BLOB}/${String(sourcePath || "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

// Public-surface roles remain canonical prose in the Atlas. This maintained file
// carries non-canonical Calculus evidence only; it never feeds Translation.

// ── Status vocabulary (D-024) ─────────────────────────────────────────────────

export const STATUS_VOCABULARY = [
  {
    status: "derived",
    meaning: "Forced by repository evidence through a named test or locked definition. Independently retraceable to source and report.",
  },
  {
    status: "calibrated",
    meaning: "Aligned to existing structure by a tested rule or configured threshold. Faithful — but chosen, not forced from first principles.",
  },
  {
    status: "heuristic",
    meaning: "A working number or rendering choice made for legibility. Carries no structural claim and can change without a derivation event.",
  },
  {
    status: "unresolved",
    meaning: "Insufficient evidence in either direction. The gap is preserved deliberately.",
  },
];

// ── The live derivation chain (D-024; runs on the Observatory today) ─────────

export const DERIVATION_CHAIN = [
  {
    step: "Structural mass",
    status: "derived",
    chipLabel: "derived",
    rule: "mass(t) = |{ s ≠ t : t ∈ holds(s) ∪ traces(s) }|",
    note: "Carrier in-degree over holds and traces only. needs, carries, pairs, nests are excluded by locked definition.",
    source: "docs/reports/D-010B-generalise-ratio-mechanics.md",
  },
  {
    step: "Ratio mode",
    status: "calibrated",
    chipLabel: "calibrated",
    rule: "mode(x) = continuous if x ≥ 8 · transitional if x ≥ 3 · else discrete",
    note: "Threshold bands are configured operational values, not derived constants. They translate mass into a render register.",
    source: "docs/runtime/DERIVED_RATIO.md",
  },
  {
    step: "Render behaviour",
    status: "heuristic",
    chipLabel: "heuristic",
    rule: "amplification coefficients × what the runtime already computes",
    note: "Rendering only — no new mechanics. Legibility floors and placement jitter are likewise heuristic (D-022, D-023).",
    source: "docs/reports/D-020B-mechanics-amplification.md",
  },
  {
    step: "Retrace",
    status: "derived",
    chipLabel: "derived",
    rule: "GET /api/field/behaviour-trace?id=… recomputes the chain for any term",
    note: "The read back is mechanical. If a rendered behaviour cannot be retraced to a declared relation, it is marked, not bonded.",
    source: "docs/reports/D-012-behaviour-retrace-instrument.md",
  },
];

export const DERIVATION_CAVEAT = {
  text: "This scalar chain is a narrower Field read. It is not Atlas Ratio — falsification found it viable with constraints, and a richer structural signature remains a future unknown.",
  sources: ["docs/reports/D-015B-derived-ratio-falsification.md", "docs/runtime/DERIVED_RATIO.md"],
};

// ── The full inventory (D-024) ────────────────────────────────────────────────

export const DERIVATION_INVENTORY = {
  derived: [
    { claim: "Relation is the sole internal root of first-order dependency.", source: "docs/reports/C-R001-first-order-dependency-topology.md" },
    { claim: "Carry and Trace are one condition, carved into two terms by direction.", source: "docs/stewardship/STEWARDSHIP_V1.md" },
    { claim: "Structural mass rule — holds/traces in-degree, locked.", source: "docs/reports/D-010B-generalise-ratio-mechanics.md" },
    { claim: "Behaviour retrace — the scalar chain is mechanically recomputable for any term.", source: "docs/reports/D-012-behaviour-retrace-instrument.md" },
    { claim: "Runtime principles — statements of what the current runtime already implies, no more.", source: "docs/practice/RUNTIME_PRINCIPLES.md" },
    { claim: "Minimum support: the tested candidate is not minimal; minimal seat Relation → Connection.", source: "docs/reports/C-003-minimum-support-test.md" },
  ],
  calibrated: [
    { claim: "Tier-1 place sentences — Atlas opening prose calibrated corpus-wide.", source: "docs/reports/D-018A-opening-place-calibration.md" },
    { claim: "Tier-1 hold sentences — 481 files, 485/488 aligned.", source: "docs/reports/D-018D-tier-1-hold-calibration.md" },
    { claim: "Whole-Atlas calibration classes.", source: "docs/reports/D-008-whole-atlas-calibration.md" },
    { claim: "Ratio-mode thresholds (3 / 8) and maturity bands — configured, revisable.", source: "docs/runtime/DERIVED_RATIO.md" },
  ],
  heuristic: [
    { claim: "Mechanics amplification coefficients — rendering only, no new mechanics.", source: "docs/reports/D-020B-mechanics-amplification.md" },
    { claim: "Observatory legibility floors — perceptual alphas.", source: "docs/reports/D-022-observatory-legibility.md" },
    { claim: "Dependency-bearing placement jitter and label budgets.", source: "docs/reports/D-023-public-website-creative-instrument-pass.md" },
    { claim: "Adaptive render-quality budgets.", source: ".atlas-publisher/main-website-worker.js" },
  ],
  unresolved: [
    { claim: "Pressure is not derived — three senses distinguished, derivation open.", source: "docs/reports/C-A001-pressure-derivation-evidence.md" },
    { claim: "The : operator is not accepted (C010).", source: "docs/practice/PRACTICE_CALCULUS.md" },
    { claim: "\"operation\" carries six senses across two incompatible categories.", source: "docs/reports/C-C000A-operation-consistency-audit.md" },
    { claim: "The calculus grain is undeclared.", source: "docs/reports/C-003-minimum-support-test.md" },
    { claim: "Second Order has no terminal marker — confirmed gap, deliberately unfilled.", source: "docs/stewardship/OPEN_QUESTIONS.md" },
    { claim: "D1 schema and non-entries recovery path uncharacterised (commission C005).", source: "docs/practice/COMMISSIONS.md" },
    { claim: "A structural signature richer than the scalar ratio — future unknown.", source: "docs/reports/D-015B-derived-ratio-falsification.md" },
  ],
};
