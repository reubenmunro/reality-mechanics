/**
 * atlas-structure-contract.mjs
 *
 * One canonical Atlas structure, many translations.
 *
 * This file is intentionally dependency-free so the MCP, Workers, publisher,
 * tests, and future adapters can import the same contract without creating a
 * second Atlas.
 */

export const STRUCTURE_FIELDS = Object.freeze([
  "id",
  "title",
  "entry_order",
  "entry_type",
  "status",
  "garden_status",
  "grounded",
  "structure",
  "content_hash",
  "updated",
]);

export const RELATION_FIELDS = Object.freeze([
  "holds",
  "traces",
  "carries",
  "pairs",
  "nests",
  "reads",
]);

export const TRANSLATION_SURFACES = Object.freeze({
  structure: "Canonical relation/order layer. All representations must remain answerable to this.",
  frontmatter: "AI-readable translation of structure. It condenses structure for machines and workers.",
  prose: "Human-readable translation of structure. It explains without overriding structure.",
  mcp: "Read-only traversal translation of structure for external sessions.",
  field: "Visual and pressure translation of structure. It shows readability, lag, and strain.",
  calibration: "Participant-facing reasoning translation. It helps move from pressure to retraceable next step.",
  d1: "Generated read model rebuilt from the GitHub repository. It is never the editable source.",
});

export const READING_ORDER = Object.freeze([
  "observe completed or pressured carrying",
  "locate the reference frame",
  "read the active ratio",
  "trace what had to already be true",
  "form a retraceable reason",
  "choose a bounded continuation",
  "publish or wait with explicit lag",
]);

export const WORKER_ORDER = Object.freeze([
  {
    key: "repository",
    currentWorker: "GitHub",
    state: "canonical",
    role: "Hold the editable Atlas markdown and frontmatter.",
  },
  {
    key: "d1_sync",
    currentWorker: "sync-d1-from-repo",
    state: "generated",
    role: "Rebuild the D1 read model from repository source.",
  },
  {
    key: "field",
    currentWorker: "reality-mechanics-main",
    state: "readable",
    role: "Expose the structural field as the public visual surface.",
  },
  {
    key: "mcp",
    currentWorker: "reality-mechanics-mcp",
    state: "readable",
    role: "Expose read-only Atlas traversal tools.",
  },
  {
    key: "calibration",
    currentWorker: "reality-mechanics-calibration",
    state: "usable",
    role: "Expose the participant-facing calibration tool.",
  },
]);

export const LAG_STATES = Object.freeze([
  "received",
  "prepared",
  "needs_attention",
  "approved",
  "applied",
  "published",
  "affirmed",
  "rejected",
  "discarded",
  "superseded",
]);

export const RATIO_CONTRACT = Object.freeze({
  name: "Ratio",
  definition: "Relation made readable between distinguishable terms from within a reference frame.",
  rule: "A ratio is not just a pair of words. It must name the terms, frame, relation, trace, and continuation pressure.",
  examples: ["Seed : Ground", "One : Other", "Trace : Carry", "Light : Shade", "Proposal : Entry"],
  requiredRead: ["left", "right", "referenceFrame", "relation", "trace", "continuation"],
});

export const COMMON_TERM_STRUCTURE_CONTRACT = Object.freeze({
  name: "Common Term Structure",
  entryId: "foundation.common-term-structure",
  sourcePath: "Reality_Mechanics/Common Term Structure.md",
  role: "Authoring and review constraint for structural terms.",
  rule: "Any task that creates, revises, restructures, grounds, publishes, or critiques a term must read and remain answerable to Common Term Structure before changing the GitHub source.",
  readModeRule: "Simple lookup and traversal may proceed without applying the authoring constraint, but any structural modification or evaluation must apply it.",
  authoringOrder: Object.freeze([
    "read Common Term Structure",
    "read the target term structure before prose",
    "traverse related dependencies with get_related",
    "identify drift between mechanics, metadata, prose, and references",
    "edit the GitHub source only where the change remains answerable",
    "sync D1 from the repository so MCP reads the generated record",
  ]),
  checks: Object.freeze([
    "identity remains recoverable",
    "metadata supports structure rather than freezing ontology",
    "trace remains recoverable beyond immediate dependency where needed",
    "carry records demonstrated continuation rather than prediction",
    "ratio and threshold are visible where adjustment matters",
    "references perform structural work",
    "prose exposes mechanics rather than repeating the heading",
    "implementation has not been confused with mechanics",
    "future refinement remains possible without losing structural continuity",
  ]),
});

export const WORLD_PHYSICS = Object.freeze({
  layer: "invariant",
  rule: "World physics describes Reality Mechanics itself. Runtime implementations answer to it; they do not define it.",
  ratios: Object.freeze({
    generative: Object.freeze({
      ratio: "Seed : Ground",
      role: "Generative ratio. Seed becomes readable only against Ground; Ground becomes active as what can hold Seed.",
    }),
    read: Object.freeze({
      ratio: "One : Other",
      role: "Read ratio. The moment one is readable, other is implied.",
    }),
    invariant: Object.freeze({
      ratio: "1 : 1-",
      role: "Relation cannot appear as pure sameness. Difference is the first readable asymmetry.",
    }),
  }),
  participant: Object.freeze({
    frequencyRule: "Frequency is local. It is how a participant reads its own changing ratio from within relation.",
    timeRule: "Time is the lived experience of local frequency, not a global property belonging to the Atlas.",
    eventRule: "Structural events arise whenever participants move through relation.",
  }),
});

