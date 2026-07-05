# Calibration API

Base URL:

```text
https://calibration.realitymechanics.nz
```

## GET /

Returns the public Pulse page with the Calibration cardiogram instrument only.

The mechanism runs entirely in the browser via `requestAnimationFrame` — a drifting target, a threshold-triggered pulse, and a corrected approximation. No text input is required or accepted. No model, Atlas, Garden, or MCP request is made.

Forest walk and calibration engine demos are not public surfaces (D-021.5).

## GET /api/health

Returns:

```json
{
  "ok": true,
  "runtime": "mechanical",
  "ai": false
}
```

## Removed From v0

The former `/api/chat` AI bench is retired.

Calibration v0 is a mechanical demonstration surface, not a reasoning chatbot.
