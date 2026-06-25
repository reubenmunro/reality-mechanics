import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { walk, splitFrontmatter, shouldPublish, slugify } from "./atlas-core.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const vaultRoot = resolve(here, "..");
const sourceRoot = join(vaultRoot, "Reality_Mechanics");
const buildRoot = resolve(process.env.ATLAS_BUILD_ROOT || join(homedir(), "Reality_Atlas_Build"));
const outRoot = join(buildRoot, ".atlas-public");
const zipPath = join(buildRoot, "Reality_Atlas_Public.zip");
const theoryBuildRoot = resolve(process.env.THEORY_BUILD_ROOT || join(homedir(), "Reality_Atlas_Build"));
const theoryOutRoot = join(theoryBuildRoot, ".theory-public");
const theoryZipPath = join(theoryBuildRoot, "Reality_Theory_Public.zip");
const shouldZip = process.env.ATLAS_SKIP_ZIP !== "1";
const assetVersion = String(Date.now());

const site = {
  title: "Reality Mechanics Atlas",
  description: "A dependency-ordered reasoning system.",
  canonical: "https://atlas.realitymechanics.nz",
  home: "https://realitymechanics.nz",
  atlas: "https://atlas.realitymechanics.nz",
  theory: "https://theory.realitymechanics.nz",
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// frontmatter parsing primitives (walk, splitFrontmatter, shouldPublish, slugify) come from atlas-core.mjs

const markdownInline = (text, noteByTitle) => {
  let value = escapeHtml(text);

  value = value.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_match, target, label) => {
    const title = target.trim();
    const note = noteByTitle.get(title);
    const linkText = label?.trim() || title;
    if (!note) return `<span class="missing-link">${escapeHtml(linkText)}</span>`;
    return `<a href="${note.slug}.html">${escapeHtml(linkText)}</a>`;
  });

  value = value.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  return value;
};

const markFirstTermUse = (text, title, state, section) => {
  if (!title) return text;
  const key = section || "definition";
  if (state.done.has(key)) return text;
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|\\W)(${escapedTitle})(?=\\W|$)`);
  const parts = text.split(/(\[\[[^\]]+\]\]|\[[^\]]+\]\([^)]+\))/g);
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part.startsWith("[[") || part.match(/^\[[^\]]+\]\([^)]+\)$/)) continue;
    const marked = part.replace(pattern, (match, prefix, term) => {
      state.done.add(key);
      return `${prefix}**${term}**`;
    });
    parts[index] = marked;
    if (state.done.has(key)) break;
  }
  return parts.join("");
};

const renderMarkdown = (body, noteByTitle, currentTitle = "") => {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let list = null;
  let code = false;
  let codeLines = [];
  let currentSection = "definition";
  const termMarkState = { done: new Set() };

  const closeList = () => {
    if (!list) return;
    html.push(`</${list}>`);
    list = null;
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (code) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        code = false;
        codeLines = [];
      } else {
        closeList();
        code = true;
      }
      continue;
    }

    if (code) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      if (level === 2) currentSection = heading[2].trim().toLowerCase();
      html.push(`<h${level} id="${slugify(heading[2])}">${markdownInline(heading[2], noteByTitle)}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      if (list !== "ul") {
        closeList();
        list = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${markdownInline(bullet[1], noteByTitle)}</li>`);
      continue;
    }

    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (numbered) {
      if (list !== "ol") {
        closeList();
        list = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${markdownInline(numbered[1], noteByTitle)}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${markdownInline(markFirstTermUse(line, currentTitle, termMarkState, currentSection), noteByTitle)}</p>`);
  }

  closeList();
  if (code) html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  return html.join("\n");
};

const extractLinks = (body) => {
  const links = new Set();
  for (const match of body.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
    links.add(match[1].trim());
  }
  return [...links];
};

const extractSectionLinks = (body, sectionTitle) => {
  const links = new Set();
  const headingPattern = new RegExp(`^##\\s+${sectionTitle}\\s*$`, "i");
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  let inSection = false;

  for (const line of lines) {
    if (headingPattern.test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line)) break;
    if (!inSection) continue;

    for (const match of line.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
      links.add(match[1].trim());
    }
  }

  return [...links];
};

const displayPath = (path) =>
  path
    .replaceAll("_", " ")
    .replace(/^RM (\d{2}) /, "$1 ")
    .replace(/^RM (\d{2})$/, "$1")
    .replace(/^(\d{2}) (.+?)\/00 Root\//, "$1 $2 / ")
    .replace(/\/00 Root\//g, " / ")
    .replace(/\.md$/, "");

const displayGroup = (group) => displayPath(group).replace(/^\d{2} /, "").replace(/^(\d{2})$/, "$1");

const notePathParts = (path) => {
  const parts = path.split("/").filter(Boolean);
  return parts[0] === "Reality_Mechanics" ? parts.slice(1) : parts;
};

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
    "Allow",
    "Operational Condition",
    "Threshold",
    "Notice",
    "Enter",
    "Attend",
    "Trace",
    "Read",
    "Clearance",
    "Space",
    "Time",
    "Relation Read",
    "Strain",
    "Bearing",
    "Resolution",
    "Hold",
    "Yield",
    "Release",
    "Transfer",
    "Absorb",
    "Failure",
    "Second Order",
    "Closure Scope",
    "Closure",
    "Carrying",
    "Union",
    "Coupling",
    "Presence",
    "Readability",
    "Participation",
    "Dependency",
    "Capacity",
    "Constraint",
    "Medium",
    "Flow",
    "Resistance",
    "Load",
    "Compatibility",
    "Contact",
    "Pair",
    "Traction",
    "Friction",
    "Being",
    "Become",
    "Real",
    "World",
    "Know",
    "Observation",
    "Recognition Read",
    "Retrace Read",
    "Cycle",
    "Rhythm",
    "Influence",
    "Third Order",
    "Field of Participation",
    "Field Bearing",
    "Domain",
    "Branch",
    "Translation Boundary",
    "Field Relationships",
    "Nesting",
    "Placement Mode",
    "Organic",
    "Organic Field",
    "Fabric",
    "Thread",
    "Memory",
    "Thought",
    "Language",
    "Natural World",
    "Body",
    "Relationship",
    "Higher Order",
    "Invisible Bearing",
    "Hidden Bearing",
    "Recursion",
    "Nested Carrying",
    "Higher Retrace",
    "Higher Recognition",
    "Higher Learning",
    "Higher Faith",
    "Atlas Practice",
    "Participant",
    "Practice",
    "Step",
    "Check",
    "Tracing",
    "Retracing",
    "Retrace Practice",
    "Discipline",
    "Atlasing",
    "Atlas Note Standard",
    "Root System",
    "Root Resilience",
  ].map((title, index) => [title, index])
);

