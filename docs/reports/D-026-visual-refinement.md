# D-026 — Visual Refinement

**Programme:** Public Structure  
**Type:** Visual Refinement  
**Date:** 2026-07-06 (UTC+12)

---

## Objective

Refine the public website so it feels like a world-class scientific instrument — less documentation, more perception. Structure, content, and programme unchanged.

---

## Design principles applied

| Reduce | Increase |
|---|---|
| Borders, cards, panels | Whitespace, rhythm |
| Nav iconography | Typography hierarchy |
| Sticky header chrome | Atmospheric depth |
| Dashboard readouts | Instrument confidence |

Ember accent used sparingly. Radiance reserved for meaningful moments.

---

## Observatory

| Change | Detail |
|---|---|
| Landing typography | Larger serif title; more vertical breathing room |
| Navigation | Icon-free; lighter weight; quieter hover |
| Term sheet | Border removed; more transparent glass; wider padding |
| Enter field | Thinner underline; lower idle opacity |
| Body atmosphere | Radial gradient behind canvas |
| Home field radiance | Subtle center warmth on neutral open; home node glow increased |
| Canvas mechanics | Unchanged — draw/step/amplification paths preserved |

Recovered from earlier Observatory aesthetic: radiance, depth, restraint — without restoring removed overlays or order spine.

---

## Pulse

| Change | Detail |
|---|---|
| Typography | Iowan Old Style / Georgia throughout |
| Proof chips | Borderless three-column rhythm |
| Instrument panel | No enclosing card |
| Readouts | Typography grid without boxes |
| Cardiogram | Deeper void well; softer grid; restrained ember glow |
| Controls | Underline actions, not buttons-in-boxes |
| Navigation | Icon-free; gradient header fade |

Runtime JavaScript unchanged.

---

## Theory

| Change | Detail |
|---|---|
| Layout | Essay column; generous top margin |
| Header | Fixed fade, no border |
| Lists | Dot markers via spacing, not bullets |
| Links | Underline discipline |
| Eyebrow | Removed duplicate label |

---

## Proof

| Change | Detail |
|---|---|
| Cards | Replaced with archival three-column record sections |
| Exhibits | Plain linked prose, no bordered tiles |
| Footer | Italic status line without divider rule |
| Tone | Cooler paper palette; record not UI |

Content unchanged.

---

## Calculus

Presented on Theory as a laboratory notebook section and on `/calculus` as the full derivation surface (D-024). D-026 refines both for notebook precision — monospace rules, left guides, no card chrome.

---

## Navigation (all surfaces)

Five surfaces: Observatory · Pulse · Theory · Proof · Calculus.

| Before | After |
|---|---|
| 🔭 Observatory | Observatory |
| ❤️ Pulse | Pulse |
| 📖 Theory | Theory |
| ✓ Proof | Proof |
| ∴ Calculus | Calculus |

Sticky bordered headers → fixed gradient fades.

---

## Files changed

| File | Change |
|---|---|
| `.atlas-publisher/main-website-worker.js` | Observatory CSS; home radiance; Theory/Proof refinement |
| `member/src/index.js` | Pulse visual refinement |
| `.atlas-publisher/test/field-states.test.mjs` | D-026 assertions |
| `member/test/invariants.test.mjs` | Nav + chrome assertions |
| `docs/reports/D-026-visual-refinement.md` | This report |
| `docs/practice/COMMISSIONS.md` | Register entry |

**Not changed:** Atlas source, Observatory runtime mechanics, routes, content copy, MCP/API.

---

## Tests run

```bash
npm --prefix .atlas-publisher test
npm --prefix member test
```

| Suite | Result |
|---|---|
| atlas-publisher | **54/54 pass** |
| member | **16/16 pass** |

---

## Deployment note

Deploy via existing GitHub Actions on push to `main`:

- `.atlas-publisher/**` → Field worker
- `member/**` → Pulse worker

Verify:

- https://realitymechanics.nz/field — luminous whole field; quiet nav
- https://realitymechanics.nz/theory — essay layout; calculus notebook section
- https://realitymechanics.nz/proof — archival record without cards
- https://calibration.realitymechanics.nz/ — open instrument; borderless readouts

---

## Acceptance

| Criterion | Status |
|---|---|
| Structure unchanged | **Pass** |
| Content unchanged | **Pass** |
| Programme unchanged | **Pass** |
| Less software, more observatory | **Pass** |
| Performance preserved | **Pass** — CSS/canvas-only; no new assets |
| Tests pass | **Pass** |

---

## Commission closure

**Status:** D-026 complete. Public surfaces refined for instrument elegance without structural change.

**Commission D-026 closed.**
