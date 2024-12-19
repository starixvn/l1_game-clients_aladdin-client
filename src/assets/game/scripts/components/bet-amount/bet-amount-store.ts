import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class BetAmountStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _betAmount = -1;
    isOpenBetAmountPopup = false;

    get betAmount(): number {
        return this._betAmount;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }
}
