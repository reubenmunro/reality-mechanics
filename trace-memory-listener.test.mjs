import assert from "node:assert/strict";
import { observeParticipantMovement } from "./relation-event-runtime.mjs";
import {
  EMPTY_TRACE_MEMORY,
  rememberStructuralEvent,
  rememberStructuralEvents,
} from "./trace-memory-listener.mjs";

const ground = { id: "ground", structure: { carries: ["seed"] } };
const seed = { id: "seed", structure: { holds: ["ground"], traces: ["ground"] } };
const fruit = { id: "fruit", structure: {} };

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
  toEntry: fruit,
  previousEvents: events,
  occurredAt: "2026-06-30T00:00:30.000Z",
}));

const remembered = rememberStructuralEvents(EMPTY_TRACE_MEMORY, events);

assert.equal(remembered.accepted, true);
assert.equal(remembered.memory.participantId, "participant");
assert.equal(remembered.memory.visitCount, 4);
assert.equal(remembered.memory.returnCount, 0);
assert.equal(remembered.memory.retraceCount, 1);
assert.equal(remembered.memory.loopCount, 0);
assert.equal(remembered.memory.lastVisited, "fruit");
assert.deepEqual(remembered.memory.recentPath, ["ground", "seed", "ground", "fruit"]);
assert.deepEqual(remembered.memory.visitsByTerm, { ground: 2, seed: 1, fruit: 1 });
assert.deepEqual(remembered.memory.localFrequency, events.at(-1).localFrequency);

const a = { id: "a", structure: { carries: ["b"] } };
const b = { id: "b", structure: { carries: ["c"], holds: ["a"] } };
const c = { id: "c", structure: { carries: ["a"], holds: ["b"] } };
const loopEvents = [];
loopEvents.push(observeParticipantMovement({ participantId: "loop", toEntry: a, occurredAt: "2026-06-30T00:00:00.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: a, toEntry: b, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:10.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: b, toEntry: c, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:20.000Z" }));
loopEvents.push(observeParticipantMovement({ participantId: "loop", fromEntry: c, toEntry: a, previousEvents: loopEvents, occurredAt: "2026-06-30T00:00:30.000Z" }));

const loopMemory = rememberStructuralEvents(EMPTY_TRACE_MEMORY, loopEvents, { recentPathLimit: 3 }).memory;
assert.equal(loopMemory.loopCount, 1);
assert.deepEqual(loopMemory.recentPath, ["b", "c", "a"]);

const firstResult = rememberStructuralEvent(EMPTY_TRACE_MEMORY, events[0]);
const crossParticipant = rememberStructuralEvent(firstResult.memory, {
  ...events[1],
  participantId: "other",
});

assert.equal(crossParticipant.accepted, false);
assert.equal(crossParticipant.memory, firstResult.memory);

const malformed = rememberStructuralEvent(firstResult.memory, { type: "transition" });
assert.equal(malformed.accepted, false);
assert.equal(malformed.memory, firstResult.memory);

const stopped = rememberStructuralEvents(EMPTY_TRACE_MEMORY, [events[0], { type: "transition" }, events[1]]);
assert.equal(stopped.accepted, false);
assert.equal(stopped.memory.visitCount, 1);

console.log("trace-memory-listener tests passed");
