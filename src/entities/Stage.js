import {GAME_CONFIG} from "../config/GameConfig.js";


export class Stage extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.buildStage();
    }

    updateStage(time, speed) {
        this.updateSpotlight(time, speed);
    }

    buildStage() {
        this.spotlightGraphics = this.scene.add.graphics().setDepth(4);
        this.spotlightFrontGlow = this.scene.add.graphics().setDepth(11);
        this.updateSpotlight(0);
    }

    closeSpotlight() {
        this.spotlightGraphics.clear();
        this.spotlightFrontGlow.clear();
    }

    updateSpotlight(time, speed=1) {
        if (!this.scene.hero) return;

        const g = this.spotlightGraphics;
        const fg = this.spotlightFrontGlow;

        const width = GAME_CONFIG.sceneConfig.screenWidth;
        const heroX = this.scene.hero.spineObject.x;
        const heroY = this.scene.hero.spineObject.y;
        const pulse = (Math.sin(time * 0.002 * speed) + 1) * 0.5;
        const coneAlpha = 0.15 + pulse * 0.1;
        const floorAlpha = 0.15 + pulse * 0.1;

        g.clear();
        fg.clear();

        // light source
        g.fillStyle(0xfff6d6, 0.06 + pulse * 0.02);
        g.fillEllipse(width * 0.5, 150, 52, 52);
        g.fillStyle(0xfff6d6, coneAlpha);
        g.beginPath();
        g.moveTo(width * 0.5 - 22, 150);
        g.lineTo(width * 0.5 + 22, 150);
        g.lineTo(heroX + 135, heroY);
        g.lineTo(heroX - 135, heroY);
        g.closePath();
        g.fillPath();

        // halo
        g.fillStyle(0xfff1b8, 0.05 + pulse * 0.02);
        g.fillEllipse(heroX, heroY, 320, 92);
        g.fillStyle(0xfff1b8, floorAlpha);
        g.fillEllipse(heroX, heroY, 220, 58);
        fg.fillStyle(0xfff7de, 0.08 + pulse * 0.03);
        fg.fillEllipse(heroX, heroY, 140, 28);
    }


}