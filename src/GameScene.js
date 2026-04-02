import Phaser from 'phaser';
import {HudPage} from "./ui/HudPage.js";
import {ResultPage} from "./ui/ResultPage.js";
import {Hero} from "./entities/Hero.js";
import {GAME_CONFIG} from "./config/GameConfig.js";
import {Vector2} from "@esotericsoftware/spine-phaser-v4";
import {Stage} from "./entities/Stage.js";
import {PlayerInteractionPage} from "./ui/PlayerInteractionPage.js";
import {GameSceneFSM} from "./GameSceneFSM.js";
import {PROMPTS} from "./config/PromptConfig.js";
import {ANIMATIONS} from "./config/AnimationConfig.js";
import {NOISE_LIBRARY} from "./config/NoiseConfig.js";

const HUD_BAR_WIDTH = 250;
const MAX_ROUNDS = 4;
const INITIAL_HYPE = 50;
const INITIAL_CRASH = 0;
const CRASH_LIMIT = 100;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const toOption = (reactionId, isCorrect, side) => ({
    reactionId,
    reaction: ANIMATIONS[reactionId] ?? null,
    isCorrect,
    side
});


export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spineJson('man', '/spine/man/skeleton.json');
        this.load.spineAtlas('manAtlas', '/spine/man/skeleton.atlas', true);
    }

    create() {
        this.initializeRunState();

        this.hudPage = new HudPage(this);
        this.resultPage = new ResultPage(this);
        this.playerInteractionPage = new PlayerInteractionPage(this);

        this.hero = new Hero(this, new Vector2(GAME_CONFIG.sceneConfig.screenWidth * 0.5,
            GAME_CONFIG.sceneConfig.screenHeight * 0.7));
        this.stage = new Stage(this);
        this.stateMachine = new GameSceneFSM(this);
    }

    update(time, deltaTime) {
        this.stage.updateStage(time, deltaTime);
    }

    initializeRunState() {
        this.promptIndex = 0;
        this.activePrompt = null;
        this.lastResolution = null;
        this.runState = {
            resolvedRounds: 0,
            hype: INITIAL_HYPE,
            crash: INITIAL_CRASH,
            crashLimit: CRASH_LIMIT,
            maxRounds: MAX_ROUNDS
        };
    }

    enterBootState() {
        this.initializeRunState();
        this.hero?.setHeroAnimation('idle', true);
        this.resultPage?.setVisible(false);
        this.playerInteractionPage?.setPrompt(null);
        this.updateHud();
    }

    enterPromptingState() {
        this.activePrompt = this.createPromptRound();
        this.playerInteractionPage?.setPrompt(this.activePrompt);
        this.resultPage?.setVisible(false);
        this.hero?.setHeroAnimation('idle', true);

        if (this.hudPage) {
            this.hudPage.promptText.setText(this.activePrompt.text);
            this.hudPage.warningText.setText(this.getWarningText());
            this.hudPage.feedbackText
                .setText(this.lastResolution?.feedback ?? '')
                .setAlpha(this.lastResolution ? 1 : 0);
        }

        this.updateHud();
    }

    enterResolvingState(option) {
        if (!option || !this.activePrompt) {
            return { nextState: 'prompting' };
        }

        const wasCorrect = Boolean(option.isCorrect);
        const prompt = this.activePrompt;
        const successFeedback = prompt.successCommentBursts[this.runState.resolvedRounds % prompt.successCommentBursts.length];
        const failFeedback = prompt.failCommentBursts[this.runState.resolvedRounds % prompt.failCommentBursts.length];

        this.runState.resolvedRounds += 1;
        this.runState.hype = clamp(this.runState.hype + (wasCorrect ? 12 : -16), 0, 100);
        this.runState.crash = clamp(
            this.runState.crash + (wasCorrect ? -10 : 35),
            0,
            this.runState.crashLimit
        );
        this.lastResolution = {
            wasCorrect,
            feedback: wasCorrect ? successFeedback : failFeedback
        };

        this.hero?.setHeroAnimation(option.reactionId, false);

        if (this.hudPage) {
            this.hudPage.feedbackText
                .setText(this.lastResolution.feedback)
                .setAlpha(1);
            this.hudPage.warningText.setText(this.getWarningText());
        }

        this.updateHud();

        if (this.runState.crash >= this.runState.crashLimit || this.runState.resolvedRounds >= this.runState.maxRounds) {
            return {
                nextState: 'result',
                result: this.buildResultData()
            };
        }

        return { nextState: 'prompting' };
    }

    enterResultState(resultData) {
        this.playerInteractionPage?.setPrompt(null);
        this.resultPage?.showResults(resultData);

        if (this.hudPage) {
            this.hudPage.warningText.setText(this.runState.crash >= this.runState.crashLimit
                ? 'Stream collapsed under pressure.'
                : 'Run complete. Tap to go live again.');
        }
    }

    setInteractionEnabled(enabled) {
        this.playerInteractionPage?.setInteractionEnabled(enabled);
    }

    resolveRound(option) {
        this.stateMachine?.resolveRound(option);
    }

    restartRun() {
        this.scene.restart();
    }

    createPromptRound() {
        const prompt = PROMPTS[this.promptIndex % PROMPTS.length];
        const promptOrder = this.promptIndex;
        const correctReactionId = prompt.correctReactionIds[0];
        const decoyReactionId = prompt.decoyReactionIds[0];
        const showCorrectOnLeft = promptOrder % 2 === 0;

        this.promptIndex += 1;

        return {
            ...prompt,
            correctReactionId,
            options: showCorrectOnLeft
                ? [
                    toOption(correctReactionId, true, 'left'),
                    toOption(decoyReactionId, false, 'right')
                ]
                : [
                    toOption(decoyReactionId, false, 'left'),
                    toOption(correctReactionId, true, 'right')
                ]
        };
    }

    getWarningText() {
        if (this.runState.crash >= 67) {
            return NOISE_LIBRARY.warnings[3].text;
        }

        if (this.runState.crash >= 34) {
            return NOISE_LIBRARY.warnings[2].text;
        }

        return NOISE_LIBRARY.warnings[1].text;
    }

    updateHud() {
        if (!this.hudPage) {
            return;
        }

        const hypeRatio = this.runState.hype / 100;
        const crashRatio = this.runState.crash / this.runState.crashLimit;

        this.hudPage.hypeFill.width = HUD_BAR_WIDTH * hypeRatio;
        this.hudPage.crashFill.width = HUD_BAR_WIDTH * crashRatio;
        this.hudPage.hypeValueText.setText(`${Math.round(this.runState.hype)} / 100`);
        this.hudPage.crashValueText.setText(`${Math.round(this.runState.crash)} / ${this.runState.crashLimit}`);
    }

    buildResultData() {
        const crashedOut = this.runState.crash >= this.runState.crashLimit;

        return {
            headline: crashedOut ? 'Chat buried the stream' : 'You kept the stream alive',
            stats:
                `Prompts survived: ${this.runState.resolvedRounds}\n` +
                `Final hype: ${Math.round(this.runState.hype)} / 100\n` +
                `Crash meter: ${Math.round(this.runState.crash)} / ${this.runState.crashLimit}`,
            prompt: 'Tap anywhere to restart the run.'
        };
    }
}
