# RC-001 - First Canonical Translation Release

**Status:** successfully published

**Production publication:** 2026-07-14 (Pacific/Auckland)

**Release identifier:** `first-canonical-translation-rc-001b-0791a710373b`

## Release identities

| Identity | Value |
|---|---|
| Production implementation commit | `0791a710373bedd517f29b6b537fed308d1d914a` |
| Canonical implementation commit | `88d3217a11a778534a8f8acf0880f541a1a7930d` |
| D1 import correction commit | `e986f58d304a0b57f3fe404dbbb7234dfb285002` |
| Workers-only public Translation commit | `190fdb56f36832b75d7723dff05118d8e4cd7b2a` |
| Canonical source | `sha256:a5cdc135b48fee7def6af3e080f9ec404c3ee0ddec8dad057fff9eda133c2c0a` |
| Canonical Graph | `sha256:e2a9d6d6f52eb8496ff82e326bafcdf6127d487b3b0ec3b8ed54bcdc0a1ef340` |
| Translation | `sha256:d3f18f0620e70139ae637b98ba41bd013ad59c25cacc0a221e2e8f8292d3ecf9` |
| Deterministic generated aggregate | `sha256:1bf06296712ab1716829e9333a0892e56e52e7d0f88f76d7e6fd3160725718f7` |
| Public release manifest | `sha256:06154dd8ba1d7b6b54e4d0cbf056d29c0f7acbe3eb091e594f3f779ebbda5f5a` |

The existing tag `first-canonical-translation-2026.07.14` retains its historical meaning. It was not moved or replaced.

## Fresh rollback boundary

The final production attempt began from a new capture. Earlier stopped-attempt evidence was not reused as the rollback boundary.

| Item | Captured value |
|---|---|
| D1 database | `atlas-d1` / `ffc9622e-02a4-4561-b11e-4e54fac92967` |
| Time Travel bookmark | `0000074c-00000000-000050a8-4db6853a4d8c78fa86f9de8b4ef20e8a` |
| Logical backup SHA-256 | `3af949da7a05e0798f156adfbfba844592d53da13d03e25d9d2d2ed23ab3c7f2` |
| Logical backup size | 3,703,146 bytes |
| Backup restore test | `PRAGMA quick_check = ok`; 490 entries |
| Pre-release Main version | `22b96de2-bba9-470b-b1c8-e8e97fe7eb89` |
| Pre-release MCP version | `954efd8f-0f13-4ea3-a025-3b6579f48a7e` |
| Pre-release Calibration version | `1f2d9adf-cad6-4ede-bc59-8fd4794ccfab` |

## Release-candidate verification

- Publisher tests: 137/137 passed.
- MCP Canonical Translation tests: passed.
- Calibration/member tests: 18 invariants and two ways-in passed.
- JavaScript syntax, repository integrity, `git fsck`, `git diff --check`, and three Wrangler dry runs: passed.
- Two complete Translation rebuilds produced 995 byte-identical generated files.
- Public bundle: exactly 494 assets.
- Atlas source diff: none.
- Approved source, graph, Translation, release, and count identities: exact.

## Production D1 publication

The approved production command was run exactly once:

```text
node .atlas-publisher/sync-d1-from-repo.mjs --apply
```

The command formed one Canonical Graph, reconstructed the complete public bundle, applied one transactionless combined transport file, and verified exact remote parity.

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

Dataset hashes:

| Dataset | SHA-256 |
|---|---|
| Entries | `acb1f1d0809ed93b86de61b61019920a95d8b3f3efb0717ad35559e7971c3a4d` |
| FTS | `e6fcc838c92f46e88d1a5d429e58dd6881773bd09caff4c8a0b9a88062b0d7de` |
| Metadata | `8ab77e96c7646c15235fa743762028a26a0becc6b4b8132c22ee03432109ed50` |
| Determinations | `e59da9e18b55bd8e7deee1503ca2303dab6597dde746dba8eb2ecc41d22452b7` |
| Protocol | `94829b499c48fe785a2f3aee9fd8902d36aa9262966e601bfb9b740e48b1b2be` |

## Worker deployments

| Surface | Version | Deployment |
|---|---|---|
| Main Worker | `1c9b6e5d-9f61-404a-8197-33b5ed2077ff` | `e192dc31-992f-400d-9e23-0b8b2e7a8630` |
| MCP Worker | `5a4d862d-0fa2-4dde-9257-fd31e6eb4bc8` | `1702176c-9061-43e6-a266-5d4671de157f` |
| Calibration Worker | `90f71ed3-ad46-4e8b-8705-8ee8f6b37cb3` | `8ef6198e-6291-4c65-ab57-c2beff355f5c` |

