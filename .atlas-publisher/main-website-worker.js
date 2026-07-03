// main-website-worker.js
// realitymechanics.nz — Field-only public surface

import { RELATION_FIELDS } from "../atlas-structure-contract.mjs";
import {
  maturityBandFromComponents,
  readFieldConfig,
  structureCarriesEntry,
} from "../field-maturity.mjs";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const HTML_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-cache",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function fieldJson(value, fallback = {}) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

const FIELD_RELATION_KEYS = ["holds", "traces", "carries", "pairs", "nests"];

function fieldRelations(structure) {
  const source = structure && typeof structure === "object" ? structure : {};
  return Object.fromEntries(FIELD_RELATION_KEYS.map((key) => [
    key,
    Array.isArray(source[key]) ? source[key].filter(Boolean).map(String) : [],
  ]));
}

function fieldDaysSince(now, at) {
  const t = at ? new Date(at).getTime() : NaN;
  return Number.isFinite(t) ? Math.max(0, (now.getTime() - t) / 86400000) : 0;
}

function fieldRound(n, places = 3) {
  const scale = 10 ** places;
  return Math.round(Number(n || 0) * scale) / scale;
}

function fieldClamp01(n) {
  return Math.max(0, Math.min(1, Number(n || 0)));
}

function fieldStmt(env, sql, params = []) {
  const stmt = env.ATLAS_DB.prepare(sql);
  return params.length ? stmt.bind(...params) : stmt;
}

async function fieldAll(env, sql, params = []) {
  return (await fieldStmt(env, sql, params).all()).results || [];
}

function fieldRatioMode(mass, thresholds = {}) {
  const transitional = Number(thresholds.transitional_min_mass ?? thresholds.transitionalMinMass ?? 3);
  const continuous = Number(thresholds.continuous_min_mass ?? thresholds.continuousMinMass ?? 8);
  const x = Number(mass || 0);
  return {
    mode: x >= continuous ? "continuous" : x >= transitional ? "transitional" : "discrete",
    x,
  };
}

export async function deriveFieldStatesPayload(env, now = new Date()) {
  if (!env.ATLAS_DB) throw new Error("db_unavailable");

  const [entries, revisions, proposals, atlasVersion, ratioModeThresholds] = await Promise.all([
    fieldAll(env, "SELECT id, title, entry_order, excerpt, plain_text, structure, created, updated FROM entries ORDER BY source_path, id"),
    fieldAll(env, "SELECT entry_id, edit_class, actor, at FROM entry_revisions"),
    fieldAll(env, "SELECT entry_id, status, light_count, shade_count, created_at, updated_at FROM proposals"),
    readFieldConfig(env, "atlas_version", null),
    readFieldConfig(env, "field_ratio_mode_thresholds", { transitional_min_mass: 3, continuous_min_mass: 8 }),
  ]);

  const entryIds = new Set(entries.map((entry) => entry.id));
  const carriersById = new Map(entries.map((entry) => [entry.id, 0]));
  const structures = new Map(entries.map((entry) => [entry.id, fieldJson(entry.structure, {})]));
  for (const source of entries) {
    const structure = structures.get(source.id);
    for (const target of entryIds) {
      if (source.id !== target && structureCarriesEntry(structure, target)) {
        carriersById.set(target, (carriersById.get(target) || 0) + 1);
      }
    }
  }

  const revisionsByEntry = new Map();
  for (const revision of revisions) {
    if (!revisionsByEntry.has(revision.entry_id)) revisionsByEntry.set(revision.entry_id, []);
    revisionsByEntry.get(revision.entry_id).push(revision);
  }

  const proposalsByEntry = new Map();
  for (const proposal of proposals) {
    if (!proposalsByEntry.has(proposal.entry_id)) proposalsByEntry.set(proposal.entry_id, []);
    proposalsByEntry.get(proposal.entry_id).push(proposal);
  }

  const bands = await readFieldConfig(env, "maturity_bands", {});
  const bandSettledness = { placed: 0.06, fresh: 0.16, settling: 0.42, established: 0.68, mature: 0.9 };

  const states = entries.map((entry) => {
    const relations = fieldRelations(structures.get(entry.id));
    const entryRevisions = revisionsByEntry.get(entry.id) || [];
    const structuralRevisions = entryRevisions.filter((r) => r.edit_class === "structural");
    const latestStructural = structuralRevisions
      .slice()
      .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")))[0];
    const changedAt = latestStructural?.at || entry.updated || entry.created || null;
    const daysStable = fieldRound(fieldDaysSince(now, changedAt), 1);
    const revisions30d = entryRevisions.filter((r) => fieldDaysSince(now, r.at) <= 30).length;
    const reverts90d = entryRevisions.filter((r) => r.actor === "revert" && fieldDaysSince(now, r.at) <= 90).length;
    const appliedProseTendings = entryRevisions.filter((r) =>
      r.edit_class === "prose" && (!changedAt || String(r.at || "") >= String(changedAt))
    ).length;
    const entryProposals = proposalsByEntry.get(entry.id) || [];
    const affirmedPasses = entryProposals.filter((p) =>
      p.status === "affirmed" && (!changedAt || String(p.created_at || p.updated_at || "") >= String(changedAt))
    ).length;
    const netLight = entryProposals.reduce((sum, p) =>
      sum + Number(p.light_count || 0) - Number(p.shade_count || 0), 0);
    const mass = { carriers: Number(carriersById.get(entry.id) || 0) };
    const maturityComponents = {
      daysStable,
      lastStructuralChange: changedAt,
      lastChangeSource: latestStructural ? "entry_revisions" : "entries.updated (revision history is young)",
      carriers: mass.carriers,
      revertsLast90d: reverts90d,
      attestations: affirmedPasses + appliedProseTendings,
      netLight,
    };
    const maturityBand = maturityBandFromComponents(maturityComponents, bands);
    const agitationScore = fieldClamp01(revisions30d * 0.08 + reverts90d * 0.28);
    const settlednessScore = fieldClamp01(
      (bandSettledness[maturityBand] ?? 0.1) +
      Math.min(0.14, maturityComponents.attestations * 0.035) -
      agitationScore * 0.12
    );

    return {
      id: entry.id,
      title: entry.title,
      order: entry.entry_order || "operation",
      excerpt: entry.excerpt || String(entry.plain_text || "").slice(0, 420),
      relations,
      ratioMode: fieldRatioMode(mass.carriers, ratioModeThresholds),
      mass,
      maturityBand,
      agitation: {
        score: fieldRound(agitationScore),
        revisions30d,
        reverts90d,
      },
      settledness: {
        score: fieldRound(settlednessScore),
        attestations: maturityComponents.attestations,
        affirmedPasses,
        appliedProseTendings,
      },
      components: {
        maturity: maturityComponents,
      },
    };
  });

  return {
    contractVersion: 1,
    source: "d1-derived",
    atlasVersion,
    generatedAt: now.toISOString(),
    excludes: ["weather", "clearance", "lightShadowPressure", "geodesicBending", "membraneEdge"],
    thresholds: {
      ratioMode: {
        transitionalMinMass: Number(ratioModeThresholds.transitional_min_mass ?? ratioModeThresholds.transitionalMinMass ?? 3),
        continuousMinMass: Number(ratioModeThresholds.continuous_min_mass ?? ratioModeThresholds.continuousMinMass ?? 8),
      },
    },
    states,
  };
}

async function handleFieldStates(env) {
  if (!env.ATLAS_DB)
    return new Response(JSON.stringify({ error: "db_unavailable" }), { status: 503, headers: JSON_HEADERS });
  const payload = await deriveFieldStatesPayload(env);
  return new Response(JSON.stringify(payload), { status: 200, headers: {
    ...JSON_HEADERS,
    "Cache-Control": "public, max-age=120",
  }});
}

// ── Field page ────────────────────────────────────────────────────────────────

export function fieldPage(options = {}) {
  const initialRegister = options.initialRegister === "constellation" ? "constellation" : "material";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Field · Reality Mechanics</title>
  <meta name="description" content="An experimental operations surface for Reality Mechanics."/>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { margin: 0; width: 100%; height: 100%; overflow: hidden; overflow-x: hidden; }
    body { margin: 0; width: 100%; max-width: 100vw; height: 100%; overflow: hidden; overflow-x: hidden; background: #06080d; color: #d4c5a9; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
    canvas { position: fixed; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; }
    #top {
      position: fixed; inset: 1.4rem 1.6rem auto 1.6rem; z-index: 5;
      display: flex; align-items: center; justify-content: space-between; pointer-events: none;
    }
    #top a, #mode {
      pointer-events: auto; text-decoration: none; color: rgba(58,80,112,0.72);
      font: 700 0.62rem/1 system-ui, sans-serif; letter-spacing: 0.16em; text-transform: uppercase;
    }
    #top a:hover { color: rgba(200,96,26,0.8); }
    #mode { color: rgba(200,96,26,0.48); }
    #access-row {
      position: fixed; left: 50%; top: 1.28rem; transform: translateX(-50%);
      z-index: 8; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.7rem 1rem;
      max-width: min(34rem, calc(100vw - 7rem)); pointer-events: auto;
    }
    #access-row a {
      color: rgba(58,80,112,0.76); text-decoration: none;
      font: 700 0.58rem/1 system-ui, sans-serif; letter-spacing: 0.12em; text-transform: uppercase;
      transition: color 0.18s ease;
    }
    #access-row a:hover,
    #access-row a[aria-current="page"] { color: rgba(200,96,26,0.82); }
    #enter-form {
      position: fixed; left: 50%; bottom: 1.4rem; transform: translateX(-50%);
      z-index: 12; width: min(19rem, calc(100vw - 2rem)); pointer-events: auto;
      opacity: 0.72; transition: opacity 0.24s ease;
    }
    body.sheet-open #enter-form { opacity: 0.14; pointer-events: none; }
    #enter-input {
      width: 100%; border: 0; border-bottom: 1px solid rgba(255,255,255,0.07);
      background: transparent; outline: none; padding: 0.32rem 0 0.36rem;
      color: rgba(200,96,26,0.86); caret-color: rgba(200,96,26,0.9);
      font: 500 0.95rem/1.2 "Iowan Old Style", Charter, Georgia, serif;
      text-align: center; letter-spacing: 0.01em;
    }
    #enter-input::placeholder { color: rgba(58,80,112,0.72); opacity: 1; }
    #enter-input:focus { border-bottom-color: rgba(200,96,26,0.36); }
    #term-sheet {
      position: fixed; top: 0; right: min(-28rem, -88vw); bottom: 0; z-index: 30;
      width: min(28rem, 88vw); overflow-y: auto; pointer-events: auto;
      background: rgba(7,9,14,0.96); border-left: 1px solid rgba(255,255,255,0.055);
      backdrop-filter: blur(14px); padding: 4.5rem 1.55rem 2rem;
      transition: right 0.34s cubic-bezier(0.32,0.72,0,1);
    }
    #term-sheet.open { right: 0; }
    #sheet-close {
      position: absolute; top: 0.9rem; right: 1.1rem; border: 0; background: none;
      color: #4d5e72; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0.3rem 0.6rem;
    }
    #sheet-close:hover { color: #c8601a; }
    #sheet-order {
      font: 700 0.62rem/1 system-ui, sans-serif; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(200,96,26,0.5); margin-bottom: 0.4rem;
    }
    #sheet-title {
      font: 500 clamp(1.5rem, 4vw, 2.4rem)/1.1 "Iowan Old Style", Charter, Georgia, serif;
      color: #c8601a; margin-bottom: 1.15rem;
    }
    #sheet-excerpt {
      margin: -0.35rem 0 1.3rem;
      color: rgba(212,197,169,0.74);
      font: 500 0.96rem/1.55 "Iowan Old Style", Charter, Georgia, serif;
      white-space: pre-wrap;
    }
    #sheet-relations {
      display: flex; flex-wrap: wrap; gap: 1.45rem 1.8rem;
      margin-bottom: 0.2rem;
    }
    .sheet-group h4 {
      margin: 0 0 0.45rem; font: 700 0.6rem/1 system-ui, sans-serif;
      letter-spacing: 0.12em; text-transform: uppercase; color: #2a3848;
    }
    .sheet-relation {
      display: block; border: 0; background: none; padding: 0.18rem 0;
      color: #3d5570; cursor: pointer; text-align: left;
      font: 500 0.92rem/1.22 "Iowan Old Style", Charter, Georgia, serif;
    }
    .sheet-relation:hover { color: #c8601a; }
    #sheet-empty {
      display: none; color: rgba(58,80,112,0.72);
      font: 500 0.9rem/1.45 "Iowan Old Style", Charter, Georgia, serif;
    }
    #relation-debug {
      position: fixed; right: 1rem; bottom: 1rem; z-index: 18;
      width: min(34rem, calc(100vw - 2rem)); max-height: min(56vh, 32rem);
      overflow: auto; display: none; pointer-events: auto;
      margin: 0; padding: 0.85rem 0.95rem;
      background: rgba(5,7,11,0.88); border: 1px solid rgba(255,255,255,0.08);
      color: rgba(192,205,220,0.78);
      font: 600 0.64rem/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      white-space: pre-wrap; backdrop-filter: blur(14px);
    }
    #relation-debug.ready { display: block; }
    @media (max-width: 700px) {
      #top { inset: 1rem 1rem auto 1rem; }
      #access-row { top: 3rem; max-width: calc(100vw - 2rem); gap: 0.55rem 0.8rem; }
      #enter-form { bottom: 1rem; }
      #term-sheet { width: min(24rem, 92vw); right: min(-24rem, -92vw); padding: 4.25rem 1.15rem 2rem; }
    }
  </style>
</head>
<body>
<canvas id="field"></canvas>
<div id="top">
  <div id="mode">Field</div>
</div>
<nav id="access-row" aria-label="Reality Mechanics areas">
  <a href="https://calibration.realitymechanics.nz/">Calibration</a>
</nav>
<form id="enter-form" role="search">
  <input id="enter-input" type="text" autocomplete="off" spellcheck="false"
    placeholder="Enter a term" aria-label="Enter a term" maxlength="200"/>
</form>
<section id="term-sheet" aria-live="polite" aria-label="Term sheet">
  <button id="sheet-close" aria-label="Close">×</button>
  <div id="sheet-order"></div>
  <div id="sheet-title"></div>
  <div id="sheet-excerpt"></div>
  <div id="sheet-relations"></div>
  <p id="sheet-empty"></p>
</section>
<pre id="relation-debug" aria-live="polite"></pre>
<script>
let allOps = {};      // full Atlas index: id -> entry (holds/traces/carries/pairs/nests as id arrays)
let fieldStatesPayload = null; // /api/field/states: semantic renderer contract + geometry ids
let currentFieldReferenceFrame = null;
let globalFrameIds = new Set();
let localFrameIds = new Set();
let coupledSensibility = {};
const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d', { alpha: false });
const modeEl = document.getElementById('mode');
const enterForm = document.getElementById('enter-form');
const enterInput = document.getElementById('enter-input');
const termSheetEl = document.getElementById('term-sheet');
const sheetCloseEl = document.getElementById('sheet-close');
const sheetExcerptEl = document.getElementById('sheet-excerpt');
const sheetRelationsEl = document.getElementById('sheet-relations');
const sheetEmptyEl = document.getElementById('sheet-empty');
const relationDebugEl = document.getElementById('relation-debug');
const INITIAL_REGISTER = ${JSON.stringify(initialRegister)};
let readRegister = INITIAL_REGISTER;
let dpr = 1, w = 0, h = 0;
let focusId = null;
let targetFocusId = null;
let time = 0;
let settled = 0;
let scale = 1;
let targetScale = 1;
let pan = { x: 0, y: 0 };
let targetPan = { x: 0, y: 0 };
let pointer = null;
let hoverId = null;
let operations = {};
let fieldMovementEvent = null;
let fieldMovementAt = 0;
let traversalMap = {};   // "fromId:toId" -> { count, lastAt }
let lastTraversalKey = null;
let pressureField = null;
let relationPressureTraces = [];
let relationTrajectoryMemory = new Map();
let fieldMediumDt = 1 / 60;
let relationDebugEnabled = new URLSearchParams(location.search).get('debug') === 'relations';
let relationDebugSamples = [];
let relationDebugLastRender = 0;

