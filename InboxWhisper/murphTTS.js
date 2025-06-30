function speakWithMurph(text, onComplete = () => { }) {
    // Fetch user-preferred language from Chrome storage
    chrome.storage.sync.get(["preferredLang"], ({ preferredLang }) => {
        const voice = preferredLang || "en-US"; // default fallback

        // Send message to background.js for API fetch
        chrome.runtime.sendMessage(
            {
                type: "MURPH_TTS",
                text: text,
                voice: voice
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Murph error:", chrome.runtime.lastError.message);
                    return;
                }

                if (response?.success) {
                    const audio = new Audio(response.audioUrl);
                    audio.autoplay = true;
                    audio.play()
                        .then(() => {
                            audio.onended = onComplete;
                        })
                        .catch(err => {
                            console.error("Audio playback failed:", err);
                        });
                } else {
                    console.error("Murph API failed:", response?.error);
                }
            }
        );
    });
}
