export const DANMAKU_CONFIG = {
    comboThreshold: 3,
    positiveBurstCount: {
        min: 2,
        max: 3
    },
    negativeBurstCount: {
        min: 2,
        max: 3
    },
    speed: {
        min: 250,
        max: 400
    },
    spawnBand: {
        minY: 350,
        maxY: 550
    },
    offscreenMargin: 80,
    depth: 20,
    positiveComments: [
        'Nice!',
        'ORZ',
        'You are breathtaking!!',
        'KKSK',
        'Husband!',
        'KING OF THE NIGHT',
    ],
    negativeComments: [
        '????????',
        '?',
        'not that...',
        'I\'m unsubscribed',
        'this one so awkward wwwww',
        'What r u doing man'
    ],
    textStyles: {
        positive: {
            fontFamily: 'Trebuchet MS',
            fontSize: '18px',
            // fontStyle: 'bold',
            color: '#fdf7cf',
            stroke: '#3b220a',
            strokeThickness: 5
        },
        negative: {
            fontFamily: 'Trebuchet MS',
            fontSize: '18px',
            // fontStyle: 'bold',
            color: '#ffe5ef',
            stroke: '#350b19',
            strokeThickness: 5
        }
    }
};
