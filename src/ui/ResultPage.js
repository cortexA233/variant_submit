import {GAME_CONFIG} from '../config/GameConfig.js';

export class ResultPage {
    constructor(scene) {
        this.scene = scene;
        this.buildResultsOverlay();
    }

    buildResultsOverlay() {
        this.resultsBackdrop = this.scene.add
            .rectangle(
                GAME_CONFIG.sceneConfig.screenWidth / 2,
                GAME_CONFIG.sceneConfig.screenHeight / 2,
                GAME_CONFIG.sceneConfig.screenWidth,
                GAME_CONFIG.sceneConfig.screenHeight,
                0x06050b,
                0.86
            )
            .setDepth(100)
            .setVisible(false)
            .setInteractive();
        this.resultsBackdrop.on('pointerdown', () => this.scene.restartRun());

        this.resultsPanel = this.scene.add
            .rectangle(
                GAME_CONFIG.sceneConfig.screenWidth / 2,
                GAME_CONFIG.sceneConfig.screenHeight / 2,
                GAME_CONFIG.sceneConfig.screenWidth - 96,
                420,
                0x130f26,
                0.97
            )
            .setDepth(101)
            .setVisible(false);
        this.resultsPanel.setStrokeStyle(2, 0xff76ab, 0.9);

        this.resultsHeadline = this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 448, '', {
                fontFamily: 'Trebuchet MS',
                fontSize: '40px',
                fontStyle: 'bold',
                color: '#fff0f4',
                align: 'center',
                wordWrap: { width: GAME_CONFIG.sceneConfig.screenWidth - 180, useAdvancedWrap: true }
            })
            .setOrigin(0.5, 0.5)
            .setDepth(102)
            .setVisible(false);

        this.resultsStats = this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 608, '', {
                fontFamily: 'Georgia',
                fontSize: '24px',
                color: '#ddd3f6',
                align: 'center',
                lineSpacing: 12
            })
            .setOrigin(0.5, 0.5)
            .setDepth(102)
            .setVisible(false);

        this.resultsPrompt = this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 760, GAME_CONFIG.uiText.result.defaultPrompt, {
                fontFamily: 'Trebuchet MS',
                fontSize: '20px',
                color: '#ffbfd8'
            })
            .setOrigin(0.5, 0.5)
            .setDepth(102)
            .setVisible(false);
    }

    showResults(resultData = {}) {
        const {
            headline = GAME_CONFIG.uiText.result.defaultHeadline,
            stats = GAME_CONFIG.uiText.result.defaultStats,
            prompt = GAME_CONFIG.uiText.result.defaultPrompt
        } = resultData;

        this.setVisible(true);
        this.resultsHeadline.setText(headline);
        this.resultsStats.setText(stats);
        this.resultsPrompt.setText(prompt);
    }

    setVisible(visible) {
        this.resultsBackdrop.setVisible(visible);
        this.resultsPanel.setVisible(visible);
        this.resultsHeadline.setVisible(visible);
        this.resultsStats.setVisible(visible);
        this.resultsPrompt.setVisible(visible);
    }
}
