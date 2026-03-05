import axios from "axios";
import { load } from "cheerio";
import { scrapeJobDetail } from "./scrapeRojgarJobDetail.js";
import { connectDB } from "../src/lib/db.js";
import { runGeminiAgent } from "../ai/geminiJobAgent.js";

// Mongo models
import ScrapedJobMeta from "../src/models/ScrapedJobMeta.js";
import ScrapedJobDetail from "../src/models/ScrapedJobDetail.js";

const SITE_URL = "https://www.rojgarresult.com/";

export async function scrapeRojgarResult() {
  console.log("🔍 Scraping job listing...");

  /* ------------------ DB CONNECT ------------------ */
  await connectDB();
  console.log("✅ MongoDB connected successfully.");

  /* ------------------ 1. Fetch listing ------------------ */
  const { data: html } = await axios.get(SITE_URL);
  const $ = load(html);

  const jobs = [];

  // UPDATED SELECTOR (based on new DOM)
  $(".latest-jobs-section .job-link a").each((_, el) => {
    const title = $(el).text().trim();
    const url = $(el).attr("href");

    if (title && url) {
      jobs.push({
        title,
        url,
      });
    }
  });

  console.log(`📄 Found ${jobs.length} jobs`);

  /* ------------------ 2. Load existing URLs ------------------ */
  const existingJobs = await ScrapedJobMeta.find(
    { source: "rojgarresult" },
    { url: 1 }
  ).lean();

  const existingUrlSet = new Set(existingJobs.map(j => j.url));

  /* ------------------ 3. Detect new jobs ------------------ */
  const newJobs = jobs.filter(j => !existingUrlSet.has(j.url));

  console.log(
    newJobs.length
      ? `🆕 ${newJobs.length} new jobs found`
      : "✅ No new jobs found"
  );

  /* ------------------ 4. Upsert meta ------------------ */
  for (const job of jobs) {
    await ScrapedJobMeta.updateOne(
      { url: job.url },
      {
        $set: {
          title: job.title,
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

  /* ------------------ 5. Scrape details for NEW jobs ------------------ */
  for (const job of newJobs) {
    const exists = await ScrapedJobDetail.exists({ url: job.url });
    if (exists) continue;

    console.log("🔍 Scraping job detail:", job.title);

    const detail = await scrapeJobDetail(job.url);

    await ScrapedJobDetail.create({
      url: detail.url,
      title: detail.title,
      rawContent: detail.rawContent,
      scrapedAt: detail.scrapedAt,
      aiProcessed: false,
    });
  }

  /* ------------------ 6. AI STAGE ------------------ */
  console.log("🤖 Starting Gemini AI processing...");
  await runGeminiAgent();

  console.log("🚀 RojgarResult pipeline completed (Mongo + AI)");
}