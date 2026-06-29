// main-website-worker.js
// realitymechanics.nz — the Atlas is the site

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

function bearerToken(request) {
  const auth = request.headers.get("Authorization") || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : auth;
}

function gardenAuthorized(request, env) {
  return !!env.GARDEN_SECRET && bearerToken(request) === env.GARDEN_SECRET;
}

function gardenUnauthorized() {
  return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });
}

// ── MCP ───────────────────────────────────────────────────────────────────────

async function mcpTool(name, args) {
  const res = await fetch("https://mcp.realitymechanics.nz/mcp", {
    method: "POST",
    signal: AbortSignal.timeout(9000),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args || {} },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "mcp_error");
  return data.result?.structuredContent ?? JSON.parse(data.result?.content?.[0]?.text ?? "{}");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSnippet(content) {
  const m = (content || "").match(/##\s+Places\s*\n+([\s\S]*?)(?=\n##|$)/i);
  if (m) {
    const text = m[1]
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
      .replace(/\n+/g, " ").trim();
    if (text.length > 20) return text.slice(0, 240).trim();
  }
  for (const line of (content || "").split("\n")) {
    const t = line.trim();
    if (t && !t.startsWith("#") && !t.startsWith("-") && !t.startsWith("*") && t.length > 20)
      return t.replace(/\*\*([^*]+)\*\*/g, "$1").slice(0, 240);
  }
  return "";
}

// ── Enter API ─────────────────────────────────────────────────────────────────

async function handleEnterApi(request) {
  if (request.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: JSON_HEADERS }); }

  const input = String(body.input || "").trim();
  const id    = String(body.id    || "").trim();
  if (!input && !id)
    return new Response(JSON.stringify({ placed: false }), { status: 200, headers: JSON_HEADERS });

  try {
    let entryId = id;

    if (!entryId) {
      const search = await mcpTool("search_atlas", { query: input, limit: 1 });
      let top = search.results?.[0];
      if (!top) {
        const fallback = await mcpTool("search_atlas", { query: "Relation", limit: 1 });
        top = fallback?.results?.[0];
      }
      if (!top)
        return new Response(JSON.stringify({ placed: false, message: "Atlas unreachable." }), { status: 200, headers: JSON_HEADERS });
      entryId = top.id;
    }

    const [entry, related] = await Promise.all([
      mcpTool("get_entry",   { id: entryId }),
      mcpTool("get_related", { id: entryId }),
    ]);

    if (entry.notFound)
      return new Response(JSON.stringify({ placed: false, message: "Entry not found." }), { status: 200, headers: JSON_HEADERS });

    const slim = (items, limit = 5) =>
      (items || [])
        .filter(t => t && !t.unresolved && t.title)
        .slice(0, limit)
        .map(({ id, title, publicUrl, order }) => ({ id, title, publicUrl: publicUrl || null, order: order || null }));

    const dedup = (items) => {
      const seen = new Set();
      return (items || []).filter(t => t?.id && !seen.has(t.id) && seen.add(t.id));
    };
    const carries = slim(dedup(related.downstream?.carries));
    const traces  = slim(dedup([...(related.upstream?.holds || []), ...(related.upstream?.traces || [])]));

    return new Response(JSON.stringify({
      placed: true,
      term: {
        id: entry.id, title: entry.title,
        publicUrl: entry.publicUrl || null, order: entry.order || null,
        snippet: extractSnippet(entry.content),
      },
      carries,
      traces,
    }), { status: 200, headers: JSON_HEADERS });

  } catch {
    return new Response(JSON.stringify({ placed: false, message: "Atlas temporarily unavailable." }), { status: 200, headers: JSON_HEADERS });
  }
}

// ── Garden API ────────────────────────────────────────────────────────────────

function normalizeGardenPace(value, fallback = 1) {
  const pace = Number(value);
  if (!Number.isFinite(pace) || pace <= 0) return fallback;
  return Math.min(pace, 1000);
}

function gardenPace(env) {
  const pace = Number(env?.GARDEN_PACE || 1);
  if (!Number.isFinite(pace) || pace <= 0) return 1;
  return Math.min(pace, 1000);
}

async function readGardenPace(env) {
  if (!env?.GARDEN) return gardenPace(env);
  const stored = await env.GARDEN.get("garden:pace");
  return normalizeGardenPace(stored, gardenPace(env));
}

function gardenTimingForPace(pace) {
  return {
    pace,
    mode: pace === 1 ? "careful 1:1" : "accelerated nursery",
    base: {
      gardenerHours: 1,
      gardenCycleHours: 1,
      minimumSeasonHours: 12,
      cleanPassHours: 24,
      thinSectionHours: 48,
      alignmentHours: 48,
      driftHours: 72,
      reciprocityHours: 72,
      rootTrunkHours: 168,
    },
    modifiers: {
      light: "25% faster per light, capped at 50% faster",
      shade: "50% slower per shade, capped at 200% slower; 3 shade holds for review",
    },
  };
}

function gardenIntervalsForPace(pace) {
  const minMs = 60 * 1000;
  const safePace = Math.max(0.001, Number(pace || 1));
  return {
    gardener: Math.max(minMs, 3600000 / safePace),
    steward: Math.max(minMs, 3600000 / safePace),
    applier: Math.max(minMs, 3600000 / safePace),
  };
}

function gardenModeForPace(pace) {
  return Number(pace || 1) === 1 ? "careful" : "nursery";
}

function shortGardenDuration(ms) {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

function gardenWorkerNote(worker, now = Date.now()) {
  const status = worker.status || {};
  if (status.state === "error") return `${worker.name} error: ${status.error || "unknown"}`;
  if (status.state === "skip") return `${worker.name} waiting ${shortGardenDuration(Math.max(0, Number(status.nextMs || now) - now))}`;
  if (status.state === "ok" && status.result === "skipped") return `${worker.name} no work: ${status.reason || "nothing ready"}`;
  if (status.state === "ok") return `${worker.name} tended ${worker.last_run ? shortGardenDuration(now - worker.last_run) + " ago" : "recently"}`;
  return `${worker.name} watching`;
}

function gardenHealthNote(pace, workers, counts) {
  const intervals = gardenIntervalsForPace(pace);
  const active = [
    counts.pending ? `${counts.pending} ungrounded` : null,
    counts.needs_preparation ? `${counts.needs_preparation} needs prep` : null,
  ].filter(Boolean).join(", ") || "no active proposals";
  const cycle = counts.approved ? ` ${counts.approved} grounded for Garden Cycle.` : "";
  const workerNotes = workers.map((worker) => gardenWorkerNote(worker)).join("; ");
  return `Garden note: ${gardenModeForPace(pace)} mode, gardener every ${shortGardenDuration(intervals.gardener)}. ${active}.${cycle} ${workerNotes}.`;
}

function gardenTiming(env) {
  return gardenTimingForPace(gardenPace(env));
}

async function handleGardenPace(request, env) {
  if (request.method === "GET") {
    return new Response(JSON.stringify({ ok: true, timing: gardenTimingForPace(await readGardenPace(env)) }), { status: 200, headers: JSON_HEADERS });
  }

  if (request.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });
  if (!gardenAuthorized(request, env))
    return gardenUnauthorized();
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: JSON_HEADERS }); }

  const pace = normalizeGardenPace(body.pace, NaN);
  if (!Number.isFinite(pace))
    return new Response(JSON.stringify({ error: "invalid_pace" }), { status: 400, headers: JSON_HEADERS });

  await env.GARDEN.put("garden:pace", String(pace));
  return new Response(JSON.stringify({ ok: true, timing: gardenTimingForPace(pace) }), { status: 200, headers: JSON_HEADERS });
}

async function handleFieldEntries(env) {
  if (!env.ATLAS_DB)
    return new Response(JSON.stringify({ error: "db_unavailable" }), { status: 503, headers: JSON_HEADERS });

  const [rows, memory] = await Promise.all([
    env.ATLAS_DB.prepare(
    "SELECT id, title, entry_order, garden_status, structure FROM entries ORDER BY source_path, id"
    ).all(),
    readGardenMemory(env),
  ]);

  const entries = (rows.results || []).map(r => {
    const s = r.structure ? JSON.parse(r.structure) : {};
    return {
      id: r.id,
      title: r.title,
      order: r.entry_order || "operation",
      gardenStatus: r.garden_status,
      holds:   s.holds   || [],
      traces:  s.traces  || [],
      carries: s.carries || [],
      pairs:   s.pairs   || [],
      nests:   s.nests   || [],
    };
  });

  return new Response(JSON.stringify({ entries, memory }), { status: 200, headers: {
    ...JSON_HEADERS,
    "Cache-Control": "public, max-age=120",
  }});
}

async function readGardenMemory(env) {
  if (!env.GARDEN?.list) return {};
  const out = {};
  let cursor;
  do {
    const listed = await env.GARDEN.list({ prefix: "garden-memory:entry:", cursor, limit: 1000 });
    cursor = listed.cursor;
    const keys = listed.keys || [];
    const values = await Promise.all(keys.map((item) => env.GARDEN.get(item.name)));
    keys.forEach((item, index) => {
      try {
        const value = JSON.parse(values[index] || "{}");
        const id = item.name.replace("garden-memory:entry:", "");
        out[id] = normalizeGardenMemory(value, { id, title: value.title || "" });
      } catch {}
    });
  } while (cursor);
  return out;
}

function ratio(n, d) {
  return d > 0 ? Math.max(0, Math.min(1, n / d)) : 0;
}

function incrementMap(map, key, by = 1) {
  const name = String(key || "").trim();
  if (!name) return map || {};
  const next = { ...(map || {}) };
  next[name] = Math.max(0, Number(next[name] || 0) + by);
  return next;
}

function dominantRatio(map, total) {
  const values = Object.values(map || {}).map(Number).filter(Number.isFinite);
  return ratio(values.length ? Math.max(...values) : 0, total);
}

function normalizeGardenMemory(memory, entry = {}) {
  const visits = Number(memory?.visits || (memory?.at ? 1 : 0));
  const sections = memory?.sections || (memory?.targetSection ? { [memory.targetSection]: 1 } : {});
  const care = memory?.care || (memory?.careAction ? { [memory.careAction]: 1 } : {});
  const kinds = memory?.kinds || (memory?.kind ? { [memory.kind]: 1 } : {});
  const active = Number(memory?.active || (memory?.at ? 1 : 0));
  const resolved = Number(memory?.resolved || 0);
  const unresolved = Number(memory?.unresolved || active);
  return withGardenMemoryRatios({
    entryId: memory?.entryId || entry.id || "",
    title: memory?.title || entry.title || "",
    visits,
    resolved,
    unresolved,
    active,
    approved: Number(memory?.approved || 0),
    applied: Number(memory?.applied || 0),
    discarded: Number(memory?.discarded || 0),
    needsPreparation: Number(memory?.needsPreparation || 0),
    sections,
    care,
    kinds,
    firstAt: memory?.firstAt || memory?.at || "",
    lastAt: memory?.lastAt || memory?.at || "",
    lastProposalId: memory?.lastProposalId || memory?.proposalId || "",
    lastCareAction: memory?.lastCareAction || memory?.careAction || "",
    lastKind: memory?.lastKind || memory?.kind || "",
    lastTargetSection: memory?.lastTargetSection || memory?.targetSection || "",
    lastStatus: memory?.lastStatus || (memory?.at ? "pending" : ""),
  });
}

function withGardenMemoryRatios(memory) {
  const visits = Math.max(0, Number(memory.visits || 0));
  const resolved = Math.max(0, Number(memory.resolved || 0));
  const unresolved = Math.max(0, Number(memory.unresolved || 0));
  const active = Math.max(0, Number(memory.active || 0));
  const returnRatio = dominantRatio(memory.sections, visits);
  const coherenceRatio = Math.max(returnRatio, dominantRatio(memory.care, visits), dominantRatio(memory.kinds, visits));
  const resolutionRatio = ratio(resolved, resolved + unresolved);
  const stabilityRatio = ratio(resolved, resolved + active);
  const recognitionRatio = clampRatio(resolutionRatio * (0.55 + returnRatio * 0.25 + coherenceRatio * 0.2));
  return {
    ...memory,
    ratios: {
      resolution: Number(resolutionRatio.toFixed(4)),
      return: Number(returnRatio.toFixed(4)),
      coherence: Number(coherenceRatio.toFixed(4)),
      stability: Number(stabilityRatio.toFixed(4)),
      recognition: Number(recognitionRatio.toFixed(4)),
      pressure: Number(ratio(active, visits || active).toFixed(4)),
    },
  };
}

function clampRatio(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function proposalEntryId(prop) {
  return String(prop?.proposal_for || prop?.entry_id || prop?.entryId || prop?.term || "").trim();
}

function proposalCareAction(prop) {
  const explicit = prop?.care_action || prop?.careAction;
  if (explicit) return String(explicit);
  return String(prop?.proposed_changes || "").match(/Care action:\s*([^\n]+)/i)?.[1]?.trim() || "";
}

function proposalTargetSection(prop) {
  const explicit = prop?.target_section || prop?.targetSection;
  if (explicit) return String(explicit);
  return String(prop?.proposed_changes || "").match(/Section:\s*([^\n]+)/i)?.[1]?.trim() || "";
}

async function updateGardenMemoryForProposalStatus(env, prop, nextStatus, previousStatus) {
  if (!env.GARDEN) return;
  const entryId = proposalEntryId(prop);
  if (!entryId) return;
  const key = `garden-memory:entry:${entryId}`;
  let previous = {};
  try { previous = JSON.parse(await env.GARDEN.get(key) || "{}"); } catch {}
  const memory = normalizeGardenMemory(previous, {
    id: entryId,
    title: prop.title || prop.entry_title || prop.term || "",
  });
  const wasActive = previousStatus === "pending" || previousStatus === "approved";
  const isActive = nextStatus === "pending" || nextStatus === "approved";
  const wasResolved = previousStatus === "approved" || previousStatus === "applied";
  const isResolved = nextStatus === "approved" || nextStatus === "applied";
  const wasUnresolved = previousStatus === "pending" || previousStatus === "needs_preparation" || previousStatus === "discarded";
  const isUnresolved = nextStatus === "pending" || nextStatus === "needs_preparation" || nextStatus === "discarded";

  if (wasActive && !isActive) memory.active = Math.max(0, Number(memory.active || 0) - 1);
  if (!wasActive && isActive) memory.active = Number(memory.active || 0) + 1;
  if (wasResolved && !isResolved) memory.resolved = Math.max(0, Number(memory.resolved || 0) - 1);
  if (!wasResolved && isResolved) memory.resolved = Number(memory.resolved || 0) + 1;
  if (wasUnresolved && !isUnresolved) memory.unresolved = Math.max(0, Number(memory.unresolved || 0) - 1);
  if (!wasUnresolved && isUnresolved) memory.unresolved = Number(memory.unresolved || 0) + 1;

  if (nextStatus === "approved" && previousStatus !== "approved") memory.approved = Number(memory.approved || 0) + 1;
  if (nextStatus === "applied" && previousStatus !== "applied") memory.applied = Number(memory.applied || 0) + 1;
  if (nextStatus === "discarded" && previousStatus !== "discarded") memory.discarded = Number(memory.discarded || 0) + 1;
  if (nextStatus === "needs_preparation" && previousStatus !== "needs_preparation") memory.needsPreparation = Number(memory.needsPreparation || 0) + 1;

  const now = new Date().toISOString();
  memory.lastAt = now;
  memory.lastProposalId = prop.id || prop.proposal_id || memory.lastProposalId || "";
  memory.lastCareAction = proposalCareAction(prop) || memory.lastCareAction || "";
  memory.lastKind = prop.kind || memory.lastKind || "";
  memory.lastTargetSection = proposalTargetSection(prop) || memory.lastTargetSection || "";
  memory.lastStatus = nextStatus;
  if (memory.lastTargetSection) memory.sections = incrementMap(memory.sections, memory.lastTargetSection, 0);
  if (memory.lastCareAction) memory.care = incrementMap(memory.care, memory.lastCareAction, 0);
  if (memory.lastKind) memory.kinds = incrementMap(memory.kinds, memory.lastKind, 0);

  await env.GARDEN.put(key, JSON.stringify(withGardenMemoryRatios(memory)), { expirationTtl: 60 * 60 * 24 * 90 });
}

async function handleGardenHealth(env) {
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  const pace = await readGardenPace(env);
  const intervals = gardenIntervalsForPace(pace);

  const [gardenerRaw, stewardRaw, cycleRaw, gardenerWakeRaw, stewardWakeRaw, cycleWakeRaw, gardenerStatusRaw, stewardStatusRaw, cycleStatusRaw, indexRaw] = await Promise.all([
    env.GARDEN.get("schedule:api-gardener:last_run"),
    env.GARDEN.get("schedule:garden-steward:last_run"),
    env.GARDEN.get("schedule:garden-cycle:last_run"),
    env.GARDEN.get("schedule:api-gardener:last_wake"),
    env.GARDEN.get("schedule:garden-steward:last_wake"),
    env.GARDEN.get("schedule:garden-cycle:last_wake"),
    env.GARDEN.get("schedule:api-gardener:status"),
    env.GARDEN.get("schedule:garden-steward:status"),
    env.GARDEN.get("schedule:garden-cycle:status"),
    env.GARDEN.get("proposals:index"),
  ]);

  const index = indexRaw ? JSON.parse(indexRaw) : [];
  const counts = {};
  for (const p of index) counts[p.status] = (counts[p.status] || 0) + 1;

  const workers = [
    { name: "gardener", last_run: gardenerRaw ? Number(gardenerRaw) : null, last_wake: gardenerWakeRaw ? Number(gardenerWakeRaw) : null, status: gardenerStatusRaw ? JSON.parse(gardenerStatusRaw) : null, interval_ms: intervals.gardener },
    { name: "steward",  last_run: stewardRaw  ? Number(stewardRaw)  : null, last_wake: stewardWakeRaw  ? Number(stewardWakeRaw)  : null, status: stewardStatusRaw  ? JSON.parse(stewardStatusRaw)  : null, interval_ms: intervals.steward },
    { name: "applier",  last_run: cycleRaw    ? Number(cycleRaw)    : null, last_wake: cycleWakeRaw    ? Number(cycleWakeRaw)    : null, status: cycleStatusRaw    ? JSON.parse(cycleStatusRaw)    : null, interval_ms: intervals.applier },
  ];

  return new Response(JSON.stringify({
    pace,
    mode: gardenModeForPace(pace),
    workers,
    counts,
    note: gardenHealthNote(pace, workers, counts),
  }), { status: 200, headers: JSON_HEADERS });
}

async function handleGardenLog(request, env) {
  if (request.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });
  if (!gardenAuthorized(request, env))
    return gardenUnauthorized();
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: JSON_HEADERS }); }

  const id = body.proposal_id;
  if (!id)
    return new Response(JSON.stringify({ error: "missing_proposal_id" }), { status: 400, headers: JSON_HEADERS });

  const now = new Date().toISOString();
  const proposal = {
    ...body,
    proposal_id: id,
    id,
    status: "pending",
    light_count: Number(body.light_count || 0),
    shade_count: Number(body.shade_count || 0),
    logged_at: now,
  };

  // Write full proposal object
  await env.GARDEN.put(`proposal:${id}`, JSON.stringify(proposal));

  // Update index
  const raw = await env.GARDEN.get("proposals:index");
  const index = raw ? JSON.parse(raw) : [];
  const entry = {
    id, term: body.term, kind: body.kind, confidence: body.confidence,
    proposed_at: body.proposed_at, status: "pending",
    summary: body.summary || "", proposal_for: body.proposal_for || "",
    order: body.order || body.entry_order || "",
    proposed_changes: body.proposed_changes || "",
    reciprocity_issues: body.reciprocity_issues || "",
    light_count: proposal.light_count,
    shade_count: proposal.shade_count,
  };
  // Remove any existing entry with same id, then prepend
  const updated = [entry, ...index.filter(x => x.id !== id)].slice(0, 200);
  await env.GARDEN.put("proposals:index", JSON.stringify(updated));

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
}

async function signalProposal(request, env, id, signal) {
  if (request.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });
  if (!["light", "shade"].includes(signal))
    return new Response(JSON.stringify({ error: "invalid_signal" }), { status: 400, headers: JSON_HEADERS });

  let body = {};
  try { body = await request.json(); } catch {}

  const rawVoter = String(body.voter_id || request.headers.get("CF-Connecting-IP") || "").trim();
  const voter = rawVoter.replace(/[^a-zA-Z0-9_.:-]/g, "").slice(0, 80);
  if (!voter)
    return new Response(JSON.stringify({ error: "missing_voter_id" }), { status: 400, headers: JSON_HEADERS });

  const [propRaw, indexRaw, previousRaw] = await Promise.all([
    env.GARDEN.get(`proposal:${id}`),
    env.GARDEN.get("proposals:index"),
    env.GARDEN.get(`proposal-signal:${id}:${voter}`),
  ]);
  if (!propRaw)
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: JSON_HEADERS });

  const prop = JSON.parse(propRaw);
  if (!["pending", "approved"].includes(prop.status))
    return new Response(JSON.stringify({ error: "not_open_for_signals" }), { status: 409, headers: JSON_HEADERS });

  const previous = previousRaw ? JSON.parse(previousRaw).signal : null;
  let light = Number(prop.light_count || 0);
  let shade = Number(prop.shade_count || 0);

  if (previous === signal) {
    return new Response(JSON.stringify({ ok: true, id, signal, light_count: light, shade_count: shade }), { status: 200, headers: JSON_HEADERS });
  }

  if (previous === "light") light = Math.max(0, light - 1);
  if (previous === "shade") shade = Math.max(0, shade - 1);
  if (signal === "light") light += 1;
  if (signal === "shade") shade += 1;

  prop.light_count = light;
  prop.shade_count = shade;
  prop.last_signal_at = new Date().toISOString();

  const index = indexRaw ? JSON.parse(indexRaw) : [];
  const updated = index.map(x => x.id === id ? { ...x, light_count: light, shade_count: shade } : x);

  await Promise.all([
    env.GARDEN.put(`proposal:${id}`, JSON.stringify(prop)),
    env.GARDEN.put("proposals:index", JSON.stringify(updated)),
    env.GARDEN.put(`proposal-signal:${id}:${voter}`, JSON.stringify({ signal, at: prop.last_signal_at })),
  ]);

  return new Response(JSON.stringify({ ok: true, id, signal, light_count: light, shade_count: shade }), { status: 200, headers: JSON_HEADERS });
}

