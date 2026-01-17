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
   - Buying a device
   - Repairing a device
   - Selling / trading in
   - General advice or reassurance

2. Reduce uncertainty:
   - Explain things simply
   - Reassure where appropriate
   - Flag risks honestly (battery swelling, water damage, etc.)

3. Guide to the best next step:
   - View a product or collection on the website
   - Book a repair online
   - Sell or trade in - get a price on our website or use the pricing function if available
   - Contact or visit in-studio

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
        description: "Get the current trade-in or selling price for a device from Calatech's live pricing system. Use this when customers ask 'How much is my device worth?' or want a quote.",
        parameters: {
          type: "object",
          properties: {
            device_model: {
              type: "string",
              description: "The full device model name, e.g. 'iPhone 14 Pro', 'iPhone 13', 'Samsung Galaxy S23 Ultra'"
            },
            storage: {
              type: "string",
              description: "Storage capacity, e.g. '128GB', '256GB', '512GB', '1TB'"
            },
            condition: {
              type: "string",
              enum: ["Brand New", "Excellent", "Good", "Faulty"],
              description: "The physical condition of the device"
            }
          },
          required: ["device_model", "condition"]
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
          // Use the new search endpoint
          const searchQuery = encodeURIComponent(functionArgs.device_model);
          const priceResponse = await fetch(`https://sell.calatech.co.uk/api/search?q=${searchQuery}`);
          
          if (!priceResponse.ok) {
            throw new Error('Failed to fetch pricing data');
          }

          const searchResults = await priceResponse.json();
          
          // Check if we found any matches
          if (searchResults.count > 0 && searchResults.devices.length > 0) {
            const device = searchResults.devices[0]; // Use first match
            const condition = functionArgs.condition;
            
            // Map condition to API field names
            const conditionMap = {
              'Brand New': 'brandNew',
              'Excellent': 'excellent',
              'Good': 'good',
              'Faulty': 'faulty'
            };
            
            const priceField = conditionMap[condition];
            const price = parseFloat(device.prices[priceField]);
            const bonus = condition === 'Excellent' ? parseFloat(device.prices.excellentBonus || 0) : 0;
            const totalPrice = price + bonus;
            
            let message = '';
            if (price > 0) {
              message = `We can offer £${price.toFixed(2)} for a ${condition} ${device.modelName}`;
              if (bonus > 0) {
                message += `. Plus, if the condition is flawless, we'll add an extra £${bonus.toFixed(2)} bonus, making it £${totalPrice.toFixed(2)} total!`;
              }
            } else {
              message = `Unfortunately, we're not currently buying ${condition} ${device.modelName} devices.`;
            }
            
            functionResult = JSON.stringify({
              success: true,
              device: device.modelName,
              category: device.category,
              condition: condition,
              basePrice: price.toFixed(2),
              bonus: bonus.toFixed(2),
              totalPrice: totalPrice.toFixed(2),
              storage: functionArgs.storage || 'standard',
              message: message,
              url: 'https://sell.calatech.co.uk'
            });
          } else {
            // No matches found
            functionResult = JSON.stringify({
              success: false,
              query: functionArgs.device_model,
              message: `I couldn't find exact pricing for "${functionArgs.device_model}". Please visit https://sell.calatech.co.uk to get an accurate quote, or let me know the specific model (e.g., "iPhone 15 Pro") and I'll try again.`
            });
          }
        } catch (err) {
          console.error('Pricing API error:', err);
          functionResult = JSON.stringify({ 
            success: false,
            error: "Unable to fetch live pricing at the moment. Please visit https://sell.calatech.co.uk for a quote."
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
