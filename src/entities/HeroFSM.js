
export class HeroFSM {
    constructor(hero, params = {}) {
        this.hero = hero;
        this.currentState = null
        this.transitState(new HeroIdleState(hero, {}))
    }

    transitState(newState, params = {}) {
        if(this.currentState){
            this.currentState.exitState();
        }
        this.currentState = newState;
    }

    destroy() {}
}

class HeroBaseState {
    constructor(hero, params = {}) {
        this.hero = hero;
        this.enterState(params)
    }

    enterState(params = {}) {}

    handleUpdate(deltaTime, params = {}) {}

    exitState() {}

    destroy() {

    }
}

class HeroIdleState extends HeroBaseState {
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

class HeroSucceedState extends HeroBaseState {
    constructor(hero, params = {}) {
        super(hero, params);
    }

    destroy() {
        super.destroy()
    }
}

class HeroFailState extends HeroBaseState {
    constructor(hero, params = {}) {
        super(hero, params);
    }

    destroy() {
        super.destroy()
    }
}