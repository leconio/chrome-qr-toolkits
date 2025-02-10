chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "generate_qr") {
    var selection = window.getSelection();
    var selectedText = selection.toString().trim();
    if (!selectedText) {
      alert(chrome.i18n.getMessage("noTextAlert"));
      return;
    }
    var range = selection.getRangeAt(0);
    var qrContainer = document.createElement("div");
    qrContainer.style.margin = "10px 0";
    qrContainer.className = "chrome-qrcode-container";

    range.collapse(false);
    range.insertNode(qrContainer);

    new QRCode(qrContainer, {
      text: selectedText,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    saveQRHistory(selectedText);
  }
});

function saveQRHistory(text) {
  chrome.storage.local.get({ qrHistory: [] }, function (result) {
    var history = result.qrHistory;
    history.push({
      text: text,
      timestamp: Date.now(),
    });
    chrome.storage.local.set({ qrHistory: history });
  });
}
