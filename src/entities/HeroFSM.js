

export class HeroFSM {
    constructor(hero, params = {}) {
        this.hero = hero;
        this.currentState = null
        this.currentStateKey = null;
        this.transitState("Idle")
    }

    transitState(stateKey, params = {}) {
        const StateClass = HERO_STATE_MAP[stateKey];
        if (!StateClass) {
            throw new Error(`Unknown state: ${stateKey}`);
        }

        this.currentState?.exitState();
        this.currentStateKey = stateKey;
        this.currentState = new StateClass(this.hero);
        this.currentState.enterState(params);
    }

    destroy() {}
}

class HeroBaseState {
    constructor(hero, params = {}) {
        this.hero = hero;
    }

    enterState(params = {}) {}

    handleUpdate(deltaTime, params = {}) {}

    exitState() {}

    destroy() {

    }
}

export class HeroIdleState extends HeroBaseState {
    constructor(hero, params = {}) {
        super(hero, params);
    }

    enterState(params = {}) {
        super.enterState(params);
        this.hero.setHeroAnimation("idle", true);
    }

    destroy() {
        super.destroy()
    }
}

export class HeroSucceedState extends HeroBaseState {
    constructor(hero, params = {}) {
        super(hero, params);
    }

    destroy() {
        super.destroy()
    }
}

export class HeroFailState extends HeroBaseState {
    constructor(hero, params = {}) {
        super(hero, params);
    }

    destroy() {
        super.destroy()
    }
}

export const HERO_STATE_MAP = {
    Idle: HeroIdleState,
    Succeed: HeroSucceedState,
    Fail: HeroFailState,
}