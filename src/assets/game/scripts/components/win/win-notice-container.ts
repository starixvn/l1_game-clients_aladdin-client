import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import BetWinNotice from "./bet-win-notice";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class WinNoticeContainer extends ObserverComponent {
    @property(Prefab)
    prfWinNotice: Prefab = null;

    showBetWin(betWin: number) {
        const noticeNode = instantiate(this.prfWinNotice);
        const notice = noticeNode.getComponent(BetWinNotice);
        this.node.addChild(noticeNode);
        notice.setBetWin(betWin);
    }
}
