import { createServer } from "node:http";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const runsDir = path.join(__dirname, "runs");
const jsonDir = path.join(runsDir, "json");
const markdownDir = path.join(runsDir, "markdown");
const port = Number(process.env.PORT || 8787);

const ARK_RUNTIME_MODEL = {
  version: "0.5",
  name: "Ark Run - Dependency Transition System",
  displaySequence: "Pressure -> Trace -> Check -> Determine -> Step",
  postureSequence: "From Posture -> Pressure -> Trace -> Check -> Determine -> Step -> Next Posture",
  transitionPrinciple:
    "The Atlas describes carrying states. The Ark describes valid transitions between them.",
  determineSeed: {
    determine: "Determine is the Ark transition that carries pressure into bounded hold.",
    determination:
      "Determination is the temporary hold produced when pressure has been retraced, checked, and bounded to the scope of read needed for a next answerable step.",
  },
  states: {
    current_posture: { kind: "state", atlasTerm: "first.posture" },
    pressure_unresolved: { kind: "state", atlasTerm: "second.pressure" },
    dependency_visible: { kind: "state", atlasTerms: ["practice.retrace-practice", "first.trace"] },
    scope_bounded: {
      kind: "state",
      description: "Scope has been selected and bounded for this read.",
      atlasTerms: ["practice.check", "first.boundary", "first.clearance"],
    },
    determination_held: { kind: "state", term: "ark.determination", status: "introduced_runtime_state" },
    next_posture: { kind: "state", atlasTerm: "first.posture" },
  },
  discernmentPrinciple:
    "An Ark determination may be made by an AI or a human; when recorded, it should remain retraceable, scoped, warranted, and open to revision.",
  forceTransitionPrinciple:
    "Generated force can be read for whether it preserves availability as care, directs with correction as compatible control, or continues after correction is no longer received as control drift.",
  forceTerms: {
    care: "third.care",
    control: "third.control",
    controlDrift: "third.control-drift",
    guard: "second.guard",
  },
  transitions: [
    { from: "current_posture", operation: "pressure", to: "pressure_unresolved" },
    { from: "pressure_unresolved", operation: "trace", to: "dependency_visible" },
    { from: "dependency_visible", operation: "check", to: "scope_bounded" },
    { from: "scope_bounded", operation: "determine", to: "determination_held" },
    { from: "determination_held", operation: "step", to: "next_posture" },
  ],
  atlasProgression: {
    fromPosture: "first.posture",
    pressure: "second.pressure",
    trace: ["practice.retrace-practice", "first.trace"],
    check: ["practice.check", "first.boundary", "first.clearance", "practice.carry-trace-test"],
    determine: {
      status: "introduced_runtime_term",
      dependsOn: [
        "second.pressure",
        "second.carrying",
        "first.hold",
        "practice.check",
        "first.boundary",
        "first.clearance",
      ],
      nearTerms: ["first.resolution", "second.decision"],
      opens: ["practice.step", "first.posture"],
    },
    step: "practice.step",
    nextPosture: "first.posture",
  },
};

