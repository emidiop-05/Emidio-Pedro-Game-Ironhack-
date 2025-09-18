// ---------------- Player Setup ----------------
const player = {
  x: 125, // 100 * 1.25
  y: 100, // 80 * 1.25
  w: 75, // 60 * 1.25
  h: 100, // 80 * 1.25
  vx: 0,
  vy: 0,
  speed: 4,
  jumpPower: 14,
  jumping: false,
  onGround: false,
  canShoot: false,
};

const player2 = {
  x: 125, // 100 * 1.25
  y: 43.75, // 35 * 1.25
  w: 75, // 60 * 1.25
  h: 100, // 80 * 1.25
  vx: 0,
  vy: 0,
  speed: 4,
  jumpPower: 14,
  jumping: false,
  onGround: true,
  canShoot: false,
};

// ---------------- Enemy Setup ----------------
const enemy = {
  x: 500, // 400 * 1.25
  y: 187.5, // 150 * 1.25
  w: 75, // 60 * 1.25
  h: 100, // 80 * 1.25
  vx: 2,
  vy: 0,
  onGround: false,
  direction: 1,
  el: null,
};

const powerUps = [
  {
    x: 162.5, // 130 * 1.25
    y: 537.5, // 430 * 1.25
    w: 100, // 80 * 1.25
    h: 100, // 80 * 1.25
    collected: false,
    el: null,
  },
];

let currentLevel = 1;
// ---------------- Physics ----------------
const gravity = 0.5;
const GROUND_TOLERANCE = 4;

let projectiles = [];
function updateProjectiles() {
  projectiles.forEach((proj, index) => {
    proj.x += proj.vx;

    const enemyBox = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
    const projBox = { x: proj.x, y: proj.y, w: proj.w, h: proj.h };

    const horizontal =
      projBox.x + projBox.w > enemyBox.x && projBox.x < enemyBox.x + enemyBox.w;
    const vertical =
      projBox.y + projBox.h > enemyBox.y && projBox.y < enemyBox.y + enemyBox.h;

    if (horizontal && vertical) {
      proj.el.remove();
      projectiles.splice(index, 1);

      enemy.x = 0;
      enemy.y = 0;
      return;
    }

    proj.el.style.left = proj.x + "px";

    if (proj.x > gameWidth) {
      proj.el.remove();
      projectiles.splice(index, 1);
    }
  });
}

const gameArea = document.getElementById("game-screen");
const gameWidth = gameArea.offsetWidth;

// ---------------- Platforms ----------------
const platformsData = [
  { x: 0, y: 0, w: 500, h: 43.75 }, // multiplied 1.25
  { x: 1062.5, y: 0, w: 375, h: 43.75 },
  { x: 1375, y: 0, w: 75, h: 112.5 },
  { x: 437.5, y: 162.5, w: 187.5, h: 25 },
  { x: 412.5, y: 412.5, w: 187.5, h: 25 },
  { x: 162.5, y: 537.5, w: 93.75, h: 25 },
  { x: 625, y: 250, w: 250, h: 25 },
  { x: 937.5, y: 187.5, w: 312.5, h: 25 },
  { x: 1062.5, y: 375, w: 62.5, h: 25 },
  { x: 812.5, y: 500, w: 62.5, h: 25 },
  { x: 1062.5, y: 625, w: 62.5, h: 25 },
];

let platforms = [];
const groundArea = document.getElementById("ground-area");

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

let lavaInk = [];
const lavaArea = document.getElementById("lava-area");

const lavaData = [{ x: 500, y: 0, w: 1062.5, h: 25 }];

lavaData.forEach((lava) => {
  const div = document.createElement("div");
  div.classList.add("lava-ink");
  div.style.left = lava.x + "px";
  div.style.bottom = lava.y + "px";
  div.style.width = lava.w + "px";
  div.style.height = lava.h + "px";

  lavaArea.appendChild(div);

  lavaInk.push({
    el: div,
    x: lava.x,
    y: lava.y,
    w: lava.w,
    h: lava.h,
  });
});

