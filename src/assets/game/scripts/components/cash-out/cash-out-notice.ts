import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;

const { CrashCashOut } = gc;

@ccclass
export class CashOutNotice extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @render(CrashCashOut.CrashCashoutStore, (store) => store.showCashoutNotice)
    showNotice(isShow: boolean) {
        this.node.active = isShow;
    }

    @render(CrashCashOut.CrashCashoutStore, (store) => store.cashoutAmount)
    updateCashoutAmount(amount: number) {
        this.lblCashOut.string = amount.toString();
    }
}
