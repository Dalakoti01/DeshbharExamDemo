import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;

async function main() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "who is virat kohli" }],
          },
        ],
      }),
    }
  );

  const data = await res.json();

  if (data.error) {
    console.error("Gemini API Error:", data.error);
    return;
  }

  console.log(data.candidates[0].content.parts[0].text);
}

main();
