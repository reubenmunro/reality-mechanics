export const PULSE_INHABITANT = Object.freeze({
  id: "pulse",
  responsibility: "Express local recurrence as a deterministic symbolic pulse.",
  medium: "symbol",
  senses: Object.freeze([
    "participantState.experience.structuralObservations.movementRecurrence",
    "participantState.experience.structuralObservations.pathRecurrence",
    "participantState.experience.structuralObservations.revisitFrequency",
    "participantState.experience.structuralObservations.encounterInterval",
  ]),
});

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function tempoFromFrequency(localFrequency = {}) {
  const count = Number(localFrequency.count || 0);
  if (count <= 1) return "single";
  if (count <= 3) return "slow";
  if (count <= 8) return "quick";
  return "dense";
}

function symbolFromExperience(experience) {
  const observations = experience.structuralObservations || {};
  const movement = observations.movementRecurrence || {};
  const path = observations.pathRecurrence || {};
  const boundary = observations.boundaryTransition || {};
  const recurrence = experience.recurrence || {};
  const eventType = boundary.eventType || experience.rhythm?.currentEventType || "";
  if (path.isLoop || recurrence.isLoop) return "loop";
  if (eventType === "retrace" || recurrence.isRetrace) return "retrace";
  if (eventType === "return" || eventType === "absence_return" || recurrence.isReturn) return "return";
  if (movement.hasPriorEncounter || recurrence.hasPriorEncounter) return "familiar";
  if (eventType === "first_encounter") return "first";
  return "passage";
}

function intensityFromExperience(experience) {
  const observations = experience.structuralObservations || {};
  const movement = observations.movementRecurrence || {};
  const path = observations.pathRecurrence || {};
  const revisit = observations.revisitFrequency || {};
  const boundary = observations.boundaryTransition || {};
  const recurrence = experience.recurrence || {};
  const familiarity = Number(experience.familiarity?.score || 0);
  const localFrequency = revisit.localFrequency || experience.localFrequency || {};
  const frequency = clamp01(Number(localFrequency.count || 0) / 10);
  const eventType = boundary.eventType || experience.rhythm?.currentEventType || "";
  const recurrenceWeight = path.isLoop || recurrence.isLoop ? 1
    : eventType === "retrace" || recurrence.isRetrace ? 0.75
      : eventType === "return" || eventType === "absence_return" || recurrence.isReturn ? 0.65
        : movement.hasPriorEncounter || recurrence.hasPriorEncounter ? 0.5
          : 0.25;
  return round2(Math.max(familiarity, frequency, recurrenceWeight));
}

function freezeResponse(response) {
  Object.freeze(response.recurrence);
  return Object.freeze(response);
}

export function respondWithPulse(participantState) {
  const experience = participantState?.experience;
  const memory = participantState?.memory;
  if (!experience || !memory) {
    return Object.freeze({
      accepted: false,
      reason: "participant state requires memory and experience",
      inhabitant: PULSE_INHABITANT.id,
      response: null,
    });
  }

  if (memory.participantId !== experience.participantId) {
    return Object.freeze({
      accepted: false,
      reason: "participant state memory and experience do not match",
      inhabitant: PULSE_INHABITANT.id,
      response: null,
    });
  }

  const response = freezeResponse({
    medium: PULSE_INHABITANT.medium,
    symbol: symbolFromExperience(experience),
    intensity: intensityFromExperience(experience),
    tempo: tempoFromFrequency(experience.structuralObservations?.revisitFrequency?.localFrequency || experience.localFrequency),
    recurrence: {
      hasPriorEncounter: Boolean(experience.recurrence?.hasPriorEncounter),
      isReturn: Boolean(experience.recurrence?.isReturn),
      isRetrace: Boolean(experience.recurrence?.isRetrace),
      isLoop: Boolean(experience.recurrence?.isLoop),
    },
    eventId: experience.eventId,
    at: experience.at,
  });

  return Object.freeze({
    accepted: true,
    reason: "responded",
    inhabitant: PULSE_INHABITANT.id,
    response,
  });
}
