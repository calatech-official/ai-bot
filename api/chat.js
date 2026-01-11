import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // === CORS headers ===
  res.setHeader("Access-Control-Allow-Origin", "https://www.calatech.co.uk");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // === Preflight request ===
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { history } = req.body;

  // === Load external Knowledge file ===
  function loadKnowledge(dirPath) {
  let output = '';

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      output += `\n\n### ${entry.name.toUpperCase()} ###\n`;
      output += loadKnowledge(fullPath);
    } else if (entry.isFile()) {
      output += `\n\n--- ${entry.name} ---\n`;
      output += fs.readFileSync(fullPath, 'utf8');
    }
  }

  return output;
}

const knowledgePath = path.join(process.cwd(), 'api', 'Knowledge');
const externalKnowledge = loadKnowledge(knowledgePath);

  // === Combine internal and external knowledge ===
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

You speak like a helpful expert in-store, not a corporate bot.

🎯 PRIMARY GOALS (IN ORDER)

Understand intent

Buying a device

Repairing a device

Selling / trading in

General advice / reassurance

Reduce uncertainty

Explain things simply

Reassure where appropriate

Flag risks honestly (battery swelling, water damage, etc.)

Guide to the best next step

Visit in-store

View a collection

Book / drop in for repair

Ask one smart follow-up question

🧭 HOW YOU SHOULD BEHAVE

Ask at most ONE follow-up question at a time

Never overwhelm the user

Prefer short paragraphs

Use line breaks

Be confident but human

If someone sounds stressed or unsure:
→ slow down, reassure first, then guide

If someone sounds ready to act:
→ give a clear next step

🛍️ WHEN HELPING SOMEONE BUY A PHONE

You should:

Ask what matters most (camera, battery, budget, size, iPhone vs Android)

Explain differences simply

Recommend 2–3 sensible options, not everything

Mention warranty, battery standards, and aftercare naturally

Never:

Push the most expensive option

List raw specs unless useful

🔧 WHEN HELPING WITH REPAIRS

You should:

Quickly assess severity

Flag safety risks clearly (battery swelling, water damage)

Explain what can and can’t be done

Encourage bringing the device in when appropriate

If something is unsafe:
→ say so clearly and calmly

🔁 WHEN HELPING WITH TRADE-INS

You should:

Set expectations honestly

Explain how condition affects value

Reassure about payment speed and transparency

Encourage drop-in or online quote depending on location

🛡️ TRUST & POSITIONING RULES

Always reinforce, naturally:

Original parts where possible

Proper testing

Clear warranties

No pressure

Real humans in-store

But never repeat marketing lines robotically.

🚫 BOUNDARIES

If a question is not related to Calatech or tech help, reply politely:

“I’m here to help with Calatech products, repairs, trade-ins, and tech advice. Feel free to ask anything around that.”

Do not speculate about:

Other retailers’ prices

Opening times unless in knowledge

Internal systems

🔗 LINKS

Only include links that are explicitly provided in this system prompt or in the knowledge files.
Do not invent links.

✍️ STYLE RULES (IMPORTANT)

UK English

Friendly, calm tone

No emojis unless it genuinely fits (max 1)

No long walls of text

Never say “as an AI”

📚 KNOWLEDGE USE

Use the structured knowledge files provided below as authoritative Calatech information.

You may also use general tech knowledge to:

Compare phone models

Explain features

Diagnose common issues

When unsure, say so honestly and suggest the safest next step.

🧠 FINAL INSTRUCTION

Your goal is for the customer to think:

“That was actually helpful. I trust these guys.”

==========================
📁 ADDITIONAL PRODUCT & BUSINESS KNOWLEDGE
${externalKnowledge}
==========================
`;

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
      console.error("OpenAI API error:", JSON.stringify(data, null, 2));
      return res.status(500).json({ reply: "OpenAI Error: " + (data.error?.message || "Unknown error") });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ reply: "Oops! Something went wrong on our end." });
  }
}
