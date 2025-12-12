// ============================================
// DECORATION ENTITY
// Uses DecorationRendererFactory for theme-specific rendering
// ============================================

class Decoration {
    constructor(x, type, theme) {
        this.x = x;
        this.type = type;
        this.theme = theme;
        this.animOffset = Math.random() * Math.PI * 2;
        
        // Get renderer from factory (cached internally)
        this._renderer = DecorationRendererFactory.getRenderer(type);
    }

    update() {
        this.x -= CONFIG.scrollSpeed * 0.5; // Parallax effect
    }

    draw(ctx, canvas) {
        const groundY = canvas.height - CONFIG.groundHeight;
        
        if (this._renderer) {
            ctx.save();
            this._renderer.draw(ctx, this.x, groundY, this.animOffset);
            ctx.restore();
        }
    }

    isOffScreen() {
        return this.x < -100;
    }
}
