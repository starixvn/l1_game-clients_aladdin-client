import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashMultiplier, Rounds, CrashCashOut } = gc;

@ccclass
export class CashOutButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property()
    isHalfCashOut = false;

    private bet = 0;

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.bet = betAmount;
    }

    @render(CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        let cashOutValue = multiplier * this.bet;
        if (this.isHalfCashOut) {
            cashOutValue = cashOutValue / 2;
        }
        this.lblCashOut.string = cashOutValue.toFixed(2);
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    updateCashoutButtonStatus(remaining: number) {
        this.node.active = remaining > 0 ? false : true;
    }

    @handle(CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, false))
    onClickCashOut() {
        return +this.lblCashOut.string;
    }

    @handle(CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, true))
    onClickCashOutHalf() {
        return +this.lblCashOut.string;
    }

    @render(CrashCashOut.CrashCashoutStore, (store) => store.cashoutAmount)
    updateValueCashOut(cashOutValue: number) {
        this.lblCashOut.string = cashOutValue.toString();
    }
}
