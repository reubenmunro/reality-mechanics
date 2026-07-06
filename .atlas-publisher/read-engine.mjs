/**
 * read-engine.mjs — Read Engine module catalogue and focus-scope orchestration (O-006).
 *
 * NOT a P-003 invariant layer. Reads are versioned resolver modules between L4 mechanics
 * and L6 appearance — participant-facing recognition derived from structure.
 *
 * Governing evidence: P-013, P-003, O-003, O-005, D-012.
 *
 * ## Source-of-truth rules (enforced by module design)
 *
 * 1. Structure canonical — reads cite L0–L1 evidence; never invent edges.
 * 2. Mechanics single path — weaveMode via thread-mechanics / weave-state only.
 * 3. Read does not paint — default delivery: API + Mechanics panel + term sheet annotation.
 * 4. Appearance follows — renderer draw* consumes mechanics outputs, not read criteria.
 * 5. Overlay is context — runtimeOverlay never defines read validity.
 * 6. No read scalar — discrete status + evidence counts unless Atlas-derived register exists.
 * 7. Version resolvers — breaking criteria bump resolver version string.
 * 8. Behaviour trace is meta-instrument — documents mechanics; imports reads, does not duplicate.
 */

import { gatheringReadForNeighbourhood, GATHERING_READ_VERSION } from "./gathering-read.mjs";
import { buildOrderTerminalAnnotation, orderTerminalForEntryId } from "./order-terminal.mjs";
import { resolveMaturityRead, MATURITY_READ_VERSION } from "./maturity-read.mjs";
import { resolveWeaveReadSummary, WEAVE_READ_VERSION } from "./weave-read.mjs";
import { enumerateNeighbourhoodEdges } from "./gathering-read.mjs";

export const READ_ENGINE_VERSION = "read-engine.v1";

export const ORDER_TERMINAL_READ_VERSION = "order-terminal.v1";

/** Behaviour trace flight recorder — meta-instrument, not a condition read. */
export const BEHAVIOUR_TRACE_INSTRUMENT_VERSION = "behaviour-trace.v1";

/**
 * Registered read resolvers and meta-instruments.
 * @type {Record<string, object>}
 */
export const READ_CATALOGUE = Object.freeze({
  "order-terminal": Object.freeze({
    id: "R-OT",
    atlasAnchor: "Order-Terminal / Resolution order_terminal",
    version: ORDER_TERMINAL_READ_VERSION,
    module: "order-terminal.mjs",
    kind: "read",
    nonPainting: true,
    delivery: ["term-sheet", "mechanics-panel", "behaviour-trace"],
    resolve: "orderTerminalForEntryId + buildOrderTerminalAnnotation",
  }),
  "structural-gathering": Object.freeze({
    id: "R-SG",
    atlasAnchor: "Structural Gathering (commission proxy)",
    version: GATHERING_READ_VERSION,
    module: "gathering-read.mjs",
    kind: "read",
    nonPainting: true,
    delivery: ["mechanics-panel", "behaviour-trace"],
    resolve: "resolveGatheringRead + buildGatheringReadAnnotation",
  }),
  "weave-leg": Object.freeze({
    id: "R-WM",
    atlasAnchor: "Carry+Trace weave classification",
    version: WEAVE_READ_VERSION,
    module: "weave-read.mjs + thread-mechanics.mjs",
    kind: "read",
    nonPainting: true,
    delivery: ["mechanics-evidence", "tms-tests"],
    resolve: "resolveWeaveLegRead",
  }),
  "fabric-eligibility": Object.freeze({
    id: "R-FE",
    atlasAnchor: "Fabric leg eligibility (O-002 gate)",
    version: WEAVE_READ_VERSION,
    module: "weave-read.mjs + thread-mechanics.mjs",
    kind: "read",
    nonPainting: true,
    delivery: ["appearance-gate-only"],
    resolve: "fabricEligibleWeaveMode via resolveWeaveLegRead",
    note: "Gates L6 fabric deposit — must not assert Fabric condition alone",
  }),
  "maturity-settledness": Object.freeze({
    id: "R-MAT",
    atlasAnchor: "maturityBand / settledness / agitation",
    version: MATURITY_READ_VERSION,
    module: "maturity-read.mjs",
    kind: "read",
    nonPainting: true,
    delivery: ["field-states-api", "behaviour-trace"],
    resolve: "resolveMaturityRead",
  }),
  "behaviour-trace": Object.freeze({
    id: "R-BT",
    atlasAnchor: "D-012 retrace flight recorder",
    version: BEHAVIOUR_TRACE_INSTRUMENT_VERSION,
    module: "field-behaviour-trace.mjs",
    kind: "meta-instrument",
    nonPainting: true,
    delivery: ["mechanics-panel", "behaviour-trace-api"],
    resolve: "buildFieldBehaviourTrace",
    note: "Documents L4 mechanical consequences; imports focus reads",
  }),
});

