import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class InstantWinConfigStore  {
    private _defaultBetLevel = 1;
    private _betLevels = [];
    private _minBet = 0;
    private _maxBet = 0;
    // 1,2,5,10,15,20,25,50, 75, 100, 200, 500, 1000, 1500, 2000, 5000
    constructor() {
        mobx.makeAutoObservable(this);
    }

    get betLevels() {
        return this._betLevels;
    }

    set betLevels(betLevels: number[]) {
        this._betLevels = betLevels;
    }

    get minBet() {
        return this._minBet;
    }

    set minBet(minBet: number) {
        this._minBet = minBet;
    }

    get maxBet() {
        return this._maxBet;
    }

    set maxBet(maxBet: number) {
        this._maxBet = maxBet;
    }


    get defaultBetLevel() {
        return this._defaultBetLevel;
    }

    set defaultBetLevel(defaultBetLevel: number) {
        this._defaultBetLevel = defaultBetLevel;
    }
}
