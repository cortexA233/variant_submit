import {GAME_CONFIG} from "../config/GameConfig.js";


export class Stage extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.buildStage();
    }

    updateStage(time, deltaTime) {
        this.updateSpotlight(time, deltaTime);
    }

    buildStage() {
        // this.scene.add.rectangle(GAME_CONFIG.sceneConfig.screenWidth / 2, GAME_CONFIG.sceneConfig.screenHeight / 2,
        //     GAME_CONFIG.sceneConfig.screenWidth, GAME_CONFIG.sceneConfig.screenHeight, 0x0b0815).setDepth(0);
        // this.scene.add.rectangle(GAME_CONFIG.sceneConfig.screenWidth / 2, 220, GAME_CONFIG.sceneConfig.screenWidth,
        //     420, 0x161233, 0.85).setDepth(0);
        // this.scene.add.circle(110, 200, 160, 0x14335b, 0.32).setDepth(0);
        // this.scene.add.circle(620, 280, 170, 0x5e1944, 0.2).setDepth(0);
        // this.scene.add.circle(360, 1120, 240, 0x2a143c, 0.16).setDepth(0);
        // this.scene.add.rectangle(GAME_CONFIG.sceneConfig.screenWidth / 2, 660,
        //     GAME_CONFIG.sceneConfig.screenWidth - 64, 680, 0xffffff, 0.035).setDepth(1);
        // this.scene.add.ellipse(GAME_CONFIG.sceneConfig.screenWidth / 2, 914, 240, 46, 0x000000,
        //     0.28).setDepth(3);
        
        // 主灯光层：在舞台上、人物下
        this.spotlightGraphics = this.scene.add.graphics().setDepth(4);
        // 前景脚边高光：轻微盖在人物脚下前面
        this.spotlightFrontGlow = this.scene.add.graphics().setDepth(11);
        this.updateSpotlight(0, 0)
    }

    updateSpotlight(time, deltaTime) {
        if (!this.hero?.spineObject) return;

        const g = this.spotlightGraphics;
        const fg = this.spotlightFrontGlow;

        const width = GAME_CONFIG.sceneConfig.screenWidth;
        const height = GAME_CONFIG.sceneConfig.screenHeight;

        const heroX = this.hero.spineObject.x;
        const heroY = this.hero.spineObject.y;

        const pulse = (Math.sin(time * 0.0018) + 1) * 0.5;
        const coneAlpha = 0.10 + pulse * 0.03;
        const floorAlpha = 0.10 + pulse * 0.04;

        g.clear();
        fg.clear();

        // 全场再压暗一点，让中间的灯更明显
        g.fillStyle(0x000000, 0.28);
        g.fillRect(0, 0, width, height);

        // 顶部小灯源
        g.fillStyle(0xfff6d6, 0.06 + pulse * 0.02);
        g.fillEllipse(width * 0.5, 150, 52, 52);

        // 主灯锥：上窄下宽
        g.fillStyle(0xfff6d6, coneAlpha);
        g.beginPath();
        g.moveTo(width * 0.5 - 22, 150);
        g.lineTo(width * 0.5 + 22, 150);
        g.lineTo(heroX + 135, heroY + 100);
        g.lineTo(heroX - 135, heroY + 100);
        g.closePath();
        g.fillPath();

        // 脚下外圈柔光
        g.fillStyle(0xfff1b8, 0.05 + pulse * 0.02);
        g.fillEllipse(heroX, heroY + 100, 320, 92);

        // 脚下主光斑
        g.fillStyle(0xfff1b8, floorAlpha);
        g.fillEllipse(heroX, heroY + 100, 220, 58);

        // 前景一点点亮边，让人物“站在光里”
        fg.fillStyle(0xfff7de, 0.08 + pulse * 0.03);
        fg.fillEllipse(heroX, heroY + 96, 140, 28);
    }


}