// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// Game state
let gameRunning = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// Snake properties
let snake = [];
let snakeX = 10;
let snakeY = 10;
let velocityX = 0;
let velocityY = 0;
let tailLength = 2;

// Food properties
let foodX = 5;
let foodY = 5;

// Colors
const snakeHeadColor = '#007aff';
const snakeBodyColor = '#5ac8fa';
const foodColor = '#ff9500';
const gridColor = '#e5e5ea';

// Initialize the game
function initGame() {
    snake = [];
    tailLength = 2;
    snakeX = 10;
    snakeY = 10;
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    placeFood();
}

// Place food at random position
function placeFood() {
    // Generate random position for food
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    
    // Make sure food doesn't spawn on snake
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === foodX && snake[i].y === foodY) {
            placeFood(); // Try again if food spawns on snake
            return;
        }
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    if (gameOver) {
        drawGameOver();
        return;
    }
    
    setTimeout(function() {
        clearCanvas();
        drawGrid();
        moveSnake();
        drawFood();
        drawSnake();
        checkCollision();
        gameLoop();
    }, 1000 / speed);
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// Move snake
function moveSnake() {
    // Update snake position
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Add current position to snake array
    snake.unshift({x: snakeX, y: snakeY});
    
    // Remove tail if not eating food
    if (snake.length > tailLength) {
        snake.pop();
    }
}

// Draw snake
function drawSnake() {
    // Draw snake body
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snakeBodyColor;
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Draw snake head
    if (snake.length > 0) {
        ctx.fillStyle = snakeHeadColor;
        ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
    }
}

// Draw food
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(
        foodX * gridSize + gridSize / 2,
        foodY * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Check for collisions
function checkCollision() {
    // Check if snake eats food
    if (snakeX === foodX && snakeY === foodY) {
        tailLength++;
        score += 10;
        scoreElement.textContent = score;
        placeFood();
        
        // Increase speed every 5 food items
        if (score % 50 === 0) {
            speed += 1;
        }
    }
    
    // Check if snake hits wall
    if (snakeX < 0 || snakeX >= tileCount || snakeY < 0 || snakeY >= tileCount) {
        gameOver = true;
    }
    
    // Check if snake hits itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snakeX && snake[i].y === snakeY) {
            gameOver = true;
            break;
        }
    }
    
    // Update high score
    if (gameOver && score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

// Draw game over screen
function drawGameOver() {
    clearCanvas();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.font = '16px Arial';
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 50);
    
    gameRunning = false;
}

// Event listeners
startBtn.addEventListener('click', function() {
    if (!gameRunning) {
        if (gameOver) {
            initGame();
        }
        gameRunning = true;
        gameLoop();
        this.textContent = 'Pause';
    } else {
        gameRunning = false;
        this.textContent = 'Resume';
    }
});

resetBtn.addEventListener('click', function() {
    initGame();
    gameRunning = false;
    startBtn.textContent = 'Start Game';
});

// Keyboard controls
document.addEventListener('keydown', function(event) {
    // Prevent arrow keys from scrolling the page
    if ([37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
    
    // Left arrow
    if (event.keyCode === 37 && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    // Up arrow
    else if (event.keyCode === 38 && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
    // Right arrow
    else if (event.keyCode === 39 && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
    // Down arrow
    else if (event.keyCode === 40 && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
    
    // Start game with any arrow key if not running
    if (!gameRunning && [37, 38, 39, 40].includes(event.keyCode)) {
        if (gameOver) {
            initGame();
        }
        gameRunning = true;
        gameLoop();
        startBtn.textContent = 'Pause';
    }
});

// Add touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    event.preventDefault();
});

canvas.addEventListener('touchmove', function(event) {
    if (!touchStartX || !touchStartY) return;
    
    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;
    
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    
    // Determine swipe direction based on which axis had larger movement
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && velocityX !== -1) {
            // Right swipe
            velocityX = 1;
            velocityY = 0;
        } else if (dx < 0 && velocityX !== 1) {
            // Left swipe
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        // Vertical swipe
        if (dy > 0 && velocityY !== -1) {
            // Down swipe
            velocityX = 0;
            velocityY = 1;
        } else if (dy < 0 && velocityY !== 1) {
            // Up swipe
            velocityX = 0;
            velocityY = -1;
        }
    }
    
    // Start game with swipe if not running
    if (!gameRunning) {
        if (gameOver) {
            initGame();
        }
        gameRunning = true;
        gameLoop();
        startBtn.textContent = 'Pause';
    }
    
    // Reset touch start position
    touchStartX = touchEndX;
    touchStartY = touchEndY;
    
    event.preventDefault();
});

// Initialize the game
initGame();