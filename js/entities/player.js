// ============================================
// PLAYER ENTITY
// ============================================

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
