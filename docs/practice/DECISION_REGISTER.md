# Decision Register

## Purpose

This register records accepted practice and architectural decisions that affect how Reality Mechanics repository work is commissioned, carried, reviewed, or resolved.

It is not a changelog.

It records why significant decisions were made so they remain retraceable.

---

## D001 — Repository is Source of Truth

**Decision**

The repository is the source of truth for repository work.

Previous conversations, AI memory, and assumptions are subordinate to repository evidence.

**Reason**

This prevents drift and keeps all future work grounded in retraceable files, tests, reports, and commits.

**Alternative Considered**

Use previous ChatGPT conversations as contextual authority.

**Status**

Accepted.

---

## D002 — Contracts over Tasks

**Decision**

Repository work is administered through contracts rather than informal tasks.

**Reason**

A contract defines pressure, commission, governing question, scope, exclusions, evidence, deliverable, and acceptance. This prevents scope spread and makes AI effort measurable.

**Alternative Considered**

Task lists, TODOs, ad hoc prompts.

**Status**

Accepted.

---

## D003 — Evidence Before Recommendation

**Decision**

The contractor returns evidence before the architect recommends action.

**Reason**

Evidence and recommendation carry different authority. Keeping them separate prevents investigation from becoming implementation or opinion.

**Alternative Considered**

Cursor investigates and updates governance documentation in the same step.

**Status**

Accepted after C003.

---

## D004 — Relation over Percentage

**Decision**

Delivery value is measured by relation where possible, not invented percentage.

**Reason**

The repository often provides actual countable relations: checked : total, passed : failed, known : unknown, blocked : unblocked. These are more faithful to Reality Mechanics than arbitrary confidence percentages.

**Alternative Considered**

Use percentage confidence scores.

**Status**

Accepted.

---

## D005 — Role Separation

**Decision**

Reality Mechanics repository work distinguishes Steward, Architect, Contractor, and Repository authority.

**Reason**

The steward commissions and decides. The architect specifies and reviews. The contractor investigates and implements. The repository preserves. This separation reduces drift and prevents AI tools from exceeding their role.

**Alternative Considered**

Use one AI agent for direction, investigation, implementation, and review.

**Status**

Accepted as working practice.

---

## D006 — Practice Separate from Atlas

**Decision**

Practice documents live separately from Atlas content and Stewardship specification.

**Reason**

The Atlas records Reality Mechanics content. Stewardship verifies Atlas changes. Practice governs how work is commissioned, carried, reviewed, and resolved. Mixing these bodies would blur authority.

**Alternative Considered**

Store practice logic inside stewardship documentation or Atlas notes.

**Status**

Accepted.
