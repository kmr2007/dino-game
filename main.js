// Dinosaur  Game

// Canvas Set Up
let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 600;
cnv.height = 400;

// Global Variables (Once)
let dinoImg = document.createElement("img");
dinoImg.src = "img/dino.png";
let cactusImg = document.createElement("img");
cactusImg.src = "img/cactus.png";
let cloudImg = document.createElement("img");
cloudImg.src = "img/cloud.webp";

// Global Variables (Reset)
let dino;
let cactus1, cactus2, cactus3;
let cloud1, cloud2, cloud3;
let cactusSpeed;
let cactusAccel;
let jumpStat;
let gameStat;
let distance;
let highScore;
let newHighScore;
let cloudSpeed;
reset();

// Event Listeners and Functions
document.addEventListener("keydown", keydownHandler);
document.addEventListener("click", keydownHandler);
function keydownHandler(Event) {
  if (
    (Event.code === "Space" || Event.type === "click") &&
    jumpStat === "still" &&
    gameStat === "gameOn"
  ) {
    jumpStat = "up";
  } else if (
    (Event.code === "Space" || Event.type === "click") &&
    gameStat === "start"
  ) {
    gameStat = "gameOn";
    jumpStat = "up";
  }
}
// Main Functions

function render() {
  if (gameStat === "start") {
    startScreen();
  } else if (gameStat === "gameOn") {
    gameOnScreen();
  } else if (gameStat === "gameOver") {
    gameOverScreen();
  }

  // Request Frame
  requestAnimationFrame(render);
}

function reset() {
  if (distance > highScore) {
    highScore = distance;
    localStorage.setItem("highScore", highScore);
  }
  dino = {
    x: 75,
    y: 225,
    w: 75,
    h: 75,
    accel: 0.3,
  };

  cactus1 = {
    x: 500,
    y: 225,
    w: 50,
    h: 75,
  };

  cactus2 = {
    x: 900,
    y: 225,
    w: 50,
    h: 75,
  };

  cactus3 = {
    x: 1300,
    y: 225,
    w: 50,
    h: 75,
  };

  cloud1 = {
    x: 500,
    y: 50,
    w: 100,
    h: 75,
  };

  cloud2 = {
    x: 900,
    y: 75,
    w: 100,
    h: 75,
  };

  cloud3 = {
    x: 1300,
    y: 25,
    w: 100,
    h: 75,
  };
  cactusSpeed = 4;
  cactusAccel = 0.001;
  jumpStat = "still";
  gameStat = "start";
  distance = 0;
  if (localStorage.getItem("highScore") !== null) {
    highScore = localStorage.getItem("highScore");
  } else {
    highScore = 0;
  }
  newHighScore = false;
}

// Game Screens
function startScreen() {
  // Clear Screen
  drawBg();

  // Game Over Text
  ctx.font = "30px Consolas";
  ctx.textAlign = "center";
  ctx.fillStyle = "Black";
  ctx.fillText("PRESS SPACE TO START", cnv.width / 2, cnv.height / 2);

  // Draw Dino
  ctx.drawImage(dinoImg, dino.x, dino.y, dino.w, dino.h);

  // Draw Cacti
  ctx.drawImage(cactusImg, cactus1.x, cactus1.y, cactus1.w, cactus1.h);
  ctx.drawImage(cactusImg, cactus2.x, cactus2.y, cactus2.w, cactus2.h);
  ctx.drawImage(cactusImg, cactus3.x, cactus3.y, cactus3.w, cactus3.h);

  // Draw Clouds
  ctx.drawImage(cloudImg, cloud1.x, cloud1.y, cloud1.w, cloud1.h);
  ctx.drawImage(cloudImg, cloud2.x, cloud2.y, cloud2.w, cloud2.h);
  ctx.drawImage(cloudImg, cloud3.x, cloud3.y, cloud3.w, cloud3.h);

  // Draw Scores
  ctx.font = "20px Consolas";
  ctx.textAlign = "left";
  ctx.fillStyle = "Black";
  ctx.fillText(`Distance: ${Math.round(distance)}m`, 0, cnv.height - 5);
  ctx.textAlign = "right";
  ctx.fillText(`Best: ${Math.round(highScore)}m`, cnv.width, cnv.height - 5);
}

function gameOverScreen() {
  // Game Over Text
  ctx.font = "40px Consolas";
  ctx.textAlign = "center";
  ctx.fillStyle = "Black";
  ctx.fillText("GAME OVER", cnv.width / 2, cnv.height / 2);

  // Change Game Stat
  gameStat = "gameOver ";

  // Check for High Score
  if (distance > highScore) {
    newHighScore = true;
    highScore = distance;
    localStorage.setItem("highScore", highScore);
  }
  if (newHighScore) {
    ctx.font = "20px Consolas";
    ctx.textAlign = "center";
    ctx.fillStyle = "Black";
    ctx.fillText("NEW HIGH SCORE", cnv.width / 2, cnv.height / 2 + 50);
  }

  // Set Timeout
  setTimeout(reset, 2000);
}

