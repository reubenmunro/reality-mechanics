# RC-001B Final RC-001 Retry

Operational release procedure only. It carries no Atlas structure.

## Preconditions

- Release branch contains `88d3217a11a778534a8f8acf0880f541a1a7930d`, `e986f58d304a0b57f3fe404dbbb7234dfb285002`, and the approved RC-001B implementation commit.
- Canonical source identity is `sha256:a5cdc135b48fee7def6af3e080f9ec404c3ee0ddec8dad057fff9eda133c2c0a`.
- Pages evidence archive SHA-256 is `b63f325cc0f724c4f8f7f38c2b308e7fefb6a21b176aecc19964095b6b99ac61`.
- `docs/deployment/RC-001B_LEGACY_REDIRECTS.json` remains `prepared-not-applied` until the cutover step.

## Final retry sequence

1. Check out the exact approved release commit with a clean worktree.
2. Capture a fresh production D1 identity, Time Travel bookmark, logical backup, schema/counts, Worker versions, live response hashes, protocol, routes, Pages deployments, and active traffic assignments.
3. Verify rollback access and the Pages evidence archive before any write.
4. Run Publisher, MCP, and Calibration tests plus syntax and repository-integrity checks.
5. Delete all disposable generated directories, run `npm --prefix .atlas-publisher run translate` twice, and require byte-identical aggregate and per-output identities.
6. Verify `/manifest.json` contains the release commit, 490 entries, 7,210 relation targets, 490 determination references, six determination records, and three ordered protocol members.
7. Run `node .atlas-publisher/sync-d1-from-repo.mjs --apply` exactly once.
8. Require complete D1 parity, all expected dataset hashes, `PRAGMA quick_check = ok`, and no `atlas_registers` table. Stop and restore the fresh bookmark on any unproven state.
9. Deploy the Main Worker from `.atlas-publisher/wrangler.toml`. This publishes Worker code, 494 generated static assets, the primary domain, and both legacy custom-host Worker Routes as one candidate.
10. Deploy MCP from `reality-mechanics-mcp/wrangler.toml`. Deploy Calibration from `member/wrangler.toml` only to carry the approved `workers_dev = false` setting; its behaviour must remain unchanged.
11. Verify Main and MCP source/Translation headers, fail-closed identity checks, all generated routes, the exact AI protocol, and all public participation surfaces.
12. Activate the two prepared account-level Bulk Redirect entries from the default `pages.dev` domains to their corresponding legacy custom domains.
13. Verify custom and default legacy domains: Theory reaches `/theory`; Atlas `/ai/*` reaches the corresponding Main Worker asset; every other Atlas path reaches the canonical GitHub Atlas.
14. Verify production artefact determinism and complete public parity. Pages deployment-specific aliases are expected to remain stale until deletion and therefore prevent release completion at this point.
15. Delete `reality-mechanics-atlas`, then `reality-mechanics-theory`, as the final cutover action.
16. Verify both default domains and all recorded deployment aliases no longer serve legacy payloads; verify custom legacy redirects, Main, MCP, D1, Theory, Proof, Calculus, Observatory, Field, AI, search, manifest, and documentation again.
17. Record the completed retry separately from the failed RC-001 attempt, preserving both histories.

## Stop conditions

Stop before Pages deletion when any source identity, Translation identity, D1 dataset hash, protocol member, route, generated output, or public surface differs. Do not patch production manually.

## Rollback before Pages deletion

1. Remove or disable the two default-domain Bulk Redirect entries if activated.
2. Roll back Main, MCP, and Calibration to the freshly captured Worker versions.
3. Restore D1 to the fresh Time Travel bookmark when current D1 parity is not proven.
4. Remove the Main Worker legacy-host routes. Existing Pages custom domains then resume their recorded payloads.
5. Verify the fresh pre-release public hashes and D1 counts.

## Rollback after Pages deletion

1. Perform the Worker and D1 rollback above.
2. Remove the legacy-host Worker Routes and default-domain Bulk Redirect entries.
3. Recreate and deploy both Pages projects from `docs/reports/evidence/rc-001b-pages-retirement/pages-final-payloads.tar.gz` using the evidence README.
4. Reattach `atlas.realitymechanics.nz` and `theory.realitymechanics.nz` only after the Worker routes are absent.
5. Verify every archived payload hash, the three representative live hashes, and the restored pre-release D1/Worker identities.

Pages recreation is a bounded operational rollback, not a return to duplicate constitutional authority. A new participant decision would be required to retain that architecture beyond emergency recovery.
