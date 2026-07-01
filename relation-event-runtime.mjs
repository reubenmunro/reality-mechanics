import {
  RELATION_EVENT_RUNTIME_CONTRACT,
  RELATION_FIELDS,
  STRUCTURAL_EVENT_TYPES,
  relationBetween,
} from "./atlas-structure-contract.mjs";

export const DEFAULT_FREQUENCY_WINDOW_MS = 60 * 1000;
export const DEFAULT_ABSENCE_RETURN_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_OVERLOAD_COUNT = 12;

function entryId(entry) {
  return typeof entry === "string" ? entry : entry?.id || "";
}

function entryStructure(entry) {
  return typeof entry === "object" && entry ? entry.structure || {} : {};
}

function eventTimeMs(event) {
  const value = event?.occurredAt || event?.timestamp || event?.time;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

function recentParticipantEvents(previousEvents, participantId, occurredAtMs, windowMs) {
  return previousEvents.filter((event) => {
    if (event?.participantId !== participantId) return false;
    const ms = eventTimeMs(event);
    return ms > 0 && occurredAtMs - ms <= windowMs;
  });
}

function participantTrace(previousEvents, participantId, toId, limit = 12) {
  const prior = previousEvents
    .filter((event) => event?.participantId === participantId)
    .map((event) => entryId(event.to))
    .filter(Boolean);
  return [...prior.slice(-limit + 1), toId].filter(Boolean);
}

function hasVisited(previousEvents, participantId, toId) {
  return previousEvents.some((event) => event?.participantId === participantId && entryId(event.to) === toId);
}

function lastVisit(previousEvents, participantId, toId) {
  return previousEvents
    .filter((event) => event?.participantId === participantId && entryId(event.to) === toId)
    .sort((a, b) => eventTimeMs(b) - eventTimeMs(a))[0] || null;
}

function completesLoop(trace) {
  if (trace.length < 4) return false;
  const last = trace[trace.length - 1];
  return trace.slice(0, -2).includes(last);
}

function classifyMovement({
  fromId,
  toId,
  relation,
  reciprocalRelation,
  trace,
  visited,
  lastVisited,
  recentCount,
  occurredAtMs,
  absenceReturnMs,
  overloadCount,
}) {
  if (!fromId) return visited ? "return" : "first_encounter";
  if (fromId === toId) return "settling";
  if (!relation.length && !reciprocalRelation.length) return "unexpected_ratio";
  if (recentCount >= overloadCount) return "overload";
  if (completesLoop(trace)) return "loop_completed";
  if (lastVisited && occurredAtMs - eventTimeMs(lastVisited) >= absenceReturnMs) return "absence_return";
  if (relation.some((field) => field === "holds" || field === "traces")) return "retrace";
  if (visited) return "return";
  return "transition";
}

export function observeParticipantMovement({
  participantId,
  fromEntry = null,
  toEntry,
  previousEvents = [],
  occurredAt = new Date().toISOString(),
  referenceFrame = "atlas",
  frequencyWindowMs = DEFAULT_FREQUENCY_WINDOW_MS,
  absenceReturnMs = DEFAULT_ABSENCE_RETURN_MS,
  overloadCount = DEFAULT_OVERLOAD_COUNT,
} = {}) {
  if (!participantId) throw new Error("participantId is required");
  const toId = entryId(toEntry);
  if (!toId) throw new Error("toEntry is required");

  const fromId = entryId(fromEntry);
  const occurredAtMs = Date.parse(occurredAt);
  const eventOccurredAtMs = Number.isFinite(occurredAtMs) ? occurredAtMs : Date.now();
  const eventOccurredAt = Number.isFinite(occurredAtMs) ? occurredAt : new Date(eventOccurredAtMs).toISOString();
  const fromStructure = entryStructure(fromEntry);
  const toStructure = entryStructure(toEntry);
  const relation = fromId ? relationBetween(fromStructure, toId) : [];
  const reciprocalRelation = fromId ? relationBetween(toStructure, fromId) : [];
  const recentEvents = recentParticipantEvents(previousEvents, participantId, eventOccurredAtMs, frequencyWindowMs);
  const trace = participantTrace(previousEvents, participantId, toId);
  const visited = hasVisited(previousEvents, participantId, toId);
  const lastVisited = lastVisit(previousEvents, participantId, toId);
  const type = classifyMovement({
    fromId,
    toId,
    relation,
    reciprocalRelation,
    trace,
    visited,
    lastVisited,
    recentCount: recentEvents.length,
    occurredAtMs: eventOccurredAtMs,
    absenceReturnMs,
    overloadCount,
  });

  const event = {
    id: `${participantId}:${eventOccurredAtMs}:${fromId || "start"}:${toId}`,
    participantId,
    type,
    from: fromId || null,
    to: toId,
    relation,
    referenceFrame,
    ratio: {
      left: fromId || null,
      right: toId,
      relation,
      reciprocalRelation,
      referenceFrame,
    },
    localFrequency: {
      windowMs: frequencyWindowMs,
      count: recentEvents.length + 1,
    },
    trace,
    occurredAt: eventOccurredAt,
  };

  return Object.freeze(event);
}

export function validateStructuralEvent(event) {
  const missing = RELATION_EVENT_RUNTIME_CONTRACT.eventFields.filter((field) => !(field in (event || {})));
  const invalidRelationFields = [...(event?.relation || []), ...(event?.ratio?.reciprocalRelation || [])]
    .filter((field) => !RELATION_FIELDS.includes(field));
  return {
    valid: missing.length === 0
      && STRUCTURAL_EVENT_TYPES.includes(event?.type)
      && invalidRelationFields.length === 0,
    missing,
    invalidType: STRUCTURAL_EVENT_TYPES.includes(event?.type) ? "" : event?.type || "missing type",
    invalidRelationFields,
  };
}