const relationTypes = [
  // wiggMult: filament wiggle amplitude multiplier (low = taut/still, high = loose/drifting)
  // bowMult:  arc bow depth multiplier
  // branchProb: probability of filament branches (0 = none, 1 = always)
  // strandMult: strand count multiplier
  { key: 'holds',   color: [94, 112, 126],  strength: 0.56, direction: 'anchor',  wiggMult: 0.18, bowMult: 0.5,  branchProb: 0.0,  strandMult: 0.55 },
  { key: 'traces',  color: [94, 132, 170],  strength: 0.72, direction: 'return',  wiggMult: 1.85, bowMult: 0.85, branchProb: 0.88, strandMult: 1.5  },
  { key: 'carries', color: [200, 96, 26],   strength: 0.78, direction: 'outward', wiggMult: 0.32, bowMult: 1.5,  branchProb: 0.0,  strandMult: 0.65 },
  { key: 'pairs',   color: [165, 126, 76],  strength: 0.48, direction: 'lateral', wiggMult: 0.65, bowMult: 0.4,  branchProb: 0.08, strandMult: 0.5  },
  { key: 'nests',   color: [84, 105, 93],   strength: 0.42, direction: 'enclose', wiggMult: 0.12, bowMult: 0.28, branchProb: 0.0,  strandMult: 0.35 },
];

const FIELD_RENDER_BUDGET = Object.freeze({
  dprLargeViewport: 1.5,
  dprVeryLargeViewport: 1.25,
  smokePuffs: 48,
  homeCurrents: 96,
  filamentSegments: 14,
  filamentSegmentsCompressed: 10,
  relationStrands: 6,
  focusWrinkles: 6,
  localWrinkles: 4,
});

const FIELD_PRESSURE_GRID = Object.freeze({
  cols: 42,
  rows: 28,
  influence: 150,
  padding: 180,
  traceInfluence: 86,
  traceLimit: 260,
  traceDecay: 0.9,
  boundsRelax: 1.8,
  pressureRelax: 3.2,
  trajectoryRelax: 5.2,
});

let adaptiveFrameMs = 16.7;
let ambientQuality = 1;

function updateAdaptiveRenderQuality(frameMs) {
  if (!Number.isFinite(frameMs) || frameMs <= 0) return;
  adaptiveFrameMs += (frameMs - adaptiveFrameMs) * 0.08;
  const targetQuality = adaptiveFrameMs > 30 ? 0.44
    : adaptiveFrameMs > 24 ? 0.62
      : adaptiveFrameMs > 19 ? 0.82
        : 1;
  const rate = targetQuality < ambientQuality ? 0.12 : 0.025;
  ambientQuality += (targetQuality - ambientQuality) * rate;
}

function adaptiveAmbientScale(floor = 0.5) {
  return floor + (1 - floor) * ambientQuality;
}

const basinTypes = [
  { key: 'hold', title: 'Hold', x: -0.58, y: 0.42, color: [92, 105, 118] },
  { key: 'trace', title: 'Trace', x: -0.42, y: -0.28, color: [86, 128, 168] },
  { key: 'carry', title: 'Carry', x: 0.56, y: -0.18, color: [200, 96, 26] },
  { key: 'place', title: 'Place', x: -0.08, y: 0.58, color: [118, 100, 78] },
  { key: 'read', title: 'Read', x: 0.18, y: 0.42, color: [154, 142, 118] },
  { key: 'gateway', title: 'Gateway', x: 0.72, y: 0.24, color: [132, 118, 82] },
  { key: 'bearing', title: 'Bearing', x: -0.68, y: 0.02, color: [104, 92, 86] },
  { key: 'terminal', title: 'Terminal', x: 0.34, y: 0.64, color: [116, 128, 132] },
  { key: 'nest', title: 'Nest', x: -0.18, y: -0.62, color: [78, 110, 92] },
  { key: 'calibration', title: 'Calibration', x: 0.66, y: -0.58, color: [132, 84, 62] },
];

const compositionFamilies = [
  { key: 'anchor', title: 'Core', basins: ['hold', 'place', 'nest'], color: 'rgba(120,145,175,0.78)' },
  { key: 'motion', title: 'Flicker', basins: ['trace', 'carry', 'gateway'], color: 'rgba(200,96,26,0.72)' },
  { key: 'settlement', title: 'Glow', basins: ['read', 'terminal'], color: 'rgba(154,142,118,0.72)' },
  { key: 'strain', title: 'Char', basins: ['bearing', 'calibration'], color: 'rgba(132,84,62,0.7)' },
];

const orderBias = {
  ground: { gravity: 0.42, return: 0.12, continuation: 0.04, resonance: 0.02, enclosure: 0.06, turbulence: -0.18, resolution: 0.18, maturity: 0.34, airflow: -0.08 },
  root: { gravity: 0.38, return: 0.12, continuation: 0.06, resonance: 0.02, enclosure: 0.08, turbulence: -0.14, resolution: 0.16, maturity: 0.3, airflow: -0.06 },
  first: { gravity: 0.14, return: 0.18, continuation: 0.18, resonance: 0.08, enclosure: 0.04, turbulence: 0.08, resolution: -0.02, maturity: 0.08, airflow: 0.08 },
  second: { gravity: 0.1, return: 0.1, continuation: 0.14, resonance: 0.12, enclosure: 0.08, turbulence: 0.02, resolution: 0.18, maturity: 0.14, airflow: 0.08 },
  third: { gravity: 0.06, return: 0.08, continuation: 0.18, resonance: 0.12, enclosure: 0.2, turbulence: 0.04, resolution: 0.1, maturity: 0.16, airflow: 0.12 },
  practice: { gravity: 0.04, return: 0.08, continuation: 0.1, resonance: 0.08, enclosure: 0.06, turbulence: 0.16, resolution: 0.12, maturity: 0.08, airflow: 0.18 },
  higher: { gravity: 0.02, return: 0.08, continuation: 0.12, resonance: 0.24, enclosure: 0.1, turbulence: 0.12, resolution: 0.08, maturity: 0.1, airflow: 0.16 },
  operation: { gravity: 0.08, return: 0.1, continuation: 0.1, resonance: 0.1, enclosure: 0.16, turbulence: 0.08, resolution: 0.08, maturity: 0.08, airflow: 0.12 },
};

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function countIncoming(id, key) {
  // Scan full index so profile weights reflect the whole Atlas, not just the rendered neighbourhood
  return Object.values(allOps).filter((op) => (op[key] || []).includes(id)).length;
}

function stateFor(id) {
  return allOps[id]?.fieldState || null;
}

function maturityValue(state) {
  return ({ placed: 0.08, fresh: 0.16, settling: 0.42, established: 0.68, mature: 0.9 })[state?.maturityBand] ?? 0.08;
}

function ratioThresholds() {
  return fieldStatesPayload?.thresholds?.ratioMode || {};
}

function ratioModeForState(state) {
  const x = Number(state?.ratioMode?.x ?? state?.mass?.carriers ?? 0);
  const mode = state?.ratioMode?.mode || 'discrete';
  const thresholds = ratioThresholds();
  const transitionalMin = Math.max(1, Number(thresholds.transitionalMinMass || thresholds.transitional_min_mass || 3));
  const continuousMin = Math.max(transitionalMin + 1, Number(thresholds.continuousMinMass || thresholds.continuous_min_mass || 8));
  if (mode === 'continuous') {
    return {
      mode, x,
      transition: 1,
      continuous: clamp01(0.46 + (x - continuousMin) / Math.max(continuousMin, 6)),
      compression: clamp01(0.58 + (x - continuousMin) / Math.max(continuousMin * 1.4, 8)),
    };
  }
  if (mode === 'transitional') {
    const t = clamp01((x - transitionalMin) / Math.max(1, continuousMin - transitionalMin));
    return { mode, x, transition: 0.42 + t * 0.52, continuous: 0, compression: 0.18 + t * 0.28 };
  }
  return {
    mode, x,
    transition: clamp01(x / transitionalMin) * 0.18,
    continuous: 0,
    compression: 0,
  };
}

function structuralMassForState(state) {
  const ratio = ratioModeForState(state);
  const carriers = Number(state?.mass?.carriers || 0);
  const settledness = Number(state?.settledness?.score || 0);
  const maturity = maturityValue(state);
  const raw = 0.04
    + Math.min(0.28, carriers * 0.035)
    + ratio.transition * 0.18
    + ratio.continuous * 0.26
    + settledness * 0.14
    + maturity * 0.1;
  return clamp01(raw);
}

function termRatioMode(op) {
  return ratioModeForState(stateFor(op.id));
}

function orderBasinBias(order) {
  const value = String(order || 'operation').toLowerCase();
  if (value === 'ground' || value === 'root') return { hold: 0.32, trace: 0.08, place: 0.08 };
  if (value === 'first') return { trace: 0.18, carry: 0.18, hold: 0.08, place: 0.08, read: 0.06 };
  if (value === 'second') return { bearing: 0.18, gateway: 0.1, terminal: 0.14, carry: 0.08 };
  if (value === 'third') return { nest: 0.18, carry: 0.12, read: 0.08, gateway: 0.08 };
  if (value === 'practice') return { calibration: 0.18, read: 0.14, gateway: 0.1 };
  if (value === 'higher') return { terminal: 0.12, read: 0.12, gateway: 0.1 };
  return { nest: 0.08, gateway: 0.08 };
}

function computeBasins(op, profile, incoming) {
  const bias = orderBasinBias(op.order);
  const raw = {
    hold: profile.gravity * 0.72 + op.holds.length * 0.12 + incoming.holds * 0.12 + (bias.hold || 0),
    trace: profile.return * 0.76 + op.traces.length * 0.14 + incoming.traces * 0.08 + (bias.trace || 0),
    carry: profile.continuation * 0.78 + op.carries.length * 0.14 + incoming.carries * 0.08 + (bias.carry || 0),
    place: profile.resolution * 0.38 + profile.gravity * 0.18 + (bias.place || 0),
    read: profile.resolution * 0.58 + profile.return * 0.12 + (bias.read || 0),
    gateway: profile.airflow * 0.72 + profile.continuation * 0.14 + (bias.gateway || 0),
    bearing: profile.gravity * 0.38 + profile.density * 0.28 + profile.turbulence * 0.18 + (bias.bearing || 0),
    terminal: profile.resolution * 0.62 + profile.wither * 0.12 + (bias.terminal || 0),
    nest: profile.enclosure * 0.72 + op.nests.length * 0.14 + incoming.nests * 0.1 + (bias.nest || 0),
    calibration: profile.agitation * 0.18 + profile.turbulence * 0.12 + (bias.calibration || 0),
  };

  const max = Math.max(0.001, ...Object.values(raw));
  const weights = {};
  Object.entries(raw).forEach(([key, value]) => { weights[key] = clamp01(value / max); });
  const dominant = Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, value]) => ({ key, value }));
  return { weights, dominant };
}

function expectedBasinsForOrder(order) {
  const bias = orderBasinBias(order);
  return Object.entries(bias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key);
}

function basinTitle(key) {
  return basinTypes.find((basin) => basin.key === key)?.title || key;
}

function familyComposition(profile) {
  const weights = profile?.basins?.weights || {};
  const raw = compositionFamilies.map((family) => ({
    ...family,
    value: family.basins.reduce((sum, key) => sum + (weights[key] || 0), 0),
  }));
  const total = raw.reduce((sum, item) => sum + item.value, 0) || 1;
  return raw
    .map((item) => ({ ...item, percent: Math.round((item.value / total) * 100) }))
    .sort((a, b) => b.percent - a.percent);
}

function enginePhysics(profile) {
  const weights = profile?.basins?.weights || {};
  const structuralMass = profile?.fieldStates?.structuralMass || profile?.structuralMass || 0;
  const values = {
    gravity: clamp01(profile.gravity * 0.62 + (weights.hold || 0) * 0.26 + structuralMass * 0.12),
    return: clamp01(profile.return * 0.68 + (weights.trace || 0) * 0.32),
    velocity: clamp01((profile.continuation * 0.46 + profile.airflow * 0.24 + (weights.carry || 0) * 0.2 + (weights.gateway || 0) * 0.1) * (1 - structuralMass * 0.18)),
    friction: clamp01((weights.bearing || 0) * 0.24 + (weights.hold || 0) * 0.2 + profile.wither * 0.18 + profile.ash * 0.16 + profile.turbulence * 0.08 + structuralMass * 0.22),
    pressure: clamp01(profile.turbulence * 0.28 + profile.density * 0.2 + (weights.bearing || 0) * 0.24 + (weights.calibration || 0) * 0.12 + structuralMass * 0.16),
    capacity: clamp01(profile.density * 0.34 + profile.continuation * 0.24 + profile.resolution * 0.18 + (weights.carry || 0) * 0.14 + (weights.hold || 0) * 0.1),
    damping: clamp01(profile.resolution * 0.46 + (weights.terminal || 0) * 0.18 + profile.maturity * 0.1 + (weights.read || 0) * 0.08 + structuralMass * 0.28),
    opening: clamp01(profile.airflow * 0.5 + (weights.gateway || 0) * 0.34 + (weights.place || 0) * 0.16),
    collision: clamp01((weights.bearing || 0) * 0.3 + (weights.terminal || 0) * 0.28 + (weights.hold || 0) * 0.22 + profile.gravity * 0.2),
    heat: clamp01((profile.heat * 0.72 + (weights.calibration || 0) * 0.1 + (weights.carry || 0) * 0.12 + profile.turbulence * 0.06) * (1 - structuralMass * 0.14)),
    decay: clamp01(profile.wither * 0.38 + profile.ash * 0.28 + profile.turbulence * 0.12 - profile.resolution * 0.12 - structuralMass * 0.12),
  };
  const dominant = Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key, value]) => ({ key, value }));
  return { values, dominant };
}

function computeProfile(op) {
  const biasName = String(op.order || 'operation').toLowerCase();
  const bias = orderBias[biasName] || orderBias.operation;
  const state = stateFor(op.id);
  const ratioMode = termRatioMode(op);
  const structuralMass = structuralMassForState(state);
  const maturity = maturityValue(state);
  const agitation = Number(state?.agitation?.score || 0);
  const settledness = Number(state?.settledness?.score || 0);
  const incoming = {
    holds: countIncoming(op.id, 'holds'),
    traces: countIncoming(op.id, 'traces'),
    carries: countIncoming(op.id, 'carries'),
    pairs: countIncoming(op.id, 'pairs'),
    nests: countIncoming(op.id, 'nests'),
  };
  const relationDensity = op.holds.length + op.traces.length + op.carries.length + op.pairs.length + op.nests.length +
    incoming.holds + incoming.traces + incoming.carries + incoming.pairs + incoming.nests;
  const gravity = clamp01(0.14 + bias.gravity + op.holds.length * 0.06 + incoming.holds * 0.08 + incoming.traces * 0.04 + structuralMass * 0.24 + settledness * 0.1);
  const returnForce = clamp01(0.08 + bias.return + op.traces.length * 0.14 + incoming.traces * 0.06 + settledness * 0.07);
  const continuation = clamp01(0.1 + bias.continuation + op.carries.length * 0.1 + incoming.carries * 0.04 + structuralMass * 0.18 + ratioMode.continuous * 0.22);
  const resonance = clamp01(0.06 + bias.resonance + op.pairs.length * 0.18 + incoming.pairs * 0.08);
  const enclosure = clamp01(0.04 + bias.enclosure + op.nests.length * 0.18 + incoming.nests * 0.1);
  const turbulence = clamp01(0.08 + bias.turbulence + agitation * 0.48 + Math.max(0, relationDensity - 7) * 0.02 - gravity * 0.14 - enclosure * 0.06 - settledness * 0.16 - structuralMass * 0.08);
  const resolution = clamp01(0.16 + bias.resolution + settledness * 0.42 + maturity * 0.18 + gravity * 0.16 + returnForce * 0.1 + enclosure * 0.06 - turbulence * 0.28);
  const density = clamp01(0.1 + relationDensity * 0.045 + gravity * 0.22 + returnForce * 0.1 + structuralMass * 0.34 + settledness * 0.1);
  const airflow = clamp01(0.18 + bias.airflow + continuation * 0.22 + resonance * 0.12 - enclosure * 0.14);
  const wither = clamp01(0.08 + gravity * 0.22 + incoming.traces * 0.05 + agitation * 0.1 - continuation * 0.22 - airflow * 0.16 - settledness * 0.12);
  const heat = clamp01(0.2 + continuation * 0.22 + returnForce * 0.18 + resolution * 0.2 + airflow * 0.08 - wither * 0.16);
  const ash = clamp01(0.08 + wither * 0.42 + turbulence * 0.18 - heat * 0.08);
  const profile = {
    gravity,
    return: returnForce,
    continuation,
    resonance,
    enclosure,
    turbulence,
    resolution,
    density,
    maturity,
    airflow,
    wither,
    heat,
    ash,
    relationDensity,
    agitation,
    settledness,
    fieldStates: Object.freeze({ structuralMass, ratioMode, source: state }),
    structuralMass,
  };
  profile.basins = computeBasins(op, profile, incoming);
  profile.engine = enginePhysics(profile);
  const expected = expectedBasinsForOrder(op.order);
  const dominantKeys = profile.basins.dominant.map((item) => item.key);
  profile.misfit = expected.length && dominantKeys.length && !dominantKeys.some((key) => expected.includes(key))
    ? 'order leans ' + expected.map(basinTitle).join('/') + ', live field leans ' + dominantKeys.slice(0, 2).map(basinTitle).join('/')
    : '';
  return profile;
}

