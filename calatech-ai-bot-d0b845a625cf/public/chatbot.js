// === Cali Ai ChatBot UI (No Avatar, Clean, Animated, Link/Email Fixes) ===
const style = document.createElement('style');
style.innerHTML = `
  #calatech-chatbot-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #2d2d2d;
    color: white;
    padding: 12px 20px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    transition: background 0.3s ease;
  }
  #calatech-chatbot-button:hover {
    background-color: #1e1e1e;
  }
  #calatech-chatbot-window {
    position: fixed;
    bottom: 70px;
    right: 20px;
    width: 360px;
    max-height: 520px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 16px;
    display: none;
    flex-direction: column;
    font-family: 'Helvetica Neue', sans-serif;
    z-index: 9999;
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    overflow: hidden;
  }
  #calatech-chat-messages {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
  }
  .chat-bubble {
    padding: 10px 14px;
    border-radius: 12px;
    margin-bottom: 12px;
    max-width: 85%;
    word-wrap: break-word;
    line-height: 1.5;
    position: relative;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }
  .chat-bubble.user {
    background: #f1f1f1;
    align-self: flex-end;
    text-align: right;
    border-bottom-right-radius: 2px;
  }
  .chat-bubble.bot {
    background: #e9f5ff;
    align-self: flex-start;
    border-bottom-left-radius: 2px;
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  .typing-dots {
    display: inline-flex;
    gap: 4px;
  }
  .typing-dots span {
    display: block;
    width: 6px;
    height: 6px;
    background: #888;
    border-radius: 50%;
    animation: typing 1.2s infinite ease-in-out;
  }
  .typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  #calatech-chat-input-area {
    display: flex;
    border-top: 1px solid #ddd;
    padding: 8px;
    background: #fafafa;
  }
  #calatech-chat-input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    outline: none;
  }
  #calatech-send-button {
    background: #2d2d2d;
    color: white;
    border: none;
    margin-left: 8px;
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  #calatech-send-button:hover {
    background: #1e1e1e;
  }
  #calatech-send-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  a {
    color: #007bff;
    text-decoration: underline;
    word-break: break-word;
  }
  a:hover {
    text-decoration: none;
  }
`;
document.head.appendChild(style);

// === Chatbot Elements ===
const button = document.createElement("div");
button.id = "calatech-chatbot-button";
button.innerText = "Ask Cali Ai";

const chatWindow = document.createElement("div");
chatWindow.id = "calatech-chatbot-window";
chatWindow.innerHTML = `
  <div id="calatech-chat-messages"></div>
  <div id="calatech-chat-input-area">
    <input id="calatech-chat-input" placeholder="Type your question..." />
    <button id="calatech-send-button">Send</button>
  </div>
`;

document.body.appendChild(button);
document.body.appendChild(chatWindow);

// === Show Welcome Message ===
button.onclick = () => {
  const wasClosed = chatWindow.style.display === "none";
  chatWindow.style.display = wasClosed ? "flex" : "none";

  if (wasClosed && !sessionStorage.getItem("calatechChatWelcomed")) {
    appendMessage(
      "Cali Ai",
      "Hey there! 👋 I'm Cali, Calatech's virtual assistant. Ask me anything about our phones, repairs, trade-ins, or support — I'm here to help!"
    );
    sessionStorage.setItem("calatechChatWelcomed", "true");
  }
};

// === Message Handlers ===
const messages = document.getElementById("calatech-chat-messages");
const input = document.getElementById("calatech-chat-input");
const send = document.getElementById("calatech-send-button");
const conversationHistory = [];

const appendMessage = (sender, text, isTyping = false) => {
  const message = document.createElement("div");
  message.className = sender === "You" ? "chat-bubble user" : "chat-bubble bot";

  if (isTyping) {
    message.innerHTML = `
      <strong>${sender}:</strong>
      <span class="typing-dots">
        <span></span><span></span><span></span>
      </span>
    `;
  } else {
    const formattedText = text
      .replace(/\n/g, "<br>")
      .replace(/(mailto:[\\w.+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g, m =>
        `<a href="${m}" target="_blank">${m.replace("mailto:", "")}</a>`
      )
      .replace(/(?<!href="mailto:)([\\w.+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g, e =>
        `<a href="mailto:${e}" target="_blank">${e}</a>`
      )
      .replace(/(?<!href=")(https?:\\/\\/[^\\s<]+|\\/[^\\s<]+)/g, url => {
        const full = url.startsWith("http")
          ? url
          : `https://www.calatech.co.uk${url}`;
        return `<a href="${full}" target="_blank">${url}</a>`;
      });

    message.innerHTML = `<strong>${sender}:</strong><br>${formattedText}`;
  }

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
};

// === Send & Fetch AI Response ===
const callGPT = async (userMessage) => {
  appendMessage("You", userMessage);
  conversationHistory.push({ role: "user", content: userMessage });

  // Limit history to last 12 messages
  if (conversationHistory.length > 12) {
    conversationHistory.splice(0, conversationHistory.length - 12);
  }

  send.disabled = true;
  const typingBubble = appendMessage("Cali Ai", "", true);

  try {
    const response = await fetch("https://ai-bot-pied.vercel.app/api/chat.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: conversationHistory })
    });

    const data = await response.json();
    messages.removeChild(typingBubble);
    appendMessage("Cali Ai", data.reply);
    conversationHistory.push({ role: "assistant", content: data.reply });
  } catch (err) {
    messages.removeChild(typingBubble);
    appendMessage("Cali Ai", "Sorry — something went wrong. Please try again.");
  }

  send.disabled = false;
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
  if (e.key === "Enter") {
    send.click();
  }
});
