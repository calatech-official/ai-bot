(() => {
  console.log("🔥 Calatech chatbot script LOADED");

  function init() {
    console.log("🚀 Initialising chatbot UI");

    if (document.getElementById("calatech-chatbot-button")) return;

    // BUTTON
    const btn = document.createElement("button");
    btn.id = "calatech-chatbot-button";
    btn.innerText = "Ask Cali AI";

    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "14px 18px",
      borderRadius: "999px",
      border: "none",
      background: "#111",
      color: "#fff",
      fontSize: "14px",
      cursor: "pointer",
      zIndex: "999999"
    });

    btn.onclick = () => alert("Chatbot UI alive ✅");

    document.body.appendChild(btn);
    console.log("✅ Chatbot button injected");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // expose for console testing
  window.CalatechChatbot = { init };
})();
