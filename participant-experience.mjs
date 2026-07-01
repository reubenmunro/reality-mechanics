import { validateStructuralEvent } from "./relation-event-runtime.mjs";

export const FAMILIARITY_VISIT_CAP = 5;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function frequencyRate(localFrequency = {}) {
  const count = Number(localFrequency.count || 0);
  const windowMs = Number(localFrequency.windowMs || 0);
  return windowMs > 0 ? count / (windowMs / 1000) : 0;
}

function observedContinuations(path = [], currentTerm) {
  const counts = new Map();
  for (let index = 0; index < path.length - 1; index += 1) {
    if (path[index] !== currentTerm) continue;
    const next = path[index + 1];
    counts.set(next, (counts.get(next) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([to, count]) => Object.freeze({ from: currentTerm, to, count }))
    .sort((a, b) => b.count - a.count || a.to.localeCompare(b.to));
}

function relationShape(event) {
  return Object.freeze({
    direct: Object.freeze([...(event.relation || [])]),
    reciprocal: Object.freeze([...(event.ratio?.reciprocalRelation || [])]),
  });
}

function elapsedMs(from, to) {
  const fromMs = Date.parse(from || "");
  const toMs = Date.parse(to || "");
  return Number.isFinite(fromMs) && Number.isFinite(toMs) ? Math.max(0, toMs - fromMs) : null;
}

function eventOrder(value) {
  if (typeof value === "string") return "";
  return String(value?.entry_order || value?.order || "");
}

function structuralObservations(event, memory, localFrequency, priorTermVisitCount, continuations) {
  const relation = relationShape(event);
  const intervalMs = elapsedMs(memory.previousUpdatedAt, event.occurredAt);
  const fromOrder = eventOrder(event.from);
  const toOrder = eventOrder(event.to);
  const orderObserved = Boolean(fromOrder || toOrder);

  const observations = {
    movementRecurrence: Object.freeze({
      from: typeof event.from === "string" ? event.from : event.from?.id || null,
      to: typeof event.to === "string" ? event.to : event.to?.id || "",
      termVisitCount: memory.visitsByTerm?.[event.to] || 0,
      priorTermVisitCount,
      hasPriorEncounter: priorTermVisitCount > 0,
    }),
    relationRecurrence: Object.freeze({
      direct: relation.direct,
      reciprocal: relation.reciprocal,
      directCount: relation.direct.length,
      reciprocalCount: relation.reciprocal.length,
      hasDirectRelation: relation.direct.length > 0,
      hasReciprocalRelation: relation.reciprocal.length > 0,
    }),
    pathRecurrence: Object.freeze({
      recentPath: Object.freeze([...(memory.recentPath || [])]),
      recentPathLength: memory.recentPath?.length || 0,
      observedContinuations: Object.freeze(continuations),
      hasObservedContinuation: continuations.length > 0,
      isLoop: event.type === "loop_completed",
    }),
    revisitFrequency: Object.freeze({
      localFrequency,
      totalVisitCount: memory.visitCount,
      termVisitCount: memory.visitsByTerm?.[event.to] || 0,
    }),
    relationDwell: Object.freeze({
      observed: event.type === "settling",
      isSettling: event.type === "settling",
      intervalMs: event.type === "settling" ? intervalMs : null,
    }),
    encounterDuration: Object.freeze({
      observed: event.type === "settling",
      ms: event.type === "settling" ? intervalMs : null,
    }),
    encounterInterval: Object.freeze({
      observed: intervalMs !== null,
      ms: intervalMs,
    }),
    orderTransition: Object.freeze({
      observed: orderObserved,
      fromOrder,
      toOrder,
      changed: orderObserved ? fromOrder !== toOrder : false,
    }),
    boundaryTransition: Object.freeze({
      eventType: event.type,
      from: typeof event.from === "string" ? event.from : event.from?.id || null,
      to: typeof event.to === "string" ? event.to : event.to?.id || "",
      relation: relation.direct,
      reciprocalRelation: relation.reciprocal,
    }),
  };

  Object.freeze(observations);
  return observations;
}

export function deriveParticipantExperience(event, memory) {
  const validation = validateStructuralEvent(event);
  if (!validation.valid) {
    return Object.freeze({
      accepted: false,
      reason: validation.missing.length
        ? `invalid structural event: missing ${validation.missing.join(", ")}`
        : `invalid structural event: ${validation.invalidType || validation.invalidRelationFields.join(", ")}`,
      experience: null,
    });
  }

  if (!memory || memory.participantId !== event.participantId) {
    return Object.freeze({
      accepted: false,
      reason: "event participant does not match memory participant",
      experience: null,
    });
  }

  const termVisitCount = memory.visitsByTerm?.[event.to] || 0;
  const priorTermVisitCount = Math.max(0, termVisitCount - 1);
  const continuations = observedContinuations(memory.recentPath || [], event.to);
  const localFrequency = Object.freeze({
    ...(event.localFrequency || {}),
    ratePerSecond: frequencyRate(event.localFrequency),
  });
  const observations = structuralObservations(event, memory, localFrequency, priorTermVisitCount, continuations);

  const experience = {
    participantId: event.participantId,
    eventId: event.id,
    at: event.occurredAt,
    term: event.to,
    relation: relationShape(event),
    recurrence: Object.freeze({
      termVisitCount,
      priorTermVisitCount,
      hasPriorEncounter: priorTermVisitCount > 0,
      isReturn: event.type === "return" || event.type === "absence_return",
      isRetrace: event.type === "retrace",
      isLoop: event.type === "loop_completed",
      returnCount: memory.returnCount,
      retraceCount: memory.retraceCount,
      loopCount: memory.loopCount,
    }),
    familiarity: Object.freeze({
      termVisitCount,
      totalVisitCount: memory.visitCount,
      score: clamp01(termVisitCount / FAMILIARITY_VISIT_CAP),
    }),
    anticipation: Object.freeze({
      observedContinuations: Object.freeze(continuations),
      hasObservedContinuation: continuations.length > 0,
    }),
    rhythm: Object.freeze({
      localFrequency,
      recentPathLength: memory.recentPath?.length || 0,
      currentEventType: event.type,
    }),
    localFrequency,
    structuralObservations: observations,
  };

  return Object.freeze({
    accepted: true,
    reason: "derived",
    experience: Object.freeze(experience),
  });
}
