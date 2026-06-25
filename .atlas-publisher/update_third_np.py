#!/usr/bin/env python3
"""Update all third-order NP notes to vertical. Run from .atlas-publisher folder."""
import os, re, yaml

VAULT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Reality_Mechanics")

targets = [
    'AI', 'AI Misrepair', 'Apology Without Repair', 'Applied Read', 'Architecture',
    'Bearing Relations', 'Bearing Source', 'Behaviour', 'Belong', 'Black Hole',
    'Care Without Bearing', 'Carrying and Coupling', 'Casimir Plates', 'Consent',
    'Control', 'Cosmic Polarity Read', 'Dark Matter', 'Documentation Gap', 'Domain',
    'Earth', 'Earth Carrying', 'Enchantment', 'Exchanging', 'Experimental Science',
    'Expression', 'Externalised Cognition', 'Fatigue Boundary', 'Field Availability Pattern',
    'Gardening', 'Gesture', 'Glamour', 'Hope', 'Illusion', 'Injury', 'Language',
    'Language Domain', 'Law', 'Life', 'Load-Bearing', 'Making', 'Misrepair', 'Music',
    'Musical Rhythm', 'Nesting', 'Nourishment', 'Organic', 'Organic and Organised Organisation',
    'Pace Mismatch', 'Parenting', 'Parenting Boundary', 'Parenting Repair', 'Path Reads',
    'Physical', 'Physical Field Conditions', 'Place', 'Protective Control', 'Relationship',
    'Repair Mismatch', 'Representation', 'Restraint', 'Safety Boundary', 'Scene',
    'Self-Control', 'Self-Harm', 'Ship and Ark', 'Silence', 'Society', 'Space-Based Solar Power',
    'Spell', 'Surface Patch', 'Sustenance', 'Technology Domain', 'Terms of Service',
    'Translation', 'Translation Boundary'
]

updated = []
skipped = []

for root, dirs, files in os.walk(VAULT):
    for f in files:
        name = f[:-3]
        if name not in targets:
            continue
        path = os.path.join(root, f)
        with open(path) as fh:
            raw = fh.read()
        parts = raw.split('---', 2)
        if len(parts) < 3:
            skipped.append(f"{name}: no frontmatter")
            continue
        try:
            fm = yaml.safe_load(parts[1])
            if not fm:
                skipped.append(f"{name}: empty frontmatter")
                continue
        except Exception as e:
            skipped.append(f"{name}: yaml error {e}")
            continue

        fm_text = parts[1]
        body = parts[2]
        cond = fm.get('conditions') or {}
        kind = fm.get('kind', 'term')
        domain = fm.get('domain', '') or 'third-order'
        carries_raw = cond.get('carries') or []
        carries = re.findall(r'\[\[([^\]|]+)', str(carries_raw))

        if kind == 'class':
            fm_pairs = f'Asymmetry carries downward — class note grouping {domain} reads; pairs emerge within the branch as it develops'
            body_pairs = (f'{name} is a class note. It groups {domain} reads and organises its members '
                          f'rather than pairing with a lateral co-present condition at this order. '
                          f'Lateral pairs within this class emerge as the branch develops.')
        elif carries:
            refs = ', '.join(f'[[{c}]]' for c in carries)
            fm_pairs = f'Asymmetry carries downward — into {refs}'
            body_pairs = (f'{name} is vertical. It carries forward into {refs}. '
                          f'There is no lateral co-present condition at this order that {name} requires '
                          f'and that requires {name} in return — the structural movement is downward into the domain branch.')
        else:
            fm_pairs = f'Asymmetry carries downward — terminal {domain} read; lateral pairs develop within the branch'
            body_pairs = (f'{name} is vertical. It is a terminal domain read at third order within the {domain} branch. '
                          f'It does not carry a further structural term at this level. '
                          f'Lateral pairs for this term develop as the {domain} branch is built out.')

        fm_new = re.sub(
            r'^( {0,4}pairs:\s*).*$',
            lambda m: f'  pairs: "{fm_pairs}"',
            fm_text, count=1, flags=re.MULTILINE
        )

        body_new = re.sub(
            r'(## Pairs\n\n?)(.*?)(\n## |\Z)',
            lambda m: f'## Pairs\n\n{body_pairs}\n\n' + (m.group(3) if m.group(3).strip() else ''),
            body, count=1, flags=re.DOTALL
        )

        new_content = f'---{fm_new}---{body_new}'
        with open(path, 'w') as fh:
            fh.write(new_content)
        updated.append(name)

print(f"Updated: {len(updated)}")
for n in sorted(updated):
    print(f"  {n}")
if skipped:
    print(f"\nSkipped: {len(skipped)}")
    for s in skipped:
        print(f"  {s}")
