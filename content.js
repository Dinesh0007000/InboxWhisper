function extractEmailContent() {
    const selectors = [
        '.a3s.aiL', '.ii.gt', '.gs .a3s', '.message_content',
        '[data-message-id]', '.a3s.aXjCH', '.adn.ads'
    ];

    const sensitiveKeywords = [
        'otp', 'one time password', 'one-time password', 'password', 'pin',
        'bank', 'transaction', 'account number', 'credit card', 'debit card',
        'balance', 'payment', 'authorization code', 'security code'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            let text = element.innerText
                .replace(/\s+/g, ' ')
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .replace(/--\s*Sent from my.*$/i, '')
                .trim();
            if (text.length > 0) {
                const textLower = text.toLowerCase();
                const isSensitive = sensitiveKeywords.some(keyword => {
                    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                    return regex.test(textLower) && (
                        keyword === 'otp' || keyword.includes('password') || keyword.includes('code') ?
                            /\d{4,6}/.test(textLower) : true // Require numbers for OTP/password/code
                    );
                });
                if (isSensitive) {
                    return { error: 'This email contains sensitive information (e.g., OTP or bank details) and cannot be summarized for security reasons.' };
                }
                return text.substring(0, 10000);
            }
        }
    }
    return '';
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getEmailContent') {
        let attempts = 0;
        const maxAttempts = 5;
        const delay = 1500;

        function tryExtract() {
            try {
                const result = extractEmailContent();
                if (typeof result === 'string') {
                    sendResponse({ emailContent: result });
                } else if (result.error) {
                    sendResponse({ error: result.error });
                    chrome.storage.local.set({ lastError: result.error });
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(tryExtract, delay);
                } else {
                    sendResponse({ error: 'No email content found. Ensure an email is open in Gmail.' });
                    chrome.storage.local.set({ lastError: 'No email content found after 5 attempts.' });
                }
            } catch (error) {
                sendResponse({ error: 'Error extracting email content: ' + error.message });
                chrome.storage.local.set({ lastError: 'Extraction error: ' + error.message });
            }
        }

        tryExtract();
        return true;
    }
});
