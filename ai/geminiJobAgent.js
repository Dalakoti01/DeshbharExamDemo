import "dotenv/config";
import ScrapedJobDetail from "@/models/ScrapedJobDetail";
import AiProcessedJob from "@/models/AiProcessedJob";
import { flattenRawContent } from "../src/lib/flattenRawContent.js";

const API_KEY = process.env.GEMINI_API_KEY;

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
You are a STRICT data extraction engine.

Convert the recruitment notification below into JSON
matching the MongoDB job schema.

RULES:
- Output JSON ONLY
- Use null if data not found
- Do NOT hallucinate

RAW TEXT:
${cleanText}
`;
}

export async function runGeminiAgent() {
  console.log("🤖 Gemini batch start");

  const jobs = await ScrapedJobDetail.find({
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

      await AiProcessedJob.updateOne(
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
