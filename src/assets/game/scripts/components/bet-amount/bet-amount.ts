import { _decorator, Node } from "cc";
import Observer from "observer";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/stores/auto-play-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    showHideDisabledNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateDisabledNode(autoPlay: boolean) {
        console.log("updateDisabledNode");
        this.showHideDisabledNode(autoPlay);
    }
}
