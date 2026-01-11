import fs from "fs";
import path from "path";

/**
 * Calatech / Cali AI Chat API
 * Safe, defensive, Shopify-friendly
 */
export default async function handler(req, res) {
  // =========================
  // CORS (Shopify-safe)
  // =========================
  res.setHeader("Access-Control-Allow-Origin", "https://www.calatech.co.uk");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // =========================
  // Preflight
  // =========================
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================
  // Method guard
  // =========================
  if (req.method !== "POST") {
    return res.status(200).json({
      status: "ok",
      message: "Cali chat endpoint ready"
    });
  }

  // =========================
  // Defensive body parsing
  // =========================
  const body = req.body || {};
  const history = Array.isArray(body.history) ? body.history : [];

  // =========================
  // Load external knowledge
  // =========================
  function loadKnowledge(dirPath) {
    let output = "";

    if (!fs.existsSync(dirPath)) return output;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        output += `\n\n### ${entry.name.toUpperCase()} ###\n`;
        output += loadKnowledge(fullPath);
      } else if (entry.isFile()) {
        output += `\n\n--- ${entry.name} ---\n`;
        output += fs.readFileSync(fullPath, "utf8");
      }
    }

    return output;
  }

  const knowledgePath = path.join(process.cwd(), "api", "Knowledge");
  const externalKnowledge = loadKnowledge(knowledgePath);

  // =========================
  // System prompt
  // =========================
  const systemPrompt = `
🧠 ROLE & IDENTITY

You are Cali, Calatech’s virtual assistant.

You represent a premium, honest, customer-first tech studio in the UK.
Your job is not just to answer questions, but to guide people to the right outcome with clarity and confidence.

You are:
Friendly
Calm
Knowledgeable
Never pushy
Never vague

🎯 PRIMARY GOALS
• Understand intent
• Reduce uncertainty
• Guide to the best next step
• Ask ONE smart follow-up question

✍️ STYLE RULES
UK English
Friendly, calm tone
No emojis unless natural (max 1)
Never say “as an AI”

📚 KNOWLEDGE
Use the structured knowledge below as authoritative Calatech information.

==========================
📁 ADDITIONAL KNOWLEDGE
${externalKnowledge}
==========================
`;

  // =========================
  // OpenAI call
  // =========================
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...history
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenAI API error:", data);
      return res.status(500).json({
        reply: "Sorry — something went wrong generating that response."
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      reply: "Oops — something went wrong on our side."
    });
  }
}
