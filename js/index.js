const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");
const lostScreen = document.getElementById("lost-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const firstLevel = document.getElementById("first-level");
const playerEl = document.getElementById("player");
const lostRestartBtn = document.getElementById("restart-btn-lost");
const timerEl = document.getElementById("timer");

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
let timerInterval = null;
const maxTimeInMs = 60 * 500; // change time limit

// ---------------- Timer Functions ----------------
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerEl.textContent = "00:00:00";
}

function updateTimer() {
  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const ms = String(milliseconds).padStart(2, "0");

  timerEl.textContent = `${mm}:${ss}:${ms}`;

  // If time limit reached, trigger lost screen
  if (elapsed >= maxTimeInMs) {
    timeUp();
  }
}

// ---------------- Time Up Function ----------------
function timeUp() {
  stopTimer();
  firstLevel.style.display = "none";
  lostScreen.style.display = "block";
}

// ---------------- Button Event Listeners ----------------

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  firstLevel.style.display = "block";
  lostScreen.style.display = "none";

  resetTimer();
  startTimer();
});

lostRestartBtn.addEventListener("click", () => {
  lostScreen.style.display = "none";
  startScreen.style.display = "block";

  resetTimer();
});
