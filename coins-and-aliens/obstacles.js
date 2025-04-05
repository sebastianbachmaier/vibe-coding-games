// Obstacle creation and management
class ObstacleManager {
    constructor(app) {
        this.app = app;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 120; // Frames between obstacle spawns
    }

    createAlien() {
        // Create a container for the alien
        const alien = new PIXI.Container();
        
        // Random alien properties
        const alienColor = [0x8E44AD, 0x27AE60, 0xE74C3C, 0xF39C12][Math.floor(Math.random() * 4)];
        const alienSize = 25 + Math.floor(Math.random() * 10);
        
        // Create the alien head
        const head = new PIXI.Graphics();
        head.beginFill(alienColor);
        head.drawEllipse(0, 0, alienSize, alienSize * 0.75);
        head.endFill();
        
        // Create the eyes
        const eyeOffset = alienSize * 0.3;
        
        // Left eye
        const leftEye = new PIXI.Graphics();
        leftEye.beginFill(0xFFFFFF);
        leftEye.drawCircle(-eyeOffset, -alienSize * 0.1, alienSize * 0.25);
        leftEye.endFill();
        
        // Left pupil
        const leftPupil = new PIXI.Graphics();
        leftPupil.beginFill(0x000000);
        leftPupil.drawCircle(-eyeOffset, -alienSize * 0.1, alienSize * 0.1);
        leftPupil.endFill();
        
        // Right eye
        const rightEye = new PIXI.Graphics();
        rightEye.beginFill(0xFFFFFF);
        rightEye.drawCircle(eyeOffset, -alienSize * 0.1, alienSize * 0.25);
        rightEye.endFill();
        
        // Right pupil
        const rightPupil = new PIXI.Graphics();
        rightPupil.beginFill(0x000000);
        rightPupil.drawCircle(eyeOffset, -alienSize * 0.1, alienSize * 0.1);
        rightPupil.endFill();
        
        // Create the mouth
        const mouth = new PIXI.Graphics();
        mouth.beginFill(0x000000);
        mouth.drawEllipse(0, alienSize * 0.3, alienSize * 0.5, alienSize * 0.15);
        mouth.endFill();
        
        // Add teeth (random number of teeth for variety)
        const teethCount = 1 + Math.floor(Math.random() * 3);
        const teeth = new PIXI.Graphics();
        teeth.beginFill(0xFFFFFF);
        
        for (let i = 0; i < teethCount; i++) {
            const toothWidth = alienSize * 0.15;
            const toothHeight = alienSize * 0.1;
            const toothX = -alienSize * 0.4 + (i * alienSize * 0.4);
            teeth.drawRect(toothX, alienSize * 0.25, toothWidth, toothHeight);
        }
        
        teeth.endFill();
        
        // Add antennae
        const antennaCount = 1 + Math.floor(Math.random() * 2);
        const antennae = new PIXI.Graphics();
        antennae.lineStyle(2, alienColor);
        
        for (let i = 0; i < antennaCount; i++) {
            const antennaX = -alienSize * 0.3 + (i * alienSize * 0.6);
            antennae.moveTo(antennaX, -alienSize * 0.6);
            antennae.lineTo(antennaX, -alienSize * 1.2);
            
            // Add a small circle at the top of each antenna
            antennae.beginFill(alienColor);
            antennae.drawCircle(antennaX, -alienSize * 1.2, alienSize * 0.1);
            antennae.endFill();
        }
        
        // Add all parts to the alien container
        alien.addChild(head);
        alien.addChild(leftEye);
        alien.addChild(rightEye);
        alien.addChild(leftPupil);
        alien.addChild(rightPupil);
        alien.addChild(mouth);
        alien.addChild(teeth);
        alien.addChild(antennae);
        
        // Position at the right edge of the screen at a random height
        alien.x = GAME_WIDTH;
        alien.y = Math.random() * (GAME_HEIGHT - 150) + 100;
        
        // Add velocity
        alien.vx = -3 - Math.random() * 2; // Random speed between -3 and -5
        
        // Add simple floating animation
        const floatAmplitude = 10;
        const floatSpeed = 0.05 + Math.random() * 0.03;
        alien.initialY = alien.y;
        alien.floatOffset = Math.random() * Math.PI * 2; // Random starting phase
        
        this.app.ticker.add(() => {
            if (alien.parent) { // Only update if the alien is still in the stage
                alien.y = alien.initialY + Math.sin(this.app.ticker.lastTime * floatSpeed + alien.floatOffset) * floatAmplitude;
            }
        });
        
        // Set the hit area to be slightly smaller than visual size for better gameplay
        alien.hitArea = new PIXI.Rectangle(-alienSize * 0.8, -alienSize * 0.8, alienSize * 1.6, alienSize * 1.6);
        
        this.app.stage.addChild(alien);
        this.obstacles.push(alien);
        
        return alien;
    }

    update() {
        // Spawn new aliens
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.createAlien();
            this.spawnTimer = 0;
            // Gradually decrease spawn interval for increasing difficulty
            this.spawnInterval = Math.max(60, this.spawnInterval - 1);
        }

        // Update obstacle positions and remove those that are off-screen
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x += obstacle.vx;
            
            // Remove if off-screen
            if (obstacle.x + 50 < 0) {
                this.app.stage.removeChild(obstacle);
                this.obstacles.splice(i, 1);
            }
        }
    }

    checkCollision(player) {
        for (const obstacle of this.obstacles) {
            if (player.x + player.width * 0.8 > obstacle.x - obstacle.hitArea.width/2 &&
                player.x + player.width * 0.2 < obstacle.x + obstacle.hitArea.width/2 &&
                player.y + player.height * 0.8 > obstacle.y - obstacle.hitArea.height/2 &&
                player.y + player.height * 0.2 < obstacle.y + obstacle.hitArea.height/2) {
                return true; // Collision detected
            }
        }
        return false;
    }

    reset() {
        // Remove all obstacles
        for (const obstacle of this.obstacles) {
            this.app.stage.removeChild(obstacle);
        }
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 120;
    }
}

