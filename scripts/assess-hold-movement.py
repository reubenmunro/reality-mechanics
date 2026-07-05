#!/usr/bin/env python3
"""D-018B — Hold & movement calibration assessment. Read-only analysis."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1] / "Reality_Mechanics"
SKIP_FILES = {"Theory.md"}
OUT_JSON = (
    Path(__file__).resolve().parents[1]
    / "docs/reports/D-018B-hold-movement-calibration.json"
)

WIKILINK = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
META_PREFIXES = (
    r"^the term\b",
    r"^this term\b",
    r"^in practice\b",
    r"^note that\b",
)


def normalize(s: str) -> str:
    t = re.sub(r"\s+", " ", str(s or "").strip())
    t = re.sub(r"[.;,—–-]+$", "", t)
    return t.lower()


def wikilinks(s: str) -> list[str]:
    return [m.group(1).strip() for m in WIKILINK.finditer(s or "")]


def strip_links(s: str) -> str:
    return WIKILINK.sub(r"\1", s or "")


def capitalize_first(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    return s[0].upper() + s[1:]


def parse_file(path: Path):
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---"):
        return None
    end = raw.index("---", 3)
    fm_text = raw[3:end]
    body = raw[end + 3 :].lstrip("\n")
    fm = yaml.safe_load(fm_text) or {}
    return fm, body


def split_body(body: str):
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

    pre_section: list[str] = []
    while i < len(lines) and not lines[i].startswith("## "):
        pre_section.append(lines[i])
        i += 1

    text = "\n".join(pre_section).strip()
    paragraphs: list[str] = []
    buf: list[str] = []
    for line in text.split("\n"):
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
    for line in lines[i:]:
        if line.startswith("## "):
            if current is not None:
                sections[current] = "\n".join(buf).strip()
            current = line[3:].strip()
            buf = []
        elif current is not None:
            buf.append(line)
    if current is not None:
        sections[current] = "\n".join(buf).strip()

    return title, paragraphs, sections


def hold_sentence_from_field(title: str, holds: str, needs: list) -> str | None:
    if not holds:
        return None
    holds = holds.strip()
    if holds.lower().startswith("acknowledged"):
        return None  # Ground-style; not a standard hold sentence
    if holds.lower().startswith("no "):
        return None

    links = wikilinks(holds)
    if not links and needs:
        links = wikilinks(str(needs[0])) if needs else []

    rest = holds
    if links and holds.startswith("[[") or (links and holds.split(".")[0].startswith("[[")):
        # holds field often starts with wikilink(s)
        parts = re.split(r"\.\s+", holds, maxsplit=1)
        if len(parts) == 2:
            rest = parts[1]
        elif " — " in holds:
            rest = holds.split(" — ", 1)[1]
        elif " - " in holds:
            rest = holds.split(" - ", 1)[1]
        else:
            rest = ""

    link_part = ", ".join(f"[[{l}]]" for l in links) if links else ""
    if not link_part and needs:
        link_part = ", ".join(str(n).strip() for n in needs)

    if not link_part:
        return capitalize_first(holds) + "."

    sentence = f"{title} is held by {link_part}."
    if rest.strip():
        sentence += " " + capitalize_first(rest.strip()) + "."
    return sentence


def similarity(a: str, b: str) -> float:
    a, b = normalize(a), normalize(b)
    if not a or not b:
        return 0.0
    aw, bw = set(a.split()), set(b.split())
    if not aw or not bw:
        return 0.0
    return len(aw & bw) / len(aw | bw)


def first_hold_link_pos(text: str, hold_links: set[str]) -> int | None:
    text_l = text.lower()
    positions = []
    for link in hold_links:
        for pat in (f"[[{link.lower()}]]", link.lower()):
            idx = text_l.find(pat)
            if idx >= 0:
                positions.append(idx)
    return min(positions) if positions else None


def first_carried_link_pos(text: str, carried: set[str], hold_links: set[str]) -> int | None:
    carried = carried - hold_links
    text_l = text.lower()
    positions = []
    for link in carried:
        for pat in (f"[[{link.lower()}]]", link.lower()):
            idx = text_l.find(pat)
            if idx >= 0:
                positions.append(idx)
    return min(positions) if positions else None


def inverted_dependency(para: str, hold_links: set[str], carried_links: set[str]) -> bool:
    if not hold_links or not carried_links:
        return False
    hp = first_hold_link_pos(para, hold_links)
    cp = first_carried_link_pos(para, carried_links, hold_links)
    if hp is None or cp is None:
        return False
    return cp < hp


def hold_pattern(para: str, title: str) -> bool:
    tl = title.lower()
    pl = para.lower()
    patterns = [
        f"{tl} is held by",
        f"{tl} is held",
        "is held by",
        "must remain held",
        "held by",
    ]
    return any(p in pl for p in patterns)


def classify(entry: dict) -> str:
    if entry.get("no_explanatory_para"):
        if entry.get("holds_field") or entry.get("needs"):
            return "B"  # could add hold sentence from field
        return "A"  # thin term; template only

    if entry.get("ground_special"):
        return "D"

    if entry.get("interpretive_only"):
        return "D"

    sim_holds = entry.get("sim_holds_field", 0)
    sim_section = entry.get("sim_holds_section", 0)
    sim_derived = entry.get("sim_derived_hold", 0)

    if entry.get("inverted"):
        return "C"

    if sim_derived >= 0.72 or sim_holds >= 0.65 or sim_section >= 0.65:
        if sim_derived >= 0.85 or sim_holds >= 0.8:
            return "A"
        return "B"

    if entry.get("hold_pattern") and sim_holds >= 0.45:
        return "B"

    if entry.get("hold_pattern") and entry.get("extra_not_in_fields"):
        return "C" if entry.get("inverted") else "D"

    if entry.get("hold_pattern"):
        return "B"

    if sim_holds >= 0.4 or sim_section >= 0.4:
        return "C"

    return "D"


def content_in_fields(para: str, fields: list[str]) -> bool:
    """True if most wikilinks in para appear in structural fields."""
    plinks = set(wikilinks(para))
    if not plinks:
        return True
    field_links = set()
    for f in fields:
        field_links.update(wikilinks(f))
    if not field_links:
        return False
    return len(plinks & field_links) / len(plinks) >= 0.6


def main():
    results: list[dict] = []
    skipped: list[dict] = []
    patterns = Counter()
    para_patterns = Counter()

    for path in sorted(ROOT.rglob("*.md")):
        rel = str(path.relative_to(ROOT))
        if path.name in SKIP_FILES:
            skipped.append({"file": rel, "reason": "excluded narrative document"})
            continue
        try:
            parsed = parse_file(path)
        except Exception as e:  # noqa: BLE001
            skipped.append({"file": rel, "reason": f"parse error: {e}"})
            continue
        if not parsed:
            continue
        fm, body = parsed
        if not fm.get("publish"):
            continue

        cond = fm.get("conditions") or {}
        places = cond.get("places")
        if not places:
            skipped.append({"file": rel, "reason": "no conditions.places"})
            continue

        title, paragraphs, sections = split_body(body)
        if not title:
            skipped.append({"file": rel, "reason": "no title"})
            continue

        place_para = paragraphs[0] if paragraphs else ""
        expl_para = paragraphs[1] if len(paragraphs) > 1 else None
        extra_paras = paragraphs[2:] if len(paragraphs) > 2 else []

        holds = cond.get("holds") or ""
        pairs = cond.get("pairs") or ""
        nests = cond.get("nests") or ""
        reads = cond.get("reads") or ""
        traces = cond.get("traces") or []
        carries = cond.get("carries") or []
        needs = fm.get("needs") or []

        traces_s = " ".join(str(t) for t in traces) if isinstance(traces, list) else str(traces)
        carries_s = (
            " ".join(str(c) for c in carries) if isinstance(carries, list) else str(carries)
        )
        all_fields = [holds, pairs, nests, reads, traces_s, carries_s, places]
        holds_section = sections.get("Holds", "")

        derived_hold = hold_sentence_from_field(title, holds, needs)

        hold_links = set(wikilinks(holds)) | set(wikilinks(str(needs)))
        carried_links = (
            set(wikilinks(carries_s))
            | set(wikilinks(pairs))
            | set(wikilinks(reads))
        )

        entry = {
            "file": rel,
            "title": title,
            "kind": fm.get("kind"),
            "order": fm.get("order"),
            "place_para": place_para[:120],
            "expl_para": (expl_para or "")[:200],
            "extra_para_count": len(extra_paras),
            "no_explanatory_para": expl_para is None,
            "holds_field": holds[:160] if holds else "",
            "derived_hold_sentence": (derived_hold or "")[:200],
            "holds_section": holds_section[:160] if holds_section else "",
            "sim_holds_field": 0.0,
            "sim_holds_section": 0.0,
            "sim_derived_hold": 0.0,
            "hold_pattern": False,
            "inverted": False,
            "ground_special": False,
            "interpretive_only": False,
            "extra_not_in_fields": False,
            "classification": "",
            "pattern_tag": "",
        }

        if not expl_para:
            entry["pattern_tag"] = "no_explanatory_para"
            patterns["no_explanatory_para"] += 1
        else:
            pl = expl_para.lower()
            if re.match(rf"^{re.escape(title.lower())}\s+is\s+not\b", pl):
                para_patterns["term_is_not"] += 1
                entry["pattern_tag"] = "term_is_not"
            elif hold_pattern(expl_para, title):
                para_patterns["hold_sentence"] += 1
                entry["pattern_tag"] = "hold_sentence"
            elif re.match(rf"^{re.escape(title.lower())}\s+(names|carries|places|pairs)\b", pl):
                para_patterns["term_names"] += 1
                entry["pattern_tag"] = "term_names"
            elif re.match(r"^\[\[", expl_para):
                para_patterns["link_opens"] += 1
                entry["pattern_tag"] = "link_opens"
            elif any(re.match(p, pl) for p in META_PREFIXES):
                para_patterns["meta_preamble"] += 1
                entry["pattern_tag"] = "meta_preamble"
            else:
                para_patterns["other_explanatory"] += 1
                entry["pattern_tag"] = "other_explanatory"

            entry["sim_holds_field"] = similarity(expl_para, holds)
            entry["sim_holds_section"] = similarity(expl_para, holds_section)
            if derived_hold:
                entry["sim_derived_hold"] = similarity(expl_para, derived_hold)

            entry["hold_pattern"] = hold_pattern(expl_para, title)
            entry["inverted"] = inverted_dependency(expl_para, hold_links, carried_links)
            entry["extra_not_in_fields"] = not content_in_fields(expl_para, all_fields)

            if fm.get("order") == "ground" and title == "Ground":
                entry["ground_special"] = True
            if entry["pattern_tag"] == "term_is_not" and entry["sim_holds_field"] < 0.35:
                entry["interpretive_only"] = True

        if not expl_para and (holds or needs):
            entry["sim_derived_hold"] = 1.0 if derived_hold else 0.0

        if holds.lower().startswith("acknowledged"):
            entry["ground_special"] = title == "Ground"

        entry["classification"] = classify(entry)
        results.append(entry)

    counts = Counter(r["classification"] for r in results)
    pattern_tags = Counter(r["pattern_tag"] for r in results)
    by_order = defaultdict(lambda: Counter())
    by_kind = defaultdict(lambda: Counter())
    for r in results:
        by_order[r["order"] or "unknown"][r["classification"]] += 1
        by_kind[r["kind"] or "unknown"][r["classification"]] += 1

    mechanically = counts["A"] + counts["B"]
    stewardship = counts["C"] + counts["D"]
    total = len(results)

    summary = {
        "total_assessed": total,
        "skipped": len(skipped),
        "classifications": dict(counts),
        "class_a_pct": round(100 * counts["A"] / total, 1) if total else 0,
        "class_b_pct": round(100 * counts["B"] / total, 1) if total else 0,
        "class_c_pct": round(100 * counts["C"] / total, 1) if total else 0,
        "class_d_pct": round(100 * counts["D"] / total, 1) if total else 0,
        "mechanically_derivable_pct": round(100 * mechanically / total, 1) if total else 0,
        "stewardship_pct": round(100 * stewardship / total, 1) if total else 0,
        "pattern_tags": dict(pattern_tags),
        "para_patterns": dict(para_patterns),
        "by_order": {k: dict(v) for k, v in sorted(by_order.items())},
        "by_kind": {k: dict(v) for k, v in sorted(by_kind.items())},
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps({"summary": summary, "results": results, "skipped": skipped}, indent=2)
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
