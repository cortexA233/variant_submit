import {GAME_CONFIG} from "../config/GameConfig.js";


export class PlayerInteractionPage{
    constructor(scene) {
        this.scene = scene;
        this.choiceCards = {};
        this.activePrompt = null;
        this.buildChoiceCards();
    }

    buildChoiceCards() {
        this.choiceCards.left = this.createChoiceCard({
            side: 'left',
            x: 188,
            y: 1098
        });
        this.choiceCards.right = this.createChoiceCard({
            side: 'right',
            x: 532,
            y: 1098
        });

        this.scene.add
            .text(GAME_CONFIG.sceneConfig.screenWidth / 2, 1220, 
                'Tap a card to decide what to do for your audience!', {
                fontFamily: 'Georgia',
                fontSize: '18px',
                color: '#bdb5db'
            })
            .setOrigin(0.5, 0.5)
            .setDepth(15);
    }

    createChoiceCard({ side, x, y }) {
        const theme = GAME_CONFIG.cardConfig.cardTheme[side];

        const glow = this.scene.add.rectangle(x, y, 286, 168, theme.glow, 0.14).setDepth(12);
        const background = this.scene.add.rectangle(x, y, 270, 152, theme.fill, 0.98).setDepth(13);
        background.setStrokeStyle(2, theme.edge, 0.85);
        background.setInteractive({ useHandCursor: true });
        background.on('pointerdown', () => this.handleChoice(side));
        background.on('pointerover', () => {
            background.setStrokeStyle(4, theme.edge, 1);
            glow.setAlpha(0.24);
        });
        background.on('pointerout', () => {
            background.setStrokeStyle(2, theme.edge, 0.85);
            glow.setAlpha(0.14);
        });

        const keyText = this.scene.add
            .text(x, y - 44, side === 'left' ? 'LEFT' : 'RIGHT', {
                fontFamily: 'Trebuchet MS',
                fontSize: '18px',
                fontStyle: 'bold',
                color: theme.accent
            })
            .setOrigin(0.5, 0.5)
            .setDepth(14);

        const labelText = this.scene.add
            .text(x, y + 10, '', {
                fontFamily: 'Georgia',
                fontSize: '26px',
                fontStyle: 'bold',
                color: '#fff8f1',
                align: 'center',
                wordWrap: { width: 210, useAdvancedWrap: true }
            })
            .setOrigin(0.5, 0.5)
            .setDepth(14);

        return {
            background,
            glow,
            keyText,
            labelText,
            side,
            theme
        };
    }

    handleChoice(side) {

        const option = null;

        if (!option) {
            return;
        }

        this.scene.resolveRound(option);
    }
}
