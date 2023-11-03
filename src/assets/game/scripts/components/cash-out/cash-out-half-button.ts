// Compare this snippet from assets/game/scripts/components/cash-out/cash-out-half-button.ts:
import gc from "@sg/game-client-base";
import { Label, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionStore } from "../player-actions/player-action-store";
import { CashOutComponent } from "./cash-out-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Rounds, Bet } = gc;

@ccclass
export class CashOutHalfButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOutHalf = false;

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.isCashedOutHalf)
    updateCashOutHalfButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOutHalf = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOutHalf) {
            let cashOutValue = (multiplier * this.bet) / 2;
            this.lblCashOut.string = cashOutValue.toFixed(2);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashoutBet)
    updateBetValue(cashoutBet: any) {
        this.bet = CashOutComponent.getBetValue(cashoutBet);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    assignCashoutBetValue(lastReceivedBet: any) {
        this.updateCashoutBetValue(lastReceivedBet);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutBetValue: number) =>
        cashOutHandler.updateCashoutBetValue(cashOutBetValue)
    )
    updateCashoutBetValue(lastReceivedBet: any) {
        return CashOutComponent.getBetValue(lastReceivedBet);
    }

    @render(PlayerActionStore, (store) => ({
        isRocketFlyWithCashout: store.rocketFlyWithCashout,
        isShowPlaceBetNextRound: store.showPlaceBetNextRound,
    }))
    updateCashoutButtonStatus(data: { isRocketFlyWithCashout: boolean; isShowPlaceBetNextRound: boolean }) {
        const { isRocketFlyWithCashout, isShowPlaceBetNextRound } = data;
        CashOutComponent.showHideNode(this.node, isRocketFlyWithCashout, isShowPlaceBetNextRound);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, true))
    onClickCashOutHalf() {
        CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashoutHalfAmount)
    updateValueCashOut(cashOutValue: number) {
        CashOutComponent.updateValueCashOut(cashOutValue, this.lblCashOut);
    }
}