async function handleGardenStats(request, env) {
  if (request.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });
  if (!gardenAuthorized(request, env))
    return gardenUnauthorized();
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: JSON_HEADERS }); }

  await env.GARDEN.put("garden:stats", JSON.stringify({
    ...body,
    updated_at: new Date().toISOString(),
  }));
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
}

async function handleGardenProposals(env) {
  if (!env.GARDEN)
    return new Response(JSON.stringify({ proposals: [], stats: null, timing: gardenTiming(env) }), { status: 200, headers: JSON_HEADERS });

  const [raw, statsRaw] = await Promise.all([
    env.GARDEN.get("proposals:index"),
    env.GARDEN.get("garden:stats"),
  ]);
  const proposals = raw ? JSON.parse(raw) : [];
  const stats = statsRaw ? JSON.parse(statsRaw) : null;

  return new Response(JSON.stringify({ proposals, stats, timing: gardenTimingForPace(await readGardenPace(env)) }), { status: 200, headers: JSON_HEADERS });
}

async function handleGardenProposalDetail(request, env, id) {
  if (!gardenAuthorized(request, env))
    return gardenUnauthorized();
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  const raw = await env.GARDEN.get(`proposal:${id}`);
  if (!raw)
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: JSON_HEADERS });

  return new Response(raw, { status: 200, headers: JSON_HEADERS });
}

async function updateProposalStatus(env, id, status) {
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  const [propRaw, indexRaw] = await Promise.all([
    env.GARDEN.get(`proposal:${id}`),
    env.GARDEN.get("proposals:index"),
  ]);
  if (!propRaw)
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: JSON_HEADERS });

  const prop = JSON.parse(propRaw);
  const previousStatus = prop.status || "pending";
  prop.status = status;
  prop[`${status}_at`] = new Date().toISOString();

  const terminal = status === 'applied' || status === 'discarded';
  // Terminal proposals: expire the KV entry after 7 days, drop from index
  const putOpts = terminal ? { expirationTtl: 604800 } : {};
  await env.GARDEN.put(`proposal:${id}`, JSON.stringify(prop), putOpts);

  const index = indexRaw ? JSON.parse(indexRaw) : [];
  const updated = terminal
    ? index.filter(x => x.id !== id)
    : index.map(x => x.id === id ? { ...x, status } : x);
  await Promise.all([
    env.GARDEN.put("proposals:index", JSON.stringify(updated)),
    updateGardenMemoryForProposalStatus(env, prop, status, previousStatus),
  ]);

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
}

async function handleGardenStewardNote(request, env, id) {
  if (request.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: JSON_HEADERS });
  if (!gardenAuthorized(request, env))
    return gardenUnauthorized();
  if (!env.GARDEN)
    return new Response(JSON.stringify({ error: "kv_unavailable" }), { status: 503, headers: JSON_HEADERS });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: JSON_HEADERS }); }

  const note = String(body.note || "").trim().slice(0, 360);
  if (!note)
    return new Response(JSON.stringify({ error: "missing_note" }), { status: 400, headers: JSON_HEADERS });

  const [propRaw, indexRaw] = await Promise.all([
    env.GARDEN.get(`proposal:${id}`),
    env.GARDEN.get("proposals:index"),
  ]);
  if (!propRaw)
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: JSON_HEADERS });

  const at = new Date().toISOString();
  const prop = JSON.parse(propRaw);
  prop.steward_note = note;
  prop.steward_action = String(body.action || "").trim().slice(0, 40);
  prop.stewarded_at = at;

  const index = indexRaw ? JSON.parse(indexRaw) : [];
  const updated = index.map(x => x.id === id ? {
    ...x,
    steward_note: note,
    steward_action: prop.steward_action,
    stewarded_at: at,
  } : x);

  await Promise.all([
    env.GARDEN.put(`proposal:${id}`, JSON.stringify(prop)),
    env.GARDEN.put("proposals:index", JSON.stringify(updated)),
  ]);

  return new Response(JSON.stringify({ ok: true, id, note, action: prop.steward_action, stewarded_at: at }), { status: 200, headers: JSON_HEADERS });
}

// ── Koha ──────────────────────────────────────────────────────────────────────

function handleKoha(env) {
  const url = (env && env.KOHA_URL) ? String(env.KOHA_URL) : null;
  if (url) return Response.redirect(url, 302);
  return Response.redirect("https://realitymechanics.nz/", 302);
}

// ── Garden page ───────────────────────────────────────────────────────────────

