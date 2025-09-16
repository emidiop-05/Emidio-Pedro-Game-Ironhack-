const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const firstLevel = document.getElementById("first-level");
const playerEl = document.getElementById("player");

// Start button → show game
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none"; // hide start screen
  winScreen.style.display = "none"; // just in case
  firstLevel.style.display = "block"; // show game screen

  resetPlayer();
});

// Restart button → go back to start screen
restartBtn.addEventListener("click", () => {
  winScreen.style.display = "none";
  firstLevel.style.display = "none";
  startScreen.style.display = "block";

  resetPlayer(); // optional, reset player so next run starts clean
});

// Function to reset player position and variables
function resetPlayer() {
  playerEl.style.bottom = "0px";
  playerEl.style.left = "100px";

  player.x = 100;
  player.y = 0;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.jumping = false;
}

// ---------------- Timer Setup ----------------
let startTime = 0;
let timerInterval;

const timerEl = document.getElementById("timer");

// Start the timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10); // update every 10ms
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  timerEl.textContent = "00:00:00";
}

// Update the timer display
function updateTimer() {
  const elapsed = Date.now() - startTime; // milliseconds
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);

  // Format with leading zeros
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const ms = String(milliseconds).padStart(2, "0");

  timerEl.textContent = `${mm}:${ss}:${ms}`;
}

// ---------------- Hook Timer into Game ----------------

// Start the timer when the game starts
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  winScreen.style.display = "none";
  firstLevel.style.display = "block";

  resetPlayer();
  resetTimer();
  startTimer();
});

// Stop the timer when the player wins
function levelComplete() {
  firstLevel.style.display = "none";
  winScreen.style.display = "block";
  stopTimer(); // stop timer when level ends
}

// Reset timer when going back to start screen
restartBtn.addEventListener("click", () => {
  winScreen.style.display = "none";
  firstLevel.style.display = "none";
  startScreen.style.display = "block";

  resetPlayer();
  resetTimer();
});
