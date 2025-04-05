// Game constants
const GAME_WIDTH =  window.innerWidth;
const GAME_HEIGHT =  window.innerHeight;
const GRAVITY = 0.5;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;

// Initialize PIXI Application
const app = new PIXI.Application({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x87CEEB, // Sky blue background
    resolution: 1,
});
document.body.appendChild(app.view);

// Game state
let gameState = {
    isJumping: false,
    keys: {},
    score: 0,
    coinCount: 0,
    totalCoins: 19, // Total number of coins in the game
    isGameOver: false,
    isVictory: false,
};

// Initialize sprite manager
const spriteManager = new SpriteManager(app);

// Initialize animation manager
const animationManager = new AnimationManager(app);

// Create player
const playerSprite = spriteManager.createPlayerSprite();
const player = playerSprite;
player.width = 50;
player.height = 50;
player.x = 100;
player.y = 300;
player.vx = 0;
player.vy = 0;
player.isOnGround = false;
app.stage.addChild(player);

// Create ground
const ground = new PIXI.Graphics();
ground.beginFill(0x00CC00);
ground.drawRect(0, 0, GAME_WIDTH, 50);
ground.endFill();
ground.x = 0;
ground.y = GAME_HEIGHT - 50;
app.stage.addChild(ground);

// Create platforms
const platforms = [];

function createPlatform(x, y, width, height) {
    const platform = new PIXI.Graphics();
    platform.beginFill(0x996633);
    platform.drawRect(0, 0, width, height);
    platform.endFill();
    platform.x = x;
    platform.y = y;
    app.stage.addChild(platform);
    platforms.push(platform);
    return platform;
}

// Add some platforms
createPlatform(300, 450, 200, 20);
createPlatform(500, 350, 100, 20);
createPlatform(200, 250, 150, 20);
createPlatform(500, 200, 200, 20);

// Initialize obstacle manager (aliens)
const obstacleManager = new ObstacleManager(app);

// Create coins
const coins = [];
function createCoins() {
    // Add coins above platforms
    coins.push(spriteManager.createCoin(400, 400));
    coins.push(spriteManager.createCoin(550, 300));
    coins.push(spriteManager.createCoin(275, 200));
    coins.push(spriteManager.createCoin(600, 150));
    
    // Add more coins in various positions
    for (let i = 0; i < 15; i++) {
        const x = 300 + Math.random() * 400;
        const y = 100 + Math.random() * 300;
        coins.push(spriteManager.createCoin(x, y));
    }
    
    // Add all coins to the stage
    coins.forEach(coin => {
        app.stage.addChild(coin);
    });
}

createCoins();

// UI elements
const scoreElement = document.getElementById('score');
const coinCounterElement = document.getElementById('coin-counter');
const gameOverElement = document.getElementById('game-over');
const victoryScreenElement = document.getElementById('victory-screen');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');

// Keyboard event handlers
window.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

// Restart game
function restartGame() {
    gameState.isGameOver = false;
    gameState.isVictory = false;
    gameState.score = 0;
    gameState.coinCount = 0;
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.visible = true;
    obstacleManager.reset();
    
    // Reset coins
    coins.forEach(coin => {
        coin.visible = true;
    });
    
    gameOverElement.style.display = 'none';
    victoryScreenElement.style.display = 'none';
    updateScore();
    updateCoinCounter();
}

restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', restartGame);

// Update score display
function updateScore() {
    scoreElement.textContent = "Score:"  + Math.floor(gameState.score);
}

// Update coin counter
function updateCoinCounter() {
    coinCounterElement.textContent = "Coins:"  + gameState.coinCount + "/" + gameState.totalCoins;
}

// Game over
function gameOver() {
    if (gameState.isGameOver || gameState.isVictory) return;
    
    gameState.isGameOver = true;
    
    // Play death animation
    animationManager.playDeathAnimation(player.x + player.width/2, player.y + player.height/2);
    
    // Hide the player
    player.visible = false;
    
    // Show game over screen after a delay
    setTimeout(() => {
        gameOverElement.style.display = 'block';
    }, 2000);
}

// Victory condition
function checkVictory() {
    if (gameState.coinCount >= gameState.totalCoins) {
        victory();
    }
}

// Victory achieved
function victory() {
    if (gameState.isGameOver || gameState.isVictory) return;
    
    gameState.isVictory = true;
    
    // Play victory animation
    animationManager.playVictoryAnimation();
    
    // Show victory screen after animation plays
    setTimeout(() => {
        victoryScreenElement.style.display = 'block';
    }, 2000);
}

