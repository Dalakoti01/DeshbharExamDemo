export function flattenRawContent(rawContent) {
  if (!Array.isArray(rawContent)) return "";

  return rawContent
    .map(block => {
      let section = "";

      if (block.tag) {
        section += `[${block.tag.toUpperCase()}]\n`;
      }

      if (block.text) {
        section += block.text.trim();
      }

      if (Array.isArray(block.links) && block.links.length) {
        const linksText = block.links
          .map(l => `${l.label}: ${l.href}`)
          .join("\n");
        section += `\nLinks:\n${linksText}`;
      }

      return section.trim();
    })
    .filter(Boolean)
    .join("\n\n");
}
