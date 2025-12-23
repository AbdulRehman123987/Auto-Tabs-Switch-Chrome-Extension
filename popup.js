document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "START" });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "STOP" });
});
