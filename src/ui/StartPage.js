import { GAME_CONFIG } from '../config/GameConfig.js';

export class StartPage {
    constructor(scene) {
        this.scene = scene;
        this.isVisible = false;
        this.buildPage();
        this.bindStartTap();
        this.setVisible(false);
    }

    buildPage() {
        this.titleText = this.scene.add
            .text(
                GAME_CONFIG.sceneConfig.screenWidth / 2,
                111,
                "Dance Streamer Simulator",
                {
                    fontFamily: 'Georgia',
                    fontSize: '55px',
                    color: '#e7e0ff',
                    align: 'center',
                    wordWrap: { width: GAME_CONFIG.sceneConfig.screenWidth - 120, useAdvancedWrap: true }
                }
            )
            .setOrigin(0.5, 0)
            .setDepth(30);

        this.topInstructionText = this.scene.add
            .text(
                GAME_CONFIG.sceneConfig.screenWidth / 2,
                333,
                GAME_CONFIG.uiText.start.topInstruction,
                {
                    fontFamily: 'Georgia',
                    fontSize: '22px',
                    color: '#e7e0ff',
                    align: 'center',
                    wordWrap: { width: GAME_CONFIG.sceneConfig.screenWidth - 120, useAdvancedWrap: true }
                }
            )
            .setOrigin(0.5, 0)
            .setDepth(30);

        this.startPromptText = this.scene.add
            .text(
                GAME_CONFIG.sceneConfig.screenWidth / 2,
                1040,
                GAME_CONFIG.uiText.start.startInstruction,
                {
                    fontFamily: 'Georgia',
                    fontSize: '45px',
                    fontStyle: 'bold',
                    color: '#fff8ed',
                    align: 'center'
                }
            )
            .setOrigin(0.5, 0.5)
            .setDepth(30);
    }

    bindStartTap() {
        this.scene.input.on('pointerdown', this.handleScenePointerDown, this);
    }

    handleScenePointerDown() {
        if (!this.isVisible) {
            return;
        }

        this.scene.startRunFromBoot();
    }

    setVisible(isVisible) {
        this.isVisible = isVisible;
        this.titleText.setVisible(isVisible);
        this.topInstructionText.setVisible(isVisible);
        this.startPromptText.setVisible(isVisible);
    }
}
