#!/usr/bin/env node
/**
 * Reality Mechanics Atlas — AI-readable export generator
 *
 * Reads the public Atlas Markdown (single source of truth) and writes a
 * machine-readable export into the site's deployed output directory:
 *
 *   <out>/ai/manifest.json
 *   <out>/ai/current/index.json
 *   <out>/ai/current/atlas.md
 *   <out>/ai/current/entries/<id>.json
 *   <out>/ai/current/links.json
 *
 * Reuses the same public-note filter and slug rule as the website build so
 * publicUrl matches the real published page. No Git is assumed; the Atlas
 * version is derived from the build date plus the dataset content hash.
 *
 * Run standalone:  node .atlas-publisher/build-atlas-ai-index.mjs
 * Env: ATLAS_BUILD_ROOT (default ../Reality_Atlas_Build), ATLAS_SITE (default https://atlas.realitymechanics.nz)
 */
import { mkdir, readFile, writeFile, rm, readdir, stat } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const vaultRoot = resolve(here, "..");
const sourceRoot = join(vaultRoot, "Reality_Mechanics");
// must match build.mjs's default (homedir/Reality_Atlas_Build) so the /ai/ export
// lands in the same .atlas-public that gets deployed when ATLAS_BUILD_ROOT is unset.
const buildRoot = resolve(process.env.ATLAS_BUILD_ROOT || join(homedir(), "Reality_Atlas_Build"));
const outRoot = join(buildRoot, ".atlas-public");
const aiRoot = join(outRoot, "ai");
const SITE = (process.env.ATLAS_SITE || "https://atlas.realitymechanics.nz").replace(/\/$/, "");
const SCHEMA_VERSION = "1.0.1";

// ---- shared helpers (kept identical to build.mjs / export-ai-context.mjs) ----
const slugify = (value) =>
  value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "note";

// match build.mjs's slug rule exactly (incl. the Theory special-case)
const noteSlug = (title, fileTitle = "") => (fileTitle === "Theory" || title === "Reality Mechanics Theory" ? "theory" : slugify(title));

const frontmatterValue = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "mi"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
};

const splitFrontmatter = (raw) => {
  if (!raw.startsWith("---\n")) return { frontmatter: "", body: raw };
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return { frontmatter: "", body: raw };
  return { frontmatter: raw.slice(4, end), body: raw.slice(end + 4).replace(/^\n/, "") };
};

const shouldPublish = (fm) => {
  const v = (k) => frontmatterValue(fm, k).toLowerCase();
  return !(v("private") === "true" || v("draft") === "true" || v("grounded") === "false"
    || v("publish") === "false" || v("published") === "false");
};

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === ".obsidian" || e.name === "copilot") continue;
      files.push(...(await walk(full)));
    } else if (e.isFile() && e.name.endsWith(".md")) files.push(full);
  }
  return files;
};

const titleFromBody = (body, filePath) => {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : filePath.split("/").pop().replace(/\.md$/, "").replaceAll("_", " ");
};

const cleanBody = (body) => body.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

// wikilink targets [[Target]] or [[Target|Alias]] -> Target
const wikilinkTargets = (text) =>
  [...text.matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)].map((m) => m[1].trim());