function send(res, status, body, type = "application/json") {
  res.writeHead(status, {
    "Content-Type": `${type}; charset=utf-8`,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function safeText(value) {
  return String(value || "").trim();
}

function safeList(value) {
  if (Array.isArray(value)) {
    return value.map(safeText).filter(Boolean);
  }

  return safeText(value)
    .split(/\r?\n|,/)
    .map(safeText)
    .filter(Boolean);
}

function slugify(value) {
  const slug = safeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);

  return slug || "ark-run";
}

function inferRunStatus(run) {
  if (run.state?.current) return run.state.current;
  if (run.step.valid) return "next_posture";
  if (run.determine.status === "determined") return "determination_held";
  if (run.check.status === "checked") return "scope_bounded";
  if (run.trace.summary || run.trace.question || run.trace.atlasEntryIds.length) return "dependency_visible";
  return "pressure_unresolved";
}

function inferDetermineStatus(input) {
  const explicit = safeText(input.determineStatus);
  if (explicit === "determined" && !safeText(input.determination)) return "undetermined";
  if (["undetermined", "provisional", "determined"].includes(explicit)) return explicit;
  if (safeText(input.determination) && safeText(input.scope) && safeText(input.warrantStatement)) return "determined";
  if (safeText(input.determination)) return "provisional";
  return "undetermined";
}

function validateRun(run) {
  const blockers = [];
  const warnings = [];

  if (!run.pressure.statement) blockers.push("Pressure is required to save an Ark Run.");
  if (!run.posture.from) warnings.push("From posture is open.");
  if (!run.trace.summary && run.trace.atlasEntryIds.length === 0) warnings.push("Trace is not yet recorded.");
  if (run.trace.atlasEntryIds.length === 0) warnings.push("No manual Atlas entry ids are attached yet.");
  if (!run.check.clearance) warnings.push("Clearance has not been checked.");
  if (!run.determine.scope) warnings.push("Determination scope of read is open.");
  if (!run.determine.warrantStatement) warnings.push("Determination warrant is open.");
  if (!run.determine.heldPressure) warnings.push("Held pressure is not named yet.");
  if (run.check.clearance && run.determine.scope && !run.determine.statement) {
    warnings.push("A bounded scope of read requires a determination before the run can move.");
  }
  if (run.determine.statement && !run.determine.scope) {
    warnings.push("A determination without a named scope of read may become too absolute.");
  }
  if (run.determine.statement && !run.discernment.discernible) {
    warnings.push("Determination is not yet fully discernible.");
  }
  if (run.determine.statement && run.forceTransition.readsAs === "unread") {
    warnings.push("Generated force has not yet been read as care, control, drift, or unresolved.");
  }
  if (run.forceTransition.readsAs === "control" && !run.forceTransition.directedConditionCanCorrectDirection) {
    warnings.push("Control is not compatible unless the directed condition can correct direction.");
  }
  if (run.forceTransition.readsAs === "control_drift") {
    warnings.push("Control drift blocks movement until correction or re-scope occurs.");
  }
  if (run.step.nextPosture && !run.step.valid) {
    warnings.push("Next posture is proposed, not yet a valid step.");
  }

  return {
    validSave: blockers.length === 0,
    validStep: run.step.valid,
    blockers,
    warnings,
  };
}

function transitionRecord(from, operation, to, warrant, notes = "") {
  return { from, operation, to, warrant, notes };
}

function buildTransitions(run) {
  return [
    transitionRecord(
      "current_posture",
      "pressure",
      "pressure_unresolved",
      Boolean(run.pressure.statement),
      "Pressure becomes the active carrying state.",
    ),
    transitionRecord(
      "pressure_unresolved",
      "trace",
      "dependency_visible",
      Boolean(run.trace.summary || run.trace.atlasEntryIds.length),
      "Retrace makes dependency partially visible.",
    ),
    transitionRecord(
      "dependency_visible",
      "check",
      "scope_bounded",
      Boolean(run.check.clearance),
      "Check selects and bounds the scope of read.",
    ),
    transitionRecord(
      "scope_bounded",
      "determine",
      "determination_held",
      run.determine.status === "determined" &&
        Boolean(
          run.determine.statement &&
            run.determine.heldPressure &&
            run.determine.scope &&
            run.determine.warrantStatement,
        ),
      "Determine carries pressure into bounded hold.",
    ),
    transitionRecord(
      "determination_held",
      "step",
      "next_posture",
      run.step.valid,
      "Step opens the next carrying posture.",
    ),
  ];
}

function currentStateFromTransitions(transitions) {
  let current = "current_posture";
  for (const transition of transitions) {
    if (!transition.warrant) break;
    current = transition.to;
  }
  return current;
}

function invariantChecks(run) {
  const checks = [
    {
      id: "no_pressure_to_step",
      statement: "Pressure cannot transition directly to Step.",
      passed: run.transitions.every(
        (transition) => !(transition.from === "pressure_unresolved" && transition.to === "next_posture"),
      ),
    },
    {
      id: "determine_requires_trace",
      statement: "Determination requires retrace or Atlas entry reference.",
      passed: run.determine.status !== "determined" || Boolean(run.trace.summary || run.trace.atlasEntryIds.length),
    },
    {
      id: "determine_requires_scope",
      statement: "Determination must name the scope of read it belongs to.",
      passed: run.determine.status !== "determined" || Boolean(run.determine.scope),
    },
    {
      id: "bounded_scope_requires_determination",
      statement: "Each bounded scope of read requires a determination.",
      passed: !(run.check.clearance && run.determine.scope) || Boolean(run.determine.statement),
    },
    {
      id: "move_requires_warrant",
      statement: "Next posture requires warranted determination.",
      passed: run.state.current !== "next_posture" || Boolean(run.determine.warrantStatement),
    },
    {
      id: "determination_requires_discernibility",
      statement: "Determination must remain discernible after it is made.",
      passed: run.determine.status !== "determined" || run.discernment.discernible,
    },
    {
      id: "force_requires_care_control_read",
      statement: "Generated force must be read as care, compatible control, drift, or unresolved.",
      passed: run.determine.status !== "determined" || run.forceTransition.readsAs !== "unread",
    },
    {
      id: "control_requires_correction",
      statement: "Compatible control requires correction from the directed condition.",
      passed:
        run.forceTransition.readsAs !== "control" ||
        run.forceTransition.directedConditionCanCorrectDirection,
    },
    {
      id: "control_drift_blocks_move",
      statement: "Control drift cannot carry a valid next posture.",
      passed: run.state.current !== "next_posture" || run.forceTransition.readsAs !== "control_drift",
    },
    {
      id: "move_requires_valid_step",
      statement: "Next posture can be entered only through a valid step.",
      passed: run.state.current !== "next_posture" || run.step.valid,
    },
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks,
  };
}

function buildRun(input) {
  const created = new Date().toISOString();
  const id = `${created.replace(/[:.]/g, "-")}-${slugify(input.pressure)}`;
  const determineStatus = inferDetermineStatus(input);

  const run = {
    id,
    created,
    version: ARK_RUNTIME_MODEL.version,
    runtime: ARK_RUNTIME_MODEL,
    posture: {
      from: safeText(input.currentPosture),
      next: safeText(input.nextCarryingPosture),
    },
    pressure: {
      statement: safeText(input.pressure),
      atlasTerm: ARK_RUNTIME_MODEL.atlasProgression.pressure,
    },
    trace: {
      summary: safeText(input.retrace),
      missingDependency: safeText(input.missingDependency),
      atlasEntryIds: safeList(input.atlasEntryIds),
      activeCondition: safeText(input.activeCondition),
      heldBy: safeText(input.heldBy),
      carries: safeText(input.carries),
      question: safeText(input.traceQuestion),
    },
    check: {
      clearance: safeText(input.clearance),
      prematureDeterminationRisk: safeText(input.prematureDeterminationRisk),
      status: safeText(input.clearance) ? "checked" : "unchecked",
      atlasTerms: ARK_RUNTIME_MODEL.atlasProgression.check,
    },
    determine: {
      statement: safeText(input.determination),
      heldPressure: safeText(input.heldPressure),
      scope: safeText(input.scope),
      warrantStatement: safeText(input.warrantStatement),
      status: determineStatus,
      runtimeTerm: ARK_RUNTIME_MODEL.atlasProgression.determine,
    },
    discernment: {
      determinationVisible: Boolean(safeText(input.determination)),
      traceVisible: Boolean(safeText(input.retrace) || safeList(input.atlasEntryIds).length),
      scopeVisible: Boolean(safeText(input.scope)),
      warrantVisible: Boolean(safeText(input.warrantStatement)),
      challengePoints: safeText(input.challengePoints),
      revisionPath: safeText(input.revisionPath),
      discernible: false,
    },
    forceTransition: {
      generatedBy: "determination",
      readsAs: ["care", "control", "control_drift", "unresolved"].includes(safeText(input.forceRead))
        ? safeText(input.forceRead)
        : "unread",
      availabilityPreserved: input.availabilityPreserved === "on" || input.availabilityPreserved === true,
      directedConditionCanCorrectDirection:
        input.directedConditionCanCorrectDirection === "on" ||
        input.directedConditionCanCorrectDirection === true,
      notes: safeText(input.forceNotes),
      atlasTerms: ARK_RUNTIME_MODEL.forceTerms,
    },
    step: {
      next: safeText(input.nextStep),
      nextPosture: safeText(input.nextCarryingPosture),
      valid: false,
      atlasTerm: ARK_RUNTIME_MODEL.atlasProgression.step,
    },
    register: {
      determined: safeText(input.registerDetermined),
      stillOpen: safeText(input.registerStillOpen),
      nextPressure: safeText(input.nextPressure),
    },
  };

  run.discernment.discernible =
    run.discernment.determinationVisible &&
    run.discernment.traceVisible &&
    run.discernment.scopeVisible &&
    run.discernment.warrantVisible &&
    Boolean(run.discernment.challengePoints || run.discernment.revisionPath);

  const forceCanCarry =
    run.forceTransition.readsAs === "care" ||
    (run.forceTransition.readsAs === "control" &&
      run.forceTransition.directedConditionCanCorrectDirection) ||
    run.forceTransition.readsAs === "unresolved";

  run.step.valid =
    run.determine.status === "determined" &&
    Boolean(run.trace.summary || run.trace.atlasEntryIds.length) &&
    Boolean(run.check.clearance) &&
    Boolean(run.determine.statement) &&
    Boolean(run.determine.scope) &&
    Boolean(run.determine.warrantStatement) &&
    run.discernment.discernible &&
    forceCanCarry &&
    Boolean(run.step.next || run.step.nextPosture);

  run.transitions = buildTransitions(run);
  run.state = {
    current: currentStateFromTransitions(run.transitions),
    next: !run.step.valid && run.step.nextPosture ? "next_posture" : null,
    states: ARK_RUNTIME_MODEL.states,
  };

  run.formalStatus = {
    runStatus: inferRunStatus(run),
    warrantStatus: run.step.valid ? "warranted" : run.determine.statement ? "partial" : "unwarranted",
    validMove: run.step.valid,
    discernible: run.discernment.discernible,
    forceRead: run.forceTransition.readsAs,
  };
  run.validation = validateRun(run);
  run.invariants = invariantChecks(run);

  return run;
}

function bullets(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "_Open._";
}

function text(value) {
  return value || "_Open._";
}

function transitionLines(transitions) {
  return transitions
    .map((transition) => {
      const mark = transition.warrant ? "valid" : "blocked";
      return `- ${transition.from} --${transition.operation}--> ${transition.to} (${mark})`;
    })
    .join("\n");
}

function invariantLines(invariants) {
  return invariants.checks
    .map((check) => `- ${check.passed ? "pass" : "fail"}: ${check.statement}`)
    .join("\n");
}

function markdownFor(run) {
  return `---\ntype: ark-run\nversion: "${run.version}"\nid: ${run.id}\ncreated: ${run.created}\ncurrent_state: ${run.state.current}\nrun_status: ${run.formalStatus.runStatus}\nwarrant_status: ${run.formalStatus.warrantStatus}\nvalid_move: ${run.formalStatus.validMove}\ndiscernible: ${run.formalStatus.discernible}\nforce_read: ${run.formalStatus.forceRead}\n---\n\n# ARK RUN - ${run.created.slice(0, 10)}\n\n## Formal Runtime\n\n${run.runtime.postureSequence}\n\n${run.runtime.transitionPrinciple}\n\n${run.runtime.discernmentPrinciple}\n\n${run.runtime.forceTransitionPrinciple}\n\nDetermine: ${run.runtime.determineSeed.determine}\n\nDetermination: ${run.runtime.determineSeed.determination}\n\n## State\n\nCurrent state: ${run.state.current}\n\nNext state: ${run.state.next || "_Open._"}\n\n## Transitions\n\n${transitionLines(run.transitions)}\n\n## Invariant Checks\n\n${invariantLines(run.invariants)}\n\n## Atlas Grounding\n\n- Pressure state: ${run.runtime.atlasProgression.pressure}\n- Trace transition: ${run.runtime.atlasProgression.trace.join(", ")}\n- Check transition: ${run.runtime.atlasProgression.check.join(", ")}\n- Determination state: introduced_runtime_state\n- Determine depends on: ${run.runtime.atlasProgression.determine.dependsOn.join(", ")}\n- Near terms: ${run.runtime.atlasProgression.determine.nearTerms.join(", ")}\n- Care/control terms: ${Object.values(run.runtime.forceTerms).join(", ")}\n- Step transition: ${run.runtime.atlasProgression.step}\n- Posture state: ${run.runtime.atlasProgression.nextPosture}\n\n## From Posture\n\n${text(run.posture.from)}\n\n## Pressure\n\n${text(run.pressure.statement)}\n\n## Trace\n\n${text(run.trace.summary)}\n\n### Atlas Entry IDs\n\n${bullets(run.trace.atlasEntryIds)}\n\n### Active Condition\n\n${text(run.trace.activeCondition)}\n\n### Held By\n\n${text(run.trace.heldBy)}\n\n### Carries\n\n${text(run.trace.carries)}\n\n### Trace Question\n\n${text(run.trace.question)}\n\n### Missing / Skipped Dependency\n\n${text(run.trace.missingDependency)}\n\n## Check\n\n### Clearance\n\n${text(run.check.clearance)}\n\n### Premature Determination Risk\n\n${text(run.check.prematureDeterminationRisk)}\n\n## Determine\n\n### Held Pressure\n\n${text(run.determine.heldPressure)}\n\n### Determination\n\n${text(run.determine.statement)}\n\n### Scope\n\n${text(run.determine.scope)}\n\n### Warrant Statement\n\n${text(run.determine.warrantStatement)}\n\n### Status\n\n${run.determine.status}\n\n## Discernment\n\n- Determination visible: ${run.discernment.determinationVisible}\n- Trace visible: ${run.discernment.traceVisible}\n- Scope visible: ${run.discernment.scopeVisible}\n- Warrant visible: ${run.discernment.warrantVisible}\n- Discernible: ${run.discernment.discernible}\n\n### Challenge Points\n\n${text(run.discernment.challengePoints)}\n\n### Revision Path\n\n${text(run.discernment.revisionPath)}\n\n## Force Transition\n\n- Generated by: ${run.forceTransition.generatedBy}\n- Reads as: ${run.forceTransition.readsAs}\n- Availability preserved: ${run.forceTransition.availabilityPreserved}\n- Directed condition can correct direction: ${run.forceTransition.directedConditionCanCorrectDirection}\n\n### Notes\n\n${text(run.forceTransition.notes)}\n\n## Step\n\n### Next Step\n\n${text(run.step.next)}\n\n### Next Carrying Posture\n\n${text(run.step.nextPosture)}\n\n### Valid Move\n\n${run.step.valid}\n\n## Register\n\n### Determined\n\n${text(run.register.determined)}\n\n### Still Open\n\n${text(run.register.stillOpen)}\n\n### Next Pressure\n\n${text(run.register.nextPressure)}\n\n## Validation\n\n### Blockers\n\n${bullets(run.validation.blockers)}\n\n### Warnings\n\n${bullets(run.validation.warnings)}\n`;
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 250_000) {
      throw new Error("Request body too large.");
    }
  }
  return JSON.parse(body || "{}");
}

