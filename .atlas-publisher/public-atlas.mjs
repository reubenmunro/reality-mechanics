import {
  CANONICAL_ENTRY_COUNT,
  CANONICAL_ENTRY_INDEX,
  CANONICAL_SOURCE_HASH,
  RELATION_KEYS,
} from "./generated/canonical-participation.mjs";
import {
  RELEASE_IDENTIFIER,
  TRANSLATION_HASH,
} from "./generated/release-identity.mjs";

const GITHUB_COMMIT_URL = "https://github.com/reubenmunro/reality-mechanics";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function navigation(current = "") {
  const links = [
    ["home", "/", "Home"],
    ["atlas", "/atlas", "Atlas"],
    ["field", "/field", "Observatory"],
    ["pulse", "https://calibration.realitymechanics.nz/", "Pulse"],
    ["theory", "/theory", "Theory"],
    ["proof", "/proof", "Proof"],
    ["calculus", "/calculus", "Calculus"],
  ];
  return links.map(([id, href, label]) => (
    `<a href="${href}"${id === current ? ' aria-current="page"' : ""}>${label}</a>`
  )).join("");
}

const BASE_CSS = `
  :root { --void:#06080d; --warm:#d4c5a9; --warm-dim:rgba(212,197,169,.72); --ember:#c8601a; --cool:#4d5e72; --lead:#4d8ea6; }
  * { box-sizing:border-box; }
  html { color-scheme:dark; }
  body { margin:0; min-height:100vh; background:radial-gradient(ellipse 110% 72% at 50% -8%, #111925 0, #06080d 54%, #040509 100%); color:var(--warm-dim); font:17px/1.68 "Iowan Old Style", Charter, Georgia, serif; }
  header { position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; gap:22px; padding:20px 28px; background:rgba(6,8,13,.9); border-bottom:1px solid rgba(77,94,114,.18); backdrop-filter:blur(14px); }
  .brand { color:rgba(200,96,26,.68); font:500 11px/1 system-ui,sans-serif; letter-spacing:.16em; text-transform:uppercase; text-decoration:none; }
  nav { display:flex; gap:17px; align-items:center; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
  nav::-webkit-scrollbar { display:none; }
  nav a { color:rgba(128,147,168,.78); text-decoration:none; border:0; white-space:nowrap; font:500 10px/1 system-ui,sans-serif; letter-spacing:.11em; text-transform:uppercase; }
  nav a:hover, nav a[aria-current="page"] { color:rgba(200,96,26,.9); }
  a { color:var(--lead); text-decoration:none; border-bottom:1px solid rgba(77,142,166,.22); }
  a:hover { color:rgba(200,96,26,.9); border-bottom-color:rgba(200,96,26,.35); }
  a:focus-visible, button:focus-visible, input:focus-visible { outline:2px solid rgba(200,96,26,.86); outline-offset:3px; border-radius:2px; }
  .skip-link { position:absolute; left:-999px; top:0; z-index:20; padding:10px 16px; background:#0b1018; color:var(--warm); font:500 12px/1 system-ui,sans-serif; }
  .skip-link:focus { left:12px; top:12px; }
  code { color:rgba(192,205,220,.86); font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
  .identity { overflow-wrap:anywhere; color:rgba(128,147,168,.74); font:12px/1.7 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
  @media (max-width:760px) {
    header { align-items:flex-start; flex-direction:column; gap:12px; padding:16px 18px; }
    nav { width:100%; padding-bottom:3px; }
  }
`;

