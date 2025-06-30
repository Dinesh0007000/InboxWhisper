document.getElementById("lang").addEventListener("change", function () {
    chrome.storage.sync.set({ preferredLang: this.value });
});
