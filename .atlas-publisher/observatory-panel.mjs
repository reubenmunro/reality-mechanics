const GITHUB_REPO_URL = "https://github.com/reubenmunro/reality-mechanics";
const GITHUB_BRANCH = "main";

export function encodeGithubPath(sourcePath) {
  return String(sourcePath || "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function atlasSourceViewUrl(sourcePath) {
  if (!sourcePath) return null;
  return `${GITHUB_REPO_URL}/blob/${GITHUB_BRANCH}/${encodeGithubPath(sourcePath)}`;
}

export function openingParagraphsBeforeTemplate(body = "") {
  const preTemplate = String(body).split(/^##\s+/m)[0] || "";
  const paragraphs = [];
  let current = [];

  for (const rawLine of preTemplate.split("\n")) {
    const line = rawLine.trim();
    if (/^#\s+/.test(line)) continue;
    if (!line) {
      if (current.length) {
        paragraphs.push(current.join(" ").replace(/\s+/g, " ").trim());
        current = [];
      }
      continue;
    }
    current.push(line);
  }

  if (current.length) {
    paragraphs.push(current.join(" ").replace(/\s+/g, " ").trim());
  }

  return paragraphs.filter(Boolean);
}

export function isHoldParagraph(text = "") {
  return /\bis held by\b/i.test(String(text));
}

export function stripDuplicatedTitle(title = "", sentence = "") {
  let place = String(sentence || "").trim();
  const term = String(title || "").trim();
  if (!place || !term) return place;

  const lowerTerm = term.toLowerCase();
  let stripped = true;
  while (stripped) {
    stripped = false;
    const lowerPlace = place.toLowerCase();
    if (!lowerPlace.startsWith(lowerTerm)) break;
    const next = place.slice(term.length).replace(/^[\s:—–-]+/, "").trim();
    if (!next || next === place) break;
    place = next;
    stripped = true;
  }

  return place;
}

export function observatoryPlaceDisplay({ title = "", body = "" } = {}) {
  const [firstParagraph = ""] = openingParagraphsBeforeTemplate(body);
  if (!firstParagraph) return "";
  if (isHoldParagraph(firstParagraph)) return "";
  return stripDuplicatedTitle(title, firstParagraph);
}
