import assert from "node:assert/strict";
import { observeParticipantMovement, validateStructuralEvent } from "./relation-event-runtime.mjs";

const ground = { id: "ground", structure: { carries: ["seed"] } };
const seed = { id: "seed", structure: { holds: ["ground"], traces: ["ground"] } };

const first = observeParticipantMovement({
  participantId: "participant",
  toEntry: ground,
  occurredAt: "2026-06-30T00:00:00.000Z",
});

const transition = observeParticipantMovement({
  participantId: "participant",
  fromEntry: ground,
  toEntry: seed,
  previousEvents: [first],
  occurredAt: "2026-06-30T00:00:10.000Z",
});

const retrace = observeParticipantMovement({
  participantId: "participant",
  fromEntry: seed,
  toEntry: ground,
  previousEvents: [first, transition],
  occurredAt: "2026-06-30T00:00:20.000Z",
});

assert.equal(first.type, "first_encounter");
assert.equal(transition.type, "transition");
assert.deepEqual(transition.relation, ["carries"]);
assert.equal(retrace.type, "retrace");
assert.deepEqual(retrace.relation, ["holds", "traces"]);

for (const event of [first, transition, retrace]) {
  assert.equal(validateStructuralEvent(event).valid, true);
}

const a = { id: "a", structure: { carries: ["b"] } };
const b = { id: "b", structure: { carries: ["c"], holds: ["a"] } };
const c = { id: "c", structure: { carries: ["a"], holds: ["b"] } };
const loopEvents = [];

loopEvents.push(observeParticipantMovement({
  participantId: "loop",
  toEntry: a,
  occurredAt: "2026-06-30T00:00:00.000Z",
}));
loopEvents.push(observeParticipantMovement({
  participantId: "loop",
  fromEntry: a,
  toEntry: b,
  previousEvents: loopEvents,
  occurredAt: "2026-06-30T00:00:10.000Z",
}));
loopEvents.push(observeParticipantMovement({
  participantId: "loop",
  fromEntry: b,
  toEntry: c,
  previousEvents: loopEvents,
  occurredAt: "2026-06-30T00:00:20.000Z",
}));
loopEvents.push(observeParticipantMovement({
  participantId: "loop",
  fromEntry: c,
  toEntry: a,
  previousEvents: loopEvents,
  occurredAt: "2026-06-30T00:00:30.000Z",
}));

assert.equal(loopEvents.at(-1).type, "loop_completed");
assert.deepEqual(loopEvents.at(-1).trace, ["a", "b", "c", "a"]);

const unexpected = observeParticipantMovement({
  participantId: "participant",
  fromEntry: { id: "x", structure: {} },
  toEntry: { id: "y", structure: {} },
  occurredAt: "2026-06-30T00:01:00.000Z",
});

assert.equal(unexpected.type, "unexpected_ratio");

console.log("relation-event-runtime tests passed");
