import { RELATION_FIELDS } from "../atlas-structure-contract.mjs";

export const ARK_MINIMAL_ATLAS = Object.freeze([
  Object.freeze({
    id: "ground",
    title: "Ground",
    structure: Object.freeze({
      holds: Object.freeze([]),
      traces: Object.freeze([]),
      carries: Object.freeze(["seed"]),
      pairs: Object.freeze(["seed"]),
      nests: Object.freeze([]),
      reads: Object.freeze([]),
    }),
  }),
  Object.freeze({
    id: "seed",
    title: "Seed",
    structure: Object.freeze({
      holds: Object.freeze(["ground"]),
      traces: Object.freeze(["ground"]),
      carries: Object.freeze(["ratio"]),
      pairs: Object.freeze(["ground"]),
      nests: Object.freeze([]),
      reads: Object.freeze([]),
    }),
  }),
  Object.freeze({
    id: "ratio",
    title: "Ratio",
    structure: Object.freeze({
      holds: Object.freeze(["seed", "ground"]),
      traces: Object.freeze(["seed", "ground"]),
      carries: Object.freeze(["one"]),
      pairs: Object.freeze([]),
      nests: Object.freeze([]),
      reads: Object.freeze(["one"]),
    }),
  }),
  Object.freeze({
    id: "one",
    title: "One",
    structure: Object.freeze({
      holds: Object.freeze(["ratio"]),
      traces: Object.freeze(["ratio"]),
      carries: Object.freeze(["other"]),
      pairs: Object.freeze(["other"]),
      nests: Object.freeze([]),
      reads: Object.freeze(["other"]),
    }),
  }),
  Object.freeze({
    id: "other",
    title: "Other",
    structure: Object.freeze({
      holds: Object.freeze(["one"]),
      traces: Object.freeze(["one"]),
      carries: Object.freeze([]),
      pairs: Object.freeze(["one"]),
      nests: Object.freeze([]),
      reads: Object.freeze([]),
    }),
  }),
]);

export function getArkEntry(id) {
  return ARK_MINIMAL_ATLAS.find((entry) => entry.id === id) || null;
}

export function firstArkEntry() {
  return getArkEntry("ground");
}

export function relatedArkEntries(entry) {
  const related = [];
  const seen = new Set();
  for (const field of RELATION_FIELDS) {
    for (const id of entry?.structure?.[field] || []) {
      if (seen.has(id)) continue;
      const target = getArkEntry(id);
      if (target) {
        seen.add(id);
        related.push({ relation: field, id: target.id, title: target.title });
      }
    }
  }
  return Object.freeze(related.map(Object.freeze));
}
