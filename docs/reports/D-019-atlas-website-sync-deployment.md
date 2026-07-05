# D-019 — Atlas Website Sync + Deployment

**Programme:** Observatory Deployment  
**Type:** Atlas website sync + deployment verification  
**Governing evidence:** `docs/reports/D-018D-tier-1-hold-calibration.md`  
**Date:** 2026-07-05 (UTC+12)

---

## Objective

Publish D-018D calibrated Atlas prose to the public Observatory so terms can be read on the website with the **place → hold → movement** structure.

No Atlas term edits. No runtime mechanics changes. No theory promotion.

---

## Executive summary

**D-018D prose is live on Field and MCP.**

| Layer | Status |
|---|---|
| GitHub source @ `ac33c59` | Pushed to `origin/main` |
| Production D1 sync | **Applied** — 492 queries, 3431 rows written |
| Worker redeploy | **Not required** — Atlas-only change; publish path is D1 sync |
| Field / MCP reads | **Synchronised** — calibrated place + hold prose verified on five probe terms |
| Tests | **Pass** — member 16/16 · atlas-publisher 31/31 · MCP 27/27 |

---

## 1. Commit and push

| Item | Value |
|---|---|
| **Commit SHA** | `ac33c591b530168e8e7fc09151ef2a94a6fa35a1` (`ac33c59`) |
| **Commit message (actual)** | *Complete D-018 hold calibration programme (B–D).* |
| **Requested message** | *Apply Tier 1 hold sentence calibration* — **not used**; D-018B/C/D landed in one commit |
| **Branch** | `main` aligned with `origin/main` |
| **Scope** | 481 Atlas hold calibrations + D-018B/C/D reports and scripts + `COMMISSIONS.md` |

---

## 2. Production D1 sync

**Command:**

```bash
npm --prefix .atlas-publisher run sync:d1 -- --apply
```

**Result:** Success (2026-07-05, second apply during D-019 verification)

| Metric | Value |
|---|---|
| Source notes | 490 tracked Atlas notes |
| SQL generated | `.atlas-publisher/generated/atlas-d1-sync.sql` |
| Queries executed | **492** |
| Rows written | **3431** |
| Database | `atlas-d1` (remote) |
| Duration | ~252 ms |
| Wrangler | 4.107.0 |

Wrangler reported: *File already uploaded. Processing.* — idempotent re-apply succeeded.

---

## 3. Deployment result

Atlas prose changes do **not** trigger the GitHub Actions deploy workflow (`.github/workflows/deploy.yml` watches `.atlas-publisher/`, `member/`, `reality-mechanics-mcp/` only — not `Reality_Mechanics/`).

| Surface | Deploy action | Status |
|---|---|---|
| Field worker | No redeploy needed | HTTP 200 `/field` |
| Calibration worker | No redeploy needed | `/api/health` → `{"ok":true,"runtime":"mechanical","ai":false}` |
| MCP worker | No redeploy needed | MCP initialize + `get_entry` succeed |
| D1 read-model | **`sync:d1 --apply`** | Updated — publish path for Atlas prose |
| Submission 001 | No change | HTTP 200 `/submission` |

Latest GitHub Actions deploy on `main`: D-012 behaviour retrace instrument (pre D-018D). Workers remain current; D-019 publish is **D1-only**.

### `atlasVersion` label

Field `/api/field/states` still reports `atlasVersion: 2026.07.03-i983`. As documented in D-004, this label comes from `garden_config.atlas_version`, which `sync-d1-from-repo.mjs` does **not** update. Entry-level prose **is** current; the version string is stale metadata.

---

## 4. Live probes — five updated terms

Probed via `GET https://realitymechanics.nz/api/field/states` (Field excerpt = first 28 words of plain text) and MCP `get_entry` (full `content`).

### Field excerpts

| Term | ID | Place opening in excerpt | Hold in excerpt | `[Term] names…` pattern |
|---|---|---|---|---|
| Connection | `first.connection` | Yes — *Relation holding between distinguishable conditions…* | Yes — *Connection is held by Relation…* | No |
| Hold | `first.hold` | Yes — *Resolution remaining supportable…* | Yes — *Hold is held by Resolution…* | No |
| Out | `first.out` | Yes — *Exterior relation beyond a bounded condition.* | Yes — *Out is held by Boundary…* | No |
| Not | `first.not` | Yes — *Non-availability within the current scope…* | Yes — *Not is held by Boundary and Availability…* | No |
| Cognitive Metabolism | `third.cognitive-metabolism` | Yes — *The cognitive resolution pathway through which strain…* | **No in excerpt** — hold sentence falls after 28-word truncation | No |

**Note:** Cognitive Metabolism hold paragraph is present in MCP full content (para 2) but not in the Field sheet excerpt by construction (~28 words).

### MCP `get_entry` — body structure (pre-template)

