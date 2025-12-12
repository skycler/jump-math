// ============================================
// GAME ENTITIES - Player, Coin, Obstacle, Platform, Decoration
// ============================================

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

    update(game) {
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
            Audio.play('jump');
        }
    }

    draw(ctx, game) {
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

    draw(ctx, game) {
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

    getBounds(game) {
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

    draw(ctx, game) {
        if (this.hit) return;
        
        const theme = THEMES[game.theme];
        const obstacleType = this.isDynamic ? theme.obstacles.dynamicType : theme.obstacles.staticType;
        
        if (this.isDynamic) {
            this.drawDynamicObstacle(ctx, obstacleType, theme, game);
        } else {
            this.drawStaticObstacle(ctx, obstacleType, theme);
        }
    }
    
    drawStaticObstacle(ctx, type, theme) {
        const colors = theme.obstacles.static;
        
        switch(type) {
            case 'log':
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                           this.width/2, this.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#3d2817';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(this.x + this.width * 0.3, this.y + this.height/2, 5, 0, Math.PI * 2);
                ctx.arc(this.x + this.width * 0.7, this.y + this.height/2, 4, 0, Math.PI * 2);
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
                
            case 'ice':
                ctx.fillStyle = 'rgba(135, 206, 250, 0.8)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.moveTo(this.x + 5, this.y + 5);
                ctx.lineTo(this.x + 15, this.y + 5);
                ctx.lineTo(this.x + 5, this.y + 20);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = 'rgba(100, 149, 237, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                break;
                
            case 'sandcastle':
                ctx.fillStyle = '#DEB887';
                ctx.fillRect(this.x, this.y + this.height * 0.4, this.width, this.height * 0.6);
                ctx.fillRect(this.x, this.y, this.width * 0.3, this.height * 0.5);
                ctx.fillRect(this.x + this.width * 0.7, this.y, this.width * 0.3, this.height * 0.5);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.width * 0.15, this.y - 10);
                ctx.lineTo(this.x + this.width * 0.3, this.y);
                ctx.fill();
                ctx.moveTo(this.x + this.width * 0.7, this.y);
                ctx.lineTo(this.x + this.width * 0.85, this.y - 10);
                ctx.lineTo(this.x + this.width, this.y);
                ctx.fill();
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(this.x + this.width * 0.4, this.y + this.height * 0.6, 
                            this.width * 0.2, this.height * 0.4);
                break;
                
            default:
                ctx.fillStyle = colors[0];
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = colors[1];
                ctx.fillRect(this.x, this.y, this.width, 10);
        }
    }
    
    drawDynamicObstacle(ctx, type, theme, game) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        switch(type) {
            case 'bee':
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, this.width/2, this.height/2.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.fillRect(centerX - 5, centerY - this.height/3, 4, this.height/1.5);
                ctx.fillRect(centerX + 3, centerY - this.height/3, 4, this.height/1.5);
                ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
                const wingFlap = Math.sin(game.frameCount * 0.5) * 5;
                ctx.beginPath();
                ctx.ellipse(centerX - 5, centerY - this.height/2 + wingFlap, 10, 6, -0.3, 0, Math.PI * 2);
                ctx.ellipse(centerX + 5, centerY - this.height/2 - wingFlap, 10, 6, 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.moveTo(this.x + this.width, centerY - 3);
                ctx.lineTo(this.x + this.width + 8, centerY);
                ctx.lineTo(this.x + this.width, centerY + 3);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(centerX - 6, centerY - 3, 3, 0, Math.PI * 2);
                ctx.arc(centerX + 6, centerY - 3, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'snowball':
                const rollAngle = game.frameCount * 0.1;
                ctx.fillStyle = '#FFFAFA';
                ctx.beginPath();
                ctx.arc(centerX, centerY, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(150, 180, 200, 0.3)';
                ctx.beginPath();
                ctx.arc(centerX + 3, centerY + 3, this.width/2 - 2, 0, Math.PI * 2);
                ctx.fill();
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
                const scuttle = Math.sin(game.frameCount * 0.3) * 2;
                ctx.fillStyle = '#FF6347';
                ctx.beginPath();
                ctx.ellipse(centerX, centerY + scuttle, this.width/2, this.height/2.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x - 5, centerY - 5 + scuttle, 8, 0, Math.PI * 2);
                ctx.arc(this.x + this.width + 5, centerY - 5 + scuttle, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#FF6347';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x - 8, centerY - 8 + scuttle, 5, 0.5, 2.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(this.x + this.width + 8, centerY - 8 + scuttle, 5, 0.6, 2.6);
                ctx.stroke();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(centerX - 8, centerY - this.height/2 + scuttle, 4, 0, Math.PI * 2);
                ctx.arc(centerX + 8, centerY - this.height/2 + scuttle, 4, 0, Math.PI * 2);
                ctx.fill();
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
                ctx.fillStyle = theme.obstacles.dynamic;
                ctx.beginPath();
                ctx.arc(centerX, centerY, this.width/2, 0, Math.PI * 2);
                ctx.fill();
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

    draw(ctx, game) {
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
    constructor(x, y, emoji) {
        this.x = x;
        this.y = y;
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
