#!/usr/bin/env python3
"""
Update second-order NP notes to vertical pairs.
Run from the .atlas-publisher folder.
"""
import os, re, yaml

VAULT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Reality_Mechanics")

# Map: note name -> (frontmatter pairs text, body pairs text)
UPDATES = {
    'Apparent Bearing': (
        "Asymmetry carries downward — into [[Visible Bearing]]",
        "Apparent Bearing is vertical. It names the read of bearing becoming presented, and carries this forward into [[Visible Bearing]] (bearing readable as bearing). No lateral co-present condition is required for Apparent Bearing to be locatable — the presentation of bearing has no structural sibling at this order."
    ),
    'Bearing Read': (
        "Asymmetry carries downward — names the class of reads through which bearing becomes readable at second order",
        "Bearing Read is a class note. It groups the second-order reads through which bearing becomes readable in specific ways. As a class, it is vertical — it organises its members rather than pairing with a lateral co-present condition."
    ),
    'Become': (
        "Asymmetry carries downward — Become is downstream of [[Being]] through [[Process]]; presence changing has no lateral sibling required for it to be locatable at this order",
        "Become is vertical. It names presence changing while remaining traceable, and is carried by [[Being]] through [[Process]]. There is no lateral co-present condition that Become requires and that requires Become in return. Change of presence flows from sustained presence — it does not sit beside it."
    ),
    'Being': (
        "Asymmetry carries downward — into [[Become]]",
        "Being is vertical. It names presence carried, and carries this forward into [[Become]] (presence changing while remaining traceable). There is no lateral co-present condition required for Being to be locatable — sustained presence has no structural sibling at this order."
    ),
    'Difference': (
        "Asymmetry carries downward — into [[Form]], [[Information]], [[Change]]",
        "Difference is vertical. It names distinguishable non-sameness, and carries this forward into [[Form]], [[Information]], and [[Change]]. Difference is held by [[Asymmetry]] and [[Readability]] — it is the readable face of asymmetry at second order, not a co-present lateral condition alongside another second-order term."
    ),
    'Function': (
        "Asymmetry carries downward — into [[Strategy]]",
        "Function is vertical. It names what a form makes available through compatible carrying, and carries this forward into [[Strategy]]. Function holds [[Structure]] — it is downstream of structure, not co-present with it as a lateral pair."
    ),
    'Identity': (
        "Asymmetry carries downward — into [[Stability]], [[Self]]",
        "Identity is vertical. It names sustained distinguishability, and carries this forward into [[Stability]] and [[Self]]. Identity holds [[Form]] and [[Recognition]] — it is downstream in the dependency chain, not a lateral co-present condition alongside Difference or Form."
    ),
    'Influence': (
        "Asymmetry carries downward — into [[Enchantment]], [[Binding]], [[Wonder]]",
        "Influence is vertical. It names one participating condition altering how another is read, carried, or made available, and carries this forward into [[Enchantment]], [[Binding]], and [[Wonder]]. Influence holds [[Participation]], [[Carrying]], and [[Readability]] — there is no lateral co-present condition that Influence requires and that requires Influence in return at this order."
    ),
    'Know': (
        "Asymmetry carries downward — into [[Knowledge]], [[Competence Boundary]]",
        "Know is vertical. It names a recognised read held as available, and carries this forward into [[Knowledge]] and [[Competence Boundary]]. Know holds [[Recognition]], [[Carrying]], and [[Compatibility]] — it is a downstream read of recognition and carrying, not a lateral co-present condition alongside another second-order term."
    ),
    'Live': (
        "Asymmetry carries downward — into [[Being]]",
        "Live is vertical. It names carrying continuing in participation, and carries this forward into [[Being]]. There is no lateral co-present condition that Live requires and that requires Live in return at this order."
    ),
    'Load': (
        "Asymmetry carries downward — into [[Capacity]], [[Overload]]",
        "Load is vertical. It names what bears on carrying, and carries this forward into [[Capacity]] and [[Overload]]. Load holds [[Bearing]] and [[Carrying]] — it is a downstream read of what bearing presses against carrying, not a lateral co-present condition alongside another second-order term."
    ),
    'Medium': (
        "Asymmetry carries downward — into [[Structure]], [[Flow]], [[Current]]",
        "Medium is vertical. It names what carrying occurs through, and carries this forward into [[Structure]], [[Flow]], and [[Current]]. Medium holds [[Carrying]], [[Participation]], and [[Allow]] — the passage condition of allowance makes medium available. There is no lateral co-present condition required for Medium to be locatable at this order."
    ),
    'Pair': (
        "Asymmetry carries downward — Pair names a structural condition, not a participant in one; the concept of pairing does not itself sit beside a lateral co-present sibling at this order",
        "Pair is vertical. It names a bounded read of coupling in which two distinguishable conditions are held together as a readable third. The concept of pairing holds [[Coupling]], [[Readability]], and [[Closure Scope]] — it is a downstream read of coupling at scope, not itself a member of a lateral pair. The structural condition that Pair names (two visible conditions + one invisible carrier) is what Pair places, not what Pair sits within."
    ),
    'Pattern': (
        "Asymmetry carries downward — into [[Coherence]], [[Kind]]",
        "Pattern is vertical. It names readable recurrence, and carries this forward into [[Coherence]] and [[Kind]]. Pattern holds [[Recurrence]] and [[Recognition]] — it is a downstream read of recognisable repetition, not a lateral co-present condition alongside another second-order term."
    ),
    'Proceed': (
        "Asymmetry carries downward — into [[Progress]], [[Digress]]",
        "Proceed is vertical. It names continuation without interruption, and carries this forward into [[Progress]] and [[Digress]]. Proceed holds [[Process]] — it is a downstream read of process continuing, not a lateral co-present condition alongside another second-order term."
    ),
    'Reality': (
        "Asymmetry carries downward — into [[World]]",
        "Reality is vertical. It names coupled relation readable as real, and carries this forward into [[World]]. Reality holds [[Real]] and [[Coupling]] — it is the readable face of coupling at a real scope, not a lateral co-present condition alongside another second-order term."
    ),
    'Recursive': (
        "Asymmetry carries downward — into [[Recursive Regulation]]",
        "Recursive is vertical. It names carrying re-entering its own condition, and carries this forward into [[Recursive Regulation]]. Recursive holds [[Recurrence]] and [[Carrying]] — it is a downstream read of carrying turning back on itself, not a lateral co-present condition alongside another second-order term."
    ),
    'Recursive Regulation': (
        "Asymmetry carries downward — into [[Stability]]",
        "Recursive Regulation is vertical. It names regulation occurring through recursive carrying, and carries this forward into [[Stability]]. Recursive Regulation holds [[Recursive]] and [[Regulation]] — it is downstream of Recursive, not a lateral co-present condition alongside another second-order term."
    ),
    'Resistance': (
        "Asymmetry carries downward — into [[Friction]], [[Drag]], [[Grip]]",
        "Resistance is vertical. It names carrying opposed, narrowed, or slowed by a condition it must pass through, and carries this forward into [[Friction]], [[Drag]], and [[Grip]]. Resistance holds [[Constraint]], [[Flow]], and [[Carrying]] — it is a downstream read of carrying meeting opposition, not a lateral co-present condition alongside another second-order term."
    ),
    'Structure': (
        "Asymmetry carries downward — into [[Strategy]], [[Stability]]",
        "Structure is vertical. It names form held as aligned carrying relation, and carries this forward into [[Strategy]] and [[Stability]]. Structure holds [[Form]], [[Carrying]], and [[Relation]] — it is a downstream alignment of form and carrying, not a lateral co-present condition alongside another second-order term."
    ),
    'Terminal': (
        "Asymmetry carries downward — into [[Collapse]]",
        "Terminal is vertical. It names the boundary where a read stops because continuation crosses a closure scope the current read cannot hold, and carries this forward into [[Collapse]]. Terminal holds [[Closure Scope]] and [[Boundary]] — it is a downstream read of closure scope meeting boundary, not a lateral co-present condition alongside another second-order term."
    ),
    'Visible Bearing': (
        "Asymmetry carries downward — into [[Observation]]",
        "Visible Bearing is vertical. It names bearing readable as bearing, and carries this forward into [[Observation]]. Visible Bearing holds [[Apparent Bearing]] and [[Visible]] — it is downstream of apparent bearing becoming visible, not a lateral co-present condition alongside another second-order term."
    ),
    'World': (
        "Asymmetry carries downward — into [[Knowledge]]",
        "World is vertical. It names reality held as a participating scope, and carries this forward into [[Knowledge]]. World holds [[Reality]] and [[Participation]] — it is downstream of reality becoming participatory, not a lateral co-present condition alongside another second-order term."
    ),
}