function refreshProfiles() {
  Object.values(operations).forEach((op) => {
    op.profile = computeProfile(op);
  });
}

function resize() {
  const area = innerWidth * innerHeight;
  const maxDpr = area > 2200000 ? FIELD_RENDER_BUDGET.dprVeryLargeViewport
    : area > 1300000 ? FIELD_RENDER_BUDGET.dprLargeViewport
      : 2;
  dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  w = Math.floor(innerWidth * dpr);
  h = Math.floor(innerHeight * dpr);
  canvas.width = w; canvas.height = h;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

const STRUCTURAL_FIELD_FRAMES = new Set([
  'practice.ratio-read',
  'practice.skeleton-read',
  'practice.growth-read',
  'practice.operations-read',
  'practice.whole-read',
]);

function isStructuralFieldFrame(id) {
  return STRUCTURAL_FIELD_FRAMES.has(id);
}

function isHomeFrame(id) {
  return String(allOps[id]?.title || '').toLowerCase() === 'reality mechanics';
}

function opOrder(op) {
  return String(op?.entry_order || op?.order || '').toLowerCase();
}

function addIfPresent(set, id) {
  if (allOps[id]) set.add(id);
}

function immediateCarries(ids) {
  const next = new Set();
  ids.forEach((id) => (allOps[id]?.carries || []).forEach((childId) => addIfPresent(next, childId)));
  return next;
}

function recursiveCarries(ids) {
  const reached = new Set(ids);
  const queue = [...ids];
  while (queue.length) {
    const id = queue.shift();
    (allOps[id]?.carries || []).forEach((childId) => {
      if (!allOps[childId] || reached.has(childId)) return;
      reached.add(childId);
      queue.push(childId);
    });
  }
  return reached;
}

function structuralFieldFrameIds(frameId) {
  const ids = new Set();
  if (!frameId || frameId === 'practice.whole-read') return new Set(globalFrameIds);

  if (frameId === 'practice.ratio-read') {
    Object.values(allOps).forEach((op) => {
      const order = opOrder(op);
      if (order === 'ground' || order === 'first') ids.add(op.id);
    });
    ['second.sensibility', 'second.appearance', 'first.ratio'].forEach((id) => addIfPresent(ids, id));
    return ids;
  }

  if (frameId === 'practice.skeleton-read') {
    Object.values(allOps).forEach((op) => {
      if (op.id.startsWith('ground.') || opOrder(op) === 'ground') ids.add(op.id);
    });
    immediateCarries(['ground.seed', 'ground.ground']).forEach((id) => ids.add(id));
    return ids;
  }

  if (frameId === 'practice.growth-read') {
    structuralFieldFrameIds('practice.skeleton-read').forEach((id) => ids.add(id));
    recursiveCarries(ids).forEach((id) => ids.add(id));
    return ids;
  }

  if (frameId === 'practice.operations-read') {
    ['first.carry', 'first.trace', 'first.hold', 'first.pair', 'first.nest', 'first.read'].forEach((id) => addIfPresent(ids, id));
    immediateCarries(ids).forEach((id) => ids.add(id));
    return ids;
  }

  return ids;
}

function refreshCoupledFrame() {
  globalFrameIds = new Set(Object.keys(allOps));
  localFrameIds = structuralFieldFrameIds(currentFieldReferenceFrame);
  globalFrameIds.forEach((id) => {
    if (coupledSensibility[id] == null) coupledSensibility[id] = 1;
  });
  Object.keys(coupledSensibility).forEach((id) => {
    if (!globalFrameIds.has(id)) delete coupledSensibility[id];
  });
}

function setCurrentFieldReferenceFrame(id) {
  if (!id || id === 'practice.whole-read') currentFieldReferenceFrame = null;
  else currentFieldReferenceFrame = currentFieldReferenceFrame === id ? null : id;
  refreshCoupledFrame();
}

function coupledSensibilityTarget(id) {
  if (!currentFieldReferenceFrame) return 1;
  return localFrameIds.has(id) ? 1 : 0.08;
}

function sensibilityAlpha(id) {
  return coupledSensibility[id] ?? coupledSensibilityTarget(id);
}

function relationSensibility(aId, bId) {
  if (!currentFieldReferenceFrame) return 1;
  return Math.max(0.08, (sensibilityAlpha(aId) + sensibilityAlpha(bId)) * 0.5);
}

// Returns ids of the focus term and all its direct relations from the full index
function localIdsFromIndex(id, maxNodes = 120) {
  const focus = allOps[id];
  if (!focus) return [id];

  // Build reverse adjacency map once for fast incoming-edge lookup
  const incoming = {};
  Object.values(allOps).forEach((op) => {
    relationTypes.forEach(({ key }) => {
      (op[key] || []).forEach((target) => {
        if (!incoming[target]) incoming[target] = [];
        incoming[target].push(op.id);
      });
    });
  });

  // BFS expanding outward until maxNodes reached
  const ids = new Set([id]);
  let frontier = [id];
  while (ids.size < maxNodes && frontier.length) {
    const next = [];
    for (const nodeId of frontier) {
      const op = allOps[nodeId];
      if (!op) continue;
      // Outgoing relations
      relationTypes.forEach(({ key }) => {
        (op[key] || []).forEach((child) => {
          if (!ids.has(child) && allOps[child]) { ids.add(child); next.push(child); }
        });
      });
      // Incoming relations
      (incoming[nodeId] || []).forEach((parent) => {
        if (!ids.has(parent) && allOps[parent]) { ids.add(parent); next.push(parent); }
      });
      if (ids.size >= maxNodes) break;
    }
    frontier = next;
  }

  return [...ids].filter((xId) => allOps[xId]);
}

function initOperations(id) {
  const focus2 = allOps[id]; if (!focus2) return; const ids = new Set([id]); const rkeys = ["carries","holds","traces","pairs","nests"]; rkeys.forEach(k => (focus2[k]||[]).forEach(c => { if(allOps[c]) ids.add(c); })); Object.values(allOps).forEach(op => rkeys.forEach(k => { if((op[k]||[]).includes(id)) ids.add(op.id); }));
  const prev = operations;
  operations = {};
  Array.from(ids).forEach((childId, i) => {
    const op = allOps[childId];
    if (!op) return;
    const p = prev[childId];
    const isFocus = childId === id;
    const angle = i * 2.39996;
    const radius = 160 + (i % 4) * 58;
    const defaultX = isFocus ? 0 : Math.cos(angle) * radius;
    const defaultY = isFocus ? 0 : Math.sin(angle) * radius;
    operations[childId] = {
      ...op,
      behaviour: op.behaviour || '',
      angle, radius,
      phase: p?.phase ?? ((hashStr(childId + ':phase') % 6283) / 1000),
      x: p?.x ?? defaultX,
      y: p?.y ?? defaultY,
      tx: p?.tx ?? defaultX,
      ty: p?.ty ?? defaultY,
    };
  });
  refreshProfiles();
}

function localIds(id) {
  const focus = operations[id] || operations[focusId];
  const ids = new Set([focus.id]);
  relationTypes.forEach(({ key }) => (focus[key] || []).forEach((child) => ids.add(child)));
  Object.values(operations).forEach((op) => {
    relationTypes.forEach(({ key }) => {
      if ((op[key] || []).includes(focus.id)) ids.add(op.id);
    });
  });
  return [...ids].filter((id) => operations[id]);
}

function localRelationRole(focus, op) {
  for (const type of relationTypes) {
    if ((focus[type.key] || []).includes(op.id)) return { type, direction: 'out' };
  }
  for (const type of relationTypes) {
    if ((op[type.key] || []).includes(focus.id)) return { type, direction: 'in' };
  }
  return { type: relationTypes[relationTypes.length - 1], direction: 'near' };
}

function structuralAngleSeed(op, focus) {
  const profile = op.profile || computeProfile(op);
  const dominant = profile.basins?.dominant || [];
  const topBasin = dominant[0]?.key || 'hold';
  const topFamily = familyComposition(profile)[0]?.key || 'anchor';
  const orderDepth = ORDER_DEPTHS[String(spineDisplayOrder(op) || op.order || 'ground').toLowerCase()] ?? 0.5;
  const basinIndex = Math.max(0, basinTypes.findIndex((basin) => basin.key === topBasin));
  const familyIndex = Math.max(0, compositionFamilies.findIndex((family) => family.key === topFamily));
  const role = localRelationRole(focus, op);
  const relationIndex = Math.max(0, relationTypes.findIndex((type) => type.key === role.type.key));
  const hash = (hashStr(op.id) % 997) / 997;
  return orderDepth * 1.7
    + basinIndex * 0.37
    + familyIndex * 0.19
    + relationIndex * 0.43
    + termDegree(op) * 0.013
    + hash * 0.31;
}

function structuralRingRadius(op, focus, role, baseRadius) {
  const profile = op.profile || computeProfile(op);
  const physics = profile.engine?.values || enginePhysics(profile).values;
  const relationBand = role.type.key === 'holds' ? -34
    : role.type.key === 'traces' ? -10
    : role.type.key === 'carries' ? 46
    : role.type.key === 'pairs' ? 18
    : 28;
  const directionBand = role.direction === 'in' ? -16 : role.direction === 'out' ? 12 : 0;
  const orderDepth = ORDER_DEPTHS[String(spineDisplayOrder(op) || op.order || 'ground').toLowerCase()] ?? 0.5;
  const focusDepth = ORDER_DEPTHS[String(spineDisplayOrder(focus) || focus.order || 'ground').toLowerCase()] ?? 0.5;
  const crossOrder = Math.abs(orderDepth - focusDepth);
  return baseRadius
    + relationBand
    + directionBand
    + crossOrder * 42
    + physics.capacity * 24
    + physics.opening * 14
    - physics.gravity * 18
    + profile.density * 10;
}

function layout(id) {
  const ids = localIds(id);
  const focus = operations[id];
  if (!focus) return;
  const visible = ids.filter((childId) => childId !== id).map((childId) => operations[childId]).filter(Boolean);
  const shortestSide = Math.min(innerWidth, innerHeight);
  const baseRadius = Math.max(138, Math.min(310, shortestSide * (visible.length > 12 ? 0.31 : 0.28)));
  const sorted = visible
    .map((op) => ({ op, seed: structuralAngleSeed(op, focus), role: localRelationRole(focus, op) }))
    .sort((a, b) => a.seed - b.seed || a.op.title.localeCompare(b.op.title));
  const slotById = new Map();
  sorted.forEach((item, index) => slotById.set(item.op.id, { ...item, index }));
  ids.forEach((childId) => {
    const op = operations[childId];
    if (childId === id) {
      op.tx = 0; op.ty = 0; return;
    }
    const slot = slotById.get(childId);
    if (!slot) return;
    const profile = op.profile || computeProfile(op);
    const physics = profile.engine?.values || enginePhysics(profile).values;
    const count = Math.max(1, sorted.length);
    const angle = -Math.PI / 2 + slot.index * Math.PI * 2 / count;
    const radius = structuralRingRadius(op, focus, slot.role, baseRadius);
    const basin = basinVector(profile, 16 + physics.capacity * 10 + physics.opening * 8);
    op.angle = angle;
    op.radius = radius;
    op.tx = Math.cos(angle) * radius + basin.x * 0.42;
    op.ty = Math.sin(angle) * radius * 0.82 + basin.y * 0.42;
  });
}

let homeMode = true;

const ORDER_DEPTHS = { ground: 0, first: 0.2, second: 0.4, third: 0.6, practice: 0.8, higher: 1.0 };

// Fire palette: the order read as a single burn — ember at ground, flame-colours through
// the body, white-hot at higher, cooling through seed's yellow back home to ember.
const FIRE_ORDERS = {
  seed:     { h: 48,  s: 88, l: 58 },
  ground:   { h: 24,  s: 84, l: 50 },
  first:    { h: 278, s: 46, l: 57 },
  second:   { h: 230, s: 52, l: 57 },
  third:    { h: 188, s: 52, l: 50 },
  practice: { h: 130, s: 46, l: 49 },
  higher:   { h: 46,  s: 20, l: 90 },
};
function fireFor(order) { return FIRE_ORDERS[order] || FIRE_ORDERS.ground; }

// Colour mode: 'fire' = order-hue with brightness carrying the burn; 'heat' = original ember↔ash.
let colourMode = 'fire';

function relationRatioWeight(key) {
  return ({ holds: 0.9, traces: 0.78, carries: 1, pairs: 0.62, nests: 0.54, reads: 0.72 })[key] || 0.48;
}

function movementRatioSignature(event) {
  if (!event) return null;
  const direct = Array.isArray(event.relation) ? event.relation : [];
  const reciprocal = Array.isArray(event.ratio?.reciprocalRelation) ? event.ratio.reciprocalRelation : [];
  const directWeight = direct.reduce((sum, key) => sum + relationRatioWeight(key), 0);
  const reciprocalWeight = reciprocal.reduce((sum, key) => sum + relationRatioWeight(key), 0);
  const totalWeight = Math.max(0.001, directWeight + reciprocalWeight);
  const frequency = clamp01((event.localFrequency?.count || 1) / 12);
  const relationContact = clamp01((direct.length + reciprocal.length) / 4);
  const asymmetry = event.from ? clamp01(Math.abs(directWeight - reciprocalWeight) / totalWeight) : 0.18;
  const unexpected = event.type === 'unexpected_ratio' ? 1 : 0;
  const recurrence = event.type === 'return' || event.type === 'absence_return' ? 0.62
    : event.type === 'retrace' ? 0.74
    : event.type === 'loop_completed' ? 1
    : event.type === 'settling' ? 0.36
    : 0;
  return {
    direct, reciprocal,
    contact: clamp01(relationContact + unexpected * 0.22),
    asymmetry: clamp01(asymmetry + unexpected * 0.42),
    frequency,
    recurrence,
    openness: clamp01(1 - relationContact + unexpected * 0.28),
    tension: clamp01(asymmetry * 0.56 + frequency * 0.24 + unexpected * 0.52),
  };
}

function relationKeysBetween(source, target) {
  if (!source || !target) return [];
  return relationTypes
    .filter((type) => (source[type.key] || []).includes(target.id))
    .map((type) => type.key);
}

function recordFieldMovement(fromId, toId) {
  const from = allOps[fromId] || null;
  const to = allOps[toId] || null;
  if (!to) return;
  const direct = relationKeysBetween(from, to);
  const reciprocal = relationKeysBetween(to, from);
  const key = from && to ? from.id + ':' + to.id : '';
  const reverseKey = from && to ? to.id + ':' + from.id : '';
  const previous = key ? traversalMap[key] || { count: 0, lastAt: 0 } : { count: 0, lastAt: 0 };
  const reverse = reverseKey ? traversalMap[reverseKey] : null;
  const count = previous.count + 1;
  if (key) {
    traversalMap[key] = { count, lastAt: Date.now() };
    lastTraversalKey = key;
  }
  fieldMovementEvent = {
    from: from?.id || null,
    to: to.id,
    type: !from ? 'first'
      : direct.length || reciprocal.length ? (reverse ? 'return' : 'passage')
      : 'unexpected_ratio',
    relation: direct,
    ratio: { reciprocalRelation: reciprocal },
    localFrequency: { count },
  };
  fieldMovementAt = performance.now();
}

function traversalEmphasis(fromId, toId) {
  const key = fromId + ':' + toId;
  const reverseKey = toId + ':' + fromId;
  const forward = traversalMap[key];
  const reverse = traversalMap[reverseKey];
  const isLast = key === lastTraversalKey;
  const ratio = isLast ? movementRatioSignature(fieldMovementEvent) : null;
  const ageFactor = forward ? Math.exp(-(Date.now() - forward.lastAt) / 8000) : 0;
  const countBoost = forward ? Math.min(1, forward.count / 4) * 0.4 : 0;
  const reverseBoost = reverse ? Math.min(1, reverse.count / 4) * 0.12 : 0;
  const ratioBoost = ratio ? (ratio.contact * 0.2 + ratio.recurrence * 0.22 + ratio.tension * 0.18) * ageFactor : 0;
  return 1 + (isLast ? 0.7 * ageFactor : 0) + countBoost + reverseBoost + ratioBoost;
}

function fieldMovementAge() {
  if (!fieldMovementAt) return 0;
  return Math.exp(-(performance.now() - fieldMovementAt) / 1800);
}

function drawFieldMovementWake(focus) {
  const ratio = movementRatioSignature(fieldMovementEvent);
  const age = fieldMovementAge();
  if (!focus || !ratio || age < 0.03) return;
  const p = screen(focus);
  const profile = focus.profile || computeProfile(focus);
  const structuralMass = profile.fieldStates?.structuralMass || profile.structuralMass || 0;
  const from = operations[fieldMovementEvent?.from];
  const fromPoint = from ? screen(from) : null;
  const angle = fromPoint ? Math.atan2(p.y - fromPoint.y, p.x - fromPoint.x) : focus.phase + ratio.asymmetry * Math.PI;
  const contact = ratio.contact;
  const tension = ratio.tension;
  const openness = ratio.openness;
  const recurrence = ratio.recurrence;
  const unexpected = fieldMovementEvent?.type === 'unexpected_ratio' ? 1 : 0;
  const baseRadius = (74 + contact * 58 + openness * 44 + tension * 36) * scale;
  const [r,g,b] = unexpected ? [220, 118, 42] : recurrence > 0.55 ? [120, 160, 210] : [200, 150, 82];

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const bloomRadius = baseRadius * (1.1 + (1 - age) * 0.5);
  const bloom = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, bloomRadius);
  bloom.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (age * (0.07 + contact * 0.035 + tension * 0.035) * (1 - structuralMass * 0.28)) + ')');
  bloom.addColorStop(0.42, 'rgba(' + r + ',' + g + ',' + b + ',' + (age * (0.02 + unexpected * 0.012) * (1 - structuralMass * 0.34)) + ')');
  bloom.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
  ctx.fillStyle = bloom;
  ctx.beginPath();
  ctx.arc(p.x, p.y, bloomRadius, 0, Math.PI * 2);
  ctx.fill();

  const flecks = structuralMass > 0.42 ? 0 : 2;
  for (let i = 0; i < flecks; i++) {
    const fleckAngle = angle + i * Math.PI * 2 / flecks + Math.sin(time * 0.7 + i) * ratio.asymmetry * 0.18;
    const fleckDistance = baseRadius * (0.34 + openness * 0.18 + (i % 2) * 0.08);
    const fx = p.x + Math.cos(fleckAngle) * fleckDistance;
    const fy = p.y + Math.sin(fleckAngle) * fleckDistance;
    const fleckRadius = Math.max(1.1, (1.8 + contact * 2.2 + tension * 1.6) * scale);
    const fleck = ctx.createRadialGradient(fx, fy, 0, fx, fy, fleckRadius * 3.5);
    fleck.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (age * 0.06) + ')');
    fleck.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    ctx.fillStyle = fleck;
    ctx.beginPath();
    ctx.arc(fx, fy, fleckRadius * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (fromPoint) {
    const dist = Math.max(1, Math.hypot(p.x - fromPoint.x, p.y - fromPoint.y));
    const pull = Math.min(dist * 0.34, 150 * scale);
    const nx = Math.cos(angle), ny = Math.sin(angle);
    const sx = p.x - nx * pull, sy = p.y - ny * pull;
    const cx = p.x - nx * pull * 0.36 - ny * baseRadius * (0.08 + tension * 0.1);
    const cy = p.y - ny * pull * 0.36 + nx * baseRadius * (0.08 + tension * 0.1);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cx, cy, p.x, p.y);
    ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (age * (0.075 + tension * 0.05)) + ')';
    ctx.lineWidth = Math.max(0.45, (0.65 + ratio.frequency * 0.7) * scale);
    ctx.stroke();
  }
  ctx.restore();
}

