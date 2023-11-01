import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { EarlyBetStore } from "../bet/early-bet-store";

const { injectable, inject } = inversify;

@injectable()
export class PlayerActionStore {
    @inject(gc.CrashCashOut.CrashCashoutStore)
    protected readonly crashCashoutStore: gc.CrashCashOut.CrashCashoutStore;

    @inject(AutoPlayStore)
    protected readonly autoPlayStore: AutoPlayStore;

    @inject(EarlyBetStore)
    protected readonly earlyBetStore: EarlyBetStore;

    @inject(gc.Bet.BetStore)
    protected readonly betStore: gc.Bet.BetStore;

    @inject(gc.Rounds.RoundTimeStore)
    protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    private _endShowCashoutNotice = false;

    private _showTotalWin = false;

    private _cashoutBet: number;

    private _waitingBet = false;

    private _autoPlay = false;

    get autoPlay(): boolean {
        return this._autoPlay;
    }

    set autoPlay(flag: boolean) {
        this._autoPlay = flag;
    }

    get cashoutAll(): boolean {
        return this.crashCashoutStore.isCashedOutFull;
    }

    get endShowCashoutNotice(): boolean {
        return this._endShowCashoutNotice;
    }

    set endShowCashoutNotice(flag: boolean) {
        this._endShowCashoutNotice = flag;
    }

    get isAutoPlay(): boolean {
        return this.autoPlayStore.isAutoPlay;
    }

    get showPlaceBetNextRound(): boolean {
        return this.endShowCashoutNotice && this.cashoutAll;
    }

    get showWaitingCancelBet(): boolean {
        return this.waitingBet && this.roundTimeStore.isShowResult;
    }

    get betAccepted(): number {
        if (this.betStore.lastReceivedBet && this.betStore.lastReceivedBet.value >= 0) {
            return this.betStore.lastReceivedBet.value;
        }
        return 0;
    }

    get cashoutBet(): number {
        if (this._cashoutBet && this._cashoutBet > 0) {
            return this._cashoutBet;
        }
        return 0;
    }

    set cashoutBet(value: number) {
        this._cashoutBet = value;
    }
    get rocketFlyWithoutCashout(): boolean {
        return this.betAccepted < 1 && this.roundTimeStore.remaining <= 0;
    }

    get rocketFlyWithCashout(): boolean {
        return (this.cashoutBet > 0 && this.roundTimeStore.remaining <= 0) || (this.roundTimeStore.isShowResult && this.withoutCashoutAll);
    }

    get withoutCashoutAll() {
        return !this.cashoutAll && this.cashoutBet > 0;
    }
    get waitingBet(): boolean {
        return this._waitingBet;
    }

    set waitingBet(enable: boolean) {
        this._waitingBet = enable;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
