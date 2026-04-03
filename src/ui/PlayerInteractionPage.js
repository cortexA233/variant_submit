import {GAME_CONFIG} from '../config/GameConfig.js';

export class PlayerInteractionPage {
    constructor(scene) {
        this.scene = scene;
        this.choiceCards = {};
        this.activePrompt = null;
        this.isInteractionEnabled = true;
        this.areChoiceCardsVisible = true;
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
            .text(x, y - 44, side === 'left'
                ? GAME_CONFIG.uiText.interaction.leftKeyLabel
                : GAME_CONFIG.uiText.interaction.rightKeyLabel, {
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

    setChoiceCardsVisible(visible) {
        this.areChoiceCardsVisible = visible;

        for (const card of Object.values(this.choiceCards)) {
            card.background.setVisible(visible);
            card.glow.setVisible(visible);
            card.keyText.setVisible(visible);
            card.labelText.setVisible(visible);
        }

        this.syncInteractivity();
    }

    setPrompt(prompt) {
        this.activePrompt = prompt;

        for (const [side, card] of Object.entries(this.choiceCards)) {
            const option = prompt?.options.find((item) => item.side === side) ?? null;
            card.labelText.setText(option?.reaction.label ?? '');
        }
    }

    setInteractionEnabled(enabled) {
        this.isInteractionEnabled = enabled;

        for (const card of Object.values(this.choiceCards)) {
            card.glow.setAlpha(enabled ? 0.14 : 0.06);
            card.background.setAlpha(enabled ? 0.98 : 0.62);
            card.keyText.setAlpha(enabled ? 1 : 0.65);
            card.labelText.setAlpha(enabled ? 1 : 0.65);
        }

        this.syncInteractivity();
    }

    syncInteractivity() {
        const enableCards = this.areChoiceCardsVisible && this.isInteractionEnabled;

        for (const card of Object.values(this.choiceCards)) {
            if (card.background.input) {
                card.background.input.enabled = enableCards;
            }
        }
    }

    handleChoice(side) {
        if (!this.isInteractionEnabled || !this.areChoiceCardsVisible) {
            return;
        }

        const option = this.activePrompt.options.find((item) => item.side === side) ?? null;

        if (!option) {
            return;
        }

        this.scene.resolveRound(option);
    }
}
