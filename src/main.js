import Phaser from 'phaser';
import {SpinePlugin} from '@esotericsoftware/spine-phaser-v4';

import { GameScene } from './GameScene';

const config = {
    type: Phaser.WEBGL,
    parent: 'app',
    width: 720,
    height: 1280,
    backgroundColor: '#0b0815',
    scene: [GameScene],
    plugins: {
        scene: [{ key: 'SpinePlugin', plugin: SpinePlugin, mapping: 'spine' }]
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
