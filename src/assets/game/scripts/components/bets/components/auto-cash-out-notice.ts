import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetStore } from "../bet-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class AutoCashOutNotice extends ObserverComponent {
    @property(Label)
    lblTimer: Label = null;

    @render(BetStore, (store) => store.autoCashOutTimer)
    renderTimer(timer: number) {
        this.lblTimer.string = timer.toString();
    }
    @render(BetStore, (store) => store.autoCashOutTimerVisible)
    updateMultiplierVisible(autoCashOutTimerVisible: boolean) {
        this.node.active = autoCashOutTimerVisible;
    }
}
