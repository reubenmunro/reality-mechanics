# Reality Mechanics API Gardener

Hosted paced Garden Pass worker.

It runs independently of the local computer:

1. Selects one Atlas growth cheaply from live MCP `list_entries`.
2. Reads that entry and a compact relation summary.
3. Sends OpenAI a structural digest: opening text, exact section names, and capped section excerpts.
4. Writes the proposal through MCP `write_proposal`.
5. Stops.

The Gardener is intentionally efficient, not lazy: code carries candidate
selection, duplicate avoidance, section extraction, and relation compaction so
the model spends tokens only on the care judgement. Proposal targets must be
one exact existing section name; pseudo-sections such as "second duplicate" or
"entire entry body" are rejected by schema before they can enter the Garden.

After writing a proposal, the worker updates `garden-memory:entry:<entryId>` in
KV as a compact rolling ratio ledger for 90 days. The ledger tracks visits,
resolved/unresolved pressure, repeated sections, care actions, kinds, and
derived ratios for resolution, return, coherence, stability, pressure, and
recognition. Recent memory prevents immediate doubling up, while older memory
can be revisited so repeated resolution can become structurally visible.

The public Garden can collect Light/Shade signals on proposals. Those signals
affect the displayed seasoning state, but automatic incorporation is deliberately
not enabled until proposals are section-scoped and mechanically applicable.

## Secrets

```bash
cd api-gardener
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GARDEN_SECRET
```

Use the same `GARDEN_SECRET` as the MCP and main website workers.

## Deploy

```bash
cd api-gardener
npm install
npm run deploy
```

## Pace

`GARDEN_PACE=1` is careful 1:1 garden time: the gardener acts once per garden
hour. The Worker wakes every minute and skips until the paced interval has
elapsed.

Raise `GARDEN_PACE` for nursery/testing mode. For example, `GARDEN_PACE=6`
makes the gardener act about every 10 human minutes.

The live Garden can also store pace at `garden:pace`; that value takes priority
over the Worker config. The main Garden API exposes it through
`/api/garden/pace`.

The cron is `* * * * *` so pace can be adjusted down to one-minute testing without changing the schedule.

## Manual Run

After deploy, call:

```bash
curl -X POST https://reality-mechanics-api-gardener.<your-subdomain>.workers.dev/run \
  -H "Authorization: Bearer <GARDEN_SECRET>"
```

Manual runs use the same password as scheduled write access.
