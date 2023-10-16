import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashMultiplier, Rounds } = gc;

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
        console.log("updateCashoutButtonStatus", remaining);
        this.node.active = remaining > 0 ? false : true;
    }
}
