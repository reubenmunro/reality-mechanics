# Reality Mechanics Atlas — Live MCP Retrieval Layer

A read-only remote MCP server that lets AI clients retrieve the latest published
Atlas. The Obsidian Markdown + YAML front matter remains the single source of
truth; the export is regenerated on every site build, and the MCP Worker reads
the published export without ever holding a second copy.

## 1. Architecture

```
Obsidian vault (Reality_Mechanics/*.md, YAML front matter)   ← single source of truth
        │  Deploy Atlas Website.command
        ▼
.atlas-publisher/build.mjs                                    ← existing site generator
   ├─ writes the public site to  Reality_Atlas_Build/.atlas-public/
   └─ runs build-atlas-ai-index.mjs  →  .atlas-public/ai/      ← AI export (same source, same filter)
        │  wrangler pages deploy .atlas-public
        ▼
https://atlas.realitymechanics.nz/ai/ …                       ← published export (public, static JSON/MD)
        ▲  fetch (cached by atlasVersion)
        │
reality-mechanics-mcp (Cloudflare Worker)  ← stable retrieval interface, Streamable-HTTP MCP
https://mcp.realitymechanics.nz/mcp
```

The Worker is **stateless** and **never redeploys for content changes** — it
fetches the current export each request (manifest cheaply, the rest cached by
version). The export changes flow entirely through the website build.

## 2. Source-of-truth rules

- Edit the Atlas only as Markdown in the Obsidian vault.
- A note is **public** iff it is not `private:true`, `draft:true`, `grounded:false`,
  `publish:false`, or `published:false` — identical to the website filter
  (`shouldPublish`). The `copilot/` plugin folder is excluded.
- Never edit generated `/ai/` files by hand; they are overwritten each build.
- The Worker exposes only already-public content. There is no write path.

## 3. Front-matter → normalized schema

| Atlas front matter | AtlasEntry field | Notes |
|---|---|---|
| `condition_key` (else slug) | `id` | stable explicit id; falls back to the URL slug |
| H1 / first `# ` heading | `title` | |
| `slugify(title)` (Theory → `theory`) | `slug` | matches the site's page slug |
| file path rel. to vault | `sourcePath` | |
| `{site}/{slug}.html` | `publicUrl` | verified to resolve to a real built page |
| `status` | `status` | kept explicit (e.g. `stable`, `working`) |
| `kind` | `type` | |
| `order` | `order` | ground/first/second/third/practice/higher |
| `domain` | `branch` | |
| wikilinks in `needs` + `conditions` | `related` | resolved to entry ids; unresolved → warning |
| — | `aliases`, `tags` | empty (no such fields yet; safe to add later) |
| — | `created`, `updated` | absent (vault has no dates) → warning, not failure |
| body | `content`, `plainText`, `excerpt`, `headings`, `wordCount` | |
| derived | `contentHash` | SHA-256 of normalized content + identifying metadata |

## 4. Generated files (`.atlas-public/ai/`)

```
/ai/manifest.json                     identity + current version + dataset hash
/ai/current/index.json                compact record per entry (no full body)
/ai/current/atlas.md                  whole public Atlas, one structured doc
/ai/current/search.json               searchable text + filter fields (for the Worker)
/ai/current/links.json                explicit relation graph
/ai/current/entries/<id>.json         full entry (Markdown, metadata, headings, trace)
/ai/_headers                          JSON/Markdown content types for Pages
```

`atlasVersion` = `YYYY.MM.DD-<short content hash>` (no Git in this repo, so there
is no commit; `sourceCommit` is `null`). Set `ATLAS_COMMIT` in the build env to
populate it if a VCS is added later. `builtAt` changes each build and is **not**
part of `contentHash`, so identical content yields an identical hash.

## 5. Build commands

```sh
# regenerate just the AI export (writes into .atlas-public/ai/)
node .atlas-publisher/build-atlas-ai-index.mjs

# full site + AI export (what Deploy Atlas Website.command runs)
node .atlas-publisher/build.mjs        # build.mjs invokes the export and fails on a bad export
```

A failed AI export (duplicate id/url, missing title, path escape, or a publicUrl
with no built page) throws and **fails the whole build**, so stale data cannot ship.

## 6. Local testing

```sh
# export validation (run after a site build so page-resolution checks run)
ATLAS_BUILD_ROOT=/tmp/rab node .atlas-publisher/build.mjs

# MCP Worker unit tests (offline, mocks Cache API + fetch)
cd reality-mechanics-mcp && npm test

# Worker locally against the live export
cd reality-mechanics-mcp && npx wrangler dev
# then POST JSON-RPC to http://127.0.0.1:8787/mcp
```

