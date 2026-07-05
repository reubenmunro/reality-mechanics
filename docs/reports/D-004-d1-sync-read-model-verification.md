# D-004 — D1 Sync + Read-Model Repair

**Programme:** Deployment Verification  
**Type:** D1 sync + read-model repair  
**Governing evidence:** `docs/reports/D-003-deployment-verification.md`  
**Date:** 2026-07-05

---

## Objective

Restore synchronisation between the GitHub Atlas source and the production D1 read-model.

No theory work. No Atlas term edits (none required). No Calculus promotion.

---

## 1. Pre-sync baseline

Recorded before `sync:d1 --apply`:

| Probe | `atlasVersion` | Maintained Coupling structure |
|---|---|---|
| Field `/api/field/states` | `2026.07.03-i983` | `holds`/`traces`: Coupling, Bearing, Recurrence — **Compatibility absent** |
| MCP `get_entry_by_title("Maintained Coupling")` | — | **Compatibility absent** in entry reads |

Repository source (via `atlas-core.mjs` parse): `needs`/`holds`/`traces` all include Compatibility.

---

## 2. Actions taken

| Step | Command / action | Result |
|---|---|---|
| Commit D-003 | `8592779` — Add D-003 deployment verification audit report | Done |
| D1 sync apply | `npm --prefix .atlas-publisher run sync:d1 -- --apply` | **Success** — 492 queries, 3433 rows written, database `atlas-d1` |
| Re-probe Field | `GET https://realitymechanics.nz/api/field/states` | Compatibility present |
| Re-probe MCP | `get_entry("third.maintained-coupling")` | Compatibility present |
| Tests | member, atlas-publisher, mcp | All pass |

Sync output: generated from **490 tracked Atlas notes** (492 total `.md`; 2 convention files excluded from publish).

---

## 3. Post-sync verification

### Field `/api/field/states`

```json
{
  "atlasVersion": "2026.07.03-i983",
  "stateCount": 490,
  "maintainedCoupling": {
    "id": "third.maintained-coupling",
    "holds": ["second.coupling", "first.bearing", "second.recurrence", "second.compatibility"],
    "traces": ["second.coupling", "first.bearing", "second.recurrence", "second.compatibility"]
  }
}
```

**Maintained Coupling → Compatibility:** **present** in live Field state structure.

### MCP `get_entry("third.maintained-coupling")`

Response includes `Compatibility` and `second.compatibility` in canonical structure reads.

**Maintained Coupling → Compatibility:** **present** in live MCP entry reads.

### `atlasVersion` label

The `atlasVersion` string returned by Field (`2026.07.03-i983`) **did not change** after sync. It is read from D1 `garden_config` key `atlas_version`, which `sync-d1-from-repo.mjs` does **not** update — only `entries` are regenerated.

**Characterisation:** Entry-level read-model is synchronised with repository source. The version **label** is a stale metadata string, not evidence of stale structure for Maintained Coupling.

---

## 4. Test results

| Suite | Result |
|---|---|
| `npm --prefix member test` | 16/16 pass |
| `npm --prefix .atlas-publisher test` | 25/25 pass |
| `npm --prefix reality-mechanics-mcp test` | 27/27 pass |

---

## 5. Acceptance criteria

| Criterion | Status |
|---|---|
| D1 atlasVersion changes or is confirmed current | **Partial pass** — version label unchanged; entry data confirmed current via Maintained Coupling spot check |
| Maintained Coupling → Compatibility appears live | **Pass** — Field holds/traces and MCP structure include `second.compatibility` |
| Field and MCP read from synchronised D1 | **Pass** — both surfaces reflect post-sync structure |
| Existing tests pass | **Pass** |
| Stale verification/status docs updated | **Pass** — `REPOSITORY_VERIFICATION.md`, `PROJECT_STATUS.md`, `DELIVERY_PLAN.md` |
| No unaccepted Calculus claims promoted | **Pass** — no Calculus or public surface changes |

---

## 6. Synchronisation statement

After D-004:

```text
GitHub Atlas source  →  D1 entries (synchronised)  →  Field + MCP (synchronised)
                              ↓
                    garden_config atlas_version label (still stale: 2026.07.03-i983)
```

**Repository, worker deployment, D1 entry read-model, and Observatory Atlas reads are synchronised** for the verified repair (Maintained Coupling → Compatibility).

The remaining gap is **metadata only**: update or automate `garden_config.atlas_version` on sync, and add D1 sync to the delivery pipeline so Atlas-only commits cannot reach GitHub without a planned apply.

---

## 7. Outstanding issues

1. **`garden_config.atlas_version` not updated by sync** — Field still reports `2026.07.03-i983`.
2. **D1 sync not in CI** — manual step required after Atlas commits (`.github/workflows/deploy.yml` deploys Workers only).
3. **`atlas-doctor.mjs` still missing** — full integrity gate unavailable.
4. **Orphaned Garden Workers** in Cloudflare account (not public-facing).

---

## 8. Recommended next commission

**D-005 — D1 sync automation + version metadata**

- Update `sync-d1-from-repo.mjs` to write `garden_config.atlas_version` on apply.
- Document or automate the Atlas → sync → verify gate in CI (with steward approval).
- Optionally restore `atlas-doctor.mjs` or update pre-commit to name the actual validation path.

---

**Status:** D-004 complete. Production D1 entry read-model repaired and verified live.

---

## 9. Verification closure (2026-07-05)

Re-probe after report draft confirmed synchronisation holds:

| Check | Result |
|---|---|
| Field `third.maintained-coupling` holds/traces include `second.compatibility` | Pass |
| MCP `get_entry("third.maintained-coupling")` includes `second.compatibility` | Pass |
| Field `atlasVersion` label | `2026.07.03-i983` (unchanged — metadata gap deferred to D-005) |
| Field state count | 490 |
| Tests (member / field / mcp) | 16/16 · 25/25 · 27/27 pass |

**Commission D-004 closed.** Repository source, D1 entries, Field, and MCP are synchronised for the verified Maintained Coupling → Compatibility repair.
