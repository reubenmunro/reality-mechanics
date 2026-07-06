# Public Release Checklist

> **Supersession (M-003):** Repository visibility item **resolved** — GitHub is public; anonymous links return HTTP 200 (verified 2026-07-07). Licence item remains open.

**Commission:** R-002 (blocker 1 — public retrace)  
**Governing audit:** `docs/reports/R-001-release-audit.md`  
**Date:** 2026-07-06

---

## Purpose

Prepare the repository for public GitHub release without exposing unsafe material. This checklist records the R-002 safety scan and steward decision points.

---

## Safety scan (R-002)

| Check | Result | Evidence |
|---|---|---|
| Hardcoded API keys in application Workers | **None found** | Grep across `.atlas-publisher/`, `member/`, `reality-mechanics-mcp/` |
| Committed `.env` files | **None found** | Repository root and worker paths |
| Copilot plugin secrets | **Gitignored** | `.gitignore` excludes `Reality_Mechanics/.obsidian/plugins/copilot/data.json` |
| GitHub Actions secrets | **External only** | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — not in tree |
| Atlas term content | **Intended public** | `Reality_Mechanics/` is the canonical published body |
| Obsidian plugin bundles | **Local tooling** | Large third-party plugins under `Reality_Mechanics/.obsidian/plugins/` — not deployed; no secrets in tracked plugin config at scan time |
| Private correspondence / credentials | **None identified** | No credential files in tracked paths |

### Items requiring steward action before public release

| Item | Severity | Action |
|---|---|---|
| **Repository visibility** | **High** | Repository is **private**; anonymous `github.com/reubenmunro/reality-mechanics` returns **404**. Public surfaces link here for retrace. **Make public** when steward approves. |
| **Licence file** | **Medium** | No root `LICENSE` file at R-002 scan. Choose and add a licence before or at public release. |
| **Obsidian plugin bulk** | **Low** | Consider `.gitignore` or documentation note that plugins are local-only tooling (optional cleanup, not blocking). |

---

## Recommendation

**Safe to make the GitHub repository public** from a secrets and private-material standpoint, subject to:

1. Steward confirms licence choice and adds `LICENSE` if required for the intended public terms.
2. Steward changes repository visibility from private to public in GitHub settings.
3. After visibility change, verify outbound links from Observatory, Theory, Proof, and Calculus pages resolve for anonymous users.

**Do not expose:** GitHub Actions secrets, Cloudflare API tokens, local `.claude/settings.local.json`, or gitignored copilot `data.json` — these are already excluded from the tree.

---

## Post-public verification

```bash
curl -sI "https://github.com/reubenmunro/reality-mechanics" | head -1
curl -sI "https://github.com/reubenmunro/reality-mechanics/blob/main/MISSION.md" | head -1
```

Expected after public release: HTTP 200 (or 302 to login-free blob view), not 404.

---

## Retraceability note

Making the repository public resolves R-001 blocker 1 at the infrastructure level. Documentation truth (blocker 2) and Observatory first impression (blocker 3) are addressed in R-002 code and doc commits separately.