function gardenPage(env) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Garden · Reality Mechanics</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-size: 16px; }
    body {
      background:
        radial-gradient(circle at 50% 28%, rgba(20,31,46,0.78), rgba(7,9,14,0.7) 42%, #05070b 78%),
        #07090e;
      color: #d4c5a9;
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      min-height: 100vh; padding: 0;
    }

    /* ── Header ── */
    #header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 20;
      padding: 1.4rem 2rem 1rem;
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;
      background: linear-gradient(to bottom, #07090e 70%, transparent);
    }
    #header a, #header .current {
      font-family: system-ui, sans-serif;
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em;
      text-transform: uppercase; color: #1e2c3a; text-decoration: none;
      transition: color 0.2s;
    }
    #header a:hover { color: #4d5e72; }
    #header .current { color: rgba(200,96,26,0.54); text-align: center; letter-spacing: 0.16em; }
    #header a:last-child { justify-self: end; }

    /* ── Divider ── */
    .divider {
      margin: 2rem auto; max-width: 600px;
      border: none; border-top: 1px solid rgba(255,255,255,0.04);
    }

    /* ── Proposals ── */
    #proposals-wrap {
      max-width: 760px; margin: 0 auto; padding: 0 1.4rem 6rem;
    }
    #proposals-label {
      font-family: system-ui, sans-serif;
      font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: #2a3848;
      margin-bottom: 1.4rem;
      display: flex; align-items: center; gap: 0.8rem;
    }
    #proposals-label .pulse-dot {
      display: inline-block; width: 6px; height: 6px; border-radius: 50%;
      background: #c8601a;
      animation: pulse 2.4s ease-in-out infinite;
    }
    #proposals-label.quiet .pulse-dot { display: none; }
    @keyframes pulse {
      0%,100% { opacity: 0.3; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.5); }
    }
    #garden-status-strip {
      display: none;
      margin: -0.75rem 0 1.35rem;
      min-height: 1rem;
      display: flex; flex-wrap: wrap; gap: 0.42rem 0.7rem;
      font-family: system-ui, sans-serif;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(77,94,114,0.78);
    }
    #garden-term-rail {
      margin: -0.35rem 0 1.25rem;
      display: flex; gap: 0.55rem; overflow-x: auto; padding-bottom: 0.3rem;
      scrollbar-width: none;
    }
    #garden-term-rail::-webkit-scrollbar { display: none; }
    .garden-term-tab {
      flex: 0 0 auto; max-width: 16rem;
      border: 0; border-bottom: 1px solid rgba(255,255,255,0.055);
      background: transparent; color: rgba(77,94,114,0.92);
      padding: 0.45rem 0.15rem 0.38rem;
      font: 700 0.58rem/1.2 system-ui, sans-serif;
      letter-spacing: 0.11em; text-transform: uppercase;
      cursor: pointer;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .garden-term-tab.active {
      color: rgba(212,197,169,0.82);
      border-bottom-color: hsl(var(--flame, 24 84% 50%) / 0.68);
    }
    .garden-term-tab .count {
      margin-left: 0.35rem; color: rgba(200,96,26,0.62);
    }
    #garden-status-strip span {
      white-space: nowrap;
    }
    #garden-status-strip .warm { color: rgba(200,96,26,0.62); }
    #garden-status-strip .cool { color: rgba(100,165,220,0.64); }
    #garden-status-strip .held { color: rgba(154,142,118,0.68); }
    #garden-status-strip { display: none !important; }

    .proposal-card {
      margin-bottom: 1.2rem;
      border: 1px solid rgba(255,255,255,0.028);
      border-left: 2px solid hsl(var(--flame, 24 84% 50%) / 0.42);
      padding: 1.2rem 1.4rem;
      background: rgba(8,11,17,0.46);
      transition: border-color 0.2s, opacity 0.45s ease, transform 0.45s ease, background 0.45s ease;
    }
    .proposal-card:hover { border-left-color: hsl(var(--flame, 24 84% 50%) / 0.85); }
    .pc-flame {
      width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex: 0 0 auto;
    }
    .pc-felt {
      font-family: system-ui, sans-serif; font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.05em; color: rgba(200,96,26,0.82); margin: -0.55rem 0 0.75rem;
      opacity: 0; transition: opacity 0.4s; min-height: 0;
    }
    .pc-felt.show { opacity: 1; }
    .pc-reason { display: none; margin: -0.25rem 0 0.95rem; }
    .pc-reason.show { display: block; }
    .pc-reason input {
      width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.18);
      border: 1px solid rgba(255,255,255,0.05); border-radius: 0;
      color: rgba(225,210,180,0.85); font-family: system-ui, sans-serif;
      font-size: 0.78rem; padding: 0.5rem 0.6rem; outline: none;
    }
    .pc-reason input::placeholder { color: rgba(120,140,165,0.45); }
    .pc-reason input:focus { border-color: rgba(200,96,26,0.4); }
    #garden-tending { margin: 0 0 1.45rem; }
    #garden-tending > summary {
      cursor: pointer; list-style: none; display: flex; align-items: center; gap: 0.5rem;
      font-family: system-ui, sans-serif; font-size: 0.6rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; color: rgba(100,165,220,0.72);
    }
    #garden-tending > summary::-webkit-details-marker { display: none; }
    .gt-pulse { width: 6px; height: 6px; border-radius: 50%; background: rgba(100,165,220,0.7); flex: 0 0 auto; }
    #gt-rows { margin-top: 0.75rem; }
    .gt-note {
      font-family: system-ui, sans-serif; font-size: 0.66rem; line-height: 1.5;
      color: rgba(100,165,220,0.55); margin-bottom: 0.7rem; max-width: 30rem;
    }
    .gt-evidence {
      font-family: system-ui, sans-serif; font-size: 0.56rem; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase; color: rgba(120,140,165,0.42);
      margin-bottom: 0.6rem;
    }
    .gt-item { padding: 0.45rem 0; border-top: 1px solid rgba(255,255,255,0.025); }
    .gt-row {
      display: flex; align-items: center; gap: 0.6rem;
      font-family: system-ui, sans-serif; font-size: 0.74rem;
    }
    .gt-flame { width: 7px; height: 7px; border-radius: 50%; flex: 0 0 auto; }
    .gt-term { color: rgba(225,210,180,0.82); flex: 1; min-width: 0; }
    .gt-fate { font-size: 0.55rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: rgba(120,130,145,0.5); flex: 0 0 auto; }
    .gt-reason { margin: 0.32rem 0 0 1.3rem; font-size: 0.74rem; line-height: 1.45; color: rgba(225,210,180,0.72); font-style: italic; }
    .gt-reason.gt-bare { color: rgba(120,130,145,0.42); font-style: normal; }
    .proposal-card.approved { border-left-color: rgba(200,96,26,0.15); opacity: 0.5; }
    .proposal-card.discarded { display: none; }
    .proposal-card.grounding {
      border-left-color: rgba(154,142,118,0.55);
      background: rgba(12,15,19,0.56);
    }
    .proposal-card.grounded {
      border-left-color: rgba(154,142,118,0.3);
      opacity: 0.54;
      transform: translateY(4px);
      background: rgba(7,9,14,0.38);
    }

    .pc-meta {
      font-family: system-ui, sans-serif;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: rgba(120,145,175,0.8); margin-bottom: 0.5rem;
      display: flex; gap: 1rem; align-items: center;
    }
    .pc-meta .quiet { color: rgba(77,94,114,0.66); }
    .pc-kind { color: rgba(200,96,26,0.85); }
    .pc-conf-high  { color: rgba(100,195,100,0.85); }
    .pc-conf-med   { color: rgba(210,185,80,0.85); }
    .pc-conf-low   { color: rgba(200,100,100,0.85); }

    .pc-term {
      font-size: clamp(1.1rem, 2.5vw, 1.5rem); font-weight: 500;
      color: #ecdfc4; margin-bottom: 0.5rem;
    }
    .pc-paths {
      display: flex; gap: 0.95rem; margin: -0.2rem 0 0.82rem;
      font-family: system-ui, sans-serif;
      font-size: 0.56rem; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .pc-paths a {
      color: rgba(58,80,112,0.78); text-decoration: none;
      transition: color 0.18s;
    }
    .pc-paths a:hover { color: rgba(200,96,26,0.78); }
    .pc-summary {
      font-size: 0.96rem; line-height: 1.55;
      color: rgba(225,210,180,0.9); margin-bottom: 1rem;
    }
    .pc-edit {
      margin: 0 0 1rem;
      border-top: 1px solid rgba(255,255,255,0.026);
      border-bottom: 1px solid rgba(255,255,255,0.026);
      padding: 0.8rem 0;
    }
    .pc-edit summary {
      cursor: pointer;
      font-family: system-ui, sans-serif;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.09em;
      text-transform: uppercase; color: rgba(120,145,175,0.52);
      list-style: none;
    }
    .pc-edit summary::-webkit-details-marker { display: none; }
    .pc-edit summary::before {
      content: '+';
      display: inline-block;
      width: 1rem;
      color: rgba(77,94,114,0.8);
    }
    .pc-edit[open] summary::before { content: '-'; }
    .pc-edit-label {
      margin-top: 0.8rem;
      font-family: system-ui, sans-serif;
      font-size: 0.56rem; font-weight: 700; letter-spacing: 0.11em;
      text-transform: uppercase; color: rgba(120,145,175,0.7);
    }
    .pc-edit-section, .pc-edit-notes {
      margin-top: 0.28rem;
      font-size: 0.82rem; line-height: 1.5;
      color: rgba(212,197,169,0.5);
    }
    .pc-edit pre {
      margin-top: 0.35rem; max-height: min(42vh, 360px); overflow: auto;
      white-space: pre-wrap; word-break: break-word;
      font: 0.78rem/1.48 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: rgba(212,197,169,0.58);
      background: rgba(0,0,0,0.14);
      border: 1px solid rgba(255,255,255,0.035);
      padding: 0.75rem;
    }

    .pc-season {
      font-family: system-ui, sans-serif;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: rgba(100,165,220,0.85); margin: -0.35rem 0 0.9rem;
    }
    .pc-signals {
      display: none;
    }
    .pc-signal {
      font-family: system-ui, sans-serif;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 0.32rem 0.58rem;
      border: 1px solid rgba(255,255,255,0.035); color: rgba(58,74,94,0.78);
      background: rgba(255,255,255,0.006); cursor: pointer;
      transition: border-color 0.18s, color 0.18s, background 0.18s;
    }
    .pc-signal.light:hover, .pc-signal.light.active {
      border-color: rgba(200,96,26,0.45); color: rgba(200,96,26,0.82);
      background: rgba(200,96,26,0.06);
    }
    .pc-signal.shade:hover, .pc-signal.shade.active {
      border-color: rgba(77,94,114,0.6); color: rgba(112,130,154,0.9);
      background: rgba(77,94,114,0.08);
    }

    .pc-actions {
      display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;
      padding-top: 0.2rem;
    }
    .pc-btn {
      font-family: system-ui, sans-serif;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; padding: 0.66rem 1.3rem;
      min-height: 44px;
      border: 1px solid; cursor: pointer; transition: all 0.18s;
      background: none;
    }
    .pc-btn:disabled { cursor: default; pointer-events: none; }
    .pc-btn-ground {
      border-color: rgba(200,96,26,0.48); color: rgba(200,96,26,0.86);
      min-width: 9.4rem;
      background: rgba(200,96,26,0.035);
    }
    .pc-field-link {
      min-height: 36px; padding: 0.48rem 0;
      color: rgba(100,165,220,0.62); text-decoration: none;
      font: 700 0.58rem/36px system-ui, sans-serif;
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .pc-field-link:hover { color: rgba(100,165,220,0.9); }
    .pc-btn-ground:hover {
      border-color: rgba(200,96,26,0.8); color: #c8601a;
      background: rgba(200,96,26,0.06);
    }
    .pc-btn-ground.settled {
      border-color: rgba(154,142,118,0.42);
      color: rgba(154,142,118,0.88);
      background: rgba(154,142,118,0.045);
    }
    .pc-btn-discard {
      min-height: 36px;
      padding: 0.48rem 0;
      border: 0; color: rgba(42,56,72,0.55);
      opacity: 0.72;
    }
    .pc-btn-discard:hover {
      border-color: rgba(255,255,255,0.08); color: rgba(77,94,114,0.78);
      opacity: 1;
    }

    /* applied state */
    .proposal-card.applied {
      opacity: 0.6;
      border-color: rgba(255,255,255,0.04);
    }
    .proposal-card.applied .pc-actions { display: none; }
    .proposal-card.applied .pc-term { color: rgba(212,197,169,0.7); }
    .proposal-card.applied .pc-summary { color: rgba(212,197,169,0.6); }

    @media (max-width: 700px) {
      #proposals-wrap { padding-bottom: calc(8rem + env(safe-area-inset-bottom)); }
      .pc-signals { margin-bottom: 1.25rem; }
      .pc-actions { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.75rem; }
      .pc-btn-ground { width: 100%; min-width: 0; }
    }

    /* ── Pace control ── */
    #pace-control {
      margin-top: 2.4rem;
      border-top: 1px solid rgba(255,255,255,0.035);
      padding-top: 1rem;
      font-family: system-ui, sans-serif;
      color: rgba(77,94,114,0.78);
    }
    #pace-control summary {
      cursor: pointer;
      width: fit-content;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(42,56,72,0.95);
      list-style: none;
    }
    #pace-control summary::-webkit-details-marker { display: none; }
    #pace-control[open] summary { color: rgba(120,145,175,0.8); }
    .pace-row {
      display: flex; flex-wrap: wrap; gap: 0.5rem;
      align-items: center; margin-top: 0.8rem;
    }
    .pace-btn {
      min-width: 3.2rem;
      padding: 0.36rem 0.6rem;
      border: 1px solid rgba(255,255,255,0.05);
      background: rgba(255,255,255,0.01);
      color: rgba(77,94,114,0.95);
      font: 700 0.58rem/1 system-ui, sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
    }
    .pace-btn.active, .pace-btn:hover {
      border-color: rgba(200,96,26,0.35);
      color: rgba(200,96,26,0.78);
      background: rgba(200,96,26,0.045);
    }
    #pace-custom {
      width: 5.2rem;
      padding: 0.35rem 0.48rem;
      border: 1px solid rgba(255,255,255,0.05);
      background: rgba(0,0,0,0.12);
      color: rgba(212,197,169,0.72);
      font: 700 0.62rem/1 system-ui, sans-serif;
    }
    #pace-status {
      margin-top: 0.7rem;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: rgba(100,165,220,0.68);
    }
    #pace-note {
      margin-top: 0.45rem;
      max-width: 34rem;
      font-size: 0.7rem; line-height: 1.45;
      color: rgba(77,94,114,0.72);
    }
    #garden-mode {
      display: none;
      margin-top: 1.8rem;
      font-family: system-ui, sans-serif;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(200,96,26,0.58);
    }
    #garden-note {
      display: none;
      margin-top: 0.45rem;
      max-width: 34rem;
      font-family: system-ui, sans-serif;
      font-size: 0.72rem; line-height: 1.5;
      color: rgba(120,145,175,0.7);
    }
    #health-control {
      display: none;
      margin-top: 1.6rem;
      border-top: 1px solid rgba(255,255,255,0.035);
      padding-top: 1rem;
      font-family: system-ui, sans-serif;
      color: rgba(77,94,114,0.78);
    }
    #health-control summary {
      cursor: pointer;
      width: fit-content;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(42,56,72,0.95);
      list-style: none;
    }
    #health-control summary::-webkit-details-marker { display: none; }
    #health-control[open] summary { color: rgba(120,145,175,0.8); }
    #health-summary-line {
      display: inline; margin-left: 0.5rem;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .health-row {
      display: flex; align-items: center; gap: 0.8rem;
      margin-top: 0.7rem;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .health-name { color: rgba(77,94,114,0.85); min-width: 5rem; }
    .health-time { color: rgba(100,165,220,0.68); min-width: 5rem; }
    .health-detail {
      color: rgba(120,145,175,0.62);
      min-width: min(18rem, 48vw);
      line-height: 1.35;
    }
    .health-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: rgba(77,94,114,0.4);
    }
    .health-dot.ok  { background: rgba(100,195,100,0.75); }
    .health-dot.idle  { background: rgba(200,160,60,0.75); }
    .health-dot.stale { background: rgba(200,80,60,0.75); }
    #health-counts {
      margin-top: 1rem;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: rgba(77,94,114,0.72);
    }

    /* ── Empty state ── */
    #empty {
      text-align: center; padding: 3rem 0;
      font-size: 0.85rem; color: #182535;
      font-family: system-ui, sans-serif;
      letter-spacing: 0.06em;
    }

    /* ── Loading shimmer ── */
    .shimmer {
      background: linear-gradient(90deg, #0c1019 25%, #111827 50%, #0c1019 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 2px;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .sh-line { height: 12px; margin-bottom: 8px; }
    .sh-line.wide { width: 80%; }
    .sh-line.med  { width: 55%; }
    .sh-line.thin { width: 30%; }
  </style>
</head>
<body>

<div id="header">
  <a href="/atlas">Atlas</a>
  <div class="current">Garden</div>
  <a href="/field">Field</a>
</div>

<hr class="divider"/>

<div id="proposals-wrap">
  <div id="proposals-label">
    <span class="pulse-dot"></span>
      <span id="plabel-text">clean finding</span>
  </div>
  <div id="garden-status-strip" aria-live="polite"></div>
  <div id="garden-term-rail" aria-label="Terms with proposed edits"></div>
  <details id="garden-tending" style="display:none">
    <summary><span class="gt-pulse"></span><span id="gt-tally">your tending</span></summary>
    <div id="gt-rows"></div>
  </details>
  <div id="proposals-list">
    <div id="js-loading" style="font-family:system-ui;font-size:0.65rem;color:rgba(100,120,145,0.5);letter-spacing:0.08em;text-transform:uppercase">loading…</div>
  </div>
  <details id="pace-control">
    <summary>pace</summary>
    <div class="pace-row">
      <button class="pace-btn" data-pace="1" onclick="setGardenPace(1)">hourly</button>
      <button class="pace-btn" data-pace="6" onclick="setGardenPace(6)">10 min</button>
      <button class="pace-btn" data-pace="12" onclick="setGardenPace(12)">5 min</button>
      <button class="pace-btn" data-pace="60" onclick="setGardenPace(60)">1 min</button>
      <input id="pace-custom" type="number" min="1" max="1440" step="1" inputmode="numeric" aria-label="Custom gardener minutes"/>
      <button class="pace-btn" onclick="setGardenMinutesFromInput()">Set min</button>
    </div>
    <div id="pace-status">pace loading</div>
    <div id="pace-note">Protected by the Garden password. This sets how often the gardener works; steward and Garden Cycle scale from the same pace.</div>
  </details>
  <div id="garden-mode">mode loading</div>
  <div id="garden-note"></div>
  <details id="health-control">
    <summary>workers<span id="health-summary-line"></span></summary>
    <div id="health-rows"></div>
    <div id="health-counts"></div>
  </details>
</div>

<script>
// localStorage may throw in Private mode with content blockers — guard all access
const ls = (() => {
  try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return localStorage; }
  catch(e) { const m = {}; return { getItem: k => m[k]||null, setItem: (k,v) => { m[k]=v; }, removeItem: k => { delete m[k]; } }; }
})();
const voterId = (() => {
  let id = ls.getItem('gardenVoterId');
  if (!id) {
    id = 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    ls.setItem('gardenVoterId', id);
  }
  return id;
})();
let gardenTiming = ${JSON.stringify(gardenTiming(env))};
let lastProposals = [];
let activeGardenTerm = '';

// Fire palette shared with the Field: a tended term glows the same order-colour it burns above.
const FIRE_ORDERS = {
  seed:{h:48,s:88,l:58}, ground:{h:24,s:84,l:50}, first:{h:278,s:46,l:57},
  second:{h:230,s:52,l:57}, third:{h:188,s:52,l:50}, practice:{h:130,s:46,l:49}, higher:{h:46,s:20,l:90}
};
function fireFor(order) { return FIRE_ORDERS[String(order || '').toLowerCase()] || FIRE_ORDERS.ground; }
function flameVar(order) { const f = fireFor(order); return f.h + ' ' + f.s + '% ' + f.l + '%'; }

// Personal trace: what this visitor has tended, remembered locally so they can come back to it.
function readTended() { try { return JSON.parse(ls.getItem('gardenTended') || '{}'); } catch (e) { return {}; } }
function writeTended(map) { try { ls.setItem('gardenTended', JSON.stringify(map)); } catch (e) {} }
function recordTending(id, fields) {
  const map = readTended();
  map[id] = Object.assign({}, map[id], fields, { at: Date.now() });
  writeTended(map);
}
function saveReason(id, value) {
  const map = readTended();
  if (!map[id]) return;
  map[id].reason = String(value || '').trim();
  writeTended(map);
  renderTending(lastProposals);
}
function renderTending(proposals) {
  const wrap = document.getElementById('garden-tending');
  if (!wrap) return;
  const tended = readTended();
  const ids = Object.keys(tended);
  if (!ids.length) { wrap.style.display = 'none'; return; }
  const byId = {};
  (proposals || []).forEach(function (p) { byId[p.id] = p; });
  const fateOf = function (id) {
    const t = tended[id], p = byId[id];
    if (t.kind === 'ground') return 'you approved it';
    if (!p) return 'moved on';
    if (p.status === 'approved' || p.status === 'applied') return 'took root';
    if (p.status === 'discarded') return 'let go';
    return 'seasoning';
  };
  const rows = ids.map(function (id) {
    const t = tended[id];
    const reason = String(t.reason || '').trim();
    const reasonHtml = reason
      ? '<div class="gt-reason">' + escape(reason) + '</div>'
      : '<div class="gt-reason gt-bare">a nudge — no reason left</div>';
    return '<div class="gt-item"><div class="gt-row">'
      + '<span class="gt-flame" style="background:hsl(' + flameVar(t.order) + ')"></span>'
      + '<span class="gt-term">' + escape(t.term || id) + '</span>'
      + '<span class="gt-fate">' + fateOf(id) + '</span></div>'
      + reasonHtml + '</div>';
  }).reverse().slice(0, 24).join('');
  const reasoned = ids.filter(function (id) { return String(tended[id].reason || '').trim(); }).length;
  document.getElementById('gt-tally').textContent = 'you tend here';
  document.getElementById('gt-rows').innerHTML =
    '<div class="gt-note">A member of the tending, not a user of it — a place you hold, kept on your device, apart from the Atlas. A reason is the trace that counts; it is what opens planting.</div>'
    + '<div class="gt-evidence">' + ids.length + ' tended · ' + reasoned + ' carry a reason</div>'
    + rows;
  wrap.style.display = '';
}

function proposalTermKey(p) {
  return String(p.proposal_for || p.entry_id || p.term || p.id || '');
}

function selectGardenTerm(key) {
  activeGardenTerm = String(key || '');
  if (activeGardenTerm) {
    try { history.replaceState(null, '', '#term=' + encodeURIComponent(activeGardenTerm)); } catch (e) {}
    ls.setItem('gardenActiveTerm', activeGardenTerm);
  }
  renderGarden(lastProposals);
}

function renderGardenTermRail(proposals) {
  const rail = document.getElementById('garden-term-rail');
  if (!rail) return;
  const groups = [];
  const byKey = {};
  (proposals || []).forEach((p) => {
    const key = proposalTermKey(p);
    if (!key) return;
    if (!byKey[key]) {
      byKey[key] = { key, title: p.term || key, order: p.order || '', count: 0, newest: 0 };
      groups.push(byKey[key]);
    }
    byKey[key].count += 1;
    byKey[key].newest = Math.max(byKey[key].newest, new Date(p.proposed_at || p.logged_at || 0).getTime() || 0);
  });
  groups.sort((a, b) => b.newest - a.newest);
  if (!activeGardenTerm || !byKey[activeGardenTerm]) {
    const hashTerm = decodeURIComponent((location.hash.match(/term=([^&]+)/) || [])[1] || '');
    activeGardenTerm = byKey[hashTerm] ? hashTerm : (groups[0]?.key || '');
  }
  rail.innerHTML = groups.map((g) =>
    '<button class="garden-term-tab ' + (g.key === activeGardenTerm ? 'active' : '') + '" style="--flame:' + flameVar(g.order) + '" onclick="selectGardenTerm(' + JSON.stringify(g.key).replace(/"/g, '&quot;') + ')">'
      + escape(g.title) + (g.count > 1 ? '<span class="count">' + g.count + '</span>' : '') +
    '</button>'
  ).join('');
}

function renderGarden(proposals) {
  const list = document.getElementById('proposals-list');
  const label = document.getElementById('proposals-label');
  const labelText = document.getElementById('plabel-text');
  const visible = (proposals || []).filter(p => p.status === 'pending');
  const grounded = (proposals || []).filter(p => p.status === 'approved');
  renderGardenStatusStrip({
    pending: visible.length,
    approved: grounded.length,
    needs_preparation: (proposals || []).filter(p => p.status === 'needs_preparation').length,
    applied: (proposals || []).filter(p => p.status === 'applied').length,
  });

  renderGardenTermRail(visible);
  list.innerHTML = '';

  if (!visible.length) {
    list.innerHTML = '<div id="empty">' + (grounded.length ? 'approved edits are entering through Garden Cycle' : 'the garden is resting') + '</div>';
    label.classList.add('quiet');
    labelText.textContent = grounded.length ? 'entering naturally' : 'clean finding';
    return;
  }

  const termProposals = visible
    .filter((p) => proposalTermKey(p) === activeGardenTerm)
    .sort((a, b) => new Date(b.proposed_at || b.logged_at || 0) - new Date(a.proposed_at || a.logged_at || 0));
  const first = termProposals[0] || visible[0];
  label.classList.toggle('quiet', false);
  labelText.textContent = first?.term || 'clean finding';
  if (first) renderProposalCard(first, 0, list);
}

function renderProposalCard(p, i, list) {
  let card;
  try {
  card = document.createElement('div');
  card.className = 'proposal-card ' + (p.status || 'pending');
  card.dataset.id = p.id;
  card.dataset.kind = p.kind || '';
  card.dataset.order = p.order || '';
  card.dataset.term = p.term || '';
  card.dataset.proposedAt = p.proposed_at || p.logged_at || '';
  card.dataset.loggedAt = p.logged_at || '';
  card.style.setProperty('--flame', flameVar(p.order));

  const mine = ls.getItem('gardenSignal:' + p.id) || '';
  const season = seasoningText(p);
  const lightCount = Number(p.light_count || 0);
  const shadeCount = Number(p.shade_count || 0);
  const parsed = parseProposalEdit(p.proposed_changes || '');
  const replacement = parsed.replacement || '';
  const section = parsed.section || '';
  const fieldHref = p.proposal_for ? '/field#' + encodeURIComponent(p.proposal_for) : '/field';

  card.innerHTML = \`
    <div class="pc-meta">
      <span class="pc-flame" style="background:hsl(var(--flame))"></span>
      <span class="quiet">\${escape(p.kind || 'proposal')}</span>
      <span class="quiet">\${timeAgo(new Date(p.proposed_at || p.logged_at || Date.now()))}</span>
    </div>
    <div class="pc-term">\${escape(p.term || '')}</div>
    <div class="pc-summary">\${escape(p.summary || '')}</div>
    <div class="pc-felt"></div>
    <details class="pc-edit" open>
      <summary>proposed edit</summary>
      \${section ? \`<div class="pc-edit-label">Section</div><div class="pc-edit-section">\${escape(section)}</div>\` : ''}
      \${replacement ? \`<div class="pc-edit-label">Replacement</div><pre>\${escape(replacement)}</pre>\` : '<div class="pc-edit-notes">No prepared replacement yet.</div>'}
    </details>
    <div class="pc-season">\${escape(season)}</div>
    <div class="pc-signals">
      <button class="pc-signal light \${mine === 'light' ? 'active' : ''}" onclick="signal('\${p.id}','light')">Light \${lightCount}</button>
      <button class="pc-signal shade \${mine === 'shade' ? 'active' : ''}" onclick="signal('\${p.id}','shade')">Shade \${shadeCount}</button>
    </div>
    <div class="pc-actions">
      <button class="pc-btn pc-btn-ground" onclick="act('\${p.id}','approved')">Let it enter</button>
      <a class="pc-field-link" href="\${fieldHref}">Term</a>
      <button class="pc-btn pc-btn-discard" onclick="act('\${p.id}','discarded')">Pass</button>
    </div>
  \`;
    list.appendChild(card);
  } catch(e) {
    console.error('[garden] card error', i, p && p.term, e.message);
    const err = document.createElement('div');
    err.style.cssText = 'color:#ff6622;padding:0.5rem 0;font-family:system-ui;font-size:0.75rem';
    err.textContent = 'proposal error: ' + e.message;
    list.appendChild(err);
  }
}

async function load() {
  const jsEl = document.getElementById('js-loading');
  if (jsEl) jsEl.textContent = 'js running…';
  let data;
  try {
    const res = await fetch('/api/garden/proposals');
    data = await res.json();
  } catch(e) {
    document.getElementById('proposals-list').innerHTML =
      '<div style="color:#c8601a;font-family:system-ui;font-size:0.8rem;padding:1rem 0">failed to load proposals: ' + e.message + '</div>';
    return;
  }
  const { proposals = [], stats = null, timing = null } = data;
  gardenTiming = timing || gardenTiming;
  lastProposals = proposals;
  renderPaceControl();
  renderGarden(proposals);
  renderTending(proposals);
}

function parseProposalEdit(text) {
  const value = String(text || '');
  const section = (value.match(/^Section:\\s*(.+)$/mi) || [])[1] || '';
  const replacement = (value.match(/^Proposed replacement:\\s*\\n([\\s\\S]*?)(?:\\n\\n(?:Notes|Reason|Care action):|$)/mi) || [])[1] || '';
  const notes = (value.match(/^Notes:\\s*\\n([\\s\\S]*?)$/mi) || [])[1] || '';
  return {
    section: section.replace(/^#+\\s*/, '').trim(),
    replacement: replacement.trim(),
    notes: notes.trim(),
  };
}


function baseSeasonHours(p) {
  const kind = String(p.kind || '');
  const order = String(p.order || '').toLowerCase();
  if (order === 'ground' || order === 'root' || kind === 'root' || kind === 'trunk') return 168;
  if (kind === 'clean-pass') return 24;
  if (kind === 'thin-section' || kind === 'alignment') return 48;
  if (kind === 'drift' || kind === 'reciprocity') return 72;
  return 72;
}

function seasoningText(p) {
  if (p.status === 'needs_preparation') return 'held for gardener preparation';
  const base = baseSeasonHours(p);
  const light = Number(p.light_count || 0);
  const shade = Number(p.shade_count || 0);
  if (shade >= 3) return 'held in shade for review';

  const created = new Date(p.proposed_at || p.logged_at || Date.now()).getTime();
  const lightFactor = Math.max(0.5, 1 - Math.min(light, 2) * 0.25);
  const shadeFactor = 1 + Math.min(shade, 4) * 0.5;
  const carefulHours = Math.max(12, base * lightFactor * shadeFactor);
  const adjusted = carefulHours / Math.max(0.001, Number(gardenTiming.pace || 1));
  const remainingMs = created + adjusted * 3600000 - Date.now();
  if (remainingMs <= 0) return 'seasoned, eligible to enter';

  const hours = Math.ceil(remainingMs / 3600000);
  const days = Math.floor(hours / 24);
  const rest = hours % 24;
  if (days > 0) return 'seasoning ' + days + 'd ' + rest + 'h';
  return 'seasoning ' + hours + 'h';
}

function seasoningRemainingMs(p) {
  if (p.status === 'needs_preparation') return Infinity;
  const base = baseSeasonHours(p);
  const light = Number(p.light_count || 0);
  const shade = Number(p.shade_count || 0);
  if (shade >= 3) return Infinity;
  const created = new Date(p.proposed_at || p.logged_at || Date.now()).getTime();
  const lightFactor = Math.max(0.5, 1 - Math.min(light, 2) * 0.25);
  const shadeFactor = 1 + Math.min(shade, 4) * 0.5;
  const carefulHours = Math.max(12, base * lightFactor * shadeFactor);
  const adjusted = carefulHours / Math.max(0.001, Number(gardenTiming.pace || 1));
  return created + adjusted * 3600000 - Date.now();
}

async function signal(id, kind) {
  const card = document.querySelector('.proposal-card[data-id="' + id + '"]');
  if (card) card.style.opacity = '0.65';
  try {
    const res = await fetch('/api/garden/' + kind + '/' + id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voter_id: voterId }),
    });
    if (!res.ok) throw new Error('signal_failed');
    const data = await res.json();
    ls.setItem('gardenSignal:' + id, kind);
    if (card) {
      const light = card.querySelector('.pc-signal.light');
      const shade = card.querySelector('.pc-signal.shade');
      if (light) {
        light.textContent = 'Light ' + data.light_count;
        light.classList.toggle('active', kind === 'light');
      }
      if (shade) {
        shade.textContent = 'Shade ' + data.shade_count;
        shade.classList.toggle('active', kind === 'shade');
      }
      const baseP = {
        kind: card.dataset.kind,
        order: card.dataset.order,
        proposed_at: card.dataset.proposedAt,
        logged_at: card.dataset.loggedAt,
        shade_count: data.shade_count,
      };
      const season = card.querySelector('.pc-season');
      if (season) {
        season.textContent = seasoningText(Object.assign({}, baseP, { light_count: data.light_count }));
      }
      const felt = card.querySelector('.pc-felt');
      if (felt && kind === 'light') {
        const before = seasoningRemainingMs(Object.assign({}, baseP, { light_count: Math.max(0, data.light_count - 1) }));
        const after = seasoningRemainingMs(Object.assign({}, baseP, { light_count: data.light_count }));
        if (isFinite(before) && isFinite(after) && before - after > 60000) {
          felt.textContent = 'your light brought this ' + formatDuration(before - after) + ' closer to ground';
          felt.classList.add('show');
          setTimeout(function () { felt.classList.remove('show'); }, 4200);
        }
      }
      card.style.opacity = '1';
    }
    recordTending(id, { kind: kind, term: card ? card.dataset.term : '', order: card ? card.dataset.order : '' });
    if (card) {
      const rwrap = card.querySelector('.pc-reason');
      if (rwrap) { rwrap.classList.add('show'); const ri = rwrap.querySelector('input'); if (ri) ri.focus(); }
    }
    renderTending(lastProposals);
  } catch {
    if (card) card.style.opacity = '1';
  }
}

async function act(id, status) {
  const card = document.querySelector('.proposal-card[data-id="' + id + '"]');
  const isGround = status === 'approved';
  const actionButton = card ? card.querySelector(isGround ? '.pc-btn-ground' : '.pc-btn-discard') : null;
  if (card) {
    card.style.opacity = isGround ? '0.82' : '0.4';
    if (isGround) card.classList.add('grounding');
  }
  if (actionButton) {
    actionButton.disabled = true;
    actionButton.textContent = isGround ? 'Entering' : 'Passing';
  }

  const ep = status === 'approved' ? '/api/garden/approve/' + id
           : '/api/garden/discard/' + id;
  try {
    let token = sessionStorage.getItem('gardenSecret') || '';
    if (!token) {
      token = prompt('Garden password') || '';
      if (token) sessionStorage.setItem('gardenSecret', token);
    }
    const res = await fetch(ep, {
      method: 'POST',
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    });
    if (!res.ok) {
      if (res.status === 401) sessionStorage.removeItem('gardenSecret');
      throw new Error('garden_action_failed');
    }
    if (isGround) {
      recordTending(id, { kind: 'ground', term: card ? card.dataset.term : '', order: card ? card.dataset.order : '' });
    }
    if (card) {
      if (isGround) {
        const season = card.querySelector('.pc-season');
        if (season) season.textContent = 'approved';
        if (actionButton) {
          actionButton.textContent = 'Entering';
          actionButton.classList.add('settled');
        }
        card.querySelectorAll('button').forEach((button) => { button.disabled = true; });
        card.classList.remove('grounding');
        card.classList.add('grounded');
        if (navigator.vibrate) navigator.vibrate(12);
        setTimeout(() => {
          card.style.display = 'none';
          load();
          loadHealth();
        }, 900);
        return;
      }
      card.className = 'proposal-card ' + status;
      card.style.display = 'none';
    }
    load();
    loadHealth();
  } catch {
    if (card) {
      card.style.opacity = '1';
      card.classList.remove('grounding');
    }
    if (actionButton) {
      actionButton.disabled = false;
      actionButton.textContent = isGround ? 'Let it enter' : 'Pass';
    }
  }
}

function gardenSecret() {
  let token = sessionStorage.getItem('gardenSecret') || '';
  if (!token) {
    token = prompt('Garden password') || '';
    if (token) sessionStorage.setItem('gardenSecret', token);
  }
  return token;
}

function paceLabel(pace) {
  const n = Number(pace || 1);
  const gardenerMs = Math.max(60000, 3600000 / Math.max(0.001, n));
  return 'gardener ' + formatDuration(gardenerMs);
}

function modeLabel(pace) {
  const n = Number(pace || 1);
  const gardenerMs = Math.max(60000, 3600000 / Math.max(0.001, n));
  const cycleMs = Math.max(60000, 3600000 / Math.max(0.001, n));
  const mode = n === 1 ? 'careful' : 'nursery';
  return mode + ' mode · gardener ' + formatDuration(gardenerMs) + ' · steward/cycle ' + formatDuration(cycleMs);
}

function formatDuration(ms) {
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return 'every ' + minutes + ' min';
  const hours = Math.round(minutes / 60);
  return 'every ' + hours + ' hour' + (hours === 1 ? '' : 's');
}

function renderPaceControl() {
  const status = document.getElementById('pace-status');
  if (status) status.textContent = paceLabel(gardenTiming.pace || 1);
  const mode = document.getElementById('garden-mode');
  if (mode) mode.textContent = modeLabel(gardenTiming.pace || 1);
  const custom = document.getElementById('pace-custom');
  if (custom) custom.value = String(Math.max(1, Math.round(60 / Math.max(0.001, Number(gardenTiming.pace || 1)))));
  document.querySelectorAll('.pace-btn[data-pace]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.pace) === Number(gardenTiming.pace || 1));
  });
}

function refreshSeasoningLabels() {
  document.querySelectorAll('.proposal-card').forEach(card => {
    const season = card.querySelector('.pc-season');
    if (!season) return;
    const light = card.querySelector('.pc-signal.light');
    const shade = card.querySelector('.pc-signal.shade');
    season.textContent = seasoningText({
      kind: card.dataset.kind,
      order: card.dataset.order,
      proposed_at: card.dataset.proposedAt,
      logged_at: card.dataset.loggedAt,
      light_count: light ? Number((light.textContent.match(/\\d+/) || ['0'])[0]) : 0,
      shade_count: shade ? Number((shade.textContent.match(/\\d+/) || ['0'])[0]) : 0,
    });
  });
}

async function setGardenPace(pace) {
  pace = Number(pace);
  if (!Number.isFinite(pace) || pace <= 0 || pace > 1000) return;
  const status = document.getElementById('pace-status');
  if (status) status.textContent = 'setting pace';
  try {
    const token = gardenSecret();
    const res = await fetch('/api/garden/pace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
      body: JSON.stringify({ pace }),
    });
    if (!res.ok) {
      if (res.status === 401) sessionStorage.removeItem('gardenSecret');
      throw new Error('pace_failed');
    }
    const data = await res.json();
    gardenTiming = data.timing || gardenTiming;
    renderPaceControl();
    refreshSeasoningLabels();
  } catch {
    if (status) status.textContent = 'pace change failed';
  }
}

function setGardenMinutesFromInput() {
  const input = document.getElementById('pace-custom');
  const minutes = Number(input ? input.value : 60);
  if (!Number.isFinite(minutes) || minutes <= 0) return;
  setGardenPace(60 / minutes);
}

function escape(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function timeAgo(d) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}

function shortDuration(ms) {
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  if (minutes < 60) return minutes + 'm';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) return hours + 'h' + (rest ? ' ' + rest + 'm' : '');
  const days = Math.floor(hours / 24);
  const hr = hours % 24;
  return days + 'd' + (hr ? ' ' + hr + 'h' : '');
}

function renderGardenStatusStrip(counts = {}, workers = []) {
  const el = document.getElementById('garden-status-strip');
  if (!el) return;
  const applier = workers.find(w => w.name === 'applier');
  const nextCycle = applier?.status?.nextMs ? Math.max(0, Number(applier.status.nextMs) - Date.now()) : null;
  const parts = [
    '<span class="warm">' + Number(counts.pending || 0) + ' ungrounded</span>',
    '<span>' + Number(counts.approved || 0) + ' grounded</span>',
    Number(counts.needs_preparation || 0) ? '<span class="held">' + Number(counts.needs_preparation || 0) + ' held</span>' : '',
    Number(counts.applied || 0) ? '<span>' + Number(counts.applied || 0) + ' applied</span>' : '',
    nextCycle !== null ? '<span class="cool">cycle in ' + shortDuration(nextCycle) + '</span>' : '',
  ].filter(Boolean);
  el.innerHTML = parts.join('');
}

function healthDetail(w, now) {
  const status = w.status || {};
  if (status.state === 'error') return 'error: ' + (status.error || 'unknown');
  if (status.state === 'skip') return 'waiting ' + formatDuration(Math.max(60000, Number(status.nextMs || now) - now));
  if (status.state === 'ok' && status.result === 'skipped') return 'no work: ' + (status.reason || 'nothing ready');
  if (status.state === 'ok') {
    const pieces = ['ran'];
    if (status.entry) pieces.push(status.entry);
    if (status.proposalId) pieces.push(status.proposalId);
    if (Number.isFinite(Number(status.applied))) pieces.push(status.applied + ' applied');
    if (Number.isFinite(Number(status.inspected))) pieces.push(status.inspected + ' inspected');
    return pieces.join(' · ');
  }
  if (status.state === 'wake') return 'awake';
  return 'watching';
}

async function loadHealth() {
  try {
    const res = await fetch('/api/garden/health');
    const { workers = [], counts = {}, note = '', timing = null, pace = null } = await res.json();
    if (timing) gardenTiming = timing;
    else if (pace) gardenTiming = { ...(gardenTiming || {}), pace };
    renderPaceControl();
    const now = Date.now();

    const rowsEl = document.getElementById('health-rows');
    const countsEl = document.getElementById('health-counts');
    const summaryEl = document.getElementById('health-summary-line');
    const noteEl = document.getElementById('garden-note');
    if (!rowsEl) return;
    if (noteEl) noteEl.textContent = note || '';
    renderGardenStatusStrip(counts, workers);

    let worstStatus = 'ok';
    let worstName = '';

    rowsEl.innerHTML = workers.map(w => {
      const heartbeat = w.last_wake || w.last_run;
      const age = heartbeat ? now - heartbeat : Infinity;
      const ratio = age / (w.interval_ms || 1);
      const dotClass = !heartbeat || ratio > 5 ? 'stale' : ratio > 1.5 ? 'idle' : 'ok';
      if (dotClass === 'stale' && worstStatus !== 'stale') { worstStatus = 'stale'; worstName = w.name; }
      else if (dotClass === 'idle' && worstStatus === 'ok') { worstStatus = 'idle'; worstName = w.name; }
      const timeStr = heartbeat ? timeAgo(new Date(heartbeat)) : 'never';
      const runStr = w.last_run ? 'run ' + timeAgo(new Date(w.last_run)) : 'no run';
      const state = w.status && w.status.state ? w.status.state : '';
      const detail = healthDetail(w, now);
      return '<div class="health-row">' +
        '<span class="health-name">' + w.name + '</span>' +
        '<span class="health-time">' + timeStr + '</span>' +
        '<span class="health-time">' + runStr + (state ? ' · ' + state : '') + '</span>' +
        '<span class="health-detail">' + escape(detail) + '</span>' +
        '<span class="health-dot ' + dotClass + '"></span>' +
        '</div>';
    }).join('');

    const statusColor = worstStatus === 'stale' ? 'rgba(200,80,60,0.75)' : worstStatus === 'idle' ? 'rgba(200,160,60,0.75)' : 'rgba(100,195,100,0.75)';
    const statusText = worstStatus === 'ok' ? ' — all running' : ' — ' + worstName + ' ' + worstStatus;
    if (summaryEl) { summaryEl.textContent = statusText; summaryEl.style.color = statusColor; }

    const statusLabels = { pending: 'ungrounded', needs_preparation: 'needs prep', approved: 'grounded for cycle' };
    const parts = Object.entries(statusLabels)
      .map(([k, label]) => counts[k] ? counts[k] + ' ' + label : null)
      .filter(Boolean);
    if (countsEl) countsEl.textContent = parts.join('  ·  ') || 'no active proposals';
  } catch { /* health panel is informational only */ }
}

load();
loadHealth();
</script>
</body>
</html>`;
}

// ── Field page ────────────────────────────────────────────────────────────────

function fieldPage() {
  const sample = {
    focus: "relation",
    operations: {
      ground: {
        id: "ground",
        title: "Ground",
        order: "ground",
        behaviour: "quiet source condition",
        holds: ["seed"],
        traces: [],
        carries: ["seed", "relation"],
        pairs: [],
        nests: [],
      },
      seed: {
        id: "seed",
        title: "Seed",
        order: "ground",
        behaviour: "source held before derivation",
        holds: ["relation"],
        traces: ["ground"],
        carries: ["relation"],
        pairs: [],
        nests: [],
      },
      relation: {
        id: "relation",
        title: "Relation",
        order: "first",
        behaviour: "separation-with-contact continuously opening",
        holds: ["ground", "seed"],
        traces: ["seed", "ground"],
        carries: ["trace", "carry", "clearance"],
        pairs: ["resolution"],
        nests: ["field"],
      },
      trace: {
        id: "trace",
        title: "Trace",
        order: "first",
        behaviour: "active return to what carries",
        holds: ["relation"],
        traces: ["relation", "seed"],
        carries: ["bearing", "resolution"],
        pairs: ["carry"],
        nests: ["field"],
      },
      carry: {
        id: "carry",
        title: "Carry",
        order: "first",
        behaviour: "continuation without losing source",
        holds: ["relation"],
        traces: ["trace", "relation"],
        carries: ["bearing", "fabric"],
        pairs: ["trace"],
        nests: ["field"],
      },
      clearance: {
        id: "clearance",
        title: "Clearance",
        order: "second",
        behaviour: "space opens without collapse",
        holds: ["relation"],
        traces: ["relation"],
        carries: ["resolution"],
        pairs: ["bearing"],
        nests: ["field"],
      },
      bearing: {
        id: "bearing",
        title: "Bearing",
        order: "second",
        behaviour: "strain held without collapse",
        holds: ["carry", "trace"],
        traces: ["carry", "relation"],
        carries: ["resolution"],
        pairs: ["clearance"],
        nests: ["field"],
      },
      resolution: {
        id: "resolution",
        title: "Resolution",
        order: "second",
        behaviour: "settling into readable distinction",
        holds: ["bearing", "trace"],
        traces: ["trace", "relation"],
        carries: ["fabric"],
        pairs: ["relation"],
        nests: ["field"],
      },
      fabric: {
        id: "fabric",
        title: "Fabric",
        order: "third",
        behaviour: "return and reseeding after settlement",
        holds: ["resolution"],
        traces: ["carry", "resolution"],
        carries: ["seed"],
        pairs: [],
        nests: ["field"],
      },
      availability: {
        id: "availability",
        title: "Availability",
        order: "first",
        behaviour: "opening where participation can vary without collapse",
        holds: ["relation", "clearance"],
        traces: ["place", "read"],
        carries: ["adaptation", "capacity"],
        pairs: ["boundary"],
        nests: ["field"],
      },
      boundary: {
        id: "boundary",
        title: "Boundary",
        order: "first",
        behaviour: "limit that keeps contact from collapsing into loss",
        holds: ["relation", "place"],
        traces: ["ground"],
        carries: ["constraint", "bearing"],
        pairs: ["availability"],
        nests: ["field"],
      },
      flow: {
        id: "flow",
        title: "Flow",
        order: "second",
        behaviour: "carrying in continuous motion through a medium",
        holds: ["carry"],
        traces: ["current"],
        carries: ["velocity", "throughput"],
        pairs: ["resistance"],
        nests: ["field"],
      },
      pressure: {
        id: "pressure",
        title: "Pressure",
        order: "second",
        behaviour: "load pressing on carrying capacity",
        holds: ["strain", "load"],
        traces: ["carry"],
        carries: ["overload", "bearing"],
        pairs: ["capacity"],
        nests: ["field"],
      },
      capacity: {
        id: "capacity",
        title: "Capacity",
        order: "second",
        behaviour: "how much can be carried without collapse",
        holds: ["carry", "bearing"],
        traces: ["intake"],
        carries: ["throughput", "balance"],
        pairs: ["pressure"],
        nests: ["field"],
      },
      resistance: {
        id: "resistance",
        title: "Resistance",
        order: "second",
        behaviour: "drag against motion that reveals carrying conditions",
        holds: ["boundary"],
        traces: ["flow"],
        carries: ["drag", "regulation"],
        pairs: ["flow"],
        nests: ["field"],
      },
      heat: {
        id: "heat",
        title: "Heat",
        order: "second",
        behaviour: "active carrying made felt as energetic condition",
        holds: ["energy"],
        traces: ["carry"],
        carries: ["live", "wear"],
        pairs: ["regulation"],
        nests: ["field"],
      },
      field: {
        id: "field",
        title: "Field",
        order: "operation",
        behaviour: "local operations behaving together",
        holds: ["relation"],
        traces: ["ground"],
        carries: ["fabric"],
        pairs: [],
        nests: [],
      },
    },
    proposals: [
      { id: "proposal-alignment", title: "alignment path", from: "trace", to: "resolution" },
      { id: "proposal-clearance", title: "possible clearance", from: "relation", to: "clearance" },
    ],
  };

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
    body { margin: 0; width: 100%; max-width: 100vw; height: 100%; overflow: hidden; overflow-x: hidden; background: #06080d; color: #d4c5a9; }
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
    #entry {
      position: fixed; left: 50%; bottom: 1.4rem; transform: translateX(-50%);
      z-index: 6; display: flex; gap: 0.65rem; align-items: center;
      width: min(32rem, calc(100vw - 2rem)); pointer-events: auto;
    }
    #field-read {
      position: fixed; left: 1.55rem; top: 5.4rem; z-index: 5;
      width: min(26rem, calc(100vw - 2rem));
      pointer-events: auto; opacity: 0; transform: translateY(-4px);
      transition: opacity 0.42s ease, transform 0.42s ease;
    }
    #field-read.ready { opacity: 0.74; transform: translateY(0); }
    #fr-title {
      font: 500 clamp(1.45rem, 3vw, 2rem)/1.05 "Iowan Old Style", Charter, Georgia, serif;
      color: rgba(212,197,169,0.9); margin-bottom: 0.34rem;
    }
    #fr-order {
      font: 700 0.58rem/1 system-ui, sans-serif; letter-spacing: 0.16em;
      text-transform: uppercase; color: rgba(200,96,26,0.56); margin-bottom: 0.75rem;
    }
    #fr-composition {
      display: grid; gap: 0.42rem; margin-bottom: 0.75rem;
    }
    .fr-row {
      display: grid; grid-template-columns: 6.8rem 1fr 2.6rem; gap: 0.6rem; align-items: center;
      font: 700 0.62rem/1 system-ui, sans-serif; letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(120,145,175,0.62);
    }
    .fr-bar { height: 3px; background: rgba(255,255,255,0.032); overflow: hidden; }
    .fr-fill { display: block; height: 100%; background: rgba(200,96,26,0.58); }
    #fr-enabled { display: grid; gap: 0.42rem; margin-bottom: 0.75rem; }
    .fr-kindled-label {
      font: 700 0.58rem/1 system-ui, sans-serif; letter-spacing: 0.16em;
      text-transform: uppercase; color: rgba(77,94,114,0.9); margin-bottom: 0.18rem;
    }
    #fr-care {
      font: 700 0.58rem/1.5 system-ui, sans-serif; letter-spacing: 0.12em;
      text-transform: uppercase; color: rgba(77,94,114,0.9);
    }
    #fr-care span { color: rgba(146,166,190,0.78); }
    #fr-composition:empty, #fr-enabled:empty, #fr-care:empty { display: none; margin: 0; }
    #field-input {
      flex: 1; min-width: 0; border: 0; border-bottom: 1px solid rgba(255,255,255,0.08);
      background: rgba(6,8,13,0.38); color: rgba(212,197,169,0.82);
      outline: none; padding: 0.7rem 0.2rem 0.55rem;
      font: 500 1rem/1.2 "Iowan Old Style", Charter, Georgia, serif;
      text-align: center; border-radius: 0;
    }
    #field-input::placeholder { color: rgba(58,80,112,0.7); }
    #panel {
      position: fixed; top: 0; right: 0; bottom: 0; width: min(25rem, 86vw);
      transform: translateX(101%); transition: transform 0.34s cubic-bezier(.32,.72,0,1);
      z-index: 7; background: rgba(6,8,13,0.86); border-left: 1px solid rgba(255,255,255,0.055);
      backdrop-filter: blur(18px); padding: 5rem 1.45rem 2rem; overflow-y: auto;
    }
    #panel.open { transform: translateX(0); }
    #close-panel {
      position: absolute; top: 1rem; right: 1rem; border: 0; background: none;
      color: rgba(77,94,114,0.9); cursor: pointer; font-size: 1.4rem; line-height: 1;
    }
    #read-order {
      font: 700 0.62rem/1 system-ui, sans-serif; letter-spacing: 0.15em; text-transform: uppercase;
      color: rgba(200,96,26,0.52); margin-bottom: 0.7rem;
    }
    #read-title {
      font: 500 clamp(1.65rem, 4vw, 2.35rem)/1.05 "Iowan Old Style", Charter, Georgia, serif;
      color: rgba(212,197,169,0.94); margin-bottom: 0.75rem;
    }
    #read-behaviour {
      font: 500 1rem/1.58 "Iowan Old Style", Charter, Georgia, serif;
      color: rgba(146,166,190,0.74); margin: 0 0 1.6rem;
    }
    .read-group { margin-top: 1.25rem; }
    .read-group h3 {
      margin: 0 0 0.45rem; font: 700 0.58rem/1 system-ui, sans-serif;
      letter-spacing: 0.14em; text-transform: uppercase; color: rgba(58,80,112,0.85);
    }
    .read-chip {
      display: inline-block; margin: 0.18rem 0.35rem 0.18rem 0; padding: 0.28rem 0.46rem;
      border: 1px solid rgba(255,255,255,0.055); color: rgba(212,197,169,0.58);
      background: rgba(255,255,255,0.018); font: 600 0.72rem/1 system-ui, sans-serif;
      letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
    }
    .temper-row {
      display: grid; grid-template-columns: 7rem 1fr 2.2rem; gap: 0.55rem; align-items: center;
      margin: 0.42rem 0; color: rgba(120,145,175,0.74);
      font: 700 0.58rem/1 system-ui, sans-serif; letter-spacing: 0.12em; text-transform: uppercase;
    }
    .temper-bar { height: 3px; background: rgba(255,255,255,0.045); overflow: hidden; }
    .temper-fill { display: block; height: 100%; background: rgba(200,96,26,0.62); }
    .reason-list {
      margin: 0.45rem 0 0; padding: 0; list-style: none;
      color: rgba(77,94,114,0.9); font: 600 0.68rem/1.45 system-ui, sans-serif;
    }
    .reason-list li { margin: 0.18rem 0; }
    #colour-toggle {
      position: fixed; right: 1.6rem; bottom: 1.6rem; z-index: 6;
      border: 0; background: none; padding: 0; cursor: pointer;
      font: 600 0.66rem/1.5 system-ui, sans-serif; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(58,80,112,0.62); transition: color 0.3s;
    }
    #colour-toggle:hover { color: rgba(120,145,175,0.85); }
    #scale-toggle {
      position: fixed; left: 50%; transform: translateX(-50%); bottom: 1.6rem; z-index: 6;
      border: 0; background: none; padding: 0; cursor: pointer;
      font: 600 0.66rem/1.5 system-ui, sans-serif; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(58,80,112,0.62); transition: color 0.3s;
    }
    #scale-toggle:hover { color: rgba(120,145,175,0.85); }
    @media (max-width: 700px) {
      #top { inset: 1rem 1rem auto 1rem; }
      #entry { bottom: 1rem; }
      #panel { width: 100vw; }
      #colour-toggle { right: 1rem; bottom: 1rem; }
      #scale-toggle { bottom: 2.7rem; }
    }
  </style>
