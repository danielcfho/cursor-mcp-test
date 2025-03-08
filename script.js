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
const SWIPE_THRESHOLD = 30; // Minimum swipe distance to register
let lastRenderTime = 0;

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
    // Clear snake array
    snake = [];
    
    // Set initial position
    snakeX = 10;
    snakeY = 10;
    
    // Add initial snake segments (head + 1 body segment)
    snake.push({x: snakeX, y: snakeY}); // Head
    snake.push({x: snakeX-1, y: snakeY}); // Body segment
    
    tailLength = 2;
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
    let newFoodX, newFoodY;
    let foodOnSnake = true;
    
    // Keep generating new positions until we find one that's not on the snake
    while (foodOnSnake) {
        foodOnSnake = false;
        newFoodX = Math.floor(Math.random() * tileCount);
        newFoodY = Math.floor(Math.random() * tileCount);
        
        // Check if the new food position is on any part of the snake
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
                foodOnSnake = true;
                break;
            }
        }
    }
    
    // Set the food position
    foodX = newFoodX;
    foodY = newFoodY;
}

// Game loop
function gameLoop(currentTime) {
    if (!gameRunning) return;
    
    window.requestAnimationFrame(gameLoop);
    
    // Calculate time since last render
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    
    // Only update game at the specified speed
    if (secondsSinceLastRender < 1 / speed) return;
    
    lastRenderTime = currentTime;
    
    if (gameOver) {
        drawGameOver();
        return;
    }
    
    clearCanvas();
    drawGrid();
    moveSnake();
    drawFood();
    drawSnake();
    checkCollision();
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
    // Only move if the snake has a direction
    if (velocityX === 0 && velocityY === 0) return;
    
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
    startBtn.textContent = 'Start Game';
}

// Event listeners
startBtn.addEventListener('click', function() {
    if (!gameRunning) {
        if (gameOver) {
            initGame();
            gameOver = false;
        }
        gameRunning = true;
        window.requestAnimationFrame(gameLoop);
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
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', ' '].includes(event.key) || 
        [32, 37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
    
    // Left arrow
    if ((event.key === 'ArrowLeft' || event.keyCode === 37) && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    // Up arrow
    else if ((event.key === 'ArrowUp' || event.keyCode === 38) && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
    // Right arrow
    else if ((event.key === 'ArrowRight' || event.keyCode === 39) && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
    // Down arrow
    else if ((event.key === 'ArrowDown' || event.keyCode === 40) && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
    // Space bar to pause/resume
    else if (event.key === ' ' || event.keyCode === 32) {
        if (!gameRunning) {
            if (gameOver) {
                initGame();
                gameOver = false;
            }
            gameRunning = true;
            window.requestAnimationFrame(gameLoop);
            startBtn.textContent = 'Pause';
        } else {
            gameRunning = false;
            startBtn.textContent = 'Resume';
        }
    }
    
    // Start game with any arrow key if not running
    if (!gameRunning && 
        (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key) || 
         [37, 38, 39, 40].includes(event.keyCode))) {
        if (gameOver) {
            initGame();
            gameOver = false;
        }
        gameRunning = true;
        window.requestAnimationFrame(gameLoop);
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
    
    // Only register swipe if it exceeds the threshold
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
        return;
    }
    
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
            gameOver = false;
        }
        gameRunning = true;
        window.requestAnimationFrame(gameLoop);
        startBtn.textContent = 'Pause';
    }
    
    // Reset touch start position
    touchStartX = touchEndX;
    touchStartY = touchEndY;
    
    event.preventDefault();
});

// Reset touch coordinates when finger is lifted
canvas.addEventListener('touchend', function(event) {
    touchStartX = 0;
    touchStartY = 0;
    event.preventDefault();
});

// Fix for mobile devices to prevent scrolling while playing
document.body.addEventListener('touchmove', function(event) {
    if (gameRunning) {
        event.preventDefault();
    }
}, { passive: false });

// Initialize the game
initGame();