updated = []
errors = []

for root, dirs, files in os.walk(VAULT):
    for f in files:
        name = f[:-3]
        if name not in UPDATES: continue
        path = os.path.join(root, f)
        with open(path) as fh: content = fh.read()
        parts = content.split('---', 2)
        if len(parts) < 3:
            errors.append(f"{name}: no frontmatter")
            continue
        try:
            fm = yaml.safe_load(parts[1])
        except Exception as e:
            errors.append(f"{name}: yaml error {e}")
            continue

        fm_pairs, body_pairs = UPDATES[name]
        
        # Update frontmatter pairs
        raw_fm = parts[1]
        # Find and replace pairs line
        if re.search(r'^\s+pairs:', raw_fm, re.MULTILINE):
            # Replace existing pairs value (handles multi-line quoted strings)
            # Simple approach: replace the pairs key entirely
            new_raw_fm = re.sub(
                r'(\s+pairs:\s*)("No pair placed yet"|"[^"]*"|.*?)(\n)',
                f'  pairs: "{fm_pairs}"\n',
                raw_fm, count=1
            )
        else:
            errors.append(f"{name}: no pairs key in frontmatter")
            continue
        
        # Update body ## Pairs section
        body = parts[2]
        new_body = re.sub(
            r'(## Pairs\n+)(.*?)(\n## )',
            f'## Pairs\n\n{body_pairs}\n\n## ',
            body, count=1, flags=re.DOTALL
        )
        if new_body == body:
            # Try at end of file
            new_body = re.sub(
                r'(## Pairs\n+)(.*?)$',
                f'## Pairs\n\n{body_pairs}\n',
                body, count=1, flags=re.DOTALL
            )

        new_content = f"---{new_raw_fm}---{new_body}"
        with open(path, 'w') as fh: fh.write(new_content)
        updated.append(name)

print(f"Updated: {len(updated)}")
for n in sorted(updated): print(f"  {n}")
if errors:
    print(f"Errors: {len(errors)}")
    for e in errors: print(f"  {e}")