</head>
<body>
<canvas id="field"></canvas>
<div id="top">
  <a href="/atlas">Atlas</a>
  <div id="mode">Field</div>
  <a href="/garden">Garden</a>
</div>
<section id="field-read" aria-live="polite">
  <div id="fr-title"></div>
  <div id="fr-order"></div>
  <div id="fr-composition"></div>
  <div id="fr-enabled"></div>
  <div id="fr-care"></div>
</section>
<aside id="panel" aria-live="polite">
  <button id="close-panel" aria-label="Close">×</button>
  <div id="read-order"></div>
  <div id="read-title"></div>
  <p id="read-behaviour"></p>
  <div id="read-data"></div>
</aside>
<button id="scale-toggle" aria-label="Whole or term">◯</button>
<button id="colour-toggle" aria-label="Colour mode">◐</button>
<script>
let allOps = {};      // full Atlas index: id -> entry (holds/traces/carries/pairs/nests as id arrays)
let liveProposals = []; // non-discarded garden proposals for garden pressure
let gardenMemory = {};  // applied/terminal tending sediment: id -> compact memory
const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d', { alpha: false });
const input = document.getElementById('field-input');
const panel = document.getElementById('panel');
const closePanel = document.getElementById('close-panel');
const modeEl = document.getElementById('mode');
const fieldReadEl = document.getElementById('field-read');
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

const relationTypes = [
  { key: 'holds', color: [94, 112, 126], strength: 0.56, direction: 'anchor' },
  { key: 'traces', color: [94, 132, 170], strength: 0.72, direction: 'return' },
  { key: 'carries', color: [200, 96, 26], strength: 0.78, direction: 'outward' },
  { key: 'pairs', color: [165, 126, 76], strength: 0.48, direction: 'lateral' },
  { key: 'nests', color: [84, 105, 93], strength: 0.42, direction: 'enclose' },
];

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
  { key: 'garden', title: 'Garden', x: 0.66, y: -0.58, color: [132, 84, 62] },
];

const compositionFamilies = [
  { key: 'anchor', title: 'Core', basins: ['hold', 'place', 'nest'], color: 'rgba(120,145,175,0.78)' },
  { key: 'motion', title: 'Flicker', basins: ['trace', 'carry', 'gateway'], color: 'rgba(200,96,26,0.72)' },
  { key: 'settlement', title: 'Glow', basins: ['read', 'terminal'], color: 'rgba(154,142,118,0.72)' },
  { key: 'strain', title: 'Char', basins: ['bearing', 'garden'], color: 'rgba(132,84,62,0.7)' },
];

