// Create a better looking sprite for the player
class SpriteManager {
    constructor(app) {
        this.app = app;
    }

    createPlayerSprite() {
        // Create a container for our player
        const playerContainer = new PIXI.Container();
        
        // Body (rounded rectangle)
        const body = new PIXI.Graphics();
        body.beginFill(0x3498db); // Blue
        body.drawRoundedRect(0, 0, 40, 40, 10);
        body.endFill();
        
        // Eyes
        const leftEye = new PIXI.Graphics();
        leftEye.beginFill(0xFFFFFF);
        leftEye.drawCircle(10, 15, 5);
        leftEye.endFill();
        
        const rightEye = new PIXI.Graphics();
        rightEye.beginFill(0xFFFFFF);
        rightEye.drawCircle(30, 15, 5);
        rightEye.endFill();
        
        // Pupils
        const leftPupil = new PIXI.Graphics();
        leftPupil.beginFill(0x000000);
        leftPupil.drawCircle(11, 16, 2);
        leftPupil.endFill();
        
        const rightPupil = new PIXI.Graphics();
        rightPupil.beginFill(0x000000);
        rightPupil.drawCircle(31, 16, 2);
        rightPupil.endFill();
        
        // Mouth (smile)
        const mouth = new PIXI.Graphics();
        mouth.lineStyle(2, 0x000000);
        mouth.moveTo(10, 30);
        mouth.bezierCurveTo(15, 38, 25, 38, 30, 30);
        
        // Add all parts to the container
        playerContainer.addChild(body);
        playerContainer.addChild(leftEye);
        playerContainer.addChild(rightEye);
        playerContainer.addChild(leftPupil);
        playerContainer.addChild(rightPupil);
        playerContainer.addChild(mouth);
        
        return playerContainer;
    }

    createCoin(x, y) {
        const coin = new PIXI.Graphics();
        coin.beginFill(0xFFD700); // Gold color
        coin.drawCircle(0, 0, 10);
        coin.endFill();
        
        // Add a shimmer effect
        const shimmer = new PIXI.Graphics();
        shimmer.beginFill(0xFFFFFF, 0.5);
        shimmer.drawCircle(-3, -3, 3);
        shimmer.endFill();
        
        coin.addChild(shimmer);
        coin.x = x;
        coin.y = y;
        
        // Add a simple animation
        this.app.ticker.add(() => {
            coin.rotation += 0.05;
        });
        
        return coin;
    }
}

