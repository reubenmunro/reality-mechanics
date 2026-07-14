# Calibration Deployment

Calibration deploys as a standalone Cloudflare Worker at:

```text
https://calibration.realitymechanics.nz
```

## Purpose

Calibration is the public proof that Reality Mechanics can calibrate reasoning mechanically.

It is a browser-side mechanism, not a form. A target drifts on its own; Open Strain (the gap to the current approximation) is always shown; a Pulse fires and corrects the approximation only once strain crosses a threshold; the gap never closes for good:

```text
Drift -> Strain -> Threshold -> Pulse -> Correction -> Open Strain (never zero)
```

## Cloudflare Setup

`wrangler.toml`:

```toml
name = "reality-mechanics-calibration"
main = "src/index.js"
compatibility_date = "2026-06-03"
workers_dev = false

[[routes]]
pattern = "calibration.realitymechanics.nz"
custom_domain = true
```

## Environment Variables

None.

No secrets are required:

- no `OPENAI_API_KEY`
- no `MEMBER_PASSPHRASE`
- no `GARDEN_SECRET`
- no D1, KV, MCP, or workflow binding

## Deploy

```bash
npm test
npm run deploy
```

## Live Checks

```bash
curl -L https://calibration.realitymechanics.nz/api/health
curl -L https://calibration.realitymechanics.nz
```

Expected health:

```json
{"ok":true,"runtime":"mechanical","ai":false}
```

## Public Site Reference

Use:

```text
Calibration is a reasoning calibration pass. It does not answer for you; it helps test whether a thought can be retraced.
```

Public Reality Mechanics should present only:

- Atlas: structural memory.
- Calibration: mechanical reasoning calibration.

Garden is not a public doorway.

## Publishing Risks

- The mechanism is a demonstration of the shape of calibration, not a measurement of any real reasoning process — it should not be read as more than that.
- A viewer may assume strain trending down means the target was "found"; Open Strain must stay visibly non-zero at all times to avoid implying resolution that hasn't happened.
- Garden should stay off the public surface unless its role becomes necessary again.
