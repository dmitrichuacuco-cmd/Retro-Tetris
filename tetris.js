const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreValue = document.getElementById('score-value');
const levelValue = document.getElementById('level-value');
const startButton = document.getElementById('startButton');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const EMPTY_CELL = 'white';
let grid = [];
let score = 0;
let level = 1;
let gameInterval;

// Initialize grid
function initializeGrid() {
  for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
      grid[row][col] = EMPTY_CELL;
    }
  }
}

// Draw grid
function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawBlock(col, row, grid[row][col]);
    }
  }
}

// Draw single block
function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = '#333';
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Clear filled rows
function clearRows() {
  let rowCount = 0;
  for (let row = 0; row < ROWS; row++) {
    if (grid[row].every(cell => cell !== EMPTY_CELL)) {
      grid.splice(row, 1);
      grid.unshift(Array(COLS).fill(EMPTY_CELL));
      rowCount++;
    }
  }
  score += rowCount * 100;
  scoreValue.textContent = score;
  if (score >= level * 1000) {
    level++;
    levelValue.textContent = level;
    clearInterval(gameInterval);
    startGame();
  }
}

// Check if a piece can move
function canMove(shape, offsetX, offsetY) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] && (grid[row + offsetY] && grid[row + offsetY][col + offsetX]) !== EMPTY_CELL) {
        return false;
      }
    }
  }
  return true;
}

// Merge piece into grid
function merge(shape, offsetX, offsetY) {
  shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        grid[i + offsetY][j + offsetX] = 'black'; // Change to appropriate color
      }
    });
  });
}

// Draw piece on the grid
function drawPiece(shape, offsetX, offsetY, color) {
  shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        drawBlock(j + offsetX, i + offsetY, color);
      }
    });
  });
}

// Random shape
function getRandomShape() {
  const shapes = [
    [[1, 1, 1, 1]],          // I
    [[1, 1, 1], [0, 1, 0]],  // T
    [[1, 1, 1], [1, 0, 0]],  // L
    [[1, 1, 1], [0, 0, 1]],  // J
    [[1, 1], [1, 1]],        // O
    [[0, 1, 1], [1, 1, 0]],  // Z
    [[1, 1, 0], [0, 1, 1]]   // S
  ];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

// Rotate piece
function rotateShape(shape) {
  const rotatedShape = [];
  for (let i = 0; i < shape[0].length; i++) {
    rotatedShape.push(shape.map(row => row[i]).reverse());
  }
  return rotatedShape;
}

// Start game
function startGame() {
  initializeGrid();
  score = 0;
  level = 1;
  scoreValue.textContent = score;
  levelValue.textContent = level;
  gameInterval = setInterval(moveDown, 500);
  draw();
}

// Handle keyboard controls
function handleKeyPress(event) {
  switch (event.keyCode) {
    case 37: // Left arrow key
      moveLeft();
      break;
    case 39: // Right arrow key
      moveRight();
      break;
    case 40: // Down arrow key
      moveDown();
      break;
    case 38: // Up arrow key
      rotate();
      break;
  }
}

// Move piece left
function moveLeft() {
  if (canMove(currentShape, currentX - 1, currentY)) {
    currentX--;
    draw();
  }
}

// Move piece right
function moveRight() {
  if (canMove(currentShape, currentX + 1, currentY)) {
    currentX++;
    draw();
  }
}

// Move piece down
function moveDown() {
  if (canMove(currentShape, currentX, currentY + 1)) {
    currentY++;
  } else {
    merge(currentShape, currentX, currentY);
    clearRows();
    currentShape = getRandomShape();
    currentX = Math.floor(COLS / 2) - Math.floor(currentShape[0].length / 2);
    currentY = 0;
    if (!canMove(currentShape, currentX, currentY)) {
      clearInterval(gameInterval);
      alert("Game Over! Your score: " + score);
    }
  }
  draw();
}

// Rotate piece
function rotate() {
  const rotatedShape = rotateShape(currentShape);
  if (canMove(rotatedShape, currentX, currentY)) {
    currentShape = rotatedShape;
    draw();
  }
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawPiece(currentShape, currentX, currentY, '#DB261D'); // Change color as per the shape
}

// Start game
startButton.addEventListener('click', () => {
  startGame();
  startButton.disabled = true;
});

// Initialize game
document.addEventListener('keydown', handleKeyPress);
let currentShape = getRandomShape();
let currentX = Math.floor(COLS / 2) - Math.floor(currentShape[0].length / 2);
let currentY = 0;
draw();

// Function to play the Tetris theme music
function playTetrisMusic() {
  const tetrisMusic = document.getElementById('tetrisMusic');
  tetrisMusic.play();
}

// Function to pause the Tetris theme music
function pauseTetrisMusic() {
  const tetrisMusic = document.getElementById('tetrisMusic');
  tetrisMusic.pause();
}

// Start game function
function startGame() {
  // Start the game
  initializeGrid();
  score = 0;
  level = 1;
  scoreValue.textContent = score;
  levelValue.textContent = level;
  gameInterval = setInterval(moveDown, 500);
  draw();

  // Play Tetris theme music
  playTetrisMusic();
}

// Game over function
function gameOver() {
  // Stop the game
  clearInterval(gameInterval);
  alert("Game Over! Your score: " + score);

  // Pause Tetris theme music
  pauseTetrisMusic();
}

// Add event listener to start button
startButton.addEventListener('click', () => {
  startGame();
  startButton.disabled = true;
});

// Function to play the score sound effect
function playScoreSound() {
  const scoreSound = new Audio('Bing.mp3'); // Path to your score sound effect file
  scoreSound.play();
}

// Clear filled rows
function clearRows() {
  let rowCount = 0;
  for (let row = 0; row < ROWS; row++) {
    if (grid[row].every(cell => cell !== EMPTY_CELL)) {
      grid.splice(row, 1);
      grid.unshift(Array(COLS).fill(EMPTY_CELL));
      rowCount++;
    }
  }
  score += rowCount * 100;
  scoreValue.textContent = score;

  // Check if the score increased
  if (rowCount > 0) {
    // Play score sound effect
    playScoreSound();
  }

  if (score >= level * 1000) {
    level++;
    levelValue.textContent = level;
    clearInterval(gameInterval);
    startGame();
  }
}
