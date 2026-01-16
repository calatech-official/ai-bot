// === Cali AI ChatBot UI - Enhanced Version ===
const style = document.createElement('style');
style.innerHTML = `
  #calatech-chatbot-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    color: white;
    padding: 14px 24px;
    border-radius: 9999px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  #calatech-chatbot-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  }
  #calatech-chatbot-button .notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #ff4444;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 11px;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  #calatech-chatbot-window {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 380px;
    max-height: 600px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    display: none;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
    z-index: 9999;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    overflow: hidden;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  #calatech-chat-header {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    color: white;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #444;
  }
  #calatech-chat-header-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  #calatech-chat-header-title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  #calatech-chat-header-title p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
  }
  #calatech-close-button {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: background 0.2s;
  }
  #calatech-close-button:hover {
    background: rgba(255,255,255,0.1);
  }
  #calatech-chat-messages {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #f9fafb;
  }
  #calatech-chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  #calatech-chat-messages::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  .chat-bubble {
    padding: 12px 16px;
    border-radius: 16px;
    margin-bottom: 8px;
    max-width: 80%;
    word-wrap: break-word;
    line-height: 1.5;
    position: relative;
    opacity: 0;
    animation: fadeInUp 0.4s ease forwards;
  }
  .chat-bubble.user {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    color: white;
    align-self: flex-end;
    text-align: left;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .chat-bubble.bot {
    background: white;
    color: #1a1a1a;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .chat-bubble strong {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    opacity: 0.7;
    font-weight: 600;
  }
  .chat-bubble.user strong {
    opacity: 0.85;
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    align-self: flex-start;
    max-width: 80px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .typing-dots {
    display: inline-flex;
    gap: 4px;
  }
  .typing-dots span {
    display: block;
    width: 8px;
    height: 8px;
    background: #888;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }
  .typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.6;
    }
    30% {
      transform: translateY(-8px);
      opacity: 1;
    }
  }
  #calatech-chat-input-area {
    display: flex;
    gap: 10px;
    border-top: 1px solid #e5e7eb;
    padding: 16px;
    background: white;
  }
  #calatech-chat-input {
    flex: 1;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
  }
  #calatech-chat-input:focus {
    border-color: #2d2d2d;
  }
  #calatech-send-button {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    min-width: 70px;
  }
  #calatech-send-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  #calatech-send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  .chat-bubble a {
    color: #2563eb;
    text-decoration: underline;
    word-break: break-word;
    transition: color 0.2s;
  }
  .chat-bubble a:hover {
    color: #1e40af;
  }
  .chat-bubble.user a {
    color: #93c5fd;
  }
  .chat-bubble.user a:hover {
    color: #bfdbfe;
  }
  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px 16px;
    background: #f9fafb;
  }
  .quick-action-btn {
    background: white;
    border: 1px solid #e5e7eb;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    color: #374151;
    font-weight: 500;
  }
  .quick-action-btn:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  @media (max-width: 480px) {
    #calatech-chatbot-window {
      width: calc(100vw - 40px);
      max-height: 500px;
    }
  }
`;
document.head.appendChild(style);

// === Chatbot Elements ===
const button = document.createElement("div");
button.id = "calatech-chatbot-button";
button.innerHTML = `
  <span>💬</span>
  <span>Chat with Cali</span>
  <span class="notification-badge">1</span>
`;

const chatWindow = document.createElement("div");
chatWindow.id = "calatech-chatbot-window";
chatWindow.innerHTML = `
  <div id="calatech-chat-header">
    <div id="calatech-chat-header-title">
      <h3>Cali AI Assistant</h3>
      <p>Online now</p>
    </div>
    <button id="calatech-close-button">×</button>
  </div>
  <div id="calatech-chat-messages"></div>
  <div class="quick-actions" id="quick-actions-container"></div>
  <div id="calatech-chat-input-area">
    <input id="calatech-chat-input" placeholder="Ask me anything..." />
    <button id="calatech-send-button">Send</button>
  </div>
`;

document.body.appendChild(button);
document.body.appendChild(chatWindow);

// === Quick Action Buttons ===
const quickActions = [
  "Phone repairs",
  "Trade-in value",
  "Store hours",
  "Contact support"
];

