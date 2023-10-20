import gc from "@sg/game-client-base";
import { Node, Sprite, _decorator } from "cc";
import Observer from "observer";
import { AutoPlayHandler } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/handlers/auto-play-handler";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/stores/auto-play-store";
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

    @property(Node)
    placeBetNotice: Node = null;

    private amount: number;

    private isBetAccepted = false;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 1.01;

    private earlyBet = false;

    private isAutoPlayMode = false;

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    enableEarlyBet(enable: boolean) {
        this.earlyBet = enable;
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    updateStatusPlaceBet(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.setStatusBet(true);
            this.isBetAccepted = true;
            this.placeBetNotice.active = true;
            setTimeout(() => {
                this.placeBetNotice.active = false;
            }, 3000);
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
        return 0;
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateAutoPlayMode(isAutoPlay: boolean) {
        this.isAutoPlayMode = isAutoPlay;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    renderPlacingBet(isPlacingBet: boolean) {
        if (isPlacingBet && this.isAutoPlayMode) {
            this.onClickPlaceBet();
            this.decreaseAutoPlayRounds();
        }
    }

    @handle(AutoPlayHandler, (handle) => handle.decreaseAutoPlayRounds())
    decreaseAutoPlayRounds() {}
}
