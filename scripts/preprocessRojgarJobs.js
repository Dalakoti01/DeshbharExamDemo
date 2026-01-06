import fs from "fs-extra";
import path from "path";

const DETAILS_FILE = path.join(process.cwd(), "data", "rojgar_job_details.json");
const OUTPUT_FILE = path.join(process.cwd(), "data", "rojgar_preprocessed_jobs.json");

/* ------------------ HELPERS ------------------ */

function clean(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function extractDateDMY(text) {
  const match = text.match(/(\d{2}\/\d{2}\/\d{4})/);
  if (!match) return null;

  const [d, m, y] = match[1].split("/");
  return new Date(`${y}-${m}-${d}`);
}

function extractNumber(text) {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function extractSection(text, start, end) {
  const s = text.indexOf(start);
  if (s === -1) return "";

  const sliced = text.slice(s + start.length);
  if (!end) return clean(sliced);

  const e = sliced.indexOf(end);
  return clean(e === -1 ? sliced : sliced.slice(0, e));
}

/* ------------------ LINKS ------------------ */

function extractLinks(rawContent) {
  const importantLinks = {};
  const otherLinks = [];

  rawContent.forEach(block => {
    block.links?.forEach(l => {
      const href = l.href.toLowerCase();

      if (/apply|index\.html/.test(href))
        importantLinks.applyOnline = l.href;
      else if (/pdf|notification|advt/.test(href))
        importantLinks.officialNotification = l.href;
      else if (/gov|nic/.test(href))
        importantLinks.officialWebsite = l.href;
      else
        otherLinks.push({ linkName: l.label, linkUrl: l.href });
    });
  });

  return { importantLinks, otherLinks };
}

/* ------------------ MAIN ------------------ */

export async function preprocessJobs() {
  if (!(await fs.pathExists(DETAILS_FILE))) return;

  const details = await fs.readJson(DETAILS_FILE);
  let output = [];

  if (await fs.pathExists(OUTPUT_FILE)) {
    output = await fs.readJson(OUTPUT_FILE);
  }

  for (const job of details) {
    if (job.processed) continue;

    const tableBlock = job.rawContent.find(b => b.tag === "table");
    if (!tableBlock) continue;

    const tableText = clean(tableBlock.text);
    const { importantLinks, otherLinks } = extractLinks(job.rawContent);

    /* ---------- SECTIONS ---------- */

    const importantDatesText = extractSection(
      tableText,
      "Important Dates:",
      "Application Fees"
    );

    const feesText = extractSection(
      tableText,
      "Application Fees:",
      "Age Limit"
    );

    const ageText = extractSection(
      tableText,
      "Age Limit",
      "Vacancy Details"
    );

    const totalPost = extractNumber(
      extractSection(tableText, "Total", "Post")
    );

    /* ---------- FINAL OBJECT ---------- */

    output.push({
      title: job.title,

      description: extractSection(
        tableText,
        "Short Description:",
        "Important Dates"
      ),

      location: { city: null, state: null },

      importantDates: {
        publishedDate: new Date(job.scrapedAt),
        applicationDeadline: extractDateDMY(importantDatesText),
        lastDateToPayFees: null,
        examDate: null,
        admitCardsDate: null,
      },

      importantLinks,
      otherLinks,

      applicationFees: {
        General: extractNumber(feesText),
        OBC: extractNumber(feesText),
        SC_ST: feesText.includes("0/-") ? 0 : null,
      },

      ageLimit: {
        lowerLimit: {
          General: extractNumber(ageText)?.toString() || null,
          OBC: null,
          SC_ST: null,
        },
        upperLimit: {
          General: ageText.match(/Maximum Age:(.*)/)?.[1]?.trim() || null,
          OBC: null,
          SC_ST: null,
        },
      },

      totalPost,
      postClassification: [],
      fillingProcedure: extractSection(
        tableText,
        "How to Fill",
        "Some Useful Important Links"
      )
        .split(".")
        .map(s => clean(s))
        .filter(Boolean),
    });

    job.processed = true;
  }

  await fs.writeJson(OUTPUT_FILE, output, { spaces: 2 });
  await fs.writeJson(DETAILS_FILE, details, { spaces: 2 });

  console.log(`✅ Preprocessed ${output.length} jobs correctly`);
}
