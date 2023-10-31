import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetUIHandlers } from "./early-bet-ui-handlers";
import { EarlyBetStore } from "./early-bet-store";
import AutoCashOutStore from "../../../../../extensions/shared-components/assets/game/auto-cash-out/scripts/stores/auto-cash-out-store";
import AutoCashOutHandler from "../../../../../extensions/shared-components/assets/game/auto-cash-out/scripts/handlers/auto-cash-out-handler";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
import { PlayerActionStore } from "../player-actions/player-action-store";
import { AutoPlayHandler } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/handlers/auto-play-handler";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/stores/auto-play-store";
const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet, Rounds } = gc;

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

    private isWaitingBet = false;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 1.01;

    private isAutoPlayMode = false;

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
        this.setStatusButtons(isEarlyBet);
        this.setStatusWaiting(isEarlyBet);
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
        return !this.isWaitingBet;
    }

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    disableEarlyBet() {
        return false;
    }

    @handle(PlayerActionHandlers, (handle, flag: boolean) => handle.handleWaitingBet(flag))
    handleWaitingBet(flag: boolean) {
        return flag;
    }

    @render(Rounds.RoundTimeStore, (store) => ({
        isPlacingBet: store.isPlacingBet,
    }))
    acceptedEarlyBet(data: { isPlacingBet: boolean }) {
        const { isPlacingBet } = data;
        if (isPlacingBet) {
            this.node.active = false;
            if (this.isWaitingBet) {
                this.autoPlaceBet();
            }
        }
    }

    @render(PlayerActionStore, (store) => ({
        rocketFlyWithoutCashout: store.rocketFlyWithoutCashout,
        showPlaceBetNextRound: store.showPlaceBetNextRound,
        showWaitingCancelBet: store.showWaitingCancelBet,
        withoutCashoutAll: store.withoutCashoutAll,
    }))
    showPlaceBetNextRound(data: {
        rocketFlyWithoutCashout: boolean;
        showPlaceBetNextRound: boolean;
        showWaitingCancelBet: boolean;
        withoutCashoutAll: boolean;
    }) {
        const { rocketFlyWithoutCashout, showPlaceBetNextRound, showWaitingCancelBet, withoutCashoutAll } = data;

        if (rocketFlyWithoutCashout || (showPlaceBetNextRound && !this.isWaitingBet)) {
            this.handleRocketFly();
        } else if (showWaitingCancelBet) {
            this.handleWaitingCancelBet();
        } else if (withoutCashoutAll) {
            this.disableEarlyBet();
        }
    }

    handleRocketFly() {
        this.node.active = true;
        this.enableAutoCashout();
        this.setStatusButtons(false);
        this.setStatusWaiting(false);
        this.disableEarlyBet();
        setTimeout(() => {
            this.autoClickEarlyBet();
        }, 1000);
    }

    handleWaitingCancelBet() {
        this.node.active = true;
        this.enableAutoCashout();
        this.setStatusButtons(true);
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    autoPlaceBet() {
        this.setStatusWaiting(false);
        return { autoCashOut: this.isEnableAutoCashOut ? this.valueAutoCashOut : undefined, amount: this.amount };
    }

    setStatusButtons(selected: boolean) {
        this.bgWaiting.node.active = this.sprWaiting.node.active = this.sprCancel.node.active = selected;
        this.sprPlaceBet.node.active = this.bgPlaceBet.node.active = this.sprNextRound.node.active = !selected;
    }

    setStatusWaiting(status: boolean) {
        this.isWaitingBet = status;
        this.handleWaitingBet(status);
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateAutoPlayMode(isAutoPlay: boolean) {
        this.isAutoPlayMode = isAutoPlay;
    }

    autoClickEarlyBet() {
        if (this.isAutoPlayMode) {
            this.onClickEarlyBet();
            this.decreaseAutoPlayRounds();
            this.applyAutoPlay(true);
        }
    }

    @handle(AutoPlayHandler, (handle) => handle.decreaseAutoPlayRounds())
    decreaseAutoPlayRounds() {}

    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    renderPlacingBet(isLocking: boolean) {
        if (isLocking) {
            this.applyAutoPlay(false);
        }
    }

    @handle(PlayerActionHandlers, (handle, flag: boolean) => handle.handleAutoPlay(flag))
    applyAutoPlay(flag: boolean) {
        return flag;
    }
}
