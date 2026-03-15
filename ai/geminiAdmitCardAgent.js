import "dotenv/config";

import { flattenRawContent } from "../src/lib/flattenRawContent.js";

import ScrapedAdmitCardDetail from "../src/models/admitCard/ScrapedAdmitCardDetail.js";
import AiProcessedAdmitCard from "../src/models/admitCard/AiProcessedAdmitCard.js";

const API_KEY = process.env.GEMINI_API_KEY_ADMITCARD;

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
    if (!url || typeof url !== "string") return false;
    const lower = url.toLowerCase();
    return !bannedDomains.some((d) => lower.includes(d));
  };

  /* Important Links */

  if (data.importantLinks && typeof data.importantLinks === "object") {
    Object.keys(data.importantLinks).forEach((key) => {
      if (!isValid(data.importantLinks[key])) {
        data.importantLinks[key] = null;
      }
    });
  }

  /* Other Links */

  if (Array.isArray(data.otherLinks)) {
    data.otherLinks = data.otherLinks.filter(
      (l) =>
        l &&
        typeof l === "object" &&
        typeof l.linkUrl === "string" &&
        isValid(l.linkUrl)
    );
  } else {
    data.otherLinks = [];
  }

  return data;
}

/* ---------------- NORMALIZE LINKS ---------------- */

function normalizeData(parsed) {
  const result = {
    importantLinks: {},
    importantDates: {},
    otherLinks: [],
    otherDates: [],
  };

  const links = Array.isArray(parsed.importantLinks)
    ? parsed.importantLinks
    : [];

  const dates = Array.isArray(parsed.importantDates)
    ? parsed.importantDates
    : [];

  /* ----------- MAP IMPORTANT LINKS ----------- */

  for (const l of links) {
    if (!l || typeof l !== "object") continue;

    const name = (l.linkName || "").toLowerCase();
    const url = l.linkUrl || null;

    if (!url) continue;

    if (name.includes("admit card"))
      result.importantLinks.downloadAdmitCard = url;

    else if (name.includes("official"))
      result.importantLinks.officialWebsite = url;

    else if (name.includes("exam city"))
      result.importantLinks.checkExamCity = url;

    else if (name.includes("notification"))
      result.importantLinks.downloadNotification = url;

    else if (name.includes("syllabus"))
      result.importantLinks.downloadSyllabus = url;

    else if (name.includes("answer key"))
      result.importantLinks.downloadAnswerKey = url;

    else if (name.includes("exam notice"))
      result.importantLinks.downloadExamNotice = url;

    else if (name.includes("interview"))
      result.importantLinks.downloadInterviewLetter = url;

    else if (name.includes("pre result"))
      result.importantLinks.downloadPreResult = url;

    else if (name.includes("mains"))
      result.importantLinks.downloadMainsNotice = url;

    else result.otherLinks.push(l);
  }

  /* ----------- MAP IMPORTANT DATES ----------- */

  for (const d of dates) {
    if (!d || typeof d !== "object") continue;

    const name = (d.linkName || "").toLowerCase();
    const value = d.linkUrl || null;

    if (!value) continue;

    if (name.includes("exam"))
      result.importantDates.examDate = value;

    else if (name.includes("admit"))
      result.importantDates.admitCardsDate = value;

    else if (name.includes("last date"))
      result.importantDates.applicationDeadline = value;

    else if (name.includes("fee"))
      result.importantDates.lastDateToPayFees = value;

    else result.otherDates.push(d);
  }

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
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/* ---------------- PROMPT BUILDER ---------------- */

function buildPrompt(cleanText) {
  return `
Extract structured data from a government exam ADMIT CARD page.

Return ONLY JSON.

Structure:

{
"title": String,
"description": String,
"location":{"city":String,"state":String},

"importantDates":[{"linkName":String,"linkUrl":String}],
"importantLinks":[{"linkName":String,"linkUrl":String}],
"otherLinks":[{"linkName":String,"linkUrl":String}],
"otherDates":[{"linkName":String,"linkUrl":String}],

"applicationFees":{"General":String,"OBC":String,"SC_ST":String},

"ageLimit":{
"lowerLimit":{"General":String,"OBC":String,"SC_ST":String},
"upperLimit":{"General":String,"OBC":String,"SC_ST":String}
},

"totalPost":Number
}

Rules:
- Ignore ads
- Ignore Telegram & WhatsApp
- Ignore rojgarresult links
- Extract official links only
- Extract exam/admit dates

TEXT:

${cleanText}
`;
}

/* ---------------- MAIN AGENT ---------------- */

export async function runGeminiAdmitCardAgent() {
  console.log("🤖 Gemini ADMIT CARD batch start");

  const cards = await ScrapedAdmitCardDetail.find({
    isProcessed: false,
  })
    .sort({ scrapedAt: 1 })
    .limit(4);

  for (const card of cards) {
    console.log("🤖 Processing:", card.url);

    try {
      const cleanText = flattenRawContent(card.rawContent);

      const prompt = buildPrompt(cleanText);

      const responseText = await callGemini(prompt);

      const parsed = safeJsonParse(responseText);

      if (!parsed) throw new Error("Invalid JSON from Gemini");

      let cleanData = filterLinks(parsed);

      cleanData = normalizeData(cleanData);

      await AiProcessedAdmitCard.updateOne(
        { sourceUrl: card.url },
        {
          $set: {
            ...cleanData,
            sourceUrl: card.url,
            aiProcessedAt: new Date(),
          },
        },
        { upsert: true }
      );

      card.isProcessed = true;
      card.aiProcessedAt = new Date();

      await card.save();

      console.log("✅ AI success:", card.url);
    } catch (err) {
      console.error("⚠️ AI failed:", card.url);
      console.error(err.message);

      card.aiFailedAt = new Date();
      card.aiError = err.message;

      await card.save();
    }
  }

  console.log("🤖 Gemini ADMIT CARD batch completed");
}