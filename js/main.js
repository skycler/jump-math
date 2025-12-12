// ============================================
// JUMP MATH - Main Entry Point
// ============================================

// Game State
const game = {
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
    puzzleType: null,
    // Game mode settings
    gameMode: 'timed', // 'timed' or 'target'
    timeLimit: 120,    // seconds for timed mode
    targetScore: 10,   // points for target mode
    timeRemaining: 0,  // seconds remaining (timed mode)
    timeElapsed: 0,    // seconds elapsed (target mode)
    lastTimestamp: 0   // for timer calculation
};

// Input Handlers
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

// Setup Mobile Controls
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

// Start Game
function startGame() {
    // Initialize audio on first user interaction
    if (!Audio.ctx) {
        Audio.init();
    }
    
    // Get math settings
    game.mathMin = parseInt(document.getElementById('min-mult').value) || 1;
    game.mathMax = parseInt(document.getElementById('max-mult').value) || 12;
    
    // Validate
    if (game.mathMin > game.mathMax) {
        [game.mathMin, game.mathMax] = [game.mathMax, game.mathMin];
    }
    
    // Get game mode settings
    game.gameMode = document.querySelector('.mode-btn.selected')?.dataset.mode || 'timed';
    game.timeLimit = parseInt(document.getElementById('time-limit').value) || 120;
    game.targetScore = parseInt(document.getElementById('target-score').value) || 10;
    
    // Initialize timer based on mode
    if (game.gameMode === 'timed') {
        game.timeRemaining = game.timeLimit;
        game.timeElapsed = 0;
    } else {
        game.timeRemaining = 0;
        game.timeElapsed = 0;
    }
    game.lastTimestamp = Date.now();
    
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
    UI.updateScoreDisplay(game);
    document.getElementById('theme-display').textContent = THEMES[game.theme].name;
    
    // Switch screens
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // Start game loop
    game.running = true;
    GameEngine.gameLoop(game);
}

// Initialize Game
function initGame() {
    game.canvas = document.getElementById('game-canvas');
    game.ctx = game.canvas.getContext('2d');
    
    UI.resizeCanvas(game);
    
    // Event Listeners
    window.addEventListener('resize', () => UI.resizeCanvas(game));
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
    
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Show/hide mode config
            document.getElementById('mode-config-timed').style.display = 
                btn.dataset.mode === 'timed' ? 'block' : 'none';
            document.getElementById('mode-config-target').style.display = 
                btn.dataset.mode === 'target' ? 'block' : 'none';
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
        UI.showMenu(game);
    });
    
    // Puzzle submit
    document.getElementById('submit-answer').addEventListener('click', () => UI.checkPuzzleAnswer(game));
    document.getElementById('puzzle-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') UI.checkPuzzleAnswer(game);
    });
    
    // Game over buttons
    document.getElementById('retry-btn').addEventListener('click', () => {
        document.getElementById('gameover-modal').classList.remove('active');
        startGame();
    });
    document.getElementById('menu-btn').addEventListener('click', () => {
        document.getElementById('gameover-modal').classList.remove('active');
        UI.showMenu(game);
    });
    
    // Mobile controls
    setupMobileControls();
    
    // Select forest by default
    document.querySelector('.theme-btn[data-theme="forest"]').classList.add('selected');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);
