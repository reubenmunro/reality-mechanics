# Reality Mechanics

Reality Mechanics observes structural relations already carried in reality and keeps each determination retraceable.

## Authority

The 490 entries under [`Reality_Mechanics/`](Reality_Mechanics/) are the sole maintained structural authority. Calibration and every software or public representation are non-canonical participation.

```text
Reality
  -> Calibration
  -> Participant Determination
  -> Atlas
  -> Canonical Graph
  -> deterministic Translation
  -> generated participation
```

`D1`, MCP protocol data, AI records, search, manifests, generated source documentation, Observatory data, Field data, and Public Theory are disposable outputs. If an output differs from the Atlas, Translation is wrong.

## Translation

Run Canonical Translation and package its public participation bundle:

```bash
npm --prefix .atlas-publisher run translate
```

The Ruby former parses the Atlas once, validates the Atlas-owned schema, forms one disposable Canonical Graph, and generates every downstream structural representation from that graph. The Node packaging step consumes those generated outputs, calculates release identities, and prepares the Main Worker static asset bundle without reparsing the Atlas.

Generated files are ignored by Git. Delete them freely; the command above must reconstruct them byte-for-byte.

## D1

Generate without writing D1:

```bash
npm --prefix .atlas-publisher run sync:d1 -- --allow-dirty
```

The `--apply` flag is an explicit production write and is not part of normal build or test execution.

## Public Participation

- **Observatory / Field:** generated identities, relations, placement, labels, determinations, and source identity; maintained rendering and interaction.
- **Public Theory:** complete canonical Theory entry generated from the Atlas; maintained presentation only.
- **Proof:** generated canonical result links plus maintained evidence and review records.
- **Calculus:** generated comparison baseline plus maintained, explicitly non-canonical derivation evidence.
- **MCP / AI:** generated schema, protocol, entry structure, determinations, and D1 read model; read-only transport.
- **Generated web bundle:** `/ai/current/*`, `/participation/search-index.json`, `/manifest.json`, and `/participation/atlas-source-format.md` are release-bound Main Worker assets.
- **Pulse / Calibration:** participant investigation; never a structural input to Translation.

## Tests

```bash
npm --prefix .atlas-publisher test
npm --prefix reality-mechanics-mcp test
npm --prefix member test
```

The publisher suite includes invalid-target rejection, clean D1 reconstruction, surface parity, and two byte-identical disposable rebuilds.

## Deployment

Deployment is separate from Translation. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and [`docs/deployment/CLOUDFLARE_SURFACE_MAP.md`](docs/deployment/CLOUDFLARE_SURFACE_MAP.md). The Main Worker deploys code and generated assets as one unit. No Translation command deploys, pushes, tags, or writes remote D1 unless explicitly invoked with the production action.