const pathRank = (note) => {
  const parts = notePathParts(note.path);
  if (parts.length <= 2) return 0;
  const section = parts[1] || "";
  const subsection = parts[2] || "";
  const pathText = `${section}/${subsection}`;
  const pathOrder = [
    "00_Root/",
    "Carrier Mechanics/",
    "Relation Conditions/",
    "Boundary Conditions/",
    "Asymmetry Conditions/",
    "Resolution Conditions/",
    "Carrying Conditions/",
    "Coupling Conditions/",
    "Closure Conditions/",
    "Presence Conditions/",
    "Readability Conditions/",
    "Participation Conditions/",
    "Fields/",
    "Domains/",
    "Placement Modes/",
    "Translation Boundaries/",
    "Path Reads/",
    "Applied Diagnosis/",
  ];
  const rank = pathOrder.findIndex((item) => pathText.startsWith(item));
  return rank === -1 ? pathOrder.length + 1 : rank + 1;
};

const compareAtlasNotes = (a, b) => {
  const practiceA = notePathParts(a.path)[0] === "4_Practice";
  const practiceB = notePathParts(b.path)[0] === "4_Practice";
  if (practiceA && practiceB) {
    const spineA = atlasSpineRank.get(a.title) ?? Number.MAX_SAFE_INTEGER;
    const spineB = atlasSpineRank.get(b.title) ?? Number.MAX_SAFE_INTEGER;
    if (spineA !== spineB) return spineA - spineB;
  }

  const pathA = pathRank(a);
  const pathB = pathRank(b);
  if (pathA !== pathB) return pathA - pathB;

  const spineA = atlasSpineRank.get(a.title) ?? Number.MAX_SAFE_INTEGER;
  const spineB = atlasSpineRank.get(b.title) ?? Number.MAX_SAFE_INTEGER;
  if (spineA !== spineB) return spineA - spineB;

  return a.title.localeCompare(b.title);
};

const orderAtlasGroup = (groupNotes) => {
  return [...groupNotes].sort(compareAtlasNotes);
};

const practiceRootTitles = new Set([
  "Atlas Practice",
  "Participant",
  "Atlas Note Standard",
  "Root System",
  "Root Resilience",
  "Reality-Bearing Connection",
]);

const subgroupLabelFor = (note) => {
  const parts = notePathParts(note.path);
  // parts: [0]=order folder, [1]=subfolder or filename
  if (parts.length <= 2) {
    // Note is at the order root (no subfolder)
    if (parts[0] === "4_Practice" && !practiceRootTitles.has(note.title)) {
      return "Practice Movement";
    }
    return "Root";
  }
  const subgroup = parts[1] || "";
  if (!subgroup) return "Root";

  // Third Order: Fields and Domains get nested labels
  if (parts[0] === "3_Third" && ["Fields", "Domains"].includes(subgroup) && parts[2]) {
    const branchParts = [subgroup, ...parts.slice(2, -1)];
    return branchParts.map(displayPath).join(" / ");
  }

  return displayPath(subgroup);
};

const renderAtlasSubgroups = (groupNotes) => {
  const subgroups = new Map();
  for (const note of orderAtlasGroup(groupNotes)) {
    const label = subgroupLabelFor(note);
    if (!subgroups.has(label)) subgroups.set(label, []);
    subgroups.get(label).push(note);
  }

  return [...subgroups.entries()]
    .map(([label, notes]) => `
        <div class="atlas-subgroup">
          ${label ? `<h3>${escapeHtml(label)}</h3>` : ""}
          <div class="note-grid">
            ${notes
              .map((note) => `<a class="note-card" href="${note.slug}.html"><span>${escapeHtml(note.title)}</span><small>${escapeHtml(displayPath(note.path))}</small></a>`)
              .join("")}
          </div>
        </div>`)
    .join("");
};

const graphPriority = new Set([
  "Atlas",
  "Reality Mechanics",
  "Ground",
  "Natural Order",
  "Root Order",
  "Relation",
  "Asymmetry",
  "Boundary",
  "Availability",
  "Strain",
  "Bearing",
  "Resolution",
  "Carrying",
  "Coupling",
  "Presence",
  "Participation",
  "Field of Participation",
  "Nesting",
  "Recursion",
  "Higher Order",
  "Atlas Practice",
  "Trace",
  "Retrace Practice",
  "Reality-Bearing Connection",
  "Source Drift",
  "Memory",
  "Thought",
]);

