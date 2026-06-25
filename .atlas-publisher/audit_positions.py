#!/usr/bin/env python3
"""
Reality Mechanics Atlas Position Audit

This is a non-blocking structural audit. It checks whether grounded notes are
positioned consistently by order, folder, condition key, domain, and dependency
direction. It reports warnings for human review rather than declaring the vault
invalid.
"""

import os
import re
import yaml
from collections import defaultdict

VAULT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Reality_Mechanics")

ORDER_RANK = {"ground": 0, "first": 1, "second": 2, "third": 3, "practice": 4, "higher": 5}
ORDER_FOLDERS = {
    "0_Ground": "ground",
    "1_First": "first",
    "2_Second": "second",
    "3_Third": "third",
    "4_Practice": "practice",
    "5_Higher": "higher",
}

ORDER_KEY_PREFIX = {
    "ground": "ground.",
    "first": "first.",
    "second": "second.",
    "third": "third.",
    "practice": "practice.",
    "higher": "higher.",
}

ROOT_EXEMPT = {
    "Atlas",
    "Reality Mechanics",
}

TITLE_EXEMPT = {
    "First Order Crossing",
    "Second Order Crossing",
    "Third Order Crossing",
}


def slug(text):
    text = text.replace("&", "and")
    text = re.sub(r"\.md$", "", text, flags=re.I)
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text


def wikilinks(value):
    return set(re.findall(r"\[\[([^\]|]+)", str(value or "")))


def load_notes():
    notes = {}
    issues = []
    for root, _, files in os.walk(VAULT):
        for filename in files:
            if not filename.endswith(".md"):
                continue
            path = os.path.join(root, filename)
            with open(path) as fh:
                content = fh.read()
            parts = content.split("---", 2)
            if len(parts) < 3:
                continue
            try:
                fm = yaml.safe_load(parts[1]) or {}
            except Exception as exc:
                issues.append(f"{path}: could not parse YAML ({exc})")
                continue
            if not fm.get("grounded"):
                continue

            cond = fm.get("conditions") or {}
            body = parts[2]
            h1_match = re.search(r"^#\s+(.+?)\s*$", body, re.M)
            name = filename[:-3]
            rel_parts = os.path.relpath(path, VAULT).split(os.sep)
            notes[name] = {
                "path": path,
                "rel_parts": rel_parts,
                "order": fm.get("order", ""),
                "kind": fm.get("kind", ""),
                "domain": fm.get("domain", ""),
                "condition_key": fm.get("condition_key", ""),
                "h1": h1_match.group(1).strip() if h1_match else "",
                "publish_slug": slug(name),
                "needs": wikilinks(fm.get("needs")),
                "traces": wikilinks(cond.get("traces")),
                "carries": wikilinks(cond.get("carries")),
            }
    return notes, issues


def expected_domain_from_path(rel_parts):
    if len(rel_parts) < 3 or rel_parts[0] != "3_Third":
        return ""
    if rel_parts[1] == "Domains" and len(rel_parts) >= 3:
        return slug(rel_parts[2])
    if rel_parts[1] == "Fields" and len(rel_parts) >= 3:
        return slug(rel_parts[2])
    if rel_parts[1] in {"Path Reads", "Translation Boundaries", "Placement Modes", "Applied Diagnosis"}:
        return slug(rel_parts[1])
    return ""


