import Phaser from "phaser";
import {GAME_CONFIG} from "../config/GameConfig.js";


export class HudPage {
    constructor(scene) {
        this.scene = scene;
    }
    
    buildHudPage() {
        this.scene.add.rectangle(GAME_CONFIG.sceneConfig.screenWidth / 2, 86, GAME_CONFIG.sceneConfig.screenWidth - 48, 128, 0x110f22, 0.9).setDepth(5);
        this.scene.add.circle(72, 52, 7, 0xff5e7c).setDepth(6);
        this.scene.add
            .text(88, 38, 'LIVE FAIL STREAM', {
                fontFamily: 'Trebuchet MS',
                fontSize: '26px',
                fontStyle: 'bold',
                color: '#fff3f8'
            })
            .setDepth(6);
        this.scene.add
            .text(516, 40, 'Hold hype. Avoid the crash.', {
                fontFamily: 'Georgia',
                fontSize: '16px',
                color: '#bdb5db'
            })
            .setOrigin(1, 0)
            .setDepth(6);

        this.scene.add
            .text(56, 78, 'HYPE', {
                fontFamily: 'Trebuchet MS',
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#8df6c0'
            })
            .setDepth(6);
        this.scene.add
            .text(56, 118, 'CRASH', {
                fontFamily: 'Trebuchet MS',
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#ff98ba'
            })
            .setDepth(6);

        this.scene.add.rectangle(130, 90, 250, 16, 0x1f2d33, 0.95).setOrigin(0, 0.5).setDepth(6);
        this.hypeFill = this.scene.add.rectangle(130, 90, 250, 16, 0x6effbf).setOrigin(0, 0.5).setDepth(7);
        this.scene.add.rectangle(130, 130, 250, 16, 0x381827, 0.95).setOrigin(0, 0.5).setDepth(6);
        this.crashFill = this.scene.add.rectangle(130, 130, 250, 16, 0xff789f).setOrigin(0, 0.5).setDepth(7);

        this.hypeValueText = this.scene.add
            .text(404, 78, '', {
                fontFamily: 'Trebuchet MS',
                fontSize: '18px',
                color: '#f2fff9'
            })
            .setDepth(7);
        this.crashValueText = this.scene.add
            .text(404, 118, '', {
                fontFamily: 'Trebuchet MS',
                fontSize: '18px',
                color: '#fff3f8'
            })
            .setDepth(7);

        this.promptBanner = this.scene.add.rectangle(GAME_CONFIG.sceneConfig.screenWidth / 2, 212, GAME_CONFIG.sceneConfig.screenWidth - 88, 92, 0x1a1732, 0.95).setDepth(8);
        this.promptBanner.setStrokeStyle(2, 0x786dcb, 0.9);
        this.promptText = this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 196, '', {
                fontFamily: 'Georgia',
                fontSize: '31px',
                fontStyle: 'bold',
                color: '#fff8ed',
                align: 'center',
                wordWrap: { width: GAME_CONFIG.sceneConfig.screenWidth - 140, useAdvancedWrap: true }
            })
            .setOrigin(0.5, 0.5)
            .setDepth(9);

        this.warningText = this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 270, '', {
                fontFamily: 'Trebuchet MS',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#ffd7de'
            })
            .setOrigin(0.5, 0.5)
            .setDepth(9);

        this.scene.add.rectangle(100, 250, GAME_CONFIG.sceneConfig.screenWidth - 200, 10, 0x231f3d, 0.8).setOrigin(0, 0.5).setDepth(8);
        this.promptTimerFill = this.scene.add.rectangle(100, 250, GAME_CONFIG.sceneConfig.screenWidth - 200, 10, 0x6effbf, 1).setOrigin(0, 0.5).setDepth(9);

        this.feedbackText = this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 366, '', {
                fontFamily: 'Trebuchet MS',
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#fff6df',
                stroke: '#0d0a15',
                strokeThickness: 6
            })
            .setOrigin(0.5, 0.5)
            .setDepth(24)
            .setAlpha(0);
    }
}
