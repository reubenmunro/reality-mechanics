/**
 * Calibration Engine v1 — read-model structural calibration.
 *
 * Order: read / map / retrace / preserve
 * Ark: test / perturb / carry / restore / observe
 * Steward: accept / reject / defer (decision stays with steward)
 *
 * Does not mutate Atlas source. Does not promote Calculus claims.
 */

/** Post D-004 synchronised read-model slice for Maintained Coupling demo. */
export const ENGINE_TERMS = {
  Relation: {
    id: "first.relation",
    order: "first",
    needs: [],
    holds: [],
    traces: [],
    pairs: ["Ground", "Ratio"],
  },
  Strain: {
    id: "first.strain",
    order: "first",
    needs: ["Availability"],
    holds: ["Availability"],
    traces: ["Availability"],
    pairs: ["Bearing"],
  },
  Availability: {
    id: "first.availability",
    order: "first",
    needs: ["Boundary"],
    holds: ["Boundary"],
    traces: ["Boundary"],
    pairs: ["Boundary"],
  },
  Boundary: {
    id: "first.boundary",
    order: "first",
    needs: ["Distinction"],
    holds: ["Distinction"],
    traces: ["Distinction"],
    pairs: ["Availability"],
  },
  Bearing: {
    id: "first.bearing",
    order: "first",
    needs: ["Strain"],
    holds: ["Strain"],
    traces: ["Strain"],
    pairs: ["Resolution"],
  },
  Compatibility: {
    id: "second.compatibility",
    order: "second",
    needs: ["Relation", "Clear"],
    holds: ["Relation", "Clear"],
    traces: ["Relation", "Clear"],
    pairs: ["Asymmetry"],
  },
  Recurrence: {
    id: "second.recurrence",
    order: "second",
    needs: ["Occur", "Participation", "Traversal"],
    holds: ["Occur", "Participation", "Traversal"],
    traces: ["Occur", "Participation", "Traversal"],
    pairs: [],
  },
  Coupling: {
    id: "second.coupling",
    order: "second",
    needs: ["Resolved Asymmetry", "Carrying"],
    holds: ["Resolved Asymmetry", "Carrying"],
    traces: ["Resolved Asymmetry", "Carrying", "Union"],
    pairs: ["Decoupling"],
  },
  "Maintained Coupling": {
    id: "third.maintained-coupling",
    order: "third",
    needs: ["Coupling", "Bearing", "Recurrence", "Compatibility"],
    holds: ["Coupling", "Bearing", "Recurrence", "Compatibility"],
    traces: ["Coupling", "Bearing", "Recurrence", "Compatibility"],
    pairs: ["Maintained Coupling Failure"],
  },
};

export const DEFAULT_TERM = "Maintained Coupling";
export const DEFAULT_PERTURB = "Compatibility";

export function termNames() {
  return Object.keys(ENGINE_TERMS);
}

export function getTerm(name) {
  const t = ENGINE_TERMS[name];
  if (!t) throw new Error(`Unknown term: ${name}`);
  return { name, ...t };
}

function inEngine(name) {
  return Object.prototype.hasOwnProperty.call(ENGINE_TERMS, name);
}

/** Walk needs backward; external deps stop at loaded boundary. */
export function buildAncestry(name) {
  const paths = [];
  const visited = new Set();

  function walk(current, trail) {
    if (visited.has(current + "|" + trail.join(">"))) return;
    visited.add(current + "|" + trail.join(">"));
    if (!inEngine(current)) {
      if (trail.length) paths.push([...trail, current + " (outside loaded read-model)"]);
      return;
    }
    const needs = ENGINE_TERMS[current].needs;
    if (!needs.length) {
      paths.push([...trail, current]);
      return;
    }
    for (const n of needs) walk(n, [...trail, current]);
  }

  walk(name, []);
  return paths.sort((a, b) => a.length - b.length);
}

