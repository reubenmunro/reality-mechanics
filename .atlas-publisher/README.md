# Atlas Publisher

This small publisher turns the Reality Mechanics Obsidian notes into a static website for Cloudflare Pages.

It has no external dependencies. The vault remains the working body; the generated site is only the public carrier.

## Build

From this folder:

```sh
npm run build
```

The generated sites are written to:

```text
~/Reality_Atlas_Build/.atlas-public
../Reality_Atlas_Build/.theory-public
```

The upload packages are written to:

```text
~/Reality_Atlas_Build/Reality_Atlas_Public.zip
../Reality_Atlas_Build/Reality_Theory_Public.zip
```

## Publishing

Upload `Reality_Atlas_Public.zip` to Cloudflare Pages, then attach:

```text
atlas.realitymechanics.nz
```

For normal publishing from Finder, double-click the command at the vault root:

```text
Deploy Atlas Website.command
Deploy Theory Website.command
Deploy Main Website.command
```

`Deploy Theory Website.command` rebuilds the current Postulate site from the vault and deploys it to the existing `reality-mechanics-theory` Cloudflare Pages project. If Cloudflare authentication has expired, Wrangler opens a browser sign-in during the run.

## AI Context Export

Run `Export Atlas AI Document.command` from the vault root to produce one Markdown file containing the public Atlas in dependency order:

```text
Reality_Atlas_Build/Reality_Atlas_AI_Context.md
```

The export is written into the iCloud vault folder so it can be accessed from other devices.

## Release Filter

The publisher skips notes marked with any of these frontmatter values:

```yaml
private: true
draft: true
publish: false
published: false
```
