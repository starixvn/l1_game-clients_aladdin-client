import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class InstantWinConfigStore {
    private _defaultBetLevel = 0;
    private _betLevels = [1,2,5,10,15,20,25,50];

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get betLevels() {
        return this._betLevels;
    }

    set betLevels(betLevels: number[]) {
        this._betLevels = betLevels;
    }

    get defaultBetLevel() {
        return this._defaultBetLevel;
    }

    set defaultBetLevel(defaultBetLevel: number) {
        this._defaultBetLevel = defaultBetLevel;
    }
}