/** Can this term be retraced to Relation through loaded needs? */
export function canRetraceToRelation(name, omitNeed = null, omitFrom = null) {
  const memo = new Map();
  function ok(term) {
    if (memo.has(term)) return memo.get(term);
    if (term === "Relation") return true;
    if (!inEngine(term)) return true;
    const raw = ENGINE_TERMS[term].needs;
    const needs =
      omitFrom === term && omitNeed ? raw.filter((n) => n !== omitNeed) : raw;
    if (!needs.length) {
      memo.set(term, term === "Relation");
      return term === "Relation";
    }
    const val = needs.every(ok);
    memo.set(term, val);
    return val;
  }
  return ok(name);
}

/** Ancestry paths that pass through a given need from the target term. */
export function pathsThroughNeed(termName, need) {
  return buildAncestry(termName).filter((path) => path.includes(need));
}

/**
 * Run the full calibration pass for one term and one dependency perturbation.
 * @param {string} termName
 * @param {string} perturbNeed — one need to simulate removing from read-model
 */
export function runCalibration(termName = DEFAULT_TERM, perturbNeed = DEFAULT_PERTURB) {
  const term = getTerm(termName);
  const ancestry = buildAncestry(termName);
  const externalNeeds = term.needs.filter((n) => !inEngine(n));
  const perturbValid = term.needs.includes(perturbNeed);
  const beforeRetrace = canRetraceToRelation(termName);
  const afterPerturb = canRetraceToRelation(termName, perturbNeed, termName);
  const restored = canRetraceToRelation(termName);
  const throughPaths = pathsThroughNeed(termName, perturbNeed);
  const branchBreaks = perturbValid && throughPaths.length > 0;

  let forestState = "healthy";
  if (!beforeRetrace) forestState = "stasis";
  else if (!afterPerturb) forestState = "drift";
  else if (branchBreaks && perturbValid) forestState = "healthy";

  let characterisation = "unchanged";
  if (!perturbValid) characterisation = "unresolved";
  else if (!beforeRetrace) characterisation = "stasis";
  else if (!afterPerturb) characterisation = "load-bearing";
  else if (branchBreaks) characterisation = "weakened";
  else characterisation = "unchanged";

  const steps = [
    {
      phase: "order",
      role: "read",
      forest: "Enter the forest at the term.",
      label: "Load",
      detail: `Loaded ${termName} (${term.id}) from synchronised read-model.`,
    },
    {
      phase: "order",
      role: "map",
      forest: "Map the trees around you — ancestry visible.",
      label: "Ancestry",
      detail: formatAncestry(term),
    },
    {
      phase: "order",
      role: "retrace",
      forest: "Walk backward — retrace toward lower dependencies.",
      label: "Retrace",
      detail: ancestry.length
        ? ancestry.map((p) => p.join(" → ")).join("; ")
        : "No needs path inside loaded read-model.",
    },
    {
      phase: "ark",
      role: "perturb",
      forest: "Forward test — one branch removed from the read only.",
      label: "Perturb",
      detail: perturbValid
        ? `Simulated removing need [[${perturbNeed}]] from ${termName} (read-model only; source untouched).`
        : `Cannot perturb: ${perturbNeed} is not a need of ${termName}.`,
    },
    {
      phase: "ark",
      role: "observe",
      forest: beforeRetrace && !afterPerturb ? "Drift — progress without retrace." : "Observe what held and what weakened.",
      label: "Observe",
      detail: describeObservation(beforeRetrace, afterPerturb, perturbNeed, termName, throughPaths, branchBreaks),
    },
    {
      phase: "ark",
      role: "restore",
      forest: "Carry back — the term is restored in the read-model.",
      label: "Restore",
      detail: restored
        ? `${termName} retrace to Relation: restored (${restored ? "yes" : "no"}).`
        : `${termName} could not be restored to full retrace in this slice.`,
    },
    {
      phase: "order",
      role: "preserve",
      forest: forestState === "healthy" ? "Healthy — progress remains retraceable." : forestState === "drift" ? "Drift detected." : "Stasis — retrace without discovery.",
      label: "Characterise",
      detail: characterisation,
    },
    {
      phase: "steward",
      role: "decide",
      forest: "The steward decides — accept, reject, or defer.",
      label: "Steward",
      detail: "This instrument recommends; it does not decide. Accept / Reject / Defer remains with the steward.",
    },
  ];

  return {
    term: termName,
    termId: term.id,
    perturbNeed,
    synchronised: true,
    dataSource: "Post D-004 read-model slice (Maintained Coupling includes Compatibility)",
    forestMetaphor: {
      forward: "new trajectory",
      backward: "ancestry",
      healthy: "progress remains retraceable",
      drift: "progress without retrace",
      stasis: "retrace without discovery",
      state: forestState,
    },
    roles: {
      order: "read / map / retrace / preserve",
      ark: "test / perturb / carry / restore / observe",
      steward: "accept / reject / defer",
    },
    steps,
    observation: buildObservation(term, ancestry, externalNeeds),
    evidence: buildEvidence(beforeRetrace, afterPerturb, restored, perturbNeed, termName, perturbValid, throughPaths, branchBreaks),
    recommendation: buildRecommendation(characterisation, perturbNeed, termName, forestState),
    stewardNote: "The steward decides. This calibration pass is evidence, not authority.",
  };
}

