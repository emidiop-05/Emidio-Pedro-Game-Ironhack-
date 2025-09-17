const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");
const lostScreen = document.getElementById("lost-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const firstLevel = document.getElementById("first-level");
const playerEl = document.getElementById("player");
const lostRestartBtn = document.getElementById("restart-btn-lost");
const timerEl = document.getElementById("timer");

function scaleGame() {
  const container = document.getElementById("game-container");
  const scaleX = window.innerWidth / 1280;
  const scaleY = window.innerHeight / 720;
  const scale = Math.min(scaleX, scaleY);
  container.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  winScreen.style.display = "none";
  lostScreen.style.display = "none";
  firstLevel.style.display = "block";

  resetPlayer();
  resetTimer();
  startTimer();
});

restartBtn.addEventListener("click", () => {
  winScreen.style.display = "none";
  startScreen.style.display = "block";

  currentLevel = 1;
  resetPlayer();
  resetTimer();
  resetTimer2();
});

lostRestartBtn.addEventListener("click", () => {
  lostScreen.style.display = "none";
  startScreen.style.display = "block";

  currentLevel = 1;
  resetPlayer();
  resetPlayer2();
  resetTimer();
  resetTimer2();
});

const playerEl2 = document.getElementById("player-2");
playerEl2.style.width = player2.w + "px";
playerEl2.style.height = player2.h + "px";
playerEl2.style.position = "absolute";
playerEl2.style.left = player2.x + "px";
playerEl2.style.bottom = player2.y + "px";

function resetPlayer() {
  let playerEl =
    currentLevel === 1
      ? document.getElementById("player")
      : document.getElementById("player-2");

  player.x = 100;
  player.y = 35;
  player.vx = 0;
  player.vy = 0;
  player.jumping = false;
  player.onGround = false;

  player.canShoot = false;
  playerEl.src = "imgs/char1.png";
  playerEl.style.left = player.x + "px";
  playerEl.style.bottom = player.y + "px";

  powerUps.forEach((pu) => {
    pu.collected = false;
    if (pu.el) pu.el.style.display = "block";
  });

  projectiles.forEach((proj) => proj.el.remove());
  projectiles = [];

  if (!enemy) {
    enemy = {
      x: 400,
      y: 150,
      w: 60,
      h: 80,
      vx: 2,
      direction: 1,
      el: document.createElement("div"),
    };

    const enemyEl = enemy.el;
    enemyEl.id = "enemy";
    enemyEl.style.position = "absolute";
    enemyEl.style.width = enemy.w + "px";
    enemyEl.style.height = enemy.h + "px";
    enemyEl.style.backgroundImage =
      'url("imgs/regular_monster-removebg-preview.png")';
    enemyEl.style.backgroundSize = "contain";
    enemyEl.style.backgroundRepeat = "no-repeat";
    enemyEl.style.backgroundPosition = "center";
    enemyEl.style.left = enemy.x + "px";
    enemyEl.style.bottom = enemy.y + "px";
    enemyEl.style.zIndex = "5";
    gameArea.appendChild(enemyEl);
    enemy.el = enemyEl;

    updateEnemy();
  }
}

// ---------------- Sound ----------------
const soundOnBtn = document.getElementById("sound-on");
const soundOffBtn = document.getElementById("sound-off");
const bgAudio = new Audio("sound/Zambolino - Faster (freetouse.com).mp3");
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

// ---------------- Timer Setup ----------------
let startTime = 0;
let timerInterval = null;
const maxTimeInMs = 60 * 335;

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

let startTime2 = 0;
let timerInterval2 = null;
const maxTimeInMs2 = 60 * 125; // 20 minutes for level 2

const timerEl2 = document.getElementById("timer-2");

function startTimer2() {
  startTime2 = Date.now();
  timerInterval2 = setInterval(updateTimer2, 10);
}

function stopTimer2() {
  clearInterval(timerInterval2);
  timerInterval2 = null;
}

function resetTimer2() {
  stopTimer2();
  timerEl2.textContent = "00:00:00";
}

function updateTimer2() {
  const elapsed = Date.now() - startTime2;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const ms = String(milliseconds).padStart(2, "0");

  timerEl2.textContent = `${mm}:${ss}:${ms}`;

  if (elapsed >= maxTimeInMs2) {
    clearInterval(timerInterval2);
    timerInterval2 = null;

    timeUpLevel2();
  }
}

function timeUpLevel2() {
  stopTimer2();
  const secondLevelEl = document.getElementById("second-level");
  secondLevelEl.style.display = "none";
  lostScreen.style.display = "block";
}