const graphDataFor = (notes) => {
  const byTitle = new Map(notes.map((note) => [note.title, note]));
  const incoming = new Map(notes.map((note) => [note.title, 0]));
  for (const note of notes) {
    for (const target of note.resolvedLinks) incoming.set(target.title, (incoming.get(target.title) || 0) + 1);
  }

  const selected = notes
    .filter((note) => graphPriority.has(note.title))
    .concat(
      notes
        .filter((note) => !graphPriority.has(note.title))
        .sort((a, b) => (incoming.get(b.title) || 0) - (incoming.get(a.title) || 0))
        .slice(0, 34)
    );

  const unique = [...new Map(selected.map((note) => [note.title, note])).values()];
  const selectedTitles = new Set(unique.map((note) => note.title));

  return {
    nodes: unique.map((note) => ({
      title: note.title,
      slug: note.slug,
      weight: Math.min(8, 2 + (incoming.get(note.title) || 0)),
      root: graphPriority.has(note.title),
    })),
    links: unique.flatMap((note) =>
      note.resolvedLinks
        .filter((target) => selectedTitles.has(target.title))
        .map((target) => ({ source: note.title, target: target.title }))
    ),
  };
};

const entryGraphTerms = [
  { title: "Atlas", x: 0.5, y: 0.16 },
  { title: "Trace", x: 0.68, y: 0.26 },
  { title: "Reality-Bearing Connection", x: 0.82, y: 0.42 },
  { title: "Ground", x: 0.22, y: 0.3 },
  { title: "Natural Order", x: 0.14, y: 0.48 },
  { title: "Asymmetry", x: 0.32, y: 0.5 },
  { title: "Boundary", x: 0.46, y: 0.44 },
  { title: "Relation", x: 0.42, y: 0.64 },
  { title: "Bearing", x: 0.58, y: 0.6 },
  { title: "Participation", x: 0.64, y: 0.76 },
  { title: "Memory", x: 0.78, y: 0.7 },
  { title: "Recursion", x: 0.88, y: 0.24 },
];

const entryGraphLinks = [
  ["Atlas", "Trace"],
  ["Trace", "Reality-Bearing Connection"],
  ["Atlas", "Ground"],
  ["Ground", "Natural Order"],
  ["Ground", "Asymmetry"],
  ["Asymmetry", "Boundary"],
  ["Boundary", "Relation"],
  ["Relation", "Bearing"],
  ["Bearing", "Participation"],
  ["Participation", "Memory"],
  ["Memory", "Recursion"],
  ["Recursion", "Atlas"],
];

const entryGraphDataFor = (notes) => {
  const byTitle = new Map(notes.map((note) => [note.title, note]));
  const nodes = entryGraphTerms
    .map((item) => {
      const note = byTitle.get(item.title);
      if (!note) return null;
      return {
        title: note.title,
        slug: note.slug,
        weight: item.title === "Atlas" ? 8 : 5,
        root: true,
        fixed: true,
        x: item.x,
        y: item.y,
      };
    })
    .filter(Boolean);
  const titles = new Set(nodes.map((node) => node.title));
  return {
    nodes,
    links: entryGraphLinks
      .filter(([source, target]) => titles.has(source) && titles.has(target))
      .map(([source, target]) => ({ source, target })),
  };
};

const noteTemplate = ({ note, content, backlinks, notes }) => {
  const backlinksHtml = backlinks.length
    ? `<ul>${backlinks.map((item) => `<li><a href="${item.slug}.html">${escapeHtml(item.title)}</a></li>`).join("")}</ul>`
    : `<p class="muted">No incoming public links yet.</p>`;
  const localTraceHtml =
    note.traceLinks.length || note.carryLinks.length
      ? `<section class="local-trace" aria-label="Local trace">
          ${
            note.traceLinks.length
              ? `<div><h2>Held By</h2><p>${note.traceLinks.map((target) => `<a href="${target.slug}.html">${escapeHtml(target.title)}</a>`).join(" · ")}</p></div>`
              : ""
          }
          ${
            note.carryLinks.length
              ? `<div><h2>Carries To</h2><p>${note.carryLinks.map((target) => `<a href="${target.slug}.html">${escapeHtml(target.title)}</a>`).join(" · ")}</p></div>`
              : ""
          }
        </section>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(note.title)} · ${escapeHtml(site.title)}</title>
  <meta name="description" content="${escapeHtml(site.description)}">
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">${escapeHtml(site.title)}</a>
    <nav>
      <a href="index.html">Atlas</a>
      <a href="${site.theory}">Postulate</a>
    </nav>
  </header>
  <main class="layout">
    <aside class="sidebar">
      <input id="search" type="search" placeholder="Trace, Bearing, Memory" aria-label="Find a term">
      <div id="results" class="results"></div>
    </aside>
    <article class="note">
      ${localTraceHtml}
      ${content}
    </article>
  </main>
  <script src="search.js?v=${assetVersion}"></script>
</body>
</html>`;
};


// Dependency spine — shown as clickable chain in the hero
const SPINE_TERMS = [
  "Ground", "Practice",
];

const spineChainHtml = (noteByTitle) =>
  SPINE_TERMS
    .map((title) => {
      const note = noteByTitle.get(title);
      if (!note) return `<span>${escapeHtml(title)}</span>`;
      return `<span><a href="${note.slug}.html">${escapeHtml(title)}</a></span>`;
    })
    .join("");

// Canonical order and display labels for index sections
const GROUP_ORDER = [
  ["_root", "The Atlas"],
  ["0_Ground", "Ground"],
  ["1_First", "First Order"],
  ["2_Second", "Second Order"],
  ["3_Third", "Third Order"],
  ["4_Practice", "Practice"],
  ["5_Higher", "Higher Order"],
];
const GROUP_LABEL = new Map(GROUP_ORDER);
const GROUP_RANK = new Map(GROUP_ORDER.map(([key], i) => [key, i]));

