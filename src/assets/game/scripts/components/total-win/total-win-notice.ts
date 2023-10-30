import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render } = Observer;

const { Settlements, Rounds } = gc;

@ccclass
export class TotalWinNotice extends ObserverComponent {
    @property(Label)
    lblWinAmount: Label = null;

    onLoad(): void {
        super.onLoad();
        this.node.active = false;
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus)
    updateCashoutAmount(settlementStatus: any) {
        if (settlementStatus?.win) {
            this.showNotice(true);
            this.updateTotalWinAmount(settlementStatus?.bet);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    hideNotice() {
        this.showNotice(false);
    }

    showNotice(isShow: boolean) {
        this.node.active = isShow;
    }

    updateTotalWinAmount(amount: number) {
        this.lblWinAmount.string = amount.toString();
    }
}
