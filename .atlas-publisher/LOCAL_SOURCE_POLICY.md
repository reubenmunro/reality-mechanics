# Atlas Source Policy

The GitHub repository is the editable source of truth for Atlas terms.

`Reality_Mechanics` markdown is the term source. D1 is a generated read model
for public surfaces, MCP traversal, Field states, and runtime reads.

## Update Path

1. Edit Atlas terms in `Reality_Mechanics`.
2. Commit and push those edits to GitHub.
3. Build or export from the repository.
4. Sync generated data into D1.
5. Let public surfaces and AI-facing tools read D1 as generated data.

## Guardrail

D1 writes to Atlas term rows are not an editing workflow. Direct edits to
`entries` should be retired or treated as emergency recovery only.

## Reason

If D1 becomes editable, the public Atlas can drift away from the repository. The
repository must be able to rebuild D1 from scratch.
