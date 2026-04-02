import Phaser from 'phaser';
import {HeroFSM} from "./HeroFSM.js";
import {ANIMATIONS} from "../config/AnimationConfig.js";
import {GAME_CONFIG} from "../config/GameConfig.js";


export class Hero extends Phaser.GameObjects.Container {
    constructor(scene, position, config = {}) {
        super(scene);
        this.scene = scene;
        this.config = {
            ...GAME_CONFIG.heroAssetsConfig,
            animations: {
                ...ANIMATIONS
            }
        };
        this.spineObject = this.scene.add.spine(position.x, position.y, this.config.heroAssetKey, this.config.atlasKey);
        this.spineObject.setDepth(this.config.depth);
        this.spineObject.setScale(this.config.scale);
        this.stateMachine = new HeroFSM(this, {})

        this.spawnPoint = new Phaser.Math.Vector2(position.x, position.y);
        this.spineObject.animationState.data.defaultMix = this.config.defaultMix;
    }

    update(dt) {

    }

    reset(position = this.spawnPoint) {
        // this.lockedFallbackAnimation = this.config.animations.idle;
        // this.currentLoopAnimation = this.config.animations.idle;
        // this.overrideLoopAnimation = null;
        this.spineObject.x = position.x;
        this.spineObject.y = position.y;
        this.stateMachine.transitState(new HeroIdleState(this))
    }

    setHeroAnimation(animationKey, isLoop=false) {
        this.overrideLoopAnimation = null;
        const anim_config = this.config.animations[animationKey];
        if(anim_config) {
            this.spineObject.animationState.setAnimation(0, anim_config.animation, isLoop);
        }
    }

    destroy() {
        this.spineObject?.destroy();
    }
}
