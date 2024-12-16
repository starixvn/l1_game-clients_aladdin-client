import { _decorator, Node, tween, UIOpacity } from "cc";
import { TotalWinNotice } from "db://shared-components/game-crash/total-win/total-win-notice";
const { ccclass, property } = _decorator;

@ccclass("christmas_total_win_notice")
export class ChristmasTotalWinNotice extends TotalWinNotice {
    @property(Node)
    bgNode: Node = null;

    onLoad() {
        super.onLoad();
        this.blinkBgNode();
    }
    blinkBgNode() {
        const opacityComp = this.bgNode.getComponent(UIOpacity);
        if (opacityComp) {
            tween(opacityComp)
                .sequence(tween().to(0.5, { opacity: 50 }), tween().to(0.5, { opacity: 255 }))
                .repeatForever()
                .start();
        }
    }
}
