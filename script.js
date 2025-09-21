const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const eatSound = document.getElementById('eatSound');
const turnSound = document.getElementById('turnSound');
const loseSound = document.getElementById('loseSound');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = { x: 10, y: 10 };
let apple = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let paused = false;

let lastTime = 0;
const speed = 200; // мс між кадрами

function drawGrid() {
  ctx.strokeStyle = '#ddd';
  for (let i = 0; i < tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
}

function drawSnake() {
  ctx.fillStyle = 'green';
  ctx.fillRect(snake.x * gridSize, snake.y * gridSize, gridSize, gridSize);
}

function drawApple() {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(
    apple.x * gridSize + gridSize / 2,
    apple.y * gridSize + gridSize / 2,
    gridSize / 2.5,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function update() {
  if (gameOver || paused) return;

  snake.x += direction.x;
  snake.y += direction.y;

  if (
    snake.x < 0 || snake.x >= tileCount ||
    snake.y < 0 || snake.y >= tileCount
  ) {
    loseSound.play();
    score = 0;
    scoreEl.textContent = score;
    snake = { x: 10, y: 10 };
    direction = { x: 0, y: 0 };
    gameOver = true;
    setTimeout(() => gameOver = false, 1000);
    return;
  }

  if (snake.x === apple.x && snake.y === apple.y) {
    eatSound.play();
    score++;
    scoreEl.textContent = score;
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawApple();
  drawSnake();
}

function gameLoop(timestamp) {
  if (paused || gameOver) return;

  if (timestamp - lastTime > speed) {
    update();
    draw();
    lastTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

function setDirection(x, y) {
  if (direction.x !== x || direction.y !== y) {
    turnSound.play();
  }
  direction = { x, y };
}

document.getElementById('up').onmousedown = () => setDirection(0, -1);
document.getElementById('down').onmousedown = () => setDirection(0, 1);
document.getElementById('left').onmousedown = () => setDirection(-1, 0);
document.getElementById('right').onmousedown = () => setDirection(1, 0);

document.getElementById('pause').onclick = () => {
  paused = !paused;
  if (!paused) {
    requestAnimationFrame(gameLoop);
  }
};