const stripMarkdown = (md) =>
  md
    .replace(/```[\s\S]*?```/g, " ")          // fenced code
    .replace(/`[^`]*`/g, " ")                 // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")    // images
    .replace(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g, "$1") // wikilinks -> target
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // md links -> text
    .replace(/^#{1,6}\s+/gm, "")              // headings
    .replace(/[*_>#-]/g, " ")                 // emphasis / quotes / bullets
    .replace(/\s+/g, " ")
    .trim();

const excerptFrom = (plain) => {
  const firstPara = plain.split(/(?<=[.!?])\s/).slice(0, 2).join(" ").trim() || plain;
  return firstPara.length > 200 ? firstPara.slice(0, 197).replace(/\s+\S*$/, "") + "…" : firstPara;
};

const headingsFrom = (body) =>
  [...body.matchAll(/^(#{1,6})\s+(.+?)\s*$/gm)]
    .filter((m) => m[1].length >= 2) // skip the H1 title
    .map((m) => ({ depth: m[1].length, text: m[2].trim(), anchor: slugify(m[2].trim()) }));

const sha256 = (s) => "sha256:" + createHash("sha256").update(s).digest("hex");

// explicit Atlas relations = all wikilinks in the front matter (needs + conditions)
const relationTitles = (fm) => [...new Set(wikilinkTargets(fm))];

// ---- conditions block parser ----
// Parses the `conditions:` YAML block from frontmatter without a full YAML library.
// Returns { holds?, traces?, carries?, pairs?, nests?, reads?, places? } as strings or string arrays.
const parseConditionsBlock = (frontmatter) => {
  const lines = frontmatter.split("\n");
  let inConditions = false;
  let currentKey = null;
  let currentList = null;
  const result = {};
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");
    if (!inConditions) {
      if (/^conditions:\s*$/.test(line)) { inConditions = true; }
      continue;
    }
    // back to top-level key — end of conditions block
    if (line.length > 0 && !/^[ \t]/.test(line)) break;
    if (!line.trim()) continue;
    // list item under a list key
    if (/^[ \t]+-\s/.test(line) && currentList !== null) {
      const val = line.replace(/^[ \t]+-\s+/, "").replace(/^["']|["']$/g, "").trim();
      currentList.push(val);
      continue;
    }
    // sub-key with no inline value (list follows)
    const listKeyMatch = line.match(/^[ \t]+(\w+):\s*$/);
    if (listKeyMatch) {
      currentKey = listKeyMatch[1]; currentList = []; result[currentKey] = currentList; continue;
    }
    // sub-key with inline string value
    const strKeyMatch = line.match(/^[ \t]+(\w+):\s+(.+?)\s*$/);
    if (strKeyMatch) {
      currentKey = strKeyMatch[1]; currentList = null;
      result[currentKey] = strKeyMatch[2].replace(/^["']|["']$/g, ""); continue;
    }
  }
  return result;
};

// Resolve wikilink title-strings to canonical IDs, skipping self and unknowns
const resolveToIds = (titles, titleToId, selfId) =>
  [...new Set(titles.map((t) => titleToId.get(t)).filter((id) => id && id !== selfId))];

// Build canonical structure object from frontmatter conditions
const buildStructure = (frontmatter, id, titleToId) => {
  const cond = parseConditionsBlock(frontmatter);
  if (!Object.keys(cond).length) return null;
  const wl = (v) => wikilinkTargets(Array.isArray(v) ? v.join("\n") : (v || ""));
  const holds = resolveToIds(wl(cond.holds), titleToId, id);
  const traces = resolveToIds(wl(cond.traces), titleToId, id);
  const carries = resolveToIds(wl(cond.carries), titleToId, id);
  const pairs = resolveToIds(wl(cond.pairs), titleToId, id);
  const nests = resolveToIds(wl(cond.nests), titleToId, id);
  const reads = resolveToIds(wl(cond.reads), titleToId, id);
  if (!holds.length && !traces.length && !carries.length && !pairs.length && !nests.length && !reads.length) return null;
  return { holds, traces, carries, pairs, nests, reads };
};

// ---- build entries ----
const warnings = [];
const errors = [];
const raw = [];
for (const file of await walk(sourceRoot)) {
  const text = await readFile(file, "utf8");
  const fileStat = await stat(file);
  const { frontmatter, body } = splitFrontmatter(text);
  if (!shouldPublish(frontmatter)) continue;
  const relPath = relative(vaultRoot, file).split("\\").join("/");
  const title = titleFromBody(body, file);
  if (!title) { errors.push(`Missing title: ${relPath}`); continue; }
  if (relPath.includes("..")) { errors.push(`Source path escapes vault: ${relPath}`); continue; }
  const updated = frontmatterValue(frontmatter, "updated") ||
    frontmatterValue(frontmatter, "date") ||
    fileStat.mtime.toISOString().slice(0, 10);
  const created = frontmatterValue(frontmatter, "created") ||
    fileStat.birthtime.toISOString().slice(0, 10);
  raw.push({ frontmatter, body: cleanBody(body), relPath, title, fileTitle: basename(relPath, ".md"), created, updated });
}

// Sort by relPath so lower-order notes (1_First < 2_Second < 3_Third) win title collisions
raw.sort((a, b) => a.relPath.localeCompare(b.relPath));

// First pass: build titleToId with collision tracking (first-writer-wins = lower-order wins)
const titleToId = new Map();
const titleSeen = new Map(); // title → first id that claimed it
for (const n of raw) {
  const condKey = frontmatterValue(n.frontmatter, "condition_key");
  const id = condKey || noteSlug(n.title, n.fileTitle);
  if (titleToId.has(n.title)) {
    warnings.push(`Title collision: "${n.title}" → kept ${titleSeen.get(n.title)}, skipped ${id} (${n.relPath}) — add condition_key to disambiguate [[${n.title}]] wikilinks`);
  } else {
    titleToId.set(n.title, id);
    titleSeen.set(n.title, id);
  }
  if (n.fileTitle !== n.title && !titleToId.has(n.fileTitle)) titleToId.set(n.fileTitle, id);
}

// Second pass: build full entries with canonical structure resolved from frontmatter
const entries = raw.map((n) => {
  const slug = noteSlug(n.title, n.fileTitle);
  const condKey = frontmatterValue(n.frontmatter, "condition_key");
  const id = condKey || slug;
  const plainText = stripMarkdown(n.body);
  const structure = buildStructure(n.frontmatter, id, titleToId);
  const entry = {
    id,
    title: n.title,
    slug,
    sourcePath: n.relPath,
    publicUrl: `${SITE}/${slug}.html`,
    content: n.body,
    plainText,
    excerpt: excerptFrom(plainText),
    status: frontmatterValue(n.frontmatter, "status") || undefined,
    gardenStatus: frontmatterValue(n.frontmatter, "garden_status") || undefined,
    type: frontmatterValue(n.frontmatter, "kind") || undefined,
    order: frontmatterValue(n.frontmatter, "order") || undefined,
    branch: frontmatterValue(n.frontmatter, "domain") || undefined,
    visibility: "public",
    aliases: n.fileTitle !== n.title ? [n.fileTitle] : [],
    tags: [],
    _relTitles: relationTitles(n.frontmatter),
    created: n.created,
    updated: n.updated,
    headings: headingsFrom(n.body),
    wordCount: plainText ? plainText.split(/\s+/).length : 0,
    ...(structure ? { structure } : {}),
  };
  return entry;
});

// resolve explicit relations (title -> id); unresolved -> warn (growth-flag links)
for (const e of entries) {
  const related = [];
  for (const t of e._relTitles) {
    if (t === e.title) continue;
    const rid = titleToId.get(t);
    if (rid) related.push(rid);
    else warnings.push(`Unresolved related link in ${e.sourcePath}: [[${t}]]`);
  }
  e.related = [...new Set(related)].sort();
  delete e._relTitles;
  // per-entry content hash: normalized content + identifying metadata (not builtAt)
  e.contentHash = sha256(JSON.stringify({
    id: e.id, title: e.title, sourcePath: e.sourcePath, status: e.status, gardenStatus: e.gardenStatus, type: e.type,
    order: e.order, branch: e.branch, related: e.related, content: e.content,
    structure: e.structure ?? null,
  }));
}

// deterministic order: by sourcePath then id
entries.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath) || a.id.localeCompare(b.id));

// ---- validation (fail build on hard errors) ----
const seenId = new Map(), seenUrl = new Map();
for (const e of entries) {
  if (seenId.has(e.id)) errors.push(`Duplicate id: ${e.id} (${seenId.get(e.id)} & ${e.sourcePath})`);
  else seenId.set(e.id, e.sourcePath);
  if (seenUrl.has(e.publicUrl)) errors.push(`Duplicate publicUrl: ${e.publicUrl} (${seenUrl.get(e.publicUrl)} & ${e.sourcePath})`);
  else seenUrl.set(e.publicUrl, e.sourcePath);
  if (!e.title) errors.push(`Missing title: ${e.sourcePath}`);
  if (!e.updated) warnings.push(`No update date: ${e.sourcePath}`);
}

// when the site has already been built into outRoot, confirm every publicUrl
// resolves to a real generated page (catches any slug divergence from the site).
const { existsSync } = await import("node:fs");
if (existsSync(join(outRoot, "index.html"))) {
  for (const e of entries) {
    if (!existsSync(join(outRoot, `${e.slug}.html`)))
      errors.push(`publicUrl has no built page: ${e.slug}.html (${e.sourcePath})`);
  }
}

if (errors.length) {
  console.error("AI export validation FAILED:");
  for (const er of errors) console.error("  ✗ " + er);
  process.exit(1);
}

// ---- dataset content hash + version (no Git: date + short dataset hash) ----
const datasetHash = sha256(JSON.stringify({
  schemaVersion: SCHEMA_VERSION,
  entries: entries.map((e) => e.contentHash),
}));
const shortHash = datasetHash.slice(7, 14);
const today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
const atlasVersion = `${today}-${shortHash}`;
const builtAt = new Date().toISOString();
const sourceCommit = process.env.ATLAS_COMMIT || null;

const manifest = {
  schemaVersion: SCHEMA_VERSION,
  atlasVersion,
  builtAt,
  sourceCommit,
  entryCount: entries.length,
  contentHash: datasetHash,
  current: { index: "/ai/current/index.json", atlas: "/ai/current/atlas.md", entries: "/ai/current/entries/" },
};

const indexDoc = {
  schemaVersion: SCHEMA_VERSION,
  atlasVersion,
  entries: entries.map((e) => ({
    id: e.id, title: e.title, slug: e.slug, sourcePath: e.sourcePath, publicUrl: e.publicUrl,
    excerpt: e.excerpt, status: e.status, gardenStatus: e.gardenStatus, type: e.type, order: e.order, branch: e.branch,
    aliases: e.aliases, tags: e.tags, related: e.related, updated: e.updated, contentHash: e.contentHash,
  })),
};

const linksDoc = {
  schemaVersion: SCHEMA_VERSION, atlasVersion,
  links: entries.map((e) => ({ id: e.id, related: e.related })),
};

// search-optimised file: compact per-entry searchable text + filter fields,
// so the MCP Worker can full-text search from one cached fetch.
const searchDoc = {
  schemaVersion: SCHEMA_VERSION, atlasVersion,
  entries: entries.map((e) => ({
    id: e.id, title: e.title, slug: e.slug, publicUrl: e.publicUrl,
    status: e.status, gardenStatus: e.gardenStatus, type: e.type, order: e.order, branch: e.branch,
    tags: e.tags, aliases: e.aliases, updated: e.updated, excerpt: e.excerpt,
    headings: e.headings.map((h) => h.text), text: e.plainText, contentHash: e.contentHash,
  })),
};

const atlasHeader = [
  "---",
  "title: Reality Mechanics Atlas",
  `schema_version: ${SCHEMA_VERSION}`,
  `atlas_version: ${atlasVersion}`,
  `built_at: ${builtAt}`,
  `source_commit: ${sourceCommit ?? "none"}`,
  `entry_count: ${entries.length}`,
  "---",
].join("\n");
const atlasMd = atlasHeader + "\n\n" + entries.map((e) => [
    `# ${e.title}`,
    "",
    `- ID: \`${e.id}\``,
    `- Source: \`${e.sourcePath}\``,
    `- Status: \`${e.status ?? "unspecified"}\``,
    `- Garden Status: \`${e.gardenStatus ?? "unspecified"}\``,
    `- Public URL: ${e.publicUrl}`,
    `- Content hash: \`${e.contentHash}\``,
    "",
    e.content,
  ].join("\n")).join("\n\n");

