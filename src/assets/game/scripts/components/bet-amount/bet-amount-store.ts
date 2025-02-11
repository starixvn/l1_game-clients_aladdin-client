import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { InstantWinConfigStore } from "../../game-configs/instant-win-config-store";
import { BetStore } from "../bets/bet-store";
const { injectable, inject } = inversify;

@injectable()
export class BetAmountStore {
    @inject(gc.Bet.BetStore) private readonly betBaseStore: gc.Bet.BetStore;
    @inject(BetStore) private readonly betStore: BetStore;
    @inject(InstantWinConfigStore) private readonly gameConfig: InstantWinConfigStore;
    constructor() {
        mobx.makeAutoObservable(this);
    }

    isOpenBetAmountPopup = false;

    get betLevels() {
        return this.gameConfig.betLevels;
    }

    get disabledBetAmount() {
        return this.betStore.endBet > 0;
    }

    get isMinBetLevelValue() {
        if (this.betLevels.length > 0 && this.betLevels[0] >= this.betBaseStore.amount) {
            return true;
        }
        return false;
    }

    get isMaxbetLevelValue() {
        const index = this.betLevels.findIndex((amount) => amount === this.betBaseStore.amount);
        if (index >= this.betLevels.length - 1) {
            return true;
        }
        return false;
    }
}
