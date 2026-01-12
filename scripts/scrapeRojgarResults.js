import axios from "axios";
import { load } from "cheerio";
import { scrapeJobDetail } from "./scrapeRojgarJobDetail.js";
import { connectDB } from "../src/lib/db.js";

// Mongo models
import ScrapedJobMeta from "../src/models/ScrapedJobMeta.js";
import ScrapedJobDetail from "../src/models/ScrapedJobDetail.js";

// ❌ DO NOT import fs / path on Vercel
// ❌ DO NOT run Gemini or ingestion yet

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

  /* ------------------ 2. Load existing URLs from Mongo ------------------ */
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

  /* ------------------ 4. Upsert ALL jobs into meta ------------------ */
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

  /* ------------------ 5. Scrape details ONLY for new jobs ------------------ */
  for (const job of newJobs) {
    console.log("🔍 Scraping new job detail:", job.title);

    const alreadyExists = await ScrapedJobDetail.exists({ url: job.url });
    if (alreadyExists) {
      console.log("⚠️ Detail already exists, skipping:", job.url);
      continue;
    }

    const detail = await scrapeJobDetail(job.url);

    await ScrapedJobDetail.create({
      url: detail.url,
      title: detail.title,
      rawContent: detail.rawContent,
      scrapedAt: detail.scrapedAt,
    });
  }

  /* ------------------ 6. AI STAGE (DISABLED) ------------------ */
  /*
    Gemini agent currently depends on filesystem JSON.
    This WILL cause EROFS on Vercel.

    We will migrate Gemini input/output to MongoDB
    in the next phase and re-enable this safely.
  */
  // await runGeminiAgent();

  console.log("🚀 RojgarResult pipeline completed (Mongo-only, pre-AI)");
}
