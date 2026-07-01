# Local Atlas Source Policy

The live Atlas is updated through the Garden/D1 path.

`Reality_Mechanics` local markdown is now a draft/mirror space, not the live source
used for public publishing or AI search.

## Update Path

1. Propose Atlas changes through the Garden/MCP write path.
2. Review and apply them into the canonical D1-backed Atlas.
3. Let public surfaces and AI-facing tools read from canonical D1.
4. Refresh local files only as a mirror/export when needed.

## Guardrail

Local-source build/export tools stop by default.

Only use `ALLOW_LOCAL_ATLAS_SOURCE=1` when deliberately creating an archival export
from local files. Do not use that override for normal Atlas updates.

## Reason

If local files can publish directly, a local draft can appear true on disk while the
live Atlas, MCP search, and AI readers still see a different structure. That breaks
retracing.
