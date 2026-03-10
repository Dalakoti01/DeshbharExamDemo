import axios from "axios";
import { load } from "cheerio";
import { connectDB } from "../../src/lib/db.js";
import { runGeminiResultAgent } from "../../ai/geminiResultAgent.js";

// Mongo models
import ScrapedResultMeta from "@/models/result/ScrapedResultMeta.js";
import ScrapeResultDetail from "@/models/result/ScrapeResultDetail.js";
import { scrapeResultDetail } from "./scrapeResultDetail.js";

const SITE_URL = "https://www.rojgarresult.com/";

export async function scrapeRojgarResults() {
  console.log("🔍 Scraping RESULT listing...");

  /* ------------------ DB CONNECT ------------------ */
  await connectDB();
  console.log("✅ MongoDB connected successfully.");

  /* ------------------ 1. Fetch listing ------------------ */
  const { data: html } = await axios.get(SITE_URL);
  const $ = load(html);

  const results = [];

  /* ------------------ RESULT SELECTOR ------------------ */
  $(".result-box .job-link a").each((_, el) => {
    const title = $(el).text().trim();
    const url = $(el).attr("href");

    if (title && url) {
      results.push({
        title,
        url,
      });
    }
  });

  console.log(`📄 Found ${results.length} results`);

  /* ------------------ 2. Load existing URLs ------------------ */
  const existingResults = await ScrapedResultMeta.find(
    { source: "rojgarresult" },
    { url: 1 }
  ).lean();

  const existingUrlSet = new Set(existingResults.map(r => r.url));

  /* ------------------ 3. Detect new results ------------------ */
  const newResults = results.filter(r => !existingUrlSet.has(r.url));

  console.log(
    newResults.length
      ? `🆕 ${newResults.length} new results found`
      : "✅ No new results found"
  );

  /* ------------------ 4. Upsert result meta ------------------ */
  for (const result of results) {
    await ScrapedResultMeta.updateOne(
      { url: result.url },
      {
        $set: {
          title: result.title,
          lastSeenAt: new Date(),
        },
        $setOnInsert: {
          firstSeenAt: new Date(),
          source: "rojgarresult",
        },
      },
      { upsert: true }
    );
  }

  /* ------------------ 5. Scrape details for NEW results ------------------ */
  for (const result of newResults) {
    const exists = await ScrapeResultDetail.exists({ url: result.url });
    if (exists) continue;

    console.log("🔍 Scraping result detail:", result.title);

    const detail = await scrapeResultDetail(result.url);

    await ScrapeResultDetail.create({
      url: detail.url,
      title: detail.title,
      rawContent: detail.rawContent,
      scrapedAt: detail.scrapedAt,
      aiProcessed: false,
    });
  }

  /* ------------------ 6. AI STAGE ------------------ */
  console.log("🤖 Starting Gemini AI result processing...");
  await runGeminiResultAgent();

  console.log("🚀 Result pipeline completed (Mongo + AI)");
}