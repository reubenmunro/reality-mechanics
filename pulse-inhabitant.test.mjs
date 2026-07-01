import assert from "node:assert/strict";
import { observeParticipantMovement } from "./relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantEvents, reduceParticipantState } from "./participant-state-reducer.mjs";
import { respondWithPulse } from "./pulse-inhabitant.mjs";

const ground = { id: "ground", structure: { carries: ["seed"] } };
const seed = { id: "seed", structure: { holds: ["ground"], traces: ["ground"], carries: ["fruit"] } };
const fruit = { id: "fruit", structure: { holds: ["seed"] } };

const firstEvent = observeParticipantMovement({
  participantId: "participant",
  toEntry: ground,
  occurredAt: "2026-06-30T00:00:00.000Z",
});

const firstState = reduceParticipantState(EMPTY_PARTICIPANT_STATE, firstEvent).state;
const firstPulse = respondWithPulse(firstState);

assert.equal(firstPulse.accepted, true);
assert.equal(firstPulse.inhabitant, "pulse");
assert.equal(firstPulse.response.medium, "symbol");
assert.equal(firstPulse.response.symbol, "first");
assert.equal(firstPulse.response.tempo, "single");
assert.equal(firstPulse.response.intensity, 0.25);
assert.equal("term" in firstPulse.response, false);
assert.equal("to" in firstPulse.response, false);
assert.equal(firstState.experience.structuralObservations.boundaryTransition.eventType, "first_encounter");

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

const retraceState = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events.slice(0, 3)).state;
const retracePulse = respondWithPulse(retraceState);
assert.equal(retraceState.experience.structuralObservations.boundaryTransition.eventType, "retrace");
assert.deepEqual(retraceState.experience.structuralObservations.relationRecurrence.direct, ["holds", "traces"]);
assert.equal(retracePulse.response.symbol, "retrace");
assert.equal(retracePulse.response.intensity, 0.75);
assert.equal(retracePulse.response.recurrence.isRetrace, true);

const returnSource = { id: "return-source", structure: { carries: ["return-target"] } };
const returnTarget = { id: "return-target", structure: {} };
const returnEvents = [];
returnEvents.push(observeParticipantMovement({
  participantId: "returning",
  toEntry: returnTarget,
  occurredAt: "2026-06-30T00:00:00.000Z",
}));
returnEvents.push(observeParticipantMovement({
  participantId: "returning",
  fromEntry: returnTarget,
  toEntry: returnSource,
  previousEvents: returnEvents,
  occurredAt: "2026-06-30T00:00:10.000Z",
}));
returnEvents.push(observeParticipantMovement({
  participantId: "returning",
  fromEntry: returnSource,
  toEntry: returnTarget,
  previousEvents: returnEvents,
  occurredAt: "2026-06-30T00:00:20.000Z",
}));
const returnState = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, returnEvents).state;
const returnPulse = respondWithPulse(returnState);
assert.equal(returnPulse.response.symbol, "return");
assert.equal(returnPulse.response.recurrence.isReturn, true);

const passageState = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events).state;
const passagePulse = respondWithPulse(passageState);
assert.equal(passagePulse.response.symbol, "passage");
assert.equal(passagePulse.response.tempo, "quick");
assert.equal(passagePulse.response.eventId, passageState.experience.eventId);
assert.deepEqual(respondWithPulse(passageState), passagePulse);
assert.equal(Object.isFrozen(passagePulse.response), true);
assert.equal(Object.isFrozen(passagePulse.response.recurrence), true);

const a = { id: "a", structure: { carries: ["b"] } };
const b = { id: "b", structure: { carries: ["c"], holds: ["a"] } };
const c = { id: "c", structure: { carries: ["a"], holds: ["b"] } };
const loopEvents = [];
loopEvents.push(observeParticipantMovement({ participantId: "loop", toEntry: a, occurredAt: "2026-06-30T00:00:00.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: a, toEntry: b, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:10.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: b, toEntry: c, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:20.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: c, toEntry: a, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:30.000Z" }));

const loopPulse = respondWithPulse(reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, loopEvents).state);
assert.equal(loopPulse.response.symbol, "loop");
assert.equal(loopPulse.response.intensity, 1);
assert.equal(loopPulse.response.recurrence.isLoop, true);

const empty = respondWithPulse(EMPTY_PARTICIPANT_STATE);
assert.equal(empty.accepted, false);
assert.equal(empty.response, null);

const mismatch = respondWithPulse({
  ...firstState,
  memory: { ...firstState.memory, participantId: "other" },
});
assert.equal(mismatch.accepted, false);
assert.equal(mismatch.response, null);

console.log("pulse-inhabitant tests passed");