const engineConstants = [
  { key: 'gravity', title: 'Gravity', terms: ['Ground', 'Hold', 'Bearing Source'] },
  { key: 'return', title: 'Return', terms: ['Trace', 'Return', 'Retrace Read'] },
  { key: 'velocity', title: 'Velocity', terms: ['Carry', 'Flow', 'Current', 'Velocity'] },
  { key: 'friction', title: 'Friction', terms: ['Resistance', 'Drag', 'Boundary'] },
  { key: 'pressure', title: 'Pressure', terms: ['Strain', 'Pressure', 'Load', 'Overload'] },
  { key: 'capacity', title: 'Capacity', terms: ['Capacity', 'Throughput', 'Intake'] },
  { key: 'damping', title: 'Damping', terms: ['Resolution', 'Balance', 'Regulation'] },
  { key: 'opening', title: 'Opening', terms: ['Availability', 'Clearance', 'Space'] },
  { key: 'collision', title: 'Collision', terms: ['Boundary', 'Constraint', 'Terminal'] },
  { key: 'heat', title: 'Heat', terms: ['Heat', 'Energy', 'Live'] },
  { key: 'decay', title: 'Decay', terms: ['Wear', 'Decay', 'Source Drift'] },
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

function countGardenPressure(id) {
  return liveProposals.filter((p) => p.from === id || p.to === id || p.proposal_for === id).length;
}

function memoryFor(id) {
  return gardenMemory[id] || null;
}

function memoryWeight(id) {
  const memory = memoryFor(id);
  if (!memory) return 0;
  const ratios = memory.ratios || {};
  const lastAt = memory.lastAt || memory.at || "";
  const ageDays = lastAt ? Math.max(0, (Date.now() - new Date(lastAt).getTime()) / 86400000) : 0;
  const decay = Math.exp(-ageDays / 30);
  const recognition = Number(ratios.recognition || 0);
  const stability = Number(ratios.stability || 0);
  const resolution = Number(ratios.resolution || 0);
  const former = Math.min(1, Number(memory.visits || 0) / 4);
  return clamp01((recognition * 0.46 + stability * 0.26 + resolution * 0.18 + former * 0.1) * decay);
}

function profileReasons(op, incoming, gardenPressure, gardenMemoryWeight, biasName) {
  const memory = memoryFor(op.id);
  const ratios = memory?.ratios || {};
  return [
    'order bias: ' + biasName,
    op.holds.length + ' holds / ' + incoming.holds + ' incoming holds',
    op.traces.length + ' traces / ' + incoming.traces + ' incoming traces',
    op.carries.length + ' carries / ' + incoming.carries + ' incoming carries',
    op.pairs.length + ' pairs',
    op.nests.length + ' nests',
    gardenPressure + ' garden proposal paths',
    Math.round(gardenMemoryWeight * 100) + '% recognition field',
    Math.round(Number(ratios.resolution || 0) * 100) + '% resolution ratio',
    Math.round(Number(ratios.return || 0) * 100) + '% return ratio',
  ];
}

function hasWord(op, words) {
  const value = (op.id + ' ' + op.title + ' ' + op.behaviour).toLowerCase();
  return words.some((word) => value.includes(word));
}

function orderBasinBias(order) {
  const value = String(order || 'operation').toLowerCase();
  if (value === 'ground' || value === 'root') return { hold: 0.32, trace: 0.08, place: 0.08 };
  if (value === 'first') return { trace: 0.18, carry: 0.18, hold: 0.08, place: 0.08, read: 0.06 };
  if (value === 'second') return { bearing: 0.18, gateway: 0.1, terminal: 0.14, carry: 0.08 };
  if (value === 'third') return { nest: 0.18, carry: 0.12, read: 0.08, gateway: 0.08 };
  if (value === 'practice') return { garden: 0.18, read: 0.14, gateway: 0.1 };
  if (value === 'higher') return { terminal: 0.12, read: 0.12, gateway: 0.1 };
  return { nest: 0.08, gateway: 0.08 };
}

function computeBasins(op, profile, incoming, gardenPressure) {
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
    garden: gardenPressure * 0.28 + profile.gardenMemory * 0.24 + profile.turbulence * 0.18 + (bias.garden || 0),
  };

  if (hasWord(op, ['ground', 'seed'])) raw.hold += 0.26;
  if (hasWord(op, ['trace', 'return', 'retrac'])) raw.trace += 0.28;
  if (hasWord(op, ['carry', 'continuation', 'fabric'])) raw.carry += 0.28;
  if (hasWord(op, ['place', 'situat'])) raw.place += 0.24;
  if (hasWord(op, ['read', 'recognis', 'resolution'])) raw.read += 0.2;
  if (hasWord(op, ['availability', 'clearance', 'open', 'passage'])) raw.gateway += 0.28;
  if (hasWord(op, ['bearing', 'strain', 'boundary', 'asymmetry', 'bounded'])) raw.bearing += 0.3;
  if (hasWord(op, ['resolution', 'terminal', 'settling', 'completion'])) raw.terminal += 0.26;
  if (hasWord(op, ['nest', 'field', 'domain'])) raw.nest += 0.22;
  if (hasWord(op, ['garden', 'care', 'proposal'])) raw.garden += 0.2;

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

function orderLabel(order) {
  const value = String(order || 'operation').toLowerCase();
  if (value === 'ground' || value === 'root') return 'Ground / Root';
  if (value === 'first') return 'First Order';
  if (value === 'second') return 'Second Order';
  if (value === 'third') return 'Third Order';
  if (value === 'practice') return 'Practice';
  if (value === 'higher') return 'Higher Order';
  return 'Operation';
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

function enabledBy(profile) {
  return (profile?.basins?.dominant || [])
    .slice(0, 3)
    .map((item) => basinTitle(item.key));
}

function careSignal(profile) {
  if (profile.misfit) return 'misfit';
  if (profile.turbulence > 0.55) return 'turbulent';
  if (profile.wither > 0.42) return 'withering';
  if ((profile.gardenRatios?.recognition || 0) > 0.62 && profile.gardenPressure === 0) return 'recognized';
  if (profile.gardenMemory > 0.36) return 'carried former';
  if (profile.maturity > 0.58 && profile.resolution > 0.48) return 'mature';
  if (profile.gardenPressure > 0) return 'under care';
  if (profile.airflow > 0.48 && profile.continuation > 0.45) return 'opening';
  return 'stable';
}

function enginePhysics(profile) {
  const weights = profile?.basins?.weights || {};
  const values = {
    gravity: clamp01(profile.gravity * 0.7 + (weights.hold || 0) * 0.3),
    return: clamp01(profile.return * 0.68 + (weights.trace || 0) * 0.32),
    velocity: clamp01(profile.continuation * 0.46 + profile.airflow * 0.24 + (weights.carry || 0) * 0.2 + (weights.gateway || 0) * 0.1),
    friction: clamp01((weights.bearing || 0) * 0.28 + (weights.hold || 0) * 0.22 + profile.wither * 0.2 + profile.ash * 0.2 + profile.turbulence * 0.1),
    pressure: clamp01(profile.turbulence * 0.34 + profile.density * 0.24 + (weights.bearing || 0) * 0.28 + (weights.garden || 0) * 0.14),
    capacity: clamp01(profile.density * 0.34 + profile.continuation * 0.24 + profile.resolution * 0.18 + (weights.carry || 0) * 0.14 + (weights.hold || 0) * 0.1),
    damping: clamp01(profile.resolution * 0.58 + (weights.terminal || 0) * 0.22 + profile.maturity * 0.12 + (weights.read || 0) * 0.08),
    opening: clamp01(profile.airflow * 0.5 + (weights.gateway || 0) * 0.34 + (weights.place || 0) * 0.16),
    collision: clamp01((weights.bearing || 0) * 0.3 + (weights.terminal || 0) * 0.28 + (weights.hold || 0) * 0.22 + profile.gravity * 0.2),
    heat: clamp01(profile.heat * 0.72 + (weights.garden || 0) * 0.1 + (weights.carry || 0) * 0.12 + profile.turbulence * 0.06),
    decay: clamp01(profile.wither * 0.45 + profile.ash * 0.32 + profile.turbulence * 0.16 - profile.resolution * 0.12),
  };
  const dominant = Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key, value]) => ({ key, value }));
  return { values, dominant };
}

function computeProfile(op) {
  const biasName = String(op.order || 'operation').toLowerCase();
  const bias = orderBias[biasName] || orderBias.operation;
  const incoming = {
    holds: countIncoming(op.id, 'holds'),
    traces: countIncoming(op.id, 'traces'),
    carries: countIncoming(op.id, 'carries'),
    pairs: countIncoming(op.id, 'pairs'),
    nests: countIncoming(op.id, 'nests'),
  };
  const gardenPressure = countGardenPressure(op.id);
  const gardenMemoryRecord = memoryFor(op.id);
  const gardenRatios = gardenMemoryRecord?.ratios || {};
  const gardenMemoryWeight = memoryWeight(op.id);
  const gardenPressureRatio = clamp01(gardenPressure * 0.22 + Number(gardenRatios.pressure || 0) * 0.36);
  const recognitionRatio = Number(gardenRatios.recognition || 0);
  const resolutionRatio = Number(gardenRatios.resolution || 0);
  const stabilityRatio = Number(gardenRatios.stability || 0);
  const relationDensity = op.holds.length + op.traces.length + op.carries.length + op.pairs.length + op.nests.length +
    incoming.holds + incoming.traces + incoming.carries + incoming.pairs + incoming.nests;
  const gravity = clamp01(0.16 + bias.gravity + op.holds.length * 0.08 + incoming.holds * 0.1 + incoming.traces * 0.04 + stabilityRatio * 0.1);
  const returnForce = clamp01(0.08 + bias.return + op.traces.length * 0.16 + incoming.traces * 0.08 + recognitionRatio * 0.11);
  const continuation = clamp01(0.1 + bias.continuation + op.carries.length * 0.14 + incoming.carries * 0.06 + gardenMemoryWeight * 0.03);
  const resonance = clamp01(0.06 + bias.resonance + op.pairs.length * 0.18 + incoming.pairs * 0.08);
  const enclosure = clamp01(0.04 + bias.enclosure + op.nests.length * 0.18 + incoming.nests * 0.1);
  const turbulence = clamp01(0.1 + bias.turbulence + gardenPressureRatio * 0.28 + Math.max(0, relationDensity - 7) * 0.035 - gravity * 0.16 - enclosure * 0.08 - gardenMemoryWeight * 0.08);
  const resolution = clamp01(0.18 + bias.resolution + gravity * 0.24 + returnForce * 0.14 + enclosure * 0.08 + resolutionRatio * 0.14 + gardenMemoryWeight * 0.08 - turbulence * 0.3);
  const density = clamp01(0.12 + relationDensity * 0.07 + gravity * 0.28 + returnForce * 0.12 + stabilityRatio * 0.1);
  const maturity = clamp01(0.08 + bias.maturity + density * 0.38 + resolution * 0.24 + gardenMemoryWeight * 0.24 - turbulence * 0.18);
  const airflow = clamp01(0.18 + bias.airflow + continuation * 0.22 + resonance * 0.12 - enclosure * 0.14);
  const wither = clamp01(0.08 + gravity * 0.22 + incoming.traces * 0.06 - continuation * 0.24 - airflow * 0.18 - gardenPressure * 0.04 - gardenMemoryWeight * 0.12);
  const heat = clamp01(0.2 + continuation * 0.22 + returnForce * 0.18 + resolution * 0.2 + airflow * 0.08 + gardenMemoryWeight * 0.04 - wither * 0.16);
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
    gardenPressure,
    gardenMemory: gardenMemoryWeight,
    gardenRatios,
    gardenMemoryRecord,
    reasons: profileReasons(op, incoming, gardenPressure, gardenMemoryWeight, biasName),
  };
  profile.basins = computeBasins(op, profile, incoming, gardenPressure);
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
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = Math.floor(innerWidth * dpr);
  h = Math.floor(innerHeight * dpr);
  canvas.width = w; canvas.height = h;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

// Returns ids of the focus term and all its direct relations from the full index
function localIdsFromIndex(id) {
  const focus = allOps[id];
  if (!focus) return [id];
  const ids = new Set([focus.id]);
  relationTypes.forEach(({ key }) => (focus[key] || []).forEach((child) => ids.add(child)));
  Object.values(allOps).forEach((op) => {
    relationTypes.forEach(({ key }) => {
      if ((op[key] || []).includes(focus.id)) ids.add(op.id);
    });
  });
  liveProposals.forEach((p) => {
    if (p.from === focus.id || p.to === focus.id) { ids.add(p.from); ids.add(p.to); }
  });
  return [...ids].filter((xId) => allOps[xId]);
}

