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
        baseDurationMs: 4300,
        resultDelayMs: 1500,
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
    }
};
