import inversify from "inversify";
import mobx from "mobx";
import { AutoPlayStore } from "../auto-play/auto-play-store";

const { injectable, inject } = inversify;

@injectable()
export class BetAmountStore {
    @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore;
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

    get disabledBetAmount() {
        return this.autoPlayStore.isAutoPlay;
    }
}
