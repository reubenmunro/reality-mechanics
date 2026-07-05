# Reality Mechanics — Project Delivery

**Delivery control sheet.** This document tracks repository work as contracts so AI effort can be managed like a project budget. It is not Atlas content, not Stewardship specification, and not platform architecture.

---

## Purpose

This document records how repository work is scoped, assigned, reviewed, and measured. Its job is to show whether AI effort is delivering useful outcomes, reducing risk, and moving the repository toward a stable release.

Use it like a quantity survey: define the contract, assign the right consultant, record the deliverable, and review the value returned.

---

## Delivery Model

Reality Mechanics repository work is administered through commissions and contracts.

The Project Steward commissions work. The Architect prepares the contract. The Contractor fulfils the contract and returns evidence. The Architect reviews the evidence and recommends a decision. The Project Steward accepts, rejects, or continues the commission.

```text
Commission
↓
Contract
↓
Evidence
↓
Architect Review
↓
Steward Decision
↓
Resolution
```

Do not treat repository work as informal tasks. Each piece of work should have one governing question, one defined scope, and one evidence standard.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Project Steward** | Commissions work, owns direction, accepts or rejects recommendations |
| **Architect / ChatGPT** | Prepares contracts, reviews evidence, challenges assumptions, recommends decisions |
| **Contractor / Cursor** | Investigates the repository, implements approved work, runs tests, returns evidence |
| **Opus-class model** | High-value repository investigation, architectural tracing, audits |
| **Sonnet-class model** | Implementation, refactoring, test repair, platform stabilisation |
| **GPT-class model** | Fast edits, repetitive changes, formatting, lightweight implementation |

The model is selected for the contract, not for preference.

---

## Effort Classes

| Class | Meaning | Typical Use |
|-------|---------|-------------|
| **Low** | Small, bounded, low-risk | Single document, small edit, formatting, simple verification |
| **Medium** | Requires investigation or coordination | Build verification, surface audit, focused implementation |
| **High** | Requires broad repository reasoning | Atlas audit, deployment architecture, release preparation |
| **Very High** | Multi-stage or high-risk | Major migration, release candidate, security hardening |

Effort is not only token cost. It includes human review time, risk, and downstream rework.

---

## Value Measures

Each completed contract should be reviewed by relation, not invented percentage.

Use ratios where the repository provides counts, totals, passes, failures, or coverage. Use qualitative relation where the work cannot be honestly counted.

| Measure | Question | Preferred Relation |
|---------|----------|--------------------|
| **Risk Reduction** | What known uncertainty, breakage risk, or release risk did this reduce? | Open risk : reduced risk |
| **Knowledge Gain** | What became more traceable after the contract? | Unknown : known |
| **Delivery Progress** | What moved closer to stable release? | Blocked : unblocked, pending : complete |
| **Verification Coverage** | What portion of the relevant surface has been checked? | Checked : total |
| **Rework Avoidance** | What future review, repair, or investigation did this prevent? | Rework avoided : work performed |

Ratings may be used only when a ratio cannot be honestly formed:

- Low
- Medium
- High
- Very High

Do not invent percentages. If a relation cannot be counted from repository evidence, describe it qualitatively and mark the count as unknown.

---

## Contract Register

| ID | Contract | Type | Lead | Effort Estimate | Actual Effort | Deliverable | Status | Value Review |
|----|----------|------|------|----------------|---------------|-------------|--------|--------------|
| C001 | Repository cover sheet | Governance | Cursor + ChatGPT | Low | 2 review cycles | `PROJECT_STATUS.md` | Resolved | High risk reduction; high knowledge gain |
| C002 | Delivery framework | Governance | ChatGPT + GitHub connector | Low | 1 creation cycle | `docs/PROJECT_DELIVERY.md` | Resolved | Established contract control |
| C003 | Repository reproducibility | Verification | Cursor / Opus-class | Medium | 1 Opus investigation cycle | Reproducibility evidence report (`docs/reports/C003-repository-reproducibility.md`) | Resolved | Development reproducible : canonical deployment blocked |
| C004 | Platform stability audit | Stabilisation | Cursor / Sonnet-class | Medium | Pending | Platform audit report | Pending | Pending |
| C005 | Stewardship audit continuation | Audit | Cursor / Opus-class | High | Pending | Family audit reports | Pending | Pending |
| C006 | Release candidate preparation | Release | Cursor + ChatGPT | High | Pending | Release candidate notes and verification | Pending | Pending |

