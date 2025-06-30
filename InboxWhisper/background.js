chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "OPENROUTER_SUMMARIZE") {
        const apiKey = "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"; // your OpenRouter key

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
