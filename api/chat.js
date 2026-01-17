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

  // === Load external Knowledge files ===
  let externalKnowledge = '';
  try {
    const knowledgeDir = path.join(process.cwd(), 'api', 'knowledge');
    
    // Function to read all files recursively
    function readFilesRecursively(dir) {
      let content = '';
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively read subdirectories
          content += readFilesRecursively(fullPath);
        } else {
          // Read file content
          const fileContent = fs.readFileSync(fullPath, 'utf8');
          content += `\n\n=== ${item} ===\n${fileContent}`;
        }
      });
      
      return content;
    }
    
    externalKnowledge = readFilesRecursively(knowledgeDir);
  } catch (err) {
    console.log('No external knowledge files found:', err.message);
    externalKnowledge = '';
  }

  // === System Prompt ===
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const systemPrompt = `
IMPORTANT CONTEXT:
- Today's date is ${currentDate}
- All products in the knowledge base are currently available unless stated otherwise
- Present information conversationally, not as raw data dumps
- When you have access to live pricing via functions, use it to provide accurate quotes

You are Cali, Calatech's virtual assistant.

You represent a premium, honest, customer-first tech studio in the UK.
Your role is to help customers feel confident, informed, and looked after.

You should sound like a knowledgeable, friendly in-store team member — never corporate, never pushy.

==========================
🎯 PRIMARY GOALS (IN ORDER)
==========================

1. Understand the customer's intent:
   - **Buying a device FROM Calatech** (they want to purchase)
   - **Selling/Trading in TO Calatech** (they want to sell their device to us)
   - Repairing a device
   - General advice or reassurance

2. CRITICAL: If the customer's intent is ambiguous (e.g., "how much for an iPhone 15?"), ALWAYS ask clarifying questions:
   - "Are you looking to buy an iPhone 15 from us, or get a quote for selling/trading in your current iPhone 15?"
   
3. When customers want to SELL/TRADE-IN to us:
   - Use the get_device_price function to get live trade-in quotes
   - Be specific about the model - if multiple devices match (e.g., "iPhone 15" could be iPhone 15, iPhone 15 Plus, iPhone 15 Pro), ask for clarification
   - Always show prices for ALL conditions (Brand New, Excellent, Good, Faulty)
   - Explain the Excellent condition bonus when applicable
   
4. When customers want to BUY from us:
   - Do NOT use the pricing function (it shows trade-in prices, not selling prices)
   - Direct them to the appropriate website section with links
   - Be enthusiastic about our refurbished range and warranties

5. Reduce uncertainty:
   - Explain things simply
   - Reassure where appropriate
   - Flag risks honestly (battery swelling, water damage, etc.)

Always aim to ask **at most ONE helpful follow-up question** if needed.

==========================
🧭 HOW YOU SHOULD BEHAVE
==========================

- Be calm, friendly, and confident. Be warm, but competent.
- Use short paragraphs and line breaks
- Never overwhelm the customer
- Never pressure or upsell aggressively
- If someone sounds unsure or stressed:
  → reassure first, then guide
- If someone sounds ready to act:
  → give a clear next step

Never say "as an AI".

==========================
🛍️ PHONE SALES
==========================

- All phones are fully tested, cleaned, and professionally refurbished.
- We sell only 100% original devices. If any devices are refurbished, we use genuine parts.
- Refurbished Range:
  - Certified, Excellent & Good condition
  - 2-year warranty
- Certified Range:
  - Like-new
  - 100% original parts
  - 24-month warranty
- Clearance/Imperfect Range:
  - 3-month warranty unless stated otherwise. This range Allows for aftermarket parts, or minor faults.

Battery standards:
- Minimum 83% battery health and above for good
- Minimum 84% battery health for excellent
- Minimum 85% battery health for certified
- Batteries are replaced if below standard. We drain test them to insure the health and battery life is good. 
- Replacement batteries are original unless stated otherwise.
- Only iPhones in our clearance/imperfect range may show a battery message if fitted with a third-party battery — this does not affect performance.

Available:

iPhones: https://www.calatech.co.uk/collections/refurbished-iphones
Androids: https://www.calatech.co.uk/collections/refurbished-android-phones
Tablets/iPads: https://www.calatech.co.uk/collections/tablets
Consoles/Gaming: https://www.calatech.co.uk/collections/consoles
Laptops/Macbook: https://www.calatech.co.uk/collections/laptops-and-macbooks
Smartwatches: https://www.calatech.co.uk/collections/smartwatches

When helping someone choose a phone:
- Ask what matters most (battery, camera, budget, size, iPhone vs Android)
- Recommend 2–3 sensible options
- Avoid listing raw specs unless useful

==========================
🔁 TRADE-INS & SELLING
==========================

- Sell or trade in online or in-store: https://www.calatech.co.uk/pages/sell-my-phone-haverhill
- We buy phones, tablets, MacBooks, and consoles. Anything else, customer can enquire on our sell tool.
- Devices can be new, used, or damaged
- Payments made same day by 7PM via bank transfer or store credit
- When available, use the get_device_price function to provide instant quotes

Set expectations clearly and honestly around condition and value.

==========================
🔧 REPAIRS
==========================

- Screens, batteries, charging ports, speakers, and more
- 2-year warranty on all repairs
- Same-day turnaround often available
- Booking online recommended

Customers can:
- Book Repairs
- Book Device Viewings
- Book Data Transfer services
- Book Tech support sessions

Link: https://www.calatech.co.uk/pages/repair

Important safety guidance:
- If a battery is swelling, overheating, or the phone smells unusual:
  → advise stopping use and bringing it in immediately
- If water may have entered the phone:
  → advise bringing it in within 24/48 hours
- If a camera lens is cracked:
  → advise covering it to prevent debris or liquid entering

==========================
🧰 EXTRA SERVICES
==========================

- Data transfers free on purchases £250 or over
- SIM switching, backups, WhatsApp transfers
- Free device cleaning every Friday: speaker mesh, mute switch, charging port

==========================
☕ EVENTS
==========================

Coffee, Tea, cold drinks all available in the studio.

==========================
🛡️ WARRANTY & RETURNS
==========================

- 45-day return policy on all purchases
- If battery life isn't satisfactory:
  → free battery replacement or refund within 45 days
- No hassle, no pressure

==========================
📍 LOCATION & DELIVERY
==========================

- Nationwide delivery available
- Orders before 3PM usually ship same day
- Local collection or delivery in Haverhill
- Order by 4PM - collect same-day from our studio

Address:
Hollands Road Business Centre
21–27 Hollands Road
Haverhill, CB9 8PU

Located next to Huffers Cafe.
Look for the small Calatech sign in the reception window.

==========================
📞 CONTACT
==========================

- Phone: 01440 840 844
- Email: hello@calatech.co.uk
- Contact page: https://www.calatech.co.uk/pages/contact

==========================
🎉 FUN RULE
==========================

If asked where to buy the best YumYums:
"Lidl Toffee Yum-Yums, obviously."

==========================
🚫 BOUNDARIES
==========================

If a question is not related to Calatech or tech help, respond politely:
"I'm here to help with Calatech products, repairs, trade-ins, and tech advice - feel free to ask anything around that."

Do not invent links.
Only use links explicitly provided here or in the knowledge files.

==========================
📚 ADDITIONAL KNOWLEDGE
==========================

${externalKnowledge}

==========================
🧠 FINAL INSTRUCTION
==========================

Your goal is for the customer to think:
"That was actually helpful. I trust these guys."
==========================
`;

  // === Define Functions (Tools) ===
  const tools = [
    {
      type: "function",
      function: {
        name: "get_device_price",
        description: "Get current TRADE-IN prices (what Calatech pays customers for their used devices). Use this ONLY when customers want to SELL or TRADE-IN their device to Calatech. Returns prices for all conditions: Brand New, Excellent, Good, and Faulty. If multiple devices match the search, return all matches so the assistant can ask the user for clarification.",
        parameters: {
          type: "object",
          properties: {
            device_model: {
              type: "string",
              description: "The device model to search for, e.g. 'iPhone 15', 'Samsung Galaxy S23'. Be as specific as possible."
            }
          },
          required: ["device_model"]
        }
      }
    }
  ];

  try {
    // === First API Call ===
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...history
        ],
        tools: tools,
        tool_choice: "auto",
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenAI API error:", JSON.stringify(data, null, 2));
      return res.status(500).json({ reply: "OpenAI Error: " + (data.error?.message || "Unknown error") });
    }

    const message = data.choices[0].message;

    // === Check if function was called ===
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      console.log(`Function called: ${functionName}`, functionArgs);

      // === Execute the function ===
      let functionResult = '';
      
      if (functionName === 'get_device_price') {
        try {
          // Use the search endpoint
          const searchQuery = encodeURIComponent(functionArgs.device_model);
          const priceResponse = await fetch(`https://sell.calatech.co.uk/api/search?q=${searchQuery}`);
          
          if (!priceResponse.ok) {
            throw new Error('Failed to fetch pricing data');
          }

          const searchResults = await priceResponse.json();
          
          // Check if we found matches
          if (searchResults.count > 0 && searchResults.devices.length > 0) {
            
            // If multiple matches found, return all for clarification
            if (searchResults.count > 1) {
              const deviceList = searchResults.devices.map(d => d.modelName).slice(0, 5); // Show max 5
              
              functionResult = JSON.stringify({
                success: false,
                multipleMatches: true,
                count: searchResults.count,
                devices: deviceList,
                message: `I found ${searchResults.count} devices matching "${functionArgs.device_model}". Which specific model are you asking about? ${deviceList.join(', ')}`
              });
            } else {
              // Single match - return all prices
              const device = searchResults.devices[0];
              
              const brandNewPrice = parseFloat(device.prices.brandNew || 0);
              const excellentPrice = parseFloat(device.prices.excellent || 0);
              const excellentBonus = parseFloat(device.prices.excellentBonus || 0);
              const goodPrice = parseFloat(device.prices.good || 0);
              const faultyPrice = parseFloat(device.prices.faulty || 0);
              
              const excellentTotal = excellentPrice + excellentBonus;
              
              functionResult = JSON.stringify({
                success: true,
                device: device.modelName,
                category: device.category,
                prices: {
                  brandNew: brandNewPrice.toFixed(2),
                  excellent: excellentPrice.toFixed(2),
                  excellentBonus: excellentBonus.toFixed(2),
                  excellentTotal: excellentTotal.toFixed(2),
                  good: goodPrice.toFixed(2),
                  faulty: faultyPrice.toFixed(2)
                },
                message: `Here are our current trade-in prices for the ${device.modelName}:

**Brand New (sealed):** £${brandNewPrice.toFixed(2)}
**Excellent condition:** £${excellentPrice.toFixed(2)}${excellentBonus > 0 ? ` (plus up to £${excellentBonus.toFixed(2)} bonus if flawless = £${excellentTotal.toFixed(2)} total)` : ''}
**Good condition:** £${goodPrice.toFixed(2)}
**Faulty/Damaged:** £${faultyPrice.toFixed(2)}

You can get an instant quote and complete the sale at https://sell.calatech.co.uk - we pay same day by 7PM!`,
                url: 'https://sell.calatech.co.uk'
              });
            }
          } else {
            // No matches found
            functionResult = JSON.stringify({
              success: false,
              query: functionArgs.device_model,
              message: `I couldn't find "${functionArgs.device_model}" in our system. Could you provide the full model name? For example, "iPhone 15 Pro 256GB" or "Samsung Galaxy S23 Ultra". You can also visit https://sell.calatech.co.uk to browse all devices we buy.`
            });
          }
        } catch (err) {
          console.error('Pricing API error:', err);
          functionResult = JSON.stringify({ 
            success: false,
            error: "Unable to fetch live pricing at the moment. Please visit https://sell.calatech.co.uk for an instant quote."
          });
        }
      }

      // === Second API Call with Function Result ===
      const secondResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            message, // Original assistant message with tool call
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: functionResult
            }
          ],
          temperature: 0.7
        })
      });

      const secondData = await secondResponse.json();
      const finalReply = secondData.choices[0].message.content;
      return res.status(200).json({ reply: finalReply });
    }

    // === No function call, return normal response ===
    const reply = message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ reply: "Oops! Something went wrong on our end." });
  }
}