const noteGroupKey = (note) => {
  const parts = notePathParts(note.path);
  const group = parts[0] || "";
  if (!group || group.endsWith(".md")) return "_root";
  return group;
};

const indexTemplate = ({ notes, entryNotes, traceModeNotes, noteByTitle }) => {
  const grouped = new Map();
  for (const note of notes) {
    const key = noteGroupKey(note);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(note);
  }

  const orderedGroups = [...grouped.entries()].sort(([a], [b]) => {
    const ra = GROUP_RANK.get(a) ?? 99;
    const rb = GROUP_RANK.get(b) ?? 99;
    return ra !== rb ? ra - rb : a.localeCompare(b);
  });

  const ORDER_GLOSS = {
    "The Atlas": "the root entrance — postulate, spine, and how to read",
    "Ground": "what the Atlas acknowledges but does not derive",
    "First Order": "relation becomes locatable — hold, carry, place",
    "Second Order": "carried order is enacted as carrying",
    "Third Order": "participating carrying becomes organised and nested",
    "Practice": "a participant follows trace through retracing",
    "Higher Order": "organised carrying enters its own carrying",
  };

  const navHtml = `
    <nav class="order-nav" aria-label="Jump to order">
      ${orderedGroups.map(([key]) => {
        const label = GROUP_LABEL.get(key) ?? displayGroup(key);
        const id = `section-${slugify(label)}`;
        return `<a href="#${id}">${escapeHtml(label)}</a>`;
      }).join("\n")}
    </nav>`;

  const groupsHtml = orderedGroups
    .map(([key, groupNotes]) => {
      const label = GROUP_LABEL.get(key) ?? displayGroup(key);
      const id = `section-${slugify(label)}`;
      return `
      <section class="band" id="${id}">
        <h2>${escapeHtml(label)}</h2>
        ${renderAtlasSubgroups(groupNotes)}
      </section>`;
    })
    .join("\n");

  const startingPoints = [
    ["Reasoning", "A reason is traceable support."],
    ["Relation", "Where tracing begins."],
    ["Trace", "Follow what carries back to what holds."],
    ["Carry", "Forward availability of held connection."],
    ["Garden Status", "How living structure is tended."],
    ["Resolution Rate", "Meaningful distinction per available continuation."],
  ].map(([title, gloss]) => {
    const note = noteByTitle.get(title);
    if (!note) return "";
    return `<a href="${note.slug}.html"><span>${escapeHtml(title)}</span><small>${escapeHtml(gloss)}</small></a>`;
  }).filter(Boolean).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(site.title)}</title>
  <meta name="description" content="${escapeHtml(site.description)}">
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="hero">
    <div class="hero-copy">
      <p class="opening-question">The Atlas</p>
      <h1>A reasoning system for traceable order.</h1>
      <p>${escapeHtml(site.description)}</p>
      <p class="atlas-context">A reason is traceable support. Enter a term, follow what holds it, follow what it carries, and return through trace.</p>
      <div class="practice-loop">${spineChainHtml(noteByTitle)}</div>
      <nav class="threshold-actions" aria-label="Atlas entry points">
        <a href="reasoning.html">Start with Reasoning</a>
        <a href="${site.theory}">Read the Postulate</a>
        <a href="ai-participation.html">AI Participation</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="start-points" aria-label="Suggested starting points">
      ${startingPoints}
    </section>
    <nav class="order-map" aria-label="The orders of the Atlas">
      ${orderedGroups.map(([key]) => {
        const label = GROUP_LABEL.get(key) ?? displayGroup(key);
        const id = `section-${slugify(label)}`;
        const gloss = ORDER_GLOSS[label] ?? "";
        return `<a href="#${id}"><span>${escapeHtml(label)}</span><small>${escapeHtml(gloss)}</small></a>`;
      }).join("\n")}
    </nav>
    <p class="order-note">The order is a loop, not a ladder — Practice returns through trace to Ground.</p>
    <section class="search-band">
      <input id="search" type="search" placeholder="Search the Atlas — Trace, Reasoning, Bearing" aria-label="Find a term">
      <div id="results" class="results"></div>
    </section>
    ${groupsHtml}
  </main>
  <footer class="site-footer">
    <a href="https://doi.org/10.5281/zenodo.20338363" rel="noopener noreferrer">Zenodo Archive</a>
  </footer>
  <script src="search.js?v=${assetVersion}"></script>