def main():
    notes, load_issues = load_notes()
    warnings = defaultdict(list)
    infos = defaultdict(list)

    incoming = defaultdict(set)
    condition_keys = defaultdict(list)
    publish_slugs = defaultdict(list)
    for name, note in notes.items():
        condition_keys[note["condition_key"]].append(name)
        publish_slugs[note["publish_slug"]].append(name)
        for carried in note["carries"]:
            if carried in notes:
                incoming[carried].add(name)

    for name, note in notes.items():
        order = note["order"]
        rank = ORDER_RANK.get(order, -1)
        rel_parts = note["rel_parts"]
        top_folder = rel_parts[0] if rel_parts else ""

        # 1. Folder order should match frontmatter order.
        if top_folder in ORDER_FOLDERS:
            expected_order = ORDER_FOLDERS[top_folder]
            if order != expected_order:
                warnings["folder_order"].append(
                    f"{name}: order is {order!r}, but folder {top_folder!r} implies {expected_order!r}"
                )
        elif name not in ROOT_EXEMPT:
            infos["top_level"].append(f"{name}: top-level grounded note outside numbered order folders")

        # 2. condition_key prefix should match order.
        expected_prefix = ORDER_KEY_PREFIX.get(order)
        if expected_prefix and not str(note["condition_key"]).startswith(expected_prefix):
            warnings["condition_key"].append(
                f"{name}: condition_key {note['condition_key']!r} does not start with {expected_prefix!r}"
            )

        # 2b. Primary heading should match the file title.
        if note["h1"] and note["h1"] != name and name not in TITLE_EXEMPT:
            warnings["title_mismatch"].append(
                f"{name}: H1 is {note['h1']!r}"
            )
        if not note["h1"]:
            warnings["title_mismatch"].append(f"{name}: missing primary H1")

        # 3. Needs/traces that point upward deserve review. They may be
        # intentional bridge reads, so keep them informational rather than
        # treating them as position failures.
        for field in ("needs", "traces"):
            for ref in note[field]:
                if ref not in notes:
                    continue
                ref_order = notes[ref]["order"]
                ref_rank = ORDER_RANK.get(ref_order, -1)
                if ref_rank > rank and rank >= 0:
                    infos["upward_dependency"].append(
                        f"{name} ({order}) {field} [[{ref}]] ({ref_order})"
                    )

        # 4. Third-order domain field should roughly match folder branch.
        expected_domain = expected_domain_from_path(rel_parts)
        if expected_domain:
            actual_domain = slug(str(note["domain"]))
            if actual_domain and actual_domain != expected_domain:
                warnings["domain_path"].append(
                    f"{name}: domain {note['domain']!r} does not match path branch {expected_domain!r}"
                )
            if not actual_domain:
                infos["missing_domain"].append(f"{name}: no domain set; path branch suggests {expected_domain!r}")
            raw_domain = str(note["domain"] or "")
            if raw_domain and raw_domain != slug(raw_domain):
                warnings["domain_format"].append(
                    f"{name}: domain {raw_domain!r} should be slug-style {slug(raw_domain)!r}"
                )

        # 5. Notes with no incoming carrier may be intentional, but should be visible.
        if (
            name not in incoming
            and name not in ROOT_EXEMPT
            and note["kind"] not in {"order", "class"}
            and not name.endswith(" Field")
            and not name.endswith(" Domain")
            and order not in {"ground"}
        ):
            infos["no_incoming_carry"].append(f"{name}: no grounded note carries it")

    for key, names in condition_keys.items():
        if not key:
            warnings["condition_key_unique"].append(f"missing condition_key: {', '.join(sorted(names))}")
        elif len(names) > 1:
            warnings["condition_key_unique"].append(
                f"{key}: {', '.join(sorted(names))}"
            )

    for slug_value, names in publish_slugs.items():
        if len(names) > 1:
            warnings["publish_slug_unique"].append(
                f"{slug_value}: {', '.join(sorted(names))}"
            )

    print("=" * 64)
    print("REALITY MECHANICS POSITION AUDIT")
    print(f"Notes audited: {len(notes)}")
    print("=" * 64)

    if load_issues:
        print("\nLOAD WARNINGS:")
        for item in load_issues:
            print(f"  {item}")

    checks = [
        ("folder_order", "FOLDER ORDER"),
        ("condition_key", "CONDITION KEY PREFIX"),
        ("condition_key_unique", "CONDITION KEY UNIQUENESS"),
        ("publish_slug_unique", "PUBLISH SLUG UNIQUENESS"),
        ("title_mismatch", "TITLE / H1 ALIGNMENT"),
        ("domain_path", "DOMAIN / PATH ALIGNMENT"),
        ("domain_format", "DOMAIN FORMAT"),
    ]

    total_warnings = 0
    for key, label in checks:
        items = warnings[key]
        total_warnings += len(items)
        status = "clean" if not items else f"{len(items)} warnings"
        print(f"\n{label}: {status}")
        for item in sorted(items):
            print(f"  {item}")

    print("\nINFORMATIONAL REVIEW QUEUES:")
    for key, label in [
        ("upward_dependency", "UPWARD DEPENDENCY REVIEW"),
        ("top_level", "TOP-LEVEL GROUNDED NOTES"),
        ("missing_domain", "MISSING THIRD-ORDER DOMAINS"),
        ("no_incoming_carry", "NO INCOMING CARRY"),
    ]:
        items = infos[key]
        print(f"\n{label}: {len(items)}")
        for item in sorted(items):
            print(f"  {item}")

    print("\n" + "=" * 64)
    print(f"Position warnings: {total_warnings}")
    print("=" * 64)


if __name__ == "__main__":
    main()