function enterOperation(id) {
  const found = allOps[id] ? id : Object.values(allOps).find((op) => op.title.toLowerCase() === id.toLowerCase())?.id;
  if (!found) return;
  if (isStructuralFieldFrame(found)) setCurrentFieldReferenceFrame(found);
  else if (isHomeFrame(found)) setCurrentFieldReferenceFrame(null);
  homeMode = false;
  targetFocusId = found;
  const previousFocusId = focusId;
  focusId = found;
  syncSpineToFocus(found);
  settled = 0;
  targetPan = { x: 0, y: 0 };
  initOperations(found);
  layout(found);
  modeEl.textContent = allOps[found].title;
  replaceFieldLocation(found);
  syncTermSheet();
  recordFieldMovement(previousFocusId, found);
}

function fieldLocation(id) {
  return '/field#' + encodeURIComponent(id);
}

function replaceFieldLocation(id) {
  if (!id) return;
  const next = fieldLocation(id);
  if (location.pathname !== '/field' || location.hash !== '#' + encodeURIComponent(id)) {
    history.replaceState({}, '', next);
  }
}

function normalizeTerm(value) {
  return String(value || '').trim().toLowerCase().replace(/\\s+/g, ' ');
}

function findTerm(input) {
  const q = normalizeTerm(input);
  if (!q) return null;
  const ops = Object.values(allOps);
  return ops.find((op) => normalizeTerm(op.id) === q)
    || ops.find((op) => normalizeTerm(op.title) === q)
    || ops.find((op) => normalizeTerm(op.title).startsWith(q))
    || ops.find((op) => normalizeTerm(op.id).includes(q) || normalizeTerm(op.title).includes(q))
    || null;
}

function relationTargets(op, key) {
  return (op?.[key] || [])
    .map((id) => allOps[id] || { id, title: id })
    .filter((item) => item?.id);
}

function renderTermSheet(id = focusId) {
  const op = allOps[id] || operations[id];
  if (!op || !termSheetEl) return false;
  document.getElementById('sheet-order').textContent = op.order || '';
  document.getElementById('sheet-title').textContent = op.title || op.id;
  sheetExcerptEl.textContent = op.excerpt || '';
  sheetExcerptEl.style.display = op.excerpt ? 'block' : 'none';
  sheetRelationsEl.innerHTML = '';
  let groupCount = 0;
  [
    ['holds', 'holds'],
    ['traces', 'traces'],
    ['carries', 'carries'],
    ['pairs', 'pairs'],
    ['nests', 'nests'],
  ].forEach(([key, label]) => {
    const items = relationTargets(op, key);
    if (!items.length) return;
    groupCount++;
    const group = document.createElement('div');
    group.className = 'sheet-group';
    const heading = document.createElement('h4');
    heading.textContent = label;
    group.appendChild(heading);
    items.forEach((target) => {
      const button = document.createElement('button');
      button.className = 'sheet-relation';
      button.type = 'button';
      button.textContent = target.title || target.id;
      button.addEventListener('click', () => enterOperation(target.id));
      group.appendChild(button);
    });
    sheetRelationsEl.appendChild(group);
  });
  sheetEmptyEl.textContent = groupCount ? '' : 'No direct relations in the current field state.';
  sheetEmptyEl.style.display = groupCount ? 'none' : 'block';
  return true;
}

function openTermSheet(id = focusId) {
  if (!renderTermSheet(id)) return;
  readRegister = 'constellation';
  document.body.classList.add('sheet-open');
  termSheetEl.classList.add('open');
}

function closeTermSheet() {
  readRegister = 'material';
  document.body.classList.remove('sheet-open');
  termSheetEl.classList.remove('open');
}

function toggleTermSheet(id = focusId) {
  if (termSheetEl.classList.contains('open')) closeTermSheet();
  else openTermSheet(id);
}

function syncTermSheet() {
  if (termSheetEl?.classList.contains('open')) renderTermSheet(focusId);
}

function screen(op) {
  return {
    x: innerWidth / 2 + (op.x + pan.x) * scale,
    y: innerHeight / 2 + (op.y + pan.y) * scale,
  };
}

function buildPressureField() {
  const cols = FIELD_PRESSURE_GRID.cols;
  const rows = FIELD_PRESSURE_GRID.rows;
  const points = Object.values(operations);
  if (!points.length) {
    pressureField = null;
    return;
  }
  const xs = points.map((op) => op.x);
  const ys = points.map((op) => op.y);
  const targetMinX = Math.min(...xs) - FIELD_PRESSURE_GRID.padding;
  const targetMaxX = Math.max(...xs) + FIELD_PRESSURE_GRID.padding;
  const targetMinY = Math.min(...ys) - FIELD_PRESSURE_GRID.padding;
  const targetMaxY = Math.max(...ys) + FIELD_PRESSURE_GRID.padding;
  const targetWidth = Math.max(1, targetMaxX - targetMinX);
  const targetHeight = Math.max(1, targetMaxY - targetMinY);
  const boundsAlpha = Math.min(1, fieldMediumDt * FIELD_PRESSURE_GRID.boundsRelax);
  const minXBound = pressureField
    ? pressureField.minX + (targetMinX - pressureField.minX) * boundsAlpha
    : targetMinX;
  const minYBound = pressureField
    ? pressureField.minY + (targetMinY - pressureField.minY) * boundsAlpha
    : targetMinY;
  const currentWidth = pressureField ? pressureField.cellW * cols : targetWidth;
  const currentHeight = pressureField ? pressureField.cellH * rows : targetHeight;
  const width = pressureField ? currentWidth + (targetWidth - currentWidth) * boundsAlpha : targetWidth;
  const height = pressureField ? currentHeight + (targetHeight - currentHeight) * boundsAlpha : targetHeight;
  const cellW = width / cols;
  const cellH = height / rows;
  const targetValues = new Float32Array(cols * rows);
  points.forEach((op) => {
    const profile = op.profile || computeProfile(op);
    const structuralMass = profile.fieldStates?.structuralMass || profile.structuralMass || 0;
    const p = { x: op.x, y: op.y };
    const influence = FIELD_PRESSURE_GRID.influence * (0.62 + structuralMass * 0.9);
    const strength = 0.22 + structuralMass * 0.78 + profile.density * 0.16;
    const minX = Math.max(0, Math.floor((p.x - influence - minXBound) / cellW));
    const maxX = Math.min(cols - 1, Math.ceil((p.x + influence - minXBound) / cellW));
    const minY = Math.max(0, Math.floor((p.y - influence - minYBound) / cellH));
    const maxY = Math.min(rows - 1, Math.ceil((p.y + influence - minYBound) / cellH));
    const denom = Math.max(1, influence * influence);
    for (let y = minY; y <= maxY; y++) {
      const gy = minYBound + (y + 0.5) * cellH;
      for (let x = minX; x <= maxX; x++) {
        const gx = minXBound + (x + 0.5) * cellW;
        const d2 = (gx - p.x) * (gx - p.x) + (gy - p.y) * (gy - p.y);
        const falloff = Math.exp(-d2 / denom);
        targetValues[y * cols + x] += strength * falloff;
      }
    }
  });
  relationPressureTraces.forEach((trace) => {
    const influence = FIELD_PRESSURE_GRID.traceInfluence * (0.72 + trace.strength * 0.4);
    const minX = Math.max(0, Math.floor((trace.x - influence - minXBound) / cellW));
    const maxX = Math.min(cols - 1, Math.ceil((trace.x + influence - minXBound) / cellW));
    const minY = Math.max(0, Math.floor((trace.y - influence - minYBound) / cellH));
    const maxY = Math.min(rows - 1, Math.ceil((trace.y + influence - minYBound) / cellH));
    const denom = Math.max(1, influence * influence);
    for (let y = minY; y <= maxY; y++) {
      const gy = minYBound + (y + 0.5) * cellH;
      for (let x = minX; x <= maxX; x++) {
        const gx = minXBound + (x + 0.5) * cellW;
        const d2 = (gx - trace.x) * (gx - trace.x) + (gy - trace.y) * (gy - trace.y);
        const falloff = Math.exp(-d2 / denom);
        targetValues[y * cols + x] += trace.strength * falloff;
      }
    }
  });
  if (!pressureField || pressureField.values.length !== targetValues.length) {
    pressureField = { cols, rows, cellW, cellH, minX: minXBound, minY: minYBound, values: targetValues };
    return;
  }
  const pressureAlpha = Math.min(1, fieldMediumDt * FIELD_PRESSURE_GRID.pressureRelax);
  for (let i = 0; i < targetValues.length; i++) {
    pressureField.values[i] += (targetValues[i] - pressureField.values[i]) * pressureAlpha;
  }
  pressureField.cols = cols;
  pressureField.rows = rows;
  pressureField.cellW = cellW;
  pressureField.cellH = cellH;
  pressureField.minX = minXBound;
  pressureField.minY = minYBound;
}

function decayPressureTraces(dt) {
  if (!relationPressureTraces.length) return;
  const decay = Math.exp(-dt * FIELD_PRESSURE_GRID.traceDecay);
  relationPressureTraces = relationPressureTraces
    .map((trace) => ({ ...trace, strength: trace.strength * decay }))
    .filter((trace) => trace.strength > 0.006)
    .slice(-FIELD_PRESSURE_GRID.traceLimit);
}

function addPressureTrace(x, y, strength) {
  relationPressureTraces.push({ x, y, strength });
  if (relationPressureTraces.length > FIELD_PRESSURE_GRID.traceLimit) {
    relationPressureTraces.splice(0, relationPressureTraces.length - FIELD_PRESSURE_GRID.traceLimit);
  }
}

function recordRelationPressureTrace(a, b, controlWorld, strength) {
  if (!Number.isFinite(strength) || strength <= 0) return;
  [0.28, 0.5, 0.72].forEach((t) => {
    const mt = 1 - t;
    addPressureTrace(
      mt * mt * a.x + 2 * mt * t * controlWorld.x + t * t * b.x,
      mt * mt * a.y + 2 * mt * t * controlWorld.y + t * t * b.y,
      strength * (t === 0.5 ? 1 : 0.62)
    );
  });
}

