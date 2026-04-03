import Phaser from 'phaser';
import {HudPage} from './ui/HudPage.js';
import {ResultPage} from './ui/ResultPage.js';
import {Hero} from './entities/Hero.js';
import {GAME_CONFIG} from './config/GameConfig.js';
import {Vector2} from '@esotericsoftware/spine-phaser-v4';
import {Stage} from './entities/Stage.js';
import {PlayerInteractionPage} from './ui/PlayerInteractionPage.js';
import {GameSceneFSM} from './GameSceneFSM.js';
import {PROMPTS} from './config/PromptConfig.js';
import {ANIMATIONS} from './config/AnimationConfig.js';
import {NOISE_LIBRARY} from './config/NoiseConfig.js';

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

        this.hudPage = new HudPage(this);
        this.resultPage = new ResultPage(this);
        this.playerInteractionPage = new PlayerInteractionPage(this);

        this.hero = new Hero(this, new Vector2(
            GAME_CONFIG.sceneConfig.screenWidth * 0.5,
            GAME_CONFIG.sceneConfig.screenHeight * 0.7
        ));
        this.stage = new Stage(this);
        this.stateMachine = new GameSceneFSM(this);
    }

    update(time, deltaTime) {
        this.stage.updateStage(time, deltaTime);
        this.updatePromptTimer(time);
    }

    initializeRunState() {
        this.activePrompt = null;
        this.lastResolution = null;
        this.currentRoundDuration = GAME_CONFIG.roundConfig.baseDurationMs;
        this.roundEndsAt = 0;
        this.promptTimerEvent?.remove?.(false);
        this.promptTimerEvent = null;
        this.resultRevealEvent?.remove?.(false);
        this.resultRevealEvent = null;
        this.runState = {
            resolvedRounds: 0,
            hype: GAME_CONFIG.playerStateConfig.initialHype,
            crash: GAME_CONFIG.playerStateConfig.initialCrash,
            crashLimit: GAME_CONFIG.playerStateConfig.crashLimit,
            failedByTimeout: false
        };
    }

    enterBootState() {
        this.initializeRunState();
        this.hero.stateMachine.transitState('Idle');
        this.resultPage.setVisible(false);
        this.playerInteractionPage?.setPrompt(null);
        this.playerInteractionPage?.setInteractionEnabled(false);
        this.playerInteractionPage?.showStartPrompt();

        if (this.hudPage) {
            this.hudPage.promptText.setText(GAME_CONFIG.uiText.scene.emptyPrompt);
            this.hudPage.feedbackText.setText(GAME_CONFIG.uiText.scene.emptyFeedback).setAlpha(0);
            this.hudPage.setPromptTimerVisible(false);
        }

        this.updateHud();
    }

    startRunFromBoot() {
        this.stateMachine.startRun();
    }

    enterPromptingState() {
        this.activePrompt = this.createPromptRound();
        this.playerInteractionPage?.showPromptInstruction();
        this.playerInteractionPage?.setPrompt(this.activePrompt);
        this.resultPage.setVisible(false);
        this.startRoundTimer();

        if (this.hudPage) {
            this.hudPage.promptText.setText(this.activePrompt.text);
            this.hudPage.feedbackText
                .setText(this.lastResolution?.feedback ?? GAME_CONFIG.uiText.scene.emptyFeedback)
                .setAlpha(this.lastResolution ? 1 : 0);
            this.hudPage.setPromptTimerVisible(true);
        }

        this.updateHud();
    }

    enterResolvingState(option) {
        this.clearRoundTimer();

        if (!option || !this.activePrompt) {
            return { nextState: 'prompting' };
        }

        const timedOut = Boolean(option.timedOut);
        const wasCorrect = !timedOut && Boolean(option.isCorrect);
        const prompt = this.activePrompt;
        const successFeedback = prompt.successCommentBursts[this.runState.resolvedRounds % prompt.successCommentBursts.length];
        const failFeedback = prompt.failCommentBursts[this.runState.resolvedRounds % prompt.failCommentBursts.length];

        this.runState.resolvedRounds += 1;

        if (timedOut) {
            this.runState.failedByTimeout = true;
            this.runState.hype = clamp(this.runState.hype - 20, 0, GAME_CONFIG.playerStateConfig.hypeLimit);
            this.runState.crash = this.runState.crashLimit;
            this.lastResolution = {
                wasCorrect: false,
                timedOut: true,
                feedback: GAME_CONFIG.uiText.scene.emptyFeedback
            };

            this.hero.stateMachine.transitState('Fail', {isTimeOut: true});
            this.activePrompt = null;

            if (this.hudPage) {
                this.hudPage.feedbackText
                    .setText(this.lastResolution.feedback)
                    .setAlpha(1);
                }

            this.updateHud();

            return {
                nextState: 'result',
                result: {
                    ...this.buildResultData(),
                    delayMs: GAME_CONFIG.roundConfig.resultDelayMs
                }
            };
        }

        this.runState.failedByTimeout = false;
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

        this.hero.stateMachine.transitState('Reaction', {
            animationKey: option.reactionId
        });

        if (this.hudPage) {
            this.hudPage.feedbackText
                .setText(this.lastResolution.feedback)
                .setAlpha(1);
        }

        this.updateHud();

        if (this.runState.crash >= this.runState.crashLimit) {
            this.hero.stateMachine.transitState('Fail', {isTimeOut: false});
            return {
                nextState: 'result',
                result: {
                    ...this.buildResultData(),
                    delayMs: GAME_CONFIG.roundConfig.resultDelayMs,
                },
            };
        }

        return { nextState: 'prompting' };
    }

    enterResultState(resultData) {
        this.clearRoundTimer();
        this.activePrompt = null;
        this.playerInteractionPage?.setPrompt(null);
        this.playerInteractionPage?.setInteractionEnabled(false);
        this.setPromptTimerRatio(0);

        const { delayMs = 0, ...finalResult } = resultData ?? {};

        this.resultPage?.setVisible(false);
        this.resultRevealEvent?.remove?.(false);
        this.resultRevealEvent = null;

        if (this.hudPage) {
            this.hudPage.setPromptTimerVisible(false);
        }

        if (delayMs > 0 && this.time?.delayedCall) {
            this.resultRevealEvent = this.time.delayedCall(delayMs, () => this.resultPage?.showResults(finalResult));
            return;
        }

        this.resultPage?.showResults(finalResult);
    }

    setInteractionEnabled(enabled) {
        this.playerInteractionPage?.setInteractionEnabled(enabled);
    }

    resolveRound(option) {
        this.stateMachine.resolveRound(option);
    }

    restartRun() {
        this.scene.restart();
    }

    startRoundTimer() {
        this.currentRoundDuration = GAME_CONFIG.roundConfig.baseDurationMs - this.runState.resolvedRounds
            * GAME_CONFIG.roundConfig.durationDecreaseSpeed;
        this.currentRoundDuration = Math.max(GAME_CONFIG.roundConfig.minDurationMs, this.currentRoundDuration)
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
        if (!this.activePrompt || this.stateMachine?.currentState?.name !== 'prompting') {
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
        if (!this.hudPage?.promptTimerFill || this.stateMachine?.currentState?.name !== 'prompting') {
            return;
        }

        if (!this.roundEndsAt || !this.currentRoundDuration) {
            return;
        }

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

    updateHud() {
        if (!this.hudPage) {
            return;
        }

        const hypeRatio = this.runState.hype / GAME_CONFIG.playerStateConfig.hypeLimit;
        const crashRatio = this.runState.crash / this.runState.crashLimit;

        this.hudPage.hypeFill.width = HUD_BAR_WIDTH * hypeRatio;
        this.hudPage.crashFill.width = HUD_BAR_WIDTH * crashRatio;
        this.hudPage.hypeValueText.setText(`${Math.round(this.runState.hype)} / ${GAME_CONFIG.playerStateConfig.hypeLimit}`);
        this.hudPage.crashValueText.setText(`${Math.round(this.runState.crash)} / ${this.runState.crashLimit}`);
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
