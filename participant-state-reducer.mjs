import { deriveParticipantExperience } from "./participant-experience.mjs";
import { EMPTY_TRACE_MEMORY, rememberStructuralEvent } from "./trace-memory-listener.mjs";

export const EMPTY_PARTICIPANT_STATE = Object.freeze({
  memory: EMPTY_TRACE_MEMORY,
  experience: null,
  lastEventId: null,
  updatedAt: null,
});

export function reduceParticipantState(state = EMPTY_PARTICIPANT_STATE, event, options = {}) {
  const memoryResult = rememberStructuralEvent(state.memory, event, options.traceMemory);
  if (!memoryResult.accepted) {
    return Object.freeze({
      state,
      accepted: false,
      reason: memoryResult.reason,
    });
  }

  const experienceResult = deriveParticipantExperience(event, memoryResult.memory);
  if (!experienceResult.accepted) {
    return Object.freeze({
      state,
      accepted: false,
      reason: experienceResult.reason,
    });
  }

  const nextState = {
    memory: memoryResult.memory,
    experience: experienceResult.experience,
    lastEventId: event.id,
    updatedAt: event.occurredAt,
  };

  return Object.freeze({
    state: Object.freeze(nextState),
    accepted: true,
    reason: "reduced",
  });
}

export function reduceParticipantEvents(state = EMPTY_PARTICIPANT_STATE, events = [], options = {}) {
  return events.reduce((current, event) => {
    if (!current.accepted) return current;
    return reduceParticipantState(current.state, event, options);
  }, { state, accepted: true, reason: "reduced" });
}
