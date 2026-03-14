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

function filterLinks(data) {
  if (!data) return data;

  const bannedDomains = [
    "telegram",
    "whatsapp",
    "rojgarresult",
    "sarkariresult",
  ];

  const isValid = (url) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return !bannedDomains.some((d) => lower.includes(d));
  };

  data.importantLinks = (data.importantLinks || []).filter((l) =>
    isValid(l.linkUrl)
  );

  data.otherLinks = (data.otherLinks || []).filter((l) =>
    isValid(l.linkUrl)
  );

  return data;
}

/* ---------------- NORMALIZE DATA ---------------- */

function normalizeData(parsed) {
  const result = {
    importantDates: [{}],
    importantLinks: [{}],
    otherLinks: [],
    otherDates: [],
  };

  const dateObj = {};
  const linkObj = {};

  const dates = parsed.importantDates || [];
  const links = parsed.importantLinks || [];

  /* ----------- MAP IMPORTANT DATES ----------- */

  for (const d of dates) {
    const name = (d.linkName || "").toLowerCase();

    if (name.includes("exam")) dateObj.examDate = d.linkUrl;
    else if (name.includes("result")) dateObj.resultDate = d.linkUrl;
    else if (name.includes("admit")) dateObj.admitCardsDate = d.linkUrl;
    else if (name.includes("last date")) dateObj.applicationDeadline = d.linkUrl;
    else if (name.includes("fee")) dateObj.lastDateToPayFees = d.linkUrl;
    else result.otherDates.push(d);
  }

  /* ----------- MAP IMPORTANT LINKS ----------- */

  for (const l of links) {
    const name = (l.linkName || "").toLowerCase();

    if (name.includes("download result")) linkObj.downloadResult = l.linkUrl;
    else if (name.includes("notification"))
      linkObj.downloadNotification = l.linkUrl;
    else if (name.includes("admit card"))
      linkObj.downloadAdmitCard = l.linkUrl;
    else if (name.includes("exam notice"))
      linkObj.downloadExamNotice = l.linkUrl;
    else if (name.includes("interview"))
      linkObj.downloadInterviewLetter = l.linkUrl;
    else if (name.includes("answer key"))
      linkObj.downloadAnswerKey = l.linkUrl;
    else if (name.includes("pre result"))
      linkObj.downloadPreResult = l.linkUrl;
    else if (name.includes("main result"))
      linkObj.downloadMainResult = l.linkUrl;
    else if (name.includes("merit"))
      linkObj.downloadMeritList = l.linkUrl;
    else if (name.includes("official"))
      linkObj.officialWebsite = l.linkUrl;
    else result.otherLinks.push(l);
  }

  result.importantDates = [dateObj];
  result.importantLinks = [linkObj];

  return {
    ...parsed,
    ...result,
  };
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
Extract structured data for a government exam RESULT page.

Return ONLY JSON.

Structure:

{
"title": String,
"description": String,
"examName": String,
"resultDate": String,

"location": {
"city": String,
"state": String
},

"resultType": String,

"importantDates":[
{"linkName":String,"linkUrl":String}
],

"importantLinks":[
{"linkName":String,"linkUrl":String}
],

"otherLinks":[
{"linkName":String,"linkUrl":String}
],

"otherDates":[
{"linkName":String,"linkUrl":String}
]
}

Rules:
- Only include official links
- Ignore Telegram, WhatsApp, social media
- Ignore internal aggregator links
- Extract exam dates, result dates, application dates
- Extract download result, admit card, notification, official site links

TEXT:

${cleanText}
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

      let cleanData = filterLinks(parsed);

      cleanData = normalizeData(cleanData);

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