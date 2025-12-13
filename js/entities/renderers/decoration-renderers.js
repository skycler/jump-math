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
// CITY DECORATIONS
// ============================================

class BuildingRenderer extends DecorationRenderer {
    draw(ctx, x, groundY, animOffset = 0) {
        // Use animOffset as a seed for consistent building variation
        const seed = Math.floor(animOffset * 10);
        const buildingHeight = 100 + (seed % 5) * 10; // 100, 110, 120, 130, or 140
        const buildingWidth = 50;
        
        // Building body
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(x - buildingWidth/2, groundY - buildingHeight, buildingWidth, buildingHeight);
        
        // Building edge highlight
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(x - buildingWidth/2, groundY - buildingHeight, 5, buildingHeight);
        
        // Windows (grid pattern)
        const windowSize = 8;
        const windowGap = 6;
        const windowsPerRow = 3;
        const rowCount = Math.floor((buildingHeight - 20) / (windowSize + windowGap));
        
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < windowsPerRow; col++) {
                // Use seed + row/col for stable window pattern
                const isLit = ((seed + row + col * 2) % 3) !== 0;
                ctx.fillStyle = isLit ? '#f6e05e' : '#1a202c';
                
                const wx = x - buildingWidth/2 + 8 + col * (windowSize + windowGap);
                const wy = groundY - buildingHeight + 10 + row * (windowSize + windowGap);
                ctx.fillRect(wx, wy, windowSize, windowSize);
            }
        }
        
        // Roof details
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(x - buildingWidth/2 - 2, groundY - buildingHeight - 5, buildingWidth + 4, 8);
    }
}

class StreetlampRenderer extends DecorationRenderer {
    draw(ctx, x, groundY) {
        // Pole
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(x - 3, groundY - 90, 6, 90);
        
        // Curved arm
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, groundY - 85);
        ctx.quadraticCurveTo(x + 20, groundY - 90, x + 25, groundY - 75);
        ctx.stroke();
        
        // Lamp housing
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(x + 15, groundY - 75);
        ctx.lineTo(x + 35, groundY - 75);
        ctx.lineTo(x + 30, groundY - 60);
        ctx.lineTo(x + 20, groundY - 60);
        ctx.closePath();
        ctx.fill();
        
        // Light glow
        ctx.fillStyle = 'rgba(246, 224, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(x + 25, groundY - 55, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Light bulb
        ctx.fillStyle = '#f6e05e';
        ctx.beginPath();
        ctx.arc(x + 25, groundY - 62, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Base
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(x - 8, groundY - 5, 16, 5);
    }
}

// ============================================
// HIMMEL (SKY) DECORATIONS
// ============================================

class SunRenderer extends DecorationRenderer {
    draw(ctx, x, groundY, animOffset = 0) {
        const sunY = groundY - 150;
        const pulse = Math.sin(animOffset * 2) * 5;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, sunY, 20, x, sunY, 60 + pulse);
        gradient.addColorStop(0, 'rgba(255, 223, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 180, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, sunY, 60 + pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Sun body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, sunY, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner highlight
        ctx.fillStyle = '#FFF8DC';
        ctx.beginPath();
        ctx.arc(x - 10, sunY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Rays
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + animOffset;
            const innerR = 40;
            const outerR = 55 + pulse;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * innerR, sunY + Math.sin(angle) * innerR);
            ctx.lineTo(x + Math.cos(angle) * outerR, sunY + Math.sin(angle) * outerR);
            ctx.stroke();
        }
    }
}

class CloudDecorationRenderer extends DecorationRenderer {
    draw(ctx, x, groundY, animOffset = 0) {
        const cloudY = groundY - 80 - (animOffset * 20);
        const drift = Math.sin(animOffset * 3) * 5;
        
        // White fluffy cloud
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x + drift, cloudY, 25, 0, Math.PI * 2);
        ctx.arc(x + 25 + drift, cloudY + 5, 20, 0, Math.PI * 2);
        ctx.arc(x - 20 + drift, cloudY + 5, 18, 0, Math.PI * 2);
        ctx.arc(x + 10 + drift, cloudY - 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.beginPath();
        ctx.arc(x - 5 + drift, cloudY - 5, 10, 0, Math.PI * 2);
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
            
            // City
            case 'building':
                renderer = new BuildingRenderer();
                break;
            case 'streetlamp':
                renderer = new StreetlampRenderer();
                break;
            
            // Himmel (Sky)
            case 'sun':
                renderer = new SunRenderer();
                break;
            case 'cloudDecoration':
                renderer = new CloudDecorationRenderer();
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
        return ['tree', 'bush', 'pine', 'snowman', 'palm', 'umbrella', 'building', 'streetlamp', 'sun', 'cloudDecoration'];
    },
    
    /**
     * Get decoration types for a specific theme
     */
    getTypesForTheme(theme) {
        const themeDecorations = {
            forest: ['tree', 'bush'],
            snow: ['pine', 'snowman'],
            beach: ['palm', 'umbrella'],
            city: ['building', 'streetlamp'],
            sky: ['sun', 'cloudDecoration']
        };
        return themeDecorations[theme] || [];
    }
};
