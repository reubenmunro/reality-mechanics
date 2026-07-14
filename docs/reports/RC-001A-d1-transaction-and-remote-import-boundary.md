# RC-001A — D1 Transaction and Remote Import Boundary

**Status:** passed in isolated Cloudflare D1 databases

**Production writes:** none

**Worker deployments:** none

## Root cause

The generated `atlas-d1-sync.sql` wrapped its statements in `BEGIN TRANSACTION;` and `COMMIT;`. Cloudflare documents that SQLite SQL imported through `wrangler d1 execute --remote --file` must have those statements removed. Wrangler therefore rejected the canonical data file before publication.

The prior orchestration also submitted schema and data as two independent remote files. Even though each file import has a recoverable failure boundary, the sequence did not: the schema file could commit and the data file could fail, leaving the new empty schema active. That is the state RC-001 encountered before Time Travel restored production.

Official references:

- <https://developers.cloudflare.com/d1/best-practices/import-export-data/>
- <https://developers.cloudflare.com/d1/wrangler-commands/#d1-execute>
- <https://developers.cloudflare.com/d1/reference/time-travel/>

## Supported-method assessment

| Method | Assessment |
|---|---|
| Transactionless `wrangler d1 execute --remote --file` | Selected. Officially supported and proven with the complete generated dataset. |
| Separate schema and data files | Rejected. Each file has a recovery boundary, but failure between files exposes an incomplete state. |
| Bounded file batches | Rejected. Adds intermediate committed states without necessity; the complete import is about 5.05 MB and well within the documented file limit. |
| Temporary migration Worker using `D1Database.batch()` | Rejected. Batch is transactional, but custom infrastructure is unnecessary when the supported import API already provides file-level recovery. |
| Explicit SQL transactions | Rejected. Unsupported by the remote-file import path. |

## Smallest correction

1. Remove explicit transaction wrappers from generated D1 data.
2. Keep schema and canonical data as separate generated projections, but concatenate them once in temporary transport storage.
3. Submit that combined transport file through one `wrangler d1 execute --remote --file` call.
4. Compare the resulting remote tables exactly with a local SQLite reconstruction from the same generated schema and data.
5. Remove the unreferenced legacy structural table `atlas_registers` in the generated schema migration.

The Atlas, Canonical Graph, canonical rows, relation targets, determination records, and protocol declarations are unchanged.

## Transaction and atomicity determination

Wrangler 4.107.0 states during remote file execution:

> Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.

The installed Wrangler implementation sends file imports to the D1 `import` endpoint, polls until completion, and treats a non-complete result as a reset. This was verified rather than assumed:

- a valid combined file began with table drops and continued through 1,013 statements;
- a constraint failure was injected after the first 100 FTS rows;
- Wrangler returned non-zero with `SQLITE_CONSTRAINT_NOTNULL`;
- the database retained all 490 prior rows and exact canonical hashes;
- the schema also remained unchanged;
- the failed attempt produced a later bookmark, so bookmark equality is not used as proof of unchanged data;
- a direct clean retry succeeded.

The single remote import file is therefore the atomic publication unit evidenced here. Schema and data are not described as independently atomic as a pair. Time Travel remains the primary pre-release rollback boundary because it restores the complete production database and remains necessary for rollback coordinated with Workers and other participation surfaces.

## Isolated remote test evidence

### Database 1 — existing-state, legacy-state, failure, retry

- Name: `rc-001a-20260714-081515`
- ID: `41332509-6330-4336-af26-5ffbd886e211`
- Region: ENAM
- Tested with Wrangler 4.103.0 and 4.107.0
- Seeded legacy table: `atlas_registers`, one row
- Legacy table after corrected import: absent
- Controlled failure: `INSERT INTO entries(id) VALUES ('rc001a.final-forced-failure');`
- Failure: `NOT NULL constraint failed: entries.title`
- State after failure: exact canonical parity retained
- Clean retry: passed
- Database destroyed after evidence capture

### Database 2 — newly created empty D1

