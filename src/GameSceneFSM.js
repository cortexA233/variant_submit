export class GameSceneFSM {
    constructor(scene, params = {}) {
        this.scene = scene;
        this.currentState = null;
        this.transitState(new GameSceneBootState(scene, this), params);
    }

    transitState(newState, params = {}) {
        if (this.currentState) {
            this.currentState.exitState();
        }

        this.currentState = newState;
        this.currentState.enterState(params);
    }

    startRun() {
        this.currentState?.startRun();
    }

    resolveRound(option) {
        this.currentState?.resolveRound(option);
    }

    destroy() {}
}

class GameSceneBaseState {
    constructor(scene, stateMachine) {
        this.name = 'base';
        this.scene = scene;
        this.stateMachine = stateMachine;
    }

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
        this.scene.enterBootState?.(params);
    }

    startRun() {
        this.stateMachine.transitState(new GameScenePromptingState(this.scene, this.stateMachine));
    }
}

class GameScenePromptingState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'prompting';
    }

    enterState(params = {}) {
        this.scene.setInteractionEnabled?.(true);
        this.scene.enterPromptingState?.(params);
    }

    resolveRound(option) {
        this.stateMachine.transitState(new GameSceneResolvingState(this.scene, this.stateMachine), { option });
    }
}

class GameSceneResolvingState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'resolving';
    }

    enterState(params = {}) {
        const { option = null } = params;

        this.scene.setInteractionEnabled?.(false);

        const outcome = this.scene.enterResolvingState?.(option) ?? { nextState: 'prompting' };

        if (outcome.nextState === 'result') {
            this.stateMachine.transitState(new GameSceneResultState(this.scene, this.stateMachine), {
                result: outcome.result
            });
            return;
        }

        this.stateMachine.transitState(new GameScenePromptingState(this.scene, this.stateMachine), outcome);
    }
}

class GameSceneResultState extends GameSceneBaseState {
    constructor(scene, stateMachine) {
        super(scene, stateMachine);
        this.name = 'result';
    }

    enterState(params = {}) {
        this.scene.enterResultState?.(params.result ?? null);
    }
}
