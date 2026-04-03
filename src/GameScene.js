import Phaser from 'phaser';
import {HudPage} from './ui/HudPage.js';
import {ResultPage} from './ui/ResultPage.js';
import {Hero} from './entities/Hero.js';
import {GAME_CONFIG} from './config/GameConfig.js';
import {Vector2} from '@esotericsoftware/spine-phaser-v4';
import {Stage} from './entities/Stage.js';
import {PlayerInteractionPage} from './ui/PlayerInteractionPage.js';
import {StartPage} from './ui/StartPage.js';
import {GameSceneFSM} from './GameSceneFSM.js';
import {PROMPTS} from './config/PromptConfig.js';
import {ANIMATIONS} from './config/AnimationConfig.js';
import {DanmakuManager} from './entities/DanmakuManager.js';
import {
    playComboTextMotion,
    playFeedbackTextMotion,
    resetTextMotion,
} from './ui/feedbackTextMotion.js';

const HUD_BAR_WIDTH = 250;

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

        this.lightShiningSpeed = 1;
        this.hudPage = null;
        this.resultPage = new ResultPage(this);
        this.startPage = new StartPage(this);
        this.playerInteractionPage = null;

        this.hero = new Hero(this, new Vector2(
            GAME_CONFIG.sceneConfig.screenWidth * 0.5,
            GAME_CONFIG.sceneConfig.screenHeight * 0.7
        ));
        this.stage = null;
        this.danmakuManager = new DanmakuManager(this);
        this.stateMachine = new GameSceneFSM(this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.danmakuManager.clear();
        });
    }

    update(time, deltaTime) {
        this.stateMachine.currentState.handleUpdate(time, deltaTime);
        this.updatePromptTimer(time);
    }

    initializeRunState() {
        this.activePrompt = null;
        this.lastResolution = null;
        this.currentRoundDuration = GAME_CONFIG.roundConfig.baseDurationMs;
        this.roundEndsAt = 0;
        this.promptTimerEvent?.remove(false);
        this.promptTimerEvent = null;
        this.resultRevealEvent?.remove(false);
        this.resultRevealEvent = null;
        this.feedbackHideEvent?.remove(false);
        this.feedbackHideEvent = null;
        this.runState = {
            resolvedRounds: 0,
            comboCount: 0,
            hype: GAME_CONFIG.playerStateConfig.initialHype,
            crash: GAME_CONFIG.playerStateConfig.initialCrash,
            crashLimit: GAME_CONFIG.playerStateConfig.crashLimit,
            failedByTimeout: false
        };
    }

    enterBootState() {
        this.initializeRunState();
        this.danmakuManager.clear();
        this.hero.stateMachine.transitState('Idle');
        this.resultPage.setVisible(false);
        this.startPage.setVisible(true);
        this.playerInteractionPage?.setPrompt(null);
        this.playerInteractionPage?.setInteractionEnabled(false);
        this.playerInteractionPage?.setChoiceCardsVisible(false);

        if (this.hudPage) {
            this.clearFeedbackHideEvent();
            this.hudPage.promptText.setText(GAME_CONFIG.uiText.scene.emptyPrompt);
            this.resetFeedbackTextDisplay(GAME_CONFIG.uiText.scene.emptyFeedback, 0, false);
            this.hudPage.setPromptTimerVisible(false);
        }

        this.updateHud();
    }

    startRunFromBoot() {
        this.stage = new Stage(this);
        this.hudPage = new HudPage(this);
        this.startPage.setVisible(false);
        this.playerInteractionPage ??= new PlayerInteractionPage(this);
        this.stateMachine.transitState('Prompting');
        this.hero.stateMachine.transitState('Reaction', { animationKey: 'streetGroove' });
    }

    enterPromptingState() {
        this.activePrompt = this.createPromptRound();
        this.playerInteractionPage?.setChoiceCardsVisible(true);
        this.playerInteractionPage?.setPrompt(this.activePrompt);
        this.resultPage.setVisible(false);
        this.startRoundTimer();

        if (this.hudPage) {
            this.hudPage.promptText.setText(this.activePrompt.text);
            const hasLastResolution = Boolean(this.lastResolution);
            this.hudPage.feedbackText
                .setText(this.lastResolution?.feedback ?? GAME_CONFIG.uiText.scene.emptyFeedback)
                .setAlpha(hasLastResolution ? 1 : 0)
                .setVisible(hasLastResolution);
            this.hudPage.setPromptTimerVisible(true);
        }

        this.updateHud();
    }

    enterResolvingState(option) {
        this.clearRoundTimer();
        this.clearFeedbackHideEvent();

        if (!option || !this.activePrompt) {
            return { nextState: 'Prompting' };
        }

        const timedOut = Boolean(option.timedOut);
        const wasCorrect = !timedOut && Boolean(option.isCorrect);
        const prompt = this.activePrompt;
        const successFeedback = prompt.successCommentBursts[this.runState.resolvedRounds % prompt.successCommentBursts.length];
        const failFeedback = prompt.failCommentBursts[this.runState.resolvedRounds % prompt.failCommentBursts.length];

        this.runState.resolvedRounds += 1;

        if (timedOut) {
            this.runState.failedByTimeout = true;
            this.runState.comboCount = 0;
            this.lastResolution = {
                wasCorrect: false,
                timedOut: true,
                feedback: GAME_CONFIG.uiText.scene.emptyFeedback
            };

            this.hero.stateMachine.transitState('Fail', {isTimeOut: true});
            this.activePrompt = null;

            if (this.hudPage) {
                this.resetFeedbackTextDisplay(this.lastResolution.feedback, 1, true);
            }

            this.updateHud();

            return {
                nextState: 'Result',
                result: {
                    ...this.buildResultData(),
                    delayMs: GAME_CONFIG.roundConfig.resultDelayMs
                }
            };
        }

        this.runState.failedByTimeout = false;
        this.runState.comboCount = wasCorrect ? this.runState.comboCount + 1 : 0;
        this.runState.hype = clamp(
            this.runState.hype + (wasCorrect ? GAME_CONFIG.playerStateConfig.hypeSuccess : GAME_CONFIG.playerStateConfig.hypeFailure),
            0,
            GAME_CONFIG.playerStateConfig.hypeLimit
        );
        this.runState.crash = clamp(
            this.runState.crash + (wasCorrect ? GAME_CONFIG.playerStateConfig.crashSuccess : GAME_CONFIG.playerStateConfig.crashFailure),
            0,
            this.runState.crashLimit
        );
        this.lastResolution = {
            wasCorrect,
            timedOut: false,
            feedback: wasCorrect ? successFeedback : failFeedback
        };

        if (wasCorrect) {
            this.danmakuManager.spawnPositiveBurst(this.runState.comboCount);
        } else {
            this.danmakuManager.spawnNegativeBurst();
        }

        this.hero.stateMachine.transitState('Reaction', {
            animationKey: option.reactionId
        });

        this.hudPage.feedbackText
            .setText(this.lastResolution.feedback);
        playFeedbackTextMotion({
            feedbackText: this.hudPage.feedbackText,
            tweens: this.tweens,
            baseY: this.hudPage.feedbackTextBaseY ?? this.hudPage.feedbackText.y,
            wasCorrect
        });
        this.feedbackHideEvent = this.time.delayedCall(
            GAME_CONFIG.roundConfig.feedbackDisplayDurationMs,
            () => {
                this.hudPage.feedbackText.setVisible(false);
                this.feedbackHideEvent = null;
            }
        ) ?? null;

        this.updateHud({ animateCombo: wasCorrect });

        if (this.runState.crash >= this.runState.crashLimit) {
            this.hero.stateMachine.transitState('Fail', {isTimeOut: false});
            return {
                nextState: 'Result',
                result: {
                    ...this.buildResultData(),
                    delayMs: GAME_CONFIG.roundConfig.resultDelayMs,
                },
            };
        }

        return { nextState: 'Prompting' };
    }

    enterResultState(resultData) {
        this.clearRoundTimer();
        this.clearFeedbackHideEvent();
        this.danmakuManager.clear();
        this.activePrompt = null;
        this.playerInteractionPage?.setPrompt(null);
        this.playerInteractionPage?.setInteractionEnabled(false);
        this.setPromptTimerRatio(0);
        this.lightShiningSpeed = 1;

        const { delayMs = 0, ...finalResult } = resultData ?? {};

        this.resultPage.setVisible(false);
        this.resultRevealEvent?.remove(false);
        this.resultRevealEvent = null;

        if (this.hudPage) {
            this.hudPage.setPromptTimerVisible(false);
        }

        if (delayMs > 0 && this.time.delayedCall) {
            this.resultRevealEvent = this.time.delayedCall(delayMs, () => this.resultPage.showResults(finalResult));
            return;
        }

        this.resultPage.showResults(finalResult);
    }

    clearFeedbackHideEvent() {
        this.feedbackHideEvent?.remove?.(false);
        this.feedbackHideEvent = null;
    }

    resetFeedbackTextDisplay(text, alpha = 1, visible = true) {
        this.tweens?.killTweensOf?.(this.hudPage.feedbackText);
        resetTextMotion(
            this.hudPage.feedbackText,
            this.hudPage.feedbackTextBaseY ?? this.hudPage.feedbackText.y
        );
        this.hudPage.feedbackText
            .setText(text)
            .setAlpha(alpha)
            .setVisible(visible);
    }

    resetComboTextDisplay(text, alpha = 1, visible = true) {
        this.hudPage.comboText
            .setText(text)
            .setAlpha(alpha)
            .setVisible(visible);
    }

    updateComboHud({ animate = false } = {}) {
        if (this.runState.comboCount < 2) {
            this.resetComboTextDisplay('', 0, false);
            return;
        }

        const comboLabel = `${this.runState.comboCount} COMBO`;

        this.resetComboTextDisplay(comboLabel, 1, true);
        if (animate) {
            playComboTextMotion({
                comboText: this.hudPage.comboText,
                tweens: this.tweens,
                baseY: this.hudPage.comboTextBaseY ?? this.hudPage.comboText.y
            });
        }

    }

    setInteractionEnabled(enabled) {
        this.playerInteractionPage?.setInteractionEnabled(enabled);
    }

    resolveRound(option) {
        this.stateMachine.transitState('Resolving', { option });
    }

    restartRun() {
        this.scene.restart();
    }

    startRoundTimer() {
        this.currentRoundDuration = GAME_CONFIG.roundConfig.baseDurationMs - this.runState.resolvedRounds
            * GAME_CONFIG.roundConfig.durationDecreaseSpeed;
        this.lightShiningSpeed = Math.pow(GAME_CONFIG.roundConfig.baseDurationMs / this.currentRoundDuration, 2);
        this.currentRoundDuration = Math.max(GAME_CONFIG.roundConfig.minDurationMs, this.currentRoundDuration);
        this.roundEndsAt = this.time.now + this.currentRoundDuration;
        this.promptTimerEvent?.remove?.(false);
        this.promptTimerEvent = this.time.delayedCall(this.currentRoundDuration, () => this.handlePromptTimeout());
        this.setPromptTimerRatio(1);
    }

    clearRoundTimer() {
        this.promptTimerEvent?.remove?.(false);
        this.promptTimerEvent = null;
        this.roundEndsAt = 0;
    }

    handlePromptTimeout() {
        if (!this.activePrompt || this.stateMachine.currentStateKey !== 'Prompting') {
            return;
        }

        this.resolveRound({
            side: 'timeout',
            isCorrect: false,
            timedOut: true
        });
    }

    createPromptRound() {
        const randomPromptIndex = Math.floor(Math.random() * PROMPTS.length)
        const prompt = PROMPTS[randomPromptIndex];
        const correctReactionId = prompt.correctReactionIds[0];
        const decoyReactionId = prompt.decoyReactionIds[0];
        const showCorrectOnLeft = Math.random() > 0.5;

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

    updatePromptTimer(time) {
        const remaining = Math.max(this.roundEndsAt - time, 0);
        const ratio = clamp(remaining / this.currentRoundDuration, 0, 1);
        this.setPromptTimerRatio(ratio);
    }

    setPromptTimerRatio(ratio) {
        if (!this.hudPage?.promptTimerFill) {
            return;
        }

        const minimumRatio = GAME_CONFIG.roundConfig.minimumTimerFillRatio;
        const visibleRatio = ratio > 0 ? Math.max(ratio, minimumRatio) : minimumRatio;
        this.hudPage.promptTimerFill.setScale(visibleRatio, 1);
        this.hudPage.promptTimerFill.setFillStyle(
            ratio < GAME_CONFIG.roundConfig.urgentTimerThresholdRatio ? 0xff7d8f : 0x6effbf,
            1
        );
    }

    updateHud({ animateCombo = false } = {}) {
        if (!this.hudPage) {
            return;
        }

        const hypeRatio = this.runState.hype / GAME_CONFIG.playerStateConfig.hypeLimit;
        const crashRatio = this.runState.crash / this.runState.crashLimit;

        this.hudPage.hypeFill.width = HUD_BAR_WIDTH * hypeRatio;
        this.hudPage.crashFill.width = HUD_BAR_WIDTH * crashRatio;
        this.hudPage.hypeValueText.setText(`${Math.round(this.runState.hype)} / ${GAME_CONFIG.playerStateConfig.hypeLimit}`);
        this.hudPage.crashValueText.setText(`${Math.round(this.runState.crash)} / ${this.runState.crashLimit}`);
        this.updateComboHud({ animate: animateCombo && this.runState.comboCount >= 2 });
    }

    buildResultData() {
        const timedOut = this.runState.failedByTimeout;

        return {
            headline: timedOut
                ? GAME_CONFIG.uiText.scene.timeoutHeadline
                : GAME_CONFIG.uiText.scene.crashHeadline,
            stats:
                `${GAME_CONFIG.uiText.scene.resultStatsCuesLabel}: ${this.runState.resolvedRounds}\n` +
                `${GAME_CONFIG.uiText.scene.resultStatsHypeLabel}: ${Math.round(this.runState.hype)} / ${GAME_CONFIG.playerStateConfig.hypeLimit}\n` +
                `${GAME_CONFIG.uiText.scene.resultStatsCrashLabel}: ${Math.round(this.runState.crash)} / ${this.runState.crashLimit}`,
            prompt: GAME_CONFIG.uiText.scene.timeoutResultPrompt
        };
    }
}
