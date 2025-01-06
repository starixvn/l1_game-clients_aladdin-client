import { _decorator, instantiate, math, Prefab, sp, UITransform, v3 } from "cc";
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

    @property(UITransform)
    randomArea: UITransform = null;

    onLoad() {
        this.resetAnimations();
        super.onLoad();
    }

    @render(LeaderBoardStore, (store) => store.winner, { fireImmediately: false })
    showWinners(winner: IWinner) {
        const { betWin, bigWin, avatarId } = winner;

        if (betWin <= 0) {
            this.resetAnimations();
            return;
        }

        this.playWinAnimations(bigWin);
        this.showWinNotice(betWin, avatarId);
    }

    private resetAnimations() {
        this.playAnim(this.spineLeaf, AnimationNameLeaf.idle, true);
        this.playAnim(this.spineTree, AnimationNameTree.idle, true);
    }

    private async playWinAnimations(isBigWin: boolean) {
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

    private showWinNotice(betWin: number, avatarId?: number) {
        const horizonNum = 10;
        const randomIndex = math.randomRangeInt(0, horizonNum);

        const randomX = (randomIndex * this.randomArea.width) / horizonNum;
        const randomY = math.randomRangeInt(0, this.randomArea.height);
        const randomPosition = v3(randomX, randomY);

        const noticeNode = instantiate(this.prfWinNotice);
        noticeNode.position = randomPosition;
        const notice = noticeNode.getComponent(BetWinNotice);
        this.randomArea.node.addChild(noticeNode);
        if (avatarId !== undefined) {
            notice.setAvatar(avatarId).then((success) => {
                if (success) {
                    notice.setBetWin(betWin);
                } else {
                    noticeNode.destroy();
                }
            });
        } else {
            notice.setBetWin(betWin);
        }
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
