const DEFAULT_GARDEN_URL = "https://realitymechanics.nz";
const DEFAULT_MCP_URL = "https://mcp.realitymechanics.nz/mcp";
const DEFAULT_MODEL = "gpt-5";
const MAX_PROPOSALS = 12;
const STEWARD_BASE_HOURS = 1;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

const STEWARD_FRAME = `
You are the Atlas Garden Steward.

Walk the Garden queue and make a narrow supervisory judgement.
Do not write Atlas content. Do not apply changes. Do not ground entries. Do not create new proposals.

Allowed actions:
- none: leave the proposal alone, only record a note
- light: add one steward light when the proposal is concrete, low-risk, and prepared
- shade: add one steward shade when the proposal is risky, broad, under-traced, or needs human attention
- needs_preparation: mark the proposal for gardener preparation when it lacks a concrete Section and Proposed replacement

Prefer no action when uncertain. Keep notes short, specific, and about process state.
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

function hasPreparedReplacement(proposal) {
  const text = String(proposal.proposed_changes || "");
  const sectionMatch = text.match(/^Section:\s*(.+)$/mi);
  const replacementMatch = text.match(/^Proposed replacement:\s*\n([\s\S]*?)(?:\n\n(?:Notes|Reason|Care action):|$)/mi);
  const section = String(sectionMatch?.[1] || "").replace(/^#+\s*/, "").trim();
  const replacement = String(replacementMatch?.[1] || "").trim();
  return Boolean(section && replacement);
}

function parseConcreteProposal(proposal) {
  const text = String(proposal.proposed_changes || "");
  const sectionMatch = text.match(/^Section:\s*(.+)$/mi);
  const replacementMatch = text.match(/^Proposed replacement:\s*\n([\s\S]*?)(?:\n\n(?:Notes|Reason|Care action):|$)/mi);
  return {
    section: String(sectionMatch?.[1] || "").replace(/^#+\s*/, "").trim(),
    replacement: String(replacementMatch?.[1] || "").trim(),
  };
}

function noteText(proposal) {
  return String(proposal.proposed_changes || "").match(/^Notes:\s*\n([\s\S]*)$/mi)?.[1]?.trim() || "";
}

function extractSections(content) {
  const sections = [];
  const re = /^##\s+(.+)$/gm;
  let match;
  while ((match = re.exec(content || ""))) sections.push(match[1].trim());
  return sections;
}

async function gardenFetch(env, path, options = {}) {
  const res = await fetch(`${env.GARDEN_URL || DEFAULT_GARDEN_URL}${path}`, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
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

async function signal(env, proposalId, kind) {
  return gardenFetch(env, `/api/garden/${kind}/${encodeURIComponent(proposalId)}`, {
    method: "POST",
    body: JSON.stringify({ voter_id: "ai-steward" }),
  });
}

async function stewardNote(env, proposalId, action, note) {
  return gardenFetch(env, `/api/garden/steward-note/${encodeURIComponent(proposalId)}`, {
    method: "POST",
    body: JSON.stringify({ action, note }),
  });
}

async function openaiJson(env, payload) {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: STEWARD_FRAME,
      max_output_tokens: 1200,
      reasoning: { effort: "minimal" },
      input: [{ role: "user", content: [{ type: "input_text", text: JSON.stringify(payload) }] }],
      text: {
        format: {
          type: "json_schema",
          name: "garden_steward_judgement",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["action", "note", "confidence"],
            properties: {
              action: { type: "string", enum: ["none", "light", "shade", "needs_preparation"] },
              note: { type: "string", maxLength: 320 },
              confidence: { type: "string", enum: ["high", "medium", "low"] },
            },
          },
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "openai_error");
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((c) => c.type === "output_text")?.text;
  if (!text) throw new Error("openai_empty_response");
  return JSON.parse(text);
}

function localJudgement(proposal) {
  if (!hasPreparedReplacement(proposal)) {
    return {
      action: "needs_preparation",
      confidence: "high",
      note: "Not ready for the Garden Cycle: this needs a concrete Section and Proposed replacement before it can be transplanted.",
    };
  }

  const shade = Number(proposal.shade_count || 0);
  if (shade >= 2) {
    return {
      action: "none",
      confidence: "medium",
      note: "Already shaded enough to slow down; leave it for human review rather than adding more pressure.",
    };
  }

  return null;
}

async function judgeProposal(env, proposal) {
  const local = localJudgement(proposal);
  if (local) return local;

  return openaiJson(env, {
    proposal: {
      id: proposal.id,
      term: proposal.term,
      status: proposal.status,
      kind: proposal.kind,
      confidence: proposal.confidence,
      order: proposal.order,
      summary: proposal.summary,
      proposed_changes: String(proposal.proposed_changes || "").slice(0, 2600),
      reciprocity_issues: String(proposal.reciprocity_issues || "").slice(0, 800),
      light_count: proposal.light_count || 0,
      shade_count: proposal.shade_count || 0,
      steward_note: proposal.steward_note || "",
    },
    checks: [
      "Is it concrete enough for Garden Cycle?",
      "Is it too broad or risky?",
      "Does it deserve light, shade, needs_preparation, or no action?",
    ],
  });
}

async function applyJudgement(env, proposal, judgement) {
  let applied = "note";
  if (judgement.action === "needs_preparation") {
    await gardenFetch(env, `/api/garden/needs-preparation/${encodeURIComponent(proposal.id)}`, { method: "POST" });
    applied = "needs_preparation";
  } else if (judgement.action === "light" || judgement.action === "shade") {
    await signal(env, proposal.id, judgement.action);
    applied = judgement.action;
  }

  await stewardNote(env, proposal.id, judgement.action, judgement.note);
  return { proposalId: proposal.id, term: proposal.term, action: judgement.action, applied, confidence: judgement.confidence };
}

function groundCheck(proposal, entry) {
  const lit = proposal.steward_action === "light" || Number(proposal.light_count || 0) > 0;
  if (!lit) return { ok: false, reason: "waiting for steward light" };
  if (Number(proposal.shade_count || 0) > 0) return { ok: false, reason: "proposal has shade" };
  if (!proposal.proposal_for) return { ok: false, reason: "missing entry id" };

  const patch = parseConcreteProposal(proposal);
  if (!patch.section || !patch.replacement) return { ok: false, reason: "missing section or replacement" };
  if (patch.replacement.length < 40) return { ok: false, reason: "replacement too thin" };
  if (patch.replacement.length > 3600) return { ok: false, reason: "replacement too broad" };
  if (/^#{1,6}\s+/m.test(patch.replacement)) return { ok: false, reason: "replacement contains heading" };
  if (/\b(new term|create new term|invent|placeholder|todo)\b/i.test(patch.replacement)) return { ok: false, reason: "replacement carries meta-language" };

  const notes = noteText(proposal);
  if (notes.length > 260) return { ok: false, reason: "notes too long" };
  if (/\b(as an ai|language model|proposal|should be reviewed|human)\b/i.test(notes)) return { ok: false, reason: "notes carry process language" };

  const sections = extractSections(entry.content);
  const matchedSection = sections.find((section) => section.toLowerCase() === patch.section.toLowerCase());
  if (!matchedSection) return { ok: false, reason: `section not found: ${patch.section}` };

  const lowerSummary = String(proposal.summary || "").toLowerCase();
  if (/\b(root order|ground order|delete|remove the whole|rewrite all|entire entry)\b/.test(lowerSummary)) return { ok: false, reason: "too broad for automatic entry" };

  return { ok: true, section: matchedSection };
}

async function runGroundCheckPass(env, proposals) {
  const candidates = proposals
    .filter((proposal) => proposal.status === "pending" || proposal.status === "approved")
    .filter((proposal) => proposal.steward_action !== "ground_check_pass")
    .filter((proposal) => proposal.steward_action === "light" || Number(proposal.light_count || 0) > 0)
    .slice(0, MAX_PROPOSALS);

  if (!candidates.length) return { inspected: 0, approved: 0, held: 0, results: [] };

  const results = [];
  for (const proposal of candidates) {
    try {
      if (!proposal.proposal_for) {
        await stewardNote(env, proposal.id, "ground_check_hold", "missing entry id");
        await gardenFetch(env, `/api/garden/needs-preparation/${encodeURIComponent(proposal.id)}`, { method: "POST" });
        results.push({ proposalId: proposal.id, term: proposal.term, approved: false, reason: "missing entry id" });
        continue;
      }

      const entry = await mcpCall(env, "get_entry", { id: proposal.proposal_for });
      const check = groundCheck(proposal, entry);
      if (!check.ok) {
        await stewardNote(env, proposal.id, "ground_check_hold", check.reason);
        await gardenFetch(env, `/api/garden/needs-preparation/${encodeURIComponent(proposal.id)}`, { method: "POST" });
        results.push({ proposalId: proposal.id, term: proposal.term, approved: false, reason: check.reason });
        continue;
      }

      await stewardNote(env, proposal.id, "ground_check_pass", "ground check passed");
      await gardenFetch(env, `/api/garden/approve/${encodeURIComponent(proposal.id)}`, { method: "POST" });
      results.push({ proposalId: proposal.id, term: proposal.term, approved: true, section: check.section });
    } catch (error) {
      results.push({ proposalId: proposal.id, term: proposal.term, ok: false, error: error.message || "ground_check_failed" });
    }
  }

  return {
    inspected: candidates.length,
    approved: results.filter((result) => result.approved).length,
    held: results.filter((result) => !result.approved).length,
    results,
  };
}

async function runStewardPass(env) {
  const data = await gardenFetch(env, "/api/garden/proposals");
  const allProposals = data.proposals || [];
  const proposals = allProposals
    .filter((proposal) => ["pending", "approved"].includes(proposal.status))
    .filter((proposal) => !proposal.stewarded_at)
    .slice(0, MAX_PROPOSALS);

  const results = [];
  for (const proposal of proposals) {
    try {
      const judgement = await judgeProposal(env, proposal);
      results.push(await applyJudgement(env, proposal, judgement));
    } catch (error) {
      results.push({ proposalId: proposal.id, ok: false, error: error.message || "steward_failed" });
    }
  }

  const freshData = await gardenFetch(env, "/api/garden/proposals");
  const ground = await runGroundCheckPass(env, freshData.proposals || allProposals);

  if (!proposals.length && !ground.inspected) {
    return { ok: true, skipped: true, reason: "no open proposals needing steward or ground check" };
  }

  return {
    ok: results.every((result) => result.ok !== false) && ground.results.every((result) => result.ok !== false),
    role: "garden-steward",
    inspected: proposals.length,
    groundChecked: ground.inspected,
    approved: ground.approved,
    held: ground.held,
    results,
  };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      await recordSchedule(env, "garden-steward", { state: "wake" });
      const pace = await readGardenPace(env);
      const intervalMs = Math.max(60 * 1000, STEWARD_BASE_HOURS * 3600000 / pace);
      if (env.GARDEN) await env.GARDEN.put("schedule:garden-steward:last_run", String(Date.now()));
      try {
        const result = await runStewardPass(env);
        await recordSchedule(env, "garden-steward", {
          state: "ok",
          result: result?.skipped ? "skipped" : "ran",
          reason: result?.reason || null,
          intervalMs,
          inspected: result?.inspected ?? null,
          groundChecked: result?.groundChecked ?? null,
          approved: result?.approved ?? null,
          held: result?.held ?? null,
        });
      } catch (error) {
        await recordSchedule(env, "garden-steward", { state: "error", error: error.message || "steward_pass_failed" });
        throw error;
      }
    })());
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      const pace = await readGardenPace(env);
      return json({
        name: "reality-mechanics-garden-steward",
        schedule: "paced",
        pace,
        baseSchedule: "1 garden hour at 1:1",
        role: "supervise Garden state only",
        endpoints: ["/run"],
      });
    }

    if (url.pathname === "/run") {
      if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
      if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
      try {
        return json(await runStewardPass(env));
      } catch (error) {
        return json({ ok: false, error: error.message || "steward_pass_failed" }, 500);
      }
    }

    return json({ error: "not_found" }, 404);
  },
};
