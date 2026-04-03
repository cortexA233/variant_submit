export const GAME_CONFIG = {
    heroAssetsConfig: {
        heroAssetKey: 'man',
        atlasKey: 'manAtlas',
        depth: 10,
        scale: 0.28,
        defaultMix: 0.15
    },
    sceneConfig: {
        screenWidth: 720,
        screenHeight: 1280
    },
    playerStateConfig: {
        initialHype: 50,
        initialCrash: 0,
        hypeLimit: 100,
        crashLimit: 100,
        hypeSuccess: 12,
        hypeFailure: -16,
        crashSuccess: -10,
        crashFailure: 35
    },
    roundConfig: {
        baseDurationMs: 4500,
        durationDecreaseSpeed: 150,
        minDurationMs: 1500,
        resultDelayMs: 2000,
        feedbackDisplayDurationMs: 1500,
        urgentTimerThresholdRatio: 0.35,
        minimumTimerFillRatio: 0.02
    },
    cardConfig: {
        cardTheme: {
            left: {
                fill: 0x121f39,
                glow: 0x4fe1ff,
                edge: 0x4fe1ff,
                accent: '#8ff6ff'
            },
            right: {
                fill: 0x2c1533,
                glow: 0xff78be,
                edge: 0xff78be,
                accent: '#ffd3ea'
            }
        }
    },
    uiText: {
        hud: {
            hypeLabel: 'HYPE',
            crashLabel: 'CRASH',
            title: 'DANCE LIVE ROOM',
            subtitle: 'Read the crowd, switch styles, and never miss the beat!'
        },
        start: {
            topInstruction: 'Read the crowds\' cue,\r tap the left or right style card to change your dance. ' +
                '\rDon\'t let the timer run out!',
            startInstruction: 'Tap anywhere to start'
        },
        interaction: {
            choiceInstruction: 'Tap a card to switch your dance style for the crowd.',
            startInstruction: 'Tap anywhere to start',
            leftKeyLabel: 'LEFT',
            rightKeyLabel: 'RIGHT'
        },
        scene: {
            emptyPrompt: '',
            emptyFeedback: '',
            timeoutResultPrompt: 'Tap anywhere to try again.',
            timeoutHeadline: 'You missed the beat',
            crashHeadline: 'You were crashed by pressure',
            resultStatsCuesLabel: 'Cues cleared',
            resultStatsHypeLabel: 'Final hype',
            resultStatsCrashLabel: 'Final crash'
        },
        result: {
            defaultHeadline: 'Set complete',
            defaultStats: 'Tap to restart.',
            defaultPrompt: 'Tap to try again.'
        }
    }
};
