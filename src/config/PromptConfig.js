export const PROMPTS = [
    {
        id: 'jump-for-chat',
        text: 'Jump for the chat',
        correctReactionIds: ['dance', 'victoryJump'],
        decoyReactionIds: ['deadpan', 'embarrassed', 'uglyCry'],
        successCommentBursts: ['Huge save', 'Chat is spamming W', 'They ate that up'],
        failCommentBursts: ['That looked painful', 'The vibe just died', 'Clip the flop']
    },
    {
        id: 'look-effortless',
        text: 'Make that look effortless',
        correctReactionIds: ['chefsKiss'],
        decoyReactionIds: ['embarrassed', 'uglyCry'],
        successCommentBursts: ['Too smooth', 'That was clean', 'Streamer aura'],
        failCommentBursts: ['You hesitated', 'That was not graceful', 'Secondhand embarrassment']
    },
    {
        id: 'act-cool',
        text: 'Act cool right now',
        correctReactionIds: ['micDrop'],
        decoyReactionIds: ['embarrassed', 'uglyCry'],
        successCommentBursts: ['Cold exit', 'That landed', 'Respectfully... hard'],
        failCommentBursts: ['Nobody bought that', 'Cool factor gone', 'Abort mission']
    },
    {
        id: 'give-chat-a-finish',
        text: 'Give chat a finisher',
        correctReactionIds: ['victoryJump', 'micDrop'],
        decoyReactionIds: ['deadpan', 'uglyCry'],
        successCommentBursts: ['That was a closer', 'Replay that', 'Feed secured'],
        failCommentBursts: ['That finish was cursed', 'You sold the ending', 'Why end on that']
    },
    {
        id: 'turn-the-moment-around',
        text: 'Turn this moment around',
        correctReactionIds: ['dance', 'chefsKiss'],
        decoyReactionIds: ['deadpan', 'embarrassed'],
        successCommentBursts: ['Recovery of the year', 'Momentum restored', 'They are back'],
        failCommentBursts: ['The comeback never came', 'This is getting worse', 'The room went silent']
    },
    {
        id: 'sell-the-bit',
        text: 'Sell the bit harder',
        correctReactionIds: ['dance', 'micDrop'],
        decoyReactionIds: ['deadpan', 'uglyCry'],
        successCommentBursts: ['Commitment rewarded', 'Bit secured', 'Chat believes again'],
        failCommentBursts: ['That bit is dead', 'You broke character', 'Painful miss']
    }
];