powerUps.forEach((pu) => {
  const div = document.createElement("div");
  div.classList.add("power-up");
  div.style.left = pu.x + "px";
  div.style.bottom = pu.y + "px";
  div.style.width = pu.w + "px";
  div.style.height = pu.h + "px";
  div.style.backgroundImage = 'url("imgs/luckyblock.png")';
  div.style.backgroundSize = "contain";
  div.style.backgroundRepeat = "no-repeat";
  div.style.position = "absolute";
  div.style.zIndex = "4";
  gameArea.appendChild(div);
  pu.el = div;
});

// ---------------- Level 2 Platforms ----------------
const platformsData2 = [
  { x: 0, y: 0, w: 230, h: 35 }, // 160*1.25, 28*1.25
  { x: 1062.5, y: 0, w: 500, h: 35 }, // 850*1.25, 280*1.25 -> corrected
  { x: 400.5, y: 162.5, w: 187.5, h: 20 }, // 350*1.25, 130*1.25
  { x: 350, y: 412.5, w: 70, h: 20 }, // 330*1.25, 330*1.25
  { x: 162.5, y: 537.5, w: 93.75, h: 20 }, // 130*1.25, 430*1.25
  { x: 625, y: 200, w: 250, h: 20 }, // 500*1.25, 160*1.25
  { x: 937.5, y: 365, w: 312.5, h: 20 }, // 750*1.25, 150*1.25
  { x: 850, y: 300, w: 50, h: 20 }, // 680*1.25, 240*1.25
  { x: 650, y: 400, w: 50, h: 20 }, // 520*1.25, 320*1.25
  { x: 850, y: 500, w: 50, h: 20 }, // 680*1.25, 400*1.25
];

let platforms2 = [];
const groundArea2 = document.getElementById("ground-area-2");

platformsData2.forEach((plat) => {
  const div = document.createElement("div");
  div.classList.add("platform");
  div.style.left = plat.x + "px";
  div.style.bottom = plat.y + "px";
  div.style.width = plat.w + "px";
  div.style.height = plat.h + "px";
  groundArea2.appendChild(div);
  platforms2.push(plat);
});

// ---------------- Level 2 Lava ----------------
let lavaInk2 = [];
const lavaArea2 = document.getElementById("lava-area-2");

const lavaData2 = [
  { x: 200, y: 0, w: 1162.5, h: 25 }, // 200*1.25 -> 250, 850*1.25 -> 1062.5, 20*1.25 -> 25
];

lavaData2.forEach((lava) => {
  const div = document.createElement("div");
  div.classList.add("lava-ink");
  div.style.left = lava.x + "px";
  div.style.bottom = lava.y + "px";
  div.style.width = lava.w + "px";
  div.style.height = lava.h + "px";

  lavaArea2.appendChild(div);

  lavaInk2.push({
    el: div,
    x: lava.x,
    y: lava.y,
    w: lava.w,
    h: lava.h,
  });
});

// ---------------- Enemy DOM ----------------
const enemyEl = document.createElement("div");
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
// ---------------- Enemy Movement ----------------
function updateEnemy() {
  // Horizontal movement
  enemy.x += enemy.vx * enemy.direction;

  // Randomly change direction
  if (Math.random() < 0.01) {
    enemy.direction *= -1;
  }

  // Stay inside game width
  if (enemy.x <= 0) enemy.direction = 1;
  if (enemy.x + enemy.w >= gameWidth) enemy.direction = -1;

  applyEnemyPhysics();

  // Update DOM
  enemy.el.style.left = enemy.x + "px";
  enemy.el.style.bottom = enemy.y + "px";

  // Check collision with player
  checkEnemyCollision();

  requestAnimationFrame(updateEnemy);
}

