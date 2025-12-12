// ============================================
// JUMP MATH - 2D Platformer with Math Puzzles
// ============================================

// Game Configuration
const CONFIG = {
    gravity: 0.6,
    jumpForce: -14,
    playerSpeed: 5,
    groundHeight: 80,
    coinSpawnRate: 120, // frames
    obstacleSpawnRate: 180, // frames
    scrollSpeed: 3
};

// Theme Definitions
const THEMES = {
    forest: {
        name: 'Forest',
        sky: ['#87CEEB', '#228B22'],
        ground: '#3d2817',
        groundTop: '#228B22',
        player: '#FF6B35',
        coin: '#FFD700',
        obstacles: {
            static: ['#654321', '#8B4513'],
            dynamic: '#FF4444'
        },
        decorations: ['🌲', '🌳', '🍄', '🌿']
    },
    snow: {
        name: 'Snowy Mountains',
        sky: ['#B0E0E6', '#E0F0FF'],
        ground: '#4a6fa5',
        groundTop: '#FFFAFA',
        player: '#FF6B35',
        coin: '#FFD700',
        obstacles: {
            static: ['#708090', '#A9A9A9'],
            dynamic: '#4169E1'
        },
        decorations: ['🏔️', '❄️', '⛄', '🎿']
    },
    beach: {
        name: 'Beach',
        sky: ['#87CEEB', '#FFE4B5'],
        ground: '#0077BE',
        groundTop: '#F4D03F',
        player: '#FF6B35',
        coin: '#FFD700',
        obstacles: {
            static: ['#8B4513', '#D2691E'],
            dynamic: '#FF6347'
        },
        decorations: ['🏝️', '🌴', '🐚', '🦀']
    }
};

