import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetUIHandlers } from "./early-bet-ui-handler";
import { EarlyBetStore } from "./early-bet-store";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet, Bet, Rounds, CrashCashOut } = gc;

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

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    updateBetValue(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.betAmountAccept = lastReceivedBet.value;
        }
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

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    onClickEarlyBet() {
        return !this.enableCancelBet;
    }

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    disableEarlyBet() {
        return false;
    }

    @render(Rounds.RoundTimeStore, (store) => ({
        isStartRound: store.isStartRound,
        isShowResult: store.isShowResult,
        remaining: store.remaining,
    }))
    showHideEarlyBet(data: { isStartRound: boolean; isShowResult: boolean; remaining: number }) {
        const { isShowResult, isStartRound, remaining } = data;
        if (isStartRound) {
            this.node.active = false;
            if (this.enableCancelBet) {
                this.autoPlaceBet();
            }
        } else if ((this.betAmountAccept < 1 && remaining <= 0) || (isShowResult && !this.enableCancelBet)) {
            this.node.active = true;
            this.setStatusEarlyBet(false);
            this.enableCancelBet = false;
            this.disableEarlyBet();
        } else if (isShowResult && this.enableCancelBet) {
            this.node.active = true;
            this.setStatusEarlyBet(true);
        }
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    autoPlaceBet() {
        console.log("autoPlaceBet", this.amount);
        this.enableCancelBet = false;
        return { autoCashOut: undefined, amount: this.amount };
    }
    setStatusEarlyBet(selected: boolean) {
        this.bgWaiting.node.active = this.sprWaiting.node.active = this.sprCancel.node.active = selected;
        this.sprPlaceBet.node.active = this.bgPlaceBet.node.active = this.sprNextRound.node.active = !selected;
    }
}
