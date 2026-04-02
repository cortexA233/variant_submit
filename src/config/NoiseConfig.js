export const NOISE_LIBRARY = {
    positiveComments: [
        'W chat',
        'That landed',
        'Streamer aura',
        'Main character energy',
        'Replay that immediately'
    ],
    negativeComments: [
        'This is painful',
        'Nooo',
        'Career ending stream',
        'Clip the fail',
        'I felt that in my spine'
    ],
    gifts: ['Rose', 'Galaxy', 'Fire x3', 'Crown', 'Rocket'],
    warnings: {
        1: { text: 'Chat warming up', severity: 'low' },
        2: { text: 'This feed is getting loud', severity: 'medium' },
        3: { text: 'Stream is slipping', severity: 'high' }
    }
};

export const NOISE_COUNTS = {
    1: { comments: 2, gifts: 1 },
    2: { comments: 4, gifts: 2 },
    3: { comments: 6, gifts: 3 }
};
