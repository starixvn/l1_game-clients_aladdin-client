import gc from "@sg/game-client-base";
import { Label, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
import { PlayerActionStore } from "../player-actions/player-action-store";
import { CashOutComponent } from "./cash-out-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Rounds, Bet } = gc;

@ccclass
export class CashOutButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOut = false;

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.isCashedOutFull)
    updateCashOutFullButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOut = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOut) {
            let cashOutValue = multiplier * this.bet;
            this.lblCashOut.string = cashOutValue.toFixed(2);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashoutBet)
    updateBetValue(cashoutBet: any) {
        this.bet = CashOutComponent.getBetValue(cashoutBet);
    }

    @render(Bet.BetStore, (store) => store.isReceivedBet)
    updateStatusReceivedBet(isReceivedBet: boolean) {
        this.setCashoutBetValue(isReceivedBet);
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

    @handle(PlayerActionHandlers, (handle, isReceived: boolean) => handle.handleReceivedBet(isReceived))
    setCashoutBetValue(isReceived: boolean) {
        return isReceived;
    }

    @render(PlayerActionStore, (store) => ({
        isRocketFlyWithCashout: store.rocketFlyWithCashout,
        isShowPlaceBetNextRound: store.showPlaceBetNextRound,
    }))
    updateCashoutButtonStatus(data: { isRocketFlyWithCashout: boolean; isShowPlaceBetNextRound: boolean }) {
        const { isRocketFlyWithCashout, isShowPlaceBetNextRound } = data;
        CashOutComponent.showHideNode(this.node, isRocketFlyWithCashout, isShowPlaceBetNextRound);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, false))
    onClickCashOut() {
        CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashoutAmount)
    updateValueCashOut(cashOutValue: number) {
        CashOutComponent.updateValueCashOut(cashOutValue, this.lblCashOut);
    }
}