function pressureAt(x, y) {
  if (!pressureField) return 0;
  const { cols, rows, cellW, cellH, minX, minY, values } = pressureField;
  const gx = Math.max(0, Math.min(cols - 1.001, (x - minX) / cellW - 0.5));
  const gy = Math.max(0, Math.min(rows - 1.001, (y - minY) / cellH - 0.5));
  const x0 = Math.floor(gx), y0 = Math.floor(gy);
  const x1 = Math.min(cols - 1, x0 + 1), y1 = Math.min(rows - 1, y0 + 1);
  const tx = gx - x0, ty = gy - y0;
  const a = values[y0 * cols + x0], b = values[y0 * cols + x1];
  const c = values[y1 * cols + x0], d = values[y1 * cols + x1];
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

function pressureGradientAt(x, y) {
  if (!pressureField) return { x: 0, y: 0, pressure: 0 };
  const stepX = pressureField.cellW;
  const stepY = pressureField.cellH;
  const left = pressureAt(x - stepX, y);
  const right = pressureAt(x + stepX, y);
  const up = pressureAt(x, y - stepY);
  const down = pressureAt(x, y + stepY);
  return {
    x: (right - left) / Math.max(1, stepX * 2),
    y: (down - up) / Math.max(1, stepY * 2),
    pressure: pressureAt(x, y),
  };
}

function fieldTensionFromGradient(gradient, structuralWeight = 0) {
  const gradientTension = Math.hypot(gradient?.x || 0, gradient?.y || 0) * 2600;
  const pressureTension = clamp01((gradient?.pressure || 0) / 3.2) * 0.34;
  return clamp01(gradientTension + pressureTension + structuralWeight * 0.42);
}

function drawSmoke() {
  const cx = innerWidth / 2, cy = innerHeight / 2;
  const focus = operations[focusId];
  const focusProfile = focus?.profile || null;
  const family = focusProfile ? familyComposition(focusProfile)[0]?.key : 'anchor';
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(innerWidth, innerHeight) * 0.88);
  grad.addColorStop(0, '#0b1018');
  grad.addColorStop(0.56, '#07090e');
  grad.addColorStop(1, '#05070b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(pan.x, pan.y);
  const drift = family === 'motion' ? 0.14 : family === 'settlement' ? 0.045 : family === 'strain' ? 0.075 : 0.06;
  const compression = family === 'strain' ? 0.56 : family === 'anchor' ? 0.68 : 0.82;
  const smokePuffs = Math.max(18, Math.round(FIELD_RENDER_BUDGET.smokePuffs * adaptiveAmbientScale(0.42)));
  for (let i = 0; i < smokePuffs; i++) {
    const a = i * 0.42 + time * (drift + (i % 7) * 0.004);
    const r = 36 + i * 6.3 + Math.sin(time * 0.35 + i) * 18;
    const x = Math.cos(a) * r * (family === 'motion' ? 1.5 : 1.18);
    const y = Math.sin(a * 0.82) * r * compression;
    const puffR = 24 + (i % 9) * 7;
    const puffA = 0.009 + (i % 5) * 0.0025 + (focusProfile?.ash || 0) * 0.008;
    const puffGrad = ctx.createRadialGradient(x, y, 0, x, y, puffR * 1.38);
    puffGrad.addColorStop(0, 'rgba(58,80,112,' + puffA + ')');
    puffGrad.addColorStop(0.46, 'rgba(58,80,112,' + (puffA * 0.28) + ')');
    puffGrad.addColorStop(0.78, 'rgba(58,80,112,0)');
    puffGrad.addColorStop(1, 'rgba(58,80,112,0)');
    ctx.beginPath();
    ctx.fillStyle = puffGrad;
    ctx.arc(x, y, puffR * 1.38, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function basinVector(profile, amount = 1) {
  const weights = profile?.basins?.weights || {};
  let x = 0, y = 0, total = 0;
  basinTypes.forEach((basin) => {
    const weight = weights[basin.key] || 0;
    x += basin.x * weight;
    y += basin.y * weight;
    total += weight;
  });
  if (!total) return { x: 0, y: 0 };
  return { x: (x / total) * amount, y: (y / total) * amount };
}

function drawBasinGradients() {
  const focus = operations[focusId];
  if (!focus) return;
  const weights = focus.profile?.basins?.weights || {};
  const cx = innerWidth / 2 + pan.x * scale;
  const cy = innerHeight / 2 + pan.y * scale;
  const basinScale = Math.min(innerWidth, innerHeight) * 0.34 * scale;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  basinTypes.forEach((basin) => {
    const weight = weights[basin.key] || 0;
    if (weight < 0.16 + (1 - ambientQuality) * 0.12) return;
    const x = cx + basin.x * basinScale;
    const y = cy + basin.y * basinScale;
    const radius = (120 + weight * 190) * scale;
    const [r,g,b] = basin.color;
    const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.01 + weight * 0.03) + ')');
    grad.addColorStop(0.48, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.003 + weight * 0.011) + ')');
    grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function relationColor(type, alpha) {
  const [r,g,b] = type.color;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function fireColor(order, alpha, lift = 0, satMul = 1) {
  const fr = fireFor(order);
  return 'hsla(' + fr.h + ',' + Math.round(fr.s * satMul) + '%,' + Math.min(96, Math.max(12, fr.l + lift)) + '%,' + alpha + ')';
}

function fireMix(aOrder, bOrder, t, alpha, lift = 0) {
  const a = fireFor(aOrder), b = fireFor(bOrder);
  const shortestHue = ((((b.h - a.h) % 360) + 540) % 360) - 180;
  const h = (a.h + shortestHue * t + 360) % 360;
  const s = Math.round(a.s + (b.s - a.s) * t);
  const l = Math.round(a.l + (b.l - a.l) * t + lift);
  return 'hsla(' + Math.round(h) + ',' + s + '%,' + Math.min(96, Math.max(12, l)) + '%,' + alpha + ')';
}

function currentGradient(pa, pb, sourceOrder, targetOrder, alpha, relationAlpha) {
  const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
  if (colourMode === 'fire') {
    grad.addColorStop(0, fireColor(sourceOrder, alpha, 8));
    grad.addColorStop(0.44, fireMix(sourceOrder, targetOrder, 0.5, alpha * 0.9, 12));
    grad.addColorStop(0.56, fireMix(sourceOrder, targetOrder, 0.5, alpha * 0.9, 12));
    grad.addColorStop(1, fireColor(targetOrder, alpha, 8));
  } else {
    grad.addColorStop(0, relationColor({ color: [200,96,26] }, relationAlpha));
    grad.addColorStop(1, relationColor({ color: [94,132,170] }, relationAlpha * 0.85));
  }
  return grad;
}

function relationBasinPull(profile, key, incoming = false) {
  const weights = profile?.basins?.weights || {};
  if (key === 'holds') return incoming ? (weights.carry || 0) * 0.42 + (weights.gateway || 0) * 0.18 : (weights.hold || 0) * 0.5 + (weights.bearing || 0) * 0.18;
  if (key === 'traces') return incoming ? (weights.read || 0) * 0.36 + (weights.terminal || 0) * 0.22 : (weights.trace || 0) * 0.5 + (weights.read || 0) * 0.16;
  if (key === 'carries') return incoming ? (weights.hold || 0) * 0.34 + (weights.place || 0) * 0.2 : (weights.carry || 0) * 0.5 + (weights.gateway || 0) * 0.18;
  if (key === 'pairs') return (weights.read || 0) * 0.28 + (weights.place || 0) * 0.22 + (weights.gateway || 0) * 0.14;
  if (key === 'nests') return incoming ? (weights.place || 0) * 0.36 + (weights.hold || 0) * 0.18 : (weights.nest || 0) * 0.5 + (weights.hold || 0) * 0.14;
  return 0.2;
}

function relationMeeting(source, target, type) {
  const sourcePhysics = source.engine?.values || enginePhysics(source).values;
  const targetPhysics = target.engine?.values || enginePhysics(target).values;
  const sourcePull = relationBasinPull(source, type.key, false) + sourcePhysics.velocity * 0.18 + source.heat * 0.12;
  const targetPull = relationBasinPull(target, type.key, true) + targetPhysics.gravity * 0.16 + target.resolution * 0.1;
  const total = Math.max(0.001, sourcePull + targetPull);
  const handoff = clamp01(sourcePull / total);
  const pressure = clamp01((sourcePhysics.pressure + targetPhysics.pressure) * 0.35 + source.turbulence * 0.18 + target.turbulence * 0.12);
  const capacity = clamp01((sourcePhysics.capacity + targetPhysics.capacity) * 0.28 + source.density * 0.16 + target.density * 0.12);
  const recognition = clamp01((source.settledness || 0) * 0.28 + (target.settledness || 0) * 0.28);
  return {
    t: clamp01(0.22 + handoff * 0.56),
    strength: clamp01(0.35 + capacity * 0.34 + recognition * 0.18 + type.strength * 0.16 - pressure * 0.08),
    pressure,
  };
}

function relationRhythm(source, target, type, gradient, relationMass, movementRatio = null) {
  const sourcePhysics = source.engine?.values || enginePhysics(source).values;
  const targetPhysics = target.engine?.values || enginePhysics(target).values;
  const mediumPressure = clamp01((gradient?.pressure || 0) / 3.2);
  const fieldTension = clamp01(Math.hypot(gradient?.x || 0, gradient?.y || 0) * 2600);
  const carry = type.key === 'carries' ? 1 : 0;
  const hold = type.key === 'holds' ? 1 : 0;
  const trace = type.key === 'traces' ? 1 : 0;
  const pair = type.key === 'pairs' ? 1 : 0;
  const nest = type.key === 'nests' ? 1 : 0;
  const recurrence = movementRatio ? movementRatio.recurrence : 0;
  const frequency = movementRatio ? movementRatio.frequency : 0;
  const tension = movementRatio ? movementRatio.tension : 0;
  return {
    cadence: clamp01(carry * 0.46 + sourcePhysics.velocity * 0.28 + sourcePhysics.heat * 0.12 + frequency * 0.1 + fieldTension * 0.08),
    persistence: clamp01(hold * 0.52 + targetPhysics.gravity * 0.2 + sourcePhysics.friction * 0.12 + relationMass * 0.14 + mediumPressure * 0.08),
    intermittence: clamp01(trace * 0.5 + source.return * 0.18 + target.return * 0.12 + recurrence * 0.14 + tension * 0.06),
    reciprocity: clamp01(pair * 0.54 + source.resonance * 0.18 + target.resonance * 0.18 + mediumPressure * 0.1),
    circulation: clamp01(nest * 0.52 + source.enclosure * 0.18 + target.enclosure * 0.16 + sourcePhysics.damping * 0.08 + mediumPressure * 0.06),
  };
}

function relationRhythmExpression(type, rhythm, pulse, rhythmPhase, offset) {
  const key = type.key;
  if (key === 'holds') {
    const anchor = 0.52 + Math.sin(time * (0.08 + rhythm.persistence * 0.08) + offset + rhythmPhase) * (0.025 + rhythm.persistence * 0.025);
    return {
      mode: 'anchor',
      behaviour: 'sustained pressure near a held midpoint',
      t: clamp01(anchor),
      radiusScale: 1.08 + rhythm.persistence * 0.16,
      alphaScale: 0.78 + rhythm.persistence * 0.22,
      lift: 10,
    };
  }
  if (key === 'traces') {
    const returnPulse = 1 - pulse;
    const memory = (Math.sin(time * (0.42 + rhythm.intermittence * 0.36) + offset + rhythmPhase) + 1) / 2;
    return {
      mode: 'return',
      behaviour: 'intermittent return along a remembered path',
      t: returnPulse,
      radiusScale: 0.82 + memory * 0.2,
      alphaScale: 0.46 + rhythm.intermittence * 0.32 + memory * 0.3,
      lift: 11,
    };
  }
  if (key === 'pairs') {
    return {
      mode: 'answer',
      behaviour: 'reciprocal answering around the shared middle',
      t: clamp01(0.5 + Math.sin(time * (0.26 + rhythm.reciprocity * 0.42) + offset + rhythmPhase) * (0.34 + rhythm.reciprocity * 0.12)),
      radiusScale: 1,
      alphaScale: 1,
      lift: 12 + rhythm.reciprocity * 4,
    };
  }
  if (key === 'nests') {
    return {
      mode: 'circulate',
      behaviour: 'slow circulation inside containment',
      t: clamp01(0.48 + Math.sin(time * (0.16 + rhythm.circulation * 0.3) + offset + rhythmPhase) * (0.24 + rhythm.circulation * 0.12)),
      radiusScale: 1,
      alphaScale: 1,
      lift: 12 + rhythm.circulation * 4,
    };
  }
  return {
    mode: 'travel',
    behaviour: 'transported current progressing along the relation',
    t: type.direction === 'return' ? 1 - pulse : pulse,
    radiusScale: 1,
    alphaScale: 1,
    lift: 12,
  };
}

function discreteRatioMode(x = 1) {
  return {
    mode: 'discrete',
    x,
    transition: 0,
    continuous: 0,
    compression: 0,
  };
}

function debugNumber(value) {
  return Number.isFinite(value) ? Number(value).toFixed(2) : '0.00';
}

function debugRelationSample(sample) {
  if (!relationDebugEnabled) return;
  relationDebugSamples.push(sample);
}

function renderRelationDebug() {
  if (!relationDebugEl) return;
  relationDebugEl.classList.toggle('ready', relationDebugEnabled);
  if (!relationDebugEnabled) return;
  if (performance.now() - relationDebugLastRender < 180) return;
  relationDebugLastRender = performance.now();
  const rows = relationDebugSamples.slice(0, 24).map((sample) => {
    const rhythm = sample.rhythm;
    const expression = sample.expression;
    return [
      sample.type.toUpperCase() + '  ' + sample.from + ' -> ' + sample.to,
      '  rhythm     c:' + debugNumber(rhythm.cadence)
        + ' p:' + debugNumber(rhythm.persistence)
        + ' i:' + debugNumber(rhythm.intermittence)
        + ' r:' + debugNumber(rhythm.reciprocity)
        + ' n:' + debugNumber(rhythm.circulation),
      '  expression mode:' + expression.mode
        + ' t:' + debugNumber(expression.t)
        + ' radius:' + debugNumber(expression.radiusScale)
        + ' alpha:' + debugNumber(expression.alphaScale),
      sample.ratioMode
        ? '  ratio mode  ' + sample.type + ' 1:' + sample.ratioMode.x + ' ' + sample.ratioMode.mode
          + ' transition:' + debugNumber(sample.ratioMode.transition)
          + ' continuous:' + debugNumber(sample.ratioMode.continuous)
        : '',
      '  glow       radius:' + debugNumber(sample.glow.radius)
        + ' alpha:' + debugNumber(sample.glow.alpha)
        + ' lift:' + debugNumber(expression.lift),
      '  should     ' + expression.behaviour,
    ].join('\\n');
  });
  relationDebugEl.textContent = [
    'relation rhythm expression debug',
    'Shift+D toggles. URL: ?debug=relations',
    'focus: ' + (operations[focusId]?.title || focusId || 'none') + ' | visible relations: ' + relationDebugSamples.length,
    '',
    rows.join('\\n\\n') || 'no visible relation samples yet',
  ].join('\\n');
}

function bezierPoint(a, c, b, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * a.x + 2 * mt * t * c.x + t * t * b.x,
    y: mt * mt * a.y + 2 * mt * t * c.y + t * t * b.y,
  };
}

function drawFilament(pa, pb, control, type, source, target, offset, strand, emphasis = 1) {
  const physics = source.engine?.values || enginePhysics(source).values;
  const sourceMass = source.fieldStates?.structuralMass || source.structuralMass || 0;
  const targetMass = target.fieldStates?.structuralMass || target.structuralMass || 0;
  const relationMass = (sourceMass + targetMass) * 0.5;
  const baseSegments = relationMass > 0.48 ? FIELD_RENDER_BUDGET.filamentSegmentsCompressed : FIELD_RENDER_BUDGET.filamentSegments;
  const segments = Math.max(7, Math.round(baseSegments * adaptiveAmbientScale(0.62)));
  const wiggle = (8 + source.turbulence * 18 + physics.opening * 18 + physics.pressure * 14 - physics.damping * 7) * (type.wiggMult ?? 1) * (1 - sourceMass * 0.42);
  const split = 0.18 + (strand % 5) * 0.13;
  const alpha = (0.048 + type.strength * 0.105 + source.heat * 0.074 + sourceMass * 0.038) * emphasis;
  const sourceOrder = spineDisplayOrder(source);
  const targetOrder = spineDisplayOrder(target);
  ctx.beginPath();
  for (let s = 0; s <= segments; s++) {
    const t = s / segments;
    const p = bezierPoint(pa, control, pb, t);
    const n = Math.sin(t * Math.PI * 3 + time * (0.7 + source.airflow) + offset + strand) * wiggle * Math.sin(t * Math.PI);
    const skew = Math.cos(t * Math.PI * 2 + offset + strand) * wiggle * 0.38 * Math.sin(t * Math.PI);
    const x = p.x + n * 0.32 + skew * 0.18 * (strand - 2);
    const y = p.y + n * 0.18 - skew * 0.25;
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = colourMode === 'fire'
    ? currentGradient(pa, pb, sourceOrder, targetOrder, alpha, alpha)
    : relationColor(type, alpha);
  ctx.lineWidth = Math.max(0.45, (0.48 + source.density * 0.62) * scale);
  ctx.stroke();

  const branchProb = (type.branchProb ?? 0.33) * (1 - relationMass * 0.82);
  if (branchProb < 0.24 || strand > 0 || emphasis < 0.18) return;
  const start = bezierPoint(pa, control, pb, split);
  const branchLength = (18 + physics.velocity * 52 + source.turbulence * 24 + physics.opening * 18) * scale;
  const branchAngle = Math.atan2(pb.y - pa.y, pb.x - pa.x) + (strand % 2 ? 1 : -1) * (0.65 + source.airflow * 0.5);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(
    start.x + Math.cos(branchAngle) * branchLength * 0.5,
    start.y + Math.sin(branchAngle) * branchLength * 0.5,
    start.x + Math.cos(branchAngle) * branchLength,
    start.y + Math.sin(branchAngle) * branchLength
  );
  const branchAlpha = (0.014 + source.turbulence * 0.028 + physics.velocity * 0.026 + physics.pressure * 0.012) * emphasis * (1 - sourceMass * 0.45);
  ctx.strokeStyle = colourMode === 'fire'
    ? fireMix(sourceOrder, targetOrder, split, branchAlpha, 10)
    : relationColor(type, branchAlpha);
  ctx.lineWidth = Math.max(0.25, 0.42 * scale);
  ctx.stroke();
}

function drawCurrent(a, b, type, offset = 0, emphasis = 1) {
  emphasis *= relationSensibility(a.id, b.id);
  const pa = screen(a), pb = screen(b);
  const source = a.profile || computeProfile(a);
  const target = b.profile || computeProfile(b);
  const sourcePhysics = source.engine?.values || enginePhysics(source).values;
  const targetPhysics = target.engine?.values || enginePhysics(target).values;
  const sourceMass = source.fieldStates?.structuralMass || source.structuralMass || 0;
  const targetMass = target.fieldStates?.structuralMass || target.structuralMass || 0;
  const relationMass = (sourceMass + targetMass) * 0.5;
  const isLastPath = lastTraversalKey === a.id + ':' + b.id;
  const movementAge = isLastPath ? fieldMovementAge() : 0;
  const movementRatio = movementAge > 0.03 ? movementRatioSignature(fieldMovementEvent) : null;
  const dx = pb.x - pa.x, dy = pb.y - pa.y;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / dist, ny = dx / dist;
  const tx = dx / dist, ty = dy / dist;
  const worldMidX = (a.x + b.x) / 2;
  const worldMidY = (a.y + b.y) / 2;
  const gradient = pressureGradientAt(worldMidX, worldMidY);
  const rhythm = relationRhythm(source, target, type, gradient, relationMass, movementRatio);
  const relationTension = fieldTensionFromGradient(gradient, relationMass);
  const isCarry = type.key === 'carries';
  const isHold = type.key === 'holds';
  const isTrace = type.key === 'traces';
  const ratioMode = isCarry ? termRatioMode(a) : discreteRatioMode();
  const carryTransition = isCarry ? ratioMode.transition : 0;
  const carryContinuous = isCarry ? ratioMode.continuous : 0;
  const carryConsequence = carryTransition * 0.18 + carryContinuous * 0.42;
  const holdTransition = 0;
  const holdContinuous = 0;
  const holdConsequence = 0;
  const traceTransition = 0;
  const traceContinuous = 0;
  const traceConsequence = 0;
  const isPair = type.key === 'pairs';
  const isNest = type.key === 'nests';
  const pairTransition = 0;
  const pairContinuous = 0;
  const pairConsequence = 0;
  const nestTransition = 0;
  const nestContinuous = 0;
  const nestConsequence = 0;
  const pairAnswer = isPair
    ? Math.sin(time * (0.18 + rhythm.reciprocity * 0.42 - pairContinuous * 0.08) + offset + (source.phase || 0) * 0.2)
    : 0;
  const nestCycle = isNest
    ? Math.sin(time * (0.12 + rhythm.circulation * 0.22 - nestContinuous * 0.05) + offset + (source.enclosure || 0) * Math.PI)
    : 0;
  const bowBase = (
    type.direction === 'return' ? -46 :
    type.direction === 'lateral' ? pairAnswer * (36 + rhythm.reciprocity * 24) * (1 + pairContinuous * 0.18) :
    type.direction === 'enclose' ? (22 + rhythm.circulation * 26) * (0.82 + nestCycle * 0.24) * (1 + nestContinuous * 0.24) :
    36
  ) * (type.bowMult ?? 1);
  const ratioBow = movementRatio ? 1 + movementAge * (movementRatio.asymmetry * 0.5 + movementRatio.openness * 0.24 + movementRatio.tension * 0.34) : 1;
  const bow = bowBase * (1 + sourcePhysics.pressure * 0.28 + sourcePhysics.opening * 0.18 - targetPhysics.damping * 0.18) * ratioBow * (1 - relationMass * 0.24);
  const rhythmRate = 0.16
    + rhythm.cadence * 1.18
    + rhythm.intermittence * 0.62
    + rhythm.reciprocity * 0.34
    + rhythm.circulation * 0.24
    - rhythm.persistence * 0.42;
  const rhythmPhase = rhythm.reciprocity * Math.sin(time * (0.22 + rhythm.circulation * 0.34) + offset) * (isPair ? 0.32 : 0.18)
    + rhythm.intermittence * Math.sin(time * (0.36 + rhythm.cadence * 0.22) + a.phase) * 0.1
    + rhythm.circulation * Math.sin(time * (0.16 + rhythm.circulation * 0.24) + offset) * (isNest ? 0.2 : 0.08);
  const pulse = (Math.sin(time * Math.max(0.08, rhythmRate) + a.phase + offset + rhythmPhase) + 1) / 2;
  const rhythmPresence = clamp01(
    rhythm.cadence * 0.38
    + rhythm.intermittence * 0.18
    + rhythm.reciprocity * (isPair ? 0.22 : 0.12)
    + rhythm.circulation * (isNest ? 0.2 : 0.08)
    + (1 - rhythm.persistence) * 0.08
    + (isCarry ? 0.18 : 0)
  );
  const lateralPressure = -(gradient.x * nx + gradient.y * ny);
  const fieldBend = clamp01(gradient.pressure / 3.2) * Math.max(-54, Math.min(54, lateralPressure * 4200)) * (0.28 + relationMass * 0.18) * scale;
  const containment = isNest ? dist * (0.07 + rhythm.circulation * 0.07 + relationMass * 0.03 + nestTransition * 0.018 + nestContinuous * 0.04) : 0;
  const targetControlWorld = {
    x: worldMidX - tx * containment + nx * ((bow + fieldBend) / Math.max(0.001, scale)),
    y: worldMidY - ty * containment + ny * ((bow + fieldBend) / Math.max(0.001, scale)),
  };
  const trajectoryKey = a.id + ':' + type.key + ':' + b.id;
  const previousControlWorld = relationTrajectoryMemory.get(trajectoryKey) || targetControlWorld;
  const trajectoryAlpha = Math.min(1, fieldMediumDt * FIELD_PRESSURE_GRID.trajectoryRelax);
  const controlWorld = {
    x: previousControlWorld.x + (targetControlWorld.x - previousControlWorld.x) * trajectoryAlpha,
    y: previousControlWorld.y + (targetControlWorld.y - previousControlWorld.y) * trajectoryAlpha,
  };
  relationTrajectoryMemory.set(trajectoryKey, controlWorld);
  if (relationTrajectoryMemory.size > 720) {
    for (const key of relationTrajectoryMemory.keys()) {
      relationTrajectoryMemory.delete(key);
      if (relationTrajectoryMemory.size <= 600) break;
    }
  }
  const control = {
    x: innerWidth / 2 + (controlWorld.x + pan.x) * scale,
    y: innerHeight / 2 + (controlWorld.y + pan.y) * scale,
  };
  const cx = control.x;
  const cy = control.y;
  const family = familyComposition(source)[0]?.key || 'motion';
  const sourceOrder = spineDisplayOrder(a);
  const targetOrder = spineDisplayOrder(b);
  const crossing = sourceOrder !== targetOrder;
  const meeting = relationMeeting(source, target, type);
  const movementBoost = movementRatio ? movementAge * (0.42 + movementRatio.contact * 0.32 + movementRatio.tension * 0.34 + movementRatio.recurrence * 0.22) : 0;
  const currentAlpha = (0.088 + type.strength * 0.19 + source.heat * 0.082 + relationMass * 0.052 - source.ash * 0.045) * emphasis * (1 + movementBoost) * (1 + carryConsequence + holdConsequence + traceConsequence + pairConsequence + nestConsequence);
  recordRelationPressureTrace(a, b, controlWorld, Math.min(0.044, currentAlpha * (0.055 + carryContinuous * 0.026 + holdContinuous * 0.018 + traceContinuous * 0.016 + pairContinuous * 0.014 + nestContinuous * 0.018)));

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.quadraticCurveTo(cx, cy, pb.x, pb.y);
  const broadAlpha = currentAlpha * (0.72 - relationTension * 0.18 + carryContinuous * 0.08 + holdContinuous * 0.06 + traceContinuous * 0.04 + pairContinuous * 0.04 + nestContinuous * 0.05);
  ctx.strokeStyle = colourMode === 'fire'
    ? currentGradient(pa, pb, sourceOrder, targetOrder, broadAlpha, broadAlpha)
    : relationColor(type, broadAlpha);
  const relationWidth = Math.max(0.95, (0.98 + source.density * 0.62 + sourcePhysics.capacity * 0.6 + relationMass * 0.94 + (family === 'motion' ? 0.26 : 0) + movementBoost * 1.35) * (1 + carryTransition * 0.08 + carryContinuous * 0.22 + holdTransition * 0.05 + holdContinuous * 0.14 + traceTransition * 0.04 + traceContinuous * 0.1 + pairTransition * 0.04 + pairContinuous * 0.1 + nestTransition * 0.04 + nestContinuous * 0.14) * scale);
  ctx.lineWidth = relationWidth * (1.16 - relationTension * 0.28);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.quadraticCurveTo(cx, cy, pb.x, pb.y);
  const coreAlpha = currentAlpha * (0.34 + relationTension * 0.22 + carryTransition * 0.05 + carryContinuous * 0.17 + holdTransition * 0.04 + holdContinuous * 0.13 + traceTransition * 0.04 + traceContinuous * 0.12 + pairTransition * 0.04 + pairContinuous * 0.1 + nestTransition * 0.04 + nestContinuous * 0.12);
  ctx.strokeStyle = colourMode === 'fire'
    ? currentGradient(pa, pb, sourceOrder, targetOrder, coreAlpha, coreAlpha)
    : relationColor(type, coreAlpha);
  ctx.lineWidth = Math.max(0.48, relationWidth * (0.34 + relationTension * 0.14));
  ctx.stroke();

  const modeDetail = isCarry
    ? Math.max(0.18, 1 - carryTransition * 0.22 - carryContinuous * 0.58)
    : isHold
      ? Math.max(0.22, 1 - holdTransition * 0.28 - holdContinuous * 0.62)
      : isTrace
        ? Math.max(0.24, 1 - traceTransition * 0.18 - traceContinuous * 0.5)
        : isPair
          ? Math.max(0.26, 1 - pairTransition * 0.2 - pairContinuous * 0.48)
          : isNest
            ? Math.max(0.22, 1 - nestTransition * 0.26 - nestContinuous * 0.58)
            : 1;
  const strandCeiling = Math.max(1, Math.round((FIELD_RENDER_BUDGET.relationStrands - relationMass * 1.4) * adaptiveAmbientScale(0.72) * modeDetail));
  const strandCount = Math.min(strandCeiling, Math.max(1, Math.floor((2 + source.density * 4 + source.continuation * 3 + source.turbulence * 3) * (type.strandMult ?? 1) * (1 - relationMass * 0.48) * modeDetail)));
  for (let i = 0; i < strandCount; i++) drawFilament(pa, pb, control, type, source, target, offset, i, emphasis * (1 - carryContinuous * 0.34 - holdContinuous * 0.42 - traceContinuous * 0.3 - pairContinuous * 0.26 - nestContinuous * 0.38));

  if (colourMode === 'fire' && crossing) {
    const meetT = clamp01(meeting.t + Math.sin(time * (0.32 + sourcePhysics.heat * 0.22 + meeting.pressure * 0.18) + offset) * (0.025 + meeting.pressure * 0.05));
    const meet = bezierPoint(pa, control, pb, meetT);
    const meetRadius = (10 + sourcePhysics.heat * 10 + targetPhysics.heat * 8 + meeting.strength * 14 + meeting.pressure * 6 + relationMass * 10) * scale;
    const meetGlow = ctx.createRadialGradient(meet.x, meet.y, 1, meet.x, meet.y, meetRadius * 2.2);
    meetGlow.addColorStop(0, fireMix(sourceOrder, targetOrder, meetT, (0.08 + meeting.strength * 0.1) * emphasis, 18));
    meetGlow.addColorStop(0.34, fireMix(sourceOrder, targetOrder, meetT, (0.04 + meeting.strength * 0.05) * emphasis, 8));
    meetGlow.addColorStop(1, fireMix(sourceOrder, targetOrder, meetT, 0, 0));
    ctx.fillStyle = meetGlow;
    ctx.beginPath();
    ctx.arc(meet.x, meet.y, meetRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const expression = relationRhythmExpression(type, rhythm, pulse, rhythmPhase, offset);
  const t = expression.t;
  const qx = (1-t)*(1-t)*pa.x + 2*(1-t)*t*cx + t*t*pb.x;
  const qy = (1-t)*(1-t)*pa.y + 2*(1-t)*t*cy + t*t*pb.y;
  const beadRadius = (8 + (7 + source.heat * 6.8 + relationMass * 3.2 + rhythmPresence * 4.2) * scale) * (1 + movementBoost * 0.16) * (1 - relationMass * 0.2) * (1 - relationTension * 0.24) * (1 - carryContinuous * 0.12 + holdContinuous * 0.12 - traceContinuous * 0.06 + pairContinuous * 0.02 + nestContinuous * 0.06) * expression.radiusScale;
  const rhythmAlpha = (0.064 + source.heat * 0.058 + rhythmPresence * 0.05 + relationTension * 0.018 + (isCarry ? 0.014 : 0) + (isHold ? 0.008 : 0) + (isTrace ? 0.006 : 0) + (isPair ? 0.006 : 0) + (isNest ? 0.006 : 0)) * emphasis * (1 - relationMass * 0.24) * (1 + carryTransition * 0.08 + carryContinuous * 0.2 + holdTransition * 0.04 + holdContinuous * 0.18 + traceTransition * 0.06 + traceContinuous * 0.22 + pairTransition * 0.04 + pairContinuous * 0.16 + nestTransition * 0.05 + nestContinuous * 0.18) * expression.alphaScale;
  debugRelationSample({
    type: type.key,
    from: a.title || a.id,
    to: b.title || b.id,
    rhythm,
    expression,
    ratioMode: isCarry ? ratioMode : null,
    glow: { radius: beadRadius, alpha: rhythmAlpha },
  });
  const glow = ctx.createRadialGradient(qx, qy, 1, qx, qy, beadRadius);
  if (colourMode === 'fire') {
    glow.addColorStop(0, fireMix(sourceOrder, targetOrder, t, rhythmAlpha * (0.72 + relationTension * 0.18), expression.lift + rhythmPresence * 4));
    glow.addColorStop(0.32, fireMix(sourceOrder, targetOrder, t, rhythmAlpha * 0.2, expression.lift * 0.4));
    glow.addColorStop(1, fireMix(sourceOrder, targetOrder, t, 0, 0));
  } else {
    glow.addColorStop(0, relationColor(type, rhythmAlpha * (0.72 + relationTension * 0.18)));
    glow.addColorStop(0.32, relationColor(type, rhythmAlpha * 0.2));
    glow.addColorStop(1, relationColor(type, 0));
  }
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(qx, qy, beadRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function relationCompressionLimit(structuralMass, total) {
  if (total <= 3) return total;
  const relationPressure = clamp01((total - 10) / 30);
  const ratioLimit = Math.round(total * (1 - structuralMass * 0.72 - relationPressure * 0.42));
  const absoluteLimit = Math.round(14 - structuralMass * 4 - relationPressure * 6);
  return Math.max(3, Math.min(total, ratioLimit, absoluteLimit));
}

function relationDrawScore(op, type, index) {
  const profile = op.profile || computeProfile(op);
  const structuralMass = profile.fieldStates?.structuralMass || profile.structuralMass || 0;
  const relationWeight = type.key === 'holds' ? 1.0
    : type.key === 'carries' ? 0.92
      : type.key === 'traces' ? 0.78
        : type.key === 'pairs' ? 0.62
          : 0.48;
  return relationWeight + structuralMass * 0.7 + termDegree(op) * 0.018 - index * 0.001;
}

function compressedRelationField(focus, compressedCount, structuralMass, direction = 'in') {
  if (!compressedCount || structuralMass < 0.12) return;
  const p = screen(focus);
  const profile = focus.profile || computeProfile(focus);
  const physics = profile.engine?.values || enginePhysics(profile).values;
  const radius = (72 + structuralMass * 74 + Math.min(10, compressedCount) * 4 + physics.gravity * 24) * scale;
  const alpha = Math.min(0.18, (0.026 + compressedCount * 0.006 + structuralMass * 0.09) * sensibilityAlpha(focus.id));
  const order = spineDisplayOrder(focus);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const glow = ctx.createRadialGradient(p.x, p.y, radius * 0.22, p.x, p.y, radius * 1.35);
  if (colourMode === 'fire') {
    glow.addColorStop(0, fireColor(order, alpha * 0.55, 12));
    glow.addColorStop(0.48, fireColor(order, alpha * 0.22, 4));
    glow.addColorStop(1, fireColor(order, 0, 0));
  } else {
    glow.addColorStop(0, 'rgba(154,142,118,' + (alpha * 0.55) + ')');
    glow.addColorStop(0.5, 'rgba(94,132,170,' + (alpha * 0.18) + ')');
    glow.addColorStop(1, 'rgba(94,132,170,0)');
  }
  fillMediumGradient(p, radius * 1.35, glow);
  ctx.restore();
}

function drawIncomingCurrents(focus) {
  if (!focus) return;
  const focusProfile = focus.profile || computeProfile(focus);
  const structuralMass = focusProfile.fieldStates?.structuralMass || focusProfile.structuralMass || 0;
  const incoming = [];
  relationTypes.forEach((type) => {
    Object.values(operations).forEach((op, index) => {
      if (op.id === focus.id || !(op[type.key] || []).includes(focus.id)) return;
      incoming.push({ op, type, score: relationDrawScore(op, type, index) });
    });
  });
  incoming.sort((a, b) => b.score - a.score || a.op.id.localeCompare(b.op.id));
  const limit = relationCompressionLimit(structuralMass, incoming.length);
  incoming.slice(0, limit).forEach((item, index) => {
    drawCurrent(item.op, focus, item.type, index + 0.5, 0.34 + structuralMass * 0.16);
  });
  compressedRelationField(focus, incoming.length - limit, structuralMass, 'in');
}

function focusedFieldPressure(focus, localCount) {
  if (!focus) return 0;
  const profile = focus.profile || computeProfile(focus);
  const structuralMass = profile.fieldStates?.structuralMass || profile.structuralMass || 0;
  const neighbourhoodPressure = clamp01((localCount - 16) / 30);
  return clamp01(structuralMass * 0.68 + neighbourhoodPressure * 0.58);
}

function operationAmbientBudget(local, isFocus, structuralMass, fieldPressure = 0, fieldTension = 0) {
  const wrinkleMax = isFocus ? FIELD_RENDER_BUDGET.focusWrinkles
    : local ? FIELD_RENDER_BUDGET.localWrinkles
      : 0;
  const qualityFloor = isFocus ? 0.86 : local ? 0.54 : 0.4;
  const quality = adaptiveAmbientScale(qualityFloor);
  const endpointOnly = !isFocus && fieldPressure > 0.38;
  const wrinkles = Math.round(wrinkleMax * (1 - structuralMass * 0.46) * quality * (1 - fieldPressure * 0.35) * (1 - fieldTension * 0.18));
  return {
    endpointOnly,
    wrinkleMax: endpointOnly ? 0 : Math.max(0, wrinkles),
    glowSpread: isFocus ? Math.max(1.62, 2.12 - fieldTension * 0.36) : Math.max(0.72, (1.16 - structuralMass * 0.22 - fieldPressure * 0.32 - fieldTension * 0.16) * adaptiveAmbientScale(0.78)),
  };
}

function condensationPath(p, radius, phase, irregularity = 0.16, points = 11, formTime = time) {
  const samples = [];
  const count = Math.max(18, points * 2);
  for (let i = 0; i < count; i++) {
    const a = phase + i * Math.PI * 2 / count;
    const wobble = 1
      + Math.sin(a * 2.1 + formTime * 0.18 + phase) * irregularity
      + Math.cos(a * 3.7 - formTime * 0.11 + phase * 0.4) * irregularity * 0.46;
    samples.push({
      x: p.x + Math.cos(a) * radius * wobble,
      y: p.y + Math.sin(a) * radius * wobble * (0.86 + Math.sin(phase) * 0.04),
    });
  }
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const current = samples[i];
    const next = samples[(i + 1) % count];
    const mid = { x: (current.x + next.x) * 0.5, y: (current.y + next.y) * 0.5 };
    if (i === 0) ctx.moveTo(mid.x, mid.y);
    ctx.quadraticCurveTo(next.x, next.y, (next.x + samples[(i + 2) % count].x) * 0.5, (next.y + samples[(i + 2) % count].y) * 0.5);
  }
  ctx.closePath();
}

function fillCondensation(p, radius, phase, gradient, irregularity = 0.16, points = 11, formTime = time) {
  ctx.fillStyle = gradient;
  condensationPath(p, radius, phase, irregularity, points, formTime);
  ctx.fill();
}

function fillMediumGradient(p, radius, gradient) {
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function strokeCondensation(p, radius, phase, style, width, irregularity = 0.12, formTime = time) {
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  condensationPath(p, radius, phase, irregularity, 14, formTime);
  ctx.stroke();
}

function drawOperation(op, local, isFocus, fieldPressure = 0) {
  const p = screen(op);
  ctx.save();
  ctx.globalAlpha *= sensibilityAlpha(op.id);
  const profile = op.profile || computeProfile(op);
  const physics = profile.engine?.values || enginePhysics(profile).values;
  const structuralMass = profile.fieldStates?.structuralMass || profile.structuralMass || 0;
  const operationGradient = pressureGradientAt(op.x, op.y);
  const fieldTension = fieldTensionFromGradient(operationGradient, structuralMass);
  const families = familyComposition(profile);
  const topFamily = families[0]?.key || 'anchor';
  const resolving = Math.min(1, settled / 1.8);
  const baseAlpha = local ? 0.55 : 0.07;
  const motionBoost = topFamily === 'motion' ? 1.18 : 1;
  const anchorBoost = topFamily === 'anchor' ? 1.16 : 1;
  const movementRatio = isFocus ? movementRatioSignature(fieldMovementEvent) : null;
  const ambientBudget = operationAmbientBudget(local, isFocus, structuralMass, fieldPressure, fieldTension);
  const movementTempo = movementRatio ? 0.84 + movementRatio.frequency * 0.54 + movementRatio.recurrence * 0.34 + movementRatio.tension * 0.24 - movementRatio.contact * 0.12 : 1;
  const movementHeat = movementRatio ? movementRatio.frequency * 0.035 + movementRatio.tension * 0.045 + movementRatio.recurrence * 0.025 : 0;
  const pulseRate = (0.26 + physics.heat * 0.72 + physics.velocity * 0.32 + physics.pressure * 0.22 - physics.damping * 0.2) * (topFamily === 'motion' ? 1.18 : topFamily === 'settlement' ? 0.82 : 1) * movementTempo * (1 - structuralMass * 0.34);
  const motionTime = isFocus ? time : 0;
  const pulseDepth = isFocus
    ? (0.018 + physics.pressure * 0.05 + profile.turbulence * 0.025 + (movementRatio ? movementRatio.frequency * 0.018 + movementRatio.recurrence * 0.014 : 0)) * (1 - structuralMass * 0.46)
    : 0;
  const radius = (isFocus ? 34 + physics.gravity * 20 * anchorBoost + physics.capacity * 18 + structuralMass * 12 : 13 + profile.density * 8 + physics.capacity * 6 + structuralMass * 8) * scale *
    (1 + Math.sin(motionTime * pulseRate + op.phase) * pulseDepth);

  if (ambientBudget.endpointOnly) {
    const endpointRadius = Math.max(2.2, radius * (0.14 + structuralMass * 0.045 + fieldTension * 0.018));
    const mediumRadius = radius * (0.58 - fieldTension * 0.08);
    const endpointGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(endpointRadius * 2.4, mediumRadius));
    const order = spineDisplayOrder(op);
    if (colourMode === 'fire') {
      endpointGlow.addColorStop(0, fireColor(order, 0.06 + fieldTension * 0.018, 10));
      endpointGlow.addColorStop(0.42, fireColor(order, 0.014, 2));
      endpointGlow.addColorStop(1, fireColor(order, 0, 0));
    } else {
      endpointGlow.addColorStop(0, 'rgba(120,145,175,' + (0.045 + fieldTension * 0.014) + ')');
      endpointGlow.addColorStop(0.42, 'rgba(120,145,175,0.012)');
      endpointGlow.addColorStop(1, 'rgba(120,145,175,0)');
    }
    fillMediumGradient(p, Math.max(endpointRadius * 2.4, mediumRadius), endpointGlow);
    const coreGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, endpointRadius * 1.55);
    if (colourMode === 'fire') {
      coreGlow.addColorStop(0, fireColor(order, 0.18 + fieldTension * 0.038, 14));
      coreGlow.addColorStop(0.38, fireColor(order, 0.038 + fieldTension * 0.012, 4));
      coreGlow.addColorStop(1, fireColor(order, 0, 0));
    } else {
      coreGlow.addColorStop(0, 'rgba(120,145,175,' + (0.16 + fieldTension * 0.032) + ')');
      coreGlow.addColorStop(0.38, 'rgba(120,145,175,' + (0.03 + fieldTension * 0.012) + ')');
      coreGlow.addColorStop(1, 'rgba(120,145,175,0)');
    }
    fillCondensation(p, endpointRadius * (1.55 - fieldTension * 0.14), op.phase + motionTime * 0.04, coreGlow, 0.2 - fieldTension * 0.045, 8, motionTime);
    const edgeAlpha = 0.012 + fieldTension * 0.026 + structuralMass * 0.008;
    strokeCondensation(
      p,
      endpointRadius * (1.02 + structuralMass * 0.14),
      op.phase + motionTime * 0.02,
      colourMode === 'fire'
        ? fireColor(order, edgeAlpha, 10)
        : 'rgba(212,197,169,' + edgeAlpha + ')',
      Math.max(0.24, scale * (0.24 + fieldTension * 0.13)),
      Math.max(0.04, 0.1 - fieldTension * 0.04),
      motionTime
    );
    ctx.restore();
    return;
  }

  const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, radius * ambientBudget.glowSpread);
  const settleRamp = isFocus ? 1 : Math.max(0.12, resolving);
  const heatAlpha = (isFocus ? 0.11 + physics.heat * 0.13 + movementHeat * 0.82 + structuralMass * 0.036 : baseAlpha * (0.2 + physics.heat * 0.42 * (1 - structuralMass * 0.18)) + structuralMass * 0.008 + fieldTension * 0.006) * settleRamp;
  const ashAlpha = physics.decay * (isFocus ? 0.16 : 0.038) * (1 - structuralMass * 0.4);
  const midAlpha = isFocus ? 0.032 + profile.density * 0.045 + structuralMass * 0.028 : 0.012 + profile.density * 0.022 + structuralMass * 0.012;
  let coreCol, midCol;
  if (colourMode === 'fire') {
    const fr = fireFor(spineDisplayOrder(op));
    const burn = Math.min(96, Math.round(fr.l * (0.6 + physics.heat * 0.72)));
    coreCol = 'hsla(' + fr.h + ',' + fr.s + '%,' + burn + '%,' + heatAlpha + ')';
    midCol = 'hsla(' + fr.h + ',' + Math.round(fr.s * 0.7) + '%,' + Math.round(fr.l * 0.45) + '%,' + midAlpha + ')';
  } else {
    coreCol = 'rgba(200,96,26,' + heatAlpha + ')';
    midCol = 'rgba(120,82,54,' + midAlpha + ')';
  }
  grad.addColorStop(0, coreCol);
  grad.addColorStop(0.22, midCol);
  grad.addColorStop(0.45, 'rgba(76,92,112,' + ashAlpha + ')');
  grad.addColorStop(0.72, 'rgba(76,92,112,' + (ashAlpha * 0.15) + ')');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  fillMediumGradient(p, radius * ambientBudget.glowSpread * (isFocus ? 1 : 0.86), grad);
  if (local || isFocus) {
    const order = spineDisplayOrder(op);
    const edgeAlpha = (isFocus ? 0.022 : 0.012) + fieldTension * (isFocus ? 0.034 : 0.02);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    strokeCondensation(
      p,
      radius * (0.62 + structuralMass * 0.08),
      op.phase + motionTime * 0.012,
      colourMode === 'fire'
        ? fireColor(order, edgeAlpha, 14)
        : 'rgba(212,197,169,' + edgeAlpha + ')',
      Math.max(0.3, scale * (0.32 + fieldTension * 0.18)),
      Math.max(0.05, 0.1 - fieldTension * 0.035),
      motionTime
    );
    ctx.restore();
  }

  const wrinkleCount = Math.min(ambientBudget.wrinkleMax, Math.floor((4 + profile.maturity * 12 + profile.density * 8 + physics.pressure * 8 + physics.friction * 6 + (topFamily === 'strain' ? 8 : 0)) * (1 - structuralMass * 0.58)));
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(op.phase * 0.2 + motionTime * (0.018 + profile.airflow * 0.012));
  for (let i = 0; i < wrinkleCount; i++) {
    const a = i * 2.399 + op.phase;
    const inner = radius * (0.35 + (i % 5) * 0.07);
    const outer = radius * (0.72 + (i % 7) * 0.045) * (1 + (motionBoost - 1) * (1 - structuralMass * 0.5));
    const curl = Math.sin(motionTime * (0.16 + physics.velocity * 0.18) + i + op.phase) * radius * (0.04 + physics.pressure * 0.08 + physics.opening * 0.04 + (topFamily === 'strain' ? 0.04 : 0)) * (1 - structuralMass * 0.62);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
    ctx.quadraticCurveTo(Math.cos(a + 0.35) * (inner + outer) * 0.5 + curl, Math.sin(a + 0.35) * (inner + outer) * 0.5 - curl, Math.cos(a + 0.7) * outer, Math.sin(a + 0.7) * outer);
    ctx.strokeStyle = 'rgba(212,197,169,' + (0.025 + profile.maturity * 0.045 + structuralMass * 0.025 - profile.ash * 0.018) + ')';
    ctx.lineWidth = Math.max(0.35, scale * (0.35 + profile.density * 0.42 + structuralMass * 0.32));
    ctx.stroke();
  }
  ctx.restore();

  if (isFocus) {
    const arrivalRadius = Math.max(1.35, radius * (0.074 - fieldTension * 0.012));
    const arrivalGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, arrivalRadius * (2.12 - fieldTension * 0.24));
    arrivalGlow.addColorStop(0, 'rgba(212,197,169,' + (0.38 + profile.resolution * 0.22 + fieldTension * 0.06) + ')');
    arrivalGlow.addColorStop(0.34, 'rgba(212,197,169,' + (0.09 + fieldTension * 0.04) + ')');
    arrivalGlow.addColorStop(1, 'rgba(212,197,169,0)');
    fillCondensation(p, arrivalRadius * (2.12 - fieldTension * 0.24), op.phase + time * 0.03, arrivalGlow, 0.16);
  }
  ctx.restore();
}

function nearestOperation(x, y) {
  let best = null, bestDist = Infinity;
  localIds(focusId).forEach((id) => {
    const op = operations[id];
    const p = screen(op);
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestDist) { bestDist = d; best = id; }
  });
  return bestDist < 54 ? best : null;
}

function step(dt) {
  fieldMediumDt = dt;
  time += dt;
  settled = Math.min(3, settled + dt);
  decayPressureTraces(dt);

  scale += (targetScale - scale) * Math.min(1, dt * 8);
  pan.x += (targetPan.x - pan.x) * Math.min(1, dt * 7);
  pan.y += (targetPan.y - pan.y) * Math.min(1, dt * 7);
  const focus = operations[focusId];
  homeAlpha = homeMode ? 1.0 : Math.max(0, homeAlpha - dt * 3.5);
  globalFrameIds.forEach((id) => {
    const target = coupledSensibilityTarget(id);
    const current = coupledSensibility[id] ?? target;
    coupledSensibility[id] = current + (target - current) * Math.min(1, dt * 2.5);
  });
  const focusProfile = focus?.profile || (focus ? computeProfile(focus) : null);
  const focusPhysics = focusProfile?.engine?.values || (focusProfile ? enginePhysics(focusProfile).values : null);
  Object.values(operations).forEach((op) => {
    const profile = op.profile || computeProfile(op);
    const physics = profile.engine?.values || enginePhysics(profile).values;
    const structuralMass = profile.fieldStates?.structuralMass || profile.structuralMass || 0;
    const isFocus = op.id === focusId;
    const steadiness = 1 - structuralMass * 0.54;
    const heldAngle = op.angle;
    const heldRadius = op.radius;
    const heldX = isFocus ? op.tx : Math.cos(heldAngle) * heldRadius;
    const heldY = isFocus ? op.ty : Math.sin(heldAngle) * heldRadius * 0.82;
    const slotDx = heldX - op.tx;
    const slotDy = heldY - op.ty;
    const breathe = isFocus
      ? Math.sin(time * (0.18 + physics.velocity * 0.25 + physics.heat * 0.18 + physics.pressure * 0.08) + op.phase) *
        (1.2 + physics.opening * 4.8 + physics.pressure * 3.6 + physics.velocity * 2.2 - physics.damping * 2.2) * steadiness
      : 0;
    let gx = 0, gy = 0;
    if (!isFocus && focusProfile && focusPhysics) {
      const dx = -op.x, dy = -op.y;
      const dist = Math.max(80, Math.hypot(dx, dy));
      const pull = (focusPhysics.gravity * 680 + focusPhysics.return * 280 + focusPhysics.collision * 120 - physics.opening * 110 - physics.velocity * 70) / (dist * dist);
      gx = dx * pull;
      gy = dy * pull;
    }
    const basin = basinVector(profile, 30 + (focusPhysics?.gravity || 0) * 18 + physics.capacity * 16);
    gx += basin.x * (0.022 + physics.damping * 0.018 + physics.velocity * 0.012);
    gy += basin.y * (0.022 + physics.damping * 0.018 + physics.velocity * 0.012);
    const damping = 2.8 + physics.damping * 3 + physics.friction * 1.4 + profile.maturity * 1.2 + structuralMass * 1.6 - physics.pressure * 0.9;
    op.x += (op.tx + slotDx + gx + Math.cos(op.angle + time * 0.05) * breathe - op.x) * Math.min(1, dt * damping);
    op.y += (op.ty + slotDy + gy + Math.sin(op.angle + time * 0.06) * breathe - op.y) * Math.min(1, dt * damping);
  });
}

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
function termDegree(op) {
  return (op.holds||[]).length + (op.traces||[]).length + (op.carries||[]).length + (op.pairs||[]).length + (op.nests||[]).length;
}

function draw() {
  relationDebugSamples = [];
  drawSmoke();

  // Home field: the field before orientation — ratios present, unread.
  // Persists as a fading underlay as the focused view resolves.
  if (homeMode || homeAlpha > 0.01 || currentFieldReferenceFrame) drawHomeField(Math.max(homeAlpha, currentFieldReferenceFrame ? 0.58 : 0));

  if (!homeMode) {
    drawBasinGradients();
    const focus = operations[focusId];
    const local = new Set(localIds(focusId));
    const fieldPressure = focusedFieldPressure(focus, Object.keys(operations).length);
    buildPressureField();

    if (focus) {
      drawIncomingCurrents(focus);
      const focusProfile = focus.profile || computeProfile(focus);
      const structuralMass = focusProfile.fieldStates?.structuralMass || focusProfile.structuralMass || 0;
      const outgoing = [];
      relationTypes.forEach((type) => {
        (focus[type.key] || []).forEach((id, index) => {
          if (!operations[id]) return;
          outgoing.push({ op: operations[id], type, id, score: relationDrawScore(operations[id], type, index) });
        });
      });
      outgoing.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
      const limit = relationCompressionLimit(structuralMass, outgoing.length);
      outgoing.slice(0, limit).forEach((item, index) => {
        drawCurrent(focus, item.op, item.type, index, traversalEmphasis(focus.id, item.id) * (1 + structuralMass * 0.12));
      });
      compressedRelationField(focus, outgoing.length - limit, structuralMass, 'out');
      drawFieldMovementWake(focus);
    }
    Object.values(operations).forEach((op) => drawOperation(op, local.has(op.id), op.id === focusId, fieldPressure));
  }
  renderRelationDebug();
}

let last = performance.now();
function loop(now) {
  const frameMs = now - last;
  updateAdaptiveRenderQuality(frameMs);
  const dt = Math.min(0.05, frameMs / 1000);
  last = now;
  try { step(dt); } catch (e) { console.error('[field] step error:', e); }
  try { draw(); } catch (e) { console.error('[field] draw error:', e); }
  requestAnimationFrame(loop);
}

const activePointers = new Map();
let pinchStartDist = null, pinchStartScale = null;

// ── Dependency-order traversal ────────────────────────────────────────────────
const SPINE_ORDERS = ['ground', 'first', 'second', 'third', 'practice', 'higher'];
let spineFlat = [];       // all ids in full dependency order
let spineCurrentIdx = -1; // index into spineFlat

function buildSpineSequence() {
  spineFlat = [];
  SPINE_ORDERS.forEach((order) => {
    const terms = Object.values(allOps)
      .filter((op) => String(op.order || '').toLowerCase() === order)
      .sort((a, b) => {
        const score = (op) => (op.holds||[]).length + (op.traces||[]).length + (op.carries||[]).length + (op.pairs||[]).length + (op.nests||[]).length;
        return score(b) - score(a);
      });
    spineFlat.push(...terms.map((t) => t.id));
  });
  buildHomeConnections();
}

// ── Static home field ───────────────────────────────────────────────────────
// The unfocused field is a deterministic structural placement, not a live
// background animation. Movement belongs to the reference and relation events.

let homeConnections = [];   // { a, b, typeKey } — structural edges for drawing
let homeAlpha = 1.0;        // fades 1→0 when entering a term; home field underlays focused view

function homePosition(op) {
  const order = spineDisplayOrder(op) || op.order || 'ground';
  const depth = ORDER_DEPTHS[order] ?? 0.4;
  const hash = hashStr(op.id);
  const angle = (hash % 997) / 997 * Math.PI * 2;
  const cx = innerWidth / 2, cy = innerHeight * 0.44;
  const maxR = Math.min(cx * 0.82, cy * 0.90);
  return { x: cx + Math.cos(angle) * (0.18 + depth * 0.72) * maxR,
           y: cy + Math.sin(angle) * (0.18 + depth * 0.72) * maxR };
}

function buildHomeConnections() {
  homeConnections = [];
  const seen = new Set();
  Object.values(allOps).forEach((a) => {
    ['carries', 'pairs', 'traces'].forEach((key) => {
      (a[key] || []).forEach((bId) => {
        const b = allOps[bId];
        if (!b) return;
        const edgeKey = [a.id, bId].sort().join('\x00') + key;
        if (seen.has(edgeKey)) return;
        seen.add(edgeKey);
        homeConnections.push({ a, b, typeKey: key });
      });
    });
  });
}

function drawHomeField(alpha) {
  if (!homeConnections.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const n = Math.min(homeConnections.length, Math.max(42, Math.round(FIELD_RENDER_BUDGET.homeCurrents * adaptiveAmbientScale(0.38))));
  const sorted = homeConnections
    .slice()
    .sort((left, right) => hashStr(left.a.id + left.typeKey + left.b.id) - hashStr(right.a.id + right.typeKey + right.b.id));
  for (let i = 0; i < n; i++) {
    const { a, b, typeKey } = sorted[i];
    const pa = homePosition(a), pb = homePosition(b);
    const dx = pb.x - pa.x, dy = pb.y - pa.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / dist, ny = dx / dist;
    const bowAmt = typeKey === 'carries' ? 26 : typeKey === 'pairs' ? 11 : 18;
    const bow = bowAmt * (0.82 + (hashStr(a.id + b.id + typeKey) % 100) / 420);
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.quadraticCurveTo((pa.x + pb.x) / 2 + nx * bow, (pa.y + pb.y) / 2 + ny * bow, pb.x, pb.y);
    const baseA = typeKey === 'carries' ? 0.048 : typeKey === 'pairs' ? 0.032 : 0.024;
    const sense = relationSensibility(a.id, b.id);
    ctx.strokeStyle = currentGradient(pa, pb, spineDisplayOrder(a), spineDisplayOrder(b), baseA * alpha * sense, baseA * alpha * sense);
    ctx.lineWidth = typeKey === 'carries' ? 0.72 : 0.48;
    ctx.stroke();
  }
  ctx.restore();
}

function spineDisplayOrder(opOrId) {
  const op = typeof opOrId === 'string' ? allOps[opOrId] : opOrId;
  if (!op) return '';
  return op.id === 'ground.seed' || String(op.title || '').toLowerCase() === 'seed'
    ? 'seed'
    : String(op.order || 'operation').toLowerCase();
}

function syncSpineToFocus(id) {
  const idx = spineFlat.indexOf(id);
  if (idx < 0) return;
  spineCurrentIdx = idx;
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (activePointers.size === 1) {
    pointer = { x: event.clientX, y: event.clientY, pan: { ...targetPan }, moved: false };
  } else if (activePointers.size === 2) {
    pointer = null; // cancel single-touch pan when second finger arrives
    const pts = [...activePointers.values()];
    pinchStartDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
    pinchStartScale = targetScale;
  }
});
canvas.addEventListener('pointermove', (event) => {
  hoverId = nearestOperation(event.clientX, event.clientY);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (activePointers.size === 2 && pinchStartDist) {
    const pts = [...activePointers.values()];
    const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
    const next = pinchStartScale * (dist / pinchStartDist);
    targetScale = Math.max(0.45, Math.min(2.8, next));
    settled = Math.max(0.2, settled - 0.1);
    return;
  }
  if (!pointer) return;
  const dx = (event.clientX - pointer.x) / scale;
  const dy = (event.clientY - pointer.y) / scale;
  if (Math.hypot(dx, dy) > 4) pointer.moved = true;
  targetPan = { x: pointer.pan.x + dx, y: pointer.pan.y + dy };
});
canvas.addEventListener('pointerup', (event) => {
  if (activePointers.size === 1 && pointer && !pointer.moved) {
    const id = nearestOperation(event.clientX, event.clientY);
    if (id === focusId) toggleTermSheet(id);
    else if (id) enterOperation(id);
  }
  activePointers.delete(event.pointerId);
  if (activePointers.size < 2) { pinchStartDist = null; pinchStartScale = null; }
  if (activePointers.size === 0) pointer = null;
});
canvas.addEventListener('pointercancel', (event) => {
  activePointers.delete(event.pointerId);
  if (activePointers.size < 2) { pinchStartDist = null; pinchStartScale = null; }
  if (activePointers.size === 0) pointer = null;
});
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  const next = targetScale * Math.exp(-event.deltaY * 0.0012);
  targetScale = Math.max(0.45, Math.min(2.8, next));
  settled = Math.max(0.2, settled - 0.35);
}, { passive: false });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
sheetCloseEl.addEventListener('click', closeTermSheet);
enterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const op = findTerm(enterInput.value);
  if (!op) return;
  enterInput.value = '';
  enterInput.blur();
  enterOperation(op.id);
});
window.addEventListener('resize', resize);