export function landingPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>Reality Mechanics</title>
  <meta name="description" content="Reality Mechanics — a dependency-ordered Atlas and instruments for reading its structure."/>
  <style>
    ${BASE_CSS}
    main { width:min(920px,calc(100vw - 48px)); margin:0 auto; padding:clamp(72px,12vh,132px) 0 96px; }
    .eyebrow { margin:0 0 18px; color:rgba(200,96,26,.68); font:500 11px/1 system-ui,sans-serif; letter-spacing:.18em; text-transform:uppercase; }
    h1 { margin:0; color:var(--warm); font:500 clamp(52px,9vw,92px)/.98 "Iowan Old Style",Charter,Georgia,serif; letter-spacing:-.025em; }
    .lede { max-width:680px; margin:28px 0 58px; color:var(--warm-dim); font-size:clamp(21px,3vw,28px); line-height:1.5; }
    .entrances { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; }
    .entrance { min-height:210px; padding:30px; border:1px solid rgba(77,94,114,.32); background:rgba(11,16,24,.42); border-radius:5px; transition:border-color .2s,transform .2s; }
    .entrance:hover { transform:translateY(-2px); border-color:rgba(200,96,26,.48); }
    .entrance h2 { margin:0 0 12px; color:var(--warm); font:500 28px/1.2 "Iowan Old Style",Charter,Georgia,serif; }
    .entrance p { margin:0; color:rgba(212,197,169,.68); }
    .entrance .enter { display:inline-block; margin-top:30px; color:rgba(200,96,26,.9); font:500 11px/1 system-ui,sans-serif; letter-spacing:.12em; text-transform:uppercase; }
    .support { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:20px; margin-top:58px; padding-top:30px; border-top:1px solid rgba(77,94,114,.22); }
    .support a { color:rgba(128,147,168,.88); border:0; font:500 11px/1.4 system-ui,sans-serif; letter-spacing:.1em; text-transform:uppercase; }
    .support span { display:block; margin-top:8px; color:rgba(128,147,168,.6); font:14px/1.5 "Iowan Old Style",Charter,Georgia,serif; letter-spacing:0; text-transform:none; }
    footer { margin-top:70px; color:rgba(128,147,168,.62); font-size:13px; }
    @media (max-width:700px) {
      main { width:calc(100vw - 36px); padding-top:62px; }
      .entrances { grid-template-columns:1fr; }
      .support { grid-template-columns:repeat(2,minmax(0,1fr)); }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header><a class="brand" href="/">Reality Mechanics</a><nav>${navigation("home")}</nav></header>
  <main id="main">
    <p class="eyebrow">Reality Mechanics</p>
    <h1>Two ways into one structure.</h1>
    <p class="lede">A dependency-ordered Atlas and a set of instruments for reading its structure.</p>
    <section class="entrances" aria-label="Primary ways into Reality Mechanics">
      <a class="entrance" href="/atlas">
        <h2>Read the Atlas</h2>
        <p>Move through the terms and their declared relations. Each entry remains retraceable to the same canonical translation.</p>
        <span class="enter">Enter the Atlas</span>
      </a>
      <a class="entrance" href="/field">
        <h2>Enter the Observatory</h2>
        <p>Observe the declared structure as a field. The instrument reads the Atlas without determining it.</p>
        <span class="enter">Observe the field</span>
      </a>
    </section>
    <section class="support" aria-label="Supporting surfaces">
      <a href="/theory">Theory<span>The working claim.</span></a>
      <a href="/proof">Proof<span>Evidence and retrace.</span></a>
      <a href="https://calibration.realitymechanics.nz/">Pulse<span>Behaviour through time.</span></a>
      <a href="/calculus">Calculus<span>What has and has not been derived.</span></a>
    </section>
    <footer>
      Canonical release <code>${escapeHtml(RELEASE_IDENTIFIER)}</code> · <a href="/provenance">Provenance</a>
    </footer>
  </main>
</body>
</html>`;
}

export function provenancePage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>Provenance · Reality Mechanics</title>
  <meta name="description" content="Canonical release and publication provenance for Reality Mechanics."/>
  <style>
    ${BASE_CSS}
    main { width:min(720px,calc(100vw - 48px)); margin:0 auto; padding:92px 0 110px; }
    h1 { margin:0 0 20px; color:var(--warm); font:500 clamp(42px,7vw,64px)/1.05 "Iowan Old Style",Charter,Georgia,serif; }
    .lede { max-width:620px; margin:0 0 48px; font-size:20px; }
    h2 { margin:46px 0 14px; color:rgba(212,197,169,.9); font:500 22px/1.3 "Iowan Old Style",Charter,Georgia,serif; }
    dl { display:grid; grid-template-columns:150px 1fr; gap:12px 20px; padding:24px; border:1px solid rgba(77,94,114,.28); background:rgba(11,16,24,.38); }
    dt { color:rgba(128,147,168,.72); font:500 10px/1.5 system-ui,sans-serif; letter-spacing:.11em; text-transform:uppercase; }
    dd { margin:0; overflow-wrap:anywhere; color:rgba(212,197,169,.78); }
    .path { padding-left:20px; }
    .path li { margin:10px 0; }
    details { margin-top:48px; padding-top:24px; border-top:1px solid rgba(77,94,114,.24); }
    summary { cursor:pointer; color:rgba(128,147,168,.82); font:500 11px/1.5 system-ui,sans-serif; letter-spacing:.1em; text-transform:uppercase; }
    @media (max-width:600px) { main { width:calc(100vw - 36px); padding-top:64px; } dl { grid-template-columns:1fr; } dd { margin-bottom:10px; } }
  </style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header><a class="brand" href="/">Reality Mechanics</a><nav>${navigation("")}</nav></header>
  <main id="main">
    <h1>Provenance</h1>
    <p class="lede">The public Atlas and Observatory are generated participation in one canonical, versioned Atlas. They do not maintain independent structural copies.</p>
    <dl>
      <dt>Entries</dt><dd>${CANONICAL_ENTRY_COUNT}</dd>
      <dt>Source identity</dt><dd><code>${escapeHtml(CANONICAL_SOURCE_HASH)}</code></dd>
      <dt>Translation identity</dt><dd><code>${escapeHtml(TRANSLATION_HASH)}</code></dd>
      <dt>Release</dt><dd><code>${escapeHtml(RELEASE_IDENTIFIER)}</code></dd>
      <dt>Graph identity</dt><dd id="graph-identity">Loading from the canonical manifest…</dd>
    </dl>
    <h2>Publication path</h2>
    <ol class="path">
      <li>The versioned Markdown Atlas is validated.</li>
      <li>One canonical graph and translation are generated.</li>
      <li>The public Atlas, Observatory, and MCP consume that translation.</li>
      <li>Every Atlas-bearing response carries the same release identity.</li>
    </ol>
    <p>The <a href="/atlas">public Atlas</a> is the ordinary reading surface. This page preserves the technical retrace without requiring repository navigation.</p>
    <details>
      <summary>Maintained record</summary>
      <p>The repository records file-level revision history and exact release custody. <a href="${GITHUB_COMMIT_URL}">Inspect the maintained record on GitHub</a>.</p>
    </details>
  </main>
  <script>
    fetch("/manifest.json").then(function(response) {
      if (!response.ok) throw new Error("manifest unavailable");
      return response.json();
    }).then(function(manifest) {
      document.getElementById("graph-identity").innerHTML = "<code>" + String(manifest.canonicalGraphHash || "").replace(/[&<>"]/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }) + "</code>";
    }).catch(function() {
      document.getElementById("graph-identity").textContent = "Canonical manifest unavailable.";
    });
  </script>
</body>
</html>`;
}

