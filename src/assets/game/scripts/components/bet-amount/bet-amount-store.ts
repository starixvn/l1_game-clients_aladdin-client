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

    isOpenBetAmountPopup = false;

    get disabledBetAmount() {
        return this.autoPlayStore.isAutoplay;
    }
}