export const SOURCE_OF_TRUTH_RULES = Object.freeze([
  "Structure canonical — reads never invent L1 edges.",
  "Mechanics single path — weave state via weave-state.mjs + thread-mechanics.mjs.",
  "Read does not paint — no canvas effect from read resolver by default.",
  "Appearance follows — draw* uses mechanics eligibility, not read status.",
  "Overlay is context — runtimeOverlay does not define read truth.",
  "No read scalar — discrete status + evidence unless Atlas register exists.",
  "Version resolvers — bump *.vN on criteria change.",
  "Behaviour trace imports reads — no duplicated recognition logic.",
]);

/**
 * Resolve all focus-scope reads for behaviour trace / Mechanics panel.
 * Preserves backward-compatible top-level fields (orderTerminal, gatheringRead, …).
 */
export function resolveFocusReads({
  focusId,
  focusState,
  statesById,
  neighbourhoodIds,
  thresholds = {},
}) {
  const orderTerminalMeta = focusState?.orderTerminal ?? orderTerminalForEntryId(focusId);
  const orderTerminal = orderTerminalMeta
    ? buildOrderTerminalAnnotation(orderTerminalMeta)
    : null;

  const gathering = gatheringReadForNeighbourhood({
    neighbourhoodIds,
    statesById,
    thresholds,
  });

  const maturity = resolveMaturityRead(focusState);

  const neighbourhoodEdges = enumerateNeighbourhoodEdges(neighbourhoodIds, statesById);
  const weaveSummary = resolveWeaveReadSummary({ edges: neighbourhoodEdges });

  const reads = Object.freeze({
    orderTerminal: orderTerminal
      ? { read: orderTerminalMeta, annotation: orderTerminal, resolver: ORDER_TERMINAL_READ_VERSION, nonPainting: true }
      : null,
    structuralGathering: Object.freeze({
      read: gathering.read,
      annotation: gathering.annotation,
      resolver: gathering.read?.resolver ?? GATHERING_READ_VERSION,
      nonPainting: true,
    }),
    maturity: Object.freeze({ ...maturity }),
    weaveSummary: Object.freeze({ ...weaveSummary }),
  });

  return {
    engine: READ_ENGINE_VERSION,
    catalogue: Object.freeze(Object.keys(READ_CATALOGUE)),
    sourceOfTruthRules: SOURCE_OF_TRUTH_RULES,
    reads,
    // Backward-compatible behaviour-trace fields
    orderTerminal,
    gatheringRead: gathering.read,
    gatheringReadAnnotation: gathering.annotation,
  };
}

export function catalogueEntry(readKey) {
  return READ_CATALOGUE[readKey] || null;
}

export function allReadsNonPainting() {
  return Object.values(READ_CATALOGUE)
    .filter((entry) => entry.kind === "read")
    .every((entry) => entry.nonPainting === true);
}
