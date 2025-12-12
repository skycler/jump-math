// ============================================
// OBSTACLE ENTITY
// Uses ObstacleRendererFactory for theme-specific rendering
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
        const obstacleType = this.isDynamic 
            ? theme.obstacles.dynamicType 
            : theme.obstacles.staticType;
        
        // Get renderer from factory (cached internally)
        const renderer = this.isDynamic
            ? ObstacleRendererFactory.getDynamicRenderer(obstacleType, theme)
            : ObstacleRendererFactory.getStaticRenderer(obstacleType, theme);
        
        if (renderer) {
            renderer.draw(ctx, this.x, this.y, this.width, this.height, game.frameCount);
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
