
export class GameSceneFSM {
    constructor(scene, params = {}) {
        this.scene = scene;
        this.currentState = null;
        this.currentStateKey = null;
        this.transitState('Boot', params);
    }

    transitState(stateKey, params = {}) {
        const StateClass = GAME_SCENE_STATE_MAP[stateKey];
        if (!StateClass) {
            throw new Error(`Unknown state: ${stateKey}`);
        }

        this.currentState?.exitState();
        this.currentStateKey = stateKey;
        this.currentState = new StateClass(this.scene, this);
        this.currentState.enterState(params);
    }

    destroy() {}
}

class GameSceneBaseState {
    constructor(scene, stateMachine) {
        this.name = 'base';
        this.scene = scene;
        this.stateMachine = stateMachine;
    }

    handleUpdate(time, deltaTime) {}

    enterState(params = {}) {}

    exitState() {}

    destroy() {}
}

class GameSceneBootState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'boot';
    }

    enterState(params = {}) {
        this.scene.enterBootState(params);
    }
}

class GameScenePromptingState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'prompting';
    }

    handleUpdate(time, deltaTime) {
        this.scene.stage.updateStage(time, this.lightShiningSpeed);
        this.scene.updatePromptTimer(time);
    }

    enterState(params = {}) {
        this.scene.setInteractionEnabled(true);
        this.scene.enterPromptingState(params);
    }
}

class GameSceneResolvingState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'resolving';
    }

    handleUpdate(time, deltaTime) {
        this.scene.stage.updateStage(time, this.lightShiningSpeed);
    }

    enterState(params = {}) {
        const { option = null } = params;

        this.scene.setInteractionEnabled(false);

        const outcome = this.scene.enterResolvingState(option) ?? { nextState: 'Prompting' };

        if (outcome.nextState === 'Result') {
            this.stateMachine.transitState(outcome.nextState, {
                result: outcome.result
            });
            return;
        }

        this.stateMachine.transitState(outcome.nextState, outcome);
    }
}

class GameSceneResultState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'result';
    }

    enterState(params = {}) {
        this.scene.enterResultState(params.result ?? null);
        this.scene.stage.closeSpotlight()
    }
}

export const GAME_SCENE_STATE_MAP = {
    Boot: GameSceneBootState,
    Prompting: GameScenePromptingState,
    Resolving: GameSceneResolvingState,
    Result: GameSceneResultState
};