window.addEventListener('keydown', (event) => {
  if (event.target !== document.body && event.target.tagName !== 'CANVAS') return;
  if (event.shiftKey && event.key.toLowerCase() === 'd') {
    event.preventDefault();
    relationDebugEnabled = !relationDebugEnabled;
    renderRelationDebug();
    return;
  }
  if (!spineFlat.length) return;
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    const next = spineCurrentIdx < 0 ? 0 : (spineCurrentIdx + 1) % spineFlat.length;
    spineCurrentIdx = next;
    enterOperation(spineFlat[next]);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    const prev = spineCurrentIdx < 0 ? 0 : (spineCurrentIdx - 1 + spineFlat.length) % spineFlat.length;
    spineCurrentIdx = prev;
    enterOperation(spineFlat[prev]);
  }
});

function relationIdsForState(state, key) {
  const source = state?.relations || {};
  const ids = Array.isArray(source[key]) ? source[key] : Array.isArray(state?.[key]) ? state[key] : [];
  return ids.filter(Boolean);
}

function operationFromFieldState(state) {
  const op = {
    id: state.id,
    title: state.title || state.id,
    order: state.order || 'operation',
    entry_order: state.order || 'operation',
    behaviour: '',
    excerpt: state.excerpt || '',
    fieldState: state,
  };
  relationTypes.forEach(({ key }) => { op[key] = relationIdsForState(state, key); });
  return op;
}