// ---------------- Enemy Collision ----------------
function checkEnemyCollision() {
  const playerBox = {
    x: player.x,
    y: player.y,
    w: player.w,
    h: player.h,
  };

  const enemyBox = {
    x: enemy.x,
    y: enemy.y,
    w: enemy.w,
    h: enemy.h,
  };

  const horizontal =
    playerBox.x + playerBox.w > enemyBox.x &&
    playerBox.x < enemyBox.x + enemyBox.w;
  const vertical =
    playerBox.y + playerBox.h > enemyBox.y &&
    playerBox.y < enemyBox.y + enemyBox.h;

  if (horizontal && vertical) {
    player.x = 100;
    player.y = 0;
    player.vx = 0;
    player.vy = 0;
    player.jumping = false;
    player.onGround = false;

    const playerEl = document.getElementById("player");
    playerEl.style.left = player.x + "px";
    playerEl.style.bottom = player.y + "px";
  }
}
function applyEnemyPhysics() {
  enemy.onGround = false;

  // Apply gravity
  enemy.vy -= gravity;
  enemy.y += enemy.vy;

  // Platform collisions
  platforms.forEach((plat) => {
    const platTop = plat.y + plat.h;
    const platLeft = plat.x;
    const platRight = plat.x + plat.w;

    const enemyBottom = enemy.y;
    const enemyTop = enemy.y + enemy.h;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.w;

    if (
      enemyRight > platLeft &&
      enemyLeft < platRight &&
      enemyTop > plat.y &&
      enemyBottom < platTop
    ) {
      const overlapTop = Math.abs(enemyBottom - platTop);
      const overlapBottom = Math.abs(enemyTop - plat.y);

      if (overlapTop < overlapBottom) {
        enemy.y = platTop;
        enemy.vy = 0;
        enemy.onGround = true;
      }
    }
  });

  // Ground collision
  if (enemy.y <= 0) {
    enemy.y = 0;
    enemy.vy = 0;
    enemy.onGround = true;
  }
}

updateEnemy();
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

document.addEventListener("keydown", (e) => {
  if (player.canShoot && e.key === "e") {
    shootProjectile();
  }
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

// ---------------- Collision Function ----------------
function checkPlatformCollision() {
  player.onGround = false;

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

    if (
      playerRight > platLeft &&
      playerLeft < platRight &&
      playerTop > platBottom &&
      playerBottom < platTop
    ) {
      const overlapTop = Math.abs(playerBottom - platTop);
      const overlapBottom = Math.abs(playerTop - platBottom);
      const overlapLeft = Math.abs(playerRight - platLeft);
      const overlapRight = Math.abs(playerLeft - platRight);

      const minOverlap = Math.min(
        overlapTop,
        overlapBottom,
        overlapLeft,
        overlapRight
      );

      if (minOverlap === overlapTop) {
        player.y = platTop;
        player.vy = 0;
        player.onGround = true;
        player.jumping = false;
      } else if (minOverlap === overlapBottom) {
        player.y = platBottom - player.h;
        player.vy = 0;
      } else if (minOverlap === overlapLeft) {
        player.x = platLeft - player.w;
        player.vx = 0;
      } else if (minOverlap === overlapRight) {
        player.x = platRight;
        player.vx = 0;
      }
    }
  });

  if (player.y <= 0) {
    player.y = 0;
    player.vy = 0;
    player.onGround = true;
    player.jumping = false;
  }
}

function checkPlatformCollision2() {
  player2.onGround = false;

  const nextX = player2.x + player2.vx;
  const nextY = player2.y + player2.vy;

  platforms2.forEach((plat) => {
    const platTop = plat.y + plat.h;
    const platBottom = plat.y;
    const platLeft = plat.x;
    const platRight = plat.x + plat.w;

    const playerBottom = nextY;
    const playerTop = nextY + player2.h;
    const playerLeft = nextX;
    const playerRight = nextX + player2.w;

    if (
      playerRight > platLeft &&
      playerLeft < platRight &&
      playerTop > platBottom &&
      playerBottom < platTop
    ) {
      const overlapTop = Math.abs(playerBottom - platTop);
      const overlapBottom = Math.abs(playerTop - platBottom);
      const overlapLeft = Math.abs(playerRight - platLeft);
      const overlapRight = Math.abs(playerLeft - platRight);

      const minOverlap = Math.min(
        overlapTop,
        overlapBottom,
        overlapLeft,
        overlapRight
      );

      if (minOverlap === overlapTop) {
        player2.y = platTop;
        player2.vy = 0;
        player2.onGround = true;
        player2.jumping = false;
      } else if (minOverlap === overlapBottom) {
        player2.y = platBottom - player2.h;
        player2.vy = 0;
      } else if (minOverlap === overlapLeft) {
        player2.x = platLeft - player2.w;
        player2.vx = 0;
      } else if (minOverlap === overlapRight) {
        player2.x = platRight;
        player2.vx = 0;
      }
    }
  });

  if (player2.y <= 0) {
    player2.y = 0;
    player2.vy = 0;
    player2.onGround = true;
    player2.jumping = false;
  }
}

