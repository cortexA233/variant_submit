import Phaser from 'phaser';
import {HeroFSM} from './HeroFSM.js';
import {ANIMATIONS} from '../config/AnimationConfig.js';
import {GAME_CONFIG} from '../config/GameConfig.js';

export class Hero extends Phaser.GameObjects.Container {
    constructor(scene, position, config = {}) {
        super(scene);
        this.scene = scene;
        this.config = {
            ...GAME_CONFIG.heroAssetsConfig,
            ...config,
            animations: {
                ...ANIMATIONS,
                ...(config.animations ?? {})
            }
        };
        this.spineObject = this.scene.add.spine(position.x, position.y, this.config.heroAssetKey, this.config.atlasKey);
        this.spineObject.setDepth(this.config.depth);
        this.spineObject.setScale(this.config.scale);
        this.animationCompleteListeners = new Map();
        this.stateMachine = new HeroFSM(this, {});

        this.spawnPoint = new Phaser.Math.Vector2(position.x, position.y);
        this.spineObject.animationState.data.defaultMix = this.config.defaultMix;
    }

    update(dt) {}

    reset(position = this.spawnPoint) {
        this.spineObject.x = position.x;
        this.spineObject.y = position.y;
        this.stateMachine.transitState('Idle');
    }

    setHeroAnimation(animationKey, isLoop = false) {
        const animationConfig = this.config.animations[animationKey];
        if (animationConfig && this.spineObject?.animationState) {
            this.spineObject.animationState.setAnimation(0, animationConfig.animation, isLoop);
            return true;
        }

        return false;
    }

    playReactionAnimation(animationKey) {
        return this.setHeroAnimation(animationKey, true);
    }

    bindAnimationComplete(handler) {
        if (!handler || !this.spineObject?.animationState?.addListener) {
            return false;
        }

        this.clearAnimationComplete(handler);

        const listener = {
            complete: (trackEntry) => handler(trackEntry)
        };

        this.animationCompleteListeners.set(handler, listener);
        this.spineObject.animationState.addListener(listener);
        return true;
    }

    clearAnimationComplete(handler) {
        const listener = this.animationCompleteListeners.get(handler);
        if (!listener || !this.spineObject?.animationState?.removeListener) {
            return false;
        }

        this.spineObject.animationState.removeListener(listener);
        this.animationCompleteListeners.delete(handler);
        return true;
    }

    destroy(fromScene = false) {
        super.destroy(fromScene);
        for (const listener of this.animationCompleteListeners.values()) {
            this.spineObject?.animationState?.removeListener?.(listener);
        }
        this.animationCompleteListeners.clear();
        this.spineObject?.destroy();
    }
}
