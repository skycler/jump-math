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
        platform: { top: '#228B22', bottom: '#3d2817' },
        obstacles: {
            static: ['#654321', '#8B4513'],
            dynamic: '#FF4444',
            staticType: 'log',      // Fallen logs
            dynamicType: 'bee'      // Angry bees
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
        platform: { top: '#FFFAFA', bottom: '#a8d5ff' },
        obstacles: {
            static: ['#708090', '#A9A9A9'],
            dynamic: '#4169E1',
            staticType: 'ice',      // Ice blocks
            dynamicType: 'snowball' // Rolling snowballs
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
        platform: { top: '#c2a66b', bottom: '#8B7355' },
        obstacles: {
            static: ['#8B4513', '#D2691E'],
            dynamic: '#FF6347',
            staticType: 'sandcastle', // Sand castles
            dynamicType: 'crab'       // Scuttling crabs
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
    platforms: [],
    decorations: [],
    keys: {},
    pendingPuzzle: null,
    puzzleType: null, // 'coin' or 'obstacle'
    audioCtx: null,
    soundEnabled: true
};

// Sound System using Web Audio API
function initAudio() {
    try {
        game.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
        game.soundEnabled = false;
    }
}

function playSound(type) {
    if (!game.soundEnabled || !game.audioCtx) return;
    
    // Resume audio context if suspended (browser autoplay policy)
    if (game.audioCtx.state === 'suspended') {
        game.audioCtx.resume();
    }
    
    const ctx = game.audioCtx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    switch(type) {
        case 'jump':
            // Quick upward sweep
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
            
        case 'pointEarned':
            // Happy ascending arpeggio
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523, now); // C5
            oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
            break;
            
        case 'pointLost':
            // Sad descending sound
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            oscillator.start(now);
            oscillator.stop(now + 0.35);
            break;
            
        case 'coin':
            // Coin pickup sparkle
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, now);
            oscillator.frequency.setValueAtTime(1108, now + 0.05);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
    }
}

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
        
        // Platform collision (only when falling)
        if (this.velY > 0) {
            for (const platform of game.platforms) {
                if (this.x + this.width > platform.x && 
                    this.x < platform.x + platform.width &&
                    this.y + this.height >= platform.y &&
                    this.y + this.height <= platform.y + platform.height + this.velY) {
                    this.y = platform.y - this.height;
                    this.velY = 0;
                    this.onGround = true;
                    break;
                }
            }
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
            playSound('jump');
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
        const obstacleType = this.isDynamic ? theme.obstacles.dynamicType : theme.obstacles.staticType;
        
        if (this.isDynamic) {
            this.drawDynamicObstacle(ctx, obstacleType, theme);
        } else {
            this.drawStaticObstacle(ctx, obstacleType, theme);
        }
    }
    
    drawStaticObstacle(ctx, type, theme) {
        const colors = theme.obstacles.static;
        
        switch(type) {
            case 'log':
                // Forest - Fallen log
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                           this.width/2, this.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#3d2817';
                ctx.lineWidth = 3;
                ctx.stroke();
                // Wood rings
                ctx.beginPath();
                ctx.arc(this.x + this.width * 0.3, this.y + this.height/2, 5, 0, Math.PI * 2);
                ctx.arc(this.x + this.width * 0.7, this.y + this.height/2, 4, 0, Math.PI * 2);
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
                
            case 'ice':
                // Snow - Ice block
                ctx.fillStyle = 'rgba(135, 206, 250, 0.8)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // Shine
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.moveTo(this.x + 5, this.y + 5);
                ctx.lineTo(this.x + 15, this.y + 5);
                ctx.lineTo(this.x + 5, this.y + 20);
                ctx.closePath();
                ctx.fill();
                // Border
                ctx.strokeStyle = 'rgba(100, 149, 237, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                break;
                
            case 'sandcastle':
                // Beach - Sand castle
                ctx.fillStyle = '#DEB887';
                // Base
                ctx.fillRect(this.x, this.y + this.height * 0.4, this.width, this.height * 0.6);
                // Towers
                ctx.fillRect(this.x, this.y, this.width * 0.3, this.height * 0.5);
                ctx.fillRect(this.x + this.width * 0.7, this.y, this.width * 0.3, this.height * 0.5);
                // Tower tops
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.width * 0.15, this.y - 10);
                ctx.lineTo(this.x + this.width * 0.3, this.y);
                ctx.fill();
                ctx.moveTo(this.x + this.width * 0.7, this.y);
                ctx.lineTo(this.x + this.width * 0.85, this.y - 10);
                ctx.lineTo(this.x + this.width, this.y);
                ctx.fill();
                // Door
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(this.x + this.width * 0.4, this.y + this.height * 0.6, 
                            this.width * 0.2, this.height * 0.4);
                break;
                
            default:
                // Default rock/box
                ctx.fillStyle = colors[0];
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = colors[1];
                ctx.fillRect(this.x, this.y, this.width, 10);
        }
    }
    
    drawDynamicObstacle(ctx, type, theme) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        switch(type) {
            case 'bee':
                // Forest - Angry bee
                // Body
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, this.width/2, this.height/2.5, 0, 0, Math.PI * 2);
                ctx.fill();
                // Stripes
                ctx.fillStyle = '#000';
                ctx.fillRect(centerX - 5, centerY - this.height/3, 4, this.height/1.5);
                ctx.fillRect(centerX + 3, centerY - this.height/3, 4, this.height/1.5);
                // Wings
                ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
                const wingFlap = Math.sin(game.frameCount * 0.5) * 5;
                ctx.beginPath();
                ctx.ellipse(centerX - 5, centerY - this.height/2 + wingFlap, 10, 6, -0.3, 0, Math.PI * 2);
                ctx.ellipse(centerX + 5, centerY - this.height/2 - wingFlap, 10, 6, 0.3, 0, Math.PI * 2);
                ctx.fill();
                // Stinger
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, centerY - 3);
                ctx.lineTo(this.x + this.width + 8, centerY);
                ctx.lineTo(this.x + this.width, centerY + 3);
                ctx.closePath();
                ctx.fill();
                // Angry eyes
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(centerX - 6, centerY - 3, 3, 0, Math.PI * 2);
                ctx.arc(centerX + 6, centerY - 3, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'snowball':
                // Snow - Rolling snowball
                const rollAngle = game.frameCount * 0.1;
                ctx.fillStyle = '#FFFAFA';
                ctx.beginPath();
                ctx.arc(centerX, centerY, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                // Shadow/depth
                ctx.fillStyle = 'rgba(150, 180, 200, 0.3)';
                ctx.beginPath();
                ctx.arc(centerX + 3, centerY + 3, this.width/2 - 2, 0, Math.PI * 2);
                ctx.fill();
                // Snow texture spots
                ctx.fillStyle = 'rgba(200, 220, 240, 0.5)';
                for (let i = 0; i < 4; i++) {
                    const angle = rollAngle + (i * Math.PI / 2);
                    const spotX = centerX + Math.cos(angle) * (this.width/4);
                    const spotY = centerY + Math.sin(angle) * (this.height/4);
                    ctx.beginPath();
                    ctx.arc(spotX, spotY, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'crab':
                // Beach - Scuttling crab
                const scuttle = Math.sin(game.frameCount * 0.3) * 2;
                // Body
                ctx.fillStyle = '#FF6347';
                ctx.beginPath();
                ctx.ellipse(centerX, centerY + scuttle, this.width/2, this.height/2.5, 0, 0, Math.PI * 2);
                ctx.fill();
                // Claws
                ctx.beginPath();
                ctx.arc(this.x - 5, centerY - 5 + scuttle, 8, 0, Math.PI * 2);
                ctx.arc(this.x + this.width + 5, centerY - 5 + scuttle, 8, 0, Math.PI * 2);
                ctx.fill();
                // Claw pincers
                ctx.strokeStyle = '#FF6347';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x - 8, centerY - 8 + scuttle, 5, 0.5, 2.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(this.x + this.width + 8, centerY - 8 + scuttle, 5, 0.6, 2.6);
                ctx.stroke();
                // Eyes on stalks
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(centerX - 8, centerY - this.height/2 + scuttle, 4, 0, Math.PI * 2);
                ctx.arc(centerX + 8, centerY - this.height/2 + scuttle, 4, 0, Math.PI * 2);
                ctx.fill();
                // Legs
                ctx.strokeStyle = '#E55347';
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    const legY = centerY + 5 + i * 5 + scuttle;
                    ctx.beginPath();
                    ctx.moveTo(this.x + 5, legY);
                    ctx.lineTo(this.x - 10, legY + 8);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width - 5, legY);
                    ctx.lineTo(this.x + this.width + 10, legY + 8);
                    ctx.stroke();
                }
                break;
                
            default:
                // Default spiky ball
                ctx.fillStyle = theme.obstacles.dynamic;
                ctx.beginPath();
                ctx.arc(centerX, centerY, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                // Spikes
                const spikeCount = 8;
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

// Platform Class
class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }

    update() {
        this.x -= CONFIG.scrollSpeed;
    }

    draw(ctx) {
        const theme = THEMES[game.theme];
        
        // Platform top
        ctx.fillStyle = theme.platform.top;
        ctx.fillRect(this.x, this.y, this.width, 8);
        
        // Platform bottom/shadow
        ctx.fillStyle = theme.platform.bottom;
        ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);
        
        // Edge highlights
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.stroke();
        
        // Grass/snow/sand tufts on top based on theme
        if (game.theme === 'forest') {
            ctx.fillStyle = '#2d8a2d';
            for (let i = 0; i < this.width; i += 15) {
                ctx.beginPath();
                ctx.moveTo(this.x + i + 5, this.y);
                ctx.lineTo(this.x + i + 8, this.y - 6);
                ctx.lineTo(this.x + i + 11, this.y);
                ctx.fill();
            }
        } else if (game.theme === 'snow') {
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x, this.y - 3, this.width, 5);
        }
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
            playSound('pointEarned');
        } else {
            feedback.textContent = `❌ Wrong! The answer was ${game.pendingPuzzle.answer}`;
            feedback.className = 'wrong';
            playSound('pointLost');
        }
    } else {
        // Obstacle
        if (isCorrect) {
            feedback.textContent = '✅ Correct! No penalty';
            feedback.className = 'correct';
            playSound('pointEarned');
        } else {
            game.score -= 1;
            feedback.textContent = `❌ Wrong! -1 point. Answer was ${game.pendingPuzzle.answer}`;
            feedback.className = 'wrong';
            playSound('pointLost');
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
    
    // 40% chance to spawn coin on a platform (higher up)
    if (Math.random() < 0.4 && game.platforms.length > 0) {
        // Find a platform that's still visible
        const visiblePlatforms = game.platforms.filter(p => p.x > game.canvas.width * 0.3);
        if (visiblePlatforms.length > 0) {
            const platform = visiblePlatforms[Math.floor(Math.random() * visiblePlatforms.length)];
            const y = platform.y - 30; // Above the platform
            game.coins.push(new Coin(platform.x + platform.width / 2, y));
            return;
        }
    }
    
    // Regular coin spawn
    const y = groundY - 70 - Math.random() * 50;
    game.coins.push(new Coin(game.canvas.width + 50, y));
}

function spawnPlatform() {
    const groundY = game.canvas.height - CONFIG.groundHeight;
    const width = 80 + Math.random() * 60;
    // Platforms at various heights - reachable by jumping
    const heights = [120, 160, 200];
    const y = groundY - heights[Math.floor(Math.random() * heights.length)];
    
    game.platforms.push(new Platform(game.canvas.width + 50, y, width));
    
    // Often spawn a coin above the platform
    if (Math.random() < 0.7) {
        game.coins.push(new Coin(game.canvas.width + 50 + width / 2, y - 30));
    }
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
    if (game.frameCount % 250 === 0) {
        spawnPlatform();
    }
    if (game.frameCount % 200 === 0) {
        spawnDecoration();
    }
    
    // Update platforms
    game.platforms.forEach(platform => platform.update());
    game.platforms = game.platforms.filter(platform => !platform.isOffScreen());
    
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
            playSound('coin');
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
    
    // Draw platforms
    game.platforms.forEach(platform => platform.draw(game.ctx));
    
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
    // Initialize audio on first user interaction
    if (!game.audioCtx) {
        initAudio();
    }
    
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
    game.platforms = [];
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
