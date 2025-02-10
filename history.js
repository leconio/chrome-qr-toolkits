document.addEventListener("DOMContentLoaded", function () {
  // 使用国际化消息设置页面标题
  var titleMsg = chrome.i18n.getMessage("historyTitle");
  document.title = titleMsg;
  var mainTitleElement = document.getElementById("mainTitle");
  if (mainTitleElement) {
    mainTitleElement.textContent = titleMsg;
  }

  loadHistory();

  var generateButton = document.getElementById("generateButton");
  generateButton.addEventListener("click", function () {
    var inputText = document.getElementById("qrInput").value.trim();
    if (!inputText) {
      alert("请输入文字生成二维码");
      return;
    }
    // 获取当前历史记录，并在最前面添加新项
    chrome.storage.local.get({ qrHistory: [] }, function (data) {
      var historyArr = data.qrHistory;
      // 将新项插入数组头部
      historyArr.unshift({
        text: inputText,
        timestamp: Date.now(),
      });
      // 保存到 storage 后，清空输入框并重新加载历史列表
      chrome.storage.local.set({ qrHistory: historyArr }, function () {
        document.getElementById("qrInput").value = "";
        loadHistory();
      });
    });
  });
});

function loadHistory() {
  chrome.storage.local.get({ qrHistory: [] }, function (result) {
    var qrGrid = document.getElementById("qrGrid");
    qrGrid.innerHTML = "";
    result.qrHistory.forEach(function (item, index) {
      var qrItem = document.createElement("div");
      qrItem.className = "qr-item";

      var qrCodeContainer = document.createElement("div");
      qrCodeContainer.className = "qr-code";
      new QRCode(qrCodeContainer, {
        text: item.text,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      var qrText = document.createElement("div");
      qrText.className = "qr-text";
      qrText.textContent = item.text;

      // 创建删除按钮
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "×";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", function (e) {
        e.stopPropagation(); // 防止影响其他事件
        chrome.storage.local.get({ qrHistory: [] }, function (data) {
          var historyArr = data.qrHistory;
          historyArr.splice(index, 1); // 删除当前项
          chrome.storage.local.set({ qrHistory: historyArr }, function () {
            loadHistory(); // 重新加载更新页面
          });
        });
      });

      qrItem.appendChild(qrCodeContainer);
      qrItem.appendChild(qrText);
      qrItem.appendChild(deleteButton);

      qrItem.addEventListener("mouseenter", function () {
        document.querySelectorAll(".qr-item").forEach(function (other) {
          if (other !== qrItem) {
            other.classList.add("blur");
          }
        });
      });
      qrItem.addEventListener("mouseleave", function () {
        document.querySelectorAll(".qr-item").forEach(function (other) {
          other.classList.remove("blur");
        });
      });

      qrGrid.appendChild(qrItem);
    });
  });
}
