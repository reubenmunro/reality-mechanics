/**
 * public-surface-manifest.mjs — canonical description of the Reality Mechanics
 * public structure, shared by the website worker and the MCP worker.
 *
 * D-025: one source of truth, two readers. The Calculus page renders its
 * status vocabulary, derivation chain, and inventory from this module; the
 * MCP serves the same data to AI readers. Neither surface may restate this
 * content independently — that is how drift is prevented.
 *
 * Retraceability model: every claim object carries a repo-relative `source`
 * path. Sources are files in this repository; public URLs derive from them.
 *
 * This module is data, not theory. Nothing in it may promote a claim beyond
 * the status its source report records.
 */

export const PUBLIC_SURFACE_MANIFEST_VERSION = "2026-07-06.d-025";

export const GITHUB_REPO = "https://github.com/reubenmunro/reality-mechanics";
export const GITHUB_BLOB = `${GITHUB_REPO}/blob/main`;

export function sourceUrl(sourcePath) {
  return `${GITHUB_BLOB}/${String(sourcePath || "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

// ── The five public surfaces (plus the MCP doorway itself) ───────────────────

export const PUBLIC_SURFACES = [
  {
    id: "observatory",
    name: "Observatory",
    symbol: "🔭",
    role: "See structure. The structural field instrument: terms as places, relations as strands, order as depth.",
    worker: "super-frost-d434",
    baseUrl: "https://realitymechanics.nz",
    routes: ["/", "/field"],
    apis: [
      { route: "GET /api/field/states", purpose: "Derived renderer states for the whole field — D1-derived, cache 120s." },
      { route: "GET /api/field/behaviour-trace?id=", purpose: "Mechanical retrace of the scalar derivation chain for any term (D-012)." },
    ],
    readsAtlas: "yes — via generated D1 read-model (atlas-d1); never writes",
    notes: [
      "Whole-field neutral open; dependency-bearing placement (angle = circular mean of declared-relation bearings, radius = order ring).",
      "Selecting a term changes the read: compressed term sheet with order, calibrated place sentence, and holds/traces/carries/pairs/nests.",
      "Field status readout declares term count, order count, and live atlas version label.",
    ],
    sources: [".atlas-publisher/main-website-worker.js", "docs/reports/D-023-public-website-creative-instrument-pass.md"],
  },
  {
    id: "pulse",
    name: "Pulse",
    symbol: "❤️",
    role: "Sense behaviour through time. Calibration is the first Pulse instrument: strain drifts, threshold crossed, pulse corrects, strain carries.",
    worker: "reality-mechanics-calibration",
    baseUrl: "https://calibration.realitymechanics.nz",
    routes: ["/"],
    apis: [
      { route: "GET /api/health", purpose: "Mechanical runtime health: {ok, runtime: 'mechanical', ai: false}." },
    ],
    readsAtlas: "no — standalone mechanical demonstration; no D1, no AI, no Atlas mutation",
    notes: [
      "Mechanics exposed: Drift (strain builds on its own), Pulse (correction fires only at threshold), Strain (the gap never closes for good), Carried Strain (what the next climb starts from).",
      "Eight-clause instrument contract C1–C8 governs every future Pulse instrument.",
    ],
    sources: ["member/src/index.js", "docs/reports/D-021.4-pulse-instrument-contract.md", "docs/reports/D-021.3-pulse-identity.md"],
  },
  {
    id: "theory",
    name: "Theory",
    symbol: "📖",
    role: "Understand the claim. Reality already carries order; Reality Mechanics observes structural relations already carried in reality and keeps every observation retraceable.",
    worker: "super-frost-d434",
    baseUrl: "https://realitymechanics.nz",
    routes: ["/theory"],
    apis: [],
    readsAtlas: "no direct read — states the claim and links canonical documents",
    notes: [
      "Working Postulate v0.6: Relation holds. Order carries. Trace places. Versioned, answerable to the Atlas, corrected by failure — not a doctrine.",
      "Constitutional standard: every accepted claim independently reviewable; every accepted decision independently retraceable.",
    ],
    sources: ["Reality_Mechanics/Theory.md", "MISSION.md", "docs/CONSTITUTION.md"],
  },
  {
    id: "proof",
    name: "Proof",
    symbol: "✓",
    role: "Retrace the evidence. Separates accepted, candidate, and unresolved; shows the four-step retrace pathway: Claim → Source → Method → Record.",
    worker: "super-frost-d434",
    baseUrl: "https://realitymechanics.nz",
    routes: ["/proof", "/submission", "/submission-001"],
    apis: [],
    readsAtlas: "no direct read — coordinates repository evidence (Submission 001)",
    notes: [
      "Humility is explicit: what the programme does not claim is listed beside what it does.",
      "The accepted body is small and conservative by design — derivation before promotion.",
    ],
    sources: ["docs/submissions/SUBMISSION-001-first-public-submission.md", "docs/practice/COMMISSIONS.md", "docs/stewardship/STEWARDSHIP_V1.md"],
  },
  {
    id: "calculus",
    name: "Calculus",
    symbol: "∴",
    role: "Derive the structure. The derivation surface: what is derived, what is calibrated, what is heuristic, and what remains unresolved — with every gap preserved.",
    worker: "super-frost-d434",
    baseUrl: "https://realitymechanics.nz",
    routes: ["/calculus"],
    apis: [],
    readsAtlas: "no direct read — renders this manifest's derivation data",
    notes: [
      "The Calculus has no accepted operation; the : operator is not accepted. Nothing on the surface is promoted.",
    ],
    sources: ["docs/practice/PRACTICE_CALCULUS.md", "docs/reports/D-024-calculus-public-surface.md"],
  },
  {
    id: "mcp",
    name: "MCP",
    symbol: "⌘",
    role: "AI-readable companion to the public structure. Read-only Atlas traversal plus public-surface and derivation-status reads.",
    worker: "reality-mechanics-mcp",
    baseUrl: "https://mcp.realitymechanics.nz",
    routes: ["/mcp"],
    apis: [{ route: "POST /mcp", purpose: "Streamable-HTTP MCP transport; read-only tools." }],
    readsAtlas: "yes — via generated D1 read-model (atlas-d1); never writes",
    notes: [
      "MCP is a doorway, not an editing surface. Atlas edits happen in GitHub first; D1 is rebuilt from the repository.",
    ],
    sources: ["reality-mechanics-mcp/src/index.js", "docs/deployment/CLOUDFLARE_SURFACE_MAP.md"],
  },
];

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
    step: "Declared relation",
    status: "canonical",
    chipLabel: "canonical source",
    rule: "holds · traces · carries · pairs · nests",
    note: "Every edge is declared in Atlas frontmatter, in GitHub. Nothing downstream may invent an edge.",
    source: "Reality_Mechanics/Common Term Structure.md",
  },
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

// ── Reports supporting the current public structure ──────────────────────────

export const SUPPORTING_REPORTS = [
  { report: "D-021.5", title: "Public website strip-back — four surfaces established", source: "docs/reports/D-021.5-public-website-strip-back.md" },
  { report: "D-022", title: "Observatory legibility — language enters the field", source: "docs/reports/D-022-observatory-legibility.md" },
  { report: "D-023", title: "Public website creative instrument pass", source: "docs/reports/D-023-public-website-creative-instrument-pass.md" },
  { report: "D-024", title: "Calculus public surface — the derivation surface", source: "docs/reports/D-024-calculus-public-surface.md" },
  { report: "D-019", title: "Atlas website sync + deployment verification", source: "docs/reports/D-019-atlas-website-sync-deployment.md" },
  { report: "D-013", title: "Cloudflare surface audit — lag-explicit deployment map", source: "docs/deployment/CLOUDFLARE_SURFACE_MAP.md" },
];

// ── Honesty notes ─────────────────────────────────────────────────────────────

export const DRIFT_NOTES = [
  "The atlas_version label in D1 (garden_config) is not updated by the sync script and may lag entry data (D-013). Treat entry counts and version label as separate reads.",
  "This manifest is versioned data, revised by commission. If a surface changes without a manifest revision, the manifest version + supporting reports identify the lag.",
];
