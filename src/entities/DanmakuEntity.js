export class DanmakuEntity {
    constructor(scene, {
        text,
        style,
        depth,
        direction,
        y,
        speed,
        viewportWidth,
        offscreenMargin,
        onComplete
    }) {
        this.scene = scene;
        this.text = text;
        this.style = style;
        this.depth = depth;
        this.direction = direction;
        this.y = y;
        this.speed = speed;
        this.viewportWidth = viewportWidth;
        this.offscreenMargin = offscreenMargin;
        this.onComplete = onComplete;
        this.textObject = null;
        this.tween = null;
        this.destroyed = false;

        this.createTextObject();
        this.launch();
    }

    createTextObject() {
        if (!this.scene?.add?.text) {
            return;
        }

        this.textObject = this.scene.add.text(0, this.y, this.text, this.style)
            .setOrigin(0.5)
            .setDepth(this.depth)
            .setAlpha(0.92);
    }

    launch() {
        if (!this.textObject || !this.scene?.tweens?.add) {
            this.destroy();
            return;
        }

        const halfWidth = this.textObject.width * 0.5;
        const offset = this.offscreenMargin + halfWidth;
        const movingRight = this.direction === 'right';
        const startX = movingRight ? -offset : this.viewportWidth + offset;
        const endX = movingRight ? this.viewportWidth + offset : -offset;
        const duration = Math.max(1000, (Math.abs(endX - startX) / this.speed) * 1000);

        this.textObject.setX(startX);
        this.tween = this.scene.tweens.add({
            targets: this.textObject,
            x: endX,
            duration,
            ease: 'Linear',
            onComplete: () => this.finish()
        });
    }

    finish() {
        if (this.destroyed) {
            return;
        }

        const onComplete = this.onComplete;
        this.onComplete = null;
        this.destroy();
        onComplete?.(this);
    }

    destroy() {
        if (this.destroyed) {
            return;
        }

        this.destroyed = true;
        this.tween?.remove?.();
        this.tween = null;
        this.textObject?.destroy?.();
        this.textObject = null;
        this.onComplete = null;
    }
}
