const DEFAULT_GARDEN_URL = "https://realitymechanics.nz";
const DEFAULT_MCP_URL = "https://mcp.realitymechanics.nz/mcp";
const GROUND_CHECK_BASE_HOURS = 1;
const MAX_PROPOSALS = 12;

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

async function gardenFetch(env, path, options = {}) {
  const res = await fetch(`${env.GARDEN_URL || DEFAULT_GARDEN_URL}${path}`, {
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
  if (result?.error) throw new Error(`${name}: ${result.error}`);
  return result;
}

function extractSections(content) {
  const sections = [];
  const re = /^##\s+(.+)$/gm;
  let match;
  while ((match = re.exec(content || ""))) sections.push(match[1].trim());
  return sections;
}

function parseConcreteProposal(proposedChanges) {
  const text = String(proposedChanges || "");
  const sectionMatch = text.match(/^Section:\s*(.+)$/mi);
  const replacementMatch = text.match(/^Proposed replacement:\s*\n([\s\S]*?)(?:\n\n(?:Notes|Reason|Care action):|$)/mi);
  const section = String(sectionMatch?.[1] || "").replace(/^#+\s*/, "").trim();
  const replacement = String(replacementMatch?.[1] || "").trim();
  return { section, replacement };
}

function noteText(proposedChanges) {
  return String(proposedChanges || "").match(/^Notes:\s*\n([\s\S]*)$/mi)?.[1]?.trim() || "";
}

function fail(reason) {
  return { ok: false, reason };
}

function localGroundCheck(proposal, entry) {
  if (proposal.steward_action !== "light") return fail("waiting for steward light");
  if (Number(proposal.shade_count || 0) > 0) return fail("proposal has shade");
  if (!proposal.proposal_for) return fail("missing entry id");

  const patch = parseConcreteProposal(proposal.proposed_changes);
  if (!patch.section || !patch.replacement) return fail("missing section or replacement");
  if (patch.replacement.length < 40) return fail("replacement too thin");
  if (patch.replacement.length > 3600) return fail("replacement too broad");
  if (/^#{1,6}\s+/m.test(patch.replacement)) return fail("replacement contains heading");
  if (/\b(new term|create new term|invent|placeholder|todo)\b/i.test(patch.replacement)) return fail("replacement carries meta-language");

  const notes = noteText(proposal.proposed_changes);
  if (notes.length > 260) return fail("notes too long");
  if (/\b(as an ai|language model|proposal|should be reviewed|human)\b/i.test(notes)) return fail("notes carry process language");

  const sections = extractSections(entry.content);
  const matchedSection = sections.find((section) => section.toLowerCase() === patch.section.toLowerCase());
  if (!matchedSection) return fail(`section not found: ${patch.section}`);

  const lowerSummary = String(proposal.summary || "").toLowerCase();
  if (/\b(root order|ground order|delete|remove the whole|rewrite all|entire entry)\b/.test(lowerSummary)) return fail("too broad for automatic entry");

  return { ok: true, section: matchedSection };
}

async function reviewProposal(env, proposal) {
  if (!proposal.proposal_for) return { proposalId: proposal.id, term: proposal.term, approved: false, reason: "missing entry id" };
  const entry = await mcpCall(env, "get_entry", { id: proposal.proposal_for });
  const check = localGroundCheck(proposal, entry);

  if (!check.ok) {
    if (check.reason !== "waiting for steward light") {
      await gardenFetch(env, `/api/garden/steward-note/${encodeURIComponent(proposal.id)}`, {
        method: "POST",
        body: JSON.stringify({ action: "ground_check_hold", note: check.reason }),
        headers: { "Content-Type": "application/json" },
      });
    }
    return { proposalId: proposal.id, term: proposal.term, approved: false, reason: check.reason };
  }

  await gardenFetch(env, `/api/garden/steward-note/${encodeURIComponent(proposal.id)}`, {
    method: "POST",
    body: JSON.stringify({ action: "ground_check_pass", note: "ground check passed" }),
    headers: { "Content-Type": "application/json" },
  });
  await gardenFetch(env, `/api/garden/approve/${encodeURIComponent(proposal.id)}`, { method: "POST" });
  return { proposalId: proposal.id, term: proposal.term, approved: true, section: check.section };
}

async function runGroundCheck(env) {
  const data = await gardenFetch(env, "/api/garden/proposals");
  const proposals = (data.proposals || [])
    .filter((proposal) => proposal.status === "pending")
    .filter((proposal) => proposal.stewarded_at)
    .slice(0, MAX_PROPOSALS);

  if (!proposals.length) return { ok: true, skipped: true, reason: "no stewarded pending proposal" };

  const results = [];
  for (const proposal of proposals) {
    try {
      results.push(await reviewProposal(env, proposal));
    } catch (error) {
      results.push({ proposalId: proposal.id, term: proposal.term, approved: false, error: error.message || "ground_check_failed" });
    }
  }

  return {
    ok: results.every((result) => !result.error),
    role: "garden-ground-check",
    inspected: proposals.length,
    approved: results.filter((result) => result.approved).length,
    held: results.filter((result) => !result.approved).length,
    results,
  };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      await recordSchedule(env, "garden-ground-check", { state: "wake" });
      const due = await scheduledDue(env, "garden-ground-check", GROUND_CHECK_BASE_HOURS);
      if (!due.due) {
        await recordSchedule(env, "garden-ground-check", { state: "skip", nextMs: due.nextMs || null, intervalMs: due.intervalMs });
        return;
      }
      try {
        const result = await runGroundCheck(env);
        await recordSchedule(env, "garden-ground-check", {
          state: "ok",
          result: result?.skipped ? "skipped" : "ran",
          reason: result?.reason || null,
          inspected: result?.inspected ?? null,
          approved: result?.approved ?? null,
          held: result?.held ?? null,
        });
      } catch (error) {
        await recordSchedule(env, "garden-ground-check", { state: "error", error: error.message || "ground_check_failed" });
        throw error;
      }
    })());
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      const pace = await readGardenPace(env);
      return json({
        name: "reality-mechanics-garden-ground-check",
        schedule: "paced",
        pace,
        baseSchedule: "1 garden hour at 1:1",
        mode: "auto-approve steward-lit grounded edits",
        endpoints: ["/run"],
      });
    }

    if (url.pathname === "/run") {
      if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
      if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
      try {
        return json(await runGroundCheck(env));
      } catch (error) {
        return json({ ok: false, error: error.message || "ground_check_failed" }, 500);
      }
    }

    return json({ error: "not_found" }, 404);
  },
};