Main and MCP expose the same canonical source hash, Translation hash, release identifier, D1 identity, and 490-entry count. Controlled mismatches fail closed on both. Calibration remains mechanical and does not claim Atlas identity.

## Protocol verification

Production exposes exactly this ordered protocol:

```text
practice.atlas
foundation.common-term-structure
practice.ai-participation
```

Legacy `startingIds`, `practice.atlas-note-standard`, stale frame IDs, and maintained protocol ownership are absent.

## Public Translation cutover

The Main Worker now provides the sole generated web, AI, search, manifest, source-documentation, Theory, Proof, Calculus, and Field delivery path.

Compatibility routing:

- `atlas.realitymechanics.nz/ai/*` carries the same path and query to Main Worker AI participation.
- other `atlas.realitymechanics.nz/*` requests redirect to the canonical GitHub Atlas.
- `theory.realitymechanics.nz/*` redirects to `https://realitymechanics.nz/theory` while preserving query parameters.
- `reality-mechanics-atlas.pages.dev` and `reality-mechanics-theory.pages.dev` were covered by an active Bulk Redirect rule during cutover.

Detaching each Pages custom domain removed its Pages-managed CNAME. A proxied CNAME from `atlas.realitymechanics.nz` and `theory.realitymechanics.nz` to `realitymechanics.nz` was therefore established as operational routing for the approved Worker routes. Authoritative and public-recursive DNS checks passed.

## Pages retirement

Retired projects:

| Project | Final production deployment |
|---|---|
| `reality-mechanics-atlas` | `5dfd8134-4989-4a02-8c2b-15f7dfc132b4` |
| `reality-mechanics-theory` | `16ee197e-370f-4af8-8bf0-7f62d0c0fd25` |

Cloudflare rejected the first Atlas project deletion because the project had more than 100 deployments. Following Cloudflare's documented boundary, the official `delete-all-deployments` tool removed 181 historical Atlas deployments while preserving the final production deployment. Both custom-domain associations were then removed, Worker DNS routing was verified, and both projects were deleted successfully.

Official boundary: <https://developers.cloudflare.com/pages/platform/known-issues/#delete-a-project-with-a-high-amount-of-deployments>

Retirement Proof:

- archive: `docs/reports/evidence/rc-001b-pages-retirement/pages-final-payloads.tar.gz`;
- archive SHA-256: `b63f325cc0f724c4f8f7f38c2b308e7fefb6a21b176aecc19964095b6b99ac61`;
- 994 archived payload hashes: all verified;
- both Pages project inventories and deployment identities were captured before deletion;
- post-deletion Pages project inventory: empty;
- default domains and sampled deployment aliases: DNS-negative and unable to serve stale content.

Pages recreation is not part of ordinary rollback. It requires explicit participant authorisation and the archived payload recreation procedure.

## Final parity

Post-retirement verification passed:

- all 494 public assets match the approved generated bundle byte-for-byte;
- all 490 AI entry records match;
- source documentation, search, manifest, Field, Theory, Proof, and Calculus match the release bundle;
- Main and MCP identities and protocol match;
- removed records return 404;
- internal-only generated outputs return 410;
- Atlas redirects to canonical GitHub source;
- no 493-entry participation remains reachable;
- D1 remains at exact parity and `PRAGMA quick_check = ok`.

## Rollback procedure

If the completed release must be rolled back:

1. Restore D1 to bookmark `0000074c-00000000-000050a8-4db6853a4d8c78fa86f9de8b4ef20e8a` and verify the captured pre-release hashes.
2. Restore Main version `22b96de2-bba9-470b-b1c8-e8e97fe7eb89`.
3. Restore MCP version `954efd8f-0f13-4ea3-a025-3b6579f48a7e`.
4. Restore Calibration version `1f2d9adf-cad6-4ede-bc59-8fd4794ccfab`.
5. Remove the Atlas and Theory Worker compatibility routes and the account Bulk Redirect rule.
6. Verify the captured pre-release public response hashes.
7. Do not recreate Pages without explicit participant authorisation. If authorised, recreate both projects from the archived payload and recorded instructions, verify all payload hashes, and only then reattach custom domains.

## Release determination

The First Canonical Translation is successfully published. Production is generated from the participant-determined Atlas through one Canonical Graph. D1, Main, MCP, AI, search, manifest, documentation, Theory, Proof, Calculus, and Field carry the approved canonical identity without a second maintained structural authority.

Earlier RC-001 stopped attempts and their rollback evidence remain historically distinct from this completed production publication.
