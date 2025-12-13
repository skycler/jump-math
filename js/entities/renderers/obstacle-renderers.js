// ============================================
// OBSTACLE RENDERERS - Interface & Implementations
// ============================================

/**
 * Abstract base class for obstacle renderers
 * Defines the interface that all obstacle renderers must implement
 */
class ObstacleRenderer {
    /**
     * Draw the obstacle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Obstacle width
     * @param {number} height - Obstacle height
     * @param {number} frameCount - Current frame for animations
     */
    draw(ctx, x, y, width, height, frameCount) {
        throw new Error('ObstacleRenderer.draw() must be implemented');
    }
}

// ============================================
// STATIC OBSTACLE RENDERERS
// ============================================

class LogRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height) {
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Wood grain
        ctx.beginPath();
        ctx.arc(x + width * 0.3, y + height/2, 5, 0, Math.PI * 2);
        ctx.arc(x + width * 0.7, y + height/2, 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

class IceRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height) {
        ctx.fillStyle = 'rgba(135, 206, 250, 0.8)';
        ctx.fillRect(x, y, width, height);
        
        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 5);
        ctx.lineTo(x + 15, y + 5);
        ctx.lineTo(x + 5, y + 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(100, 149, 237, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }
}

class SandcastleRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height) {
        ctx.fillStyle = '#DEB887';
        
        // Base
        ctx.fillRect(x, y + height * 0.4, width, height * 0.6);
        
        // Towers
        ctx.fillRect(x, y, width * 0.3, height * 0.5);
        ctx.fillRect(x + width * 0.7, y, width * 0.3, height * 0.5);
        
        // Tower tops
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width * 0.15, y - 10);
        ctx.lineTo(x + width * 0.3, y);
        ctx.fill();
        ctx.moveTo(x + width * 0.7, y);
        ctx.lineTo(x + width * 0.85, y - 10);
        ctx.lineTo(x + width, y);
        ctx.fill();
        
        // Door
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(x + width * 0.4, y + height * 0.6, width * 0.2, height * 0.4);
    }
}

class DefaultStaticRenderer extends ObstacleRenderer {
    constructor(colors) {
        super();
        this.colors = colors;
    }
    
    draw(ctx, x, y, width, height) {
        ctx.fillStyle = this.colors[0];
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = this.colors[1];
        ctx.fillRect(x, y, width, 10);
    }
}

// ============================================
// DYNAMIC OBSTACLE RENDERERS
// ============================================

class BeeRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        
        // Body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width/2, height/2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Stripes
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 5, centerY - height/3, 4, height/1.5);
        ctx.fillRect(centerX + 3, centerY - height/3, 4, height/1.5);
        
        // Wings
        ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
        const wingFlap = Math.sin(frameCount * 0.5) * 5;
        ctx.beginPath();
        ctx.ellipse(centerX - 5, centerY - height/2 + wingFlap, 10, 6, -0.3, 0, Math.PI * 2);
        ctx.ellipse(centerX + 5, centerY - height/2 - wingFlap, 10, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Stinger
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(x + width, centerY - 3);
        ctx.lineTo(x + width + 8, centerY);
        ctx.lineTo(x + width, centerY + 3);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 3, 3, 0, Math.PI * 2);
        ctx.arc(centerX + 6, centerY - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class WolfRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const runCycle = Math.sin(frameCount * 0.2) * 3;
        
        // Body
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + runCycle, width/2 + 5, height/2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.ellipse(x - 5, centerY + runCycle, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Snout
        ctx.beginPath();
        ctx.ellipse(x - 18, centerY + 3 + runCycle, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.beginPath();
        ctx.moveTo(x - 10, centerY - 10 + runCycle);
        ctx.lineTo(x - 5, centerY - 22 + runCycle);
        ctx.lineTo(x, centerY - 10 + runCycle);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#FF0';
        ctx.beginPath();
        ctx.arc(x - 8, centerY - 3 + runCycle, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 8, centerY - 3 + runCycle, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 4;
        const legOffset = Math.sin(frameCount * 0.3) * 8;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY + height/3);
        ctx.lineTo(centerX - 10 + legOffset, centerY + height/2 + 10);
        ctx.moveTo(centerX + 10, centerY + height/3);
        ctx.lineTo(centerX + 10 - legOffset, centerY + height/2 + 10);
        ctx.stroke();
        
        // Tail
        ctx.beginPath();
        ctx.moveTo(x + width, centerY + runCycle);
        ctx.quadraticCurveTo(x + width + 15, centerY - 10 + runCycle, x + width + 20, centerY - 20 + runCycle);
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

class SnowballRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const rollAngle = frameCount * 0.1;
        
        // Main ball
        ctx.fillStyle = '#FFFAFA';
        ctx.beginPath();
        ctx.arc(centerX, centerY, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Shadow
        ctx.fillStyle = 'rgba(150, 180, 200, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX + 3, centerY + 3, width/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Texture spots
        ctx.fillStyle = 'rgba(200, 220, 240, 0.5)';
        for (let i = 0; i < 4; i++) {
            const angle = rollAngle + (i * Math.PI / 2);
            const spotX = centerX + Math.cos(angle) * (width/4);
            const spotY = centerY + Math.sin(angle) * (height/4);
            ctx.beginPath();
            ctx.arc(spotX, spotY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class PolarBearRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const sway = Math.sin(frameCount * 0.1) * 2;
        
        // Body
        ctx.fillStyle = '#F5F5F5';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + sway, width/2, height/2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(x - 5, centerY - 5 + sway, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Snout
        ctx.beginPath();
        ctx.ellipse(x - 20, centerY + sway, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(x - 25, centerY - 2 + sway, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.fillStyle = '#F5F5F5';
        ctx.beginPath();
        ctx.arc(x - 10, centerY - 20 + sway, 8, 0, Math.PI * 2);
        ctx.arc(x + 5, centerY - 18 + sway, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 12, centerY - 8 + sway, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(centerX - 15, centerY + height/3, 10, 15);
        ctx.fillRect(centerX + 5, centerY + height/3, 10, 15);
    }
}

class CrabRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const scuttle = Math.sin(frameCount * 0.3) * 2;
        
        // Body
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + scuttle, width/2, height/2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Claws
        ctx.beginPath();
        ctx.arc(x - 5, centerY - 5 + scuttle, 8, 0, Math.PI * 2);
        ctx.arc(x + width + 5, centerY - 5 + scuttle, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Claw pincers
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x - 8, centerY - 8 + scuttle, 5, 0.5, 2.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + width + 8, centerY - 8 + scuttle, 5, 0.6, 2.6);
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - height/2 + scuttle, 4, 0, Math.PI * 2);
        ctx.arc(centerX + 8, centerY - height/2 + scuttle, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.strokeStyle = '#E55347';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const legY = centerY + 5 + i * 5 + scuttle;
            ctx.beginPath();
            ctx.moveTo(x + 5, legY);
            ctx.lineTo(x - 10, legY + 8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + width - 5, legY);
            ctx.lineTo(x + width + 10, legY + 8);
            ctx.stroke();
        }
    }
}

class JellyfishRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const pulse = Math.sin(frameCount * 0.15) * 3;
        
        // Bell (head)
        ctx.fillStyle = 'rgba(255, 105, 180, 0.7)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 5, width/2 + pulse, height/3, 0, Math.PI, 0);
        ctx.fill();
        
        // Inner glow
        ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 8, width/3, height/5, 0, Math.PI, 0);
        ctx.fill();
        
        // Tentacles
        ctx.strokeStyle = 'rgba(255, 105, 180, 0.6)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const tentX = x + 8 + i * (width - 16) / 4;
            const wave = Math.sin(frameCount * 0.1 + i) * 5;
            ctx.beginPath();
            ctx.moveTo(tentX, centerY);
            ctx.quadraticCurveTo(tentX + wave, centerY + 15, tentX - wave, centerY + 30);
            ctx.quadraticCurveTo(tentX + wave/2, centerY + 40, tentX, centerY + 45);
            ctx.stroke();
        }
    }
}

class DefaultDynamicRenderer extends ObstacleRenderer {
    constructor(color) {
        super();
        this.color = color;
    }
    
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Spikes
        const spikeCount = 8;
        for (let i = 0; i < spikeCount; i++) {
            const angle = (i / spikeCount) * Math.PI * 2 + frameCount * 0.05;
            const innerX = centerX + Math.cos(angle) * (width/2);
            const innerY = centerY + Math.sin(angle) * (height/2);
            const outerX = centerX + Math.cos(angle) * (width/2 + 10);
            const outerY = centerY + Math.sin(angle) * (height/2 + 10);
            ctx.beginPath();
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(outerX, outerY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FF0000';
            ctx.stroke();
        }
    }
}

// ============================================
// CITY OBSTACLE RENDERERS
// ============================================

class TrashCanRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height) {
        // Body
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(x + 5, y + height);
        ctx.lineTo(x, y + height * 0.3);
        ctx.lineTo(x + width, y + height * 0.3);
        ctx.lineTo(x + width - 5, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Lid
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(x - 3, y + height * 0.2, width + 6, height * 0.15);
        
        // Handle
        ctx.beginPath();
        ctx.arc(x + width/2, y + height * 0.1, 8, Math.PI, 0);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Recycling symbol
        ctx.fillStyle = '#48bb78';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('♻', x + width/2, y + height * 0.65);
    }
}

class TaxiRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const bounce = Math.sin(frameCount * 0.15) * 2;
        
        // Body
        ctx.fillStyle = '#f6e05e';
        ctx.beginPath();
        ctx.roundRect(x, y + height * 0.3 + bounce, width, height * 0.5, 5);
        ctx.fill();
        
        // Roof
        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y + height * 0.3 + bounce);
        ctx.lineTo(x + width * 0.3, y + bounce);
        ctx.lineTo(x + width * 0.7, y + bounce);
        ctx.lineTo(x + width * 0.8, y + height * 0.3 + bounce);
        ctx.closePath();
        ctx.fill();
        
        // Windows
        ctx.fillStyle = '#63b3ed';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.25, y + height * 0.32 + bounce);
        ctx.lineTo(x + width * 0.32, y + height * 0.05 + bounce);
        ctx.lineTo(x + width * 0.48, y + height * 0.05 + bounce);
        ctx.lineTo(x + width * 0.48, y + height * 0.32 + bounce);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + width * 0.52, y + height * 0.32 + bounce);
        ctx.lineTo(x + width * 0.52, y + height * 0.05 + bounce);
        ctx.lineTo(x + width * 0.68, y + height * 0.05 + bounce);
        ctx.lineTo(x + width * 0.75, y + height * 0.32 + bounce);
        ctx.fill();
        
        // Wheels
        ctx.fillStyle = '#1a202c';
        ctx.beginPath();
        ctx.arc(x + width * 0.25, y + height * 0.85 + bounce, 8, 0, Math.PI * 2);
        ctx.arc(x + width * 0.75, y + height * 0.85 + bounce, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Taxi sign
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + width * 0.4, y - 8 + bounce, width * 0.2, 10);
        ctx.fillStyle = '#1a202c';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TAXI', x + width/2, y - 1 + bounce);
    }
}

class PigeonRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const bob = Math.sin(frameCount * 0.3) * 3;
        const wingFlap = Math.sin(frameCount * 0.4) * 10;
        
        // Body
        ctx.fillStyle = '#718096';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bob, width/2, height/2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.arc(x + width * 0.15, centerY - height * 0.2 + bob, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Neck shimmer (iridescent)
        ctx.fillStyle = '#48bb78';
        ctx.beginPath();
        ctx.arc(x + width * 0.25, centerY - height * 0.05 + bob, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#805ad5';
        ctx.beginPath();
        ctx.arc(x + width * 0.22, centerY + bob, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#f6ad55';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.05, centerY - height * 0.2 + bob);
        ctx.lineTo(x - 5, centerY - height * 0.15 + bob);
        ctx.lineTo(x + width * 0.1, centerY - height * 0.12 + bob);
        ctx.closePath();
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#f56565';
        ctx.beginPath();
        ctx.arc(x + width * 0.12, centerY - height * 0.25 + bob, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Wings
        ctx.fillStyle = '#a0aec0';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - height * 0.1 + bob - wingFlap, width * 0.35, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.9, centerY + bob);
        ctx.lineTo(x + width + 10, centerY - 5 + bob);
        ctx.lineTo(x + width + 10, centerY + 5 + bob);
        ctx.closePath();
        ctx.fill();
        
        // Feet
        ctx.strokeStyle = '#f56565';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY + height * 0.3 + bob);
        ctx.lineTo(centerX - 5, y + height);
        ctx.moveTo(centerX + 5, centerY + height * 0.3 + bob);
        ctx.lineTo(centerX + 5, y + height);
        ctx.stroke();
    }
}

// ============================================
// HIMMEL (SKY) OBSTACLE RENDERERS
// ============================================

class CloudObstacleRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height) {
        // Colorful cloud obstacle
        const colors = ['#ffb6c1', '#98d8c8', '#b19cd9', '#ffd700'];
        const color = colors[Math.floor((x * 3) % colors.length)];
        
        ctx.fillStyle = color;
        
        // Main cloud body
        ctx.beginPath();
        ctx.arc(x + width * 0.3, y + height * 0.6, height * 0.4, 0, Math.PI * 2);
        ctx.arc(x + width * 0.5, y + height * 0.4, height * 0.5, 0, Math.PI * 2);
        ctx.arc(x + width * 0.7, y + height * 0.6, height * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(x + width * 0.4, y + height * 0.35, height * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class AirplaneRenderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const wobble = Math.sin(frameCount * 0.1) * 2;
        
        // Fuselage (body)
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + wobble, width/2 + 5, height/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.beginPath();
        ctx.moveTo(x - 10, centerY + wobble);
        ctx.lineTo(x + 5, centerY - 5 + wobble);
        ctx.lineTo(x + 5, centerY + 5 + wobble);
        ctx.closePath();
        ctx.fill();
        
        // Wings
        ctx.fillStyle = '#cbd5e0';
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY + wobble);
        ctx.lineTo(centerX - 15, centerY - height/2 - 5 + wobble);
        ctx.lineTo(centerX + 10, centerY - height/2 + wobble);
        ctx.lineTo(centerX + 5, centerY + wobble);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY + wobble);
        ctx.lineTo(centerX - 15, centerY + height/2 + 5 + wobble);
        ctx.lineTo(centerX + 10, centerY + height/2 + wobble);
        ctx.lineTo(centerX + 5, centerY + wobble);
        ctx.closePath();
        ctx.fill();
        
        // Tail
        ctx.fillStyle = '#a0aec0';
        ctx.beginPath();
        ctx.moveTo(x + width - 5, centerY + wobble);
        ctx.lineTo(x + width + 10, centerY - 12 + wobble);
        ctx.lineTo(x + width + 5, centerY + wobble);
        ctx.closePath();
        ctx.fill();
        
        // Windows
        ctx.fillStyle = '#63b3ed';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(x + 15 + i * 10, centerY - 2 + wobble, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Engine trail
        ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
        ctx.beginPath();
        ctx.moveTo(x + width, centerY + wobble);
        ctx.lineTo(x + width + 20, centerY - 3 + wobble);
        ctx.lineTo(x + width + 20, centerY + 3 + wobble);
        ctx.closePath();
        ctx.fill();
    }
}

