import fs from "fs";
import { scrapeResultDetail } from "./result/scrapeResultDetail.js";

const TEST_URL = "https://rojgarresult.com/india-post-gds-2026/";

async function runTest() {
  try {
    console.log("🚀 Running Result Detail Scraper Test\n");

    const result = await scrapeResultDetail(TEST_URL);

    console.log("✅ Scraping completed\n");

    console.log("Title:", result.title);
    console.log("Content blocks:", result.rawContent.length);

    // Save output to JSON file
    const fileName = "result-detail-test-output.json";

    fs.writeFileSync(
      fileName,
      JSON.stringify(result, null, 2)
    );

    console.log(`📁 Output saved to ${fileName}`);

  } catch (err) {
    console.error("❌ Scraper failed");
    console.error(err);
  }
}

runTest();