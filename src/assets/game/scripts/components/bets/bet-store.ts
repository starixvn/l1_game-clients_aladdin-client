import inversify from "inversify";

import mobx from "mobx";

const { injectable, inject } = inversify;

export enum BetUIState {
    Start = 0,
    Started,
    Bet,
    Mining,
    CashOut,
    Settle,
    End,
}

export interface SettleStatus {
    win?: boolean;
    isBigWin?: boolean;
    reachMaxWin?: boolean;
    bet?: number;
}

@injectable()
export class BetStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    multiplier = 1.0;
    betCount = 0;
    endBet = 0;
    roundId = 0;
    settleStatus: SettleStatus = null;
    uiState = BetUIState.Start;
    isAutoStart = false;

    get cashOutValue() {
        return this.endBet * this.multiplier;
    }
}
