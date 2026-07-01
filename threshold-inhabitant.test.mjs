import assert from "node:assert/strict";
import { observeParticipantMovement } from "./relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantEvents, reduceParticipantState } from "./participant-state-reducer.mjs";
import { respondWithThreshold } from "./threshold-inhabitant.mjs";

const ground = { id: "ground", structure: { carries: ["seed"] } };
const seed = { id: "seed", structure: { holds: ["ground"], traces: ["ground"], carries: ["fruit"] } };
const fruit = { id: "fruit", structure: { holds: ["seed"] } };

const firstEvent = observeParticipantMovement({
  participantId: "participant",
  toEntry: ground,
  occurredAt: "2026-06-30T00:00:00.000Z",
});
const firstState = reduceParticipantState(EMPTY_PARTICIPANT_STATE, firstEvent).state;
const entering = respondWithThreshold(firstState);
assert.equal(entering.accepted, true);
assert.equal(entering.inhabitant, "threshold");
assert.equal(entering.response.medium, "symbol");
assert.equal(entering.response.symbol, "entering");
assert.equal(entering.response.eventId, firstState.experience.eventId);
assert.equal(entering.response.at, firstState.experience.at);
assert.equal("term" in entering.response, false);
assert.equal("to" in entering.response, false);

const events = [firstEvent];
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
  toEntry: ground,
  previousEvents: events,
  occurredAt: "2026-06-30T00:00:20.000Z",
}));
events.push(observeParticipantMovement({
  participantId: "participant",
  fromEntry: ground,
  toEntry: seed,
  previousEvents: events,
  occurredAt: "2026-06-30T00:00:30.000Z",
}));
events.push(observeParticipantMovement({
  participantId: "participant",
  fromEntry: seed,
  toEntry: fruit,
  previousEvents: events,
  occurredAt: "2026-06-30T00:00:40.000Z",
}));

const crossingSource = { id: "crossing-source", structure: { carries: ["crossing-target"] } };
const crossingTarget = { id: "crossing-target", structure: {} };
const crossingEvents = [];
crossingEvents.push(observeParticipantMovement({
  participantId: "crossing",
  toEntry: crossingSource,
  occurredAt: "2026-06-30T00:00:00.000Z",
}));
crossingEvents.push(observeParticipantMovement({
  participantId: "crossing",
  fromEntry: crossingSource,
  toEntry: crossingTarget,
  previousEvents: crossingEvents,
  occurredAt: "2026-06-30T00:00:10.000Z",
}));
const crossing = respondWithThreshold(reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, crossingEvents).state);
assert.equal(crossing.response.symbol, "crossing");
assert.deepEqual(crossing.response.contact.directRelation, ["carries"]);

const withdrawing = respondWithThreshold(reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events.slice(0, 3)).state);
assert.equal(withdrawing.response.symbol, "withdrawing");
assert.deepEqual(withdrawing.response.contact.directRelation, ["holds", "traces"]);
const withdrawingState = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events.slice(0, 3)).state;
assert.equal(withdrawingState.experience.structuralObservations.boundaryTransition.eventType, "retrace");
assert.equal(withdrawingState.experience.structuralObservations.relationDwell.observed, false);

const returnSource = { id: "return-source", structure: { carries: ["return-target"] } };
const returnTarget = { id: "return-target", structure: {} };
const returnEvents = [];
returnEvents.push(observeParticipantMovement({ participantId: "returning", toEntry: returnTarget, occurredAt: "2026-06-30T00:00:00.000Z" }));
returnEvents.push(observeParticipantMovement({ participantId: "returning", fromEntry: returnTarget, toEntry: returnSource, previousEvents: returnEvents, occurredAt: "2026-06-30T00:00:10.000Z" }));
returnEvents.push(observeParticipantMovement({ participantId: "returning", fromEntry: returnSource, toEntry: returnTarget, previousEvents: returnEvents, occurredAt: "2026-06-30T00:00:20.000Z" }));
const returning = respondWithThreshold(reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, returnEvents).state);
assert.equal(returning.response.symbol, "returning");

const held = respondWithThreshold(reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events).state);
assert.equal(held.response.symbol, "held");
assert.deepEqual(held.response.contact.reciprocalRelation, ["holds"]);
assert.deepEqual(respondWithThreshold(reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events).state), held);
assert.equal(Object.isFrozen(held.response), true);
assert.equal(Object.isFrozen(held.response.contact), true);
assert.equal(Object.isFrozen(held.response.contact.reciprocalRelation), true);

const settlingEvent = observeParticipantMovement({
  participantId: "settling",
  fromEntry: ground,
  toEntry: ground,
  previousEvents: [],
  occurredAt: "2026-06-30T00:00:00.000Z",
});
const settling = respondWithThreshold(reduceParticipantState(EMPTY_PARTICIPANT_STATE, settlingEvent).state);
assert.equal(settling.response.symbol, "settling");
const settlingState = reduceParticipantState(EMPTY_PARTICIPANT_STATE, settlingEvent).state;
assert.equal(settlingState.experience.structuralObservations.relationDwell.observed, true);
assert.equal(settlingState.experience.structuralObservations.encounterDuration.observed, true);

const empty = respondWithThreshold(EMPTY_PARTICIPANT_STATE);
assert.equal(empty.accepted, false);
assert.equal(empty.response, null);

const mismatch = respondWithThreshold({
  ...firstState,
  memory: { ...firstState.memory, participantId: "other" },
});
assert.equal(mismatch.accepted, false);
assert.equal(mismatch.response, null);

console.log("threshold-inhabitant tests passed");
