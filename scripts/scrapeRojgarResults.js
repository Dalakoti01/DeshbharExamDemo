import axios from "axios";
import { load } from "cheerio";
import fs from "fs-extra";
import path from "path";
import { scrapeJobDetail } from "./scrapeRojgarJobDetail.js";
import { preprocessJobs } from "./preprocessRojgarJobs.js";
import { runGeminiAgent } from "../ai/geminiJobAgent.js";
import { connectDB } from "../src/lib/db.js";
import { ingestAiJobs } from "../services/jobIngestionService.js";

const SITE_URL = "https://www.rojgarresult.com/";

const JOBS_FILE = path.join(process.cwd(), "data", "rojgar_jobs.json");
const DETAILS_FILE = path.join(
  process.cwd(),
  "data",
  "rojgar_job_details.json"
);

export async function scrapeRojgarResult() {
  console.log("🔍 Scraping job listing...");

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

  /* ------------------ 2. Load old jobs ------------------ */
  let oldJobs = [];
  if (await fs.pathExists(JOBS_FILE)) {
    try {
      oldJobs = await fs.readJson(JOBS_FILE);
    } catch {
      oldJobs = [];
    }
  }

  /* ------------------ 3. Detect new jobs ------------------ */
  const oldUrls = new Set(oldJobs.map((j) => j.url));
  const newJobs = jobs.filter((j) => !oldUrls.has(j.url));

  /* ------------------ 4. Save snapshot ------------------ */
  await fs.ensureDir(path.dirname(JOBS_FILE));
  await fs.writeJson(JOBS_FILE, jobs, { spaces: 2 });

  /* ------------------ 5. Scrape job details if needed ------------------ */
  if (!newJobs.length) {
    console.log("✅ No new jobs found");
  } else {
    console.log(`🆕 ${newJobs.length} new jobs found`);

    let jobDetails = [];
    if (await fs.pathExists(DETAILS_FILE)) {
      try {
        jobDetails = await fs.readJson(DETAILS_FILE);
      } catch {
        jobDetails = [];
      }
    }

    for (const job of newJobs) {
      const detail = await scrapeJobDetail(job.url);
      jobDetails.push(detail);
    }

    await fs.ensureDir(path.dirname(DETAILS_FILE));
    await fs.writeJson(DETAILS_FILE, jobDetails, { spaces: 2 });

    console.log("✅ Job details saved for new jobs");
  }

  /* ------------------ 6. ALWAYS run downstream stages ------------------ */
  // await preprocessJobs();
  await runGeminiAgent();

  await connectDB();
  const result = await ingestAiJobs();
  console.log("📦 Mongo Ingestion:", result);

  console.log("🚀 RojgarResult pipeline completed");
}

/* ------------------ Entry point (cron-safe) ------------------ */
scrapeRojgarResult().catch(console.error);