async function ensureDirs() {
  await mkdir(jsonDir, { recursive: true });
  await mkdir(markdownDir, { recursive: true });
}

function summarizeRun(run) {
  return {
    id: run.id,
    created: run.created,
    pressure: run.pressure?.statement ?? run.pressure ?? "",
    atlasEntryIds: run.trace?.atlasEntryIds ?? run.atlasEntryIds ?? [],
    activeCondition: run.trace?.activeCondition ?? run.activeCondition ?? "",
    determination: run.determine?.statement ?? run.determination ?? "",
    determineStatus: run.determine?.status ?? "",
    currentState: run.state?.current ?? run.formalStatus?.runStatus ?? "",
    warrantStatus: run.formalStatus?.warrantStatus ?? "",
    validMove: run.formalStatus?.validMove ?? false,
    discernible: run.formalStatus?.discernible ?? false,
    forceRead: run.formalStatus?.forceRead ?? run.forceTransition?.readsAs ?? "",
    scope: run.determine?.scope ?? run.scope ?? "",
    nextPressure: run.register?.nextPressure ?? run.nextPressure ?? "",
  };
}

async function listRuns() {
  await ensureDirs();
  const names = await readdir(jsonDir);
  const runs = await Promise.all(
    names
      .filter((name) => name.endsWith(".json"))
      .map(async (name) => {
        const raw = await readFile(path.join(jsonDir, name), "utf8");
        return summarizeRun(JSON.parse(raw));
      }),
  );

  return runs.sort((a, b) => b.created.localeCompare(a.created));
}