function initOperations(id) {
  const ids = localIdsFromIndex(id);
  const prev = operations;
  operations = {};
  ids.forEach((childId, i) => {
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
      phase: p?.phase ?? (Math.random() * Math.PI * 2),
      orbitPhase: p?.orbitPhase ?? (Math.random() * Math.PI * 2),
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
  liveProposals.forEach((p) => {
    if (p.from === focus.id || p.to === focus.id) { ids.add(p.from); ids.add(p.to); }
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

function orbitSignature(op, focus, role) {
  const profile = op.profile || computeProfile(op);
  const physics = profile.engine?.values || enginePhysics(profile).values;
  const orderDepth = ORDER_DEPTHS[String(spineDisplayOrder(op) || op.order || 'ground').toLowerCase()] ?? 0.5;
  const focusDepth = ORDER_DEPTHS[String(spineDisplayOrder(focus) || focus.order || 'ground').toLowerCase()] ?? 0.5;
  const direction = role.type.direction === 'return' || role.direction === 'in' ? -1 : 1;
  return {
    direction,
    speed: 0.012 + physics.velocity * 0.028 + physics.opening * 0.018 + physics.pressure * 0.014 - physics.damping * 0.016 - physics.gravity * 0.01 + Math.abs(orderDepth - focusDepth) * 0.012,
    sweep: 0.018 + physics.opening * 0.032 + physics.pressure * 0.03 + physics.velocity * 0.018 - physics.gravity * 0.014 - physics.damping * 0.012,
    radial: 2.5 + physics.capacity * 5 + physics.pressure * 4 + physics.opening * 3 - physics.gravity * 2,
  };
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
    op.orbit = orbitSignature(op, focus, slot.role);
    op.tx = Math.cos(angle) * radius + basin.x * 0.42;
    op.ty = Math.sin(angle) * radius * 0.82 + basin.y * 0.42;
  });
}

let homeMode = true;
let scaleMode = 'carry';   // 'carry' = neighborhood (one term); 'order' = the whole, every term in its band
let orderScreenPos = {};   // term id -> screen position in the order-scale overview (for hit-testing)
let orderLabelIds = [];    // the load-bearing few to label in the overview
let ambientOrderDepth = 0; // 0 = ground, 1 = higher — smoothly interpolated
let ambientPulse = 0;      // 0–1 extra brightness on order crossing, decays quickly
let ambientCurrentOrder = '';

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
try { const m = localStorage.getItem('fieldColourMode'); if (m === 'heat' || m === 'fire') colourMode = m; } catch (e) {}

function drawAmbientHeat() {
  if (ambientPulse < 0.005) return;
  const d = ambientOrderDepth;
  const pulse = ambientPulse * ambientPulse; // ease out
  const cx = innerWidth / 2 + pan.x * scale;
  const cy = innerHeight / 2 + pan.y * scale;
  const radius = Math.min(innerWidth, innerHeight) * (0.55 + d * 0.5 + pulse * 0.3);
  // Colour: builds through cool green toward white — stays out of the amber node palette
  const r = Math.round(60 + d * 170);
  const g = Math.round(110 + d * 140);
  const b = Math.round(70 + d * 160);
  const coreAlpha = pulse * 0.18;
  const midAlpha  = pulse * 0.07;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0,    'rgba(' + r + ',' + g + ',' + b + ',' + coreAlpha + ')');
  grad.addColorStop(0.38, 'rgba(' + r + ',' + g + ',' + b + ',' + midAlpha  + ')');
  grad.addColorStop(1,    'rgba(' + r + ',' + g + ',' + b + ',0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.restore();
}

function enterOperation(id) {
  const found = allOps[id] ? id : Object.values(allOps).find((op) => op.title.toLowerCase() === id.toLowerCase())?.id;
  if (!found) return;
  homeMode = false;
  targetFocusId = found;
  focusId = found;
  syncSpineToFocus(found);
  settled = 0;
  targetPan = { x: 0, y: 0 };
  initOperations(found);
  layout(found);
  modeEl.textContent = allOps[found].title;
  history.replaceState({}, '', '/field#' + encodeURIComponent(found));
  renderFieldRead(found);
  renderPanel(found);
}

function renderFieldRead(id) {
  const op = operations[id];
  if (!op || !fieldReadEl) return;
  // Carry scale stays visual — the embers carry the temperament (colour = order, brightness =
  // burn, size = weight, motion = family). The numbers live in the read scale: the panel that
  // opens on tap. Here we keep only the term's identity.
  document.getElementById('fr-title').textContent = op.title;
  document.getElementById('fr-order').textContent = orderLabel(op.order);
  document.getElementById('fr-composition').innerHTML = '';
  document.getElementById('fr-enabled').innerHTML = '';
  document.getElementById('fr-care').innerHTML = '';
  fieldReadEl.classList.toggle('ready', !homeMode && settled > 0.9);
}

function screen(op) {
  return {
    x: innerWidth / 2 + (op.x + pan.x) * scale,
    y: innerHeight / 2 + (op.y + pan.y) * scale,
  };
}

function drawSmoke() {
  const cx = innerWidth / 2, cy = innerHeight / 2;
  const focus = operations[focusId];
  const focusProfile = focus?.profile || null;
  const family = focusProfile ? familyComposition(focusProfile)[0]?.key : 'anchor';
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(innerWidth, innerHeight) * 0.62);
  grad.addColorStop(0, '#0b1018');
  grad.addColorStop(0.45, '#07090e');
  grad.addColorStop(1, '#05070b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(pan.x, pan.y);
  const drift = family === 'motion' ? 0.14 : family === 'settlement' ? 0.045 : family === 'strain' ? 0.075 : 0.06;
  const compression = family === 'strain' ? 0.56 : family === 'anchor' ? 0.68 : 0.82;
  for (let i = 0; i < 84; i++) {
    const a = i * 0.42 + time * (drift + (i % 7) * 0.004);
    const r = 36 + i * 6.3 + Math.sin(time * 0.35 + i) * 18;
    const x = Math.cos(a) * r * (family === 'motion' ? 1.5 : 1.18);
    const y = Math.sin(a * 0.82) * r * compression;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(58,80,112,' + (0.012 + (i % 5) * 0.003 + (focusProfile?.ash || 0) * 0.01) + ')';
    ctx.arc(x, y, 24 + (i % 9) * 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawOrderSpine() {
  const focus = operations[focusId];
  if (!focus) return;
  const focusOrder = spineDisplayOrder(focus);
  const total = spineFlat.length || 1;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // Order loop
  const { cx, cy, rx, ry } = spineGeometry();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = spineActive ? 'rgba(58,80,112,0.42)' : 'rgba(58,80,112,0.2)';
  ctx.lineWidth = spineActive ? 1.8 : 1;
  ctx.stroke();

  // Return current: Higher folds back through Seed into Ground.
  const seedPos = (spineSequence.seed?.length || 0) ? 0 : null;
  const higherStart = spineFlat.findIndex((id) => spineDisplayOrder(id) === 'higher');
  if (seedPos !== null && higherStart >= 0) {
    const pSeed = spinePointForPos(seedPos);
    const pHigher = spinePointForPos(higherStart);
    const grad = ctx.createLinearGradient(pHigher.x, pHigher.y, pSeed.x, pSeed.y);
    grad.addColorStop(0, 'rgba(58,80,112,0.02)');
    grad.addColorStop(0.62, 'rgba(200,96,26,0.08)');
    grad.addColorStop(1, 'rgba(200,96,26,0.22)');
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx + 3, ry + 3, 0, spineAngleForPos(higherStart), Math.PI * 3);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  // Order bands: each present order owns an equal arc. In fire mode the band glows its
  // flame-colour; a mark sits at every band start.
  const bandCount = spineBands.length || 1;
  spineBands.forEach((band) => {
    const a0 = Math.PI + band.startFrac * Math.PI * 2;
    const a1 = Math.PI + (band.startFrac + 1 / bandCount) * Math.PI * 2;
    const isCurrentOrder = band.order === focusOrder;
    if (colourMode === 'fire') {
      const fr = fireFor(band.order);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, a0 + 0.03, a1 - 0.03);
      ctx.strokeStyle = 'hsla(' + fr.h + ',' + fr.s + '%,' + fr.l + '%,' + (isCurrentOrder ? 0.55 : 0.3) + ')';
      ctx.lineWidth = isCurrentOrder ? 2.6 : 1.6;
      ctx.stroke();
    }
    const p = spinePointAtFrac(band.startFrac);
    ctx.beginPath();
    ctx.arc(p.x, p.y, isCurrentOrder && !spineActive ? 4.4 : 2.4, 0, Math.PI * 2);
    if (colourMode === 'fire') {
      const fr = fireFor(band.order);
      ctx.fillStyle = 'hsla(' + fr.h + ',' + fr.s + '%,' + Math.min(82, fr.l + 12) + '%,' + (isCurrentOrder ? 0.7 : 0.42) + ')';
    } else {
      ctx.fillStyle = isCurrentOrder && !spineActive
        ? 'rgba(200,96,26,0.52)'
        : band.order === 'seed' ? 'rgba(200,96,26,0.34)' : 'rgba(58,80,112,0.24)';
    }
    ctx.fill();
  });

  // Sliding ember dot: current focus at rest, drag/coast position while moving.
  if (spineCurrentIdx >= 0) {
    const p = spinePointForPos(spineFracPos);
    const activeAlpha = spineActive || spineCoasting ? 1 : 0.55;
    ctx.globalCompositeOperation = 'source-over';
    const dotFr = colourMode === 'fire' ? fireFor(focusOrder) : null;
    const dotGlow = dotFr ? 'hsla(' + dotFr.h + ',' + dotFr.s + '%,' + Math.min(80, dotFr.l + 8) + '%,' : 'rgba(200,96,26,';
    const dotCore = dotFr ? 'hsla(' + dotFr.h + ',' + dotFr.s + '%,' + Math.min(84, dotFr.l + 14) + '%,' : 'rgba(220,110,30,';
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
    grd.addColorStop(0, dotGlow + (0.62 * activeAlpha) + ')');
    grd.addColorStop(1, dotGlow + '0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, spineActive || spineCoasting ? 5.2 : 3.6, 0, Math.PI * 2);
    ctx.fillStyle = dotCore + (0.9 * activeAlpha) + ')';
    ctx.fill();

    const currentEntry = allOps[spineFlat[spineCurrentIdx]];
    ctx.globalCompositeOperation = 'lighter';
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
    if (weight < 0.16) return;
    const x = cx + basin.x * basinScale;
    const y = cy + basin.y * basinScale;
    const radius = (120 + weight * 190) * scale;
    const [r,g,b] = basin.color;
    const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.018 + weight * 0.045) + ')');
    grad.addColorStop(0.48, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.006 + weight * 0.018) + ')');
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
  const recognition = clamp01(Number(source.gardenRatios?.recognition || 0) * 0.35 + Number(target.gardenRatios?.recognition || 0) * 0.35);
  return {
    t: clamp01(0.22 + handoff * 0.56),
    strength: clamp01(0.35 + capacity * 0.34 + recognition * 0.18 + type.strength * 0.16 - pressure * 0.08),
    pressure,
  };
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
  const wiggle = 8 + source.turbulence * 18 + physics.opening * 18 + physics.pressure * 14 - physics.damping * 7;
  const split = 0.18 + (strand % 5) * 0.13;
  const alpha = (0.025 + type.strength * 0.045 + source.heat * 0.035) * emphasis;
  const sourceOrder = spineDisplayOrder(source);
  const targetOrder = spineDisplayOrder(target);
  ctx.beginPath();
  for (let s = 0; s <= 18; s++) {
    const t = s / 18;
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
  ctx.lineWidth = Math.max(0.35, (0.32 + source.density * 0.45) * scale);
  ctx.stroke();

  if (source.turbulence < 0.18 && strand % 3 !== 0) return;
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
  const branchAlpha = (0.014 + source.turbulence * 0.028 + physics.velocity * 0.026 + physics.pressure * 0.012) * emphasis;
  ctx.strokeStyle = colourMode === 'fire'
    ? fireMix(sourceOrder, targetOrder, split, branchAlpha, 10)
    : relationColor(type, branchAlpha);
  ctx.lineWidth = Math.max(0.25, 0.42 * scale);
  ctx.stroke();
}

function drawCurrent(a, b, type, offset = 0, emphasis = 1) {
  const pa = screen(a), pb = screen(b);
  const source = a.profile || computeProfile(a);
  const target = b.profile || computeProfile(b);
  const sourcePhysics = source.engine?.values || enginePhysics(source).values;
  const targetPhysics = target.engine?.values || enginePhysics(target).values;
  const dx = pb.x - pa.x, dy = pb.y - pa.y;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / dist, ny = dx / dist;
  const currentSpeed = 0.54 + sourcePhysics.velocity * 0.9 + sourcePhysics.heat * 0.45 + source.turbulence * 0.24 - targetPhysics.gravity * 0.14 - sourcePhysics.friction * 0.18;
  const pulse = (Math.sin(time * currentSpeed + a.phase + offset) + 1) / 2;
  const bowBase = type.direction === 'return' ? -46 : type.direction === 'lateral' ? Math.sin(time + offset) * 42 : 36;
  const bow = bowBase * (1 + sourcePhysics.pressure * 0.28 + sourcePhysics.opening * 0.18 - targetPhysics.damping * 0.18);
  const cx = (pa.x + pb.x) / 2 + nx * bow;
  const cy = (pa.y + pb.y) / 2 + ny * bow;
  const control = { x: cx, y: cy };
  const family = familyComposition(source)[0]?.key || 'motion';
  const sourceOrder = spineDisplayOrder(a);
  const targetOrder = spineDisplayOrder(b);
  const crossing = sourceOrder !== targetOrder;
  const meeting = relationMeeting(source, target, type);
  const currentAlpha = (0.026 + type.strength * 0.07 + source.heat * 0.045 - source.ash * 0.03) * emphasis;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.quadraticCurveTo(cx, cy, pb.x, pb.y);
  ctx.strokeStyle = colourMode === 'fire'
    ? currentGradient(pa, pb, sourceOrder, targetOrder, currentAlpha, currentAlpha)
    : relationColor(type, currentAlpha);
  ctx.lineWidth = Math.max(0.5, (0.55 + source.density * 0.72 + sourcePhysics.capacity * 0.52 + (family === 'motion' ? 0.34 : 0)) * scale);
  ctx.stroke();

  const strandCount = Math.floor(2 + source.density * 4 + source.continuation * 3 + source.turbulence * 3);
  for (let i = 0; i < strandCount; i++) drawFilament(pa, pb, control, type, source, target, offset, i, emphasis);

  if (colourMode === 'fire' && crossing) {
    const meetT = clamp01(meeting.t + Math.sin(time * (0.32 + sourcePhysics.heat * 0.22 + meeting.pressure * 0.18) + offset) * (0.025 + meeting.pressure * 0.05));
    const meet = bezierPoint(pa, control, pb, meetT);
    const meetRadius = (10 + sourcePhysics.heat * 12 + targetPhysics.heat * 9 + meeting.strength * 16 + meeting.pressure * 8) * scale;
    const meetGlow = ctx.createRadialGradient(meet.x, meet.y, 1, meet.x, meet.y, meetRadius * 2.2);
    meetGlow.addColorStop(0, fireMix(sourceOrder, targetOrder, meetT, (0.08 + meeting.strength * 0.1) * emphasis, 18));
    meetGlow.addColorStop(0.34, fireMix(sourceOrder, targetOrder, meetT, (0.04 + meeting.strength * 0.05) * emphasis, 8));
    meetGlow.addColorStop(1, fireMix(sourceOrder, targetOrder, meetT, 0, 0));
    ctx.fillStyle = meetGlow;
    ctx.beginPath();
    ctx.arc(meet.x, meet.y, meetRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const t = type.direction === 'return' ? 1 - pulse : pulse;
  const qx = (1-t)*(1-t)*pa.x + 2*(1-t)*t*cx + t*t*pb.x;
  const qy = (1-t)*(1-t)*pa.y + 2*(1-t)*t*cy + t*t*pb.y;
  const glow = ctx.createRadialGradient(qx, qy, 1, qx, qy, 14 + (12 + source.heat * 18) * scale);
  if (colourMode === 'fire') {
    glow.addColorStop(0, fireMix(sourceOrder, targetOrder, t, (0.16 + source.heat * 0.2) * emphasis, 16));
    glow.addColorStop(1, fireMix(sourceOrder, targetOrder, t, 0, 0));
  } else {
    glow.addColorStop(0, relationColor(type, (0.16 + source.heat * 0.2) * emphasis));
    glow.addColorStop(1, relationColor(type, 0));
  }
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(qx, qy, 14 + (12 + source.heat * 18) * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawIncomingCurrents(focus) {
  if (!focus) return;
  relationTypes.forEach((type) => {
    let offset = 0;
    Object.values(operations).forEach((op) => {
      if (op.id === focus.id || !(op[type.key] || []).includes(focus.id)) return;
      drawCurrent(op, focus, type, offset + 0.5, 0.34);
      offset += 1;
    });
  });
}

function drawOperation(op, local, isFocus) {
  const p = screen(op);
  const profile = op.profile || computeProfile(op);
  const physics = profile.engine?.values || enginePhysics(profile).values;
  const families = familyComposition(profile);
  const topFamily = families[0]?.key || 'anchor';
  const resolving = Math.min(1, settled / 1.8);
  const baseAlpha = local ? 0.28 : 0.05;
  const motionBoost = topFamily === 'motion' ? 1.18 : 1;
  const anchorBoost = topFamily === 'anchor' ? 1.16 : 1;
  const strainBoost = topFamily === 'strain' ? 1.2 : 1;
  const settleBoost = topFamily === 'settlement' ? 1.14 : 1;
  const pulseRate = (0.26 + physics.heat * 0.72 + physics.velocity * 0.32 + physics.pressure * 0.22 - physics.damping * 0.2) * (topFamily === 'motion' ? 1.18 : topFamily === 'settlement' ? 0.82 : 1);
  const radius = (isFocus ? 34 + physics.gravity * 20 * anchorBoost + physics.capacity * 18 : 13 + profile.density * 10 + physics.capacity * 8) * scale *
    (1 + Math.sin(time * pulseRate + op.phase) * (0.018 + physics.pressure * 0.05 + profile.turbulence * 0.025));
  const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, radius * 2.5);
  const heatAlpha = isFocus ? 0.18 + physics.heat * 0.34 : baseAlpha * (0.5 + physics.heat);
  const ashAlpha = physics.decay * (isFocus ? 0.26 : 0.14);
  const midAlpha = 0.05 + profile.density * 0.08;
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
  grad.addColorStop(0.38, midCol);
  grad.addColorStop(0.68, 'rgba(76,92,112,' + ashAlpha + ')');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  const wrinkleCount = Math.floor(4 + profile.maturity * 12 + profile.density * 8 + physics.pressure * 8 + physics.friction * 6 + (topFamily === 'strain' ? 8 : 0));
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(op.phase * 0.2 + time * (0.018 + profile.airflow * 0.012));
  for (let i = 0; i < wrinkleCount; i++) {
    const a = i * 2.399 + op.phase;
    const inner = radius * (0.35 + (i % 5) * 0.07);
    const outer = radius * (0.72 + (i % 7) * 0.045) * motionBoost;
    const curl = Math.sin(time * (0.16 + physics.velocity * 0.18) + i + op.phase) * radius * (0.04 + physics.pressure * 0.08 + physics.opening * 0.04 + (topFamily === 'strain' ? 0.04 : 0));
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
    ctx.quadraticCurveTo(Math.cos(a + 0.35) * (inner + outer) * 0.5 + curl, Math.sin(a + 0.35) * (inner + outer) * 0.5 - curl, Math.cos(a + 0.7) * outer, Math.sin(a + 0.7) * outer);
    ctx.strokeStyle = 'rgba(212,197,169,' + (0.025 + profile.maturity * 0.055 - profile.ash * 0.018) + ')';
    ctx.lineWidth = Math.max(0.35, scale * (0.35 + profile.density * 0.55));
    ctx.stroke();
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(1.2, radius * 0.08), 0, Math.PI * 2);
  ctx.fillStyle = isFocus ? 'rgba(212,197,169,' + (0.35 + profile.resolution * 0.28) + ')' : 'rgba(120,145,175,' + (0.18 + profile.resolution * 0.18) + ')';
  ctx.fill();

  if (profile.gardenMemory > 0.08) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * (1.24 + profile.gardenMemory * 0.28), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(154,142,118,' + (0.025 + profile.gardenMemory * 0.09) + ')';
    ctx.lineWidth = Math.max(0.6, 1.4 * scale);
    ctx.stroke();
    ctx.restore();
  }

  const labelThreshold = 0.75 + physics.pressure * 0.2 + physics.decay * 0.2 - physics.damping * 0.22 * settleBoost - profile.maturity * 0.12;
  if (homeMode && !isFocus) return;
  const labelAlpha = homeMode ? 0 : Math.max(0, Math.min(1, (scale - labelThreshold) * 1.8)) * resolving * (local ? 1 : 0.25);
  const focusAlpha = isFocus ? resolving * Math.max(0.2, Math.min(1, scale + profile.resolution * 0.2 - profile.turbulence * 0.16)) : 0;
  if (labelAlpha > 0.02 || hoverId === op.id || focusAlpha > 0.02) {
    let focusSize = homeMode ? 42 : 24;
    if (isFocus && homeMode) {
      ctx.font = '500 ' + focusSize + 'px "Iowan Old Style", Charter, Georgia, serif';
      const maxW = innerWidth * 0.88;
      while (focusSize > 18 && ctx.measureText(op.title.toUpperCase()).width > maxW) {
        focusSize -= 2;
        ctx.font = '500 ' + focusSize + 'px "Iowan Old Style", Charter, Georgia, serif';
      }
    }
    ctx.font = (isFocus ? '500 ' + focusSize + 'px ' : '600 12px ') + '"Iowan Old Style", Charter, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isFocus ? 'rgba(212,197,169,' + Math.max(labelAlpha, focusAlpha * 0.7) + ')' : 'rgba(146,166,190,' + Math.max(labelAlpha, hoverId === op.id ? 0.8 : 0) + ')';
    ctx.fillText(isFocus ? op.title.toUpperCase() : op.title, p.x, p.y + radius + (isFocus ? 25 : 18));
  }
}

function drawProposals() {
  liveProposals.forEach((proposal, i) => {
    const from = operations[proposal.from], to = operations[proposal.to];
    if (!from || !to) return;
    const type = { color: [120, 105, 90], strength: 0.3, direction: 'lateral' };
    ctx.setLineDash([2, 10]);
    drawCurrent(from, to, type, i);
    ctx.setLineDash([]);
  });
}

function renderPanel(id) {
  const op = operations[id];
  if (!op) return;
  const profile = op.profile || computeProfile(op);
  document.getElementById('read-order').textContent = op.order || '';
  document.getElementById('read-title').textContent = op.title;
  document.getElementById('read-behaviour').textContent = op.behaviour;
  const data = document.getElementById('read-data');
  const temperament = ['heat', 'gravity', 'return', 'continuation', 'density', 'airflow', 'turbulence', 'resolution', 'maturity', 'wither', 'ash']
    .map((key) => {
      const value = Math.round((profile[key] || 0) * 100);
      return '<div class="temper-row"><span>' + key + '</span><span class="temper-bar"><span class="temper-fill" style="width:' + value + '%"></span></span><span>' + value + '</span></div>';
    }).join('');
  const basins = basinTypes
    .map((basin) => {
      const value = Math.round(((profile.basins?.weights || {})[basin.key] || 0) * 100);
      return '<div class="temper-row"><span>' + basin.title + '</span><span class="temper-bar"><span class="temper-fill" style="width:' + value + '%"></span></span><span>' + value + '</span></div>';
    }).join('');
  const dominant = (profile.basins?.dominant || []).map((item) => basinTitle(item.key)).join(' / ');
  const composition = familyComposition(profile)
    .map((item) => '<div class="temper-row"><span>' + item.title + '</span><span class="temper-bar"><span class="temper-fill" style="width:' + item.percent + '%;background:' + item.color + '"></span></span><span>' + item.percent + '%</span></div>')
    .join('');
  const engineValues = profile.engine?.values || enginePhysics(profile).values;
  const engine = engineConstants
    .map((constant) => {
      const value = Math.round((engineValues[constant.key] || 0) * 100);
      return '<div class="temper-row"><span>' + constant.title + '</span><span class="temper-bar"><span class="temper-fill" style="width:' + value + '%"></span></span><span>' + value + '</span></div>';
    }).join('');
  const engineDominant = (profile.engine?.dominant || [])
    .map((item) => engineConstants.find((constant) => constant.key === item.key))
    .filter(Boolean)
    .slice(0, 3);
  const engineRead = engineDominant.length
    ? '<ul class="reason-list">' + engineDominant.map((constant) => '<li>' + constant.title + ': ' + constant.terms.join(' + ') + '</li>').join('') + '</ul>'
    : '';
  const enabled = enabledBy(profile).join(' / ');
  const misfit = profile.misfit ? '<div class="read-group"><h3>misfit</h3><ul class="reason-list"><li>' + profile.misfit + '</li></ul></div>' : '';
  const memory = profile.gardenMemoryRecord
    ? '<div class="read-group"><h3>former</h3><ul class="reason-list"><li>' +
      'recognition ' + Math.round(Number(profile.gardenMemoryRecord.ratios?.recognition || 0) * 100) + '% · ' +
      'resolution ' + Math.round(Number(profile.gardenMemoryRecord.ratios?.resolution || 0) * 100) + '% · ' +
      'return ' + Math.round(Number(profile.gardenMemoryRecord.ratios?.return || 0) * 100) + '%</li><li>' +
      'stability ' + Math.round(Number(profile.gardenMemoryRecord.ratios?.stability || 0) * 100) + '% · ' +
      'pressure ' + Math.round(Number(profile.gardenMemoryRecord.ratios?.pressure || 0) * 100) + '%</li><li>' +
      [profile.gardenMemoryRecord.lastCareAction || 'tended', profile.gardenMemoryRecord.lastTargetSection || '', profile.gardenMemoryRecord.lastAt || '']
        .filter(Boolean).join(' · ') +
      '</li></ul></div>'
    : '';
  const reasons = '<ul class="reason-list">' + profile.reasons.map((reason) => '<li>' + reason + '</li>').join('') + '</ul>';
  data.innerHTML = '<div class="read-group"><h3>composition</h3>' + composition + '<ul class="reason-list"><li>' + orderLabel(op.order) + '</li><li>kindled: ' + enabled + '</li><li>tend: ' + careSignal(profile) + '</li></ul></div>' +
    '<div class="read-group"><h3>basin pull</h3><ul class="reason-list"><li>' + dominant + '</li></ul>' + basins + '</div>' +
    '<div class="read-group"><h3>engine constants</h3>' + engineRead + engine + '</div>' +
    memory +
    misfit +
    '<div class="read-group"><h3>temperament</h3>' + temperament + '</div>' +
    '<div class="read-group"><h3>why</h3>' + reasons + '</div>' +
    relationTypes.map(({ key }) => {
    const items = op[key] || [];
    if (!items.length) return '';
    return '<div class="read-group"><h3>' + key + '</h3>' + items.map((item) => {
      const title = operations[item]?.title || allOps[item]?.title || item;
      return '<button class="read-chip" data-enter="' + item + '">' + title + '</button>';
    }).join('') + '</div>';
  }).join('');
  data.querySelectorAll('[data-enter]').forEach((button) => {
    button.addEventListener('click', () => enterOperation(button.dataset.enter));
  });
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
  time += dt;
  settled = Math.min(3, settled + dt);

  // Spine momentum coast with bump-friction detents
  if (spineCoasting && spineFlat.length) {
    const total = spineFlat.length;
    spineVelocity = Math.max(-6, Math.min(6, spineVelocity)); // hard cap
    spineVelocity *= 0.76; // friction — stops quickly
    spineFracPos += spineVelocity;
    spineFracPos = wrapSpinePos(spineFracPos, total);
    const newIdx = spineIndexFromPos(spineFracPos);
    if (newIdx !== spineCurrentIdx) {
      spineVelocity *= 0.72; // bump — each term crossing absorbs momentum
      spineCurrentIdx = newIdx;
      const now = performance.now();
      if (!spineLastEnter || now - spineLastEnter > 150) {
        spineLastEnter = now;
        enterOperation(spineFlat[newIdx]);
      }
    }
    if (Math.abs(spineVelocity) < 0.04) {
      spineCoasting = false;
      spineVelocity = 0;
      enterOperation(spineFlat[spineCurrentIdx]); // always land properly
    }
  }
  scale += (targetScale - scale) * Math.min(1, dt * 8);
  pan.x += (targetPan.x - pan.x) * Math.min(1, dt * 7);
  pan.y += (targetPan.y - pan.y) * Math.min(1, dt * 7);
  const focus = operations[focusId];
  const focusOrder = String(focus?.order || 'ground').toLowerCase();
  const targetDepth = ORDER_DEPTHS[focusOrder] ?? 0;
  if (focusOrder !== ambientCurrentOrder && ambientCurrentOrder !== '') ambientPulse = 1.0;
  ambientCurrentOrder = focusOrder;
  ambientPulse = Math.max(0, ambientPulse - dt * 2.2);
  ambientOrderDepth += (targetDepth - ambientOrderDepth) * Math.min(1, dt * 1.4);
  const focusProfile = focus?.profile || (focus ? computeProfile(focus) : null);
  const focusPhysics = focusProfile?.engine?.values || (focusProfile ? enginePhysics(focusProfile).values : null);
  Object.values(operations).forEach((op) => {
    const profile = op.profile || computeProfile(op);
    const physics = profile.engine?.values || enginePhysics(profile).values;
    const isFocus = op.id === focusId;
    const orbit = op.orbit || { direction: 1, speed: 0, sweep: 0, radial: 0 };
    const heldAngle = op.angle + (isFocus ? 0 : Math.sin(time * orbit.speed * orbit.direction + op.orbitPhase) * Math.max(0, orbit.sweep));
    const heldRadius = op.radius + (isFocus ? 0 : Math.sin(time * (orbit.speed * 0.72 + 0.008) + op.phase) * Math.max(0, orbit.radial));
    const heldX = isFocus ? op.tx : Math.cos(heldAngle) * heldRadius;
    const heldY = isFocus ? op.ty : Math.sin(heldAngle) * heldRadius * 0.82;
    const slotDx = heldX - op.tx;
    const slotDy = heldY - op.ty;
    const breathe = Math.sin(time * (0.18 + physics.velocity * 0.25 + physics.heat * 0.18 + physics.pressure * 0.08) + op.phase) *
      (1.2 + physics.opening * 4.8 + physics.pressure * 3.6 + physics.velocity * 2.2 - physics.damping * 2.2);
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
    const damping = 2.8 + physics.damping * 3 + physics.friction * 1.4 + profile.maturity * 1.2 - physics.pressure * 0.9;
    op.x += (op.tx + slotDx + gx + Math.cos(op.angle + time * 0.05) * breathe - op.x) * Math.min(1, dt * damping);
    op.y += (op.ty + slotDy + gy + Math.sin(op.angle + time * 0.06) * breathe - op.y) * Math.min(1, dt * damping);
  });
}

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
function termDegree(op) {
  return (op.holds||[]).length + (op.traces||[]).length + (op.carries||[]).length + (op.pairs||[]).length + (op.nests||[]).length;
}
function orderScaleGeometry() {
  const R = Math.min(innerWidth, innerHeight);
  return { cx: innerWidth / 2, cy: innerHeight / 2, rx: R * 0.36, ry: R * 0.32 };
}
function computeOrderLabels() {
  orderLabelIds = Object.values(allOps)
    .filter((op) => spineFracById[op.id] != null)
    .map((op) => ({ id: op.id, deg: termDegree(op) }))
    .sort((a, b) => b.deg - a.deg)
    .slice(0, 10)
    .map((o) => o.id);
}
function setScaleMode(mode) {
  scaleMode = mode;
  if (mode === 'order') { computeOrderLabels(); modeEl.textContent = 'the order'; if (fieldReadEl) fieldReadEl.classList.remove('ready'); }
  else if (focusId && allOps[focusId]) { modeEl.textContent = allOps[focusId].title; }
  const btn = document.getElementById('scale-toggle');
  if (btn) btn.textContent = mode === 'order' ? '•' : '◯';
}
function nearestOrderTerm(x, y) {
  let best = null, bestDist = Infinity;
  for (const id in orderScreenPos) {
    const p = orderScreenPos[id];
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestDist) { bestDist = d; best = id; }
  }
  return bestDist < 30 ? best : null;
}
function orderWheelTermPosition(op, idx, total, cx, cy, rx, ry) {
  const order = spineDisplayOrder(op);
  const orderDepth = ORDER_DEPTHS[String(order || op.order || 'ground').toLowerCase()] ?? 0.5;
  const profile = op.profile || computeProfile(op);
  const physics = profile.engine?.values || enginePhysics(profile).values;
  const seed = hashStr(op.id);
  const base = total ? idx / total : 0;
  const a = Math.PI + base * Math.PI * 2;
  const ring = 0.54
    + orderDepth * 0.27
    + profile.resolution * 0.05
    + physics.capacity * 0.04
    - physics.gravity * 0.03;
  const breathe = Math.sin(time * (0.008 + physics.velocity * 0.018 + physics.heat * 0.01) + (seed % 628) / 100) *
    (3 + physics.opening * 9 + physics.pressure * 4 - physics.damping * 3);
  return {
    angle: a,
    x: cx + Math.cos(a) * (rx * ring + breathe),
    y: cy + Math.sin(a) * (ry * ring + breathe * 0.72),
    ring,
  };
}
function drawOrderScaleView() {
  const { cx, cy, rx, ry } = orderScaleGeometry();
  const B = spineBands.length || 1;
  ctx.save();
  spineBands.forEach((band) => {
    const a0 = Math.PI + band.startFrac * Math.PI * 2;
    const a1 = Math.PI + (band.startFrac + 1 / B) * Math.PI * 2;
    const fr = fireFor(band.order);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, a0 + 0.02, a1 - 0.02);
    ctx.strokeStyle = colourMode === 'fire' ? 'hsla(' + fr.h + ',' + fr.s + '%,' + fr.l + '%,0.34)' : 'rgba(58,80,112,0.28)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    const am = Math.PI + (band.startFrac + 0.5 / B) * Math.PI * 2;
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = colourMode === 'fire' ? 'hsla(' + fr.h + ',' + fr.s + '%,72%,0.62)' : 'rgba(120,145,175,0.55)';
    ctx.fillText(band.order, cx + Math.cos(am) * (rx + 22), cy + Math.sin(am) * (ry + 22) + 4);
  });
  orderScreenPos = {};
  ctx.globalCompositeOperation = 'lighter';
  const ids = spineFlat.filter((id) => allOps[id]);
  const total = ids.length || 1;
  ids.forEach((id, idx) => {
    const op = allOps[id];
    const deg = termDegree(op);
    const p = orderWheelTermPosition(op, idx, total, cx, cy, rx, ry);
    const ex = p.x;
    const ey = p.y;
    orderScreenPos[op.id] = { x: ex, y: ey };
    const fr = colourMode === 'fire' ? fireFor(op.order) : { h: 24, s: 80, l: 50 };
    const bright = Math.min(1, 0.32 + deg * 0.06);
    const r = 1.6 + Math.min(deg, 12) * 0.42;
    const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 3.2);
    glow.addColorStop(0, 'hsla(' + fr.h + ',' + fr.s + '%,' + Math.min(92, Math.round(fr.l * (0.7 + bright * 0.5))) + '%,' + (0.5 * bright) + ')');
    glow.addColorStop(1, 'hsla(' + fr.h + ',' + fr.s + '%,' + fr.l + '%,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(ex, ey, r * 3.2, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = '600 12px "Iowan Old Style", Charter, Georgia, serif';
  ctx.textAlign = 'center';
  const labelBoxes = [];
  orderLabelIds.forEach((id) => {
    const p = orderScreenPos[id];
    if (!p) return;
    const title = allOps[id].title;
    const w = ctx.measureText(title).width + 14;
    const box = { x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y - 24, y1: p.y - 4 };
    if (labelBoxes.some((b) => !(box.x1 < b.x0 || box.x0 > b.x1 || box.y1 < b.y0 || box.y0 > b.y1))) return;
    labelBoxes.push(box);
    ctx.fillStyle = 'rgba(200,180,155,0.52)';
    ctx.fillText(title, p.x, p.y - 9);
  });
  ctx.font = '500 15px "Iowan Old Style", Charter, Georgia, serif';
  ctx.fillStyle = 'rgba(200,180,155,0.5)';
  ctx.fillText('the order', cx, cy - 4);
  ctx.restore();
}

function draw() {
  drawSmoke();
  drawAmbientHeat();
  if (scaleMode === 'order') { drawOrderScaleView(); if (fieldReadEl) fieldReadEl.classList.remove('ready'); return; }
  drawOrderSpine();
  drawBasinGradients();
  const focus = operations[focusId];
  const local = new Set(localIds(focusId));
  if (!homeMode) {
    drawIncomingCurrents(focus);
    relationTypes.forEach((type) => {
      (focus[type.key] || []).forEach((id, i) => operations[id] && drawCurrent(focus, operations[id], type, i));
    });
    drawProposals();
  }
  Object.values(operations).forEach((op) => drawOperation(op, local.has(op.id), op.id === focusId));
  if (fieldReadEl) fieldReadEl.classList.toggle('ready', !homeMode && settled > 0.9);
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  step(dt);
  draw();
  requestAnimationFrame(loop);
}

const activePointers = new Map();
let pinchStartDist = null, pinchStartScale = null;

// ── Order loop slider ─────────────────────────────────────────────────────────
const SPINE_ORDERS = ['seed', 'ground', 'first', 'second', 'third', 'practice', 'higher'];
let spineSequence = {};   // order -> [ids sorted by connection count desc]
let spineFlat = [];       // all ids in full dependency order
let spineTermFrac = [];   // flat index -> centre fraction [0,1) on the equal-band ring
let spineBands = [];      // present orders as equal arcs: { order, b, startFrac, startIdx, count }
let spineFracById = {};   // term id -> its centre fraction on the loop (for the order scale)
let spineActive = false;
let spineCoasting = false;
let spineCurrentIdx = -1; // index into spineFlat
let spineFracPos = 0;     // continuous fractional position in [0, total-1]
let spineVelocity = 0;    // terms per frame (60fps)
let spineLastFrac = 0;
let spineLastT = 0;
let spineLastEnter = 0;

function buildSpineSequence() {
  spineFlat = [];
  spineSequence = {};
  const present = [];
  SPINE_ORDERS.forEach((order) => {
    const terms = Object.values(allOps)
      .filter((op) => order === 'seed'
        ? spineDisplayOrder(op) === 'seed'
        : String(op.order || '').toLowerCase() === order && spineDisplayOrder(op) !== 'seed')
      .sort((a, b) => {
        const score = (op) => (op.holds||[]).length + (op.traces||[]).length + (op.carries||[]).length + (op.pairs||[]).length + (op.nests||[]).length;
        return score(b) - score(a);
      });
    spineSequence[order] = terms.map((t) => t.id);
    if (terms.length) present.push({ order, ids: terms.map((t) => t.id) });
    spineFlat.push(...terms.map((t) => t.id));
  });
  // Each present order owns an equal arc of the ring regardless of how many terms it holds;
  // terms pack within their band, so a dense order reads as tighter spacing, not a bigger slice.
  const B = present.length || 1;
  spineTermFrac = [];
  spineBands = [];
  spineFracById = {};
  let flatIdx = 0;
  present.forEach((band, b) => {
    const k = band.ids.length;
    spineBands.push({ order: band.order, b, startFrac: b / B, startIdx: flatIdx, count: k });
    band.ids.forEach((id) => {
      const frac = (b + (flatIdx - spineBands[b].startIdx + 0.5) / k) / B;
      spineTermFrac[flatIdx] = frac;
      spineFracById[id] = frac;
      flatIdx++;
    });
  });
}

function spineGeometry() {
  const rx = Math.min(innerWidth * 0.31, 360);
  const ry = Math.max(24, Math.min(innerHeight * 0.065, 48));
  const cx = innerWidth / 2;
  const cy = innerHeight * 0.79;
  return { cx, cy, rx, ry };
}

function spineDisplayOrder(opOrId) {
  const op = typeof opOrId === 'string' ? allOps[opOrId] : opOrId;
  if (!op) return '';
  return op.id === 'ground.seed' || String(op.title || '').toLowerCase() === 'seed'
    ? 'seed'
    : String(op.order || 'operation').toLowerCase();
}

function wrapSpinePos(pos, total = spineFlat.length) {
  if (!total) return 0;
  return ((pos % total) + total) % total;
}

function spineIndexFromPos(pos) {
  if (!spineFlat.length) return;
  return Math.round(wrapSpinePos(pos)) % spineFlat.length;
}

function spineShortestDelta(next, prev, total = spineFlat.length) {
  if (!total) return 0;
  let delta = next - prev;
  if (delta > total / 2) delta -= total;
  if (delta < -total / 2) delta += total;
  return delta;
}

function spineFracForPos(pos) {
  const total = spineFlat.length;
  if (!total) return 0;
  if (spineTermFrac.length !== total) return wrapSpinePos(pos, total) / total;
  const wrapped = wrapSpinePos(pos, total);
  const i0 = Math.floor(wrapped) % total;
  const t = wrapped - Math.floor(wrapped);
  const f0 = spineTermFrac[i0];
  let f1 = (i0 + 1 < total) ? spineTermFrac[i0 + 1] : spineTermFrac[0] + 1;
  if (f1 < f0) f1 += 1;
  return (f0 + (f1 - f0) * t) % 1;
}

function spineAngleForPos(pos) {
  return Math.PI + spineFracForPos(pos) * Math.PI * 2;
}

function spinePointAtFrac(frac) {
  const { cx, cy, rx, ry } = spineGeometry();
  const a = Math.PI + frac * Math.PI * 2;
  return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
}

function spinePointForPos(pos) {
  const { cx, cy, rx, ry } = spineGeometry();
  const a = spineAngleForPos(pos);
  return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
}

function spinePosFromFrac(f) {
  const total = spineFlat.length;
  if (!total) return 0;
  const ff = ((f % 1) + 1) % 1;
  if (spineTermFrac.length !== total) return ff * total;
  const last = total - 1;
  if (ff >= spineTermFrac[last] || ff < spineTermFrac[0]) {
    const f0 = spineTermFrac[last];
    const f1 = spineTermFrac[0] + 1;
    const fv = ff < spineTermFrac[0] ? ff + 1 : ff;
    return last + (fv - f0) / (f1 - f0);
  }
  for (let i = 0; i < last; i++) {
    if (ff >= spineTermFrac[i] && ff < spineTermFrac[i + 1]) {
      return i + (ff - spineTermFrac[i]) / (spineTermFrac[i + 1] - spineTermFrac[i]);
    }
  }
  return 0;
}

function spinePosAtPoint(x, y) {
  const { cx, cy, rx, ry } = spineGeometry();
  const angle = Math.atan2((y - cy) / ry, (x - cx) / rx);
  return spinePosFromFrac((angle - Math.PI) / (Math.PI * 2));
}

function isNearSpine(x, y) {
  const { cx, cy, rx, ry } = spineGeometry();
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  const ring = Math.abs(Math.hypot(nx, ny) - 1);
  return ring < 0.38 && Math.abs(y - cy) < ry + 34;
}

function syncSpineToFocus(id) {
  const idx = spineFlat.indexOf(id);
  if (idx < 0) return;
  spineCurrentIdx = idx;
  spineFracPos = idx;
}

function spineEnterAtPoint(x, y) {
  if (!spineFlat.length) return;
  const pos = spinePosAtPoint(x, y);
  const idx = spineIndexFromPos(pos);
  spineFracPos = pos;
  if (idx === spineCurrentIdx) return;
  spineCurrentIdx = idx;
  const now = performance.now();
  if (!spineLastEnter || now - spineLastEnter > 50) {
    spineLastEnter = now;
    enterOperation(spineFlat[idx]);
  }
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (scaleMode !== 'order' && activePointers.size === 1 && isNearSpine(event.clientX, event.clientY)) {
    spineActive = true;
    spineCoasting = false;
    spineVelocity = 0;
    spineLastFrac = spinePosAtPoint(event.clientX, event.clientY);
    spineLastT = performance.now();
    spineEnterAtPoint(event.clientX, event.clientY);
    return;
  }
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
  hoverId = scaleMode === 'order' ? nearestOrderTerm(event.clientX, event.clientY) : nearestOperation(event.clientX, event.clientY);
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (spineActive) {
    const now = performance.now();
    const dt = now - spineLastT;
    if (dt > 0 && spineFlat.length > 1) {
      const nextFrac = spinePosAtPoint(event.clientX, event.clientY);
      const deltaTerms = spineShortestDelta(nextFrac, spineLastFrac);
      spineVelocity = deltaTerms / dt * 16.67; // normalize to 60fps
      spineLastFrac = nextFrac;
    }
    spineLastT = now;
    spineEnterAtPoint(event.clientX, event.clientY);
    return;
  }
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
  if (spineActive) {
    spineActive = false;
    spineVelocity = Math.max(-6, Math.min(6, spineVelocity));
    if (Math.abs(spineVelocity) > 0.4 && spineFlat.length) {
      spineCoasting = true;
    } else if (spineCurrentIdx >= 0) {
      enterOperation(spineFlat[spineCurrentIdx]); // land if no coast
    }
    activePointers.delete(event.pointerId);
    return;
  }
  if (scaleMode === 'order') {
    if (activePointers.size === 1 && pointer && !pointer.moved) {
      const id = nearestOrderTerm(event.clientX, event.clientY);
      if (id) { setScaleMode('carry'); enterOperation(id); }
    }
    activePointers.delete(event.pointerId);
    if (activePointers.size < 2) { pinchStartDist = null; pinchStartScale = null; }
    if (activePointers.size === 0) pointer = null;
    return;
  }
  if (activePointers.size === 1 && pointer && !pointer.moved) {
    const id = nearestOperation(event.clientX, event.clientY);
    if (id) {
      if (id === focusId) panel.classList.add('open');
      else enterOperation(id);
    }
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
closePanel.addEventListener('click', () => panel.classList.remove('open'));
window.addEventListener('resize', resize);

window.addEventListener('keydown', (event) => {
  if (event.target !== document.body && event.target.tagName !== 'CANVAS') return;
  if (!spineFlat.length) return;
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    const next = spineCurrentIdx < 0 ? 0 : (spineCurrentIdx + 1) % spineFlat.length;
    spineFracPos = next;
    spineCurrentIdx = next;
    enterOperation(spineFlat[next]);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    const prev = spineCurrentIdx < 0 ? 0 : (spineCurrentIdx - 1 + spineFlat.length) % spineFlat.length;
    spineFracPos = prev;
    spineCurrentIdx = prev;
    enterOperation(spineFlat[prev]);
  } else if (event.key === 'Escape') {
    spineCoasting = false;
    spineVelocity = 0;
  }
});

async function bootstrap() {
  modeEl.textContent = 'loading';
  try {
    const [entriesRes, proposalsRes] = await Promise.all([
      fetch('/api/field/entries'),
      fetch('/api/garden/proposals'),
    ]);
    const fieldData = await entriesRes.json();
    const { entries = [], memory = {} } = fieldData;
    const { proposals = [] } = await proposalsRes.json();

    allOps = {};
    entries.forEach((e) => { allOps[e.id] = e; });
    gardenMemory = memory || {};
    liveProposals = proposals.filter((p) => p.status !== 'discarded' && p.status !== 'applied' && p.status !== 'needs_preparation');
    buildSpineSequence();
  } catch(err) {
    modeEl.textContent = 'Field';
    console.error('field bootstrap failed:', err);
    // continue with empty index — field renders nothing until data loads
  }

  const hash = decodeURIComponent(location.hash.slice(1) || '');
  const isHome = !hash || !allOps[hash];
  const startId = (hash && allOps[hash]) ? hash
    : Object.values(allOps).find((op) => op.title === 'Reality Mechanics')?.id
    || Object.values(allOps).find((op) => op.title === 'Relation')?.id
    || Object.keys(allOps)[0]
    || null;

  if (!startId) { modeEl.textContent = 'Field'; requestAnimationFrame(loop); return; }

  homeMode = isHome;
  focusId = startId;
  targetFocusId = startId;
  syncSpineToFocus(startId);
  initOperations(startId);
  layout(startId);
  modeEl.textContent = allOps[startId].title;
  renderFieldRead(startId);
  renderPanel(startId);
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

// Scale toggle — the whole (order scale) or a single term (carry scale)
(function initScale() {
  const btn = document.getElementById('scale-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => setScaleMode(scaleMode === 'order' ? 'carry' : 'order'));
})();

resize();
bootstrap();
</script>
</body>
</html>`;
}

// ── Atlas page ────────────────────────────────────────────────────────────────

function homePage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reality Mechanics</title>
  <meta name="description" content="A dependency-ordered reasoning system."/>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%; background: #07090e;
      display: flex; align-items: center; justify-content: center;
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      overflow: hidden;
    }
    .stage {
      display: flex; flex-direction: column; align-items: center; gap: 2.8rem;
      text-align: center; padding: 2rem;
    }
    h1 {
      font-size: clamp(1.6rem, 5vw, 2.8rem);
      font-weight: 600; letter-spacing: 0.04em;
      color: rgba(200, 180, 155, 0.72);
    }
    .tagline {
      font-size: clamp(0.78rem, 2vw, 0.95rem);
      color: rgba(120, 140, 165, 0.45);
      letter-spacing: 0.06em;
      text-transform: lowercase;
    }
    .enter {
      display: inline-block;
      font-size: clamp(0.85rem, 2.2vw, 1.05rem);
      font-weight: 600; letter-spacing: 0.08em;
      color: #c8601a;
      text-decoration: none;
      text-shadow: 0 0 22px rgba(200,96,26,0.4), 0 0 60px rgba(200,96,26,0.14);
      transition: text-shadow 0.3s;
      animation: pulse 4s ease-in-out infinite;
    }
    .enter:hover {
      text-shadow: 0 0 32px rgba(200,96,26,0.7), 0 0 80px rgba(200,96,26,0.28);
    }
    @keyframes pulse {
      0%,100% { text-shadow: 0 0 22px rgba(200,96,26,0.4),  0 0 60px rgba(200,96,26,0.14); }
      50%      { text-shadow: 0 0 36px rgba(200,96,26,0.65), 0 0 90px rgba(200,96,26,0.24); }
    }
  </style>
</head>
<body>
  <div class="stage">
    <h1>Reality Mechanics</h1>
    <p class="tagline">a dependency-ordered reasoning system</p>
    <a class="enter" href="/field">enter the field</a>
  </div>
</body>
</html>`;
}

function atlasPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reality Mechanics</title>
  <meta name="description" content="A dependency-ordered reasoning system."/>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #07090e; }
    body::before {
      content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 1;
      background:
        radial-gradient(circle at 50% 35%, rgba(20,31,46,0.52), transparent 48%),
        radial-gradient(circle at 20% 78%, rgba(200,96,26,0.035), transparent 24%);
    }
    canvas { display: block; }

    #top {
      position: fixed; inset: 1.4rem 1.6rem auto 1.6rem; z-index: 20;
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;
      pointer-events: none;
    }
    #top a, #top .current {
      pointer-events: auto; text-decoration: none; color: rgba(58,80,112,0.72);
      font: 700 0.62rem/1 system-ui, sans-serif; letter-spacing: 0.16em; text-transform: uppercase;
    }
    #top a:hover { color: rgba(200,96,26,0.8); }
    #top .current { color: rgba(200,96,26,0.48); text-align: center; }
    #top a:last-child { justify-self: end; }

    /* ── Term labels — these ARE the nodes ── */
    #labels { position: fixed; inset: 0; pointer-events: none; z-index: 5; }

    .tl {
      position: absolute; transform: translate(-50%, -50%);
      pointer-events: auto; cursor: pointer;
      user-select: none; -webkit-user-select: none;
      touch-action: none;
      opacity: 0; transition: opacity 0.5s;
    }
    .tl.show { opacity: 1; }

    .tl-name {
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      font-weight: 600; white-space: nowrap;
      transition: color 0.2s;
    }
    /* Neighbour terms */
    .tl.carries .tl-name { font-size: clamp(0.78rem, 1.8vw, 1rem); color: #3d5570; }
    .tl.traces  .tl-name { font-size: clamp(0.78rem, 1.8vw, 1rem); color: #3d5570; }
    .tl.carries:hover .tl-name,
    .tl.traces:hover  .tl-name { color: #6a8099; }

    /* Centre term */
    .tl.center .tl-name {
      font-size: clamp(1.4rem, 3.5vw, 2.2rem);
      color: #c8601a;
      text-shadow: 0 0 22px rgba(200,96,26,0.5), 0 0 60px rgba(200,96,26,0.18);
      animation: breathe 4.2s ease-in-out infinite;
    }

    @keyframes breathe {
      0%,100% { text-shadow: 0 0 22px rgba(200,96,26,0.5),  0 0 60px rgba(200,96,26,0.18); }
      50%      { text-shadow: 0 0 36px rgba(200,96,26,0.75), 0 0 90px rgba(200,96,26,0.3); }
    }

    /* ── Search — secondary, appears after placement ── */
    #search-bar {
      position: fixed; bottom: 1.6rem; left: 50%; transform: translateX(-50%);
      z-index: 20; opacity: 0; transition: opacity 0.4s; pointer-events: none;
    }
    #search-bar.show { opacity: 1; pointer-events: auto; }
    #sf {
      background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.07);
      outline: none; color: #c8601a; caret-color: #c8601a;
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      font-size: 0.95rem; letter-spacing: 0.01em;
      text-align: center; width: clamp(140px, 26vw, 280px);
      padding: 0.25rem 0;
    }
    #sf::placeholder { color: #2e3e50; opacity: 1; }
    #sf:focus { border-bottom-color: rgba(200,96,26,0.3); }

    /* ── Loader ── */
    #loader {
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 5px; height: 5px; border-radius: 50%;
      background: #c8601a; z-index: 15; opacity: 0; pointer-events: none;
    }
    #loader.on { animation: ldp 1s ease-in-out infinite; }
    @keyframes ldp {
      0%,100%{opacity:.2;transform:translate(-50%,-50%) scale(1)}
      50%{opacity:1;transform:translate(-50%,-50%) scale(2.2)}
    }

    /* ── Reading panel ── */
    #panel {
      position: fixed; bottom: -100%; left: 0; right: 0;
      max-height: 65vh; overflow-y: auto;
      background: rgba(7,9,14,0.97);
      border-top: 1px solid rgba(255,255,255,0.055);
      backdrop-filter: blur(14px);
      padding: 1.8rem 1.8rem 2.4rem;
      z-index: 30; transition: bottom 0.38s cubic-bezier(0.32,0.72,0,1);
    }
    #panel.open { bottom: 0; }
    #pclose {
      position: absolute; top: 0.9rem; right: 1.1rem;
      background: none; border: none; color: #4d5e72;
      font-size: 1.1rem; cursor: pointer; padding: 0.3rem 0.6rem;
      transition: color 0.18s;
    }
    #pclose:hover { color: #c8601a; }
    #porder {
      font-family: system-ui, sans-serif;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(200,96,26,0.5); margin-bottom: 0.4rem;
    }
    #ptitle {
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      font-size: clamp(1.5rem, 4vw, 2.4rem); font-weight: 500;
      color: #c8601a; line-height: 1.1; margin-bottom: 0.9rem;
    }
    #psnippet {
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      font-size: clamp(0.9rem, 1.8vw, 1.06rem); line-height: 1.62;
      color: rgba(212,197,169,0.65); margin-bottom: 1.3rem; max-width: 560px;
    }
    #prelations {
      display: flex; flex-wrap: wrap; gap: 1.6rem;
      margin-bottom: 1.3rem;
    }
    .prel-group h4 {
      font-family: system-ui, sans-serif;
      font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: #2a3848; margin-bottom: 0.45rem;
    }
    .prel-btn {
      display: block; font-family: "Iowan Old Style", Charter, Georgia, serif;
      font-size: 0.9rem; color: #3d5570; padding: 0.18rem 0;
      cursor: pointer; background: none; border: none; text-align: left;
      transition: color 0.18s;
    }
    .prel-btn:hover { color: #c8601a; }
    #pfull {
      font-family: system-ui, sans-serif;
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em;
      text-transform: uppercase; color: rgba(42,56,72,0.68); text-decoration: none;
      transition: color 0.18s;
    }
    #pfull:hover { color: #4d5e72; }
    #ppaths {
      display: flex; gap: 1rem; flex-wrap: wrap;
      font-family: system-ui, sans-serif;
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em;
      text-transform: uppercase;
    }
    #ppaths a {
      color: #2a3848; text-decoration: none; transition: color 0.18s;
    }
    #ppaths a:hover { color: #c8601a; }

    @media (max-width: 580px) {
      #top { inset: 1rem 1rem auto 1rem; }
      #search-bar { bottom: 1rem; }
    }
  </style>