const quickActionsContainer = document.getElementById("quick-actions-container");

const showQuickActions = () => {
  quickActionsContainer.innerHTML = '';
  quickActions.forEach(action => {
    const btn = document.createElement("button");
    btn.className = "quick-action-btn";
    btn.textContent = action;
    btn.onclick = () => {
      input.value = action;
      send.click();
      quickActionsContainer.style.display = 'none';
    };
    quickActionsContainer.appendChild(btn);
  });
};

// === Toggle Chat Window ===
const toggleChat = (show) => {
  chatWindow.style.display = show ? "flex" : "none";
  
  if (show) {
    const badge = button.querySelector('.notification-badge');
    badge.style.display = 'none';
    
    if (!sessionStorage.getItem("calatechChatWelcomed")) {
      setTimeout(() => {
        appendMessage(
          "Cali AI",
          "Hey there! 👋 I'm Cali, Calatech's virtual assistant. Ask me anything about our phones, repairs, trade-ins, or support — I'm here to help!"
        );
        showQuickActions();
      }, 300);
      sessionStorage.setItem("calatechChatWelcomed", "true");
    }
    
    input.focus();
  }
};

button.onclick = () => toggleChat(chatWindow.style.display === "none");
document.getElementById("calatech-close-button").onclick = () => toggleChat(false);

// === Message Handlers ===
const messages = document.getElementById("calatech-chat-messages");
const input = document.getElementById("calatech-chat-input");
const send = document.getElementById("calatech-send-button");
const conversationHistory = [];

const appendMessage = (sender, text, isTyping = false) => {
  if (isTyping) {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `
      <span class="typing-dots">
        <span></span><span></span><span></span>
      </span>
    `;
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight;
    return typingIndicator;
  }

  const message = document.createElement("div");
  message.className = sender === "You" ? "chat-bubble user" : "chat-bubble bot";

  const formattedText = text
    .replace(/\n/g, "<br>")
    .replace(/(mailto:[\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, m =>
      `<a href="${m}" target="_blank">${m.replace("mailto:", "")}</a>`
    )
    .replace(/(?<!href="mailto:)([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, e =>
      `<a href="mailto:${e}" target="_blank">${e}</a>`
    )
    .replace(/(?<!href=")(https?:\/\/[^\s<]+|\/[^\s<]+)/g, url => {
      const full = url.startsWith("http")
        ? url
        : `https://www.calatech.co.uk${url}`;
      return `<a href="${full}" target="_blank">${url}</a>`;
    });

  message.innerHTML = `<strong>${sender}</strong>${formattedText}`;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
};

// === Send & Fetch AI Response ===
const callGPT = async (userMessage) => {
  appendMessage("You", userMessage);
  conversationHistory.push({ role: "user", content: userMessage });
  
  // Hide quick actions after first message
  quickActionsContainer.style.display = 'none';

  // Limit history to last 12 messages
  if (conversationHistory.length > 12) {
    conversationHistory.splice(0, conversationHistory.length - 12);
  }

  send.disabled = true;
  input.disabled = true;
  const typingIndicator = appendMessage("Cali AI", "", true);

  try {
    const response = await fetch("https://ai-bot-gdpv.vercel.app/api/chat.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: conversationHistory })
    });

    const data = await response.json();
    messages.removeChild(typingIndicator);
    appendMessage("Cali AI", data.reply);
    conversationHistory.push({ role: "assistant", content: data.reply });
  } catch (err) {
    messages.removeChild(typingIndicator);
    appendMessage("Cali AI", "Sorry — something went wrong. Please try again or contact support at support@calatech.co.uk");
    console.error('Chatbot error:', err);
  }

  send.disabled = false;
  input.disabled = false;
  input.focus();
};

send.onclick = () => {
  const userMessage = input.value.trim();
  if (userMessage) {
    input.value = "";
    callGPT(userMessage);
  }
};

// === Enter to Send ===
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send.click();
  }
});

// === Show notification badge on first load ===
if (!sessionStorage.getItem("calatechChatSeen")) {
  setTimeout(() => {
    const badge = button.querySelector('.notification-badge');
    badge.style.display = 'flex';
    sessionStorage.setItem("calatechChatSeen", "true");
  }, 3000);
}
