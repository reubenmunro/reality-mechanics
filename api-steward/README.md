# Reality Mechanics Garden Steward

Paced Cloudflare Worker that walks the Garden queue and supervises proposal state.

The steward is intentionally not a gardener, not an applier, and not an Atlas author. It can:

- inspect open Garden proposals
- add one steward note
- add one light or shade signal as `ai-steward`
- mark vague proposals as `needs_preparation`

It must not apply changes, ground entries, write Atlas content, or create new proposals.

## Pace

`GARDEN_PACE=1` is careful 1:1 garden time: the steward walks once per garden hour. The Worker wakes every minute and skips until the paced interval has elapsed. In nursery mode at `GARDEN_PACE=60`, the steward can walk every minute so review keeps pace with the gardener.

The live Garden can also store pace at `garden:pace`; that value takes priority over Worker config.

## Deploy

```bash
cd api-steward
npm install
npm run deploy
```

Manual runs use the same Garden password as scheduled write access.
