#!/usr/bin/env python3
"""D-018D — Tier 1 hold sentence calibration.

Source: first sentence of ## Holds only (not conditions.holds).
Operations: C1 insert, C1 prepend, C2 compress (hold-shaped para 2 only).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1] / "Reality_Mechanics"
REPO = Path(__file__).resolve().parents[1]
OUT_JSON = REPO / "docs/reports/D-018D-tier-1-hold-calibration.json"

EXCLUDE_FILES = {
    "Theory.md",
    "Common Term Structure.md",
    "00_ROOT.md",
    "Ground.md",
}


def normalize(s: str) -> str:
    t = re.sub(r"\s+", " ", str(s or "").strip())
    t = re.sub(r"[.;]+$", "", t)
    return t.lower()


def parse_file(path: Path):
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---"):
        return None
    end = raw.index("---", 3)
    fm_text = raw[3:end]
    body = raw[end + 3 :].lstrip("\n")
    fm = yaml.safe_load(fm_text) or {}
    return raw, fm_text, body, fm


def split_body(body: str):
    lines = body.split("\n")
    title = None
    title_idx = 0
    for idx, line in enumerate(lines):
        if line.startswith("# "):
            title = line[2:].strip()
            title_idx = idx
            break

    section_start = len(lines)
    for idx, line in enumerate(lines):
        if line.startswith("## "):
            section_start = idx
            break

    pre_lines = lines[title_idx + 1 : section_start]
    section_lines = lines[section_start:]

    paragraphs: list[str] = []
    buf: list[str] = []
    for line in pre_lines:
        if line.strip():
            buf.append(line.strip())
        elif buf:
            paragraphs.append(" ".join(buf))
            buf = []
    if buf:
        paragraphs.append(" ".join(buf))

    sections: dict[str, str] = {}
    current = None
    buf = []
    for line in section_lines:
        if line.startswith("## "):
            if current is not None:
                sections[current] = "\n".join(buf).strip()
            current = line[3:].strip()
            buf = []
        elif current is not None:
            buf.append(line)
    if current is not None:
        sections[current] = "\n".join(buf).strip()

    return title, paragraphs, sections, lines, title_idx, section_start


def holds_first_sentence(sections: dict[str, str]) -> str | None:
    """First non-empty line of ## Holds (canonical Tier 1 source per D-018C)."""
    block = sections.get("Holds", "")
    if not block.strip():
        return None
    for line in block.split("\n"):
        text = line.strip()
        if not text:
            break
        if text.startswith("- "):
            break
        if "is held by" in text.lower():
            return text
    return None


def hold_shaped(text: str) -> bool:
    return "is held by" in (text or "").lower()


def rebuild_pre_section(paragraphs: list[str]) -> list[str]:
    out: list[str] = []
    for i, para in enumerate(paragraphs):
        if i > 0:
            out.append("")
        out.append(para)
    if paragraphs:
        out.append("")
    return out


def apply_calibration(
    paragraphs: list[str], hold_sentence: str
) -> tuple[list[str], str | None, str | None]:
    """Return (new_paragraphs, operation, before_para2_or_none)."""
    if not paragraphs:
        return paragraphs, None, None

    hs_norm = normalize(hold_sentence)

    if len(paragraphs) == 1:
        if normalize(paragraphs[0]) == hs_norm:
            return paragraphs, None, None
        return [paragraphs[0], hold_sentence], "C1_insert", None

    para2 = paragraphs[1]
    if hold_shaped(para2):
        if normalize(para2) == hs_norm:
            return paragraphs, None, para2
        return [paragraphs[0], hold_sentence] + paragraphs[2:], "C2_compress", para2

    # interpretive para 2 — prepend only
    if any(normalize(p) == hs_norm for p in paragraphs[1:]):
        return paragraphs, None, para2
    return [paragraphs[0], hold_sentence] + paragraphs[1:], "C1_prepend", para2


def main(dry_run: bool = False) -> dict:
    results = {
        "c1_insert": [],
        "c1_prepend": [],
        "c2_compress": [],
        "unchanged": [],
        "skipped": [],
        "errors": [],
    }

    for path in sorted(ROOT.rglob("*.md")):
        rel = str(path.relative_to(ROOT))
        if path.name in EXCLUDE_FILES:
            results["skipped"].append({"file": rel, "reason": "excluded document"})
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
        if not (fm.get("conditions") or {}).get("places"):
            results["skipped"].append({"file": rel, "reason": "no conditions.places"})
            continue

        title, paragraphs, sections, lines, title_idx, section_start = split_body(body)
        if not title:
            results["skipped"].append({"file": rel, "reason": "no title"})
            continue

        hold_sentence = holds_first_sentence(sections)
        if not hold_sentence:
            results["skipped"].append({"file": rel, "reason": "no ## Holds hold sentence"})
            continue

        new_paragraphs, op, before = apply_calibration(paragraphs, hold_sentence)
        if not op:
            results["unchanged"].append({"file": rel, "reason": "already aligned or hold present"})
            continue

        entry = {
            "file": rel,
            "title": title,
            "operation": op,
            "hold_sentence": hold_sentence[:200],
            "before": (before or paragraphs[1] if len(paragraphs) > 1 else "")[:200],
            "after": hold_sentence[:200],
            "paragraph_count_before": len(paragraphs),
            "paragraph_count_after": len(new_paragraphs),
        }

        if not dry_run:
            pre_block = rebuild_pre_section(new_paragraphs)
            head = lines[: title_idx + 1]
            if head and head[-1].strip() and (not pre_block or pre_block[0].strip()):
                head.append("")
            new_body_lines = head + pre_block + lines[section_start:]
            new_body = "\n".join(new_body_lines)
            if not new_body.endswith("\n"):
                new_body += "\n"
            # Preserve frontmatter block exactly — rewrite body only
            fm_end = raw.index("---", 3) + 3
            body_start = fm_end
            if body_start < len(raw) and raw[body_start] == "\n":
                body_start += 1
            new_raw = raw[:body_start] + new_body
            path.write_text(new_raw, encoding="utf-8")

        key = op.lower()
        results[key].append(entry)

    summary = {
        "c1_insert": len(results["c1_insert"]),
        "c1_prepend": len(results["c1_prepend"]),
        "c2_compress": len(results["c2_compress"]),
        "unchanged": len(results["unchanged"]),
        "skipped": len(results["skipped"]),
        "errors": len(results["errors"]),
        "total_changed": (
            len(results["c1_insert"])
            + len(results["c1_prepend"])
            + len(results["c2_compress"])
        ),
    }
    OUT_JSON.write_text(
        json.dumps({"summary": summary, **results}, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(summary, indent=2))
    return results


if __name__ == "__main__":
    main(dry_run=False)
