const CORRECT_BOUNCE_OFFSET = 18;
const CORRECT_BOUNCE_SCALE = 1.14;
const CORRECT_BOUNCE_DURATION = 120;
const CORRECT_BOUNCE_HOLD = 35;

const COMBO_BOUNCE_OFFSET = 14;
const COMBO_BOUNCE_SCALE = 1.4;
const COMBO_BOUNCE_DURATION = 300;
const COMBO_BOUNCE_HOLD = 45;

const WRONG_DROP_OFFSET = 32;
const WRONG_DROP_ANGLE = 5;
const WRONG_DROP_ALPHA = 0.88;
const WRONG_DROP_DURATION = 420;

export function resetTextMotion(textObject, baseY) {
    if (!textObject) {
        return null;
    }

    textObject
        .setY(baseY)
        .setScale(1)
        .setAngle(0)
        .setAlpha(1)
        .setVisible(true);

    return textObject;
}

export function playFeedbackTextMotion({ feedbackText, tweens, baseY, wasCorrect }) {
    if (!feedbackText || !tweens?.add) {
        return null;
    }

    tweens.killTweensOf?.(feedbackText);
    resetTextMotion(feedbackText, baseY);

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

export function playComboTextMotion({ comboText, tweens, baseY }) {
    if (!comboText || !tweens?.add) {
        return null;
    }

    tweens.killTweensOf?.(comboText);
    resetTextMotion(comboText, baseY);

    return tweens.add({
        targets: comboText,
        y: baseY - COMBO_BOUNCE_OFFSET,
        scaleX: COMBO_BOUNCE_SCALE,
        scaleY: COMBO_BOUNCE_SCALE,
        duration: COMBO_BOUNCE_DURATION,
        yoyo: true,
        hold: COMBO_BOUNCE_HOLD,
        ease: 'Back.easeOut'
    });
}
