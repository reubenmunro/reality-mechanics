#!/usr/bin/env python3
"""D-018C — Reproducible blind sample selection for hold-rule falsification."""

from __future__ import annotations

import hashlib
import json
import random
from collections import defaultdict
from pathlib import Path

SAMPLE_PATH = (
    Path(__file__).resolve().parents[1]
    / "docs/reports/D-018C-hold-rule-falsification-sample.json"
)
DATA_PATH = (
    Path(__file__).resolve().parents[1]
    / "docs/reports/D-018B-hold-movement-calibration.json"
)

TARGETS = {
    "first": 4,
    "second": 4,
    "third": 4,
    "practice": 3,
    "ground": 3,
    "higher": 2,
}


def select_sample(results: list[dict]) -> list[dict]:
    by_order: dict[str, list[dict]] = defaultdict(list)
    for r in results:
        o = r.get("order") or "unknown"
        if o in TARGETS:
            by_order[o].append(r)

    random.seed(int(hashlib.sha256(b"D-018C-falsification").hexdigest()[:8], 16))

    sample: list[dict] = []
    for order, n in TARGETS.items():
        pool = by_order[order]
        insert = [
            r
            for r in pool
            if r["no_explanatory_para"] and r["derived_hold_sentence"]
        ]
        compress = [
            r
            for r in pool
            if not r["no_explanatory_para"]
            and r["classification"] in ("A", "B")
            and r.get("sim_holds_section", 0) >= 0.45
        ]
        edge = [
            r
            for r in pool
            if r["classification"] in ("C", "D") and not r["no_explanatory_para"]
        ]

        picked: list[dict] = []
        for bucket, want in ((insert, 2), (compress, 1), (edge, 1)):
            avail = [r for r in bucket if r not in picked]
            if len(avail) < want:
                avail = [r for r in pool if r not in picked]
            random.shuffle(avail)
            picked.extend(avail[:want])

        rest = [r for r in pool if r not in picked]
        random.shuffle(rest)
        while len(picked) < n and rest:
            picked.append(rest.pop())
        sample.extend(picked[:n])
    return sample


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    sample = select_sample(data["results"])
    out = {
        "seed": "D-018C-falsification",
        "targets": TARGETS,
        "count": len(sample),
        "sample": [
            {
                "file": r["file"],
                "title": r["title"],
                "order": r["order"],
                "kind": r["kind"],
                "classification": r["classification"],
                "pattern_tag": r["pattern_tag"],
                "no_explanatory_para": r["no_explanatory_para"],
                "derived_hold_sentence": r["derived_hold_sentence"],
                "expl_para": r["expl_para"],
            }
            for r in sample
        ],
    }
    SAMPLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    SAMPLE_PATH.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"count": len(sample), "path": str(SAMPLE_PATH)}, indent=2))


if __name__ == "__main__":
    main()
