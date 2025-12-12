// ============================================
// GAME ENGINE - Loop, Spawning, Collision, Rendering
// ============================================

const GameEngine = {
    // Collision Detection
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    // Spawn Functions
    spawnCoin(game) {
        const groundY = game.canvas.height - CONFIG.groundHeight;
        
        // 40% chance to spawn coin on a platform (higher up)
        if (Math.random() < 0.4 && game.platforms.length > 0) {
            const visiblePlatforms = game.platforms.filter(p => p.x > game.canvas.width * 0.3);
            if (visiblePlatforms.length > 0) {
                const platform = visiblePlatforms[Math.floor(Math.random() * visiblePlatforms.length)];
                const y = platform.y - 30;
                game.coins.push(new Coin(platform.x + platform.width / 2, y));
                return;
            }
        }
        
        // Regular coin spawn
        const y = groundY - 70 - Math.random() * 50;
        game.coins.push(new Coin(game.canvas.width + 50, y));
    },

    spawnPlatform(game) {
        const groundY = game.canvas.height - CONFIG.groundHeight;
        const width = 80 + Math.random() * 60;
        const heights = [120, 160, 200];
        const y = groundY - heights[Math.floor(Math.random() * heights.length)];
        
        game.platforms.push(new Platform(game.canvas.width + 50, y, width));
        
        // Often spawn a coin above the platform
        if (Math.random() < 0.7) {
            game.coins.push(new Coin(game.canvas.width + 50 + width / 2, y - 30));
        }
    },

    spawnObstacle(game) {
        const groundY = game.canvas.height - CONFIG.groundHeight;
        const isDynamic = Math.random() > 0.6;
        
        let width, height, y;
        
        if (isDynamic) {
            width = 40;
            height = 40;
            y = groundY - height - Math.random() * 40 - 20;
        } else {
            width = 40 + Math.random() * 30;
            height = 30 + Math.random() * 40;
            y = groundY - height;
        }
        
        game.obstacles.push(new Obstacle(game.canvas.width + 50, y, width, height, isDynamic, game.theme));
    },

    spawnDecoration(game) {
        const theme = THEMES[game.theme];
        const type = theme.decorations[Math.floor(Math.random() * theme.decorations.length)];
        game.decorations.push(new Decoration(game.canvas.width + 50, type, game.theme));
    },

    // Draw Background
    drawBackground(game) {
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
    },

    // Update Game State
    update(game) {
        game.frameCount++;
        
        // Update timer (runs even during puzzles)
        const now = Date.now();
        const deltaSeconds = (now - game.lastTimestamp) / 1000;
        game.lastTimestamp = now;
        
        if (game.gameMode === 'timed') {
            game.timeRemaining -= deltaSeconds;
            UI.updateTimerDisplay(game);
            
            // Check time's up
            if (game.timeRemaining <= 0) {
                game.timeRemaining = 0;
                UI.gameOver(game, false);
                return;
            }
        } else if (game.gameMode === 'target') {
            game.timeElapsed += deltaSeconds;
            UI.updateTimerDisplay(game);
            
            // Check target reached
            if (game.score >= game.targetScore) {
                UI.gameOver(game, true);
                return;
            }
        }
        
        // Update player
        game.player.update(game);
        
        // Spawn entities
        if (game.frameCount % CONFIG.coinSpawnRate === 0) {
            this.spawnCoin(game);
        }
        if (game.frameCount % CONFIG.obstacleSpawnRate === 0) {
            this.spawnObstacle(game);
        }
        if (game.frameCount % CONFIG.platformSpawnRate === 0) {
            this.spawnPlatform(game);
        }
        if (game.frameCount % 200 === 0) {
            this.spawnDecoration(game);
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
            if (!coin.collected && this.checkCollision(playerBounds, coin.getBounds(game))) {
                coin.collected = true;
                Audio.play('coin');
                UI.showPuzzle('coin', game);
            }
        });
        
        // Obstacle collisions
        game.obstacles.forEach(obs => {
            if (!obs.hit && this.checkCollision(playerBounds, obs.getBounds())) {
                obs.hit = true;
                UI.showPuzzle('obstacle', game);
            }
        });
    },

    // Render Game
    render(game) {
        this.drawBackground(game);
        
        // Draw decorations (behind everything)
        game.decorations.forEach(dec => dec.draw(game.ctx, game.canvas));
        
        // Draw platforms
        game.platforms.forEach(platform => platform.draw(game.ctx, game));
        
        // Draw coins
        game.coins.forEach(coin => coin.draw(game.ctx, game));
        
        // Draw obstacles
        game.obstacles.forEach(obs => obs.draw(game.ctx, game));
        
        // Draw player
        game.player.draw(game.ctx, game);
    },

    // Game Loop
    gameLoop(game) {
        if (!game.running) return;
        
        if (!game.paused) {
            this.update(game);
        }
        this.render(game);
        
        requestAnimationFrame(() => this.gameLoop(game));
    }
};
