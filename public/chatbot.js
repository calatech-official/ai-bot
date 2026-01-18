// === Cali AI ChatBot - Complete Version with Glassmorphism Styling ===
const style = document.createElement('style');
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  #calatech-chatbot-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #00C38A 0%, #00a575 100%);
    color: white;
    padding: 16px 28px;
    border-radius: 9999px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0, 195, 138, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    backdrop-filter: blur(10px);
  }
  #calatech-chatbot-button:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 195, 138, 0.4);
    background: linear-gradient(135deg, #00d899 0%, #00C38A 100%);
  }
  #calatech-chatbot-button:active {
    transform: translateY(-1px) scale(0.98);
  }
  #calatech-chatbot-button .notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 11px;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    animation: pulse 2s infinite;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  #calatech-chatbot-window {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 400px;
    max-height: 650px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    display: none;
    flex-direction: column;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    z-index: 9999;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  #calatech-chat-header {
    background: linear-gradient(135deg, #00C38A 0%, #00a575 100%);
    color: white;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  #calatech-chat-header-title {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  #calatech-chat-header-title h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }
  #calatech-chat-header-title p {
    margin: 0;
    font-size: 13px;
    opacity: 0.9;
    font-weight: 500;
  }
  #calatech-close-button {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: none;
    color: white;
    font-size: 22px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.2s;
    font-weight: 300;
  }
  #calatech-close-button:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
  #calatech-chat-messages {
    padding: 24px 20px;
    flex: 1;
    overflow-y: auto;
    font-size: 14.5px;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: linear-gradient(to bottom, rgba(247, 250, 252, 0.5), rgba(241, 245, 249, 0.3));
  }
  #calatech-chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  #calatech-chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  #calatech-chat-messages::-webkit-scrollbar-thumb {
    background: rgba(0, 195, 138, 0.2);
    border-radius: 3px;
  }
  #calatech-chat-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 195, 138, 0.3);
  }
  .chat-bubble {
    padding: 14px 18px;
    border-radius: 18px;
    margin-bottom: 10px;
    max-width: 82%;
    word-wrap: break-word;
    line-height: 1.5;
    position: relative;
    opacity: 0;
    animation: fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .chat-bubble.user {
    background: linear-gradient(135deg, #00C38A 0%, #00a575 100%);
    color: white;
    align-self: flex-end;
    text-align: left;
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 195, 138, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .chat-bubble.bot {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    color: #1e293b;
    align-self: flex-start;
    border-bottom-left-radius: 6px;
    border: 1px solid rgba(0, 195, 138, 0.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
  .chat-bubble strong {
    font-weight: 600;
  }
  .chat-bubble > strong:first-child {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    opacity: 0.8;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .chat-bubble.user > strong:first-child {
    opacity: 0.9;
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 195, 138, 0.1);
    border-radius: 18px;
    align-self: flex-start;
    max-width: 90px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
  .typing-dots {
    display: inline-flex;
    gap: 5px;
  }
  .typing-dots span {
    display: block;
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #00C38A, #00a575);
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
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
  #calatech-chat-input-area {
    display: flex;
    gap: 12px;
    border-top: 1px solid rgba(0, 195, 138, 0.1);
    padding: 18px 20px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
  }
  #calatech-chat-input {
    flex: 1;
    border: 2px solid rgba(0, 195, 138, 0.15);
    border-radius: 14px;
    padding: 13px 16px;
    font-size: 14.5px;
    outline: none;
    transition: all 0.2s;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: rgba(255, 255, 255, 0.95);
    color: #1e293b;
  }
  #calatech-chat-input:focus {
    border-color: #00C38A;
    box-shadow: 0 0 0 4px rgba(0, 195, 138, 0.1);
    background: white;
  }
  #calatech-chat-input::placeholder {
    color: #94a3b8;
  }
  #calatech-send-button {
    background: linear-gradient(135deg, #00C38A 0%, #00a575 100%);
    color: white;
    border: none;
    padding: 13px 24px;
    font-size: 14.5px;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    min-width: 75px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 4px 16px rgba(0, 195, 138, 0.2);
  }
  #calatech-send-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 195, 138, 0.3);
    background: linear-gradient(135deg, #00d899 0%, #00C38A 100%);
  }
  #calatech-send-button:active:not(:disabled) {
    transform: translateY(0);
  }
  #calatech-send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  .chat-bubble a {
    color: #00C38A;
    text-decoration: none;
    word-break: break-word;
    transition: all 0.2s;
    font-weight: 600;
    border-bottom: 1px solid rgba(0, 195, 138, 0.3);
  }
  .chat-bubble a:hover {
    color: #00a575;
    border-bottom-color: #00a575;
  }
  .chat-bubble.user a {
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.5);
  }
  .chat-bubble.user a:hover {
    border-bottom-color: white;
  }
  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px 18px;
    background: linear-gradient(to bottom, rgba(241, 245, 249, 0.3), rgba(247, 250, 252, 0.5));
  }
  .quick-action-btn {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 195, 138, 0.2);
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    color: #334155;
    font-weight: 500;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .quick-action-btn:hover {
    background: linear-gradient(135deg, #00C38A 0%, #00a575 100%);
    border-color: #00C38A;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 195, 138, 0.2);
  }
  @media (max-width: 480px) {
    #calatech-chatbot-window {
      width: calc(100vw - 32px);
      max-height: 600px;
      bottom: 80px;
      right: 16px;
    }
    #calatech-chatbot-button {
      bottom: 16px;
      right: 16px;
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

  // Step 1: Escape any existing HTML first
  let formattedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Step 2: Convert markdown to HTML (in order)
  formattedText = formattedText
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Markdown links: [text](url) -> <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Plain URLs with optional punctuation after
    .replace(/(^|[^"'>=])(https?:\/\/[^\s<]+?)([.,;!?)])?(\s|$)/g, (match, before, url, punct, after) => {
      return `${before}<a href="${url}" target="_blank">${url}</a>${punct || ''}${after}`;
    })
    // Relative URLs like /pages/contact
    .replace(/(^|[^"'>=])(\/[a-zA-Z0-9\-_/]+)([.,;!?)])?(\s|$)/g, (match, before, path, punct, after) => {
      const fullUrl = `https://www.calatech.co.uk${path}`;
      return `${before}<a href="${fullUrl}" target="_blank">${path}</a>${punct || ''}${after}`;
    })
    // Email addresses
    .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" target="_blank">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br>');

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
