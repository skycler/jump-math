// ============================================
// COIN ENTITY
// ============================================

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
