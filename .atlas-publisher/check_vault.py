#!/usr/bin/env python3
"""
Reality Mechanics Vault Integrity Check
Run from the Reality_Mechanics folder: python3 check_vault.py
"""

import os, re, yaml
from collections import defaultdict

VAULT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Reality_Mechanics")
ORDER_RANK = {'ground':0,'first':1,'second':2,'third':3,'practice':4,'higher':5}
EXEMPT_KINDS = {'order','class'}
REQUIRED_SPINE_HEADINGS = ['Places', 'Holds', 'Pairs', 'Traces', 'Nests', 'Reads', 'Carries']
REQUIRED_CONDITION_KEYS = ['places', 'holds', 'pairs', 'traces', 'nests', 'reads', 'carries']
# A note declares it has no single mutual lateral pair via any of these v0.3 phrasings.
NO_PAIR_RE = re.compile(r'no (universal )?(lateral )?pair|carr(y|ies) downward|asymmetry', re.I)
RETURN_LAYERS = {'practice', 'higher'}

def mirror_required(source, target):
    if source['order'] == 'ground' and target['kind'] == 'primitive':
        return False
    return True

# --- Load all grounded notes ---
notes = {}
load_issues = []
for root, dirs, files in os.walk(VAULT):
    for f in files:
        if not f.endswith('.md'): continue
        path = os.path.join(root, f)
        with open(path) as fh: content = fh.read()
        parts = content.split('---', 2)
        if len(parts) < 3:
            load_issues.append(f"  {path}: missing YAML frontmatter")
            continue
        try:
            fm = yaml.safe_load(parts[1])
            if not fm or not fm.get('grounded'): continue
            name = f[:-3]
            cond = fm.get('conditions') or {}
            body = parts[2]
            body_headings = set(re.findall(r'^##\s+(.+?)\s*$', body, re.M))
            needs = fm.get('needs') or []
            carries_raw = cond.get('carries') or []
            holds_raw = str(cond.get('holds',''))
            pairs_raw = str(cond.get('pairs',''))
            traces_raw = cond.get('traces') or []
            notes[name] = {
                'order': fm.get('order',''),
                'kind': fm.get('kind',''),
                'path': path,
                'carries': set(re.findall(r'\[\[([^\]|]+)', str(carries_raw))),
                'pair_refs': set(re.findall(r'\[\[([^\]|]+)', pairs_raw)),
                'pairs_raw': pairs_raw,
                'needs_refs': set(re.findall(r'\[\[([^\]|]+)', str(needs))),
                'holds_refs': set(re.findall(r'\[\[([^\]|]+)', holds_raw)),
                'traces_refs': set(re.findall(r'\[\[([^\]|]+)', str(traces_raw))),
                'body_headings': body_headings,
                'condition_keys': set(cond.keys()),
            }
        except Exception as e:
            load_issues.append(f"  {path}: could not parse YAML frontmatter ({e})")
            continue

all_names = set(notes.keys())
issues = defaultdict(list)
issues['frontmatter_parse'].extend(load_issues)

