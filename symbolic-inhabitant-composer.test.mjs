import assert from "node:assert/strict";
import { observeParticipantMovement } from "./relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantEvents } from "./participant-state-reducer.mjs";
import { respondWithPulse } from "./pulse-inhabitant.mjs";
import { respondWithThreshold } from "./threshold-inhabitant.mjs";
import { gatherSymbolicResponses } from "./symbolic-inhabitant-composer.mjs";

const ground = { id: "ground", structure: { carries: ["seed"] } };
const seed = { id: "seed", structure: { holds: ["ground"], traces: ["ground"], carries: ["fruit"] } };
const fruit = { id: "fruit", structure: { holds: ["seed"] } };

const events = [];
events.push(observeParticipantMovement({
  participantId: "participant",
  toEntry: ground,
  occurredAt: "2026-06-30T00:00:00.000Z",
}));
events.push(observeParticipantMovement({
  participantId: "participant",
  fromEntry: ground,
  toEntry: seed,
  previousEvents: events,
  occurredAt: "2026-06-30T00:00:10.000Z",
}));
events.push(observeParticipantMovement({
  participantId: "participant",
  fromEntry: seed,
  toEntry: fruit,
  previousEvents: events,
  occurredAt: "2026-06-30T00:00:20.000Z",
}));

const state = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events).state;
const gathered = gatherSymbolicResponses(state, [respondWithPulse, respondWithThreshold]);

assert.equal(gathered.accepted, true);
assert.equal(gathered.reason, "gathered");
assert.equal(gathered.responses.length, 2);
assert.equal(gathered.responses[0].inhabitant, "pulse");
assert.equal(gathered.responses[1].inhabitant, "threshold");
assert.equal(gathered.responses[0].response.symbol, "passage");
assert.equal(gathered.responses[1].response.symbol, "held");
assert.equal("term" in gathered.responses[0].response, false);
assert.equal("term" in gathered.responses[1].response, false);
assert.equal(Object.isFrozen(gathered), true);
assert.equal(Object.isFrozen(gathered.responses), true);
assert.equal(Object.isFrozen(gathered.responses[0]), true);
assert.deepEqual(gatherSymbolicResponses(state, [respondWithPulse, respondWithThreshold]), gathered);

const stateBefore = JSON.stringify(state);
gatherSymbolicResponses(state, [respondWithThreshold, respondWithPulse]);
assert.equal(JSON.stringify(state), stateBefore);

const rejectingInhabitant = () => Object.freeze({
  accepted: false,
  reason: "test rejection",
  inhabitant: "rejecting",
  response: null,
});
const mixed = gatherSymbolicResponses(state, [respondWithPulse, rejectingInhabitant, respondWithThreshold]);

assert.equal(mixed.accepted, false);
assert.equal(mixed.responses.length, 2);
assert.deepEqual(mixed.rejected, [{ inhabitant: "rejecting", reason: "test rejection" }]);

const empty = gatherSymbolicResponses(state, []);
assert.equal(empty.accepted, true);
assert.deepEqual(empty.responses, []);
assert.deepEqual(empty.rejected, []);

console.log("symbolic-inhabitant-composer tests passed");