</body>
</html>`;
};

const absolutizeAtlasLinks = (html) =>
  html.replace(/href="(?!https?:\/\/|#|\/)([^"]+\.html)"/g, `href="${site.atlas}/$1"`);

const theoryTemplate = ({ content }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Working Postulate · ${escapeHtml(site.title)}</title>
  <meta name="description" content="The current test the Atlas uses to keep reasoning answerable: Relation holds. Order carries. Trace places.">
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${site.home}">Reality Mechanics</a>
    <nav>
      <a href="${site.atlas}">Atlas</a>
      <a aria-current="page" href="${site.theory}">Postulate</a>
    </nav>
  </header>

  <main class="theory-page">
    <header class="theory-hero">
      <p class="theory-status">Working postulate · current test</p>
      <h1>Relation<br>Order<br>Trace</h1>
      <p class="theory-lede">The current test the Atlas uses to keep reasoning answerable: relation holds, order carries, trace places.</p>
      <div class="theory-actions">
        <a href="#formal-specification">Read the postulate ↓</a>
        <a href="${site.atlas}/reasoning.html">Start with Reasoning →</a>
        <a href="${site.theory}/coupled-read.html">Run Coupled Read →</a>
      </div>
    </header>

    <section class="theory-primitives" aria-label="Root operations">
      <article>
        <span>01</span>
        <h2>Relation</h2>
        <p>What must hold before a term can enter order rather than float as a label.</p>
      </article>
      <article>
        <span>02</span>
        <h2>Order</h2>
        <p>What carries relation forward without losing the dependency that lets it remain answerable.</p>
      </article>
      <article>
        <span>03</span>
        <h2>Trace</h2>
        <p>What places a claim by following what carries back to what holds it.</p>
      </article>
    </section>

    <section class="theory-tact">
      <p class="eyebrow">Test, not canon</p>
      <h2>The Atlas is a reasoning system for traceable order.</h2>
      <p>A reason is traceable support. Relation, Order, and Trace test whether that support can hold, carry, and return through trace.</p>
    </section>

    <div class="theory-body" id="formal-specification">
      <aside class="theory-toc">
        <p class="eyebrow">Working postulate</p>
        <a href="#the-working-postulate">The postulate</a>
        <a href="#the-orders">The orders</a>
        <a href="#the-crossing">The crossing</a>
        <a href="#carry-and-trace">Carry and trace</a>
        <a href="#reach">Reach</a>
        <a href="#return">Return</a>
        <a href="#the-whole-order">The whole order</a>
        <a href="#formal-section">Formal section</a>
        <a href="#refutable-reads">Refutable reads</a>
        <a href="#worked-reads">Worked reads</a>
        <a href="#relation-to-existing-mathematics">Existing mathematics</a>
        <a href="#open-problems">Open problems</a>
      </aside>
      <article class="theory-document">
        ${content}
      </article>
    </div>

    <section class="theory-experiment">
      <div>
        <p class="eyebrow">Experiment 01</p>
        <h2>Coupled Read</h2>
        <p>Language and mathematical notation run simultaneously over the same Index order. Their mismatch is evidence, not inconvenience.</p>
      </div>
      <a href="${site.theory}/coupled-read.html">Open experiment →</a>
    </section>
  </main>
</body>
</html>`;

const coupledReadStepsFor = (noteByTitle) => {
  const definitions = [
    {
      title: "First → Second",
      note: "Carry",
      formula: "Carry ⇝ Carrying",
      language: "Connection offers carry; carry is enacted as carrying.",
      shade: "the forward availability of connection becomes a forward passage being made",
    },
    {
      title: "Second → Third",
      note: "Participation",
      formula: "Participation ⇝ Field",
      language: "Carrying through participation organises into a field.",
      shade: "participating carrying gathers into a recurring field",
    },
    {
      title: "Third → Higher",
      note: "Nesting",
      formula: "Nesting ⇝ Recursion",
      language: "Organised and nested carrying enters its own carrying.",
      shade: "carrying becomes a carrier for its own carrying",
    },
    {
      title: "Higher → Practice",
      note: "Retracing",
      formula: "Trace ⇝ Retracing",
      language: "A participant enters trace and follows it backward.",
      shade: "return is a participant following trace, not a forced loop",
    },
  ];

  return definitions
    .map((item) => {
      const note = noteByTitle.get(item.note);
      if (!note) return null;
      return {
        ...item,
        slug: note.slug,
        traces: note.traceLinks.map((target) => ({ title: target.title, slug: target.slug })),
        carries: note.carryLinks.map((target) => ({ title: target.title, slug: target.slug })),
      };
    })
    .filter(Boolean);
};