function checkLavaCollision() {
  lavaInk.forEach((lava) => {
    const horizontal =
      player.x + player.w > lava.x && player.x < lava.x + lava.w;
    const vertical = player.y + player.h > lava.y && player.y < lava.y + lava.h;

    if (horizontal && vertical) {
      player.x = 100;
      player.y = 0;
      player.vx = 0;
      player.vy = 0;
      player.jumping = false;
      player.onGround = false;
    }
  });
}

function checkLavaCollision2() {
  lavaInk2.forEach((lava) => {
    const horizontal =
      player2.x + player2.w > lava.x && player2.x < lava.x + lava.w;
    const vertical =
      player2.y + player2.h > lava.y && player2.y < lava.y + lava.h;

    if (horizontal && vertical) {
      // Reset player2 to start
      const firstPlat = platforms2[0];
      player2.x = firstPlat.x + 10;
      player2.y = firstPlat.y + firstPlat.h;
      player2.vx = 0;
      player2.vy = 0;
      player2.jumping = false;
      player2.onGround = true;
    }
  });
}

// ---- EXIT COLLISION ----
const exitEl = document.getElementById("exit");

function checkExitCollision() {
  const exit = {
    x: exitEl.offsetLeft,
    y: exitEl.offsetTop,
    w: exitEl.offsetWidth,
    h: exitEl.offsetHeight,
  };

  const playerBox = {
    x: player.x,
    y: player.y,
    w: player.w,
    h: player.h,
  };

  const horizontal =
    playerBox.x + playerBox.w > exit.x && playerBox.x < exit.x + exit.w;
  const vertical =
    playerBox.y + playerBox.h > exit.y && playerBox.y < exit.y + exit.h;

  if (horizontal && vertical) {
    levelComplete();
  }
}

function checkExitCollision2() {
  const exitEl2 = document.getElementById("exit-2");
  const exit = {
    x: exitEl2.offsetLeft,
    y: exitEl2.offsetTop,
    w: exitEl2.offsetWidth,
    h: exitEl2.offsetHeight,
  };

  const playerBox = {
    x: player2.x,
    y: player2.y,
    w: player2.w,
    h: player2.h,
  };

  const horizontal =
    playerBox.x + playerBox.w > exit.x && playerBox.x < exit.x + exit.w;
  const vertical =
    playerBox.y + playerBox.h > exit.y && playerBox.y < exit.y + exit.h;

  if (horizontal && vertical) {
    level2Complete();
  }
}

function levelComplete() {
  if (currentLevel === 1) {
    document.getElementById("first-level").style.display = "none";
    document.getElementById("second-level").style.display = "block";

    currentLevel = 2;

    const firstPlat = platforms2[0];
    player2.x = firstPlat.x + 10;
    player2.y = firstPlat.y + firstPlat.h;
    player2.vx = 0;
    player2.vy = 0;
    player2.jumping = false;
    player2.onGround = true;

    const playerEl2 = document.getElementById("player-2");
    playerEl2.style.left = player2.x + "px";
    playerEl2.style.bottom = player2.y + "px";

    resetTimer();
    startTimer();
  } else if (currentLevel === 2) {
    secondLevel.style.display = "none";
    winScreen.style.display = "block";
    stopTimer2();
  }
}

