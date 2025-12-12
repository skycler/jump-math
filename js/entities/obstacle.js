// ============================================
// OBSTACLE ENTITY
// ============================================

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
                this.drawLog(ctx);
                break;
            case 'ice':
                this.drawIce(ctx);
                break;
            case 'sandcastle':
                this.drawSandcastle(ctx);
                break;
            default:
                this.drawDefaultStatic(ctx, colors);
        }
    }
    
    drawLog(ctx) {
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
    }
    
    drawIce(ctx) {
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
    }
    
    drawSandcastle(ctx) {
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
    }
    
    drawDefaultStatic(ctx, colors) {
        ctx.fillStyle = colors[0];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = colors[1];
        ctx.fillRect(this.x, this.y, this.width, 10);
    }
    
    drawDynamicObstacle(ctx, type, theme, game) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        switch(type) {
            case 'bee':
                this.drawBee(ctx, centerX, centerY, game);
                break;
            case 'snowball':
                this.drawSnowball(ctx, centerX, centerY, game);
                break;
            case 'crab':
                this.drawCrab(ctx, centerX, centerY, game);
                break;
            default:
                this.drawDefaultDynamic(ctx, centerX, centerY, theme, game);
        }
    }
    
    drawBee(ctx, centerX, centerY, game) {
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
        
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 3, 3, 0, Math.PI * 2);
        ctx.arc(centerX + 6, centerY - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawSnowball(ctx, centerX, centerY, game) {
        const rollAngle = game.frameCount * 0.1;
        
        // Main ball
        ctx.fillStyle = '#FFFAFA';
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Shadow
        ctx.fillStyle = 'rgba(150, 180, 200, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX + 3, centerY + 3, this.width/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Texture spots
        ctx.fillStyle = 'rgba(200, 220, 240, 0.5)';
        for (let i = 0; i < 4; i++) {
            const angle = rollAngle + (i * Math.PI / 2);
            const spotX = centerX + Math.cos(angle) * (this.width/4);
            const spotY = centerY + Math.sin(angle) * (this.height/4);
            ctx.beginPath();
            ctx.arc(spotX, spotY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawCrab(ctx, centerX, centerY, game) {
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
        
        // Eyes
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
    }
    
    drawDefaultDynamic(ctx, centerX, centerY, theme, game) {
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
