import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetUIHandlers } from "./early-bet-ui-handler";
import { EarlyBetStore } from "./early-bet-store";
import AutoCashOutStore from "../../../../../extensions/shared-components/assets/game/auto-cash-out/scripts/stores/auto-cash-out-store";
import AutoCashOutHandler from "../../../../../extensions/shared-components/assets/game/auto-cash-out/scripts/handlers/auto-cash-out-handler";
const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet, Bet, Rounds } = gc;

@ccclass
export default class EarlyBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Sprite)
    sprPlaceBet: Sprite = null;

    @property(Sprite)
    sprNextRound: Sprite = null;

    @property(Sprite)
    sprWaiting: Sprite = null;

    @property(Sprite)
    sprCancel: Sprite = null;

    private amount: number;

    private enableCancelBet = false;

    private betAmountAccept = -1;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 1.01;

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    updateBetValue(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value >= 0) {
            this.betAmountAccept = lastReceivedBet.value;
        }
    }

    @render(AutoCashOutStore, (store) => store.enable)
    updateStatusAutoCashOut(isEnable: boolean) {
        this.isEnableAutoCashOut = isEnable;
    }

    @render(AutoCashOutStore, (store) => store.multiplier)
    updateValueAutoCashOut(value: number) {
        this.valueAutoCashOut = value;
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    updateStatusButton(isEarlyBet: boolean) {
        this.setStatusEarlyBet(isEarlyBet);
        this.enableCancelBet = isEarlyBet;
    }

    @render(EarlyBetStore, (store) => store.betAmount)
    updateAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @handle(AutoCashOutHandler, (handle, enable: boolean) => handle.handleDisableAuto(!enable))
    enableAutoCashout() {
        return true;
    }

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    onClickEarlyBet() {
        return !this.enableCancelBet;
    }

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    disableEarlyBet() {
        return false;
    }

    @render(Rounds.RoundTimeStore, (store) => ({
        isPlacingBet: store.isPlacingBet,
        isShowResult: store.isShowResult,
        remaining: store.remaining,
    }))
    showHideEarlyBet(data: { isPlacingBet: boolean; isShowResult: boolean; remaining: number }) {
        const { isShowResult, isPlacingBet, remaining } = data;
        if (isPlacingBet) {
            this.node.active = false;
            if (this.enableCancelBet) {
                this.autoPlaceBet();
            }
        } else if ((this.betAmountAccept < 1 && remaining <= 0) || (isShowResult && !this.enableCancelBet)) {
            this.node.active = true;
            this.enableAutoCashout();
            this.setStatusEarlyBet(false);
            this.enableCancelBet = false;
            this.disableEarlyBet();
        } else if (isShowResult && this.enableCancelBet) {
            this.node.active = true;
            this.enableAutoCashout();
            this.setStatusEarlyBet(true);
        }
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    autoPlaceBet() {
        this.enableCancelBet = false;
        return { autoCashOut: this.isEnableAutoCashOut ? this.valueAutoCashOut : undefined, amount: this.amount };
    }

    setStatusEarlyBet(selected: boolean) {
        this.bgWaiting.node.active = this.sprWaiting.node.active = this.sprCancel.node.active = selected;
        this.sprPlaceBet.node.active = this.bgPlaceBet.node.active = this.sprNextRound.node.active = !selected;
    }
}
