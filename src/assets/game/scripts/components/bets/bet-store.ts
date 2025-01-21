import inversify from "inversify";

import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class BetStore{
    constructor() {
        mobx.makeAutoObservable(this);
    }

    multiplier = 0;
    isStart = false;
    betCount = 0;
    endBet = 0;
    win = false;
    reachMaxWin = false;
    bet = 0;
}

