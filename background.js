let isRunning = false;
let timeoutId = null;

function getRandomTime() {
  return Math.floor(Math.random() * (10 - 3 + 1) + 3) * 1000;
}

async function setRunning(value) {
  isRunning = value;
  await chrome.storage.local.set({ isRunning: value });
}

async function switchRandomTab() {
  if (!isRunning) return;

  const tabs = await chrome.tabs.query({ currentWindow: true });

  if (tabs.length <= 1) {
    scheduleNext();
    return;
  }

  const randomTab = tabs[Math.floor(Math.random() * tabs.length)];
  chrome.tabs.update(randomTab.id, { active: true });

  scheduleNext();
}

function scheduleNext() {
  const randomDelay = getRandomTime();

  timeoutId = setTimeout(() => {
    switchRandomTab();
  }, randomDelay);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "GET_STATE") {
    chrome.storage.local.get("isRunning", ({ isRunning: stored }) => {
      isRunning = !!stored;
      sendResponse({ isRunning: !!stored });
    });
    return true;
  }

  if (message.action === "START") {
    if (!isRunning) {
      setRunning(true).then(() => switchRandomTab());
    }
    sendResponse({ isRunning: true });
    return true;
  }

  if (message.action === "STOP") {
    isRunning = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setRunning(false);
    sendResponse({ isRunning: false });
    return true;
  }
});

(async () => {
  const { isRunning: stored } = await chrome.storage.local.get("isRunning");
  if (stored) {
    isRunning = true;
    switchRandomTab();
  }
})();
