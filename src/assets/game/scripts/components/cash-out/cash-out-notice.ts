import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../../extensions/shared-components/assets/shared/utils";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;

const { CrashCashOut } = gc;

@ccclass
export class CashOutNotice extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    onLoad(): void {
        super.onLoad();
    }
    start() {
        this.node.active = false;
    }
    @render(CrashCashOut.CrashCashoutStore, (store) => store.cashOutNotice, { fireImmediately: false })
    updateCashoutAmount(amount: any) {
        console.log("updateCashoutAmount", amount.value);
        this.showNotice(true);
        this.updateCashOutAmount(amount.value);
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            this.node.active = true;
            ComponentUtils.autoDisappear(this.node, false);
        } else {
            this.node.active = false;
        }
    }

    updateCashOutAmount(amount: number) {
        this.lblCashOut.string = amount.toString();
    }
}
