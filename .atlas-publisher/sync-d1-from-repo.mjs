#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  splitFrontmatter,
  frontmatterValue,
  shouldPublish,
  titleFromBody,
  wikilinkTargets,
  slugify,
  noteSlug,
  parseConditionsBlock,
} from "./atlas-core.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const outPath = join(here, "generated", "atlas-d1-sync.sql");
const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const allowDirty = args.has("--allow-dirty");

const sql = (value) => value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const asJson = (value) => JSON.stringify(value);
const sha256 = (value) => `sha256:${createHash("sha256").update(value).digest("hex")}`;
const plainText = (body) =>
  body
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_m, target, label) => label || target)
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const excerpt = (text) => text.split(/\s+/).slice(0, 28).join(" ");
const headings = (body) =>
  [...body.matchAll(/^(#{1,4})\s+(.+?)\s*$/gm)].map((m) => ({
    depth: m[1].length,
    text: m[2].trim(),
    anchor: slugify(m[2]),
  }));

const git = (gitArgs) => execFileSync("git", gitArgs, { cwd: repoRoot, encoding: "utf8" });
const trackedFiles = git(["ls-files", "Reality_Mechanics"]).split("\n").filter((f) => f.endsWith(".md"));
const status = git(["status", "--porcelain", "--untracked-files=all", "--", "Reality_Mechanics"]).trim();
if (status && !allowDirty) {
  console.error("Atlas sync stopped: Reality_Mechanics has uncommitted or untracked changes.");
  console.error("Commit Atlas changes to GitHub first, then sync D1 from the repository.");
  console.error("Use --allow-dirty only for an explicit recovery run.");
  process.exit(1);
}

const rawNotes = [];
for (const relPath of trackedFiles) {
  const raw = await readFile(join(repoRoot, relPath), "utf8");
  const { frontmatter, body } = splitFrontmatter(raw);
  if (!shouldPublish(frontmatter)) continue;
  const title = titleFromBody(body);
  if (!title) continue;
  const fileTitle = basename(relPath, ".md");
  rawNotes.push({ relPath, frontmatter, body, title, fileTitle });
}

const titleToId = new Map();
for (const note of rawNotes) {
  const id = frontmatterValue(note.frontmatter, "condition_key") || noteSlug(note.title, note.fileTitle);
  if (!titleToId.has(note.title)) titleToId.set(note.title, id);
}

const idsFrom = (value) => {
  const source = Array.isArray(value) ? value.join("\n") : (value || "");
  return wikilinkTargets(source).map((title) => titleToId.get(title)).filter(Boolean);
};

const rows = rawNotes.map((note) => {
  const id = frontmatterValue(note.frontmatter, "condition_key") || noteSlug(note.title, note.fileTitle);
  const slug = noteSlug(note.title, note.fileTitle);
  const cond = parseConditionsBlock(note.frontmatter);
  const structure = {
    holds: idsFrom(cond.holds),
    traces: idsFrom(cond.traces),
    carries: idsFrom(cond.carries),
    pairs: idsFrom(cond.pairs),
    nests: idsFrom(cond.nests),
    reads: idsFrom(cond.reads),
  };
  const related = [...new Set(Object.values(structure).flat())].sort();
  const text = plainText(note.body);
  const updated = frontmatterValue(note.frontmatter, "updated") ||
    frontmatterValue(note.frontmatter, "date") ||
    new Date().toISOString().slice(0, 10);
  const created = frontmatterValue(note.frontmatter, "created") || "1970-01-01";
  return {
    id,
    title: note.title,
    slug,
    source_path: note.relPath,
    public_url: `https://realitymechanics.nz/field#${encodeURIComponent(id)}`,
    content: note.body,
    plain_text: text,
    excerpt: excerpt(text),
    status: frontmatterValue(note.frontmatter, "status") || "stable",
    garden_status: frontmatterValue(note.frontmatter, "garden_status") || "rooted",
    grounded: frontmatterValue(note.frontmatter, "grounded").toLowerCase() === "true" ? 1 : 0,
    entry_order: frontmatterValue(note.frontmatter, "order") || id.split(".")[0],
    entry_type: frontmatterValue(note.frontmatter, "kind") || "term",
    branch: frontmatterValue(note.frontmatter, "domain") || null,
    aliases: [],
    tags: [],
    related,
    structure,
    headings: headings(note.body),
    word_count: text.split(/\s+/).filter(Boolean).length,
    content_hash: sha256(note.body),
    created,
    updated,
  };
});

const columns = [
  "id", "title", "slug", "source_path", "public_url", "content", "plain_text", "excerpt",
  "status", "garden_status", "grounded", "entry_order", "entry_type", "branch", "aliases",
  "tags", "related", "structure", "headings", "word_count", "content_hash", "created", "updated",
];

const lines = [
  "-- Generated from GitHub repository files. Do not edit D1 directly.",
  "-- Source: Reality_Mechanics/*.md",
  "BEGIN TRANSACTION;",
  "DELETE FROM entries;",
  ...rows.map((row) => {
    const values = columns.map((key) => {
      const value = row[key];
      if (["aliases", "tags", "related", "structure", "headings"].includes(key)) return sql(asJson(value));
      return typeof value === "number" ? String(value) : sql(value);
    });
    return `INSERT INTO entries (${columns.join(",")}) VALUES (${values.join(",")});`;
  }),
  "COMMIT;",
  "INSERT INTO entries_fts(entries_fts) VALUES('rebuild');",
  "",
];

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, lines.join("\n"));
console.log(`Generated ${relative(repoRoot, outPath)} from ${rows.length} tracked Atlas notes.`);

if (apply) {
  const wranglerCandidates = [
    join(repoRoot, ".atlas-publisher", "node_modules", ".bin", "wrangler"),
    join(repoRoot, "member", "node_modules", ".bin", "wrangler"),
    join(repoRoot, "reality-mechanics-mcp", "node_modules", ".bin", "wrangler"),
  ];
  let wranglerCommand = "npx";
  let wranglerArgs = ["wrangler"];
  for (const candidate of wranglerCandidates) {
    try {
      await access(candidate);
      wranglerCommand = candidate;
      wranglerArgs = [];
      break;
    } catch {
      // Fall back to npx when no workspace Wrangler is installed.
    }
  }
  const wrangler = spawnSync(wranglerCommand, [...wranglerArgs, "d1", "execute", "atlas-d1", "--remote", "--file", outPath], {
    cwd: repoRoot,
    stdio: "inherit",
  });
  process.exit(wrangler.status ?? 1);
}

console.log("Dry run only. Re-run with --apply to sync D1.");
