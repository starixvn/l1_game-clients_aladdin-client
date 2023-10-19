import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetStore } from "./early-bet-store";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet, Bet, Rounds } = gc;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Sprite)
    sprPlaceBet: Sprite = null;

    @property(Sprite)
    sprBetAccepted: Sprite = null;

    private amount: number;

    private isBetAccepted = false;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 1.01;

    private earlyBet = false;

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    enableEarlyBet(enable: boolean) {
        this.earlyBet = enable;
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    changeText(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.setStatusBet(true);
            this.isBetAccepted = true;
        }
    }
    // @render(AutoCashOutStore, (store) => store.isEnable)
    // updateStatusAutoCashOut(isEnable: boolean) {
    //     this.isEnableAutoCashOut = isEnable;
    // }

    // @render(AutoCashOutStore, (store) => store.getMultiplier)
    // updateValueAutoCashOut(value: number) {
    //     this.valueAutoCashOut = value;
    // }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    onClickPlaceBet() {
        console.log("onClickPlaceBet", this.isEnableAutoCashOut, this.valueAutoCashOut, this.isBetAccepted);
        if (!this.isBetAccepted) {
            return { autoCashOut: undefined, amount: this.amount };
        }
    }

    @render(Rounds.RoundTimeStore, (store) => ({ isStartRound: store.isStartRound, isShowResult: store.isShowResult }))
    showPlaceBet(data: { isStartRound: boolean; isShowResult: boolean }) {
        const { isStartRound, isShowResult } = data;
        if (isShowResult) {
            this.updateValueEndBet();
            this.isBetAccepted = false;
            this.node.active = false;
            this.setStatusBet(false);
        } else if (isStartRound && this.earlyBet) {
            this.isBetAccepted = true;
            this.setStatusBet(true);
        }
    }

    setStatusBet(selected: boolean) {
        this.bgWaiting.node.active = selected;
        this.sprBetAccepted.node.active = selected;
        this.sprPlaceBet.node.active = !selected;
        this.bgPlaceBet.node.active = !selected;
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    updateCashoutButtonStatus(remaining: number) {
        const isShow = remaining > 0 && remaining < 10;
        this.node.active = isShow ? true : false;
    }

    @handle(Bet.BetResponseHandlers, (handle, value: number) => handle.handleBetResponse(value))
    updateValueEndBet() {
        console.log("updateValueEndBet");
        return 0;
    }
}
