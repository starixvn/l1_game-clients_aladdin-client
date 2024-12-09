import { Node, _decorator } from "cc";

import { CashOutPlayerAnimation } from "db://shared-components/game-crash/cash-out-animation/cash-out-player-animation";
const { ccclass } = _decorator;

@ccclass
export class CashOutPlayerAnimationCustomize extends CashOutPlayerAnimation {
    getRandomPosition(node: Node) {
        return null;
    }
}
