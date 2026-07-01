export const THRESHOLD_INHABITANT = Object.freeze({
  id: "threshold",
  responsibility: "Express participant boundary/contact state as a deterministic symbol.",
  medium: "symbol",
  senses: Object.freeze([
    "participantState.experience.structuralObservations.relationDwell",
    "participantState.experience.structuralObservations.boundaryTransition",
    "participantState.experience.structuralObservations.orderTransition",
    "participantState.experience.structuralObservations.movementRecurrence",
  ]),
});

function hasAny(values = [], expected = []) {
  return values.some((value) => expected.includes(value));
}

function symbolFromExperience(experience) {
  const observations = experience.structuralObservations || {};
  const boundary = observations.boundaryTransition || {};
  const relation = observations.relationRecurrence || {};
  const dwell = observations.relationDwell || {};
  const eventType = boundary.eventType || experience.rhythm?.currentEventType || "";
  const recurrence = experience.recurrence || {};
  const direct = relation.direct || experience.relation?.direct || [];
  const reciprocal = relation.reciprocal || experience.relation?.reciprocal || [];

  if (dwell.isSettling || eventType === "settling") return "settling";
  if (recurrence.isRetrace || hasAny(direct, ["holds", "traces"])) return "withdrawing";
  if (recurrence.isReturn || eventType === "absence_return") return "returning";
  if (eventType === "first_encounter") return "entering";
  if (hasAny(reciprocal, ["holds", "traces"])) return "held";
  if (hasAny(direct, ["carries", "pairs", "nests", "reads"])) return "crossing";
  if (hasAny(reciprocal, ["carries", "pairs", "nests", "reads"])) return "held";
  return "crossing";
}

function freezeResponse(response) {
  Object.freeze(response.contact);
  return Object.freeze(response);
}

export function respondWithThreshold(participantState) {
  const experience = participantState?.experience;
  const memory = participantState?.memory;
  if (!experience || !memory) {
    return Object.freeze({
      accepted: false,
      reason: "participant state requires memory and experience",
      inhabitant: THRESHOLD_INHABITANT.id,
      response: null,
    });
  }

  if (memory.participantId !== experience.participantId) {
    return Object.freeze({
      accepted: false,
      reason: "participant state memory and experience do not match",
      inhabitant: THRESHOLD_INHABITANT.id,
      response: null,
    });
  }

  const response = freezeResponse({
    medium: THRESHOLD_INHABITANT.medium,
    symbol: symbolFromExperience(experience),
    contact: {
      eventType: experience.structuralObservations?.boundaryTransition?.eventType || experience.rhythm?.currentEventType || "",
      directRelation: Object.freeze([...(experience.structuralObservations?.relationRecurrence?.direct || experience.relation?.direct || [])]),
      reciprocalRelation: Object.freeze([...(experience.structuralObservations?.relationRecurrence?.reciprocal || experience.relation?.reciprocal || [])]),
    },
    eventId: experience.eventId,
    at: experience.at,
  });

  return Object.freeze({
    accepted: true,
    reason: "responded",
    inhabitant: THRESHOLD_INHABITANT.id,
    response,
  });
}
