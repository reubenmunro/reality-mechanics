import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildWeaveStateFromEdges,
  threadNetworkTermIdsFromWeave,
  threadPairCountFromWeave,
  WEAVE_STATE_VERSION,
} from "../weave-state.mjs";

test("weave-state version is declared", () => {
  assert.equal(WEAVE_STATE_VERSION, "weave-state.v1");
});

test("buildWeaveStateFromEdges aggregates pair flags from directed edges", () => {
  const weave = buildWeaveStateFromEdges([
    { srcId: "a", tgtId: "b", typeKey: "carries" },
    { srcId: "b", tgtId: "a", typeKey: "traces" },
    { srcId: "a", tgtId: "c", typeKey: "pairs" },
  ]);
  const ab = [...weave.values()].find((v) => v.carries && v.traces);
  assert.ok(ab);
  assert.equal(threadPairCountFromWeave(weave), 1);
  const network = threadNetworkTermIdsFromWeave(weave);
  assert.deepEqual([...network].sort(), ["a", "b"]);
});
