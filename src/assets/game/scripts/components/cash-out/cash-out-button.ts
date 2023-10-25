import gc from "@sg/game-client-base";
import { Label, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { CashOutComponent } from "./cash-out-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashMultiplier, Rounds, CrashCashOut, Bet } = gc;

@ccclass
export class CashOutButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOut = false;

    @render(CrashCashOut.CrashCashoutStore, (store) => store.isCashedOutFull)
    updateCashOutFullButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOut = isCashedOut;
    }

    @render(CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOut) {
            let cashOutValue = multiplier * this.bet;
            this.lblCashOut.string = cashOutValue.toFixed(2);
        }
    }

    @render(Bet.BetStore, (store) => store.cashoutBet)
    updateBetValue(lastReceivedBet: any) {
        this.bet = CashOutComponent.getBetValue(lastReceivedBet);
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    updateCashoutButtonStatus(remaining: number) {
        CashOutComponent.showHideNode(this.node, this.bet, remaining);
    }

    @handle(CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, false))
    onClickCashOut() {
        CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(CrashCashOut.CrashCashoutStore, (store) => store.cashoutAmount)
    updateValueCashOut(cashOutValue: number) {
        CashOutComponent.updateValueCashOut(cashOutValue, this.lblCashOut);
    }
}
