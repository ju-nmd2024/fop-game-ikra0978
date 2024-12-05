// Classes
class Ingredient {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 20;
    this.speed = random(2, 5);
  }

  show() {
    fill(this.type === "bonus" ? "gold" : "green");
    ellipse(this.x, this.y, this.size);
  }

  fall() {
    this.y += this.speed;
  }
}

class Cauldron {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.width = 60;
    this.height = 40;
    this.velocity = 0;
    this.energy = 100;
    this.score = 0;
  }

  show() {
    fill("purple");
    ellipse(this.x, this.y, this.width, this.height);

    // Draw cauldron "handles"
    stroke("darkorchid");
    strokeWeight(3);
    line(this.x - 25, this.y - 10, this.x - 40, this.y - 25);
    line(this.x + 25, this.y - 10, this.x + 40, this.y - 25);
    noStroke();
  }

  applyMagic() {
    if (this.energy > 0) {
      this.velocity -= 1;
      this.energy -= 2;
    }
  }

  update() {
    this.velocity += 0.2; // Simulate gravity
    this.y += this.velocity;

    // Constrain energy and position
    this.energy = constrain(this.energy, 0, 100);
    this.y = constrain(this.y, 0, height - this.height / 2);
  }

  move(direction) {
    this.x += direction * 5;
    this.x = constrain(this.x, this.width / 2, width - this.width / 2);
  }

  checkCollision(ingredient) {
    let d = dist(this.x, this.y, ingredient.x, ingredient.y);
    if (d < this.width / 2 + ingredient.size / 2) {
      if (ingredient.type === "bonus") {
        this.energy += 20;
        this.score += 10;
      } else {
        this.score += 5;
      }
      return true;
    }
    return false;
  }
}

// Global variables
let cauldron;
let ingredients = [];
let gameState = "start"; // start, playing, gameOver

function setup() {
  createCanvas(400, 600);
  cauldron = new Cauldron();
}

function draw() {
  background(50, 100, 200);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "gameOver") {
    drawGameOverScreen();
  }
}

function drawStartScreen() {
  textSize(32);
  fill("white");
  textAlign(CENTER);
  text("Lunar Rescue Mission", width / 2, height / 2 - 100);

  textSize(16);
  text("Instructions:", width / 2, height / 2 - 40);
  text("1. Press SPACE to slow the descent.", width / 2, height / 2 - 20);
  text("2. Use LEFT/RIGHT arrows to move.", width / 2, height / 2);
  text("3. Catch ingredients to score points.", width / 2, height / 2 + 20);
  text("4. Avoid crashing or running out of energy!", width / 2, height / 2 + 40);

  textSize(18);
  text("Press ENTER to start", width / 2, height / 2 + 100);
}

function playGame() {
  cauldron.update();
  cauldron.show();

  // Generate ingredients
  if (frameCount % 60 === 0) {
    let type = random() < 0.2 ? "bonus" : "normal"; // 20% chance of bonus ingredient
    ingredients.push(new Ingredient(random(20, width - 20), 0, type));
  }

  // Display and update ingredients
  for (let i = ingredients.length - 1; i >= 0; i--) {
    ingredients[i].fall();
    ingredients[i].show();

    if (cauldron.checkCollision(ingredients[i])) {
      ingredients.splice(i, 1);
    } else if (ingredients[i].y > height) {
      ingredients.splice(i, 1);
    }
  }

  // Display score and energy
  fill("white");
  textSize(16);
  text(`Score: ${cauldron.score}`, 50, 30);
  text(`Energy: ${cauldron.energy}`, width - 100, 30);

  // End game if energy is zero
  if (cauldron.energy <= 0) {
    gameState = "gameOver";
  }
}

function drawGameOverScreen() {
  textSize(32);
  fill("white");
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2 - 50);

  textSize(16);
  text(`Score: ${cauldron.score}`, width / 2, height / 2);
  text("Press R to restart", width / 2, height / 2 + 50);
}

function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "playing";
  } else if (gameState === "gameOver" && keyCode === 82) { // R key
    cauldron = new Cauldron();
    ingredients = [];
    gameState = "start";
  }
}

function keyIsDown() {
  if (gameState === "playing") {
    if (keyCode === LEFT_ARROW) cauldron.move(-1);
    if (keyCode === RIGHT_ARROW) cauldron.move(1);
    if (key === " ") cauldron.applyMagic();
  }
}
