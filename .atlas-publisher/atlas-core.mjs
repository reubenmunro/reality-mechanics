// Generic rendering helpers only. Canonical Atlas parsing and structural
// validation belong exclusively to translate-atlas.rb.

export const slugify = (value) =>
  String(value || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "entry";

export const plainText = (markdown) =>
  String(markdown || "")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_match, target, label) => label || target)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const entryMarkdown = (entry) => {
  const chunks = [`# ${entry.title}`];
  if (entry.content?.lead) chunks.push(entry.content.lead);
  for (const section of entry.content?.sections || []) {
    const heading = `${"#".repeat(section.depth)} ${section.heading}`;
    chunks.push(section.markdown ? `${heading}\n\n${section.markdown}` : heading);
  }
  return `${chunks.join("\n\n")}\n`;
};

export const orderIndex = (order, orderValues) => {
  const index = orderValues.indexOf(order);
  return index < 0 ? null : index;
};

export const relationTargets = (entry, relation, relationKeys) => {
  if (!relationKeys.includes(relation)) return [];
  const targets = entry?.conditions?.[relation]?.targets;
  return Array.isArray(targets) ? targets : [];
};