// Game State
let game = {
    canvas: null,
    ctx: null,
    running: false,
    paused: false,
    score: 0,
    theme: 'forest',
    mathMin: 1,
    mathMax: 12,
    frameCount: 0,
    player: null,
    coins: [],
    obstacles: [],
    decorations: [],
    keys: {},
    pendingPuzzle: null,
    puzzleType: null // 'coin' or 'obstacle'
};

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.velX = 0;
        this.velY = 0;
        this.onGround = false;
        this.direction = 1;
    }

    update() {
        // Horizontal movement
        if (game.keys['ArrowLeft'] || game.keys['left']) {
            this.velX = -CONFIG.playerSpeed;
            this.direction = -1;
        } else if (game.keys['ArrowRight'] || game.keys['right']) {
            this.velX = CONFIG.playerSpeed;
            this.direction = 1;
        } else {
            this.velX *= 0.8;
        }

        // Apply gravity
        this.velY += CONFIG.gravity;

        // Apply velocity
        this.x += this.velX;
        this.y += this.velY;

        // Ground collision
        const groundY = game.canvas.height - CONFIG.groundHeight;
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.velY = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        // Screen bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > game.canvas.width) {
            this.x = game.canvas.width - this.width;
        }
    }

    jump() {
        if (this.onGround) {
            this.velY = CONFIG.jumpForce;
            this.onGround = false;
        }
    }

    draw(ctx) {
        const theme = THEMES[game.theme];
        
        // Body
        ctx.fillStyle = theme.player;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = '#fff';
        const eyeX = this.direction > 0 ? this.x + 25 : this.x + 8;
        ctx.fillRect(eyeX, this.y + 10, 8, 8);
        
        // Pupil
        ctx.fillStyle = '#000';
        const pupilX = this.direction > 0 ? eyeX + 4 : eyeX;
        ctx.fillRect(pupilX, this.y + 12, 4, 4);
        
        // Legs (animate when moving)
        ctx.fillStyle = '#333';
        const legOffset = Math.sin(game.frameCount * 0.3) * 5;
        if (Math.abs(this.velX) > 0.5 && this.onGround) {
            ctx.fillRect(this.x + 5, this.y + this.height, 10, 10 + legOffset);
            ctx.fillRect(this.x + 25, this.y + this.height, 10, 10 - legOffset);
        } else {
            ctx.fillRect(this.x + 5, this.y + this.height, 10, 10);
            ctx.fillRect(this.x + 25, this.y + this.height, 10, 10);
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Coin Class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.collected = false;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.x -= CONFIG.scrollSpeed;
    }

    draw(ctx) {
        if (this.collected) return;
        
        const theme = THEMES[game.theme];
        const bobY = this.y + Math.sin(game.frameCount * 0.1 + this.bobOffset) * 5;
        
        // Coin glow
        ctx.beginPath();
        ctx.arc(this.x, bobY, this.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fill();
        
        // Coin
        ctx.beginPath();
        ctx.arc(this.x, bobY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme.coin;
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // $ symbol
        ctx.fillStyle = '#B8860B';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', this.x, bobY);
    }

    getBounds() {
        const bobY = this.y + Math.sin(game.frameCount * 0.1 + this.bobOffset) * 5;
        return {
            x: this.x - this.radius,
            y: bobY - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }

    isOffScreen() {
        return this.x + this.radius < 0;
    }
}

// Obstacle Class
class Obstacle {
    constructor(x, y, width, height, isDynamic = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDynamic = isDynamic;
        this.hit = false;
        this.moveDir = 1;
        this.startY = y;
        this.moveRange = 50;
    }

    update() {
        this.x -= CONFIG.scrollSpeed;
        
        if (this.isDynamic) {
            this.y += this.moveDir * 2;
            if (this.y <= this.startY - this.moveRange || 
                this.y >= this.startY + this.moveRange) {
                this.moveDir *= -1;
            }
        }
    }

    draw(ctx) {
        if (this.hit) return;
        
        const theme = THEMES[game.theme];
        const colors = this.isDynamic ? 
            [theme.obstacles.dynamic] : 
            theme.obstacles.static;
        
        if (this.isDynamic) {
            // Dynamic obstacle - spiky ball
            ctx.fillStyle = colors[0];
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                    this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Spikes
            const centerX = this.x + this.width/2;
            const centerY = this.y + this.height/2;
            const spikeCount = 8;
            ctx.fillStyle = '#FF0000';
            for (let i = 0; i < spikeCount; i++) {
                const angle = (i / spikeCount) * Math.PI * 2 + game.frameCount * 0.05;
                const innerX = centerX + Math.cos(angle) * (this.width/2);
                const innerY = centerY + Math.sin(angle) * (this.height/2);
                const outerX = centerX + Math.cos(angle) * (this.width/2 + 10);
                const outerY = centerY + Math.sin(angle) * (this.height/2 + 10);
                
                ctx.beginPath();
                ctx.moveTo(innerX, innerY);
                ctx.lineTo(outerX, outerY);
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#FF0000';
                ctx.stroke();
            }
        } else {
            // Static obstacle - rock/box
            ctx.fillStyle = colors[0];
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Top highlight
            ctx.fillStyle = colors[1];
            ctx.fillRect(this.x, this.y, this.width, 10);
            
            // Details
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// Decoration Class
class Decoration {
    constructor(x, emoji) {
        this.x = x;
        this.y = game.canvas.height - CONFIG.groundHeight - 30;
        this.emoji = emoji;
    }

    update() {
        this.x -= CONFIG.scrollSpeed * 0.5;
    }

    draw(ctx) {
        ctx.font = '30px Arial';
        ctx.fillText(this.emoji, this.x, this.y);
    }

    isOffScreen() {
        return this.x < -50;
    }
}

// Math Puzzle Generator
function generateMathPuzzle() {
    const a = Math.floor(Math.random() * (game.mathMax - game.mathMin + 1)) + game.mathMin;
    const b = Math.floor(Math.random() * (game.mathMax - game.mathMin + 1)) + game.mathMin;
    return {
        question: `${a} × ${b} = ?`,
        answer: a * b
    };
}

// Collision Detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Show Puzzle Modal
function showPuzzle(type) {
    game.paused = true;
    game.puzzleType = type;
    game.pendingPuzzle = generateMathPuzzle();
    
    const modal = document.getElementById('puzzle-modal');
    const title = document.getElementById('puzzle-title');
    const question = document.getElementById('puzzle-question');
    const answer = document.getElementById('puzzle-answer');
    const feedback = document.getElementById('puzzle-feedback');
    
    title.textContent = type === 'coin' ? '🪙 Coin Collected!' : '💥 Obstacle Hit!';
    question.textContent = game.pendingPuzzle.question;
    answer.value = '';
    feedback.textContent = '';
    feedback.className = '';
    
    modal.classList.add('active');
    answer.focus();
}

// Check Puzzle Answer
function checkPuzzleAnswer() {
    const answerInput = document.getElementById('puzzle-answer');
    const feedback = document.getElementById('puzzle-feedback');
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) {
        feedback.textContent = 'Please enter a number!';
        feedback.className = 'wrong';
        return;
    }
    
    const isCorrect = userAnswer === game.pendingPuzzle.answer;
    
    if (game.puzzleType === 'coin') {
        if (isCorrect) {
            game.score += 1;
            feedback.textContent = '✅ Correct! +1 point';
            feedback.className = 'correct';
        } else {
            feedback.textContent = `❌ Wrong! The answer was ${game.pendingPuzzle.answer}`;
            feedback.className = 'wrong';
        }
    } else {
        // Obstacle
        if (isCorrect) {
            feedback.textContent = '✅ Correct! No penalty';
            feedback.className = 'correct';
        } else {
            game.score -= 1;
            feedback.textContent = `❌ Wrong! -1 point. Answer was ${game.pendingPuzzle.answer}`;
            feedback.className = 'wrong';
        }
    }
    
    updateScoreDisplay();
    
    setTimeout(() => {
        document.getElementById('puzzle-modal').classList.remove('active');
        game.paused = false;
        game.pendingPuzzle = null;
        game.puzzleType = null;
        
        // Check for game over
        if (game.score < -5) {
            gameOver();
        }
    }, 1500);
}

// Update Score Display
function updateScoreDisplay() {
    document.getElementById('score').textContent = `Score: ${game.score}`;
}

// Spawn Functions
function spawnCoin() {
    const groundY = game.canvas.height - CONFIG.groundHeight;
    // Coin y is the CENTER of the coin (radius=15)
    // Spawn coins at a nice height - requires a small jump
    const y = groundY - 70 - Math.random() * 50; // Between 70-120px above ground
    
    game.coins.push(new Coin(game.canvas.width + 50, y));
}

function spawnObstacle() {
    const groundY = game.canvas.height - CONFIG.groundHeight;
    const isDynamic = Math.random() > 0.6;
    
    let width, height, y;
    
    if (isDynamic) {
        width = 40;
        height = 40;
        // Dynamic obstacles hover lower - more dangerous!
        y = groundY - height - Math.random() * 40 - 20;
    } else {
        width = 40 + Math.random() * 30;
        height = 30 + Math.random() * 40;
        y = groundY - height;
    }
    
    game.obstacles.push(new Obstacle(game.canvas.width + 50, y, width, height, isDynamic));
}

function spawnDecoration() {
    const theme = THEMES[game.theme];
    const emoji = theme.decorations[Math.floor(Math.random() * theme.decorations.length)];
    game.decorations.push(new Decoration(game.canvas.width + 50, emoji));
}

// Draw Background
function drawBackground() {
    const theme = THEMES[game.theme];
    const ctx = game.ctx;
    
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, game.canvas.height);
    gradient.addColorStop(0, theme.sky[0]);
    gradient.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    
    // Ground top layer
    const groundY = game.canvas.height - CONFIG.groundHeight;
    ctx.fillStyle = theme.groundTop;
    ctx.fillRect(0, groundY, game.canvas.width, 20);
    
    // Ground
    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, groundY + 20, game.canvas.width, CONFIG.groundHeight - 20);
}

// Game Loop
function gameLoop() {
    if (!game.running) return;
    
    if (!game.paused) {
        update();
    }
    render();
    
    requestAnimationFrame(gameLoop);
}

function update() {
    game.frameCount++;
    
    // Update player
    game.player.update();
    
    // Spawn entities
    if (game.frameCount % CONFIG.coinSpawnRate === 0) {
        spawnCoin();
    }
    if (game.frameCount % CONFIG.obstacleSpawnRate === 0) {
        spawnObstacle();
    }
    if (game.frameCount % 200 === 0) {
        spawnDecoration();
    }
    
    // Update coins
    game.coins.forEach(coin => coin.update());
    game.coins = game.coins.filter(coin => !coin.isOffScreen() && !coin.collected);
    
    // Update obstacles
    game.obstacles.forEach(obs => obs.update());
    game.obstacles = game.obstacles.filter(obs => !obs.isOffScreen() && !obs.hit);
    
    // Update decorations
    game.decorations.forEach(dec => dec.update());
    game.decorations = game.decorations.filter(dec => !dec.isOffScreen());
    
    // Check collisions
    const playerBounds = game.player.getBounds();
    
    // Coin collisions
    game.coins.forEach(coin => {
        if (!coin.collected && checkCollision(playerBounds, coin.getBounds())) {
            coin.collected = true;
            showPuzzle('coin');
        }
    });
    
    // Obstacle collisions
    game.obstacles.forEach(obs => {
        if (!obs.hit && checkCollision(playerBounds, obs.getBounds())) {
            obs.hit = true;
            showPuzzle('obstacle');
        }
    });
}

function render() {
    drawBackground();
    
    // Draw decorations (behind everything)
    game.decorations.forEach(dec => dec.draw(game.ctx));
    
    // Draw coins
    game.coins.forEach(coin => coin.draw(game.ctx));
    
    // Draw obstacles
    game.obstacles.forEach(obs => obs.draw(game.ctx));
    
    // Draw player
    game.player.draw(game.ctx);
}

// Initialize Game
function initGame() {
    game.canvas = document.getElementById('game-canvas');
    game.ctx = game.canvas.getContext('2d');
    
    resizeCanvas();
    
    // Event Listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            game.theme = btn.dataset.theme;
        });
    });
    
    // Start button
    document.getElementById('start-btn').addEventListener('click', startGame);
    
    // Pause button
    document.getElementById('pause-btn').addEventListener('click', () => {
        game.paused = true;
        document.getElementById('pause-modal').classList.add('active');
    });
    
    // Resume button
    document.getElementById('resume-btn').addEventListener('click', () => {
        document.getElementById('pause-modal').classList.remove('active');
        game.paused = false;
    });
    
    // Quit button
    document.getElementById('quit-btn').addEventListener('click', () => {
        document.getElementById('pause-modal').classList.remove('active');
        showMenu();
    });
    
    // Puzzle submit
    document.getElementById('submit-answer').addEventListener('click', checkPuzzleAnswer);
    document.getElementById('puzzle-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPuzzleAnswer();
    });
    
    // Game over buttons
    document.getElementById('retry-btn').addEventListener('click', () => {
        document.getElementById('gameover-modal').classList.remove('active');
        startGame();
    });
    document.getElementById('menu-btn').addEventListener('click', () => {
        document.getElementById('gameover-modal').classList.remove('active');
        showMenu();
    });
    
    // Mobile controls
    setupMobileControls();
    
    // Select forest by default
    document.querySelector('.theme-btn[data-theme="forest"]').classList.add('selected');
}

