import gc from "@sg/game-client-base";
import { Label, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashMultiplier, Rounds, CrashCashOut, Bet } = gc;

@ccclass
export class CashOutHalfButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOutHalf = false;

    @render(CrashCashOut.CrashCashoutStore, (store) => store.isCashedOutHalf)
    updateCashOutHalfButton(isCashedOut: boolean) {
        this.sprDisabled.node.active = isCashedOut;
        this.isCashedOutHalf = isCashedOut;
    }

    @render(CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOutHalf) {
            let cashOutValue = (multiplier * this.bet) / 2;
            this.lblCashOut.string = cashOutValue.toFixed(2);
        }
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    updateBetValue(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.bet = lastReceivedBet.value;
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    updateCashoutButtonStatus(remaining: number) {
        if (this.bet > 0 && remaining === 0) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    @handle(CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, true))
    onClickCashOutHalf() {
        return +this.lblCashOut.string;
    }

    @render(CrashCashOut.CrashCashoutStore, (store) => store.cashoutHalfAmount)
    updateValueCashOut(cashOutValue: number) {
        this.lblCashOut.string = cashOutValue.toString();
    }
}