function level2Complete() {
  document.getElementById("second-level").style.display = "none";
  document.getElementById("win-screen").style.display = "block";

  stopTimer2(); // stop level 2 timer
}

// ---------------- Game Loop ----------------
function updatePlayer() {
  player.vx = 0;
  if (keys.ArrowLeft || keys.a) player.vx = -player.speed;
  if (keys.ArrowRight || keys.d) player.vx = player.speed;

  if (keys[" "] && player.onGround && !player.jumping) {
    player.vy = player.jumpPower;
    player.jumping = true;
    player.onGround = false;
  }

  if (!player.onGround) {
    player.vy -= gravity;
  }

  player.x += player.vx;
  player.y += player.vy;

  checkPlatformCollision();
  checkLavaCollision();
  checkExitCollision();
  checkPowerUpCollision();
  updateProjectiles();

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > gameWidth) player.x = gameWidth - player.w;

  const playerEl = document.getElementById("player");
  playerEl.style.left = player.x + "px";
  playerEl.style.bottom = player.y + "px";

  requestAnimationFrame(updatePlayer);
}

function updatePlayer2() {
  player2.vx = 0;
  if (keys.ArrowLeft || keys.a) player2.vx = -player2.speed;
  if (keys.ArrowRight || keys.d) player2.vx = player2.speed;

  if (keys[" "] && player2.onGround && !player2.jumping) {
    player2.vy = player2.jumpPower;
    player2.jumping = true;
    player2.onGround = false;
  }

  if (!player2.onGround) player2.vy -= gravity;

  player2.x += player2.vx;
  player2.y += player2.vy;

  const gameScreen = document.getElementById("second-level");
  const maxX = gameScreen.offsetWidth - 65; // player width
  const maxY = gameScreen.offsetHeight - 100; // player height

  if (player2.x < 0) player2.x = 0;
  if (player2.x > maxX) player2.x = maxX;
  if (player2.y < 0) {
    player2.y = 0;
    player2.vy = 0;
    player2.onGround = true;
    player2.jumping = false;
  }
  if (player2.y > maxY) player2.y = maxY;

  checkPlatformCollision2();
  checkLavaCollision2();
  checkExitCollision2();

  const playerEl2 = document.getElementById("player-2");

  playerEl2.style.left = player2.x + "px";
  playerEl2.style.bottom = player2.y + "px";
  playerEl2.style.width = player2.w + "px";
  playerEl2.style.height = player2.h + "px";
  playerEl2.style.position = "absolute";

  requestAnimationFrame(updatePlayer2);
}
// ---------------- Power-up Collision ----------------
function checkPowerUpCollision() {
  powerUps.forEach((pu) => {
    if (pu.collected) return;

    const horizontal = player.x + player.w > pu.x && player.x < pu.x + pu.w;
    const vertical = player.y + player.h > pu.y && player.y < pu.y + pu.h;

    if (horizontal && vertical) {
      pu.collected = true;
      pu.el.style.display = "none";
      const playerEl = document.getElementById("player");
      playerEl.src = "imgs/char-with-powerUp.png";
      player.canShoot = true;
    }
  });
}
function shootProjectile() {
  const proj = {
    x: player.x + player.w / 2,
    y: player.y + player.h / 2,
    w: 60,
    h: 60,
    vx: 4,
    el: null,
  };

  const div = document.createElement("div");
  div.classList.add("projectile");
  div.style.position = "absolute";
  div.style.left = proj.x + "px";
  div.style.bottom = proj.y + "px";
  div.style.width = proj.w + "px";
  div.style.height = proj.h + "px";
  div.style.backgroundImage = 'url("imgs/shield-ammo.png")';
  div.style.backgroundSize = "contain";
  div.style.backgroundRepeat = "no-repeat";
  div.style.backgroundPosition = "center";
  div.style.zIndex = "5";
  gameArea.appendChild(div);

  proj.el = div;
  projectiles.push(proj);
}

updatePlayer();
updatePlayer2();
