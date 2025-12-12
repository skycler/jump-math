// ============================================
// DECORATION ENTITY
// ============================================

class Decoration {
    constructor(x, type, theme) {
        this.x = x;
        this.type = type;
        this.theme = theme;
        this.animOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.x -= CONFIG.scrollSpeed * 0.5; // Parallax effect
    }

    draw(ctx, canvas) {
        const groundY = canvas.height - CONFIG.groundHeight;
        ctx.save();
        
        switch(this.type) {
            case 'tree':
                this.drawTree(ctx, groundY);
                break;
            case 'bush':
                this.drawBush(ctx, groundY);
                break;
            case 'pine':
                this.drawPine(ctx, groundY);
                break;
            case 'snowman':
                this.drawSnowman(ctx, groundY);
                break;
            case 'palm':
                this.drawPalm(ctx, groundY);
                break;
            case 'umbrella':
                this.drawUmbrella(ctx, groundY);
                break;
        }
        
        ctx.restore();
    }
    
    drawTree(ctx, groundY) {
        // Trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(this.x - 10, groundY - 80, 20, 80);
        // Foliage
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(this.x, groundY - 100, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc(this.x - 20, groundY - 80, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 20, groundY - 80, 25, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawBush(ctx, groundY) {
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.arc(this.x, groundY - 15, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(this.x - 12, groundY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 12, groundY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPine(ctx, groundY) {
        // Trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(this.x - 8, groundY - 60, 16, 60);
        // Snow-covered pine
        ctx.fillStyle = '#1B5E20';
        ctx.beginPath();
        ctx.moveTo(this.x, groundY - 120);
        ctx.lineTo(this.x - 35, groundY - 60);
        ctx.lineTo(this.x + 35, groundY - 60);
        ctx.fill();
        // Snow on top
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x, groundY - 120);
        ctx.lineTo(this.x - 15, groundY - 100);
        ctx.lineTo(this.x + 15, groundY - 100);
        ctx.fill();
    }
    
    drawSnowman(ctx, groundY) {
        // Body
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, groundY - 25, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, groundY - 60, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, groundY - 85, 12, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x - 4, groundY - 88, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 4, groundY - 88, 2, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.moveTo(this.x, groundY - 85);
        ctx.lineTo(this.x + 10, groundY - 83);
        ctx.lineTo(this.x, groundY - 81);
        ctx.fill();
    }
    
    drawPalm(ctx, groundY) {
        // Trunk
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(this.x - 8, groundY);
        ctx.quadraticCurveTo(this.x + 15, groundY - 60, this.x + 5, groundY - 100);
        ctx.lineTo(this.x + 12, groundY - 100);
        ctx.quadraticCurveTo(this.x + 22, groundY - 60, this.x + 8, groundY);
        ctx.fill();
        // Leaves
        ctx.fillStyle = '#4CAF50';
        const time = Date.now() / 1000 + this.animOffset;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.translate(this.x + 8, groundY - 100);
            const sway = Math.sin(time * 2 + i) * 3;
            ctx.rotate((i * Math.PI / 2.5 - Math.PI / 2) + sway * Math.PI / 180);
            ctx.beginPath();
            ctx.ellipse(30, 0, 35, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    drawUmbrella(ctx, groundY) {
        // Pole
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x, groundY);
        ctx.lineTo(this.x, groundY - 80);
        ctx.stroke();
        // Umbrella top
        ctx.fillStyle = '#E91E63';
        ctx.beginPath();
        ctx.arc(this.x, groundY - 80, 40, Math.PI, 0);
        ctx.fill();
        // Stripes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x - 20, groundY - 80);
        ctx.arc(this.x, groundY - 80, 40, Math.PI + 0.5, Math.PI + 1);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + 10, groundY - 80);
        ctx.arc(this.x, groundY - 80, 40, -0.5, 0);
        ctx.fill();
    }

    isOffScreen() {
        return this.x < -100;
    }
}
