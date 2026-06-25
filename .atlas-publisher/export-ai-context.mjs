import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const vaultRoot = resolve(here, "..");
const sourceRoot = join(vaultRoot, "Reality_Mechanics");
const buildRoot = resolve(process.env.ATLAS_BUILD_ROOT || join(vaultRoot, "Reality_Atlas_Build"));
const outPath = join(buildRoot, "Reality_Atlas_AI_Context.md");

const frontmatterValue = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "mi"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
};

const splitFrontmatter = (raw) => {
  if (!raw.startsWith("---\n")) return { frontmatter: "", body: raw };
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return { frontmatter: "", body: raw };
  return {
    frontmatter: raw.slice(4, end),
    body: raw.slice(end + 4).replace(/^\n/, ""),
  };
};

const shouldPublish = (frontmatter) => {
  const privateValue = frontmatterValue(frontmatter, "private").toLowerCase();
  const draftValue = frontmatterValue(frontmatter, "draft").toLowerCase();
  const groundedValue = frontmatterValue(frontmatter, "grounded").toLowerCase();
  const publishValue = frontmatterValue(frontmatter, "publish").toLowerCase();
  const publishedValue = frontmatterValue(frontmatter, "published").toLowerCase();
  return !(
    privateValue === "true" ||
    draftValue === "true" ||
    groundedValue === "false" ||
    publishValue === "false" ||
    publishedValue === "false"
  );
};

const walk = async (dir) => {
  const fs = await import("node:fs/promises");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".obsidian") continue;
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
};

const cleanBody = (body) =>
  body
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const titleFromBody = (body, filePath) => {
  const match = body.match(/^#\s+(.+?)\s*$/m);
  if (match) return match[1].trim();
  return filePath.split("/").pop().replace(/\.md$/, "").replaceAll("_", " ");
};

const notePathParts = (path) => {
  const parts = path.split("/").filter(Boolean);
  return parts[0] === "Reality_Mechanics" ? parts.slice(1) : parts;
};

const orderRank = new Map([
  ["0_Ground", 0],
  ["1_First", 1],
  ["2_Second", 2],
  ["3_Third", 3],
  ["4_Practice", 4],
  ["5_Higher", 5],
]);

const atlasSpineRank = new Map(
  [
    "Atlas",
    "Reality Mechanics",
    "Ground",
    "Natural Order",
    "Root Order",
    "Dependency Order",
    "Primitive",
    "Invariant",
    "Groundedness",
    "Term",
    "Passage Condition",
    "Structural Disorder",
    "First Order",
    "Relation",
    "Clean",
    "Asymmetry",
    "Boundary",
    "Availability",
    "Strain",
    "Bearing",
    "Resolution",
    "Second Order",
    "Closure Scope",
    "Closure",
    "Carrying",
    "Union",
    "Coupling",
    "Presence",
    "Readability",
    "Participation",
    "Third Order",
    "Field of Participation",
    "Communion",
    "Organic Field",
    "Domain",
    "Branch",
    "Translation Boundary",
    "Nesting",
    "Higher Order",
    "Opacity",
    "Legion",
    "Nested Carrying",
    "Invisible Bearing",
    "Hidden Bearing",
    "Recursion",
    "Higher Order Crossing",
    "Atlas Practice",
    "Practice",
    "Step",
    "Check",
    "Retrace Practice",
    "Terms and Conditions",
  ].map((title, index) => [title, index])
);

const compareNotes = (a, b) => {
  const aParts = notePathParts(a.path);
  const bParts = notePathParts(b.path);
  const orderA = aParts.length === 1 ? -1 : orderRank.get(aParts[0]) ?? 99;
  const orderB = bParts.length === 1 ? -1 : orderRank.get(bParts[0]) ?? 99;
  if (orderA !== orderB) return orderA - orderB;

  const spineA = atlasSpineRank.get(a.title) ?? Number.MAX_SAFE_INTEGER;
  const spineB = atlasSpineRank.get(b.title) ?? Number.MAX_SAFE_INTEGER;
  if (spineA !== spineB) return spineA - spineB;

  const pathA = a.path.toLowerCase();
  const pathB = b.path.toLowerCase();
  if (pathA !== pathB) return pathA.localeCompare(pathB);
  return a.title.localeCompare(b.title);
};

const compactFrontmatter = (frontmatter) => {
  const keepKeys = new Set([
    "grounded",
    "order",
    "kind",
    "ai_role",
    "condition_key",
    "garden_status",
    "domain",
    "needs",
    "conditions",
    "order_terminal",
    "publish",
    "status",
  ]);
  const lines = frontmatter.replace(/\r\n/g, "\n").split("\n");
  const kept = [];
  let include = false;
  let baseIndent = 0;

  for (const line of lines) {
    const topKey = line.match(/^([A-Za-z0-9_-]+):/);
    if (topKey) {
      include = keepKeys.has(topKey[1]);
      baseIndent = line.match(/^\s*/)[0].length;
    } else if (line.trim() && line.match(/^\S/)) {
      include = false;
    }

    if (include) {
      const indent = line.match(/^\s*/)[0].length;
      if (topKey || indent > baseIndent || !line.trim()) kept.push(line);
    }
  }

  return kept.join("\n").trim();
};

const notes = [];
for (const file of await walk(sourceRoot)) {
  const raw = await readFile(file, "utf8");
  const { frontmatter, body } = splitFrontmatter(raw);
  if (!shouldPublish(frontmatter)) continue;
  const relPath = relative(vaultRoot, file);
  const title = titleFromBody(body, file);
  notes.push({
    title,
    path: relPath,
    frontmatter: compactFrontmatter(frontmatter),
    body: cleanBody(body),
  });
}

notes.sort(compareNotes);

const generatedAt = new Date().toISOString();
const toc = notes
  .map((note, index) => `${index + 1}. ${note.title} — \`${note.path}\``)
  .join("\n");

const noteBlocks = notes
  .map((note, index) => {
    const fm = note.frontmatter ? `\n\`\`\`yaml\n${note.frontmatter}\n\`\`\`\n` : "";
    return [
      `## ${index + 1}. ${note.title}`,
      "",
      `Path: \`${note.path}\``,
      fm,
      note.body,
    ].join("\n");
  })
  .join("\n\n---\n\n");

const output = `# Reality Mechanics Atlas — AI Context

Generated: ${generatedAt}

This is a single-document export of the public Reality Mechanics Atlas for AI reading, retrieval, and structural review.

## How To Read This Document

- Treat the Atlas as a dependency-ordered body, not a glossary.
- A term is located by what it places, what holds it, what it pairs with, what it traces, where it nests, how it reads, and what it carries.
- \`needs\`, \`conditions.holds\`, \`conditions.traces\`, and \`conditions.carries\` are structural relations.
- \`order_terminal\` marks an order-terminal role. It is classification/recognition, not an upstream dependency.
- Wikilinks such as \`[[Ground]]\` refer to other note titles in this same document.
- Public notes only are included.

## Export Summary

- Notes: ${notes.length}
- Source: \`Reality_Mechanics\`
- Output: \`${outPath}\`

## Table Of Contents

${toc}

---

${noteBlocks}
`;

await mkdir(buildRoot, { recursive: true });
await writeFile(outPath, output, "utf8");

console.log(`Exported ${notes.length} public notes.`);
console.log(`AI context document: ${outPath}`);
