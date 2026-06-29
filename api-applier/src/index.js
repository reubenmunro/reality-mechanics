const DEFAULT_MCP_URL = "https://mcp.realitymechanics.nz/mcp";
const DEFAULT_GARDEN_URL = "https://realitymechanics.nz";
const APPLY_BASE_HOURS = 1;
const NORMAL_APPLY_LIMIT = 2;
const CATCHUP_APPLY_LIMIT = 6;
const FETCH_TIMEOUT_MS = 20000;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

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

function groundedEligibility(proposal) {
  const shade = Number(proposal.shade_count || 0);
  if (shade >= 3) return { eligible: false, reason: "held in shade for review" };
  if (proposal.steward_action !== "ground_check_pass") return { eligible: false, reason: "waiting for ground check" };
  return { eligible: true, reason: "grounded" };
}

function applyLimitFor(backlog) {
  if (backlog >= 100) return CATCHUP_APPLY_LIMIT;
  if (backlog >= 50) return 5;
  if (backlog >= 20) return 4;
  return NORMAL_APPLY_LIMIT;
}

async function fetchWithTimeout(resource, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timeout"), FETCH_TIMEOUT_MS);
  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
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

function extractSections(content) {
  const sections = [];
  const re = /^##\s+(.+)$/gm;
  let match;
  while ((match = re.exec(content || ""))) sections.push(match[1].trim());
  return sections;
}

function normalizeSectionName(section) {
  return String(section || "").replace(/^#+\s*/, "").trim();
}

function parseConcreteProposal(proposedChanges) {
  const text = String(proposedChanges || "");
  const sectionMatch = text.match(/^Section:\s*(.+)$/mi);
  const replacementMatch = text.match(/^Proposed replacement:\s*\n([\s\S]*?)(?:\n\n(?:Notes|Reason|Care action):|$)/mi);
  const section = normalizeSectionName(sectionMatch?.[1] || "");
  const newText = String(replacementMatch?.[1] || "").trim();
  if (!section || !newText) return null;
  return {
    apply: true,
    section,
    new_text: newText,
    reason: "Applied concrete Garden proposal replacement.",
  };
}

async function mcpCall(env, name, args = {}, auth = false) {
  const res = await fetchWithTimeout(env.MCP_URL || DEFAULT_MCP_URL, {
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
  if (result?.error) throw new Error(`${name}: ${result.error}`);
  return result;
}

async function gardenFetch(env, path, options = {}) {
  const res = await fetchWithTimeout(`${env.GARDEN_URL || DEFAULT_GARDEN_URL}${path}`, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options.headers || {}),
      ...(env.GARDEN_SECRET ? { "Authorization": `Bearer ${env.GARDEN_SECRET}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `garden_http_${res.status}`);
  return data;
}

async function approvedReadyProposals(env, options = {}) {
  const force = !!options.force;
  const data = await gardenFetch(env, "/api/garden/proposals", { headers: {} });
  const approved = (data.proposals || [])
    .filter((proposal) => proposal.status === "approved")
    .map((proposal) => ({ proposal, eligibility: groundedEligibility(proposal) }))
    .filter(({ eligibility }) => force ? eligibility.reason !== "held in shade for review" : eligibility.eligible)
    .sort((a, b) => String(a.proposal.proposed_at || a.proposal.logged_at || "").localeCompare(String(b.proposal.proposed_at || b.proposal.logged_at || "")));
  const limit = force ? CATCHUP_APPLY_LIMIT : applyLimitFor(approved.length);
  const selected = approved.slice(0, limit);

  if (!selected.length) {
    const next = (data.proposals || [])
      .filter((proposal) => proposal.status === "approved")
      .map((proposal) => ({ id: proposal.id, term: proposal.term, eligibility: groundedEligibility(proposal) }))
      .find((proposal) => proposal.eligibility.reason);
    return { proposals: [], next, backlog: approved.length, limit };
  }

  const proposals = [];
  for (const { proposal: summary } of selected) {
    const detail = await gardenFetch(env, `/api/garden/proposal/${encodeURIComponent(summary.id)}`);
    proposals.push({ ...summary, ...detail });
  }
  return { proposals, next: null, backlog: approved.length, limit };
}

async function applyProposal(env, proposal) {
  const entryId = proposal.proposal_for;
  if (!entryId) return { ok: false, skipped: true, reason: "proposal missing proposal_for", proposalId: proposal.id };

  const entry = await mcpCall(env, "get_entry", { id: entryId });
  const sections = extractSections(entry.content);

  const concretePatch = parseConcreteProposal(proposal.proposed_changes);
  const patch = concretePatch;

  if (!patch?.apply) {
    await gardenFetch(env, `/api/garden/needs-preparation/${encodeURIComponent(proposal.id)}`, { method: "POST" });
    return {
      ok: true,
      skipped: true,
      proposalId: proposal.id,
      entry: { id: entry.id, title: entry.title },
      reason: "Garden Cycle only transplants prepared replacements; marked needs_preparation for a gardener to add Section and Proposed replacement.",
    };
  }

  const patchSection = normalizeSectionName(patch.section);
  const matchedSection = sections.find((section) => section.toLowerCase() === patchSection.toLowerCase());
  if (!matchedSection) {
    await gardenFetch(env, `/api/garden/needs-preparation/${encodeURIComponent(proposal.id)}`, { method: "POST" });
    return {
      ok: true,
      skipped: true,
      proposalId: proposal.id,
      entry: { id: entry.id, title: entry.title },
      reason: `section_not_found: ${patch.section}`,
    };
  }

  const update = await mcpCall(env, "update_entry_section", {
    id: entry.id,
    section: matchedSection,
    new_text: patch.new_text,
  }, true);

  await gardenFetch(env, `/api/garden/complete/${encodeURIComponent(proposal.id)}`, { method: "POST" });

  return {
    ok: true,
    proposalId: proposal.id,
    entry: { id: entry.id, title: entry.title },
    section: matchedSection,
    reason: patch.reason,
    update,
  };
}

async function runApplyPass(env, options = {}) {
  const selected = await approvedReadyProposals(env, options);
  if (!selected.proposals.length) {
    return { ok: true, skipped: true, reason: "no grounded approved proposal", next: selected.next || null, backlog: selected.backlog || 0, limit: selected.limit || NORMAL_APPLY_LIMIT };
  }

  const results = [];
  for (const proposal of selected.proposals) {
    try {
      results.push(await applyProposal(env, proposal));
    } catch (error) {
      try {
        await gardenFetch(env, `/api/garden/needs-preparation/${encodeURIComponent(proposal.id)}`, { method: "POST" });
        results.push({
          ok: true,
          skipped: true,
          proposalId: proposal.id,
          entryId: proposal.proposal_for || null,
          reason: error.message || "apply_proposal_failed",
        });
      } catch (markError) {
        results.push({
          ok: false,
          proposalId: proposal.id,
          entryId: proposal.proposal_for || null,
          error: error.message || markError.message || "apply_proposal_failed",
        });
      }
    }
  }

  return {
    ok: results.every((result) => result.ok || result.skipped),
    force: !!options.force,
    role: "garden-cycle",
    attempted: selected.proposals.length,
    applied: results.filter((result) => result.ok && !result.skipped).length,
    skipped: results.filter((result) => result.skipped).length,
    failed: results.filter((result) => !result.ok && !result.skipped).length,
    backlog: selected.backlog,
    limit: selected.limit,
    firstSkip: results.find((result) => result.skipped)?.reason || null,
    firstFailure: results.find((result) => !result.ok && !result.skipped)?.error || null,
    results,
  };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      await recordSchedule(env, "garden-cycle", { state: "wake" });
      const pace = await readGardenPace(env);
      const intervalMs = Math.max(60 * 1000, APPLY_BASE_HOURS * 3600000 / pace);
      if (env.GARDEN) await env.GARDEN.put("schedule:garden-cycle:last_run", String(Date.now()));
      try {
        const result = await runApplyPass(env);
        await recordSchedule(env, "garden-cycle", {
          state: "ok",
          result: result?.attempted ? "ran" : result?.skipped ? "skipped" : "ran",
          reason: result?.reason || null,
          intervalMs,
          attempted: result?.attempted ?? null,
          applied: result?.applied ?? null,
          failed: result?.failed ?? null,
          skipped: result?.skipped ?? null,
          backlog: result?.backlog ?? null,
          limit: result?.limit ?? null,
          firstSkip: result?.firstSkip || null,
          firstFailure: result?.firstFailure || null,
          next: result?.next?.term || result?.next?.id || null,
        });
      } catch (error) {
        await recordSchedule(env, "garden-cycle", { state: "error", error: error.message || "apply_pass_failed" });
        throw error;
      }
    })());
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      const pace = await readGardenPace(env);
      return json({
        name: "reality-mechanics-garden-cycle",
        schedule: "paced",
        pace,
        baseSchedule: "1 garden hour at 1:1",
        mode: "transplant prepared approved growth",
        endpoints: ["/run"],
      });
    }

    if (url.pathname === "/run") {
      if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
      if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
      try {
        return json(await runApplyPass(env, { force: url.searchParams.get("force") === "1" }));
      } catch (error) {
        return json({ ok: false, error: error.message || "apply_pass_failed" }, 500);
      }
    }

    return json({ error: "not_found" }, 404);
  },
};
