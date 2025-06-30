async function translateText(text, targetLang = "en") {
    if (targetLang === "en") return text;

    try {
        const response = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: targetLang,
                format: "text"
            })
        });

        const data = await response.json();
        return data.translatedText;
    } catch (err) {
        console.error("Translation error:", err);
        return text; // fallback
    }
}
