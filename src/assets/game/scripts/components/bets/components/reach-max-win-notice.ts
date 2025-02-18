import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetStore } from "../bet-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class ReachMaxWinNotice extends ObserverComponent {
    @render(BetStore, (store) => store.reachMaxWin)
    updateMultiplierVisible(reachMaxWin: boolean) {
        this.node.active = reachMaxWin;
    }
}
