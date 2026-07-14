# RC-001B Pages Retirement Evidence

This directory is operational Proof. It is not Atlas structure and is not a Translation input.

Captured from Cloudflare account `dd09df1c7c1701cf5fd477b12f72fee8` on 2026-07-14 before any RC-001B deployment or redirect activation.

## Captured projects

| Project | Production deployment | Custom domain | Default domain |
|---|---|---|---|
| `reality-mechanics-atlas` | `5dfd8134-4989-4a02-8c2b-15f7dfc132b4` | `atlas.realitymechanics.nz` | `reality-mechanics-atlas.pages.dev` |
| `reality-mechanics-theory` | `16ee197e-370f-4af8-8bf0-7f62d0c0fd25` | `theory.realitymechanics.nz` | `reality-mechanics-theory.pages.dev` |

Both projects were manually deployed and had no Git provider at capture time.

## Payload evidence

`pages-final-payloads.tar.gz` contains the exact response bytes crawled from both immutable production deployment aliases on 2026-07-14, including the Atlas AI index and all 493 legacy AI entry records. HTML links were not rewritten.

`pages-final-payloads.sha256` records every archived payload identity. The representative identities are:

Archive SHA-256: `b63f325cc0f724c4f8f7f38c2b308e7fefb6a21b176aecc19964095b6b99ac61` (968 KiB compressed; 994 payload files).

| Payload | Bytes | SHA-256 |
|---|---:|---|
| Atlas root | 75,149 | `c5274b994bf82342f81fe6dbdcaf06b40eeacd90fd24d52236ae36281795cccb` |
| Atlas AI index | 483,477 | `1af8fa2a80285062849ce087490a95fe4479696bc91fe3a19aa7564a46942504` |
| Theory root | 27,245 | `71b019fbcf4a11659a5d3a723978b01c70afdf7a50db2f4ba73b63615bc27721` |

The archived representative files matched their custom-domain and immutable-deployment responses byte-for-byte when captured. The legacy AI index advertises 493 entries and source identity `sha256:958bad461b01359287d667a904d0eb61f9f19421cdd95e092922a6cb0af32f2a`.

## Recreation boundary

Recreation is rollback only. It must not run while the Workers-only release remains valid.

1. Extract `pages-final-payloads.tar.gz`.
2. Create the two Pages projects with their recorded names if deletion has completed.
3. Deploy each archived deployment-root directory to its matching project on branch `main`.
4. Reattach the custom domains only after removing the Main Worker legacy routes and the two prepared Bulk Redirect entries.
5. Verify the representative payload hashes above and all rows in `pages-final-payloads.sha256`.

Equivalent Wrangler commands after participant-authorised rollback:

```bash
npx wrangler pages project create reality-mechanics-atlas --production-branch main
npx wrangler pages deploy extracted/atlas/5dfd8134.reality-mechanics-atlas.pages.dev --project-name reality-mechanics-atlas --branch main
npx wrangler pages project create reality-mechanics-theory --production-branch main
npx wrangler pages deploy extracted/theory/16ee197e.reality-mechanics-theory.pages.dev --project-name reality-mechanics-theory --branch main
```

Custom-domain reattachment remains an explicit Cloudflare operation. The archive does not carry credentials, DNS state, redirect rules, or deployment authority.
