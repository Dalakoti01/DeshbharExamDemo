import fs from "fs-extra";
import path from "path";
import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;
console.log("Using Gemini API Key:", API_KEY ? "✅ PRESENT" : "❌ MISSING");

const INPUT_FILE = path.join(
  process.cwd(),
  "data",
  "rojgar_job_details.json"
);


const OUTPUT_FILE = path.join(
  process.cwd(),
  "data",
  "rojgar_ai_jobs.json"
);

/* ------------------ JSON SAFETY ------------------ */
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {}

  // Extract JSON object from mixed text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

/* ------------------ NORMALIZER ------------------ */
function normalizeAiJob(aiJob, fallbackTitle) {
  // Description must never be empty
  if (!aiJob.description || !aiJob.description.trim()) {
    aiJob.description =
      `This recruitment notification announces ${fallbackTitle}. ` +
      `Eligible candidates can apply online as per the official schedule and guidelines.`;
  }

  // Ensure importantLinks exists
  aiJob.importantLinks = aiJob.importantLinks || {};

  // Ensure officialWebsite exists
  if (!aiJob.importantLinks.officialWebsite) {
    const possibleLink =
      aiJob.importantLinks.applyOnline ||
      aiJob.importantLinks.officialNotification ||
      null;

    if (possibleLink) {
      try {
        aiJob.importantLinks.officialWebsite =
          new URL(possibleLink).origin;
      } catch {
        aiJob.importantLinks.officialWebsite = null;
      }
    }
  }

  // Absolute fallback
  if (!aiJob.importantLinks.officialWebsite) {
    aiJob.importantLinks.officialWebsite = "https://www.gov.in";
  }

  // Normalize otherLinks
  if (!Array.isArray(aiJob.otherLinks)) {
    aiJob.otherLinks = [];
  }

  return aiJob;
}

/* ------------------ PROMPT (DB-SCHEMA LOCKED) ------------------ */
function buildPrompt(job) {
  return `
You are a STRICT data extraction and transformation engine.

Your task is to CONVERT the provided unstructured recruitment data
into a JSON object that EXACTLY matches the MongoDB Job schema below.

--------------------------------
MANDATORY RULES (ABSOLUTE):
--------------------------------
1. Output MUST be valid JSON ONLY.
2. Output MUST EXACTLY match the schema.
3. Do NOT add extra fields.
4. Do NOT rename fields.
5. Do NOT change object or array structure.
6. Extract ONLY information present in the input.
7. If a value is not clearly present, use null.
8. Dates MUST be ISO format (YYYY-MM-DD) or null.
9. Fees MUST be numbers or null.
10. Age limits MUST be structured objects.
11. Do NOT hallucinate or guess.
12. Rewrite descriptive text in your own words.
13. Output JSON ONLY. No explanation. No markdown.

--------------------------------
TARGET SCHEMA (EXACT):
--------------------------------
{
  "title": String,
  "description": String,

  "location": {
    "city": String | null,
    "state": String | null
  },

  "importantDates": {
    "applicationDeadline": String | null,
    "lastDateToPayFees": String | null,
    "examDate": String | null,
    "admitCardsDate": String | null
  },

  "importantLinks": {
    "applyOnline": String | null,
    "officialNotification": String | null,
    "officialWebsite": String | null
  },

  "otherLinks": [
    { "linkName": String, "linkUrl": String }
  ],

  "applicationFees": {
    "General": String | null,
    "OBC": String | null,
    "SC_ST": String | null
  },

  "ageLimit": {
    "lowerLimit": {
      "General": String | null,
      "OBC": String | null,
      "SC_ST": String | null
    },
    "upperLimit": {
      "General": String | null,
      "OBC": String | null,
      "SC_ST": String | null
    }
  },

  "totalPost": Number | null,

  "postClassification": [
    {
      "postName": String | null,
      "numberOfPosts": Number | null,
      "eligibilityCriteria": [String]
    }
  ],

  "fillingProcedure": [String]
}


--------------------------------
INPUT DATA (RAW SCRAPED):
--------------------------------
${JSON.stringify(job, null, 2)}

--------------------------------
OUTPUT:
--------------------------------
Return ONLY the JSON object matching the schema.
`;
}



/* ------------------ GEMINI CALL ------------------ */
async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  return data.candidates[0].content.parts[0].text;
}

/* ------------------ AGENT RUNNER ------------------ */
export async function runGeminiAgent() {
  if (!(await fs.pathExists(INPUT_FILE))) return;

  const jobs = await fs.readJson(INPUT_FILE);
  if (!jobs.length) return;

  // Load existing AI jobs (IMPORTANT)
  let output = [];
  if (await fs.pathExists(OUTPUT_FILE)) {
    try {
      output = await fs.readJson(OUTPUT_FILE);
    } catch {
      output = [];
    }
  }

  for (const job of jobs) {
    // 🔐 DUPLICATE GUARD (CRITICAL)
    const alreadyExists = output.some(
      existing => existing.title === job.title
    );
    if (alreadyExists) {
      continue;
    }

    console.log("🤖 Processing job with AI:", job.title);

    const prompt = buildPrompt(job);
    const responseText = await callGemini(prompt);

    const parsed = safeJsonParse(responseText);
    if (!parsed) {
      console.error("❌ Invalid JSON from Gemini, skipping job");
      continue;
    }

    const normalized = normalizeAiJob(parsed, job.title);

    output.push({
      ...normalized,
      inserted: false, // 🔑 INITIAL STATE
    });
  }

  await fs.writeJson(OUTPUT_FILE, output, { spaces: 2 });
  console.log(`✅ AI jobs file updated (${output.length} total jobs)`);
}
