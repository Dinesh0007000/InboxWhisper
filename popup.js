document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarize-btn');
    const playBtn = document.getElementById('play-btn');
    const voiceSelect = document.getElementById('voice-select');
    const languageSelect = document.getElementById('language-select');
    const emotionalResponseCheckbox = document.getElementById('emotional-response');
    const summaryContent = document.getElementById('summary-content');

    let summary = '';

    // Synchronize voice selection with language
    function updateVoiceSelect() {
        const selectedLang = languageSelect.value;
        Array.from(voiceSelect.options).forEach(option => {
            option.style.display = option.getAttribute('data-lang') === selectedLang ? 'block' : 'none';
        });
        voiceSelect.value = Array.from(voiceSelect.options).find(
            option => option.style.display === 'block'
        ).value;
    }

    languageSelect.addEventListener('change', updateVoiceSelect);
    updateVoiceSelect(); // Initialize voice selection

    async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    let message = `HTTP error! Status: ${response.status}`;
                    if (response.status === 401) message = 'Invalid API key';
                    if (response.status === 402) message = 'Insufficient credits';
                    if (response.status === 429) message = 'Rate limit exceeded';
                    if (response.status === 400) message = 'Invalid model ID or request';
                    throw new Error(message);
                }
                return await response.json();
            } catch (error) {
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw error;
            }
        }
    }

    summarizeBtn.addEventListener('click', async () => {
        summarizeBtn.disabled = true;
        summaryContent.textContent = 'Extracting email content...';

        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs[0]?.url.includes('mail.google.com')) {
                summaryContent.textContent = 'Please open an email in Gmail.';
                chrome.storage.local.set({ lastError: 'Not on Gmail page.' });
                summarizeBtn.disabled = false;
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, { action: 'getEmailContent' }, async (response) => {
                if (chrome.runtime.lastError || response.error) {
                    summaryContent.textContent = response.error || 'Error accessing email content.';
                    chrome.storage.local.set({ lastError: response.error || 'Content script error.' });
                    summarizeBtn.disabled = false;
                    return;
                }

                const emailContent = response.emailContent;
                if (!emailContent) {
                    summaryContent.textContent = 'No email content found. Try another email.';
                    chrome.storage.local.set({ lastError: 'Empty email content.' });
                    summarizeBtn.disabled = false;
                    return;
                }

                summaryContent.textContent = 'Analyzing sentiment and summarizing...';

                const models = ['mistralai/mixtral-8x7b-instruct', 'openchat/openchat-7b:free'];
                let data = null;
                let sentiment = null;
                let lastError = null;

                // Sentiment Analysis
                for (const model of models) {
                    try {
                        const sentimentResponse = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer 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',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: model,
                                messages: [
                                    { role: 'system', content: 'Analyze the email for emotions like regret, rejection, or disappointment. Return the detected emotion and a confidence score (0-1). If none, return "neutral".' },
                                    { role: 'user', content: emailContent }
                                ]
                            })
                        }, 3, 1000);
                        sentiment = sentimentResponse.choices[0].message.content;
                        break;
                    } catch (error) {
                        lastError = error;
                        if (model === models[models.length - 1]) {
                            summaryContent.textContent = `Sentiment analysis failed: ${error.message}`;
                            chrome.storage.local.set({ lastError: `Sentiment analysis error: ${error.message}` });
                            summarizeBtn.disabled = false;
                            return;
                        }
                    }
                }

                // Summarization
                for (const model of models) {
                    try {
                        const langMap = {
                            'en-US': 'English',
                            'hi-IN': 'Hindi',
                            'ta-IN': 'Tamil',
                            'bn-IN': 'Bengali',
                            'it-IT': 'Italian',
                            'es-ES': 'Spanish'
                        };
                        const summaryPrompt = `Summarize the following email content concisely in 2-3 sentences in ${langMap[languageSelect.value]}. Focus on the main points. ${emotionalResponseCheckbox.checked && (sentiment.includes('regret') || sentiment.includes('rejection') || sentiment.includes('disappointment'))
                                ? `Append a concise, professional empathetic response in ${langMap[languageSelect.value]} (e.g., for Hindi: "हमें खेद है कि यह परिणाम निराशाजनक हो सकता है। अगले कदमों के लिए हम आपकी मदद कर सकते हैं।").`
                                : ''
                            }`;
                        data = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer YOUR_OPEN_ROUTER_KEY',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: model,
                                messages: [
                                    { role: 'system', content: summaryPrompt },
                                    { role: 'user', content: emailContent }
                                ]
                            })
                        }, 3, 1000);
                        break;
                    } catch (error) {
                        lastError = error;
                        if (model === models[models.length - 1]) {
                            summaryContent.textContent = `Summarization failed: ${error.message}`;
                            chrome.storage.local.set({ lastError: `Summarization error: ${error.message}` });
                            summarizeBtn.disabled = false;
                            return;
                        }
                    }
                }

                try {
                    summary = data.choices[0].message.content;
                    summaryContent.textContent = summary;
                    playBtn.disabled = false;
                } catch (error) {
                    summaryContent.textContent = 'Error processing summary response.';
                    chrome.storage.local.set({ lastError: 'Summary response error: ' + error.message });
                } finally {
                    summarizeBtn.disabled = false;
                }
            });
        });
    });

    playBtn.addEventListener('click', async () => {
        playBtn.disabled = true;
        try {
            const voiceStyle = (summary.includes('disappointing') || summary.includes('sorry') || summary.includes('खेद') || summary.includes('துஃக') || summary.includes('দুঃখিত')) ? 'Sad' : 'Conversational';
            const data = await fetchWithRetry('https://api.murf.ai/v1/speech/generate', {
                method: 'POST',
                headers: {
                    'api-key': 'YOUR_MURPH_API_KEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    voiceId: voiceSelect.value,
                    text: summary,
                    format: 'MP3',
                    style: voiceStyle
                })
            }, 3, 1000);

            const audio = new Audio(data.audioFile);
            audio.play();
            audio.onended = () => {
                playBtn.disabled = false;
            };
        } catch (error) {
            summaryContent.textContent = `Audio generation failed: ${error.message}`;
            chrome.storage.local.set({ lastError: `Audio error: ${error.message}` });
            console.error('Audio generation error:', error);
            playBtn.disabled = false;
        }
    });
});
