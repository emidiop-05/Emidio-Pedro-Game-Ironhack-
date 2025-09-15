// ---------------- Player Setup ----------------
const player = {
  x: 100,
  y: 100, // Start above ground
  w: 60,
  h: 80,
  vx: 0,
  vy: 0,
  speed: 4,
  jumpPower: 12,
  jumping: false,
  onGround: false,
};

const gameArea = document.getElementById("game-screen");
const gameWidth = gameArea.offsetWidth;

// ---------------- Platforms ----------------
const platformsData = [
  { x: 0, y: 0, w: 400, h: 35 },
  { x: 350, y: 130, w: 150, h: 20 },
  { x: 330, y: 330, w: 150, h: 20 },
  { x: 130, y: 430, w: 75, h: 20 },
  { x: 500, y: 200, w: 200, h: 20 },
  { x: 750, y: 150, w: 250, h: 20 },
  { x: 850, y: 300, w: 50, h: 20 },
  { x: 650, y: 400, w: 50, h: 20 },
  { x: 850, y: 500, w: 50, h: 20 },
];

let platforms = [];
const groundArea = document.getElementById("ground-area");

// Create visual platforms and keep references
platformsData.forEach((plat) => {
  const div = document.createElement("div");
  div.classList.add("platform");
  div.style.left = plat.x + "px";
  div.style.bottom = plat.y + "px";
  div.style.width = plat.w + "px";
  div.style.height = plat.h + "px";
  groundArea.appendChild(div);
  platforms.push(plat);
});

const lavaData = [
  { x: 150, y: 0, w: 100, h: 20 },
  { x: 400, y: 0, w: 120, h: 20 },
  { x: 600, y: 0, w: 200, h: 20 },
];

// ---------------- Controls ----------------
document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
    e.preventDefault();
  }
});
document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// ---------------- Controls ----------------
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  a: false,
  d: false,
  " ": false,
};
document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// ---------------- Physics ----------------
const gravity = 0.5;
const GROUND_TOLERANCE = 5;

// ---------------- Improved Collision Function ----------------
function checkPlatformCollision() {
  player.onGround = false;

  // Store the next position to check for collisions
  const nextX = player.x + player.vx;
  const nextY = player.y + player.vy;

  platforms.forEach((plat) => {
    const platTop = plat.y + plat.h;
    const platBottom = plat.y;
    const platLeft = plat.x;
    const platRight = plat.x + plat.w;

    const playerBottom = nextY;
    const playerTop = nextY + player.h;
    const playerLeft = nextX;
    const playerRight = nextX + player.w;

    // Check if player is colliding with platform
    if (
      playerRight > platLeft &&
      playerLeft < platRight &&
      playerTop > platBottom &&
      playerBottom < platTop
    ) {
      // Calculate overlap on each side
      const overlapTop = Math.abs(playerBottom - platTop);
      const overlapBottom = Math.abs(playerTop - platBottom);
      const overlapLeft = Math.abs(playerRight - platLeft);
      const overlapRight = Math.abs(playerLeft - platRight);

      // Find the smallest overlap to determine collision side
      const minOverlap = Math.min(
        overlapTop,
        overlapBottom,
        overlapLeft,
        overlapRight
      );

      if (minOverlap === overlapTop) {
        // Top collision (landing on platform)
        player.y = platTop;
        player.vy = 0;
        player.onGround = true;
        player.jumping = false;
      } else if (minOverlap === overlapBottom) {
        // Bottom collision (hitting head)
        player.y = platBottom - player.h;
        player.vy = 0;
      } else if (minOverlap === overlapLeft) {
        // Left collision
        player.x = platLeft - player.w;
        player.vx = 0;
      } else if (minOverlap === overlapRight) {
        // Right collision
        player.x = platRight;
        player.vx = 0;
      }
    }
  });

  // Floor collision
  if (player.y <= 0) {
    player.y = 0;
    player.vy = 0;
    player.onGround = true;
    player.jumping = false;
  }
}

// ---------------- Game Loop ----------------
function updatePlayer() {
  // Horizontal movement
  player.vx = 0;
  if (keys.ArrowLeft || keys.a) player.vx = -player.speed;
  if (keys.ArrowRight || keys.d) player.vx = player.speed;

  // Jump
  if (keys[" "] && player.onGround && !player.jumping) {
    player.vy = player.jumpPower;
    player.jumping = true;
    player.onGround = false;
  }

  // Apply gravity
  if (!player.onGround) {
    player.vy -= gravity;
  }

  // Store previous position
  const prevX = player.x;
  const prevY = player.y;

  // Update position
  player.x += player.vx;
  player.y += player.vy;

  // Check collisions
  checkPlatformCollision();

  // Keep player inside horizontal bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > gameWidth) player.x = gameWidth - player.w;

  // Update DOM
  const playerEl = document.getElementById("player");
  playerEl.style.left = player.x + "px";
  playerEl.style.bottom = player.y + "px";

  requestAnimationFrame(updatePlayer);
}

// Start loop
updatePlayer();
