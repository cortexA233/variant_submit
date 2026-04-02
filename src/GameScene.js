import Phaser from 'phaser';
import {HudPage} from "./ui/HudPage.js";
import {ResultPage} from "./ui/ResultPage.js";
import {Hero} from "./entities/Hero.js";
import {GAME_CONFIG} from "./config/GameConfig.js";
import {Vector2} from "@esotericsoftware/spine-phaser-v4";
import {Stage} from "./entities/Stage.js";
import {PlayerInteractionPage} from "./ui/PlayerInteractionPage.js";


export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spineJson('man', '/spine/man/skeleton.json');
        this.load.spineAtlas('manAtlas', '/spine/man/skeleton.atlas', true);
    }

    create() {
        this.hudPage = new HudPage(this);
        this.resultPage = new ResultPage(this);
        this.playerInteractionPage = new PlayerInteractionPage(this);
        // this.resultPage.showResults();

        this.hero = new Hero(this, new Vector2(GAME_CONFIG.sceneConfig.screenWidth * 0.5,
            GAME_CONFIG.sceneConfig.screenHeight * 0.7));
        this.stage = new Stage(this);
    }

    update(time, deltaTime) {
        this.stage.updateStage(time, deltaTime);
    }

    resolveRound(option) {

    }

    restartRun() {
        this.scene.restart();
    }
}
