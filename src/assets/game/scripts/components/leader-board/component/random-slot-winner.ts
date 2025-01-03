import { _decorator, instantiate, Node, Prefab, sp } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import BetWinNotice from "../../win/bet-win-notice";
import { IWinner, LeaderBoardStore } from "../leader-board-store";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

enum AnimationNameTree {
    bigWin = "Big win",
    normalWin = "Normal win",
    idle = "idle",
}

enum AnimationNameLeaf {
    win = "Leaf-fall-win",
    idle = "leaf-fall-idle",
}

@ccclass("RandomSlotWinner")
export class RandomSlotWinner extends ObserverComponent {
    @property(sp.Skeleton)
    spineTree: sp.Skeleton = null;

    @property(sp.Skeleton)
    spineLeaf: sp.Skeleton = null;

    @property(Prefab)
    prfWinNotice: Prefab = null;

    slots: Node[] = [];
    onLoad() {
        super.onLoad();
        this.slots = this.node?.children;
        this.playAnim(this.spineLeaf, AnimationNameLeaf.idle, true);
        this.playAnim(this.spineTree, AnimationNameTree.idle, true);
    }

    @render(LeaderBoardStore, (store) => store.winner, { fireImmediately: false })
    async showWinners(winner: IWinner) {
        const { betWin, bigWin } = winner;

        if (betWin <= 0) {
            await this.resetAnimations();
            return;
        }

        await Promise.all([this.playWinAnimations(bigWin), this.showWinNotice(betWin)]);
    }

    private async resetAnimations(): Promise<void> {
        await Promise.all([
            this.playAnim(this.spineLeaf, AnimationNameLeaf.idle, true),
            this.playAnim(this.spineTree, AnimationNameTree.idle, true),
        ]);
    }

    private async playWinAnimations(isBigWin: boolean): Promise<void> {
        if (!AnimationUtils.isAnimationPlaying(this.spineLeaf, AnimationNameLeaf.win)) {
            await this.playAnim(this.spineLeaf, AnimationNameLeaf.win, false);
        }

        const treeAnimation = isBigWin ? AnimationNameTree.bigWin : AnimationNameTree.normalWin;
        const isTreeAnimPlaying =
            AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.bigWin) ||
            AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.normalWin);

        if (!isTreeAnimPlaying) {
            await this.playAnim(this.spineTree, treeAnimation, false);
        }
    }

    private async showWinNotice(betWin: number): Promise<void> {
        const randomIndex = Math.floor(Math.random() * this.slots.length);
        const randomSlot = this.slots[randomIndex];

        const noticeNode = instantiate(this.prfWinNotice);
        const notice = noticeNode.getComponent(BetWinNotice);
        randomSlot.addChild(noticeNode);
        notice.setBetWin(betWin);
    }

    async playAnim(spine: sp.Skeleton, animName: string, isLoop: boolean) {
        await AnimationUtils.playSpine(spine, animName, isLoop);
    }

    getDurationAnim(spine: sp.Skeleton, animationName: string) {
        const animation = spine.findAnimation(animationName);
        if (!animation) {
            return 0;
        }

        return animation?.duration ?? 0;
    }
}
