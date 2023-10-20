import inversify from "inversify";
import mobx from "mobx";
import gc from "@sg/game-client-base";

const { injectable, inject } = inversify;

@injectable()
export class EarlyBetStore {
    @inject(gc.Notices.NoticeStore)
    protected readonly noticeStore: gc.Notices.NoticeStore;
    @inject(gc.Player.MainPlayerStore)
    protected readonly mainPlayerStore: gc.Player.MainPlayerStore;

    private _betAmount = -1;

    private _earlyBet = false;

    get betAmount(): number {
        return this._betAmount;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }

    get earlyBet(): boolean {
        return this._earlyBet;
    }

    set earlyBet(trigger: boolean) {
        this._earlyBet = trigger;
    }

    showMessageEarlyBet(enable: boolean) {
        if (this._betAmount > this.mainPlayerStore.balance && enable) {
            this.noticeStore.addWarning(gc.Translator.commonTranslate("message_insufficient_fund"));
        } else {
            this.earlyBet = enable;
        }
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
