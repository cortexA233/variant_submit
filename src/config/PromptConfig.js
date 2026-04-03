const SUCCESS_COMMENT_BURSTS = [
    'That switch landed!',
    'The crowd is with you!'
];

const FAIL_COMMENT_BURSTS = [
    'That missed the cue...',
    'The room felt that flop...'
];

export const PROMPTS = [
    {
        id: 'raise-the-heat',
        text: 'They want to feel louder!',
        correctReactionIds: ['rrrRush', 'streetGroove'],
        decoyReactionIds: ['silkWave', 'stageStrut', 'bollyBeat'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'soften-the-mood',
        text: 'Something softer, smoother, and more graceful.',
        correctReactionIds: ['silkWave'],
        decoyReactionIds: ['rrrRush', 'bollyBeat', 'streetGroove'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'keep-it-clip-worthy',
        text: 'A polished camera-ready switch, ready to be clip.',
        correctReactionIds: ['stageStrut', 'neonBounce'],
        decoyReactionIds: ['bollyBeat', 'rrrRush', 'silkWave'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'bring-the-bounce',
        text: 'They need something springy and bouncy.',
        correctReactionIds: ['streetGroove', 'bollyBeat'],
        decoyReactionIds: ['silkWave', 'stageStrut', 'rrrRush'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'give-it-roots',
        text: 'Next move to feel richer and more rooted.',
        correctReactionIds: ['bollyBeat', 'silkWave'],
        decoyReactionIds: ['neonBounce', 'rrrRush', 'stageStrut'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'go-bigger',
        text: 'A more explosive switch!',
        correctReactionIds: ['rrrRush', 'stageStrut'],
        decoyReactionIds: ['silkWave', 'streetGroove', 'neonBounce'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    }
];