Keep this register concise. Detailed evidence should live in contract-specific notes, reports, pull requests, or commits.

---

## Contract Types

| Type | Purpose |
|------|---------|
| **Governance** | Establish project control, orientation, or operating method |
| **Discovery** | Learn repository truth without changing files |
| **Audit** | Check Atlas, Stewardship, or platform material against an accepted standard |
| **Coordination** | Resolve inconsistencies between already-authoritative sources |
| **Implementation** | Make approved repository changes |
| **Verification** | Prove that a claim, build, test, deployment, or fix holds |
| **Stabilisation** | Reduce operational, security, or release risk |
| **Release** | Package, freeze, document, and sign off a release candidate |

---

## Contract Template

Use this template when issuing or reviewing a contract.

```markdown
## C### — Contract Name

**Commission**

The Project Steward's request, expressed as a clear commission.

**Governing Question**

The single question this contract must answer.

**Lead**

Cursor / model / ChatGPT / Project Steward.

**Type**

Governance / Discovery / Audit / Coordination / Implementation / Verification / Stabilisation / Release.

**Scope**

Included work.

**Out of Scope**

Explicit exclusions.

**Evidence Required**

Files, commands, tests, citations, reports, or repository facts required to satisfy the contract.

**Estimated Effort**

Low / Medium / High / Very High.

**Actual Effort**

Number of Cursor cycles, ChatGPT review cycles, commits, or test passes.

**Deliverable**

Concrete output.

**Status**

Pending / In Progress / Blocked / Resolved / Rejected.

**Architect Review**

Evidence sufficient:
Risk reduction relation:
Knowledge gain relation:
Delivery progress relation:
Verification coverage, if countable:
Recommendation:

**Steward Decision**

Accepted / Rejected / Continue.
```

---

## Consultant Selection Guide

| Contract Type | Preferred Lead | Reason |
|-----------|----------------|--------|
| Repository discovery | Opus-class in Cursor | Best use of broad context and relationship tracing |
| Atlas family audit | Opus-class in Cursor | Requires structural reading and evidence discipline |
| Stewardship critique | ChatGPT | Architectural review and burden-of-proof judgement |
| Implementation | Sonnet-class in Cursor | Efficient code and document changes after approval |
| Repetitive edits | GPT-class or Sonnet-class | Lower reasoning cost |
| Build/test verification | Cursor | Must run against repository state |
| Release review | ChatGPT + Cursor | Requires both architectural judgement and repository proof |

Use the cheapest competent consultant. Do not use high-cost reasoning for low-risk production work.

---

## Budget Discipline

Before issuing a contract, ask:

1. What is the commission?
2. What relation does this improve or clarify?
3. What deliverable proves completion?
4. Which consultant is the cheapest competent lead?
5. What would make this contract complete?

After reviewing evidence, ask:

1. Was the estimate accurate?
2. Did the contract improve or clarify the stated relation?
3. Did it create reusable knowledge?
4. Did it expose a new unknown?
5. Should the workflow change?

---

## Current Delivery Focus

**Next contract:** C004 — Platform stability audit.

**Commission:** Audit the operational stability of the active platform surfaces (Field, Calibration, MCP) and their supporting build, sync, and deployment paths.

Reason: C003 confirmed the repository is reproducible for development but not for canonical deployment without external Cloudflare provisioning. Platform stability is the next risk to characterise before release preparation. See `docs/reports/C003-repository-reproducibility.md`.

---

## Maintenance

Update this document when a contract is issued, resolved, rejected, or materially re-scoped.

Keep it operational. Do not let it become a roadmap, essay, or backlog of unpriced intentions.
