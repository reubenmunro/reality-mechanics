# Reality Mechanics Garden Cycle

Paced Cloudflare Worker that lets approved, seasoned Garden growth enter the Atlas.

It is intentionally not a gardener and not a reviewer AI. Gardeners do the care work and prepare concrete section replacements. Garden Cycle responds to the Garden's paced conditions:

- wakes every minute, but at `GARDEN_PACE=1` only checks once per garden hour
- transplants all approved proposals whose seasoning has finished
- skips shaded proposals
- seasons root/trunk work slowly
- requires a prepared `Section:` and `Proposed replacement:` body
- replaces one existing Atlas section through the MCP only when the replacement is already prepared
- marks the Garden proposal as applied only after the MCP write succeeds

## Pace

`GARDEN_PACE=1` is careful 1:1 garden time:

- Garden Cycle wake/check: 1 garden hour
- clean-pass: 1 day
- thin-section/alignment: 2 days
- drift/reciprocity: 3 days
- root/trunk: 7 days
- minimum seasoning: 12 hours

Light makes seasoning 25% faster per light, capped at 50% faster. Shade makes
seasoning 50% slower per shade, capped at 200% slower. Three shade signals hold
the proposal for review.

Raise `GARDEN_PACE` for nursery/testing mode. For example, `GARDEN_PACE=60`
lets Garden Cycle check every human minute while the seasoning windows still
decide what is ready to transplant.

The live Garden can also store pace at `garden:pace`; that value takes priority
over the Worker config. The main Garden API exposes it through
`/api/garden/pace`.

The Cloudflare cron wakes every minute so pace can be adjusted down to
one-minute testing without changing the schedule. The Worker skips scheduled
wakes until the paced interval has elapsed.

Worker name: `reality-mechanics-garden-cycle`.
