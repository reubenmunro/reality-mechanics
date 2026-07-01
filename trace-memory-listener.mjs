import { validateStructuralEvent } from "./relation-event-runtime.mjs";

export const DEFAULT_RECENT_PATH_LIMIT = 12;

export const EMPTY_TRACE_MEMORY = Object.freeze({
  participantId: "",
  visitCount: 0,
  returnCount: 0,
  retraceCount: 0,
  loopCount: 0,
  lastVisited: null,
  localFrequency: null,
  recentPath: Object.freeze([]),
  visitsByTerm: Object.freeze({}),
  lastEventId: null,
  previousUpdatedAt: null,
  updatedAt: null,
});

function cloneVisitsByTerm(visitsByTerm = {}) {
  return { ...visitsByTerm };
}

function appendPath(path = [], to, limit) {
  return [...path, to].filter(Boolean).slice(-limit);
}

function incrementWhen(count, condition) {
  return condition ? count + 1 : count;
}

export function rememberStructuralEvent(memory = EMPTY_TRACE_MEMORY, event, options = {}) {
  const validation = validateStructuralEvent(event);
  if (!validation.valid) {
    return Object.freeze({
      memory,
      accepted: false,
      reason: validation.missing.length
        ? `invalid structural event: missing ${validation.missing.join(", ")}`
        : `invalid structural event: ${validation.invalidType || validation.invalidRelationFields.join(", ")}`,
    });
  }

  const recentPathLimit = options.recentPathLimit || DEFAULT_RECENT_PATH_LIMIT;
  const participantId = memory.participantId || event.participantId;
  if (participantId !== event.participantId) {
    return Object.freeze({
      memory,
      accepted: false,
      reason: "event participant does not match memory participant",
    });
  }

  const visitsByTerm = cloneVisitsByTerm(memory.visitsByTerm);
  visitsByTerm[event.to] = (visitsByTerm[event.to] || 0) + 1;

  const nextMemory = {
    participantId,
    visitCount: memory.visitCount + 1,
    returnCount: incrementWhen(memory.returnCount, event.type === "return" || event.type === "absence_return"),
    retraceCount: incrementWhen(memory.retraceCount, event.type === "retrace"),
    loopCount: incrementWhen(memory.loopCount, event.type === "loop_completed"),
    lastVisited: event.to,
    localFrequency: event.localFrequency,
    recentPath: appendPath(memory.recentPath, event.to, recentPathLimit),
    visitsByTerm,
    lastEventId: event.id,
    previousUpdatedAt: memory.updatedAt,
    updatedAt: event.occurredAt,
  };

  Object.freeze(nextMemory.recentPath);
  Object.freeze(nextMemory.visitsByTerm);

  return Object.freeze({
    memory: Object.freeze(nextMemory),
    accepted: true,
    reason: "remembered",
  });
}

export function rememberStructuralEvents(memory = EMPTY_TRACE_MEMORY, events = [], options = {}) {
  return events.reduce((state, event) => {
    if (!state.accepted) return state;
    const result = rememberStructuralEvent(state.memory, event, options);
    return result.accepted ? result : { ...result, memory: state.memory };
  }, { memory, accepted: true, reason: "remembered" });
}