const coupledReadTemplate = ({ steps }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Coupled Read · ${escapeHtml(site.title)}</title>
  <meta name="description" content="Language and mathematics running simultaneously over one dependency order.">
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${site.home}">Reality Mechanics</a>
    <nav>
      <a href="${site.atlas}">Atlas</a>
      <a href="${site.theory}">Postulate</a>
    </nav>
  </header>
  <main class="coupled-page">
    <header class="coupled-hero">
      <p class="eyebrow"><a href="${site.theory}">Postulate experiment</a> · one order · two simultaneous reads</p>
      <h1>Coupled Read</h1>
      <p>Two reads move together across the same order — the plain telling and the structural crossing. Neither is the source. Where they pull apart, the order shows itself.</p>
    </header>

    <section class="coupled-runner" aria-labelledby="runner-title">
      <div class="runner-heading">
        <div>
          <p class="eyebrow">The order, by carrying mode</p>
          <h2 id="runner-title">Carry ⇝ Carrying ⇝ Participation ⇝ Nesting ⇝ Retracing</h2>
        </div>
        <button id="coupled-toggle" class="runner-toggle" type="button" aria-pressed="false">Pause</button>
      </div>

      <div id="coupled-steps" class="coupled-steps" aria-label="Order positions"></div>

      <div class="coupled-views" aria-live="polite">
        <article class="read-panel language-panel">
          <p class="panel-label">Language read</p>
          <h3 id="language-title"></h3>
          <p id="language-line" class="language-line"></p>
          <a id="language-link" class="term-link" href="#">Open term →</a>
        </article>

        <article class="read-panel formula-panel">
          <p class="panel-label">Structural read · the crossing</p>
          <p id="formula-line" class="formula-line" aria-label="Mathematical order formula"></p>
          <p id="formula-shade" class="formula-shade"></p>
        </article>
      </div>

      <div class="index-relations">
        <div>
          <p class="panel-label">Trace — backward, what holds it</p>
          <p id="trace-links"></p>
        </div>
        <div>
          <p class="panel-label">Carry — forward, across the crossing</p>
          <p id="carry-links"></p>
        </div>
      </div>
    </section>

    <section class="coupled-note">
      <p>The crossing is the structural read; the sentence is the telling. Both are generated from the same placed Atlas terms, and both change on the same beat. The trace and carry below are the one crossing read backward and forward.</p>
      <p class="coupled-whole">One connection, two directions. Carrying changes mode at each crossing; the trace stays followable, or it doesn't — and that is the evidence.</p>
    </section>
  </main>
  <script>window.COUPLED_READ_STEPS = ${JSON.stringify(steps)}; window.ATLAS_TERM_BASE = ${JSON.stringify(`${site.atlas}/`)};</script>
  <script src="coupled-read.js?v=${assetVersion}"></script>
</body>
</html>`;

const theoryNotFoundTemplate = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Not Found · Reality Mechanics Postulate</title>
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${site.home}">Reality Mechanics</a>
    <nav><a href="${site.atlas}">Atlas</a><a href="${site.theory}">Postulate</a></nav>
  </header>
  <main class="graph-page">
    <h1>Path Not Found</h1>
    <p class="lede">This path is not part of the working postulate yet.</p>
    <p><a href="${site.theory}">Return to Postulate →</a></p>
  </main>
</body>
</html>`;

const graphTemplate = ({ notes }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Connections · ${escapeHtml(site.title)}</title>
  <meta name="description" content="${escapeHtml(site.description)}">
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">${escapeHtml(site.title)}</a>
    <nav>
      <a href="index.html">Atlas</a>
      <a href="${site.theory}">Postulate</a>
    </nav>
  </header>
  <main class="graph-page">
    <h1>Connections</h1>
    <p class="lede">A readable public list of the Atlas links. This is the retrace surface, not a replacement for Obsidian.</p>
    <div class="connection-list">
      ${notes
        .map((note) => `
          <section>
            <h2><a href="${note.slug}.html">${escapeHtml(note.title)}</a></h2>
            ${
              note.resolvedLinks.length
                ? `<p>${note.resolvedLinks.map((target) => `<a href="${target.slug}.html">${escapeHtml(target.title)}</a>`).join(" · ")}</p>`
                : `<p class="muted">No public outgoing links.</p>`
            }
          </section>`)
        .join("")}
    </div>
  </main>
</body>
</html>`;

const notFoundTemplate = ({ entryNotes }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Not Found · ${escapeHtml(site.title)}</title>
  <meta name="description" content="${escapeHtml(site.description)}">
  <link rel="stylesheet" href="styles.css?v=${assetVersion}">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">${escapeHtml(site.title)}</a>
    <nav>
      <a href="index.html">Atlas</a>
      <a href="${site.theory}">Postulate</a>
    </nav>
  </header>
  <main class="graph-page">
    <h1>Path Not Found</h1>
    <p class="lede">This public Atlas path does not exist yet, or it has moved during gardening.</p>
    <div class="entry-links">
      ${entryNotes.map((note) => `<a href="${note.slug}.html">${escapeHtml(note.title)}</a>`).join("")}
    </div>
  </main>
</body>
</html>`;

const styles = await readFile(join(here, "styles.css"), "utf8");

const searchScript = `const notes = window.ATLAS_NOTES || [];
const search = document.getElementById("search");
const results = document.getElementById("results");

function render(query) {
  if (!results) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    results.innerHTML = "";
    return;
  }
  const matches = notes
    .filter((note) => note.title.toLowerCase().includes(q) || note.path.toLowerCase().includes(q))
    .slice(0, 12);
  results.innerHTML = matches.map((note) =>
    '<a href="' + note.slug + '.html">' + note.title + '<br><small>' + note.path + '</small></a>'
  ).join("");
}

if (search) search.addEventListener("input", () => render(search.value));`;

const coupledReadScript = `const steps = window.COUPLED_READ_STEPS || [];
const termBase = window.ATLAS_TERM_BASE || "";
const stepRoot = document.getElementById("coupled-steps");
const toggle = document.getElementById("coupled-toggle");
const languageTitle = document.getElementById("language-title");
const languageLine = document.getElementById("language-line");
const languageLink = document.getElementById("language-link");
const formulaLine = document.getElementById("formula-line");
const formulaShade = document.getElementById("formula-shade");
const traceLinks = document.getElementById("trace-links");
const carryLinks = document.getElementById("carry-links");
let current = 0;
let timer = null;
let running = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function relationLinks(items) {
  if (!items || !items.length) return '<span class="muted">No placed links at this scope.</span>';
  return items.map((item) => '<a href="' + termBase + item.slug + '.html">' + item.title + '</a>').join(' · ');
}

function show(index) {
  if (!steps.length) return;
  current = (index + steps.length) % steps.length;
  const step = steps[current];
  languageTitle.textContent = step.title;
  languageLine.textContent = step.language;
  languageLink.href = termBase + step.slug + ".html";
  formulaLine.textContent = step.formula;
  formulaShade.textContent = step.shade;
  traceLinks.innerHTML = relationLinks(step.traces);
  carryLinks.innerHTML = relationLinks(step.carries);
  [...stepRoot.children].forEach((button, buttonIndex) => {
    const active = buttonIndex === current;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "step" : "false");
  });
}

function stop() {
  if (timer) window.clearInterval(timer);
  timer = null;
}

function start() {
  stop();
  if (!running || steps.length < 2) return;
  timer = window.setInterval(() => show(current + 1), 2800);
}

steps.forEach((step, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = '<span>' + (index + 1) + '</span>' + step.title;
  button.addEventListener("click", () => {
    show(index);
    start();
  });
  stepRoot.appendChild(button);
});

if (toggle) toggle.addEventListener("click", () => {
  running = !running;
  toggle.textContent = running ? "Pause" : "Run";
  toggle.setAttribute("aria-pressed", running ? "false" : "true");
  start();
});

if (!running && toggle) {
  toggle.textContent = "Run";
  toggle.setAttribute("aria-pressed", "true");
}

show(0);
start();`;

const graphScript = `const canvas = document.getElementById("atlas-graph");
const entryMode = canvas?.dataset.mode === "entry";
const graph = entryMode && window.ATLAS_ENTRY_GRAPH ? window.ATLAS_ENTRY_GRAPH : window.ATLAS_GRAPH;

if (graph && canvas) {
  const ctx = canvas.getContext("2d");
  const entryLabels = new Set(graph.nodes.map((node) => node.title));
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const nodes = graph.nodes.map((node, index) => ({
    ...node,
    x: node.x ?? 0.5 + Math.cos(index * 2.399) * 0.2,
    y: node.y ?? 0.5 + Math.sin(index * 2.399) * 0.2,
    vx: 0,
    vy: 0,
  }));
  const byTitle = new Map(nodes.map((node) => [node.title, node]));
  const links = graph.links
    .map((link) => ({ source: byTitle.get(link.source), target: byTitle.get(link.target) }))
    .filter((link) => link.source && link.target);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    canvas.height = Math.max(260, Math.floor(rect.height * dpr));
  }

  function tick() {
    if (entryMode) return;

    for (const node of nodes) {
      node.vx += (0.5 - node.x) * 0.0008;
      node.vy += (0.5 - node.y) * 0.0008;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist2 = Math.max(0.0006, dx * dx + dy * dy);
        const force = 0.00012 / dist2;
        a.vx -= dx * force;
        a.vy -= dy * force;
        b.vx += dx * force;
        b.vy += dy * force;
      }
    }

    for (const link of links) {
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const dist = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
      const desired = 0.16;
      const force = (dist - desired) * 0.006;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      link.source.vx += fx;
      link.source.vy += fy;
      link.target.vx -= fx;
      link.target.vy -= fy;
    }

    for (const node of nodes) {
      node.vx *= 0.88;
      node.vy *= 0.88;
      node.x = Math.min(0.95, Math.max(0.05, node.x + node.vx));
      node.y = Math.min(0.9, Math.max(0.1, node.y + node.vy));
    }
  }

  function draw() {
    tick();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = entryMode ? 1.4 * dpr : 1 * dpr;
    ctx.strokeStyle = entryMode ? "rgba(43, 109, 98, 0.24)" : "rgba(43, 109, 98, 0.3)";
    for (const link of links) {
      ctx.beginPath();
      ctx.moveTo(link.source.x * w, link.source.y * h);
      ctx.lineTo(link.target.x * w, link.target.y * h);
      ctx.stroke();
    }

    for (const node of nodes) {
      const x = node.x * w;
      const y = node.y * h;
      const r = (entryMode ? 6.2 : node.root ? 4.8 : 2.8) * dpr + node.weight * 0.22 * dpr;
      ctx.beginPath();
      ctx.fillStyle = node.root ? "rgba(20, 88, 77, 0.94)" : "rgba(55, 91, 82, 0.8)";
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if ((!entryMode && (node.root || node.weight > 5.5)) || (entryMode && entryLabels.has(node.title))) {
        ctx.font = Math.round((entryMode ? 13 : 12) * dpr) + "px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = "rgba(31, 39, 36, 0.82)";
        ctx.fillText(node.title, x + r + 5 * dpr, y + 4 * dpr);
      }
    }
    requestAnimationFrame(draw);
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    let nearest = null;
    let best = Infinity;
    for (const node of nodes) {
      const dx = node.x * canvas.width - x;
      const dy = node.y * canvas.height - y;
      const dist = dx * dx + dy * dy;
      if (dist < best) {
        nearest = node;
        best = dist;
      }
    }
    if (nearest && best < 900 * dpr * dpr) window.location.href = nearest.slug + ".html";
  });

  window.addEventListener("resize", resize);
  resize();
  draw();
}`;

async function main() {
  console.log("Preparing website folder...");
  await rm(outRoot, { recursive: true, force: true });
  await mkdir(outRoot, { recursive: true });

  console.log("Reading Atlas notes...");
  const files = await walk(sourceRoot);
  const draftNotes = [];
  const notes = [];

  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const { frontmatter, body } = splitFrontmatter(raw);
    const titleMatch = body.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, "").split("/").pop();
    const fileTitle = basename(file, ".md");
    const note = {
      file,
      path: relative(sourceRoot, file),
      title,
      fileTitle,
      body,
      links: extractLinks(body),
      slug: "",
      resolvedLinks: [],
      traceTitles: extractSectionLinks(body, "Traces"),
      carryTitles: extractSectionLinks(body, "Carries"),
      traceLinks: [],
      carryLinks: [],
    };

    if (!shouldPublish(frontmatter)) draftNotes.push(note);
    else notes.push(note);
  }

  const usedSlugs = new Map();
  console.log(`Writing ${notes.length} public notes...`);
  for (const note of notes) {
    const base = note.fileTitle === "Theory" || note.title === "Reality Mechanics Theory" ? "theory" : slugify(note.title);
    const count = usedSlugs.get(base) || 0;
    usedSlugs.set(base, count + 1);
    note.slug = count ? `${base}-${count + 1}` : base;
  }

  const noteByTitle = new Map();
  for (const note of notes) {
    if (!noteByTitle.has(note.title)) noteByTitle.set(note.title, note);
    if (!noteByTitle.has(note.fileTitle)) noteByTitle.set(note.fileTitle, note);
  }
  const backlinks = new Map(notes.map((note) => [note.title, []]));

  for (const note of notes) {
    note.resolvedLinks = note.links.map((title) => noteByTitle.get(title)).filter(Boolean);
    note.traceLinks = note.traceTitles.map((title) => noteByTitle.get(title)).filter(Boolean);
    note.carryLinks = note.carryTitles.map((title) => noteByTitle.get(title)).filter(Boolean);
    for (const target of note.resolvedLinks) backlinks.get(target.title).push(note);
  }

  for (const note of notes) {
    const isTheory = note.fileTitle === "Theory" || note.title === "Reality Mechanics Theory";
    const body = isTheory ? note.body.replace(/^#\s+[^\n]+\n+/, "") : note.body;
    const renderedContent = renderMarkdown(body, noteByTitle, note.title);
    const content = isTheory ? absolutizeAtlasLinks(renderedContent) : renderedContent;
    const html = isTheory
      ? theoryTemplate({ content })
      : noteTemplate({
          note,
          content,
          backlinks: backlinks.get(note.title).sort((a, b) => a.title.localeCompare(b.title)),
          notes,
        });
    await writeFile(join(outRoot, `${note.slug}.html`), html);
  }

  const entryNotes = ["Atlas", "Reality Mechanics", "Atlas Practice", "Trace", "Retrace"]
    .map((title) => noteByTitle.get(title))
    .filter(Boolean);
  const traceModeNotes = [
    {
      label: "Term View",
      title: "Atlas",
      description: "Begin with one term and read its local conditions.",
    },
    {
      label: "Order Trace",
      title: "Order Trace",
      description: "Follow relation as it moves through the orders.",
    },
    {
      label: "Practice View",
      title: "Atlas Practice",
      description: "Use notice, trace, retrace, and place to keep the read answerable.",
    },
    {
      label: "Note Standard",
      title: "Atlas Note Standard",
      description: "Use the term conditions to keep each note placed, checked, and retraceable.",
    },
  ]
    .map((item) => ({ ...item, note: noteByTitle.get(item.title) }))
    .filter((item) => item.note);

  await writeFile(join(outRoot, "index.html"), indexTemplate({ notes, entryNotes, traceModeNotes, noteByTitle }));
  await writeFile(join(outRoot, "coupled-read.html"), coupledReadTemplate({ steps: coupledReadStepsFor(noteByTitle) }));
  await writeFile(join(outRoot, "404.html"), notFoundTemplate({ entryNotes }));
  await writeFile(join(outRoot, "styles.css"), styles);
  await writeFile(join(outRoot, "coupled-read.js"), coupledReadScript);
  await writeFile(
    join(outRoot, "search.js"),
    `window.ATLAS_NOTES = ${JSON.stringify(notes.map(({ title, slug, path }) => ({ title, slug, path: displayPath(path) })))};\n${searchScript}`
  );
  await writeFile(
    join(outRoot, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${site.canonical}/sitemap.xml\n`
  );
  await writeFile(
    join(outRoot, "_headers"),
    `/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`
  );
  await writeFile(
    join(outRoot, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
      "index.html",
      "coupled-read.html",
      ...notes.map((note) => `${note.slug}.html`),
    ]
      .map((page) => `  <url><loc>${site.canonical}/${page}</loc></url>`)
      .join("\n")}\n</urlset>\n`
  );

  // Regenerate the machine-readable AI export into the same atlas output, so a
  // single deploy ships both the site and a current /ai/ dataset. A failed
  // export (validation error) throws and fails the whole build.
  console.log("Generating AI export...");
  execFileSync(process.execPath, [join(here, "build-atlas-ai-index.mjs")], { stdio: "inherit", env: process.env });

  const theoryNote = noteByTitle.get("Theory") || noteByTitle.get("Reality Mechanics Theory");
  if (!theoryNote) throw new Error("Theory note is required for the Postulate build.");
  const theoryBody = theoryNote.body.replace(/^#\s+[^\n]+\n+/, "");
  const theoryContent = absolutizeAtlasLinks(renderMarkdown(theoryBody, noteByTitle, theoryNote.title));
  const theorySteps = coupledReadStepsFor(noteByTitle);

  console.log("Preparing Postulate website folder...");
  await rm(theoryOutRoot, { recursive: true, force: true });
  await mkdir(theoryOutRoot, { recursive: true });
  await writeFile(join(theoryOutRoot, "index.html"), theoryTemplate({ content: theoryContent }));
  await writeFile(join(theoryOutRoot, "coupled-read.html"), coupledReadTemplate({ steps: theorySteps }));
  await writeFile(join(theoryOutRoot, "coupled-read.js"), coupledReadScript);
  await writeFile(join(theoryOutRoot, "styles.css"), styles);
  await writeFile(join(theoryOutRoot, "404.html"), theoryNotFoundTemplate());
  await writeFile(join(theoryOutRoot, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.theory}/sitemap.xml\n`);
  await writeFile(
    join(theoryOutRoot, "_headers"),
    `/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`
  );
  await writeFile(
    join(theoryOutRoot, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site.theory}/</loc></url>\n  <url><loc>${site.theory}/coupled-read.html</loc></url>\n</urlset>\n`
  );

  if (shouldZip) {
    console.log("Creating upload package...");
    try {
      await rm(zipPath, { force: true });
      execFileSync("zip", ["-qr", zipPath, "."], { cwd: outRoot });
    } catch {
      const stream = createWriteStream(zipPath);
      stream.end();
    }

    console.log("Creating Postulate upload package...");
    try {
      await rm(theoryZipPath, { force: true });
      execFileSync("zip", ["-qr", theoryZipPath, "."], { cwd: theoryOutRoot });
    } catch {
      const stream = createWriteStream(theoryZipPath);
      stream.end();
    }
  }

  console.log(`Published notes: ${notes.length}`);
  console.log(`Skipped notes: ${draftNotes.length}`);
  console.log(`Output: ${outRoot}`);
  if (shouldZip) console.log(`Zip: ${zipPath}`);
  console.log(`Postulate output: ${theoryOutRoot}`);
  if (shouldZip) console.log(`Postulate zip: ${theoryZipPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