export const STRUCTURAL_EVENT_TYPES = Object.freeze([
  "first_encounter",
  "transition",
  "return",
  "retrace",
  "loop_completed",
  "unexpected_ratio",
  "absence_return",
  "overload",
  "settling",
]);

export const STRUCTURAL_EVENT_FIELDS = Object.freeze([
  "id",
  "participantId",
  "type",
  "from",
  "to",
  "relation",
  "referenceFrame",
  "ratio",
  "localFrequency",
  "trace",
  "occurredAt",
]);

export const PARTICIPANT_READING_CONTRACT = Object.freeze({
  frequencyRule: "The runtime may carry local frequency as an event read, but it does not make frequency global.",
  timeRule: "The runtime records occurrence; it does not turn time into Atlas meaning.",
  eventRule: "The runtime observes participant movement and translates it into structural events. Interfaces, calibration passes, and future adapters may listen.",
});

export const INHABITANT_CONTRACT = Object.freeze({
  roleRule: "An AI inhabitant has one bounded responsibility, limited senses, and one expressive medium.",
  actionRule: "An AI inhabitant responds to structural events. It does not author, oracle, initiate, or invent structure.",
  dependencyRule: "AI behaviour depends on event shape and relation behaviour, not specific term names.",
});

export const RELATION_EVENT_RUNTIME_CONTRACT = Object.freeze({
  version: "2026-06-30.relation-event-runtime",
  principle: "The runtime observes participant movement through Atlas relation, translates movement into structural events, and remains unaware of listeners.",
  answersTo: "WORLD_PHYSICS",
  invariantRule: "The Atlas structure is invariant. Runtime behaviour may interpret structure but must not silently create it.",
  meaningRule: "The runtime does not create meaning. It preserves the conditions under which meaning remains retraceable.",
  observatoryRule: "The runtime is a structural observatory: dependency-light, deterministic, and listener-agnostic.",
  termRule: "A new term must become readable to the world through order, relations, dependency, carry, trace, pair, nest, and reads.",
  bespokeRule: "If a new term requires bespoke frontend code, bespoke AI prompt logic, or hand-authored effects, the runtime contract is wrong.",
  eventTypes: STRUCTURAL_EVENT_TYPES,
  eventFields: STRUCTURAL_EVENT_FIELDS,
  participant: PARTICIPANT_READING_CONTRACT,
  inhabitant: INHABITANT_CONTRACT,
});

export const ATLAS_STRUCTURE_CONTRACT = Object.freeze({
  version: "2026-06-30.ratio-reading-order",
  principle: "The Atlas is not stored many times. It is read many ways.",
  canonicalRule: "Structure is canonical. Every representation is a translation. Every translation must be retraceable to structure.",
  sourceRule: "GitHub repository markdown and frontmatter form the editable canonical record. D1 is a generated read model rebuilt from that record.",
  translationRule: "Frontmatter, prose, MCP responses, Field, Calibration, generated D1, and future adapters are translations; none may silently invent a second Atlas.",
  lagRule: "Lag is natural when workers move in order. Lag is acceptable only when the current state and source representation are explicit.",
  authoringRule: COMMON_TERM_STRUCTURE_CONTRACT.rule,
  structureFields: STRUCTURE_FIELDS,
  relationFields: RELATION_FIELDS,
  translationSurfaces: TRANSLATION_SURFACES,
  readingOrder: READING_ORDER,
  workerOrder: WORKER_ORDER,
  lagStates: LAG_STATES,
  worldPhysics: WORLD_PHYSICS,
  ratio: RATIO_CONTRACT,
  commonTermStructure: COMMON_TERM_STRUCTURE_CONTRACT,
  runtime: RELATION_EVENT_RUNTIME_CONTRACT,
});

export const CONTRACT_SUMMARY =
  `${ATLAS_STRUCTURE_CONTRACT.canonicalRule} ${ATLAS_STRUCTURE_CONTRACT.translationRule} ${ATLAS_STRUCTURE_CONTRACT.lagRule} ${ATLAS_STRUCTURE_CONTRACT.authoringRule} ${RELATION_EVENT_RUNTIME_CONTRACT.principle} ${RELATION_EVENT_RUNTIME_CONTRACT.bespokeRule}`;

export function structureContractForSurface(surface) {
  const key = String(surface || "").trim();
  return {
    ...ATLAS_STRUCTURE_CONTRACT,
    surface: key || "general",
    surfaceRule: TRANSLATION_SURFACES[key] || "Unknown surfaces must declare how they translate canonical structure before they act.",
  };
}

export function relationBetween(leftStructure = {}, rightId = "") {
  const found = [];
  for (const field of RELATION_FIELDS) {
    const values = Array.isArray(leftStructure?.[field]) ? leftStructure[field] : [];
    if (values.includes(rightId)) found.push(field);
  }
  return found;
}
