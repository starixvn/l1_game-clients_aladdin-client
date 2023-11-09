import { Component, Node, _decorator } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
const { fadeOut, fadeIn, getUiOpacity } = AnimationUtils;
const { ccclass, property } = _decorator;

@ccclass()
export class RocketTail extends Component {
    currentIndex = 0;
    private get tailNodes(): Node[] {
        return this.node.children;
    }

    async swapRocketTail(current: number) {
        this.currentIndex = current;
        const lastIndex = current - 1;
        const duration = 1;
        this.tailNodes[current].active = true;
        fadeIn(this.tailNodes[current], duration);
        await fadeOut(this.tailNodes[lastIndex], duration);
        this.tailNodes[lastIndex].active = false;
    }

    resetRocketTailNodes() {
        this.currentIndex = 0;
        this.tailNodes.forEach((node, index) => {
            const show = index === 0;
            node.active = show;
            getUiOpacity(node).opacity = show ? 255 : 1;
        });
    }
}
