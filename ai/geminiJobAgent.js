import "dotenv/config";
import ScrapedJobDetail from "@/models/ScrapedJobDetail";
import AiProcessedJob from "@/models/AiProcessedJob";

const API_KEY = process.env.GEMINI_API_KEY;

/* ------------------ JSON SAFETY ------------------ */
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

/* ------------------ PROMPT ------------------ */
function buildPrompt(job) {
  return `
Convert the following raw recruitment data into STRICT JSON
matching the provided schema.

RAW DATA:
${JSON.stringify(job, null, 2)}

Return JSON ONLY.
`;
}

/* ------------------ AGENT ------------------ */
export async function runGeminiAgent() {
  console.log("🤖 Starting Gemini AI processing...");

  const unprocessedJobs = await ScrapedJobDetail.find({
    aiProcessed: { $ne: true },
  })
    .sort({ scrapedAt: 1 })
    .limit(3); // 🔥 keep low for Gemini safety

  for (const job of unprocessedJobs) {
    console.log("🤖 AI processing:", job.url);

    try {
      const prompt = buildPrompt(job.rawContent);
      const responseText = await callGemini(prompt);
      const parsed = safeJsonParse(responseText);

      if (!parsed) {
        console.error("❌ Invalid AI JSON for", job.url);
        job.aiFailedAt = new Date();
        await job.save();
        continue;
      }

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

      job.aiProcessed = true;
      job.aiProcessedAt = new Date();
      await job.save();

      console.log("✅ AI processed:", job.url);

    } catch (err) {
      // 🔥 THIS IS THE KEY FIX
      console.error("⚠️ Gemini failed for", job.url);
      console.error(err.message);

      job.aiFailedAt = new Date();
      job.aiError = err.message;
      await job.save();

      // ⛔ DO NOT throw
      continue;
    }
  }

  console.log("🤖 Gemini batch completed");
}