</head>
<body>

<div id="top">
  <a href="/field">Field</a>
  <div class="current">Atlas</div>
  <a href="/garden">Garden</a>
</div>

<div id="labels"></div>
<div id="loader"></div>

<div id="search-bar">
  <input id="sf" type="text" autocomplete="off" spellcheck="false"
    placeholder="Enter a term" aria-label="Enter an Atlas term" maxlength="200"/>
</div>

<div id="panel">
  <button id="pclose">×</button>
  <div id="porder"></div>
  <div id="ptitle"></div>
  <p id="psnippet"></p>
  <div id="prelations"></div>
  <div id="ppaths">
    <a id="pfield">field</a>
    <a id="pfull" target="_blank" rel="noopener">archive</a>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ── Scene — stars only, no node meshes ───────────────────────────────────────

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x07090e);
document.body.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 2000);
camera.position.set(0, 0, 14);

scene.add(new THREE.AmbientLight(0x0a1220, 1.0));

// Star field
let starField;
(function () {
  const n = 2000, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 80 + Math.random() * 440;
    const t = Math.random() * Math.PI * 2;
    const f = Math.acos(2 * Math.random() - 1);
    p[i*3]   = r * Math.sin(f) * Math.cos(t);
    p[i*3+1] = r * Math.sin(f) * Math.sin(t);
    p[i*3+2] = r * Math.cos(f);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  starField = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x3a5070, size: 0.26, sizeAttenuation: true }));
  scene.add(starField);
})();

