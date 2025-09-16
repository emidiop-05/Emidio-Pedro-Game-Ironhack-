const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const firstLevel = document.getElementById("first-level");
const playerEl = document.getElementById("player");

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  winScreen.style.display = "none";
  firstLevel.style.display = "block";

  resetPlayer();
});

restartBtn.addEventListener("click", () => {
  winScreen.style.display = "none";
  firstLevel.style.display = "none";
  startScreen.style.display = "block";

  resetPlayer();
});

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

// ---------------- Sound ----------------
const soundOnBtn = document.getElementById("sound-on");
const soundOffBtn = document.getElementById("sound-off");

// Only declare once
const bgAudio = new Audio("sound/Zambolino - Faster (freetouse.com).mp3"); // replace with your music
bgAudio.loop = true;
bgAudio.volume = 0.2;

function toggleSound(isOn) {
  bgAudio.muted = !isOn;
  if (isOn) {
    soundOnBtn.classList.add("active");
    soundOffBtn.classList.remove("active");
  } else {
    soundOnBtn.classList.remove("active");
    soundOffBtn.classList.add("active");
  }
}

soundOnBtn.addEventListener("click", () => toggleSound(true));
soundOffBtn.addEventListener("click", () => toggleSound(false));

// ---------------- Hook Sound to Start ----------------
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  winScreen.style.display = "none";
  firstLevel.style.display = "block";

  resetPlayer();
  resetTimer();
  startTimer();

  bgAudio.play().catch(() => {
    console.log("Autoplay blocked, user interaction required.");
  });
});

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
