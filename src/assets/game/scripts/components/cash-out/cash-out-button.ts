import gc from "@sg/game-client-base";
import { Label, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

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
        this.sprDisabled.node.active = isCashedOut;

        this.isCashedOut = isCashedOut;
    }

    @render(CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOut) {
            let cashOutValue = multiplier * this.bet;

            this.lblCashOut.string = cashOutValue.toFixed(2);
        }
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    updateBetValue(lastReceivedBet: any) {
        if (lastReceivedBet) {
            const lastestBet = lastReceivedBet.value;
            if (lastestBet >= 0) {
                this.bet = lastestBet;
            }
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    updateCashoutButtonStatus(remaining: number) {
        console.log("updateCashoutButtonStatus", this.bet);
        if (this.bet > 0 && remaining === 0) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    @handle(CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) => cashOutHandler.handle(cashOutValue, false))
    onClickCashOut() {
        return +this.lblCashOut.string;
    }

    @render(CrashCashOut.CrashCashoutStore, (store) => store.cashoutAmount)
    updateValueCashOut(cashOutValue: number) {
        this.lblCashOut.string = cashOutValue.toString();
    }
}
