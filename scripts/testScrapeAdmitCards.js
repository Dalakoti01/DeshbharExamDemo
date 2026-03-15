import axios from "axios";
import { load } from "cheerio";
import fs from "fs";

const SITE_URL = "https://www.rojgarresult.com/";

async function testScrapeAdmitCards() {

  console.log("🔍 Testing Admit Card Scraper...\n");

  try {

    /* ---------------- FETCH PAGE ---------------- */

    const { data: html } = await axios.get(SITE_URL);
    const $ = load(html);

    const admitCards = [];

    /* ---------------- SELECTOR ---------------- */

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

    console.log(`✅ Found ${admitCards.length} admit cards\n`);

    /* ---------------- PRINT RESULTS ---------------- */

    admitCards.forEach((card, i) => {
      console.log(`${i + 1}. ${card.title}`);
      console.log(`   ${card.url}\n`);
    });

    /* ---------------- SAVE JSON ---------------- */

    fs.writeFileSync(
      "admitcards-test.json",
      JSON.stringify(admitCards, null, 2)
    );

    console.log("📁 Results saved to admitcards-test.json");

  } catch (error) {

    console.error("❌ Scraping failed:", error.message);

  }

}

testScrapeAdmitCards();