# Reality Mechanics Garden Ground Check

Paced Cloudflare Worker that approves only proposals that have passed the
steward and a mechanical structure check.

It does not write Atlas content. It only moves clean, steward-lit proposals from
`pending` to `approved`, where Garden Cycle can season and apply them.

Checks include:

- steward action is `light`
- no shade is present
- proposal points at an existing entry
- `Section:` exists
- `Proposed replacement:` exists
- target section exists in the entry
- replacement is not empty, too broad, or heading-shaped
- notes stay short and free of process/meta language

Anything that fails remains out of the automatic path and can be surfaced as
attention needed.
