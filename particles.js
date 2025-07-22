// Particle Network Animation
class ParticleNetwork {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.mousePosition = { x: 0, y: 0 };
        
        this.settings = {
            particleCount: 80,
            maxDistance: 120,
            particleSpeed: 0.5,
            particleSize: 2,
            lineOpacity: 0.3,
            particleOpacity: 0.6,
            mouseRadius: 150
        };
        
        this.isDarkMode = localStorage.getItem('theme') === 'dark'; // Sincroniza com script.js
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.startAnimation(); // Inicia animação explicitamente
        
        // Escuta evento personalizado disparado pelo script.js
        window.addEventListener('themeChanged', (e) => {
            this.isDarkMode = e.detail.isDarkMode;
            this.createParticles(); // Recria partículas com a nova cor
            this.startAnimation(); // Reinicia animação após troca de tema
        });
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
        this.canvas.style.pointerEvents = 'none'; // Evita interferência na rolagem
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // Recria partículas ao redimensionar
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.settings.particleSpeed,
                vy: (Math.random() - 0.5) * this.settings.particleSpeed,
                size: Math.random() * this.settings.particleSize + 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.settings.mouseRadius) {
                const force = (this.settings.mouseRadius - distance) / this.settings.mouseRadius;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }
            
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawParticles() {
        if (this.ctx) {
            this.ctx.beginPath();
            this.particles.forEach(particle => {
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            });
            this.ctx.fillStyle = this.isDarkMode ? `rgba(255, 255, 255, ${this.settings.particleOpacity})` : `rgba(0, 0, 0, ${this.settings.particleOpacity})`;
            this.ctx.fill();
        }
    }
    
    drawConnections() {
        if (this.ctx) {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.settings.maxDistance) {
                        const opacity = (this.settings.maxDistance - distance) / this.settings.maxDistance * this.settings.lineOpacity;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = this.isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
    
    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animate();
    }
    
    animate() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateParticles();
            this.drawConnections();
            this.drawParticles();
        }
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.canvas) this.canvas.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const particleNetwork = new ParticleNetwork();
    window.addEventListener('beforeunload', () => particleNetwork.destroy());
});