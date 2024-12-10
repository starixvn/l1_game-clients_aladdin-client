import { Node, UITransform, _decorator, math, tween, v3 } from "cc";
import { random } from "lodash-es";

import { CashOutPlayerAnimation } from "db://shared-components/game-crash/cash-out-animation/cash-out-player-animation";
const { ccclass } = _decorator;

@ccclass
export class CashOutPlayerAnimationCustomize extends CashOutPlayerAnimation {
    getRandomPosition(node: Node) {
        const currentPosition = this.containerSpaceman
            .getComponent(UITransform)
            .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
        return v3(currentPosition.x + random(-200, 100), currentPosition.y);
    }

    handleAnimRandomPosition(node: Node, randomPosition: math.Vec3, animationDuration: number) {
        return tween(node).to(animationDuration, {
            position: randomPosition,
            scale: v3(1, 1, 1).multiplyScalar(0.9),
        });
    }
}
