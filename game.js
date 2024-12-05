// Space Defender Game with Start Screen and Instructions
let player;
let asteroids = [];
let bullets = [];
let score = 0;
let gameStarted = false;

function setup() {
  createCanvas(600, 400);
  player = new Player();
  textSize(18);
  fill(255);
}

function draw() {
  background(0);

  if (!gameStarted) {
    showInstructions();
  } else {
    playGame();
  }
}

function showInstructions() {
  textAlign(CENTER);
  fill(255);
  textSize(24);
  text("SPACE DEFENDER", width / 2, height / 2 - 40);
  textSize(18);
  text("Use LEFT/RIGHT arrows to move.", width / 2, height / 2);
  text("Press SPACE to shoot.", width / 2, height / 2 + 20);
  text("Press any key to start.", width / 2, height / 2 + 60);
}

function playGame() {
  textAlign(LEFT);
  // Display score
  text("Score: " + score, 10, 20);

  // Display and move player
  player.show();
  player.move();

  // Display and move bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    if (bullets[i].offScreen()) {
      bullets.splice(i, 1);
    }
  }

  // Spawn asteroids
  if (frameCount % 60 === 0) {
    asteroids.push(new Asteroid());
  }

  // Display and move asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].show();
    asteroids[i].move();

    // Check for collisions with player
    if (asteroids[i].hits(player)) {
      console.log("Game Over!");
      noLoop();
      textSize(32);
      textAlign(CENTER);
      text("GAME OVER", width / 2, height / 2);
    }

    // Check for collisions with bullets
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (asteroids[i].hitsBullet(bullets[j])) {
        score += 10;
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }

    if (asteroids[i] && asteroids[i].offScreen()) {
      asteroids.splice(i, 1);
    }
  }
}

// Player class
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 20;
    this.w = 40;
    this.h = 20;
    this.xdir = 0;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

  move() {
    this.x += this.xdir * 5;
    this.x = constrain(this.x, 0, width - this.w);
  }

  setDir(dir) {
    this.xdir = dir;
  }
}

// Asteroid class
class Asteroid {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.r = random(15, 30);
    this.speed = random(2, 5);
  }

  show() {
    fill(150);
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    this.y += this.speed;
  }

  offScreen() {
    return this.y > height;
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x + player.w / 2, player.y + player.h / 2);
    return d < this.r + player.w / 2;
  }

  hitsBullet(bullet) {
    let d = dist(this.x, this.y, bullet.x, bullet.y);
    return d < this.r + bullet.r;
  }
}

// Bullet class
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.speed = 7;
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    this.y -= this.speed;
  }

  offScreen() {
    return this.y < 0;
  }
}

function keyPressed() {
  if (!gameStarted) {
    gameStarted = true;
    return;
  }

  if (key === ' ') {
    bullets.push(new Bullet(player.x + player.w / 2, player.y));
  }

  if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    player.setDir(0);
  }
}
