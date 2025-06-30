chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "OPENROUTER_SUMMARIZE") {
        const apiKey = "YOUR_API_KEY"; // your OpenRouter key

        const prompt = `
Summarize the following email in a maximum of 3 lines. Make it empathetic and friendly like you're explaining to a friend:

${request.text}
        `;

        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",  // safe and works for summarizing
                messages: [
                    { role: "system", content: "You are a helpful assistant that summarizes emails in a kind tone." },
                    { role: "user", content: prompt }
                ]
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("🧪 API response:", data);
                const summary = data.choices?.[0]?.message?.content;
                if (summary) {
                    sendResponse({ success: true, summary });
                } else {
                    sendResponse({ success: false, error: "No summary returned." });
                }
            })
            .catch(err => {
                sendResponse({ success: false, error: err.message });
            });

        return true;
    }
});
