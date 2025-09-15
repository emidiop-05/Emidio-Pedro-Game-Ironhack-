const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const firstLevel = document.getElementById("first-level");

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none"; // hide start screen
  firstLevel.style.display = "block"; // show game screen

  // Initialize player position AFTER the screen is visible
  const playerEl = document.getElementById("player");
  playerEl.style.bottom = "0px";
  playerEl.style.left = "100px";

  // Optionally reset JS player object
  player.x = 100;
  player.y = 0;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.jumping = false;
});
