export function gatherSymbolicResponses(participantState, inhabitants = []) {
  const results = inhabitants.map((respond) => respond(participantState));
  const responses = results
    .filter((result) => result?.accepted)
    .map((result) => Object.freeze({
      inhabitant: result.inhabitant,
      response: result.response,
    }));
  const rejected = results
    .filter((result) => !result?.accepted)
    .map((result) => Object.freeze({
      inhabitant: result?.inhabitant || "unknown",
      reason: result?.reason || "no response returned",
    }));

  Object.freeze(responses);
  Object.freeze(rejected);

  return Object.freeze({
    accepted: rejected.length === 0,
    reason: rejected.length === 0 ? "gathered" : "some inhabitants rejected participant state",
    responses,
    rejected,
  });
}
