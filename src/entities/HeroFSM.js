export class HeroFSM {
    constructor(hero, params = {}) {
        this.hero = hero;
        this.currentState = null;
        this.currentStateKey = null;
        this.transitState('Idle', params);
    }

    transitState(stateKey, params = {}) {
        const StateClass = HERO_STATE_MAP[stateKey];
        if (!StateClass) {
            throw new Error(`Unknown state: ${stateKey}`);
        }

        this.currentState?.exitState();
        this.currentStateKey = stateKey;
        this.currentState = new StateClass(this.hero, this);
        this.currentState.enterState(params);
    }

    destroy() {}
}

class HeroBaseState {
    constructor(hero, stateMachine) {
        this.hero = hero;
        this.stateMachine = stateMachine;
    }

    enterState(params = {}) {}

    handleUpdate(deltaTime, params = {}) {}

    exitState() {}

    destroy() {}
}

export class HeroIdleState extends HeroBaseState {
    enterState(params = {}) {
        super.enterState(params);
        this.hero.setHeroAnimation('idle', true);
    }
}

export class HeroReactionState extends HeroBaseState {
    enterState(params = {}) {
        super.enterState(params);

        const animationKey = params.animationKey;
        const didStart = animationKey ? this.hero.playReactionAnimation(animationKey) : false;

        if (!didStart) {
            this.stateMachine.transitState('Idle');
        }
    }
}

export class HeroFailState extends HeroBaseState {
    constructor(hero, stateMachine) {
        super(hero, stateMachine);
    }

    enterState(params = {}) {
        super.enterState(params);
        if(params.isTimeOut) {
            this.hero.setHeroAnimation('embarrassed', false);
        }else{
            this.hero.setHeroAnimation('cry', true);
        }
    }

}

export const HERO_STATE_MAP = {
    Idle: HeroIdleState,
    Reaction: HeroReactionState,
    Fail: HeroFailState
};