function resizeCanvas() {
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
}

function handleKeyDown(e) {
    game.keys[e.key] = true;
    
    if ((e.key === 'ArrowUp' || e.key === ' ') && game.player && !game.paused) {
        game.player.jump();
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    game.keys[e.key] = false;
}

function setupMobileControls() {
    const leftBtn = document.getElementById('btn-left');
    const rightBtn = document.getElementById('btn-right');
    const jumpBtn = document.getElementById('btn-jump');
    
    // Touch events
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        game.keys['left'] = true;
    });
    leftBtn.addEventListener('touchend', () => game.keys['left'] = false);
    
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        game.keys['right'] = true;
    });
    rightBtn.addEventListener('touchend', () => game.keys['right'] = false);
    
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (game.player) game.player.jump();
    });
    
    // Mouse events for desktop testing
    leftBtn.addEventListener('mousedown', () => game.keys['left'] = true);
    leftBtn.addEventListener('mouseup', () => game.keys['left'] = false);
    leftBtn.addEventListener('mouseleave', () => game.keys['left'] = false);
    
    rightBtn.addEventListener('mousedown', () => game.keys['right'] = true);
    rightBtn.addEventListener('mouseup', () => game.keys['right'] = false);
    rightBtn.addEventListener('mouseleave', () => game.keys['right'] = false);
    
    jumpBtn.addEventListener('mousedown', () => {
        if (game.player) game.player.jump();
    });
}

function startGame() {
    // Get math settings
    game.mathMin = parseInt(document.getElementById('min-mult').value) || 1;
    game.mathMax = parseInt(document.getElementById('max-mult').value) || 12;
    
    // Validate
    if (game.mathMin > game.mathMax) {
        [game.mathMin, game.mathMax] = [game.mathMax, game.mathMin];
    }
    
    // Reset game state
    game.score = 0;
    game.frameCount = 0;
    game.coins = [];
    game.obstacles = [];
    game.decorations = [];
    game.paused = false;
    game.keys = {};
    
    // Create player
    game.player = new Player(100, game.canvas.height - CONFIG.groundHeight - 60);
    
    // Update UI
    updateScoreDisplay();
    document.getElementById('theme-display').textContent = THEMES[game.theme].name;
    
    // Switch screens
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // Start game loop
    game.running = true;
    gameLoop();
}

function showMenu() {
    game.running = false;
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('menu-screen').classList.add('active');
}

function gameOver() {
    game.running = false;
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('gameover-modal').classList.add('active');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);
