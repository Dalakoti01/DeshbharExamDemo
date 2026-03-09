import "dotenv/config";

import { flattenRawContent } from "../src/lib/flattenRawContent.js";
import ScrapeResultDetail from "@/models/result/ScrapeResultDetail.js";
import AiProcessedResult from "@/models/result/AiProcessedResult.js";

const API_KEY = process.env.GEMINI_API_KEY_RESULT;

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {}

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 },
      }),
    }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  return data.candidates[0].content.parts[0].text;
}

function buildPrompt(cleanText) {
  return `
You are a STRICT data extraction engine for government job notifications.

Your task is to EXTRACT information from the RAW TEXT below and
convert it into a JSON object that EXACTLY matches the MongoDB Job schema.

--------------------------------
EXTRACTION RULES:
--------------------------------
1. Output VALID JSON ONLY (no markdown, no explanation).
2. Extract data ONLY if it is clearly present in the text.
3. Data may appear in PARAGRAPHS, LISTS, or TABLE-LIKE TEXT.
4. Dates may appear under headings like:
   - Important Dates
   - Application Begin / Last Date
5. Age limits usually appear under:
   - Age Limit
   - Minimum Age / Maximum Age
6. Vacancy details may appear in text or table form.
7. Filling procedure is usually under:
   - How to Fill
8. If a field is not present at all, use null.
9. DO NOT invent or guess values.
10. Rewrite descriptions in clear, professional language.

--------------------------------
TARGET JSON SCHEMA (MUST MATCH):
--------------------------------
{
  "title": String | null,
  "description": String | null,

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
RAW RECRUITMENT TEXT:
--------------------------------
${cleanText}

--------------------------------
OUTPUT:
--------------------------------
Return ONLY the JSON object.
`;
}


export async function runGeminiAgent() {
  console.log("🤖 Gemini batch start");

  const jobs = await ScrapeResultDetail.find({
    isProcessed: false,
  })
    .sort({ scrapedAt: 1 })
    .limit(4); // 🔥 HARD LIMIT

  for (const job of jobs) {
    console.log("🤖 Processing:", job.url);

    try {
      const cleanText = flattenRawContent(job.rawContent);
      const prompt = buildPrompt(cleanText);

      const responseText = await callGemini(prompt);
      const parsed = safeJsonParse(responseText);

      if (!parsed) throw new Error("Invalid JSON from Gemini");

      await AiProcessedResult.updateOne(
        { sourceUrl: job.url },
        {
          $set: {
            ...parsed,
            sourceUrl: job.url,
            aiProcessedAt: new Date(),
          },
        },
        { upsert: true }
      );

      job.isProcessed = true;
      job.aiProcessedAt = new Date();
      await job.save();

      console.log("✅ AI success:", job.url);

    } catch (err) {
      console.error("⚠️ AI failed:", job.url);
      console.error(err.message);

      job.aiFailedAt = new Date();
      job.aiError = err.message;
      await job.save();
    }
  }

  console.log("🤖 Gemini batch completed");
}
