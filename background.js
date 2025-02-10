// 监听快捷键命令，生成二维码
chrome.commands.onCommand.addListener(function (command) {
  if (command === "generate_qrcode") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        try {
          chrome.tabs.sendMessage(tabs[0].id, { action: "generate_qr" });
        } catch (e) {
          // 忽略错误
        }
      }
    );
  }
});

// 当用户点击扩展图标时，在新标签页中打开历史记录页面
chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("history.html") });
});