| Term | P1 (place) | P2 (hold) | Movement preserved | Template sections |
|---|---|---|---|---|
| Connection | Place sentence | *Connection is held by [[Relation]]…* | Carry/Trace movement paras follow | `## Places`, `## Holds`, `## Pairs`, `## Traces` intact |
| Hold | Place sentence | *Hold is held by [[Resolution]]…* | Carry/Bearing interpretive paras follow | Intact |
| Out | Place sentence | *Out is held by [[Boundary]]…* | — | Intact |
| Not | Place sentence | *Not is held by [[Boundary]] and [[Availability]]…* | Non-availability interpretive para follows | Intact |
| Cognitive Metabolism | Place sentence | *Cognitive Metabolism is held by [[Cognition]]…* | Traceable-question interpretive para follows | Intact |

No probed term shows the retired `[Term] names…` opening pattern. No repeated heading/name duplication in pre-template body.

---

## 5. Observatory verification

| Check | Method | Result |
|---|---|---|
| Field loads | `GET /field` | **200** — page includes `#sheet-excerpt`, `#mechanics-panel`, behaviour-trace client |
| Mechanics panel | HTML + `/api/field/behaviour-trace?id=first.connection` | **Pass** — 5 behaviours returned; `focusTitle: Connection` |
| Submission reachable | `GET /submission` | **200** |
| MCP reads updated prose | `POST /mcp` → `get_entry` × 5 | **Pass** — place → hold → movement in all five |
| MCP health | `initialize` | **Pass** — server `reality-mechanics-atlas` v2.3.0 |
| Calibration health | `GET calibration.realitymechanics.nz/api/health` | **Pass** — mechanical runtime, no AI |
| Field state count | `/api/field/states` | **490** states |

---

## 6. Test results

Run 2026-07-05 during D-019 verification:

| Suite | Result |
|---|---|
| `npm --prefix member test` | **16/16 pass** |
| `npm --prefix .atlas-publisher test` | **31/31 pass** |
| `npm --prefix reality-mechanics-mcp test` | **27/27 pass** |

---

## 7. Acceptance criteria

| Criterion | Status |
|---|---|
| D-018D committed and pushed | **Pass** — `ac33c59` on `origin/main` (message differs from commission spec) |
| Production D1 sync applied | **Pass** |
| Public website serves calibrated prose | **Pass** — Field excerpts + MCP full reads |
| Five probe terms: place → hold → movement | **Pass** (Field excerpt truncation limits hold visibility for Cognitive Metabolism only) |
| No `[Term] names…` pattern | **Pass** |
| Template sections intact | **Pass** — verified in MCP `content` |
| Field, Mechanics panel, Submission, MCP, tests | **Pass** |
| No Atlas edits during D-019 | **Pass** |
| No runtime mechanics changes | **Pass** |
| No Calculus / theory promotion | **Pass** |

---

## 8. Synchronisation statement

After D-019:

```text
GitHub Atlas @ ac33c59  →  D1 entries (synchronised)  →  Field + MCP (synchronised)
                                    ↓
                      garden_config atlas_version label (still stale: 2026.07.03-i983)
```

**Repository Atlas prose, D1 entry read-model, and Observatory Atlas reads are synchronised** for the D-018D hold calibration programme.

---

## 9. Unresolved issues

1. **Commit message mismatch** — Commission requested *Apply Tier 1 hold sentence calibration*; landed as *Complete D-018 hold calibration programme (B–D).* Content is correct; message is historical only.
2. **`garden_config.atlas_version` not updated by sync** — Field still reports `2026.07.03-i983` despite current entry prose.
3. **D1 sync not in CI** — Atlas-only commits require manual `sync:d1 --apply` after push (same gap as D-004).
4. **Field excerpt truncation** — Sheet shows ~28 words; hold paragraph may be invisible on Field for terms with long place sentences (e.g. Cognitive Metabolism). Full prose available via MCP and in source.
5. **`atlas-doctor.mjs` still missing** — Full integrity gate unavailable (carried from D-003/D-004).
6. **Untracked** `.atlas-publisher/package-lock.json` — not committed.

---

## 10. Related artefacts

| Artefact | Path |
|---|---|
| Hold calibration implementation | `docs/reports/D-018D-tier-1-hold-calibration.md` |
| Machine log | `docs/reports/D-018D-tier-1-hold-calibration.json` |
| D1 sync script | `.atlas-publisher/sync-d1-from-repo.mjs` |
| Prior sync characterisation | `docs/reports/D-004-d1-sync-read-model-verification.md` |

---

## 11. Commission closure

**Status:** D-019 complete. D-018D calibrated Atlas prose is live on Field and MCP.

**Repository source @ `ac33c59` → D1 entries → Field + MCP** are synchronised for the Tier 1 hold calibration programme. Residual gaps: version metadata label, manual sync step, Field excerpt truncation for long place sentences.

**Commission D-019 closed.**
