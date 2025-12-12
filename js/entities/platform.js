// ============================================
// PLATFORM ENTITY
// ============================================

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
        
        // Theme-specific decorations
        this.drawThemeDecorations(ctx, game.theme);
    }
    
    drawThemeDecorations(ctx, theme) {
        if (theme === 'forest') {
            // Grass tufts
            ctx.fillStyle = '#2d8a2d';
            for (let i = 0; i < this.width; i += 15) {
                ctx.beginPath();
                ctx.moveTo(this.x + i + 5, this.y);
                ctx.lineTo(this.x + i + 8, this.y - 6);
                ctx.lineTo(this.x + i + 11, this.y);
                ctx.fill();
            }
        } else if (theme === 'snow') {
            // Snow layer
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x, this.y - 3, this.width, 5);
        }
        // Beach has no extra decorations
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}
