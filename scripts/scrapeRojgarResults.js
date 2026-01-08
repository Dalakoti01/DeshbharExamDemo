import axios from "axios";
import { load } from "cheerio";
import { scrapeJobDetail } from "./scrapeRojgarJobDetail.js";
import { runGeminiAgent } from "../ai/geminiJobAgent.js";
import { connectDB } from "../src/lib/db.js";

// ✅ Mongo models (NEW)
import ScrapedJobMeta from "../src/models/ScrapedJobMeta.js";
import ScrapedJobDetail from "../src/models/ScrapedJobDetail.js";

// ⛔ DO NOT USE FS ON VERCEL
// import fs from "fs-extra";
// import path from "path";

// ⛔ Temporarily disabled (will re-enable after AI migration)
// import { ingestAiJobs } from "../services/jobIngestionService.js";

const SITE_URL = "https://www.rojgarresult.com/";

export async function scrapeRojgarResult() {
  console.log("🔍 Scraping job listing...");

  /* ------------------ DB CONNECT ------------------ */
  await connectDB();

  /* ------------------ 1. Fetch listing ------------------ */
  const { data: html } = await axios.get(SITE_URL);
  const $ = load(html);

  const jobs = [];

  $("h2.gb-headline-text")
    .filter((_, el) => $(el).text().trim() === "LATEST JOBS")
    .next(".gb-query-loop-wrapper")
    .find("h2.gb-headline-text a")
    .each((_, el) => {
      jobs.push({
        title: $(el).text().trim(),
        url: $(el).attr("href"),
      });
    });

  console.log(`📄 Found ${jobs.length} jobs`);

  /* ------------------ 2. Load existing job URLs from Mongo ------------------ */
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

  /* ------------------ 4. Upsert ALL jobs into meta collection ------------------ */
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

  /* ------------------ 5. Scrape details for ONLY new jobs ------------------ */
  for (const job of newJobs) {
    console.log("🔍 Scraping new job detail:", job.title);

    const detail = await scrapeJobDetail(job.url);

    await ScrapedJobDetail.create({
      url: detail.url,
      rawContent: detail.rawContent,
      scrapedAt: detail.scrapedAt,
    });
  }

  /* ------------------ 6. AI STAGE (still file-based, unchanged) ------------------ */
  // ⚠️ SAFE TO RUN — does NOT write DB directly
  await runGeminiAgent();

  /* ------------------ 7. INGESTION (TEMPORARILY DISABLED) ------------------ */
  /*
  ⚠️ IMPORTANT:
  ingestAiJobs() currently reads/writes rojgar_ai_jobs.json.
  This will cause EROFS on Vercel.

  We will re-enable this AFTER migrating AI output to MongoDB.
  */

  // const result = await ingestAiJobs();
  // console.log("📦 Mongo Ingestion:", result);

  console.log("🚀 RojgarResult pipeline completed (pre-AI migration)");
}
