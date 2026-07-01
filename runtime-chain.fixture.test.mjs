import assert from "node:assert/strict";
import { observeParticipantMovement, validateStructuralEvent } from "./relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantState } from "./participant-state-reducer.mjs";
import { respondWithPulse } from "./pulse-inhabitant.mjs";
import { respondWithThreshold } from "./threshold-inhabitant.mjs";
import { gatherSymbolicResponses } from "./symbolic-inhabitant-composer.mjs";

const source = { id: "mock-source", structure: { carries: ["mock-target"] } };
const target = { id: "mock-target", structure: {} };

const event = observeParticipantMovement({
  participantId: "fixture-participant",
  fromEntry: source,
  toEntry: target,
  previousEvents: [],
  occurredAt: "2026-06-30T00:00:00.000Z",
});

assert.equal(validateStructuralEvent(event).valid, true);
assert.equal(event.type, "transition");
assert.deepEqual(event.relation, ["carries"]);

const stateResult = reduceParticipantState(EMPTY_PARTICIPANT_STATE, event);
assert.equal(stateResult.accepted, true);
assert.equal(stateResult.state.memory.visitCount, 1);
assert.equal(stateResult.state.experience.rhythm.currentEventType, "transition");

const gathered = gatherSymbolicResponses(stateResult.state, [
  respondWithPulse,
  respondWithThreshold,
]);

assert.equal(gathered.accepted, true);
assert.deepEqual(gathered.responses.map((item) => item.inhabitant), ["pulse", "threshold"]);
assert.deepEqual(gathered.responses.map((item) => item.response.symbol), ["passage", "crossing"]);

for (const { response } of gathered.responses) {
  assert.equal(response.eventId, event.id);
  assert.equal(response.at, event.occurredAt);
  assert.equal("term" in response, false);
  assert.equal("to" in response, false);
  assert.equal("from" in response, false);
}

assert.equal(Object.isFrozen(event), true);
assert.equal(Object.isFrozen(stateResult.state), true);
assert.equal(Object.isFrozen(gathered), true);
assert.equal(Object.isFrozen(gathered.responses), true);

console.log("runtime-chain fixture passed");
