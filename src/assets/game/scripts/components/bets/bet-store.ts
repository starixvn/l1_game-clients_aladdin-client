import inversify from "inversify";

import mobx from "mobx";

const { injectable, inject } = inversify;

export enum BetUIState {
    Start = 0,
    Started,
    Bet,
    Mining,
    CashOut,
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

    multiplier = 0;
    isCrash = false;
    betCount = 0;
    endBet = 0;
    roundId = 0;
    // win = false;
    // reachMaxWin = false;
    // bet = 0;

    settleStatus: SettleStatus = {};
    uiState = BetUIState.Start;
}
