# 📬 InboxWhisper2.0 - Smart Email Voice Reader
InboxWhisper2.0 is a Chrome extension that enhances productivity and accessibility by summarizing Gmail emails and reading them aloud using AI-generated voices. It supports multiple languages, detects emotional tones for empathetic responses, and includes security features to protect sensitive information.

## 🔍 Features
```
🧠 AI-Powered Summarization: Summarizes emails into 2–3 sentences using OpenRouter’s Mistral model (mistralai/mixtral-8x7b-instruct or openchat/openchat-7b:free).
🎙️ Multilingual Text-to-Speech: Reads summaries aloud in six languages (English, Hindi, Tamil, Bengali, Italian, Spanish) using Murf AI’s natural voices (e.g., ta-IN-abirami, bn-IN-anwesha).
😊 Emotional Intelligence: Detects regret, rejection, or disappointment in emails and appends professional, empathetic responses (toggleable) in the selected language.
🔒 Security Protection: Blocks summarization of sensitive emails containing OTPs, passwords, or bank transaction details for user privacy.
✅ Dynamic Email Detection: Automatically extracts content from open Gmail emails using robust DOM selectors.
🔁 Future Enhancements: Planned to make notification level reading.
```

## 🚀 How to Install and Test Locally
```
Prerequisites
A working internet connection.
A Gmail account (extension works on Gmail web).
OpenRouter API key (free tier available at openrouter.ai/keys).
Murf AI API key (sign up at murf.ai for access).
Chrome browser (latest version recommended).
```
```
Installation Steps
Clone the Repository:
git clone https://github.com/Dinesh0007000/InboxWhisper/
cd InboxWhisper
Add API Keys:
Open popup.js in the project folder.
Replace YOUR_NEW_OPENROUTER_API_KEY with your OpenRouter API key.
Replace ap2_f7dc729e-f448-42d8-b93a-3c2580ab7975 with your Murf AI API key (if different).
Security Note: For local testing, keys are safe. For production, use a backend proxy to secure API keys.
Ensure Icons:
Verify icon48.png and icon128.png are in the project folder (download from Flaticon if needed).
Load the Extension:
Open Chrome and navigate to chrome://extensions/.
Enable Developer mode (toggle in the top-right).
Click Load unpacked and select the InboxWhisper folder.
Test the Extension:
Disable Gmail’s offline mode: Gmail > Settings > See all settings > Offline > Uncheck “Enable offline mail” > Save.
Open Gmail (https://mail.google.com/?offline_allowed=0) and view an email.
Click the extension icon (📬) in the Chrome toolbar.
Select a language (e.g., ta-IN for Tamil) and voice (e.g., ta-IN-abirami).
Check “Enable Emotional Response” for empathetic replies.
Click Summarize Email to generate a summary.
Click Play Summary to hear it aloud.
```
```
Test Sensitive Content:
Open an email with an OTP (e.g., “Your OTP is 123456”) or bank details (e.g., “Transaction ID: 987654”).
Verify the extension displays: “This email contains sensitive information (e.g., OTP or bank details) and cannot be summarized for security reasons.”
Test Multilingual Support:
Send emails in English, Hindi, Tamil, Bengali, Italian, or Spanish.
Verify summaries and TTS match the selected language (e.g., Tamil summary with ta-IN-abirami voice).
Test Emotional Responses:
Open a rejection email (e.g., “We regret to inform you…”).
Ensure an empathetic response is appended (e.g., Tamil: “இந்த முடிவு ஏமாற்றமளிக்கலாம் என்று புரிந்துகொள்கிறோம்.”).
```
```
Debugging:
Open DevTools (F12) > Console to check for errors.
Retrieve logged errors:
chrome.storage.local.get('lastError', (data) => console.log(data.lastError));

Test OpenRouter API:
curl -X POST https://openrouter.ai/api/v1/chat/completions \
-H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
-H "Content-Type: application/json" \
-d '{"model": "mistralai/mixtral-8x7b-instruct", "messages": [{"role": "system", "content": "Summarize the email in Tamil in 2-3 sentences."}, {"role": "user", "content": "We regret to inform you that you were not selected."}]}'

Test Murf AI API:
curl -X POST https://api.murf.ai/v1/speech/generate \
-H "api-key: YOUR_MURF_AI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"voiceId": "ta-IN-abirami", "text": "டெஸ்ட் தமிழில்", "format": "MP3"}'
```
## 🌐 Using InboxWhisper Without Local Setup
```
For users who prefer not to run the extension locally, you can access 

InboxWhisper2.0 in the following ways:

Install from Chrome Web Store (Recommended):
Once published, search for “InboxWhisper” in the Chrome Web Store.
Click Add to Chrome to install instantly.
No manual setup or API keys required (keys are managed server-side via a secure backend).
Status: Not yet published. Contact the author (below) to request publication or check the GitHub repository for updates.
Web-Based Version (Future Plan):
A web app version is under consideration, allowing users to log in with Gmail via a browser and access summaries without installing an extension.
Visit [project website] (TBD) for updates on availability.
Note: Requires Gmail API integration and a hosted backend, planned for a future release.
To request Chrome Web Store publication or express interest in the web-based version, open an issue on the GitHub repository or contact the author.
```

## 🛠️ Tech Stack
```
JavaScript: Core logic for the Chrome extension.
Chrome Extensions API: For Gmail content extraction and popup UI.
OpenRouter API: Powers multilingual summarization and emotional analysis using mistralai/mixtral-8x7b-instruct and openchat/openchat-7b:free.
Murf AI API: Provides high-quality, multilingual TTS with voices like ta-IN-abirami, bn-IN-anwesha, and en-US-cooper.
🎨 Assets & Attribution
📬 Icon: Made by Freepik from www.flaticon.com, licensed under Creative Commons BY 3.0.
📦 Dependencies
A working internet connection.
Gmail account (extension works on Gmail web).
OpenRouter API key (free tier at openrouter.ai).
Murf AI API key (available at murf.ai).
⚠️ Known Limitations
API Rate Limits: OpenRouter’s free tier has daily limits; upgrade to a paid plan for heavy usage.
Gmail DOM Changes: Updates to Gmail’s interface may break selectors. Report issues on GitHub for quick patches.
Language Accuracy: Summarization accuracy for less-represented languages (e.g., Bengali, Tamil) may vary due to LLM training data. English summaries are most reliable.
Sensitive Content Detection: May occasionally block non-sensitive emails with keywords like “bank” (e.g., “river bank”). Refinements ongoing.
Gmail Offline Mode: Can cause delays or errors. Disable offline mode for best performance.
```

## 🤝 Authors
👨‍💻 Gavireddy Dinesh Karthik

Contributions welcome via pull requests! See CONTRIBUTING.md for guidelines.

## 📄 License
MIT License
