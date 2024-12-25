import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class AutoPlayStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    public roundsList = [10, 30, 50, 80, 100, 200, 500, 1000];
    public isOpenAutoplayPopup = false;
    public selectedRoundOnPopup = this.roundsList[0];
    public roundsAutoplay = 0;
    public _roundConfirmedOnPopup = 0;

    public isAutoplay = false;

    set roundConfirmedOnPopup(rounds: number) {
        this._roundConfirmedOnPopup = rounds;
    }

    get roundConfirmedOnPopup(): number {
        return this._roundConfirmedOnPopup;
    }
}
