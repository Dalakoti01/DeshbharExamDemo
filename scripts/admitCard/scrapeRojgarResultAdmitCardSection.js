import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { load } from "cheerio";
import { connectDB } from "../../src/lib/db.js";
import { runGeminiAdmitCardAgent } from "../../ai/geminiAdmitCardAgent.js";
// Mongo models
import ScrapedAdmitCardMeta from "../../src/models/admitCard/ScrapeAdmitCardMeta.js";
import ScrapedAdmitCardDetail from "../../src/models/admitCard/ScrapedAdmitCardDetail.js";
import { scrapeAdmitCardDetail } from "./scrapeAdmitCardDetails.js";

const SITE_URL = "https://www.rojgarresult.com/";

export async function scrapeRojgarAdmitCards() {

  console.log("🔍 Scraping ADMIT CARD listing...");

  /* ------------------ DB CONNECT ------------------ */

  await connectDB();
  console.log("✅ MongoDB connected successfully.");

  /* ------------------ 1. Fetch listing ------------------ */

  const { data: html } = await axios.get(SITE_URL);
  const $ = load(html);

  const admitCards = [];

  /* ------------------ ADMIT CARD SELECTOR ------------------ */

  $(".admitcard-box .job-link a").each((_, el) => {

    const title = $(el).text().trim();
    const url = $(el).attr("href");

    if (title && url) {
      admitCards.push({
        title,
        url
      });
    }

  });

  console.log(`📄 Found ${admitCards.length} admit cards`);

  /* ------------------ 2. Load existing URLs ------------------ */

  const existingCards = await ScrapedAdmitCardMeta.find(
    { source: "rojgarresult" },
    { url: 1 }
  ).lean();

  const existingUrlSet = new Set(existingCards.map(c => c.url));

  /* ------------------ 3. Detect new admit cards ------------------ */

  const newAdmitCards = admitCards.filter(
    card => !existingUrlSet.has(card.url)
  );

  console.log(
    newAdmitCards.length
      ? `🆕 ${newAdmitCards.length} new admit cards found`
      : "✅ No new admit cards found"
  );

  /* ------------------ 4. Upsert admit card meta ------------------ */

  for (const card of admitCards) {

    await ScrapedAdmitCardMeta.updateOne(
      { url: card.url },
      {
        $set: {
          title: card.title,
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

  /* ------------------ 5. Scrape details for NEW admit cards ------------------ */

  for (const card of newAdmitCards) {

    const exists = await ScrapedAdmitCardDetail.exists({
      url: card.url
    });

    if (exists) continue;

    console.log("🔍 Scraping admit card detail:", card.title);

    const detail = await scrapeAdmitCardDetail(card.url);

    await ScrapeAdmitCardDetail.create({
      url: detail.url,
      title: detail.title,
      rawContent: detail.rawContent,
      scrapedAt: detail.scrapedAt,
      aiProcessed: false
    });

  }

  /* ------------------ 6. AI STAGE ------------------ */

  console.log("🤖 Starting Gemini AI admit card processing...");

  await runGeminiAdmitCardAgent();

  console.log("🚀 Admit Card pipeline completed (Mongo + AI)");

}

scrapeRojgarAdmitCards()
  .then(() => {
    console.log("✅ Script finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
  });