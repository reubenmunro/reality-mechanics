#!/usr/bin/env python3
"""D-018C — Adversarial corpus falsification of Tier 1 hold rule. Read-only."""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location(
    "assess_hold_movement", ROOT / "scripts" / "assess-hold-movement.py"
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)  # type: ignore[union-attr]

hold_sentence_from_field = _mod.hold_sentence_from_field
normalize = _mod.normalize
parse_file = _mod.parse_file
similarity = _mod.similarity
split_body = _mod.split_body
wikilinks = _mod.wikilinks
SKIP_FILES = _mod.SKIP_FILES

OUT = ROOT / "docs/reports/D-018C-hold-rule-falsification-adversarial.json"
EXCLUDE_FILES = SKIP_FILES | {
    "Theory.md",
    "Common Term Structure.md",
    "00_ROOT.md",
}


def holds_first_sentence(sections: dict) -> str:
    block = sections.get("Holds", "")
    if not block:
        return ""
    line = block.strip().split("\n")[0].strip()
    return re.split(r"(?<=[.!?])\s+", line.replace("\n", " "))[0]


def adversarial_scan():
    failures = {
        "no_derived_sentence": [],
        "acknowledged_prior": [],
        "holds_section_mismatch": [],
        "replace_would_lose_content": [],
        "derived_malformed": [],
        "insert_expands_vs_section": [],
    }
    counts = {
        "total": 0,
        "c1_insert_eligible": 0,
        "c1_prepend_eligible": 0,
        "c2_compress_eligible": 0,
        "excluded": 0,
    }

    for path in sorted((ROOT / "Reality_Mechanics").rglob("*.md")):
        rel = str(path.relative_to(ROOT / "Reality_Mechanics"))
        if path.name in EXCLUDE_FILES:
            counts["excluded"] += 1
            continue

        parsed = parse_file(path)
        if not parsed:
            continue
        fm, body = parsed
        if not fm.get("publish"):
            continue
        cond = fm.get("conditions") or {}
        if not cond.get("places"):
            continue

        counts["total"] += 1
        title, paragraphs, sections = split_body(body)
        if not title:
            continue

        holds = cond.get("holds") or ""
        needs = fm.get("needs") or []
        expl = paragraphs[1] if len(paragraphs) > 1 else None
        holds_sec = holds_first_sentence(sections)

        if holds.lower().startswith("acknowledged"):
            failures["acknowledged_prior"].append(
                {"file": rel, "holds": holds[:120], "title": title}
            )
            continue

        derived = hold_sentence_from_field(title, holds, needs)
        if not derived:
            failures["no_derived_sentence"].append(
                {"file": rel, "holds": holds[:120], "title": title}
            )
            continue

        # malformed: double period, empty link clause, title mismatch patterns
        if ".." in derived or derived.count(" is held by .") or derived.endswith("is held by ."):
            failures["derived_malformed"].append(
                {"file": rel, "derived": derived[:160]}
            )

        sim_derived_section = similarity(derived, holds_sec) if holds_sec else 0.0

        if holds_sec and sim_derived_section < 0.35 and holds_sec.lower().startswith(
            f"{title.lower()} is held"
        ):
            failures["holds_section_mismatch"].append(
                {
                    "file": rel,
                    "derived": derived[:120],
                    "holds_sec": holds_sec[:120],
                    "sim": round(sim_derived_section, 3),
                }
            )

        if not expl:
            counts["c1_insert_eligible"] += 1
        elif "is held by" in expl.lower():
            counts["c2_compress_eligible"] += 1
            if similarity(expl, derived) < 0.45 and similarity(expl, holds) >= 0.3:
                pass  # drift candidate
        else:
            counts["c1_prepend_eligible"] += 1
            # replace test: would lose words unique to expl not in derived/holds
            expl_words = set(normalize(expl).split())
            hold_words = set(normalize(derived).split()) | set(normalize(holds).split())
            unique = expl_words - hold_words
            # filter common stop-ish words
            unique -= {
                "the",
                "a",
                "an",
                "is",
                "are",
                "it",
                "that",
                "this",
                "where",
                "when",
                "not",
                "and",
                "or",
                "as",
                "by",
                "in",
                "to",
                "of",
                "for",
                "with",
                "without",
                "can",
                "may",
                "must",
                "be",
                "names",
                "name",
            }
            if len(unique) >= 8:
                failures["replace_would_lose_content"].append(
                    {
                        "file": rel,
                        "unique_word_count": len(unique),
                        "expl_preview": expl[:100],
                        "sample_unique": sorted(list(unique))[:8],
                    }
                )

        if holds_sec and sim_derived_section > 0.85 and not expl:
            failures["insert_expands_vs_section"].append(
                {"file": rel, "note": "insert duplicates section exactly"}
            )

    return counts, failures


def main():
    counts, failures = adversarial_scan()
    summary = {
        "counts": counts,
        "failure_counts": {k: len(v) for k, v in failures.items()},
        "failures": failures,
    }
    OUT.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"counts": counts, "failure_counts": summary["failure_counts"]}, indent=2))


if __name__ == "__main__":
    main()
