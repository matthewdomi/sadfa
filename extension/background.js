// Listen for the extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Open WhatsApp Web in a new tab
    chrome.tabs.create({ url: "https://web.whatsapp.com/" });
});

// Optional: Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openWhatsApp") {
        chrome.tabs.create({ url: "https://web.whatsapp.com/" });
        sendResponse({ status: "WhatsApp Web opened" });
    }
});