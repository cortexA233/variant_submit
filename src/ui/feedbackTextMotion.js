const CORRECT_BOUNCE_OFFSET = 18;
const CORRECT_BOUNCE_SCALE = 1.14;
const CORRECT_BOUNCE_DURATION = 120;
const CORRECT_BOUNCE_HOLD = 35;

const WRONG_DROP_OFFSET = 32;
const WRONG_DROP_ANGLE = 5;
const WRONG_DROP_ALPHA = 0.88;
const WRONG_DROP_DURATION = 420;

export function resetFeedbackTextMotion(feedbackText, baseY) {
    if (!feedbackText) {
        return null;
    }

    feedbackText
        .setY(baseY)
        .setScale(1)
        .setAngle(0)
        .setAlpha(1)
        .setVisible(true);

    return feedbackText;
}

export function playFeedbackTextMotion({ feedbackText, tweens, baseY, wasCorrect }) {
    if (!feedbackText || !tweens.add) {
        return null;
    }

    tweens.killTweensOf(feedbackText);
    resetFeedbackTextMotion(feedbackText, baseY);

    return tweens.add(wasCorrect
        ? {
            targets: feedbackText,
            y: baseY - CORRECT_BOUNCE_OFFSET,
            scaleX: CORRECT_BOUNCE_SCALE,
            scaleY: CORRECT_BOUNCE_SCALE,
            duration: CORRECT_BOUNCE_DURATION,
            yoyo: true,
            hold: CORRECT_BOUNCE_HOLD,
            ease: 'Quad.easeOut'
        }
        : {
            targets: feedbackText,
            y: baseY + WRONG_DROP_OFFSET,
            angle: WRONG_DROP_ANGLE,
            alpha: WRONG_DROP_ALPHA,
            duration: WRONG_DROP_DURATION,
            ease: 'Sine.easeIn'
        });
}