async function bootstrap() {
  modeEl.textContent = 'loading';
  try {
    const statesRes = await fetch('/api/field/states');
    if (!statesRes.ok) throw new Error('field states unavailable');
    const payload = await statesRes.json();
    const states = Array.isArray(payload.states) ? payload.states : [];

    fieldStatesPayload = payload;
    allOps = {};
    states.forEach((state) => { if (state?.id) allOps[state.id] = operationFromFieldState(state); });
    refreshCoupledFrame();
    buildSpineSequence();
    // Pre-cache profiles for all entries before the render loop starts.
    Object.values(allOps).forEach((op) => { if (!op.profile) op.profile = computeProfile(op); });
  } catch(err) {
    modeEl.textContent = 'Field';
    console.error('field bootstrap failed:', err);
    // continue with empty index — field renders nothing until data loads
  }

  const hash = decodeURIComponent(location.hash.slice(1) || '');
  const startId = (hash && allOps[hash]) ? hash
    : Object.values(allOps).find((op) => op.title === 'Reality Mechanics')?.id
    || Object.values(allOps).find((op) => op.title === 'Relation')?.id
    || Object.keys(allOps)[0]
    || null;

  if (!startId) { modeEl.textContent = 'Field'; requestAnimationFrame(loop); return; }

  homeMode = false;
  focusId = startId;
  targetFocusId = startId;
  syncSpineToFocus(startId);
  initOperations(startId);
  layout(startId);
  modeEl.textContent = allOps[startId].title;
  replaceFieldLocation(startId);
  if (readRegister === 'constellation') openTermSheet(startId);
  recordFieldMovement(null, startId);
  requestAnimationFrame(loop);
}

