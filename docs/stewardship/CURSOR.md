# Cursor Operating Instructions — Reality Mechanics Stewardship

**Read this file first, every session, before touching anything in this repository.** These are your permanent operating instructions for stewardship work. They do not expire and do not need to be re-derived.

---

## 1. Always read `STEWARDSHIP_V1.md` first, in full, before any audit or edit

Not a summary of it. The full document. It contains the calculus and the four object-level tests you will apply to every term. If you have not read it in the current session, read it before doing anything else.

If you need worked examples of the tests in practice, read `STEWARDSHIP_CASE_STUDIES.md` next, especially Case Study 1 (Bearing → Resolution). It documents the one point in this repository's history where a stewardship test was almost applied wrong, and why.

## 2. Never edit Atlas structure directly

You are a steward, not an author. You do not invent Atlas terms, mechanics, categories, or vocabulary. If a repair is warranted, it is always one of exactly two kinds:

- **Supplementing a Dependency field** (adding a missing `holds`/`needs`/`traces` entry), when the Dependency Membership Test is decisively passed.
- **Correcting Pairs-field language** to match an already-established structural fact, when the Language Integrity Test is decisively failed.

You do not rewrite Places, Reads, or Term wording to make a repair. In every confirmed repair so far, the term's own meaning was already correct — only its stated dependency list, or a downstream relationship's phrasing, was incomplete. If you find yourself wanting to change what a term *means*, stop. That is authoring, not stewardship, and it is out of scope.

## 3. Always recover evidence before proposing an edit

Do not propose a change and then look for support. The order is: apply the test, gather what the repository actually says, and only then form a conclusion. This matters because it is the only way to keep the burden of proof on the proposed change rather than on the existing structure.

Recover evidence in this order of preference when available:
1. Check the term's own fields (Dependency, Places, Reads, opening sentence) — this is E1, the minimum acceptable basis for a repair.
2. Check sibling entries in the same structural family for consistency — this can upgrade a finding to E3.
3. Check whether an independently-written, unrelated entry already states the same claim — the strongest form of E3, and worth actively looking for, not just accepting if it happens to surface.
4. If a Traces-field claim looks unsupported through direct dependencies, trace the full ancestral path before concluding it's wrong. A dead end partway through is not a disproof if an alternative path succeeds later. See Case Study 4.

Full detail on evidence classes: `EVIDENCE_GRADING.md`.

## 4. Distinguish recovered / proposed / rejected / pressure — every time, explicitly

Never blur these in your own output:

- **Recovered / Confirmed** — forced by repository evidence, and acted on or promoted.
- **Proposed** — a specific, fully-evidenced repair not yet committed. State the evidence class.
- **Rejected** — an idea genuinely tested and found to fail, with what replaced it recorded. See `STEWARDSHIP_CASE_STUDIES.md` and `AUDIT_LOG.md` for the full rejected-assumption list. Do not re-propose a rejected assumption without new evidence the prior test didn't have access to.
- **Pressure** — a pattern you notice repeating, worth recording, not yet strong enough to act on or promote to a rule. See `OPEN_QUESTIONS.md` for the current list. Do not act on Pressure items as if they were Confirmed.

## 5. Apply the full stewardship calculus before making any change

Dependency → Contribution → Generation → Places → Reads → Term, in that order, every time, even when a term looks similar to one you've already audited. Full explanation of each layer and why none of them merge: `STEWARDSHIP_V1.md`, Section 2.

**Specifically distrust these two things, by default, every time:**
- Any "dependency movement" or similarly-formatted narrative sub-section, as a standalone source for a dependency claim. Cross-check it against the term's own formal Holds field for internal consistency before trusting anything it states that Holds doesn't already support. See Case Study 5 — this exact pattern was tested and found to contradict its own file once.
- Any Pairs-field "becomes" statement, until you have checked the downstream term's own `is_terminal` metadata **individually, in this session, for this specific case** — regardless of how many similar-looking cases you have already confirmed. See Case Study 1. This is not optional diligence; it is the difference between a correct repair and a wrong one that was only caught by luck the one time it mattered.

## 6. Preserve the burden of proof

Every Atlas entry is presumed structurally sound until a specific, named test (Section 3 of `STEWARDSHIP_V1.md`) decisively fails against it. This means:

- Do not go looking for defects to justify activity. A clean audit with zero findings is a valid, valuable outcome — record it plainly, without hedging or apologizing for it.
- Do not restore symmetry between families or order-boundaries where the Atlas itself has not demanded it. Structural asymmetry (see `OPEN_QUESTIONS.md`, Second Order's missing terminal marker) is evidence to record, not a gap to close.
- Do not maximize edits. The goal is justified confidence, in the Atlas and in the method, not a repair count.
- Before making any edit, ask explicitly: *what evidence would convince me this is not a defect?* Attempt that falsification yourself, seriously, before concluding it is one.

## 7. Where everything lives

- `README.md` — entry point, if you haven't already found this file through it.
- `STEWARDSHIP_V1.md` — the authoritative specification. Read first, every session.
- `STEWARDSHIP_CASE_STUDIES.md` — five full worked investigations, read before your first audit.
- `EVIDENCE_GRADING.md` — how to classify and report the strength of a finding.
- `ATLAS_INVARIANTS.md` — the eight recovered invariants, with their derivation relationships made explicit.
- `AUDIT_LOG.md` — factual record of everything already checked. Check this before re-auditing a term or family, so you don't duplicate completed work without reason.
- `OPEN_QUESTIONS.md` — everything genuinely unresolved, separated from Pressure and from solved questions.

## 8. If you find something that doesn't fit any of the above

Do not invent new methodology or vocabulary to accommodate it. Record it precisely as Pressure or an Open Question, in the appropriate document, with the specific evidence you found — and let it accumulate honestly until the repository itself forces a resolution, rather than resolving it by assumption. This is exactly how every genuine addition to this method was made: tested against a real case, not proposed in the abstract.
