console.log("✅ InboxWhisper loaded");

// 🔁 Detect Gmail Email Open Dynamically
const observer = new MutationObserver(() => {
    const subjectElement = document.querySelector("h2.hP");
    const bodyElement = document.querySelector("div.a3s.aiL");

    if (subjectElement && bodyElement) {
        const subject = subjectElement.innerText.trim();
        const body = bodyElement.innerText.trim();

        if (!document.getElementById("inbox-whisper-btn")) {
            createReadButton(subject, body);
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// 🔊 Create Interactive Read Button
function createReadButton(subject, body) {
    const btn = document.createElement("button");
    btn.id = "inbox-whisper-btn";
    btn.innerText = "🎙️ Read Mail Summary";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = 9999;
    btn.style.padding = "12px 16px";
    btn.style.backgroundColor = "#6200ea";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "bold";
    btn.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";

    btn.addEventListener("click", () => {
        console.log("🎯 Button clicked!");

        chrome.runtime.sendMessage({
            type: "OPENROUTER_SUMMARIZE",
            text: `Subject: ${subject}. Body: ${body}`
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("❌ Chrome message error:", chrome.runtime.lastError.message);
                return;
            }

            if (response && response.success) {
                const summaryText = response.summary;
                console.log("🗣️ Speaking summary:", summaryText); // ✅ Add this
                const audio = new SpeechSynthesisUtterance(summaryText);
                window.speechSynthesis.speak(audio);
            }
            else {
                console.error("❌ Summary failed:", response?.error || "No summary returned.");
            }
        });

    });

    document.body.appendChild(btn);
}
