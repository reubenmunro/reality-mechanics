/**
 * field-maturity.mjs — Shared Field maturity reading.
 *
 * Maturity is derived at read time from the generated D1 record
 * (entry_revisions, proposals, entries.structure) and is never stored.
 *
 * All functions take `env` with an ATLAS_DB D1 binding.
 */

export const OPEN_STATUSES = ["received", "prepared", "needs_attention", "approved"];
export const EDIT_CLASSES = ["prose", "structural", "new_section", "new_entry"];

async function first(env, sql, params = []) {
  return env.ATLAS_DB.prepare(sql).bind(...params).first();
}

export async function readFieldConfig(env, key, fallback) {
  try {
    const row = await first(env, "SELECT value FROM garden_config WHERE key = ?", [key]);
    if (!row) return fallback;
    try { return JSON.parse(row.value); } catch { return row.value; }
  } catch { return fallback; }
}

export function structureCarriesEntry(structure, entryId) {
  if (!structure || !entryId) return false;
  return (structure.holds || []).includes(entryId) || (structure.traces || []).includes(entryId);
}

export function maturityBandFromComponents(components, bands = {}) {
  const daysStable = Number(components?.daysStable || 0);
  const carriers = Number(components?.carriers || 0);
  const attestations = Number(components?.attestations || 0);
  const revertCount = Number(components?.revertsLast90d || 0);
  const netLight = Number(components?.netLight || 0);

  let band = "placed";
  if (daysStable * 24 >= (bands.placed_max_hours ?? 48)) band = "fresh";
  if (daysStable >= (bands.settling?.min_stable_days ?? 7) &&
      (carriers >= 1 || attestations >= 1) && revertCount === 0) band = "settling";
  if (daysStable >= (bands.established?.min_stable_days ?? 30) &&
      carriers >= (bands.established?.min_carriers ?? 2) && attestations >= 1 && revertCount === 0) band = "established";
  if (daysStable >= (bands.mature?.min_stable_days ?? 90) &&
      carriers >= (bands.mature?.min_carriers_after_change ?? 4) && revertCount === 0 && netLight > 0) band = "mature";
  return band;
}

// Carrying in-degree (spec §3.3): how many OTHER entries' structure holds or
// traces reference this id. Locked definition — pairs/nests/carries mentions
// do NOT count (Codex audit 2026-07-02, finding 7). The LIKE is a cheap
// prefilter; the JSON check enforces the definition.
export async function countCarriers(env, entryId) {
  const res = await env.ATLAS_DB.prepare(
    `SELECT structure FROM entries WHERE id != ? AND structure LIKE '%"' || ? || '"%'`
  ).bind(entryId, entryId).all();
  let n = 0;
  for (const row of (res.results || [])) {
    try {
      const s = JSON.parse(row.structure || "null");
      if (structureCarriesEntry(s, entryId)) n++;
    } catch { /* malformed structure rows do not carry */ }
  }
  return n;
}

// Maturity — derived, never stored (INV-14). Returns { band, components }.
export async function maturityReading(env, entryId) {
  const entry = await first(env,
    "SELECT id, updated, created, grounded_at FROM entries WHERE id = ?", [entryId]);
  if (!entry) return { band: "placed", components: { note: "entry not found — new_entry target" } };

  const lastStructural = await first(env,
    "SELECT at FROM entry_revisions WHERE entry_id = ? AND edit_class = 'structural' ORDER BY at DESC LIMIT 1",
    [entryId]);
  // Fallback while entry_revisions history is young: entries.updated / created.
  const changedAt = lastStructural?.at || entry.updated || entry.created || null;
  const daysStable = changedAt
    ? Math.max(0, (Date.now() - new Date(changedAt).getTime()) / 86400000) : 0;

  const [carriers, reverts, attestations, signals] = await Promise.all([
    countCarriers(env, entryId),
    first(env, "SELECT COUNT(*) AS n FROM entry_revisions WHERE entry_id = ? AND actor = 'revert' AND at > datetime('now','-90 days')", [entryId]),
    first(env, "SELECT COUNT(*) AS n FROM proposals WHERE entry_id = ? AND status = 'affirmed'", [entryId]),
    first(env, "SELECT COALESCE(SUM(light_count),0) AS light, COALESCE(SUM(shade_count),0) AS shade FROM proposals WHERE entry_id = ?", [entryId]),
  ]);
  const revertCount = Number(reverts?.n || 0);
  const attested = Number(attestations?.n || 0);
  const netLight = Number(signals?.light || 0) - Number(signals?.shade || 0);

  const bands = await readFieldConfig(env, "maturity_bands", {});
  const components = {
    daysStable: Math.round(daysStable * 10) / 10,
    lastStructuralChange: changedAt,
    lastChangeSource: lastStructural ? "entry_revisions" : "entries.updated (revision history is young)",
    carriers, revertsLast90d: revertCount, attestations: attested, netLight,
  };
  const band = maturityBandFromComponents(components, bands);

  return {
    band,
    components,
  };
}

// Clearance — spec §3.5. Same computation at intake (estimate), Ground Check
// (binding) and Apply wake (recompute); only the inputs' freshness differs.
export async function clearanceEstimate(env, entryId, editClass, light = 0, shade = 0) {
  const floors = await readFieldConfig(env, "clearance_floors", { prose_hours: 2, default_hours: 12 });
  const factors = await readFieldConfig(env, "clearance_factors", {});
  const paceDivisor = Number(await readFieldConfig(env, "pace_divisor", 1)) || 1;

  const maturity = await maturityReading(env, entryId);
  const maturityFactor = (factors.maturity || {})[maturity.band] ?? 1;
  const carriers = maturity.components.carriers ?? 0;
  const carryingFactor = 1 + Math.min(carriers, 12) / 4;
  const classFactor = (factors.class || {})[editClass] ?? 1;
  // light shrinks (each -25%, capped -50%); shade grows (each +50%, capped +200%)
  const lightAdj = Math.max(light * (factors.signal?.light ?? -0.25), factors.signal?.light_cap ?? -0.5);
  const shadeAdj = Math.min(shade * (factors.signal?.shade ?? 0.5), factors.signal?.shade_cap ?? 2);
  const signalFactor = 1 + lightAdj;
  const shadeFactor = 1 + shadeAdj;

  const floorHours = editClass === "prose" ? (floors.prose_hours ?? 2) : (floors.default_hours ?? 12);
  let hours = (floorHours * maturityFactor * carryingFactor * classFactor * signalFactor * shadeFactor) / paceDivisor;
  const capHours = (factors.cap_days ?? 7) * 24;
  hours = Math.min(hours, capHours);
  hours = Math.max(hours, floorHours / paceDivisor);

  return {
    estimatedHours: Math.round(hours * 10) / 10,
    breakdown: {
      floorHours, maturityBand: maturity.band, maturityFactor,
      carriers, carryingFactor: Math.round(carryingFactor * 100) / 100,
      editClass, classFactor, lightCount: light, shadeCount: shade,
      paceDivisor, capHours,
    },
    maturity,
    note: "Computed from current ratios (spec §3.5). Ground Check sets the binding clearance; Apply recomputes at wake.",
  };
}
