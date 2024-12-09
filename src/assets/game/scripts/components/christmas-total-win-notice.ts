import { _decorator, Node, Tween, tween, UIOpacity } from "cc";
import { TotalWinNotice } from "../../../../extensions/shared-components/assets/game-crash/total-win/total-win-notice";
const { ccclass, property } = _decorator;

@ccclass("christmas_total_win_notice")
export class ChristmasTotalWinNotice extends TotalWinNotice {
    @property(Node)
    bgNode: Node = null;

    private bgTween: Tween<any> = null;

    onLoad() {
        super.onLoad();
        this.blinkBgNode();
    }
    blinkBgNode() {
        if (this.bgNode.getComponent(UIOpacity)) {
            this.bgTween = tween(this.bgNode.getComponent(UIOpacity))
                .sequence(tween().to(0.5, { opacity: 50 }), tween().to(0.5, { opacity: 255 }))
                .repeatForever()
                .start();
        }
    }
}