// ---- write outputs ----
await rm(aiRoot, { recursive: true, force: true });
const currentDir = join(aiRoot, "current");
const entriesDir = join(currentDir, "entries");
await mkdir(entriesDir, { recursive: true });
const writeJson = (p, o) => writeFile(p, JSON.stringify(o, null, 2) + "\n", "utf8");

await writeJson(join(aiRoot, "manifest.json"), manifest);
await writeJson(join(currentDir, "index.json"), indexDoc);
await writeJson(join(currentDir, "links.json"), linksDoc);
await writeJson(join(currentDir, "search.json"), searchDoc);
await writeFile(join(currentDir, "atlas.md"), atlasMd + "\n", "utf8");
for (const e of entries) {
  await writeJson(join(entriesDir, `${e.id.replace(/\//g, "__")}.json`), {
    ...e, schemaVersion: SCHEMA_VERSION, atlasVersion,
  });
}
// _headers for correct content types on Cloudflare Pages
await writeFile(join(aiRoot, "_headers"),
  "/ai/*\n  Content-Type: application/json; charset=utf-8\n  Cache-Control: public, max-age=60\n" +
  "/ai/current/atlas.md\n  Content-Type: text/markdown; charset=utf-8\n", "utf8");

console.log(`AI export: ${entries.length} entries → ${relative(buildRoot, aiRoot)}`);
console.log(`  atlasVersion ${atlasVersion}`);
console.log(`  contentHash  ${datasetHash}`);
if (warnings.length) console.log(`  warnings: ${warnings.length} (e.g. ${warnings[0]})`);
