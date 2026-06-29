const DEFAULT_MCP_URL = "https://mcp.realitymechanics.nz/mcp";
const DEFAULT_MODEL = "gpt-5";
const MAX_CANDIDATES = 18;
const CANDIDATE_PAGE_SIZE = 50;
const MAX_CANDIDATE_PAGES = 8;
const MEMORY_TTL_SECONDS = 60 * 60 * 24 * 90;
const MEMORY_RECENT_SKIP_DAYS = 7;
const SECTION_EXCERPT_CHARS = 900;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

const CARE_ACTIONS = {
  graft: "carry/trace mismatch or living trace attached to the wrong support",
  prune: "drift, overgrowth, misplaced carrying, or unsupported overreach",
  compost: "claim should stop carrying but remain as traceable learning",
  tend: "thin, incomplete, or under-elaborated section that can be improved",
  clear: "shade or readability obstruction that can be named and reduced",
  wait: "not enough trace yet; leave ungrounded and name what is missing",
  release: "remove carrying claim while preserving what the failure taught",
  "clean-pass": "no change needed; record that this pass found no issue",
};

const GARDEN_FRAME = `
Run exactly one Garden Pass. Garden Pass is the unit of work, not a planning session.

Selection has already been done. Do not re-pick the entry.

Care actions:
- graft: ${CARE_ACTIONS.graft}
- prune: ${CARE_ACTIONS.prune}
- compost: ${CARE_ACTIONS.compost}
- tend: ${CARE_ACTIONS.tend}
- clear: ${CARE_ACTIONS.clear}
- wait: ${CARE_ACTIONS.wait}
- release: ${CARE_ACTIONS.release}
- clean-pass: ${CARE_ACTIONS["clean-pass"]}

Choose the first care action that fits. Spend one short reason only.
Never ground an entry. Never directly rewrite canonical Atlas content. Never create new terms.
Write one proposal and stop.
Where a change is proposed, make it a concrete edit: choose one existing section and provide the complete replacement body for that section.
target_section MUST exactly match one of the provided section names. Do not invent pseudo-sections like "second duplicate", "opening paragraph", or "entire entry body".
Keep the proposal clean: summary is one plain finding, reason is one short sentence, proposed_changes is one short note only if it is needed. The replacement_text must carry the edit; do not add meta-commentary.
Prefer higher-value garden work over small repetition cleanup: alignment, drift, reciprocity, grafting, pruning, or shade that affects trace/carry. Use clean-pass for duplicate prose only when no structural care issue is visible.
`.trim();

function bearerToken(request) {
  const auth = request.headers.get("Authorization") || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : auth;
}

function authorized(request, env) {
  return !!env.GARDEN_SECRET && bearerToken(request) === env.GARDEN_SECRET;
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value, null, 2), { status, headers: JSON_HEADERS });
}

function gardenPace(env) {
  const pace = Number(env.GARDEN_PACE || 1);
  if (!Number.isFinite(pace) || pace <= 0) return 1;
  return Math.min(pace, 1000);
}

async function readGardenPace(env) {
  if (!env.GARDEN) return gardenPace(env);
  const stored = Number(await env.GARDEN.get("garden:pace"));
  if (!Number.isFinite(stored) || stored <= 0) return gardenPace(env);
  return Math.min(stored, 1000);
}

async function scheduledDue(env, key, baseHours) {
  const pace = await readGardenPace(env);
  const intervalMs = Math.max(60 * 1000, baseHours * 3600000 / pace);
  if (!env.GARDEN) return { due: true, intervalMs, reason: "no_schedule_store" };

  const storageKey = `schedule:${key}:last_run`;
  const now = Date.now();
  const last = Number(await env.GARDEN.get(storageKey) || 0);
  if (last && now - last < intervalMs) {
    return { due: false, intervalMs, nextMs: last + intervalMs };
  }

  await env.GARDEN.put(storageKey, String(now));
  return { due: true, intervalMs };
}

async function recordSchedule(env, key, fields = {}) {
  if (!env.GARDEN) return;
  const now = Date.now();
  await Promise.all([
    env.GARDEN.put(`schedule:${key}:last_wake`, String(now)),
    env.GARDEN.put(`schedule:${key}:status`, JSON.stringify({ at: now, ...fields })),
  ]);
}