- Name: `rc-001a-empty-20260714-082801`
- ID: `885d67f5-c5a6-4037-b766-aac01d2aedb7`
- Region: ENAM
- Starting state: newly created, no application schema
- Corrected `sync-d1-from-repo.mjs` result: passed
- Queries imported: 1,013
- Final size: 5,050,368 bytes
- Exact parity verification: passed
- Database destroyed after evidence capture

## Canonical parity

Both successful remote paths produced:

| Invariant | Result |
|---|---:|
| Entries | 490 |
| Order entries | 442 |
| Register entries | 48 |
| Relation targets | 7,210 |
| Determination references | 490 |
| Determination records | 6 |
| Protocol members | 3 |
| Legacy `atlas_registers` tables | 0 |
| `PRAGMA quick_check` | `ok` |

Source identity:

```text
sha256:a5cdc135b48fee7def6af3e080f9ec404c3ee0ddec8dad057fff9eda133c2c0a
```

Protocol order:

```text
practice.atlas
foundation.common-term-structure
practice.ai-participation
```

Exact dataset hashes after local/remote comparison:

| Dataset | SHA-256 |
|---|---|
| Entries | `acb1f1d0809ed93b86de61b61019920a95d8b3f3efb0717ad35559e7971c3a4d` |
| FTS | `e6fcc838c92f46e88d1a5d429e58dd6881773bd09caff4c8a0b9a88062b0d7de` |
| Metadata | `8ab77e96c7646c15235fa743762028a26a0becc6b4b8132c22ee03432109ed50` |
| Determinations | `e59da9e18b55bd8e7deee1503ca2303dab6597dde746dba8eb2ecc41d22452b7` |
| Protocol | `94829b499c48fe785a2f3aee9fd8902d36aa9262966e601bfb9b740e48b1b2be` |

## Regression coverage

- generated data contains no explicit `BEGIN TRANSACTION` or `COMMIT` wrapper;
- schema declares removal of `atlas_registers`;
- local reconstruction uses the same combined transport representation;
- a seeded legacy structural table is removed;
- translation remains byte-deterministic across two rebuilds;
- remote verification compares every entry column, every FTS row, all metadata, all determination records, and all protocol members;
- remote source hash and graph-derived counts must match;
- remote relation target count must match the Canonical Graph;
- unresolved legacy table or failed SQLite integrity check stops verification.

Results:

- Publisher: 125/125 passed
- MCP Canonical Translation tests: passed
- Calibration/member tests: passed
- JavaScript syntax checks: passed
- `git diff --check`: passed

## Files changed

- `.atlas-publisher/translate-atlas.rb`
- `.atlas-publisher/d1-remote.mjs`
- `.atlas-publisher/sync-d1-from-repo.mjs`
- `.atlas-publisher/verify-d1-from-repo.mjs`
- `.atlas-publisher/test/canonical-translation.test.mjs`
- `.atlas-publisher/package.json`
- `docs/reports/RC-001A-d1-transaction-and-remote-import-boundary.md`

## Amended RC-001 retry sequence

1. Confirm the approved RC-001 source commit and the RC-001A correction commit are checked out with a clean Atlas source.
2. Capture fresh production D1 identity, current bookmark, logical backup, Worker versions, public response hashes, generated source identity, and deployment identifiers.
3. Run local publisher, MCP, and Calibration regression tests.
4. Run `node .atlas-publisher/sync-d1-from-repo.mjs --apply` once. This translates, submits one combined remote import file, and performs exact generated parity verification.
5. Stop immediately if import or parity verification fails. Use the fresh Time Travel bookmark if production state is not confirmed.
6. After D1 parity passes, deploy only the already approved RC-001 Worker versions and generated participation surfaces.
7. Verify the three-entry production protocol, source identity, D1/MCP/website/Theory/Observatory/Field parity, and public response identities.
8. Complete the RC-001 deterministic production rebuild and release report.

## Remaining blocker

No blocker remains at the D1 transaction/import boundary. RC-001 itself remains incomplete and production must be retried from a fresh backup and identity capture.

No production D1 write, Worker deployment, Atlas edit, canonical data change, tag change, or release declaration occurred in RC-001A.
