export const PROMPTS = [
    {
        id: 'raise-the-heat',
        text: 'The chat wants this switch to hit harder and feel louder.',
        correctReactionIds: ['rrrRush', 'streetGroove'],
        decoyReactionIds: ['silkWave', 'stageStrut', 'bollyBeat'],
        successCommentBursts: ['That switch hit the drop', 'Crowd felt that instantly', 'Now the room is moving'],
        failCommentBursts: ['That killed the build', 'Wrong temperature for the moment', 'Chat wanted more impact']
    },
    {
        id: 'soften-the-mood',
        text: 'This cue needs something softer, smoother, and more graceful.',
        correctReactionIds: ['silkWave'],
        decoyReactionIds: ['rrrRush', 'bollyBeat', 'streetGroove'],
        successCommentBursts: ['That glide was perfect', 'The mood snapped into place', 'Clean, soft, and on cue'],
        failCommentBursts: ['Too rough for that cue', 'The vibe just got heavier', 'Chat wanted something gentler']
    },
    {
        id: 'keep-it-clip-worthy',
        text: 'The room wants a polished, camera-ready switch they can clip.',
        correctReactionIds: ['stageStrut', 'neonBounce'],
        decoyReactionIds: ['bollyBeat', 'rrrRush', 'silkWave'],
        successCommentBursts: ['That looked made for the feed', 'Clip farmers just woke up', 'Camera-ready move right there'],
        failCommentBursts: ['That was not the glam pick', 'Too messy for this moment', 'Chat wanted more polish']
    },
    {
        id: 'bring-the-bounce',
        text: 'Viewers are asking for something springy, playful, and bouncy.',
        correctReactionIds: ['streetGroove', 'bollyBeat'],
        decoyReactionIds: ['silkWave', 'stageStrut', 'rrrRush'],
        successCommentBursts: ['That bounce woke the room up', 'Now the crowd is smiling', 'Playful was the right call'],
        failCommentBursts: ['That felt too stiff', 'The bounce never showed up', 'Chat asked for lighter footwork']
    },
    {
        id: 'give-it-roots',
        text: 'The audience wants the next move to feel richer and more rooted.',
        correctReactionIds: ['bollyBeat', 'silkWave'],
        decoyReactionIds: ['neonBounce', 'rrrRush', 'stageStrut'],
        successCommentBursts: ['That flavor landed beautifully', 'Crowd loved the texture there', 'That felt grounded and rich'],
        failCommentBursts: ['That missed the flavor entirely', 'Too synthetic for that cue', 'Chat wanted more character']
    },
    {
        id: 'go-bigger',
        text: 'This beat drop needs a bigger, more explosive switch.',
        correctReactionIds: ['rrrRush', 'stageStrut'],
        decoyReactionIds: ['silkWave', 'streetGroove', 'neonBounce'],
        successCommentBursts: ['That filled the whole screen', 'Huge switch for a huge moment', 'The crowd ate that up'],
        failCommentBursts: ['That played too small', 'The drop needed more stage presence', 'Chat wanted something bigger']
    }
];
