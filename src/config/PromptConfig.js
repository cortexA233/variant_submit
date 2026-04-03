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
        decoyReactionIds: ['classical', 'stageStrut', 'punjabi'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'soften-the-mood',
        text: 'Something softer.',
        correctReactionIds: ['classical'],
        decoyReactionIds: ['rrrRush', 'punjabi', 'streetGroove'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'keep-it-clip-worthy',
        text: 'A polished switch, ready to be clip.',
        correctReactionIds: ['stageStrut', 'neonBounce'],
        decoyReactionIds: ['punjabi', 'rrrRush', 'classical'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'bring-the-bounce',
        text: 'Something springy and bouncy!',
        correctReactionIds: ['streetGroove', 'punjabi'],
        decoyReactionIds: ['classical', 'stageStrut', 'rrrRush'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'give-it-roots',
        text: 'Next move to feel richer and rooted.',
        correctReactionIds: ['punjabi', 'classical'],
        decoyReactionIds: ['neonBounce', 'rrrRush', 'stageStrut'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    },
    {
        id: 'go-bigger',
        text: 'A more explosive switch!',
        correctReactionIds: ['rrrRush', 'stageStrut'],
        decoyReactionIds: ['classical', 'streetGroove', 'neonBounce'],
        successCommentBursts: SUCCESS_COMMENT_BURSTS,
        failCommentBursts: FAIL_COMMENT_BURSTS
    }
];
