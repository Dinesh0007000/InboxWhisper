function listenForYes(callback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Speech recognition not supported.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("User said:", transcript);
        if (transcript.includes("yes")) {
            callback();
        }
    };

    recognition.onerror = (e) => {
        console.error("Voice recognition error:", e);
    };
}
