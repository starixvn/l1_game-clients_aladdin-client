import { _decorator, Component, instantiate, Prefab } from "cc";
import BetWinNotice from "./bet-win-notice";

const { ccclass, property } = _decorator;

@ccclass
export default class WinNoticeContainer extends Component {
    @property(Prefab)
    prfWinNotice: Prefab = null;

    showBetWin(betWin: number) {
        const noticeNode = instantiate(this.prfWinNotice);
        const notice = noticeNode.getComponent(BetWinNotice);
        this.node.addChild(noticeNode);
        notice.setBetWin(betWin);
    }
}
