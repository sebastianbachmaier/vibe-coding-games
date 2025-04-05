// Animation manager for death and victory animations
class AnimationManager {
    constructor(app) {
        this.app = app;
        this.animations = [];
    }
    
    // Player death animation - explosion effect
    playDeathAnimation(x, y) {
        // Create particles for explosion effect
        const particleCount = 30;
        const particles = [];
        
        // Create container for all particles
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        this.app.stage.addChild(container);
        
        // Player disappearing flash
        const flash = new PIXI.Graphics();
        flash.beginFill(0xFFFFFF);
        flash.drawCircle(0, 0, 50);
        flash.endFill();
        flash.alpha = 0.8;
        container.addChild(flash);
        
        // Create explosion particles
        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            
            // Random particle color (red, orange, yellow)
            const colors = [0xFF0000, 0xFF6600, 0xFFCC00];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.beginFill(color);
            
            // Random particle shape (circle or square)
            if (Math.random() > 0.5) {
                particle.drawCircle(0, 0, 2 + Math.random() * 4);
            } else {
                const size = 2 + Math.random() * 4;
                particle.drawRect(-size/2, -size/2, size, size);
            }
            
            particle.endFill();
            
            // Set initial position (slightly random within player area)
            particle.x = -10 + Math.random() * 20;
            particle.y = -10 + Math.random() * 20;
            
            // Set velocity in random direction
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 5;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            
            // Add rotation
            particle.rotation = Math.random() * Math.PI * 2;
            particle.rotationSpeed = -0.1 + Math.random() * 0.2;
            
            // Add some gravity effect
            particle.gravity = 0.1 + Math.random() * 0.1;
            
            // Set initial alpha and fade speed
            particle.alpha = 0.7 + Math.random() * 0.3;
            particle.fadeSpeed = 0.01 + Math.random() * 0.03;
            
            container.addChild(particle);
            particles.push(particle);
        }
        