function todayId() {
  return new Date().toISOString().slice(0, 10);
}

async function mcpCall(env, name, args = {}, auth = false) {
  const res = await fetch(env.MCP_URL || DEFAULT_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      ...(auth && env.GARDEN_SECRET ? { "Authorization": `Bearer ${env.GARDEN_SECRET}` } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "mcp_error");
  const result = data.result?.structuredContent ?? JSON.parse(data.result?.content?.[0]?.text || "{}");
  if (result?.error && name !== "write_proposal") throw new Error(`${name}: ${result.error}`);
  return result;
}

async function listByGardenStatus(env, gardenStatus, offset = 0) {
  const result = await mcpCall(env, "list_entries", { garden_status: gardenStatus, limit: CANDIDATE_PAGE_SIZE, offset });
  return result.entries || [];
}

async function gardenMemoryKeys(env) {
  if (!env.GARDEN?.list) return new Set();
  try {
    const listed = await env.GARDEN.list({ prefix: "garden-memory:entry:", limit: 1000 });
    const pairs = await Promise.all((listed.keys || []).map(async (item) => {
      try {
        const raw = await env.GARDEN.get(item.name);
        const memory = raw ? JSON.parse(raw) : {};
        const lastAt = memory.lastAt || memory.at || "";
        const ageDays = lastAt ? (Date.now() - new Date(lastAt).getTime()) / 86400000 : 0;
        if (ageDays > MEMORY_RECENT_SKIP_DAYS) return null;
        return item.name.replace("garden-memory:entry:", "");
      } catch {
        return item.name.replace("garden-memory:entry:", "");
      }
    }));
    return new Set(pairs.filter(Boolean));
  } catch {
    return new Set();
  }
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

function normalizeMemory(memory, entry) {
  const visits = Number(memory?.visits || (memory?.at ? 1 : 0));
  const sections = memory?.sections || (memory?.targetSection ? { [memory.targetSection]: 1 } : {});
  const care = memory?.care || (memory?.careAction ? { [memory.careAction]: 1 } : {});
  const kinds = memory?.kinds || (memory?.kind ? { [memory.kind]: 1 } : {});
  const resolved = Number(memory?.resolved || 0);
  const active = Number(memory?.active || (memory?.at ? 1 : 0));
  const unresolved = Number(memory?.unresolved || active);
  return {
    entryId: memory?.entryId || entry.id,
    title: memory?.title || entry.title,
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
    ratios: memory?.ratios || {},
  };
}

function withMemoryRatios(memory) {
  const visits = Math.max(0, Number(memory.visits || 0));
  const resolved = Math.max(0, Number(memory.resolved || 0));
  const unresolved = Math.max(0, Number(memory.unresolved || 0));
  const active = Math.max(0, Number(memory.active || 0));
  const returnRatio = dominantRatio(memory.sections, visits);
  const coherenceRatio = Math.max(returnRatio, dominantRatio(memory.care, visits), dominantRatio(memory.kinds, visits));
  const resolutionRatio = ratio(resolved, resolved + unresolved);
  const stabilityRatio = ratio(resolved, resolved + active);
  const recognitionRatio = resolutionRatio * (0.55 + returnRatio * 0.25 + coherenceRatio * 0.2);
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

async function rememberGardenPass(env, entry, proposalId, pass) {
  if (!env.GARDEN) return;
  const key = `garden-memory:entry:${entry.id}`;
  const now = new Date().toISOString();
  let previous = {};
  try { previous = JSON.parse(await env.GARDEN.get(key) || "{}"); } catch {}
  const memory = normalizeMemory(previous, entry);
  memory.visits += 1;
  memory.unresolved += 1;
  memory.active += 1;
  memory.sections = incrementMap(memory.sections, pass.target_section);
  memory.care = incrementMap(memory.care, pass.care_action);
  memory.kinds = incrementMap(memory.kinds, pass.kind);
  memory.firstAt = memory.firstAt || now;
  memory.lastAt = now;
  memory.lastProposalId = proposalId;
  memory.lastCareAction = pass.care_action;
  memory.lastKind = pass.kind;
  memory.lastTargetSection = pass.target_section;
  memory.lastStatus = "pending";
  await env.GARDEN.put(key, JSON.stringify(withMemoryRatios(memory)), { expirationTtl: MEMORY_TTL_SECONDS });
}

async function existingProposalKeys(env) {
  try {
    const res = await fetch("https://realitymechanics.nz/api/garden/proposals", {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();
    const keys = await gardenMemoryKeys(env);
    for (const proposal of data.proposals || []) {
      if (proposal.status === "discarded" || proposal.status === "needs_preparation") continue;
      if (proposal.proposal_for) keys.add(String(proposal.proposal_for));
      if (proposal.id) keys.add(String(proposal.id));
    }
    return keys;
  } catch {
    return new Set();
  }
}

function proposalKeysFor(entry) {
  const slug = String(entry.title || entry.id || "entry").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return [entry.id, entry.sourcePath, `${slug}-${todayId()}`].filter(Boolean);
}

function clipped(text, max = 7000) {
  const value = String(text || "");
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n\n[content clipped for Garden Pass token budget]`;
}

function extractSections(content) {
  const source = String(content || "");
  const matches = [...source.matchAll(/^##\s+(.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    const body = source.slice(start, end).trim();
    return {
      name: match[1].trim(),
      wordCount: body ? body.split(/\s+/).length : 0,
      excerpt: clipped(body, SECTION_EXCERPT_CHARS),
    };
  });
}

function compactRelated(related) {
  const pack = (items = []) => items
    .filter((item) => item && !item.unresolved)
    .slice(0, 8)
    .map((item) => ({ id: item.id, title: item.title }));
  return {
    upstream: {
      holds: pack(related?.upstream?.holds),
      traces: pack(related?.upstream?.traces),
    },
    downstream: {
      carries: pack(related?.downstream?.carries),
    },
    lateral: {
      pairs: pack(related?.lateral?.pairs),
    },
    nesting: {
      nests: pack(related?.nesting?.nests),
    },
  };
}

async function chooseCandidate(env) {
  const existing = await existingProposalKeys(env);
  const priority = ["tending", "shading", "invasive", "planted", "dormant", "rooted"];
  const skippedSectionless = [];

  for (const gardenStatus of priority) {
    for (let page = 0; page < MAX_CANDIDATE_PAGES; page++) {
      const offset = page * CANDIDATE_PAGE_SIZE;
      const entries = await listByGardenStatus(env, gardenStatus, offset);
      if (!entries.length) break;
      const candidates = entries
        .filter((entry) => !proposalKeysFor(entry).some((key) => existing.has(key)))
        .sort((a, b) => String(a.sourcePath || a.id).localeCompare(String(b.sourcePath || b.id)))
        .slice(0, MAX_CANDIDATES);
      for (const candidate of candidates) {
        const entry = await mcpCall(env, "get_entry", { id: candidate.id });
        const sections = extractSections(entry.content);
        if (!sections.length) {
          skippedSectionless.push(entry.title || entry.id);
          continue;
        }
        return {
          entry,
          sections,
          reason: `selected ${gardenStatus} growth from page ${page + 1} without active Garden work`,
        };
      }
      if (entries.length < CANDIDATE_PAGE_SIZE) break;
    }
  }

  return {
    skipped: true,
    reason: skippedSectionless.length
      ? `no sectioned candidate without active Garden work; skipped ${skippedSectionless.length} sectionless entries`
      : "no candidate without active Garden work after paged scan",
  };
}

async function openaiJson(env, payload) {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  const sectionNames = payload.entry.sections.map((section) => section.name);
  if (!sectionNames.length) throw new Error("selected_entry_has_no_sections");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: GARDEN_FRAME,
      max_output_tokens: 2200,
      reasoning: { effort: "minimal" },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(payload),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "garden_pass_proposal",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["care_action", "kind", "confidence", "summary", "target_section", "replacement_text", "proposed_changes", "reciprocity_issues", "reason"],
            properties: {
              care_action: { type: "string", enum: Object.keys(CARE_ACTIONS) },
              kind: { type: "string", enum: ["reciprocity", "thin-section", "alignment", "drift", "clean-pass"] },
              confidence: { type: "string", enum: ["high", "medium", "low"] },
              summary: { type: "string", maxLength: 280 },
              target_section: { type: "string", enum: sectionNames },
              replacement_text: { type: "string", maxLength: 3600 },
              proposed_changes: { type: "string", maxLength: 1100 },
              reciprocity_issues: { type: "string", maxLength: 600 },
              reason: { type: "string", maxLength: 240 },
            },
          },
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "openai_error");
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((c) => c.type === "output_text")?.text;
  if (!text) {
    const outputTypes = (data.output || []).map((item) => `${item.type}:${item.status || "unknown"}`).join(",");
    throw new Error(`openai_empty_response status=${data.status || "unknown"} details=${JSON.stringify(data.incomplete_details || null)} output=${outputTypes}`);
  }
  return JSON.parse(text);
}

async function runGardenPass(env) {
  if (!env.OPENAI_API_KEY) {
    return { ok: true, skipped: true, reason: "OPENAI_API_KEY is not configured" };
  }

  const selected = await chooseCandidate(env);
  if (!selected || selected.skipped) {
    return { ok: true, skipped: true, reason: selected?.reason || "no candidate without active Garden work" };
  }

  const entry = selected.entry;
  const related = await mcpCall(env, "get_related", { id: selected.entry.id });
  const sections = selected.sections || extractSections(entry.content);

  const pass = await openaiJson(env, {
    instruction: "Perform one efficient Garden Pass on the selected entry. Use the structural digest; avoid token-heavy restatement. Return only the required JSON.",
    selection: selected,
    entry: {
      id: entry.id,
      title: entry.title,
      gardenStatus: entry.gardenStatus,
      status: entry.status,
      order: entry.order,
      type: entry.type,
      structure: entry.structure,
      opening: clipped(String(entry.content || "").split(/^##\s+/m)[0] || "", 1200),
      sections,
    },
    related: compactRelated(related),
  });

  const write = await mcpCall(env, "write_proposal", {
    entry_id: entry.id,
    kind: pass.kind,
    summary: `${pass.summary} Care action: ${pass.care_action}.`,
    proposed_changes: [
      `Care action: ${pass.care_action}`,
      `Reason: ${pass.reason}`,
      `Section: ${pass.target_section}`,
      "",
      "Proposed replacement:",
      pass.replacement_text,
      "",
      "Notes:",
      pass.proposed_changes,
    ].join("\n"),
    confidence: pass.confidence,
    reciprocity_issues: pass.reciprocity_issues || "None",
  }, true);

  if (!write.error) await rememberGardenPass(env, entry, write.proposalId, pass);

  return {
    ok: !write.error,
    entry: { id: entry.id, title: entry.title },
    selectionReason: selected.reason,
    careAction: pass.care_action,
    kind: pass.kind,
    proposalId: write.proposalId,
    write,
  };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      await recordSchedule(env, "api-gardener", { state: "wake" });
      const due = await scheduledDue(env, "api-gardener", 1);
      if (!due.due) {
        await recordSchedule(env, "api-gardener", { state: "skip", nextMs: due.nextMs || null, intervalMs: due.intervalMs });
        return;
      }
      try {
        const result = await runGardenPass(env);
        await recordSchedule(env, "api-gardener", {
          state: "ok",
          result: result?.skipped ? "skipped" : "ran",
          reason: result?.reason || null,
          entry: result?.entry?.title || null,
          proposalId: result?.proposalId || null,
        });
      } catch (error) {
        await recordSchedule(env, "api-gardener", { state: "error", error: error.message || "garden_pass_failed" });
        throw error;
      }
    })());
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      const pace = await readGardenPace(env);
      return json({
        name: "reality-mechanics-api-gardener",
        schedule: "paced",
        pace,
        baseSchedule: "1 garden hour at 1:1",
        endpoints: ["/run"],
      });
    }

    if (url.pathname === "/run") {
      if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
      if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
      try {
        return json(await runGardenPass(env));
      } catch (error) {
        return json({ ok: false, error: error.message || "garden_pass_failed" }, 500);
      }
    }

    return json({ error: "not_found" }, 404);
  },
};
