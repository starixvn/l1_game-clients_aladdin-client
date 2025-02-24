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
        return this.betBaseStore.amount <= this.gameConfig.minBet;
    }

    get isMaxbetLevelValue() {
        return this.betBaseStore.amount >= this.gameConfig.maxBet;
    }
}