        let elapsed = 0;
        const ticker = this.app.ticker.add(() => {
            elapsed++;
            
            // Animate flash
            if (flash.alpha > 0) {
                flash.alpha -= 0.1;
                flash.scale.x += 0.1;
                flash.scale.y += 0.1;
            }
            
            // Update particles
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                
                // Move based on velocity
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Apply gravity
                particle.vy += particle.gravity;
                
                // Rotate the particle
                particle.rotation += particle.rotationSpeed;
                
                // Fade out
                particle.alpha -= particle.fadeSpeed;
            }
            
            // Remove finished particles
            for (let i = particles.length - 1; i >= 0; i--) {
                if (particles[i].alpha <= 0) {
                    container.removeChild(particles[i]);
                    particles.splice(i, 1);
                }
            }
            
            // End animation when all particles are gone
            if (particles.length === 0 && elapsed > 60) {
                this.app.ticker.remove(ticker);
                this.app.stage.removeChild(container);
            }
        });
        
        return ticker;
    }
    
    // Victory animation - fireworks and confetti
    playVictoryAnimation() {
        // Create multiple fireworks
        this.createFireworks(5);
        
        // Create falling confetti
        this.createConfetti();
        
        // Create congratulations text
        const congratsText = new PIXI.Text('Victory!', {
            fontFamily: 'Arial',
            fontSize: 64,
            fill: 0xFFD700,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 6,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 4,
            dropShadowDistance: 6
        });
        
        congratsText.anchor.set(0.5);
        congratsText.x = GAME_WIDTH / 2;
        congratsText.y = GAME_HEIGHT / 2 - 100;
        congratsText.alpha = 0;
        
        this.app.stage.addChild(congratsText);
        
        // Animate the text
        let textTicker = this.app.ticker.add(() => {
            if (congratsText.alpha < 1) {
                congratsText.alpha += 0.02;
            }
            
            congratsText.y -= 0.2;
            congratsText.scale.x = 1 + Math.sin(this.app.ticker.lastTime / 200) * 0.05;
            congratsText.scale.y = 1 + Math.sin(this.app.ticker.lastTime / 200) * 0.05;
        });
        
        // Remove the text after 5 seconds
        setTimeout(() => {
            this.app.ticker.remove(textTicker);
            this.app.stage.removeChild(congratsText);
        }, 5000);
    }
    
    // Create multiple fireworks at random positions
    createFireworks(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = 100 + Math.random() * (GAME_WIDTH - 200);
                const y = 100 + Math.random() * (GAME_HEIGHT / 2);
                this.createFirework(x, y);
            }, i * 500); // Stagger the fireworks
        }
    }
    
    // Create a single firework explosion
    createFirework(x, y) {
        const particleCount = 50;
        const particles = [];
        
        // Create container for this firework
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        this.app.stage.addChild(container);
        
        // Create initial flash
        const flash = new PIXI.Graphics();
        flash.beginFill(0xFFFFFF);
        flash.drawCircle(0, 0, 20);
        flash.endFill();
        flash.alpha = 1;
        container.addChild(flash);
        
        // Random firework color
        const colors = [
            0xFF0000, // Red
            0x00FF00, // Green
            0x0000FF, // Blue
            0xFF00FF, // Magenta
            0xFFFF00, // Yellow
            0x00FFFF  // Cyan
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create explosion particles
        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            
            particle.beginFill(color);
            particle.drawCircle(0, 0, 2 + Math.random() * 2);
            particle.endFill();
            
            // Set velocity in circular pattern
            const angle = (i / particleCount) * Math.PI * 2;
            const variance = Math.random() * 0.5 + 0.5; // Random variance in distance
            const speed = 3 + Math.random() * 3;
            
            particle.vx = Math.cos(angle) * speed * variance;
            particle.vy = Math.sin(angle) * speed * variance;
            
            // Add slight gravity
            particle.gravity = 0.05;
            
            // Set fade speed
            particle.alpha = 1;
            particle.fadeSpeed = 0.01 + Math.random() * 0.02;
            
            container.addChild(particle);
            particles.push(particle);
        }
        
        // Add trail effect particles
        for (let i = 0; i < particleCount / 2; i++) {
            setTimeout(() => {
                if (container.parent) { // Check if container is still in the scene
                    const trailParticle = new PIXI.Graphics();
                    trailParticle.beginFill(0xFFFFFF);
                    trailParticle.drawCircle(0, 0, 1 + Math.random() * 1);
                    trailParticle.endFill();
                    
                    // Random position within the explosion
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 30;
                    trailParticle.x = Math.cos(angle) * distance;
                    trailParticle.y = Math.sin(angle) * distance;
                    
                    trailParticle.alpha = 0.7;
                    trailParticle.fadeSpeed = 0.05;
                    
                    container.addChild(trailParticle);
                    particles.push(trailParticle);
                }
            }, i * 50);
        }
        
        // Animate the firework
        const ticker = this.app.ticker.add(() => {
            // Animate flash
            if (flash.alpha > 0) {
                flash.alpha -= 0.1;
                flash.scale.x += 0.1;
                flash.scale.y += 0.1;
            }
            
            // Update particles
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                
                // Move based on velocity
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Apply gravity
                particle.vy += particle.gravity;
                
                // Fade out
                particle.alpha -= particle.fadeSpeed;
            }
            
            // Remove finished particles
            for (let i = particles.length - 1; i >= 0; i--) {
                if (particles[i].alpha <= 0) {
                    container.removeChild(particles[i]);
                    particles.splice(i, 1);
                }
            }
            
            // End animation when all particles are gone
            if (particles.length === 0) {
                this.app.ticker.remove(ticker);
                this.app.stage.removeChild(container);
            }
        });
    }
    
    // Create falling confetti
    createConfetti() {
        const confettiCount = 200;
        const confettiParticles = [];
        
        // Create container for confetti
        const container = new PIXI.Container();
        this.app.stage.addChild(container);
        
        // Confetti colors
        const colors = [
            0xFF0000, // Red
            0x00FF00, // Green
            0x0000FF, // Blue
            0xFF00FF, // Magenta
            0xFFFF00, // Yellow
            0x00FFFF, // Cyan
            0xFF6600, // Orange
            0xCC00FF  // Purple
        ];
        
        // Create confetti particles
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = new PIXI.Graphics();
                
                // Random color
                const color = colors[Math.floor(Math.random() * colors.length)];
                confetti.beginFill(color);
                
                // Random shape
                if (Math.random() > 0.5) {
                    // Rectangle
                    const width = 5 + Math.random() * 10;
                    const height = 5 + Math.random() * 10;
                    confetti.drawRect(-width/2, -height/2, width, height);
                } else {
                    // Circle
                    confetti.drawCircle(0, 0, 3 + Math.random() * 5);
                }
                
                confetti.endFill();
                
                // Position at top of screen at random X position
                confetti.x = Math.random() * GAME_WIDTH;
                confetti.y = -20;
                
                // Random initial rotation
                confetti.rotation = Math.random() * Math.PI * 2;
                
                // Set movement properties
                confetti.vx = -1 + Math.random() * 2; // Slight horizontal movement
                confetti.vy = 1 + Math.random() * 3;  // Falling speed
                confetti.rotationSpeed = -0.1 + Math.random() * 0.2;
                
                // Add wobble effect
                confetti.wobbleSpeed = 0.01 + Math.random() * 0.05;
                confetti.wobbleStrength = 0.5 + Math.random() * 1.5;
                confetti.wobbleOffset = Math.random() * Math.PI * 2;
                
                container.addChild(confetti);
                confettiParticles.push(confetti);
            }, i * 10); // Stagger creation for a continuous effect
        }
        
        // Animate the confetti
        const ticker = this.app.ticker.add(() => {
            // Update confetti particles
            for (let i = 0; i < confettiParticles.length; i++) {
                const confetti = confettiParticles[i];
                
                // Move based on velocity
                confetti.x += confetti.vx + Math.sin(this.app.ticker.lastTime * confetti.wobbleSpeed + confetti.wobbleOffset) * confetti.wobbleStrength;
                confetti.y += confetti.vy;
                
                // Rotate
                confetti.rotation += confetti.rotationSpeed;
                
                // Remove if off-screen
                if (confetti.y > GAME_HEIGHT + 50) {
                    container.removeChild(confetti);
                    confettiParticles.splice(i, 1);
                    i--;
                }
            }
            
            // End animation after all confetti is done (or after a time limit)
            if (confettiParticles.length === 0 || this.app.ticker.lastTime > 8000) {
                this.app.ticker.remove(ticker);
                this.app.stage.removeChild(container);
                
                // Remove any remaining confetti
                for (let i = 0; i < confettiParticles.length; i++) {
                    container.removeChild(confettiParticles[i]);
                }
            }
        });
    }
}

