const card = document.getElementById("card");
const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

function updateUI(running) {
  card.classList.toggle("is-running", running);

  statusBadge.textContent = running ? "Running" : "Stopped";
  statusBadge.classList.toggle("running", running);
  statusBadge.classList.toggle("stopped", !running);

  statusText.textContent = running
    ? "Switcher is active"
    : "Switcher is idle";

  startBtn.disabled = running;
  stopBtn.disabled = !running;
  startBtn.setAttribute("aria-pressed", String(running));
  stopBtn.setAttribute("aria-pressed", String(!running));
}

function sendMessage(action) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action }, (response) => {
      resolve(response ?? { isRunning: false });
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const { isRunning } = await sendMessage("GET_STATE");
  updateUI(isRunning);
});

startBtn.addEventListener("click", async () => {
  const { isRunning } = await sendMessage("START");
  updateUI(isRunning);
});

stopBtn.addEventListener("click", async () => {
  const { isRunning } = await sendMessage("STOP");
  updateUI(isRunning);
});
