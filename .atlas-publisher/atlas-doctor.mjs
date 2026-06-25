#!/usr/bin/env node
/**
 * atlas-doctor.mjs — Reality Mechanics Atlas health check
 *
 * Reads both the vault source (frontmatter conditions) and the built entry
 * JSONs, then reports on:
 *
 *   1. Title collisions        — duplicate titles across notes
 *   2. Unresolved wikilinks    — conditions wikilinks with no matching entry
 *   3. Cross-order leaks       — a note's holds/traces pointing to a higher order,
 *                                unless declared as an intentional return-loop
 *                                crossing in a top-level `crossings:` list
 *                                (a `crossings:` entry that names no actual
 *                                upstream-higher link is reported as stale)
 *   4. Broken reciprocity      — A carries B but B does not trace A
 *   5. Orphan notes            — published but not carried or traced by anything
 *   6. Source vs published     — vault frontmatter structure differs from built entry
 *   7. Frontmatter consistency — needs ↔ holds mismatch; traces beyond holds/pairs/crossings (accuracy)
 *   8. Placeholder language    — unfinished "…yet / not placed / none claimed" notes (pruning)
 *   9. Thin notes              — low body word count (pruning / merge candidates)
 *
 * Run:  node .atlas-publisher/atlas-doctor.mjs [--verbose] [--check <check,...>]
 *
 * Checks: collisions, unresolved, leaks, reciprocity, orphans, drift,
 *         consistency, scaffolding, thin
 * Default: all checks. Checks 1–6 are integrity (errors); 7–9 are editorial (warnings).
 *
 * Env: ATLAS_BUILD_ROOT (default ~/Reality_Atlas_Build)
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
import {
  walk, splitFrontmatter, frontmatterValue, shouldPublish, titleFromBody,
  wikilinkTargets, slugify, noteSlug, parseTopLevelList, parseConditionsBlock,
  ORDER_RANK, orderOf,
} from "./atlas-core.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const vaultRoot = resolve(here, "..");
const sourceRoot = join(vaultRoot, "Reality_Mechanics");
const buildRoot = resolve(process.env.ATLAS_BUILD_ROOT || join(homedir(), "Reality_Atlas_Build"));
const entriesDir = join(buildRoot, ".atlas-public", "ai", "current", "entries");

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const checkArg = args.find((a) => a.startsWith("--check=") || a === "--check");
const checkFilter = checkArg
  ? (args[args.indexOf("--check") + 1] ?? checkArg.split("=")[1] ?? "").split(",").map((s) => s.trim())
  : null;
const shouldRun = (name) => !checkFilter || checkFilter.includes(name);
const shouldRunOptIn = (name) => Boolean(checkFilter && checkFilter.includes(name));

// ---- shared parsing helpers: see atlas-core.mjs ----

// ---- ANSI colours ---------------------------------------------------------
const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  red: "\x1b[31m", yellow: "\x1b[33m", green: "\x1b[32m", cyan: "\x1b[36m", grey: "\x1b[90m",
};
const ok = (s) => `${C.green}✓${C.reset} ${s}`;
const warn = (s) => `${C.yellow}⚠${C.reset}  ${s}`;
const err = (s) => `${C.red}✗${C.reset}  ${s}`;
const info = (s) => `${C.cyan}→${C.reset} ${s}`;
const dim = (s) => `${C.dim}${s}${C.reset}`;
const header = (s) => `\n${C.bold}${s}${C.reset}`;

// ---- load vault source ----------------------------------------------------
console.log(info(`Reading vault from ${relative(process.cwd(), sourceRoot)}`));
const sourceFiles = await walk(sourceRoot);
const sourceNotes = [];
for (const file of sourceFiles) {
  const text = await readFile(file, "utf8");
  const { frontmatter, body } = splitFrontmatter(text);
  if (!shouldPublish(frontmatter)) continue;
  const relPath = relative(vaultRoot, file).split("\\").join("/");
  const title = titleFromBody(body);
  if (!title) continue;
  const condKey = frontmatterValue(frontmatter, "condition_key");
  const fileTitle = basename(relPath, ".md");
  const id = condKey || noteSlug(title, fileTitle);
  const order = frontmatterValue(frontmatter, "order") || null;
  const cond = parseConditionsBlock(frontmatter);
  const wl = (v) => wikilinkTargets(Array.isArray(v) ? v.join("\n") : (v || ""));
  const wordCount = body.replace(/[#>*_`~\-]/g, " ").split(/\s+/).filter(Boolean).length;
  sourceNotes.push({ id, title, fileTitle, relPath, order, frontmatter, cond, wordCount,
    crossings: parseTopLevelList(frontmatter, "crossings"),
    condWikilinks: {
      holds: wl(cond.holds),
      traces: wl(cond.traces),
      carries: wl(cond.carries),
      pairs: wl(cond.pairs),
    },
  });
}
console.log(dim(`  ${sourceNotes.length} published notes\n`));

// ---- load built entries ---------------------------------------------------
let builtEntries = null;
if (existsSync(entriesDir)) {
  const jsonFiles = (await readdir(entriesDir)).filter((f) => f.endsWith(".json"));
  builtEntries = new Map();
  for (const f of jsonFiles) {
    const data = JSON.parse(await readFile(join(entriesDir, f), "utf8"));
    builtEntries.set(data.id, data);
  }
  console.log(dim(`  ${builtEntries.size} built entries in ${relative(process.cwd(), entriesDir)}\n`));
} else {
  console.log(warn(`Built entries not found at ${relative(process.cwd(), entriesDir)} — skipping drift check\n`));
}

// Build title → [ids] map from source for collision detection
const titleToIds = new Map();
for (const n of sourceNotes) {
  if (!titleToIds.has(n.title)) titleToIds.set(n.title, []);
  titleToIds.get(n.title).push(n.id);
}
// First-writer-wins resolution map (lower sourcePath wins after sort)
const sorted = [...sourceNotes].sort((a, b) => a.relPath.localeCompare(b.relPath));
const titleToId = new Map();
for (const n of sorted) {
  if (!titleToId.has(n.title)) titleToId.set(n.title, n.id);
  if (!titleToId.has(n.fileTitle)) titleToId.set(n.fileTitle, n.id);
}

const results = { errors: 0, warnings: 0, checks: {} };
const record = (check, level, message, detail) => {
  if (!results.checks[check]) results.checks[check] = [];
  results.checks[check].push({ level, message, detail });
  if (level === "error") results.errors++;
  if (level === "warn") results.warnings++;
};

// ==========================================================================
// CHECK 1: Title collisions
// ==========================================================================
if (shouldRun("collisions")) {
  console.log(header("1. Title collisions"));
  let found = 0;
  for (const [title, ids] of titleToIds) {
    if (ids.length > 1) {
      found++;
      console.log(warn(`"${title}" → ${ids.join(", ")}`));
      if (verbose) {
        const notes = sourceNotes.filter((n) => ids.includes(n.id));
        for (const n of notes) console.log(dim(`     ${n.relPath}`));
      }
      record("collisions", "warn", `Duplicate title: "${title}"`, { title, ids });
    }
  }
  if (found === 0) console.log(ok("No title collisions"));
  else console.log(dim(`  ${found} collision(s) — wikilinks [[...]] resolve to first-registered entry`));
}

// ==========================================================================
// CHECK 2: Unresolved wikilinks
// ==========================================================================
if (shouldRun("unresolved")) {
  console.log(header("2. Unresolved wikilinks in conditions"));
  let found = 0;
  for (const n of sourceNotes) {
    const all = [...new Set([
      ...n.condWikilinks.holds, ...n.condWikilinks.traces,
      ...n.condWikilinks.carries, ...n.condWikilinks.pairs,
    ])];
    const unresolved = all.filter((t) => !titleToId.has(t));
    if (unresolved.length) {
      found += unresolved.length;
      for (const t of unresolved) {
        console.log(warn(`${n.id}: [[${t}]] not found`));
        if (verbose) console.log(dim(`     in ${n.relPath}`));
        record("unresolved", "warn", `${n.id}: [[${t}]] unresolved`, { id: n.id, link: t });
      }
    }
  }
  if (found === 0) console.log(ok("All condition wikilinks resolve"));
  else console.log(dim(`  ${found} unresolved wikilink(s)`));
}

// ==========================================================================
// CHECK 3: Cross-order dependency leaks
// ==========================================================================
if (shouldRun("leaks")) {
  console.log(header("3. Cross-order dependency leaks (holds/traces → higher order)"));
  let found = 0;
  let sanctioned = 0;
  let stale = 0;
  for (const n of sourceNotes) {
    const selfRank = ORDER_RANK[n.order] ?? 0;
    if (!selfRank) continue; // skip meta/unordered notes
    const upstreamLinks = [...new Set([...n.condWikilinks.holds, ...n.condWikilinks.traces])];
    const usedCrossings = new Set();
    for (const t of upstreamLinks) {
      const targetId = titleToId.get(t);
      if (!targetId) continue;
      const targetRank = orderOf(targetId);
      if (targetRank > selfRank) {
        const targetOrderName = Object.keys(ORDER_RANK)[targetRank - 1];
        if (n.crossings.includes(t)) {
          // Declared return-loop crossing — sanctioned, not a leak.
          sanctioned++;
          usedCrossings.add(t);
          if (verbose) console.log(dim(`  ↑ ${n.id} → ${targetId} declared crossing via [[${t}]]`));
          continue;
        }
        found++;
        console.log(err(`${n.id} (${n.order}) holds/traces → ${targetId} (order ${targetOrderName})`));
        if (verbose) console.log(dim(`     via [[${t}]] in ${n.relPath}`));
        record("leaks", "error", `Cross-order leak: ${n.id} → ${targetId}`, { source: n.id, target: targetId, link: t });
      }
    }
    // A crossing declaration that does not name an actual upstream-higher link is stale.
    for (const c of n.crossings) {
      if (!usedCrossings.has(c)) {
        stale++;
        console.log(warn(`${n.id}: declared crossing [[${c}]] is not an upstream-higher link`));
        if (verbose) console.log(dim(`     in ${n.relPath}`));
        record("leaks", "warn", `Stale crossing declaration: ${n.id} → [[${c}]]`, { source: n.id, link: c });
      }
    }
  }
  if (found === 0 && stale === 0) {
    console.log(ok(`No cross-order dependency leaks${sanctioned ? ` (${sanctioned} declared crossing${sanctioned === 1 ? "" : "s"})` : ""}`));
  } else {
    if (found) console.log(dim(`  ${found} leak(s)`));
    if (stale) console.log(dim(`  ${stale} stale crossing declaration(s)`));
    if (sanctioned) console.log(dim(`  ${sanctioned} declared crossing(s) allowed`));
  }
}

// ==========================================================================
// CHECK 4: Broken reciprocity (A carries B → B should trace A)
// ==========================================================================
if (shouldRun("reciprocity")) {
  console.log(header("4. Broken reciprocity (A carries B → B must trace A)"));
  let found = 0;
  const byId = new Map(sourceNotes.map((n) => [n.id, n]));
  for (const n of sourceNotes) {
    for (const t of n.condWikilinks.carries) {
      const targetId = titleToId.get(t);
      if (!targetId) continue;
      const target = byId.get(targetId);
      if (!target) continue;
      const targetTraces = target.condWikilinks.traces.map((tt) => titleToId.get(tt)).filter(Boolean);
      if (!targetTraces.includes(n.id)) {
        found++;
        console.log(warn(`${n.id} carries ${targetId}, but ${targetId} does not trace ${n.id}`));
        if (verbose) console.log(dim(`     ${target.relPath} traces: ${targetTraces.join(", ") || "(none)"}`));
        record("reciprocity", "warn", `Broken reciprocity: ${n.id} carries ${targetId}`, { carrier: n.id, carried: targetId });
      }
    }
  }
  if (found === 0) console.log(ok("All carry/trace pairs are reciprocal"));
  else console.log(dim(`  ${found} broken reciprocity pair(s)`));
}

// ==========================================================================
// CHECK 5: Orphan notes (not carried or traced by anything)
// ==========================================================================
if (shouldRun("orphans")) {
  console.log(header("5. Orphan notes (published but not carried or traced by any other note)"));
  const referenced = new Set();
  for (const n of sourceNotes) {
    const all = [...n.condWikilinks.carries, ...n.condWikilinks.traces, ...n.condWikilinks.holds];
    for (const t of all) {
      const id = titleToId.get(t);
      if (id) referenced.add(id);
    }
  }
  let found = 0;
  for (const n of sourceNotes) {
    if (!referenced.has(n.id)) {
      found++;
      if (verbose || found <= 10) console.log(dim(`  ${n.id}  ${n.relPath}`));
      record("orphans", "warn", `Orphan: ${n.id}`, { id: n.id, path: n.relPath });
    }
  }
  if (found === 0) console.log(ok("No orphan notes"));
  else {
    if (!verbose && found > 10) console.log(dim(`  ... and ${found - 10} more (use --verbose to list all)`));
    console.log(dim(`  ${found} orphan(s) — may be spine roots or legitimately standalone`));
  }
}

// ==========================================================================
// CHECK 6: Source vs published drift
// ==========================================================================
if (shouldRun("drift") && builtEntries) {
  console.log(header("6. Source vs published drift"));
  let drifted = 0;
  let missing = 0;
  for (const n of sourceNotes) {
    const built = builtEntries.get(n.id);
    if (!built) {
      missing++;
      if (verbose) console.log(warn(`${n.id}: in source but not in built entries`));
      record("drift", "warn", `Missing from build: ${n.id}`, { id: n.id });
      continue;
    }
    if (!built.structure) {
      if (verbose) console.log(dim(`  ${n.id}: no structure in built entry (pre-dates build-time resolution)`));
      continue;
    }
    // Compare source-resolved structure to built structure
    const resolveField = (titles) =>
      [...new Set(titles.map((t) => titleToId.get(t)).filter(Boolean).filter((id) => id !== n.id))];

    const srcHolds = resolveField(n.condWikilinks.holds).sort();
    const srcTraces = resolveField(n.condWikilinks.traces).sort();
    const srcCarries = resolveField(n.condWikilinks.carries).sort();

    const builtHolds = (built.structure.holds || []).slice().sort();
    const builtTraces = (built.structure.traces || []).slice().sort();
    const builtCarries = (built.structure.carries || []).slice().sort();

    const diff = [];
    if (JSON.stringify(srcHolds) !== JSON.stringify(builtHolds))
      diff.push(`holds: source [${srcHolds}] ≠ built [${builtHolds}]`);
    if (JSON.stringify(srcTraces) !== JSON.stringify(builtTraces))
      diff.push(`traces: source [${srcTraces}] ≠ built [${builtTraces}]`);
    if (JSON.stringify(srcCarries) !== JSON.stringify(builtCarries))
      diff.push(`carries: source [${srcCarries}] ≠ built [${builtCarries}]`);

    if (diff.length) {
      drifted++;
      console.log(warn(`${n.id}: structure drift`));
      for (const d of diff) console.log(dim(`     ${d}`));
      record("drift", "warn", `Drift: ${n.id}`, { id: n.id, diff });
    }
  }
  // Notes in built but not in source (shouldn't happen unless build is stale)
  for (const [id] of builtEntries) {
    if (!sourceNotes.find((n) => n.id === id)) {
      if (verbose) console.log(warn(`${id}: in built entries but not in source (stale build?)`));
      record("drift", "warn", `Stale built entry: ${id}`, { id });
    }
  }
  if (drifted === 0 && missing === 0) console.log(ok("Source and built entries are in sync"));
  else console.log(dim(`  ${drifted} drifted, ${missing} missing from build`));
}

// ==========================================================================
// CHECK 7: Frontmatter consistency (accuracy)
// ==========================================================================
if (shouldRun("consistency")) {
  console.log(header("7. Frontmatter consistency (needs ↔ holds)"));
  const diff = (a, b) => a.filter((x) => !b.includes(x));
  let found = 0;
  for (const n of sourceNotes) {
    const needs = parseTopLevelList(n.frontmatter, "needs");
    if (!needs.length) continue; // no needs list to check against
    const holds = n.condWikilinks.holds;
    const needsNotHeld = diff(needs, holds);
    const heldNotNeeded = diff(holds, needs);
    if (needsNotHeld.length || heldNotNeeded.length) {
      found++;
      console.log(warn(`${n.id}`));
      if (needsNotHeld.length) console.log(dim(`     in needs but not held: ${needsNotHeld.map((x) => `[[${x}]]`).join(", ")}`));
      if (heldNotNeeded.length) console.log(dim(`     held but not in needs: ${heldNotNeeded.map((x) => `[[${x}]]`).join(", ")}`));
      if (verbose) console.log(dim(`     ${n.relPath}`));
      record("consistency", "warn", `needs/holds mismatch: ${n.id}`, { id: n.id, needsNotHeld, heldNotNeeded });
    }
  }
  if (found === 0) console.log(ok("needs and holds match on every note"));
  else console.log(dim(`  ${found} note(s) with a needs/holds mismatch`));
}

// Opt-in deep check: traces that exceed holds/pairs/crossings — a review surface, not a defect list
if (shouldRunOptIn("tracesdeep")) {
  console.log(header("7b. Traces beyond holds/pairs/crossings (review surface — many are intentional)"));
  let found = 0;
  for (const n of sourceNotes) {
    const holds = n.condWikilinks.holds;
    const extra = n.condWikilinks.traces.filter(
      (t) => !holds.includes(t) && !n.crossings.includes(t) && !n.condWikilinks.pairs.includes(t));
    if (extra.length) {
      found++;
      console.log(dim(`  ${n.id}: ${extra.map((x) => `[[${x}]]`).join(", ")}`));
    }
  }
  console.log(dim(`  ${found} note(s) trace beyond their holds (not necessarily wrong)`));
}

// ==========================================================================
// CHECK 8: Unfinished / placeholder language (pruning + finishing)
// ==========================================================================
if (shouldRun("scaffolding")) {
  console.log(header("8. Maturation backlog (garden_status) + placeholder idiom"));
  const PLACEHOLDER = /(no (lateral )?pair[s]?( is| are)?( required| placed| yet)|placement yet|claimed yet|not (placed|required) yet|no pair placed|no (grounded )?(downstream|further) (carr|branch))/i;
  let placeholders = 0;
  const garden = {};
  const immature = [];
  for (const n of sourceNotes) {
    const gs = (frontmatterValue(n.frontmatter, "garden_status") || "(none)").toLowerCase();
    garden[gs] = (garden[gs] || 0) + 1;
    if (gs !== "rooted") immature.push({ id: n.id, gs, path: n.relPath });
    const strFields = ["places", "holds", "pairs", "nests", "reads"].map((k) => n.cond[k]).filter((v) => typeof v === "string");
    if (strFields.some((f) => PLACEHOLDER.test(f))) placeholders++;
  }
  console.log(dim(`  garden_status: ${Object.entries(garden).map(([k, v]) => `${k} ${v}`).join("  ·  ")}`));
  console.log(dim(`  ${immature.length} note(s) not yet rooted — the real finishing / pruning worklist:`));
  for (const n of (verbose ? immature : immature.slice(0, 20))) {
    console.log(dim(`     ${n.gs.padEnd(8)} ${n.id}  ${n.path}`));
    record("scaffolding", "warn", `Not rooted (${n.gs}): ${n.id}`, { id: n.id, gs: n.gs });
  }
  if (!verbose && immature.length > 20) console.log(dim(`     ... and ${immature.length - 20} more (use --verbose)`));
  console.log(dim(`  (${placeholders} notes use "no pair required / none claimed yet" — accepted idiom, not a defect)`));
}

// ==========================================================================
// CHECK 9: Thin notes (pruning / merge candidates)
// ==========================================================================
if (shouldRun("thin")) {
  console.log(header("9. Thin notes (low body word count — pruning / merge candidates)"));
  const THIN = 80;
  const thin = sourceNotes.filter((n) => (n.wordCount ?? 999) < THIN).sort((a, b) => a.wordCount - b.wordCount);
  if (thin.length === 0) console.log(ok(`No notes under ${THIN} words`));
  else {
    for (const n of (verbose ? thin : thin.slice(0, 15)))
      console.log(dim(`  ${String(n.wordCount).padStart(3)}w  ${n.id}  ${n.relPath}`));
    if (!verbose && thin.length > 15) console.log(dim(`  ... and ${thin.length - 15} more (use --verbose)`));
    console.log(dim(`  ${thin.length} thin note(s) under ${THIN} words`));
    record("thin", "warn", `${thin.length} thin notes`, { count: thin.length });
  }
}

// ==========================================================================
// Summary
// ==========================================================================
console.log(header("Summary"));
const totalIssues = results.errors + results.warnings;
if (totalIssues === 0) {
  console.log(ok("Atlas is clean — no issues found\n"));
} else {
  if (results.errors) console.log(err(`${results.errors} error(s)`));
  if (results.warnings) console.log(warn(`${results.warnings} warning(s)`));
  console.log();
}
if (!verbose && totalIssues > 0) console.log(dim("Run with --verbose for full detail\n"));