## 7. Cloudflare deployment

**Atlas site (already configured):** `Deploy Atlas Website.command` runs
`build.mjs` then `wrangler pages deploy .atlas-public --project-name=reality-mechanics-atlas`.
This now also publishes `/ai/`. Verify:

```
https://atlas.realitymechanics.nz/ai/manifest.json
https://atlas.realitymechanics.nz/ai/current/index.json
https://atlas.realitymechanics.nz/ai/current/atlas.md
```

**MCP Worker:**

```sh
cd reality-mechanics-mcp
npx wrangler deploy                       # deploys to <name>.workers.dev first
# test the workers.dev URL, then attach the custom domain:
#   uncomment the [[routes]] block in wrangler.toml, then:
npx wrangler deploy
```

Do not attach `mcp.realitymechanics.nz` until the `*.workers.dev` URL passes.

## 8. MCP endpoint

`https://mcp.realitymechanics.nz/mcp` — Streamable HTTP. `POST` JSON-RPC 2.0;
`GET /` returns a small info document. `initialize`, `tools/list`, `tools/call`,
`resources/list`, `resources/read`, `ping` are supported.

## 9. Tools (all read-only)

| Tool | Purpose |
|---|---|
| `get_manifest` | current Atlas version, build time, entry count, content hash |
| `search_atlas` | text + metadata search; scored results with source trace |
| `get_entry` | one full entry by `id` or `sourcePath` (ambiguity is reported, never guessed) |
| `get_related` | explicit related entries; optional, clearly-labelled inferred matches |
| `list_entries` | metadata-filtered listing with cursor pagination |
| `get_recent_changes` | entries whose front-matter `updated` is later than `since` (metadata, not a repo diff) |

Every tool result includes `atlasVersion`; entry/search results include
`sourcePath`, `publicUrl`, `status`, and `contentHash`.

## 10. Freshness & caching

```
request → fetch manifest (TTL 30s) → version = manifest.atlasVersion
        → index/search/entries fetched once per version, cached immutably (Cache API, keyed by version)
```

Because the cache key includes `atlasVersion`, a new deploy (new version) is
picked up within the manifest TTL; `current` data is never returned as current
without re-checking the manifest. If the manifest is briefly newer than an entry
file (deployment skew), `get_entry` returns a structured `transient` result
rather than stale data.

## 11. Verify the current version

```sh
curl -s https://atlas.realitymechanics.nz/ai/manifest.json | jq .atlasVersion
# call get_manifest via MCP and confirm the same atlasVersion
```

## 12. Adding future metadata fields

Add the field to the note front matter, map it in `build-atlas-ai-index.mjs`
(one line in the entry builder), and — if searchable — add it to `searchRec`.
The Worker passes unknown fields through; new filters need a line in
`passesFilters`. No Worker redeploy is needed for new *content*, only for new
*interface* behaviour.

## 13. Rotating / changing domains

- Atlas base: set `ATLAS_BASE` in `wrangler.toml` (the Worker reads it); redeploy the Worker.
- MCP domain: change the `[[routes]]` pattern in `wrangler.toml`; redeploy.
- `publicUrl` host: set `ATLAS_SITE` in the export build env; rebuild + redeploy the site.

## 14. Known limitations

- No Git, so `sourceCommit` is `null` and `get_recent_changes` is **metadata-based**
  (front-matter `updated`), not a true repository diff. The vault currently has no
  `updated` dates, so `get_recent_changes` returns nothing until dates are added.
- `aliases`/`tags` are empty until those fields exist in the vault.
- Slugs are recomputed in the export with the site's exact rule incl. the Theory
  special-case; a future title collision would be caught by the page-resolution
  validation (build fails) rather than silently mismatching.
- Versioned immutable exports (`/ai/versions/<v>/`) are not yet emitted (Phase 4,
  deferred); only `current` is published.

## 15. Rollback

- **Bad export / site:** redeploy the previous Pages deployment from the Cloudflare
  dashboard (Pages → reality-mechanics-atlas → Deployments → Rollback). The Worker
  follows whatever `/ai/manifest.json` is live.
- **Bad Worker:** `wrangler rollback` (or redeploy a previous version). Worker and
  content are independent, so a content rollback needs no Worker change and vice versa.
- **Disable AI export only:** remove the `Generating AI export...` block in
  `build.mjs`; the site builds without `/ai/` and the Worker degrades to a clear
  upstream error.
