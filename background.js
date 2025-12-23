let isRunning = false;
let timeoutId = null;

function getRandomTime() {
  // Random time between 3 and 10 seconds
  return Math.floor(Math.random() * (10 - 3 + 1) + 3) * 1000;
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

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "START") {
    if (!isRunning) {
      isRunning = true;
      switchRandomTab();
    }
  }

  if (message.action === "STOP") {
    isRunning = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
});
