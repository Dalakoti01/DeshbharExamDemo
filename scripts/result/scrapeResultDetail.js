import axios from "axios";
import { load } from "cheerio";

export async function scrapeResultDetail(url) {
  console.log("🔍 Scraping result detail:", url);

  const { data: html } = await axios.get(url);
  const $ = load(html);

  const title =
    $("h1").first().text().trim() || $("h2").first().text().trim() || null;

  const rawContent = [];

  $(".entry-content")
    .children()
    .each((_, el) => {
      const tag = el.tagName?.toLowerCase() || null;
      const text = $(el).text().trim();
      const links = [];

      $(el)
        .find("a")
        .each((_, a) => {
          const href = $(a).attr("href");
          const label = $(a).text().trim();
          if (href) links.push({ label, href });
        });

      if (text || links.length) {
        rawContent.push({ tag, text, links });
      }
    });

  return {
    url,
    title,
    rawContent,
    scrapedAt: new Date(),
  };
}
