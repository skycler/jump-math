// ============================================
// DECORATION RENDERERS - Interface & Implementations
// ============================================

/**
 * Abstract base class for decoration renderers
 * Defines the interface that all decoration renderers must implement
 */
class DecorationRenderer {
    /**
     * Draw the decoration
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} groundY - Ground Y position
     * @param {number} animOffset - Animation offset for variation
     */
    draw(ctx, x, groundY, animOffset = 0) {
        throw new Error('DecorationRenderer.draw() must be implemented');
    }
}

// ============================================
// FOREST DECORATIONS
// ============================================

class TreeRenderer extends DecorationRenderer {
    draw(ctx, x, groundY) {
        // Trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(x - 10, groundY - 80, 20, 80);
        
        // Foliage
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(x, groundY - 100, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc(x - 20, groundY - 80, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 20, groundY - 80, 25, 0, Math.PI * 2);
        ctx.fill();
    }
}

class BushRenderer extends DecorationRenderer {
    draw(ctx, x, groundY) {
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc(x, groundY - 15, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(x - 12, groundY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 12, groundY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================
// SNOW DECORATIONS
// ============================================

class PineRenderer extends DecorationRenderer {
    draw(ctx, x, groundY) {
        // Trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(x - 8, groundY - 60, 16, 60);
        
        // Snow-covered pine
        ctx.fillStyle = '#1B5E20';
        ctx.beginPath();
        ctx.moveTo(x, groundY - 120);
        ctx.lineTo(x - 35, groundY - 60);
        ctx.lineTo(x + 35, groundY - 60);
        ctx.fill();
        
        // Snow on top
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x, groundY - 120);
        ctx.lineTo(x - 15, groundY - 100);
        ctx.lineTo(x + 15, groundY - 100);
        ctx.fill();
    }
}

class SnowmanRenderer extends DecorationRenderer {
    draw(ctx, x, groundY) {
        // Body
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, groundY - 25, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, groundY - 60, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, groundY - 85, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 4, groundY - 88, 2, 0, Math.PI * 2);
        ctx.arc(x + 4, groundY - 88, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.moveTo(x, groundY - 85);
        ctx.lineTo(x + 10, groundY - 83);
        ctx.lineTo(x, groundY - 81);
        ctx.fill();
    }
}

// ============================================
// BEACH DECORATIONS
// ============================================

class PalmRenderer extends DecorationRenderer {
    draw(ctx, x, groundY, animOffset) {
        // Trunk
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(x - 8, groundY);
        ctx.quadraticCurveTo(x + 15, groundY - 60, x + 5, groundY - 100);
        ctx.lineTo(x + 12, groundY - 100);
        ctx.quadraticCurveTo(x + 22, groundY - 60, x + 8, groundY);
        ctx.fill();
        
        // Leaves with animation
        ctx.fillStyle = '#4CAF50';
        const time = Date.now() / 1000 + animOffset;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.translate(x + 8, groundY - 100);
            const sway = Math.sin(time * 2 + i) * 3;
            ctx.rotate((i * Math.PI / 2.5 - Math.PI / 2) + sway * Math.PI / 180);
            ctx.beginPath();
            ctx.ellipse(30, 0, 35, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

class UmbrellaRenderer extends DecorationRenderer {
    draw(ctx, x, groundY) {
        // Pole
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x, groundY - 80);
        ctx.stroke();
        
        // Umbrella top
        ctx.fillStyle = '#E91E63';
        ctx.beginPath();
        ctx.arc(x, groundY - 80, 40, Math.PI, 0);
        ctx.fill();
        
        // Stripes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x - 20, groundY - 80);
        ctx.arc(x, groundY - 80, 40, Math.PI + 0.5, Math.PI + 1);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + 10, groundY - 80);
        ctx.arc(x, groundY - 80, 40, -0.5, 0);
        ctx.fill();
    }
}

// ============================================
// DECORATION RENDERER FACTORY
// ============================================

const DecorationRendererFactory = {
    // Cache renderer instances for reuse
    _cache: {},
    
    /**
     * Get a renderer for the given decoration type
     * @param {string} type - Decoration type (tree, bush, pine, palm, etc.)
     * @returns {DecorationRenderer}
     */
    getRenderer(type) {
        // Return cached instance if available
        if (this._cache[type]) {
            return this._cache[type];
        }
        
        let renderer;
        
        switch(type) {
            // Forest
            case 'tree':
                renderer = new TreeRenderer();
                break;
            case 'bush':
                renderer = new BushRenderer();
                break;
            
            // Snow
            case 'pine':
                renderer = new PineRenderer();
                break;
            case 'snowman':
                renderer = new SnowmanRenderer();
                break;
            
            // Beach
            case 'palm':
                renderer = new PalmRenderer();
                break;
            case 'umbrella':
                renderer = new UmbrellaRenderer();
                break;
            
            default:
                console.warn(`Unknown decoration type: ${type}`);
                return null;
        }
        
        this._cache[type] = renderer;
        return renderer;
    },
    
    /**
     * Get all available decoration types
     */
    getAvailableTypes() {
        return ['tree', 'bush', 'pine', 'snowman', 'palm', 'umbrella'];
    },
    
    /**
     * Get decoration types for a specific theme
     */
    getTypesForTheme(theme) {
        const themeDecorations = {
            forest: ['tree', 'bush'],
            snow: ['pine', 'snowman'],
            beach: ['palm', 'umbrella']
        };
        return themeDecorations[theme] || [];
    }
};
