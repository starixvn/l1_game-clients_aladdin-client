import { _decorator } from "cc";

import { CashOutPlayerAnimation } from "db://shared-components/game-crash/cash-out-animation/cash-out-player-animation";
const { ccclass } = _decorator;

@ccclass
export class CashOutPlayerAnimationCustomize extends CashOutPlayerAnimation {
    protected getScalar() {
        return 0.9;
    }

    protected getRandomPositionY() {
        return this.currentPosition.y;
    }
}
