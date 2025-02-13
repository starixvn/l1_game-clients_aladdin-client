import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetStore, SettleStatus } from "./bets/bet-store";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("GameWinNotice")
export class GameWinNotice extends ObserverComponent {
    @property(Label)
    lblWin: Label = null;

    onLoad(): void {
        this.hide();
        super.onLoad();
    }

    @render(BetStore, (store) => store.settleStatus)
    renderSettleStatus(settleStatus: SettleStatus) {
        if (!settleStatus || Object.keys(settleStatus).length === 0) {
            this.hide();
            return;
        }

        this.lblWin.string = `${settleStatus?.bet ?? 0}`;
    }

    hide() {
        this.node.active = false;
    }

    show() {
        this.node.active = true;
    }
}
