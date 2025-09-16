// ---------------- Player Setup ----------------
const player = {
  x: 100,
  y: 100,
  w: 60,
  h: 80,
  vx: 0,
  vy: 0,
  speed: 4,
  jumpPower: 12,
  jumping: false,
  onGround: false,
  canShoot: false,
};
// ---------------- Enemy Setup ----------------
const enemy = {
  x: 400,
  y: 150,
  w: 60,
  h: 80,
  vx: 2,
  direction: 1,
  el: null,
};

const powerUps = [
  {
    x: 130,
    y: 430,
    w: 80,
    h: 80,
    collected: false,
    el: null,
  },
];

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

const lavaData = [{ x: 400, y: 0, w: 850, h: 20 }];

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
  enemy.x += enemy.vx * enemy.direction;

  if (Math.random() < 0.01) {
    enemy.direction *= -1;
  }

  if (enemy.x <= 0) enemy.direction = 1;
  if (enemy.x + enemy.w >= gameWidth) enemy.direction = -1;

  enemy.el.style.left = enemy.x + "px";

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

// ---------------- Physics ----------------
const gravity = 0.5;
const GROUND_TOLERANCE = 5;

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

function levelComplete() {
  document.getElementById("first-level").style.display = "none";
  document.getElementById("win-screen").style.display = "block";
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
