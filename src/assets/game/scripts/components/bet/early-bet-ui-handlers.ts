import inversify from "inversify";
import gc from "@sg/game-client-base";
import { IHandler } from "observer";
import { EarlyBetStore } from "./early-bet-store";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
const { injectable, inject } = inversify;

@injectable()
export class EarlyBetUIHandlers implements IHandler<boolean> {
    @inject(gc.Notices.NoticeStore)
    protected readonly noticeStore: gc.Notices.NoticeStore;
    @inject(gc.Player.MainPlayerStore)
    protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore;

    @inject(BetInputStore) private readonly betInputStore: BetInputStore;

    handle(enable: boolean) {
        this.earlyBetStore.betAmount = this.betInputStore.betAmount;
        this.validateBalance(enable);
    }

    validateBalance(enable: boolean) {
        if (this.earlyBetStore.betAmount > this.mainPlayerStore.balance && enable) {
            this.noticeStore.addWarning(gc.Translator.commonTranslate("message_insufficient_fund"));
        } else {
            this.earlyBetStore.earlyBet = enable;
        }
    }
}