async function saveRun(input) {
  await ensureDirs();
  const run = buildRun(input);

  if (!run.validation.validSave) {
    return { ...run, rejected: true };
  }

  await writeFile(path.join(jsonDir, `${run.id}.json`), `${JSON.stringify(run, null, 2)}\n`);
  await writeFile(path.join(markdownDir, `${run.id}.md`), markdownFor(run));

  return run;
}

async function serveStatic(req, res) {
  const requestedPath = new URL(req.url, "http://localhost").pathname;
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.normalize(path.join(publicDir, relativePath));

  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
    send(res, 404, "Not found", "text/plain");
    return;
  }

  const ext = path.extname(filePath);
  const type = ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : "text/html";
  send(res, 200, await readFile(filePath, "utf8"), type);
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/runs") {
      send(res, 200, JSON.stringify(await listRuns(), null, 2));
      return;
    }

    if (req.method === "POST" && req.url === "/api/runs") {
      const run = await saveRun(await readJson(req));
      send(res, run.rejected ? 422 : 201, JSON.stringify(run, null, 2));
      return;
    }

    if (req.method === "GET") {
      await serveStatic(req, res);
      return;
    }

    send(res, 405, "Method not allowed", "text/plain");
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message }, null, 2));
  }
});

server.listen(port, () => {
  console.log(`Ark Run prototype listening on http://localhost:${port}`);
});
