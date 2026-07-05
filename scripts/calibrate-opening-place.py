#!/usr/bin/env python3
"""D-018A — Opening place calibration. Opening paragraph only."""

from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1] / "Reality_Mechanics"
SKIP_FILES = {"Theory.md"}


def capitalize_place(s: str) -> str:
    t = re.sub(r"\s+", " ", str(s or "").strip())
    if not t:
        return t
    t = re.sub(r"[.;]+$", "", t)
    return t[0].upper() + t[1:] + "."


def normalize(s: str) -> str:
    t = re.sub(r"\s+", " ", str(s or "").strip())
    t = re.sub(r"[.;]+$", "", t)
    return t.lower()


def self_referential(opening: str, title: str) -> bool:
    o = opening.strip()
    t = title.strip()
    tl = t.lower()
    ol = o.lower()
    if re.match(r"^the term\b", o, re.I):
        return True
    if re.match(r"^this term\b", o, re.I):
        return True
    if re.match(r"^this (threshold|crossing|carrier|condition|read|map|standard|instrument|operation)\b", o, re.I):
        return True
    for prefix in (" names ", " is ", " carries ", " places ", " pairs "):
        if ol.startswith(tl + prefix):
            return True
        # title words variant: "Bounded asymmetry names"
        if prefix.strip() in ol.split(" ", 3)[:3]:
            first = ol.split(" ", 1)[0]
            if first == tl.split()[0] and prefix.strip() in ol:
                return True
    return False


def needs_place_opening(opening: str, place_sentence: str) -> bool:
    return normalize(opening) != normalize(place_sentence)


def parse_file(path: Path):
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---"):
        return None
    end = raw.index("---", 3)
    fm_text = raw[3:end]
    body = raw[end + 3 :].lstrip("\n")
    fm = yaml.safe_load(fm_text) or {}
    return raw, fm_text, body, fm


def split_opening(body: str):
    lines = body.split("\n")
    title = None
    i = 0
    for idx, line in enumerate(lines):
        if line.startswith("# "):
            title = line[2:].strip()
            i = idx + 1
            break
    while i < len(lines) and not lines[i].strip():
        i += 1
    start = i
    para: list[str] = []
    while i < len(lines):
        if lines[i].startswith("## "):
            break
        if not lines[i].strip() and para:
            break
        if lines[i].strip():
            para.append(lines[i])
        i += 1
    opening = " ".join(para).strip() if para else None
    return title, opening, start, i, lines


def main():
    results = {
        "calibrated": [],
        "unchanged": [],
        "skipped": [],
        "errors": [],
    }

    for path in sorted(ROOT.rglob("*.md")):
        rel = str(path.relative_to(ROOT))
        if path.name in SKIP_FILES:
            results["skipped"].append(
                {"file": rel, "reason": "excluded document (narrative opening)"}
            )
            continue
        try:
            parsed = parse_file(path)
        except Exception as e:  # noqa: BLE001
            results["errors"].append({"file": rel, "error": str(e)})
            continue
        if not parsed:
            continue
        raw, fm_text, body, fm = parsed
        if not fm.get("publish"):
            continue

        places = (fm.get("conditions") or {}).get("places")
        if not places:
            results["skipped"].append({"file": rel, "reason": "no conditions.places"})
            continue

        title, opening, start, end, lines = split_opening(body)
        if not title or not opening:
            results["skipped"].append({"file": rel, "reason": "no title/opening paragraph"})
            continue

        place_sentence = capitalize_place(places)
        already = normalize(opening) == normalize(place_sentence)

        if not needs_place_opening(opening, place_sentence):
            results["unchanged"].append({"file": rel, "reason": "already place sentence"})
            continue

        if not (
            self_referential(opening, title)
            or needs_place_opening(opening, place_sentence)
        ):
            results["unchanged"].append(
                {"file": rel, "reason": "opening matches place; no edit"}
            )
            continue

        reason = "self-reference removed" if self_referential(opening, title) else "aligned to places"

        new_lines = lines[:start] + [place_sentence] + lines[end:]
        new_body = "\n".join(new_lines)
        if not new_body.endswith("\n"):
            new_body += "\n"
        new_raw = f"---\n{fm_text}---\n{new_body}"
        path.write_text(new_raw, encoding="utf-8")

        results["calibrated"].append(
            {
                "file": rel,
                "title": title,
                "reason": reason,
                "before": opening[:160],
                "after": place_sentence,
            }
        )

    out = Path(__file__).resolve().parents[1] / "docs/reports/D-018A-opening-place-calibration.json"
    out.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "calibrated": len(results["calibrated"]),
                "unchanged": len(results["unchanged"]),
                "skipped": len(results["skipped"]),
                "errors": len(results["errors"]),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
