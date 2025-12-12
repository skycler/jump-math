// ============================================
// OBSTACLE ENTITY
// Uses ObstacleRendererFactory for theme-specific rendering
// ============================================

class Obstacle {
    constructor(x, y, width, height, isDynamic = false, themeName = 'forest') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDynamic = isDynamic;
        this.hit = false;
        this.moveDir = 1;
        this.startY = y;
        this.moveRange = 50;
        
        // Pick obstacle type at creation time (for dynamic obstacles with multiple types)
        const theme = THEMES[themeName];
        if (isDynamic && theme.obstacles.dynamicTypes) {
            const types = theme.obstacles.dynamicTypes;
            this.obstacleType = types[Math.floor(Math.random() * types.length)];
        } else if (isDynamic) {
            this.obstacleType = theme.obstacles.dynamicType || 'default';
        } else {
            this.obstacleType = theme.obstacles.staticType || 'default';
        }
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
        
        // Get renderer from factory using pre-selected type
        const renderer = this.isDynamic
            ? ObstacleRendererFactory.getDynamicRenderer(this.obstacleType, theme)
            : ObstacleRendererFactory.getStaticRenderer(this.obstacleType, theme);
        
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
