// atlas-core.mjs — shared, dependency-free parsing primitives for the
// Reality Mechanics Atlas.
//
// Single source of truth for how vault notes are read, so the site build
// (build.mjs), the AI export (build-atlas-ai-index.mjs), and the linter
// (atlas-doctor.mjs) cannot drift apart. No external dependencies.

import { readdir } from "node:fs/promises";
import { join } from "node:path";

// Recursively collect .md files under a directory, skipping Obsidian state
// and the excluded copilot plugin folder.
export const walk = async (dir) => {
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

// Split a note into its YAML frontmatter string and Markdown body.
export const splitFrontmatter = (raw) => {
  if (!raw.startsWith("---\n")) return { frontmatter: "", body: raw };
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return { frontmatter: "", body: raw };
  return { frontmatter: raw.slice(4, end), body: raw.slice(end + 4).replace(/^\n/, "") };
};

// Read a single scalar frontmatter value (quotes stripped).
export const frontmatterValue = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "mi"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
};

// Publish filter — identical across the build, the export, and the linter.
export const shouldPublish = (fm) => {
  const v = (k) => frontmatterValue(fm, k).toLowerCase();
  return !(v("private") === "true" || v("draft") === "true" || v("grounded") === "false"
    || v("publish") === "false" || v("published") === "false");
};

export const titleFromBody = (body) => {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : "";
};

export const wikilinkTargets = (text) =>
  [...(text || "").matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)].map((m) => m[1].trim());

export const slugify = (v) =>
  v.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "note";

export const noteSlug = (title, fileTitle = "") =>
  fileTitle === "Theory" || title === "Reality Mechanics Theory" ? "theory" : slugify(title);

// Parse a top-level block (or inline) list of wikilinks, e.g. `crossings:` / `needs:`.
export const parseTopLevelList = (fm, key) => {
  const lines = fm.split("\n");
  const idx = lines.findIndex((l) => new RegExp(`^${key}:`).test(l.replace(/\r$/, "")));
  if (idx === -1) return [];
  const inline = lines[idx].replace(/\r$/, "").slice(lines[idx].indexOf(":") + 1).trim();
  if (inline) return wikilinkTargets(inline);
  const out = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, "");
    if (/^[ \t]+-\s/.test(line)) out.push(...wikilinkTargets(line));
    else break;
  }
  return out;
};

// Parse the `conditions:` mapping (places/holds/pairs/traces/nests/reads/carries).
// String values become strings; block lists become arrays.
export const parseConditionsBlock = (frontmatter) => {
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
    if (line.length > 0 && !/^[ \t]/.test(line)) break;
    if (!line.trim()) continue;
    if (/^[ \t]+-\s/.test(line) && currentList !== null) {
      const val = line.replace(/^[ \t]+-\s+/, "").replace(/^["']|["']$/g, "").trim();
      currentList.push(val);
      continue;
    }
    const listKeyMatch = line.match(/^[ \t]+(\w+):\s*$/);
    if (listKeyMatch) { currentKey = listKeyMatch[1]; currentList = []; result[currentKey] = currentList; continue; }
    const strKeyMatch = line.match(/^[ \t]+(\w+):\s+(.+?)\s*$/);
    if (strKeyMatch) { currentKey = strKeyMatch[1]; currentList = null; result[currentKey] = strKeyMatch[2].replace(/^["']|["']$/g, ""); continue; }
  }
  return result;
};

// Order ranking for the dependency spine (Practice is the apex / return).
export const ORDER_RANK = { first: 1, second: 2, third: 3, higher: 4, practice: 5 };
export const orderOf = (id) => {
  const prefix = String(id).split(".")[0];
  return ORDER_RANK[prefix] ?? 0;
};
