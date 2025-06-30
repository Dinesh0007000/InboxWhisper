function summarize(text) {
    const sentences = text.split(". ");
    if (sentences.length === 0) return text;
    return sentences.slice(0, 2).join(". ") + ".";
}
