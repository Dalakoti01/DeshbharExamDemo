import "dotenv/config";

import { flattenRawContent } from "../src/lib/flattenRawContent.js";
import ScrapeResultDetail from "../src/models/result/ScrapeResultDetail.js";
import AiProcessedResult from "../src/models/result/AiProcessedResult.js";

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

/* ---------------- LINK FILTER ---------------- */

function sanitizeLinks(data) {
  if (!data) return data;

  const banned = ["telegram", "whatsapp", "join", "group"];

  const filterLink = (url) => {
    if (!url) return null;

    const lower = url.toLowerCase();
    if (banned.some((b) => lower.includes(b))) return null;

    return url;
  };

  if (data.importantLinks) {
    data.importantLinks.downloadResult = filterLink(
      data.importantLinks.downloadResult
    );

    data.importantLinks.officialNotification = filterLink(
      data.importantLinks.officialNotification
    );

    data.importantLinks.officialWebsite = filterLink(
      data.importantLinks.officialWebsite
    );
  }

  if (data.otherLinks && Array.isArray(data.otherLinks)) {
    data.otherLinks = data.otherLinks.filter((l) => {
      if (!l.linkUrl) return false;
      return !banned.some((b) => l.linkUrl.toLowerCase().includes(b));
    });
  }

  return data;
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
        generationConfig: {
          temperature: 0.2,
        },
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
You are a STRICT structured data extraction engine for GOVERNMENT EXAM RESULTS.

Your task is to read raw webpage text and extract structured information.

--------------------------------
CRITICAL RULES
--------------------------------

1. Return ONLY VALID JSON.
2. Do NOT include explanations or markdown.
3. Do NOT guess missing data.
4. If a field is unavailable return null.
5. NEVER mention the source website name.
6. NEVER include phrases like:
   - "According to..."
   - "As per website..."
7. Rewrite the description in original language so it does not look copied.
8. Ignore social links such as:
   - Telegram
   - WhatsApp
   - Join groups
9. Focus ONLY on official result related information.

--------------------------------
IMPORTANT LINK RULES
--------------------------------

Extract ONLY useful result links such as:

- Download Result
- Download Merit List
- Download Scorecard
- Download Interview Letter
- Official Notification
- Official Website

Ignore links like:

- Telegram
- WhatsApp
- Social media
- Advertisement links

--------------------------------
TARGET JSON STRUCTURE
--------------------------------

{
  "title": String | null,
  "description": String | null,
  "examName": String | null,
  "resultDate": String | null,

  "location": {
    "city": String | null,
    "state": String | null
  },

  "resultType": String | null,

  "importantDates": {
    "resultDate": String | null,
    "applicationDeadline": String | null,
    "lastDateToPayFees": String | null,
    "examDate": String | null,
    "admitCardsDate": String | null
  },

  "importantLinks": {
    "downloadResult": String | null,
    "officialNotification": String | null,
    "officialWebsite": String | null
  },

  "otherLinks": [
    { "linkName": String, "linkUrl": String }
  ],

  "otherDates": [
    { "linkName": String, "linkUrl": String }
  ]
}

--------------------------------
RAW PAGE TEXT
--------------------------------

${cleanText}

--------------------------------
OUTPUT
--------------------------------

Return ONLY JSON.
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

      const cleanData = sanitizeLinks(parsed);

      await AiProcessedResult.updateOne(
        { sourceUrl: result.url },
        {
          $set: {
            ...cleanData,
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