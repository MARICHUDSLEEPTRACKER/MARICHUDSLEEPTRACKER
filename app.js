// Set this to your deployed Cloud Function URL after setup.
const STATUS_API_URL = "PASTE_YOUR_CLOUD_FUNCTION_URL_HERE";
const statusTitle = document.querySelector("#status-title");
const statusSubtitle = document.querySelector("#status-subtitle");
const statusImage = document.querySelector("#status-image");
const updated = document.querySelector("#updated");
const form = document.querySelector("#status-form");
const codeInput = document.querySelector("#secret-code");
const feedback = document.querySelector("#feedback");

function renderStatus(data) {
  const sleeping = data.status === "sleeping";
  statusTitle.textContent = sleeping ? "He's sleeping." : "He's awake.";
  statusSubtitle.textContent = sleeping ? "Do not disturb the chud." : "The chud is up.";
  statusImage.src = sleeping ? "sleeping.jpeg" : "awake.jpeg";
  statusImage.alt = sleeping ? "Marijan asleep on a couch" : "Illustrated awake-status portrait of Marijan";
  updated.textContent = data.updatedAt ? `LAST UPDATED · ${new Date(data.updatedAt).toLocaleString()}` : "STATUS SYNCED";
}
function showFeedback(text, good=false) {
  feedback.textContent = text;
  feedback.style.color = good ? "#b4f3cd" : "#ffaaa8";
}
async function getStatus() {
  if (STATUS_API_URL.includes("PASTE_YOUR")) {
    statusTitle.textContent = "He's sleeping.";
    statusSubtitle.textContent = "Initial status · awaiting setup";
    statusImage.src = "sleeping.jpeg";
    updated.textContent = "SETUP NEEDED FOR LIVE UPDATES";
    return;
  }
  try {
    const response = await fetch(STATUS_API_URL, {cache:"no-store"});
    if (!response.ok) throw new Error("Status unavailable");
    renderStatus(await response.json());
  } catch {
    statusTitle.textContent = "Can't connect";
    statusSubtitle.textContent = "Check the tracker setup.";
  }
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const code = codeInput.value.trim();
  if (STATUS_API_URL.includes("PASTE_YOUR")) {
    showFeedback("The site needs its Firebase function URL before codes can update everyone.");
    return;
  }
  try {
    const response = await fetch(STATUS_API_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({code})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "That code didn't work.");
    renderStatus(data);
    codeInput.value = "";
    showFeedback("Status updated for everyone.", true);
  } catch (error) {
    showFeedback(error.message || "Couldn't update the status.");
  }
});
getStatus();
setInterval(getStatus, 5000);