// Connection lines — updated dynamically as nodes move
const MAX_LINES = 12;
const lineVerts = new Float32Array(MAX_LINES * 2 * 3);
const lineGeo   = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
const lineObj = new THREE.LineSegments(lineGeo,
  new THREE.LineBasicMaterial({ color: 0x182535, transparent: true, opacity: 0.5 }));
scene.add(lineObj);

// ── Node state (no meshes — positions only) ───────────────────────────────────

const labelsEl = document.getElementById('labels');
// node: { id, title, publicUrl, order, role, pos, vel, target, origTarget, labelEl }
let nodes = [];
let currentData = null;

function clearNodes() {
  nodes.forEach(n => n.labelEl.remove());
  nodes = [];
  lineGeo.setDrawRange(0, 0);
}

function spreadPos(items, baseY, baseZ) {
  const n = items.length;
  return items.map((_, i) => {
    const angle = n === 1 ? 0 : (i / (n - 1) - 0.5) * Math.PI * 0.9;
    const dist  = 3.2 + Math.random() * 1.4;
    return new THREE.Vector3(
      Math.sin(angle) * dist,
      baseY + (Math.random() - 0.5) * 1.2,
      baseZ + (Math.random() - 0.5) * 0.8
    );
  });
}

function buildNodes(term, carries, traces) {
  clearNodes();
  currentData = { term, carries, traces };

  const carryPos = spreadPos(carries, -3,  2.5);
  const tracePos = spreadPos(traces,   3, -3);

  const all = [
    { ...term,                     role: 'center', _tp: new THREE.Vector3(0,0,0) },
    ...carries.map((t,i) => ({ ...t, role: 'carries', _tp: carryPos[i] })),
    ...traces.map((t,i)  => ({ ...t, role: 'traces',  _tp: tracePos[i] })),
  ];

  all.forEach(t => {
    const target = t._tp.clone();
    const node = {
      id: t.id, title: t.title, publicUrl: t.publicUrl, order: t.order, role: t.role,
      pos: target.clone(), vel: new THREE.Vector3(),
      target: target.clone(), origTarget: target.clone(),
    };

    // Label element
    const el = document.createElement('div');
    el.className = 'tl ' + t.role;
    el.innerHTML = '<span class="tl-name">' + t.title + '</span>';
    el.addEventListener('click', () => {
      if (wasDrag) return;
      if (t.role === 'center') openPanel(node);
      else navigate(t.id, node.pos.clone());
    });
    attachDrag(el, node);
    labelsEl.appendChild(el);
    node.labelEl = el;
    nodes.push(node);
  });

  document.title = term.title + ' · Reality Mechanics';
  history.pushState({ id: term.id }, '', '/atlas#' + term.id);
}

// ── Physics ───────────────────────────────────────────────────────────────────

function tickPhysics(dt) {
  const center = nodes.find(n => n.role === 'center');
  nodes.forEach(n => {
    if (n.dragging) return;
    const k    = n.role === 'center' ? 20 : 7;
    const damp = n.role === 'center' ? 0.74 : 0.82;
    const spring = n.target.clone().sub(n.pos);
    n.vel.addScaledVector(spring, k * dt);
    n.vel.multiplyScalar(damp);
    n.pos.addScaledVector(n.vel, dt);
  });

  // Update line geometry
  if (center) {
    let vi = 0;
    nodes.filter(n => n.role !== 'center').forEach(n => {
      lineVerts[vi++] = center.pos.x; lineVerts[vi++] = center.pos.y; lineVerts[vi++] = center.pos.z;
      lineVerts[vi++] = n.pos.x;      lineVerts[vi++] = n.pos.y;      lineVerts[vi++] = n.pos.z;
    });
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, vi / 3);
  }
}

// ── Drag — handled on label elements directly ─────────────────────────────────

let dragNode  = null;
let dragWorld = null;
let dragBase  = null;
let wasDrag   = false;
let mouseStart = { x: 0, y: 0 };

function worldAt(cx, cy, z) {
  const rect = renderer.domElement.getBoundingClientRect();
  const ndc  = new THREE.Vector3(
    ((cx - rect.left) / rect.width) * 2 - 1,
    -((cy - rect.top) / rect.height) * 2 + 1,
    0.5
  ).unproject(camera);
  const dir  = ndc.sub(camera.position).normalize();
  const dist = (z - camera.position.z) / dir.z;
  return camera.position.clone().add(dir.multiplyScalar(dist));
}

function attachDrag(el, node) {
  el.addEventListener('pointerdown', e => {
    e.stopPropagation();
    el.setPointerCapture(e.pointerId);
    dragNode  = node;
    node.dragging = true;
    wasDrag   = false;
    mouseStart = { x: e.clientX, y: e.clientY };
    dragWorld = worldAt(e.clientX, e.clientY, node.pos.z);
    dragBase  = node.pos.clone();
  });

  el.addEventListener('pointermove', e => {
    if (dragNode !== node) return;
    const dx = e.clientX - mouseStart.x, dy = e.clientY - mouseStart.y;
    if (dx*dx + dy*dy > 36) wasDrag = true;
    const world = worldAt(e.clientX, e.clientY, node.pos.z);
    const delta = world.clone().sub(dragWorld);
    node.pos.copy(dragBase).add(delta);
    if (node.role === 'center') {
      nodes.forEach(n => {
        if (n.role !== 'center')
          n.target.copy(n.origTarget).addScaledVector(delta, 0.26);
      });
    }
  });

  el.addEventListener('pointerup', () => {
    if (dragNode !== node) return;
    node.dragging = false;
    dragNode = null;
    if (node.role === 'center') {
      node.target.set(0,0,0);
      nodes.forEach(n => { if (n.role !== 'center') n.target.copy(n.origTarget); });
    }
    setTimeout(() => { wasDrag = false; }, 40);
  });
}

// ── Label projection ──────────────────────────────────────────────────────────

const _v = new THREE.Vector3();
let labelsVisible = false;

function updateLabels() {
  const hw = innerWidth / 2, hh = innerHeight / 2;
  nodes.forEach(n => {
    _v.copy(n.pos).project(camera);
    if (_v.z > 1) { n.labelEl.style.opacity = '0'; return; }
    n.labelEl.style.left = ((_v.x + 1) * hw) + 'px';
    n.labelEl.style.top  = ((-_v.y + 1) * hh) + 'px';
    if (labelsVisible && !n.labelEl.classList.contains('show'))
      n.labelEl.classList.add('show');
  });
}

// ── Camera ────────────────────────────────────────────────────────────────────

let camAnim = null, driftT = 0;

function animCam(to, dur, onDone) {
  camAnim = { from: camera.position.clone(), to: to.clone(), dur, el: 0, onDone };
}

function tickCam(dt) {
  if (camAnim) {
    camAnim.el += dt;
    const t = Math.min(camAnim.el / camAnim.dur, 1);
    const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    camera.position.lerpVectors(camAnim.from, camAnim.to, e);
    if (t >= 1) { const cb = camAnim.onDone; camAnim = null; if (cb) cb(); }
    camera.lookAt(0,0,0);
    return;
  }
  driftT += dt * 0.12;
  camera.position.x = Math.sin(driftT * 0.55) * 0.9;
  camera.position.y = Math.cos(driftT * 0.37) * 0.55;
  camera.position.z = 14 + Math.sin(driftT * 0.26) * 0.4;
  camera.lookAt(0,0,0);
}

// ── Navigation ────────────────────────────────────────────────────────────────

let busy = false;

async function navigate(id, worldPos) {
  if (busy) return;
  busy = true;
  closePanel();
  labelsVisible = false;
  nodes.forEach(n => n.labelEl.classList.remove('show'));

  const towards = camera.position.clone().lerp(worldPos, 0.38);
  animCam(towards, 0.48, async () => {
    showLoader(true);
    const data = await fetchPlace({ id });
    showLoader(false);
    if (data) buildNodes(data.term, data.carries, data.traces);
    camera.position.set((Math.random()-0.5)*3.5, (Math.random()-0.5)*2, 8.5);
    animCam(new THREE.Vector3(0,0,14), 0.55, () => {
      labelsVisible = true;
      busy = false;
    });
  });
}

async function placeInput(input) {
  if (busy) return;
  busy = true;
  labelsVisible = false;
  nodes.forEach(n => n.labelEl.classList.remove('show'));
  showLoader(true);
  const data = await fetchPlace({ input });
  showLoader(false);
  if (data) {
    buildNodes(data.term, data.carries, data.traces);
    animCam(new THREE.Vector3(0,0,14), 0.45, () => { labelsVisible = true; });
  }
  busy = false;
}

async function fetchPlace(body) {
  try {
    const r = await fetch('/api/enter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    return d.placed ? d : null;
  } catch { return null; }
}

// ── Reading panel ─────────────────────────────────────────────────────────────

const panel   = document.getElementById('panel');
const pclose  = document.getElementById('pclose');
const prelEl  = document.getElementById('prelations');

function openPanel(node) {
  if (!currentData) return;
  const { term, carries, traces } = currentData;
  document.getElementById('porder').textContent   = term.order ? term.order.replace(/-/g,' ') : '';
  document.getElementById('ptitle').textContent   = term.title;
  document.getElementById('psnippet').textContent = term.snippet || '';
  const pfull = document.getElementById('pfull');
  pfull.href  = term.publicUrl || '#';
  pfull.style.display = term.publicUrl ? '' : 'none';
  document.getElementById('pfield').href = '/field#' + encodeURIComponent(term.id);

  prelEl.innerHTML = '';
  [['carries', carries], ['traces', traces]].forEach(([label, items]) => {
    if (!items.length) return;
    const grp = document.createElement('div');
    grp.className = 'prel-group';
    grp.innerHTML = '<h4>' + label + '</h4>';
    items.forEach(t => {
      const btn = document.createElement('button');
      btn.className   = 'prel-btn';
      btn.textContent = t.title;
      btn.addEventListener('click', () => {
        closePanel();
        const n = nodes.find(x => x.id === t.id);
        navigate(t.id, n ? n.pos.clone() : new THREE.Vector3());
      });
      grp.appendChild(btn);
    });
    prelEl.appendChild(grp);
  });

  panel.classList.add('open');
}

function closePanel() { panel.classList.remove('open'); }
pclose.addEventListener('click', closePanel);

// ── Render loop ───────────────────────────────────────────────────────────────

let lastT = performance.now();
(function loop() {
  requestAnimationFrame(loop);
  const now = performance.now(), dt = Math.min((now - lastT)/1000, 0.08);
  lastT = now;
  starField.rotation.y += 0.000052;
  starField.rotation.x += 0.000020;
  tickPhysics(dt);
  tickCam(dt);
  updateLabels();
  renderer.render(scene, camera);
})();

// ── Search ────────────────────────────────────────────────────────────────────

const sf        = document.getElementById('sf');
const searchBar = document.getElementById('search-bar');

sf.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const v = sf.value.trim();
  if (!v) return;
  sf.value = ''; sf.blur();
  placeInput(v);
});

function showLoader(on) { document.getElementById('loader').className = on ? 'on' : ''; }

// ── Auto-place on load ────────────────────────────────────────────────────────

async function autoLoad() {
  showLoader(true);
  const hash = window.location.hash.slice(1);
  const body = hash ? { id: decodeURIComponent(hash) } : { input: 'Atlas' };
  const data = await fetchPlace(body);
  showLoader(false);
  if (data) {
    buildNodes(data.term, data.carries, data.traces);
    setTimeout(() => {
      labelsVisible = true;
      searchBar.classList.add('show');
    }, 300);
  }
}

autoLoad();

// ── Resize ────────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
</script>
</body>
</html>`;
}

// ── Router ────────────────────────────────────────────────────────────────────

async function handleRequest(request, env) {
  const { pathname } = new URL(request.url);

  if (pathname === "/robots.txt")
    return new Response("User-agent: *\nAllow: /\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });

  if (pathname === "/postulate" || pathname === "/theory" || pathname === "/theory.html")
    return Response.redirect("https://theory.realitymechanics.nz", 302);

  if (pathname === "/coupled-read" || pathname === "/coupled-read.html")
    return Response.redirect("https://theory.realitymechanics.nz/coupled-read", 302);

  if (pathname === "/archive")
    return Response.redirect("https://atlas.realitymechanics.nz", 302);

  if (pathname === "/api/enter")
    return handleEnterApi(request);

  // Garden API
  if (pathname === "/api/field/entries")
    return handleFieldEntries(env);

  if (pathname === "/api/garden/health")
    return handleGardenHealth(env);

  if (pathname === "/api/garden/log")
    return handleGardenLog(request, env);

  if (pathname === "/api/garden/stats")
    return handleGardenStats(request, env);

  if (pathname === "/api/garden/pace")
    return handleGardenPace(request, env);

  if (pathname === "/api/garden/proposals")
    return handleGardenProposals(env);

  if (pathname.startsWith("/api/garden/proposal/")) {
    const id = pathname.replace("/api/garden/proposal/", "");
    return handleGardenProposalDetail(request, env, id);
  }

  if (pathname.startsWith("/api/garden/light/")) {
    const id = pathname.replace("/api/garden/light/", "");
    return signalProposal(request, env, id, "light");
  }

  if (pathname.startsWith("/api/garden/shade/")) {
    const id = pathname.replace("/api/garden/shade/", "");
    return signalProposal(request, env, id, "shade");
  }

  if (pathname.startsWith("/api/garden/approve/")) {
    if (!gardenAuthorized(request, env))
      return gardenUnauthorized();
    const id = pathname.replace("/api/garden/approve/", "");
    return updateProposalStatus(env, id, "approved");
  }

  if (pathname.startsWith("/api/garden/discard/")) {
    if (!gardenAuthorized(request, env))
      return gardenUnauthorized();
    const id = pathname.replace("/api/garden/discard/", "");
    return updateProposalStatus(env, id, "discarded");
  }

  if (pathname.startsWith("/api/garden/needs-preparation/")) {
    if (!gardenAuthorized(request, env))
      return gardenUnauthorized();
    const id = pathname.replace("/api/garden/needs-preparation/", "");
    return updateProposalStatus(env, id, "needs_preparation");
  }

  if (pathname.startsWith("/api/garden/steward-note/")) {
    const id = pathname.replace("/api/garden/steward-note/", "");
    return handleGardenStewardNote(request, env, id);
  }

  if (pathname.startsWith("/api/garden/complete/")) {
    if (!gardenAuthorized(request, env))
      return gardenUnauthorized();
    const id = pathname.replace("/api/garden/complete/", "");
    return updateProposalStatus(env, id, "applied");
  }

  if (pathname === "/" || pathname === "")
    return new Response(fieldPage(), { headers: HTML_HEADERS });

  if (pathname === "/garden")
    return new Response(gardenPage(env), { headers: HTML_HEADERS });

  if (pathname === "/field")
    return new Response(fieldPage(), { headers: HTML_HEADERS });

  if (pathname === "/koha")
    return handleKoha(env);

  return new Response(atlasPage(), { headers: HTML_HEADERS });
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