function formatAncestry(term) {
  const parts = [
    `needs: ${list(term.needs)}`,
    `holds: ${list(term.holds)}`,
    `traces: ${list(term.traces)}`,
    `pairs: ${list(term.pairs)}`,
  ];
  return parts.join(" · ");
}

function list(arr) {
  return arr.length ? arr.join(", ") : "none";
}

function describeObservation(before, after, perturb, term, throughPaths, branchBreaks) {
  if (!before) return `${term} was not retraceable to Relation before perturbation in this loaded slice.`;
  if (!after) return `Removing [[${perturb}]] breaks ${term}'s full retrace to Relation — dependency reads load-bearing.`;
  if (branchBreaks) {
    return `Removing [[${perturb}]] breaks ${throughPaths.length} ancestry path(s) through [[${perturb}]], while ${term} remains retraceable via other needs — branch weakened.`;
  }
  return `Removing [[${perturb}]] leaves ${term} and its ancestry paths unchanged in this slice.`;
}

function buildObservation(term, ancestry, externalNeeds) {
  return [
    `${term.name} (${term.id}, ${term.order} order) reads:`,
    formatAncestry(term),
    ancestry.length ? `Retrace paths (needs): ${ancestry.map((p) => p.join(" → ")).join(" | ")}` : "",
    externalNeeds.length
      ? `Some needs reach outside the loaded slice: ${externalNeeds.join(", ")}.`
      : "All needs are represented in the loaded synchronised slice.",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildEvidence(before, after, restored, perturb, term, perturbValid, throughPaths, branchBreaks) {
  return [
    "Perturbation applied to read-model only; Atlas source files were not modified.",
    perturbValid
      ? `Removed need [[${perturb}]] from ${term} for one pass.`
      : `Perturbation [[${perturb}]] invalid for ${term}.`,
    `Retrace to Relation before perturb: ${before ? "yes" : "no"}.`,
    `Retrace to Relation after perturb: ${after ? "yes" : "no"}.`,
    `After restore: ${restored ? "yes" : "no"}.`,
    branchBreaks
      ? `Ancestry paths through [[${perturb}]]: ${throughPaths.map((p) => p.join(" → ")).join(" | ")} — branch no longer held in read-model.`
      : "",
    term === DEFAULT_TERM && perturb === DEFAULT_PERTURB
      ? "Maintained Coupling includes Compatibility (post D-004 synchronised read-model)."
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildRecommendation(characterisation, perturb, term, forestState) {
  const map = {
    "load-bearing": `Dependency [[${perturb}]] reads load-bearing for ${term} — removing it breaks full retrace in this slice.`,
    weakened: `Dependency [[${perturb}]] reads weakened — ancestry through it breaks while ${term} may still retrace elsewhere.`,
    unchanged: "No structural change detected at this perturbation.",
    stasis: `${term} was not retraceable before perturb — stasis, not discovery.`,
    unresolved: "Perturbation could not be applied; characterisation unresolved.",
  };
  return [
    map[characterisation] || characterisation,
    `Forest read: ${forestState}.`,
    "Calibration, not proof. No Calculus claim is promoted.",
  ].join(" ");
}
