import Phaser from 'phaser';
import {DANMAKU_CONFIG} from '../config/DanmakuConfig.js';
import {DanmakuEntity} from './DanmakuEntity.js';

const randomIntegerInRange = ({ min, max }) => Phaser.Math.Between(min, max);

const randomItem = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return items[Phaser.Math.Between(0, items.length - 1)];
};

export class DanmakuManager {
    constructor(scene, config = DANMAKU_CONFIG) {
        this.scene = scene;
        this.config = config;
        this.activeEntities = new Set();
    }

    shouldTriggerPositiveBurst(comboCount) {
        const threshold = this.config.comboThreshold;

        return threshold > 0
            && comboCount >= threshold
            && comboCount % threshold === 0;
    }

    spawnPositiveBurst(comboCount) {
        if (!this.shouldTriggerPositiveBurst(comboCount)) {
            return [];
        }

        return this.spawnBurst({
            comments: this.config.positiveComments,
            countRange: this.config.positiveBurstCount,
            style: this.config.textStyles.positive
        });
    }

    spawnNegativeBurst() {
        return this.spawnBurst({
            comments: this.config.negativeComments,
            countRange: this.config.negativeBurstCount,
            style: this.config.textStyles.negative
        });
    }

    spawnBurst({ comments, countRange, style }) {
        if (!Array.isArray(comments) || comments.length === 0) {
            return [];
        }

        const burstCount = randomIntegerInRange(countRange);
        const viewportWidth = this.scene.scale?.width ?? this.scene.cameras?.main?.width ?? 0;
        const minSpeed = this.config.speed.min;
        const maxSpeed = this.config.speed.max;
        const { minY, maxY } = this.config.spawnBand;
        const createdEntities = [];

        for (let index = 0; index < burstCount; index += 1) {
            const text = randomItem(comments);

            if (!text) {
                continue;
            }

            const entity = new DanmakuEntity(this.scene, {
                text,
                style,
                depth: this.config.depth,
                direction: Phaser.Math.Between(0, 1) === 0 ? 'right' : 'left',
                y: Phaser.Math.Between(minY, maxY),
                speed: Phaser.Math.FloatBetween(minSpeed, maxSpeed),
                viewportWidth,
                offscreenMargin: this.config.offscreenMargin,
                onComplete: (completedEntity) => {
                    this.activeEntities.delete(completedEntity);
                }
            });

            if (entity.destroyed) {
                continue;
            }

            this.activeEntities.add(entity);
            createdEntities.push(entity);
        }

        return createdEntities;
    }

    clear() {
        const entities = [...this.activeEntities];
        this.activeEntities.clear();
        entities.forEach((entity) => entity.destroy());
    }
}
