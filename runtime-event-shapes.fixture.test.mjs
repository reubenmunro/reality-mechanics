import assert from "node:assert/strict";
import { observeParticipantMovement, validateStructuralEvent } from "./relation-event-runtime.mjs";
import { EMPTY_PARTICIPANT_STATE, reduceParticipantEvents, reduceParticipantState } from "./participant-state-reducer.mjs";
import { respondWithPulse } from "./pulse-inhabitant.mjs";
import { respondWithThreshold } from "./threshold-inhabitant.mjs";
import { gatherSymbolicResponses } from "./symbolic-inhabitant-composer.mjs";

function assertGatheredShape({ event, state, pulse, threshold }) {
  assert.equal(validateStructuralEvent(event).valid, true);
  assert.equal(state.experience.eventId, event.id);
  assert.equal(state.experience.at, event.occurredAt);

  const gathered = gatherSymbolicResponses(state, [respondWithPulse, respondWithThreshold]);
  assert.equal(gathered.accepted, true);
  assert.deepEqual(gathered.responses.map((item) => item.inhabitant), ["pulse", "threshold"]);
  assert.deepEqual(gathered.responses.map((item) => item.response.symbol), [pulse, threshold]);

  for (const { response } of gathered.responses) {
    assert.equal(response.eventId, event.id);
    assert.equal(response.at, event.occurredAt);
    assert.equal("term" in response, false);
    assert.equal("to" in response, false);
    assert.equal("from" in response, false);
  }
}

const loopA = { id: "loop-a", structure: { carries: ["loop-b"] } };
const loopB = { id: "loop-b", structure: { carries: ["loop-c"], holds: ["loop-a"] } };
const loopC = { id: "loop-c", structure: { carries: ["loop-a"], holds: ["loop-b"] } };
const loopEvents = [];
loopEvents.push(observeParticipantMovement({ participantId: "loop", toEntry: loopA, occurredAt: "2026-06-30T00:00:00.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: loopA, toEntry: loopB, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:10.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: loopB, toEntry: loopC, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:20.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: loopC, toEntry: loopA, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:30.000Z" }));
const loopEvent = loopEvents.at(-1);
assert.equal(loopEvent.type, "loop_completed");
assertGatheredShape({
  event: loopEvent,
  state: reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, loopEvents).state,
  pulse: "loop",
  threshold: "crossing",
});

const absenceTarget = { id: "absence-target", structure: {} };
const absenceSource = { id: "absence-source", structure: { carries: ["absence-target"] } };
const absenceEvents = [];
absenceEvents.push(observeParticipantMovement({
  participantId: "absence",
  toEntry: absenceTarget,
  occurredAt: "2026-06-28T00:00:00.000Z",
}));
absenceEvents.push(observeParticipantMovement({
  participantId: "absence",
  fromEntry: absenceTarget,
  toEntry: absenceSource,
  previousEvents: absenceEvents,
  occurredAt: "2026-06-28T00:00:10.000Z",
}));
absenceEvents.push(observeParticipantMovement({
  participantId: "absence",
  fromEntry: absenceSource,
  toEntry: absenceTarget,
  previousEvents: absenceEvents,
  occurredAt: "2026-06-30T00:00:20.000Z",
}));
const absenceEvent = absenceEvents.at(-1);
assert.equal(absenceEvent.type, "absence_return");
assertGatheredShape({
  event: absenceEvent,
  state: reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, absenceEvents).state,
  pulse: "return",
  threshold: "returning",
});

const overloadEvents = [];
for (let index = 0; index < 13; index += 1) {
  const current = { id: `overload-${index}`, structure: { carries: [`overload-${index + 1}`] } };
  const next = { id: `overload-${index + 1}`, structure: {} };
  overloadEvents.push(observeParticipantMovement({
    participantId: "overload",
    fromEntry: current,
    toEntry: next,
    previousEvents: overloadEvents,
    occurredAt: `2026-06-30T00:00:${String(index).padStart(2, "0")}.000Z`,
  }));
}
const overloadEvent = overloadEvents.at(-1);
assert.equal(overloadEvent.type, "overload");
assertGatheredShape({
  event: overloadEvent,
  state: reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, overloadEvents).state,
  pulse: "passage",
  threshold: "crossing",
});

const settlingEntry = { id: "settling-entry", structure: {} };
const settlingEvent = observeParticipantMovement({
  participantId: "settling",
  fromEntry: settlingEntry,
  toEntry: settlingEntry,
  previousEvents: [],
  occurredAt: "2026-06-30T00:00:00.000Z",
});
assert.equal(settlingEvent.type, "settling");
assertGatheredShape({
  event: settlingEvent,
  state: reduceParticipantState(EMPTY_PARTICIPANT_STATE, settlingEvent).state,
  pulse: "passage",
  threshold: "settling",
});

console.log("runtime event-shape fixtures passed");