function gameOnScreen() {
  // Clear Screen
  drawBg();

  // Draw Dino
  ctx.drawImage(dinoImg, dino.x, dino.y, dino.w, dino.h);

  // Move Dino
  if (jumpStat === "up" && dino.y >= 75) {
    dino.y += -6;
  } else if (jumpStat === "up" && dino.y <= 75) {
    jumpStat = "down";
  } else if (jumpStat === "down" && dino.y >= 225) {
    jumpStat = "still";
  } else if (jumpStat === "down") {
    dino.y += 6;
  }

  // Move Cacti
  moveCacti();

  // Move Clouds
  moveClouds();

  // Update Score
  distance += 0.1;

  // Check for Collisons
  checkCollisions();
  // Draw Cacti
  ctx.drawImage(cactusImg, cactus1.x, cactus1.y, cactus1.w, cactus1.h);
  ctx.drawImage(cactusImg, cactus2.x, cactus2.y, cactus2.w, cactus2.h);
  ctx.drawImage(cactusImg, cactus3.x, cactus3.y, cactus3.w, cactus3.h);

  // Draw Clouds
  ctx.drawImage(cloudImg, cloud1.x, cloud1.y, cloud1.w, cloud1.h);
  ctx.drawImage(cloudImg, cloud2.x, cloud2.y, cloud2.w, cloud2.h);
  ctx.drawImage(cloudImg, cloud3.x, cloud3.y, cloud3.w, cloud3.h);

  // Draw Scores
  ctx.font = "20px Consolas";
  ctx.textAlign = "left";
  ctx.fillStyle = "Black";
  ctx.fillText(`Distance: ${Math.round(distance)}m`, 0, cnv.height - 5);
  ctx.textAlign = "right";
  ctx.fillText(`Best: ${Math.round(highScore)}m`, cnv.width, cnv.height - 5);
}

// Helper Functions
function drawBg() {
  // Clear and Ground Line
  ctx.fillStyle = "White";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = "Grey";
  ctx.fillRect(0, 300, cnv.width, 5);
}
function moveCacti() {
  // Accelerate
  cactusSpeed += cactusAccel;

  // Cactus 1
  if (cactus1.x + cactus1.w > 0) {
    cactus1.x += -cactusSpeed;
  } else if (cactus1.x + cactus1.w < 0) {
    cactus1.x = cactus3.x + Math.random() * 1000 + 200 + cactusSpeed * 10;
  }

  // Cactus 2
  if (cactus2.x + cactus2.w > 0) {
    cactus2.x += -cactusSpeed;
  } else if (cactus2.x + cactus2.w < 0) {
    cactus2.x = cactus1.x + Math.random() * 1000 + 200 + cactusSpeed * 10;
  }

  // Cactus 3
  if (cactus3.x + cactus3.w > 0) {
    cactus3.x += -cactusSpeed;
  } else if (cactus3.x + cactus3.w < 0) {
    cactus3.x = cactus2.x + Math.random() * 1000 + 200 + cactusSpeed * 10;
  }
}

function moveClouds() {
  cloudSpeed = cactusSpeed - 3;
  // cloud 1
  if (cloud1.x + cloud1.w > 0) {
    cloud1.x += -cloudSpeed;
  } else if (cloud1.x + cloud1.w < 0) {
    cloud1.x = cloud3.x + Math.random() * 1000 + 200;
  }

  // cloud 2
  if (cloud2.x < cnv.width) {
    cloud2.x += cloudSpeed;
  } else if (cloud2.x + cloud2.w > cnv.width) {
    cloud2.x = -cloud2.w - Math.random() * 1000;
  }

  // cloud 3
  if (cloud3.x + cloud3.w > 0) {
    cloud3.x += -cloudSpeed;
  } else if (cloud3.x + cloud3.w < 0) {
    cloud3.x = cloud2.x + Math.random() * 1000 + 200;
  }
}

function checkCollisions() {
  if (
    (dino.x + dino.w >= cactus1.x + 15 &&
      dino.x <= cactus1.x + cactus1.w / 2 &&
      dino.y + dino.h >= cactus1.y) ||
    (dino.x + dino.w >= cactus2.x + 15 &&
      dino.x <= cactus2.x + cactus2.w / 2 &&
      dino.y + dino.h >= cactus2.y) ||
    (dino.x + dino.w >= cactus3.x + 15 &&
      dino.x <= cactus3.x + cactus3.w / 2 &&
      dino.y + dino.h >= cactus3.y)
  ) {
    gameStat = "gameOver";
  }
}
