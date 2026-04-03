export const NOISE_LIBRARY = {
    positiveComments: [
        'That groove landed',
        'Crowd found the beat',
        'Replay that footwork',
        'The room is locked in',
        'That switch was clean'
    ],
    negativeComments: [
        'Wrong vibe for the cue',
        'That missed the beat',
        'Chat is losing patience',
        'That switch felt off',
        'You lost the room there'
    ],
    gifts: ['Glow Stick', 'Disco Ball', 'Spotlight', 'Confetti', 'Encore'],
    warnings: {
        1: { text: 'Crowd is warming up', severity: 'low' },
        2: { text: 'Requests are getting more demanding', severity: 'medium' },
        3: { text: 'One bad switch and chat will turn', severity: 'high' }
    }
};

export const NOISE_COUNTS = {
    1: { comments: 2, gifts: 1 },
    2: { comments: 4, gifts: 2 },
    3: { comments: 6, gifts: 3 }
};
