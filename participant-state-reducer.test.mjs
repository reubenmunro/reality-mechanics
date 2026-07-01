import assert from "node:assert/strict";
import { observeParticipantMovement } from "./relation-event-runtime.mjs";
import {
  EMPTY_PARTICIPANT_STATE,
  reduceParticipantEvents,
  reduceParticipantState,
} from "./participant-state-reducer.mjs";

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

const first = reduceParticipantState(EMPTY_PARTICIPANT_STATE, events[0]);
assert.equal(first.accepted, true);
assert.equal(first.reason, "reduced");
assert.equal(first.state.memory.visitCount, 1);
assert.equal(first.state.experience.term, "ground");
assert.equal(first.state.lastEventId, events[0].id);
assert.equal(first.state.updatedAt, events[0].occurredAt);
assert.equal(Object.isFrozen(first.state), true);

const all = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events);
assert.equal(all.accepted, true);
assert.equal(all.state.memory.visitCount, 5);
assert.equal(all.state.memory.retraceCount, 1);
assert.equal(all.state.experience.term, "fruit");
assert.equal(all.state.experience.familiarity.termVisitCount, 1);
assert.equal(all.state.experience.rhythm.recentPathLength, 5);

const limitedPath = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, events, {
  traceMemory: { recentPathLimit: 3 },
});
assert.deepEqual(limitedPath.state.memory.recentPath, ["ground", "seed", "fruit"]);
assert.equal(limitedPath.state.experience.rhythm.recentPathLength, 3);

const priorStateJson = JSON.stringify(first.state);
const rejected = reduceParticipantState(first.state, { type: "transition" });
assert.equal(rejected.accepted, false);
assert.equal(rejected.state, first.state);
assert.equal(JSON.stringify(first.state), priorStateJson);

const stopped = reduceParticipantEvents(EMPTY_PARTICIPANT_STATE, [events[0], { type: "transition" }, events[1]]);
assert.equal(stopped.accepted, false);
assert.equal(stopped.state.memory.visitCount, 1);
assert.equal(stopped.state.experience.term, "ground");

const other = reduceParticipantState(first.state, { ...events[1], participantId: "other" });
assert.equal(other.accepted, false);
assert.equal(other.state, first.state);

console.log("participant-state-reducer tests passed");
