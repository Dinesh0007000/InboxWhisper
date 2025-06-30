# 📬 InboxWhisper - Smart Email Voice Reader

**InboxWhisper** is a Chrome extension that reads your Gmail messages aloud using AI-generated summaries. It aims to improve productivity and accessibility by summarizing and voicing email content in a conversational tone.

---

## 🔍 Features

- 🧠 Summarizes emails into 2–3 lines using OpenRouter (Mistral)
- 🎙️ Speaks summaries out loud using Chrome's built-in SpeechSynthesis
- ✅ Dynamically detects opened emails in Gmail
- 🔁 Plans to include: "Want to hear more?" prompts (interactive mode)

---

## 🚀 How to Install
```
1. Clone this repository:
   git clone https://github.com/Dinesh0007000/InboxWhisper/
Open Chrome and go to chrome://extensions/

Enable Developer mode

Click Load unpacked and select the cloned inboxwhisper folder

Open Gmail → Open an email → Click "🎙️ Read Mail Summary"
```

## 🛠️ Tech Stack
JavaScript

Chrome Extensions API

OpenRouter API (Mistral model) — for empathetic summarization

SpeechSynthesis API — for browser-based voice output

(Previously integrated with Murf AI TTS API — now replaced with native speech for cost-free usage)

## 🎨 Assets & Attribution
```
📬 Icon made by Freepik from www.flaticon.com
Licensed under Creative Commons BY 3.0
```

## 📦 Dependencies

A working internet connection

Gmail account (extension works on Gmail web)

OpenRouter API key (free tier available at openrouter.ai)

## ⚠️ Known Limitations
SpeechSynthesis voice may vary by OS (Linux users may need speech-dispatcher)

Gmail DOM changes may break selector logic (can be patched)

OpenRouter free tier has daily limits

## 🤝 Authors
👨‍💻 Gavireddy Dinesh Karthik

Contributions welcome via PRs!

## 📄 License
MIT License