class CO2Renderer extends ObstacleRenderer {
    draw(ctx, x, y, width, height, frameCount) {
        const centerX = x + width/2;
        const centerY = y + height/2;
        const pulse = Math.sin(frameCount * 0.15) * 3;
        
        // Gray smoke cloud
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY + pulse, 12, 0, Math.PI * 2);
        ctx.arc(centerX + 8, centerY - pulse, 14, 0, Math.PI * 2);
        ctx.arc(centerX, centerY - 5, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Darker core
        ctx.fillStyle = 'rgba(70, 70, 70, 0.8)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // CO2 text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CO₂', centerX, centerY);
        
        // Warning outline
        ctx.strokeStyle = '#e53e3e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, width/2 - 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// ============================================
// OBSTACLE RENDERER FACTORY
// ============================================

const ObstacleRendererFactory = {
    // Cache renderer instances for reuse
    _cache: {},
    
    /**
     * Get a renderer for the given obstacle type
     * @param {string} type - Obstacle type (log, ice, bee, crab, etc.)
     * @param {object} theme - Theme configuration for fallback colors
     * @returns {ObstacleRenderer}
     */
    getRenderer(type, theme = null) {
        // Return cached instance if available
        if (this._cache[type]) {
            return this._cache[type];
        }
        
        let renderer;
        
        switch(type) {
            // Static obstacles
            case 'log':
                renderer = new LogRenderer();
                break;
            case 'ice':
                renderer = new IceRenderer();
                break;
            case 'sandcastle':
                renderer = new SandcastleRenderer();
                break;
            
            // Dynamic obstacles
            case 'bee':
                renderer = new BeeRenderer();
                break;
            case 'wolf':
                renderer = new WolfRenderer();
                break;
            case 'snowball':
                renderer = new SnowballRenderer();
                break;
            case 'polarBear':
                renderer = new PolarBearRenderer();
                break;
            case 'crab':
                renderer = new CrabRenderer();
                break;
            case 'jellyfish':
                renderer = new JellyfishRenderer();
                break;
            
            // City obstacles
            case 'trashcan':
                renderer = new TrashCanRenderer();
                break;
            case 'taxi':
                renderer = new TaxiRenderer();
                break;
            case 'pigeon':
                renderer = new PigeonRenderer();
                break;
            
            // Himmel (Sky) obstacles
            case 'cloudObstacle':
                renderer = new CloudObstacleRenderer();
                break;
            case 'airplane':
                renderer = new AirplaneRenderer();
                break;
            case 'co2':
                renderer = new CO2Renderer();
                break;
            
            // Fallbacks with theme colors
            default:
                if (theme) {
                    // Don't cache default renderers as they depend on theme
                    return new DefaultDynamicRenderer(theme.obstacles.dynamic || '#FF0000');
                }
                renderer = new DefaultDynamicRenderer('#FF0000');
        }
        
        this._cache[type] = renderer;
        return renderer;
    },
    
    /**
     * Get a static obstacle renderer
     */
    getStaticRenderer(type, theme) {
        if (type === 'log' || type === 'ice' || type === 'sandcastle' || type === 'trashcan' || type === 'cloudObstacle') {
            return this.getRenderer(type, theme);
        }
        // Default static with theme colors
        const cacheKey = `static_${theme ? 'themed' : 'default'}`;
        if (!this._cache[cacheKey] && theme) {
            this._cache[cacheKey] = new DefaultStaticRenderer(theme.obstacles.static);
        }
        return this._cache[cacheKey] || new DefaultStaticRenderer(['#888', '#666']);
    },
    
    /**
     * Get a dynamic obstacle renderer
     */
    getDynamicRenderer(type, theme) {
        return this.getRenderer(type, theme);
    }
};
