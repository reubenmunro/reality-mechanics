# Reality Mechanics — Project Delivery

**Delivery control sheet.** This document tracks repository work as work packages so AI effort can be managed like a project budget. It is not Atlas content, not Stewardship specification, and not platform architecture.

---

## Purpose

This document records how repository work is scoped, assigned, reviewed, and measured. Its job is to show whether AI effort is delivering useful outcomes, reducing risk, and moving the repository toward a stable release.

Use it like a quantity survey: define the package, assign the right consultant, record the deliverable, and review the value returned.

---

## Delivery Model

Reality Mechanics repository work is managed through work packages.

Each package should have:

- one objective
- one lead consultant/model
- a defined deliverable
- clear evidence requirements
- an estimated effort
- an actual effort record
- a review outcome

Do not combine unrelated objectives into one package.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Project Steward** | Owns direction, approves priorities, accepts or rejects work |
| **ChatGPT** | Architectural reviewer, critic, workflow designer, next-prompt writer |
| **Cursor** | Repository investigator, implementer, tester, verifier |
| **Opus-class model** | High-value repository investigation, architectural tracing, audits |
| **Sonnet-class model** | Implementation, refactoring, test repair, platform stabilisation |
| **GPT-class model** | Fast edits, repetitive changes, formatting, lightweight implementation |

The model is selected for the package, not for preference.

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

Each completed package should be reviewed against three measures.

| Measure | Question |
|---------|----------|
| **Risk Reduction** | Did this reduce uncertainty, breakage risk, or release risk? |
| **Knowledge Gain** | Did this make the repository easier to understand or maintain? |
| **Delivery Progress** | Did this move the project measurably closer to stability or release? |

Possible ratings:

- Low
- Medium
- High
- Very High

---

## Work Package Register

| ID | Work Package | Lead | Effort Estimate | Actual Effort | Deliverable | Status | Value Review |
|----|--------------|------|----------------|---------------|-------------|--------|--------------|
| WP001 | Repository cover sheet | Cursor + ChatGPT | Low | 2 review cycles | `PROJECT_STATUS.md` | Complete | High risk reduction; high knowledge gain |
| WP002 | Workflow contract | Cursor + ChatGPT | Low | Pending | `docs/WORKFLOW.md` | Pending | Pending |
| WP003 | Repository build & deployment verification | Cursor / Opus-class | Medium | Pending | Verification report | Pending | Pending |
| WP004 | Platform stability audit | Cursor / Sonnet-class | Medium | Pending | Platform audit report | Pending | Pending |
| WP005 | Stewardship audit continuation | Cursor / Opus-class | High | Pending | Family audit reports | Pending | Pending |
| WP006 | Release candidate preparation | Cursor + ChatGPT | High | Pending | Release candidate notes and verification | Pending | Pending |

Keep this register concise. Detailed reports should live in package-specific notes or linked pull requests.

---

## Package Template

Use this template when opening or reviewing a package.

```markdown
## WP### — Package Name

**Objective**

One clear outcome.

**Lead**

Cursor / model / ChatGPT / Project Steward.

**Scope**

Included work.

**Out of Scope**

Explicit exclusions.

**Evidence Required**

Files, commands, tests, citations, or reports required to prove the work.

**Estimated Effort**

Low / Medium / High / Very High.

**Actual Effort**

Number of Cursor cycles, ChatGPT review cycles, commits, or test passes.

**Deliverable**

Concrete output.

**Status**

Pending / In Progress / Blocked / Complete / Rejected.

**Review**

Risk reduction:
Knowledge gain:
Delivery progress:
Decision:
```

---

## Consultant Selection Guide

| Work Type | Preferred Lead | Reason |
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

Before starting work, ask:

1. What is the objective?
2. What risk does this reduce?
3. What deliverable proves completion?
4. Which consultant is the cheapest competent lead?
5. What would make this package complete?

After completing work, ask:

1. Was the estimate accurate?
2. Did the package reduce risk?
3. Did it create reusable knowledge?
4. Did it expose a new unknown?
5. Should the workflow change?

---

## Current Delivery Focus

**Next package:** WP003 — Repository build & deployment verification.

Reason: the platform layer must be trusted before wider Atlas coordination and release preparation. Build, test, sync, deploy, and health checks are higher-leverage than auditing a single Atlas term while repository mechanics remain unverified.

---

## Maintenance

Update this document when a work package is opened, completed, rejected, or materially re-scoped.

Keep it operational. Do not let it become a roadmap, essay, or backlog of unpriced intentions.