for name, d in notes.items():
    order_r = ORDER_RANK.get(d['order'], -1)
    kind = d['kind']

    # 1. Backward carries (forward-order only).
    # v0.3: a cross-order carry is valid where the downstream note declares a
    # Translation Boundary (a sanctioned translated crossing), and the return
    # layers (practice, higher) legitimately carry back across orders as the
    # return/retrace loop. The carries/traces mirror still enforces reciprocity
    # in all these cases, so they are not dependency inversions.
    for c in d['carries']:
        if c not in notes: continue
        c_data = notes[c]
        c_rank = ORDER_RANK.get(c_data['order'], -1)
        downstream_refs = c_data['needs_refs'] | c_data['holds_refs'] | c_data['traces_refs']
        translated_crossing = 'Translation Boundary' in downstream_refs
        return_layer = d['order'] in RETURN_LAYERS or c_data['order'] in RETURN_LAYERS
        if (c_rank < order_r
            and c_data['kind'] not in EXEMPT_KINDS
            and not c.endswith(' Field')
            and not c.endswith(' Domain')
            and not translated_crossing
            and not return_layer):
            issues['backward_carries'].append(
                f"  {name} ({d['order']}) carries {c} ({c_data['order']})"
            )

    # 2. Broken pair references
    if not NO_PAIR_RE.search(d['pairs_raw']):
        for ref in d['pair_refs']:
            if ref not in all_names:
                issues['broken_pairs'].append(
                    f"  {name} → [[{ref}]] (note not found)"
                )

    # 3. Asymmetric mutual pairs
    if not NO_PAIR_RE.search(d['pairs_raw']):
        for ref in d['pair_refs']:
            if ref not in notes: continue
            other = notes[ref]
            other_pairs = other['pairs_raw']
            is_vertical = bool(NO_PAIR_RE.search(other_pairs))
            back_ref = name in other['pair_refs']
            if is_vertical and name not in other_pairs:
                issues['asymmetric_pairs'].append(
                    f"  {name} → [[{ref}]] but {ref} is vertical or NP"
                )
            elif not is_vertical and not back_ref:
                issues['asymmetric_pairs'].append(
                    f"  {name} → [[{ref}]] but {ref} doesn't reference back"
                )

    # 4. needs/holds divergence (non-Field, non-Domain notes only)
    if not name.endswith(' Field') and not name.endswith(' Domain'):
        missing_in_holds = d['needs_refs'] - d['holds_refs']
        missing_in_needs = d['holds_refs'] - d['needs_refs']
        if missing_in_holds:
            issues['needs_holds'].append(
                f"  {name}: in needs not holds: {sorted(missing_in_holds)}"
            )
        if missing_in_needs:
            issues['needs_holds'].append(
                f"  {name}: in holds not needs: {sorted(missing_in_needs)}"
            )

    # 4b. Current Atlas note-template spine
    missing_spine = [h for h in REQUIRED_SPINE_HEADINGS if h not in d['body_headings']]
    if missing_spine:
        issues['missing_spine'].append(
            f"  {name}: missing headings: {missing_spine}"
        )
    missing_condition_keys = [k for k in REQUIRED_CONDITION_KEYS if k not in d['condition_keys']]
    if missing_condition_keys:
        issues['missing_condition_keys'].append(
            f"  {name}: missing condition keys: {missing_condition_keys}"
        )

    # 5. Broken carries references
    for c in d['carries']:
        if c not in all_names:
            issues['broken_carries'].append(
                f"  {name} carries [[{c}]] (note not found)"
            )

    # 6. Broken traces references
    for t in d['traces_refs']:
        if t not in all_names:
            issues['broken_traces'].append(
                f"  {name} traces [[{t}]] (note not found)"
            )

    # 7. Carries/traces mirror: if A carries B, B should trace to A
    # Exempt: class/order notes (classification carries), field/domain notes
    if (kind not in EXEMPT_KINDS
            and not name.endswith(' Field')
            and not name.endswith(' Domain')):
        for c in d['carries']:
            if c not in notes: continue
            if not mirror_required(d, notes[c]):
                continue
            if name not in notes[c]['traces_refs']:
                issues['carries_traces_mirror'].append(
                    f"  {name} carries [[{c}]] but {c} does not trace back"
                )

# 5. NP count by order
np_by_order = defaultdict(list)
for name, d in notes.items():
    if 'No pair' in d['pairs_raw']:
        np_by_order[d['order']].append(name)

# --- Report ---
print("=" * 60)
print("REALITY MECHANICS VAULT INTEGRITY REPORT")
print(f"Notes checked: {len(notes)}")
print("=" * 60)

checks = [
    ('frontmatter_parse', 'FRONTMATTER PARSE'),
    ('backward_carries', 'BACKWARD CARRIES'),
    ('broken_pairs', 'BROKEN PAIR REFERENCES'),
    ('broken_carries', 'BROKEN CARRIES REFERENCES'),
    ('broken_traces', 'BROKEN TRACES REFERENCES'),
    ('asymmetric_pairs', 'ASYMMETRIC MUTUAL PAIRS'),
    ('carries_traces_mirror', 'CARRIES/TRACES MIRROR (A carries B but B does not trace A)'),
    ('needs_holds', 'NEEDS/HOLDS DIVERGENCE (non-Field/Domain)'),
    ('missing_spine', 'ATLAS TEMPLATE SPINE'),
    ('missing_condition_keys', 'CONDITION HEADER KEYS'),
]

total_issues = 0
for key, label in checks:
    items = issues[key]
    total_issues += len(items)
    status = "✓ clean" if not items else f"✗ {len(items)} issues"
    print(f"\n{label}: {status}")
    for item in sorted(items): print(item)

print(f"\nNO PAIR PLACED YET (by order):")
for order in ['ground','first','second','third','practice','higher']:
    names = np_by_order.get(order,[])
    if names:
        print(f"  {order} ({len(names)}): {', '.join(sorted(names))}")

print(f"\n{'=' * 60}")
print(f"Total issues: {total_issues}")
print("=" * 60)
