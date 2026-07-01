import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { observeParticipantMovement } from "../relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantState } from "../participant-state-reducer.mjs";
import { respondWithPulse } from "../pulse-inhabitant.mjs";
import { respondWithThreshold } from "../threshold-inhabitant.mjs";
import { gatherSymbolicResponses } from "../symbolic-inhabitant-composer.mjs";
import { firstArkEntry, getArkEntry, relatedArkEntries } from "./atlas-structure.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 8791);
const sessions = new Map();

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body, null, 2));
}

function participantIdFrom(request) {
  return request.headers["x-ark-participant"] || "local-participant";
}

function publicState(entry, runtimeEvent, participantState, gathered) {
  return {
    entry: { id: entry.id, title: entry.title },
    related: relatedArkEntries(entry),
    event: runtimeEvent,
    participant: {
      memory: participantState.memory,
      experience: participantState.experience,
    },
    inhabitants: gathered.responses,
    rejectedInhabitants: gathered.rejected,
  };
}

function reduceMovement({ participantId, fromEntry, toEntry, previousEvents }) {
  const runtimeEvent = observeParticipantMovement({
    participantId,
    fromEntry,
    toEntry,
    previousEvents,
    occurredAt: new Date().toISOString(),
  });
  const previous = sessions.get(participantId) || {
    state: EMPTY_PARTICIPANT_STATE,
    events: [],
    entry: null,
  };
  const reduced = reduceParticipantState(previous.state, runtimeEvent);
  if (!reduced.accepted) return { accepted: false, reason: reduced.reason };
  const gathered = gatherSymbolicResponses(reduced.state, [respondWithPulse, respondWithThreshold]);
  const nextSession = {
    state: reduced.state,
    events: [...previous.events, runtimeEvent],
    entry: toEntry,
  };
  sessions.set(participantId, nextSession);
  return {
    accepted: true,
    body: publicState(toEntry, runtimeEvent, reduced.state, gathered),
  };
}

async function readRequestJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

async function serveStatic(res, pathname) {
  const file = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const target = path.join(publicDir, file);
  if (!target.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const ext = path.extname(target);
  const type = ext === ".js" ? "text/javascript" : ext === ".css" ? "text/css" : "text/html";
  try {
    const content = await readFile(target);
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = createServer(async (request, res) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const participantId = participantIdFrom(request);

    if (request.method === "POST" && url.pathname === "/api/enter") {
      sessions.delete(participantId);
      const entry = firstArkEntry();
      const result = reduceMovement({ participantId, fromEntry: null, toEntry: entry, previousEvents: [] });
      return result.accepted ? json(res, 200, result.body) : json(res, 400, result);
    }

    if (request.method === "POST" && url.pathname === "/api/move") {
      const input = await readRequestJson(request);
      const session = sessions.get(participantId);
      if (!session?.entry) return json(res, 409, { error: "enter the Ark before moving" });
      const target = getArkEntry(input.to);
      if (!target) return json(res, 404, { error: "unknown target" });
      const allowed = relatedArkEntries(session.entry).some((entry) => entry.id === target.id);
      if (!allowed) return json(res, 400, { error: "target is not related to current entry" });
      const result = reduceMovement({
        participantId,
        fromEntry: session.entry,
        toEntry: target,
        previousEvents: session.events,
      });
      return result.accepted ? json(res, 200, result.body) : json(res, 400, result);
    }

    return serveStatic(res, url.pathname);
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Minimal Ark running at http://127.0.0.1:${port}`);
});
