import assert from "node:assert/strict";
import { observeParticipantMovement } from "../relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantState } from "../participant-state-reducer.mjs";
import { respondWithPulse } from "../pulse-inhabitant.mjs";
import { respondWithThreshold } from "../threshold-inhabitant.mjs";
import { gatherSymbolicResponses } from "../symbolic-inhabitant-composer.mjs";
import { firstArkEntry, getArkEntry, relatedArkEntries } from "./atlas-structure.mjs";

const participantId = "ark-test";
const first = firstArkEntry();
const entered = observeParticipantMovement({
  participantId,
  toEntry: first,
  occurredAt: "2026-06-30T00:00:00.000Z",
});
const enteredState = reduceParticipantState(EMPTY_PARTICIPANT_STATE, entered).state;
const enteredResponses = gatherSymbolicResponses(enteredState, [respondWithPulse, respondWithThreshold]);

assert.equal(entered.type, "first_encounter");
assert.deepEqual(enteredResponses.responses.map((item) => item.response.symbol), ["first", "entering"]);

const target = getArkEntry(relatedArkEntries(first)[0].id);
const moved = observeParticipantMovement({
  participantId,
  fromEntry: first,
  toEntry: target,
  previousEvents: [entered],
  occurredAt: "2026-06-30T00:00:10.000Z",
});
const movedState = reduceParticipantState(enteredState, moved).state;
const movedResponses = gatherSymbolicResponses(movedState, [respondWithPulse, respondWithThreshold]);

assert.equal(moved.type, "transition");
assert.deepEqual(moved.relation, ["carries", "pairs"]);
assert.equal(movedState.memory.visitCount, 2);
assert.deepEqual(movedResponses.responses.map((item) => item.inhabitant), ["pulse", "threshold"]);
assert.deepEqual(movedResponses.responses.map((item) => item.response.symbol), ["passage", "held"]);

for (const item of movedResponses.responses) {
  assert.equal("term" in item.response, false);
  assert.equal("to" in item.response, false);
  assert.equal(item.response.eventId, moved.id);
}

console.log("minimal Ark test passed");