export function atlasEntryPath(id) {
  return `/atlas/${encodeURIComponent(String(id || ""))}`;
}

export function atlasPage(initialId = "") {
  const safeInitialId = CANONICAL_ENTRY_INDEX[initialId] ? initialId : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>Atlas · Reality Mechanics</title>
  <meta name="description" content="Read and traverse the canonical Reality Mechanics Atlas."/>
  <style>
    ${BASE_CSS}
    body { overflow-x:hidden; }
    .atlas-layout { display:grid; grid-template-columns:minmax(230px,280px) minmax(0,720px) minmax(300px,430px); min-height:calc(100vh - 61px); }
    .index { position:sticky; top:61px; align-self:start; height:calc(100vh - 61px); padding:24px 18px; border-right:1px solid rgba(77,94,114,.22); background:rgba(5,8,13,.48); overflow:auto; }
    .index label { display:block; margin-bottom:10px; color:rgba(128,147,168,.72); font:500 10px/1 system-ui,sans-serif; letter-spacing:.12em; text-transform:uppercase; }
    .index input { width:100%; padding:11px 12px; border:1px solid rgba(77,94,114,.36); border-radius:3px; background:rgba(11,16,24,.7); color:var(--warm); font:15px/1.2 system-ui,sans-serif; }
    .index-count { margin:12px 2px; color:rgba(128,147,168,.6); font:11px/1.4 system-ui,sans-serif; }
    .entry-list { margin:0; padding:0; list-style:none; }
    .entry-list button { width:100%; padding:9px 8px; border:0; border-left:2px solid transparent; background:none; color:rgba(167,181,198,.72); text-align:left; cursor:pointer; font:14px/1.3 system-ui,sans-serif; }
    .entry-list button:hover, .entry-list button[aria-current="true"] { color:var(--warm); border-left-color:rgba(200,96,26,.72); background:rgba(77,94,114,.1); }
    article { padding:64px clamp(28px,5vw,72px) 110px; min-width:0; }
    article h1 { margin:0 0 8px; color:var(--warm); font:500 clamp(42px,6vw,66px)/1.04 "Iowan Old Style",Charter,Georgia,serif; letter-spacing:-.015em; }
    .entry-meta { margin-bottom:34px; color:rgba(128,147,168,.68); font:500 10px/1.6 system-ui,sans-serif; letter-spacing:.09em; text-transform:uppercase; }
    .entry-content { color:rgba(212,197,169,.76); }
    .entry-content .lead { margin-bottom:46px; color:rgba(212,197,169,.82); font-size:20px; line-height:1.65; }
    .entry-content h2 { margin:46px 0 14px; color:rgba(212,197,169,.9); font:500 21px/1.3 "Iowan Old Style",Charter,Georgia,serif; }
    .entry-content p { margin:0 0 18px; }
    .entry-content ul { padding-left:22px; }
    .entry-content li { margin:8px 0; }
    .entry-content pre { padding:16px; overflow:auto; border:1px solid rgba(77,94,114,.25); background:rgba(5,8,13,.6); }
    .empty-entry { margin-top:12vh; }
    .empty-entry h1 { max-width:620px; }
    .empty-entry p { max-width:540px; font-size:19px; }
    .graph-panel { position:sticky; top:61px; align-self:start; height:calc(100vh - 61px); padding:24px 20px; border-left:1px solid rgba(77,94,114,.22); background:rgba(5,8,13,.38); overflow:auto; }
    .graph-panel h2 { margin:0 0 6px; color:rgba(212,197,169,.86); font:500 20px/1.3 "Iowan Old Style",Charter,Georgia,serif; }
    .graph-note { margin:0 0 18px; color:rgba(128,147,168,.64); font-size:13px; }
    .filters { display:flex; flex-wrap:wrap; gap:7px 12px; margin-bottom:14px; }
    .filters label { color:rgba(128,147,168,.72); font:500 10px/1 system-ui,sans-serif; letter-spacing:.07em; text-transform:uppercase; }
    .filters input { accent-color:var(--ember); }
    .graph-wrap { position:relative; width:100%; aspect-ratio:420/380; min-height:320px; border:1px solid rgba(77,94,114,.2); background:radial-gradient(circle at center,rgba(17,25,37,.78),rgba(5,8,13,.24)); }
    #local-graph, #graph-nodes { position:absolute; inset:0; width:100%; height:100%; }
    .graph-node { position:absolute; z-index:2; width:84px; padding:13px 2px 0; transform:translate(-50%,-50%); border:0; background:transparent; color:rgba(212,197,169,.78); cursor:pointer; text-align:center; font:10px/1.2 system-ui,sans-serif; }
    .graph-node::before { content:""; position:absolute; top:3px; left:50%; width:9px; height:9px; transform:translateX(-50%); border-radius:50%; background:#4d8ea6; }
    .graph-node:hover, .graph-node:focus-visible { color:var(--warm); }
    .relation-groups { margin-top:20px; }
    .relation-group { margin:0 0 18px; }
    .relation-group h3 { margin:0 0 7px; color:rgba(200,96,26,.72); font:500 10px/1 system-ui,sans-serif; letter-spacing:.11em; text-transform:uppercase; }
    .relation-group ul { margin:0; padding:0; list-style:none; }
    .relation-group li { margin:5px 0; font-size:14px; }
    .loading { color:rgba(128,147,168,.7); }
    @media (max-width:1100px) {
      .atlas-layout { grid-template-columns:240px minmax(0,1fr); }
      .graph-panel { position:relative; top:auto; height:auto; grid-column:2; border-left:0; border-top:1px solid rgba(77,94,114,.22); }
    }
    @media (max-width:720px) {
      .atlas-layout { display:block; }
      .index { position:relative; top:auto; height:auto; max-height:44vh; border-right:0; border-bottom:1px solid rgba(77,94,114,.22); }
      article { padding:48px 20px 72px; }
      .graph-panel { padding:28px 18px 60px; }
    }
  </style>
</head>
<body data-initial-entry="${escapeHtml(safeInitialId)}">
  <a class="skip-link" href="#entry">Skip to entry</a>
  <header><a class="brand" href="/">Reality Mechanics</a><nav>${navigation("atlas")}</nav></header>
  <main class="atlas-layout">
    <aside class="index" aria-label="Atlas index">
      <label for="atlas-search">Find an entry</label>
      <input id="atlas-search" type="search" autocomplete="off" placeholder="Carry, relation, trace…"/>
      <div class="index-count" id="index-count">Loading canonical index…</div>
      <ul class="entry-list" id="entry-list"></ul>
    </aside>
    <article id="entry" tabindex="-1">
      <div class="empty-entry"><h1>Atlas</h1><p>Choose an entry to read its canonical text and traverse its declared relations.</p></div>
    </article>
    <aside class="graph-panel" aria-label="Bounded relation graph">
      <h2>Local graph</h2>
      <p class="graph-note">One declared relation-hop from the selected entry.</p>
      <div class="filters" id="relation-filters"></div>
      <div class="graph-wrap">
        <svg id="local-graph" viewBox="0 0 420 380" role="img" aria-label="No entry selected"></svg>
        <div id="graph-nodes" aria-label="Local graph entries"></div>
      </div>
      <div class="relation-groups" id="relation-groups"></div>
    </aside>
  </main>
  <script>
  (function() {
    "use strict";
    var relationKeys = ${JSON.stringify(RELATION_KEYS)};
    var relationColours = { needs:"#8f7a67", holds:"#c8601a", pairs:"#8e6da8", traces:"#4d8ea6", nests:"#718b6a", reads:"#9c8b55", carries:"#b24d43" };
    var entries = [];
    var byId = new Map();
    var byTitle = new Map();
    var bySlug = new Map();
    var selected = "";
    var search = document.getElementById("atlas-search");
    var list = document.getElementById("entry-list");
    var count = document.getElementById("index-count");
    var article = document.getElementById("entry");
    var graph = document.getElementById("local-graph");
    var graphNodes = document.getElementById("graph-nodes");
    var groups = document.getElementById("relation-groups");
    var filters = document.getElementById("relation-filters");

    function esc(value) {
      return String(value == null ? "" : value).replace(/[&<>"]/g, function(c) {
        return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];
      });
    }

    function entryIdForTitle(title) {
      var normalizedTitle = String(title || "").trim().toLowerCase();
      if (byTitle.has(normalizedTitle)) return byTitle.get(normalizedTitle);
      var slug = normalizedTitle
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return bySlug.get(slug) || "";
    }

    function inlineMarkdown(value) {
      var source = String(value || "");
      var tokens = [];
      source = source.replace(/\\[\\[([^\\]|#]+)(?:#[^\\]|]+)?(?:\\|([^\\]]+))?\\]\\]/g, function(_match, target, label) {
        var id = entryIdForTitle(target);
        var text = esc(label || target);
        var html = id ? '<a href="' + ${JSON.stringify("/atlas/")} + encodeURIComponent(id) + '" data-entry-id="' + esc(id) + '">' + text + '</a>' : text;
        tokens.push(html);
        return "\\u0000" + (tokens.length - 1) + "\\u0000";
      });
      var html = esc(source)
        .replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>")
        .replace(/\\x60([^\\x60]+)\\x60/g, "<code>$1</code>");
      return html.replace(/\\u0000(\\d+)\\u0000/g, function(_match, index) { return tokens[Number(index)] || ""; });
    }

    function markdown(value) {
      return String(value || "").split(/\\n{2,}/).filter(Boolean).map(function(block) {
        if (/^\\x60{3}/.test(block) && /\\x60{3}$/.test(block)) {
          return "<pre><code>" + esc(block.replace(/^\\x60{3}[^\\n]*\\n?/, "").replace(/\\n?\\x60{3}$/, "")) + "</code></pre>";
        }
        var lines = block.split("\\n");
        if (lines.every(function(line) { return /^-\\s+/.test(line); })) {
          return "<ul>" + lines.map(function(line) { return "<li>" + inlineMarkdown(line.replace(/^-\\s+/, "")) + "</li>"; }).join("") + "</ul>";
        }
        return "<p>" + inlineMarkdown(block).replaceAll("\\n", "<br/>") + "</p>";
      }).join("");
    }

    function enabledRelations() {
      return new Set(Array.from(filters.querySelectorAll("input:checked")).map(function(input) { return input.value; }));
    }

    function renderFilters() {
      filters.innerHTML = relationKeys.map(function(key) {
        return '<label><input type="checkbox" value="' + esc(key) + '" checked/> ' + esc(key) + "</label>";
      }).join("");
      filters.addEventListener("change", function() {
        var current = byId.get(selected);
        if (current) renderRelations(current);
      });
    }

    function filteredEntries() {
      var query = search.value.trim().toLowerCase();
      if (!query) return entries;
      return entries.filter(function(entry) {
        return entry.title.toLowerCase().includes(query) || entry.id.toLowerCase().includes(query);
      });
    }

    function renderIndex() {
      var matches = filteredEntries();
      count.textContent = matches.length + " of " + entries.length + " entries";
      list.innerHTML = matches.slice(0, 100).map(function(entry) {
        return '<li><button type="button" data-entry-id="' + esc(entry.id) + '"' + (entry.id === selected ? ' aria-current="true"' : "") + ">" + esc(entry.title) + "</button></li>";
      }).join("");
    }

    function relationTargets(entry) {
      var enabled = enabledRelations();
      var result = [];
      relationKeys.forEach(function(key) {
        if (!enabled.has(key)) return;
        var relation = entry.conditions && entry.conditions[key];
        var targets = relation && Array.isArray(relation.targets) ? relation.targets : [];
        targets.forEach(function(id) { if (byId.has(id)) result.push({ key:key, id:id }); });
      });
      return result;
    }

    function renderGraph(entry, edges) {
      var uniqueIds = Array.from(new Set(edges.map(function(edge) { return edge.id; })));
      var cx = 210, cy = 190, rx = 150, ry = 132;
      var positions = new Map();
      uniqueIds.forEach(function(id, index) {
        var angle = uniqueIds.length === 1 ? -Math.PI / 2 : (Math.PI * 2 * index / uniqueIds.length) - Math.PI / 2;
        positions.set(id, { x:cx + Math.cos(angle) * rx, y:cy + Math.sin(angle) * ry });
      });
      var edgeSvg = edges.map(function(edge) {
        var point = positions.get(edge.id);
        return '<line x1="' + cx + '" y1="' + cy + '" x2="' + point.x.toFixed(1) + '" y2="' + point.y.toFixed(1) + '" stroke="' + relationColours[edge.key] + '" stroke-opacity=".55" stroke-width="1.2"><title>' + esc(edge.key) + "</title></line>";
      }).join("");
      graphNodes.innerHTML = uniqueIds.map(function(id) {
        var point = positions.get(id);
        var target = byId.get(id);
        var label = target ? target.title : id;
        return '<button class="graph-node" type="button" data-entry-id="' + esc(id) + '" style="left:' + (point.x / 420 * 100).toFixed(2) + "%;top:" + (point.y / 380 * 100).toFixed(2) + '%" title="' + esc(label) + '">' + esc(label.length > 24 ? label.slice(0,22) + "…" : label) + "</button>";
      }).join("");
      graph.innerHTML = edgeSvg + '<g transform="translate(' + cx + " " + cy + ')"><circle r="11" fill="#c8601a"/><text y="28" text-anchor="middle" fill="#d4c5a9" font-size="12" font-family="system-ui,sans-serif">' + esc(entry.title) + "</text></g>";
      graph.setAttribute("aria-label", entry.title + " and " + uniqueIds.length + " directly declared neighbours");
    }

    function renderRelations(entry) {
      var enabled = enabledRelations();
      var edges = relationTargets(entry);
      renderGraph(entry, edges);
      groups.innerHTML = relationKeys.filter(function(key) {
        return enabled.has(key);
      }).map(function(key) {
        var relation = entry.conditions && entry.conditions[key];
        var targets = relation && Array.isArray(relation.targets) ? relation.targets : [];
        if (!targets.length && !(relation && relation.read)) return "";
        var links = targets.map(function(id) {
          var target = byId.get(id);
          return '<li><a href="/atlas/' + encodeURIComponent(id) + '" data-entry-id="' + esc(id) + '">' + esc(target ? target.title : id) + "</a></li>";
        }).join("");
        var read = relation && relation.read ? '<p>' + inlineMarkdown(relation.read) + "</p>" : "";
        return '<section class="relation-group"><h3>' + esc(key) + "</h3>" + (links ? "<ul>" + links + "</ul>" : "") + read + "</section>";
      }).join("");
    }

    function renderEntry(entry) {
      var sections = (entry.content.sections || []).map(function(section) {
        return "<section><h2>" + esc(section.heading) + "</h2>" + markdown(section.markdown) + "</section>";
      }).join("");
      article.innerHTML = "<h1>" + esc(entry.title) + '</h1><div class="entry-meta">' + esc(entry.id) + " · " + esc(entry.order || entry.register || "") + " · " + esc(entry.kind) + " · " + esc(entry.status) + '</div><div class="entry-content"><div class="lead">' + markdown(entry.content.lead) + "</div>" + sections + '</div><p class="identity">Determination: <code>' + esc(entry.determination) + "</code><br/>Canonical source: <code>${escapeHtml(CANONICAL_SOURCE_HASH)}</code></p>";
      renderRelations(entry);
    }

    async function selectEntry(id, push) {
      if (!byId.has(id)) return;
      selected = id;
      renderIndex();
      article.innerHTML = '<p class="loading">Loading canonical entry…</p>';
      var response = await fetch("/ai/current/entries/" + encodeURIComponent(id) + ".json");
      if (!response.ok) {
        article.innerHTML = "<h1>Entry unavailable</h1><p>The canonical entry could not be retrieved.</p>";
        return;
      }
      var entry = await response.json();
      renderEntry(entry);
      document.title = entry.title + " · Atlas · Reality Mechanics";
      if (push) history.pushState({entryId:id}, "", "/atlas/" + encodeURIComponent(id));
      article.focus({preventScroll:true});
    }

    function activate(event) {
      var target = event.target.closest("[data-entry-id]");
      if (!target) return;
      event.preventDefault();
      selectEntry(target.getAttribute("data-entry-id"), true);
    }

    list.addEventListener("click", activate);
    article.addEventListener("click", activate);
    groups.addEventListener("click", activate);
    graphNodes.addEventListener("click", activate);
    search.addEventListener("input", renderIndex);
    window.addEventListener("popstate", function() {
      var id = decodeURIComponent(location.pathname.replace(/^\\/atlas\\/?/, ""));
      if (id && byId.has(id)) selectEntry(id, false);
    });

    renderFilters();
    fetch("/participation/search-index.json").then(function(response) {
      if (!response.ok) throw new Error("index unavailable");
      return response.json();
    }).then(function(index) {
      entries = index.entries || [];
      entries.forEach(function(entry) {
        byId.set(entry.id, entry);
        byTitle.set(entry.title.toLowerCase(), entry.id);
        var slug = entry.id.slice(entry.id.indexOf(".") + 1);
        if (!bySlug.has(slug)) bySlug.set(slug, entry.id);
        else if (bySlug.get(slug) !== entry.id) bySlug.set(slug, "");
      });
      renderIndex();
      var initial = document.body.getAttribute("data-initial-entry");
      if (initial && byId.has(initial)) return selectEntry(initial, false);
      search.focus();
    }).catch(function() {
      count.textContent = "Canonical index unavailable.";
      article.innerHTML = "<h1>Atlas unavailable</h1><p>The current canonical translation could not be retrieved.</p>";
    });
  }());
  </script>
</body>
</html>`;
}
