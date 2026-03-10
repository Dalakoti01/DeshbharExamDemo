import "dotenv/config";

import { flattenRawContent } from "../src/lib/flattenRawContent.js";
import ScrapeResultDetail from "@/models/result/ScrapeResultDetail.js";
import AiProcessedResult from "@/models/result/AiProcessedResult.js";


const API_KEY = process.env.GEMINI_API_KEY_RESULT;

/* ---------------- JSON PARSER ---------------- */

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

/* ---------------- GEMINI CALL ---------------- */

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

/* ---------------- PROMPT BUILDER ---------------- */

function buildPrompt(cleanText) {
  return `
You are a STRICT data extraction engine for government EXAM RESULTS.

Your job is to analyze the RAW TEXT of a result page and extract structured data.

--------------------------------
IMPORTANT RULES
--------------------------------
1. Return VALID JSON ONLY.
2. Do NOT include markdown or explanation.
3. Extract data ONLY if clearly present.
4. Do NOT guess values.
5. If a field is not available, return null.
6. Rewrite descriptions in clear language.
7. Extract ONLY the data required in the schema.

--------------------------------
FIELD DEFINITIONS
--------------------------------

title
Full title of the result announcement.

description
Short summary explaining the result announcement.

examName
Name of the exam or recruitment.
Example:
"India Post GDS Recruitment 2026"

resultDate
Date when result or merit list was released.

resultType
Type of result such as:
- Merit List
- Final Result
- Tier 1 Result
- Mains Result
- Typing Test Result
- Scorecard
- Cutoff

importantLinks
List of links related to the result such as:
- Download Result
- Merit List
- Scorecard
- Official Website
- Notification

Format:
[
 { "linkName": "Download Result", "linkUrl": "..." }
]

importantDates
Important dates related to the exam or result.

Example:
[
 { "linkName": "Result Declared", "linkUrl": "06 March 2026" }
]

--------------------------------
TARGET JSON SCHEMA
--------------------------------

{
  "title": String | null,
  "description": String | null,
  "examName": String | null,
  "resultDate": String | null,
  "resultType": String | null,
  "importantLinks": [
    { "linkName": String, "linkUrl": String }
  ],
  "importantDates": [
    { "linkName": String, "linkUrl": String }
  ]
}

--------------------------------
RAW RESULT PAGE TEXT
--------------------------------

${cleanText}

--------------------------------
OUTPUT
--------------------------------

Return ONLY the JSON object.
`;
}

/* ---------------- MAIN AGENT ---------------- */

export async function runGeminiResultAgent() {
  console.log("🤖 Gemini RESULT batch start");

  const results = await ScrapeResultDetail.find({
    isProcessed: false,
  })
    .sort({ scrapedAt: 1 })
    .limit(4);

  for (const result of results) {
    console.log("🤖 Processing:", result.url);

    try {
      const cleanText = flattenRawContent(result.rawContent);
      const prompt = buildPrompt(cleanText);

      const responseText = await callGemini(prompt);
      const parsed = safeJsonParse(responseText);

      if (!parsed) throw new Error("Invalid JSON from Gemini");

      await AiProcessedResult.updateOne(
        { sourceUrl: result.url },
        {
          $set: {
            ...parsed,
            sourceUrl: result.url,
            aiProcessedAt: new Date(),
          },
        },
        { upsert: true }
      );

      result.isProcessed = true;
      result.aiProcessedAt = new Date();
      await result.save();

      console.log("✅ AI success:", result.url);

    } catch (err) {
      console.error("⚠️ AI failed:", result.url);
      console.error(err.message);

      result.aiFailedAt = new Date();
      result.aiError = err.message;
      await result.save();
    }
  }

  console.log("🤖 Gemini RESULT batch completed");
}