// Colour mode toggle — fire (order-hue, brightness = burn) or heat (original ember↔ash)
(function initColour() {
  const btn = document.getElementById('colour-toggle');
  if (!btn) return;
  const label = () => { btn.textContent = colourMode === 'fire' ? '◐' : '◑'; };
  label();
  btn.addEventListener('click', () => {
    colourMode = colourMode === 'fire' ? 'heat' : 'fire';
    try { localStorage.setItem('fieldColourMode', colourMode); } catch (e) {}
    label();
  });
})();

resize();
bootstrap();
</script>
</body>
</html>`;
}

// ── Router ────────────────────────────────────────────────────────────────────

async function handleRequest(request, env) {
  const { pathname } = new URL(request.url);

  if (pathname === "/robots.txt")
    return new Response("User-agent: *\nAllow: /\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });

  if (pathname === "/member" || pathname === "/bench" || pathname === "/calibration")
    return Response.redirect("https://calibration.realitymechanics.nz", 302);

  if (pathname === "/api/field/states")
    return handleFieldStates(env);

  if (pathname === "/" || pathname === "")
    return new Response(fieldPage(), { headers: HTML_HEADERS });

  if (pathname === "/field")
    return new Response(fieldPage(), { headers: HTML_HEADERS });

  return new Response("Reality Mechanics now exposes Field and Calibration only.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
