function detectEmotion(text) {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    return result.score < -2 ? "sad" : result.score > 3 ? "happy" : "neutral";
}