// Check coin collection
function checkCoinCollection() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        if (coin.visible && 
            player.x + player.width > coin.x - 10 &&
            player.x < coin.x + 10 &&
            player.y + player.height > coin.y - 10 &&
            player.y < coin.y + 10) {
            // Collect the coin
            coin.visible = false;
            gameState.score += 50;
            gameState.coinCount++;
            updateScore();
            updateCoinCounter();
            
            // Check if player has collected all coins
            checkVictory();
        }
    }
}

// Create background
function createBackground() {
    // Sky is already set as background color
    
    // Add sun
    const sun = new PIXI.Graphics();
    sun.beginFill(0xFFFF00);
    sun.drawCircle(0, 0, 40);
    sun.endFill();
    sun.x = GAME_WIDTH - 80;
    sun.y = 80;
    app.stage.addChild(sun);
    
    // Add clouds
    for (let i = 0; i < 5; i++) {
        const cloud = new PIXI.Graphics();
        cloud.beginFill(0xFFFFFF);
        cloud.drawEllipse(0, 0, 50 + Math.random() * 30, 20 + Math.random() * 10);
        cloud.endFill();
        cloud.x = Math.random() * GAME_WIDTH;
        cloud.y = 50 + Math.random() * 100;
        cloud.vx = 0.5 + Math.random() * 0.5;
        app.stage.addChild(cloud);
        
        // Move clouds
        app.ticker.add(() => {
            cloud.x += cloud.vx;
            if (cloud.x > GAME_WIDTH + 100) {
                cloud.x = -100;
            }
        });
    }
    
    // Add hills in the background
    const hills = new PIXI.Graphics();
    hills.beginFill(0x4CAF50);
    
    // Create a few hills with bezier curves
    hills.moveTo(0, GAME_HEIGHT - 50);
    hills.bezierCurveTo(
        GAME_WIDTH / 4, GAME_HEIGHT - 150,
        GAME_WIDTH / 3, GAME_HEIGHT - 150,
        GAME_WIDTH / 2, GAME_HEIGHT - 50
    );
    
    hills.bezierCurveTo(
        GAME_WIDTH * 2/3, GAME_HEIGHT - 120,
        GAME_WIDTH * 3/4, GAME_HEIGHT - 120,
        GAME_WIDTH, GAME_HEIGHT - 50
    );
    
    hills.lineTo(GAME_WIDTH, GAME_HEIGHT);
    hills.lineTo(0, GAME_HEIGHT);
    hills.endFill();
    
    // Add hills behind everything else
    app.stage.addChildAt(hills, 0);
}

createBackground();

// Update the game title in index.html
document.title = "Alien Runner - 2D Platform Game";

// Initialize counters
updateScore();
updateCoinCounter();

// Game loop
app.ticker.add((delta) => {
    if (gameState.isGameOver || gameState.isVictory) return;

    // Handle player input
    player.vx = 0;
    
    if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
        player.vx = -MOVE_SPEED;
    }
    
    if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
        player.vx = MOVE_SPEED;
    }
    
    if ((gameState.keys['ArrowUp'] || gameState.keys['w'] || gameState.keys[' ']) && player.isOnGround) {
        player.vy = JUMP_FORCE;
        player.isOnGround = false;
    }
    
    // Apply gravity
    player.vy += GRAVITY;
    
    // Update player position
    player.x += player.vx;
    player.y += player.vy;
    
    // Check boundaries
    if (player.x < 0) {
        player.x = 0;
    }
    
    if (player.x + player.width > GAME_WIDTH) {
        player.x = GAME_WIDTH - player.width;
    }
    
    // Handle collisions
    player.isOnGround = false;
    
    // Ground collision
    if (player.y + player.height > ground.y) {
        player.y = ground.y - player.height;
        player.vy = 0;
        player.isOnGround = true;
    }
    
    // Platform collisions
    platforms.forEach(platform => {
        if (player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height &&
            player.vy > 0) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.isOnGround = true;
        }
    });

    // Update obstacles (aliens)
    obstacleManager.update();

    // Check for collision with obstacles
    if (obstacleManager.checkCollision(player)) {
        gameOver();
    }
    
    // Check coin collection
    checkCoinCollection();

    // Update score based on survival time
    gameState.score += 0.1;
    if (Math.floor(gameState.score) % 10 === 0) {
        updateScore();
    }
});

// Resize handler to make the game responsive
window.addEventListener('resize', () => {
    const parent = app.view.parentNode;
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
});

