import assert from "node:assert/strict";
import { observeParticipantMovement } from "./relation-event-runtime.mjs";
import { EMPTY_TRACE_MEMORY, rememberStructuralEvent, rememberStructuralEvents } from "./trace-memory-listener.mjs";
import { deriveParticipantExperience } from "./participant-experience.mjs";

const ground = { id: "ground", structure: { carries: ["seed"] } };
const seed = { id: "seed", structure: { holds: ["ground"], traces: ["ground"] } };
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

const memory = rememberStructuralEvents(EMPTY_TRACE_MEMORY, events).memory;
const result = deriveParticipantExperience(events.at(-1), memory);

assert.equal(result.accepted, true);
assert.equal(result.reason, "derived");
assert.equal(result.experience.participantId, "participant");
assert.equal(result.experience.term, "fruit");
assert.deepEqual(result.experience.relation.direct, []);
assert.deepEqual(result.experience.relation.reciprocal, ["holds"]);
assert.equal(result.experience.recurrence.termVisitCount, 1);
assert.equal(result.experience.recurrence.priorTermVisitCount, 0);
assert.equal(result.experience.recurrence.hasPriorEncounter, false);
assert.equal(result.experience.recurrence.isRetrace, false);
assert.equal(result.experience.recurrence.retraceCount, 1);
assert.equal(result.experience.familiarity.score, 0.2);
assert.equal(result.experience.rhythm.localFrequency.count, events.at(-1).localFrequency.count);
assert.equal(result.experience.rhythm.localFrequency.ratePerSecond, events.at(-1).localFrequency.count / 60);
assert.equal(result.experience.rhythm.recentPathLength, 5);
assert.deepEqual(result.experience.structuralObservations.movementRecurrence, {
  from: "seed",
  to: "fruit",
  termVisitCount: 1,
  priorTermVisitCount: 0,
  hasPriorEncounter: false,
});
assert.deepEqual(result.experience.structuralObservations.relationRecurrence.direct, []);
assert.deepEqual(result.experience.structuralObservations.relationRecurrence.reciprocal, ["holds"]);
assert.equal(result.experience.structuralObservations.pathRecurrence.recentPathLength, 5);
assert.equal(result.experience.structuralObservations.revisitFrequency.localFrequency.count, events.at(-1).localFrequency.count);
assert.equal(result.experience.structuralObservations.encounterInterval.observed, true);
assert.equal(result.experience.structuralObservations.encounterInterval.ms, 10000);
assert.equal(result.experience.structuralObservations.relationDwell.observed, false);
assert.equal(result.experience.structuralObservations.orderTransition.observed, false);
assert.equal(result.experience.structuralObservations.boundaryTransition.eventType, "transition");
assert.equal(Object.isFrozen(result.experience.structuralObservations), true);
assert.equal(Object.isFrozen(result.experience.structuralObservations.pathRecurrence.recentPath), true);

const seedExperience = deriveParticipantExperience(events[3], rememberStructuralEvents(EMPTY_TRACE_MEMORY, events.slice(0, 4)).memory);
assert.equal(seedExperience.experience.recurrence.hasPriorEncounter, true);
assert.equal(seedExperience.experience.familiarity.termVisitCount, 2);
assert.equal(seedExperience.experience.structuralObservations.movementRecurrence.hasPriorEncounter, true);
assert.deepEqual(seedExperience.experience.anticipation.observedContinuations, [
  { from: "seed", to: "ground", count: 1 },
]);

const memoryBefore = JSON.stringify(memory);
deriveParticipantExperience(events.at(-1), memory);
assert.equal(JSON.stringify(memory), memoryBefore);
assert.equal(Object.isFrozen(result.experience), true);
assert.equal(Object.isFrozen(result.experience.recurrence), true);
assert.equal(Object.isFrozen(result.experience.anticipation.observedContinuations), true);

const crossParticipant = deriveParticipantExperience({ ...events[0], participantId: "other" }, memory);
assert.equal(crossParticipant.accepted, false);
assert.equal(crossParticipant.experience, null);

const malformed = deriveParticipantExperience({ type: "transition" }, memory);
assert.equal(malformed.accepted, false);
assert.equal(malformed.experience, null);

const oneEventMemory = rememberStructuralEvent(EMPTY_TRACE_MEMORY, events[0]).memory;
const firstExperience = deriveParticipantExperience(events[0], oneEventMemory);
assert.equal(firstExperience.experience.recurrence.hasPriorEncounter, false);
assert.equal(firstExperience.experience.anticipation.hasObservedContinuation, false);

console.log("participant-experience tests passed");
