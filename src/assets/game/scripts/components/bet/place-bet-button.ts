import gc from "@sg/game-client-base";
import { Node, Sprite, _decorator } from "cc";
import Observer from "observer";
import { AutoPlayHandler } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/handlers/auto-play-handler";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/stores/auto-play-store";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetStore } from "./early-bet-store";
import AutoCashOutStore from "../../../../../extensions/shared-components/assets/game/auto-cash-out/scripts/stores/auto-cash-out-store";
import AutoCashOutHandler from "../../../../../extensions/shared-components/assets/game/auto-cash-out/scripts/handlers/auto-cash-out-handler";
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
    bgDisable: Sprite = null;

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
            this.adjustMultiplier(false);
            setTimeout(() => {
                this.placeBetNotice.active = false;
            }, 3000);
        }
    }

    @handle(AutoCashOutHandler, (handle, enable: boolean) => handle.handleEnable(enable))
    adjustMultiplier(enable: boolean) {
        return enable;
    }

    @render(AutoCashOutStore, (store) => store.enable)
    updateStatusAutoCashOut(isEnable: boolean) {
        this.isEnableAutoCashOut = isEnable;
    }

    @render(AutoCashOutStore, (store) => store.multiplier)
    updateValueAutoCashOut(value: number) {
        this.valueAutoCashOut = value;
    }
    onClickPlaceBet() {
        if (!this.isBetAccepted) {
            this.sendBetRequest();
        }
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    sendBetRequest() {
        return { autoCashOut: this.isEnableAutoCashOut ? this.valueAutoCashOut : undefined, amount: this.amount };
    }

    @render(Rounds.RoundTimeStore, (store) => ({
        isPlacingBet: store.isPlacingBet,
        remaining: store.remaining,
        isLockingBet: store.isLocking,
        isShowResult: store.isShowResult,
    }))
    showPlaceBet(data: { isPlacingBet: boolean; remaining: number; isLockingBet: boolean; isShowResult: boolean }) {
        const { isPlacingBet, remaining, isLockingBet, isShowResult } = data;
        if (remaining <= 0) {
            this.isBetAccepted = false;
            this.node.active = false;
            this.setStatusBet(false);
            this.adjustMultiplier(true);
        }

        if (isShowResult) {
            this.updateValueEndBet();
        }

        if (isPlacingBet) {
            this.node.active = true;
            if (this.earlyBet || this.isBetAccepted) {
                this.isBetAccepted = true;
                this.setStatusBet(true);
            } else this.setStatusBet(false);
        }

        if (isLockingBet && !this.isBetAccepted) {
            this.lockBet(true);
            this.isBetAccepted = true;
        }
    }

    setStatusBet(selected: boolean) {
        this.bgWaiting.node.active = this.sprBetAccepted.node.active = selected;
        this.sprPlaceBet.node.active = this.bgPlaceBet.node.active = !selected;
        this.lockBet(false);
    }

    lockBet(disable: boolean) {
        this.bgDisable.node.active = disable;
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
